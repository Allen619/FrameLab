---
title: 自定义中间件
description: 学习如何继承 AgentMiddleware 基类编写自定义中间件，包括日志、限流、工具过滤等实用模式
---

# 自定义中间件

当 [内置中间件](/ai/langchain/guide/prebuilt-middleware) 无法满足需求时，LangChain 提供了 `AgentMiddleware` 基类，允许你编写完全自定义的 Middleware。本章从基类 API 到实战模式，系统讲解自定义 Middleware 的开发方法。

### 先修知识

- 已阅读 [中间件概览](/ai/langchain/guide/middleware-overview) — 理解洋葱模型和执行机制
- 了解 [Agent 实战指南](/ai/langchain/guide/agents) 中的 `create_agent` 用法

## AgentMiddleware 基类

所有自定义 Middleware 都继承自 `AgentMiddleware`：

```python
from langchain.agents.middleware import AgentMiddleware, ModelRequest
from langchain.agents.middleware.types import ModelResponse
from typing import Callable

class MyMiddleware(AgentMiddleware):
    def wrap_model_call(
        self,
        request: ModelRequest,
        handler: Callable[[ModelRequest], ModelResponse]
    ) -> ModelResponse:
        # 在这里实现自定义逻辑
        return handler(request)
```

核心要点：

- **`wrap_model_call`** 是唯一需要实现的方法，它拦截每一次模型调用
- **`request`** 包含本次调用的所有信息（模型、工具、消息、运行时上下文）
- **`handler`** 是"穿透到下一层"的回调——调用它意味着将请求传递给下一个 Middleware 或最终的 Agent/LLM
- 返回值是 `ModelResponse`，你可以直接返回 `handler(request)` 的结果，也可以修改后再返回

::: tip 前端类比
`wrap_model_call` 的签名与 Redux 中间件的 `(store) => (next) => (action) => {}` 模式非常相似。`handler` 等价于 `next`，`request` 等价于 `action`。如果你不调用 `handler(request)`，请求就不会到达 Agent——就像 Redux 中不调用 `next(action)` 会阻断 action 传播一样。
:::

## ModelRequest 与 ModelResponse

### ModelRequest

`ModelRequest` 封装了一次模型调用的完整输入：

```python
@dataclass
class ModelRequest:
    model: BaseChatModel       # 当前使用的模型实例
    tools: list[Tool]          # 当前可用的工具列表
    messages: list[BaseMessage] # 对话消息历史
    runtime: RuntimeContext     # 运行时上下文（见下文）
```

你可以在 `wrap_model_call` 中修改 `request` 的任意字段：

- 替换 `model` — 根据条件切换模型
- 过滤 `tools` — 根据上下文隐藏或暴露工具
- 修改 `messages` — 注入系统消息、修改对话历史
- 读取 `runtime` — 获取用户上下文信息

### ModelResponse

`ModelResponse` 封装了模型调用的输出：

```python
@dataclass
class ModelResponse:
    content: str                    # 模型生成的文本内容
    tool_calls: list[ToolCall]      # 模型请求调用的工具列表
    usage: TokenUsage               # token 使用统计
    metadata: dict                  # 其他元数据
```

你可以在 `handler` 返回后修改 `ModelResponse` 的内容再返回给上层。

## 访问运行时上下文

通过 `request.runtime.context` 可以访问在 `create_agent` 中定义的上下文数据：

```python
from dataclasses import dataclass

@dataclass
class UserContext:
    user_id: str = ""
    role: str = "viewer"
    department: str = "general"

# 创建 Agent 时指定 context_schema
agent = create_agent(
    model="claude-sonnet-4-5-20250929",
    tools=[...],
    middleware=[MyMiddleware()],
    context_schema=UserContext
)

# 调用时传入上下文
result = agent.invoke(
    "查询销售报表",
    context=UserContext(user_id="u123", role="admin", department="sales")
)
```

在 Middleware 中读取：

```python
class MyMiddleware(AgentMiddleware):
    def wrap_model_call(self, request, handler):
        ctx = request.runtime.context
        print(f"用户: {ctx.user_id}, 角色: {ctx.role}")
        return handler(request)
```

## 实战示例

### 示例 1：日志中间件

记录每次模型调用的请求和响应信息，用于调试和审计：

```python
import time
import logging
from langchain.agents.middleware import AgentMiddleware, ModelRequest
from langchain.agents.middleware.types import ModelResponse
from typing import Callable

logger = logging.getLogger("agent.middleware")

class LoggingMiddleware(AgentMiddleware):
    def __init__(self, log_level: str = "INFO"):
        self.log_level = getattr(logging, log_level.upper(), logging.INFO)

    def wrap_model_call(
        self,
        request: ModelRequest,
        handler: Callable[[ModelRequest], ModelResponse]
    ) -> ModelResponse:
        # 前处理：记录请求信息
        start_time = time.perf_counter()
        tool_names = [t.name for t in request.tools]
        msg_count = len(request.messages)

        logger.log(
            self.log_level,
            f"[请求] 模型={request.model.__class__.__name__}, "
            f"工具={tool_names}, 消息数={msg_count}"
        )

        # 穿透到下一层
        response = handler(request)

        # 后处理：记录响应信息
        elapsed = time.perf_counter() - start_time
        logger.log(
            self.log_level,
            f"[响应] 耗时={elapsed:.3f}s, "
            f"工具调用={len(response.tool_calls)}, "
            f"token={response.usage.total_tokens}"
        )

        return response
```

使用方式：

```python
agent = create_agent(
    model="claude-sonnet-4-5-20250929",
    tools=[search, calculator],
    middleware=[
        LoggingMiddleware(log_level="DEBUG"),  # 放在最外层
        # ... 其他 Middleware
    ]
)
```

### 示例 2：速率限制中间件

防止 Agent 在短时间内过度调用模型，保护 API 配额：

```python
import time
from collections import deque
from langchain.agents.middleware import AgentMiddleware, ModelRequest
from langchain.agents.middleware.types import ModelResponse
from typing import Callable

class RateLimitMiddleware(AgentMiddleware):
    """滑动窗口速率限制器"""

    def __init__(self, max_calls: int = 10, window_seconds: float = 60.0):
        self.max_calls = max_calls
        self.window_seconds = window_seconds
        self.call_timestamps: deque[float] = deque()

    def _clean_expired(self):
        """移除窗口外的时间戳"""
        now = time.monotonic()
        while self.call_timestamps and (now - self.call_timestamps[0]) > self.window_seconds:
            self.call_timestamps.popleft()

    def wrap_model_call(
        self,
        request: ModelRequest,
        handler: Callable[[ModelRequest], ModelResponse]
    ) -> ModelResponse:
        self._clean_expired()

        if len(self.call_timestamps) >= self.max_calls:
            # 计算需要等待的时间
            oldest = self.call_timestamps[0]
            wait_time = self.window_seconds - (time.monotonic() - oldest)
            if wait_time > 0:
                time.sleep(wait_time)
                self._clean_expired()

        # 记录本次调用时间
        self.call_timestamps.append(time.monotonic())

        return handler(request)
```

使用方式：

```python
agent = create_agent(
    model="claude-sonnet-4-5-20250929",
    tools=[search],
    middleware=[
        RateLimitMiddleware(max_calls=20, window_seconds=60),  # 每分钟最多 20 次调用
    ]
)
```

### 示例 3：基于角色的工具过滤中间件

根据用户角色动态过滤可用工具，实现权限控制：

```python
from dataclasses import dataclass, field
from langchain.agents.middleware import AgentMiddleware, ModelRequest
from langchain.agents.middleware.types import ModelResponse
from typing import Callable

@dataclass
class UserContext:
    user_id: str = ""
    role: str = "viewer"

class RoleBasedToolFilterMiddleware(AgentMiddleware):
    """根据用户角色过滤可用工具"""

    def __init__(self, role_permissions: dict[str, list[str]]):
        """
        Args:
            role_permissions: 角色到允许工具名的映射
                例: {"viewer": ["search"], "editor": ["search", "update"], "admin": ["*"]}
        """
        self.role_permissions = role_permissions

    def wrap_model_call(
        self,
        request: ModelRequest,
        handler: Callable[[ModelRequest], ModelResponse]
    ) -> ModelResponse:
        ctx = request.runtime.context
        role = getattr(ctx, "role", "viewer")

        allowed_tools = self.role_permissions.get(role, [])

        if "*" not in allowed_tools:
            # 过滤工具列表，只保留允许的工具
            original_count = len(request.tools)
            request.tools = [
                tool for tool in request.tools
                if tool.name in allowed_tools
            ]
            filtered_count = original_count - len(request.tools)
            if filtered_count > 0:
                print(f"[权限] 角色 '{role}' 过滤了 {filtered_count} 个工具")

        return handler(request)
```

使用方式：

```python
agent = create_agent(
    model="claude-sonnet-4-5-20250929",
    tools=[search, update_record, delete_record, admin_panel],
    middleware=[
        RoleBasedToolFilterMiddleware(
            role_permissions={
                "viewer": ["search"],
                "editor": ["search", "update_record"],
                "admin": ["*"],  # 管理员可使用所有工具
            }
        ),
    ],
    context_schema=UserContext
)

# viewer 只能使用 search 工具
result = agent.invoke(
    "帮我删除这条记录",
    context=UserContext(user_id="u456", role="viewer")
)
# Agent 不会看到 delete_record 工具，会回复无法执行该操作
```

## 测试中间件

Middleware 的测试可以独立于 Agent 进行。核心思路是模拟 `request` 和 `handler`：

```python
import pytest
from unittest.mock import MagicMock
from langchain.agents.middleware import ModelRequest
from langchain.agents.middleware.types import ModelResponse

def test_rate_limit_middleware():
    """测试速率限制中间件在超限时会等待"""
    middleware = RateLimitMiddleware(max_calls=2, window_seconds=1.0)

    # 模拟 request 和 handler
    mock_request = MagicMock(spec=ModelRequest)
    mock_response = MagicMock(spec=ModelResponse)
    mock_handler = MagicMock(return_value=mock_response)

    # 前两次调用应该立即执行
    middleware.wrap_model_call(mock_request, mock_handler)
    middleware.wrap_model_call(mock_request, mock_handler)
    assert mock_handler.call_count == 2

    # 第三次调用应该等待（或阻塞直到窗口过期）
    import time
    start = time.monotonic()
    middleware.wrap_model_call(mock_request, mock_handler)
    elapsed = time.monotonic() - start
    assert elapsed >= 0.5  # 至少等待了一段时间
    assert mock_handler.call_count == 3


def test_role_filter_removes_unauthorized_tools():
    """测试角色过滤中间件正确移除未授权工具"""
    middleware = RoleBasedToolFilterMiddleware(
        role_permissions={"viewer": ["search"]}
    )

    # 构造模拟对象
    search_tool = MagicMock()
    search_tool.name = "search"
    delete_tool = MagicMock()
    delete_tool.name = "delete_record"

    mock_request = MagicMock(spec=ModelRequest)
    mock_request.tools = [search_tool, delete_tool]
    mock_request.runtime.context.role = "viewer"

    mock_response = MagicMock(spec=ModelResponse)
    mock_handler = MagicMock(return_value=mock_response)

    result = middleware.wrap_model_call(mock_request, mock_handler)

    # 验证只保留了 search 工具
    call_args = mock_handler.call_args[0][0]
    assert len(call_args.tools) == 1
    assert call_args.tools[0].name == "search"


def test_logging_middleware_records_timing():
    """测试日志中间件记录了耗时信息"""
    middleware = LoggingMiddleware(log_level="DEBUG")

    mock_request = MagicMock(spec=ModelRequest)
    mock_request.tools = []
    mock_request.messages = []
    mock_request.model.__class__.__name__ = "ChatOpenAI"

    mock_response = MagicMock(spec=ModelResponse)
    mock_response.tool_calls = []
    mock_response.usage.total_tokens = 100
    mock_handler = MagicMock(return_value=mock_response)

    with pytest.capture_log("agent.middleware") as logs:
        middleware.wrap_model_call(mock_request, mock_handler)

    # 验证日志包含请求和响应记录
    assert any("请求" in log for log in logs)
    assert any("响应" in log for log in logs)
```

测试要点：

1. **隔离测试**：使用 `MagicMock` 模拟 `ModelRequest`、`ModelResponse` 和 `handler`，无需启动真实模型
2. **验证 handler 调用**：确认 Middleware 正确调用了 `handler`（除非是拦截场景）
3. **验证 request 修改**：检查传递给 `handler` 的 `request` 是否被正确修改
4. **边界条件**：测试空工具列表、空消息、异常情况等

## 中间件组合模式

### 模式 1：条件执行

根据条件决定是否执行 Middleware 逻辑：

```python
class ConditionalMiddleware(AgentMiddleware):
    def __init__(self, condition_fn, inner_middleware):
        self.condition_fn = condition_fn
        self.inner_middleware = inner_middleware

    def wrap_model_call(self, request, handler):
        if self.condition_fn(request):
            return self.inner_middleware.wrap_model_call(request, handler)
        return handler(request)

# 只在生产环境启用 PII 检测
agent = create_agent(
    model="claude-sonnet-4-5-20250929",
    tools=[search],
    middleware=[
        ConditionalMiddleware(
            condition_fn=lambda req: os.environ.get("ENV") == "production",
            inner_middleware=PIIMiddleware("email", strategy="redact")
        ),
    ]
)
```

### 模式 2：错误恢复

在 Middleware 中捕获异常并提供降级响应：

```python
class ErrorRecoveryMiddleware(AgentMiddleware):
    def __init__(self, max_retries: int = 2, fallback_message: str = "服务暂时不可用"):
        self.max_retries = max_retries
        self.fallback_message = fallback_message

    def wrap_model_call(self, request, handler):
        last_error = None
        for attempt in range(self.max_retries + 1):
            try:
                return handler(request)
            except Exception as e:
                last_error = e
                if attempt < self.max_retries:
                    print(f"[重试] 第 {attempt + 1} 次失败: {e}")
                    time.sleep(2 ** attempt)  # 指数退避

        # 所有重试失败，返回降级响应
        print(f"[降级] 所有重试失败: {last_error}")
        return ModelResponse(
            content=self.fallback_message,
            tool_calls=[],
            usage=TokenUsage(total_tokens=0),
            metadata={"error": str(last_error), "degraded": True}
        )
```

### 模式 3：Middleware 工厂

通过工厂函数创建参数化的 Middleware 实例：

```python
def create_audit_middleware(audit_service_url: str, app_name: str):
    """创建审计日志中间件"""

    class AuditMiddleware(AgentMiddleware):
        def wrap_model_call(self, request, handler):
            ctx = request.runtime.context
            # 记录审计事件
            audit_event = {
                "app": app_name,
                "user": getattr(ctx, "user_id", "anonymous"),
                "tools": [t.name for t in request.tools],
                "timestamp": time.time(),
            }
            # 异步发送审计日志（不阻塞主流程）
            _send_audit_async(audit_service_url, audit_event)

            response = handler(request)

            # 记录响应审计
            audit_event["tool_calls"] = [tc.name for tc in response.tool_calls]
            audit_event["tokens"] = response.usage.total_tokens
            _send_audit_async(audit_service_url, audit_event)

            return response

    return AuditMiddleware()

# 使用工厂函数
agent = create_agent(
    model="claude-sonnet-4-5-20250929",
    tools=[search],
    middleware=[
        create_audit_middleware(
            audit_service_url="https://audit.internal.com/events",
            app_name="customer-support-agent"
        ),
    ]
)
```

## 常见陷阱

1. **忘记调用 handler**：如果 `wrap_model_call` 中没有调用 `handler(request)`，请求将不会到达 Agent/LLM，也不会到达后续的 Middleware。除非你故意拦截请求，否则务必调用 `handler`。

2. **修改了共享引用**：`request.tools` 和 `request.messages` 是列表引用。如果你需要修改它们但不想影响其他 Middleware，应该创建副本：

   ```python
   # 错误：直接修改原始列表
   request.tools.remove(some_tool)

   # 正确：创建新列表
   request.tools = [t for t in request.tools if t != some_tool]
   ```

3. **Middleware 中的状态管理**：Middleware 实例在 Agent 生命周期内是共享的。如果存储了可变状态（如计数器、缓存），需要考虑线程安全问题。

4. **异常处理**：如果 Middleware 抛出未捕获的异常，整个调用链将中断。建议在 Middleware 中添加 try-except 并提供合理的降级行为。

## 下一步

- [内置中间件](/ai/langchain/guide/prebuilt-middleware) — 了解 PIIMiddleware、SummarizationMiddleware、HumanInTheLoopMiddleware 的详细用法
- [中间件概览](/ai/langchain/guide/middleware-overview) — 回顾 Middleware 的执行机制和排序策略
- [Agent 实战指南](/ai/langchain/guide/agents) — 了解 `create_agent` 的完整参数和上下文配置

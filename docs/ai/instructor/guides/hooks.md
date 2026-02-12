# Hooks 与调试

在生产环境中，监控 LLM 的调用行为（包括 Token 使用、原始 Prompt、Response 详情）以及异常情况是非常重要的。Instructor 提供了一套强大的 **Hooks** 系统，允许你在请求生命周期的关键节点插入自定义逻辑。

## 为什么需要 Hooks？

1.  **调试**：查看发送给 LLM 的**原始 JSON Schema** 和 **实际生成的 JSON 字符串**（不仅仅是转换后的 Pydantic 对象）。
2.  **监控**：记录 Token 使用量、延迟、错误率。
3.  **审计**：记录每一次 LLM 调用的完整上下文。

## 核心 Hook 事件

Instructor 定义了以下几个关键 Hook 点：

| Hook Name                 | Description                                         |
| :------------------------ | :-------------------------------------------------- |
| `completion:kwargs`       | 在调用 LLM 之前触发，可访问所有参数 (prompt, tools) |
| `completion:response`     | 在收到 LLM 响应后触发，可访问原始 Response 对象     |
| `completion:error`        | 当 LLM 调用发生异常时触发                           |
| `parse:error`             | 当 JSON 解析或 Pydantic 验证失败时触发              |
| `completion:last_attempt` | 在最后一次重试失败后触发                            |

## 实战：构建日志与监控系统

### 基础日志记录

```python
import instructor
from openai import OpenAI

client = instructor.from_openai(OpenAI())

# 1. 定义 Hook 处理函数
def log_request(**kwargs):
    print(f"[DEBUG] Model: {kwargs.get('model')}")
    print(f"[DEBUG] Messages: {kwargs.get('messages')}")

def log_response(response):
    if hasattr(response, "usage"):
        print(f"[METRICS] Tokens: {response.usage.total_tokens}")

def log_error(error):
    print(f"[ERROR] Type: {type(error).__name__} - {error}")

# 2. 注册 Hooks
client.on("completion:kwargs", log_request)
client.on("completion:response", log_response)
client.on("completion:error", log_error)
client.on("parse:error", log_error)

# 3. 发起请求
from pydantic import BaseModel

class User(BaseModel):
    name: str
    age: int

try:
    client.chat.completions.create(
        response_model=User,
        messages=[{"role": "user", "content": "Extract: Jason is 30"}],
        model="gpt-3.5-turbo"
    )
except Exception:
    pass
```

### 生产级错误监控 (Sentry/Datadog)

你可以将 Hook 与 Sentry 等监控工具集成，自动捕获 LLM 调用异常。

```python
import sentry_sdk

def report_to_sentry(error):
    sentry_sdk.capture_exception(error)

client.on("completion:error", report_to_sentry)
client.on("parse:error", report_to_sentry)
```

## 高级用法：访问元数据

Instructor 会在 `completion:kwargs` 中注入额外的元数据，你可以通过 `_instructor_meta` 访问。

```python
def inspect_meta(**kwargs):
    meta = kwargs.get("_instructor_meta")
    if meta:
        print(f"Validation mode: {meta.get('mode')}")

client.on("completion:kwargs", inspect_meta)
```

::: tip 调试建议
在开发阶段，建议始终开启 `completion:kwargs` 和 `completion:response` 的日志，这能帮你快速定位 Prompt 问题或 JSON 格式错误。
:::

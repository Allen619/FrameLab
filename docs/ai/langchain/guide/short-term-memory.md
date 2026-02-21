---
title: 短期记忆
description: 掌握 LangChain 1.0 的短期记忆机制——通过 Checkpointer 实现线程级对话历史持久化与上下文窗口管理
---

# 短期记忆

## 概述

短期记忆（Short-term Memory）是 LangChain Agent 在**单个对话线程内**维护上下文的能力。当用户与 Agent 进行多轮对话时，Agent 需要"记住"之前说过的话，才能给出连贯的回复。LangChain 1.0 通过底层 LangGraph 的 **Checkpointer** 机制，以 `thread_id` 为维度自动管理对话历史——每次调用时，Agent 会加载该线程的完整消息列表，模型据此生成回复，然后再将新消息写回存储。

::: tip 前端类比
短期记忆类似 React 的 `useState` 或浏览器的 `sessionStorage`——数据仅在当前"会话"内有效，切换到新的 `thread_id` 就是一个全新的对话上下文，就像打开了一个新的浏览器标签页。而下文将提到的长期记忆则更像 `localStorage`，跨会话持久存在。
:::

理解类比之后，也要注意短期记忆的**原生语义**：它本质上就是将完整的 [消息列表](/ai/langchain/guide/messages) 持久化到存储后端（内存、数据库等），在每次 Agent 调用时作为模型的上下文窗口输入。当对话过长超出模型的上下文窗口限制时，就需要配合消息裁剪策略来管理。

## 核心概念

### Checkpointer 是什么

Checkpointer 是 LangGraph 提供的状态持久化组件，负责在每个 Agent 执行步骤后**保存完整的图状态**（包括消息列表）。当同一个 `thread_id` 的下一次请求到来时，Checkpointer 会恢复上次保存的状态，从而实现对话的连续性。

```
第 1 轮调用                          第 2 轮调用
用户: "我叫小明"                     用户: "我叫什么？"
    ↓                                    ↓
Agent 处理                           Checkpointer 加载线程 1 的历史
    ↓                                    ↓
AI: "你好小明！"                     Agent 看到完整上下文: ["我叫小明", "你好小明！", "我叫什么？"]
    ↓                                    ↓
Checkpointer 保存到线程 1            AI: "你叫小明。"
```

### thread_id 线程隔离

`thread_id` 是短期记忆的核心标识符，通过 `config` 参数传递。不同的 `thread_id` 代表完全独立的对话，彼此之间互不影响：

| thread_id | 对话内容 | 隔离性 |
|-----------|---------|--------|
| `"user-alice-1"` | Alice 的第一个对话 | 独立 |
| `"user-alice-2"` | Alice 的第二个对话 | 独立 |
| `"user-bob-1"` | Bob 的对话 | 独立 |

### 记忆生命周期

```mermaid
sequenceDiagram
    participant U as 用户
    participant A as Agent
    participant C as Checkpointer
    participant M as 模型 (LLM)

    U->>A: invoke(message, thread_id="1")
    A->>C: 加载线程 "1" 的历史消息
    C-->>A: 返回已有消息列表 (首次为空)
    A->>M: 发送完整消息列表
    M-->>A: 生成回复
    A->>C: 保存更新后的消息列表
    A-->>U: 返回回复

    Note over U,C: 第二轮对话

    U->>A: invoke(message, thread_id="1")
    A->>C: 加载线程 "1" 的历史消息
    C-->>A: 返回包含前几轮的消息列表
    A->>M: 发送完整消息列表 (含历史)
    M-->>A: 生成回复
    A->>C: 保存更新后的消息列表
    A-->>U: 返回回复
```

## 代码示例 1：基础多轮对话

传入 `checkpointer` 和 `thread_id` 即可开启短期记忆：

```python
from langchain.agents import create_agent
from langgraph.checkpoint.memory import InMemorySaver

agent = create_agent(
    "anthropic:claude-sonnet-4-5-20250929",
    tools=[],
    prompt="你是一个友好的中文助手。",
    checkpointer=InMemorySaver(),
)

config = {"configurable": {"thread_id": "demo-1"}}

# 第 1 轮
response1 = agent.invoke(
    {"messages": [{"role": "user", "content": "你好！我叫小明，是一名前端工程师。"}]},
    config,
)
print(response1["messages"][-1].content)
# → "你好小明！很高兴认识你..."

# 第 2 轮：Agent 记住了上文
response2 = agent.invoke(
    {"messages": [{"role": "user", "content": "我叫什么名字？做什么工作？"}]},
    config,
)
print(response2["messages"][-1].content)
# → "你叫小明，是一名前端工程师。"
```

**要点：** `InMemorySaver()` 将状态保存在进程内存中；多次 `invoke` 使用同一 `thread_id`，Agent 自动加载历史消息——每次只需传入新的用户消息。

## 代码示例 2：线程隔离与恢复对话

不同 `thread_id` 之间的记忆完全隔离，可随时回到某个线程继续对话：

```python
from langchain.agents import create_agent
from langgraph.checkpoint.memory import InMemorySaver

agent = create_agent(
    "anthropic:claude-sonnet-4-5-20250929",
    tools=[],
    prompt="你是一个中文助手。",
    checkpointer=InMemorySaver(),
)

config_a = {"configurable": {"thread_id": "alice-session"}}
config_b = {"configurable": {"thread_id": "bob-session"}}

# 线程 A
agent.invoke({"messages": "我最喜欢的编程语言是 TypeScript"}, config_a)
# 线程 B
agent.invoke({"messages": "我最喜欢的编程语言是 Rust"}, config_b)

# 回到线程 A — Alice 的对话被完整恢复
response = agent.invoke({"messages": "我喜欢的语言是什么？"}, config_a)
print(response["messages"][-1].content)
# → "你说过你最喜欢的编程语言是 TypeScript。"

# 线程 B 互不干扰
response = agent.invoke({"messages": "我喜欢的语言是什么？"}, config_b)
print(response["messages"][-1].content)
# → "你说过你最喜欢的编程语言是 Rust。"
```

**关键点：** `thread_id` 就是对话的"身份证"。生产环境中通常用 `{user_id}:{session_id}` 作为 `thread_id`，实现用户级别的对话隔离。

## 上下文窗口管理

### 为什么需要裁剪消息

每个 LLM 都有上下文窗口限制（如 Claude 200K tokens，GPT-4o 128K tokens）。对话过长会导致 API 报错、延迟增加、以及模型对中间内容注意力下降（"中间遗忘"问题）。

### 策略 1：@before_model 中间件裁剪

LangChain 1.0 推荐通过 `@before_model` 中间件在消息发送给模型前裁剪，不会删除 Checkpointer 中的完整历史：

```python
from langchain.agents import create_agent, AgentState
from langchain.agents.middleware import before_model
from langchain.messages import RemoveMessage
from langgraph.graph.message import REMOVE_ALL_MESSAGES
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.runtime import Runtime
from typing import Any

@before_model
def trim_messages(state: AgentState, runtime: Runtime) -> dict[str, Any] | None:
    """保留系统消息 + 最近 N 条消息，防止上下文溢出。"""
    messages = state["messages"]
    if len(messages) <= 3:
        return None

    first_msg = messages[0]
    recent_messages = messages[-3:] if len(messages) % 2 == 0 else messages[-4:]
    return {
        "messages": [
            RemoveMessage(id=REMOVE_ALL_MESSAGES),
            first_msg,
            *recent_messages,
        ]
    }

agent = create_agent(
    "anthropic:claude-sonnet-4-5-20250929",
    tools=[],
    middleware=[trim_messages],
    checkpointer=InMemorySaver(),
)

config = {"configurable": {"thread_id": "long-chat"}}
agent.invoke({"messages": "你好，我叫小明"}, config)
agent.invoke({"messages": "今天天气怎么样？"}, config)
agent.invoke({"messages": "帮我写一首关于猫的诗"}, config)
agent.invoke({"messages": "再写一首关于狗的"}, config)
final = agent.invoke({"messages": "我叫什么名字？"}, config)
final["messages"][-1].pretty_print()
```

### 策略 2：trim_messages 工具函数

`langchain_core` 提供基于 token 数的精确裁剪函数：

```python
from langchain_core.messages.utils import trim_messages, count_tokens_approximately

# 按 token 数裁剪，保留最近的消息
trimmed = trim_messages(
    messages,
    strategy="last",                          # 保留最后的消息
    max_tokens=4096,                          # 最大 token 数
    token_counter=count_tokens_approximately,  # token 计数器
    start_on="human",                         # 裁剪后的第一条必须是 human 消息
    end_on=("human", "tool"),                 # 裁剪后的最后一条必须是 human 或 tool
)
```

### 策略对比

| 策略 | 适用场景 | 优点 | 缺点 |
|------|---------|------|------|
| `@before_model` 中间件 | `create_agent` 场景 | 与 Agent 无缝集成，按消息条数裁剪 | 不够精确（未考虑 token 长度差异） |
| `trim_messages` 函数 | 自定义 LangGraph 图 | 按 token 精确控制，灵活配置 | 需要手动集成到图节点中 |
| 摘要压缩（summarize） | 超长对话 | 保留关键信息，大幅减少 token | 实现复杂，可能丢失细节 |

## Checkpointer 后端选型

### 开发环境：InMemorySaver

```python
from langgraph.checkpoint.memory import InMemorySaver

checkpointer = InMemorySaver()
```

- 数据存储在进程内存中，进程重启后丢失
- 零配置，无需外部依赖
- 适用于：本地开发、单元测试、快速原型

### 生产环境：PostgresSaver

```python
from langgraph.checkpoint.postgres import PostgresSaver

checkpointer = PostgresSaver.from_conn_string(
    "postgresql://user:pass@localhost:5432/mydb"
)
checkpointer.setup()  # 首次运行时创建必要的表
```

- 数据持久化到 PostgreSQL，服务重启后对话可恢复
- 支持多 Agent 实例共享同一数据库，适用于生产部署

### 后端对比

| Checkpointer | 安装包 | 持久化 | 多实例共享 | 适用环境 |
|--------------|--------|--------|-----------|---------|
| `InMemorySaver` | `langgraph`（内置） | 否 | 否 | 开发/测试 |
| `PostgresSaver` | `langgraph-checkpoint-postgres` | 是 | 是 | 生产 |
| `SQLiteSaver` | `langgraph-checkpoint-sqlite` | 是 | 否 | 单机生产/嵌入式 |

```bash
# 安装生产级 checkpointer
pip install langgraph-checkpoint-postgres
# 或
pip install langgraph-checkpoint-sqlite
```

## 代码示例 3：生产环境完整配置

结合 PostgresSaver 和消息裁剪的生产级配置：

```python
from langchain.agents import create_agent, AgentState
from langchain.agents.middleware import before_model
from langchain.messages import RemoveMessage
from langchain.tools import tool
from langgraph.graph.message import REMOVE_ALL_MESSAGES
from langgraph.checkpoint.postgres import PostgresSaver
from langgraph.runtime import Runtime
from typing import Any
import os

@tool
def search_knowledge_base(query: str) -> str:
    """搜索内部知识库"""
    return f"找到关于「{query}」的 3 条相关文档"

@before_model
def manage_context_window(
    state: AgentState, runtime: Runtime
) -> dict[str, Any] | None:
    """保留系统消息 + 最近 10 条消息。"""
    messages = state["messages"]
    if len(messages) <= 10:
        return None
    return {
        "messages": [
            RemoveMessage(id=REMOVE_ALL_MESSAGES),
            messages[0],       # 系统消息
            *messages[-10:],   # 最近 10 条
        ]
    }

# PostgreSQL checkpointer
checkpointer = PostgresSaver.from_conn_string(os.environ["DATABASE_URL"])
checkpointer.setup()

agent = create_agent(
    "anthropic:claude-sonnet-4-5-20250929",
    tools=[search_knowledge_base],
    prompt="你是一个企业知识助手，用中文回答用户问题。",
    middleware=[manage_context_window],
    checkpointer=checkpointer,
)

# Web 框架中的典型用法
def handle_chat(user_id: str, session_id: str, message: str) -> str:
    config = {"configurable": {"thread_id": f"{user_id}:{session_id}"}}
    response = agent.invoke(
        {"messages": [{"role": "user", "content": message}]},
        config,
    )
    return response["messages"][-1].content
```

## 短期记忆 vs 长期记忆

| 维度 | 短期记忆 | 长期记忆 |
|------|---------|---------|
| **作用域** | 单个对话线程内 | 跨所有对话线程 |
| **内容** | 完整的消息历史 | 用户偏好、事实、总结等结构化信息 |
| **存储方式** | Checkpointer（自动） | Store（需显式配置） |
| **生命周期** | 对话结束即可丢弃 | 长期保留 |

详见 [长期记忆](/ai/langchain/guide/long-term-memory)。关于如何综合运用短期记忆、长期记忆和指令来构建高质量模型输入，参阅 [上下文工程](/ai/langchain/guide/context-engineering)。

## 常见问题

**没有传 checkpointer 会怎样？** Agent 将没有记忆能力——每次 `invoke` 都是全新对话，无法引用之前的消息。

**thread_id 命名建议？** 使用有业务含义的格式，如 `{user_id}:{session_id}`，方便调试和管理。避免简单递增数字，防止冲突。

**InMemorySaver 能用于生产吗？** 不建议。进程重启后数据丢失，且无法多实例共享。生产环境请使用 `PostgresSaver` 或 `SQLiteSaver`。

## 下一步

- [Agent 实战指南](/ai/langchain/guide/agents) — 学习 `create_agent` 的完整用法
- [消息 Messages](/ai/langchain/guide/messages) — 深入理解消息类型与 Content Blocks
- [长期记忆](/ai/langchain/guide/long-term-memory) — 跨对话持久化用户信息
- [上下文工程](/ai/langchain/guide/context-engineering) — 综合运用记忆与指令优化模型输入

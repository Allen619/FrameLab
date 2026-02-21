---
title: 设计理念
description: 理解 LangChain 1.0 的架构哲学和设计决策
---

# 设计理念

## 概述

LangChain 1.0 是一次重大的架构重构，从"链式管道"演进为"Agent 优先"的设计。理解这些设计决策，能帮助你更好地使用框架，也能在遇到问题时做出正确的技术选择。

## 1. Agent 优先

### 从 Chain 到 Agent

LangChain 早期版本（0.x）的核心抽象是 **Chain（链）**——将 LLM 调用、Prompt 模板、输出解析器串联成管道。这种模式简单但不够灵活：

```python
# 旧版 Chain 模式（已弃用）
chain = prompt | model | output_parser
result = chain.invoke({"input": "..."})
```

LangChain 1.0 将核心抽象从 Chain 转变为 **Agent**——一个具备自主决策能力的实体，能根据任务动态选择和调用工具：

```python
# 新版 Agent 模式
agent = create_agent(
    model="anthropic:claude-sonnet-4-5-20250929",
    tools=[search, calculate, write_file],
)
result = agent.invoke({"messages": [...]})
```

::: tip 前端类比
这种转变类似前端从"命令式 DOM 操作"到"声明式组件"的演进。旧版 Chain 像 jQuery（手动串联每一步），新版 Agent 像 React（描述目标，框架决定如何执行）。
:::

**LangChain 原生语义**：Agent 底层运行在 LangGraph 的循环图上。LLM 在每轮循环中自主决定"调用工具"还是"返回结果"，这种循环-决策模式是 Agent 区别于 Chain 的本质。

### 统一接口：create_agent

`create_agent` 是 LangChain 1.0 的核心入口点，替代了旧版的多个构造函数：

| 旧版（0.x） | 新版（1.0） |
|-------------|-------------|
| `initialize_agent()` | `create_agent()` |
| `AgentExecutor()` | `create_agent()` |
| `create_openai_tools_agent()` | `create_agent()` |
| `create_react_agent()` | `create_agent()` |

一个接口，覆盖所有场景。差异通过参数控制（`tools`、`middleware`、`response_format` 等）。

## 2. Provider 抽象

### 统一模型接口

不同 LLM Provider 的 API 差异很大，LangChain 通过 `init_chat_model` 提供统一的抽象层：

```python
from langchain.chat_models import init_chat_model

# 统一接口，只需改字符串就能切换 Provider
model = init_chat_model("anthropic:claude-sonnet-4-5-20250929")
model = init_chat_model("openai:gpt-4o")
```

::: tip 前端类比
类似 `fetch` API 对 `XMLHttpRequest` 的统一，或者数据库 ORM 对不同数据库驱动的抽象。你写一份代码，底层适配不同的 Provider。
:::

### Content Blocks：统一响应格式

不同 Provider 返回的响应格式不同（Anthropic 有 thinking 块、OpenAI 有 tool_calls 数组）。`content_blocks` 属性统一了这些差异：

```python
# 无论使用哪个 Provider，处理逻辑相同
for block in response.content_blocks:
    if block["type"] == "text":
        print(block["text"])
    elif block["type"] == "tool_call":
        execute_tool(block["name"], block["args"])
```

## 3. 可组合的 Middleware

### 横切关注点分离

LangChain 借鉴了 Web 框架（Express、Koa）的中间件模式，将 Agent 的横切关注点分离为独立的 Middleware：

```python
agent = create_agent(
    model="...",
    tools=[...],
    middleware=[
        PIIMiddleware("email", strategy="redact"),    # 安全
        SummarizationMiddleware(max_tokens=500),       # 性能
        HumanInTheLoopMiddleware(interrupt_on={...}),  # 控制
    ],
)
```

**设计原则**：
- **单一职责**：每个 Middleware 只做一件事
- **可组合**：按需组合，不用的不加
- **顺序敏感**：请求按声明顺序执行，响应反向执行（洋葱模型）

## 4. 分层架构

LangChain 生态采用分层设计，每一层解决不同层面的问题：

```
┌─────────────────────────────────┐
│  你的应用代码                     │
├─────────────────────────────────┤
│  LangChain (高层 Agent 框架)      │  ← create_agent, middleware
├─────────────────────────────────┤
│  LangGraph (低层编排运行时)        │  ← 节点, 边, 状态, checkpoint
├─────────────────────────────────┤
│  langchain-core (核心抽象)        │  ← 消息类型, 工具接口, 模型接口
├─────────────────────────────────┤
│  Provider 包 (模型适配)           │  ← langchain-anthropic, langchain-openai
└─────────────────────────────────┘
```

**关键设计决策**：
- **LangChain 不直接依赖任何 Provider**：通过 `init_chat_model` 的字符串参数动态加载
- **LangChain 底层使用 LangGraph**：`create_agent` 构建的 Agent 实际运行在 LangGraph 的图运行时上
- **langchain-core 是稳定的抽象层**：消息类型、工具接口等基础类型定义在 core 中，变更频率极低

## 5. 运行时依赖注入

### Runtime Context

LangChain 通过 Runtime 对象实现依赖注入，避免全局状态和硬编码：

```python
from dataclasses import dataclass
from langchain.tools import tool, ToolRuntime

@dataclass
class AppContext:
    user_id: str
    db_connection: str

@tool
def get_user_data(runtime: ToolRuntime[AppContext]) -> str:
    """获取当前用户数据"""
    user_id = runtime.context.user_id  # 从运行时上下文获取
    return f"用户 {user_id} 的数据"

# 调用时注入上下文
agent.invoke(
    {"messages": [...]},
    config={"configurable": {"context": AppContext(user_id="u123", db_connection="...")}}
)
```

::: tip 前端类比
类似 React 的 Context API 或 Angular 的依赖注入——工具函数不需要知道"用户 ID 从哪来"，运行时自动注入。
:::

## 6. 渐进式复杂度

LangChain 的设计遵循"渐进式复杂度"原则——从简单开始，按需增加复杂度：

| 复杂度 | 能力 | 代码量 |
|--------|------|--------|
| **Level 1** | 基础 Agent（模型 + 工具） | 10 行 |
| **Level 2** | 加 Middleware（PII、摘要） | 20 行 |
| **Level 3** | 结构化输出 | 25 行 |
| **Level 4** | 多智能体协作 | 40 行 |
| **Level 5** | 下探到 LangGraph | 按需 |

你不需要一开始就学会所有功能。从 `create_agent` + `@tool` 开始，遇到瓶颈时再引入更多能力。

## 总结

LangChain 1.0 的核心设计原则：

1. **Agent 优先**：从链式管道到自主决策的 Agent
2. **Provider 抽象**：一份代码，多 Provider 兼容
3. **可组合的 Middleware**：横切关注点独立管理
4. **分层架构**：高层简洁、低层可控
5. **运行时注入**：避免全局状态，支持依赖注入
6. **渐进式复杂度**：简单的事简单做，复杂的事做得到

## 下一步

理解了设计理念后，开始深入学习各个核心组件：

- [智能体 Agent](/ai/langchain/guide/agents) — Agent 架构详解
- [模型 Models](/ai/langchain/guide/models) — 多 Provider 模型管理
- [工具 Tools](/ai/langchain/guide/tools) — 工具定义与管理

## 参考资源

- [LangChain Philosophy](https://docs.langchain.com/oss/python/langchain/philosophy)
- [LangChain 1.0 发布说明](https://docs.langchain.com/oss/python/releases/langchain-v1/)
- [LangGraph 概览](/ai/langgraph/guide/overview) — 了解底层编排框架

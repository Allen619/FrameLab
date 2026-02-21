---
title: Agent 概览
description: 理解 AI SDK 中 Agent 的概念、接口设计与使用场景，掌握 Agent 与直接 API 调用的本质区别。
---

# Agent 概览

在 AI 应用中，**Agent（智能体）** 是一个能够自主决策、调用工具、多步推理的 AI 实体。与简单的"问一次答一次"不同，Agent 可以根据任务需要，自动规划执行步骤，在循环中反复调用工具和模型，直到完成目标。

[🔗 AI SDK Agent 官方文档](https://ai-sdk.dev/docs/agents/overview){target="_blank" rel="noopener"}

## Agent vs 直接 API 调用

::: tip 前端类比
直接 API 调用就像一个纯函数 —— 输入确定，输出确定，调用一次就结束。Agent 则像一个 Redux Saga / Effect —— 它有自己的执行循环，可以 watch 事件、dispatch action、等待结果，多轮交互后才最终完成。
:::

| 特性 | 直接 API 调用 (`generateText`) | Agent（工具循环） |
|------|-------------------------------|-------------------|
| 调用次数 | 单次请求，单次响应 | 多步循环，自动决策下一步 |
| 工具使用 | 可选，调用一次 | 核心能力，反复调用 |
| 控制流 | 开发者控制 | Agent 自主决定 |
| 适用场景 | 翻译、摘要、分类 | 研究任务、代码生成、复杂问答 |

```typescript
// 直接 API 调用：一问一答
import { generateText } from 'ai'

const { text } = await generateText({
  model: 'openai/gpt-4o',
  prompt: '把这段话翻译成英文：你好世界',
})

// Agent：多步推理 + 工具调用
import { generateText, tool, stepCountIs } from 'ai'
import { z } from 'zod'

const { text: answer } = await generateText({
  model: 'openai/gpt-4o',
  prompt: '查询北京今天的天气，然后推荐合适的穿搭',
  tools: {
    weather: tool({
      description: '获取指定城市的天气信息',
      inputSchema: z.object({ city: z.string() }),
      execute: async ({ city }) => {
        // 调用天气 API
        return { city, temperature: 22, condition: '晴' }
      },
    }),
  },
  stopWhen: stepCountIs(5),
})
```

## Agent 接口

AI SDK 定义了标准的 `Agent` 接口，所有 Agent 实现都遵循这个契约：

```typescript
export interface Agent<
  CALL_OPTIONS = never,
  TOOLS extends ToolSet = {},
  OUTPUT extends Output = never,
> {
  readonly version: 'agent-v1'        // 接口版本，保证向后兼容
  readonly id: string | undefined     // Agent 标识符（可选）
  readonly tools: TOOLS               // Agent 可用的工具集

  // 非流式生成
  generate(
    options: AgentCallParameters<CALL_OPTIONS, TOOLS>,
  ): PromiseLike<GenerateTextResult<TOOLS, OUTPUT>>

  // 流式生成
  stream(
    options: AgentStreamParameters<CALL_OPTIONS, TOOLS>,
  ): PromiseLike<StreamTextResult<TOOLS, OUTPUT>>
}
```

核心组成：

- **`version`** — 固定为 `'agent-v1'`，支持未来接口演进
- **`id`** — 可选的标识符，便于调试和日志追踪
- **`tools`** — Agent 可调用的工具集合（`ToolSet` 类型）
- **`generate()`** — 非流式调用，返回完整结果
- **`stream()`** — 流式调用，逐步返回内容

## Agent 的核心能力

### 1. 工具调用（Tool Use）

Agent 可以根据用户请求，自主决定调用哪些工具、以什么参数调用：

```typescript
import { ToolLoopAgent, tool } from 'ai'
import { z } from 'zod'

const agent = new ToolLoopAgent({
  model: 'openai/gpt-4o',
  tools: {
    search: tool({
      description: '搜索知识库',
      inputSchema: z.object({ query: z.string() }),
      execute: async ({ query }) => {
        // 搜索实现
        return `关于 "${query}" 的搜索结果...`
      },
    }),
    calculate: tool({
      description: '数学计算',
      inputSchema: z.object({ expression: z.string() }),
      execute: async ({ expression }) => {
        return String(eval(expression))
      },
    }),
  },
})
```

### 2. 多步推理（Multi-step Reasoning）

Agent 不是一次性完成任务，而是通过循环逐步推进：

1. 接收用户输入
2. 模型决定下一步操作（回复文本 or 调用工具）
3. 如果调用了工具，将工具结果反馈给模型
4. 重复步骤 2-3，直到模型生成最终回复或达到步数上限

### 3. 自主决策（Autonomous Decision）

与预编排的工作流不同，Agent 由 LLM 自主决定执行路径。开发者只需定义可用的工具和停止条件，Agent 会根据上下文做出最优决策。

## 何时使用 Agent

**适合使用 Agent 的场景：**

- 任务需要多步推理，无法一次完成
- 需要根据中间结果动态调整策略
- 涉及多个工具的协作使用
- 开放性问题，执行路径不确定

**不适合使用 Agent 的场景：**

- 简单的文本生成（翻译、摘要）
- 执行路径确定的流水线任务（用工作流模式更好）
- 对延迟敏感的场景（Agent 循环会增加响应时间）

## 内置 Agent 实现

AI SDK 提供了 `ToolLoopAgent` 作为最常用的 Agent 实现，它封装了"模型 + 工具 + 循环"的标准模式：

```typescript
import { ToolLoopAgent, stepCountIs } from 'ai'

const agent = new ToolLoopAgent({
  model: 'openai/gpt-4o',
  instructions: '你是一个有帮助的助手。',
  tools: { /* ... */ },
  stopWhen: stepCountIs(20),  // 最多执行 20 步
})

// 非流式调用
const result = await agent.generate({ prompt: '...' })

// 流式调用
const streamResult = await agent.stream({ prompt: '...' })
```

你也可以实现自定义 Agent，只需满足 `Agent` 接口的契约即可与 AI SDK 的所有工具链无缝集成。

## 下一步

- [构建 Agent](/ai/vercel-ai-sdk/guide/building-agents) — 学习如何使用 `generateText` 和 `ToolLoopAgent` 构建 Agent
- [工作流模式](/ai/vercel-ai-sdk/guide/workflow-patterns) — 了解顺序、路由、并行、编排器-工作者四种模式
- [Agent 进阶](/ai/vercel-ai-sdk/guide/agent-advanced) — 探索记忆系统、子 Agent 和高级循环控制

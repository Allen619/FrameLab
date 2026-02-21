---
title: Agent 进阶
description: 深入探索 AI SDK Agent 的高级特性 —— 记忆系统、子 Agent 委托、循环控制和逐步配置。
---

# Agent 进阶

掌握了基本的 Agent 构建后，本章将介绍高级技巧：为 Agent 添加记忆、使用子 Agent 进行任务委托、精细化循环控制，以及按步骤动态配置。

## 记忆系统

默认情况下，Agent 只有当前对话的上下文（短期记忆）。要实现跨会话的持久记忆，需要引入外部存储。

### 通过 prepareCall 注入记忆

[🔗 Agent 记忆官方文档](https://ai-sdk.dev/cookbook/guides/custom-memory-tool){target="_blank" rel="noopener"}

`ToolLoopAgent` 的 `prepareCall` 钩子在每次调用前执行，适合注入最新的记忆内容：

```typescript
import { ToolLoopAgent, tool } from 'ai'
import { z } from 'zod'

// 记忆工具：读写持久存储
const memoryTool = tool({
  description: '保存或读取重要信息到长期记忆',
  inputSchema: z.object({
    action: z.enum(['save', 'read']),
    key: z.string().describe('记忆的键名'),
    value: z.string().optional().describe('要保存的值（save 时必填）'),
  }),
  execute: async ({ action, key, value }) => {
    if (action === 'save' && value) {
      await saveToMemory(key, value) // 自定义持久化函数
      return `已保存: ${key}`
    }
    return await readFromMemory(key) // 自定义读取函数
  },
})

const today = new Date().toISOString().slice(0, 10)

const memoryAgent = new ToolLoopAgent({
  model: 'anthropic/claude-haiku-4.5',
  tools: { memory: memoryTool },
  prepareCall: async (settings) => {
    // 每次调用前，从存储读取核心记忆并注入系统提示
    const coreMemory = await readCoreMemory()
    return {
      ...settings,
      instructions: `今天是 ${today}。

核心记忆：
${coreMemory}

你可以使用 memory 工具保存和读取重要信息。`,
    }
  },
})
```

### 记忆策略对比

| 策略 | 实现方式 | 适用场景 |
|------|----------|----------|
| 系统提示注入 | `prepareCall` 中读取并注入 | 关键事实、用户偏好 |
| 工具调用 | 提供 memory 工具 | 按需读写，Agent 自主决定 |
| 向量检索 | 嵌入 + 相似度搜索 | 大量历史信息 |
| 消息历史 | 直接传入历史消息 | 单会话上下文 |

## 子 Agent（Sub-agents）

[🔗 子 Agent 官方文档](https://ai-sdk.dev/docs/agents/subagents){target="_blank" rel="noopener"}

子 Agent 模式允许主 Agent 将特定任务委托给专业化的子 Agent。子 Agent 有独立的上下文窗口和工具集，完成后将结果返回给主 Agent。

```typescript
import { ToolLoopAgent, tool } from 'ai'
import { z } from 'zod'

// 定义研究子 Agent
const researchSubagent = new ToolLoopAgent({
  model: 'openai/gpt-4o',
  instructions: `你是一个研究 Agent。
完成研究后，在最终回复中总结发现。`,
  tools: {
    read: readFileTool,   // 文件读取工具
    search: searchTool,   // 搜索工具
  },
})

// 将子 Agent 封装为工具
const researchTool = tool({
  description: '深入研究一个主题或问题',
  inputSchema: z.object({
    task: z.string().describe('研究任务描述'),
  }),
  execute: async ({ task }, { abortSignal }) => {
    const result = await researchSubagent.generate({
      prompt: task,
      abortSignal,
    })
    return result.text
  },
})

// 主 Agent 使用研究工具
const mainAgent = new ToolLoopAgent({
  model: 'openai/gpt-4o',
  instructions: '你是一个有帮助的助手，可以委托研究任务。',
  tools: {
    research: researchTool,
  },
})
```

### 子 Agent 的优势

- **上下文隔离** — 子 Agent 有独立的上下文窗口，不会污染主 Agent 的上下文
- **专业化** — 每个子 Agent 可以使用不同的模型、工具和系统提示
- **并行委托** — 主 Agent 可以同时委托多个子 Agent

### 注意事项

- 子 Agent 的结果以文本形式返回，主 Agent 看不到子 Agent 的中间步骤
- 如果需要在 UI 上显示子 Agent 的进度，建议使用流式 API
- 注意传递 `abortSignal`，确保取消操作能正确传播

## 循环控制

### stopWhen 停止条件

使用 `stepCountIs()` 控制最大步数：

```typescript
import { ToolLoopAgent, stepCountIs } from 'ai'

const agent = new ToolLoopAgent({
  model: 'openai/gpt-4o',
  tools: { /* ... */ },
  stopWhen: stepCountIs(20), // 最多 20 步
})
```

默认情况下，`ToolLoopAgent` 的最大步数为 20。每一步会产生文本生成或工具调用。

### prepareStep 逐步配置

`prepareStep` 回调在每一步执行前运行，可以用来：

- 动态修改消息历史（上下文压缩）
- 调整模型参数
- 注入上下文信息

#### 上下文窗口管理

长循环中，消息历史可能超出上下文长度限制。使用 `prepareStep` 裁剪消息：

```typescript
import { ToolLoopAgent } from 'ai'

const agent = new ToolLoopAgent({
  model: 'openai/gpt-4o',
  tools: { /* ... */ },
  prepareStep: async ({ messages }) => {
    // 消息过多时，只保留系统指令和最近 10 条消息
    if (messages.length > 20) {
      return {
        messages: [
          messages[0],          // 保留系统指令
          ...messages.slice(-10), // 保留最近 10 条
        ],
      }
    }
    return {}
  },
})
```

#### Token 使用量追踪

通过 `experimental_context` 在步骤之间传递状态：

```typescript
import { ToolLoopAgent, tool } from 'ai'
import { z } from 'zod'

type TContext = {
  lastInputTokens: number
}

const agent = new ToolLoopAgent({
  model: 'anthropic/claude-haiku-4.5',
  callOptionsSchema: z.object({
    lastInputTokens: z.number(),
  }),
  tools: {
    greet: tool({
      description: '问候某人',
      inputSchema: z.object({ name: z.string() }),
      execute: async ({ name }) => `已问候 ${name}`,
    }),
  },
  prepareCall: ({ options, ...settings }) => {
    return {
      ...settings,
      experimental_context: { lastInputTokens: options.lastInputTokens },
    }
  },
  prepareStep: ({ steps, experimental_context }) => {
    const lastStep = steps.at(-1)
    const lastStepUsage =
      lastStep?.usage?.inputTokens ??
      (experimental_context as TContext)?.lastInputTokens ??
      0

    console.log('上一步输入 token:', lastStepUsage)

    // 可以根据 token 使用量实施上下文压缩策略
    return {
      experimental_context: {
        ...(experimental_context as TContext),
        lastStepUsage,
      },
    }
  },
})
```

### 动态提示缓存

对于长上下文的 Agent 循环，使用 `prepareStep` 配合 Prompt Caching 优化成本：

```typescript
import { anthropic } from '@ai-sdk/anthropic'
import { generateText, tool } from 'ai'
import { z } from 'zod'

const result = await generateText({
  model: anthropic('claude-sonnet-4-5'),
  prompt: '帮我分析这个代码库并提出改进建议。',
  maxSteps: 10,
  tools: {
    analyzeFile: tool({
      description: '分析代码库中的一个文件',
      inputSchema: z.object({
        path: z.string().describe('文件路径'),
      }),
      execute: async ({ path }) => {
        return { analysis: `${path} 的分析结果` }
      },
    }),
  },
  prepareStep: ({ messages, model }) => ({
    // 为消息添加缓存控制标记
    messages: addCacheControlToMessages({ messages, model }),
  }),
})
```

## 自定义 Agent 实现

如果 `ToolLoopAgent` 不满足需求，可以实现自定义 Agent：

```typescript
import type { Agent, ToolSet, AgentCallParameters, GenerateTextResult } from 'ai'

class MyCustomAgent implements Agent<never, ToolSet, never> {
  readonly version = 'agent-v1' as const
  readonly id = 'my-custom-agent'
  readonly tools: ToolSet

  constructor(private config: { model: string; tools: ToolSet }) {
    this.tools = config.tools
  }

  async generate(options: AgentCallParameters<never, ToolSet>) {
    // 自定义生成逻辑
    // ...
  }

  async stream(options: AgentCallParameters<never, ToolSet>) {
    // 自定义流式逻辑
    // ...
  }
}
```

自定义 Agent 只需实现 `Agent` 接口的契约（`version`、`id`、`tools`、`generate`、`stream`），即可与 AI SDK 的所有工具链无缝集成。

## 下一步

- [Agent 概览](/ai/vercel-ai-sdk/guide/agent-overview) — 回顾 Agent 基础概念
- [工作流模式](/ai/vercel-ai-sdk/guide/workflow-patterns) — 了解结构化工作流的四种模式
- [错误处理与测试](/ai/vercel-ai-sdk/guide/error-handling) — 学习 Agent 的错误处理和单元测试

---
title: 中间件系统
description: 掌握 AI SDK 的 Language Model Middleware 机制，学习使用内置中间件和编写自定义中间件来增强模型能力。
---

# 中间件系统

AI SDK 的中间件系统允许你在不修改模型调用代码的情况下，拦截和增强模型的输入输出。这是一种强大的横切关注点（cross-cutting concern）处理方式。

[🔗 AI SDK 中间件官方文档](https://ai-sdk.dev/docs/ai-sdk-core/middleware){target="_blank" rel="noopener"}

## 核心概念

::: tip 前端类比
AI SDK 的中间件与 Express/Koa 中间件或 Redux Middleware 非常类似。它可以拦截请求（模型调用参数），修改响应（模型输出），甚至短路执行（返回缓存结果）。
:::

中间件通过 `wrapLanguageModel` 函数包裹一个模型，返回一个增强后的新模型：

```typescript
import { wrapLanguageModel } from 'ai'

const enhancedModel = wrapLanguageModel({
  model: yourModel,
  middleware: yourMiddleware,
})

// 使用增强后的模型，与普通模型用法完全一致
const { text } = await generateText({
  model: enhancedModel,
  prompt: '...',
})
```

## 内置中间件

### extractReasoningMiddleware

从模型输出中提取推理过程。一些模型会在特殊标签（如 `<think>`）中输出推理过程，这个中间件会自动提取并暴露为 `reasoning` 属性：

```typescript
import { wrapLanguageModel, extractReasoningMiddleware } from 'ai'

const model = wrapLanguageModel({
  model: yourModel,
  middleware: extractReasoningMiddleware({ tagName: 'think' }),
})

// 使用后，结果中会有 reasoning 字段
const result = await generateText({
  model,
  prompt: '解释量子纠缠',
})

console.log(result.reasoning) // 推理过程
console.log(result.text)      // 最终回答
```

### simulateStreamingMiddleware

为不支持流式输出的模型模拟流式行为：

```typescript
import { wrapLanguageModel, simulateStreamingMiddleware } from 'ai'

const model = wrapLanguageModel({
  model: nonStreamingModel, // 不支持流式的模型
  middleware: simulateStreamingMiddleware(),
})

// 现在可以像流式模型一样使用
const result = streamText({
  model,
  prompt: '...',
})
```

### defaultSettingsMiddleware

为模型设置默认参数，避免每次调用都重复配置：

```typescript
import { wrapLanguageModel, defaultSettingsMiddleware } from 'ai'

const model = wrapLanguageModel({
  model: yourModel,
  middleware: defaultSettingsMiddleware({
    settings: {
      temperature: 0.5,
      maxOutputTokens: 800,
      providerOptions: { openai: { store: false } },
    },
  }),
})

// 使用时无需再指定 temperature 和 maxOutputTokens
const { text } = await generateText({
  model,
  prompt: '...',
})
```

### extractJsonMiddleware

从模型输出中提取 JSON，自动移除 Markdown 代码块标记（`` ```json ```)：

```typescript
import {
  wrapLanguageModel,
  extractJsonMiddleware,
  Output,
  generateText,
} from 'ai'
import { z } from 'zod'

const model = wrapLanguageModel({
  model: yourModel,
  middleware: extractJsonMiddleware(),
})

const result = await generateText({
  model,
  output: Output.object({
    schema: z.object({
      name: z.string(),
      ingredients: z.array(z.string()),
    }),
  }),
  prompt: '生成一个菜谱。',
})
```

### addToolInputExamplesMiddleware

将工具输入示例添加到工具描述中，帮助模型更好地理解如何调用工具。

## 编写自定义中间件

`LanguageModelV3Middleware` 接口提供了两个核心钩子：

- **`wrapGenerate`** — 拦截非流式调用
- **`wrapStream`** — 拦截流式调用

### 简单缓存中间件

```typescript
import type { LanguageModelV3Middleware } from '@ai-sdk/provider'

const cache = new Map<string, any>()

export const simpleCacheMiddleware: LanguageModelV3Middleware = {
  wrapGenerate: async ({ doGenerate, params }) => {
    const cacheKey = JSON.stringify(params)

    // 命中缓存，直接返回
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)
    }

    // 未命中，调用模型并缓存结果
    const result = await doGenerate()
    cache.set(cacheKey, result)

    return result
  },

  // 流式调用的缓存需要额外处理
  // wrapStream: async ({ doStream, params }) => { ... }
}
```

### 日志中间件

记录所有模型调用的参数和结果：

```typescript
import type { LanguageModelV3Middleware } from '@ai-sdk/provider'

export const loggingMiddleware: LanguageModelV3Middleware = {
  wrapGenerate: async ({ doGenerate, params, model }) => {
    const startTime = Date.now()

    console.log(`[LLM] 调用模型: ${model.modelId}`)
    console.log(`[LLM] 参数:`, JSON.stringify(params.prompt).slice(0, 200))

    const result = await doGenerate()

    const duration = Date.now() - startTime
    console.log(`[LLM] 耗时: ${duration}ms`)
    console.log(`[LLM] Token 使用:`, result.usage)

    return result
  },

  wrapStream: async ({ doStream, params, model }) => {
    console.log(`[LLM-Stream] 调用模型: ${model.modelId}`)

    const { stream, ...rest } = await doStream()

    // 使用 TransformStream 拦截流式数据
    let totalChunks = 0
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        totalChunks++
        controller.enqueue(chunk)
      },
      flush() {
        console.log(`[LLM-Stream] 共 ${totalChunks} 个 chunk`)
      },
    })

    return {
      stream: stream.pipeThrough(transformStream),
      ...rest,
    }
  },
}
```

### 组合多个中间件

通过多层 `wrapLanguageModel` 组合中间件（外层先执行）：

```typescript
import { wrapLanguageModel, defaultSettingsMiddleware } from 'ai'

// 从内到外依次包裹
let model = yourBaseModel

// 第一层：默认设置
model = wrapLanguageModel({
  model,
  middleware: defaultSettingsMiddleware({
    settings: { temperature: 0.7 },
  }),
})

// 第二层：日志
model = wrapLanguageModel({
  model,
  middleware: loggingMiddleware,
})

// 第三层：缓存
model = wrapLanguageModel({
  model,
  middleware: simpleCacheMiddleware,
})

// 最终的 model 同时具备默认设置、日志和缓存能力
```

## 中间件使用场景

| 场景 | 中间件 | 说明 |
|------|--------|------|
| 提取推理过程 | `extractReasoningMiddleware` | DeepSeek 等模型的 thinking 标签 |
| 非流式转流式 | `simulateStreamingMiddleware` | 兼容不支持流式的模型 |
| 统一模型参数 | `defaultSettingsMiddleware` | 避免重复配置 |
| 响应缓存 | 自定义缓存中间件 | 减少 API 调用、降低成本 |
| 调用日志 | 自定义日志中间件 | 监控、调试、审计 |
| 安全过滤 | 自定义过滤中间件 | 输入/输出内容审核 |
| 重试逻辑 | 自定义重试中间件 | 处理瞬时错误 |

## 下一步

- [缓存与速率限制](/ai/vercel-ai-sdk/guide/caching-and-limits) — 深入了解基于中间件的缓存策略
- [错误处理与测试](/ai/vercel-ai-sdk/guide/error-handling) — 学习错误类型和测试方法
- [Provider 选型指南](/ai/vercel-ai-sdk/guide/providers) — 了解不同 Provider 的特性

---
title: 错误处理与测试
description: 掌握 AI SDK 的错误类型体系和处理模式，学习使用 Mock 工具进行单元测试。
---

# 错误处理与测试

AI 应用的错误处理和测试与传统 Web 应用有显著不同 —— LLM 调用可能超时、返回无效内容、或触发速率限制。本章介绍 AI SDK 提供的错误类型体系和测试工具。

[🔗 AI SDK 错误处理官方文档](https://ai-sdk.dev/docs/ai-sdk-core/error-handling){target="_blank" rel="noopener"}

## 错误类型体系

AI SDK 提供了一套标准化的错误类，每种错误都有 `isInstance` 静态方法用于类型判断：

### APICallError

API 调用失败时抛出，包含 HTTP 状态码和错误信息：

```typescript
import { APICallError, generateText } from 'ai'

try {
  const { text } = await generateText({
    model: 'openai/gpt-4o',
    prompt: '...',
  })
} catch (error) {
  if (APICallError.isInstance(error)) {
    console.error('API 调用失败')
    console.error('状态码:', error.statusCode)
    console.error('错误信息:', error.message)
    console.error('是否可重试:', error.isRetryable)

    // 针对不同状态码处理
    if (error.statusCode === 429) {
      // 速率限制，需要退避重试
    } else if (error.statusCode >= 500) {
      // 服务端错误，可以重试
    }
  }
}
```

### TooManyRequestsError

速率限制错误（HTTP 429）的专用类型：

```typescript
import { TooManyRequestsError } from '@ai-sdk/provider'

try {
  // LLM 调用
} catch (error) {
  if (error instanceof TooManyRequestsError) {
    const retryAfter = error.retryAfter // 重试等待时间（秒）
    console.log(`速率限制，${retryAfter} 秒后重试`)
  }
}
```

### InvalidPromptError

提示词格式错误时抛出：

```typescript
import { InvalidPromptError } from 'ai'

try {
  const { text } = await generateText({
    model: 'openai/gpt-4o',
    prompt: '', // 空提示词
  })
} catch (error) {
  if (InvalidPromptError.isInstance(error)) {
    console.error('提示词无效:', error.message)
  }
}
```

### 其他错误类型

| 错误类 | 说明 | 常见原因 |
|--------|------|----------|
| `APICallError` | API 调用失败 | 网络错误、鉴权失败、服务不可用 |
| `TooManyRequestsError` | 速率限制 | 请求频率过高 |
| `InvalidPromptError` | 提示词无效 | 格式错误、超长 |
| `InvalidResponseDataError` | 响应数据无效 | 模型返回格式不符预期 |
| `NoSuchModelError` | 模型不存在 | 模型名拼写错误 |

## 错误处理模式

### 统一错误处理

```typescript
import { APICallError, InvalidPromptError, generateText } from 'ai'

async function safeGenerate(prompt: string) {
  try {
    const { text } = await generateText({
      model: 'openai/gpt-4o',
      prompt,
    })
    return { success: true, text }
  } catch (error) {
    if (InvalidPromptError.isInstance(error)) {
      return { success: false, error: '输入格式不正确，请检查后重试' }
    }

    if (APICallError.isInstance(error)) {
      if (error.statusCode === 429) {
        return { success: false, error: '请求过于频繁，请稍后再试' }
      }
      if (error.isRetryable) {
        return { success: false, error: '服务暂时不可用，请稍后重试' }
      }
      return { success: false, error: '服务调用失败' }
    }

    // 未知错误
    console.error('未知错误:', error)
    return { success: false, error: '系统异常，请联系管理员' }
  }
}
```

### 流式错误处理

```typescript
import { streamText } from 'ai'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const result = streamText({
      model: 'openai/gpt-4o',
      messages,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    // 流式响应开始前的错误
    return new Response(
      JSON.stringify({ error: '处理请求失败' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }
}
```

### 带重试的错误处理

```typescript
import { APICallError, generateText } from 'ai'

async function generateWithRetry(
  prompt: string,
  maxRetries = 3,
) {
  let lastError: Error | undefined

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await generateText({
        model: 'openai/gpt-4o',
        prompt,
      })
    } catch (error) {
      lastError = error as Error

      if (APICallError.isInstance(error)) {
        if (!error.isRetryable) {
          throw error // 不可重试的错误直接抛出
        }
        // 指数退避
        const delay = Math.pow(2, i) * 1000
        await new Promise((r) => setTimeout(r, delay))
      } else {
        throw error // 非 API 错误直接抛出
      }
    }
  }

  throw lastError
}
```

## 测试

[🔗 AI SDK 测试官方文档](https://ai-sdk.dev/docs/ai-sdk-core/testing){target="_blank" rel="noopener"}

AI SDK 提供了 Mock 工具，让你无需真实 API 调用即可测试 AI 功能。

### MockLanguageModelV3

模拟模型的非流式和流式行为：

```typescript
import { generateText } from 'ai'
import { MockLanguageModelV3 } from 'ai/test'

// 测试 generateText
const result = await generateText({
  model: new MockLanguageModelV3({
    doGenerate: async () => ({
      text: '这是模拟的回答',
      usage: {
        inputTokens: { total: 10, noCache: 10 },
        outputTokens: { total: 20, text: 20 },
      },
      finishReason: { unified: 'stop', raw: undefined },
      response: {
        id: 'mock-id',
        timestamp: new Date(),
        modelId: 'mock-model',
      },
    }),
  }),
  prompt: '测试提示',
})

expect(result.text).toBe('这是模拟的回答')
```

### simulateReadableStream

模拟流式输出，用于测试 `streamText`：

```typescript
import { streamText, simulateReadableStream } from 'ai'
import { MockLanguageModelV3 } from 'ai/test'

const result = streamText({
  model: new MockLanguageModelV3({
    doStream: async () => ({
      stream: simulateReadableStream({
        chunks: [
          { type: 'text-start', id: 'text-1' },
          { type: 'text-delta', id: 'text-1', delta: '你好' },
          { type: 'text-delta', id: 'text-1', delta: '，' },
          { type: 'text-delta', id: 'text-1', delta: '世界！' },
          { type: 'text-end', id: 'text-1' },
          {
            type: 'finish',
            finishReason: { unified: 'stop', raw: undefined },
            logprobs: undefined,
            usage: {
              inputTokens: {
                total: 3,
                noCache: 3,
                cacheRead: undefined,
                cacheWrite: undefined,
              },
              outputTokens: {
                total: 10,
                text: 10,
                reasoning: undefined,
              },
            },
          },
        ],
      }),
    }),
  }),
  prompt: '你好',
})

// 验证流式输出
const chunks: string[] = []
for await (const chunk of result.textStream) {
  chunks.push(chunk)
}
expect(chunks.join('')).toBe('你好，世界！')
```

### 测试工具调用

```typescript
import { generateText, tool } from 'ai'
import { MockLanguageModelV3 } from 'ai/test'
import { z } from 'zod'

// 定义被测试的工具
const weatherTool = tool({
  description: '获取天气',
  inputSchema: z.object({ city: z.string() }),
  execute: async ({ city }) => ({ city, temp: 25 }),
})

// 测试工具的 execute 函数
const toolResult = await weatherTool.execute(
  { city: '北京' },
  {} as any, // 简化的上下文
)
expect(toolResult).toEqual({ city: '北京', temp: 25 })
```

### 测试错误场景

```typescript
import { generateText } from 'ai'
import { MockLanguageModelV3 } from 'ai/test'

// 模拟 API 错误
const errorModel = new MockLanguageModelV3({
  doGenerate: async () => {
    throw new Error('模拟的 API 错误')
  },
})

await expect(
  generateText({ model: errorModel, prompt: '...' }),
).rejects.toThrow('模拟的 API 错误')
```

## 测试最佳实践

1. **隔离 AI 调用** — 将 AI 调用封装在独立函数中，便于 Mock
2. **测试边界条件** — 空响应、超长输出、工具调用失败
3. **快照测试** — 对稳定的提示词模板使用快照测试
4. **E2E 测试分离** — 真实 API 调用的测试标记为集成测试，不在 CI 中频繁运行
5. **Token 用量断言** — 确保 Mock 的 usage 数据合理

## 下一步

- [部署指南](/ai/vercel-ai-sdk/guide/deployment) — 生产环境错误处理和监控
- [缓存与速率限制](/ai/vercel-ai-sdk/guide/caching-and-limits) — 防止错误的预防性措施
- [中间件系统](/ai/vercel-ai-sdk/guide/middleware) — 通过中间件统一处理错误

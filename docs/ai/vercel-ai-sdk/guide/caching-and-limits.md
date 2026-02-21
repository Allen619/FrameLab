---
title: 缓存与速率限制
description: 学习 AI SDK 中的响应缓存策略、速率限制实现和背压处理，有效控制成本并提升应用性能。
---

# 缓存与速率限制

在生产环境中，LLM 调用的成本和速率限制是必须面对的问题。本章介绍如何通过缓存减少重复调用、实施速率限制防止超额使用、以及处理背压。

[🔗 AI SDK 缓存官方文档](https://ai-sdk.dev/docs/advanced/caching){target="_blank" rel="noopener"}

## 响应缓存

### 方式一：onFinish 回调缓存

最简单的缓存方式是在 `onFinish` 回调中存储响应：

```typescript
import { convertToModelMessages, streamText, type UIMessage } from 'ai'
import { Redis } from '@upstash/redis'

export const maxDuration = 30

const redis = new Redis({
  url: process.env.KV_URL,
  token: process.env.KV_TOKEN,
})

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  // 基于消息内容生成缓存 key
  const key = JSON.stringify(messages)

  // 检查缓存
  const cached = (await redis.get(key)) as string | null
  if (cached != null) {
    return new Response(cached, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  // 调用模型
  const result = streamText({
    model: 'openai/gpt-4o',
    messages: await convertToModelMessages(messages),
    async onFinish({ text }) {
      // 缓存响应，1 小时过期
      await redis.set(key, text)
      await redis.expire(key, 60 * 60)
    },
  })

  return result.toUIMessageStreamResponse()
}
```

### 方式二：中间件层缓存

使用 Language Model Middleware 在模型调用层实现缓存，对上层代码完全透明：

```typescript
import { Redis } from '@upstash/redis'
import {
  type LanguageModelV3Middleware,
  type LanguageModelV3StreamPart,
  simulateReadableStream,
} from 'ai'

const redis = new Redis({
  url: process.env.KV_URL,
  token: process.env.KV_TOKEN,
})

export const cacheMiddleware: LanguageModelV3Middleware = {
  // 非流式调用缓存
  wrapGenerate: async ({ doGenerate, params }) => {
    const cacheKey = JSON.stringify(params)

    const cached = await redis.get(cacheKey)
    if (cached !== null) {
      return {
        ...(cached as any),
        response: {
          ...(cached as any).response,
          timestamp: (cached as any)?.response?.timestamp
            ? new Date((cached as any).response.timestamp)
            : undefined,
        },
      }
    }

    const result = await doGenerate()
    redis.set(cacheKey, result)
    return result
  },

  // 流式调用缓存
  wrapStream: async ({ doStream, params }) => {
    const cacheKey = JSON.stringify(params)

    const cached = await redis.get(cacheKey)
    if (cached !== null) {
      const formattedChunks = (cached as LanguageModelV3StreamPart[]).map(
        (p) => {
          if (p.type === 'response-metadata' && (p as any).timestamp) {
            return { ...p, timestamp: new Date((p as any).timestamp) }
          }
          return p
        },
      )
      return {
        stream: simulateReadableStream({
          initialDelayInMs: 0,
          chunkDelayInMs: 10,
          chunks: formattedChunks,
        }),
      }
    }

    const { stream, ...rest } = await doStream()

    // 收集所有 chunk 用于缓存
    const fullResponse: LanguageModelV3StreamPart[] = []
    const transformStream = new TransformStream<
      LanguageModelV3StreamPart,
      LanguageModelV3StreamPart
    >({
      transform(chunk, controller) {
        fullResponse.push(chunk)
        controller.enqueue(chunk)
      },
      flush() {
        redis.set(cacheKey, fullResponse)
      },
    })

    return {
      stream: stream.pipeThrough(transformStream),
      ...rest,
    }
  },
}
```

使用缓存中间件：

```typescript
import { wrapLanguageModel, generateText } from 'ai'
import { cacheMiddleware } from './cache-middleware'

const cachedModel = wrapLanguageModel({
  model: 'openai/gpt-4o',
  middleware: cacheMiddleware,
})

// 第一次调用 — 调用模型，缓存结果
const result1 = await generateText({
  model: cachedModel,
  prompt: '什么是 TypeScript？',
})

// 第二次相同调用 — 直接返回缓存
const result2 = await generateText({
  model: cachedModel,
  prompt: '什么是 TypeScript？',
})
```

### 缓存策略选择

| 策略 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| onFinish 回调 | 实现简单 | 只缓存最终文本 | 简单的文本缓存 |
| 中间件层 | 完整缓存（含 metadata） | 实现复杂 | 需要精确缓存的场景 |
| 本地内存 | 最快 | 重启丢失、不跨进程 | 开发环境、单进程 |
| Redis/KV | 持久化、跨进程 | 需要外部服务 | 生产环境 |

## 速率限制

### 基于用户的速率限制

```typescript
import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

const ratelimit = new Ratelimit({
  redis: new Redis({
    url: process.env.KV_URL,
    token: process.env.KV_TOKEN,
  }),
  // 每个用户每分钟最多 10 次请求
  limiter: Ratelimit.slidingWindow(10, '1m'),
})

export async function POST(req: Request) {
  // 获取用户标识
  const userId = getUserId(req)

  // 检查速率限制
  const { success, limit, remaining, reset } = await ratelimit.limit(userId)

  if (!success) {
    return new Response('请求过于频繁，请稍后再试', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
      },
    })
  }

  // 正常处理请求
  const result = streamText({
    model: 'openai/gpt-4o',
    prompt: '...',
  })

  return result.toUIMessageStreamResponse()
}
```

### 基于 Token 的预算控制

```typescript
import { generateText } from 'ai'

// Token 预算管理器
class TokenBudget {
  private used = 0

  constructor(private readonly maxTokens: number) {}

  canSpend(estimated: number): boolean {
    return this.used + estimated <= this.maxTokens
  }

  record(usage: { inputTokens: number; outputTokens: number }) {
    this.used += usage.inputTokens + usage.outputTokens
  }

  get remaining() {
    return this.maxTokens - this.used
  }
}

const dailyBudget = new TokenBudget(1_000_000) // 每日 100 万 token

export async function handleRequest(prompt: string) {
  // 预估消耗（简单按字符估算）
  const estimatedTokens = prompt.length / 2 + 500

  if (!dailyBudget.canSpend(estimatedTokens)) {
    throw new Error('今日 Token 预算已用完')
  }

  const result = await generateText({
    model: 'openai/gpt-4o',
    prompt,
  })

  // 记录实际使用量
  dailyBudget.record({
    inputTokens: result.usage.inputTokens,
    outputTokens: result.usage.outputTokens,
  })

  return result.text
}
```

## 背压处理

当 LLM Provider 返回 429（Too Many Requests）错误时，需要实施退避重试策略：

```typescript
import { generateText } from 'ai'

async function generateWithRetry(
  prompt: string,
  maxRetries = 3,
): Promise<string> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const { text } = await generateText({
        model: 'openai/gpt-4o',
        prompt,
      })
      return text
    } catch (error: any) {
      // 检查是否是速率限制错误
      if (error?.statusCode === 429 && attempt < maxRetries - 1) {
        // 指数退避
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000
        console.log(`速率限制，${delay}ms 后重试 (${attempt + 1}/${maxRetries})`)
        await new Promise((resolve) => setTimeout(resolve, delay))
        continue
      }
      throw error
    }
  }
  throw new Error('重试次数已达上限')
}
```

### 请求队列

对于高并发场景，使用队列控制并发数：

```typescript
class RequestQueue {
  private queue: Array<() => Promise<void>> = []
  private running = 0

  constructor(private readonly concurrency: number) {}

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          resolve(await fn())
        } catch (e) {
          reject(e)
        }
      })
      this.process()
    })
  }

  private async process() {
    if (this.running >= this.concurrency || this.queue.length === 0) return

    this.running++
    const fn = this.queue.shift()!
    await fn()
    this.running--
    this.process()
  }
}

// 最多同时 3 个 LLM 请求
const llmQueue = new RequestQueue(3)

// 使用
const result = await llmQueue.add(() =>
  generateText({ model: 'openai/gpt-4o', prompt: '...' }),
)
```

## 最佳实践

1. **分层缓存** — 热数据放内存，冷数据放 Redis
2. **缓存 Key 设计** — 基于 prompt + model + parameters 生成，排除时间戳等变化因素
3. **合理的 TTL** — 根据数据时效性设置过期时间
4. **监控告警** — 追踪缓存命中率、API 调用量、Token 消耗
5. **优雅降级** — 缓存服务不可用时直接调用模型，不应阻断主流程

## 下一步

- [错误处理与测试](/ai/vercel-ai-sdk/guide/error-handling) — 处理 API 调用中的各类错误
- [中间件系统](/ai/vercel-ai-sdk/guide/middleware) — 了解中间件的更多用法
- [部署指南](/ai/vercel-ai-sdk/guide/deployment) — 生产环境部署配置

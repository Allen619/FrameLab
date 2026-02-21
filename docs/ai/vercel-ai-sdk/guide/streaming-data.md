---
title: 流式自定义数据
description: 使用 createUIMessageStream 在 AI 响应流中附带自定义结构化数据
---

# 流式自定义数据

> 有时你需要在 AI 响应流中附带额外数据——处理状态通知、RAG 引用来源、实时数据更新等。[🔗 流式数据文档](https://ai-sdk.dev/docs/ai-sdk-ui/streaming-data){target="_blank" rel="noopener"} 提供了 `createUIMessageStream` API，让你在 LLM 响应流中无缝注入自定义数据部分。

## 1. 为什么需要自定义数据流

标准的 `streamText` 只传输 LLM 生成的文本。但实际应用中，你可能需要：

| 场景 | 数据类型 | 示例 |
|------|----------|------|
| **进度通知** | 瞬态状态 | "正在检索文档..."、"正在分析数据..." |
| **RAG 引用** | 来源信息 | 文档 URL、标题、相关片段 |
| **实时数据** | 动态内容 | 天气加载中 → 天气数据完成 |
| **中间结果** | 处理产物 | SQL 查询结果、API 调用响应 |

## 2. createUIMessageStream 基础

`createUIMessageStream` 让你完全控制流内容的组合：

```typescript
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  convertToModelMessages,
} from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      // 1. 写入自定义数据
      writer.write({
        type: 'data-custom',
        id: 'custom-1',
        data: { greeting: 'Hello!' },
      })

      // 2. 合并 LLM 流
      const result = streamText({
        model: openai('gpt-4o'),
        messages: convertToModelMessages(messages),
      })

      writer.merge(result.toUIMessageStream())
    },
  })

  return createUIMessageStreamResponse({ stream })
}
```

### 核心 API

| API | 作用 |
|-----|------|
| `createUIMessageStream()` | 创建可写入的 UI 消息流 |
| `createUIMessageStreamResponse()` | 将流包装为 HTTP Response |
| `writer.write()` | 向流中写入数据部分 |
| `writer.merge()` | 将另一个流合并到当前流 |

## 3. 数据部分（Data Parts）

### 3.1 写入自定义数据

自定义数据的 `type` 必须以 `data-` 为前缀：

```typescript
// 自定义数据部分
writer.write({
  type: 'data-weather',       // type 必须以 data- 开头
  id: 'weather-1',            // 用于更新同一数据的唯一 ID
  data: {                     // 任意 JSON 可序列化数据
    city: '北京',
    status: 'loading',
  },
})
```

### 3.2 数据更新（协调机制）

使用相同的 `id` 写入数据时，客户端会 **更新** 而非新增该数据部分：

```typescript
const stream = createUIMessageStream({
  execute: ({ writer }) => {
    // 1. 发送加载状态
    writer.write({
      type: 'data-weather',
      id: 'weather-1',
      data: { city: '北京', status: 'loading' },
    })

    const result = streamText({
      model: openai('gpt-4o'),
      messages: convertToModelMessages(messages),
      onFinish() {
        // 2. 流完成后更新为最终数据
        writer.write({
          type: 'data-weather',
          id: 'weather-1', // 相同 ID → 更新现有部分
          data: {
            city: '北京',
            temperature: 22,
            description: '晴',
            status: 'success',
          },
        })
      },
    })

    writer.merge(result.toUIMessageStream())
  },
})
```

### 3.3 瞬态数据（Transient Parts）

瞬态数据只在流式传输期间存在，**不会被添加到消息历史中**：

```typescript
// 瞬态通知——流完成后自动消失
writer.write({
  type: 'data-notification',
  data: { message: '正在处理你的请求...', level: 'info' },
  transient: true, // 不会保存到消息历史
})
```

适合用于：
- 处理进度指示
- 临时状态通知
- 不需要持久化的中间信息

## 4. 完整服务端示例

一个包含多种数据类型的完整 API Route：

```typescript
// app/api/chat/route.ts
import { openai } from '@ai-sdk/openai'
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  convertToModelMessages,
} from 'ai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      // 1. 发送瞬态处理通知
      writer.write({
        type: 'data-notification',
        data: { message: '正在处理你的请求...', level: 'info' },
        transient: true,
      })

      // 2. 发送 RAG 来源信息
      writer.write({
        type: 'source',
        value: {
          type: 'source',
          sourceType: 'url',
          id: 'source-1',
          url: 'https://docs.example.com/guide',
          title: '官方文档 - 入门指南',
        },
      })

      // 3. 发送数据部分（loading 状态）
      writer.write({
        type: 'data-weather',
        id: 'weather-1',
        data: { city: '北京', status: 'loading' },
      })

      // 4. 启动 LLM 流
      const result = streamText({
        model: openai('gpt-4o'),
        messages: convertToModelMessages(messages),
        onFinish() {
          // 5. 更新数据部分为最终结果
          writer.write({
            type: 'data-weather',
            id: 'weather-1',
            data: {
              city: '北京',
              temperature: 22,
              weather: '晴',
              status: 'success',
            },
          })

          // 6. 发送完成通知（瞬态）
          writer.write({
            type: 'data-notification',
            data: { message: '请求处理完成', level: 'info' },
            transient: true,
          })
        },
      })

      // 合并 LLM 流
      writer.merge(result.toUIMessageStream())
    },
  })

  return createUIMessageStreamResponse({ stream })
}
```

## 5. 客户端处理自定义数据

### 5.1 渲染 Data Parts

自定义数据会作为消息的 `parts` 出现在客户端：

```tsx
'use client'

import { useChat } from '@ai-sdk/react'
import { Weather } from '@/components/weather'

export default function Chat() {
  const { messages, sendMessage } = useChat()

  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          {message.parts.map((part, index) => {
            // 文本部分
            if (part.type === 'text') {
              return <p key={index}>{part.text}</p>
            }

            // 自定义天气数据
            if (part.type === 'data-weather') {
              if (part.data.status === 'loading') {
                return (
                  <div key={index} className="animate-pulse text-gray-400">
                    正在加载 {part.data.city} 的天气...
                  </div>
                )
              }
              return <Weather key={index} {...part.data} />
            }

            // 瞬态通知
            if (part.type === 'data-notification') {
              return (
                <div key={index} className="text-sm text-blue-500 italic">
                  {part.data.message}
                </div>
              )
            }

            // 来源链接
            if (part.type === 'source-url') {
              return (
                <a
                  key={index}
                  href={part.url}
                  target="_blank"
                  rel="noopener"
                  className="text-sm text-blue-600 underline"
                >
                  {part.title || part.url}
                </a>
              )
            }

            return null
          })}
        </div>
      ))}
    </div>
  )
}
```

### 5.2 定义类型化的 Data Parts

通过 TypeScript 类型让数据部分类型安全：

```typescript
// types/messages.ts
import type { UIMessage } from 'ai'

// 定义自定义数据部分类型
interface WeatherDataPart {
  type: 'data-weather'
  id: string
  data: {
    city: string
    temperature?: number
    weather?: string
    status: 'loading' | 'success' | 'error'
  }
}

interface NotificationDataPart {
  type: 'data-notification'
  data: {
    message: string
    level: 'info' | 'warning' | 'error'
  }
}

// 扩展 UIMessage 类型
export type MyUIMessage = UIMessage<
  Record<string, unknown>,
  WeatherDataPart | NotificationDataPart
>
```

## 6. 在非 Next.js 环境中使用

`createUIMessageStream` 不绑定 Next.js，在 Express 等环境中同样适用：

```typescript
import {
  createUIMessageStream,
  pipeUIMessageStreamToResponse,
  streamText,
} from 'ai'
import express from 'express'

const app = express()

app.post('/api/chat', async (req, res) => {
  pipeUIMessageStreamToResponse({
    response: res,
    stream: createUIMessageStream({
      execute: async ({ writer }) => {
        // 写入自定义数据
        writer.write({
          type: 'data-custom',
          data: { custom: 'Hello from Express!' },
        })

        // 合并 LLM 流
        const result = streamText({
          model: openai('gpt-4o'),
          prompt: req.body.prompt,
        })

        writer.merge(result.toUIMessageStream())
      },
    }),
  })
})

app.listen(8080)
```

## 7. 写入类型速查

| type 值 | 用途 | 是否可更新 |
|---------|------|-----------|
| `data-<name>` | 自定义结构化数据 | 相同 id 可更新 |
| `source` | RAG 引用来源 | 否 |
| `text-start` / `text-delta` / `text-end` | 手动写入文本内容 | 否 |
| 任意 type + `transient: true` | 瞬态数据（不持久化） | 否 |

## 下一步

- [流协议详解](/ai/vercel-ai-sdk/guide/stream-protocol) — 理解底层 SSE 消息格式
- [聊天进阶](/ai/vercel-ai-sdk/guide/chatbot-advanced) — 自定义数据与消息持久化的结合
- [生成式 UI](/ai/vercel-ai-sdk/guide/generative-ui) — 工具调用驱动的组件渲染

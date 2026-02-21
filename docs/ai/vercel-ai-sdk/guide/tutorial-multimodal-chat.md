---
title: 实战：多模态聊天
description: 从零构建一个支持文本对话和图片生成的多模态聊天应用，基于 Next.js 和 AI SDK。
---

# 实战：多模态聊天

本教程将构建一个多模态聊天应用：用户可以发送文本消息，AI 不仅能回复文本，还能根据需要生成图片。我们将使用 Next.js + AI SDK + DALL-E 3 实现完整功能。

[🔗 AI SDK 多模态聊天机器人指南](https://ai-sdk.dev/cookbook/guides/multi-modal-chatbot){target="_blank" rel="noopener"}

## 项目结构

```
app/
├── api/chat/route.ts    # 后端 API 路由
├── page.tsx             # 前端聊天界面
tools/
└── generate-image.ts    # 图片生成工具
```

## 环境准备

```bash
# 创建 Next.js 项目（如果还没有）
npx create-next-app@latest multimodal-chat --typescript --tailwind --app

# 安装依赖
npm install ai @ai-sdk/openai @ai-sdk/react zod
```

配置环境变量：

```bash
# .env.local
OPENAI_API_KEY=sk-your-api-key
```

## 第一步：定义图片生成工具

创建一个 AI SDK 工具，封装 DALL-E 3 图片生成能力：

```typescript
// tools/generate-image.ts
import { generateImage, tool } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

export const generateImageTool = tool({
  description: '根据文本描述生成图片',
  inputSchema: z.object({
    prompt: z.string().describe('图片描述，用英文编写效果更好'),
  }),
  execute: async ({ prompt }) => {
    const { image } = await generateImage({
      model: openai.image('dall-e-3'),
      prompt,
    })

    // 生产环境建议：将图片保存到 Blob 存储，返回 URL
    // 这里为简化演示，直接返回 base64
    return { image: image.base64, prompt }
  },
})
```

## 第二步：创建 API 路由

```typescript
// app/api/chat/route.ts
import {
  convertToModelMessages,
  type InferUITools,
  stepCountIs,
  streamText,
  type UIMessage,
} from 'ai'
import { generateImageTool } from '@/tools/generate-image'

// 注册工具
const tools = {
  generateImage: generateImageTool,
}

// 导出工具类型，供前端使用
export type ChatTools = InferUITools<typeof tools>

export async function POST(request: Request) {
  const { messages }: { messages: UIMessage[] } = await request.json()

  const result = streamText({
    model: 'openai/gpt-4o',
    system: `你是一个多模态助手。你可以回答文本问题，也可以使用 generateImage 工具生成图片。
当用户请求生成图片时，先将描述翻译为详细的英文 prompt，再调用工具。
生成图片后，用中文简要描述你生成了什么。`,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools,
  })

  return result.toUIMessageStreamResponse()
}
```

## 第三步：构建聊天界面

```typescript
// app/page.tsx
'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, type UIMessage } from 'ai'
import Image from 'next/image'
import { type FormEvent, useState } from 'react'
import type { ChatTools } from './api/chat/route'

type ChatMessage = UIMessage<never, never, ChatTools>

export default function Chat() {
  const [input, setInput] = useState('')

  const { messages, sendMessage } = useChat<ChatMessage>({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    sendMessage({
      parts: [{ type: 'text', text: input }],
    })

    setInput('')
  }

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <h1 className="text-2xl font-bold mb-4">多模态聊天</h1>

      <div className="space-y-4 mb-4">
        {messages.map((message) => (
          <div key={message.id} className="whitespace-pre-wrap">
            <div className="font-bold">
              {message.role === 'user' ? '你' : 'AI'}
            </div>

            {message.parts.map((part, partIndex) => {
              const { type } = part

              // 渲染文本内容
              if (type === 'text') {
                return (
                  <div key={`${message.id}-part-${partIndex}`}>
                    {part.text}
                  </div>
                )
              }

              // 渲染图片生成工具的结果
              if (type === 'tool-generateImage') {
                const { state, toolCallId } = part

                // 工具正在执行
                if (state === 'input-available') {
                  return (
                    <div
                      key={`${message.id}-part-${partIndex}`}
                      className="text-gray-500 italic"
                    >
                      正在生成图片...
                    </div>
                  )
                }

                // 工具执行完成，显示生成的图片
                if (state === 'output-available') {
                  const { input: toolInput, output } = part

                  return (
                    <div key={toolCallId} className="mt-2">
                      <Image
                        src={`data:image/png;base64,${output.image}`}
                        alt={toolInput.prompt}
                        height={400}
                        width={400}
                        className="rounded-lg shadow-md"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Prompt: {toolInput.prompt}
                      </p>
                    </div>
                  )
                }
              }

              return null
            })}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="fixed bottom-0 w-full max-w-md">
        <input
          className="w-full p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="输入消息，或要求生成图片..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  )
}
```

## 第四步：处理图片上传（可选）

如果需要用户上传图片进行分析，可以扩展消息格式：

```typescript
// app/page.tsx（扩展版）
'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { type FormEvent, useRef, useState } from 'react'

export default function Chat() {
  const [input, setInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const files = fileInputRef.current?.files
    const parts: any[] = [{ type: 'text', text: input }]

    // 如果有上传的图片，添加到消息中
    if (files && files.length > 0) {
      for (const file of Array.from(files)) {
        const base64 = await fileToBase64(file)
        parts.push({
          type: 'image',
          image: base64,
          mimeType: file.type,
        })
      }
    }

    sendMessage({ parts })
    setInput('')

    // 清空文件输入
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto">
      {/* 消息列表... */}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-2 border rounded"
        >
          📎
        </button>
        <input
          className="flex-1 p-2 border rounded"
          value={input}
          placeholder="输入消息..."
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          发送
        </button>
      </form>
    </div>
  )
}

// 工具函数：文件转 base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(',')[1]) // 去掉 data:image/xxx;base64, 前缀
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
```

对应的后端路由已经通过 `convertToModelMessages` 自动处理图片消息，无需额外修改。

## 使用 Google Gemini 生成图片

除了 DALL-E 3，也可以使用 Google Gemini 的图片生成能力：

```typescript
// tools/generate-image-gemini.ts
import { generateImage, tool } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'

export const generateImageToolGemini = tool({
  description: '使用 Gemini 生成图片',
  inputSchema: z.object({
    prompt: z.string().describe('图片描述'),
    aspectRatio: z
      .enum(['1:1', '16:9', '9:16', '4:3', '3:4'])
      .default('1:1')
      .describe('图片宽高比'),
  }),
  execute: async ({ prompt, aspectRatio }) => {
    const { image } = await generateImage({
      model: google.image('gemini-2.5-flash-image'),
      prompt,
      aspectRatio,
    })
    return { image: image.base64, prompt }
  },
})
```

## 运行项目

```bash
npm run dev
```

访问 `http://localhost:3000`，你可以：

1. 输入文本问题，AI 回复文本
2. 输入 "帮我画一只戴着巫师帽的猫"，AI 自动调用图片生成工具
3. 上传图片，AI 分析图片内容（GPT-4o 支持多模态输入）

## 生产环境优化

| 优化点 | 说明 |
|--------|------|
| 图片存储 | 将 base64 图片保存到 Blob 存储（如 Vercel Blob），返回 URL |
| 图片压缩 | 上传的图片进行压缩，减少 Token 消耗 |
| 并发限制 | 限制图片生成的并发数，避免 API 配额耗尽 |
| 缓存策略 | 对相同 prompt 的图片生成结果进行缓存 |
| 流式进度 | 图片生成过程中展示进度提示 |

## 下一步

- [实战：RAG Agent](/ai/vercel-ai-sdk/guide/tutorial-rag-agent) — 构建基于知识库的智能问答
- [构建 Agent](/ai/vercel-ai-sdk/guide/building-agents) — 学习 Agent 的工具循环机制
- [Provider 选型指南](/ai/vercel-ai-sdk/guide/providers) — 了解不同 Provider 的多模态能力

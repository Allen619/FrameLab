---
title: 多模态
description: 学习如何使用 AI SDK 处理多模态内容，包括图片生成、语音合成、语音转文字，以及在提示词中发送图片
---

# 多模态

## 概述

多模态（Multimodal）是指 AI 模型能够同时处理和生成多种类型的媒体——文本、图片、音频等。AI SDK 提供了一整套多模态 API：`generateImage` 用于生成图片，`generateSpeech` 用于文本转语音，`transcribe` 用于语音转文字，同时还支持在对话消息中发送图片和音频让模型理解分析。

::: tip 前端类比
多模态 API 类似于前端中的 **Media API 家族**。就像浏览器提供 `Canvas API` 处理图片、`Web Audio API` 处理音频、`MediaRecorder` 录制媒体一样，AI SDK 通过统一的函数签名提供了对图片、语音的生成和分析能力。每个函数都遵循相同的模式：传入 `model` + 输入内容，返回结果。

**AI SDK 原生语义**：`generateSpeech` 和 `transcribe` 目前还是实验性 API（需要通过 `experimental_generateSpeech` 和 `experimental_transcribe` 导入），接口可能在未来版本中调整。`generateImage` 已经是稳定 API。
:::

## 图片生成：generateImage

使用 `generateImage` 根据文本提示生成图片：

[🔗 generateImage API 参考](https://ai-sdk.dev/docs/reference/ai-sdk-core/generate-image){target="_blank" rel="noopener"}

```typescript
import { generateImage } from 'ai'
import { openai } from '@ai-sdk/openai'

const { images } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: '一只戴着程序员眼镜在电脑前写代码的猫，像素风格',
  size: '1024x1024',
})

// images 是一个数组，包含生成的图片数据
const image = images[0]
console.log(image) // 包含图片的 base64 数据或 URL
```

### 生成多张图片

```typescript
import { generateImage } from 'ai'
import { openai } from '@ai-sdk/openai'

const { images } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: '日落时分的城市天际线，赛博朋克风格',
  n: 3, // 生成 3 张
  size: '1024x1024',
})

images.forEach((image, index) => {
  console.log(`图片 ${index + 1} 已生成`)
})
```

### 常用参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `model` | `ImageModelV3` | 图片模型，如 `openai.image('dall-e-3')` |
| `prompt` | `string` | 图片描述提示词 |
| `n` | `number` | 生成图片数量 |
| `size` | `string` | 图片尺寸，如 `'1024x1024'` |
| `aspectRatio` | `string` | 宽高比，如 `'16:9'` |
| `seed` | `number` | 随机种子，用于可复现的生成 |

## 语音合成：generateSpeech

使用 `generateSpeech`（实验性 API）将文本转换为语音音频：

[🔗 generateSpeech API 参考](https://ai-sdk.dev/docs/reference/ai-sdk-core/generate-speech){target="_blank" rel="noopener"}

```typescript
import { experimental_generateSpeech as generateSpeech } from 'ai'
import { openai } from '@ai-sdk/openai'

const { audio } = await generateSpeech({
  model: openai.speech('tts-1'),
  text: '你好，欢迎使用 AI SDK！这是一段由 AI 生成的语音。',
  voice: 'alloy',
})

// audio 是 Uint8Array 格式的音频数据
console.log(`音频大小: ${audio.length} bytes`)
```

### 可用声音和参数

```typescript
import { experimental_generateSpeech as generateSpeech } from 'ai'
import { openai } from '@ai-sdk/openai'
import { writeFile } from 'fs/promises'

const { audio } = await generateSpeech({
  model: openai.speech('tts-1'),
  text: '这是一段演示文本。',
  voice: 'nova', // 可选: alloy, echo, fable, onyx, nova, shimmer
  outputFormat: 'mp3', // 输出格式: mp3, wav 等
  speed: 1.0, // 语速: 0.25 - 4.0
})

// 保存为音频文件
await writeFile('output.mp3', Buffer.from(audio))
console.log('音频已保存为 output.mp3')
```

## 语音转文字：transcribe

使用 `transcribe`（实验性 API）将音频文件转换为文本：

[🔗 transcribe API 参考](https://ai-sdk.dev/docs/reference/ai-sdk-core/transcribe){target="_blank" rel="noopener"}

```typescript
import { experimental_transcribe as transcribe } from 'ai'
import { openai } from '@ai-sdk/openai'
import { readFile } from 'fs/promises'

const { text, segments, language, durationInSeconds } = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: await readFile('meeting-recording.mp3'),
})

console.log(`语言: ${language}`) // "zh"
console.log(`时长: ${durationInSeconds} 秒`)
console.log(`转录文本: ${text}`)

// segments 包含带时间戳的分段信息
segments?.forEach((segment) => {
  console.log(
    `[${segment.startSecond}s - ${segment.endSecond}s] ${segment.text}`
  )
})
```

### 从 URL 转录

```typescript
import { experimental_transcribe as transcribe } from 'ai'
import { openai } from '@ai-sdk/openai'

const { text } = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: new URL('https://example.com/audio/recording.mp3'),
})

console.log(text)
```

## 多模态提示：在消息中发送图片

许多模型（如 GPT-4o、Claude 3.5）支持直接在对话中发送图片，让模型"看懂"图片内容：

### 通过 URL 发送图片

```typescript
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

const { text } = await generateText({
  model: openai('gpt-4o'),
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: '描述这张图片的内容。' },
        {
          type: 'file',
          mediaType: 'image/png',
          url: 'https://example.com/photo.png',
        },
      ],
    },
  ],
})

console.log(text) // 模型对图片内容的描述
```

### 通过 Base64 发送图片

```typescript
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { readFileSync } from 'fs'

const imageBuffer = readFileSync('./screenshot.png')

const { text } = await generateText({
  model: openai('gpt-4o'),
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: '这个截图中有什么 UI 问题？' },
        {
          type: 'file',
          mediaType: 'image/png',
          data: imageBuffer,
        },
      ],
    },
  ],
})

console.log(text)
```

### 发送音频文件

部分模型（如 `gpt-4o-audio-preview`）还支持直接分析音频内容：

```typescript
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { readFileSync } from 'fs'

const { text } = await generateText({
  model: openai('gpt-4o-audio-preview'),
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: '这段音频在说什么？' },
        {
          type: 'file',
          mediaType: 'audio/mpeg',
          data: readFileSync('./recording.mp3'),
        },
      ],
    },
  ],
})

console.log(text)
```

## 多模态能力一览

| 能力 | 函数 | 输入 | 输出 | 状态 |
| --- | --- | --- | --- | --- |
| 文本 → 图片 | `generateImage` | 文本提示 | 图片数据 | 稳定 |
| 文本 → 语音 | `generateSpeech` | 文本 | 音频数据 | 实验性 |
| 语音 → 文本 | `transcribe` | 音频文件 | 文本 + 时间戳 | 实验性 |
| 图片 → 文本 | `generateText` (多模态消息) | 图片 + 提示 | 文本描述 | 稳定 |
| 音频 → 文本 | `generateText` (多模态消息) | 音频 + 提示 | 文本分析 | 稳定 |

## 在 Next.js 中处理多模态

### 图片分析聊天界面

前端组件可以通过 `useChat` 发送包含图片的消息：

```typescript
// app/api/chat/route.ts
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
  })

  return result.toUIMessageStreamResponse()
}
```

```typescript
// app/page.tsx
'use client'

import { useChat } from '@ai-sdk/react'
import { useState } from 'react'

export default function Chat() {
  const [imageUrl, setImageUrl] = useState('')
  const { messages, input, setInput, sendMessage } = useChat()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage({
      role: 'user',
      parts: [
        ...(imageUrl
          ? [{ type: 'file' as const, mediaType: 'image/png', url: imageUrl }]
          : []),
        { type: 'text' as const, text: input },
      ],
    })
    setInput('')
    setImageUrl('')
  }

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>
          <strong>{m.role === 'user' ? '你' : 'AI'}:</strong>
          {m.parts.map((part, i) => {
            if (part.type === 'text') return <p key={i}>{part.text}</p>
            if (part.type === 'file')
              return <img key={i} src={part.url} alt="uploaded" />
            return null
          })}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="图片 URL（可选）"
        />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="描述你想了解的内容..."
        />
        <button type="submit">发送</button>
      </form>
    </div>
  )
}
```

## 最佳实践

1. **图片提示词要具体**：`generateImage` 的提示词越详细，生成效果越好。包含风格、色调、构图等描述
2. **音频格式匹配**：不同模型支持的音频格式不同，OpenAI Whisper 支持 mp3、mp4、wav 等
3. **图片大小控制**：发送图片给模型时注意文件大小，过大的图片会增加 token 消耗和延迟
4. **实验性 API 注意事项**：`generateSpeech` 和 `transcribe` 是实验性 API，需要通过 `experimental_` 前缀导入，接口可能在未来版本变更
5. **多模态消息的 content 格式**：发送多模态消息时，`content` 必须是数组格式（包含 `type: 'text'` 和 `type: 'file'` 等 part）

## 下一步

- [文本生成](/ai/vercel-ai-sdk/guide/generating-text) — 回顾文本生成的基础用法
- [工具调用](/ai/vercel-ai-sdk/guide/tool-calling) — 将多模态能力封装为工具供模型调用
- [向量嵌入](/ai/vercel-ai-sdk/guide/embeddings) — 学习语义搜索和 RAG 检索

---
title: Provider 选型指南
description: 全面了解 AI SDK 的 Provider 架构，掌握 OpenAI、Anthropic、DeepSeek、Google AI 等主流 Provider 的配置方法和选型策略。
---

# Provider 选型指南

AI SDK 的 Provider 架构将模型调用抽象为统一接口，让你可以轻松切换不同的 LLM 提供商，而无需修改业务代码。

[🔗 AI SDK Provider 与模型官方文档](https://ai-sdk.dev/docs/foundations/providers-and-models){target="_blank" rel="noopener"}

## Provider 架构

::: tip 前端类比
Provider 就像前端中的适配器模式（Adapter Pattern）。就像 Axios 可以在 Node.js 中使用 http 模块、在浏览器中使用 XMLHttpRequest，AI SDK 的 Provider 让同一套代码可以对接不同的 LLM 服务。
:::

AI SDK 的 Provider 系统有三层：

1. **Provider 包** — 各厂商的 SDK 适配器（如 `@ai-sdk/openai`）
2. **Provider 实例** — 配置好 API Key 等参数的 Provider 对象
3. **模型实例** — 从 Provider 获取的具体模型（如 `gpt-4o`）

```typescript
// 1. 安装 Provider 包
// npm install @ai-sdk/openai

// 2. 创建 Provider 实例
import { createOpenAI } from '@ai-sdk/openai'
const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })

// 3. 使用模型
import { generateText } from 'ai'
const { text } = await generateText({
  model: openai('gpt-4o'),
  prompt: '你好',
})
```

## 主流 Provider 配置

### OpenAI

```bash
npm install @ai-sdk/openai
```

```typescript
import { createOpenAI } from '@ai-sdk/openai'

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // 可选配置
  // baseURL: 'https://your-proxy.com/v1',
  // headers: { 'X-Custom-Header': 'value' },
  // organization: 'org-xxx',
})

// 使用模型
const model = openai('gpt-4o')
const miniModel = openai('gpt-4o-mini')

// 也可以使用字符串格式（全局 Provider）
import { generateText } from 'ai'
const { text } = await generateText({
  model: 'openai/gpt-4o',
  prompt: '你好',
})
```

**推荐模型：**

| 模型 | 特点 | 适用场景 |
|------|------|----------|
| `gpt-4o` | 旗舰多模态模型 | 复杂推理、多模态任务 |
| `gpt-4o-mini` | 高性价比 | 简单任务、大量调用 |
| `o4-mini` | 推理模型 | 复杂推理、编码 |

### Anthropic

```bash
npm install @ai-sdk/anthropic
```

```typescript
import { createAnthropic } from '@ai-sdk/anthropic'

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const model = anthropic('claude-sonnet-4-5')
```

**推荐模型：**

| 模型 | 特点 | 适用场景 |
|------|------|----------|
| `claude-sonnet-4-5` | 最新旗舰 | 复杂任务、长文本 |
| `claude-haiku-4.5` | 快速、低成本 | 分类、摘要、简单对话 |

### DeepSeek

```bash
npm install @ai-sdk/deepseek
```

```typescript
import { createDeepSeek } from '@ai-sdk/deepseek'

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
})

const model = deepseek('deepseek-chat')
const reasoner = deepseek('deepseek-reasoner')
```

**推荐模型：**

| 模型 | 特点 | 适用场景 |
|------|------|----------|
| `deepseek-chat` | 高性价比通用模型 | 一般对话、编码 |
| `deepseek-reasoner` | 推理增强 | 复杂推理任务 |

### Google AI

```bash
npm install @ai-sdk/google
```

```typescript
import { createGoogleGenerativeAI } from '@ai-sdk/google'

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
})

const model = google('gemini-2.5-flash')
```

**推荐模型：**

| 模型 | 特点 | 适用场景 |
|------|------|----------|
| `gemini-2.5-flash` | 快速、多模态 | 通用任务、图片理解 |
| `gemini-2.5-pro` | 高级推理 | 复杂推理、长上下文 |

## Provider Registry

当项目需要使用多个 Provider 时，可以通过 Provider Registry 统一管理：

```typescript
import { anthropic } from '@ai-sdk/anthropic'
import { createOpenAI } from '@ai-sdk/openai'
import { createProviderRegistry } from 'ai'

export const registry = createProviderRegistry({
  // 使用默认配置注册
  anthropic,

  // 使用自定义配置注册
  openai: createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  }),
})

// 通过 registry 获取模型
const model = registry.languageModel('openai:gpt-4o')
const anthropicModel = registry.languageModel('anthropic:claude-sonnet-4-5')
```

Registry 的优势：

- 集中管理所有 Provider 配置
- 通过字符串引用模型，便于配置化
- 适合需要动态切换模型的场景

## 自定义 Provider

对于未被官方支持的 LLM 服务，可以创建自定义 Provider：

```typescript
import { createOpenAI } from '@ai-sdk/openai'

// 很多 LLM 服务兼容 OpenAI API 格式
const customProvider = createOpenAI({
  apiKey: process.env.CUSTOM_API_KEY,
  baseURL: 'https://your-custom-llm-service.com/v1',
  headers: {
    'X-Custom-Auth': 'your-token',
  },
})

// 像使用 OpenAI 一样使用自定义 Provider
const model = customProvider('your-model-name')
```

## Provider 选型对比

| 维度 | OpenAI | Anthropic | DeepSeek | Google |
|------|--------|-----------|----------|--------|
| 综合能力 | 优秀 | 优秀 | 良好 | 优秀 |
| 中文能力 | 优秀 | 良好 | 优秀 | 良好 |
| 性价比 | 中等 | 中等 | 极高 | 高 |
| 上下文长度 | 128K | 200K | 128K | 1M+ |
| 多模态 | 图片+音频 | 图片 | 文本为主 | 图片+视频 |
| 推理能力 | o4-mini 强 | Claude 强 | Reasoner 强 | Gemini 强 |
| 生态支持 | 最完善 | 完善 | 发展中 | 完善 |

### 选型建议

- **追求最佳效果** → OpenAI GPT-4o 或 Anthropic Claude Sonnet
- **追求性价比** → DeepSeek Chat 或 Google Gemini Flash
- **中文场景优先** → DeepSeek 或 OpenAI
- **长上下文场景** → Google Gemini（100 万 token 上下文）
- **复杂推理** → OpenAI o4-mini 或 DeepSeek Reasoner

## 下一步

- [中间件系统](/ai/vercel-ai-sdk/guide/middleware) — 学习如何通过中间件增强和定制模型行为
- [缓存与速率限制](/ai/vercel-ai-sdk/guide/caching-and-limits) — 了解 Provider 层面的缓存和限流策略
- [错误处理与测试](/ai/vercel-ai-sdk/guide/error-handling) — 掌握 Provider 相关的错误处理

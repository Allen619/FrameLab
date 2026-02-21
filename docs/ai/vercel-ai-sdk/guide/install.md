---
title: 安装与配置
description: 安装 AI SDK 核心包和 Provider，配置开发环境
---

# 安装与配置

本页指导你完成 AI SDK 的安装和基础配置，包括依赖安装、环境变量设置和项目结构建议。

## 1. 前置要求

| 依赖 | 最低版本 | 说明 |
|------|---------|------|
| **Node.js** | 18+ | 推荐 20 LTS 或更高 |
| **TypeScript** | 5.0+ | AI SDK 深度依赖 TS 类型推导 |
| **包管理器** | pnpm / npm / yarn / bun | 推荐 pnpm |
| **React** | 18+ | 使用 AI SDK UI 时需要 |
| **Next.js** | 14+ | 快速上手教程基于 App Router |

::: tip 前端类比
AI SDK 的环境要求和前端项目完全一致——Node.js + TypeScript + 你熟悉的框架。不需要安装 Python、CUDA 或任何 ML 相关工具链。
:::

**AI SDK 原生语义**：AI SDK 是纯 TypeScript 库，所有 AI 计算都在云端模型厂商的 API 服务上完成。你的本地环境只需要能运行 Node.js 和发起 HTTP 请求。

## 2. 安装核心包

### 2.1 AI SDK Core

`ai` 包是核心包，提供 `streamText`、`generateText`、`generateObject` 等服务端函数：

```bash
# 使用 pnpm（推荐）
pnpm add ai

# 或使用 npm
npm install ai

# 或使用 yarn
yarn add ai

# 或使用 bun
bun add ai
```

### 2.2 AI SDK UI（React）

`@ai-sdk/react` 提供 React Hooks（`useChat`、`useCompletion` 等）：

```bash
pnpm add @ai-sdk/react
```

### 2.3 安装 Provider

Provider 是模型厂商的适配包。根据你使用的模型安装对应的 Provider：

```bash
# OpenAI（GPT-4o、o1 等）
pnpm add @ai-sdk/openai

# Anthropic（Claude 系列）
pnpm add @ai-sdk/anthropic

# Google（Gemini 系列）
pnpm add @ai-sdk/google

# Mistral
pnpm add @ai-sdk/mistral
```

**一步到位安装**（以 OpenAI + Next.js 为例）：

```bash
pnpm add ai @ai-sdk/react @ai-sdk/openai
```

::: tip 前端类比
Provider 的概念类似于前端的数据库 ORM 适配器。就像 Prisma 可以适配 PostgreSQL / MySQL / SQLite 一样，AI SDK 通过不同的 Provider 适配 OpenAI / Anthropic / Google 等模型厂商。核心 API 保持不变，只需换一个 Provider。
:::

### 2.4 Zod（Schema 校验）

AI SDK 的结构化输出和工具定义依赖 Zod 做 Schema 校验：

```bash
pnpm add zod
```

## 3. 环境变量配置

### 3.1 创建 `.env.local`

在项目根目录创建 `.env.local` 文件，存放 API Key：

```bash
# .env.local

# OpenAI
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx

# Anthropic
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx

# Google
GOOGLE_GENERATIVE_AI_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
```

::: warning 安全提示
- **永远不要**将 API Key 提交到 Git 仓库
- 确保 `.env.local` 已添加到 `.gitignore`
- Next.js 项目中，`.env.local` 会自动被 gitignore
- 以 `NEXT_PUBLIC_` 开头的变量会暴露给浏览器，**API Key 绝不能**使用此前缀
:::

### 3.2 环境变量命名约定

AI SDK 的各 Provider 默认读取特定的环境变量名：

| Provider | 环境变量名 | 获取方式 |
|----------|-----------|---------|
| `@ai-sdk/openai` | `OPENAI_API_KEY` | [platform.openai.com](https://platform.openai.com/api-keys){target="_blank" rel="noopener"} |
| `@ai-sdk/anthropic` | `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com/){target="_blank" rel="noopener"} |
| `@ai-sdk/google` | `GOOGLE_GENERATIVE_AI_API_KEY` | [aistudio.google.com](https://aistudio.google.com/app/apikey){target="_blank" rel="noopener"} |
| `@ai-sdk/mistral` | `MISTRAL_API_KEY` | [console.mistral.ai](https://console.mistral.ai/){target="_blank" rel="noopener"} |

只要环境变量名称正确，Provider 会自动读取，无需在代码中显式传入 Key。

### 3.3 自定义配置

如果你需要使用自定义 API Key 或 Base URL（例如代理、私有部署），可以使用 `createOpenAI` 等工厂函数：

```typescript
import { createOpenAI } from '@ai-sdk/openai'

const openai = createOpenAI({
  apiKey: process.env.MY_CUSTOM_OPENAI_KEY,
  baseURL: 'https://my-proxy.example.com/v1',
})

// 使用自定义实例
const model = openai('gpt-4o')
```

## 4. 项目结构建议

以 Next.js App Router 项目为例，推荐的目录结构：

```
my-ai-app/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # AI API Route Handler
│   ├── page.tsx                   # 聊天页面（使用 useChat）
│   └── layout.tsx                 # 根布局
├── lib/
│   ├── ai/
│   │   ├── models.ts             # 模型配置与实例化
│   │   └── tools.ts              # 工具定义
│   └── utils.ts                  # 工具函数
├── components/
│   ├── chat/
│   │   ├── ChatMessage.tsx       # 消息组件
│   │   └── ChatInput.tsx         # 输入组件
│   └── ui/                       # 通用 UI 组件
├── .env.local                     # 环境变量（不提交）
├── package.json
└── tsconfig.json
```

**关键约定**：
- **API Route** 放在 `app/api/` 下，处理服务端 AI 调用
- **模型配置** 集中在 `lib/ai/` 中，方便统一管理和切换 Provider
- **工具定义** 独立为文件，便于复用和测试
- **UI 组件** 按功能模块组织，聊天相关组件放在 `components/chat/`

## 5. 验证安装

创建一个简单的脚本验证安装是否成功：

```typescript
// test-ai.ts
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

async function main() {
  const { text } = await generateText({
    model: openai('gpt-4o'),
    prompt: '用一句话介绍自己',
  })
  console.log(text)
}

main()
```

使用 `tsx` 运行：

```bash
# 安装 tsx（TypeScript 执行器）
pnpm add -D tsx

# 运行测试脚本
npx tsx test-ai.ts
```

如果能看到 AI 的回复，说明安装和配置都正确。

## 下一步

- [快速上手](/ai/vercel-ai-sdk/guide/quickstart) — 用 Next.js 构建完整的 AI 聊天应用
- [基础概念](/ai/vercel-ai-sdk/guide/foundations) — 深入理解 Provider、Prompt、Tool、Streaming
- [AI SDK 库导航](https://ai-sdk.dev/docs/getting-started/navigating-the-library){target="_blank" rel="noopener"} — 官方包结构说明

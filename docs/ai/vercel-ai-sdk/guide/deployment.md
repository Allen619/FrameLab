---
title: 部署指南
description: 学习如何将 AI SDK 应用部署到 Vercel、Node.js 等环境，掌握环境变量管理、超时处理和 Edge Runtime 配置。
---

# 部署指南

本章介绍将 AI SDK 应用部署到生产环境的关键配置，包括 Vercel 部署、Node.js 独立部署、超时处理和运行时选择。

[🔗 AI SDK Vercel 部署指南](https://ai-sdk.dev/docs/advanced/vercel-deployment-guide){target="_blank" rel="noopener"}

## Vercel 部署（推荐）

Vercel 是 AI SDK 的推荐部署平台，提供了开箱即用的 Serverless 和 Edge 运行时支持。

### 基础部署

```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
vercel
```

### 超时配置

Vercel 的 Fluid Compute 默认函数超时为 **5 分钟（300 秒）**，对大多数流式应用已经足够。如需更长超时：

**方式一：在 Next.js 路由中配置**

```typescript
// app/api/chat/route.ts
import { streamText, convertToModelMessages, type UIMessage } from 'ai'

// 设置最大执行时间（秒）
export const maxDuration = 600 // 10 分钟，需要 Pro 或 Enterprise 计划

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: 'openai/gpt-4o',
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}
```

**方式二：在 vercel.json 中配置**

```json
{
  "functions": {
    "api/chat/route.ts": {
      "maxDuration": 600
    }
  }
}
```

> 超过 300 秒需要 Vercel Pro 或 Enterprise 计划。

### 流式响应配置

部署后流式不工作时，需要添加传输编码头：

```typescript
export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: 'openai/gpt-4o',
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse({
    headers: {
      'Transfer-Encoding': 'chunked',
      Connection: 'keep-alive',
    },
  })
}
```

## Node.js 独立部署

### Express 服务器

```typescript
import express from 'express'
import { streamText, convertToModelMessages } from 'ai'

const app = express()
app.use(express.json())

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body

  const result = streamText({
    model: 'openai/gpt-4o',
    messages: await convertToModelMessages(messages),
  })

  // 设置流式响应头
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  // 将 AI SDK 的流写入响应
  const stream = result.toDataStream()
  const reader = stream.getReader()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    res.write(value)
  }

  res.end()
})

app.listen(3000, () => {
  console.log('服务运行在 http://localhost:3000')
})
```

### Docker 部署

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  ai-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - NODE_ENV=production
    restart: unless-stopped
```

## 环境变量管理

### 必要的环境变量

```bash
# .env.local（本地开发，不提交到 Git）

# LLM Provider API Keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
DEEPSEEK_API_KEY=sk-...
GOOGLE_API_KEY=AIza...

# 缓存（可选）
KV_URL=https://...
KV_TOKEN=...

# 应用配置
NODE_ENV=production
```

### Vercel 环境变量配置

```bash
# 通过 CLI 设置
vercel env add OPENAI_API_KEY

# 或在 Vercel Dashboard → Settings → Environment Variables 中配置
```

### 安全最佳实践

1. **永远不要在客户端暴露 API Key** — 所有 LLM 调用必须在服务端进行
2. **使用环境变量** — 不要硬编码 Key
3. **区分环境** — 开发/预览/生产使用不同的 Key
4. **Key 轮换** — 定期更换 API Key
5. **权限最小化** — 每个 Key 只授予必要的权限

```typescript
// 服务端路由 — 安全
export async function POST(req: Request) {
  const result = await generateText({
    model: 'openai/gpt-4o', // API Key 从环境变量读取
    prompt: '...',
  })
  return new Response(result.text)
}

// ❌ 错误：永远不要在客户端代码中使用 API Key
// const openai = createOpenAI({ apiKey: 'sk-...' })
```

## Edge Runtime

Edge Runtime 运行在 CDN 边缘节点，提供更低的延迟：

```typescript
// app/api/chat/route.ts

// 使用 Edge Runtime
export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: 'openai/gpt-4o',
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}
```

### Edge vs Node.js Runtime

| 特性 | Edge Runtime | Node.js Runtime |
|------|-------------|-----------------|
| 冷启动 | 极快（< 50ms） | 较慢（100-500ms） |
| 执行时间限制 | 通常 30 秒 | 可配置到 10 分钟 |
| Node.js API | 部分支持 | 完全支持 |
| 文件系统 | 不支持 | 支持 |
| 流式支持 | 原生支持 | 支持 |
| 适用场景 | 简单的流式聊天 | 复杂的 Agent、RAG |

**选择建议：**

- 简单的对话式 AI → Edge Runtime（低延迟）
- 复杂的 Agent / RAG / 文件处理 → Node.js Runtime（功能完整）
- 长时间运行的任务 → Node.js Runtime（更长超时）

## 生产环境检查清单

### 部署前

- [ ] 所有 API Key 配置为环境变量
- [ ] 设置合理的 `maxDuration` 超时
- [ ] 实施速率限制
- [ ] 添加错误处理和日志
- [ ] 配置缓存策略

### 部署后

- [ ] 验证流式响应正常工作
- [ ] 检查错误监控和告警
- [ ] 测试超时场景
- [ ] 监控 Token 使用量和成本
- [ ] 验证 CORS 配置（如果前后端分离）

### 性能优化

```typescript
// 1. 启用流式响应 — 降低首字节时间（TTFB）
const result = streamText({
  model: 'openai/gpt-4o',
  messages,
})

// 2. 选择合适的模型 — 简单任务用小模型
const model =
  taskComplexity === 'simple' ? 'openai/gpt-4o-mini' : 'openai/gpt-4o'

// 3. 设置合理的 maxOutputTokens — 避免浪费
const result = await generateText({
  model: 'openai/gpt-4o',
  maxOutputTokens: 500, // 按需设置
  prompt: '...',
})
```

## 下一步

- [缓存与速率限制](/ai/vercel-ai-sdk/guide/caching-and-limits) — 深入了解生产环境的缓存和限流
- [错误处理与测试](/ai/vercel-ai-sdk/guide/error-handling) — 完善错误处理机制
- [Provider 选型指南](/ai/vercel-ai-sdk/guide/providers) — 选择最适合部署需求的 Provider

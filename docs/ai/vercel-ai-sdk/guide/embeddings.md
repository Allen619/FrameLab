---
title: 向量嵌入
description: 学习如何使用 AI SDK 的 embed 和 embedMany 函数生成向量嵌入，实现语义搜索和 RAG 检索
---

# 向量嵌入

## 概述

向量嵌入（Embeddings）是将文本转换为高维数值向量的技术。在向量空间中，语义相近的文本会被映射到相邻的位置——这意味着"猫"和"狗"的向量会比"猫"和"汽车"更接近。AI SDK 提供了 `embed` 和 `embedMany` 两个函数来生成向量嵌入，并提供 `cosineSimilarity` 工具函数来计算向量相似度。

[🔗 Embeddings 文档](https://ai-sdk.dev/docs/ai-sdk-core/embeddings){target="_blank" rel="noopener"}

::: tip 前端类比
向量嵌入类似于前端搜索中的 **TF-IDF 或 Fuzzy Search 的高级版本**。传统的 `Fuse.js` 模糊搜索基于字符串相似度匹配，而向量嵌入基于**语义相似度**——即使用词完全不同，只要意思相近就能匹配上。例如搜索"如何部署前端应用"也能匹配到"把网站发布到服务器"。

**AI SDK 原生语义**：嵌入模型和聊天模型是不同的模型类型。嵌入模型不生成文本，它的唯一任务是将输入映射为固定维度的数值向量。AI SDK 通过统一的 Provider 接口（如 `openai.embedding()`）来创建嵌入模型实例。
:::

## embed：单文本嵌入

将单个文本转换为向量，适合查询时使用：

```typescript
import { embed } from 'ai'
import { openai } from '@ai-sdk/openai'

const { embedding } = await embed({
  model: openai.embedding('text-embedding-3-small'),
  value: '什么是 React Server Components？',
})

// embedding 是一个 number[] 数组，如 [0.0023, -0.0145, 0.0378, ...]
console.log(`向量维度: ${embedding.length}`) // 1536（取决于模型）
```

## embedMany：批量嵌入

将多个文本一次性转换为向量，适合构建索引时使用：

```typescript
import { embedMany } from 'ai'
import { openai } from '@ai-sdk/openai'

const { embeddings } = await embedMany({
  model: openai.embedding('text-embedding-3-small'),
  values: [
    '阳光明媚的海滩',
    '城市里的雨天午后',
    '雪山上的寒冷夜晚',
  ],
})

// embeddings 是一个 number[][] 数组，顺序与输入一致
console.log(`生成了 ${embeddings.length} 个嵌入向量`)
embeddings.forEach((emb, i) => {
  console.log(`向量 ${i}: 维度 ${emb.length}`)
})
```

### 批量嵌入的性能优化

`embedMany` 会根据模型限制自动分批处理请求，你还可以控制并发数：

```typescript
import { embedMany } from 'ai'
import { openai } from '@ai-sdk/openai'

const { embeddings } = await embedMany({
  model: openai.embedding('text-embedding-3-small'),
  values: largeTextArray, // 比如 1000 条文本
  maxParallelCalls: 5, // 最多 5 个并发请求
})
```

## cosineSimilarity：计算相似度

余弦相似度（Cosine Similarity）用于衡量两个向量的语义相似程度，值域为 [-1, 1]：

- **1** 表示完全相同
- **0** 表示无关
- **-1** 表示完全相反

```typescript
import { cosineSimilarity, embedMany } from 'ai'
import { openai } from '@ai-sdk/openai'

const { embeddings } = await embedMany({
  model: openai.embedding('text-embedding-3-small'),
  values: ['阳光明媚的海滩', '城市里的雨天午后'],
})

const similarity = cosineSimilarity(embeddings[0], embeddings[1])
console.log(`余弦相似度: ${similarity}`) // 例如 0.42
```

## 实战：语义搜索

向量嵌入最常见的应用是语义搜索——基于含义（而非关键词）来查找相关内容：

```typescript
import { embed, embedMany, cosineSimilarity } from 'ai'
import { openai } from '@ai-sdk/openai'

// 1. 准备知识库文档
const documents = [
  'React 是一个用于构建用户界面的 JavaScript 库',
  'Vue.js 是一个渐进式的前端框架',
  'Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时',
  'TypeScript 是 JavaScript 的超集，添加了静态类型',
  'Next.js 是一个基于 React 的全栈框架',
]

// 2. 为所有文档生成嵌入向量
const { embeddings: docEmbeddings } = await embedMany({
  model: openai.embedding('text-embedding-3-small'),
  values: documents,
})

// 3. 用户查询
const query = '前端框架有哪些选择？'
const { embedding: queryEmbedding } = await embed({
  model: openai.embedding('text-embedding-3-small'),
  value: query,
})

// 4. 计算相似度并排序
const results = documents
  .map((doc, index) => ({
    document: doc,
    similarity: cosineSimilarity(queryEmbedding, docEmbeddings[index]),
  }))
  .sort((a, b) => b.similarity - a.similarity)

// 5. 返回最相关的结果
console.log('查询:', query)
results.slice(0, 3).forEach((r, i) => {
  console.log(`${i + 1}. [${r.similarity.toFixed(4)}] ${r.document}`)
})
```

## 实战：RAG 检索增强生成

RAG（Retrieval-Augmented Generation）将语义搜索与文本生成结合，先检索相关文档，再让 LLM 基于这些文档生成回答：

```typescript
import { embed, embedMany, cosineSimilarity, generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

// 假设已有文档和对应的嵌入向量
const knowledgeBase = [
  { content: 'AI SDK 支持 OpenAI、Anthropic、Google 等多个模型提供商。', embedding: [] as number[] },
  { content: 'streamText 函数用于流式文本生成，返回 AsyncIterable。', embedding: [] as number[] },
  { content: 'tool() 函数用于定义工具，需要 description、inputSchema 和 execute。', embedding: [] as number[] },
]

// 1. 为知识库生成嵌入（实际应用中这一步通常在索引阶段完成）
const { embeddings } = await embedMany({
  model: openai.embedding('text-embedding-3-small'),
  values: knowledgeBase.map((doc) => doc.content),
})
knowledgeBase.forEach((doc, i) => {
  doc.embedding = embeddings[i]
})

// 2. 用户提问
const userQuestion = 'AI SDK 怎么做流式输出？'

// 3. 检索相关文档
const { embedding: questionEmbedding } = await embed({
  model: openai.embedding('text-embedding-3-small'),
  value: userQuestion,
})

const relevantDocs = knowledgeBase
  .map((doc) => ({
    content: doc.content,
    similarity: cosineSimilarity(questionEmbedding, doc.embedding),
  }))
  .filter((doc) => doc.similarity > 0.5)
  .sort((a, b) => b.similarity - a.similarity)
  .slice(0, 3)

// 4. 基于检索结果生成回答
const context = relevantDocs.map((d) => d.content).join('\n')

const { text } = await generateText({
  model: openai('gpt-4o'),
  system: `你是一个技术文档助手。基于以下参考文档回答用户问题。
如果参考文档中没有相关信息，请如实说明。

参考文档：
${context}`,
  prompt: userQuestion,
})

console.log(text)
```

## 文本分块策略

对于长文档，需要先分块再嵌入。分块的粒度直接影响搜索质量：

```typescript
/**
 * 将长文本按句号分块
 * 实际项目中通常使用更智能的分块策略（如按段落、按 token 数等）
 */
function generateChunks(input: string): string[] {
  return input
    .trim()
    .split('。')
    .filter((chunk) => chunk.trim() !== '')
    .map((chunk) => chunk.trim() + '。')
}

// 使用
const longText = '第一个知识点。第二个知识点。第三个知识点。'
const chunks = generateChunks(longText)
// ['第一个知识点。', '第二个知识点。', '第三个知识点。']
```

## 选择嵌入模型

| 模型 | 提供商 | 维度 | 特点 |
| --- | --- | --- | --- |
| `text-embedding-3-small` | OpenAI | 1536 | 性价比最高，适合大多数场景 |
| `text-embedding-3-large` | OpenAI | 3072 | 精度更高，适合高质量检索 |
| `text-embedding-ada-002` | OpenAI | 1536 | 旧版模型，兼容性好 |

## 最佳实践

1. **查询和文档使用同一模型**：生成查询嵌入和文档嵌入必须使用相同的嵌入模型，否则向量空间不同，相似度计算无意义
2. **合理分块**：分块太大会稀释语义信息，太小会丢失上下文。通常 200-500 个 token 是一个好的起点
3. **控制并发**：批量嵌入时设置 `maxParallelCalls` 避免触发 API 速率限制
4. **持久化存储**：生产环境中，嵌入向量应存储在向量数据库（如 Pinecone、Qdrant、pgvector）中，而非内存
5. **相似度阈值**：设置合理的相似度阈值（如 0.5），过滤掉不相关的结果

## 下一步

- [多模态](/ai/vercel-ai-sdk/guide/multimodal) — 处理图片、语音等多种媒体类型的 AI 能力
- [工具调用](/ai/vercel-ai-sdk/guide/tool-calling) — 将语义搜索封装为工具，让 LLM 按需检索
- [结构化输出](/ai/vercel-ai-sdk/guide/structured-output) — 将检索结果结构化输出

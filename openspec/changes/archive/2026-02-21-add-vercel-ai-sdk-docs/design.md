## 设计决策

### D1: 目录结构 — 采用 `guide/` 扁平结构

**选项**：
- A) `guide/` 扁平结构（与 LangChain / LangGraph 一致）
- B) 按模块分子目录（`core/`、`ui/`、`agents/`）

**决定**：A — 使用 `guide/*.md` 扁平结构

**理由**：与现有 AI 框架保持一致。通过 sidebar 分组实现逻辑层级，文件系统保持扁平。约 28 个文件在 `guide/` 下管理仍然清晰。

### D2: 内容范围 — 教程为主，API Reference 不做逐条翻译

**选项**：
- A) 翻译全部 200+ 页（含 API Reference、Providers、Troubleshooting）
- B) 聚焦核心教程约 28 页，API Reference 通过 🔗 外链指向官方
- C) 核心教程 + 精选 API Reference

**决定**：B — 聚焦约 28 页核心教程

**理由**：
1. API Reference 更新频繁，本地维护成本高且易过时
2. 目标读者需要的是"从 0 到 1 理解"而非 API 查阅（查阅直接看官方更准确）
3. 通过 🔗 外链在关键 API 处指向官方文档，读者可无缝跳转
4. 保持与其他框架（LangChain ~33 页、LangGraph ~24 页）相近的体量

### D3: 页面组织 — 按学习路径分 6 个 sidebar 分组

```
入门篇          → overview, install, quickstart, foundations
核心 API 篇     → generating-text, structured-output, tool-calling, mcp, embeddings, multimodal
前端集成篇      → ui-overview, chatbot, chatbot-advanced, generative-ui, streaming-data, stream-protocol
Agent 篇        → agent-overview, building-agents, workflow-patterns, agent-advanced
进阶篇          → providers, middleware, caching-and-limits, deployment
实战教程篇      → tutorial-rag-agent, tutorial-multimodal-chat
```

**理由**：由浅入深的学习路径，前端开发者先理解基础概念，再学核心 API，再看前端集成（最对口），最后进阶和实战。

### D4: 前端类比策略 — 适度使用，不滥用

由于 Vercel AI SDK 本身就是前端框架，类比需要调整策略：
- **对于 AI 概念**（Provider、Tool Calling、Embedding）：用前端概念类比（如 Provider 类比 React Context Provider）
- **对于前端概念**（useChat Hook、Streaming UI）：不需要类比，直接用前端术语讲解
- **对于后端概念**（generateText 服务端调用）：用 Next.js API Route 等概念类比

### D5: Mermaid 使用场景

仅在以下场景使用 Mermaid 图表：
1. AI SDK 架构总览（Core / UI / Provider 三层关系）
2. 流式数据流向（Server → Stream → Client 渲染）
3. Agent 工作流模式（顺序/路由/并行/编排）
4. Tool Calling 交互流程

其他内容用文字 + 代码示例即可，不滥用。

### D6: 外链标注规则

沿用现有的 `🔗` emoji 外链模式：
```markdown
[🔗 generateText API 参考](https://ai-sdk.dev/docs/reference/ai-sdk-core/generate-text){target="_blank" rel="noopener"}
```

添加外链的时机：
- 每个核心 API 首次出现时（如 `generateText`、`streamText`、`useChat`）
- Provider 配置说明处指向对应 Provider 文档
- 高级配置项指向官方 Settings/Reference 页面
- 不在同一页面重复添加相同外链

### D7: 首页（index.md）— 使用 layout: home

与其他 AI 框架一致，使用 VitePress home layout：
- hero: 名称 + 副标题 + 2-3 个 action 按钮
- features: 按 sidebar 分组对应 5-6 个卡片

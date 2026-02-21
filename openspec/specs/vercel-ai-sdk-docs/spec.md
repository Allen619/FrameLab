## Capability: vercel-ai-sdk-docs

Vercel AI SDK 中文教程文档集，覆盖 AI SDK Core、AI SDK UI、Agent、进阶用法，面向前端开发者的 0-1 学习路径。

### 文件清单

所有文件位于 `docs/ai/vercel-ai-sdk/` 下：

| 文件路径 | 标题 | sidebar 标记 |
|---------|------|-------------|
| `index.md` | Vercel AI SDK 首页 | — |
| `guide/overview.md` | 概览 | ⭐ |
| `guide/install.md` | 安装与配置 | |
| `guide/quickstart.md` | 快速上手 | 🔥 |
| `guide/foundations.md` | 基础概念 | ⭐ |
| `guide/generating-text.md` | 文本生成 | 🔥 |
| `guide/structured-output.md` | 结构化输出 | ⭐ |
| `guide/tool-calling.md` | 工具调用 | 🔥 |
| `guide/mcp.md` | MCP 工具集成 | |
| `guide/embeddings.md` | 向量嵌入 | |
| `guide/multimodal.md` | 多模态（图像/语音） | |
| `guide/ui-overview.md` | UI 集成概览 | ⭐ |
| `guide/chatbot.md` | 聊天机器人开发 | 🔥 |
| `guide/chatbot-advanced.md` | 聊天进阶（持久化/恢复/工具） | |
| `guide/generative-ui.md` | 生成式 UI | ⭐ |
| `guide/streaming-data.md` | 流式自定义数据 | |
| `guide/stream-protocol.md` | 流协议详解 | |
| `guide/agent-overview.md` | Agent 概览 | ⭐ |
| `guide/building-agents.md` | 构建 Agent | 🔥 |
| `guide/workflow-patterns.md` | 工作流模式 | |
| `guide/agent-advanced.md` | Agent 进阶（记忆/子Agent） | |
| `guide/providers.md` | Provider 选型指南 | ⭐ |
| `guide/middleware.md` | 中间件系统 | |
| `guide/caching-and-limits.md` | 缓存与速率限制 | |
| `guide/error-handling.md` | 错误处理与测试 | |
| `guide/deployment.md` | 部署指南 | |
| `guide/tutorial-rag-agent.md` | 实战：RAG Agent | 🔥 |
| `guide/tutorial-multimodal-chat.md` | 实战：多模态聊天 | |

### Sidebar 分组结构

```
Vercel AI SDK sidebar:
├── 入门篇
│   ├── ⭐ 概览 (overview)
│   ├── 安装与配置 (install)
│   ├── 🔥 快速上手 (quickstart)
│   └── ⭐ 基础概念 (foundations)
├── 核心 API 篇
│   ├── 🔥 文本生成 (generating-text)
│   ├── ⭐ 结构化输出 (structured-output)
│   ├── 🔥 工具调用 (tool-calling)
│   ├── MCP 工具集成 (mcp)
│   ├── 向量嵌入 (embeddings)
│   └── 多模态 (multimodal)
├── 前端集成篇
│   ├── ⭐ UI 集成概览 (ui-overview)
│   ├── 🔥 聊天机器人开发 (chatbot)
│   ├── 聊天进阶 (chatbot-advanced)
│   ├── ⭐ 生成式 UI (generative-ui)
│   ├── 流式自定义数据 (streaming-data)
│   └── 流协议详解 (stream-protocol)
├── Agent 篇
│   ├── ⭐ Agent 概览 (agent-overview)
│   ├── 🔥 构建 Agent (building-agents)
│   ├── 工作流模式 (workflow-patterns)
│   └── Agent 进阶 (agent-advanced)
├── 进阶篇 (collapsed: true)
│   ├── ⭐ Provider 选型指南 (providers)
│   ├── 中间件系统 (middleware)
│   ├── 缓存与速率限制 (caching-and-limits)
│   ├── 错误处理与测试 (error-handling)
│   └── 部署指南 (deployment)
└── 实战教程篇 (collapsed: true)
    ├── 🔥 实战：RAG Agent (tutorial-rag-agent)
    └── 实战：多模态聊天 (tutorial-multimodal-chat)
```

### 导航配置要求

1. **`config.mts` nav**：AI 下拉菜单新增 `{ text: 'Vercel AI SDK', link: '/ai/vercel-ai-sdk/' }`
2. **`config.mts` sidebar**：以 `'/ai/vercel-ai-sdk/'` 为 key，按上述分组配置
3. **`docs/ai/index.md`**：新增 hero action 按钮和 feature 卡片

### 页面编写规范

每页必须包含：
- **Frontmatter**: `title` + `description`（中文）
- **前端类比**：AI 概念处使用 `::: tip 前端类比` 容器；前端原生概念不需类比
- **代码示例**：TypeScript 代码为主（区别于其他 AI 框架使用 Python），使用最新 AI SDK v6 API
- **🔗 外链**：核心 API 首次出现时添加官方文档链接
- **下一步**：页面底部链接后续推荐阅读
- **Mermaid 图表**：仅在架构概览、流式数据流、Agent 工作流、Tool Calling 流程处使用

### 外链标注位置

每页需要添加 🔗 外链的核心 API/概念：

| 页面 | 外链目标 |
|------|---------|
| overview | AI SDK 官方首页 |
| quickstart | Next.js App Router 入门指南 |
| foundations | Providers & Models 文档 |
| generating-text | generateText / streamText API Reference |
| structured-output | generateObject / streamObject API Reference |
| tool-calling | Tool Calling 文档 |
| mcp | MCP Tools 文档 |
| embeddings | embed / embedMany API Reference |
| ui-overview | AI SDK UI Overview |
| chatbot | useChat API Reference |
| generative-ui | Generative UI 文档 |
| agent-overview | Agent 文档 |
| building-agents | Agent Interface Reference |
| providers | 各 Provider 的官方页面 |
| middleware | Language Model Middleware 文档 |

### Playwright 验证要求

1. 所有 28 个页面渲染正确（HTTP 200，非 404）
2. sidebar 分组和链接完整可导航
3. 🔗 外链指向有效的 ai-sdk.dev 页面
4. 中文内容正确显示
5. Mermaid 图表正确渲染

## Why

AI 板块现有 LangChain / LangGraph / LlamaIndex / Instructor 四个 Python 框架的中文教程，但缺少前端原生 AI 开发框架。Vercel AI SDK 是目前 TypeScript/JavaScript 生态中最主流的 AI 应用构建工具包（npm 周下载量 50 万+），支持 React / Next.js / Vue / Svelte 等主流前端框架。本站目标读者为前端开发者，Vercel AI SDK 直接对口他们的技术栈，能补全"前端侧 AI 集成"这一关键缺口，与现有的 Python 后端 AI 框架文档形成完整的全栈 AI 开发学习路径。

## What Changes

- 新增 `docs/ai/vercel-ai-sdk/` 目录，包含首页 `index.md` 和 `guide/` 子目录下约 25-30 篇教程页面
- 更新 `docs/.vitepress/config.mts`：在 AI nav 下拉菜单新增 Vercel AI SDK 入口；新增 sidebar 配置
- 更新 `docs/ai/index.md`：AI 板块首页新增 Vercel AI SDK 的 hero action 按钮和 feature 卡片
- 所有教程页面遵循现有编写规范：中文 UTF-8、YAML frontmatter、前端类比 + 原生语义、代码示例、适度 Mermaid 图表
- 重要知识点添加 🔗 外链指向 ai-sdk.dev 官方文档

### 内容覆盖范围

基于 Vercel AI SDK v6 官方文档，按学习路径组织为以下模块：

**基础入门（约 6 页）**
- 概览与安装
- 基础概念：Providers & Models、Prompts、Streaming、Tools
- 快速上手（Next.js App Router）

**AI SDK Core — 核心 API（约 8 页）**
- 文本生成（generateText / streamText）
- 结构化数据生成（generateObject / streamObject）
- 工具调用（Tool Calling）
- MCP 工具集成
- 嵌入向量（Embeddings）
- 图像/语音生成
- 中间件系统
- 错误处理与测试

**AI SDK UI — 前端集成（约 6 页）**
- UI 概览与 useChat Hook
- 聊天机器人开发（消息持久化、流恢复、工具调用展示）
- 生成式 UI（Generative User Interfaces）
- 流式自定义数据与传输层
- 流协议详解

**Agent 智能体（约 4 页）**
- Agent 概览与构建方法
- 工作流模式（Workflow Patterns）
- 记忆系统与子 Agent
- 循环控制

**进阶与实战（约 4 页）**
- Provider 选型指南（OpenAI / Anthropic / DeepSeek 等）
- 缓存、速率限制、部署
- 实战教程：RAG Agent / 多模态聊天

## Capabilities

### New Capabilities
- `vercel-ai-sdk-docs`: Vercel AI SDK 中文教程文档集，覆盖 Core API、UI 集成、Agent、进阶用法，面向前端开发者的 0-1 学习路径

### Modified Capabilities
（无现有 spec 需要修改）

## Impact

- **导航配置**：`config.mts` 新增 sidebar 分组和 nav 入口
- **AI 首页**：`docs/ai/index.md` 新增第 5 个框架卡片
- **文件系统**：新增 `docs/ai/vercel-ai-sdk/` 目录，约 30 个 .md 文件
- **构建产物**：新增约 30 个 HTML 页面，构建时间略增
- **依赖**：无新依赖，VitePress 已支持所有需要的功能

## Why

LangChain 官方文档已于 2025-2026 年完成重大重构（从旧站 `python.langchain.com` 迁移至 `docs.langchain.com`），文档体系从"Introduction / Tutorials / How-to / Concepts"四板块重组为按产品线划分的全新结构。当前项目中的 LangChain 文档仅有 8 篇教程，覆盖面远不及同项目中的 LangGraph 专题（~30 篇），且未跟进官方新增的 Multi-agent、MCP、Context Engineering、Guardrails 等核心主题。需要全面扩展以提供从零到一的完整学习路径。

## What Changes

- **重构现有文档**：根据官方最新文档结构，重新组织现有 8 篇文档的内容，确保 API 和概念与最新版本一致
- **新增核心组件文档**：Models、Messages、Tools、Short-term Memory、Structured Output 等核心概念的独立教程页面
- **新增高级用法文档**：Guardrails、Context Engineering、MCP（Model Context Protocol）、Human-in-the-loop、Retrieval、Long-term Memory 等进阶主题
- **新增 Multi-agent 文档**：覆盖 Subagents、Handoffs、Skills、Router、Custom Workflow 五种多智能体模式
- **新增开发与部署文档**：LangSmith Studio、Testing、Agent Chat UI、Observability 等开发工具链
- **新增实战教程**：Semantic Search、RAG Agent、SQL Agent 等端到端实战项目
- **统一文档风格**：全面采用"前端类比 + 原生语义"双层解释模式，与 LangGraph 专题保持一致
- **增强导航体验**：侧边栏使用 ⭐/🔥 标记重点与高频页面，分组使用 `collapsed` 控制展开
- **更新站点配置**：同步更新 `config.mts` 侧边栏、AI 板块首页、LangChain 首页

## Capabilities

### New Capabilities

- `langchain-core-components`: 核心组件完整文档 — Models、Messages、Tools、Short-term Memory、Structured Output 的独立教程页面，以及对现有 Agents、Streaming 页面的重构升级
- `langchain-advanced-patterns`: 高级用法模式文档 — Guardrails、Runtime、Context Engineering、MCP、Human-in-the-loop、Retrieval、Long-term Memory、Multi-agent（含 5 种模式）
- `langchain-dev-deploy`: 开发工具链与部署文档 — LangSmith Studio、Testing、Agent Chat UI、Deployment 重构、Observability
- `langchain-tutorials`: 实战教程 — Semantic Search、RAG Agent、SQL Agent 端到端项目教程

### Modified Capabilities

- `langchain-langgraph-learning-path`: LangChain 文档大幅扩展后，LangChain ↔ LangGraph 的联动学习路径需要更新跳转链接和阶段目标

## Impact

- **文档文件**：新增约 25-30 个 Markdown 页面，重构现有 8 个页面，预计 LangChain 专题总量达到 ~35 页
- **站点配置**：`docs/.vitepress/config.mts` 的 LangChain sidebar 配置需从当前 3 组 8 项扩展为 ~7 组 35+ 项
- **首页更新**：`docs/ai/langchain/index.md` 需重写 feature 卡片以覆盖所有新分组；`docs/ai/index.md` 的 LangChain 描述需更新
- **交叉引用**：LangGraph 专题中的桥接链接需要更新以指向重构后的 LangChain 页面
- **构建验证**：所有新增页面需通过 `npm run build` 断链检查和 Playwright 页面验证

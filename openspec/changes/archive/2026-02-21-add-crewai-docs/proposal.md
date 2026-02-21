## Why

AI 板块目前覆盖 LangChain、LangGraph、LlamaIndex、Instructor 四个框架，但缺少 CrewAI——当前最主流的多 Agent 编排框架之一。CrewAI 以"Flow + Crew"双层架构提供了生产级的多智能体协作能力，与现有框架形成互补：LangChain/LangGraph 侧重底层链与图编排，Instructor 侧重结构化输出，CrewAI 侧重**高层团队协作与工作流编排**。补齐这一缺口可为前端开发者提供完整的 AI 多智能体技术视野。

## What Changes

- 新增 `docs/ai/crewai/` 目录，包含完整的 CrewAI 中文教程体系（预计 20+ 页）
- 新增 `docs/ai/crewai/index.md` 板块首页（VitePress home layout）
- 新增 `docs/ai/crewai/guide/` 目录，按由浅入深分组存放教程页面
- 更新 `docs/.vitepress/config.mts`：在 nav AI 下拉菜单中新增 CrewAI 入口；新增 `/ai/crewai/` 侧边栏配置
- 更新 `docs/ai/index.md`：AI 板块首页新增 CrewAI 的 hero action 按钮和 features 卡片
- 更新 `docs/index.md`：站点首页 features 描述同步更新（如有需要）

### 教程内容规划（由浅入深）

**入门篇（4 页）**
- 概览：CrewAI 是什么、核心架构（Flow + Crew）、生态定位
- 安装与环境配置
- 快速上手（第一个 Crew）
- 快速上手（第一个 Flow）

**核心概念篇（7 页）**
- Agents 智能体
- Tasks 任务
- Crews 团队编排
- Flows 工作流
- Processes 执行流程（顺序/层级）
- Tools 工具系统
- LLMs 模型配置

**高级能力篇（5 页）**
- Memory 记忆系统
- Knowledge 知识库
- Collaboration 协作与委托
- Planning & Reasoning 规划与推理
- Guardrails 任务守卫

**工程化篇（4 页）**
- 生产架构最佳实践
- MCP 集成
- 可观测性与调试
- CLI 与项目管理

**实战篇（2 页）**
- 实战：构建研究分析 Crew
- 实战：构建多步骤 Flow 工作流

## Capabilities

### New Capabilities

- `crewai-getting-started`: CrewAI 入门教程（概览、安装、快速上手 Crew、快速上手 Flow）
- `crewai-core-concepts`: 核心概念教程（Agents、Tasks、Crews、Flows、Processes、Tools、LLMs）
- `crewai-advanced`: 高级能力教程（Memory、Knowledge、Collaboration、Planning/Reasoning、Guardrails）
- `crewai-engineering`: 工程化教程（生产架构、MCP 集成、可观测性、CLI）
- `crewai-tutorials`: 实战教程（研究分析 Crew、多步骤 Flow）
- `crewai-navigation`: 导航与首页集成（config.mts sidebar/nav、AI 首页、站点首页）

### Modified Capabilities

- `docs-navigation-integrity`: 需在导航完整性规范中纳入 CrewAI 路由

## Impact

- **配置文件**: `docs/.vitepress/config.mts` 需新增 nav 项和完整 sidebar 配置
- **首页文件**: `docs/ai/index.md` 和 `docs/index.md` 需更新
- **新增文件**: 约 22-24 个 .md 文件（1 个板块首页 + 约 22 个教程页）
- **依赖**: 无新增 npm 依赖，CrewAI 为 Python 框架，文档仅包含代码示例
- **构建**: 需验证 VitePress 构建通过（断链检查）且 Mermaid 图表正常渲染

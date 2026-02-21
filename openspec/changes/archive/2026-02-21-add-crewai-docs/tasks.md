## 1. 项目骨架与目录创建

- [x] 1.1 创建 `docs/ai/crewai/` 目录和 `docs/ai/crewai/guide/` 子目录
- [x] 1.2 创建 CrewAI 板块首页 `docs/ai/crewai/index.md`（VitePress home layout，含 hero actions 和 features 卡片）

## 2. 入门篇教程（4 页）

- [x] 2.1 编写 `docs/ai/crewai/guide/overview.md` — CrewAI 概览（定义、双层架构 Mermaid 图、框架对比、生态定位），使用 Context7 获取最新信息
- [x] 2.2 编写 `docs/ai/crewai/guide/install.md` — 安装与环境配置（Python 版本、uv、CLI 安装、项目创建、目录结构），用 Playwright 验证安装命令
- [x] 2.3 编写 `docs/ai/crewai/guide/quickstart-crew.md` — 快速上手 Crew（Agent 定义、Task 创建、Crew 组装与执行），用 Context7 + Playwright 确保代码示例最新
- [x] 2.4 编写 `docs/ai/crewai/guide/quickstart-flow.md` — 快速上手 Flow（装饰器、State 管理、集成 Crew），用 Context7 + Playwright 确保代码示例最新

## 3. 核心概念篇教程（7 页）

- [x] 3.1 编写 `docs/ai/crewai/guide/agents.md` — Agents 智能体（属性、YAML vs 代码、执行机制、前端类比：Agent vs React Component）
- [x] 3.2 编写 `docs/ai/crewai/guide/tasks.md` — Tasks 任务（属性、上下文传递、结构化输出 Pydantic、回调、条件任务）
- [x] 3.3 编写 `docs/ai/crewai/guide/crews.md` — Crews 团队编排（属性、输出、启动方式、执行流程 Mermaid 图）
- [x] 3.4 编写 `docs/ai/crewai/guide/flows.md` — Flows 工作流（装饰器、状态管理、控制流、集成 Agent/Crew、执行流程 Mermaid 图）
- [x] 3.5 编写 `docs/ai/crewai/guide/processes.md` — Processes 执行流程（Sequential vs Hierarchical、对比 Mermaid 图、配置方式）
- [x] 3.6 编写 `docs/ai/crewai/guide/tools.md` — Tools 工具系统（8 大分类概览、代表性工具示例、自定义工具创建）
- [x] 3.7 编写 `docs/ai/crewai/guide/llms.md` — LLMs 模型配置（提供商列表、配置方式、本地模型）

## 4. 高级能力篇教程（5 页）

- [x] 4.1 编写 `docs/ai/crewai/guide/memory.md` — Memory 记忆系统（三种类型、Crew/Flow 级别、Mermaid 架构图、前端类比：localStorage/sessionStorage）
- [x] 4.2 编写 `docs/ai/crewai/guide/knowledge.md` — Knowledge 知识库（概念、配置、绑定方式）
- [x] 4.3 编写 `docs/ai/crewai/guide/collaboration.md` — Collaboration 协作与委托（信息共享、delegation 机制）
- [x] 4.4 编写 `docs/ai/crewai/guide/planning-reasoning.md` — Planning & Reasoning 规划与推理（启用方式、工作原理）
- [x] 4.5 编写 `docs/ai/crewai/guide/guardrails.md` — Guardrails 任务守卫（概念、函数定义、验证循环）

## 5. 工程化篇教程（4 页）

- [x] 5.1 编写 `docs/ai/crewai/guide/production-architecture.md` — 生产架构最佳实践（Flow-First、Pydantic State、Mermaid 架构图）
- [x] 5.2 编写 `docs/ai/crewai/guide/mcp-integration.md` — MCP 集成（三种传输、工具使用、多服务器、🔗 MCP 外链）
- [x] 5.3 编写 `docs/ai/crewai/guide/observability.md` — 可观测性与调试（Tracing、第三方集成、Event Listener、Hooks）
- [x] 5.4 编写 `docs/ai/crewai/guide/cli.md` — CLI 与项目管理（命令列表、YAML 配置规范）

## 6. 实战篇教程（2 页）

- [x] 6.1 编写 `docs/ai/crewai/guide/tutorial-research-crew.md` — 实战：构建研究分析 Crew（完整代码，3 Agent 协作）
- [x] 6.2 编写 `docs/ai/crewai/guide/tutorial-flow-workflow.md` — 实战：构建多步骤 Flow 工作流（完整代码，Mermaid 流程图）

## 7. 导航与配置更新

- [x] 7.1 更新 `docs/.vitepress/config.mts` — nav AI 下拉菜单新增 CrewAI 入口
- [x] 7.2 更新 `docs/.vitepress/config.mts` — 新增 `/ai/crewai/` 侧边栏配置（五个分组，⭐/🔥 标记，高级/工程化 collapsed）
- [x] 7.3 更新 `docs/ai/index.md` — AI 板块首页新增 CrewAI hero action 按钮和 features 卡片
- [x] 7.4 检查 `docs/index.md` — 站点首页 features 描述是否需要同步更新

## 8. 质量验证

- [x] 8.1 运行 `npm run build` 构建验证，确保无断链和构建错误
- [x] 8.2 用 Playwright 验证所有 CrewAI 页面可访问、导航正确、Mermaid 图表渲染正常
- [x] 8.3 用 Playwright 验证所有 🔗 外链指向正确的 CrewAI 官方文档页面且可访问
- [x] 8.4 检查所有页面底部的先修链接、"下一步"导航和参考链接完整性

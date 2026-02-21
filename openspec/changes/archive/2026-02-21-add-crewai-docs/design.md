## Context

当前站点 AI 板块已有 LangChain（33 页）、LangGraph（25 页）、LlamaIndex（12 页）、Instructor（13 页）四个专题。CrewAI 作为领先的多 Agent 编排框架，以"Flow + Crew"双层架构提供了与现有框架差异化的高层团队协作能力，是 AI 多智能体生态的重要拼图。该变更属于纯文档型改动，约束包括：全站中文 UTF-8、面向传统前端开发者、内容需优先基于 Context7 保持时效并通过 Playwright 做二次验证。

## Goals / Non-Goals

**Goals:**

- 在 AI 板块建立 CrewAI 专题化学习路径，从基础认知到生产架构形成递进结构（约 22 页）。
- 将 CrewAI 最新官方能力（Agents、Tasks、Crews、Flows、Processes、Memory、Knowledge、MCP 集成、可观测性等）准确映射到中文文档。
- 面向前端开发者提供适度的概念类比（如 Crew vs 微服务编排、Flow vs Express 中间件管道），并保留原生语义说明。
- 将"Context7 主数据源 + Playwright 辅助复核"的时效流程纳入文档交付标准。
- 在导航中使用 ⭐/🔥 标记重点与高频章节，与其他 AI 专题风格一致。

**Non-Goals:**

- 不引入新的运行时代码框架或 npm 依赖。
- 不将文档扩展为 API Reference 级别（以学习与实战上手为主）。
- 不改造站点主题、构建系统或搜索机制。
- 不覆盖 CrewAI Enterprise/AMP 企业版内容。
- 不覆盖全部 40+ Tools 的逐一详解（仅做分类概览与代表性示例）。

## Decisions

### 决策 1: 在 AI 板块中新增 CrewAI 独立专题入口

- Decision: 在 `docs/ai/` 下新增 `crewai/` 目录与独立首页，在 `config.mts` 中补充 nav 下拉项与 `/ai/crewai/` 侧边栏配置。
- Rationale: CrewAI 定位为独立框架（非 LangChain 生态子组件），与已有四个专题平级。复用已验证的板块结构（首页 + guide/ 子目录）最小化架构变更。
- Alternatives considered:
  - 合并到 LangChain 或 LangGraph 内：概念体系完全不同，会导致混淆。
  - 新建顶层导航分类：信息架构改动过大，不符合最小变更原则。

### 决策 2: 采用五分组递进结构

- Decision: 将教程分为"入门篇 → 核心概念篇 → 高级能力篇 → 工程化篇 → 实战篇"五个侧边栏分组。
- Rationale: 与 LangChain（8 分组）、LangGraph（6 分组）保持类似的认知递进模式，避免前端开发者在无 Python 多智能体经验时迷失方向。高级篇和工程化篇设为 collapsed 减少视觉噪音。
- Alternatives considered:
  - 按官方文档结构一一对照：官方面向 Python 开发者，18 个核心概念并列不适合前端读者。
  - 仅三分组（入门/进阶/实战）：核心概念页面过多，单组承载过重。

### 决策 3: 采用"Context7 主数据源 + Playwright 辅助复核"的时效流程

- Decision: 版本敏感与 API 定义内容优先来自 Context7；对关键信息（安装命令、项目结构、代码示例）用 Playwright 打开官方文档复核。
- Rationale: 同时满足内容新鲜度与可核验性，减少经验性写作带来的漂移。
- Alternatives considered:
  - 仅手工经验更新：时效风险高。
  - 仅网页浏览不做结构化检索：难以系统覆盖关键能力点。

### 决策 4: 面向前端读者采用"类比优先但语义回收"写法

- Decision: 在 Agent（vs React Component）、Crew（vs 微服务编排）、Flow（vs Express 中间件管道）、Memory（vs localStorage/sessionStorage）等关键概念处使用前端类比，并明确标注 Python/CrewAI 真实语义。
- Rationale: 降低迁移门槛，同时避免类比误导。类比适度使用，不滥用。
- Alternatives considered:
  - 纯术语直述：学习门槛偏高。
  - 过度类比：会弱化工程准确性。

### 决策 5: Mermaid 仅用于复杂流程与架构图

- Decision: 仅在 Flow + Crew 双层架构图、Flow 事件驱动执行流程、顺序/层级 Process 对比、Memory 系统架构等复杂场景使用 Mermaid。
- Rationale: 控制认知负担，提升维护性。站点已有 MermaidZoom 组件支持交互放大。
- Alternatives considered:
  - 全文广泛绘图：维护成本高，阅读节奏被打断。
  - 完全无图：复杂流程理解成本上升。

## Risks / Trade-offs

- [Risk] CrewAI 官方文档持续演进（当前 v1.8.x+）导致章节快速过时 → Mitigation: 在任务中固化 Context7 检索与 Playwright 复核步骤，优先描述稳定的核心概念。
- [Risk] 新增专题导致 AI 板块导航层级复杂化（5 个框架）→ Mitigation: 保持统一的分组命名风格，collapsed 高级分组，首页引导卡片做简明分流。
- [Risk] Mermaid 语法或主题渲染问题影响上线质量 → Mitigation: 将含 Mermaid 的页面列入 Playwright 验收清单，必要时降级为文本流程说明。
- [Risk] CrewAI 的 Python 生态（uv、pyproject.toml）对前端开发者不够友好 → Mitigation: 安装章节详细说明环境准备步骤，并与已有 Python 板块建立交叉引用。

## Migration Plan

1. 基于现有 `docs/ai/` 结构创建 CrewAI 专题目录、板块首页与教程页面骨架。
2. 依据 Context7 与 Playwright 复核结果，按递进顺序编写入门篇 → 核心概念篇 → 高级能力篇 → 工程化篇 → 实战篇全部页面。
3. 更新 `docs/.vitepress/config.mts`，完成 nav 下拉项、侧边栏配置与重点标记（⭐/🔥）。
4. 更新 `docs/ai/index.md` 和 `docs/index.md`，新增 CrewAI 入口。
5. 本地构建 (`npm run build`) 并用 Playwright 校验页面可达、导航正确、Mermaid 渲染与关键内容一致性。
6. 若验证失败，优先回滚问题章节或图示为稳定文本，确保可发布状态后再迭代增强。

## Open Questions

- CrewAI Tools 部分是否需要按分类逐一列出所有 40+ 工具，还是仅做分类概览 + 代表性工具示例？（建议后者，避免维护负担过重）
- 是否需要新增"CrewAI vs LangGraph 对比"独立章节来帮助读者选型？（建议在概览页以对比表简要说明即可）

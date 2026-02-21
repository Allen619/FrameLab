## Why

当前 LangGraph 中文文档已具备基础框架，但与官方左侧菜单（经 Playwright 实测为 26 个独立页面）的覆盖度仍有显著差距。现有的 `overview-deep-dive.md`（Overview 全量拆解）仅覆盖了 Overview 单页内容，而官方文档的 Overview 只是入口——其后横跨 Get started（6 页）、Capabilities（7 页）、Production（6 页）、LangGraph APIs（6 页）四大分组，每个页面都有独立的深度内容。

**本变更的核心定位是”LangGraph 全面中文教程”，不是 Overview 的全量拆解。** 需要以官方完整菜单为基准，逐页深入阅读后编写对应的中文教程章节，确保读者能从入门一路走到工程落地。原有的”Overview 全量拆解”页面应被整合或拆分到新的结构化章节中。

## What Changes

- **去除”Overview 全量拆解”定位**：将现有 `overview-deep-dive.md` 整合到新的结构化章节中，首页入口改为新导航结构。
- 建立”官方 LangGraph 左侧菜单全量映射”文档规划（26 页映射矩阵），逐页深入阅读官方文档后编写对应中文教程。
- 按官方四大分组重构侧边栏：入门篇、核心能力篇、API 篇、工程化篇。
- 新增并补齐所有缺失章节（约 15+ 个独立新页面），按由浅入深组织为学习路径。
- 补充 Graph API 与 Functional API 的选型边界、迁移策略与前端开发者类比。
- 强化高价值工程主题：Pregel 执行语义、durable execution、checkpoint/store、interrupt/resume、time travel、subgraph 复用。
- 建立质量门槛：Context7 优先校验事实、Playwright 二次验证页面可达与 Mermaid 渲染、构建通过后再交付。

## Capabilities

### New Capabilities

- `langgraph-full-menu-coverage`: 以官方左侧菜单为准的 LangGraph 中文文档全覆盖能力，包含目录映射、内容深度标准与章节依赖关系。
- `langgraph-docs-quality-gates`: LangGraph 文档交付质量门槛能力，定义 Context7 时效校验、Playwright 页面验真、构建验收与回归检查要求。

### Modified Capabilities

- 无

## Impact

- Affected content: `docs/ai/langgraph/` 全专题页面（新增与扩写），并联动 `docs/ai/langchain/` 的桥接内容。
- Affected config: `docs/.vitepress/config.mts` 的 AI 导航与 LangGraph 侧边栏结构。
- Affected process: 文档研发流程需执行“菜单覆盖检查 + Context7 校验 + Playwright 二次验证 + 构建验收”。
- Dependencies: LangGraph 官方文档（/oss/python/langgraph/\*）、现有 VitePress 架构与 Mermaid 插件能力。

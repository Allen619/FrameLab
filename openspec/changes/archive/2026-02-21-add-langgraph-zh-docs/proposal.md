## Why

当前站点虽已包含 LangChain 内容，但 LangGraph 仅有单篇入门且部分链接与示例版本滞后，无法支撑前端开发者从 0 到 1 系统学习 Agent 工作流。现在补齐 LangGraph 专题与 LangChain 联动路径，可以在现有 AI 版块形成完整、可落地、可验证的中文学习闭环。

## What Changes

- 在 AI 版块新增 LangGraph 中文文档专题，覆盖从基础概念、图编排、状态管理到生产实践的渐进式学习路径。
- 以官方最新资料为基线（优先 Context7，辅以 Playwright 实机校验）更新示例、术语与推荐实践，确保内容时效性。
- 对现有 LangChain 章节进行必要补强（尤其与 LangGraph 关系、迁移与联动路径），避免学习断层。
- 补充 VitePress 侧导航与交叉跳转，确保新旧章节形成“先 LangChain 后 LangGraph 再实战”闭环。
- 为关键复杂流程补充适量 Mermaid 图，控制使用密度，强调可读性与教学价值。

## Capabilities

### New Capabilities

- `langgraph-zh-docs`: 新增面向中文读者的 LangGraph 教程体系，包含章节结构、代码示例、图示规范与验证要求。
- `langchain-langgraph-learning-path`: 定义 LangChain 与 LangGraph 的联动学习路径、交叉引用与补强标准。

### Modified Capabilities

- 无

## Impact

- Affected content: `docs/ai/` 下 LangGraph 新章节、LangChain 相关章节与 AI 入口页。
- Affected config: `docs/.vitepress/config.mts` 的 AI 导航与侧边栏结构。
- Affected process: 文档交付需增加时效性校验（Context7）与页面渲染复核（Playwright）。
- Dependencies: LangGraph 官方文档、LangChain 官方文档、现有 VitePress 主题与 Mermaid 插件能力。

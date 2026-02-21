## MODIFIED Requirements

### Requirement: Navigation covers all content sections
系统 SHALL 确保 docs/.vitepress/config.mts 的 nav 和 sidebar 配置覆盖所有内容板块，包括新增的 CrewAI 板块。AI 下拉菜单 MUST 包含 LangChain、LangGraph、LlamaIndex、Instructor、CrewAI 五个入口。`/ai/crewai/` 路径 MUST 有对应的侧边栏配置。

#### Scenario: CrewAI 路由可达性验证
- **WHEN** VitePress 构建完成
- **THEN** 所有 CrewAI 页面路由在 nav 和 sidebar 中可达，无断链

#### Scenario: AI 板块首页完整性
- **WHEN** 用户访问 AI 板块首页
- **THEN** 页面的 hero actions 和 features 卡片覆盖全部五个 AI 框架

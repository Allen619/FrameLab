## ADDED Requirements

### Requirement: CrewAI 板块首页
系统 SHALL 提供 CrewAI 板块首页（`docs/ai/crewai/index.md`），使用 VitePress home layout，包含：hero 区域（标题、描述、action 按钮指向入门教程）、features 卡片（按五个分组展示）。风格 MUST 与已有板块首页（LangChain/LangGraph/LlamaIndex/Instructor）一致。

#### Scenario: 用户从 CrewAI 首页开始学习
- **WHEN** 用户访问 CrewAI 板块首页
- **THEN** 页面展示清晰的学习路径引导和分组内容卡片

### Requirement: config.mts nav 新增 CrewAI 入口
系统 SHALL 在 `docs/.vitepress/config.mts` 的 nav AI 下拉菜单中新增 CrewAI 项，链接到 `/ai/crewai/`。

#### Scenario: 用户通过顶部导航访问 CrewAI
- **WHEN** 用户点击 AI 下拉菜单
- **THEN** 菜单中展示 CrewAI 入口项并可跳转到板块首页

### Requirement: config.mts sidebar 新增 CrewAI 配置
系统 SHALL 在 `docs/.vitepress/config.mts` 中新增 `/ai/crewai/` 路径前缀的侧边栏配置，包含五个分组（入门篇/核心概念篇/高级能力篇/工程化篇/实战篇），高级能力篇和工程化篇设置 `collapsed: true`。重点章节 MUST 使用 ⭐/🔥 标记。

#### Scenario: 用户浏览 CrewAI 侧边栏
- **WHEN** 用户在 CrewAI 板块内浏览
- **THEN** 侧边栏展示五个分组，高级和工程化分组默认折叠，重点章节有 ⭐/🔥 标记

### Requirement: AI 板块首页新增 CrewAI 卡片
系统 SHALL 在 `docs/ai/index.md` 中新增 CrewAI 的 hero action 按钮和 features 卡片。

#### Scenario: 用户从 AI 板块首页发现 CrewAI
- **WHEN** 用户访问 AI 板块首页
- **THEN** 页面展示 CrewAI 的入口按钮和功能描述卡片

### Requirement: 每页底部导航元素
每个教程页面 MUST 在页面底部包含：先修链接（前置知识页面引用）、"下一步"导航（2-3 个推荐页面）、🔗 参考链接（指向 CrewAI 官方英文文档对应页面，`{target="_blank" rel="noopener"}`），所有外链 MUST 经 Playwright 验证有效。

#### Scenario: 用户按推荐路径学习
- **WHEN** 用户完成一页的阅读
- **THEN** 页面底部提供明确的下一步导航和官方参考链接

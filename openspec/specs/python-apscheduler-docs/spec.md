## ADDED Requirements

### Requirement: APScheduler 文档必须落位于 Python 第三方库导航
系统 MUST 将 APScheduler 文档放在 Python 第三方库板块，并在 VitePress 侧边栏提供可访问入口。

#### Scenario: 侧边栏可发现 APScheduler
- **WHEN** 读者访问 `/backend/python/` 并展开“第三方库”导航
- **THEN** 读者 SHALL 能看到 APScheduler 条目并跳转到对应文档页面

### Requirement: APScheduler 文档必须提供完整学习路径
文档 MUST 覆盖入门到实践的核心主题，至少包含概览、核心概念、快速上手、触发器、作业存储、执行器与排错/最佳实践内容。

#### Scenario: 读者按章节完成学习
- **WHEN** 读者从 APScheduler 概览页进入后续章节
- **THEN** 文档 SHALL 提供连续的学习顺序并覆盖上述核心主题

### Requirement: 内容时效必须通过 Context7 优先校验
涉及版本、API 行为、配置方式的事实性内容 MUST 优先通过 Context7 检索校验，并在必要时辅以官方页面复核。

#### Scenario: 编写版本敏感内容
- **WHEN** 作者写入 APScheduler 的版本相关说明或 API 用法
- **THEN** 作者 SHALL 先完成 Context7 检索并依据检索结果更新文档内容

### Requirement: 发布前必须执行 Playwright 页面验证
新增或修改的 APScheduler 文档 MUST 在发布前完成 Playwright 二次验证，确保页面可访问、导航可达、关键内容正确渲染。

#### Scenario: 验证新增页面质量
- **WHEN** 文档完成初稿并准备合并
- **THEN** 验证流程 SHALL 确认页面可打开、导航链接无断链且 Mermaid 区块可正常渲染

### Requirement: 文档表达应面向前端背景读者
文档 MUST 以中文和 UTF-8 编码编写，并在关键概念处提供适度前端类比；Mermaid 图示 MUST 仅用于复杂流程，不得泛化使用。

#### Scenario: 解释调度执行机制
- **WHEN** 文档介绍 APScheduler 的触发与执行链路
- **THEN** 内容 SHALL 使用前端可理解的类比辅助解释，并仅在复杂链路处使用 Mermaid 图

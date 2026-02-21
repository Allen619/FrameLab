## Why

当前站点的 Python 第三方库内容缺少 APScheduler，读者无法在本项目中获得统一、中文、面向前端背景的任务调度学习路径。现在补齐该主题可以覆盖常见后端定时任务场景，并与现有 VitePress 文档体系保持一致。

## What Changes

- 在 `docs/backend/python/libraries/third-party/` 下新增 APScheduler 专题文档集合（概览、核心概念、快速上手、触发器、作业存储、执行器、实战与排错）。
- 文档内容以中文编写并使用 UTF-8 编码，结构与术语遵循现有 Python 文档风格。
- 在需要的复杂流程处增加少量 Mermaid 图辅助理解，避免滥用。
- 以传统前端开发者为主要读者，在关键点提供前端概念类比（如事件循环、任务队列、定时器）。
- 对完成文档执行 Playwright 二次验证，确保页面可访问、链接有效、内容与站点结构一致。
- 研究阶段优先通过 Context7 获取 APScheduler 最新文档与示例，必要时用 Playwright 辅助核验来源页面。
- 更新 VitePress 侧边栏，把 APScheduler 纳入 Python 第三方库导航。

## Capabilities

### New Capabilities
- `python-apscheduler-docs`: 在 Python 第三方库版块提供 APScheduler 的完整中文学习文档、信息时效校验与发布前页面验证流程。

### Modified Capabilities
None.

## Impact

- Affected docs: `docs/backend/python/libraries/third-party/` 下新增 APScheduler 文档文件。
- Affected navigation: `docs/.vitepress/config.mts` 的 Python 第三方库侧边栏。
- Affected process: 文档编写流程新增 Context7 优先检索与 Playwright 二次验证步骤。
- No runtime API/service impact: 仅文档与站点导航变更，不影响线上业务接口。

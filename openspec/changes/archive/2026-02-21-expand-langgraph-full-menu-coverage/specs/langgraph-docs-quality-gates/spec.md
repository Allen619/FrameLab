## ADDED Requirements

### Requirement: 事实性内容必须经 Context7 校验后发布

涉及术语定义、核心能力、执行语义、API 行为与官方定位的内容 MUST 优先通过 Context7 校验并据此更新。

#### Scenario: 写入版本敏感内容

- **WHEN** 作者新增或修改与官方语义相关内容
- **THEN** 作者 SHALL 完成 Context7 检索并在文档中使用校验后表述

### Requirement: 页面级验真必须包含 Playwright 二次验证

新增或修改页面 MUST 在交付前完成 Playwright 验证，覆盖页面可达、导航可达、关键链接有效和 Mermaid 渲染可用。

#### Scenario: 发布前验收

- **WHEN** 文档进入合并前检查
- **THEN** 验证结果 SHALL 证明关键页面在桌面端与移动端均可正常访问

### Requirement: 文档交付必须通过构建与断链检查

文档 MUST 通过 VitePress 构建，并保证新增导航路径与交叉链接无错误路由。

#### Scenario: 构建与链接验证

- **WHEN** 作者完成文档更新并执行构建
- **THEN** 构建结果 SHALL 成功且导航路径与目标页面一致

### Requirement: 文档表达必须符合中文站点规范

新增内容 MUST 使用中文与 UTF-8 编码，前端类比与 Mermaid 使用必须适度，不得影响技术准确性与可读性。

#### Scenario: 语言与风格审查

- **WHEN** 作者完成文案初稿
- **THEN** 审查结果 SHALL 确认语言规范、编码规范与表达一致性满足站点要求

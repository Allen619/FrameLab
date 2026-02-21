## ADDED Requirements

### Requirement: LangGraph 专题必须在 AI 板块提供完整中文学习路径

系统 MUST 在 AI 板块提供独立的 LangGraph 中文专题，并覆盖从基础概念、Graph API、状态建模、分支与并行、中断与恢复到生产实践的渐进式内容。

#### Scenario: 读者按路径完成从入门到实践

- **WHEN** 读者从 LangGraph 专题首页进入学习
- **THEN** 文档 SHALL 提供清晰章节顺序并覆盖上述核心主题

### Requirement: LangGraph 核心能力表述必须与官方最新语义一致

文档 MUST 准确表达 LangGraph 的定位与核心能力，包括低层编排（orchestration）、durable execution、human-in-the-loop、memory 与 streaming，并明确其与 LangChain agents 的关系。

#### Scenario: 读者比较 LangChain Agent 与 LangGraph

- **WHEN** 读者查看“何时使用 LangGraph”的章节
- **THEN** 文档 SHALL 明确给出边界判断与使用建议，且不将两者描述为互斥替代

### Requirement: 版本敏感内容必须优先通过 Context7 校验

涉及安装方式、核心 API、工作流行为与官方术语的事实性内容 MUST 先通过 Context7 检索校验，再落入正文。

#### Scenario: 编写安装与 API 示例

- **WHEN** 作者新增或修改 LangGraph 代码示例
- **THEN** 作者 SHALL 基于 Context7 的最新信息更新示例与叙述

### Requirement: 发布前必须执行 Playwright 文档页面二次验证

新增或更新的 LangGraph 页面 MUST 在发布前通过 Playwright 验证页面可访问、导航可达、关键链接可点击且 Mermaid 图可渲染。

#### Scenario: 合并前执行质量验收

- **WHEN** LangGraph 文档完成并准备合并
- **THEN** 验证流程 SHALL 产出可复核结果，确认页面与图示在文档站中表现正常

### Requirement: 复杂内容图示与前端类比必须适度使用

文档 MUST 以中文 UTF-8 编写，并在必要处使用前端类比帮助理解；Mermaid 图 MUST 仅用于复杂流程或状态转换，不得泛化堆砌。

#### Scenario: 解释状态流转与中断恢复

- **WHEN** 文档讲解多节点状态流转或人机协作中断恢复
- **THEN** 内容 SHALL 采用少量图示与类比，并在同节给出 LangGraph 原生语义说明

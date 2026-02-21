## ADDED Requirements

### Requirement: LangChain 与 LangGraph 必须形成可执行的联动学习路径

系统 MUST 在现有 LangChain 教程与新增 LangGraph 专题之间建立双向跳转与阶段目标，帮助读者完成“高层 Agent 抽象到低层编排实现”的迁移。

#### Scenario: 读者从 LangChain 进入 LangGraph

- **WHEN** 读者完成 LangChain 基础章节并进入进阶内容
- **THEN** 文档 SHALL 提供明确入口与迁移提示，引导读者进入 LangGraph 专题

### Requirement: LangChain 现有章节中与 LangGraph 重叠部分必须补强或纠偏

当 LangChain 章节存在与 LangGraph 相关但不完整或可能过时的内容时，系统 MUST 补充必要解释、更新链接与示例，避免知识断层。

#### Scenario: 校验现有 LangChain 中的 LangGraph 章节

- **WHEN** 作者审阅 `langgraph-intro` 与相关进阶章节
- **THEN** 作者 SHALL 修复不完整链路并补充“何时升级到 LangGraph”的判断标准

### Requirement: 学习路径必须面向传统前端开发者可理解

联动内容 MUST 在关键抽象（状态、节点、边、编排）处提供前端经验映射，并同时给出 Python/LangGraph 真实概念，确保迁移学习有效。

#### Scenario: 读者理解状态与流程编排

- **WHEN** 文档介绍状态图编排机制
- **THEN** 文档 SHALL 提供前端类比与术语对照，帮助读者建立稳定心智模型

### Requirement: 联动文档必须符合 VitePress 中文站点生产要求

新增或修改的联动页面 MUST 遵循 VitePress 目录与导航约定，使用 UTF-8 编码，且交叉链接在构建后可正常访问。

#### Scenario: 导航与链接完整性检查

- **WHEN** 作者完成联动文档编排
- **THEN** 文档站 SHALL 能从 AI 入口、LangChain 侧边栏与 LangGraph 侧边栏互相访问对应页面

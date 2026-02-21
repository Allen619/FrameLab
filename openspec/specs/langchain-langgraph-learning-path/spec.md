## MODIFIED Requirements

### Requirement: LangChain 与 LangGraph 必须形成可执行的联动学习路径

系统 MUST 在扩展后的 LangChain 教程与 LangGraph 专题之间建立双向跳转与阶段目标，帮助读者完成"高层 Agent 抽象到低层编排实现"的迁移。LangChain 扩展至 ~33 页后，联动入口 SHALL 从原来的单一 langgraph-intro 页面扩展到多个页面的交叉引用（如 Agent 页面提示"复杂编排请参考 LangGraph"、Multi-agent 页面提示"底层实现可使用 LangGraph"）。

#### Scenario: 读者从 LangChain 进入 LangGraph

- **WHEN** 读者完成 LangChain 核心组件章节并进入高级用法或多智能体内容
- **THEN** 文档 SHALL 在 Agent、Multi-agent、Context Engineering 等页面提供明确入口与迁移提示，引导读者在需要时进入 LangGraph 专题

### Requirement: LangChain 现有章节中与 LangGraph 重叠部分必须补强或纠偏

当 LangChain 章节存在与 LangGraph 相关但不完整或可能过时的内容时，系统 MUST 补充必要解释、更新链接与示例，避免知识断层。扩展后的 LangChain 文档 SHALL 在 langgraph-intro 桥接页中更新所有内部链接指向重构后的新页面路径。

#### Scenario: 校验现有 LangChain 中的 LangGraph 章节

- **WHEN** 作者审阅 `langgraph-intro` 与相关进阶章节
- **THEN** 作者 SHALL 修复不完整链路并补充"何时升级到 LangGraph"的判断标准，更新所有指向旧页面的内部链接

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

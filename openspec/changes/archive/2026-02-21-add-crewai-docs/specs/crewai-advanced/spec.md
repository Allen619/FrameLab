## ADDED Requirements

### Requirement: Memory 记忆系统教程页面
系统 SHALL 提供 Memory 教程页面（`memory.md`），内容包括：三种记忆类型（Short-term/Long-term/Entity Memory）的定义与对比、Crew 级别启用记忆、Flow 级别便捷方法（remember/recall/extract_memories）、自定义 Embedder 配置。MUST 包含记忆系统架构 Mermaid 图。MUST 提供前端类比（Memory vs localStorage/sessionStorage）并回收原生语义。

#### Scenario: 用户为 Crew 和 Flow 启用记忆
- **WHEN** 用户按照教程配置记忆系统
- **THEN** Agent 能够跨任务和跨执行保留和检索信息

### Requirement: Knowledge 知识库教程页面
系统 SHALL 提供 Knowledge 教程页面（`knowledge.md`），内容包括：知识库概念与用途、知识源配置（文件/文本/目录）、Crew 级别与 Agent 级别知识绑定、Embedder 配置、知识库目录结构。

#### Scenario: 用户为 Agent 配置领域知识
- **WHEN** 用户按照教程配置知识源
- **THEN** Agent 能够在执行任务时检索相关知识内容

### Requirement: Collaboration 协作与委托教程页面
系统 SHALL 提供 Collaboration 教程页面（`collaboration.md`），内容包括：Agent 间信息共享机制、任务委托（delegation）机制、allow_delegation 配置、协作模式与最佳实践。

#### Scenario: 用户实现 Agent 间协作
- **WHEN** 用户启用 Agent 委托功能
- **THEN** Agent 能够将子任务委托给更适合的 Agent，并接收结果

### Requirement: Planning & Reasoning 规划与推理教程页面
系统 SHALL 提供 Planning & Reasoning 教程页面（`planning-reasoning.md`），内容包括：Planning 能力启用与工作原理、Reasoning 能力启用与迭代推理流程、两者的协同使用。

#### Scenario: 用户启用 Agent 规划与推理能力
- **WHEN** 用户为 Crew 启用 planning 或为 Agent 启用 reasoning
- **THEN** Agent 在执行任务前生成详细计划或推理链

### Requirement: Guardrails 任务守卫教程页面
系统 SHALL 提供 Guardrails 教程页面（`guardrails.md`），内容包括：Task Guardrail 概念、guardrail 函数定义与返回值、验证-重试循环、实际应用场景（输出质量检查、格式验证）。

#### Scenario: 用户为 Task 配置守卫验证
- **WHEN** 用户为 Task 配置 guardrail 函数
- **THEN** Task 输出经过验证，不合格时自动重试直到通过或达到上限

## ADDED Requirements

### Requirement: Agents 智能体教程页面
系统 SHALL 提供 Agents 教程页面（`agents.md`），内容包括：Agent 定义与核心属性（role/goal/backstory/llm/tools/memory）、YAML 配置 vs 代码定义两种方式、Agent 执行机制（ReAct 循环）、自定义 Agent 行为。MUST 提供前端类比（Agent vs React Component）并回收原生语义。

#### Scenario: 用户理解并创建自定义 Agent
- **WHEN** 用户阅读 Agents 教程
- **THEN** 用户能够使用 YAML 和代码两种方式定义 Agent，理解核心属性的作用

### Requirement: Tasks 任务教程页面
系统 SHALL 提供 Tasks 教程页面（`tasks.md`），内容包括：Task 定义与核心属性（description/expected_output/agent/context/output_pydantic）、任务依赖与上下文传递、结构化输出（Pydantic）、任务回调、条件任务。

#### Scenario: 用户创建结构化输出的 Task
- **WHEN** 用户按照教程定义带 Pydantic 模型的 Task
- **THEN** Task 执行后返回类型安全的结构化输出

### Requirement: Crews 团队编排教程页面
系统 SHALL 提供 Crews 教程页面（`crews.md`），内容包括：Crew 定义与核心属性（agents/tasks/process/memory/planning）、Crew 输出（CrewOutput）、同步与异步启动方式（kickoff/akickoff）、批量执行（kickoff_for_each）。MUST 包含 Crew 执行流程 Mermaid 图。

#### Scenario: 用户组建并执行一个多 Agent Crew
- **WHEN** 用户按照教程组装 Crew
- **THEN** 用户能够配置执行流程、启用记忆，并通过 CrewOutput 获取结果

### Requirement: Flows 工作流教程页面
系统 SHALL 提供 Flows 教程页面（`flows.md`），内容包括：Flow 核心装饰器（@start/@listen/@router）、状态管理（非结构化 vs Pydantic 结构化）、控制流（or_/and_/router）、在 Flow 中集成 Agent 和 Crew、Flow 记忆系统。MUST 包含 Flow 执行流程 Mermaid 图。

#### Scenario: 用户构建事件驱动的 Flow
- **WHEN** 用户按照教程使用装饰器构建 Flow
- **THEN** 用户能够实现多步骤事件驱动工作流，含条件路由和状态管理

### Requirement: Processes 执行流程教程页面
系统 SHALL 提供 Processes 教程页面（`processes.md`），内容包括：Sequential 顺序流程与 Hierarchical 层级流程的对比、配置方式、适用场景、manager_llm/manager_agent 配置。MUST 包含两种流程的对比 Mermaid 图。

#### Scenario: 用户选择合适的执行流程
- **WHEN** 用户阅读 Processes 教程
- **THEN** 用户能够根据场景选择 Sequential 或 Hierarchical 流程并正确配置

### Requirement: Tools 工具系统教程页面
系统 SHALL 提供 Tools 教程页面（`tools.md`），内容包括：工具系统概述、8 大工具分类概览、代表性工具使用示例（FileReadTool、SerperDevTool 等）、自定义工具创建（BaseTool 继承）、工具调用限制（max_usage_count）。

#### Scenario: 用户为 Agent 配置和创建工具
- **WHEN** 用户按照教程为 Agent 配置内置工具或创建自定义工具
- **THEN** Agent 能够成功调用工具完成任务

### Requirement: LLMs 模型配置教程页面
系统 SHALL 提供 LLMs 教程页面（`llms.md`），内容包括：支持的 LLM 提供商列表与模型前缀、配置方式（环境变量/YAML/代码）、常用模型推荐、本地模型（Ollama）配置。

#### Scenario: 用户配置不同的 LLM 提供商
- **WHEN** 用户按照教程配置 LLM
- **THEN** Agent 能够使用指定的 LLM 提供商执行任务

## ADDED Requirements

### Requirement: 生产架构最佳实践教程页面
系统 SHALL 提供生产架构教程页面（`production-architecture.md`），内容包括：Flow-First 架构原则、Pydantic State 类型安全、Crew 作为工作单元模式、错误处理与重试、异步执行模式、部署建议。MUST 包含生产架构 Mermaid 图。

#### Scenario: 用户设计生产级 CrewAI 应用
- **WHEN** 用户阅读生产架构教程
- **THEN** 用户能够按照 Flow-First 原则设计可维护、可扩展的多 Agent 应用

### Requirement: MCP 集成教程页面
系统 SHALL 提供 MCP 集成教程页面（`mcp-integration.md`），内容包括：MCP 协议概述、三种传输方式（Stdio/SSE/Streamable HTTP）、将 MCP 服务器作为 CrewAI 工具使用、多服务器连接、安全注意事项。MUST 提供 🔗 MCP 官方文档外链。

#### Scenario: 用户将 MCP 服务器集成为 CrewAI 工具
- **WHEN** 用户按照教程配置 MCP 集成
- **THEN** Agent 能够通过 MCP 协议调用外部工具服务器

### Requirement: 可观测性与调试教程页面
系统 SHALL 提供可观测性教程页面（`observability.md`），内容包括：CrewAI 原生 Tracing（crewai login）、常用第三方集成平台概览（Langfuse、Arize Phoenix、MLflow 等）、Event Listener 事件监听机制、执行钩子（LLM Call Hooks/Tool Call Hooks）。

#### Scenario: 用户为 CrewAI 应用启用可观测性
- **WHEN** 用户按照教程配置 tracing 或第三方集成
- **THEN** 用户能够追踪 Agent 执行流程和性能指标

### Requirement: CLI 与项目管理教程页面
系统 SHALL 提供 CLI 教程页面（`cli.md`），内容包括：CrewAI CLI 命令列表（create/install/run/test/train/log-tasks-outputs 等）、项目结构管理、YAML 配置文件编写规范（agents.yaml/tasks.yaml）。

#### Scenario: 用户使用 CLI 管理 CrewAI 项目
- **WHEN** 用户按照教程使用 CrewAI CLI
- **THEN** 用户能够创建、运行、测试和管理 CrewAI 项目

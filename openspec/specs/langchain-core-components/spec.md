## ADDED Requirements

### Requirement: 入门篇必须提供完整的 LangChain 生态概览和快速上手路径

文档 SHALL 包含 4 个入门页面（概览、安装、快速上手、设计理念），覆盖 LangChain 生态定位（LangChain vs LangGraph vs Deep Agents 的关系）、环境搭建、第一个 Agent 创建、以及 LangChain 1.0 的设计哲学。概览页 MUST 包含生态架构 Mermaid 图表。

#### Scenario: 读者从零开始搭建 LangChain 环境

- **WHEN** 读者访问 LangChain 入门篇
- **THEN** 读者 SHALL 能通过概览页理解 LangChain 在 AI 工具链中的定位，通过安装页完成环境配置，通过快速上手页创建第一个可运行的 Agent

#### Scenario: 前端开发者理解 LangChain 生态

- **WHEN** 前端开发者阅读概览页
- **THEN** 文档 SHALL 提供 LangChain 生态与前端工具链的类比（如 LangChain ≈ React 生态、LangGraph ≈ Redux、Provider 包 ≈ npm 适配器），并紧跟原生语义说明

### Requirement: 核心组件文档必须覆盖 Agent、Models、Messages、Tools、Memory、Streaming、Structured Output 七大组件

文档 SHALL 为每个核心组件提供独立教程页面，内容包括概念说明、API 用法、代码示例（至少 2 个可运行示例）和最佳实践。所有 API 示例 MUST 基于 LangChain 最新版本（通过 Context7 验证）。

#### Scenario: 读者学习 Agent 创建

- **WHEN** 读者阅读 Agent 页面
- **THEN** 文档 SHALL 涵盖 create_agent 接口、@tool 装饰器、Agent 执行流程、与 LangGraph Agent 的区别说明，并包含至少 1 个 Mermaid 流程图

#### Scenario: 读者学习模型调用

- **WHEN** 读者阅读 Models 页面
- **THEN** 文档 SHALL 涵盖 init_chat_model 统一接口、Provider 包安装、多 Provider 切换、模型参数配置，提供前端类比（Models ≈ fetch API 的 adapter pattern）

#### Scenario: 读者学习消息系统

- **WHEN** 读者阅读 Messages 页面
- **THEN** 文档 SHALL 涵盖消息类型（HumanMessage、AIMessage、SystemMessage、ToolMessage）、Content Blocks 统一内容访问接口、消息序列化

#### Scenario: 读者学习工具定义

- **WHEN** 读者阅读 Tools 页面
- **THEN** 文档 SHALL 涵盖 @tool 装饰器、工具 schema 自动推导、工具调用与结果处理、InjectedToolArg 注入模式

#### Scenario: 读者学习流式响应

- **WHEN** 读者阅读 Streaming 页面
- **THEN** 文档 SHALL 涵盖 updates/messages/custom 三种流式模式、前端 SSE 集成示例（React useStream 模式）、多模式组合

#### Scenario: 读者学习结构化输出

- **WHEN** 读者阅读 Structured Output 页面
- **THEN** 文档 SHALL 涵盖 with_structured_output 接口、Pydantic 模型定义、JSON Schema 模式、输出验证与错误处理

### Requirement: 中间件文档必须拆分为概览、内置中间件、自定义中间件三个页面

文档 SHALL 将现有单页中间件内容拆分为 3 个页面，分别覆盖中间件概念与执行模型、所有内置中间件的用法、以及自定义中间件的开发模式。

#### Scenario: 读者了解中间件体系

- **WHEN** 读者阅读中间件概览
- **THEN** 文档 SHALL 解释中间件的执行顺序和生命周期，提供前端类比（Express/Koa 中间件），并包含中间件链路 Mermaid 图

#### Scenario: 读者使用内置中间件

- **WHEN** 读者阅读内置中间件页面
- **THEN** 文档 SHALL 列出所有内置中间件（PIIMiddleware、SummarizationMiddleware、HumanInTheLoopMiddleware 等）及其配置选项和使用示例

### Requirement: 所有核心组件文档必须通过时效性验证

文档中的 API 示例和概念说明 MUST 通过 Context7 MCP 工具验证与 LangChain 最新版本一致。完成后 MUST 通过 Playwright MCP 工具在开发服务器上验证页面渲染正常。

#### Scenario: API 示例时效性校验

- **WHEN** 作者编写核心组件代码示例
- **THEN** 作者 SHALL 使用 Context7 查询 LangChain 最新文档确认 API 签名和用法正确

#### Scenario: 页面渲染验证

- **WHEN** 作者完成核心组件页面编写
- **THEN** 作者 SHALL 通过 Playwright 在开发服务器上验证页面渲染无误、代码块高亮正确、Mermaid 图表正常显示

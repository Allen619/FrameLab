## ADDED Requirements

### Requirement: CrewAI 概览页面
系统 SHALL 提供 CrewAI 概览页面（`overview.md`），内容包括：CrewAI 定义与核心价值、Flow + Crew 双层架构说明、与 LangChain/LangGraph/LlamaIndex 等框架的定位对比、最小可运行示例。页面 MUST 包含架构 Mermaid 图。页面 MUST 提供 🔗 官方文档外链。

#### Scenario: 前端开发者首次了解 CrewAI
- **WHEN** 用户访问 CrewAI 概览页
- **THEN** 页面展示 CrewAI 定义、双层架构图（Mermaid）、与其他框架的简明对比表、前端类比说明

### Requirement: CrewAI 安装与环境配置页面
系统 SHALL 提供安装页面（`install.md`），内容包括：Python 版本要求、uv 包管理器安装、CrewAI CLI 安装、项目创建命令、项目目录结构说明、环境变量配置（API Keys）。MUST 提供与已有 Python 板块的交叉引用链接。

#### Scenario: 前端开发者配置 CrewAI 开发环境
- **WHEN** 用户按照安装页指引操作
- **THEN** 用户能够成功安装 CrewAI CLI、创建项目骨架并运行示例

### Requirement: 快速上手 Crew 页面
系统 SHALL 提供快速上手 Crew 教程（`quickstart-crew.md`），内容包括：定义 Agent（YAML + 代码两种方式）、定义 Task、组装 Crew、执行并获取结果。MUST 提供完整可运行代码示例。

#### Scenario: 用户创建第一个 Crew
- **WHEN** 用户按照教程操作
- **THEN** 用户能够定义多个 Agent、创建 Task、组装 Crew 并成功获得执行结果

### Requirement: 快速上手 Flow 页面
系统 SHALL 提供快速上手 Flow 教程（`quickstart-flow.md`），内容包括：Flow 定义、@start/@listen/@router 装饰器、State 管理、在 Flow 中集成 Crew。MUST 提供完整可运行代码示例。

#### Scenario: 用户创建第一个 Flow
- **WHEN** 用户按照教程操作
- **THEN** 用户能够创建包含状态管理和事件监听的 Flow，并集成 Crew 完成完整工作流

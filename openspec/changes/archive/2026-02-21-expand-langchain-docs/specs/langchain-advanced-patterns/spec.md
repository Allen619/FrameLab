## ADDED Requirements

### Requirement: 高级用法文档必须覆盖 Guardrails、Context Engineering、MCP、HITL、Retrieval、Long-term Memory、Runtime 七大主题

文档 SHALL 为每个高级主题提供独立教程页面，高级用法分组在侧边栏中使用 `collapsed: true` 默认折叠。每个主题 MUST 包含概念说明、使用场景判断标准、代码示例和注意事项。

#### Scenario: 读者学习上下文工程

- **WHEN** 读者阅读 Context Engineering 页面
- **THEN** 文档 SHALL 涵盖上下文窗口管理策略、消息裁剪、上下文压缩、以及与前端状态管理的类比

#### Scenario: 读者学习 MCP 集成

- **WHEN** 读者阅读 MCP 页面
- **THEN** 文档 SHALL 涵盖 Model Context Protocol 概念、MCP Server 配置、MCP 工具注册与调用、与 @tool 装饰器的对比

#### Scenario: 读者学习检索增强 RAG

- **WHEN** 读者阅读 Retrieval 页面
- **THEN** 文档 SHALL 涵盖向量存储集成、文档加载与切分、嵌入模型配置、检索链构建，并提供完整的 RAG 流程 Mermaid 图

#### Scenario: 读者学习人机协作

- **WHEN** 读者阅读 HITL 页面
- **THEN** 文档 SHALL 涵盖人工审批节点、工具调用确认、中断与恢复机制

#### Scenario: 读者学习安全护栏

- **WHEN** 读者阅读 Guardrails 页面
- **THEN** 文档 SHALL 涵盖输入验证、输出过滤、敏感信息检测、自定义护栏规则

#### Scenario: 读者学习长期记忆

- **WHEN** 读者阅读 Long-term Memory 页面
- **THEN** 文档 SHALL 涵盖记忆存储后端、记忆检索策略、与短期记忆的区别和配合使用

### Requirement: 多智能体文档必须覆盖所有官方多智能体模式

文档 SHALL 提供 3 个多智能体页面：概览页介绍多智能体架构和模式选择指南，模式页详解 Subagents/Handoffs/Router 三种核心模式，高级页覆盖 Skills/Custom Workflow。

#### Scenario: 读者理解多智能体模式选择

- **WHEN** 读者阅读多智能体概览
- **THEN** 文档 SHALL 提供模式选择决策树（Mermaid 流程图），帮助读者根据场景选择合适的多智能体模式

#### Scenario: 读者实现 Subagents 模式

- **WHEN** 读者阅读多智能体模式页面中的 Subagents 部分
- **THEN** 文档 SHALL 提供完整的 Subagents 创建、通信和编排代码示例

#### Scenario: 读者实现 Handoffs 模式

- **WHEN** 读者阅读多智能体模式页面中的 Handoffs 部分
- **THEN** 文档 SHALL 提供 Agent 间任务交接的代码示例和使用场景

#### Scenario: 读者实现 Router 模式

- **WHEN** 读者阅读多智能体模式页面中的 Router 部分
- **THEN** 文档 SHALL 提供路由分发逻辑的代码示例和配置方法

### Requirement: 高级用法和多智能体文档的时效性验证

所有高级用法和多智能体文档中的 API 示例 MUST 通过 Context7 验证与 LangChain 最新版本一致，完成后 MUST 通过 Playwright 验证页面渲染。

#### Scenario: 高级 API 时效性校验

- **WHEN** 作者编写高级用法代码示例
- **THEN** 作者 SHALL 使用 Context7 查询最新文档确认 API 正确，使用 Playwright 验证页面渲染

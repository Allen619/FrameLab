## 1. 入门篇文档

- [x] 1.1 创建 `docs/ai/langchain/guide/overview.md` — LangChain 概览与生态定位（含生态架构 Mermaid 图、LangChain vs LangGraph vs Deep Agents 定位说明、前端生态类比）
- [x] 1.2 创建 `docs/ai/langchain/guide/install.md` — 安装与环境配置（pip/uv 安装、Provider 包管理、环境变量配置、验证安装）
- [x] 1.3 创建 `docs/ai/langchain/guide/quickstart.md` — 快速上手（第一个 Agent 从零创建、完整可运行示例、核心概念初步介绍）
- [x] 1.4 创建 `docs/ai/langchain/guide/philosophy.md` — 设计理念（LangChain 1.0 架构哲学、组件化设计、Provider 抽象层理念）

## 2. 核心组件篇文档

- [x] 2.1 创建 `docs/ai/langchain/guide/agents.md` — 智能体 Agent（create_agent 接口、@tool 装饰器、Agent 执行流程 Mermaid 图、与 LangGraph Agent 区别说明）。重构现有 `agent-architecture.md` 的内容
- [x] 2.2 创建 `docs/ai/langchain/guide/models.md` — 模型 Models（init_chat_model 统一接口、Provider 包安装与切换、模型参数配置、前端类比：adapter pattern）
- [x] 2.3 创建 `docs/ai/langchain/guide/messages.md` — 消息 Messages（消息类型体系、Content Blocks 统一访问接口、消息序列化）。整合现有 `content-blocks.md` 的内容
- [x] 2.4 创建 `docs/ai/langchain/guide/tools.md` — 工具 Tools（@tool 装饰器、schema 自动推导、工具调用与结果处理、InjectedToolArg）
- [x] 2.5 创建 `docs/ai/langchain/guide/short-term-memory.md` — 短期记忆（对话历史管理、记忆窗口策略、与前端 Session Storage 类比）
- [x] 2.6 重构 `docs/ai/langchain/guide/streaming.md` — 流式响应 Streaming（updates/messages/custom 三种模式、React useStream 前端集成、多模式组合）
- [x] 2.7 创建 `docs/ai/langchain/guide/structured-output.md` — 结构化输出（with_structured_output 接口、Pydantic 模型定义、JSON Schema、输出验证）

## 3. 中间件篇文档

- [x] 3.1 创建 `docs/ai/langchain/guide/middleware-overview.md` — 中间件概览（执行模型、生命周期、Express/Koa 类比、中间件链路 Mermaid 图）。从现有 `middleware.md` 拆分
- [x] 3.2 创建 `docs/ai/langchain/guide/prebuilt-middleware.md` — 内置中间件（PIIMiddleware、SummarizationMiddleware、HumanInTheLoopMiddleware 等所有内置中间件详解）
- [x] 3.3 创建 `docs/ai/langchain/guide/custom-middleware.md` — 自定义中间件（开发模式、中间件组合、测试策略）

## 4. 高级用法篇文档

- [x] 4.1 创建 `docs/ai/langchain/guide/guardrails.md` — 安全护栏 Guardrails（输入验证、输出过滤、敏感信息检测、自定义规则）
- [x] 4.2 创建 `docs/ai/langchain/guide/context-engineering.md` — 上下文工程（上下文窗口管理、消息裁剪、上下文压缩、前端状态管理类比）
- [x] 4.3 创建 `docs/ai/langchain/guide/mcp.md` — MCP 协议（Model Context Protocol 概念、MCP Server 配置、工具注册与调用、与 @tool 对比）
- [x] 4.4 创建 `docs/ai/langchain/guide/hitl.md` — 人机协作 HITL（人工审批节点、工具调用确认、中断与恢复机制）
- [x] 4.5 创建 `docs/ai/langchain/guide/retrieval.md` — 检索增强 RAG（向量存储集成、文档加载切分、嵌入模型、检索链构建、RAG 流程 Mermaid 图）
- [x] 4.6 创建 `docs/ai/langchain/guide/long-term-memory.md` — 长期记忆（存储后端、检索策略、与短期记忆区别和配合）
- [x] 4.7 创建 `docs/ai/langchain/guide/runtime.md` — 运行时配置（RunnableConfig、回调系统、超时与重试、并发控制）

## 5. 多智能体篇文档

- [x] 5.1 创建 `docs/ai/langchain/guide/multi-agent-overview.md` — 多智能体概览（架构总览、模式选择决策树 Mermaid 图、使用场景指南）
- [x] 5.2 创建 `docs/ai/langchain/guide/multi-agent-patterns.md` — 多智能体模式（Subagents 子代理、Handoffs 任务交接、Router 路由分发三种核心模式详解与代码示例）
- [x] 5.3 创建 `docs/ai/langchain/guide/multi-agent-advanced.md` — 高级多智能体（Skills 技能模式、Custom Workflow 自定义工作流）

## 6. 开发与部署篇文档

- [x] 6.1 创建 `docs/ai/langchain/guide/studio.md` — LangSmith Studio（安装启动、Agent 调试、对话追踪、Playground）
- [x] 6.2 创建 `docs/ai/langchain/guide/testing.md` — 测试（单元测试策略、工具 Mock、Agent 端到端测试、LangSmith 评估）
- [x] 6.3 重构 `docs/ai/langchain/guide/deployment.md` — 部署（LangServe/FastAPI、Docker、LangSmith 托管部署、密钥管理、云平台实践）
- [x] 6.4 创建 `docs/ai/langchain/guide/observability.md` — 可观测性（LangSmith Tracing、Token 追踪、延迟监控、告警配置）

## 7. 实战教程篇文档

- [x] 7.1 创建 `docs/ai/langchain/guide/tutorial-semantic-search.md` — 语义搜索实战（文档加载、文本切分、Embedding、VectorStore、检索展示）
- [x] 7.2 创建 `docs/ai/langchain/guide/tutorial-rag-agent.md` — RAG Agent 实战（知识库构建、检索器、Agent 工具、对话记忆、质量优化）
- [x] 7.3 创建 `docs/ai/langchain/guide/tutorial-sql-agent.md` — SQL Agent 实战（数据库连接、SQL 工具、自然语言转 SQL、结果格式化、安全注意事项）

## 8. 迁移与联动篇

- [x] 8.1 更新 `docs/ai/langchain/guide/legacy-migration.md` — 更新内部链接指向新页面路径
- [x] 8.2 更新 `docs/ai/langchain/guide/langgraph-intro.md` — 更新内部链接，补充"何时升级到 LangGraph"判断标准

## 9. 清理旧文档

- [x] 9.1 删除 `docs/ai/langchain/guide/agent-architecture.md`（内容已重构到 agents.md）
- [x] 9.2 删除 `docs/ai/langchain/guide/content-blocks.md`（内容已整合到 messages.md）
- [x] 9.3 删除 `docs/ai/langchain/guide/middleware.md`（内容已拆分到 middleware-overview/prebuilt-middleware/custom-middleware）
- [x] 9.4 删除 `docs/ai/langchain/guide/getting-started.md`（内容已拆分到 overview/install/quickstart）

## 10. 站点配置与导航更新

- [x] 10.1 更新 `docs/.vitepress/config.mts` — LangChain sidebar 扩展为 8 组 ~33 项（含 ⭐/🔥 emoji 标记、collapsed 属性）
- [x] 10.2 重写 `docs/ai/langchain/index.md` — 首页 feature 卡片覆盖所有 8 个分组（入门/核心组件/中间件/高级用法/多智能体/开发部署/实战教程/迁移联动）
- [x] 10.3 更新 `docs/ai/index.md` — 更新 LangChain 描述文案
- [x] 10.4 更新 LangGraph 侧边栏中指向 LangChain 的桥接链接

## 11. 质量验证

- [x] 11.1 运行 `npm run build` 执行断链检查，修复所有断链
- [x] 11.2 使用 Playwright 验证所有新增页面渲染正常（代码块高亮、Mermaid 图表、导航链接）
- [x] 11.3 检查所有页面 UTF-8 编码正确、YAML frontmatter 完整

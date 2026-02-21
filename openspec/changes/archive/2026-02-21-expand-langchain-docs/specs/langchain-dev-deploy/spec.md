## ADDED Requirements

### Requirement: 开发工具文档必须覆盖 LangSmith Studio、Testing、Deployment、Observability 四个主题

文档 SHALL 提供 4 个开发与部署页面，覆盖 Agent 开发全生命周期。Deployment 页面 SHALL 在现有部署文档基础上增强，新增 LangSmith 部署方式和云平台最新实践。

#### Scenario: 读者学习 LangSmith Studio

- **WHEN** 读者阅读 Studio 页面
- **THEN** 文档 SHALL 涵盖 Studio 的安装与启动、Agent 调试界面、对话追踪、Playground 使用

#### Scenario: 读者学习测试 Agent

- **WHEN** 读者阅读 Testing 页面
- **THEN** 文档 SHALL 涵盖单元测试策略、工具 Mock、Agent 端到端测试、LangSmith 评估集成

#### Scenario: 读者学习部署

- **WHEN** 读者阅读 Deployment 页面
- **THEN** 文档 SHALL 涵盖 LangServe/FastAPI 部署、Docker 容器化、LangSmith 托管部署、环境变量与密钥管理

#### Scenario: 读者学习可观测性

- **WHEN** 读者阅读 Observability 页面
- **THEN** 文档 SHALL 涵盖 LangSmith Tracing 集成、Token 使用追踪、延迟监控、告警配置

### Requirement: 实战教程必须提供端到端可运行的项目

文档 SHALL 提供 3 个实战教程页面（语义搜索、RAG Agent、SQL Agent），每个教程 MUST 包含完整的项目代码、步骤说明和运行结果展示。教程 SHALL 从需求分析开始，逐步构建到完整功能。

#### Scenario: 读者完成语义搜索教程

- **WHEN** 读者跟随语义搜索教程
- **THEN** 读者 SHALL 能完成文档加载、向量化、存储和语义检索的完整流程，理解 Embedding 和 VectorStore 的核心概念

#### Scenario: 读者完成 RAG Agent 教程

- **WHEN** 读者跟随 RAG Agent 教程
- **THEN** 读者 SHALL 能构建一个具备文档检索增强能力的对话 Agent，理解 RAG 流水线各环节

#### Scenario: 读者完成 SQL Agent 教程

- **WHEN** 读者跟随 SQL Agent 教程
- **THEN** 读者 SHALL 能构建一个可以查询数据库的 Agent，理解 Agent 工具调用和数据库交互模式

### Requirement: 开发与部署文档必须通过时效性验证

所有开发工具和部署文档中的 API、CLI 命令和配置 MUST 通过 Context7 验证与 LangChain/LangSmith 最新版本一致。完成后 MUST 通过 Playwright 验证页面渲染。

#### Scenario: 部署配置时效性校验

- **WHEN** 作者编写部署和工具链文档
- **THEN** 作者 SHALL 使用 Context7 确认最新部署方式和工具版本，使用 Playwright 验证页面渲染

### Requirement: 站点配置和导航必须同步更新

文档 SHALL 同步更新以下配置：
1. `docs/.vitepress/config.mts` — LangChain sidebar 扩展为 8 组 ~33 项
2. `docs/ai/langchain/index.md` — 首页 feature 卡片覆盖所有分组
3. `docs/ai/index.md` — 更新 LangChain 描述
4. 侧边栏使用 ⭐/🔥 emoji 标记推荐和高频页面

#### Scenario: 侧边栏配置完整

- **WHEN** 所有文档页面创建完成
- **THEN** config.mts 中的 LangChain sidebar SHALL 包含所有新增页面的路由配置，分组使用 `collapsed` 属性

#### Scenario: 首页卡片更新

- **WHEN** LangChain 文档扩展完成
- **THEN** LangChain 首页 SHALL 包含覆盖所有 8 个分组的 feature 卡片，每个卡片有 link 和 linkText

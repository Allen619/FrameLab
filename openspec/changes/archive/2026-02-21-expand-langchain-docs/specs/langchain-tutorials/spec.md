## ADDED Requirements

### Requirement: 实战教程必须覆盖语义搜索、RAG Agent、SQL Agent 三个核心场景

文档 SHALL 提供 3 个独立的实战教程页面，每个教程完整覆盖一个从零到可运行的 Agent 项目。教程 MUST 按"需求分析 → 环境准备 → 逐步实现 → 测试验证 → 扩展思路"的结构组织。

#### Scenario: 语义搜索教程的完整性

- **WHEN** 读者按照语义搜索教程步骤执行
- **THEN** 教程 SHALL 涵盖：文档加载（多种格式）、文本切分策略、Embedding 模型选择与配置、VectorStore 存储与检索、相似度搜索结果展示

#### Scenario: RAG Agent 教程的完整性

- **WHEN** 读者按照 RAG Agent 教程步骤执行
- **THEN** 教程 SHALL 涵盖：知识库构建、检索器配置、Agent 工具定义（将检索作为工具）、对话记忆集成、RAG 质量优化策略

#### Scenario: SQL Agent 教程的完整性

- **WHEN** 读者按照 SQL Agent 教程步骤执行
- **THEN** 教程 SHALL 涵盖：数据库连接配置、SQL 工具定义、Agent 自然语言转 SQL 能力、查询结果格式化、安全注意事项

### Requirement: 教程代码必须可独立运行

每个教程的代码 MUST 包含完整的依赖安装说明、环境变量配置说明和可运行的完整代码。读者 SHALL 能按照教程独立完成项目搭建，无需参考其他外部资源。

#### Scenario: 教程代码可复现

- **WHEN** 读者复制教程中的代码
- **THEN** 代码 SHALL 在按照安装说明配置环境后可直接运行，无缺失依赖或未声明变量

### Requirement: 教程必须通过时效性验证

教程中的所有 API 调用和依赖版本 MUST 通过 Context7 验证与最新版本一致。

#### Scenario: 教程 API 时效性校验

- **WHEN** 作者编写教程代码
- **THEN** 作者 SHALL 使用 Context7 确认所有 API 用法与最新文档一致

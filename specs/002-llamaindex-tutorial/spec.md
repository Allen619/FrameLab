# Feature Specification: LlamaIndex 学习路线图

**Feature Branch**: `002-llamaindex-tutorial`
**Created**: 2025-12-29
**Status**: Draft
**Input**: User description: "在项目现有的"ai"栏目下新增 LlamaIndex 学习路线图。内容必须覆盖从基础 RAG 概念、环境搭建，到 Data Connectors、Index 构建、Query Engines 调优，以及高级 Agent 模式的完整生命周期。教程应以用户故事和实际生产场景驱动，而非枯燥的算法推导。每一章节需包含：核心概念的比喻化解释、标准化的操作步骤、避坑指南以及在该阶段的生产环境最佳实践。"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - 零基础学员完成 RAG 基础入门 (Priority: P1)

作为一名没有任何 LLM 框架开发经验的前端/后端开发者，我希望通过阅读本教程的 RAG 基础章节，能够理解 RAG 是什么、为什么需要 RAG、以及 RAG 的基本工作流程，最终能够搭建一个可运行的最小 RAG 应用。

**Why this priority**: RAG 是 LlamaIndex 的核心价值主张，也是 0 基础学员入门 LLM 应用的第一道门槛。如果学员无法理解 RAG 的基本概念和价值，后续的所有高级特性都将无从谈起。

**Independent Test**: 学员阅读完 RAG 基础章节后，能够独立运行一个"对本地 PDF 文档进行问答"的示例程序，并能向他人解释 RAG 与传统全文检索的区别。

**Acceptance Scenarios**:

1. **Given** 学员首次接触 LlamaIndex，**When** 阅读 RAG 基础章节，**Then** 能够用日常语言向他人解释"RAG 就像考试前先查笔记再答题"
2. **Given** 学员完成环境搭建，**When** 按照教程步骤运行示例代码，**Then** 能够对一个本地 PDF 文件进行问答并获得相关回答
3. **Given** 学员遇到常见安装问题（如 Python 版本不兼容、依赖冲突），**When** 查阅避坑指南，**Then** 能够找到对应的解决方案

---

### User Story 2 - 开发者掌握 Data Connectors 与 Index 构建 (Priority: P2)

作为一名已理解 RAG 基础的开发者，我希望学习如何使用 LlamaIndex 的 Data Connectors 加载各种格式的数据（PDF、网页、数据库、API），并构建高效的向量索引，为生产级 RAG 应用打下数据层基础。

**Why this priority**: 数据加载和索引构建是 RAG 应用的"输入端"，决定了后续检索和问答的质量上限。这是从 Demo 走向生产的关键步骤。

**Independent Test**: 开发者能够独立实现一个从多种数据源（至少 2 种）加载数据、构建持久化向量索引的完整流程。

**Acceptance Scenarios**:

1. **Given** 开发者需要加载企业内部的 Word/PDF 文档，**When** 参照 Data Connectors 章节，**Then** 能够选择合适的 Loader 并成功加载数据
2. **Given** 开发者需要对接公司内部 API 获取数据，**When** 参照自定义 Connector 章节，**Then** 能够编写一个基本的自定义数据加载器
3. **Given** 开发者构建的索引需要持久化以供重启后使用，**When** 参照索引持久化章节，**Then** 能够将索引保存到本地或向量数据库

---

### User Story 3 - 开发者优化 Query Engine 实现精准检索 (Priority: P3)

作为一名已完成索引构建的开发者，我希望学习如何调优 Query Engine，包括检索策略选择、重排序、上下文窗口管理等，以提升问答的准确性和相关性。

**Why this priority**: Query Engine 调优直接影响用户体验，是 RAG 应用质量的核心。但前提是已有可用的数据和索引。

**Independent Test**: 开发者能够针对同一份数据，对比默认 Query Engine 与调优后 Query Engine 的回答质量差异。

**Acceptance Scenarios**:

1. **Given** 开发者发现 RAG 应用的回答不够精准，**When** 参照 Query Engine 调优章节，**Then** 能够识别问题原因（如 top_k 过小、chunk_size 不合理）
2. **Given** 开发者需要处理多语言文档，**When** 参照多语言支持章节，**Then** 能够配置合适的 Embedding 模型
3. **Given** 开发者需要在回答中引用来源，**When** 参照 Citation 功能章节，**Then** 能够让 LLM 在回答时标注信息来源

---

### User Story 4 - 高级用户构建自主 Agent 系统 (Priority: P4)

作为一名已熟悉 LlamaIndex 核心功能的高级开发者，我希望学习如何使用 LlamaIndex 的 Agent 模式构建能够自主规划、调用工具、执行多步任务的智能代理系统。

**Why this priority**: Agent 是 LLM 应用的高阶形态，但需要前置知识作为基础，因此优先级较低。

**Independent Test**: 开发者能够构建一个能够"查询天气 → 推荐穿搭 → 生成日程提醒"的多步骤 Agent。

**Acceptance Scenarios**:

1. **Given** 开发者需要构建能自主调用多个工具的 Agent，**When** 参照 ReAct Agent 章节，**Then** 能够理解并实现一个基本的 ReAct 循环
2. **Given** 开发者需要让 Agent 具备规划能力，**When** 参照 Planning Agent 章节，**Then** 能够实现任务分解和子任务执行
3. **Given** 开发者需要监控 Agent 的执行过程，**When** 参照 Agent 可观测性章节，**Then** 能够追踪每一步决策和工具调用

---

### User Story 5 - 运维人员将 RAG 应用部署到生产环境 (Priority: P5)

作为一名负责将 LlamaIndex 应用部署上线的运维或全栈开发者，我希望学习生产环境的最佳实践，包括性能优化、成本控制、监控告警、安全合规等。

**Why this priority**: 生产部署是教程的"终点"，需要前面所有知识作为铺垫。

**Independent Test**: 运维人员能够按照教程完成一个 RAG 应用的容器化部署，并配置基本的监控和告警。

**Acceptance Scenarios**:

1. **Given** 运维人员需要降低 LLM API 成本，**When** 参照成本优化章节，**Then** 能够实施缓存策略和批量处理
2. **Given** 运维人员需要确保数据安全，**When** 参照安全合规章节，**Then** 能够配置数据脱敏和访问控制
3. **Given** 运维人员需要监控 RAG 应用的健康状态，**When** 参照监控告警章节，**Then** 能够配置基本的 Metrics 和 Alerts

---

### Edge Cases

- 当用户使用的 LlamaIndex 版本与教程版本不一致时，如何引导用户查阅版本差异说明？
- 当用户的 LLM API Key 无效或超额时，教程应如何提示排查步骤？
- 当用户的本地环境缺少 GPU 时，如何提供 CPU-only 的替代方案？
- 当用户加载的文档包含特殊字符或编码问题时，如何在避坑指南中覆盖？
- 当用户所在网络无法访问 OpenAI API 时，如何引导使用本地模型或代理？

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: 教程 MUST 与现有 VitePress 站点的 AI 栏目（`/docs/ai/`）目录结构保持一致
- **FR-002**: 每个章节 MUST 包含四个标准化模块：核心概念比喻化解释、标准操作步骤、避坑指南、生产最佳实践
- **FR-003**: 所有代码示例 MUST 标注适用的 LlamaIndex 版本号
- **FR-004**: 所有代码示例 MUST 经过实际运行验证，确保可执行
- **FR-005**: 复杂流程（如 RAG 检索流、Agent 决策循环）MUST 使用 Mermaid 流程图可视化
- **FR-006**: 所有专业术语首次出现时 MUST 配有生活化类比解释
- **FR-007**: 教程 MUST 覆盖完整的 LlamaIndex 生命周期：RAG 基础 → 环境搭建 → Data Connectors → Index 构建 → Query Engine → Agent 模式
- **FR-008**: 教程 MUST 以用户故事和生产场景驱动，而非算法推导
- **FR-009**: 避坑指南 MUST 覆盖每个阶段最常见的 3-5 个问题
- **FR-010**: 生产最佳实践 MUST 包含可量化的建议（如"chunk_size 建议 512-1024"）
- **FR-011**: 教程 MUST 遵循项目宪法中的增量式开发约束，不修改任何现有文件
- **FR-012**: 所有 Mermaid 图表 MUST 优先使用纵向布局（TD/TB）以适应移动端阅读

### Key Entities

- **教程章节（Chapter）**: 教程的基本组织单元，包含概念解释、操作步骤、代码示例、避坑指南、最佳实践
- **代码示例（Code Sample）**: 可独立运行的代码片段，包含版本标注、逐行注释、预期输出
- **避坑指南条目（Pitfall Entry）**: 常见问题描述、根因分析、解决方案、预防措施
- **生产最佳实践（Best Practice）**: 场景描述、推荐做法、量化指标、权衡取舍说明
- **Mermaid 图表（Diagram）**: 流程图/序列图/状态图，配有文字说明和节点解释

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 零基础学员完成 RAG 基础章节阅读后，90% 能在 30 分钟内运行出第一个可工作的 RAG 示例
- **SC-002**: 教程的每个代码示例，100% 能在最新 LlamaIndex 版本下无修改直接运行
- **SC-003**: 每个复杂概念（RAG 流程、Agent 循环等）都配有至少 1 张 Mermaid 流程图
- **SC-004**: 每个章节的避坑指南覆盖该阶段 80% 的常见问题（基于社区 FAQ 统计）
- **SC-005**: 教程移动端阅读体验良好，所有内容在 320px 宽度设备上可正常阅读
- **SC-006**: 完成全部教程学习的开发者，能够独立构建一个端到端的 RAG 应用并部署到生产环境
- **SC-007**: 每个专业术语（如 Embedding、Vector Store、Retriever）首次出现时都有类比解释

## Assumptions

- **A-001**: 读者具备基本的 Python 编程能力（能够理解函数、类、模块的概念）
- **A-002**: 读者有基本的命令行操作能力（能够使用 pip 安装包、运行 Python 脚本）
- **A-003**: 教程将基于 LlamaIndex 0.10.x 及以上版本编写，并在版本更新时维护兼容性说明
- **A-004**: 代码示例默认使用 OpenAI API 作为 LLM 后端，同时提供本地模型替代方案
- **A-005**: 教程假设读者能够访问基本的 LLM API（OpenAI 或其他兼容 API），网络受限场景在避坑指南中覆盖

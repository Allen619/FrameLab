## 重要说明

> **本变更的定位是"LangGraph 全面中文教程"，而非仅对 Overview 页面的拆解。**
>
> 官方入口 `https://docs.langchain.com/oss/python/langgraph/overview` 只是侧边栏的起点，
> 完整的官方文档包含 **26+ 个独立页面**，横跨 Get started、Capabilities、Production、LangGraph APIs 四大分组。
> 每个页面都有独立的深度内容（H2/H3 多层），需要逐一深入阅读、理解后编写对应的中文教程。
>
> **已有页面的处理：** 本站已有 `overview-deep-dive`（Overview 全量拆解）页面应被整合或拆分到
> 新的结构化章节中，不再作为独立入口保留。首页 hero 区的"Overview 全量拆解"按钮应改为新的导航结构。

---

## 官方文档完整菜单结构（2026-02-21 Playwright 实测）

以下为 `https://docs.langchain.com/oss/python/langgraph/` 侧边栏完整结构：

### Overview（1 页）
| 官方页面 | URL |
|---------|-----|
| LangGraph overview | `/oss/python/langgraph/overview` |

### Get started（6 页）
| 官方页面 | URL |
|---------|-----|
| Install | `/oss/python/langgraph/install` |
| Quickstart | `/oss/python/langgraph/quickstart` |
| Local server | `/oss/python/langgraph/local-server` |
| Changelog | 外链至 `/oss/python/releases/changelog` |
| Thinking in LangGraph | `/oss/python/langgraph/thinking-in-langgraph` |
| Workflows + agents | `/oss/python/langgraph/workflows-agents` |

### Capabilities（7 页）
| 官方页面 | URL |
|---------|-----|
| Persistence | `/oss/python/langgraph/persistence` |
| Durable execution | `/oss/python/langgraph/durable-execution` |
| Streaming | `/oss/python/langgraph/streaming` |
| Interrupts | `/oss/python/langgraph/interrupts` |
| Time travel | `/oss/python/langgraph/use-time-travel` |
| Memory | `/oss/python/langgraph/add-memory` |
| Subgraphs | `/oss/python/langgraph/use-subgraphs` |

### Production（6 页）
| 官方页面 | URL |
|---------|-----|
| Application structure | `/oss/python/langgraph/application-structure` |
| Test | `/oss/python/langgraph/test` |
| LangSmith Studio | `/oss/python/langgraph/studio` |
| Agent Chat UI | `/oss/python/langgraph/ui` |
| LangSmith Deployment | `/oss/python/langgraph/deploy` |
| LangSmith Observability | `/oss/python/langgraph/observability` |

### LangGraph APIs（6 页）
| 官方页面 | URL |
|---------|-----|
| Choosing APIs | `/oss/python/langgraph/choosing-apis` |
| Graph API | `/oss/python/langgraph/graph-api` |
| Use the graph API | `/oss/python/langgraph/use-graph-api` |
| Functional API | `/oss/python/langgraph/functional-api` |
| Use the Functional API | `/oss/python/langgraph/use-functional-api` |
| Runtime (Pregel) | `/oss/python/langgraph/pregel` |

**合计：26 个页面**（不含 Changelog 外链）

---

## 本站现有页面与覆盖对照

| 本站现有文件 | 覆盖官方主题 | 状态 |
|-------------|-------------|------|
| `index.md` | 首页 | 需重构（去掉"Overview 全量拆解"入口，改为新结构导航） |
| `guide/overview-deep-dive.md` | Overview | **待整合**：内容拆分至新章节，不再单独保留 |
| `guide/getting-started.md` | Install + Quickstart + Thinking in LangGraph | 需拆分深化 |
| `guide/graph-api-basics.md` | Graph API + Use the graph API（部分） | 需扩展深化 |
| `guide/advanced-patterns.md` | Capabilities 多个主题（部分） | 需拆分为独立章节 |
| `guide/production.md` | Production 多个主题（部分） | 需拆分为独立章节 |
| `guide/pitfalls.md` | 独创内容 | 保留，可作为补充参考 |

**缺失主题（无对应页面）：**
- Workflows + agents（工作流模式详解）
- Choosing APIs（API 路线选型）
- Functional API + Use the Functional API
- Persistence（持久化完整讲解）
- Durable execution（完整讲解）
- Streaming（完整讲解）
- Interrupts（完整讲解）
- Time travel（完整讲解）
- Memory（完整讲解）
- Subgraphs（完整讲解）
- Application structure
- Test
- LangSmith Studio / Agent Chat UI / Deployment / Observability
- Runtime (Pregel)
- Local server

---

## 1. 官方菜单映射与缺口审计

- [x] 1.1 基于上方完整菜单对照表，正式确认每个主题的"已覆盖 / 缺失 / 需深化"状态
- [x] 1.2 对每个官方页面深入阅读（使用 Playwright 逐页浏览），提取核心知识点与代码示例结构
- [x] 1.3 将最终映射矩阵纳入变更记录，作为后续验收依据

## 2. 信息架构与导航重构

- [x] 2.1 设计新的 LangGraph 侧边栏分层结构，对齐官方四大分组：
  - **入门篇**：概览、安装与环境、快速上手、LangGraph 思维方式、工作流与 Agent 模式
  - **核心能力篇**：持久化、Durable Execution、Streaming、Interrupts（HITL）、Time Travel、Memory、Subgraphs
  - **API 篇**：API 路线选型、Graph API 概念与实战、Functional API 概念与实战、Runtime（Pregel）
  - **工程化篇**：应用结构、测试、LangSmith Studio、Agent Chat UI、部署、可观测性
  - **参考篇**：踩坑指南（保留 pitfalls）
- [x] 2.2 重构首页 `index.md`：去掉"Overview 全量拆解"入口，改为新结构的分组导航
- [x] 2.3 在 `docs/.vitepress/config.mts` 更新侧边栏配置，接入所有新增页面
- [x] 2.4 校验所有导航路径与页面路径一致，无断链或错误路由

## 3. 核心内容编写 — 入门篇

> 每个页面须深入阅读对应官方页面全文（不只看标题），提取完整知识后以中文教程形式改写。

- [x] 3.1 **概览页重写**（整合 `overview-deep-dive.md`）
  - 官方页面：Overview（Install + Core benefits + LangGraph ecosystem）
  - 要点：LangGraph 定位、核心收益（durable execution / HITL / memory / debugging / deployment）、生态关系
- [x] 3.2 **安装与环境配置**
  - 官方页面：Install + Local server
  - 要点：pip/uv 安装、本地开发服务器配置、环境要求
- [x] 3.3 **快速上手**（扩展现有 `getting-started.md`）
  - 官方页面：Quickstart（Graph API 版 + Functional API 版两套示例）
  - 要点：定义工具与模型、定义状态、构建节点、编译图、两套 API 的对比式教学
- [x] 3.4 **LangGraph 思维方式**（新增）
  - 官方页面：Thinking in LangGraph
  - 要点：5 步法（映射流程→识别步骤类型→设计状态→构建节点→连线），email agent 完整示例
  - H2 结构：流程映射、步骤类型（LLM/Data/Action/UserInput）、状态设计原则、节点构建、连线组装
- [x] 3.5 **工作流与 Agent 模式**（新增）
  - 官方页面：Workflows + agents
  - 要点：Prompt chaining、并行化、路由、Orchestrator-worker、Evaluator-optimizer、Agent 模式
  - 含完整代码示例与 Mermaid 流程图

## 4. 核心内容编写 — 能力篇

> 以下每个主题在官方文档中都是独立且内容深度的页面，必须逐一深入。

- [x] 4.1 **持久化（Persistence）**（新增独立页）
  - 官方页面结构：Threads / Checkpoints（get_state, get_state_history, replay, update_state）/ Memory store（basic, semantic search, using in LangGraph）/ Checkpointer libraries / Capabilities
  - 含 checkpoint 生命周期 Mermaid 图
- [x] 4.2 **Durable Execution**（从 `advanced-patterns.md` 拆出并深化）
  - 官方页面结构：durability 模式（exit/async/sync）、retry/recovery 语义
- [x] 4.3 **Streaming 全解**（新增独立页）
  - 官方页面结构：stream modes 列表、基础用法、多模式组合、graph state streaming、subgraph outputs、LLM tokens、custom data、any LLM 适配、禁用特定模型 streaming
- [x] 4.4 **Interrupts（HITL）全解**（新增独立页）
  - 官方页面结构：interrupt 暂停、resume 恢复、常见模式（stream HITL / 多中断 / approve-reject / review-edit / tool 内中断 / input 验证）、规则（不 try-except / 不重排序 / 不返回复杂值 / 幂等副作用）、subgraph 中使用、调试
  - 含 interrupt-resume 流程 Mermaid 图
- [x] 4.5 **Time Travel**（新增独立页）
  - 官方页面结构：4 步法（运行图 → 定位 checkpoint → 可选修改状态 → 恢复执行）
  - 含回放与分叉 Mermaid 图
- [x] 4.6 **Memory 全解**（新增独立页）
  - 官方页面结构：短期记忆（add + production use + subgraph use）/ 长期记忆（store access + production + semantic search）/ 管理短期记忆（trim / delete / summarize / manage checkpoints）/ 数据库管理
- [x] 4.7 **Subgraphs**（新增独立页）
  - 官方页面结构：从节点调用图、将图作为节点添加、持久化、查看 subgraph 状态、stream subgraph 输出

## 5. 核心内容编写 — API 篇

- [x] 5.1 **API 路线选型**（新增）
  - 官方页面：Choosing APIs
  - 要点：快速决策指南、Graph API 4 大适用场景（复杂分支/状态管理/并行/团队协作）、Functional API 4 大适用场景（现有代码/线性流/快速原型/函数作用域状态）、混合使用、迁移策略
- [x] 5.2 **Graph API 概念详解**（扩展现有 `graph-api-basics.md`）
  - 官方页面：Graph API（概念篇）
  - H2 结构：Graphs（StateGraph / 编译）/ State（Schema / Reducers / Messages）/ Nodes（START/END/Caching）/ Edges（Normal/Conditional/EntryPoint）/ Send / Command / Graph migrations / Runtime context / Visualization
- [x] 5.3 **Graph API 实战指南**（新增或从现有拆分）
  - 官方页面：Use the graph API
  - H2 结构：定义与更新状态（reducers/overwrite/input-output schemas/private state/pydantic）/ 运行时配置 / 重试策略 / 节点缓存 / 顺序步骤 / 分支（并行/延迟/条件）/ Map-Reduce / 循环控制 / Async / Command / 可视化
- [x] 5.4 **Functional API 概念详解**（新增）
  - 官方页面：Functional API
  - H2 结构：@entrypoint 与 @task / 与 Graph API 对比 / 完整示例 / Entrypoint（定义/注入参数/执行/恢复/短期记忆/entrypoint.final）/ Task（定义/执行/何时使用）/ 序列化 / 确定性 / 幂等性 / 常见陷阱
- [x] 5.5 **Functional API 实战指南**（新增）
  - 官方页面：Use the Functional API
  - 要点：实际使用 @entrypoint + @task 构建工作流、streaming、long-term memory
- [x] 5.6 **Runtime（Pregel）**（新增）
  - 官方页面：Runtime
  - H2 结构：Overview / Actors / Channels / Examples / High-level API

## 6. 核心内容编写 — 工程化篇

- [x] 6.1 **应用结构**（从 `production.md` 拆出并深化）
  - 官方页面：Application structure
  - H2 结构：关键概念 / 文件结构 / 配置文件 / 依赖 / Graphs / 环境变量
- [x] 6.2 **测试**（从 `production.md` 拆出并深化）
  - 官方页面：Test
  - H2 结构：前置条件 / 入门 / 测试单独节点与边 / 部分执行
- [x] 6.3 **LangSmith Studio**（新增）
  - 官方页面：LangSmith Studio
  - 要点：可视化调试工具、原型设计、状态检查
- [x] 6.4 **Agent Chat UI**（新增）
  - 官方页面：Agent Chat UI
  - 要点：Agent 交互界面、部署方式
- [x] 6.5 **部署（LangSmith Deployment）**（从 `production.md` 拆出并深化）
  - 官方页面：LangSmith Deployment
  - 要点：部署平台、扩展策略、团队协作
- [x] 6.6 **可观测性（LangSmith Observability）**（新增）
  - 官方页面：LangSmith Observability
  - 要点：追踪、评估、监控、执行路径可视化

## 7. 现有内容处理

- [x] 7.1 将 `overview-deep-dive.md` 内容整合到新的概览页与相关章节，删除原文件
- [x] 7.2 将 `advanced-patterns.md` 内容拆分到各能力篇独立章节（Persistence/DurableExec/Streaming/Interrupts/Memory）
- [x] 7.3 将 `production.md` 内容拆分到各工程化篇独立章节（AppStructure/Test/Deploy/Observability）
- [x] 7.4 保留 `pitfalls.md` 作为"踩坑指南"参考页，补充新章节交叉引用
- [x] 7.5 更新 `getting-started.md` 以对齐新结构（可能需要拆分或重写）

## 8. 章节质量增强（可学性与可读性）

- [x] 8.1 为高复杂机制添加适量 Mermaid 图：
  - 并行收敛（Parallelization + Send API）
  - HITL 中断恢复流程（interrupt → human review → Command resume）
  - 回放与分叉（Time Travel checkpoint → replay/fork）
  - Checkpoint 生命周期（create → save → restore → update）
  - Pregel 执行模型（superstep → channels → actors）
- [x] 8.2 在关键章节增加前端类比并补充"LangGraph 原生语义"回收段
  - State vs Redux store、Node vs Express middleware、Edge vs React Router、Checkpoint vs localStorage snapshot 等
- [x] 8.3 为每章补充先修关系（"阅读本章前，请先完成..."）、下一步链接与跨章节索引

## 9. 时效性与事实校验

- [x] 9.1 对所有新增/修改章节的术语、能力边界、执行语义、示例用法执行 Context7 校验
- [x] 9.2 对版本敏感内容与关键入口链接执行 Playwright 官方页面复核
- [x] 9.3 汇总校验结论，标注"已确认项/待跟进项"

## 10. 生产级验收

- [x] 10.1 运行 `npm run build`，确保文档构建通过
- [x] 10.2 使用 Playwright 对所有新增页面执行桌面端与移动端二次验证
- [x] 10.3 验证 Mermaid 渲染、导航可达性与交叉链接可点击
- [x] 10.4 整理交付报告并更新 OpenSpec 任务完成记录

---

## 依赖关系

```
1（审计）→ 2（架构）→ 3/4/5/6（内容编写，可并行）→ 7（现有内容处理）→ 8（质量增强）→ 9（校验）→ 10（验收）
```

- 第 3/4/5/6 组内容编写可在架构确定后并行推进
- 第 7 组（现有内容处理）应在相关新章节完成后执行
- 第 8 组质量增强可随内容编写同步进行
- 第 9/10 组为最终验收，依赖所有内容完成

## 优先级

**P0（必须优先）：**
- 1.1-1.3 审计（所有后续工作的基础）
- 2.1-2.4 架构重构（决定全局结构）
- 3.4 Thinking in LangGraph（官方推荐的思维入门）
- 3.5 Workflows + agents（核心模式理解）
- 4.4 Interrupts / HITL（LangGraph 最核心的差异化能力）
- 5.1 API 路线选型（读者最常卡住的决策点）

**P1（高优先）：**
- 4.1 Persistence、4.3 Streaming、4.6 Memory
- 5.2-5.5 Graph API + Functional API（双路线完整覆盖）
- 3.3 快速上手扩展

**P2（中优先）：**
- 4.2 Durable Execution、4.5 Time Travel、4.7 Subgraphs
- 5.6 Runtime (Pregel)
- 6.1-6.6 工程化篇全部

**P3（可后续）：**
- 7.x 现有内容清理
- 8.x 质量增强

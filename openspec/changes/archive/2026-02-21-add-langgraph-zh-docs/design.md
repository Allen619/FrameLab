## Context

当前站点采用 VitePress，AI 板块已有 LangChain、LlamaIndex、Instructor 三个专题，LangChain 中仅包含一篇 `langgraph-intro`，对 LangGraph 的学习路径、官方能力映射与生产实践覆盖不足。该变更属于跨内容与导航的文档型改动，约束包括：中文与 UTF-8、面向传统前端开发者、内容需优先基于 Context7 保持时效，并通过 Playwright 对页面与导航做二次验证。

## Goals / Non-Goals

**Goals:**

- 在 AI 板块建立 LangGraph 专题化学习路径，从基础认知到工作流设计与工程落地形成递进结构。
- 将 LangGraph 最新官方定位（低层编排、durable execution、human-in-the-loop、memory、streaming）准确映射到中文文档。
- 与现有 LangChain 章节建立双向联动，补齐“何时用 create_agent，何时用 LangGraph”的决策路径。
- 把“时效校验 + 页面验真”纳入文档交付流程，降低过时信息和渲染问题进入主分支的风险。

**Non-Goals:**

- 不引入新的运行时代码框架或后端服务模板。
- 不将 LangGraph 文档扩展为 API 参考手册级别（以学习与实战上手为主）。
- 不改造站点主题、构建系统或搜索机制。

## Decisions

### 决策 1: 在 AI 信息架构中新增 LangGraph 专题入口并保持 LangChain 关联

- Decision: 在 `docs/ai/` 增加 LangGraph 专题目录与首页，并在 `docs/.vitepress/config.mts` 中补充 AI 导航与侧边栏条目；LangChain 中保留并强化跳转。
- Rationale: LangGraph 已从 LangChain 入门能力演进为独立学习主题，拆分专题更符合认知路径，同时避免 LangChain 单专题承载过重。
- Alternatives considered:
  - 继续仅在 `langchain/guide/langgraph-intro.md` 扩写：会导致目录膨胀且难以建立分层路径。
  - 新建独立顶层分类：信息架构改动过大，不符合最小变更原则。

### 决策 2: 采用“Context7 主数据源 + Playwright 辅助复核”的时效流程

- Decision: 版本敏感与行为定义内容优先来自 Context7；对关键信息（如官方页面文案、章节结构、安装示例）用 Playwright 打开官方文档复核。
- Rationale: 同时满足内容新鲜度与可核验性，减少经验性写作带来的漂移。
- Alternatives considered:
  - 仅手工经验更新：时效风险高。
  - 仅网页浏览不做结构化检索：难以系统覆盖关键能力点。

### 决策 3: 面向前端读者采用“类比优先但语义回收”写法

- Decision: 在状态、节点、边、中断恢复、流式输出等难点处使用前端类比（如 Redux 状态流、路由守卫、事件总线），并明确标注 Python/LangGraph 真实语义。
- Rationale: 降低迁移门槛，同时避免类比误导。
- Alternatives considered:
  - 纯术语直述：学习门槛偏高。
  - 过度类比：会弱化工程准确性，因此只在关键点使用。

### 决策 4: Mermaid 仅用于复杂流程与决策分叉

- Decision: 仅在工作流生命周期、条件分支与人机协作中断恢复等复杂场景使用 Mermaid，其余内容保持文本与代码优先。
- Rationale: 控制认知负担，提升图示维护性与生产可用性。
- Alternatives considered:
  - 全文广泛绘图：维护成本高，阅读节奏被打断。
  - 完全无图：复杂流程理解成本上升。

## Risks / Trade-offs

- [Risk] LangGraph 官方文档持续演进导致章节快速过时 → Mitigation: 在任务中固化 Context7 检索与 Playwright 复核步骤，并优先描述稳定概念。
- [Risk] 新增专题导致 AI 导航层级复杂化 → Mitigation: 采用“基础/进阶/实战”分组与明确命名，减少深层嵌套。
- [Risk] LangChain 与 LangGraph 内容重复或冲突 → Mitigation: 在联动页定义边界与跳转规则，LangChain 偏高层抽象，LangGraph 偏编排实现。
- [Risk] Mermaid 语法或主题渲染问题影响上线质量 → Mitigation: 将 Mermaid 页面列入 Playwright 验收清单，必要时降级为文本流程说明。

## Migration Plan

1. 基于现有 `docs/ai/` 结构确定 LangGraph 专题目录、章节顺序与导航挂载点。
2. 依据 Context7 与官方页面复核结果，编写/更新 LangGraph 与相关 LangChain 章节。
3. 更新 `docs/.vitepress/config.mts`，完成 AI 导航、侧边栏与交叉链接接入。
4. 本地运行文档站并用 Playwright 校验页面可达、导航正确、Mermaid 渲染与关键事实一致性。
5. 若验证失败，优先回滚问题章节或图示为稳定文本，确保可发布状态后再迭代增强。

## Open Questions

- LangGraph 专题是以“教程路线”优先，还是补充“场景索引（客服、工作流自动化、多 Agent）”作为并列入口？
- 是否需要在本次变更内新增“LangGraph 与 LangSmith 配合”独立章节，还是先在生产实践中以小节形式引入？

## Context

现有 LangGraph 中文专题已完成基础入门，但覆盖范围与官方左侧菜单仍有显著差距。根据最新索引，`/oss/python/langgraph/` 相关页面约 29 个，包含 API 路线选择、Pregel 运行时、Functional API、Subgraphs、Time Travel、Observability、Deploy、案例与 changelog 等关键内容。当前站点需要从“有教程”升级为“完整知识体系”，并保持与官方时效同步。

## Goals / Non-Goals

**Goals:**

- 以官方左侧菜单为基准建立一一映射，确保 LangGraph 主题实现结构化全覆盖。
- 用“由浅入深 + 前端可迁移”方式组织内容，形成从概念到生产化的连续学习路径。
- 对关键工程主题提供高质量讲解：durable execution、checkpoint/store、interrupt/resume、streaming、subgraph、replay/time-travel。
- 将 Context7 主检索与页面级验证纳入交付标准，降低知识过时与链接漂移风险。

**Non-Goals:**

- 不将文档扩展为逐 API 参数手册（保持教程导向而非 reference 镜像）。
- 不改造站点主题系统、搜索引擎或部署架构。
- 不在本变更中引入额外示例仓库与后端运行服务。

## Decisions

### 决策 1: 采用“官方菜单映射矩阵”驱动内容建设

- Decision: 先产出 `官方页面 -> 本站页面` 映射矩阵，再按矩阵补齐缺口与深度。
- Rationale: 防止“感觉覆盖了但实际遗漏”，可量化验证覆盖率。
- Alternatives considered:
  - 仅按经验补充：容易漏掉 Pregel/Functional API/Observability 等高级主题。
  - 仅扩写单页：会形成巨页，导航与学习节奏失控。

### 决策 2: 双路线并行组织（Graph API 与 Functional API）

- Decision: 在结构中显式并列 Graph API 与 Functional API，并给出选型/迁移指引。
- Rationale: 官方已明确双路线，读者常在路线选择上卡住，必须前置决策。
- Alternatives considered:
  - 只保留 Graph API：会丢失官方 Functional API 实践价值。
  - 混写两路线：认知负担高，读者难建立边界。

### 决策 3: 质量门槛采用“四道闸”

- Decision: 菜单覆盖检查、Context7 时效校验、Playwright 页面验真、VitePress 构建通过缺一不可。
- Rationale: 文档质量不仅是内容正确，还包括可访问、可导航、可渲染。
- Alternatives considered:
  - 仅文本审校：无法发现断链与渲染问题。
  - 仅构建检查：无法证明知识时效。

### 决策 4: Mermaid 只用于“状态转移与执行语义”高复杂内容

- Decision: 将 Mermaid 使用限制在流程状态、并行收敛、HITL 中断恢复、回放分叉等复杂主题。
- Rationale: 保持图示密度可控，避免视觉噪声。
- Alternatives considered:
  - 全文图示化：维护成本高，且影响阅读效率。
  - 完全无图：执行语义理解成本高。

## Risks / Trade-offs

- [Risk] 官方菜单更新导致映射矩阵过时 → Mitigation: 在交付中记录核验日期并建立“菜单变更复查”任务。
- [Risk] 全覆盖导致学习路径过重 → Mitigation: 分层（基础/进阶/工程/案例）并加先修提示。
- [Risk] 前端类比过多影响准确性 → Mitigation: 每个类比后附“LangGraph 原生语义”回收段。
- [Risk] Playwright 环境波动导致验收阻塞 → Mitigation: 保留构建与链接静态校验作为兜底，并补跑页面验证记录。

## Migration Plan

1. 拉取官方页面清单并建立映射矩阵，标记“已覆盖/缺失/需深化”。
2. 按矩阵新增或扩写章节，优先补齐高价值缺口（Pregel、Functional API、Time Travel、Observability、Deploy）。
3. 更新侧边栏信息架构与跨章节跳转，保证学习顺序闭环。
4. 执行 Context7 事实核验与链接校验，修正文案与示例。
5. 运行构建与 Playwright 验收，记录结果并修复问题后交付。

## Open Questions

- 案例页（SQL Agent / Agentic RAG / Case Studies）是做独立深度页还是先作为“导读 + 链接”形态？
- changelog 是否独立成页，还是放在“版本与迁移”章节并按版本窗口滚动维护？

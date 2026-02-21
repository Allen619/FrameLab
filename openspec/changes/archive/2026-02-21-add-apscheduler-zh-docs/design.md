## Context

当前文档站基于 VitePress，Python 模块已包含标准库与第三方库分层导航，但尚无 APScheduler 专题。该变更是跨内容与导航的文档型改动，不涉及运行时代码。约束包括：中文内容、UTF-8 编码、面向前端读者、信息需保持时效（Context7 优先）并通过 Playwright 二次验证页面可用性。

## Goals / Non-Goals

**Goals:**
- 在 Python 第三方库板块补齐 APScheduler 学习文档，并形成可持续扩展的章节结构。
- 将“信息时效校验”和“页面验真”纳入交付标准，避免过时或无效内容上线。
- 保持与现有 VitePress IA（信息架构）一致，确保侧边栏可发现性。
- 对复杂机制（触发器、调度执行链路）使用少量 Mermaid 图提升理解效率。

**Non-Goals:**
- 不改造站点主题、构建流程或 CI 系统。
- 不引入 APScheduler 运行示例项目仓库或后端服务部署模板。
- 不覆盖 APScheduler 全部 API 参考手册级别内容，只覆盖学习与工程落地所需核心部分。

## Decisions

### 决策 1: 内容落位在现有第三方库层级，新增 APScheduler 子目录
- Decision: 在 `docs/backend/python/libraries/third-party/` 下新增 APScheduler 专题目录与页面，并在 `docs/.vitepress/config.mts` 注册导航入口。
- Rationale: 与现有 Python 文档结构一致，读者路径稳定，维护成本低。
- Alternatives considered:
  - 放到 `advanced/`：不利于按“库”检索，且与现有第三方库组织冲突。
  - 新建独立顶层分类：信息架构变动过大，超出本次变更范围。

### 决策 2: 建立“Context7 主检索 + Playwright 辅核验”双轨流程
- Decision: 事实性与版本敏感信息优先通过 Context7 获取；遇到发布说明、导航路径、页面可访问性等问题时用 Playwright 复核。
- Rationale: 在时效性与可验证性之间取得平衡，降低引用过时信息的风险。
- Alternatives considered:
  - 只依赖手工经验：时效不可控。
  - 只做网页检索不做页面验证：可能出现链接有效但页面渲染或结构不符合预期的问题。

### 决策 3: 面向前端读者采用“概念类比 + 最小必要深度”
- Decision: 在关键章节使用前端类比（如 `setInterval` 与调度触发、事件循环与执行器并发语义）解释心智模型。
- Rationale: 降低前端转后端读者理解门槛，同时保留 Python 语义准确性。
- Alternatives considered:
  - 纯 Python 术语：学习门槛较高。
  - 过度类比：可能牺牲技术准确性，因此仅在关键点少量使用。

### 决策 4: Mermaid 使用“少而关键”的准则
- Decision: 仅在调度生命周期、组件关系等复杂主题使用 Mermaid，普通概念不绘图。
- Rationale: 提升复杂内容可读性，同时避免视觉噪声和维护负担。
- Alternatives considered:
  - 全文大量图示：维护成本高，且降低信息密度。
  - 完全无图：复杂流程理解成本上升。

## Risks / Trade-offs

- [Risk] APScheduler 版本演进导致文档快速过时 → Mitigation: 在文档中标注基准版本与核验日期，并将 Context7 检索纳入编写步骤。
- [Risk] 前端类比造成概念误导 → Mitigation: 每个类比后补充“在 Python/APScheduler 中的真实语义”小节。
- [Risk] 侧边栏层级增加影响可读性 → Mitigation: 控制页面数量与命名一致性，避免过深目录。
- [Risk] Mermaid 渲染或语法问题影响生产质量 → Mitigation: 使用 Playwright 对相关页面进行渲染验收，必要时降级为文本说明。

## Migration Plan

1. 新增 APScheduler 文档目录与基础页面骨架（UTF-8）。
2. 基于 Context7 补充核心章节内容，并记录关键来源。
3. 更新 `docs/.vitepress/config.mts`，将 APScheduler 接入 Python 第三方库导航。
4. 本地构建并使用 Playwright 对新增页面进行访问、导航与关键内容验证。
5. 若验证失败，先修复文档与导航，再重复验证；可通过移除问题图示或降级表述快速回滚到可发布状态。

## Open Questions

- APScheduler 在侧边栏中的分类是否单列（如“调度与任务编排”）还是先放入现有通用分组？
- 是否需要为 APScheduler 增加“与 Celery/RQ 的定位对比”独立章节，还是在概览页简述即可？

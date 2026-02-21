## Context

当前 LangChain 文档仅有 8 篇教程（3 组：基础 4 篇、进阶 3 篇、迁移 1 篇），覆盖面远不及同项目中的 LangGraph 专题（~30 篇、6 组）。LangChain 官方文档已于 2025-2026 年完成重大重构，从旧站 `python.langchain.com` 迁移至 `docs.langchain.com`，文档体系重组为 Core Components / Middleware / Advanced Usage / Multi-agent / Agent Development / Deploy 等模块。

现有 8 篇文档的映射关系：
- `getting-started.md` → 拆分为 overview + install + quickstart
- `agent-architecture.md` → 重构为 agents.md
- `middleware.md` → 拆分为 middleware-overview + prebuilt-middleware + custom-middleware
- `content-blocks.md` → 整合到 messages.md
- `streaming.md` → 保留并增强
- `langgraph-intro.md` → 保留作为联动桥接页，更新链接
- `deployment.md` → 保留并增强
- `legacy-migration.md` → 保留

## Goals / Non-Goals

**Goals:**

- 将 LangChain 文档从 8 篇扩展到 ~33 篇，覆盖官方文档所有核心主题
- 保持与 LangGraph 专题一致的文档质量标准（前端类比 + 原生语义、Mermaid 图表、交叉链接）
- 侧边栏使用 ⭐/🔥 标记重点与高频页面，分组使用 `collapsed` 控制展开
- 所有内容基于 LangChain 最新 API（通过 Context7 + Playwright 验证时效性）
- 为前端开发者提供从零到一的完整学习路径

**Non-Goals:**

- 不翻译官方 API Reference（参考文档直接链接到官方）
- 不覆盖 Deep Agents 产品线（独立主题，不在本次范围内）
- 不覆盖 LangGraph 专题内容（已有独立专题）
- 不创建视频教程或交互式 playground

## Decisions

### D1: 文档结构分组方案

**选择**：按功能域分 8 组（入门 / 核心组件 / 中间件 / 高级用法 / 多智能体 / 开发与部署 / 实战教程 / 迁移），与官方文档结构对齐。

**理由**：官方文档已验证该分组方案的可用性。LangGraph 专题采用 6 组结构效果良好，LangChain 内容更丰富需要 8 组。

**替代方案**：按学习阶段分组（初级/中级/高级）→ 放弃，因为读者往往按需查阅而非顺序学习。

### D2: 现有文档处理策略

**选择**：重构而非保留。将现有 8 篇文档根据新结构拆分重组，旧文件删除或重写。

**理由**：现有文档基于旧版 API 结构组织，强行保留会导致结构不一致。重构后可统一质量标准。

**替代方案**：在现有文档基础上追加新页面 → 放弃，会导致新旧风格不一致。

### D3: 页面完整结构模板

**选择**：每页统一采用以下结构：
```
YAML frontmatter (title + description)
├── 概述（含前端类比 tip）
├── 先修知识链接
├── 核心概念（2-4 个子章节）
│   └── 每个概念：说明 → 代码示例 → 前端类比 tip → 原生语义说明
├── 实战示例（1-2 个完整可运行示例）
├── 最佳实践
├── 常见问题
├── 下一步导航
└── 参考资源
```

**理由**：与 LangGraph 专题保持一致，读者已适应该模式。

### D4: 侧边栏详细规划

**选择**：33 个页面分 8 组，使用 emoji 标记和 collapsed 控制：

```typescript
'/ai/langchain/': [
  {
    text: '入门',
    items: [
      { text: '⭐ 概览', link: '...' },
      { text: '安装与配置', link: '...' },
      { text: '⭐ 快速上手', link: '...' },
      { text: '设计理念', link: '...' },
    ],
  },
  {
    text: '核心组件',
    items: [
      { text: '🔥 智能体 Agent', link: '...' },
      { text: '⭐ 模型 Models', link: '...' },
      { text: '消息 Messages', link: '...' },
      { text: '🔥 工具 Tools', link: '...' },
      { text: '短期记忆', link: '...' },
      { text: '🔥 流式响应 Streaming', link: '...' },
      { text: '⭐ 结构化输出', link: '...' },
    ],
  },
  {
    text: '中间件',
    items: [
      { text: '中间件概览', link: '...' },
      { text: '🔥 内置中间件', link: '...' },
      { text: '自定义中间件', link: '...' },
    ],
  },
  {
    text: '高级用法',
    items: [
      { text: '安全护栏 Guardrails', link: '...' },
      { text: '⭐ 上下文工程', link: '...' },
      { text: '🔥 MCP 协议', link: '...' },
      { text: '人机协作 HITL', link: '...' },
      { text: '🔥 检索增强 RAG', link: '...' },
      { text: '长期记忆', link: '...' },
      { text: '运行时配置', link: '...' },
    ],
    collapsed: true,
  },
  {
    text: '多智能体',
    items: [
      { text: '⭐ 多智能体概览', link: '...' },
      { text: '🔥 多智能体模式', link: '...' },
      { text: '高级多智能体', link: '...' },
    ],
    collapsed: true,
  },
  {
    text: '开发与部署',
    items: [
      { text: 'LangSmith Studio', link: '...' },
      { text: '测试', link: '...' },
      { text: '🔥 部署', link: '...' },
      { text: '可观测性', link: '...' },
    ],
    collapsed: true,
  },
  {
    text: '实战教程',
    items: [
      { text: '语义搜索', link: '...' },
      { text: '🔥 RAG Agent 实战', link: '...' },
      { text: 'SQL Agent 实战', link: '...' },
    ],
    collapsed: true,
  },
  {
    text: '迁移与联动',
    items: [
      { text: 'Legacy 迁移指南', link: '...' },
      { text: 'LangGraph 工作流', link: '...' },
    ],
    collapsed: true,
  },
]
```

### D5: 前端类比使用策略

**选择**：仅在核心抽象概念处使用前端类比（tip 框），每个类比后紧跟"LangChain 原生语义"段落。每页最多 2-3 处类比。

**理由**：LangGraph 专题实践证明该模式有效，但过度类比会干扰理解。

### D6: Mermaid 图表使用策略

**选择**：仅在以下场景使用 Mermaid：
- Agent 执行流程（flowchart）
- 多组件交互序列（sequenceDiagram）
- 概念分类总览（mindmap）
- 每页最多 2 个 Mermaid 图表

**理由**：避免滥用，图表仅在文字难以表达的复杂流程处使用。

## Risks / Trade-offs

**[风险] 现有文档重构可能破坏已有链接** → 旧路径保留重定向或在 config.mts 中配置 rewrites

**[风险] LangChain API 频繁更新导致文档过时** → 所有代码示例通过 Context7 验证最新 API，YAML frontmatter 标注文档版本

**[风险] 33 页文档量大，实现周期长** → 按优先级分批实现：入门+核心组件（P0）→ 高级用法+多智能体（P1）→ 开发部署+教程（P2）

**[权衡] 深度 vs 广度** → 优先广度覆盖所有主题，每页保持中等深度（300-500 行），后续可按需深化

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

中文技术学习文档站，使用 VitePress 构建，面向前端开发者。内容涵盖四大板块：前端、后端（Python）、AI（LangChain / LangGraph / LlamaIndex / Instructor）、运维（Kubernetes）。

## 常用命令

```bash
npm run dev          # 启动开发服务器（热重载）
npm run build        # 生产构建（含断链检查）
npm run preview      # 预览构建产物
npm run lint         # ESLint 检查
npm run lint:fix     # ESLint 自动修复
npm run format       # Prettier 格式化
npm run format:check # Prettier 格式检查
```

## 架构

### 核心配置

- **`docs/.vitepress/config.mts`** — 站点配置中枢：顶部导航（nav）、所有板块的侧边栏（sidebar）、Mermaid 插件集成。**新增/修改页面必须同步更新此文件的 sidebar 配置。**
- 配置通过 `withMermaid(defineConfig({...}))` 包装，启用 Mermaid 图表支持。

### 自定义主题

`docs/.vitepress/theme/` 扩展了默认主题：
- `MermaidZoom.vue` — Mermaid 图表点击放大交互组件
- `custom.css` / `mobile.css` / `mermaid-zoom.css` — 全局样式、移动端适配、图表缩放样式

### 文档内容结构

```
docs/
├── ai/
│   ├── langchain/guide/    # LangChain 教程
│   ├── langgraph/guide/    # LangGraph 全面教程（24 页，按入门/核心能力/API/工程化分组）
│   ├── llamaindex/guide/   # LlamaIndex 教程
│   └── instructor/         # Instructor 教程（含 cookbook/guides/integrations）
├── backend/python/         # Python 教程（basics/data-structures/advanced/libraries/tooling/deployment）
├── frontend/               # 前端（待建设）
├── ops/kubernetes/         # Kubernetes 教程
└── index.md                # 站点首页
```

每个板块有独立的 `index.md` 首页（VitePress home layout）和 `guide/` 子目录存放教程页面。

### OpenSpec 变更管理

`openspec/` 目录管理文档变更提案。结构：`openspec/changes/<change-name>/` 下包含 `proposal.md`、`design.md`、`tasks.md`、`specs/` 等。涉及新增能力或大规模变更时应参考 `openspec/AGENTS.md`。

## 文档编写规范

- **语言**：全站中文，UTF-8 编码
- **目标读者**：前端开发者（资深 JS/TS 背景）
- **风格**：每个技术概念提供前端类比（如 State vs Redux Store），类比后补充"原生语义"说明段落，防止误导
- **代码示例**：Python 代码为主，使用各框架最新 API
- **Mermaid 图表**：用于复杂流程可视化（flowchart / sequenceDiagram / mindmap），VitePress 构建时自动渲染
- **页面结构**：YAML frontmatter（title + description）、先修关系链接、底部"下一步"导航

### 新增内容时的导航检查清单

**新增任何内容板块或子模块时，必须同步检查并更新以下位置：**

1. **`docs/.vitepress/config.mts`** — sidebar 配置（新增页面路由）和 nav 顶部导航（新增板块）
2. **`docs/index.md`**（站点首页）— hero actions 按钮和 features 卡片是否需要新增或更新描述
3. **板块首页**（如 `docs/ai/index.md`）— hero actions 按钮和 features 卡片是否覆盖了所有子模块
4. **相关页面的交叉引用** — 其他页面中引用到的链接是否需要更新

遗漏任何一处都会导致用户无法通过导航发现新内容。

## 代码风格

- TypeScript/JS：无分号、单引号、2 空格缩进、尾逗号 es5、行宽 100（见 `.prettierrc`）
- ESLint：flat config 格式，禁止 `no-explicit-any`（warn）、禁止未使用变量（`_` 前缀豁免）

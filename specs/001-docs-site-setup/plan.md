# Implementation Plan: 文档站点整合

**Branch**: `001-docs-site-setup` | **Date**: 2025-11-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-docs-site-setup/spec.md`

## Summary

创建统一的学习文档站点，整合前端、后端（Python）、AI（LangChain）三大板块。使用 VitePress 作为静态站点生成器，通过物理文件复制迁移现有文档，并通过配置文件实现可定制的侧边栏导航。

## Technical Context

**Language/Version**: TypeScript (VitePress 配置), Markdown (文档内容)
**Primary Dependencies**: VitePress ^1.6.4, vitepress-plugin-mermaid ^2.0.17, mermaid ^11.12.1
**Storage**: 静态文件系统
**Testing**: VitePress 构建验证, 手动链接检查
**Target Platform**: 静态站点 (浏览器)
**Project Type**: 静态文档站点
**Performance Goals**: 首页加载 < 3秒, 搜索响应 < 1秒
**Constraints**: 源目录只读, UTF-8 编码
**Scale/Scope**: ~50 个 Markdown 文档, 3 个板块

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| 原则                | 状态    | 说明                                               |
| ------------------- | ------- | -------------------------------------------------- |
| I. 文件系统边界约束 | ✅ 通过 | 所有操作限制在 `D:\szy\learn` 范围内               |
| II. 只读数据源保护  | ✅ 通过 | 源目录 (python, langchain-v1) 仅读取，通过复制迁移 |
| III. UTF-8 编码强制 | ✅ 通过 | 所有新建文件使用 UTF-8 (无 BOM)                    |
| IV. UI 框架约束     | ✅ 通过 | 使用 VitePress 默认主题                            |
| V. 代码规范工具链   | ✅ 通过 | 配置 Prettier + ESLint                             |

**结果**: 所有宪法检查通过，无违规需要论证。

## Project Structure

### Documentation (this feature)

```text
specs/001-docs-site-setup/
├── plan.md              # 本文件
├── spec.md              # 功能规范
├── research.md          # Phase 0: 技术研究
├── data-model.md        # Phase 1: 数据模型
├── quickstart.md        # Phase 1: 快速开始指南
├── contracts/           # Phase 1: 配置契约
│   ├── vitepress-config.md
│   └── package-config.md
├── checklists/
│   └── requirements.md  # 规范质量检查清单
└── tasks.md             # Phase 2: 任务列表（待生成）
```

### Source Code (repository root)

```text
docs-site/
├── docs/                          # VitePress 文档根目录
│   ├── .vitepress/
│   │   └── config.mts             # VitePress 配置文件
│   ├── index.md                   # 站点首页
│   ├── frontend/                  # 前端板块（占位）
│   │   └── index.md
│   ├── backend/                   # 后端板块（从 python 迁移）
│   │   ├── index.md
│   │   ├── guide/
│   │   │   ├── index.md
│   │   │   ├── setup.md
│   │   │   ├── mapping.md
│   │   │   ├── pitfalls.md
│   │   │   ├── faq.md
│   │   │   └── next-steps.md
│   │   ├── basics/
│   │   │   ├── index.md
│   │   │   ├── variables.md
│   │   │   ├── control-flow.md
│   │   │   ├── functions.md
│   │   │   ├── classes.md
│   │   │   ├── modules.md
│   │   │   ├── packages.md
│   │   │   ├── file-io.md
│   │   │   └── exceptions.md
│   │   ├── data-structures/
│   │   ├── advanced/
│   │   ├── tooling/
│   │   ├── libraries/
│   │   ├── debugging/
│   │   └── deployment/
│   ├── ai/                        # AI 板块（从 langchain-v1 迁移）
│   │   ├── index.md
│   │   └── guide/
│   │       ├── getting-started.md
│   │       ├── agent-architecture.md
│   │       ├── middleware.md
│   │       ├── content-blocks.md
│   │       ├── streaming.md
│   │       ├── langgraph-intro.md
│   │       ├── deployment.md
│   │       └── legacy-migration.md
│   └── public/                    # 静态资源
│       └── images/
├── package.json                   # 项目配置
├── .prettierrc                    # Prettier 配置
├── eslint.config.js               # ESLint 配置
├── .gitignore
├── specs/                         # 规范文档
└── .specify/                      # Speckit 模板
```

**Structure Decision**: 采用 VitePress 标准结构，docs 目录作为文档根目录，按板块（frontend, backend, ai）分区组织内容。

## Complexity Tracking

无宪法违规，此部分不适用。

## Phase 输出物

### Phase 0: 研究

- [x] [research.md](./research.md) - 技术决策和依赖确定

### Phase 1: 设计

- [x] [data-model.md](./data-model.md) - 实体定义和目录映射
- [x] [contracts/vitepress-config.md](./contracts/vitepress-config.md) - VitePress 配置契约
- [x] [contracts/package-config.md](./contracts/package-config.md) - package.json 契约
- [x] [quickstart.md](./quickstart.md) - 快速开始指南

### Phase 2: 任务

- [ ] tasks.md - 待通过 `/speckit.tasks` 生成

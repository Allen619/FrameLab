# Tasks: 文档站点整合

**Input**: Design documents from `/specs/001-docs-site-setup/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: 无自动化测试要求，验证通过手动浏览和构建检查。

**Organization**: 任务按用户故事分组，支持独立实现和测试每个故事。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 可并行执行（不同文件，无依赖）
- **[Story]**: 所属用户故事（US1, US2, US3, US4, US5）
- 包含精确文件路径

## Path Conventions

本项目为 VitePress 静态文档站点：

- 文档根目录: `docs/`
- 配置文件: `docs/.vitepress/config.mts`
- 项目配置: 根目录 `package.json`, `.prettierrc`, `eslint.config.js`

---

## Phase 1: Setup (项目初始化)

**Purpose**: 项目基础结构和依赖配置

- [x] T001 创建 package.json 配置文件 per contracts/package-config.md
- [x] T002 [P] 创建 .prettierrc 配置文件 per contracts/package-config.md
- [x] T003 [P] 创建 eslint.config.js 配置文件 per contracts/package-config.md
- [x] T004 [P] 创建 .gitignore 文件，排除 node_modules 和构建产物
- [x] T005 安装项目依赖 (npm install)
- [x] T006 创建文档目录结构 docs/.vitepress/, docs/frontend/, docs/backend/, docs/ai/, docs/public/

**Checkpoint**: 项目基础结构就绪，可安装依赖并开始配置

---

## Phase 2: Foundational (基础配置)

**Purpose**: 核心配置，所有用户故事的前置依赖

**⚠️ CRITICAL**: 必须完成此阶段才能开始用户故事实现

- [x] T007 创建 VitePress 配置文件 docs/.vitepress/config.mts (基础框架，withMermaid 包装)
- [x] T008 配置顶部导航栏 (首页、前端、后端、AI 四个入口)
- [x] T009 配置本地搜索 search.provider: 'local'
- [x] T010 创建前端板块占位侧边栏配置 '/frontend/'

**Checkpoint**: VitePress 基础配置就绪，可开始各板块内容迁移

---

## Phase 3: User Story 1 - 访问统一文档首页 (Priority: P1) 🎯 MVP

**Goal**: 用户打开站点能看到三大板块入口，可快速导航

**Independent Test**: 访问首页验证三大板块入口可见且可点击

### Implementation for User Story 1

- [x] T011 [US1] 创建站点首页 docs/index.md (hero + features 布局)
- [x] T012 [P] [US1] 创建前端板块占位首页 docs/frontend/index.md
- [x] T013 [P] [US1] 验证首页导航链接指向正确路径
- [x] T014 [US1] 运行 pnpm dev 验证首页显示和导航功能

**Checkpoint**: 首页完成，三大板块入口可见可点击

---

## Phase 4: User Story 2 - 浏览后端板块文档 (Priority: P1)

**Goal**: 用户可浏览所有 Python 相关文档，图片和链接正常

**Independent Test**: 遍历后端板块所有文档，验证内容、图片、链接

### Content Migration for User Story 2

- [x] T015 [P] [US2] 复制 python/docs/guide/ 到 docs/backend/guide/
- [x] T016 [P] [US2] 复制 python/docs/basics/ 到 docs/backend/basics/
- [x] T017 [P] [US2] 复制 python/docs/data-structures/ 到 docs/backend/data-structures/
- [x] T018 [P] [US2] 复制 python/docs/advanced/ 到 docs/backend/advanced/
- [x] T019 [P] [US2] 复制 python/docs/tooling/ 到 docs/backend/tooling/
- [x] T020 [P] [US2] 复制 python/docs/libraries/ 到 docs/backend/libraries/
- [x] T021 [P] [US2] 复制 python/docs/debugging/ 到 docs/backend/debugging/
- [x] T022 [P] [US2] 复制 python/docs/deployment/ 到 docs/backend/deployment/
- [x] T023 [P] [US2] 复制 python/docs/index.md 到 docs/backend/index.md
- [x] T024 [P] [US2] 复制 python/docs/public/images/ 到 docs/public/images/

### Configuration for User Story 2

- [x] T025 [US2] 配置后端板块侧边栏 '/backend/' per contracts/vitepress-config.md
- [x] T026 [US2] 更新后端文档内绝对路径链接 (/ → /backend/)
- [x] T027 [US2] 验证后端板块所有文档链接和图片正常

**Checkpoint**: 后端板块完成，所有文档可浏览，链接和图片正常

---

## Phase 5: User Story 3 - 浏览 AI 板块文档 (Priority: P1)

**Goal**: 用户可浏览所有 LangChain 相关文档，图片和链接正常

**Independent Test**: 遍历 AI 板块所有文档，验证内容、图片、链接

### Content Migration for User Story 3

- [x] T028 [P] [US3] 复制 langchain-v1/docs/guide/ 到 docs/ai/guide/
- [x] T029 [P] [US3] 复制 langchain-v1/docs/index.md 到 docs/ai/index.md
- [x] T030 [P] [US3] 复制 langchain-v1/docs/public/ 资源到 docs/public/ (如有)

### Configuration for User Story 3

- [x] T031 [US3] 配置 AI 板块侧边栏 '/ai/' per contracts/vitepress-config.md
- [x] T032 [US3] 更新 AI 文档内绝对路径链接 (/ → /ai/)
- [x] T033 [US3] 验证 AI 板块所有文档链接和图片正常

**Checkpoint**: AI 板块完成，所有文档可浏览，链接和图片正常

---

## Phase 6: User Story 4 - 管理侧边栏导航顺序 (Priority: P2)

**Goal**: 管理员可通过配置文件调整侧边栏顺序和分组

**Independent Test**: 修改配置文件后重建站点，验证侧边栏变化

### Implementation for User Story 4

- [x] T034 [US4] 验证侧边栏配置格式符合 VitePress 规范 (text, items, collapsed)
- [x] T035 [US4] 测试修改后端板块侧边栏顺序，重建验证生效
- [x] T036 [US4] 测试添加新分组到侧边栏，重建验证显示
- [x] T037 [US4] 文档化侧边栏配置说明 (注释或 README)

**Checkpoint**: 侧边栏配置化完成，可通过修改配置调整导航

---

## Phase 7: User Story 5 - 跨板块搜索文档 (Priority: P3)

**Goal**: 用户可跨所有板块搜索文档内容

**Independent Test**: 搜索关键词，验证结果包含多板块匹配

### Implementation for User Story 5

- [x] T038 [US5] 验证 VitePress 本地搜索已启用 (search.provider: 'local')
- [x] T039 [US5] 运行构建 pnpm build 生成搜索索引
- [x] T040 [US5] 测试搜索功能，验证跨板块结果返回
- [x] T041 [US5] 验证搜索结果点击跳转正确

**Checkpoint**: 搜索功能完成，可跨板块搜索并正确跳转

---

## Phase 8: Polish & 最终验证

**Purpose**: 跨故事验证和最终检查

- [x] T042 运行 pnpm format 格式化所有配置文件
- [x] T043 运行 pnpm lint 检查代码质量
- [x] T044 运行 pnpm build 验证构建无错误
- [x] T045 [P] 验证 Mermaid 图表在文档中正常渲染
- [x] T046 [P] 验证所有板块入口、侧边栏、搜索功能完整性
- [x] T047 运行 quickstart.md 验证清单所有项

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: 无依赖 - 可立即开始
- **Phase 2 (Foundational)**: 依赖 Phase 1 完成 - 阻塞所有用户故事
- **Phase 3-7 (User Stories)**: 依赖 Phase 2 完成
  - US1 可独立完成（首页）
  - US2 可独立完成（后端板块）
  - US3 可独立完成（AI 板块）
  - US4 依赖 US2/US3 配置完成
  - US5 依赖所有内容迁移完成
- **Phase 8 (Polish)**: 依赖所有用户故事完成

### User Story Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational)
    ↓
    ├─→ US1 (首页) ──────────────────────┐
    ├─→ US2 (后端板块) ──┬───────────────┤
    └─→ US3 (AI板块) ───┘               │
                                        ↓
                    US4 (侧边栏管理) ←──┤
                                        │
                    US5 (搜索) ←────────┘
                                        ↓
                    Phase 8 (Polish)
```

### Parallel Opportunities

**Phase 1 内可并行**:

- T002, T003, T004 可并行

**Phase 4 (US2) 内可并行**:

- T015-T024 所有复制任务可并行

**Phase 5 (US3) 内可并行**:

- T028-T030 所有复制任务可并行

**跨故事并行** (需多人协作):

- US1, US2, US3 可同时进行（Foundational 完成后）

---

## Parallel Example: User Story 2 Content Migration

```bash
# 同时启动所有目录复制任务:
Task: "复制 python/docs/guide/ 到 docs/backend/guide/"
Task: "复制 python/docs/basics/ 到 docs/backend/basics/"
Task: "复制 python/docs/data-structures/ 到 docs/backend/data-structures/"
Task: "复制 python/docs/advanced/ 到 docs/backend/advanced/"
Task: "复制 python/docs/tooling/ 到 docs/backend/tooling/"
Task: "复制 python/docs/libraries/ 到 docs/backend/libraries/"
Task: "复制 python/docs/debugging/ 到 docs/backend/debugging/"
Task: "复制 python/docs/deployment/ 到 docs/backend/deployment/"
Task: "复制 python/docs/index.md 到 docs/backend/index.md"
Task: "复制 python/docs/public/images/ 到 docs/public/images/"
```

---

## Implementation Strategy

### MVP First (仅 User Story 1)

1. 完成 Phase 1: Setup
2. 完成 Phase 2: Foundational
3. 完成 Phase 3: User Story 1 (首页)
4. **STOP and VALIDATE**: 测试首页导航
5. 可部署展示基础站点框架

### Incremental Delivery

1. Setup + Foundational → 基础就绪
2. 添加 US1 (首页) → 独立测试 → MVP 可展示
3. 添加 US2 (后端板块) → 独立测试 → 后端文档可用
4. 添加 US3 (AI 板块) → 独立测试 → AI 文档可用
5. 添加 US4 (侧边栏管理) → 独立测试 → 管理功能可用
6. 添加 US5 (搜索) → 独立测试 → 完整功能
7. Polish → 最终发布

### Recommended Sequence

对于单人执行，建议顺序：

1. Phase 1 → Phase 2 → Phase 3 (US1)
2. Phase 4 (US2) - 后端内容迁移
3. Phase 5 (US3) - AI 内容迁移
4. Phase 6 (US4) + Phase 7 (US5)
5. Phase 8 - 最终验证

---

## Summary

| 统计项                 | 数量 |
| ---------------------- | ---- |
| 总任务数               | 47   |
| Phase 1 (Setup)        | 6    |
| Phase 2 (Foundational) | 4    |
| US1 (首页)             | 4    |
| US2 (后端板块)         | 13   |
| US3 (AI 板块)          | 6    |
| US4 (侧边栏管理)       | 4    |
| US5 (搜索)             | 4    |
| Phase 8 (Polish)       | 6    |
| 可并行任务             | 22   |

**MVP 范围**: Phase 1 + Phase 2 + US1 (共 14 个任务)

---

## Notes

- 源目录只读，使用复制方式迁移
- 所有新建文件使用 UTF-8 编码（无 BOM）
- 迁移后验证链接有效性
- 每个 checkpoint 停下来验证故事独立完整
- 避免跨故事依赖导致阻塞

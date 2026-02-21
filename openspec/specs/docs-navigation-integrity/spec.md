## ADDED Requirements

### Requirement: Every content file SHALL be reachable via sidebar navigation

All `.md` files under `docs/` that contain substantive content (non-empty, non-draft) SHALL have a corresponding entry in `docs/.vitepress/config.mts` sidebar configuration. Files that are purely structural (like empty index placeholders) are exempt until populated.

#### Scenario: Orphan page integrated into sidebar
- **WHEN** a content file exists at `docs/ai/langgraph/guide/advanced-patterns.md` with 195+ lines of content
- **THEN** it SHALL appear in the LangGraph sidebar under an appropriate group

#### Scenario: dataclass.md added to Python stdlib sidebar
- **WHEN** `docs/backend/python/libraries/stdlib/text-data/dataclass.md` exists with 855 lines
- **THEN** it SHALL be listed in the Python 标准库 > 文本与数据 sidebar group

#### Scenario: Instructor advanced.md added to sidebar
- **WHEN** `docs/ai/instructor/advanced.md` exists with substantive content
- **THEN** it SHALL appear in the Instructor sidebar under 进阶指南 group

### Requirement: Obsolete files SHALL be removed

Files that have been superseded by a reorganized directory structure and are not referenced anywhere SHALL be deleted from the repository.

#### Scenario: Legacy library root files cleaned up
- **WHEN** `docs/backend/python/libraries/data.md`, `http.md`, `testing.md`, `web-frameworks.md` exist as orphans replaced by `stdlib/` and `third-party/` structure
- **THEN** these files SHALL be deleted

### Requirement: Empty index files SHALL contain navigation content

All `index.md` files that serve as category landing pages SHALL contain at minimum: a title, a one-line description, and a table or list linking to all child pages in that category.

#### Scenario: Empty stdlib sub-category index populated
- **WHEN** `docs/backend/python/libraries/stdlib/collections/index.md` is 0 bytes
- **THEN** it SHALL be populated with a title, description, and links to `counter.md`, `defaultdict.md`, `ordereddict.md` (all child files in that directory)

#### Scenario: All 8 empty index files populated
- **WHEN** the following 8 index files are 0 bytes: `collections/index.md`, `concurrency/index.md`, `datetime/index.md`, `dev-tools/index.md`, `math-random/index.md`, `networking/index.md`, `storage/index.md`, `utilities/index.md`
- **THEN** each SHALL be populated following the same navigation template pattern

### Requirement: APScheduler sub-pages SHALL be navigable

The 7 APScheduler sub-pages that expand on the main `apscheduler.md` entry SHALL be reachable either via sidebar entries or via in-page links from the parent document.

#### Scenario: APScheduler sub-pages accessible
- **WHEN** `apscheduler-overview.md`, `apscheduler-quickstart.md`, `apscheduler-core-concepts.md`, `apscheduler-triggers.md`, `apscheduler-job-stores.md`, `apscheduler-executors.md`, `apscheduler-troubleshooting-best-practices.md` exist under `third-party/scheduling/`
- **THEN** they SHALL be listed in the sidebar under a scheduling sub-group OR linked from the parent `apscheduler.md` page

### Requirement: Navigation covers all content sections

系统 SHALL 确保 docs/.vitepress/config.mts 的 nav 和 sidebar 配置覆盖所有内容板块，包括新增的 CrewAI 板块。AI 下拉菜单 MUST 包含 LangChain、LangGraph、LlamaIndex、Instructor、CrewAI 五个入口。`/ai/crewai/` 路径 MUST 有对应的侧边栏配置。

#### Scenario: CrewAI 路由可达性验证
- **WHEN** VitePress 构建完成
- **THEN** 所有 CrewAI 页面路由在 nav 和 sidebar 中可达，无断链

#### Scenario: AI 板块首页完整性
- **WHEN** 用户访问 AI 板块首页
- **THEN** 页面的 hero actions 和 features 卡片覆盖全部五个 AI 框架

### Requirement: Sidebar configuration SHALL match file system

After all changes, running a consistency check between the sidebar configuration paths and actual file system SHALL produce zero mismatches (no broken links, no missing entries for substantive content files).

#### Scenario: Consistency check passes
- **WHEN** comparing all sidebar `link` values against actual files under `docs/`
- **THEN** every link SHALL resolve to an existing `.md` file, and every substantive `.md` file SHALL have a sidebar entry

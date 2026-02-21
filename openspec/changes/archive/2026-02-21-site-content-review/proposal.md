## Why

站点经过多轮快速迭代后，内容质量和结构一致性出现了明显偏差：存在 19+ 个孤儿页面（有文件但不在 sidebar 中，用户无法通过导航发现）、8 个空 index 文件、板块间内容深度差异悬殊（LangChain 平均 450+ 行 vs Instructor 平均 90 行），以及缺乏对官方文档外链的系统性标注。需要进行一次全面梳理，确保所有内容对用户可发现、可信赖、可深入。

## What Changes

- **修复孤儿页面**：将 19+ 个存在但未收录到 sidebar 的文件纳入导航配置，或决定移除
  - LangGraph: `overview-deep-dive.md`、`getting-started.md`、`graph-api-basics.md`、`production.md`、`advanced-patterns.md`（5 个）
  - Instructor: `advanced.md`（1 个）
  - Python 标准库: `dataclass.md`（855 行大文件未收录）
  - Python 库目录遗留文件: `data.md`、`http.md`、`testing.md`、`web-frameworks.md`（4 个旧文件）
  - APScheduler 子页面: 7 个文件全部未收录到 sidebar
- **填充空 index 文件**：Python 标准库 8 个子分类的 `index.md` 为 0 字节空文件，需添加导航内容
- **外链标注系统**：对文档中涉及的核心 API / 框架知识点，在重点和深入处添加带图标的官方文档外链（新窗口打开），不滥加
- **VitePress 合规检查**：确保所有文档 UTF-8 编码、frontmatter 格式正确、Mermaid 图表可渲染
- **Playwright 验证**：对完成的文档进行浏览器渲染验证和外链有效性检查

## Capabilities

### New Capabilities

- `docs-navigation-integrity`: 文档导航完整性——修复孤儿页面、空 index、sidebar 与文件系统的一致性
- `external-link-annotations`: 外链标注系统——定义在文档中添加官方 API 文档外链的规范、图标样式和适用场景
- `docs-quality-validation`: 文档质量验证——使用 Playwright 进行文档渲染验证和外链有效性检查的流程

### Modified Capabilities

（无需修改已有 spec 的需求定义）

## Impact

- **`docs/.vitepress/config.mts`**：sidebar 配置需大量更新（新增/调整 19+ 个页面路由）
- **8 个空 index 文件**：需填充内容
- **全站 .md 文件**：在关键知识点处添加外链标注
- **自定义样式**：可能需要在 `custom.css` 中添加外链图标样式
- **构建流程**：新增 Playwright 验证步骤

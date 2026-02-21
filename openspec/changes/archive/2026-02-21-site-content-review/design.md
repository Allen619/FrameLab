## Context

站点使用 VitePress 构建，包含四大板块（前端/后端/AI/运维），经过多轮快速迭代后积累了约 130+ 个 Markdown 文件。当前存在三类问题：

1. **导航断裂**：19+ 个文件未收录到 `config.mts` 的 sidebar 配置中（包含 855 行的 `dataclass.md` 大文件），8 个标准库子分类 index 为空文件
2. **缺乏外链标注**：核心知识点缺少官方文档的引用指引，读者无法便捷跳转到权威来源
3. **无系统化验证**：文档渲染和链接有效性未建立自动化检查流程

VitePress 配置文件 `docs/.vitepress/config.mts`（759 行）是所有导航变更的唯一入口。自定义主题位于 `docs/.vitepress/theme/`，已有 `custom.css` 可扩展外链样式。

## Goals / Non-Goals

**Goals:**

- 修复所有孤儿页面，使站内每个有内容的文件都可通过导航发现
- 为 8 个空标准库 index 填充有意义的导航内容
- 建立外链标注规范：在核心 API、框架概念等深入知识点处添加带图标的官方文档链接
- 清理遗留旧文件（已被新结构替代的 4 个 libraries 根目录文件）
- 使用 Playwright 验证文档渲染和外链有效性

**Non-Goals:**

- 不扩充或重写现有文档内容（Instructor 深度不足等问题不在此次范围内）
- 不改变站点整体架构或 VitePress 版本
- 不涉及前端板块的内容建设
- 不添加自动化 CI/CD 验证流水线（仅做一次性人工验证）

## Decisions

### D1: 孤儿页面处理策略

**决定**：逐文件评估，有实质内容的收录到 sidebar，旧文件移除。

- LangGraph 5 个孤儿页面 → 评估是否为正文补充或独立章节，收录有价值的
- Instructor `advanced.md` → 收录到 sidebar「进阶指南」分组
- Python `dataclass.md`（855 行）→ 收录到标准库 sidebar
- 4 个旧 libraries 根目录文件 → 确认被新 stdlib/third-party 结构替代后删除
- APScheduler 7 个子页面 → 评估内容质量，有价值的收录

**替代方案**：一律收录所有文件 → 拒绝，因为部分文件可能是草稿或重复内容。

### D2: 外链图标样式

**决定**：使用 CSS 伪元素 + inline 标记的轻量方案。

在 Markdown 中使用如下模式：
```markdown
[🔗 官方文档](https://docs.python.org/3/library/pathlib.html){target="_blank" rel="noopener"}
```

使用 `🔗` emoji 作为外链标识，配合 VitePress 的 `{target="_blank"}` 属性语法。不引入额外的 CSS 类或组件，保持 Markdown 源文件的可读性和可移植性。

**替代方案**：
- 自定义 Vue 组件 `<ExternalLink>` → 拒绝，增加了文档作者负担和组件耦合
- CSS `a[href^="http"]::after` 全局规则 → 拒绝，会影响所有外链包括不需要标注的

### D3: 外链添加原则

**决定**：仅在以下场景添加外链标注：

1. 首次引入某个核心 API/类/方法时（如 `ChatOpenAI`、`StateGraph` 等框架核心概念）
2. 深入讲解某个技术点且官方文档有更详细的参考时
3. 涉及配置参数、环境变量等需要查阅完整参考的位置

**不添加**的场景：
- 通用编程概念（如 Python 基础语法）
- 已在页面内充分解释的内容
- 每个代码块的每个 import

### D4: 空 index 文件填充模板

**决定**：使用统一的分类导航模板：

```markdown
---
title: <分类名>
---

# <分类名>

<一句话说明该分类覆盖的内容>

| 模块 | 说明 |
|------|------|
| [module](./module.md) | 简要描述 |
```

保持简洁，不使用 VitePress home layout（因为是二级页面，非板块入口）。

### D5: Playwright 验证范围

**决定**：分两轮验证。

- **第一轮**：对修改过的页面进行渲染验证（页面可正常加载、sidebar 导航正确显示、Mermaid 图表渲染）
- **第二轮**：检查所有新增外链的有效性（HTTP 状态码、页面是否可达）

使用 Playwright MCP 工具在开发服务器上执行，不需要额外的测试框架。

## Risks / Trade-offs

- **[外链失效风险]** → 官方文档 URL 可能随版本更新而变化。缓解：优先链接到稳定版文档（如 `/stable/` 而非 `/latest/`），Playwright 验证兜底
- **[sidebar 膨胀]** → 收录大量文件可能使导航过长。缓解：合理使用折叠分组（`collapsed: true`）
- **[旧文件删除影响]** → 删除文件可能影响外部搜索引擎已索引的 URL。缓解：当前站点仅用于学习，无 SEO 需求
- **[验证覆盖不全]** → 一次性手动验证无法防止未来回归。缓解：在 CLAUDE.md 检查清单中强化导航同步要求（已有）

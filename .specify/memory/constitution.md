<!--

# SYNC IMPACT REPORT

Version Change: 1.1.0 → 1.2.0 (MINOR - Added mobile responsiveness principle, strengthened incremental development)

Modified Principles:
- Principle VI. 增量式开发约束: 强化为禁止修改"任何非新增文件"（原仅限教学文档）
- Principle IX. Mermaid 图表可视化要求: 新增纵向布局优先要求

Added Sections:
- Principle X. 移动端自适应要求 (Mobile Responsive Design Requirement)

Removed Sections: None

Templates Requiring Updates:
- .specify/templates/plan-template.md ✅ (Constitution Check section compatible)
- .specify/templates/spec-template.md ✅ (No constitution-specific updates needed)
- .specify/templates/tasks-template.md ✅ (No constitution-specific updates needed)

Follow-up TODOs: None

-->

# Docs-Site 学习文档迁移项目宪法

## Core Principles

### I. 文件系统边界约束

根目录 MUST 锁定为 `D:\szy\learn`。所有文件操作 MUST 限制在此路径范围内。任何尝试访问此路径之外的文件系统操作 MUST 被拒绝。

**理由**: 确保项目隔离性和安全性，防止意外修改系统其他文件。

### II. 只读数据源保护

以下目录 MUST 被视为绝对只读数据源，严禁任何形式的修改：

- `D:\szy\learn\langchain-v1/` - LangChain 学习资料
- `D:\szy\learn\python/` - Python 学习资料

任何尝试对上述目录执行写入、删除、重命名或移动操作的行为 MUST 被阻止。这些目录仅作为内容迁移的源数据使用。

**理由**: 保护原始学习资料的完整性，确保源数据不被意外破坏。

### III. UTF-8 编码强制

`docs-site/` 目录下的所有新建文件和迁移内容 MUST 使用 UTF-8 编码（无 BOM）。

具体要求：

- 所有 Markdown 文件 MUST 使用 UTF-8 编码
- 所有配置文件（JSON, YAML, JS, TS）MUST 使用 UTF-8 编码
- 文件保存时 MUST 不包含 BOM 标记
- 从源目录迁移内容时 MUST 确保转换为 UTF-8 编码

**理由**: 确保跨平台兼容性和中文内容的正确显示。

### IV. UI 框架约束

项目 MUST 使用 VitePress 作为静态站点生成器，并且 MUST 使用其默认主题。

具体要求：

- MUST 使用 VitePress 官方默认主题
- MUST NOT 安装或使用第三方主题
- 样式定制 SHOULD 仅通过 CSS 变量覆盖实现
- 布局扩展 SHOULD 使用 VitePress 提供的 slots 机制

**理由**: 保持项目简洁，降低维护成本，确保与 VitePress 版本升级的兼容性。

### V. 代码规范工具链

项目 MUST 配置并启用以下代码规范工具：

**Prettier（代码格式化）**:

- MUST 在项目根目录配置 `.prettierrc` 或等效配置文件
- MUST 在提交前运行 Prettier 格式化

**ESLint（代码质量）**:

- MUST 在项目根目录配置 `eslint.config.js` 或等效配置文件
- MUST 配置适用于 TypeScript 和 Vue 的规则集
- MUST 在提交前通过 ESLint 检查

**理由**: 确保代码风格一致性和质量，便于团队协作和维护。

### VI. 增量式开发约束

项目 MUST 严格遵循"增量式开发"原则，绝对禁止修改项目中现有的任何非新增文件。

具体要求：

- MUST NOT 修改项目中现有的任何文件（包括但不限于文档、配置、代码）
- MUST NOT 覆盖项目中现有的任何文件
- MUST NOT 删除项目中现有的任何文件
- 仅允许创建新文件或向现有文件追加内容（如配置文件添加新配置项）
- 若需更正现有内容的错误，MUST 创建勘误文档或在新文档中说明
- 若需修改配置，MUST 仅添加新配置项，MUST NOT 修改或删除现有配置项

**理由**: 保护已完成的所有工作成果，确保项目稳定性，防止意外丢失或破坏已验证的内容。

### VII. 视觉风格与语气一致性

所有新内容 MUST 保持与 VitePress 站点现有视觉风格和语气的一致性。

具体要求：

- 新文档的 Markdown 格式 MUST 与现有文档保持一致（标题层级、列表样式、代码块格式）
- 新文档的语气 MUST 保持友好、专业、引导式的风格
- 新文档 MUST 使用与现有文档相同的 frontmatter 结构
- 新增的自定义样式 MUST 遵循现有的 CSS 变量命名规范
- 新增的组件 MUST 与现有 UI 组件风格保持视觉协调

**理由**: 确保整个文档站点具有统一的用户体验，避免风格割裂影响阅读连贯性。

### VIII. 通俗易懂文档标准

文档语言 MUST 通俗易懂，专门针对零基础受众。

具体要求：

- MUST 避免使用未经解释的专业术语
- 首次出现的技术术语 MUST 配有简明的中文解释或类比说明
- MUST 使用日常语言和生活化的类比来解释抽象概念
- 代码示例 MUST 配有逐行注释或步骤说明
- 每个章节 SHOULD 以简单的概念引入开始，逐步深入复杂内容
- MUST 避免假设读者具有先验知识（如"你应该已经知道..."）

**理由**: 本项目面向零基础学习者，确保所有内容对初学者友好，降低学习门槛。

### IX. Mermaid 图表可视化要求

所有复杂的技术概念 MUST 配合 Mermaid 图表进行可视化解释。

具体要求：

- 涉及流程（如 Pod 生命周期、请求处理流程）的概念 MUST 使用流程图（flowchart）
- 涉及状态变化的概念 MUST 使用状态图（stateDiagram）
- 涉及组件关系（如网络模型、架构图）的概念 MUST 使用架构图或序列图
- 涉及数据流向的概念 MUST 使用数据流图或序列图（sequenceDiagram）
- Mermaid 图表 MUST 配有文字说明，解释图表中的关键节点和连接
- 图表 SHOULD 保持简洁，单个图表节点数量 SHOULD NOT 超过 15 个
- 复杂概念 SHOULD 拆分为多个简化图表，分步解释
- **Mermaid 图表 MUST 优先使用纵向布局（TB/TD 方向），以确保移动端阅读体验**
- 横向布局（LR 方向）仅在纵向布局严重影响可读性时使用

**理由**: 可视化是帮助零基础学习者理解复杂概念的关键工具，图文结合能显著提升学习效率。纵向布局在窄屏设备上具有更好的可读性。

### X. 移动端自适应要求

文档 MUST 实现移动端自适应（Responsive Design），确保手机端阅读体验良好。

具体要求：

**Mermaid 图表**:
- MUST 优先使用纵向布局（flowchart TD/TB）
- 图表宽度 SHOULD NOT 超过 600px
- 复杂图表 MUST 拆分为多个小图表以适应窄屏
- SHOULD 考虑为移动端提供简化版图表或文字说明替代

**表格**:
- 宽表格（超过 4 列或内容较长）MUST 具备横向滚动能力
- SHOULD 考虑在移动端将宽表格转换为卡片式布局或列表形式
- 表格列宽 SHOULD 使用百分比或自适应单位
- 关键数据列 SHOULD 放在表格左侧，确保首先可见

**代码块**:
- 长代码块 MUST 具备横向滚动能力，MUST NOT 导致页面整体横向滚动
- 代码块 SHOULD 设置合理的 `max-height` 并支持纵向滚动
- 移动端代码字号 SHOULD NOT 小于 12px 以确保可读性
- SHOULD 为超长代码提供折叠/展开功能

**通用要求**:
- 所有内容 MUST 在 320px 宽度设备上可正常阅读
- 触摸目标（链接、按钮）尺寸 SHOULD 不小于 44x44px
- 文字行宽 SHOULD 控制在 45-75 字符以确保可读性

**理由**: 大量用户通过手机访问学习文档，良好的移动端体验是用户留存和学习效果的关键。

## File System Constraints

### 允许的操作范围

| 路径                         | 读取 | 写入 | 删除 |
| ---------------------------- | ---- | ---- | ---- |
| `D:\szy\learn\docs-site/`    | ✅   | ✅   | ✅   |
| `D:\szy\learn\langchain-v1/` | ✅   | ❌   | ❌   |
| `D:\szy\learn\python/`       | ✅   | ❌   | ❌   |
| 其他路径                     | ❌   | ❌   | ❌   |

### 内容迁移流程

从只读源目录迁移内容时 MUST 遵循以下流程：

1. 读取源文件内容（只读操作）
2. 根据需要转换格式和编码
3. 写入到 `docs-site/` 目标目录
4. 源文件保持不变

## Content Development Workflow

### 增量式内容添加

添加新教学内容时 MUST 遵循以下流程：

1. **审查现有内容**: 确认不存在重复或冲突的文档
2. **创建新文件**: 在适当的目录位置创建新的 Markdown 文件
3. **保持一致性**: 确保格式、语气与现有文档一致
4. **添加可视化**: 为复杂概念创建 Mermaid 图表（优先纵向布局）
5. **通俗化处理**: 检查并简化专业术语，添加解释
6. **移动端检查**: 验证内容在窄屏设备上的显示效果
7. **链接整合**: 在导航和相关文档中添加新内容的链接

### 复杂概念文档化清单

撰写涉及复杂技术概念的文档时 MUST 完成以下检查：

- [ ] 概念是否有通俗易懂的定义？
- [ ] 是否有日常生活类比帮助理解？
- [ ] 是否有 Mermaid 图表可视化？
- [ ] Mermaid 图表是否使用纵向布局？
- [ ] 图表是否配有文字说明？
- [ ] 代码示例是否有逐行注释？
- [ ] 是否避免了未解释的专业术语？
- [ ] 宽表格是否支持移动端横向滚动？
- [ ] 长代码块是否在移动端可正常查看？

## Development Workflow

### 提交前检查

每次提交代码前 MUST 执行以下检查：

1. **格式化检查**: `npm run format` 或等效命令
2. **Lint 检查**: `npm run lint` 或等效命令
3. **构建验证**: `npm run build` 确保无构建错误
4. **移动端预览**: 在开发服务器中使用浏览器设备模拟验证移动端显示

### 文档迁移规范

迁移学习文档时 SHOULD 遵循以下规范：

- 保持原有的目录结构逻辑
- 添加适当的 frontmatter 元数据
- 确保所有链接正确更新
- 图片资源应复制到 `docs-site/public/` 或适当的资源目录

### 分支策略

- `master` 分支为主分支
- 功能开发 SHOULD 在独立分支进行
- 合并前 MUST 通过所有规范检查

## Governance

### 宪法效力

本宪法优先于所有其他开发实践和约定。当其他指导文件与本宪法产生冲突时，以本宪法为准。

### 修订流程

对本宪法的修订 MUST 遵循以下流程：

1. 提出修订理由和具体变更内容
2. 记录修订日期和版本变更
3. 更新所有受影响的模板和指导文件
4. 在 Sync Impact Report 中记录变更影响

### 版本控制

宪法版本遵循语义化版本规范：

- **MAJOR**: 原则移除或不兼容的重大变更
- **MINOR**: 新增原则或实质性扩展
- **PATCH**: 措辞澄清、错误修正等非语义性改动

### 合规审查

所有代码审查和 PR 合并 MUST 验证是否符合本宪法规定的原则。

**Version**: 1.2.0 | **Ratified**: 2025-11-26 | **Last Amended**: 2025-12-15

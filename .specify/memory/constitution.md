# <!--

# SYNC IMPACT REPORT

Version Change: 0.0.0 → 1.0.0 (MAJOR - Initial constitution establishment)

Modified Principles: N/A (Initial version)

Added Sections:

- Core Principles (5 principles)
- File System Constraints (Section 2)
- Development Workflow (Section 3)
- Governance

Removed Sections: N/A (Initial version)

Templates Requiring Updates:

- .specify/templates/plan-template.md ✅ (Constitution Check section compatible)
- .specify/templates/spec-template.md ✅ (No constitution-specific updates needed)
- .specify/templates/tasks-template.md ✅ (No constitution-specific updates needed)

# Follow-up TODOs: None

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

## Development Workflow

### 提交前检查

每次提交代码前 MUST 执行以下检查：

1. **格式化检查**: `npm run format` 或等效命令
2. **Lint 检查**: `npm run lint` 或等效命令
3. **构建验证**: `npm run build` 确保无构建错误

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

**Version**: 1.0.0 | **Ratified**: 2025-11-26 | **Last Amended**: 2025-11-26

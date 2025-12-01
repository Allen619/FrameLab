# Research: 文档站点整合

**Feature**: 001-docs-site-setup
**Date**: 2025-11-26

## 技术决策

### 1. 静态站点生成器

**Decision**: VitePress ^1.6.4

**Rationale**:

- 源项目（python 和 langchain-v1）均使用 VitePress，保持一致性
- 用户明确指定使用 VitePress
- 项目宪法要求使用 VitePress 及其默认主题

**Alternatives Considered**:

- VuePress: 已被 VitePress 取代，性能较低
- Docusaurus: React 生态，与现有项目不兼容
- MkDocs: Python 生态，需要额外学习成本

### 2. 包管理器

**Decision**: pnpm

**Rationale**:

- 用户明确指定使用 pnpm
- 更高效的磁盘空间利用和更快的安装速度
- 对 monorepo 结构支持良好

**Alternatives Considered**:

- npm: 源项目使用，但用户指定 pnpm
- yarn: 功能类似，但用户已明确选择 pnpm

### 3. Mermaid 图表支持

**Decision**: vitepress-plugin-mermaid ^2.0.17 + mermaid ^11.12.1

**Rationale**:

- 源项目均使用此插件
- 保持 Mermaid 图表在迁移后正常渲染
- 使用 `withMermaid` 包装配置

**Configuration Pattern**:

```javascript
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid({
  // VitePress 配置
  mermaid: {
    // Mermaid API 配置
  },
})
```

### 4. 多侧边栏配置策略

**Decision**: 基于路由前缀的对象配置

**Rationale**:

- VitePress 原生支持基于路径的多侧边栏
- 配置文件可完全控制导航顺序和分组
- 不依赖文件系统自动生成

**Configuration Pattern**:

```javascript
sidebar: {
  '/frontend/': [ /* 前端板块配置 */ ],
  '/backend/': [ /* 后端板块配置 */ ],
  '/ai/': [ /* AI 板块配置 */ ]
}
```

### 5. 目录结构设计

**Decision**: docs 目录下按板块分区

**Structure**:

```
docs-site/
├── docs/
│   ├── .vitepress/
│   │   └── config.mts       # 主配置（含侧边栏）
│   ├── index.md             # 站点首页
│   ├── frontend/            # 前端板块
│   │   └── index.md         # 占位首页
│   ├── backend/             # 后端板块（从 python 迁移）
│   │   ├── index.md
│   │   ├── guide/
│   │   ├── basics/
│   │   ├── data-structures/
│   │   ├── advanced/
│   │   ├── tooling/
│   │   ├── libraries/
│   │   ├── debugging/
│   │   └── deployment/
│   ├── ai/                  # AI 板块（从 langchain-v1 迁移）
│   │   ├── index.md
│   │   └── guide/
│   └── public/              # 静态资源
│       ├── images/          # 从 python 迁移的图片
│       └── ...
├── package.json
├── .prettierrc
└── eslint.config.js
```

### 6. 内容迁移策略

**Decision**: 物理文件复制 + 路径更新

**Rationale**:

- 宪法要求源目录只读，不能使用符号链接或引用
- 需要更新相对路径以适应新的目录结构
- 迁移后可独立于源项目运行

**Migration Steps**:

1. 复制 Markdown 文件到目标板块目录
2. 复制 public 目录资源
3. 更新文档内相对路径（如图片引用）
4. 更新内部链接指向新路径

### 7. 代码规范工具

**Decision**: Prettier + ESLint（宪法要求）

**Configuration**:

- `.prettierrc`: 代码格式化配置
- `eslint.config.js`: TypeScript + Vue 规则

### 8. 搜索功能

**Decision**: VitePress 内置本地搜索

**Rationale**:

- 源项目已使用此方案
- 无需外部服务依赖
- 满足跨板块搜索需求

**Configuration**:

```javascript
search: {
  provider: 'local'
}
```

## 依赖清单

| 包名                     | 版本     | 用途                   |
| ------------------------ | -------- | ---------------------- |
| vitepress                | ^1.6.4   | 静态站点生成器         |
| mermaid                  | ^11.12.1 | 图表渲染引擎           |
| vitepress-plugin-mermaid | ^2.0.17  | VitePress Mermaid 集成 |
| prettier                 | ^3.x     | 代码格式化             |
| eslint                   | ^9.x     | 代码质量检查           |
| @eslint/js               | ^9.x     | ESLint JS 配置         |
| typescript-eslint        | ^8.x     | TypeScript ESLint 支持 |

## 技术风险

1. **链接失效风险**: 迁移后需验证所有内部链接
   - 缓解: 构建后运行链接检查脚本

2. **路径不一致风险**: 图片相对路径可能失效
   - 缓解: 统一使用绝对路径 `/images/` 或迁移时自动转换

3. **编码问题风险**: 中文内容可能出现乱码
   - 缓解: 宪法已规定 UTF-8 编码，迁移时验证

## 未解决问题

无 - 所有技术决策已确定。

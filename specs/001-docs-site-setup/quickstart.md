# Quickstart: 文档站点整合

**Feature**: 001-docs-site-setup
**Date**: 2025-11-26

## 快速开始

### 1. 初始化项目

```bash
# 进入项目目录（已存在）
cd D:\szy\learn\docs-site

# 初始化 pnpm 项目
pnpm init

# 安装依赖
pnpm add -D vitepress mermaid vitepress-plugin-mermaid
pnpm add -D prettier eslint @eslint/js typescript-eslint
```

### 2. 创建目录结构

```bash
# 创建文档目录结构
mkdir -p docs/.vitepress
mkdir -p docs/frontend
mkdir -p docs/backend
mkdir -p docs/ai
mkdir -p docs/public/images
```

### 3. 迁移内容

```bash
# 后端板块 - 从 python 项目迁移
# 注意：源目录只读，使用复制方式
cp -r D:\szy\learn\python\docs\guide docs/backend/
cp -r D:\szy\learn\python\docs\basics docs/backend/
cp -r D:\szy\learn\python\docs\data-structures docs/backend/
cp -r D:\szy\learn\python\docs\advanced docs/backend/
cp -r D:\szy\learn\python\docs\tooling docs/backend/
cp -r D:\szy\learn\python\docs\libraries docs/backend/
cp -r D:\szy\learn\python\docs\debugging docs/backend/
cp -r D:\szy\learn\python\docs\deployment docs/backend/
cp D:\szy\learn\python\docs\index.md docs/backend/

# AI 板块 - 从 langchain-v1 项目迁移
cp -r D:\szy\learn\langchain-v1\docs\guide docs/ai/
cp D:\szy\learn\langchain-v1\docs\index.md docs/ai/

# 公共资源
cp -r D:\szy\learn\python\docs\public\images docs/public/
```

### 4. 创建配置文件

创建 `docs/.vitepress/config.mts`：

```typescript
import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
    title: '学习文档站',
    description: '前端、后端、AI 学习资料整合',
    lang: 'zh-CN',

    themeConfig: {
      nav: [
        { text: '首页', link: '/' },
        { text: '前端', link: '/frontend/' },
        { text: '后端', link: '/backend/' },
        { text: 'AI', link: '/ai/' },
      ],

      sidebar: {
        '/frontend/': [
          /* 前端配置 */
        ],
        '/backend/': [
          /* 后端配置 */
        ],
        '/ai/': [
          /* AI 配置 */
        ],
      },

      search: {
        provider: 'local',
      },
    },

    mermaid: {},
  })
)
```

### 5. 创建首页

创建 `docs/index.md`：

```markdown
---
layout: home

hero:
  name: 学习文档站
  text: 前端、后端、AI 学习资料整合
  tagline: 统一管理，高效学习
  actions:
    - theme: brand
      text: 前端
      link: /frontend/
    - theme: alt
      text: 后端
      link: /backend/
    - theme: alt
      text: AI
      link: /ai/

features:
  - title: 前端开发
    details: 前端技术学习资料（待补充）
  - title: 后端开发
    details: Python 开发教程，专为前端开发者设计
  - title: AI 技术
    details: LangChain 1.0 中文教程
---
```

### 6. 更新链接路径

迁移后需要更新文档内的绝对路径链接：

- `/guide/` → `/backend/guide/`
- `/basics/` → `/backend/basics/`
- 等等...

### 7. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:5173 查看效果。

### 8. 构建和预览

```bash
# 构建
pnpm build

# 预览构建结果
pnpm preview
```

## 验证清单

- [x] 首页正常显示三大板块入口
- [x] 点击各板块可正常跳转
- [x] 侧边栏按配置顺序显示
- [x] 文档内图片正常加载
- [x] 文档内链接正常跳转
- [x] Mermaid 图表正常渲染
- [x] 搜索功能正常工作
- [x] 代码格式化检查通过
- [x] ESLint 检查通过
- [x] 构建无错误

## 常见问题

### Q: Mermaid 图表不显示？

确保 `vitepress-plugin-mermaid` 正确配置，使用 `withMermaid` 包装配置。

### Q: 链接 404？

检查链接路径是否包含板块前缀（如 `/backend/`）。

### Q: 图片不显示？

确保图片已复制到 `docs/public/` 目录，使用绝对路径 `/images/xxx.png` 引用。

### Q: 中文乱码？

确保所有文件使用 UTF-8 编码保存（无 BOM）。

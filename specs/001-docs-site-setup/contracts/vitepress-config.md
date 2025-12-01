# VitePress Configuration Contract

**Feature**: 001-docs-site-setup
**Date**: 2025-11-26

本文档定义 VitePress 配置文件的结构契约，确保实现与设计一致。

## 配置文件位置

```
docs-site/docs/.vitepress/config.mts
```

## 配置结构契约

```typescript
import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// 类型定义
interface SidebarItem {
  text: string
  link?: string
  items?: SidebarItem[]
  collapsed?: boolean
}

interface SidebarConfig {
  '/frontend/': SidebarItem[]
  '/backend/': SidebarItem[]
  '/ai/': SidebarItem[]
}

// 导出配置
export default withMermaid(
  defineConfig({
    // === 站点元数据 ===
    title: string,           // 站点标题
    description: string,     // 站点描述
    lang: 'zh-CN',          // 语言设置

    // === 主题配置 ===
    themeConfig: {
      // 顶部导航栏
      nav: [
        { text: string, link: string },
        // 必须包含：首页、前端、后端、AI 四个入口
      ],

      // 侧边栏配置（按路由分区）
      sidebar: SidebarConfig,

      // 搜索配置
      search: {
        provider: 'local'
      },

      // 页脚配置（可选）
      footer?: {
        message: string,
        copyright: string
      },

      // 社交链接（可选）
      socialLinks?: Array<{
        icon: string,
        link: string
      }>
    },

    // === Mermaid 配置 ===
    mermaid: {
      // Mermaid API 配置选项
    }
  })
)
```

## 必须包含的导航项

```typescript
nav: [
  { text: '首页', link: '/' },
  { text: '前端', link: '/frontend/' },
  { text: '后端', link: '/backend/' },
  { text: 'AI', link: '/ai/' },
]
```

## 后端板块侧边栏契约

基于源项目 `python/docs/.vitepress/config.mts` 结构：

```typescript
'/backend/': [
  {
    text: '前端迁移指南',
    items: [
      { text: '概述', link: '/backend/guide/' },
      { text: '环境安装', link: '/backend/guide/setup' },
      { text: '概念映射表', link: '/backend/guide/mapping' },
      { text: '常见陷阱', link: '/backend/guide/pitfalls' },
      { text: '常见问题 (FAQ)', link: '/backend/guide/faq' },
      { text: '进阶学习路径', link: '/backend/guide/next-steps' }
    ]
  },
  {
    text: '基础语法',
    items: [
      { text: '概述', link: '/backend/basics/' },
      { text: '变量与数据类型', link: '/backend/basics/variables' },
      { text: '控制流', link: '/backend/basics/control-flow' },
      { text: '函数', link: '/backend/basics/functions' },
      { text: '类与对象', link: '/backend/basics/classes' },
      { text: 'Python 模块系统', link: '/backend/basics/modules' },
      { text: 'Python 包结构', link: '/backend/basics/packages' },
      { text: '文件 I/O', link: '/backend/basics/file-io' },
      { text: '异常处理', link: '/backend/basics/exceptions' }
    ]
  },
  {
    text: '数据结构',
    items: [
      { text: '概述', link: '/backend/data-structures/' },
      { text: '列表 List', link: '/backend/data-structures/lists' },
      { text: '元组 Tuple', link: '/backend/data-structures/tuples' },
      { text: '字典 Dict', link: '/backend/data-structures/dicts' },
      { text: '集合 Set', link: '/backend/data-structures/sets' }
    ]
  },
  {
    text: '工程化工具',
    items: [
      { text: '概述', link: '/backend/tooling/' },
      { text: 'Poetry 依赖管理', link: '/backend/tooling/poetry' },
      { text: 'Ruff 代码检查', link: '/backend/tooling/ruff' },
      { text: '类型系统', link: '/backend/tooling/typing' }
    ]
  },
  {
    text: '高级特性',
    items: [
      { text: '概述', link: '/backend/advanced/' },
      { text: '装饰器', link: '/backend/advanced/decorators' },
      { text: '生成器', link: '/backend/advanced/generators' },
      { text: '上下文管理器', link: '/backend/advanced/context-managers' },
      { text: '异步编程', link: '/backend/advanced/async' },
      { text: '数据类 (dataclass)', link: '/backend/advanced/dataclasses' }
    ]
  },
  {
    text: '常用库',
    items: [
      { text: '概述', link: '/backend/libraries/' },
      { text: 'pathlib 文件路径', link: '/backend/libraries/pathlib' },
      { text: 'dataclass 数据类', link: '/backend/libraries/dataclass' },
      { text: 'HTTP 请求库', link: '/backend/libraries/http' },
      { text: '数据处理库', link: '/backend/libraries/data' },
      { text: 'Web 框架', link: '/backend/libraries/web-frameworks' },
      { text: '测试工具', link: '/backend/libraries/testing' }
    ]
  },
  {
    text: '调试技巧',
    items: [
      { text: '概述', link: '/backend/debugging/' },
      { text: 'VSCode 调试', link: '/backend/debugging/vscode' },
      { text: 'pdb 命令行调试', link: '/backend/debugging/pdb' },
      { text: '日志调试', link: '/backend/debugging/logging' }
    ]
  },
  {
    text: '部署指南',
    items: [
      { text: '概述', link: '/backend/deployment/' },
      { text: 'Docker 部署', link: '/backend/deployment/docker' },
      { text: '云平台部署', link: '/backend/deployment/cloud' },
      { text: '依赖管理', link: '/backend/deployment/dependencies' }
    ]
  }
]
```

## AI 板块侧边栏契约

基于源项目 `langchain-v1/docs/.vitepress/config.ts` 结构：

```typescript
'/ai/': [
  {
    text: '基础',
    items: [
      { text: '环境搭建', link: '/ai/guide/getting-started' },
      { text: 'Agent 架构', link: '/ai/guide/agent-architecture' },
      { text: 'Middleware', link: '/ai/guide/middleware' },
      { text: 'Content Blocks', link: '/ai/guide/content-blocks' }
    ]
  },
  {
    text: '进阶',
    items: [
      { text: 'Streaming 流式响应', link: '/ai/guide/streaming' },
      { text: 'LangGraph 工作流', link: '/ai/guide/langgraph-intro' },
      { text: '生产部署', link: '/ai/guide/deployment' }
    ]
  },
  {
    text: '迁移',
    items: [
      { text: 'Legacy 迁移指南', link: '/ai/guide/legacy-migration' }
    ]
  }
]
```

## 前端板块侧边栏契约

初始占位配置：

```typescript
'/frontend/': [
  {
    text: '前端开发',
    items: [
      { text: '概述', link: '/frontend/' }
    ]
  }
]
```

## 验证检查点

- [ ] 配置文件使用 `.mts` 扩展名（TypeScript）
- [ ] 使用 `withMermaid` 包装配置
- [ ] `lang` 设置为 `zh-CN`
- [ ] `search.provider` 设置为 `local`
- [ ] 所有三个板块的侧边栏路由前缀正确配置
- [ ] 所有 `link` 路径以板块前缀开头

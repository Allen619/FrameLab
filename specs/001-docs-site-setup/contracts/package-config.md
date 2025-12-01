# Package Configuration Contract

**Feature**: 001-docs-site-setup
**Date**: 2025-11-26

## package.json 契约

```json
{
  "name": "docs-site",
  "version": "1.0.0",
  "type": "module",
  "description": "学习文档整合站点 - 前端、后端、AI",
  "scripts": {
    "dev": "vitepress dev docs",
    "build": "vitepress build docs",
    "preview": "vitepress preview docs",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "devDependencies": {
    "vitepress": "^1.6.4",
    "mermaid": "^11.12.1",
    "vitepress-plugin-mermaid": "^2.0.17",
    "prettier": "^3.4.0",
    "eslint": "^9.15.0",
    "@eslint/js": "^9.15.0",
    "typescript-eslint": "^8.15.0"
  },
  "keywords": ["documentation", "vitepress", "frontend", "backend", "ai", "learning"],
  "author": "Allen_Yu",
  "license": "MIT"
}
```

## 依赖说明

### 核心依赖

| 包名                     | 版本     | 说明                           |
| ------------------------ | -------- | ------------------------------ |
| vitepress                | ^1.6.4   | 静态站点生成器（与源项目一致） |
| mermaid                  | ^11.12.1 | 图表渲染引擎（与源项目一致）   |
| vitepress-plugin-mermaid | ^2.0.17  | VitePress Mermaid 插件         |

### 开发工具依赖

| 包名              | 版本    | 说明                     |
| ----------------- | ------- | ------------------------ |
| prettier          | ^3.4.0  | 代码格式化（宪法要求）   |
| eslint            | ^9.15.0 | 代码质量检查（宪法要求） |
| @eslint/js        | ^9.15.0 | ESLint JS 配置           |
| typescript-eslint | ^8.15.0 | TypeScript ESLint 支持   |

## npm scripts 说明

| 命令                | 用途               |
| ------------------- | ------------------ |
| `pnpm dev`          | 启动开发服务器     |
| `pnpm build`        | 构建生产版本       |
| `pnpm preview`      | 预览构建结果       |
| `pnpm format`       | 格式化代码         |
| `pnpm format:check` | 检查格式是否正确   |
| `pnpm lint`         | 运行 ESLint 检查   |
| `pnpm lint:fix`     | 自动修复 lint 问题 |

## Prettier 配置契约

文件: `.prettierrc`

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "endOfLine": "lf"
}
```

## ESLint 配置契约

文件: `eslint.config.js`

```javascript
import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['node_modules/**', 'docs/.vitepress/cache/**', 'docs/.vitepress/dist/**'],
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
]
```

## 验证检查点

- [ ] `type` 设置为 `module`（ES 模块）
- [ ] VitePress 版本与源项目一致（^1.6.4）
- [ ] Mermaid 相关依赖版本与源项目一致
- [ ] 包含 Prettier 和 ESLint（宪法要求）
- [ ] npm scripts 包含 format 和 lint 命令（宪法要求）

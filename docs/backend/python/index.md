---
layout: home
title: Python for Frontend Devs

hero:
  name: Python for Frontend Devs
  text: 专为前端开发者设计的 Python 教程
  tagline: 从你熟悉的 JavaScript/TypeScript 概念出发，快速掌握 Python
  image:
    src: https://www.python.org/static/community_logos/python-logo-generic.svg
    alt: Python Logo
  actions:
    - theme: brand
      text: 开始学习
      link: /backend/python/basics/
    - theme: alt
      text: 概念映射表
      link: /backend/python/guide/mapping
    - theme: alt
      text: GitHub
      link: https://github.com

features:
  - icon: 🚀
    title: 基础语法
    details: 变量、控制流、函数、类 - 每个概念都与 JS/TS 对比讲解，快速建立知识映射
    link: /backend/python/basics/
    linkText: 开始学习

  - icon: 📦
    title: 数据结构
    details: 列表、字典、集合、元组 - 理解 Python 核心数据结构与 JS Array/Object 的异同
    link: /backend/python/data-structures/
    linkText: 深入了解

  - icon: 🛠️
    title: 工程化工具
    details: Poetry、Ruff、Type Hints - 类比 npm、ESLint、TypeScript，掌握现代 Python 工具链
    link: /backend/python/tooling/
    linkText: 工具链指南

  - icon: ⚡
    title: 高级特性
    details: 装饰器、生成器、异步编程 - 深入 Python 高级特性，对标 HOC、Generator、Promise
    link: /backend/python/advanced/
    linkText: 进阶学习

  - icon: 📚
    title: 常用库
    details: requests、pandas、FastAPI、pytest - Python 生态中最常用的库，与 JS 库对比
    link: /backend/python/libraries/
    linkText: 库介绍

  - icon: 🐛
    title: 调试技巧
    details: VSCode 调试、pdb、logging - 掌握 Python 调试方法，快速定位问题
    link: /backend/python/debugging/
    linkText: 调试指南

  - icon: 🚀
    title: 部署指南
    details: Docker、云平台、依赖管理 - 将 Python 应用部署上线
    link: /backend/python/deployment/
    linkText: 部署上线

  - icon: 🗺️
    title: 前端迁移指南
    details: 50+ JS/TS 到 Python 的概念映射表，一目了然，快速查阅
    link: /backend/python/guide/mapping
    linkText: 查看映射表
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #3776ab 30%, #ffd43b);
  --vp-home-hero-image-background-image: linear-gradient(-45deg, #3776ab50 50%, #ffd43b50 50%);
  --vp-home-hero-image-filter: blur(44px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}
</style>

## 为什么选择这个教程？

作为前端开发者，你已经掌握了编程的核心概念。学习 Python 时，最快的方式是利用你已有的知识，建立概念映射。

| 你熟悉的      | Python 对应   | 学习曲线  |
| ------------- | ------------- | --------- |
| `let`/`const` | 直接赋值      | ⭐ 简单   |
| `Array`       | `list`        | ⭐ 简单   |
| `Object`      | `dict`        | ⭐ 简单   |
| `async/await` | `async/await` | ⭐⭐ 中等 |
| npm/pnpm      | Poetry        | ⭐⭐ 中等 |
| ESLint        | Ruff          | ⭐ 简单   |
| TypeScript    | Type Hints    | ⭐⭐ 中等 |

## 学习路径

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  基础语法   │ ──▶ │  数据结构   │ ──▶ │ 工程化工具  │ ──▶ │  高级特性   │
│  variables  │     │    list     │     │   Poetry    │     │ decorators  │
│ control-flow│     │    dict     │     │    Ruff     │     │ generators  │
│  functions  │     │    set      │     │   typing    │     │   async     │
│   classes   │     │   tuple     │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

## 快速开始

### 1. 搭建开发环境

在开始学习前,需要先安装 Python 和配置开发环境:

- [环境安装指南](/backend/python/guide/setup) - 使用 pyenv + uv 搭建现代化 Python 开发环境
- [VSCode 配置](/backend/python/guide/setup#vscode-python-扩展配置) - 配置 Python 扩展和调试环境
- [常见陷阱](/backend/python/guide/pitfalls) - 避免前端开发者常犯的错误

### 2. 第一个 Python 程序

```python
# 从 Hello World 开始
print("Hello, Frontend Developer!")

# 定义一个函数 (类似 JS function)
def greet(name: str) -> str:
    return f"Hello, {name}!"

# 调用函数
message = greet("Python")
print(message)  # Hello, Python!
```

准备好了吗？[开始学习基础语法 →](/backend/python/basics/)

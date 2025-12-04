---
title: 工程化工具概述
description: Python 现代工程化工具链,与前端工具对比
---

# 工程化工具

## 学习目标

本章节你将学习:

- Python 现代工具链概览
- 依赖管理 - Poetry/uv (对应 npm/pnpm)
- Ruff - 代码检查与格式化(对应 ESLint + Prettier)
- Type Hints - 类型系统(对应 TypeScript)

## 工具链流程

```mermaid
graph LR
    A[依赖管理<br/>Poetry/uv] --> B[Ruff 代码检查]
    B --> C[mypy 类型检查]
    C --> D[pytest 测试]
    D --> E[构建部署]

    style A fill:#e1f5ff
    style B fill:#fff3e0
    style C fill:#f3e5f5
    style D fill:#e8f5e9
```

## 工具链对比

| 用途       | JavaScript/TypeScript | Python            |
| ---------- | --------------------- | ----------------- |
| 包管理     | npm/pnpm/yarn         | Poetry/uv/pip     |
| 依赖锁定   | package-lock.json     | poetry.lock/uv.lock |
| 项目配置   | package.json          | pyproject.toml    |
| 代码检查   | ESLint                | Ruff              |
| 代码格式化 | Prettier              | Ruff (或 Black)   |
| 类型检查   | TypeScript            | mypy + Type Hints |
| 虚拟环境   | node_modules/         | .venv/            |
| 测试框架   | Jest/Vitest           | pytest            |

## 开始学习

- [依赖管理工具总览](/backend/python/tooling/dependency-management/) - Python 依赖管理工具对比与选择
  - [Poetry](/backend/python/tooling/dependency-management/poetry) - 成熟稳定的项目管理工具
  - [uv](/backend/python/tooling/dependency-management/uv) - 极速的现代化包管理器
- [Ruff](/backend/python/tooling/ruff) - 极速的 Python Linter 和 Formatter
- [类型系统](/backend/python/tooling/typing) - Python Type Hints 与类型检查

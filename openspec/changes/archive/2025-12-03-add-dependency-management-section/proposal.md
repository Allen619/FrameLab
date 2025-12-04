## Why

当前 Python 教程中依赖管理内容放在 `tooling/poetry.md` 单个文件中，包含了 Poetry 和 uv 的对比介绍。随着 uv 的快速发展，需要将依赖管理独立为一个目录，分别详细介绍 Poetry 和 uv 两种工具。

## What Changes

- 新建 `tooling/dependency-management/` 目录结构
- 将 `tooling/poetry.md` 内容迁移到 `tooling/dependency-management/poetry.md`
- 新增 `tooling/dependency-management/uv.md` 详细介绍 uv 包管理器
- 新增 `tooling/dependency-management/index.md` 作为依赖管理概述
- 更新 `tooling/index.md` 导航链接

## Impact

- Affected specs: python-docs
- Affected code: `docs/backend/python/tooling/` 目录结构
- 需要更新 VitePress 侧边栏配置（如果有）

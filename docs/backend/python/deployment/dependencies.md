---
title: 依赖管理
description: 虚拟环境和依赖管理最佳实践
---

# 依赖管理

正确管理依赖是部署成功的关键，类似前端的 package.json 和 node_modules。

## 概念对比

| Python             | JavaScript          | 说明         |
| ------------------ | ------------------- | ------------ |
| 虚拟环境 `.venv/`  | `node_modules/`     | 项目依赖目录 |
| `pyproject.toml`   | `package.json`      | 项目配置文件 |
| `poetry.lock`      | `package-lock.json` | 锁定版本文件 |
| `requirements.txt` | -                   | 传统依赖列表 |
| `pip`              | `npm`               | 包管理器     |
| `poetry`           | `pnpm`              | 现代包管理器 |

## 虚拟环境

### 为什么需要虚拟环境？

与 node_modules 类似，虚拟环境隔离项目依赖：

```text
project-a/
├── .venv/           # 项目 A 的依赖
│   └── lib/
│       └── requests==2.31.0

project-b/
├── .venv/           # 项目 B 的依赖
│   └── lib/
│       └── requests==2.28.0
```

### 创建和使用

```bash
# 创建虚拟环境
python -m venv .venv

# 激活（Windows PowerShell）
.venv\Scripts\Activate.ps1

# 激活（Windows CMD）
.venv\Scripts\activate.bat

# 激活（Linux/Mac）
source .venv/bin/activate

# 停用
deactivate
```

## Poetry（推荐）

### 初始化项目

```bash
# 新项目
poetry new my-project

# 已有项目
poetry init
```

### 常用命令

```bash
# 安装依赖
poetry install

# 添加依赖
poetry add fastapi

# 添加开发依赖
poetry add pytest --group dev

# 移除依赖
poetry remove package-name

# 更新依赖
poetry update

# 运行命令
poetry run python main.py
poetry run pytest
```

### 对比 npm 命令

| npm/pnpm         | Poetry                       | 说明       |
| ---------------- | ---------------------------- | ---------- |
| `npm init`       | `poetry init`                | 初始化项目 |
| `npm install`    | `poetry install`             | 安装依赖   |
| `npm add pkg`    | `poetry add pkg`             | 添加依赖   |
| `npm add -D pkg` | `poetry add pkg --group dev` | 开发依赖   |
| `npm run script` | `poetry run cmd`             | 运行命令   |
| `npm update`     | `poetry update`              | 更新依赖   |

## pyproject.toml

```toml
[tool.poetry]
name = "my-api"
version = "0.1.0"
description = "My FastAPI application"
authors = ["Your Name <you@example.com>"]

[tool.poetry.dependencies]
python = "^3.10"
fastapi = "^0.104.0"
uvicorn = "^0.24.0"

[tool.poetry.group.dev.dependencies]
pytest = "^7.4.0"
ruff = "^0.1.0"

[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
```

## requirements.txt

传统方式，部分云平台仍需要：

### 生成

```bash
# 从 Poetry 生成
poetry export -f requirements.txt -o requirements.txt

# 从当前环境生成
pip freeze > requirements.txt
```

### 使用

```bash
pip install -r requirements.txt
```

### 示例

```text
fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
```

## 部署检查清单

1. **有 requirements.txt 或 pyproject.toml**
2. **指定 Python 版本**（在 runtime.txt 或配置中）
3. **锁定依赖版本**（poetry.lock 或固定版本号）
4. **不提交 .venv 目录**（加入 .gitignore）

## .gitignore

```text
# 虚拟环境
.venv/
venv/
ENV/

# 缓存
__pycache__/
*.pyc
.pytest_cache/
.mypy_cache/

# 环境变量
.env
.env.local

# IDE
.vscode/
.idea/
```

## 常见问题

### poetry install 很慢？

使用国内镜像：

```bash
poetry source add tsinghua https://pypi.tuna.tsinghua.edu.cn/simple/
```

### 部署时找不到模块？

确保虚拟环境正确激活，或使用 `poetry run`。

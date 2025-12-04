---
title: Poetry 依赖管理
description: Poetry 完整使用指南,与 npm/pnpm 深度对比
---

# Poetry - Python 依赖管理

Poetry 是 Python 的现代依赖管理工具,提供依赖解析、虚拟环境管理、打包发布等一体化功能,类似前端的 npm/pnpm。

## 为什么选择 Poetry?

Poetry 是成熟稳定的项目管理工具,适合以下场景:

- ✅ 需要发布包到 PyPI
- ✅ 团队已使用 Poetry,保持一致性
- ✅ 需要复杂的依赖组管理
- ✅ 需要插件生态支持

**与传统 pip 的对比**:

```bash
# 传统 pip 方式
pip install requests
pip freeze > requirements.txt  # 手动维护依赖

# Poetry 方式
poetry add requests  # 自动更新 pyproject.toml 和 poetry.lock
```

### 与 npm/pnpm 的相似性

| 特性     | npm/pnpm                               | Poetry              |
| -------- | -------------------------------------- | ------------------- |
| 配置文件 | `package.json`                         | `pyproject.toml`    |
| 锁定文件 | `package-lock.json` / `pnpm-lock.yaml` | `poetry.lock`       |
| 依赖目录 | `node_modules/`                        | `.venv/` (虚拟环境) |
| 脚本运行 | `npm run`                              | `poetry run`        |
| 工作区   | `workspaces`                           | Poetry 不直接支持   |

## 安装 Poetry

### 官方安装方式(推荐)

```bash
# macOS/Linux/WSL
curl -sSL https://install.python-poetry.org | python3 -

# Windows (PowerShell)
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | py -

# 验证安装
poetry --version
```

### 配置 Poetry

```bash
# 查看当前配置
poetry config --list

# 让虚拟环境创建在项目目录内(类似 node_modules)
poetry config virtualenvs.in-project true

# 配置镜像源(中国大陆用户)
poetry config repositories.aliyun https://mirrors.aliyun.com/pypi/simple/
```

## 项目初始化

### 新项目

```bash
# 创建新项目(包含目录结构)
poetry new my-project
cd my-project

# 目录结构
# my-project/
# ├── pyproject.toml
# ├── README.md
# ├── my_project/
# │   └── __init__.py
# └── tests/
#     └── __init__.py
```

### 现有项目

```bash
# 在现有项目中初始化 Poetry
cd existing-project
poetry init  # 交互式配置

# 生成的 pyproject.toml
```

```toml
[tool.poetry]
name = "my-project"
version = "0.1.0"
description = "A short description"
authors = ["Your Name <you@example.com>"]
readme = "README.md"
packages = [{include = "my_project"}]

[tool.poetry.dependencies]
python = "^3.10"

[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
```

## 依赖管理

### 添加依赖

```bash
# 添加生产依赖
poetry add requests
poetry add "flask>=2.0.0"
poetry add pendulum@^2.0.5

# 添加开发依赖
poetry add pytest --group dev
poetry add black ruff --group dev

# 添加可选依赖组
poetry add mysql-connector-python --group mysql
```

```javascript
// npm 对比
npm install requests
npm install --save-dev pytest
```

### 安装依赖

```bash
# 安装所有依赖(根据 poetry.lock)
poetry install

# 仅安装生产依赖
poetry install --only main

# 安装开发依赖
poetry install --with dev

# 安装特定组
poetry install --with mysql

# 同步依赖(删除未声明的包)
poetry install --sync
```

```javascript
// npm 对比
npm install
npm ci  // 类似 poetry install --sync
```

### 更新依赖

```bash
# 更新所有依赖
poetry update

# 更新特定包
poetry update requests

# 更新到最新主版本
poetry add requests@latest
```

```javascript
// npm 对比
npm update
npm update requests
```

### 删除依赖

```bash
# 删除依赖
poetry remove requests

# 删除开发依赖
poetry remove pytest --group dev
```

## 虚拟环境管理

### 激活虚拟环境

```bash
# 方法1: 运行单个命令
poetry run python script.py
poetry run pytest

# 方法2: 激活 shell
poetry shell
# 现在在虚拟环境中
python script.py
exit  # 退出虚拟环境
```

```javascript
// npm 对比
npm run script
npx pytest
```

### 虚拟环境信息

```bash
# 查看虚拟环境路径
poetry env info --path

# 查看虚拟环境详情
poetry env info

# 列出所有虚拟环境
poetry env list

# 删除虚拟环境
poetry env remove python
```

## pyproject.toml 详解

### 完整配置示例

```toml
[tool.poetry]
name = "my-awesome-project"
version = "0.1.0"
description = "An awesome Python project"
authors = ["Alice <alice@example.com>"]
license = "MIT"
readme = "README.md"
homepage = "https://example.com"
repository = "https://github.com/user/project"
keywords = ["python", "awesome"]
classifiers = [
    "Development Status :: 3 - Alpha",
    "Intended Audience :: Developers",
]

# 生产依赖
[tool.poetry.dependencies]
python = "^3.10"
requests = "^2.31.0"
click = "^8.1.0"

# 开发依赖
[tool.poetry.group.dev.dependencies]
pytest = "^8.0.0"
pytest-cov = "^4.1.0"
black = "^24.0.0"
ruff = "^0.1.0"
mypy = "^1.8.0"

# 可选依赖组
[tool.poetry.group.docs.dependencies]
sphinx = "^7.0.0"
sphinx-rtd-theme = "^2.0.0"

[tool.poetry.group.mysql.dependencies]
mysql-connector-python = "^8.0.0"

# 脚本定义(类似 package.json scripts)
[tool.poetry.scripts]
my-script = "my_project.cli:main"

# 构建系统
[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
```

### 版本约束语法

| 约束      | 含义             | npm 对应  |
| --------- | ---------------- | --------- |
| `^1.2.3`  | `>=1.2.3 <2.0.0` | `^1.2.3`  |
| `~1.2.3`  | `>=1.2.3 <1.3.0` | `~1.2.3`  |
| `>=1.2.3` | 大于等于         | `>=1.2.3` |
| `*`       | 任意版本         | `*`       |
| `1.2.*`   | `>=1.2.0 <1.3.0` | `1.2.x`   |

## 常用命令

### 查看依赖

```bash
# 列出所有依赖
poetry show

# 查看依赖树
poetry show --tree

# 查看特定包信息
poetry show requests

# 查看过时的包
poetry show --outdated
```

### 构建与发布

```bash
# 构建包(生成 wheel 和 sdist)
poetry build

# 发布到 PyPI
poetry publish

# 构建并发布
poetry publish --build

# 发布到测试 PyPI
poetry config repositories.testpypi https://test.pypi.org/legacy/
poetry publish -r testpypi
```

### 锁定文件

```bash
# 更新 poetry.lock(不安装)
poetry lock

# 更新 poetry.lock(不更新依赖版本)
poetry lock --no-update

# 检查 poetry.lock 是否需要更新
poetry check
```

## 最佳实践

### 1. 始终提交 poetry.lock

```bash
# .gitignore 不应包含
# poetry.lock  # ❌ 错误!

# poetry.lock 应该被提交
git add poetry.lock
git commit -m "Lock dependencies"
```

### 2. 使用依赖组

```toml
# 分离不同用途的依赖
[tool.poetry.group.dev.dependencies]
pytest = "^8.0.0"

[tool.poetry.group.docs.dependencies]
sphinx = "^7.0.0"

[tool.poetry.group.lint.dependencies]
ruff = "^0.1.0"
mypy = "^1.8.0"
```

### 3. 固定 Python 版本

```toml
[tool.poetry.dependencies]
python = "^3.10"  # 支持 3.10+
# 或
python = ">=3.10,<3.13"  # 明确上限
```

### 4. 脚本定义

```toml
[tool.poetry.scripts]
# 定义命令行工具
my-cli = "my_project.cli:main"

# 使用
# poetry run my-cli
```

## 常见问题

### Q: Poetry 太慢怎么办?

```bash
# 1. 使用国内镜像
poetry config repositories.aliyun https://mirrors.aliyun.com/pypi/simple/
poetry source add aliyun https://mirrors.aliyun.com/pypi/simple/

# 2. 禁用并行安装(如果遇到问题)
poetry config installer.parallel false

# 3. 使用缓存
poetry config cache-dir /path/to/cache
```

### Q: 如何导出 requirements.txt?

```bash
# 导出生产依赖
poetry export -f requirements.txt --output requirements.txt --without-hashes

# 导出开发依赖
poetry export -f requirements.txt --output requirements-dev.txt --with dev --without-hashes
```

### Q: 如何从 requirements.txt 迁移?

```bash
# 1. 初始化 Poetry
poetry init

# 2. 批量添加依赖
cat requirements.txt | xargs -I {} poetry add {}

# 或使用脚本
while read requirement; do poetry add "$requirement"; done < requirements.txt
```

### Q: Poetry 与 pip 能共存吗?

可以,但不推荐混用:

- ✅ 使用 `poetry add` 添加依赖
- ❌ 避免 `pip install` (会绕过 Poetry 管理)

## 命令速查表

| 操作     | npm/pnpm          | Poetry                          |
| -------- | ----------------- | ------------------------------- |
| 初始化   | `npm init`        | `poetry init`                   |
| 安装依赖 | `npm install`     | `poetry install`                |
| 添加依赖 | `npm add pkg`     | `poetry add pkg`                |
| 删除依赖 | `npm remove pkg`  | `poetry remove pkg`             |
| 更新依赖 | `npm update`      | `poetry update`                 |
| 运行脚本 | `npm run script`  | `poetry run script`             |
| 列出依赖 | `npm list`        | `poetry show`                   |
| 过时的包 | `npm outdated`    | `poetry show --outdated`        |
| 清理缓存 | `npm cache clean` | `poetry cache clear --all pypi` |
| 审计安全 | `npm audit`       | `poetry check` (有限)           |

## 进阶话题

### 使用私有源

```bash
# 配置私有 PyPI 仓库
poetry config repositories.private https://private.pypi.org/simple/
poetry config http-basic.private username password

# 从私有源安装
poetry add my-private-package --source private
```

### Monorepo 支持

Poetry 本身不直接支持 monorepo,但可以配合路径依赖:

```toml
[tool.poetry.dependencies]
my-shared-lib = {path = "../shared-lib", develop = true}
```

## 小结

- Poetry 是 Python 的现代化依赖管理工具
- 类似 npm/pnpm,但提供更强的依赖解析
- `pyproject.toml` 对应 `package.json`
- `poetry.lock` 对应 `package-lock.json`
- 始终提交 `poetry.lock` 确保环境一致性

更多信息请参考 [Poetry 官方文档](https://python-poetry.org/docs/)

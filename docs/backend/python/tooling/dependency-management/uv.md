---
title: uv 包管理器
description: uv 完整使用指南,极速的现代化 Python 包管理器
---

# uv - 极速 Python 包管理器

uv 是由 Astral（Ruff 团队）用 Rust 编写的超快 Python 包管理器。它可以替代 pip、pip-tools、pipx、poetry、pyenv、virtualenv 等多个工具，提供一体化的开发体验。

## 为什么选择 uv?

- ⚡ **极速**: 比 pip 快 10-100 倍，比 Poetry 也快得多
- 🔄 **兼容 pip**: 可作为 pip 替代品 (`uv pip install`)
- 📦 **一体化**: 同时提供项目管理和 pip 兼容模式
- 🐍 **Python 版本管理**: 内置多版本 Python 管理
- 🦀 **单一二进制**: Rust 编写，无需 Python 环境即可安装

### 适用场景

- ✅ 新项目,追求最快速度
- ✅ 需要 pip 兼容性 (替代 pip)
- ✅ 希望简化工具链 (uv 可替代 pip + Poetry + pyenv)
- ✅ 大型项目,依赖安装耗时长
- ✅ CI/CD 环境,加速构建时间

### 与 npm/pnpm 的相似性

| 特性     | npm/pnpm                               | uv                  |
| -------- | -------------------------------------- | ------------------- |
| 配置文件 | `package.json`                         | `pyproject.toml`    |
| 锁定文件 | `package-lock.json` / `pnpm-lock.yaml` | `uv.lock`           |
| 依赖目录 | `node_modules/`                        | `.venv/` (虚拟环境) |
| 脚本运行 | `npm run` / `pnpm run`                 | `uv run`            |
| 开发依赖 | `devDependencies`                      | `[dependency-groups]` |

## 安装 uv

### 官方安装方式

```bash
# macOS / Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# 使用 pip 安装
pip install uv

# 使用 Homebrew (macOS)
brew install uv

# 验证安装
uv --version
```

### 配置 uv

```bash
# 查看配置
uv config list

# 配置镜像源（中国大陆用户）
# 在 pyproject.toml 中添加
```

```toml
# pyproject.toml
[[tool.uv.index]]
url = "https://mirrors.aliyun.com/pypi/simple/"
default = true
```

## 项目初始化

### 创建新项目

```bash
# 创建新项目
uv init my-project
cd my-project

# 目录结构
# my-project/
# ├── pyproject.toml
# ├── README.md
# ├── .python-version
# └── src/
#     └── my_project/
#         └── __init__.py
```

### 初始化现有项目

```bash
# 在现有目录初始化
cd existing-project
uv init

# 生成的 pyproject.toml
```

```toml
[project]
name = "my-project"
version = "0.1.0"
description = "Add your description here"
readme = "README.md"
requires-python = ">=3.12"
dependencies = []

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
```

## 依赖管理

### 添加依赖

```bash
# 添加生产依赖
uv add requests
uv add "flask>=2.0.0"
uv add pandas numpy

# 添加开发依赖
uv add pytest --dev
uv add ruff mypy --dev

# 添加可选依赖组
uv add sphinx --group docs
```

```javascript
// npm 对比
npm install requests
npm install --save-dev pytest
```

### 安装依赖

```bash
# 安装所有依赖（根据 uv.lock）
uv sync

# 仅安装生产依赖
uv sync --no-dev

# 安装特定组
uv sync --group docs

# 从 requirements.txt 安装
uv pip install -r requirements.txt
```

```javascript
// npm 对比
npm install
npm ci  // 类似 uv sync
```

### 更新依赖

```bash
# 更新所有依赖
uv lock --upgrade

# 更新特定包
uv lock --upgrade-package requests

# 更新并同步
uv sync --upgrade
```

### 删除依赖

```bash
# 删除依赖
uv remove requests

# 删除开发依赖
uv remove pytest --dev
```

## 运行脚本和命令

### 使用 uv run

```bash
# 运行 Python 脚本（自动使用项目虚拟环境）
uv run python main.py

# 运行模块
uv run python -m pytest

# 运行项目定义的脚本
uv run my-script

# 运行一次性命令（临时安装包）
uv run --with httpie http GET https://api.github.com
```

```javascript
// npm 对比
npm run script
npx some-tool
```

### 定义脚本

```toml
# pyproject.toml
[project.scripts]
my-cli = "my_project.cli:main"
serve = "my_project.server:run"
```

```bash
# 使用脚本
uv run my-cli
uv run serve
```

## 虚拟环境管理

### 自动管理

uv 会自动在项目目录创建 `.venv/` 虚拟环境：

```bash
# uv run 自动使用项目虚拟环境
uv run python script.py

# 查看虚拟环境信息
uv venv --help
```

### 手动管理

```bash
# 创建虚拟环境
uv venv

# 指定 Python 版本
uv venv --python 3.11

# 激活虚拟环境（传统方式）
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

# 退出虚拟环境
deactivate
```

## Python 版本管理

uv 内置 Python 版本管理，可替代 pyenv：

```bash
# 列出可用的 Python 版本
uv python list

# 安装特定版本
uv python install 3.11
uv python install 3.12

# 查看已安装版本
uv python list --installed

# 设置项目 Python 版本
uv python pin 3.11

# 使用特定版本运行
uv run --python 3.11 python script.py
```

## pyproject.toml 详解

### 完整配置示例

```toml
[project]
name = "my-awesome-project"
version = "0.1.0"
description = "An awesome Python project"
authors = [
    {name = "Alice", email = "alice@example.com"}
]
license = {text = "MIT"}
readme = "README.md"
requires-python = ">=3.10"
keywords = ["python", "awesome"]
classifiers = [
    "Development Status :: 3 - Alpha",
    "Intended Audience :: Developers",
]

# 生产依赖
dependencies = [
    "requests>=2.31.0",
    "click>=8.1.0",
]

# 可选依赖
[project.optional-dependencies]
mysql = ["mysql-connector-python>=8.0.0"]

# 脚本入口
[project.scripts]
my-cli = "my_project.cli:main"

# 开发依赖组
[dependency-groups]
dev = [
    "pytest>=8.0.0",
    "pytest-cov>=4.1.0",
    "ruff>=0.1.0",
    "mypy>=1.8.0",
]
docs = [
    "sphinx>=7.0.0",
    "sphinx-rtd-theme>=2.0.0",
]

# uv 特定配置
[tool.uv]
dev-dependencies = [
    "pytest>=8.0.0",
]

# 构建系统
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
```

### 版本约束语法

| 约束       | 含义             | npm 对应  |
| ---------- | ---------------- | --------- |
| `>=1.2.3`  | 大于等于         | `>=1.2.3` |
| `>=1.2,<2` | 范围约束         | `^1.2.3`  |
| `~=1.2.3`  | 兼容版本         | `~1.2.3`  |
| `==1.2.3`  | 精确版本         | `1.2.3`   |
| `*`        | 任意版本         | `*`       |

## pip 兼容模式

uv 可以作为 pip 的直接替代品：

```bash
# 替代 pip install
uv pip install requests
uv pip install -r requirements.txt

# 替代 pip freeze
uv pip freeze > requirements.txt

# 替代 pip list
uv pip list

# 替代 pip show
uv pip show requests

# 替代 pip uninstall
uv pip uninstall requests
```

## 工具管理（替代 pipx）

```bash
# 全局安装命令行工具
uv tool install ruff
uv tool install httpie

# 运行工具（不安装）
uv tool run ruff check .
uvx ruff check .  # uvx 是 uv tool run 的别名

# 列出已安装工具
uv tool list

# 更新工具
uv tool upgrade ruff

# 卸载工具
uv tool uninstall ruff
```

## 常用命令速查表

| 操作 | npm/pnpm | uv |
|------|----------|-----|
| 初始化项目 | `npm init` | `uv init` |
| 安装依赖 | `npm install` | `uv sync` |
| 添加依赖 | `npm add pkg` | `uv add pkg` |
| 添加开发依赖 | `npm add -D pkg` | `uv add --dev pkg` |
| 删除依赖 | `npm remove pkg` | `uv remove pkg` |
| 更新依赖 | `npm update` | `uv lock --upgrade` |
| 运行脚本 | `npm run script` | `uv run script` |
| 运行命令 | `npx tool` | `uvx tool` |
| 查看依赖 | `npm list` | `uv pip list` |
| 导出依赖 | - | `uv pip freeze` |

## 最佳实践

### 1. 始终提交 uv.lock

```bash
# .gitignore 不应包含
# uv.lock  # ❌ 错误!

# uv.lock 应该被提交
git add uv.lock
git commit -m "Lock dependencies"
```

### 2. 使用 .python-version

```bash
# 创建 .python-version 文件
echo "3.11" > .python-version

# uv 会自动使用该版本
uv sync  # 自动安装并使用 Python 3.11
```

### 3. CI/CD 优化

```yaml
# GitHub Actions 示例
- name: Install uv
  uses: astral-sh/setup-uv@v4

- name: Install dependencies
  run: uv sync

- name: Run tests
  run: uv run pytest
```

### 4. 使用依赖组

```toml
[dependency-groups]
dev = ["pytest", "ruff", "mypy"]
docs = ["sphinx", "sphinx-rtd-theme"]
test = ["pytest", "pytest-cov", "hypothesis"]
```

```bash
# 安装特定组
uv sync --group docs
uv sync --group test
```

## 从其他工具迁移

### 从 pip + requirements.txt 迁移

```bash
# 1. 初始化 uv 项目
uv init

# 2. 从 requirements.txt 添加依赖
uv add $(cat requirements.txt | tr '\n' ' ')

# 或使用 pip 兼容模式
uv pip install -r requirements.txt
uv pip freeze > requirements.txt
```

### 从 Poetry 迁移

```bash
# 1. uv 可以读取 pyproject.toml
# 如果使用标准格式，直接运行
uv sync

# 2. 如果需要生成 uv.lock
uv lock
```

### 从 Pipenv 迁移

```bash
# 1. 导出依赖
pipenv requirements > requirements.txt

# 2. 初始化 uv
uv init
uv add $(cat requirements.txt | tr '\n' ' ')
```

## 常见问题

### Q: uv 和 Poetry 选哪个?

- **选 uv**: 新项目、追求速度、希望简化工具链
- **选 Poetry**: 团队已使用 Poetry、需要更成熟的生态

### Q: uv 能完全替代 pip 吗?

是的，`uv pip` 提供了完全兼容的 pip 接口，速度更快。

### Q: 如何处理私有 PyPI?

```toml
# pyproject.toml
[[tool.uv.index]]
name = "private"
url = "https://private.pypi.org/simple/"

[tool.uv]
extra-index-url = ["https://private.pypi.org/simple/"]
```

### Q: 虚拟环境在哪里?

默认在项目目录的 `.venv/` 下，与 Poetry 的 `virtualenvs.in-project = true` 行为一致。

## 小结

- uv 是目前最快的 Python 包管理器
- 可以替代 pip、Poetry、pyenv、pipx 等多个工具
- `uv run` 是运行 Python 代码的推荐方式
- 使用 `uv.lock` 确保依赖版本一致性
- 完全兼容 pip，迁移成本低

更多信息请参考 [uv 官方文档](https://docs.astral.sh/uv/)

---
title: Python 环境安装指南
description: 学习使用 pyenv 管理 Python 版本,使用 uv/Poetry 管理依赖,配置 VSCode Python 开发环境
outline: deep
---

# Python 环境安装指南

本指南帮助前端开发者快速搭建 Python 开发环境,包括版本管理、包管理工具和编辑器配置。

## 学习目标

- 了解 Python 安装的三种主要方式
- 掌握 pyenv 进行版本管理 (类似 nvm)
- 学习使用 uv 或 Poetry 管理项目依赖
- 配置 VSCode Python 开发环境
- 运行第一个 Hello World 程序

## Python 安装方法对比

### 方式 1: 官方安装器 (适合初学者)

**优点**:

- 简单直接,官方支持
- 附带 pip 包管理器

**缺点**:

- 多版本管理不便
- 升级需手动下载安装

**适用场景**: 只需单一 Python 版本的简单项目

**安装步骤**:

1. 访问 [python.org](https://www.python.org/downloads/)
2. 下载对应平台的安装器
3. Windows: 勾选 "Add Python to PATH"
4. 验证: `python --version`

### 方式 2: pyenv (推荐,适合开发者)

**优点**:

- 多版本管理 (类似 Node.js 的 nvm)
- 项目级 Python 版本隔离
- 全局/局部/会话级版本控制

**缺点**:

- 需额外安装
- Windows 需使用 pyenv-win

**适用场景**: 需要管理多个 Python 版本的开发者

**类比 Node.js**:

| nvm              | pyenv                  | 功能           |
| ---------------- | ---------------------- | -------------- |
| `nvm install 18` | `pyenv install 3.12.0` | 安装特定版本   |
| `nvm use 18`     | `pyenv global 3.12.0`  | 切换全局版本   |
| `.nvmrc`         | `.python-version`      | 项目级版本配置 |
| `nvm current`    | `pyenv version`        | 查看当前版本   |

### 方式 3: Miniconda (适合数据科学)

**优点**:

- 集成 conda 包管理
- 适合科学计算库 (NumPy, Pandas 等)

**缺点**:

- 体积较大
- 与 pip 生态部分重叠

**适用场景**: 数据科学/机器学习项目

## pyenv 版本管理

### 安装 pyenv

**macOS/Linux**:

```bash
# 使用 Homebrew (macOS)
brew update
brew install pyenv

# 或使用官方安装脚本
curl https://pyenv.run | bash

# 添加到 shell 配置 (.bashrc / .zshrc)
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zshrc
echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(pyenv init -)"' >> ~/.zshrc
```

**Windows**:

```powershell
# 使用 pyenv-win
git clone https://github.com/pyenv-win/pyenv-win.git $HOME/.pyenv

# 或使用 Scoop
scoop install pyenv
```

### pyenv 核心命令

```bash
# 列出所有可安装的 Python 版本
pyenv install --list

# 安装特定版本
pyenv install 3.12.0
pyenv install 3.11.5
pyenv install 3.10.12

# 查看已安装的版本
pyenv versions

# 设置全局默认版本 (所有新终端会话使用)
pyenv global 3.12.0

# 设置项目级版本 (在项目目录创建 .python-version 文件)
cd ~/my-project
pyenv local 3.11.5

# 设置当前会话版本 (仅当前终端生效)
pyenv shell 3.10.12

# 查看当前使用的版本
pyenv version

# 卸载版本
pyenv uninstall 3.10.12
```

### 版本选择优先级

Python 版本按以下优先级选择 (从高到低):

1. **会话级**: `pyenv shell` 设置的 `PYENV_VERSION` 环境变量
2. **项目级**: 当前目录或父目录的 `.python-version` 文件
3. **全局级**: `pyenv global` 设置的全局默认版本
4. **系统级**: 系统自带的 Python (如未设置 pyenv)

**示例**:

```bash
# 全局使用 3.12.0
pyenv global 3.12.0

# 项目 A 使用 3.11.5
cd ~/project-a
pyenv local 3.11.5
python --version  # 输出: Python 3.11.5

# 项目 B 使用 3.10.12
cd ~/project-b
pyenv local 3.10.12
python --version  # 输出: Python 3.10.12

# 其他目录使用全局版本
cd ~
python --version  # 输出: Python 3.12.0
```

## 包管理工具选择

### 工具对比

| 特性           | pip  | Poetry  | uv             |
| -------------- | ---- | ------- | -------------- |
| **速度**       | 基线 | 中等    | 极快 (10-100x) |
| **依赖解析**   | 基础 | 强大    | 强大           |
| **项目管理**   | 无   | 完整    | 完整           |
| **兼容性**     | 标准 | 需适配  | 完全兼容 pip   |
| **安装复杂度** | 内置 | 需 pipx | 单一二进制     |

### 推荐: uv (现代化首选)

uv 是 Rust 编写的现代 Python 包管理器,兼具速度和功能。

**安装 uv**:

```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# 或使用 pip
pip install uv
```

**uv 快速开始**:

```bash
# 创建新项目
uv init my-project
cd my-project

# 添加依赖 (自动更新 pyproject.toml)
uv add requests pandas

# 添加开发依赖
uv add --dev pytest ruff

# 运行脚本 (自动使用项目虚拟环境)
uv run python main.py

# 运行命令
uv run pytest

# 同步依赖 (根据 pyproject.toml 安装)
uv sync
```

**uv 作为 pip 替代**:

```bash
# 兼容 pip 命令
uv pip install fastapi
uv pip install -r requirements.txt
uv pip list
uv pip check
```

### 替代方案: Poetry

如果需要成熟的项目管理工具,可选择 Poetry:

```bash
# 安装 Poetry
pipx install poetry

# 创建项目
poetry new my-project
cd my-project

# 添加依赖
poetry add requests

# 运行脚本
poetry run python main.py
```

**详细对比**: 参见 [依赖管理工具��览](../tooling/dependency-management/)

## VSCode Python 扩展配置

### 安装 Python 扩展

1. 打开 VSCode
2. 点击扩展图标 (Ctrl+Shift+X)
3. 搜索 "Python" (Microsoft 官方扩展)
4. 点击 "Install"

### 推荐配置

创建 `.vscode/settings.json`:

```json
{
  // Python 解释器路径 (使用项目虚拟环境)
  "python.defaultInterpreterPath": ".venv/bin/python",

  // 代码格式化工具 (推荐 black 或 ruff)
  "python.formatting.provider": "black",
  "editor.formatOnSave": true,

  // 代码检查工具 (推荐 ruff)
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": false,
  "python.linting.ruffEnabled": true,

  // 类型检查
  "python.analysis.typeCheckingMode": "basic",

  // 自动激活虚拟环境
  "python.terminal.activateEnvironment": true
}
```

### 选择 Python 解释器

1. 按 `Ctrl+Shift+P` (macOS: `Cmd+Shift+P`)
2. 输入 "Python: Select Interpreter"
3. 选择项目虚拟环境 (`.venv/bin/python`)
4. 或选择 pyenv 管理的全局版本

## Hello World 验证

### 创建并运行第一个程序

```bash
# 创建项目目录
mkdir my-first-python-app
cd my-first-python-app

# 设置 Python 版本 (使用 pyenv)
pyenv local 3.12.0

# 初始化项目 (使用 uv)
uv init

# 创建 hello.py
cat > hello.py << EOF
def greet(name: str) -> str:
    """返回问候语"""
    return f"Hello, {name}!"

if __name__ == "__main__":
    message = greet("Python Developer")
    print(message)
    print(f"Python version: {__import__('sys').version}")
EOF

# 运行程序
uv run python hello.py
```

**预期输出**:

```
Hello, Python Developer!
Python version: 3.12.0 (main, ...)
```

### VSCode 中运行

1. 用 VSCode 打开项目: `code .`
2. 打开 `hello.py`
3. 按 F5 或点击右上角播放按钮
4. 查看终端输出

## 小结

### 本章要点

- 推荐使用 pyenv 管理 Python 版本 (类似 nvm)
- 推荐使用 uv 管理项目依赖 (快速且现代)
- `.python-version` 文件指定项目 Python 版本
- `pyproject.toml` 文件定义项目依赖 (类似 `package.json`)
- VSCode Python 扩展提供 IntelliSense、调试和格式化功能

### 与 Node.js 工具链对比

| Node.js 工具      | Python 工具       | 功能         |
| ----------------- | ----------------- | ------------ |
| nvm               | pyenv             | 版本管理     |
| package.json      | pyproject.toml    | 项目元数据   |
| npm / yarn / pnpm | pip / Poetry / uv | 包管理器     |
| node_modules/     | .venv/            | 依赖安装目录 |
| npm install       | uv sync           | 安装依赖     |
| npm run           | uv run            | 运行脚本     |

### 推荐下一步阅读

- [模块系统](../basics/modules) - 了解 Python 如何组织代码
- [依赖管理工具](../tooling/dependency-management/) - 深入了解包管理工具对比
- [常见陷阱](./pitfalls) - 避免前端开发者常犯的错误

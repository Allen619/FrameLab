---
title: Ruff 代码检查与格式化
description: Ruff 完整使用指南,与 ESLint/Prettier 深度对比
---

# Ruff - Python Linter & Formatter

Ruff 是用 Rust 编写的极速 Python 代码检查和格式化工具,集成 linting + formatting,类似前端的 ESLint + Prettier 合体。

## 为什么选择 Ruff?

### 性能对比

```bash
# 传统工具链(慢)
flake8 + black + isort  # ~1-2秒

# Ruff(快)
ruff check + ruff format  # ~50-100ms
```

**Ruff 的优势**:

- ⚡ **极速**: 比传统工具快 10-100 倍
- 🔧 **All-in-One**: 集成 linting + formatting + import sorting
- 🔄 **兼容性**: 替代 Flake8, Black, isort, pyupgrade 等 10+ 工具
- ⚙️ **可配置**: 支持 700+ 检查规则
- 💡 **自动修复**: 大部分问题可自动修复

### 与 ESLint/Prettier 的相似性

| 特性       | ESLint + Prettier | Ruff             |
| ---------- | ----------------- | ---------------- |
| 代码检查   | ESLint            | `ruff check`     |
| 代码格式化 | Prettier          | `ruff format`    |
| 自动修复   | `--fix`           | `--fix`          |
| 配置文件   | `.eslintrc.js`    | `pyproject.toml` |
| 忽略文件   | `.eslintignore`   | `.ruffignore`    |
| IDE 集成   | VS Code 插件      | VS Code 插件     |

## 安装 Ruff

### 通过 Poetry 安装(推荐)

```bash
# 添加到开发依赖
poetry add ruff --group dev

# 验证安装
poetry run ruff --version
```

### 通过 pip 安装

```bash
pip install ruff

# 验证安装
ruff --version
```

### 通过 uv 安装(最快)

```bash
uv pip install ruff
```

## 基本使用

### 代码检查(Linting)

```bash
# 检查当前目录
ruff check .

# 检查特定文件
ruff check src/main.py

# 自动修复问题
ruff check . --fix

# 显示详细信息
ruff check . --output-format=full

# 只显示错误,不显示警告
ruff check . --select E,F
```

```javascript
// ESLint 对比
eslint .
eslint . --fix
eslint . --format=verbose
```

### 代码格式化(Formatting)

```bash
# 格式化当前目录
ruff format .

# 格式化特定文件
ruff format src/main.py

# 检查格式但不修改(dry run)
ruff format . --check

# 显示哪些文件会被格式化
ruff format . --diff
```

```javascript
// Prettier 对比
prettier --write .
prettier --check .
prettier --list-different .
```

### 组合使用

```bash
# 推荐工作流:先检查,后格式化
ruff check . --fix
ruff format .

# 或使用 npm scripts
npm run lint  # poetry run ruff check . --fix && poetry run ruff format .
```

## 配置 Ruff

### pyproject.toml 配置

```toml
[tool.ruff]
# 行长度(类似 ESLint max-len)
line-length = 88  # Black 默认值

# 目标 Python 版本
target-version = "py310"

# 排除目录(类似 .eslintignore)
exclude = [
    ".git",
    ".venv",
    "__pycache__",
    "build",
    "dist",
    "*.egg-info",
]

# 代码检查配置
[tool.ruff.lint]
# 启用的规则集
select = [
    "E",   # pycodestyle 错误
    "F",   # Pyflakes
    "B",   # flake8-bugbear
    "I",   # isort (import 排序)
    "UP",  # pyupgrade
    "SIM", # flake8-simplify
    "C4",  # flake8-comprehensions
]

# 忽略特定规则
ignore = [
    "E501",  # 行长度(由 formatter 处理)
    "B008",  # 函数调用中的默认参数
]

# 每个文件最多允许的错误数
per-file-ignores = { }

# 自动修复配置
fixable = ["ALL"]
unfixable = []

# 格式化配置
[tool.ruff.format]
# 引号风格(类似 Prettier singleQuote)
quote-style = "double"  # 或 "single"

# 缩进风格
indent-style = "space"  # 或 "tab"

# 是否在尾随逗号
skip-magic-trailing-comma = false

# 行结束符
line-ending = "auto"  # 或 "lf", "crlf"

# Import 排序配置
[tool.ruff.lint.isort]
known-first-party = ["my_project"]
```

### .eslintrc.js 对比示例

```javascript
// ESLint 配置
module.exports = {
  extends: ['eslint:recommended', 'prettier'],
  rules: {
    'no-unused-vars': 'error',
    'max-len': ['error', { code: 88 }],
  },
}
```

```toml
# Ruff 对应配置
[tool.ruff]
line-length = 88

[tool.ruff.lint]
select = ["F"]  # F401 = no-unused-vars
ignore = ["E501"]
```

## 规则集详解

### 核心规则集

```toml
[tool.ruff.lint]
select = [
    # 基础规则
    "E",   # pycodestyle 错误 (类似 ESLint 核心规则)
    "F",   # Pyflakes (未使用的导入、变量等)

    # 代码质量
    "B",   # flake8-bugbear (常见错误模式)
    "SIM", # flake8-simplify (简化代码)
    "C4",  # flake8-comprehensions (优化列表推导)

    # 现代化
    "UP",  # pyupgrade (升级到新语法)
    "I",   # isort (导入排序)

    # 文档
    "D",   # pydocstyle (文档字符串)

    # 性能
    "PERF", # Perflint (性能优化)

    # 安全
    "S",   # flake8-bandit (安全问题)
]
```

### 规则示例

```python
# E: pycodestyle 错误
x=1+2  # E225: 操作符周围缺少空格
# 修复: x = 1 + 2

# F: Pyflakes
import os  # F401: 未使用的导入
# 自动删除

# B: flake8-bugbear
def foo(items=[]):  # B006: 可变默认参数
    pass
# 修复: def foo(items=None):

# I: isort
import sys
import os  # I001: 导入未排序
# 修复: 交换顺序

# UP: pyupgrade
x = list()  # UP027: 使用 [] 更简洁
# 修复: x = []

# SIM: simplify
if x:  # SIM108: 可用三元表达式
    y = 1
else:
    y = 2
# 修复: y = 1 if x else 2
```

### ESLint 规则对照

| ESLint 规则      | Ruff 规则 | 说明                |
| ---------------- | --------- | ------------------- |
| `no-unused-vars` | `F841`    | 未使用的变量        |
| `no-undef`       | `F821`    | 未定义的变量        |
| `eqeqeq`         | `E711`    | 使用 `is` 而非 `==` |
| `max-len`        | `E501`    | 行长度限制          |
| `quotes`         | `Q000`    | 引号风格            |
| `indent`         | `E111`    | 缩进错误            |
| `import/order`   | `I001`    | 导入排序            |

## 常用命令

### 检查命令

```bash
# 基本检查
ruff check .

# 自动修复
ruff check . --fix

# 只显示错误(不修复)
ruff check . --no-fix

# 显示规则代码
ruff check . --show-source

# 统计问题
ruff check . --statistics

# 指定规则
ruff check . --select E,F,B
ruff check . --ignore E501

# 输出格式
ruff check . --output-format=json
ruff check . --output-format=github  # GitHub Actions
```

### 格式化命令

```bash
# 基本格式化
ruff format .

# 检查是否需要格式化
ruff format . --check

# 显示差异
ruff format . --diff

# 排除文件
ruff format . --exclude "tests/*"
```

### 其他命令

```bash
# 显示规则文档
ruff rule E501

# 列出所有规则
ruff rule --all

# 生成配置文件
ruff check --generate-config > pyproject.toml

# 清除缓存
ruff clean
```

## IDE 集成

### VS Code

```bash
# 安装插件
code --install-extension charliermarsh.ruff
```

**settings.json 配置**:

```json
{
  "[python]": {
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll": "explicit",
      "source.organizeImports": "explicit"
    },
    "editor.defaultFormatter": "charliermarsh.ruff"
  },
  "ruff.lint.args": ["--config=pyproject.toml"],
  "ruff.format.args": ["--config=pyproject.toml"]
}
```

```javascript
// ESLint + Prettier 对比
{
  "[javascript]": {
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    },
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### PyCharm

1. 打开 **Settings** → **Tools** → **External Tools**
2. 添加 Ruff Check 和 Ruff Format 工具
3. 配置快捷键

### Pre-commit Hook

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.1.0
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format
```

```bash
# 安装 pre-commit
pip install pre-commit
pre-commit install

# 手动运行
pre-commit run --all-files
```

## CI/CD 集成

### GitHub Actions

```yaml
name: Lint

on: [push, pull_request]

jobs:
  ruff:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: chartboost/ruff-action@v1
        with:
          args: check --output-format=github
```

### 本地 npm scripts

```json
{
  "scripts": {
    "lint": "poetry run ruff check .",
    "lint:fix": "poetry run ruff check . --fix",
    "format": "poetry run ruff format .",
    "format:check": "poetry run ruff format . --check",
    "check": "npm run lint:fix && npm run format"
  }
}
```

```javascript
// 对应 ESLint + Prettier
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

## 常见问题

### Q: Ruff 能完全替代 Black 吗?

是的,`ruff format` 是 Black 的直接替代品,格式化结果 99.9% 兼容。

```bash
# 迁移前
poetry remove black
poetry add ruff --group dev

# 更新配置
# [tool.black] → [tool.ruff.format]
```

### Q: 如何忽略特定行的检查?

```python
# noqa: <规则代码>
x = 1 + 2  # noqa: E501

# noqa (忽略所有规则)
long_line = "very long string..."  # noqa

# 忽略多个规则
x = 1  # noqa: E501, F401

# 忽略整个文件
# ruff: noqa
```

```javascript
// ESLint 对比
// eslint-disable-next-line no-unused-vars
const x = 1
```

### Q: 如何选择规则集?

```toml
# 推荐起步配置(保守)
[tool.ruff.lint]
select = ["E", "F"]  # 只检查错误

# 推荐生产配置(平衡)
select = ["E", "F", "B", "I", "UP", "SIM"]

# 严格配置(激进)
select = ["ALL"]
ignore = ["D", "ANN"]  # 排除文档和类型注解
```

### Q: Ruff 与 Pylint 的区别?

| 特性       | Ruff        | Pylint    |
| ---------- | ----------- | --------- |
| 速度       | ⚡⚡⚡ 极快 | 🐌 慢     |
| 规则数     | 700+        | 300+      |
| 自动修复   | ✅ 支持     | ❌ 不支持 |
| 配置复杂度 | 简单        | 复杂      |

推荐: 使用 Ruff,除非需要 Pylint 的特定高级规则。

## 命令速查表

| 操作     | ESLint/Prettier         | Ruff                    |
| -------- | ----------------------- | ----------------------- |
| 检查代码 | `eslint .`              | `ruff check .`          |
| 自动修复 | `eslint . --fix`        | `ruff check . --fix`    |
| 格式化   | `prettier --write .`    | `ruff format .`         |
| 检查格式 | `prettier --check .`    | `ruff format . --check` |
| 查看规则 | `eslint --print-config` | `ruff rule --all`       |
| 忽略规则 | `// eslint-disable`     | `# noqa`                |
| 配置文件 | `.eslintrc.js`          | `pyproject.toml`        |

## 最佳实践

### 1. 推荐配置组合

```toml
[tool.ruff]
line-length = 88
target-version = "py310"

[tool.ruff.lint]
# 生产环境推荐
select = ["E", "F", "B", "I", "UP", "SIM", "C4"]
ignore = ["E501"]

[tool.ruff.format]
quote-style = "double"
indent-style = "space"
```

### 2. 工作流集成

```bash
# 开发时
poetry run ruff check . --fix --watch

# 提交前
pre-commit run --all-files

# CI 中
ruff check . --output-format=github
```

### 3. 项目迁移

```bash
# 1. 安装 Ruff
poetry add ruff --group dev

# 2. 移除旧工具
poetry remove flake8 black isort pyupgrade

# 3. 更新配置
# 将 [tool.black] 改为 [tool.ruff.format]
# 将 [tool.isort] 改为 [tool.ruff.lint.isort]

# 4. 格式化整个项目
ruff check . --fix
ruff format .

# 5. 提交
git add .
git commit -m "Migrate to Ruff"
```

## 小结

- Ruff 是极速的 Python linter + formatter
- 性能比传统工具快 10-100 倍
- 替代 Flake8, Black, isort 等工具
- 配置简单,与 ESLint/Prettier 类似
- `ruff check` = ESLint,`ruff format` = Prettier
- 推荐在所有新项目中使用

更多信息请参考 [Ruff 官方文档](https://docs.astral.sh/ruff/)

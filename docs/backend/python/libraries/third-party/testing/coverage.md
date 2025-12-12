---
title: coverage - 代码覆盖率
description: Python coverage 代码覆盖率测试工具
---

# coverage 代码覆盖率

## 本章目标

- 掌握代码覆盖率测量
- 理解 pytest-cov 集成
- 学习报告生成与 CI 集成
- 对比 Node.js istanbul/c8

## 对比

| Python coverage | Node.js | 说明 |
|-----------------|---------|------|
| `coverage run` | `c8` | 运行覆盖率 |
| `coverage report` | `c8 report` | 查看报告 |
| `coverage html` | `c8 report --reporter=html` | HTML 报告 |
| `pytest-cov` | `jest --coverage` | 测试集成 |

## 安装

```bash
pip install coverage

# pytest 集成
pip install pytest-cov

# poetry
poetry add --group dev coverage pytest-cov
```

## 基础用法

### 命令行使用

```bash
# 运行并收集覆盖率
coverage run -m pytest

# 查看报告
coverage report

# 生成 HTML 报告
coverage html
# 打开 htmlcov/index.html 查看

# 指定源码目录
coverage run --source=src -m pytest
```

### 配置文件

```ini
# pyproject.toml
[tool.coverage.run]
source = ["src"]
branch = true
omit = ["tests/*", "*/__pycache__/*"]

[tool.coverage.report]
exclude_lines = [
    "pragma: no cover",
    "if TYPE_CHECKING:",
    "raise NotImplementedError",
]
fail_under = 80
```

## pytest-cov 集成

### 基本使用

```bash
# 运行测试并收集覆盖率
pytest --cov=src

# 指定报告格式
pytest --cov=src --cov-report=term-missing

# 生成 HTML 报告
pytest --cov=src --cov-report=html

# 同时生成多种报告
pytest --cov=src --cov-report=term --cov-report=html --cov-report=xml
```

### pytest.ini 配置

```ini
# pyproject.toml
[tool.pytest.ini_options]
addopts = "--cov=src --cov-report=term-missing"
testpaths = ["tests"]
```

## CI/CD 集成

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: pip install -e ".[dev]"

      - name: Run tests with coverage
        run: pytest --cov=src --cov-report=xml

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          files: coverage.xml
```

## 报告解读

### 终端报告

```
Name                      Stmts   Miss  Cover
---------------------------------------------
src/__init__.py               1      0   100%
src/main.py                  20      2    90%
src/utils.py                 15      5    67%
---------------------------------------------
TOTAL                        36      7    81%
```

- **Stmts**: 语句总数
- **Miss**: 未覆盖语句数
- **Cover**: 覆盖率百分比

### 分支覆盖

```bash
# 启用分支覆盖
pytest --cov=src --cov-branch
```

## 排除代码

```python
# 排除特定行
if debug:  # pragma: no cover
    print("debug info")

# 排除特定函数
def deprecated_function():  # pragma: no cover
    pass

# 类型检查代码
if TYPE_CHECKING:  # pragma: no cover
    from typing import List
```

## 小结

**核心命令**:
- `coverage run`: 收集覆盖率
- `coverage report`: 查看报告
- `pytest --cov`: pytest 集成

**报告格式**:
- `term`: 终端输出
- `html`: HTML 报告
- `xml`: CI 集成

::: tip 最佳实践
- 设置覆盖率目标（如 80%）
- CI 中自动检查覆盖率
- 排除不需要测试的代码
:::

::: info 相关库
- `pytest` - 测试框架
- `pytest-cov` - pytest 集成
- `codecov` - 覆盖率服务
:::

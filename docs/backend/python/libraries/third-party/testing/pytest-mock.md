---
title: 测试工具
description: Python 测试框架 - pytest
---

# 测试工具

## 概述

| Python     | JavaScript    | 说明             |
| ---------- | ------------- | ---------------- |
| `pytest`   | Jest / Vitest | 最流行的测试框架 |
| `unittest` | Mocha         | 内置测试框架     |

## pytest - 推荐使用

### 安装

```bash
pip install pytest
poetry add pytest --group dev
```

### 基础测试

```python
# test_example.py

def add(a, b):
    return a + b

def test_add():
    assert add(1, 2) == 3
    assert add(-1, 1) == 0

def test_add_strings():
    assert add("hello", " world") == "hello world"
```

### 运行测试

```bash
pytest                    # 运行所有测试
pytest test_example.py    # 运行指定文件
pytest -v                 # 详细输出
pytest -k "add"           # 运行包含 "add" 的测试
```

### 对比 Jest

```javascript
// example.test.js (Jest)

function add(a, b) {
  return a + b
}

test('add numbers', () => {
  expect(add(1, 2)).toBe(3)
  expect(add(-1, 1)).toBe(0)
})

test('add strings', () => {
  expect(add('hello', ' world')).toBe('hello world')
})
```

## 断言对比

| pytest                      | Jest                        | 说明 |
| --------------------------- | --------------------------- | ---- |
| `assert x == y`             | `expect(x).toBe(y)`         | 相等 |
| `assert x != y`             | `expect(x).not.toBe(y)`     | 不等 |
| `assert x in y`             | `expect(y).toContain(x)`    | 包含 |
| `assert len(x) == 3`        | `expect(x).toHaveLength(3)` | 长度 |
| `with pytest.raises(Error)` | `expect().toThrow()`        | 异常 |

## Fixtures - 测试数据准备

```python
import pytest

@pytest.fixture
def sample_user():
    return {"name": "Alice", "age": 30}

def test_user_name(sample_user):
    assert sample_user["name"] == "Alice"

def test_user_age(sample_user):
    assert sample_user["age"] == 30
```

### 对比 Jest beforeEach

```javascript
// Jest
let sampleUser

beforeEach(() => {
  sampleUser = { name: 'Alice', age: 30 }
})

test('user name', () => {
  expect(sampleUser.name).toBe('Alice')
})
```

## 常用命令

```bash
# 运行测试并显示覆盖率
pytest --cov=src

# 只运行失败的测试
pytest --lf

# 并行运行测试
pytest -n auto

# 生成 HTML 报告
pytest --html=report.html
```

## 目录结构

```text
project/
├── src/
│   └── mymodule.py
├── tests/
│   ├── __init__.py
│   ├── test_mymodule.py
│   └── conftest.py      # 共享 fixtures
└── pyproject.toml
```

## pyproject.toml 配置

```toml
[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py"]
addopts = "-v --tb=short"
```

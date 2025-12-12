---
title: 测试工具
description: Python 测试框架与工具库
---

# 测试工具

Python 测试相关的框架和工具。

## 库概览

| 库 | 用途 | 最佳场景 |
|----|------|----------|
| pytest | 测试框架 | 所有 Python 测试 |
| pytest-mock | Mock 工具 | 单元测试 |
| coverage | 代码覆盖率 | CI/CD 集成 |

## 选择建议

- **测试框架**: pytest（事实标准）
- **Mock**: pytest-mock（简单易用）
- **覆盖率**: coverage + pytest-cov

## 快速选择

| 你的需求 | 推荐 | 原因 |
|----------|------|------|
| 测试框架 | ⭐ pytest | Python事实标准、插件丰富 |
| Mock/Patch | pytest-mock | 简化 unittest.mock 使用 |
| 代码覆盖率 | coverage | 业界标准、多种报告格式 |
| 最佳组合 | pytest + pytest-cov | 测试+覆盖率一步到位 |

## 文档

- [pytest](./pytest.md) - Python 测试框架
- [pytest-mock](./pytest-mock.md) - Mock 测试工具
- [coverage](./coverage.md) - 代码覆盖率工具

## 快速示例

```python
# pytest 基本测试
def test_add():
    assert 1 + 1 == 2

# 使用 fixture
import pytest

@pytest.fixture
def user():
    return {"name": "Alice", "age": 30}

def test_user_name(user):
    assert user["name"] == "Alice"

# Mock 示例
def test_api_call(mocker):
    mock_get = mocker.patch("requests.get")
    mock_get.return_value.json.return_value = {"data": "test"}

    # 测试代码...
    mock_get.assert_called_once()
```

## 运行测试

```bash
# 运行所有测试
pytest

# 带覆盖率
pytest --cov=src --cov-report=html

# 只运行特定测试
pytest tests/test_user.py -k "test_create"
```

## Node.js 对比

| Python | Node.js | 说明 |
|--------|---------|------|
| pytest | Jest / Vitest | 测试框架 |
| pytest-mock | jest.mock() | Mock |
| coverage | c8 / istanbul | 覆盖率 |

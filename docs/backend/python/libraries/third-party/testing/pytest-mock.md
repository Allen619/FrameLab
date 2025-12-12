---
title: pytest-mock - Mock 测试工具
description: Python pytest-mock Mock 测试插件
---

# pytest-mock Mock 测试

## 本章目标

- 掌握 Mock 基本用法
- 理解 patch 装饰器
- 学习常见 Mock 场景
- 对比 Jest mock

## 对比

| pytest-mock | Jest | 说明 |
|-------------|------|------|
| `mocker.patch()` | `jest.mock()` | Mock 模块 |
| `mocker.spy()` | `jest.spyOn()` | 监视调用 |
| `mock.return_value` | `mockFn.mockReturnValue()` | 返回值 |
| `mock.side_effect` | `mockFn.mockImplementation()` | 自定义行为 |

## 安装

```bash
pip install pytest-mock

# poetry
poetry add --group dev pytest-mock
```

## 基础用法

### 使用 mocker fixture

```python
# test_example.py
def test_api_call(mocker):
    # Mock requests.get
    mock_get = mocker.patch("requests.get")
    mock_get.return_value.json.return_value = {"data": "test"}

    # 调用被测试代码
    import requests
    response = requests.get("https://api.example.com")
    data = response.json()

    # 断言
    assert data == {"data": "test"}
    mock_get.assert_called_once()
```

### 对比 Jest

```javascript
// Jest
jest.mock('axios')

test('api call', async () => {
  axios.get.mockResolvedValue({ data: { data: 'test' } })

  const response = await axios.get('https://api.example.com')

  expect(response.data).toEqual({ data: 'test' })
  expect(axios.get).toHaveBeenCalledTimes(1)
})
```

## Patch 用法

### patch 函数

```python
def test_with_patch(mocker):
    # 方式 1: patch 整个函数
    mock_func = mocker.patch("mymodule.expensive_function")
    mock_func.return_value = 42

    from mymodule import expensive_function
    result = expensive_function()
    assert result == 42


    # 方式 2: patch 类方法
    mock_method = mocker.patch.object(MyClass, "method_name")
    mock_method.return_value = "mocked"

    obj = MyClass()
    assert obj.method_name() == "mocked"
```

### patch 上下文

```python
def test_context_patch(mocker):
    # 使用 patch 作为上下文管理器
    with mocker.patch("os.path.exists") as mock_exists:
        mock_exists.return_value = True
        import os
        assert os.path.exists("/fake/path") is True

    # 出了上下文，patch 自动解除
```

## 返回值设置

### return_value

```python
def test_return_value(mocker):
    mock_func = mocker.patch("mymodule.get_data")

    # 简单返回值
    mock_func.return_value = {"key": "value"}

    # 链式调用
    mock_func.return_value.process.return_value = "processed"

    from mymodule import get_data
    result = get_data()
    assert result == {"key": "value"}
    assert result.process() == "processed"
```

### side_effect

```python
def test_side_effect(mocker):
    mock_func = mocker.patch("mymodule.api_call")

    # 多次调用返回不同值
    mock_func.side_effect = [1, 2, 3]

    from mymodule import api_call
    assert api_call() == 1
    assert api_call() == 2
    assert api_call() == 3


def test_side_effect_exception(mocker):
    mock_func = mocker.patch("mymodule.risky_operation")

    # 抛出异常
    mock_func.side_effect = ValueError("Error!")

    from mymodule import risky_operation
    import pytest
    with pytest.raises(ValueError):
        risky_operation()


def test_side_effect_function(mocker):
    mock_func = mocker.patch("mymodule.transform")

    # 自定义函数
    mock_func.side_effect = lambda x: x * 2

    from mymodule import transform
    assert transform(5) == 10
```

## 断言调用

### 调用检查

```python
def test_call_assertions(mocker):
    mock_func = mocker.patch("mymodule.send_email")

    # 调用被测试的函数
    from mymodule import notify_user
    notify_user("alice@example.com", "Hello")

    # 检查是否被调用
    mock_func.assert_called()
    mock_func.assert_called_once()

    # 检查调用参数
    mock_func.assert_called_with("alice@example.com", "Hello")
    mock_func.assert_called_once_with("alice@example.com", "Hello")

    # 检查调用次数
    assert mock_func.call_count == 1
```

### 调用参数

```python
def test_call_args(mocker):
    mock_func = mocker.patch("mymodule.process")

    from mymodule import batch_process
    batch_process([1, 2, 3])

    # 获取所有调用
    calls = mock_func.call_args_list
    assert len(calls) == 3

    # 获取最后一次调用
    args, kwargs = mock_func.call_args
    assert args[0] == 3

    # 使用 call 对象
    from unittest.mock import call
    mock_func.assert_has_calls([
        call(1),
        call(2),
        call(3),
    ])
```

## Spy 监视

```python
def test_spy(mocker):
    # spy 不改变原函数行为，只记录调用
    spy_func = mocker.spy(mymodule, "real_function")

    from mymodule import real_function
    result = real_function(10)

    # 原函数正常执行
    assert result == expected_value

    # 同时可以检查调用
    spy_func.assert_called_once_with(10)
```

### 对比 Jest spyOn

```javascript
// Jest
test('spy example', () => {
  const spy = jest.spyOn(myModule, 'realFunction')

  const result = myModule.realFunction(10)

  expect(result).toBe(expectedValue)
  expect(spy).toHaveBeenCalledWith(10)

  spy.mockRestore()
})
```

## 常见场景

### Mock HTTP 请求

```python
def test_api_service(mocker):
    # Mock requests
    mock_get = mocker.patch("requests.get")
    mock_get.return_value.status_code = 200
    mock_get.return_value.json.return_value = {
        "users": [{"id": 1, "name": "Alice"}]
    }

    from mymodule import fetch_users
    users = fetch_users()

    assert len(users) == 1
    assert users[0]["name"] == "Alice"
    mock_get.assert_called_once_with("https://api.example.com/users")
```

### Mock 文件操作

```python
def test_file_operations(mocker):
    # Mock 文件读取
    mock_open = mocker.patch("builtins.open", mocker.mock_open(read_data="content"))

    from mymodule import read_config
    config = read_config("config.txt")

    assert config == "content"
    mock_open.assert_called_once_with("config.txt", "r")
```

### Mock 时间

```python
from datetime import datetime

def test_time_dependent(mocker):
    # Mock datetime.now
    mock_datetime = mocker.patch("mymodule.datetime")
    mock_datetime.now.return_value = datetime(2024, 1, 1, 12, 0, 0)

    from mymodule import get_current_hour
    assert get_current_hour() == 12
```

### Mock 数据库

```python
def test_database_operations(mocker):
    # Mock 数据库会话
    mock_session = mocker.patch("mymodule.db_session")
    mock_session.query.return_value.filter.return_value.first.return_value = {
        "id": 1,
        "name": "Test"
    }

    from mymodule import get_user_by_id
    user = get_user_by_id(1)

    assert user["name"] == "Test"
```

## MagicMock 属性

```python
def test_magic_mock(mocker):
    mock_obj = mocker.MagicMock()

    # 自动创建属性
    mock_obj.foo.bar.baz.return_value = "nested"
    assert mock_obj.foo.bar.baz() == "nested"

    # 魔术方法
    mock_obj.__len__.return_value = 5
    assert len(mock_obj) == 5

    mock_obj.__getitem__.return_value = "item"
    assert mock_obj[0] == "item"
```

## PropertyMock

```python
def test_property_mock(mocker):
    # Mock 属性
    mock_property = mocker.PropertyMock(return_value="mocked_value")
    mocker.patch.object(MyClass, "my_property", mock_property)

    obj = MyClass()
    assert obj.my_property == "mocked_value"
```

## 异步 Mock

```python
import pytest

@pytest.mark.asyncio
async def test_async_mock(mocker):
    # Mock 异步函数
    mock_async = mocker.patch("mymodule.async_fetch")
    mock_async.return_value = {"data": "async_result"}

    # 或使用 AsyncMock
    from unittest.mock import AsyncMock
    mock_async = mocker.patch("mymodule.async_fetch", new_callable=AsyncMock)
    mock_async.return_value = {"data": "async_result"}

    from mymodule import async_fetch
    result = await async_fetch()
    assert result == {"data": "async_result"}
```

## 最佳实践

### Patch 路径规则

```python
# 错误: patch 定义的位置
mocker.patch("requests.get")  # 如果模块已导入，可能无效

# 正确: patch 使用的位置
mocker.patch("mymodule.requests.get")  # mymodule 中 from requests import get

# 规则: "patch where it's used, not where it's defined"
```

### 避免过度 Mock

```python
# 不好: Mock 太多内部实现
def test_over_mocking(mocker):
    mocker.patch("mymodule._internal_helper")
    mocker.patch("mymodule._another_helper")
    mocker.patch("mymodule._third_helper")
    # ...测试变得脆弱

# 好: 只 Mock 外部依赖
def test_good_mocking(mocker):
    mocker.patch("mymodule.external_api_call")
    # 测试实际业务逻辑
```

## 小结

**基本操作**:
- `mocker.patch()`: Mock 函数/模块
- `mocker.spy()`: 监视真实函数
- `return_value`: 设置返回值
- `side_effect`: 自定义行为

**断言方法**:
- `assert_called()`: 验证调用
- `assert_called_with()`: 验证参数
- `call_count`: 调用次数

::: tip 最佳实践
- Patch 使用位置而非定义位置
- 只 Mock 外部依赖
- 避免过度 Mock
:::

::: info 相关库
- `pytest` - 测试框架
- `unittest.mock` - 标准库 Mock
- `responses` - HTTP Mock
- `freezegun` - 时间 Mock
:::

---
title: Python 异常处理
description: 学习使用 try/except/else/finally 处理异常,理解异常链,对比 JavaScript try/catch
outline: deep
---

# Python 异常处理

Python 使用 `try/except/else/finally` 语句处理异常,比 JavaScript 的 `try/catch/finally` 更灵活。

## 学习目标

- 掌握 try/except/else/finally 语法
- 了解常见内置异常类型
- 学习创建自定义异常类
- 理解异常链 (raise from)
- 对比 Python 与 JavaScript 异常处理

## 核心概念

### try/except/else/finally 语法

Python 异常处理比 JavaScript 多了 `else` 子句:

```python
try:
    # 可能抛出异常的代码
    result = 10 / 2
except ZeroDivisionError:
    # 处理特定异常
    print("除数不能为零")
else:
    # 仅在没有异常时执行
    print(f"结果: {result}")
finally:
    # 总是执行 (清理资源)
    print("清理完成")
```

**执行流程**:

1. 执行 `try` 块
2. 如果发生异常,执行对应的 `except` 块,跳过 `else`
3. 如果没有异常,执行 `else` 块
4. 无论是否异常,最后执行 `finally` 块

### 捕获多个异常

```python
try:
    value = int(input("输入数字: "))
    result = 100 / value
except ValueError:
    print("输入不是有效数字")
except ZeroDivisionError:
    print("除数不能为零")
except (TypeError, KeyError) as e:
    # 捕获多个异常类型
    print(f"发生错误: {e}")
except Exception as e:
    # 捕获所有异常 (不推荐过度使用)
    print(f"未知错误: {e}")
```

### 常见内置异常类型

| 异常类型            | 触发场景     | 示例                  |
| ------------------- | ------------ | --------------------- |
| `ValueError`        | 参数值不正确 | `int("abc")`          |
| `TypeError`         | 类型不匹配   | `"str" + 123`         |
| `KeyError`          | 字典键不存在 | `{"a": 1}["b"]`       |
| `IndexError`        | 索引超出范围 | `[1, 2][5]`           |
| `AttributeError`    | 属性不存在   | `"str".nonexistent()` |
| `FileNotFoundError` | 文件不存在   | `open("missing.txt")` |
| `ZeroDivisionError` | 除以零       | `1 / 0`               |
| `ImportError`       | 导入失败     | `import nonexistent`  |

```python
# ValueError 示例
try:
    age = int("twenty")
except ValueError as e:
    print(f"转换失败: {e}")

# KeyError 示例
user = {"name": "Alice"}
try:
    email = user["email"]
except KeyError:
    email = "未提供邮箱"

# FileNotFoundError 示例
try:
    with open("missing.txt") as f:
        content = f.read()
except FileNotFoundError:
    print("文件不存在")
```

### 自定义异常类

```python
# 定义自定义异常 (继承 Exception)
class ValidationError(Exception):
    """数据验证失败异常"""
    pass

class EmailInvalidError(ValidationError):
    """邮箱格式错误"""
    def __init__(self, email):
        self.email = email
        super().__init__(f"Invalid email: {email}")

# 抛出自定义异常
def validate_email(email):
    if "@" not in email:
        raise EmailInvalidError(email)
    return True

# 使用
try:
    validate_email("invalid-email")
except EmailInvalidError as e:
    print(e)  # Invalid email: invalid-email
```

### 异常链 (raise from)

Python 支持异常链,保留原始异常信息:

```python
def fetch_data(user_id):
    try:
        # 模拟数据库查询
        if user_id < 0:
            raise ValueError("user_id must be positive")
        # ...
    except ValueError as e:
        # 转换为自定义异常,保留原始异常
        raise DataError(f"Failed to fetch user {user_id}") from e

class DataError(Exception):
    pass

try:
    fetch_data(-1)
except DataError as e:
    print(f"Error: {e}")
    print(f"Caused by: {e.__cause__}")
```

**输出**:

```
Error: Failed to fetch user -1
Caused by: user_id must be positive
```

### 异常处理最佳实践

#### 1. 捕获具体异常类型

❌ **不推荐**:

```python
try:
    value = int(user_input)
    result = 100 / value
except:  # 捕获所有异常,包括 KeyboardInterrupt
    print("发生错误")
```

✅ **推荐**:

```python
try:
    value = int(user_input)
    result = 100 / value
except ValueError:
    print("输入无效")
except ZeroDivisionError:
    print("除数不能为零")
```

#### 2. 使用 else 分离成功逻辑

❌ **不推荐**:

```python
try:
    data = fetch_data()
    process_data(data)  # 不应在 try 块中
except NetworkError:
    print("网络错误")
```

✅ **推荐**:

```python
try:
    data = fetch_data()
except NetworkError:
    print("网络错误")
else:
    # 仅在获取数据成功时处理
    process_data(data)
```

#### 3. 使用 finally 清理资源

```python
file = None
try:
    file = open("data.txt", "r")
    content = file.read()
except FileNotFoundError:
    print("文件不存在")
finally:
    # 总是执行清理
    if file:
        file.close()

# 或使用 with 语句 (更简洁)
try:
    with open("data.txt", "r") as file:
        content = file.read()
except FileNotFoundError:
    print("文件不存在")
```

## 💡 对前端开发者

### 与 JavaScript 对比

| JavaScript          | Python                    | 差异说明                |
| ------------------- | ------------------------- | ----------------------- |
| `try/catch/finally` | `try/except/else/finally` | Python 多了 `else` 子句 |
| `throw new Error()` | `raise ValueError()`      | Python 使用 `raise`     |
| `Error` 类          | `Exception` 类            | Python 异常基类不同     |
| 无内置异常链        | `raise ... from ...`      | Python 支持异常链       |
| `catch (e)`         | `except Exception as e`   | Python 使用 `as`        |

**示例对比**:

```javascript
// JavaScript
try {
  const data = fetchData()
  processData(data)
} catch (error) {
  if (error instanceof NetworkError) {
    console.error('网络错误')
  } else {
    console.error('未知错误')
  }
} finally {
  cleanup()
}
```

```python
# Python
try:
    data = fetch_data()
except NetworkError:
    print("网络错误")
except Exception as e:
    print(f"未知错误: {e}")
else:
    # Python 特有:仅在成功时处理数据
    process_data(data)
finally:
    cleanup()
```

**Python 的 else 子句优势**:

```python
# 明确区分"获取数据"和"处理数据"的异常
try:
    data = fetch_data()  # 可能抛出 NetworkError
except NetworkError:
    print("网络错误")
else:
    process_data(data)  # 可能抛出 ProcessError
    # ProcessError 不会被上面的 except 捕获
```

## ⚠️ 常见误区

### 过度捕获异常

❌ **错误示例**:

```python
try:
    # 大量代码
    result = complex_operation()
except Exception:
    # 吞掉所有异常,难以调试
    print("发生错误")
```

✅ **正确示例**:

```python
# 只捕获预期的异常
try:
    result = complex_operation()
except ValueError:
    print("值错误")
except KeyError:
    print("键不存在")
# 让未预期的异常向上传播
```

### 忽略异常信息

❌ **错误示例**:

```python
try:
    process()
except Exception:
    print("失败")  # 丢失了异常详情
```

✅ **正确示例**:

```python
try:
    process()
except Exception as e:
    print(f"失败: {e}")  # 包含异常详情
    # 或记录日志
    import logging
    logging.exception("Processing failed")
```

## 小结

### 本章要点

- Python 使用 `try/except/else/finally` 处理异常
- `else` 子句仅在没有异常时执行,用于分离成功逻辑
- 捕获具体异常类型,避免过度捕获
- 使用 `raise ... from ...` 保留异常链
- 自定义异常继承 `Exception` (不是 `BaseException`)

### 与 JS 的关键差异

| JavaScript           | Python                              | 差异说明              |
| -------------------- | ----------------------------------- | --------------------- |
| 无 `else` 子句       | 有 `else` 子句                      | Python 可分离成功逻辑 |
| `throw new Error()`  | `raise ValueError()`                | 语法不同              |
| `Error.cause`        | `raise ... from ...`                | Python 异常链更明确   |
| 所有异常继承 `Error` | 区分 `Exception` 和 `BaseException` | Python 层次更清晰     |

### 推荐下一步阅读

- [文件 I/O](./file-io) - 处理文件操作异常
- [上下文管理器](../advanced/context-managers) - 理解 with 语句
- [日志调试](../debugging/logging) - 记录异常信息

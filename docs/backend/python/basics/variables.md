---
title: 变量与数据类型
description: Python 变量声明、数据类型与 JavaScript 对比
---

# 变量与数据类型

## 学习目标

本章节你将学习:

- Python 变量声明方式
- 基本数据类型 (int, float, str, bool, None)
- 类型转换与类型检查
- 字符串格式化 (f-strings)

## 变量声明

### JavaScript vs Python

```javascript
// JavaScript
let name = 'Alice'
const age = 25
var score = 90 // 不推荐
```

```python
# Python - 直接赋值，无需关键字
name = "Alice"
age = 25
score = 90

# 常量约定使用全大写（但语言层面无强制）
MAX_SIZE = 100
PI = 3.14159
```

> **关键差异**: Python 没有 `let`、`const`、`var`。变量名直接赋值即可。常量使用全大写命名约定，但 Python 不会阻止你修改它。

## 命名规范 (PEP 8)

Python 的命名规范与 JavaScript 有显著差异，这是前端开发者最需要适应的地方之一。

### 基本规则

```python
# 变量和函数: snake_case (下划线分隔小写)
user_name = "Alice"
total_count = 100
is_active = True

# 常量: UPPER_SNAKE_CASE (全大写下划线分隔)
MAX_CONNECTIONS = 100
DEFAULT_TIMEOUT = 30
PI = 3.14159

# 类名: PascalCase (大驼峰)
class UserProfile:
    pass

class HttpRequestHandler:
    pass

# 模块和包名: lowercase (全小写，可用下划线)
# my_module.py
# my_package/
```

```javascript
// JavaScript 对比 - 使用 camelCase
const userName = 'Alice'
const totalCount = 100
const isActive = true

// 类名也是 PascalCase（这点相同）
class UserProfile {}
```

### 特殊命名约定

```python
# 单下划线前缀: 表示"内部使用"（约定，非强制）
_internal_var = "仅供模块内部使用"

def _helper_function():
    """内部辅助函数，不建议外部调用"""
    pass

# 双下划线前缀: 触发名称改写 (name mangling)
class MyClass:
    def __init__(self):
        self.__private = "真正的私有属性"
        # 实际存储为 _MyClass__private

# 双下划线前后缀: Python 特殊方法（魔术方法）
# 不要自定义这种格式的名称！
__init__    # 构造函数
__str__     # 字符串表示
__len__     # 长度

# 单下划线: 临时变量或忽略的值
for _ in range(5):      # 不需要循环变量时
    print("hello")

x, _, z = (1, 2, 3)     # 忽略中间值
```

### 与保留字冲突

```python
# 当变量名与 Python 保留字冲突时，加单下划线后缀
class_ = "CSS类名"      # 避免与 class 关键字冲突
type_ = "类型"          # 避免与 type() 函数冲突
id_ = 123               # 避免与 id() 函数冲突
list_ = [1, 2, 3]       # 避免与 list 类型冲突

# 常见需要避免的名称
# class, type, id, list, dict, str, int, float, bool, set, input, print
```

### JavaScript vs Python 命名对照

| 场景 | JavaScript | Python |
|------|------------|--------|
| 变量 | `userName` | `user_name` |
| 函数 | `getUserName()` | `get_user_name()` |
| 常量 | `MAX_SIZE` | `MAX_SIZE` |
| 类名 | `UserProfile` | `UserProfile` |
| 私有属性 | `#privateField` / `_private` | `_private` / `__private` |
| 布尔变量 | `isActive` | `is_active` |

> **重要**: 在 Python 项目中坚持使用 `snake_case`，即使你习惯了 JS 的 `camelCase`。这不仅是约定，也是社区代码风格的一部分。大多数 Python 库和框架都遵循这一规范。

## 基本数据类型

### 数字类型

```python
# 整数 (int) - 无大小限制
count = 42
big_number = 10_000_000  # 可用下划线分隔，提高可读性

# 浮点数 (float)
price = 19.99
temperature = -3.5

# 复数 (complex) - JS 没有原生支持
z = 3 + 4j  # 3 是实部，4j 是虚部（j 是虚数单位，工程领域惯例）
print(z.real)  # 3.0
print(z.imag)  # 4.0
```

> **关于 `j`**: 数学中虚数单位通常用 `i`，但工程领域用 `j`（因为 `i` 表示电流）。Python 采用工程惯例。前端开发中基本用不到复数，了解即可。

```javascript
// JavaScript 对比
const count = 42
const bigNumber = 10_000_000
const price = 19.99
// JS 只有 Number 类型，无整数/浮点区分
```

### 字符串

```python
# 字符串 (str) - 单引号或双引号均可
name = "Alice"
greeting = 'Hello'

# 多行字符串
description = """
这是一个
多行字符串
"""

# f-string 格式化（类似 JS 模板字符串）
age = 25
message = f"Name: {name}, Age: {age}"
# 结果: "Name: Alice, Age: 25"

# f-string 支持表达式
result = f"2 + 3 = {2 + 3}"
# 结果: "2 + 3 = 5"
```

```javascript
// JavaScript 模板字符串对比
const age = 25
const message = `Name: ${name}, Age: ${age}`
```

> **对前端开发者**: f-string 与 JS 模板字符串非常相似。区别是 Python 用 `f"..."` 和 `{}`，JS 用反引号和 `${}`。

### 布尔值

```python
# 布尔值 (bool) - 注意首字母大写
is_active = True
is_admin = False

# 注意: Python 用 True/False，不是 true/false
```

```javascript
// JavaScript 对比
const isActive = true // 小写
const isAdmin = false
```

### None (空值)

```python
# None - 相当于 JS 的 null
result = None

# 检查 None 使用 is 而非 ==
if result is None:
    print("No result")

# 也可以这样
if result is not None:
    print(f"Result: {result}")
```

```javascript
// JavaScript 对比
const result = null
// JS 有 null 和 undefined 两个空值
// Python 只有 None
```

## 类型检查与转换

### 类型检查

```python
# 使用 type() 获取类型
print(type(42))        # <class 'int'>
print(type("hello"))   # <class 'str'>
print(type(True))      # <class 'bool'>

# 使用 isinstance() 检查类型
if isinstance(age, int):
    print("age is an integer")

# 可以检查多个类型
if isinstance(value, (int, float)):
    print("value is a number")
```

```javascript
// JavaScript 对比
console.log(typeof 42) // "number"
console.log(typeof 'hello') // "string"
console.log(typeof true) // "boolean"
```

### 类型转换

```python
# 显式类型转换
num_str = "42"
num = int(num_str)      # 字符串转整数
price = float("19.99")  # 字符串转浮点
text = str(100)         # 数字转字符串
flag = bool(1)          # 转布尔值 (非0为True)

# 注意: int() 不能转换带小数的字符串
# int("3.14")  # 会报错 ValueError
# 正确方式:
int(float("3.14"))  # 先转 float 再转 int
```

```javascript
// JavaScript 对比
const num = parseInt('42')
const price = parseFloat('19.99')
const text = String(100)
const flag = Boolean(1)
```

## 对前端开发者

### 常见误区

```python
# 1. 布尔值首字母大写
is_valid = True   # 正确
# is_valid = true  # 错误! NameError

# 2. None 检查用 is 不是 ==
if x is None:     # 推荐
    pass
if x == None:     # 可行但不推荐
    pass

# 3. 字符串不可变（和 JS 一样）
s = "hello"
# s[0] = "H"  # 错误! TypeError
s = "H" + s[1:]  # 创建新字符串
```

### 真值判断

```python
# 以下值在 Python 中为 False (falsy)
bool(0)         # False
bool(0.0)       # False
bool("")        # False (空字符串)
bool([])        # False (空列表)
bool({})        # False (空字典)
bool(None)      # False

# 其他值为 True (truthy)
bool(1)         # True
bool("hello")   # True
bool([1, 2])    # True
```

> **与 JS 的区别**: JS 中 `[]` 和 `{}` 是 truthy，而 Python 中空容器是 falsy。

## 小结

| 概念       | JavaScript          | Python                  |
| ---------- | ------------------- | ----------------------- |
| 变量声明   | `let`/`const`/`var` | 直接赋值                |
| 整数       | `Number`            | `int`                   |
| 浮点数     | `Number`            | `float`                 |
| 字符串     | `String`            | `str`                   |
| 布尔值     | `true`/`false`      | `True`/`False`          |
| 空值       | `null`/`undefined`  | `None`                  |
| 模板字符串 | `` `${var}` ``      | `f"{var}"`              |
| 类型检查   | `typeof`            | `type()`/`isinstance()` |

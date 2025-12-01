---
title: 元组 Tuple
description: Python 元组详解，不可变序列与应用场景
---

# 元组 Tuple

## 学习目标

本章节你将学习:

- 元组的创建与特性
- 元组 vs 列表的差异
- 元组解包与应用
- 命名元组 (namedtuple)

## 什么是元组？

元组是不可变的有序序列，JavaScript 没有直接对应的数据类型。

```python
# 创建元组
point = (3, 4)
colors = ("red", "green", "blue")

# 单元素元组 - 注意逗号!
single = (1,)     # 元组
not_tuple = (1)   # 整数，不是元组!

# 空元组
empty = ()

# 无括号也可以（不推荐）
coords = 40.7128, -74.0060
```

```javascript
// JavaScript 无原生元组
// 通常用数组 + Object.freeze() 模拟
const point = Object.freeze([3, 4])
// 或 TypeScript 元组类型
// const point: [number, number] = [3, 4];
```

## 元组 vs 列表

| 特性         | 元组 (tuple)          | 列表 (list) |
| ------------ | --------------------- | ----------- |
| 可变性       | 不可变                | 可变        |
| 语法         | `()`                  | `[]`        |
| 性能         | 稍快                  | 稍慢        |
| 用途         | 固定数据              | 动态数据    |
| 可作为字典键 | ✅ 可以               | ❌ 不可以   |
| 方法         | 少 (`count`, `index`) | 多          |

```python
# 不可变示例
point = (3, 4)
# point[0] = 5  # TypeError: 'tuple' object does not support item assignment

# 列表可以修改
numbers = [1, 2, 3]
numbers[0] = 10  # 正常
```

## 访问元素

```python
point = (3, 4, 5)

# 索引访问（和列表一样）
print(point[0])   # 3
print(point[-1])  # 5

# 切片
print(point[1:])  # (4, 5)

# 遍历
for coord in point:
    print(coord)

# 成员检查
print(3 in point)  # True
```

## 元组解包

元组最强大的特性之一：

```python
# 基本解包
point = (3, 4)
x, y = point
print(x, y)  # 3 4

# 函数返回多个值（实际返回元组）
def get_user():
    return ("Alice", 25, "Beijing")

name, age, city = get_user()

# 使用 * 收集剩余元素
numbers = (1, 2, 3, 4, 5)
first, *rest, last = numbers
print(first)  # 1
print(rest)   # [2, 3, 4]
print(last)   # 5

# 交换变量（无需临时变量）
a, b = 1, 2
a, b = b, a
print(a, b)  # 2 1
```

```javascript
// JavaScript 解构对比
const point = [3, 4]
const [x, y] = point

// 剩余元素
const [first, ...rest] = numbers

// 交换变量
;[a, b] = [b, a]
```

## 元组方法

元组方法很少，因为不可变：

```python
numbers = (1, 2, 3, 2, 4, 2, 5)

# count - 统计出现次数
count = numbers.count(2)
print(count)  # 3

# index - 查找索引
idx = numbers.index(3)
print(idx)  # 2

# 其他常用操作
print(len(numbers))  # 7
print(max(numbers))  # 5
print(min(numbers))  # 1
print(sum(numbers))  # 19
```

## 应用场景

### 1. 函数返回多个值

```python
def get_min_max(numbers):
    return min(numbers), max(numbers)

min_val, max_val = get_min_max([3, 1, 4, 1, 5])
print(min_val, max_val)  # 1 5
```

### 2. 作为字典键

```python
# 元组可哈希，可作为字典键
locations = {
    (40.7128, -74.0060): "New York",
    (51.5074, -0.1278): "London",
    (35.6762, 139.6503): "Tokyo"
}

# 列表不可以
# locations[[40, -74]] = "NY"  # TypeError
```

### 3. 保护数据

```python
# 使用元组避免意外修改
DAYS_OF_WEEK = ("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")

# 配置常量
DATABASE_CONFIG = ("localhost", 5432, "mydb", "user")
```

## 命名元组

namedtuple 提供字段名访问，更易读：

```python
from collections import namedtuple

# 定义命名元组类型
Point = namedtuple("Point", ["x", "y"])
User = namedtuple("User", "name age city")

# 创建实例
p = Point(3, 4)
print(p.x, p.y)  # 3 4

user = User("Alice", 25, "Beijing")
print(user.name)  # Alice
print(user.age)   # 25

# 仍然可以按索引访问
print(user[0])  # Alice

# 转换为字典
print(user._asdict())
# {'name': 'Alice', 'age': 25, 'city': 'Beijing'}

# 替换字段（返回新对象）
new_user = user._replace(age=26)
print(new_user)  # User(name='Alice', age=26, city='Beijing')
```

```javascript
// JavaScript 无内置命名元组，通常用对象
const user = { name: 'Alice', age: 25, city: 'Beijing' }
// 或 TypeScript
// type User = { name: string; age: number; city: string };
```

## 转换

```python
# 列表转元组
numbers = [1, 2, 3]
t = tuple(numbers)
print(t)  # (1, 2, 3)

# 元组转列表
point = (3, 4)
lst = list(point)
print(lst)  # [3, 4]

# 字符串转元组
chars = tuple("hello")
print(chars)  # ('h', 'e', 'l', 'l', 'o')
```

## 对前端开发者

### 何时使用元组？

```python
# ✅ 使用元组
def get_coordinates():
    return (40.7128, -74.0060)  # 固定的坐标

RGB = (255, 0, 0)  # 固定的颜色值

USER_ROLES = ("admin", "editor", "viewer")  # 不应改变的配置

# ✅ 使用列表
shopping_cart = []  # 动态添加/删除商品
shopping_cart.append("apple")
```

### 常见误区

```python
# 1. 忘记单元素元组的逗号
t = (1)    # 整数 1
t = (1,)   # 元组 (1,)

# 2. 尝试修改元组
point = (3, 4)
# point[0] = 5  # TypeError!

# 正确做法 - 创建新元组
point = (5, 4)

# 3. 元组包含可变对象
t = (1, [2, 3])
t[1].append(4)  # 合法! 元组本身不变，但内部列表可变
print(t)  # (1, [2, 3, 4])
```

## 小结

- 元组是不可变的有序序列
- 适合存储固定数据（坐标、RGB 值、配置等）
- 可作为字典键（列表不可以）
- 支持解包，方便函数返回多个值
- 命名元组提供字段名访问，更易读
- 性能略优于列表

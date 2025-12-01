---
title: 字典 Dict
description: Python 字典详解，与 JavaScript Object/Map 对比
---

# 字典 Dict

## 学习目标

本章节你将学习:

- 字典的创建与操作
- 字典方法 (keys, values, items, get, update 等)
- 字典推导式
- 与 JavaScript Object/Map 的对比

## 什么是字典？

字典是键值对的可变映射，类似 JavaScript 的 Object 或 Map。

```python
# 创建字典
user = {"name": "Alice", "age": 25, "city": "Beijing"}

# 空字典
empty = {}
empty = dict()

# dict() 构造函数
from_pairs = dict([("a", 1), ("b", 2)])
from_keywords = dict(name="Bob", age=30)

# 字典推导式
squares = {x: x**2 for x in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}
```

```javascript
// JavaScript 对比
const user = { name: 'Alice', age: 25, city: 'Beijing' }
const map = new Map([
  ['a', 1],
  ['b', 2],
])
```

## 访问元素

```python
user = {"name": "Alice", "age": 25}

# 使用方括号访问
print(user["name"])  # Alice

# 键不存在会报 KeyError
# print(user["city"])  # KeyError!

# 使用 get() 安全访问
print(user.get("city"))  # None (不报错)
print(user.get("city", "Unknown"))  # Unknown (默认值)

# 修改值
user["age"] = 26

# 添加新键值对
user["city"] = "Shanghai"
```

```javascript
// JavaScript 对比
console.log(user.name) // 点语法
console.log(user['name']) // 方括号
console.log(user.city ?? 'Unknown') // 可选链 + 空值合并
```

> **关键差异**: Python 字典不能用点语法 `user.name`，只能用 `user["name"]`。

## 字典方法

### 获取键、值、键值对

```python
user = {"name": "Alice", "age": 25, "city": "Beijing"}

# keys() - 获取所有键
print(user.keys())  # dict_keys(['name', 'age', 'city'])
for key in user.keys():
    print(key)

# values() - 获取所有值
print(user.values())  # dict_values(['Alice', 25, 'Beijing'])

# items() - 获取键值对
print(user.items())  # dict_items([('name', 'Alice'), ...])
for key, value in user.items():
    print(f"{key}: {value}")
```

```javascript
// JavaScript 对比
Object.keys(user)
Object.values(user)
Object.entries(user).forEach(([key, value]) => {
  console.log(`${key}: ${value}`)
})
```

### 修改字典

```python
user = {"name": "Alice", "age": 25}

# update() - 合并字典
user.update({"city": "Beijing", "age": 26})
print(user)  # {'name': 'Alice', 'age': 26, 'city': 'Beijing'}

# pop() - 删除并返回值
age = user.pop("age")
print(age)  # 26
print(user)  # {'name': 'Alice', 'city': 'Beijing'}

# pop 默认值（键不存在时）
result = user.pop("missing", "default")
print(result)  # default

# popitem() - 删除最后插入的项 (Python 3.7+)
item = user.popitem()
print(item)  # ('city', 'Beijing')

# del - 删除键
del user["name"]

# clear() - 清空字典
user.clear()
```

```javascript
// JavaScript 对比
Object.assign(user, { city: 'Beijing', age: 26 })
delete user.age
```

### setdefault() 和 get()

```python
user = {"name": "Alice"}

# setdefault() - 键存在返回值，不存在则设置默认值
city = user.setdefault("city", "Unknown")
print(city)  # Unknown
print(user)  # {'name': 'Alice', 'city': 'Unknown'}

# 再次调用，键已存在
city = user.setdefault("city", "Beijing")
print(city)  # Unknown (不会改变)

# get() 对比 - 不会设置值
result = user.get("country", "Unknown")
print(result)  # Unknown
print(user)     # 字典不变，无 'country' 键
```

## 检查键是否存在

```python
user = {"name": "Alice", "age": 25}

# in 操作符（推荐）
if "name" in user:
    print("Name exists")

if "city" not in user:
    print("City not found")

# 注意: in 检查的是键，不是值
print("Alice" in user)  # False (Alice 是值)
```

```javascript
// JavaScript 对比
'name' in user // 原型链检查
user.hasOwnProperty('name') // 自有属性检查
```

## 遍历字典

```python
user = {"name": "Alice", "age": 25, "city": "Beijing"}

# 遍历键（默认）
for key in user:
    print(key, user[key])

# 遍历键值对（推荐）
for key, value in user.items():
    print(f"{key}: {value}")

# 遍历值
for value in user.values():
    print(value)

# 按键排序遍历
for key in sorted(user.keys()):
    print(f"{key}: {user[key]}")
```

## 字典推导式

```python
# 基本语法: {key: value for item in iterable}
squares = {x: x**2 for x in range(5)}
print(squares)  # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# 带条件
evens = {x: x**2 for x in range(10) if x % 2 == 0}
print(evens)  # {0: 0, 2: 4, 4: 16, 6: 36, 8: 64}

# 转换字典
prices = {"apple": 5, "banana": 3, "cherry": 7}
discounted = {k: v * 0.9 for k, v in prices.items()}

# 键值互换
original = {"a": 1, "b": 2}
swapped = {v: k for k, v in original.items()}
print(swapped)  # {1: 'a', 2: 'b'}

# 从列表创建
names = ["Alice", "Bob", "Charlie"]
name_dict = {name: len(name) for name in names}
print(name_dict)  # {'Alice': 5, 'Bob': 3, 'Charlie': 7}
```

## 嵌套字典

```python
users = {
    "user1": {"name": "Alice", "age": 25},
    "user2": {"name": "Bob", "age": 30}
}

# 访问嵌套值
print(users["user1"]["name"])  # Alice

# 安全访问嵌套值
age = users.get("user3", {}).get("age", "Unknown")
print(age)  # Unknown

# 更新嵌套字典
users["user1"]["age"] = 26
```

## 字典的键

### 键的要求

```python
# ✅ 可哈希类型可作为键
d = {
    "string": 1,      # 字符串
    42: 2,            # 整数
    3.14: 3,          # 浮点数
    (1, 2): 4,        # 元组
    True: 5           # 布尔值
}

# ❌ 不可哈希类型不能作为键
# d[[1, 2]] = 6      # TypeError: unhashable type: 'list'
# d[{1, 2}] = 7      # TypeError: unhashable type: 'set'
# d[{"a": 1}] = 8    # TypeError: unhashable type: 'dict'
```

> **可哈希 = 不可变**: 不可变类型（str, int, float, tuple）可哈希，可作为字典键。

## defaultdict

处理缺失键的高级字典：

```python
from collections import defaultdict

# 创建 defaultdict，默认值为空列表
word_dict = defaultdict(list)

# 不存在的键自动创建默认值
word_dict["a"].append(1)
word_dict["a"].append(2)
word_dict["b"].append(3)

print(dict(word_dict))  # {'a': [1, 2], 'b': [3]}

# 计数器
counts = defaultdict(int)
for char in "hello":
    counts[char] += 1

print(dict(counts))  # {'h': 1, 'e': 1, 'l': 2, 'o': 1}
```

```python
# 普通字典对比（需要手动检查）
word_dict = {}
if "a" not in word_dict:
    word_dict["a"] = []
word_dict["a"].append(1)
```

## Counter

统计元素出现次数：

```python
from collections import Counter

# 从列表创建
words = ["apple", "banana", "apple", "cherry", "banana", "apple"]
count = Counter(words)
print(count)  # Counter({'apple': 3, 'banana': 2, 'cherry': 1})

# most_common() - 最常见的元素
print(count.most_common(2))  # [('apple', 3), ('banana', 2)]

# 统计字符
chars = Counter("hello world")
print(chars)  # Counter({'l': 3, 'o': 2, 'h': 1, ...})

# 更新计数
count.update(["apple", "date"])
print(count["apple"])  # 4
```

## 对前端开发者

### dict vs Object vs Map

| 特性       | Python dict | JS Object              | JS Map   |
| ---------- | ----------- | ---------------------- | -------- |
| 键类型     | 可哈希类型  | 字符串/Symbol          | 任意类型 |
| 点语法访问 | ❌          | ✅                     | ❌       |
| 顺序保证   | ✅ (3.7+)   | ✅ (规范)              | ✅       |
| 直接遍历   | ✅          | ✅                     | ✅       |
| 大小获取   | `len()`     | `Object.keys().length` | `size`   |

### API 对照

| JavaScript         | Python            | 说明       |
| ------------------ | ----------------- | ---------- |
| `obj.key`          | `dict["key"]`     | 访问值     |
| `obj[key] = val`   | `dict[key] = val` | 设置值     |
| `delete obj.key`   | `del dict[key]`   | 删除键     |
| `"key" in obj`     | `"key" in dict`   | 检查键     |
| `Object.keys()`    | `dict.keys()`     | 获取键     |
| `Object.values()`  | `dict.values()`   | 获取值     |
| `Object.entries()` | `dict.items()`    | 获取键值对 |
| `Object.assign()`  | `dict.update()`   | 合并字典   |
| `map.get(key)`     | `dict.get(key)`   | 安全访问   |
| `map.set(k, v)`    | `dict[k] = v`     | 设置值     |

### 常见误区

```python
# 1. 尝试用点语法
user = {"name": "Alice"}
# print(user.name)  # AttributeError!
print(user["name"])  # 正确

# 2. 键不存在未检查
# value = user["age"]  # KeyError!
value = user.get("age", 25)  # 安全

# 3. 遍历时修改字典大小
d = {"a": 1, "b": 2, "c": 3}
# 错误
# for key in d:
#     if key == "a":
#         del d[key]  # RuntimeError!

# 正确
to_delete = [k for k, v in d.items() if v < 2]
for key in to_delete:
    del d[key]

# 4. 可变对象作为键
# d = {[1, 2]: "value"}  # TypeError!
d = {(1, 2): "value"}  # 元组可以
```

## 小结

- 字典是键值对的可变映射
- 只能用方括号访问，不能用点语法
- 键必须是可哈希类型（不可变）
- Python 3.7+ 保持插入顺序
- 使用 `get()` 安全访问，避免 KeyError
- 字典推导式简洁强大
- defaultdict 和 Counter 处理特殊场景

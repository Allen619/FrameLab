---
title: 集合 Set
description: Python 集合详解，与 JavaScript Set 对比
---

# 集合 Set

## 学习目标

本章节你将学习:

- 集合的创建与特性
- 集合操作 (并集、交集、差集)
- 集合方法
- 与 JavaScript Set 的对比

## 什么是集合？

集合是无序的唯一元素集，类似 JavaScript 的 Set。

```python
# 创建集合
numbers = {1, 2, 3, 4, 5}
fruits = {"apple", "banana", "cherry"}

# 注意: 空集合必须用 set()
empty = set()  # 正确
# empty = {}   # 错误! 这是空字典

# 从列表创建（自动去重）
unique_numbers = set([1, 2, 2, 3, 3, 3])
print(unique_numbers)  # {1, 2, 3}

# 从字符串创建
chars = set("hello")
print(chars)  # {'h', 'e', 'l', 'o'} - 自动去重
```

```javascript
// JavaScript 对比
const numbers = new Set([1, 2, 3, 4, 5])
const unique = new Set([1, 2, 2, 3]) // Set(3) {1, 2, 3}
```

## 集合特性

### 1. 无序性

```python
s = {3, 1, 2}
print(s)  # {1, 2, 3} - 输出顺序可能不同

# 不能用索引访问
# s[0]  # TypeError: 'set' object is not subscriptable
```

### 2. 唯一性

```python
numbers = {1, 2, 2, 3, 3, 3}
print(numbers)  # {1, 2, 3} - 自动去重

# 添加重复元素无效
numbers.add(2)
print(numbers)  # {1, 2, 3} - 没有变化
```

### 3. 元素必须可哈希

```python
# ✅ 可哈希类型可作为元素
s = {1, "hello", (1, 2), True}

# ❌ 不可哈希类型不能作为元素
# s = {[1, 2]}  # TypeError: unhashable type: 'list'
# s = {{1, 2}}  # TypeError: unhashable type: 'set'
```

## 基本操作

### 添加与删除

```python
fruits = {"apple", "banana"}

# add() - 添加单个元素
fruits.add("cherry")
print(fruits)  # {'apple', 'banana', 'cherry'}

# update() - 添加多个元素
fruits.update(["date", "elderberry"])
print(fruits)  # {'apple', 'banana', 'cherry', 'date', 'elderberry'}

# remove() - 删除元素（不存在会报错）
fruits.remove("apple")
# fruits.remove("missing")  # KeyError!

# discard() - 删除元素（不存在也不报错）
fruits.discard("banana")
fruits.discard("missing")  # 不报错

# pop() - 随机删除并返回一个元素
item = fruits.pop()
print(item)

# clear() - 清空集合
fruits.clear()
```

```javascript
// JavaScript 对比
const fruits = new Set(['apple', 'banana'])
fruits.add('cherry')
fruits.delete('apple')
fruits.clear()
```

### 成员检查

```python
fruits = {"apple", "banana", "cherry"}

# in 操作符（速度很快，O(1)）
print("apple" in fruits)     # True
print("grape" in fruits)     # False
print("grape" not in fruits) # True
```

```javascript
// JavaScript 对比
fruits.has('apple') // true
```

## 集合运算

Python 集合支持丰富的数学集合运算：

### 并集 (Union)

```python
a = {1, 2, 3}
b = {3, 4, 5}

# 方法 1: | 运算符
print(a | b)  # {1, 2, 3, 4, 5}

# 方法 2: union() 方法
print(a.union(b))  # {1, 2, 3, 4, 5}

# 多个集合并集
c = {5, 6, 7}
print(a | b | c)  # {1, 2, 3, 4, 5, 6, 7}
```

### 交集 (Intersection)

```python
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

# 方法 1: & 运算符
print(a & b)  # {3, 4}

# 方法 2: intersection() 方法
print(a.intersection(b))  # {3, 4}
```

### 差集 (Difference)

```python
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

# 方法 1: - 运算符
print(a - b)  # {1, 2} - a 中有但 b 中没有
print(b - a)  # {5, 6} - b 中有但 a 中没有

# 方法 2: difference() 方法
print(a.difference(b))  # {1, 2}
```

### 对称差集 (Symmetric Difference)

```python
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

# 方法 1: ^ 运算符
print(a ^ b)  # {1, 2, 5, 6} - 只在一个集合中的元素

# 方法 2: symmetric_difference() 方法
print(a.symmetric_difference(b))  # {1, 2, 5, 6}
```

### 集合运算总结

| 运算   | 运算符   | 方法                        | 说明              |
| ------ | -------- | --------------------------- | ----------------- |
| 并集   | `a \| b` | `a.union(b)`                | a 或 b 中的元素   |
| 交集   | `a & b`  | `a.intersection(b)`         | a 和 b 共有的元素 |
| 差集   | `a - b`  | `a.difference(b)`           | a 中但不在 b 中   |
| 对称差 | `a ^ b`  | `a.symmetric_difference(b)` | 只在一个集合中    |

```javascript
// JavaScript Set 无内置集合运算，需要手动实现
const union = new Set([...a, ...b])
const intersection = new Set([...a].filter((x) => b.has(x)))
const difference = new Set([...a].filter((x) => !b.has(x)))
```

## 子集与超集

```python
a = {1, 2, 3}
b = {1, 2, 3, 4, 5}

# 子集检查
print(a.issubset(b))    # True - a 是 b 的子集
print(a <= b)           # True (运算符形式)
print(a < b)            # True - 真子集

# 超集检查
print(b.issuperset(a))  # True - b 是 a 的超集
print(b >= a)           # True (运算符形式)
print(b > a)            # True - 真超集

# 不相交检查
c = {7, 8, 9}
print(a.isdisjoint(c))  # True - a 和 c 无交集
```

## 集合推导式

```python
# 基本语法: {expression for item in iterable}
squares = {x**2 for x in range(5)}
print(squares)  # {0, 1, 4, 9, 16}

# 带条件
evens = {x for x in range(10) if x % 2 == 0}
print(evens)  # {0, 2, 4, 6, 8}

# 字符串处理
text = "hello world"
vowels = {char for char in text if char in "aeiou"}
print(vowels)  # {'e', 'o'} - 自动去重
```

## 常用场景

### 1. 去重

```python
# 列表去重（保留顺序 - Python 3.7+）
numbers = [1, 2, 2, 3, 3, 3, 4, 5, 5]
unique = list(dict.fromkeys(numbers))  # 保序
print(unique)  # [1, 2, 3, 4, 5]

# 不关心顺序
unique = list(set(numbers))
print(unique)  # [1, 2, 3, 4, 5] (顺序可能不同)
```

### 2. 成员检查

```python
# 列表成员检查: O(n)
allowed_users = ["alice", "bob", "charlie"]
if "alice" in allowed_users:  # 慢
    pass

# 集合成员检查: O(1)
allowed_users = {"alice", "bob", "charlie"}
if "alice" in allowed_users:  # 快
    pass
```

### 3. 查找共同元素

```python
# 两个用户的共同兴趣
alice_interests = {"python", "javascript", "rust"}
bob_interests = {"javascript", "go", "rust"}

common = alice_interests & bob_interests
print(common)  # {'javascript', 'rust'}

# 只有 Alice 有的兴趣
alice_only = alice_interests - bob_interests
print(alice_only)  # {'python'}
```

### 4. 数据清洗

```python
# 查找重复项
data = [1, 2, 3, 2, 4, 5, 3]
seen = set()
duplicates = set()

for item in data:
    if item in seen:
        duplicates.add(item)
    else:
        seen.add(item)

print(duplicates)  # {2, 3}
```

## frozenset (不可变集合)

```python
# frozenset 是不可变版本的集合
fs = frozenset([1, 2, 3])

# 不能修改
# fs.add(4)  # AttributeError!

# 可以作为字典键或集合元素
d = {frozenset([1, 2]): "value"}
s = {frozenset([1, 2]), frozenset([3, 4])}

# 支持集合运算
a = frozenset([1, 2, 3])
b = frozenset([3, 4, 5])
print(a | b)  # frozenset({1, 2, 3, 4, 5})
```

## 对前端开发者

### Set 方法对照

| JavaScript  | Python         | 说明     |
| ----------- | -------------- | -------- |
| `new Set()` | `set()`        | 创建集合 |
| `add(x)`    | `add(x)`       | 添加元素 |
| `delete(x)` | `remove(x)`    | 删除元素 |
| -           | `discard(x)`   | 安全删除 |
| `has(x)`    | `x in set`     | 成员检查 |
| `size`      | `len(set)`     | 大小     |
| `clear()`   | `clear()`      | 清空     |
| `values()`  | `for x in set` | 遍历     |

### 常见误区

```python
# 1. 空集合语法
empty = {}     # 错误! 这是空字典
empty = set()  # 正确

# 2. 集合元素必须可哈希
# s = {[1, 2]}  # TypeError!
s = {(1, 2)}   # 元组可以

# 3. 集合无序，不能索引
s = {1, 2, 3}
# s[0]  # TypeError!

# 需要转换为列表
lst = list(s)
print(lst[0])  # 可以，但顺序不保证

# 4. 修改集合元素
s = {1, 2, 3}
# 不能直接修改
# s[0] = 10  # 不支持

# 需要删除后添加
s.remove(1)
s.add(10)
```

## 小结

- 集合是无序的唯一元素集合
- 元素必须可哈希（不可变）
- 成员检查速度快 O(1)
- 支持丰富的集合运算（并、交、差、对称差）
- 适用场景：去重、成员检查、集合运算
- frozenset 是不可变版本，可作为字典键

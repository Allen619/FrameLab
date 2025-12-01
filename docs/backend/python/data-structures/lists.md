---
title: 列表 List
description: Python 列表操作详解，与 JavaScript Array 对比
---

# 列表 List

## 学习目标

本章节你将学习:

- 列表的创建与基本操作
- 列表方法 (append, extend, insert, remove 等)
- 切片操作
- 列表推导式
- 与 JavaScript Array 的对比

## 创建列表

```python
# 直接创建
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", True, None]  # 可以混合类型

# 空列表
empty = []
empty = list()

# 从其他可迭代对象创建
from_range = list(range(5))      # [0, 1, 2, 3, 4]
from_string = list("hello")       # ['h', 'e', 'l', 'l', 'o']
from_tuple = list((1, 2, 3))      # [1, 2, 3]

# 重复元素
zeros = [0] * 5                   # [0, 0, 0, 0, 0]
```

```javascript
// JavaScript 对比
const fruits = ['apple', 'banana', 'cherry']
const fromRange = [...Array(5).keys()] // [0, 1, 2, 3, 4]
const zeros = Array(5).fill(0)
```

## 访问元素

### 索引访问

```python
fruits = ["apple", "banana", "cherry", "date"]

# 正向索引 (从 0 开始)
print(fruits[0])   # apple
print(fruits[1])   # banana

# 负向索引 (从末尾开始)
print(fruits[-1])  # date (最后一个)
print(fruits[-2])  # cherry (倒数第二)

# 修改元素
fruits[0] = "apricot"
print(fruits)  # ['apricot', 'banana', 'cherry', 'date']
```

### 切片操作

切片是 Python 的强大特性，JavaScript 没有直接对应：

```python
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

# 基本切片: list[start:stop]
print(numbers[2:5])    # [2, 3, 4] - 不包含 stop

# 省略 start 或 stop
print(numbers[:3])     # [0, 1, 2] - 从开头到索引 3
print(numbers[7:])     # [7, 8, 9] - 从索引 7 到结尾
print(numbers[:])      # 完整复制

# 带步长: list[start:stop:step]
print(numbers[::2])    # [0, 2, 4, 6, 8] - 每隔一个
print(numbers[1::2])   # [1, 3, 5, 7, 9] - 奇数索引

# 负步长 (反转)
print(numbers[::-1])   # [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
print(numbers[5:2:-1]) # [5, 4, 3]

# 切片赋值
numbers[2:5] = [20, 30, 40]
print(numbers)  # [0, 1, 20, 30, 40, 5, 6, 7, 8, 9]
```

```javascript
// JavaScript 对比 - 使用 slice()
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
numbers.slice(2, 5) // [2, 3, 4]
numbers.slice(0, 3) // [0, 1, 2]
numbers.slice(7) // [7, 8, 9]
numbers.reverse() // 原地反转
```

## 列表方法

### 添加元素

```python
fruits = ["apple", "banana"]

# append - 末尾添加单个元素
fruits.append("cherry")
print(fruits)  # ['apple', 'banana', 'cherry']

# extend - 末尾添加多个元素
fruits.extend(["date", "elderberry"])
print(fruits)  # ['apple', 'banana', 'cherry', 'date', 'elderberry']

# insert - 指定位置插入
fruits.insert(1, "apricot")
print(fruits)  # ['apple', 'apricot', 'banana', 'cherry', 'date', 'elderberry']

# + 运算符 - 创建新列表
new_fruits = fruits + ["fig"]
```

```javascript
// JavaScript 对比
const fruits = ['apple', 'banana']
fruits.push('cherry') // append
fruits.push(...['date']) // extend
fruits.splice(1, 0, 'apricot') // insert
```

| Python         | JavaScript        | 说明         |
| -------------- | ----------------- | ------------ |
| `append(x)`    | `push(x)`         | 末尾添加     |
| `extend(list)` | `push(...arr)`    | 添加多个     |
| `insert(i, x)` | `splice(i, 0, x)` | 指定位置插入 |

### 删除元素

```python
fruits = ["apple", "banana", "cherry", "banana", "date"]

# remove - 删除第一个匹配的元素
fruits.remove("banana")
print(fruits)  # ['apple', 'cherry', 'banana', 'date']

# pop - 删除并返回指定索引元素 (默认最后一个)
last = fruits.pop()
print(last)    # date
print(fruits)  # ['apple', 'cherry', 'banana']

first = fruits.pop(0)
print(first)   # apple

# del - 删除指定索引或切片
del fruits[0]
print(fruits)  # ['banana']

# clear - 清空列表
fruits.clear()
print(fruits)  # []
```

```javascript
// JavaScript 对比
const fruits = ['apple', 'banana', 'cherry']
// remove: 需要先 indexOf 再 splice
const idx = fruits.indexOf('banana')
if (idx > -1) fruits.splice(idx, 1)

// pop
fruits.pop() // 末尾
fruits.shift() // 开头
```

### 查找与统计

```python
numbers = [1, 2, 3, 2, 4, 2, 5]

# index - 查找元素索引 (找不到会抛异常)
idx = numbers.index(3)
print(idx)  # 2

# 带范围查找
idx = numbers.index(2, 2)  # 从索引 2 开始找
print(idx)  # 3

# count - 统计出现次数
count = numbers.count(2)
print(count)  # 3

# in - 检查元素是否存在
print(2 in numbers)     # True
print(10 in numbers)    # False
print(10 not in numbers) # True
```

```javascript
// JavaScript 对比
const numbers = [1, 2, 3, 2, 4, 2, 5]
numbers.indexOf(3) // 2
numbers.filter((x) => x === 2).length // count
numbers.includes(2) // true
```

### 排序

```python
numbers = [3, 1, 4, 1, 5, 9, 2, 6]

# sort - 原地排序
numbers.sort()
print(numbers)  # [1, 1, 2, 3, 4, 5, 6, 9]

# 降序排序
numbers.sort(reverse=True)
print(numbers)  # [9, 6, 5, 4, 3, 2, 1, 1]

# 自定义排序
words = ["banana", "apple", "Cherry", "date"]
words.sort()  # 默认字母序 (区分大小写)
print(words)  # ['Cherry', 'apple', 'banana', 'date']

words.sort(key=str.lower)  # 忽略大小写
print(words)  # ['apple', 'banana', 'Cherry', 'date']

# 按长度排序
words.sort(key=len)
print(words)  # ['date', 'apple', 'Cherry', 'banana']

# sorted - 返回新列表，不修改原列表
original = [3, 1, 2]
new_list = sorted(original)
print(original)  # [3, 1, 2] - 未改变
print(new_list)  # [1, 2, 3]

# reverse - 原地反转
numbers.reverse()
```

```javascript
// JavaScript 对比
const numbers = [3, 1, 4, 1, 5]
numbers.sort((a, b) => a - b) // 原地排序
;[...numbers].sort((a, b) => a - b) // 不改变原数组
numbers.reverse()
```

## 列表推导式

列表推导式是 Python 最强大的特性之一，比 `map`/`filter` 更简洁：

```python
# 基本语法: [expression for item in iterable]
squares = [x ** 2 for x in range(5)]
print(squares)  # [0, 1, 4, 9, 16]

# 带条件: [expression for item in iterable if condition]
evens = [x for x in range(10) if x % 2 == 0]
print(evens)  # [0, 2, 4, 6, 8]

# 转换字符串列表
names = ["alice", "bob", "charlie"]
upper_names = [name.upper() for name in names]
print(upper_names)  # ['ALICE', 'BOB', 'CHARLIE']

# 嵌套循环
pairs = [(x, y) for x in range(3) for y in range(3)]
print(pairs)  # [(0,0), (0,1), (0,2), (1,0), (1,1), ...]

# 展平嵌套列表
nested = [[1, 2], [3, 4], [5, 6]]
flat = [x for sublist in nested for x in sublist]
print(flat)  # [1, 2, 3, 4, 5, 6]
```

```javascript
// JavaScript 对比
const squares = [...Array(5).keys()].map((x) => x ** 2)
const evens = [...Array(10).keys()].filter((x) => x % 2 === 0)
const upperNames = names.map((name) => name.toUpperCase())
const flat = nested.flat()
```

> **对前端开发者**: 列表推导式 = `map` + `filter` 的组合，语法更简洁。

## 常用操作

### 复制列表

```python
original = [1, 2, [3, 4]]

# 浅复制 (只复制一层)
copy1 = original.copy()
copy2 = original[:]
copy3 = list(original)

# 深复制 (完整复制嵌套结构)
import copy
deep_copy = copy.deepcopy(original)

# 浅复制的问题
original[2].append(5)
print(copy1)     # [1, 2, [3, 4, 5]] - 嵌套列表被影响
print(deep_copy) # [1, 2, [3, 4]] - 不受影响
```

```javascript
// JavaScript 对比
const copy1 = [...original] // 浅复制
const copy2 = original.slice() // 浅复制
const deepCopy = JSON.parse(JSON.stringify(original)) // 深复制 (有限制)
```

### 其他常用操作

```python
numbers = [1, 2, 3, 4, 5]

# 长度
print(len(numbers))  # 5

# 最大/最小/求和
print(max(numbers))  # 5
print(min(numbers))  # 1
print(sum(numbers))  # 15

# 解包
a, b, *rest = numbers
print(a, b, rest)  # 1 2 [3, 4, 5]

# 枚举 (索引 + 值)
for i, num in enumerate(numbers):
    print(f"{i}: {num}")

# zip - 并行遍历多个列表
names = ["Alice", "Bob"]
ages = [25, 30]
for name, age in zip(names, ages):
    print(f"{name} is {age}")
```

## 对前端开发者

### API 对照表

| JavaScript     | Python                 | 说明     |
| -------------- | ---------------------- | -------- |
| `push(x)`      | `append(x)`            | 末尾添加 |
| `pop()`        | `pop()`                | 末尾删除 |
| `shift()`      | `pop(0)`               | 开头删除 |
| `unshift(x)`   | `insert(0, x)`         | 开头添加 |
| `splice(i, n)` | `del lst[i:i+n]`       | 删除元素 |
| `indexOf(x)`   | `index(x)`             | 查找索引 |
| `includes(x)`  | `x in lst`             | 是否包含 |
| `slice(a, b)`  | `lst[a:b]`             | 切片     |
| `concat(arr)`  | `lst + arr`            | 连接     |
| `reverse()`    | `reverse()`            | 反转     |
| `sort()`       | `sort()`               | 排序     |
| `map(fn)`      | 列表推导式             | 映射     |
| `filter(fn)`   | 列表推导式             | 过滤     |
| `find(fn)`     | `next(x for x if ...)` | 查找     |
| `reduce(fn)`   | `functools.reduce()`   | 归约     |
| `flat()`       | 列表推导式             | 展平     |
| `length`       | `len(lst)`             | 长度     |

### 常见误区

```python
# 1. 修改列表时遍历它
numbers = [1, 2, 3, 4, 5]
# 错误做法
for n in numbers:
    if n % 2 == 0:
        numbers.remove(n)  # 危险！

# 正确做法 - 创建新列表
numbers = [n for n in numbers if n % 2 != 0]

# 2. 列表作为默认参数
# 错误
def add_item(item, items=[]):
    items.append(item)
    return items

# 正确
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items

# 3. 赋值 vs 复制
a = [1, 2, 3]
b = a        # b 和 a 指向同一个列表!
b.append(4)
print(a)     # [1, 2, 3, 4] - a 也被改变了

b = a.copy() # 正确的复制方式
```

## 小结

- 列表是 Python 最常用的数据结构，对应 JS Array
- 切片操作 `list[start:stop:step]` 是 Python 特色
- 列表推导式比 `map`/`filter` 更 Pythonic
- 注意浅复制与深复制的区别
- 避免在遍历时修改列表

---
title: itertools - 迭代器工具
description: Python itertools 模块详解，高效的迭代器构建工具
---

# itertools 迭代器工具

## 学习目标

- 掌握无限迭代器的使用
- 学会迭代器的组合与过滤
- 理解排列组合迭代器
- 与 JavaScript 数组方法对比

## 概述

| Python itertools | JavaScript | 说明 |
|-----------------|------------|------|
| `chain()` | `[...a, ...b]` | 连接多个可迭代对象 |
| `islice()` | `slice()` | 切片迭代器 |
| `takewhile()` | 无直接对应 | 条件取值 |
| `groupby()` | `reduce` 手动实现 | 分组 |
| `product()` | 嵌套循环 | 笛卡尔积 |
| `permutations()` | 无内置 | 排列 |
| `combinations()` | 无内置 | 组合 |

## 无限迭代器

### count - 计数器

```python
from itertools import count

# 从 0 开始无限计数
for i in count():
    if i >= 5:
        break
    print(i)  # 0, 1, 2, 3, 4

# 指定起始值和步长
for i in count(10, 2):
    if i >= 20:
        break
    print(i)  # 10, 12, 14, 16, 18

# 配合 zip 使用
names = ['Alice', 'Bob', 'Charlie']
for i, name in zip(count(1), names):
    print(f"{i}. {name}")
# 1. Alice
# 2. Bob
# 3. Charlie
```

```javascript
// JavaScript 对比 - 使用生成器
function* count(start = 0, step = 1) {
    let n = start
    while (true) {
        yield n
        n += step
    }
}

// 或使用 Array.from
const nums = Array.from({ length: 5 }, (_, i) => i)
```

### cycle - 循环迭代

```python
from itertools import cycle

# 无限循环
colors = cycle(['red', 'green', 'blue'])
for i, color in enumerate(colors):
    if i >= 6:
        break
    print(color)
# red, green, blue, red, green, blue

# 实用示例：轮询调度
servers = cycle(['server1', 'server2', 'server3'])
for request in range(5):
    server = next(servers)
    print(f"Request {request} -> {server}")
```

```javascript
// JavaScript 对比
function* cycle(iterable) {
    const saved = [...iterable]
    while (saved.length) {
        yield* saved
    }
}

// 或使用取模
const colors = ['red', 'green', 'blue']
for (let i = 0; i < 6; i++) {
    console.log(colors[i % colors.length])
}
```

### repeat - 重复

```python
from itertools import repeat

# 无限重复
for i, x in enumerate(repeat('hello')):
    if i >= 3:
        break
    print(x)  # hello, hello, hello

# 指定次数
list(repeat('x', 5))  # ['x', 'x', 'x', 'x', 'x']

# 配合 map 使用
from operator import mul
list(map(mul, range(5), repeat(2)))  # [0, 2, 4, 6, 8]
```

```javascript
// JavaScript 对比
Array(5).fill('x')  // ['x', 'x', 'x', 'x', 'x']

// 或
Array.from({ length: 5 }, () => 'x')
```

## 有限迭代器

### chain - 连接

```python
from itertools import chain

# 连接多个可迭代对象
a = [1, 2, 3]
b = [4, 5, 6]
c = [7, 8, 9]

list(chain(a, b, c))  # [1, 2, 3, 4, 5, 6, 7, 8, 9]

# 展平嵌套列表
nested = [[1, 2], [3, 4], [5, 6]]
list(chain.from_iterable(nested))  # [1, 2, 3, 4, 5, 6]

# 合并多个字典的键
dict1 = {'a': 1, 'b': 2}
dict2 = {'c': 3, 'd': 4}
list(chain(dict1, dict2))  # ['a', 'b', 'c', 'd']
```

```javascript
// JavaScript 对比
const a = [1, 2, 3]
const b = [4, 5, 6]
const c = [7, 8, 9]

[...a, ...b, ...c]  // [1, 2, 3, 4, 5, 6, 7, 8, 9]

// 展平
const nested = [[1, 2], [3, 4], [5, 6]]
nested.flat()  // [1, 2, 3, 4, 5, 6]
```

### islice - 切片

```python
from itertools import islice

# 类似列表切片，但用于迭代器
nums = range(100)

list(islice(nums, 5))          # [0, 1, 2, 3, 4]
list(islice(nums, 2, 8))       # [2, 3, 4, 5, 6, 7]
list(islice(nums, 2, 10, 2))   # [2, 4, 6, 8]

# 处理生成器（只能迭代一次）
def gen():
    for i in range(10):
        yield i

g = gen()
list(islice(g, 3))  # [0, 1, 2]
list(islice(g, 3))  # [3, 4, 5] - 继续从上次位置
```

```javascript
// JavaScript 对比
const nums = Array.from({ length: 100 }, (_, i) => i)

nums.slice(0, 5)      // [0, 1, 2, 3, 4]
nums.slice(2, 8)      // [2, 3, 4, 5, 6, 7]

// 迭代器版本需要手动实现
function* islice(iterable, start, stop, step = 1) {
    let i = 0
    for (const item of iterable) {
        if (stop !== undefined && i >= stop) break
        if (i >= start && (i - start) % step === 0) {
            yield item
        }
        i++
    }
}
```

### takewhile / dropwhile - 条件过滤

```python
from itertools import takewhile, dropwhile

nums = [1, 3, 5, 2, 4, 6, 1, 3]

# takewhile: 满足条件时取值，遇到不满足立即停止
list(takewhile(lambda x: x < 5, nums))  # [1, 3]

# dropwhile: 满足条件时跳过，遇到不满足后全部取值
list(dropwhile(lambda x: x < 5, nums))  # [5, 2, 4, 6, 1, 3]

# 实用示例：跳过文件头部注释
lines = ['# comment1', '# comment2', 'data1', 'data2', '# not comment']
data_lines = list(dropwhile(lambda x: x.startswith('#'), lines))
# ['data1', 'data2', '# not comment']
```

```javascript
// JavaScript - 需要手动实现
function takeWhile(arr, predicate) {
    const result = []
    for (const item of arr) {
        if (!predicate(item)) break
        result.push(item)
    }
    return result
}

function dropWhile(arr, predicate) {
    let dropping = true
    return arr.filter(item => {
        if (dropping && predicate(item)) return false
        dropping = false
        return true
    })
}
```

### filterfalse - 过滤假值

```python
from itertools import filterfalse

nums = [0, 1, 2, 0, 3, 0, 4]

# 保留使函数返回 False 的元素
list(filterfalse(lambda x: x % 2, nums))  # [0, 2, 0, 0, 4] - 偶数

# filter 是反过来的
list(filter(lambda x: x % 2, nums))  # [1, 3] - 奇数

# 过滤空值
data = ['hello', '', 'world', None, 'python']
list(filterfalse(lambda x: not x, data))  # ['hello', 'world', 'python']
```

```javascript
// JavaScript 对比
const nums = [0, 1, 2, 0, 3, 0, 4]

nums.filter(x => !(x % 2))  // [0, 2, 0, 0, 4]
nums.filter(x => x % 2)     // [1, 3]
```

### compress - 选择器过滤

```python
from itertools import compress

data = ['A', 'B', 'C', 'D', 'E']
selectors = [1, 0, 1, 0, 1]

list(compress(data, selectors))  # ['A', 'C', 'E']

# 实用示例：根据条件筛选
names = ['Alice', 'Bob', 'Charlie', 'David']
scores = [85, 60, 92, 45]
passed = [s >= 70 for s in scores]

list(compress(names, passed))  # ['Alice', 'Charlie']
```

```javascript
// JavaScript 对比
const data = ['A', 'B', 'C', 'D', 'E']
const selectors = [1, 0, 1, 0, 1]

data.filter((_, i) => selectors[i])  // ['A', 'C', 'E']
```

### accumulate - 累积

```python
from itertools import accumulate
import operator

nums = [1, 2, 3, 4, 5]

# 默认累加
list(accumulate(nums))  # [1, 3, 6, 10, 15]

# 累乘
list(accumulate(nums, operator.mul))  # [1, 2, 6, 24, 120]

# 自定义函数：取最大值
list(accumulate(nums, max))  # [1, 2, 3, 4, 5]

# 带初始值 (Python 3.8+)
list(accumulate(nums, initial=100))  # [100, 101, 103, 106, 110, 115]
```

```javascript
// JavaScript 对比 - reduce 只返回最终值
const nums = [1, 2, 3, 4, 5]

// 需要手动实现 accumulate
function accumulate(arr, fn = (a, b) => a + b) {
    const result = []
    let acc = arr[0]
    result.push(acc)
    for (let i = 1; i < arr.length; i++) {
        acc = fn(acc, arr[i])
        result.push(acc)
    }
    return result
}

accumulate(nums)  // [1, 3, 6, 10, 15]
```

### groupby - 分组

```python
from itertools import groupby

# 注意：必须先排序！
data = [
    {'type': 'fruit', 'name': 'apple'},
    {'type': 'fruit', 'name': 'banana'},
    {'type': 'vegetable', 'name': 'carrot'},
    {'type': 'vegetable', 'name': 'celery'},
]

# 按 type 分组
for key, group in groupby(data, key=lambda x: x['type']):
    print(f"{key}: {[item['name'] for item in group]}")
# fruit: ['apple', 'banana']
# vegetable: ['carrot', 'celery']

# 连续相同元素分组
text = 'AAABBBCCAAA'
for char, group in groupby(text):
    print(f"{char}: {len(list(group))}")
# A: 3
# B: 3
# C: 2
# A: 3
```

```javascript
// JavaScript 对比 - 使用 reduce
const data = [
    { type: 'fruit', name: 'apple' },
    { type: 'fruit', name: 'banana' },
    { type: 'vegetable', name: 'carrot' },
]

const grouped = data.reduce((acc, item) => {
    const key = item.type
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
}, {})

// 或使用 Object.groupBy (ES2024)
Object.groupBy(data, item => item.type)
```

::: warning groupby 必须先排序
`groupby` 只对**连续相同**的元素分组，不会自动排序！
```python
data = [1, 2, 1, 2, 1]
# 错误用法：未排序
list((k, list(g)) for k, g in groupby(data))
# [(1, [1]), (2, [2]), (1, [1]), (2, [2]), (1, [1])]

# 正确用法：先排序
list((k, list(g)) for k, g in groupby(sorted(data)))
# [(1, [1, 1, 1]), (2, [2, 2])]
```
:::

### zip_longest - 最长匹配

```python
from itertools import zip_longest

a = [1, 2, 3]
b = ['a', 'b']

# 内置 zip 按最短截断
list(zip(a, b))  # [(1, 'a'), (2, 'b')]

# zip_longest 按最长填充
list(zip_longest(a, b))  # [(1, 'a'), (2, 'b'), (3, None)]

# 自定义填充值
list(zip_longest(a, b, fillvalue='?'))  # [(1, 'a'), (2, 'b'), (3, '?')]
```

```javascript
// JavaScript - 需要手动实现
function zipLongest(...arrays) {
    const maxLen = Math.max(...arrays.map(a => a.length))
    return Array.from({ length: maxLen }, (_, i) =>
        arrays.map(a => a[i])
    )
}
```

## 排列组合迭代器

### product - 笛卡尔积

```python
from itertools import product

# 两个序列的笛卡尔积
colors = ['red', 'blue']
sizes = ['S', 'M', 'L']

list(product(colors, sizes))
# [('red', 'S'), ('red', 'M'), ('red', 'L'),
#  ('blue', 'S'), ('blue', 'M'), ('blue', 'L')]

# 等价于嵌套循环
result = []
for c in colors:
    for s in sizes:
        result.append((c, s))

# 自身重复
list(product([0, 1], repeat=3))
# [(0, 0, 0), (0, 0, 1), (0, 1, 0), (0, 1, 1),
#  (1, 0, 0), (1, 0, 1), (1, 1, 0), (1, 1, 1)]
```

```javascript
// JavaScript - 嵌套循环或 flatMap
const colors = ['red', 'blue']
const sizes = ['S', 'M', 'L']

colors.flatMap(c => sizes.map(s => [c, s]))
```

### permutations - 排列

```python
from itertools import permutations

# 全排列
list(permutations([1, 2, 3]))
# [(1, 2, 3), (1, 3, 2), (2, 1, 3),
#  (2, 3, 1), (3, 1, 2), (3, 2, 1)]

# 指定长度的排列 (n! / (n-r)!)
list(permutations([1, 2, 3], 2))
# [(1, 2), (1, 3), (2, 1), (2, 3), (3, 1), (3, 2)]

# 字符串排列
list(permutations('ABC', 2))
# [('A', 'B'), ('A', 'C'), ('B', 'A'),
#  ('B', 'C'), ('C', 'A'), ('C', 'B')]
```

```javascript
// JavaScript - 需要递归实现
function permutations(arr) {
    if (arr.length <= 1) return [arr]
    return arr.flatMap((item, i) => {
        const rest = [...arr.slice(0, i), ...arr.slice(i + 1)]
        return permutations(rest).map(p => [item, ...p])
    })
}
```

### combinations - 组合

```python
from itertools import combinations

# C(n, r) - 不考虑顺序，不重复
list(combinations([1, 2, 3, 4], 2))
# [(1, 2), (1, 3), (1, 4), (2, 3), (2, 4), (3, 4)]

# 实用示例：生成所有两两配对
names = ['Alice', 'Bob', 'Charlie']
for pair in combinations(names, 2):
    print(f"{pair[0]} vs {pair[1]}")
# Alice vs Bob
# Alice vs Charlie
# Bob vs Charlie
```

### combinations_with_replacement - 可重复组合

```python
from itertools import combinations_with_replacement

# 允许重复的组合
list(combinations_with_replacement([1, 2, 3], 2))
# [(1, 1), (1, 2), (1, 3), (2, 2), (2, 3), (3, 3)]

# 实用示例：投掷两个骰子的所有组合
dice = range(1, 7)
all_rolls = list(combinations_with_replacement(dice, 2))
print(f"共 {len(all_rolls)} 种组合")  # 21 种
```

## 实用示例

### 分批处理

```python
from itertools import islice

def batched(iterable, n):
    """将可迭代对象分成大小为 n 的批次"""
    it = iter(iterable)
    while batch := list(islice(it, n)):
        yield batch

# 使用
data = range(10)
for batch in batched(data, 3):
    print(batch)
# [0, 1, 2]
# [3, 4, 5]
# [6, 7, 8]
# [9]

# Python 3.12+ 内置 itertools.batched
from itertools import batched  # 3.12+
```

```javascript
// JavaScript 对比
function* batched(arr, n) {
    for (let i = 0; i < arr.length; i += n) {
        yield arr.slice(i, i + n)
    }
}
```

### 滑动窗口

```python
from itertools import islice
from collections import deque

def sliding_window(iterable, n):
    """生成滑动窗口"""
    it = iter(iterable)
    window = deque(islice(it, n), maxlen=n)
    if len(window) == n:
        yield tuple(window)
    for x in it:
        window.append(x)
        yield tuple(window)

# 使用
data = [1, 2, 3, 4, 5]
list(sliding_window(data, 3))
# [(1, 2, 3), (2, 3, 4), (3, 4, 5)]

# Python 3.10+ 内置
from itertools import pairwise  # 窗口大小为 2
list(pairwise([1, 2, 3, 4]))  # [(1, 2), (2, 3), (3, 4)]
```

### 扁平化嵌套结构

```python
from itertools import chain

def flatten(nested):
    """递归扁平化任意深度嵌套"""
    for item in nested:
        if isinstance(item, (list, tuple)):
            yield from flatten(item)
        else:
            yield item

nested = [1, [2, 3, [4, 5]], 6, [[7, 8], 9]]
list(flatten(nested))  # [1, 2, 3, 4, 5, 6, 7, 8, 9]

# 单层扁平化用 chain
nested_1d = [[1, 2], [3, 4], [5, 6]]
list(chain.from_iterable(nested_1d))  # [1, 2, 3, 4, 5, 6]
```

```javascript
// JavaScript 对比
const nested = [1, [2, 3, [4, 5]], 6, [[7, 8], 9]]
nested.flat(Infinity)  // [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### 首个匹配项

```python
from itertools import dropwhile

def first_match(iterable, predicate):
    """返回第一个满足条件的元素"""
    return next(dropwhile(lambda x: not predicate(x), iterable), None)

# 使用
nums = [1, 3, 5, 8, 10, 12]
first_match(nums, lambda x: x > 6)  # 8
```

```javascript
// JavaScript 对比
const nums = [1, 3, 5, 8, 10, 12]
nums.find(x => x > 6)  // 8
```

## 性能对比

| 操作 | itertools | 列表推导/生成器 |
|-----|-----------|---------------|
| 内存 | 惰性求值，内存友好 | 列表占用内存 |
| 速度 | C 实现，更快 | Python 实现 |
| 组合 | 链式调用 | 嵌套表达式 |
| 无限 | 支持 | 不支持 |

```python
import itertools
import sys

# 内存对比
list_result = [x for x in range(1000000)]
iter_result = itertools.islice(range(1000000), 1000000)

print(sys.getsizeof(list_result))  # ~8 MB
print(sys.getsizeof(iter_result))  # ~48 bytes
```

## 与 JS 的关键差异

| 特性 | Python itertools | JavaScript |
|-----|-----------------|------------|
| 惰性求值 | 所有函数都是惰性的 | 数组方法立即求值 |
| 无限迭代 | count, cycle, repeat | 需要生成器 |
| 分组 | groupby (需排序) | Object.groupBy (ES2024) |
| 排列组合 | 内置支持 | 需要手动实现 |
| 链式处理 | 通过组合函数 | 数组方法链 |

## 小结

**无限迭代器**:
- `count()`: 无限计数
- `cycle()`: 循环迭代
- `repeat()`: 重复元素

**有限迭代器**:
- `chain()`: 连接序列
- `islice()`: 切片
- `takewhile()/dropwhile()`: 条件过滤
- `groupby()`: 分组 (需先排序)
- `accumulate()`: 累积计算

**排列组合**:
- `product()`: 笛卡尔积
- `permutations()`: 排列
- `combinations()`: 组合

::: tip 最佳实践
- 处理大数据时优先使用 itertools，节省内存
- `groupby` 前务必排序
- 组合使用多个 itertools 函数实现复杂迭代逻辑
:::

::: info 相关内容
- [functools 高阶函数](./functools.md) - 函数工具
- [collections 容器类型](./collections.md) - 容器数据类型
:::

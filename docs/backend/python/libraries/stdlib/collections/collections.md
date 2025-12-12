---
title: collections - 特殊容器数据类型
description: Python collections 模块详解，提供超越内置类型的高性能容器
---

# collections 特殊容器

## 学习目标

- 掌握 `namedtuple`、`deque`、`Counter` 等核心容器
- 理解 `defaultdict`、`OrderedDict` 的使用场景
- 学会选择合适的数据结构优化性能
- 与 JavaScript 数据结构对比

## 概述

| Python collections | JavaScript 近似 | 说明 |
|-------------------|----------------|------|
| `namedtuple` | Object / interface | 具名元组 |
| `deque` | Array (shift/unshift 慢) | 双端队列 |
| `Counter` | 手动实现 | 计数器 |
| `defaultdict` | 手动实现 | 默认值字典 |
| `OrderedDict` | Map | 有序字典 |
| `ChainMap` | 手动合并 | 链式映射 |

## namedtuple - 具名元组

`namedtuple` 创建可用名称访问的元组，比普通元组更具可读性。

### 基本用法

```python
from collections import namedtuple

# 定义具名元组类型
Point = namedtuple('Point', ['x', 'y'])
# 或使用字符串定义字段
Point = namedtuple('Point', 'x y')

# 创建实例
p = Point(3, 4)
print(p.x, p.y)      # 3 4
print(p[0], p[1])    # 3 4 (仍可用索引)

# 解包
x, y = p
print(x, y)          # 3 4

# 不可变
# p.x = 10  # AttributeError: can't set attribute
```

```javascript
// JavaScript 对比
// 方式1: 普通对象
const p = { x: 3, y: 4 }

// 方式2: TypeScript interface
interface Point {
    x: number
    y: number
}
const p: Point = { x: 3, y: 4 }

// 方式3: Class
class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}
```

### 高级用法

```python
from collections import namedtuple

# 带默认值 (Python 3.7+)
Person = namedtuple('Person', ['name', 'age', 'city'], defaults=['Unknown'])
print(Person('Alice', 30))        # Person(name='Alice', age=30, city='Unknown')
print(Person('Bob', 25, 'NYC'))   # Person(name='Bob', age=25, city='NYC')

# 从字典创建
data = {'name': 'Charlie', 'age': 35, 'city': 'LA'}
person = Person(**data)

# 转为字典
print(person._asdict())  # {'name': 'Charlie', 'age': 35, 'city': 'LA'}

# 替换字段值 (返回新实例)
new_person = person._replace(age=36)
print(new_person)  # Person(name='Charlie', age=36, city='LA')

# 获取字段名
print(Person._fields)  # ('name', 'age', 'city')

# 添加方法 (继承)
class Circle(namedtuple('Circle', ['x', 'y', 'r'])):
    @property
    def area(self):
        import math
        return math.pi * self.r ** 2

c = Circle(0, 0, 5)
print(c.area)  # 78.53981633974483
```

### typing.NamedTuple (推荐)

```python
from typing import NamedTuple

# 更现代的定义方式，支持类型注解
class Point(NamedTuple):
    x: float
    y: float
    label: str = 'origin'  # 默认值

p = Point(3.0, 4.0)
print(p)  # Point(x=3.0, y=4.0, label='origin')

# 可以添加方法
class Vector(NamedTuple):
    x: float
    y: float

    @property
    def magnitude(self) -> float:
        return (self.x ** 2 + self.y ** 2) ** 0.5

    def __add__(self, other: 'Vector') -> 'Vector':
        return Vector(self.x + other.x, self.y + other.y)

v1 = Vector(3, 4)
v2 = Vector(1, 2)
print(v1.magnitude)  # 5.0
print(v1 + v2)       # Vector(x=4, y=6)
```

## deque - 双端队列

`deque` (double-ended queue) 支持两端高效插入删除，比 list 更适合队列/栈操作。

### 基本用法

```python
from collections import deque

# 创建双端队列
d = deque([1, 2, 3])
d = deque('abc')     # deque(['a', 'b', 'c'])

# 右端操作 (等同于 list)
d.append('d')        # 右端添加
d.pop()              # 右端弹出

# 左端操作 (O(1) 时间复杂度!)
d.appendleft('z')    # 左端添加
d.popleft()          # 左端弹出

# 扩展
d.extend([4, 5])         # 右端扩展
d.extendleft([0, -1])    # 左端扩展 (注意: 逆序添加)

print(d)  # deque([-1, 0, 'a', 'b', 'c', 4, 5])
```

```javascript
// JavaScript 对比
const arr = [1, 2, 3]

// 右端操作 - O(1)
arr.push(4)      // [1, 2, 3, 4]
arr.pop()        // [1, 2, 3]

// 左端操作 - O(n) 性能差!
arr.unshift(0)   // [0, 1, 2, 3]
arr.shift()      // [1, 2, 3]

// JavaScript 没有内置双端队列
// 大量左端操作时需要自己实现
```

### 限制长度

```python
from collections import deque

# 限制最大长度 - 超出时自动移除另一端
recent = deque(maxlen=3)
recent.append(1)
recent.append(2)
recent.append(3)
print(recent)  # deque([1, 2, 3], maxlen=3)

recent.append(4)  # 自动移除最左边的 1
print(recent)  # deque([2, 3, 4], maxlen=3)

# 实用场景: 保留最近 N 条记录
history = deque(maxlen=100)
```

### 旋转操作

```python
from collections import deque

d = deque([1, 2, 3, 4, 5])

# 向右旋转
d.rotate(2)   # [4, 5, 1, 2, 3]

# 向左旋转
d.rotate(-2)  # [1, 2, 3, 4, 5]

# 实现循环缓冲区
buffer = deque([None] * 5)
for i in range(10):
    buffer.rotate(-1)
    buffer[-1] = i
    print(list(buffer))
```

### 性能对比

```python
from collections import deque
import timeit

# list vs deque 左端插入性能对比
def list_appendleft():
    lst = []
    for i in range(10000):
        lst.insert(0, i)

def deque_appendleft():
    d = deque()
    for i in range(10000):
        d.appendleft(i)

# deque 快约 100-1000 倍!
print(timeit.timeit(list_appendleft, number=10))   # ~2.5s
print(timeit.timeit(deque_appendleft, number=10))  # ~0.005s
```

## Counter - 计数器

`Counter` 是专门用于计数的字典子类。

### 基本用法

```python
from collections import Counter

# 从可迭代对象创建
c = Counter('abracadabra')
print(c)  # Counter({'a': 5, 'b': 2, 'r': 2, 'c': 1, 'd': 1})

# 从列表创建
c = Counter(['red', 'blue', 'red', 'green', 'blue', 'blue'])
print(c)  # Counter({'blue': 3, 'red': 2, 'green': 1})

# 从字典创建
c = Counter({'a': 4, 'b': 2})

# 访问计数
print(c['a'])   # 4
print(c['z'])   # 0 (不存在的键返回 0，不报错)

# 更新计数
c.update('aaa')  # 增加计数
c.update({'a': 10})
print(c['a'])   # 17
```

```javascript
// JavaScript 对比 - 手动实现
const str = 'abracadabra'
const counter = {}
for (const char of str) {
    counter[char] = (counter[char] || 0) + 1
}
console.log(counter)  // { a: 5, b: 2, r: 2, c: 1, d: 1 }

// 或使用 reduce
const counter2 = [...str].reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1
    return acc
}, {})
```

### 常用方法

```python
from collections import Counter

words = ['apple', 'banana', 'apple', 'cherry', 'banana', 'apple']
c = Counter(words)

# 最常见的 N 个元素
print(c.most_common(2))  # [('apple', 3), ('banana', 2)]
print(c.most_common())   # 全部按频率排序

# 元素迭代器 (按计数重复)
print(list(c.elements()))
# ['apple', 'apple', 'apple', 'banana', 'banana', 'cherry']

# 计数总和
print(c.total())  # 6 (Python 3.10+)
print(sum(c.values()))  # 兼容旧版本

# 减少计数
c.subtract(['apple', 'apple'])
print(c)  # Counter({'apple': 1, 'banana': 2, 'cherry': 1})
```

### 数学运算

```python
from collections import Counter

c1 = Counter(a=3, b=1)
c2 = Counter(a=1, b=2)

# 加法
print(c1 + c2)  # Counter({'a': 4, 'b': 3})

# 减法 (只保留正数)
print(c1 - c2)  # Counter({'a': 2})

# 交集 (取最小值)
print(c1 & c2)  # Counter({'a': 1, 'b': 1})

# 并集 (取最大值)
print(c1 | c2)  # Counter({'a': 3, 'b': 2})

# 正数和负数计数
c3 = Counter(a=2, b=-1)
print(+c3)  # Counter({'a': 2}) - 只保留正数
print(-c3)  # Counter({'b': 1}) - 取反后只保留正数
```

### 实用示例

```python
from collections import Counter

# 示例1: 词频统计
text = "to be or not to be that is the question"
words = text.lower().split()
word_freq = Counter(words)
print(word_freq.most_common(3))  # [('to', 2), ('be', 2), ('or', 1)]

# 示例2: 检查字谜 (Anagram)
def is_anagram(s1: str, s2: str) -> bool:
    return Counter(s1.lower().replace(' ', '')) == Counter(s2.lower().replace(' ', ''))

print(is_anagram('listen', 'silent'))  # True
print(is_anagram('hello', 'world'))    # False

# 示例3: 找出两个列表的差异
list1 = [1, 2, 2, 3, 3, 3]
list2 = [1, 2, 3]
diff = Counter(list1) - Counter(list2)
print(list(diff.elements()))  # [2, 3, 3]
```

## defaultdict - 默认值字典

`defaultdict` 在访问不存在的键时自动创建默认值。

### 基本用法

```python
from collections import defaultdict

# 默认值为 int (0)
d = defaultdict(int)
d['a'] += 1
d['b'] += 2
print(d)  # defaultdict(<class 'int'>, {'a': 1, 'b': 2})
print(d['c'])  # 0 (自动创建)

# 默认值为 list
d = defaultdict(list)
d['fruits'].append('apple')
d['fruits'].append('banana')
d['vegetables'].append('carrot')
print(d)
# defaultdict(<class 'list'>, {'fruits': ['apple', 'banana'], 'vegetables': ['carrot']})

# 默认值为 set
d = defaultdict(set)
d['tags'].add('python')
d['tags'].add('python')  # 重复添加被忽略
d['tags'].add('coding')
print(d)  # defaultdict(<class 'set'>, {'tags': {'python', 'coding'}})
```

```javascript
// JavaScript 对比
// 普通对象需要手动检查
const d = {}
d['fruits'] = d['fruits'] || []
d['fruits'].push('apple')

// 或使用 Proxy 实现自动默认值
const defaultDict = (defaultFactory) => new Proxy({}, {
    get: (target, key) => {
        if (!(key in target)) {
            target[key] = defaultFactory()
        }
        return target[key]
    }
})

const d2 = defaultDict(() => [])
d2['fruits'].push('apple')
```

### 自定义默认值

```python
from collections import defaultdict

# 使用 lambda
d = defaultdict(lambda: 'N/A')
d['name'] = 'Alice'
print(d['name'])    # Alice
print(d['unknown']) # N/A

# 嵌套 defaultdict
tree = lambda: defaultdict(tree)
taxonomy = tree()
taxonomy['Animal']['Mammal']['Dog'] = 'Canis familiaris'
taxonomy['Animal']['Mammal']['Cat'] = 'Felis catus'
taxonomy['Animal']['Bird']['Eagle'] = 'Aquila chrysaetos'

import json
print(json.dumps(taxonomy, indent=2))
```

### 实用示例

```python
from collections import defaultdict

# 示例1: 分组
students = [
    ('Alice', 'Math'),
    ('Bob', 'Science'),
    ('Charlie', 'Math'),
    ('David', 'Science'),
    ('Eve', 'Math'),
]

by_subject = defaultdict(list)
for name, subject in students:
    by_subject[subject].append(name)

print(dict(by_subject))
# {'Math': ['Alice', 'Charlie', 'Eve'], 'Science': ['Bob', 'David']}

# 示例2: 构建图
edges = [('a', 'b'), ('a', 'c'), ('b', 'c'), ('c', 'd')]
graph = defaultdict(set)
for u, v in edges:
    graph[u].add(v)
    graph[v].add(u)  # 无向图

print(dict(graph))
# {'a': {'b', 'c'}, 'b': {'a', 'c'}, 'c': {'a', 'b', 'd'}, 'd': {'c'}}

# 示例3: 计数嵌套结构
data = [
    ('2024-01', 'Product A', 100),
    ('2024-01', 'Product B', 150),
    ('2024-02', 'Product A', 120),
    ('2024-02', 'Product A', 80),
]

sales = defaultdict(lambda: defaultdict(int))
for month, product, amount in data:
    sales[month][product] += amount

print(dict(sales))
# {'2024-01': {'Product A': 100, 'Product B': 150}, '2024-02': {'Product A': 200}}
```

## OrderedDict - 有序字典

> **注意**: Python 3.7+ 普通 dict 已保证插入顺序，但 `OrderedDict` 仍有独特功能。

### 基本用法

```python
from collections import OrderedDict

# 创建有序字典
od = OrderedDict()
od['first'] = 1
od['second'] = 2
od['third'] = 3

# 迭代顺序与插入顺序一致
for k, v in od.items():
    print(k, v)

# 移动到末尾
od.move_to_end('first')
print(list(od.keys()))  # ['second', 'third', 'first']

# 移动到开头
od.move_to_end('first', last=False)
print(list(od.keys()))  # ['first', 'second', 'third']

# 弹出最后/最先插入的项
last = od.popitem(last=True)   # ('third', 3)
first = od.popitem(last=False) # ('first', 1)
```

```javascript
// JavaScript 对比
// Map 保证插入顺序
const map = new Map()
map.set('first', 1)
map.set('second', 2)

for (const [k, v] of map) {
    console.log(k, v)
}

// 但没有 move_to_end 方法
```

### OrderedDict vs dict 的区别

```python
from collections import OrderedDict

# 区别1: 比较时考虑顺序
d1 = {'a': 1, 'b': 2}
d2 = {'b': 2, 'a': 1}
print(d1 == d2)  # True (普通 dict 不考虑顺序)

od1 = OrderedDict([('a', 1), ('b', 2)])
od2 = OrderedDict([('b', 2), ('a', 1)])
print(od1 == od2)  # False (OrderedDict 考虑顺序)

# 区别2: move_to_end 方法
# dict 没有这个方法

# 区别3: popitem 可指定方向
# dict.popitem() 只能弹出"任意"项 (实际是最后一项)
# OrderedDict.popitem(last=False) 可以弹出第一项
```

### LRU 缓存实现

```python
from collections import OrderedDict

class LRUCache:
    """最近最少使用缓存"""

    def __init__(self, capacity: int):
        self.cache = OrderedDict()
        self.capacity = capacity

    def get(self, key):
        if key not in self.cache:
            return None
        # 移动到末尾 (最近使用)
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key, value):
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            # 移除最久未使用的 (第一个)
            self.cache.popitem(last=False)

# 使用
cache = LRUCache(3)
cache.put('a', 1)
cache.put('b', 2)
cache.put('c', 3)
print(cache.get('a'))  # 1 (a 移到末尾)
cache.put('d', 4)      # b 被移除
print(cache.cache)     # OrderedDict([('c', 3), ('a', 1), ('d', 4)])
```

## ChainMap - 链式映射

`ChainMap` 将多个字典合并为一个逻辑视图。

```python
from collections import ChainMap

# 创建链式映射
defaults = {'theme': 'light', 'language': 'en', 'debug': False}
user_settings = {'theme': 'dark'}
cli_args = {'debug': True}

# 后面的字典优先级更高
settings = ChainMap(cli_args, user_settings, defaults)

print(settings['theme'])     # 'dark' (来自 user_settings)
print(settings['debug'])     # True (来自 cli_args)
print(settings['language'])  # 'en' (来自 defaults)

# 查看来源
print(list(settings.keys()))   # ['theme', 'language', 'debug']
print(list(settings.values())) # ['dark', 'en', True]

# 修改只影响第一个映射
settings['new_key'] = 'value'
print(cli_args)  # {'debug': True, 'new_key': 'value'}

# 新建子上下文
child = settings.new_child({'theme': 'auto'})
print(child['theme'])  # 'auto'
print(settings['theme'])  # 'dark' (原设置不变)
```

```javascript
// JavaScript 对比 - 使用展开运算符
const defaults = { theme: 'light', language: 'en', debug: false }
const userSettings = { theme: 'dark' }
const cliArgs = { debug: true }

// 合并 (后面覆盖前面)
const settings = { ...defaults, ...userSettings, ...cliArgs }
console.log(settings)
// { theme: 'dark', language: 'en', debug: true }

// 但这是静态合并，修改原对象不会反映
```

## 选择指南

```python
# 什么时候用什么容器?

# namedtuple / NamedTuple
# - 需要不可变的数据结构
# - 想用名称而非索引访问
# - 替代简单的类

# deque
# - 需要频繁在两端添加/删除
# - 实现队列或栈
# - 需要固定大小的缓冲区

# Counter
# - 统计元素出现次数
# - 找最常见元素
# - 多重集合运算

# defaultdict
# - 分组聚合
# - 构建图结构
# - 避免 KeyError 和手动初始化

# OrderedDict
# - 需要 move_to_end 功能
# - 实现 LRU 缓存
# - 比较时需要考虑顺序

# ChainMap
# - 合并多层配置
# - 实现作用域链
# - 需要保持原字典独立
```

## 与 JS 的关键差异

| 特性 | Python collections | JavaScript |
|-----|-------------------|------------|
| 具名元组 | `namedtuple` 内置 | 需用 Object/Class |
| 双端队列 | `deque` O(1) 两端操作 | Array shift/unshift O(n) |
| 计数器 | `Counter` 内置支持 | 需手动实现 |
| 默认值字典 | `defaultdict` | 需手动检查或用 Proxy |
| 有序映射 | `OrderedDict` | `Map` |
| 链式映射 | `ChainMap` | 需手动合并或 Proxy |

## 小结

- `namedtuple`: 创建可读性强的不可变数据结构
- `deque`: 高效的双端队列，适合队列/栈/滑动窗口
- `Counter`: 计数统计的利器
- `defaultdict`: 自动初始化默认值，简化分组聚合
- `OrderedDict`: 需要顺序操作的有序字典
- `ChainMap`: 多字典合并为逻辑视图

::: info 相关内容
- [itertools 迭代器工具](./itertools.md) - 高效迭代工具
- [functools 高阶函数](./functools.md) - 函数式编程工具
- [dataclasses 数据类](../text-data/dataclass.md) - 现代数据类定义
:::

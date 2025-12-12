---
title: functools - 高阶函数工具
description: Python functools 模块详解，函数式编程工具集
---

# functools 高阶函数工具

## 学习目标

- 掌握缓存装饰器的使用
- 理解偏函数和函数包装
- 学会使用 reduce 进行归约操作
- 与 JavaScript 函数式编程对比

## 概述

| Python functools | JavaScript | 说明 |
|-----------------|------------|------|
| `@lru_cache` | 手动实现/lodash | 缓存 |
| `partial()` | `bind()` | 偏函数 |
| `reduce()` | `Array.reduce()` | 归约 |
| `@wraps` | 无直接对应 | 保留元信息 |
| `@singledispatch` | 无直接对应 | 单分派泛型 |
| `@total_ordering` | 无直接对应 | 比较方法 |

## 缓存装饰器

### lru_cache - LRU 缓存

```python
from functools import lru_cache

# 基本用法 - 无限缓存
@lru_cache(maxsize=None)
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# 极快！缓存避免重复计算
fibonacci(100)  # 354224848179261915075

# 查看缓存信息
print(fibonacci.cache_info())
# CacheInfo(hits=98, misses=101, maxsize=None, currsize=101)

# 清除缓存
fibonacci.cache_clear()
```

```javascript
// JavaScript 对比 - 手动实现
function memoize(fn) {
    const cache = new Map()
    return function(...args) {
        const key = JSON.stringify(args)
        if (cache.has(key)) {
            return cache.get(key)
        }
        const result = fn.apply(this, args)
        cache.set(key, result)
        return result
    }
}

const fibonacci = memoize(function(n) {
    if (n < 2) return n
    return fibonacci(n - 1) + fibonacci(n - 2)
})
```

### lru_cache 配置

```python
from functools import lru_cache

# 限制缓存大小 - LRU 淘汰策略
@lru_cache(maxsize=128)
def get_user(user_id):
    print(f"Fetching user {user_id}...")
    return {"id": user_id, "name": f"User {user_id}"}

get_user(1)  # Fetching user 1...
get_user(2)  # Fetching user 2...
get_user(1)  # 从缓存返回，不打印

# typed=True: 区分参数类型
@lru_cache(maxsize=128, typed=True)
def process(value):
    return value * 2

process(3)    # 缓存 key: (3,)
process(3.0)  # 缓存 key: (3.0,) - 与上面分开缓存
```

### cache (Python 3.9+)

```python
from functools import cache

# cache 是 lru_cache(maxsize=None) 的简写
@cache
def factorial(n):
    return n * factorial(n - 1) if n else 1

factorial(10)  # 3628800
```

### cached_property (Python 3.8+)

```python
from functools import cached_property

class DataProcessor:
    def __init__(self, data):
        self.data = data

    @cached_property
    def processed(self):
        """只计算一次，之后缓存"""
        print("Processing...")
        return [x * 2 for x in self.data]

dp = DataProcessor([1, 2, 3])
print(dp.processed)  # Processing... [2, 4, 6]
print(dp.processed)  # [2, 4, 6] - 不再打印 Processing
```

```javascript
// JavaScript 对比 - 使用 getter 和私有属性
class DataProcessor {
    #processedCache = null

    constructor(data) {
        this.data = data
    }

    get processed() {
        if (this.#processedCache === null) {
            console.log('Processing...')
            this.#processedCache = this.data.map(x => x * 2)
        }
        return this.#processedCache
    }
}
```

## 偏函数

### partial - 固定参数

```python
from functools import partial

# 固定部分参数
def power(base, exponent):
    return base ** exponent

square = partial(power, exponent=2)
cube = partial(power, exponent=3)

print(square(5))  # 25
print(cube(5))    # 125

# 实用示例：配置化函数
import json

# 固定 JSON 格式化参数
pretty_json = partial(json.dumps, indent=2, ensure_ascii=False)

data = {"name": "张三", "age": 30}
print(pretty_json(data))
# {
#   "name": "张三",
#   "age": 30
# }
```

```javascript
// JavaScript 对比 - 使用 bind
function power(base, exponent) {
    return base ** exponent
}

// bind 固定 this 和部分参数
const square = power.bind(null, undefined) // 不太好用

// 更常用：箭头函数
const square2 = (base) => power(base, 2)
const cube = (base) => power(base, 3)

// 或使用柯里化
const curriedPower = (exponent) => (base) => base ** exponent
const square3 = curriedPower(2)
```

### partialmethod - 方法版本

```python
from functools import partialmethod

class Cell:
    def __init__(self):
        self._alive = False

    def set_state(self, state):
        self._alive = state

    # 固定参数的方法
    set_alive = partialmethod(set_state, True)
    set_dead = partialmethod(set_state, False)

cell = Cell()
cell.set_alive()
print(cell._alive)  # True
cell.set_dead()
print(cell._alive)  # False
```

## 函数包装

### wraps - 保留元信息

```python
from functools import wraps

# 不使用 @wraps
def bad_decorator(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@bad_decorator
def greet(name):
    """向某人问好"""
    return f"Hello, {name}!"

print(greet.__name__)  # wrapper - 丢失原函数名
print(greet.__doc__)   # None - 丢失文档

# 使用 @wraps
def good_decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@good_decorator
def greet2(name):
    """向某人问好"""
    return f"Hello, {name}!"

print(greet2.__name__)  # greet2 - 保留原函数名
print(greet2.__doc__)   # 向某人问好 - 保留文档
```

```javascript
// JavaScript 没有直接对应
// 但可以手动复制属性
function decorator(func) {
    function wrapper(...args) {
        return func(...args)
    }
    // 手动复制
    Object.defineProperty(wrapper, 'name', { value: func.name })
    return wrapper
}
```

### 实用装饰器示例

```python
from functools import wraps
import time

# 计时装饰器
def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        end = time.perf_counter()
        print(f"{func.__name__} took {end - start:.4f}s")
        return result
    return wrapper

# 重试装饰器
def retry(max_attempts=3, delay=1):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
                    print(f"Attempt {attempt + 1} failed: {e}")
                    time.sleep(delay)
        return wrapper
    return decorator

@timer
@retry(max_attempts=3)
def fetch_data(url):
    """获取数据"""
    # 模拟网络请求
    return {"data": "success"}
```

## 归约操作

### reduce - 累积计算

```python
from functools import reduce

# 基本用法
nums = [1, 2, 3, 4, 5]

# 求和
total = reduce(lambda acc, x: acc + x, nums)
print(total)  # 15

# 求积
product = reduce(lambda acc, x: acc * x, nums)
print(product)  # 120

# 带初始值
result = reduce(lambda acc, x: acc + x, nums, 100)
print(result)  # 115

# 找最大值
max_val = reduce(lambda a, b: a if a > b else b, nums)
print(max_val)  # 5
```

```javascript
// JavaScript 对比
const nums = [1, 2, 3, 4, 5]

const total = nums.reduce((acc, x) => acc + x, 0)
const product = nums.reduce((acc, x) => acc * x, 1)
const maxVal = nums.reduce((a, b) => a > b ? a : b)
```

### reduce 实用示例

```python
from functools import reduce

# 展平嵌套列表
nested = [[1, 2], [3, 4], [5, 6]]
flat = reduce(lambda acc, x: acc + x, nested, [])
print(flat)  # [1, 2, 3, 4, 5, 6]

# 字典合并
dicts = [{'a': 1}, {'b': 2}, {'c': 3}]
merged = reduce(lambda acc, d: {**acc, **d}, dicts, {})
print(merged)  # {'a': 1, 'b': 2, 'c': 3}

# 管道操作
def pipe(*funcs):
    """创建函数管道"""
    return reduce(lambda f, g: lambda x: g(f(x)), funcs)

# 使用管道
process = pipe(
    lambda x: x + 1,
    lambda x: x * 2,
    lambda x: x ** 2
)
print(process(5))  # ((5 + 1) * 2) ** 2 = 144
```

```javascript
// JavaScript 管道
const pipe = (...funcs) =>
    funcs.reduce((f, g) => x => g(f(x)))

const process = pipe(
    x => x + 1,
    x => x * 2,
    x => x ** 2
)
console.log(process(5))  // 144
```

## 比较与排序

### total_ordering - 完整比较

```python
from functools import total_ordering

@total_ordering
class Version:
    """只需定义 __eq__ 和一个比较方法，自动生成其他比较方法"""

    def __init__(self, major, minor, patch):
        self.major = major
        self.minor = minor
        self.patch = patch

    def __eq__(self, other):
        return (self.major, self.minor, self.patch) == \
               (other.major, other.minor, other.patch)

    def __lt__(self, other):
        return (self.major, self.minor, self.patch) < \
               (other.major, other.minor, other.patch)

v1 = Version(1, 0, 0)
v2 = Version(2, 0, 0)
v3 = Version(1, 0, 0)

print(v1 < v2)   # True - 直接定义
print(v1 <= v2)  # True - 自动生成
print(v1 > v2)   # False - 自动生成
print(v1 >= v3)  # True - 自动生成
print(v1 == v3)  # True - 直接定义
```

### cmp_to_key - 比较函数转换

```python
from functools import cmp_to_key

# 旧式比较函数 (返回 -1, 0, 1)
def compare(a, b):
    if a < b:
        return -1
    elif a > b:
        return 1
    return 0

# 转换为 key 函数用于排序
nums = [3, 1, 4, 1, 5, 9, 2, 6]
sorted_nums = sorted(nums, key=cmp_to_key(compare))
print(sorted_nums)  # [1, 1, 2, 3, 4, 5, 6, 9]

# 实用示例：自定义字符串排序
def locale_compare(a, b):
    """按拼音排序"""
    import locale
    return locale.strcoll(a, b)

names = ['张三', '李四', '王五']
sorted_names = sorted(names, key=cmp_to_key(locale_compare))
```

```javascript
// JavaScript - sort 直接支持比较函数
const nums = [3, 1, 4, 1, 5, 9, 2, 6]
nums.sort((a, b) => a - b)

// 字符串比较
const names = ['张三', '李四', '王五']
names.sort((a, b) => a.localeCompare(b, 'zh-CN'))
```

## 单分派泛型

### singledispatch - 类型分派

```python
from functools import singledispatch

@singledispatch
def process(data):
    """默认处理"""
    raise NotImplementedError(f"Cannot process {type(data)}")

@process.register(int)
def _(data):
    return f"Processing integer: {data * 2}"

@process.register(str)
def _(data):
    return f"Processing string: {data.upper()}"

@process.register(list)
def _(data):
    return f"Processing list with {len(data)} items"

# 根据参数类型自动分派
print(process(42))        # Processing integer: 84
print(process("hello"))   # Processing string: HELLO
print(process([1, 2, 3])) # Processing list with 3 items
```

```javascript
// JavaScript - 需要手动实现类型检查
function process(data) {
    if (typeof data === 'number') {
        return `Processing integer: ${data * 2}`
    } else if (typeof data === 'string') {
        return `Processing string: ${data.toUpperCase()}`
    } else if (Array.isArray(data)) {
        return `Processing list with ${data.length} items`
    }
    throw new Error(`Cannot process ${typeof data}`)
}
```

### singledispatchmethod - 方法版本

```python
from functools import singledispatchmethod

class Formatter:
    @singledispatchmethod
    def format(self, data):
        raise NotImplementedError(f"Cannot format {type(data)}")

    @format.register(int)
    def _(self, data):
        return f"{data:,}"  # 千分位

    @format.register(float)
    def _(self, data):
        return f"{data:.2f}"  # 两位小数

    @format.register(str)
    def _(self, data):
        return data.strip()

fmt = Formatter()
print(fmt.format(1234567))   # 1,234,567
print(fmt.format(3.14159))   # 3.14
print(fmt.format("  hello ")) # hello
```

## 实用示例

### 带超时的缓存

```python
from functools import wraps
import time

def timed_lru_cache(seconds=300, maxsize=128):
    """带过期时间的 LRU 缓存"""
    def decorator(func):
        from functools import lru_cache

        @lru_cache(maxsize=maxsize)
        def cached_func(*args, _cache_time=None, **kwargs):
            return func(*args, **kwargs)

        @wraps(func)
        def wrapper(*args, **kwargs):
            # 使用时间戳作为缓存键的一部分
            cache_time = int(time.time() / seconds)
            return cached_func(*args, _cache_time=cache_time, **kwargs)

        wrapper.cache_clear = cached_func.cache_clear
        return wrapper
    return decorator

@timed_lru_cache(seconds=60)
def get_data(key):
    print(f"Fetching {key}...")
    return f"data_{key}"
```

### 函数组合

```python
from functools import reduce

def compose(*funcs):
    """从右到左组合函数 (数学定义)"""
    return reduce(lambda f, g: lambda x: f(g(x)), funcs)

def pipe(*funcs):
    """从左到右组合函数 (更直观)"""
    return reduce(lambda f, g: lambda x: g(f(x)), funcs)

# 使用
add_one = lambda x: x + 1
double = lambda x: x * 2
square = lambda x: x ** 2

# compose: square(double(add_one(5))) = square(12) = 144
composed = compose(square, double, add_one)
print(composed(5))  # 144

# pipe: square(double(add_one(5))) 但按阅读顺序
piped = pipe(add_one, double, square)
print(piped(5))  # 144
```

### 方法链式调用

```python
from functools import partial

class Query:
    def __init__(self, data):
        self.data = data
        self._filters = []

    def where(self, predicate):
        self._filters.append(predicate)
        return self  # 返回 self 实现链式调用

    def execute(self):
        result = self.data
        for f in self._filters:
            result = filter(f, result)
        return list(result)

# 使用
data = [
    {"name": "Alice", "age": 25},
    {"name": "Bob", "age": 30},
    {"name": "Charlie", "age": 35},
]

result = (Query(data)
    .where(lambda x: x["age"] > 25)
    .where(lambda x: x["name"].startswith("C"))
    .execute())

print(result)  # [{'name': 'Charlie', 'age': 35}]
```

## 与 JS 的关键差异

| 特性 | Python functools | JavaScript |
|-----|-----------------|------------|
| 缓存 | `@lru_cache` 内置 | 需要手动或第三方库 |
| 偏函数 | `partial()` | `bind()` 或箭头函数 |
| 元信息 | `@wraps` 保留 | 需手动复制 |
| reduce | `functools.reduce()` | `Array.reduce()` |
| 泛型分派 | `@singledispatch` | 类型检查 |

## 小结

**缓存**:
- `@lru_cache`: LRU 缓存装饰器
- `@cache`: 无限缓存 (3.9+)
- `@cached_property`: 属性缓存 (3.8+)

**函数工具**:
- `partial()`: 固定部分参数
- `@wraps`: 保留函数元信息
- `reduce()`: 归约操作

**类型分派**:
- `@singledispatch`: 单分派泛型函数
- `@singledispatchmethod`: 方法版本

**比较工具**:
- `@total_ordering`: 自动生成比较方法
- `cmp_to_key`: 比较函数转 key 函数

::: tip 最佳实践
- 递归函数使用 `@lru_cache` 可大幅提升性能
- 编写装饰器时总是使用 `@wraps`
- `partial` 比 lambda 更清晰表达意图
:::

::: info 相关内容
- [itertools 迭代器工具](./itertools.md) - 迭代器函数
:::

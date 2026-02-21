---
title: 生成器 Generators
description: Python 生成器完整指南,与 JavaScript Generator 深度对比
---

# 生成器 Generators

生成器是 Python 的惰性求值特性,使用 `yield` 关键字实现迭代器协议,能够按需生成值而不是一次性生成所有值,节省内存且提高性能。

[🔗 Python 生成器官方文档](https://docs.python.org/3/reference/expressions.html#yield-expressions){target="_blank" rel="noopener"}

## 什么是生成器?

### 核心概念

```python
# 普通函数:一次性返回所有结果
def get_numbers(n):
    result = []
    for i in range(n):
        result.append(i)
    return result  # 返回完整列表

numbers = get_numbers(1000000)  # 占用大量内存

# 生成器函数:按需返回结果
def generate_numbers(n):
    for i in range(n):
        yield i  # 每次 yield 一个值

numbers = generate_numbers(1000000)  # 几乎不占内存
```

```javascript
// JavaScript Generator 对比
function* generateNumbers(n) {
  for (let i = 0; i < n; i++) {
    yield i
  }
}

const numbers = generateNumbers(1000000)
```

### 生成器的优势

**为什么使用生成器?**

- ⚡ **内存高效**: 惰性计算,按需生成值
- ⏸️ **状态保持**: 自动保存函数执行状态
- 🔄 **无限序列**: 可以生成无限长的序列
- 📦 **管道处理**: 易于组合和链式操作
- 🎯 **简洁代码**: 用简单的语法实现复杂的迭代逻辑

## 基本生成器

### 使用 yield 关键字

```python
def count_up_to(n):
    """生成 0 到 n-1 的数字"""
    i = 0
    while i < n:
        yield i  # yield 暂停函数,返回值
        i += 1

# 使用生成器
gen = count_up_to(5)
print(next(gen))  # 0
print(next(gen))  # 1
print(next(gen))  # 2

# 或使用 for 循环
for num in count_up_to(5):
    print(num)  # 0, 1, 2, 3, 4
```

```javascript
// JavaScript 对比
function* countUpTo(n) {
  let i = 0
  while (i < n) {
    yield i
    i++
  }
}

const gen = countUpTo(5)
console.log(gen.next().value) // 0
console.log(gen.next().value) // 1
```

### 生成器对象

```python
def simple_gen():
    yield 1
    yield 2
    yield 3

gen = simple_gen()

# 生成器是迭代器
print(type(gen))  # <class 'generator'>

# 迭代器协议
print(next(gen))  # 1
print(next(gen))  # 2
print(next(gen))  # 3
# print(next(gen))  # StopIteration 异常

# 转换为列表(一次性消费所有值)
gen2 = simple_gen()
print(list(gen2))  # [1, 2, 3]
```

## 生成器表达式

### 语法与列表推导式对比

```python
# 列表推导式 - 立即计算所有值
squares_list = [x**2 for x in range(1000000)]
print(type(squares_list))  # <class 'list'>
# 占用 ~8MB 内存

# 生成器表达式 - 惰性计算
squares_gen = (x**2 for x in range(1000000))
print(type(squares_gen))  # <class 'generator'>
# 几乎不占内存

# 使用生成器
for square in squares_gen:
    print(square)
    if square > 100:
        break  # 只计算了需要的部分
```

```javascript
// JavaScript 没有直接等价物,但可以用 Generator
function* squares(n) {
  for (let i = 0; i < n; i++) {
    yield i ** 2
  }
}
```

### 生成器表达式最佳用法

```python
# ✅ 作为函数参数(无需额外括号)
sum_of_squares = sum(x**2 for x in range(100))

# ✅ 链式处理
data = (x for x in range(100))
filtered = (x for x in data if x % 2 == 0)
squared = (x**2 for x in filtered)
result = list(squared)

# ❌ 避免:无意义的转换
bad = list(x for x in range(10))  # 直接用 list(range(10))
```

## 高级生成器特性

### yield from (委托生成器)

```python
def sub_gen():
    yield 1
    yield 2

def main_gen():
    yield "start"
    yield from sub_gen()  # 委托给子生成器
    yield "end"

list(main_gen())  # ['start', 1, 2, 'end']

# 实际应用:递归遍历
def flatten(nested_list):
    """扁平化嵌套列表"""
    for item in nested_list:
        if isinstance(item, list):
            yield from flatten(item)  # 递归
        else:
            yield item

nested = [1, [2, [3, 4]], 5, [6]]
print(list(flatten(nested)))  # [1, 2, 3, 4, 5, 6]
```

```javascript
// JavaScript 对比
function* flatten(arr) {
  for (const item of arr) {
    if (Array.isArray(item)) {
      yield* flatten(item) // yield*
    } else {
      yield item
    }
  }
}
```

### 发送值到生成器

生成器对象自带以下内置方法：

| 方法 | 作用 | JS 对应 |
|------|------|---------|
| `next(gen)` | 执行到下一个 `yield` | `gen.next()` |
| `gen.send(value)` | 发送值并继续执行 | `gen.next(value)` |
| `gen.throw(exc)` | 在 `yield` 处抛出异常 | `gen.throw(exc)` |
| `gen.close()` | 关闭生成器 | `gen.return()` |

```python
def echo_gen():
    """接收发送的值"""
    while True:
        received = yield  # yield 可以接收值
        print(f"Received: {received}")

gen = echo_gen()
next(gen)  # 启动生成器(必须先调用 next)
gen.send("Hello")  # Received: Hello
gen.send("World")  # Received: World

# ⚠️ 为什么第一次必须用 next()?
# 生成器刚创建时代码还没执行到 yield,没有"接收点"
# gen.send("Hi")  # ❌ TypeError: can't send non-None value to a just-started generator

# 双向通信
def running_average():
    total = 0
    count = 0
    average = None
    while True:
        value = yield average  # 返回并接收值
        total += value
        count += 1
        average = total / count

avg_gen = running_average()
next(avg_gen)  # 启动
print(avg_gen.send(10))  # 10.0
print(avg_gen.send(20))  # 15.0
print(avg_gen.send(30))  # 20.0
```

### 关闭和异常处理

```python
def gen_with_cleanup():
    try:
        yield 1
        yield 2
        yield 3
    finally:
        print("Cleanup code")

gen = gen_with_cleanup()
print(next(gen))  # 1
gen.close()       # 触发 GeneratorExit
# Cleanup code

# 向生成器抛出异常
def error_handling_gen():
    try:
        while True:
            value = yield
            print(f"Got: {value}")
    except ValueError as e:
        print(f"Caught: {e}")
        yield "error_handled"

gen = error_handling_gen()
next(gen)
gen.send(10)  # Got: 10
result = gen.throw(ValueError, "Something wrong")
print(result)  # error_handled
```

## 生成器的常见应用

### 1. 处理大文件

```python
def read_large_file(file_path):
    """逐行读取大文件,不占用大量内存"""
    with open(file_path, encoding="utf-8") as f:
        for line in f:
            yield line.strip()

# 使用
for line in read_large_file("huge.log"):
    if "ERROR" in line:
        print(line)

# CSV 处理
def parse_csv(file_path):
    """逐行解析 CSV"""
    with open(file_path) as f:
        header = next(f).strip().split(',')
        for line in f:
            values = line.strip().split(',')
            yield dict(zip(header, values))

for row in parse_csv("data.csv"):
    print(row)
```

### 2. 无限序列

```python
def fibonacci():
    """无限斐波那契数列"""
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

# 获取前 10 个
fib = fibonacci()
for _ in range(10):
    print(next(fib))

# 或使用 itertools.islice
import itertools
first_10 = itertools.islice(fibonacci(), 10)
print(list(first_10))  # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

# 无限计数器
def count(start=0, step=1):
    """无限计数"""
    n = start
    while True:
        yield n
        n += step

counter = count(10, 2)
print(next(counter))  # 10
print(next(counter))  # 12
```

### 3. 数据管道

```python
def read_lines(file_path):
    """读取文件行"""
    with open(file_path) as f:
        for line in f:
            yield line

def filter_errors(lines):
    """过滤包含 ERROR 的行"""
    for line in lines:
        if "ERROR" in line:
            yield line

def extract_timestamp(lines):
    """提取时间戳"""
    for line in lines:
        # 假设格式: [2024-01-01 12:00:00] ERROR ...
        yield line[1:20]

# 链式管道
lines = read_lines("app.log")
errors = filter_errors(lines)
timestamps = extract_timestamp(errors)

for ts in timestamps:
    print(ts)
```

```javascript
// JavaScript 管道对比(使用 Generator)
function* readLines(data) {
  for (const line of data) yield line
}

function* filterErrors(lines) {
  for (const line of lines) {
    if (line.includes('ERROR')) yield line
  }
}

const lines = readLines(data)
const errors = filterErrors(lines)
```

### 4. 批量处理

```python
def batch(iterable, size):
    """将可迭代对象分批"""
    batch = []
    for item in iterable:
        batch.append(item)
        if len(batch) == size:
            yield batch
            batch = []
    if batch:  # 最后一批
        yield batch

# 使用
data = range(100)
for chunk in batch(data, 10):
    print(f"Processing batch: {chunk}")
    # 批量写入数据库等操作

# 或使用 itertools
import itertools

def batched(iterable, n):
    """Python 3.12+ 有内置的 itertools.batched"""
    it = iter(iterable)
    while chunk := list(itertools.islice(it, n)):
        yield chunk
```

### 5. 树遍历

```python
class TreeNode:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right

def inorder_traversal(node):
    """中序遍历二叉树"""
    if node:
        yield from inorder_traversal(node.left)
        yield node.value
        yield from inorder_traversal(node.right)

# 构建树
root = TreeNode(4,
    TreeNode(2, TreeNode(1), TreeNode(3)),
    TreeNode(6, TreeNode(5), TreeNode(7))
)

# 遍历
for value in inorder_traversal(root):
    print(value)  # 1, 2, 3, 4, 5, 6, 7
```

### 6. 状态机

```python
def traffic_light():
    """交通灯状态机"""
    while True:
        yield "Green"
        yield "Yellow"
        yield "Red"

lights = traffic_light()
for _ in range(10):
    print(next(lights))
# Green, Yellow, Red, Green, Yellow, Red...

# 更复杂的状态机
def order_state_machine():
    """订单状态机"""
    state = yield "Created"
    while True:
        if state == "pay":
            state = yield "Paid"
        elif state == "ship":
            state = yield "Shipped"
        elif state == "complete":
            state = yield "Completed"
            break

order = order_state_machine()
print(next(order))           # Created
print(order.send("pay"))     # Paid
print(order.send("ship"))    # Shipped
print(order.send("complete")) # Completed
```

## itertools 模块

### 常用生成器工具

```python
import itertools

# count - 无限计数
for i in itertools.count(10, 2):
    print(i)
    if i > 20:
        break
# 10, 12, 14, 16, 18, 20

# cycle - 无限循环
colors = itertools.cycle(["red", "green", "blue"])
for _ in range(5):
    print(next(colors))
# red, green, blue, red, green

# repeat - 重复元素
for x in itertools.repeat(10, 3):
    print(x)
# 10, 10, 10

# chain - 连接多个可迭代对象
list(itertools.chain([1, 2], [3, 4], [5, 6]))
# [1, 2, 3, 4, 5, 6]

# takewhile - 满足条件时取值
list(itertools.takewhile(lambda x: x < 5, [1, 2, 3, 4, 5, 6]))
# [1, 2, 3, 4]

# dropwhile - 跳过满足条件的值
list(itertools.dropwhile(lambda x: x < 5, [1, 2, 3, 4, 5, 6]))
# [5, 6]

# islice - 切片
list(itertools.islice(range(10), 2, 8, 2))
# [2, 4, 6]

# combinations - 组合
list(itertools.combinations([1, 2, 3], 2))
# [(1, 2), (1, 3), (2, 3)]

# permutations - 排列
list(itertools.permutations([1, 2, 3], 2))
# [(1, 2), (1, 3), (2, 1), (2, 3), (3, 1), (3, 2)]
```

## 生成器性能优化

### 内存对比

```python
import sys

# 列表:占用大量内存
big_list = [x for x in range(1000000)]
print(sys.getsizeof(big_list))  # ~8MB

# 生成器:几乎不占内存
big_gen = (x for x in range(1000000))
print(sys.getsizeof(big_gen))  # ~200 bytes

# 实际处理
def process_list():
    """使用列表"""
    data = [x**2 for x in range(1000000)]
    return sum(data)

def process_gen():
    """使用生成器"""
    data = (x**2 for x in range(1000000))
    return sum(data)

# process_gen() 内存占用远小于 process_list()
```

### 何时使用生成器

```python
# ✅ 适合使用生成器
# 1. 大数据集
def process_large_data(file_path):
    for line in read_large_file(file_path):
        yield process_line(line)

# 2. 无限序列
def all_primes():
    yield from sieve_of_eratosthenes()

# 3. 管道处理
def pipeline(data):
    data = (parse(x) for x in data)
    data = (validate(x) for x in data if x)
    data = (transform(x) for x in data)
    return data

# ❌ 不适合使用生成器
# 1. 需要多次遍历
gen = (x for x in range(10))
list(gen)  # [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
list(gen)  # [] - 生成器已耗尽

# 2. 需要随机访问
gen = (x for x in range(10))
# gen[5]  # TypeError - 生成器不支持索引

# 3. 需要获取长度
gen = (x for x in range(10))
# len(gen)  # TypeError - 生成器没有长度
```

## 生成器最佳实践

### 1. 命名清晰

```python
# ✅ 好的做法:名称表明是生成器
def generate_primes(n):
    pass

def iter_lines(file):
    pass

# ❌ 避免:名称不明确
def primes(n):  # 返回列表还是生成器?
    pass
```

### 2. 文档说明

```python
def generate_fibonacci(n):
    """
    生成前 n 个斐波那契数。

    Args:
        n: 要生成的数字个数

    Yields:
        int: 下一个斐波那契数
    """
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b
```

### 3. 资源清理

```python
def safe_file_reader(file_path):
    """确保文件被正确关闭"""
    f = None
    try:
        f = open(file_path)
        for line in f:
            yield line.strip()
    finally:
        if f:
            f.close()

# 或使用 with 语句(推荐)
def safe_file_reader(file_path):
    with open(file_path) as f:
        for line in f:
            yield line.strip()
```

## 对前端开发者

### Generator 对照表

| Python             | JavaScript          | 说明         |
| ------------------ | ------------------- | ------------ |
| `def gen():`       | `function* gen()`   | 定义生成器   |
| `yield x`          | `yield x`           | 产出值       |
| `yield from gen()` | `yield* gen()`      | 委托         |
| `next(gen)`        | `gen.next().value`  | 获取下一个值 |
| `gen.send(x)`      | `gen.next(x).value` | 发送值       |
| `gen.close()`      | `gen.return()`      | 关闭         |
| 生成器表达式       | -                   | Python 独有  |

### 使用场景对比

```python
# Python: 处理大文件
def process_large_file(path):
    with open(path) as f:
        for line in f:
            yield process_line(line)
```

```javascript
// JavaScript: 异步数据流
async function* processLargeFile(path) {
  const stream = fs.createReadStream(path)
  for await (const line of stream) {
    yield processLine(line)
  }
}
```

## 小结

- 生成器使用 `yield` 实现惰性求值
- 内存高效,适合处理大数据集和无限序列
- `yield from` 用于委托子生成器
- 生成器表达式 `(x for x in ...)` 类似列表推导式但更省内存
- `itertools` 模块提供丰富的生成器工具
- 适用场景:文件处理、数据管道、无限序列、批量处理
- 类似 JavaScript Generator,但Python 有独特的生成器表达式

更多信息请参考:

- [PEP 255 - Simple Generators](https://www.python.org/dev/peps/pep-0255/)
- [PEP 342 - Coroutines via Enhanced Generators](https://www.python.org/dev/peps/pep-0342/)
- [itertools 文档](https://docs.python.org/3/library/itertools.html)

---
title: 函数
description: Python 函数定义、参数、lambda 与 JavaScript 对比
---

# 函数

## 学习目标

本章节你将学习:

- 函数定义 (def)
- 参数类型 (位置参数、默认参数、可变参数)
- \*args 和 \*\*kwargs
- lambda 表达式
- 作用域与闭包

## 函数定义

### 基本语法

```python
# 使用 def 关键字定义函数
def greet(name):
    return f"Hello, {name}!"

# 调用函数
message = greet("Alice")
print(message)  # Hello, Alice!

# 无返回值的函数
def say_hello():
    print("Hello!")
    # 隐式返回 None
```

```javascript
// JavaScript 对比
function greet(name) {
  return `Hello, ${name}!`
}

// 或箭头函数
const greet = (name) => `Hello, ${name}!`
```

### 多返回值

```python
# Python 可以返回多个值（实际是元组）
def get_user_info():
    name = "Alice"
    age = 25
    return name, age  # 返回元组

# 解构接收
name, age = get_user_info()
print(name, age)  # Alice 25

# 也可以作为元组接收
result = get_user_info()
print(result)  # ('Alice', 25)
```

```javascript
// JavaScript 对比 - 需要显式用数组或对象
function getUserInfo() {
  return { name: 'Alice', age: 25 }
}

const { name, age } = getUserInfo()
```

## 参数类型

### 位置参数

```python
def add(a, b):
    return a + b

# 按位置传递
result = add(1, 2)  # a=1, b=2
```

### 默认参数

```python
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

# 使用默认值
print(greet("Alice"))           # Hello, Alice!
# 覆盖默认值
print(greet("Alice", "Hi"))     # Hi, Alice!
```

```javascript
// JavaScript 对比
function greet(name, greeting = 'Hello') {
  return `${greeting}, ${name}!`
}
```

> **注意**: 默认参数必须放在非默认参数之后

### 关键字参数

```python
def create_user(name, age, city="Unknown"):
    return {"name": name, "age": age, "city": city}

# 使用关键字参数（顺序无关）
user = create_user(age=25, name="Alice", city="Beijing")
print(user)  # {'name': 'Alice', 'age': 25, 'city': 'Beijing'}

# 混合使用（位置参数必须在前）
user = create_user("Bob", age=30)
```

```javascript
// JavaScript 通常用对象解构实现类似功能
function createUser({ name, age, city = 'Unknown' }) {
  return { name, age, city }
}

const user = createUser({ age: 25, name: 'Alice' })
```

### \*args - 可变位置参数

```python
def sum_all(*args):
    """接收任意数量的位置参数"""
    print(type(args))  # <class 'tuple'>
    return sum(args)

print(sum_all(1, 2, 3))       # 6
print(sum_all(1, 2, 3, 4, 5)) # 15

# 解包列表作为参数
numbers = [1, 2, 3, 4]
print(sum_all(*numbers))      # 10 - 使用 * 解包
```

```javascript
// JavaScript 剩余参数对比
function sumAll(...args) {
  return args.reduce((a, b) => a + b, 0)
}

// 展开数组
const numbers = [1, 2, 3, 4]
sumAll(...numbers)
```

### \*\*kwargs - 可变关键字参数

```python
def print_info(**kwargs):
    """接收任意数量的关键字参数"""
    print(type(kwargs))  # <class 'dict'>
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="Alice", age=25, city="Beijing")
# name: Alice
# age: 25
# city: Beijing

# 解包字典作为参数
info = {"name": "Bob", "age": 30}
print_info(**info)  # 使用 ** 解包
```

```javascript
// JavaScript 没有直接对应，通常用对象参数
function printInfo(info) {
  for (const [key, value] of Object.entries(info)) {
    console.log(`${key}: ${value}`)
  }
}
```

### 参数顺序规则

```python
# 参数顺序: 位置参数 → 默认参数 → *args → 关键字参数 → **kwargs
def complex_func(a, b, c=3, *args, d=4, **kwargs):
    print(f"a={a}, b={b}, c={c}")
    print(f"args={args}")
    print(f"d={d}")
    print(f"kwargs={kwargs}")

complex_func(1, 2, 3, 4, 5, d=6, e=7, f=8)
# a=1, b=2, c=3
# args=(4, 5)
# d=6
# kwargs={'e': 7, 'f': 8}
```

### 仅关键字参数

```python
# * 之后的参数必须使用关键字传递
def create_user(name, *, age, city="Unknown"):
    return {"name": name, "age": age, "city": city}

# create_user("Alice", 25)  # 错误! TypeError
create_user("Alice", age=25)  # 正确
```

## lambda 表达式

Python 的 lambda 是单行匿名函数，功能比 JavaScript 箭头函数受限。

```python
# 基本语法: lambda 参数: 表达式
add = lambda a, b: a + b
print(add(1, 2))  # 3

# 常用于排序
users = [
    {"name": "Charlie", "age": 30},
    {"name": "Alice", "age": 25},
    {"name": "Bob", "age": 28}
]

# 按年龄排序
users_sorted = sorted(users, key=lambda u: u["age"])

# 按名字排序
users_sorted = sorted(users, key=lambda u: u["name"])
```

```javascript
// JavaScript 箭头函数对比
const add = (a, b) => a + b

// 排序
const usersSorted = users.sort((a, b) => a.age - b.age)
```

> **关键差异**: Python lambda 只能包含单个表达式，不能有多条语句。需要复杂逻辑时使用 def 定义完整函数。

### lambda 常用场景

```python
# 与 map、filter 配合
numbers = [1, 2, 3, 4, 5]

# map - 映射
squared = list(map(lambda x: x ** 2, numbers))
print(squared)  # [1, 4, 9, 16, 25]

# filter - 过滤
evens = list(filter(lambda x: x % 2 == 0, numbers))
print(evens)  # [2, 4]

# 但更推荐使用列表推导式
squared = [x ** 2 for x in numbers]
evens = [x for x in numbers if x % 2 == 0]
```

## 作用域

### LEGB 规则

Python 变量查找顺序: Local → Enclosing → Global → Built-in

```python
# Global 作用域
x = "global"

def outer():
    # Enclosing 作用域
    x = "enclosing"

    def inner():
        # Local 作用域
        x = "local"
        print(x)  # local

    inner()
    print(x)  # enclosing

outer()
print(x)  # global
```

### global 和 nonlocal

```python
count = 0

def increment():
    global count  # 声明使用全局变量
    count += 1

increment()
print(count)  # 1

# nonlocal - 访问外层函数变量
def outer():
    x = 0
    def inner():
        nonlocal x  # 声明使用外层变量
        x += 1
    inner()
    print(x)  # 1

outer()
```

### 闭包

```python
def make_counter():
    count = 0

    def counter():
        nonlocal count
        count += 1
        return count

    return counter

# 创建计数器
counter1 = make_counter()
print(counter1())  # 1
print(counter1())  # 2
print(counter1())  # 3

# 独立的计数器
counter2 = make_counter()
print(counter2())  # 1
```

```javascript
// JavaScript 闭包对比
function makeCounter() {
  let count = 0
  return function () {
    count += 1
    return count
  }
}
```

## 类型提示

Python 3.5+ 支持类型提示，类似 TypeScript。

```python
def greet(name: str) -> str:
    return f"Hello, {name}!"

def add(a: int, b: int) -> int:
    return a + b

# 可选参数
from typing import Optional

def find_user(id: int) -> Optional[dict]:
    """返回用户或 None"""
    # ...
    return None

# 列表类型
def sum_numbers(numbers: list[int]) -> int:
    return sum(numbers)
```

```typescript
// TypeScript 对比
function greet(name: string): string {
  return `Hello, ${name}!`
}

function add(a: number, b: number): number {
  return a + b
}
```

> **注意**: Python 类型提示仅用于静态检查（如 mypy），运行时不会强制类型。

## 对前端开发者

### 常见误区

```python
# 1. 默认参数陷阱 - 可变对象作为默认值
# 错误做法
def add_item(item, items=[]):
    items.append(item)
    return items

print(add_item("a"))  # ['a']
print(add_item("b"))  # ['a', 'b'] - 意外! 共享同一个列表

# 正确做法
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items

# 2. 忘记 return
def add(a, b):
    a + b  # 忘记 return，返回 None

result = add(1, 2)
print(result)  # None

# 3. lambda 不能有多条语句
# 错误
# f = lambda x: print(x); return x * 2
```

## 小结

| 概念     | JavaScript      | Python     |
| -------- | --------------- | ---------- |
| 函数定义 | `function`/`=>` | `def`      |
| 匿名函数 | 箭头函数 `=>`   | `lambda`   |
| 剩余参数 | `...args`       | `*args`    |
| 展开参数 | `...array`      | `*list`    |
| 对象参数 | 解构 `{a, b}`   | `**kwargs` |
| 类型提示 | TypeScript      | Type Hints |
| 多返回值 | 数组/对象       | 元组       |

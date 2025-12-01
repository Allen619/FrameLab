---
title: Python 数据类 (dataclass)
description: 学习使用 @dataclass 装饰器简化数据类定义,理解自动生成的方法,对比 TypeScript interface
outline: deep
---

# Python 数据类 (dataclass)

`dataclass` 是 Python 3.7+ 引入的装饰器,用于简化数据类的定义,自动生成 `__init__`、`__repr__`、`__eq__` 等方法。

## 学习目标

- 掌握 @dataclass 装饰器的基本用法
- 理解自动生成的方法 (**init**, **repr**, **eq**, **hash**)
- 学习使用 field() 自定义字段
- 了解 dataclass 的继承与后处理
- 对比 dataclass 与 TypeScript interface/type

## 核心概念

### @dataclass 装饰器基本用法

传统类定义需要手动编写 `__init__`、`__repr__` 等方法:

```python
# 传统类定义 (繁琐)
class UserOld:
    def __init__(self, name: str, age: int, email: str = ""):
        self.name = name
        self.age = age
        self.email = email

    def __repr__(self):
        return f"User(name={self.name!r}, age={self.age!r}, email={self.email!r})"

    def __eq__(self, other):
        if not isinstance(other, UserOld):
            return NotImplemented
        return (self.name, self.age, self.email) == (other.name, other.age, other.email)
```

使用 `@dataclass` 装饰器简化:

```python
from dataclasses import dataclass

@dataclass
class User:
    name: str
    age: int
    email: str = ""

# 自动生成 __init__, __repr__, __eq__
user = User(name="Alice", age=30)
print(user)  # User(name='Alice', age=30, email='')

user2 = User(name="Alice", age=30)
print(user == user2)  # True (自动实现 __eq__)
```

### 自动生成的方法

`@dataclass` 自动生成以下方法:

#### 1. **init**()

```python
@dataclass
class Point:
    x: float
    y: float

# 等价于:
# def __init__(self, x: float, y: float):
#     self.x = x
#     self.y = y

p = Point(3.0, 4.0)
print(p.x, p.y)  # 3.0 4.0
```

#### 2. **repr**()

```python
@dataclass
class Book:
    title: str
    author: str

book = Book("Python Guide", "Alice")
print(book)  # Book(title='Python Guide', author='Alice')
```

#### 3. **eq**()

```python
@dataclass
class Color:
    r: int
    g: int
    b: int

c1 = Color(255, 0, 0)
c2 = Color(255, 0, 0)
c3 = Color(0, 255, 0)

print(c1 == c2)  # True (值相等)
print(c1 == c3)  # False
print(c1 is c2)  # False (不同对象)
```

#### 4. **hash**() (可选)

```python
from dataclasses import dataclass

# frozen=True: 不可变,可哈希
@dataclass(frozen=True)
class Coordinate:
    lat: float
    lon: float

coord = Coordinate(37.7749, -122.4194)

# 可用作字典键或集合元素
locations = {coord: "San Francisco"}
print(locations[coord])  # San Francisco
```

### field() 自定义字段

`field()` 函数用于自定义字段行为:

```python
from dataclasses import dataclass, field
from typing import List

@dataclass
class Config:
    host: str
    port: int = 8000
    # default_factory: 避免可变默认参数陷阱
    tags: List[str] = field(default_factory=list)
    # metadata: 附加元数据 (不影响类行为)
    debug: bool = field(default=False, metadata={"env": "DEBUG"})
    # init=False: 不在 __init__ 中初始化
    timestamp: float = field(init=False, default=0.0)

config1 = Config(host="localhost")
config2 = Config(host="example.com")

config1.tags.append("dev")
print(config1.tags)  # ['dev']
print(config2.tags)  # [] - 正确!每个实例独立的列表
```

**field() 参数**:

- `default`: 默认值 (不可变对象)
- `default_factory`: 默认值工厂函数 (可变对象,如 `list`, `dict`)
- `init`: 是否包含在 `__init__` 中 (默认 `True`)
- `repr`: 是否包含在 `__repr__` 中 (默认 `True`)
- `compare`: 是否用于比较 (默认 `True`)
- `hash`: 是否用于哈希 (默认 `None`)
- `metadata`: 附加元数据字典

### 继承与后处理

#### 继承

```python
@dataclass
class Animal:
    name: str
    age: int

@dataclass
class Dog(Animal):
    breed: str

dog = Dog(name="Buddy", age=3, breed="Golden Retriever")
print(dog)  # Dog(name='Buddy', age=3, breed='Golden Retriever')
```

#### 后处理 (**post_init**)

```python
from dataclasses import dataclass
import math

@dataclass
class Circle:
    radius: float
    area: float = field(init=False)  # 不在 __init__ 中初始化

    def __post_init__(self):
        """在 __init__ 后自动调用"""
        self.area = math.pi * self.radius ** 2

circle = Circle(radius=5)
print(circle.area)  # 78.53981633974483
```

## 💡 对前端开发者

### 与 TypeScript 对比

Python `dataclass` 类似 TypeScript 的 interface/type,但更强大:

```typescript
// TypeScript interface
interface User {
  name: string
  age: number
  email?: string
}

// 类型别名
type Point = {
  x: number
  y: number
}

// 使用
const user: User = { name: 'Alice', age: 30 }
console.log(user) // { name: 'Alice', age: 30 }
```

```python
# Python dataclass
from dataclasses import dataclass

@dataclass
class User:
    name: str
    age: int
    email: str = ""

@dataclass
class Point:
    x: float
    y: float

# 使用
user = User(name="Alice", age=30)
print(user)  # User(name='Alice', age=30, email='')
```

**关键差异**:

| TypeScript           | Python dataclass | 差异说明                         |
| -------------------- | ---------------- | -------------------------------- |
| `interface` / `type` | `@dataclass`     | Python 是类,有方法和实例         |
| 编译时类型检查       | 运行时类型提示   | Python 需 mypy 做静态检查        |
| 字面量对象           | 类实例           | Python 必须调用构造函数          |
| 无默认方法           | 自动生成方法     | Python 自带 `__repr__`, `__eq__` |
| 结构化类型           | 标称类型         | Python 类型基于类名              |

### 更完整的对比

```typescript
// TypeScript
interface Book {
  title: string
  author: string
  year?: number
}

const book: Book = {
  title: 'Python Guide',
  author: 'Alice',
}

// 比较需要手动实现
function isEqual(a: Book, b: Book): boolean {
  return a.title === b.title && a.author === b.author && a.year === b.year
}
```

```python
# Python dataclass
from dataclasses import dataclass

@dataclass
class Book:
    title: str
    author: str
    year: int = 0

book = Book(title="Python Guide", author="Alice")
print(book)  # Book(title='Python Guide', author='Alice', year=0)

# 自动实现比较
book2 = Book(title="Python Guide", author="Alice")
print(book == book2)  # True
```

## ⚠️ 常见误区

### 可变默认参数

❌ **错误示例**:

```python
from dataclasses import dataclass

@dataclass
class Config:
    tags: list = []  # ValueError: mutable default for field tags
```

✅ **正确示例**:

```python
from dataclasses import dataclass, field

@dataclass
class Config:
    tags: list = field(default_factory=list)
```

### 忘记类型注解

❌ **错误示例**:

```python
@dataclass
class User:
    name = "Unknown"  # 不会被识别为字段!
```

✅ **正确示例**:

```python
@dataclass
class User:
    name: str = "Unknown"  # 必须有类型注解
```

## 小结

### 本章要点

- `@dataclass` 自动生成 `__init__`, `__repr__`, `__eq__` 等方法
- 使用 `field(default_factory=list)` 避免可变默认参数陷阱
- `frozen=True` 创建不可变数据类 (可哈希)
- `__post_init__` 在初始化后执行额外逻辑
- 所有字段必须有类型注解

### 与 TS 的关键差异

| TypeScript           | Python            | 差异说明              |
| -------------------- | ----------------- | --------------------- |
| `interface` / `type` | `@dataclass`      | Python 是实际的类     |
| 字面量对象           | 构造函数调用      | Python 需显式创建实例 |
| 编译时检查           | 运行时提示 + mypy | Python 类型检查可选   |
| 无默认方法           | 自动生成方法      | Python 提供更多功能   |

### 推荐下一步阅读

- [类与对象](../basics/classes) - 理解 Python 类基础
- [类型系统](../tooling/typing) - 学习类型提示
- [常见陷阱](../guide/pitfalls) - 避免可变默认参数

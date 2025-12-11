---
title: dataclass 数据类
description: Python dataclass 装饰器详解,与 TypeScript interface/class 对比
---

# dataclass 数据类

## 学习目标

本章节你将学习:

- `@dataclass` 装饰器的使用方式
- 自动生成的方法(`__init__`, `__repr__`, `__eq__` 等)
- `field()` 函数的高级用法
- `@dataclass` 参数配置(frozen, order, slots 等)
- 与 TypeScript interface/type 的对比
- 数据验证与类型检查

## 为什么使用 dataclass?

```python
# 传统 class 写法 (繁琐)
class User:
    def __init__(self, name: str, age: int, email: str):
        self.name = name
        self.age = age
        self.email = email

    def __repr__(self):
        return f"User(name={self.name}, age={self.age}, email={self.email})"

    def __eq__(self, other):
        if not isinstance(other, User):
            return False
        return (self.name, self.age, self.email) == (other.name, other.age, other.email)

# dataclass 写法 (简洁)
from dataclasses import dataclass

@dataclass
class User:
    name: str
    age: int
    email: str

# 自动生成 __init__, __repr__, __eq__ 等方法!
```

> **对前端开发者**: dataclass 类似 TypeScript 的 `interface` + `class` 的组合,提供类型注解和自动方法生成。

## 基础用法

### 创建 dataclass

```python
from dataclasses import dataclass

@dataclass
class Product:
    name: str
    price: float
    stock: int
    category: str = "未分类"  # 默认值

# 使用
product = Product(name="MacBook Pro", price=12999, stock=5)
print(product)
# 输出: Product(name='MacBook Pro', price=12999, stock=5, category='未分类')

# 访问属性
print(product.name)   # MacBook Pro
print(product.price)  # 12999

# 修改属性
product.stock -= 1
print(product.stock)  # 4
```

```typescript
// TypeScript 对比
interface Product {
  name: string
  price: number
  stock: number
  category?: string
}

class ProductClass {
  name: string
  price: number
  stock: number
  category: string

  constructor(name: string, price: number, stock: number, category = '未分类') {
    this.name = name
    this.price = price
    this.stock = stock
    this.category = category
  }
}

// 使用
const product: Product = {
  name: 'MacBook Pro',
  price: 12999,
  stock: 5,
  category: '电子产品',
}
```

### 自动生成的方法

```python
from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int

p1 = Point(3, 4)
p2 = Point(3, 4)
p3 = Point(1, 2)

# __repr__ - 字符串表示
print(p1)  # Point(x=3, y=4)
print(repr(p1))  # Point(x=3, y=4)

# __eq__ - 相等性比较
print(p1 == p2)  # True (值相等)
print(p1 == p3)  # False
print(p1 is p2)  # False (不是同一对象)

# __init__ - 构造函数
p4 = Point(x=5, y=6)  # 可以用关键字参数
```

```javascript
// JavaScript 对比 (需要手动实现)
class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  toString() {
    return `Point(x=${this.x}, y=${this.y})`
  }

  equals(other) {
    return this.x === other.x && this.y === other.y
  }
}
```

## dataclass 参数配置

### 常用参数

```python
from dataclasses import dataclass

# 默认配置
@dataclass
class Config:
    pass

# 自定义配置
@dataclass(
    init=True,        # 生成 __init__ (默认 True)
    repr=True,        # 生成 __repr__ (默认 True)
    eq=True,          # 生成 __eq__ (默认 True)
    order=False,      # 生成 __lt__, __le__, __gt__, __ge__ (默认 False)
    unsafe_hash=False,  # 生成 __hash__ (默认 False)
    frozen=False,     # 对象不可变 (默认 False)
)
class User:
    name: str
    age: int
```

### frozen - 不可变数据类

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class ImmutablePoint:
    x: int
    y: int

p = ImmutablePoint(3, 4)
print(p.x)  # 3

# p.x = 5  # 错误! FrozenInstanceError
# dataclass 禁止修改

# frozen 对象可以作为字典键
points_dict = {
    ImmutablePoint(0, 0): "原点",
    ImmutablePoint(1, 1): "对角点"
}
print(points_dict[ImmutablePoint(0, 0)])  # 原点
```

```typescript
// TypeScript 对比 - readonly
interface ImmutablePoint {
  readonly x: number
  readonly y: number
}

// 或使用 Readonly 工具类型
type ImmutablePoint2 = Readonly<{
  x: number
  y: number
}>
```

> **关键差异**: Python 的 `frozen=True` 是运行时强制不可变,TypeScript 的 `readonly` 只是编译时检查。

### order - 对象排序

```python
from dataclasses import dataclass

@dataclass(order=True)
class Student:
    score: int
    name: str

students = [
    Student(85, "Alice"),
    Student(92, "Bob"),
    Student(78, "Charlie")
]

# 自动支持排序 (按字段顺序比较)
students.sort()
for s in students:
    print(s)
# 输出:
# Student(score=78, name='Charlie')
# Student(score=85, name='Alice')
# Student(score=92, name='Bob')

# 也可以手动比较
print(Student(85, "Alice") < Student(92, "Bob"))  # True
```

```javascript
// JavaScript 对比 - 手动排序
const students = [
  { score: 85, name: 'Alice' },
  { score: 92, name: 'Bob' },
  { score: 78, name: 'Charlie' },
]

students.sort((a, b) => a.score - b.score)
```

### slots - 内存优化

```python
from dataclasses import dataclass

# 使用 __slots__ 减少内存占用
@dataclass(slots=True)  # Python 3.10+
class OptimizedPoint:
    x: int
    y: int

# 普通 dataclass 使用 __dict__ 存储属性
# slots=True 使用固定槽位,更快速且节省内存

p = OptimizedPoint(3, 4)
print(p.x)  # 3

# 注意: slots=True 后不能动态添加属性
# p.z = 5  # 错误! AttributeError
```

## field() 函数高级用法

### 默认值与工厂函数

```python
from dataclasses import dataclass, field
from typing import List
from datetime import datetime

@dataclass
class Task:
    title: str
    completed: bool = False
    tags: List[str] = field(default_factory=list)  # 可变默认值必须用 factory
    created_at: datetime = field(default_factory=datetime.now)

# 使用
task1 = Task(title="学习 Python")
task2 = Task(title="写代码")

task1.tags.append("编程")
task2.tags.append("工作")

print(task1.tags)  # ['编程']
print(task2.tags)  # ['工作'] - 不会相互影响!
```

> **关键点**: 可变默认值(如列表、字典)必须使用 `field(default_factory=...)`,否则所有实例共享同一个对象!

```python
# 错误示例
@dataclass
class BadTask:
    tags: List[str] = []  # 错误! 所有实例共享同一个列表

# 正确示例
@dataclass
class GoodTask:
    tags: List[str] = field(default_factory=list)  # 每个实例独立的列表
```

```typescript
// TypeScript 对比 - 不需要担心这个问题
class Task {
  title: string
  completed: boolean = false
  tags: string[] = [] // 每个实例自动独立

  constructor(title: string) {
    this.title = title
  }
}
```

### field 参数详解

```python
from dataclasses import dataclass, field

@dataclass
class User:
    # 普通字段
    name: str

    # 默认值
    age: int = 18

    # 可变默认值 (必须用 factory)
    tags: list = field(default_factory=list)

    # 排除在 __init__ 之外
    id: int = field(init=False)

    # 排除在 __repr__ 之外 (不打印)
    password: str = field(repr=False)

    # 排除在比较之外
    login_count: int = field(default=0, compare=False)

    # 元数据 (不影响功能,用于文档或工具)
    email: str = field(metadata={"description": "用户邮箱", "required": True})

    def __post_init__(self):
        # 初始化后自动调用
        self.id = hash(self.name)  # 生成 ID

# 使用
user = User(name="Alice", password="secret123", email="alice@example.com")
print(user)
# 输出: User(name='Alice', age=18, tags=[], id=1234567, email='alice@example.com')
# 注意 password 不显示!
```

### field 参数表

| 参数              | 类型     | 默认值    | 说明                       |
| ----------------- | -------- | --------- | -------------------------- |
| `default`         | Any      | `MISSING` | 字段默认值                 |
| `default_factory` | Callable | `MISSING` | 默认值工厂函数             |
| `init`            | bool     | `True`    | 是否包含在 `__init__` 中   |
| `repr`            | bool     | `True`    | 是否包含在 `__repr__` 中   |
| `compare`         | bool     | `True`    | 是否参与比较 (`__eq__` 等) |
| `hash`            | bool     | `None`    | 是否参与哈希计算           |
| `metadata`        | dict     | `None`    | 元数据字典 (不影响功能)    |

## **post_init** 方法

```python
from dataclasses import dataclass, field
from typing import Optional

@dataclass
class Rectangle:
    width: float
    height: float
    area: float = field(init=False)  # 不在 __init__ 中

    def __post_init__(self):
        """初始化完成后自动调用"""
        self.area = self.width * self.height

rect = Rectangle(width=10, height=5)
print(rect.area)  # 50.0 - 自动计算

@dataclass
class User:
    name: str
    email: str
    username: Optional[str] = None

    def __post_init__(self):
        # 自动生成 username (如果未提供)
        if self.username is None:
            self.username = self.email.split('@')[0]

user = User(name="Alice", email="alice@example.com")
print(user.username)  # alice
```

```typescript
// TypeScript 对比 - 在 constructor 中处理
class Rectangle {
  width: number
  height: number
  area: number

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
    this.area = width * height // 构造函数中计算
  }
}
```

## 继承与组合

### dataclass 继承

```python
from dataclasses import dataclass

@dataclass
class Animal:
    name: str
    age: int

@dataclass
class Dog(Animal):
    breed: str

dog = Dog(name="Buddy", age=3, breed="Golden Retriever")
print(dog)
# 输出: Dog(name='Buddy', age=3, breed='Golden Retriever')
```

### 字段顺序问题

```python
from dataclasses import dataclass

@dataclass
class Base:
    x: int = 1  # 带默认值

# 错误! 无默认值字段不能在有默认值字段后
# @dataclass
# class Derived(Base):
#     y: int  # 错误: non-default argument follows default argument

# 正确做法
@dataclass
class Derived(Base):
    y: int = 2  # 也提供默认值
```

> **规则**: 无默认值的字段必须在有默认值的字段之前。继承时要注意父类字段顺序。

## 实用模式

### 配置类

```python
from dataclasses import dataclass, field
from typing import List

@dataclass(frozen=True)  # 配置不应被修改
class DatabaseConfig:
    host: str = "localhost"
    port: int = 5432
    database: str = "myapp"
    username: str = "admin"
    password: str = field(repr=False)  # 密码不打印
    pool_size: int = 10
    echo: bool = False

# 使用
config = DatabaseConfig(password="secret123")
print(config)
# 输出: DatabaseConfig(host='localhost', port=5432, ...)
# 注意 password 不显示

# config.host = "newhost"  # 错误! frozen=True
```

```typescript
// TypeScript 对比
interface DatabaseConfig {
  readonly host: string
  readonly port: number
  readonly database: string
  readonly username: string
  readonly password: string
  readonly poolSize: number
  readonly echo: boolean
}

const config: Readonly<DatabaseConfig> = {
  host: 'localhost',
  port: 5432,
  database: 'myapp',
  username: 'admin',
  password: 'secret123',
  poolSize: 10,
  echo: false,
}
```

### API 响应模型

```python
from dataclasses import dataclass
from typing import List, Optional
from datetime import datetime

@dataclass
class User:
    id: int
    username: str
    email: str
    created_at: datetime

@dataclass
class Post:
    id: int
    title: str
    content: str
    author: User
    tags: List[str]
    published: bool = False
    views: int = 0

@dataclass
class ApiResponse:
    success: bool
    data: Optional[Post] = None
    error: Optional[str] = None

# 使用
author = User(
    id=1,
    username="alice",
    email="alice@example.com",
    created_at=datetime.now()
)

post = Post(
    id=101,
    title="Python dataclass 教程",
    content="本文介绍 dataclass...",
    author=author,
    tags=["python", "教程"]
)

response = ApiResponse(success=True, data=post)
print(response.data.title)  # Python dataclass 教程
```

```typescript
// TypeScript 对比 - 非常相似!
interface User {
  id: number
  username: string
  email: string
  createdAt: Date
}

interface Post {
  id: number
  title: string
  content: string
  author: User
  tags: string[]
  published?: boolean
  views?: number
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
```

### JSON 序列化

```python
from dataclasses import dataclass, asdict, astuple
import json

@dataclass
class Product:
    id: int
    name: str
    price: float

product = Product(id=1, name="MacBook", price=12999)

# 转换为字典
product_dict = asdict(product)
print(product_dict)
# 输出: {'id': 1, 'name': 'MacBook', 'price': 12999}

# 转换为元组
product_tuple = astuple(product)
print(product_tuple)
# 输出: (1, 'MacBook', 12999)

# JSON 序列化
json_str = json.dumps(asdict(product), indent=2)
print(json_str)
# 输出:
# {
#   "id": 1,
#   "name": "MacBook",
#   "price": 12999
# }

# JSON 反序列化
data = json.loads(json_str)
product2 = Product(**data)  # 字典解包
print(product2)  # Product(id=1, name='MacBook', price=12999)
```

```javascript
// JavaScript 对比 - 更简单
const product = { id: 1, name: 'MacBook', price: 12999 }

// JSON 序列化
const jsonStr = JSON.stringify(product, null, 2)

// JSON 反序列化
const product2 = JSON.parse(jsonStr)
```

## 数据验证

dataclass 本身不做运行时验证,可以配合第三方库:

### 使用 pydantic (推荐)

```python
from pydantic.dataclasses import dataclass
from pydantic import validator

@dataclass
class User:
    name: str
    age: int
    email: str

    @validator('age')
    def validate_age(cls, v):
        if v < 0 or v > 150:
            raise ValueError('年龄必须在 0-150 之间')
        return v

    @validator('email')
    def validate_email(cls, v):
        if '@' not in v:
            raise ValueError('邮箱格式错误')
        return v

# 正常使用
user = User(name="Alice", age=25, email="alice@example.com")

# 验证失败
# user = User(name="Bob", age=-5, email="invalid")
# 错误: ValueError: 年龄必须在 0-150 之间
```

### 手动验证

```python
from dataclasses import dataclass

@dataclass
class User:
    name: str
    age: int
    email: str

    def __post_init__(self):
        # 手动验证
        if not self.name:
            raise ValueError("name 不能为空")
        if self.age < 0 or self.age > 150:
            raise ValueError("age 必须在 0-150 之间")
        if '@' not in self.email:
            raise ValueError("email 格式错误")

# user = User(name="", age=25, email="alice@example.com")
# 错误: ValueError: name 不能为空
```

```typescript
// TypeScript 对比 - 使用 class-validator
import { IsEmail, Min, Max, IsNotEmpty } from 'class-validator'

class User {
  @IsNotEmpty()
  name: string

  @Min(0)
  @Max(150)
  age: number

  @IsEmail()
  email: string
}
```

## 对前端开发者

### dataclass vs TypeScript

| 特性          | Python dataclass             | TypeScript interface/class |
| ------------- | ---------------------------- | -------------------------- |
| 类型注解      | ✅ 运行时保留                | ✅ 编译时,运行时擦除       |
| 自动 **init** | ✅ 自动生成                  | ❌ 需手写 constructor      |
| 自动 **repr** | ✅ 自动生成                  | ❌ 需手写 toString         |
| 自动 **eq**   | ✅ 自动生成                  | ❌ 需手写 equals           |
| 不可变        | ✅ frozen=True               | ✅ readonly (编译时)       |
| 默认值        | ✅ 直接赋值                  | ✅ 直接赋值                |
| 可变默认值    | ⚠️ 需 field(default_factory) | ✅ 自动独立                |
| 运行时验证    | ⚠️ 需第三方库                | ⚠️ 需第三方库              |
| JSON 序列化   | ⚠️ 需 asdict()               | ✅ 自动                    |

### 运行时 vs 编译时

```python
# Python: 类型注解在运行时保留
from dataclasses import dataclass

@dataclass
class User:
    name: str
    age: int

user = User(name="Alice", age="25")  # 不会报错! (只是注解,不验证)
print(user.age)  # "25" (字符串)

# 要运行时验证类型,需要使用 pydantic 等库
```

```typescript
// TypeScript: 类型在编译时检查,运行时擦除
interface User {
  name: string
  age: number
}

const user: User = {
  name: 'Alice',
  age: '25', // 编译错误!
}

// 编译后的 JavaScript 没有类型信息
```

### 常见陷阱

```python
# 1. 可变默认值陷阱
@dataclass
class User:
    tags: list = []  # 错误! 所有实例共享

# 正确:
@dataclass
class User:
    tags: list = field(default_factory=list)

# 2. 字段顺序
@dataclass
class User:
    name: str = "Guest"
    age: int  # 错误! 无默认值必须在前

# 正确:
@dataclass
class User:
    age: int
    name: str = "Guest"

# 3. 类型注解不验证
@dataclass
class User:
    age: int

user = User(age="not an int")  # 不会报错!
# 如需验证,使用 pydantic.dataclasses

# 4. frozen 影响子类
@dataclass(frozen=True)
class Base:
    x: int

@dataclass
class Derived(Base):
    y: int  # Derived 也会继承 frozen=True

derived = Derived(x=1, y=2)
# derived.y = 3  # 错误! 不可修改
```

## 小结

- **dataclass** 是 Python 3.7+ 提供的简化类定义的装饰器
- **自动生成** `__init__`, `__repr__`, `__eq__` 等方法
- **类型注解** 提供文档和 IDE 支持,但不做运行时验证
- **field()** 函数提供高级配置(默认值、工厂函数、元数据等)
- **frozen=True** 创建不可变对象(类似 TypeScript readonly)
- **order=True** 自动支持对象排序
- **与 TypeScript 的相似性** 非常高,但有运行时/编译时的差异

### 推荐实践

1. ✅ 使用 dataclass 定义数据模型(配置、API 响应等)
2. ✅ 可变默认值必须用 `field(default_factory=...)`
3. ✅ 配置类使用 `frozen=True` 防止意外修改
4. ✅ 敏感字段(密码)使用 `field(repr=False)` 避免打印
5. ✅ 需要运行时验证时,使用 `pydantic.dataclasses`
6. ✅ 使用 `asdict()` 转换为字典,方便 JSON 序列化
7. ✅ 利用 `__post_init__` 做后置初始化逻辑

### 与其他工具对比

| 工具           | 用途           | 特点                              |
| -------------- | -------------- | --------------------------------- |
| **dataclass**  | 简化类定义     | 标准库,轻量级,无验证              |
| **pydantic**   | 数据验证       | 运行时验证,JSON 解析,FastAPI 推荐 |
| **attrs**      | 增强 dataclass | 更强大,但需安装第三方库           |
| **NamedTuple** | 不可变数据     | 元组子类,性能好但功能少           |

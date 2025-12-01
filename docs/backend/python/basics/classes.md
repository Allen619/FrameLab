---
title: 类与对象
description: Python 类定义、继承、魔术方法与 JavaScript 对比
---

# 类与对象

## 学习目标

本章节你将学习:

- 类定义与实例化
- 构造函数 `__init__`
- 实例属性与类属性
- 继承与多态
- 魔术方法 (dunder methods)

## 类定义

### 基本语法

```python
class User:
    """用户类"""

    def __init__(self, name, age):
        """构造函数 - 相当于 JS constructor"""
        self.name = name  # 实例属性
        self.age = age

    def greet(self):
        """实例方法 - 必须有 self 参数"""
        return f"Hello, I'm {self.name}"

# 创建实例（无需 new 关键字）
user = User("Alice", 25)
print(user.name)    # Alice
print(user.greet()) # Hello, I'm Alice
```

```javascript
// JavaScript 对比
class User {
  constructor(name, age) {
    this.name = name
    this.age = age
  }

  greet() {
    return `Hello, I'm ${this.name}`
  }
}

const user = new User('Alice', 25)
```

> **关键差异**:
>
> - Python 用 `__init__` 代替 `constructor`
> - Python 用 `self` 代替 `this`
> - Python 方法必须显式声明 `self` 参数
> - Python 实例化无需 `new` 关键字

### self 是什么？

```python
class User:
    def __init__(self, name):
        # self 指向当前实例，必须作为第一个参数
        self.name = name

    def greet(self):
        # 通过 self 访问实例属性和方法
        return f"Hello, {self.name}"

    def update_name(self, new_name):
        self.name = new_name
        return self  # 可以返回 self 实现链式调用

# self 在调用时不需要传递，Python 自动处理
user = User("Alice")
user.greet()  # Python 自动将 user 作为 self 传入
```

## 类属性 vs 实例属性

```python
class User:
    # 类属性 - 所有实例共享
    species = "Human"
    count = 0

    def __init__(self, name):
        # 实例属性 - 每个实例独立
        self.name = name
        User.count += 1  # 通过类名访问类属性

# 类属性通过类或实例访问
print(User.species)     # Human
user = User("Alice")
print(user.species)     # Human

# 但修改时要注意
user.species = "Alien"  # 创建了实例属性，遮蔽了类属性
print(user.species)     # Alien
print(User.species)     # Human (类属性未变)
```

```javascript
// JavaScript 对比 - 使用 static
class User {
  static species = 'Human'
  static count = 0

  constructor(name) {
    this.name = name
    User.count++
  }
}
```

## 访问控制

Python 没有真正的私有属性，使用命名约定：

```python
class BankAccount:
    def __init__(self, balance):
        self.balance = balance       # 公开属性
        self._internal = "internal"  # 约定"私有"（单下划线）
        self.__secret = "secret"     # 名称改写（双下划线）

    def _helper(self):
        """约定私有方法"""
        pass

    def __private_method(self):
        """名称改写方法"""
        pass

account = BankAccount(100)
print(account.balance)     # 100 - 公开
print(account._internal)   # internal - 可访问，但约定不应访问
# print(account.__secret)  # AttributeError
print(account._BankAccount__secret)  # secret - 名称改写后仍可访问
```

| 命名       | 含义                           |
| ---------- | ------------------------------ |
| `name`     | 公开属性                       |
| `_name`    | 约定私有（可访问但不应访问）   |
| `__name`   | 名称改写为 `_ClassName__name`  |
| `__name__` | 魔术方法/属性，Python 内部使用 |

> **对前端开发者**: Python 的 "私有" 只是约定，不像 JS 的 `#` 真正私有。

## 继承

### 基本继承

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        raise NotImplementedError("Subclass must implement")

class Dog(Animal):
    def speak(self):
        return f"{self.name} says Woof!"

class Cat(Animal):
    def speak(self):
        return f"{self.name} says Meow!"

dog = Dog("Buddy")
print(dog.speak())  # Buddy says Woof!
```

```javascript
// JavaScript 对比
class Animal {
  constructor(name) {
    this.name = name
  }

  speak() {
    throw new Error('Subclass must implement')
  }
}

class Dog extends Animal {
  speak() {
    return `${this.name} says Woof!`
  }
}
```

### super() 调用父类

```python
class Animal:
    def __init__(self, name):
        self.name = name

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)  # 调用父类构造函数
        self.breed = breed

    def info(self):
        return f"{self.name} is a {self.breed}"

dog = Dog("Buddy", "Golden Retriever")
print(dog.info())  # Buddy is a Golden Retriever
```

```javascript
// JavaScript 对比
class Dog extends Animal {
  constructor(name, breed) {
    super(name)
    this.breed = breed
  }
}
```

### 多重继承

Python 支持多重继承，JavaScript 不支持：

```python
class Flyable:
    def fly(self):
        return "Flying!"

class Swimmable:
    def swim(self):
        return "Swimming!"

class Duck(Animal, Flyable, Swimmable):
    def speak(self):
        return f"{self.name} says Quack!"

duck = Duck("Donald")
print(duck.speak())  # Donald says Quack!
print(duck.fly())    # Flying!
print(duck.swim())   # Swimming!
```

> **MRO (方法解析顺序)**: 多重继承时，Python 使用 C3 线性化算法决定方法查找顺序。

```python
print(Duck.__mro__)
# (<class 'Duck'>, <class 'Animal'>, <class 'Flyable'>, <class 'Swimmable'>, <class 'object'>)
```

## 魔术方法

魔术方法（dunder methods）是 Python 的特殊方法，以双下划线开头和结尾。

### 常用魔术方法

```python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        """字符串表示 - print() 时调用"""
        return f"Vector({self.x}, {self.y})"

    def __repr__(self):
        """开发者表示 - 调试时显示"""
        return f"Vector(x={self.x}, y={self.y})"

    def __eq__(self, other):
        """相等比较 - == 运算符"""
        return self.x == other.x and self.y == other.y

    def __add__(self, other):
        """加法 - + 运算符"""
        return Vector(self.x + other.x, self.y + other.y)

    def __len__(self):
        """长度 - len() 函数"""
        return 2

    def __getitem__(self, index):
        """索引访问 - [] 运算符"""
        if index == 0:
            return self.x
        elif index == 1:
            return self.y
        raise IndexError("Index out of range")

v1 = Vector(1, 2)
v2 = Vector(3, 4)

print(v1)           # Vector(1, 2) - 调用 __str__
print(v1 == v2)     # False - 调用 __eq__
print(v1 + v2)      # Vector(4, 6) - 调用 __add__
print(len(v1))      # 2 - 调用 __len__
print(v1[0])        # 1 - 调用 __getitem__
```

### 魔术方法速查

| 魔术方法       | 触发场景              | JavaScript 对应     |
| -------------- | --------------------- | ------------------- |
| `__init__`     | 实例化                | `constructor`       |
| `__str__`      | `str(obj)`, `print()` | `toString()`        |
| `__repr__`     | 调试输出              | -                   |
| `__eq__`       | `==`                  | -                   |
| `__lt__`       | `<`                   | -                   |
| `__add__`      | `+`                   | -                   |
| `__len__`      | `len()`               | `length` 属性       |
| `__getitem__`  | `obj[key]`            | `[]`                |
| `__setitem__`  | `obj[key] = val`      | `[]`                |
| `__contains__` | `in`                  | `includes()`        |
| `__iter__`     | `for...in`            | `[Symbol.iterator]` |
| `__call__`     | `obj()`               | -                   |

### 可调用对象

```python
class Adder:
    def __init__(self, n):
        self.n = n

    def __call__(self, x):
        """使实例可像函数一样调用"""
        return self.n + x

add_5 = Adder(5)
print(add_5(10))  # 15 - 调用 __call__
print(add_5(20))  # 25
```

## 属性装饰器

### @property

```python
class Circle:
    def __init__(self, radius):
        self._radius = radius

    @property
    def radius(self):
        """getter - 读取属性"""
        return self._radius

    @radius.setter
    def radius(self, value):
        """setter - 设置属性"""
        if value < 0:
            raise ValueError("Radius cannot be negative")
        self._radius = value

    @property
    def area(self):
        """只读计算属性"""
        return 3.14159 * self._radius ** 2

circle = Circle(5)
print(circle.radius)  # 5 - 调用 getter
circle.radius = 10    # 调用 setter
print(circle.area)    # 314.159 - 计算属性
# circle.area = 100   # AttributeError - 只读
```

```javascript
// JavaScript 对比
class Circle {
  constructor(radius) {
    this._radius = radius
  }

  get radius() {
    return this._radius
  }

  set radius(value) {
    if (value < 0) throw new Error('Radius cannot be negative')
    this._radius = value
  }

  get area() {
    return 3.14159 * this._radius ** 2
  }
}
```

## 数据类 (dataclass)

Python 3.7+ 提供 dataclass 装饰器，简化类定义：

```python
from dataclasses import dataclass

@dataclass
class User:
    name: str
    age: int
    city: str = "Unknown"

# 自动生成 __init__, __repr__, __eq__ 等
user1 = User("Alice", 25)
user2 = User("Alice", 25)

print(user1)            # User(name='Alice', age=25, city='Unknown')
print(user1 == user2)   # True - 自动生成 __eq__
```

```typescript
// TypeScript 对比 - 需要手动实现
interface User {
  name: string
  age: number
  city?: string
}
```

## 对前端开发者

### 常见误区

```python
# 1. 忘记 self 参数
class User:
    def greet():  # 错误! 缺少 self
        return "Hello"

# 正确
class User:
    def greet(self):
        return "Hello"

# 2. 混淆类属性和实例属性
class User:
    items = []  # 类属性 - 所有实例共享!

    def add_item(self, item):
        self.items.append(item)

u1 = User()
u2 = User()
u1.add_item("a")
print(u2.items)  # ['a'] - 意外! 共享了同一个列表

# 正确做法 - 在 __init__ 中初始化
class User:
    def __init__(self):
        self.items = []  # 实例属性

# 3. 忘记调用 super().__init__()
class Dog(Animal):
    def __init__(self, name, breed):
        # 忘记 super().__init__(name)
        self.breed = breed

dog = Dog("Buddy", "Golden")
print(dog.name)  # AttributeError!
```

## 小结

| 概念          | JavaScript    | Python                |
| ------------- | ------------- | --------------------- |
| 类定义        | `class`       | `class`               |
| 构造函数      | `constructor` | `__init__`            |
| 实例引用      | `this`        | `self`                |
| 实例化        | `new Class()` | `Class()`             |
| 继承          | `extends`     | `class Child(Parent)` |
| 调用父类      | `super()`     | `super()`             |
| 私有属性      | `#name`       | `_name` (约定)        |
| 静态属性      | `static`      | 类属性                |
| getter/setter | `get`/`set`   | `@property`           |
| 字符串表示    | `toString()`  | `__str__`             |

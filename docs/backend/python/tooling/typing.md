---
title: Python 类型系统
description: Python Type Hints 完整指南,与 TypeScript 深度对比
---

# Python 类型系统 (Type Hints)

Python 3.5+ 支持类型提示 (Type Hints),提供静态类型检查,类似 TypeScript。虽然是可选的,但可以显著提高代码可维护性和 IDE 支持。

[🔗 typing 官方文档](https://docs.python.org/3/library/typing.html){target="_blank" rel="noopener"}

## 为什么使用类型提示?

### Python vs TypeScript 哲学

```python
# Python: 动态类型 + 可选类型提示
def add(a: int, b: int) -> int:  # 类型提示是可选的
    return a + b

add(1, 2)       # ✅ 正确
add("1", "2")   # ⚠️ mypy 会警告,但运行时不报错
```

```typescript
// TypeScript: 静态类型(编译时强制)
function add(a: number, b: number): number {
  return a + b
}

add(1, 2) // ✅ 正确
add('1', '2') // ❌ 编译错误,无法运行
```

**类型提示的好处**:

- ✅ **IDE 智能提示**: 更好的自动补全和错误检测
- ✅ **代码文档**: 类型即文档,无需额外注释
- ✅ **重构安全**: 修改代码时更容易发现问题
- ✅ **团队协作**: 明确接口契约,减少沟通成本
- ✅ **提前发现错误**: mypy 可在运行前发现类型错误

## 基本类型

### 内置类型

```python
# 基础类型
age: int = 25
price: float = 19.99
name: str = "Alice"
is_active: bool = True
data: bytes = b"hello"

# 函数类型注解
def greet(name: str) -> str:
    return f"Hello, {name}!"

def calculate(x: int, y: int) -> float:
    return x / y

# 无返回值
def log(message: str) -> None:
    print(message)
```

```typescript
// TypeScript 对比
const age: number = 25
const name: string = 'Alice'
const isActive: boolean = true

function greet(name: string): string {
  return `Hello, ${name}!`
}

function log(message: string): void {
  console.log(message)
}
```

### 集合类型

```python
# Python 3.9+ 推荐语法(内置泛型)
numbers: list[int] = [1, 2, 3]
names: tuple[str, str] = ("Alice", "Bob")
scores: dict[str, int] = {"Alice": 95, "Bob": 87}
unique_ids: set[int] = {1, 2, 3}

# Python 3.8 及以下(需要 from typing import List, Dict)
from typing import List, Dict, Tuple, Set

numbers: List[int] = [1, 2, 3]
scores: Dict[str, int] = {"Alice": 95}
names: Tuple[str, str] = ("Alice", "Bob")
unique_ids: Set[int] = {1, 2, 3}
```

```typescript
// TypeScript 对比
const numbers: number[] = [1, 2, 3]
const scores: { [key: string]: number } = { Alice: 95 }
const names: [string, string] = ['Alice', 'Bob'] // Tuple
const uniqueIds: Set<number> = new Set([1, 2, 3])
```

## typing 模块常用类型

### Optional (可选类型)

```python
from typing import Optional

# Optional[T] = T | None
def find_user(user_id: int) -> Optional[dict]:
    if user_id == 1:
        return {"name": "Alice"}
    return None

# Python 3.10+ 推荐语法
def find_user(user_id: int) -> dict | None:
    return None
```

```typescript
// TypeScript 对比
function findUser(userId: number): { name: string } | null {
  if (userId === 1) return { name: 'Alice' }
  return null
}
```

### Union (联合类型)

```python
from typing import Union

# Union[A, B] = A | B
def process(value: Union[int, str]) -> str:
    return str(value)

# Python 3.10+ 推荐语法
def process(value: int | str) -> str:
    return str(value)

# 多个类型
def handle(data: int | str | list | None) -> str:
    if data is None:
        return "empty"
    return str(data)
```

```typescript
// TypeScript 对比
function process(value: number | string): string {
  return String(value)
}
```

### Any (任意类型)

```python
from typing import Any

# Any 表示任意类型(类似 TypeScript any)
def process(value: Any) -> Any:
    return value

# 不推荐过度使用 Any,会失去类型检查的好处
```

```typescript
// TypeScript 对比
function process(value: any): any {
  return value
}
```

### Literal (字面量类型)

```python
from typing import Literal

# 限制为特定字面量值
def set_mode(mode: Literal["dev", "prod"]) -> None:
    print(f"Mode: {mode}")

set_mode("dev")   # ✅
set_mode("test")  # ❌ mypy 报错

# 多个字面量
Status = Literal["pending", "success", "error"]

def update_status(status: Status) -> None:
    pass
```

```typescript
// TypeScript 对比
type Mode = 'dev' | 'prod'

function setMode(mode: Mode): void {
  console.log(`Mode: ${mode}`)
}
```

### Callable (可调用类型)

```python
from typing import Callable

# Callable[[参数类型...], 返回类型]
def apply(func: Callable[[int, int], int], x: int, y: int) -> int:
    return func(x, y)

def add(a: int, b: int) -> int:
    return a + b

result = apply(add, 1, 2)  # 3

# 无参数函数
def run(callback: Callable[[], None]) -> None:
    callback()
```

```typescript
// TypeScript 对比
type BinaryOp = (a: number, b: number) => number

function apply(func: BinaryOp, x: number, y: number): number {
  return func(x, y)
}
```

### TypeAlias (类型别名)

```python
from typing import TypeAlias

# 类型别名(Python 3.10+)
UserId: TypeAlias = int
UserData: TypeAlias = dict[str, str | int]

def get_user(user_id: UserId) -> UserData:
    return {"name": "Alice", "age": 25}

# 复杂类型别名
Json: TypeAlias = dict[str, "Json"] | list["Json"] | str | int | float | bool | None
```

```typescript
// TypeScript 对比
type UserId = number
type UserData = { name: string; age: number }

function getUser(userId: UserId): UserData {
  return { name: 'Alice', age: 25 }
}
```

## 高级类型

### Generic (泛型)

```python
from typing import TypeVar, Generic

# 定义类型变量
T = TypeVar("T")

# 泛型函数
def first(items: list[T]) -> T:
    return items[0]

result = first([1, 2, 3])     # 推断为 int
name = first(["a", "b"])      # 推断为 str

# 泛型类
class Box(Generic[T]):
    def __init__(self, value: T) -> None:
        self.value = value

    def get(self) -> T:
        return self.value

int_box: Box[int] = Box(42)
str_box: Box[str] = Box("hello")
```

```typescript
// TypeScript 对比
function first<T>(items: T[]): T {
  return items[0]
}

class Box<T> {
  constructor(private value: T) {}

  get(): T {
    return this.value
  }
}

const intBox = new Box<number>(42)
```

### Protocol (结构化类型)

```python
from typing import Protocol

# Protocol 类似 TypeScript interface(鸭子类型)
class Drawable(Protocol):
    def draw(self) -> None: ...

class Circle:
    def draw(self) -> None:
        print("Drawing circle")

class Square:
    def draw(self) -> None:
        print("Drawing square")

def render(shape: Drawable) -> None:
    shape.draw()

render(Circle())  # ✅ 有 draw 方法
render(Square())  # ✅ 有 draw 方法
```

```typescript
// TypeScript 对比
interface Drawable {
  draw(): void
}

class Circle implements Drawable {
  draw() {
    console.log('Drawing circle')
  }
}

function render(shape: Drawable) {
  shape.draw()
}
```

### TypedDict (类型化字典)

```python
from typing import TypedDict

# 定义字典结构(类似 TypeScript interface)
class User(TypedDict):
    name: str
    age: int
    email: str

def create_user(data: User) -> None:
    print(data["name"])

user: User = {
    "name": "Alice",
    "age": 25,
    "email": "alice@example.com"
}
create_user(user)

# total=False: 所有字段都变成可选
class UserAllOptional(TypedDict, total=False):
    name: str   # 可选
    age: int    # 可选
    bio: str    # 可选

# Python 3.11+: 用 NotRequired 标记单个可选字段
from typing import NotRequired

class UserWithOptional(TypedDict):
    name: str                    # 必填
    age: int                     # 必填
    bio: NotRequired[str]        # 可选
```

```typescript
// TypeScript 对比
interface User {
  name: string       // 必填
  age: number        // 必填
  email: string      // 必填
  bio?: string       // 可选 (用 ? 标记)
}

function createUser(data: User): void {
  console.log(data.name)
}
```

### NewType (新类型)

```python
from typing import NewType

# 创建不同的类型(防止混淆)
UserId = NewType("UserId", int)
ProductId = NewType("ProductId", int)

def get_user(user_id: UserId) -> str:
    return f"User {user_id}"

def get_product(product_id: ProductId) -> str:
    return f"Product {product_id}"

user_id = UserId(123)
product_id = ProductId(456)

get_user(user_id)        # ✅
get_user(product_id)     # ❌ mypy 报错(类型不匹配)
```

## 类与继承的类型注解

### 类属性与方法

```python
class User:
    # 类属性
    count: int = 0

    def __init__(self, name: str, age: int) -> None:
        self.name: str = name
        self.age: int = age
        User.count += 1

    def greet(self) -> str:
        return f"Hi, I'm {self.name}"

    @classmethod
    def from_dict(cls, data: dict[str, str | int]) -> "User":
        return cls(str(data["name"]), int(data["age"]))

    @staticmethod
    def is_adult(age: int) -> bool:
        return age >= 18
```

### 继承与重写

```python
from typing import override  # Python 3.12+

class Animal:
    def speak(self) -> str:
        return "Some sound"

class Dog(Animal):
    @override  # 标记重写方法
    def speak(self) -> str:
        return "Woof!"
```

## 类型检查工具

### VS Code + Pylance（推荐）

VS Code 自带 **Pylance** 扩展，开箱即用，无需安装额外包：

```json
// settings.json
{
  "python.analysis.typeCheckingMode": "basic"
}
```

三个级别：
- `"off"` - 关闭类型检查
- `"basic"` - 基础检查（推荐）
- `"strict"` - 严格模式

配置后，编辑器会实时显示类型错误（红色波浪线），体验和 TypeScript 一致。

### mypy（CI/CD 使用）

如果需要在 CI/CD 中自动检查类型，可以使用 mypy：

```bash
# 安装
uv add --dev mypy

# 运行检查
mypy .
mypy src/main.py
```

**pyproject.toml 配置**:

```toml
[tool.mypy]
strict = true
python_version = "3.10"
```

> **总结**: 日常开发用 Pylance 即可，mypy 主要用于 CI/CD 自动化检查。

## 类型提示最佳实践

### 1. 始终注解公共 API

```python
# ✅ 好的做法
def calculate_discount(price: float, discount: float) -> float:
    return price * (1 - discount)

# ❌ 避免
def calculate_discount(price, discount):
    return price * (1 - discount)
```

### 2. 使用 TypeAlias 简化复杂类型

```python
# ✅ 好的做法
from typing import TypeAlias

Json: TypeAlias = dict[str, "Json"] | list["Json"] | str | int | float | bool | None

def parse_json(data: str) -> Json:
    ...

# ❌ 避免重复长类型
def parse_json(data: str) -> dict[str, dict[str, str | int | float | bool | None]]:
    ...
```

### 3. 优先使用内置泛型 (Python 3.9+)

```python
# ✅ Python 3.9+ 推荐
def process(items: list[str]) -> dict[str, int]:
    return {item: len(item) for item in items}

# ❌ 旧语法(仅 Python 3.8 及以下需要)
from typing import List, Dict

def process(items: List[str]) -> Dict[str, int]:
    return {item: len(item) for item in items}
```

### 4. 使用 Protocol 而非 ABC

```python
# ✅ Protocol(更灵活,鸭子类型)
from typing import Protocol

class Sized(Protocol):
    def __len__(self) -> int: ...

# ❌ ABC(需要显式继承)
from abc import ABC, abstractmethod

class Sized(ABC):
    @abstractmethod
    def __len__(self) -> int: ...
```

### 5. 避免过度使用 Any

```python
# ❌ 过度使用 Any
def process(data: Any) -> Any:
    return data

# ✅ 使用具体类型或泛型
from typing import TypeVar

T = TypeVar("T")

def process(data: T) -> T:
    return data
```

## 常见类型错误

### 错误1: 忘记导入 typing

```python
# ❌ 错误
def get_users() -> Optional[list[dict]]:
    return None

# ✅ 正确
from typing import Optional

def get_users() -> Optional[list[dict]]:
    return None
```

### 错误2: 混用旧/新语法

```python
# ❌ 错误(Python 3.9+ 不需要 List)
from typing import List

def process(items: list[str]) -> List[int]:  # 不一致
    return [len(x) for x in items]

# ✅ 正确(统一使用内置泛型)
def process(items: list[str]) -> list[int]:
    return [len(x) for x in items]
```

### 错误3: 循环引用

```python
# ❌ 错误(循环引用)
class Node:
    def __init__(self, value: int, parent: Node) -> None:
        self.value = value
        self.parent = parent

# ✅ 正确(使用字符串前向引用)
class Node:
    def __init__(self, value: int, parent: "Node | None") -> None:
        self.value = value
        self.parent = parent
```

## TypeScript vs Python 类型对照

| TypeScript             | Python                      | 说明                  |
| ---------------------- | --------------------------- | --------------------- |
| `number`               | `int \| float`              | Python 区分整数和浮点 |
| `string`               | `str`                       | 字符串                |
| `boolean`              | `bool`                      | 布尔值                |
| `any`                  | `Any`                       | 任意类型              |
| `unknown`              | `object`                    | 未知类型              |
| `never`                | `NoReturn`                  | 永不返回              |
| `void`                 | `None`                      | 无返回值              |
| `T \| null`            | `T \| None` / `Optional[T]` | 可选类型              |
| `T[]`                  | `list[T]`                   | 列表                  |
| `{ [key: string]: T }` | `dict[str, T]`              | 字典                  |
| `[T, U]`               | `tuple[T, U]`               | 元组                  |
| `interface`            | `Protocol` / `TypedDict`    | 接口                  |
| `type`                 | `TypeAlias`                 | 类型别名              |
| `T<U>`                 | `T[U]`                      | 泛型                  |

## 小结

- Python 类型提示是可选的,但强烈推荐使用
- mypy 提供静态类型检查,类似 TypeScript 编译器
- Python 3.9+ 可直接使用 `list[T]` 等内置泛型
- Python 3.10+ 支持 `X | Y` 联合类型语法
- 使用 Protocol 实现结构化类型(鸭子类型)
- TypedDict 用于类型化字典(类似 TS interface)
- 类型提示显著提升代码可维护性和 IDE 体验

更多信息请参考:

- [Python Typing 文档](https://docs.python.org/3/library/typing.html)
- [mypy 文档](https://mypy.readthedocs.io/)
- [Type Hints Cheat Sheet](https://mypy.readthedocs.io/en/stable/cheat_sheet_py3.html)

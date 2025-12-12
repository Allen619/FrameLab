---
title: enum - 枚举类型
description: Python enum 模块详解，定义枚举类型和常量集合
---

# enum 枚举类型

## 学习目标

- 理解枚举类型的定义和使用
- 掌握 Enum、IntEnum、Flag 等类型
- 学会自定义枚举行为
- 对比 TypeScript 枚举特性

## 概览

| Python enum | TypeScript | 说明 |
|------------|------------|------|
| `Enum` | `enum` | 基础枚举 |
| `IntEnum` | 数字枚举 | 整数枚举 |
| `StrEnum` | 字符串枚举 | 字符串枚举 |
| `Flag` | 位运算手动实现 | 位标志 |
| `auto()` | 自动赋值 | 自动值 |

## 基础用法

### 定义枚举

```python
from enum import Enum

# 定义枚举
class Color(Enum):
    RED = 1
    GREEN = 2
    BLUE = 3

# 访问枚举成员
print(Color.RED)        # Color.RED
print(Color.RED.name)   # RED
print(Color.RED.value)  # 1

# 通过值获取成员
print(Color(1))         # Color.RED

# 通过名称获取成员
print(Color['RED'])     # Color.RED
```

```typescript
// TypeScript 对比
enum Color {
    RED = 1,
    GREEN = 2,
    BLUE = 3
}

console.log(Color.RED)      // 1
console.log(Color[1])       // "RED" (反向映射)
```

### 遍历枚举

```python
from enum import Enum

class Status(Enum):
    PENDING = 'pending'
    ACTIVE = 'active'
    COMPLETED = 'completed'
    CANCELLED = 'cancelled'

# 遍历所有成员
for status in Status:
    print(f"{status.name}: {status.value}")

# 获取所有成员
print(list(Status))
# [<Status.PENDING: 'pending'>, <Status.ACTIVE: 'active'>, ...]

# 成员数量
print(len(Status))  # 4
```

```typescript
// TypeScript 对比
enum Status {
    PENDING = 'pending',
    ACTIVE = 'active',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

// 遍历字符串枚举
Object.values(Status).forEach(value => {
    console.log(value)
})
```

### 比较和测试

```python
from enum import Enum

class Color(Enum):
    RED = 1
    GREEN = 2
    BLUE = 3

# 身份比较
print(Color.RED is Color.RED)  # True
print(Color.RED is Color.GREEN)  # False

# 相等比较
print(Color.RED == Color.RED)  # True
print(Color.RED == 1)  # False (Enum 不等于其值)

# 成员测试
print(Color.RED in Color)  # True
```

```typescript
// TypeScript 对比
enum Color { RED = 1, GREEN = 2, BLUE = 3 }

// TypeScript 枚举可以与值比较
console.log(Color.RED === 1)  // true
```

## auto() 自动赋值

```python
from enum import Enum, auto

class Priority(Enum):
    LOW = auto()      # 1
    MEDIUM = auto()   # 2
    HIGH = auto()     # 3
    CRITICAL = auto() # 4

print(Priority.LOW.value)      # 1
print(Priority.CRITICAL.value) # 4

# 自定义 auto 行为
class AutoName(Enum):
    @staticmethod
    def _generate_next_value_(name, start, count, last_values):
        return name.lower()

class HttpMethod(AutoName):
    GET = auto()     # 'get'
    POST = auto()    # 'post'
    PUT = auto()     # 'put'
    DELETE = auto()  # 'delete'

print(HttpMethod.GET.value)  # 'get'
```

## IntEnum 整数枚举

```python
from enum import IntEnum

class HttpStatus(IntEnum):
    OK = 200
    CREATED = 201
    BAD_REQUEST = 400
    NOT_FOUND = 404
    SERVER_ERROR = 500

# IntEnum 可以进行整数比较和运算
print(HttpStatus.OK == 200)  # True
print(HttpStatus.OK < 300)   # True
print(HttpStatus.OK + 1)     # 201

# 可以用作字典的键
codes = {200: 'OK', 404: 'Not Found'}
print(codes[HttpStatus.OK])  # 'OK'
```

```typescript
// TypeScript 数字枚举类似
enum HttpStatus {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    NOT_FOUND = 404
}

console.log(HttpStatus.OK === 200)  // true
```

## StrEnum 字符串枚举

```python
from enum import StrEnum  # Python 3.11+

class Environment(StrEnum):
    DEV = 'development'
    STAGING = 'staging'
    PROD = 'production'

# StrEnum 可以直接当字符串使用
print(Environment.DEV == 'development')  # True
print(f"Current: {Environment.DEV}")     # Current: development

# 字符串操作
print(Environment.DEV.upper())  # DEVELOPMENT

# Python 3.10 及更早版本的替代方案
from enum import Enum

class Environment(str, Enum):
    DEV = 'development'
    STAGING = 'staging'
    PROD = 'production'
```

```typescript
// TypeScript 字符串枚举
enum Environment {
    DEV = 'development',
    STAGING = 'staging',
    PROD = 'production'
}
```

## Flag 位标志

```python
from enum import Flag, auto

class Permission(Flag):
    NONE = 0
    READ = auto()    # 1
    WRITE = auto()   # 2
    EXECUTE = auto() # 4

    # 组合权限
    READ_WRITE = READ | WRITE
    ALL = READ | WRITE | EXECUTE

# 组合
user_perm = Permission.READ | Permission.WRITE
print(user_perm)  # Permission.READ_WRITE

# 检查权限
print(Permission.READ in user_perm)   # True
print(Permission.EXECUTE in user_perm) # False

# 移除权限
user_perm &= ~Permission.WRITE
print(user_perm)  # Permission.READ

# 检查是否有某一组合权限
admin_perm = Permission.ALL
print(admin_perm & Permission.EXECUTE)  # Permission.EXECUTE (truthy)
```

```javascript
// JavaScript 对比 - 使用位运算
const Permission = {
    NONE: 0,
    READ: 1,
    WRITE: 2,
    EXECUTE: 4,
    ALL: 7
}

let userPerm = Permission.READ | Permission.WRITE
console.log(userPerm & Permission.READ)  // 1 (truthy)
```

### IntFlag - 可整数运算的标志

```python
from enum import IntFlag, auto

class FileMode(IntFlag):
    READ = 4
    WRITE = 2
    EXECUTE = 1

# IntFlag 可整数运算
mode = FileMode.READ | FileMode.WRITE
print(mode)          # FileMode.READ|WRITE
print(int(mode))     # 6
print(mode == 6)     # True

# Unix 权限组合
def parse_mode(mode_int):
    return FileMode(mode_int)

print(parse_mode(7))  # FileMode.READ|WRITE|EXECUTE
print(parse_mode(5))  # FileMode.READ|EXECUTE
```

## 自定义枚举

### 添加方法

```python
from enum import Enum

class Planet(Enum):
    MERCURY = (3.303e+23, 2.4397e6)
    VENUS   = (4.869e+24, 6.0518e6)
    EARTH   = (5.976e+24, 6.37814e6)
    MARS    = (6.421e+23, 3.3972e6)

    def __init__(self, mass, radius):
        self.mass = mass      # kg
        self.radius = radius  # m

    @property
    def surface_gravity(self):
        G = 6.67300E-11
        return G * self.mass / (self.radius ** 2)

# 使用
print(Planet.EARTH.mass)            # 5.976e+24
print(Planet.EARTH.surface_gravity) # 9.8...
```

### 使用装饰器

```python
from enum import Enum, unique, verify, UNIQUE, CONTINUOUS

# @unique - 确保值不重复
@unique
class Mistake(Enum):
    ONE = 1
    TWO = 2
    # THREE = 2  # 会报错

# @verify - Python 3.11+
@verify(UNIQUE)
class Status(Enum):
    ACTIVE = 1
    INACTIVE = 2

@verify(CONTINUOUS)  # 值必须连续
class Level(Enum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3
```

### 别名

```python
from enum import Enum

class Shape(Enum):
    SQUARE = 2
    RECTANGLE = 2  # 别名，不是新成员
    DIAMOND = 1

# 别名不会在遍历中出现
print(list(Shape))
# [<Shape.DIAMOND: 1>, <Shape.SQUARE: 2>]

# 但可以通过别名访问
print(Shape.RECTANGLE)  # Shape.SQUARE
print(Shape.RECTANGLE is Shape.SQUARE)  # True

# 获取包括别名的所有成员
print(Shape.__members__)
# {'SQUARE': <Shape.SQUARE: 2>, 'RECTANGLE': <Shape.SQUARE: 2>, ...}
```

## 实际应用

### 状态机

```python
from enum import Enum, auto

class OrderState(Enum):
    CREATED = auto()
    PAID = auto()
    SHIPPED = auto()
    DELIVERED = auto()
    CANCELLED = auto()

    def can_transition_to(self, new_state):
        """检查状态转换是否有效"""
        transitions = {
            OrderState.CREATED: {OrderState.PAID, OrderState.CANCELLED},
            OrderState.PAID: {OrderState.SHIPPED, OrderState.CANCELLED},
            OrderState.SHIPPED: {OrderState.DELIVERED},
            OrderState.DELIVERED: set(),
            OrderState.CANCELLED: set(),
        }
        return new_state in transitions.get(self, set())

class Order:
    def __init__(self):
        self.state = OrderState.CREATED

    def transition_to(self, new_state):
        if not self.state.can_transition_to(new_state):
            raise ValueError(f"Cannot transition from {self.state} to {new_state}")
        self.state = new_state
        print(f"Order state changed to {self.state.name}")

# 使用
order = Order()
order.transition_to(OrderState.PAID)
order.transition_to(OrderState.SHIPPED)
# order.transition_to(OrderState.CANCELLED)  # 报错
```

### HTTP 方法

```python
from enum import Enum

class HttpMethod(Enum):
    GET = 'GET'
    POST = 'POST'
    PUT = 'PUT'
    PATCH = 'PATCH'
    DELETE = 'DELETE'

    @property
    def is_safe(self):
        """安全方法不修改资源"""
        return self in {HttpMethod.GET}

    @property
    def is_idempotent(self):
        """幂等方法多次执行结果相同"""
        return self in {HttpMethod.GET, HttpMethod.PUT, HttpMethod.DELETE}

def handle_request(method: HttpMethod, url: str):
    print(f"{method.value} {url}")
    print(f"  Safe: {method.is_safe}, Idempotent: {method.is_idempotent}")

# 使用
handle_request(HttpMethod.GET, '/api/users')
handle_request(HttpMethod.POST, '/api/users')
```

### 配置选项

```python
from enum import Enum

class LogLevel(Enum):
    DEBUG = 10
    INFO = 20
    WARNING = 30
    ERROR = 40
    CRITICAL = 50

    def __ge__(self, other):
        if isinstance(other, LogLevel):
            return self.value >= other.value
        return NotImplemented

    def __gt__(self, other):
        if isinstance(other, LogLevel):
            return self.value > other.value
        return NotImplemented

    def __le__(self, other):
        if isinstance(other, LogLevel):
            return self.value <= other.value
        return NotImplemented

    def __lt__(self, other):
        if isinstance(other, LogLevel):
            return self.value < other.value
        return NotImplemented

class Logger:
    def __init__(self, level: LogLevel = LogLevel.INFO):
        self.level = level

    def log(self, level: LogLevel, message: str):
        if level >= self.level:
            print(f"[{level.name}] {message}")

# 使用
logger = Logger(LogLevel.WARNING)
logger.log(LogLevel.DEBUG, "Debug message")    # 不输出
logger.log(LogLevel.INFO, "Info message")      # 不输出
logger.log(LogLevel.WARNING, "Warning!")       # 输出
logger.log(LogLevel.ERROR, "Error!")           # 输出
```

### JSON 序列化

```python
from enum import Enum
import json

class Status(Enum):
    ACTIVE = 'active'
    INACTIVE = 'inactive'

# 默认序列化会报错
# json.dumps({'status': Status.ACTIVE})  # TypeError

# 方法 1: 自定义编码器
class EnumEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Enum):
            return obj.value
        return super().default(obj)

data = {'status': Status.ACTIVE}
print(json.dumps(data, cls=EnumEncoder))
# {"status": "active"}

# 方法 2: 使用 value 属性
print(json.dumps({'status': Status.ACTIVE.value}))

# 反序列化
def parse_status(data):
    return Status(data['status'])

parsed = parse_status({'status': 'active'})
print(parsed)  # Status.ACTIVE
```

### 类型提示配合

```python
from enum import Enum
from typing import Optional

class Priority(Enum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3
    CRITICAL = 4

class Task:
    def __init__(
        self,
        title: str,
        priority: Priority = Priority.MEDIUM
    ):
        self.title = title
        self.priority = priority

    def __repr__(self):
        return f"Task({self.title!r}, {self.priority.name})"

def get_tasks_by_priority(
    tasks: list[Task],
    min_priority: Optional[Priority] = None
) -> list[Task]:
    if min_priority is None:
        return tasks
    return [t for t in tasks if t.priority.value >= min_priority.value]

# 使用
tasks = [
    Task("Fix bug", Priority.CRITICAL),
    Task("Write docs", Priority.LOW),
    Task("Review PR", Priority.HIGH),
]

urgent = get_tasks_by_priority(tasks, Priority.HIGH)
print(urgent)  # [Task('Fix bug', CRITICAL), Task('Review PR', HIGH)]
```

## 与 TypeScript 的主要差异

| 特性 | Python Enum | TypeScript enum |
|-----|-------------|-----------------|
| 值比较 | `Color.RED != 1` | `Color.RED === 1` |
| 类型安全 | 严格，有类型 | 数字枚举较宽松 |
| 遍历 | `for x in Color` | `Object.values()` |
| 位标志 | `Flag` 内置 | 需手动实现 |
| 方法定义 | 可添加方法 | 不可 |
| 反向映射 | `Color(1)` | `Color[1]` |

## 总结

**基础枚举**:
- `Enum`: 基础枚举类型
- `IntEnum`: 可整数比较
- `StrEnum`: 可字符串比较 (3.11+)

**标记枚举**:
- `Flag`: 位标志组合
- `IntFlag`: 可整数运算的位标志

**辅助工具**:
- `auto()`: 自动赋值
- `@unique`: 确保值不重复
- `@verify`: 验证枚举约束 (3.11+)

::: tip 最佳实践
- 使用 `Enum` 定义固定的常量集合
- 需要整数或字符串操作时用 `IntEnum`/`StrEnum`
- 使用 `Flag` 处理组合的权限或选项
- 添加方法让枚举更具语义化
:::

::: info 相关模块
- `dataclasses` - 数据类
- `typing` - 类型提示
:::

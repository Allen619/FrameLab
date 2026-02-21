---
title: 装饰器 Decorators
description: Python 装饰器完整指南,与 React HOC/Vue Composition 深度对比
---

# 装饰器 Decorators

装饰器是 Python 的强大特性,用于在不修改原始代码的情况下增强函数或类的行为,概念类似前端的高阶组件 (HOC) 或 AOP (面向切面编程)。

## 什么是装饰器?

### 核心概念

```python
# 装饰器本质:接受函数,返回增强后的函数
def my_decorator(func):
    def wrapper(*args, **kwargs):
        # 前置逻辑
        print("Before")
        result = func(*args, **kwargs)
        # 后置逻辑
        print("After")
        return result
    return wrapper

# 使用装饰器
@my_decorator
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")
# 输出:
# Before
# Hello, Alice!
# After

# 装饰器等价于:
# greet = my_decorator(greet)
```

```javascript
// React HOC 对比
function withLogging(Component) {
  return function EnhancedComponent(props) {
    console.log('Before render')
    const result = <Component {...props} />
    console.log('After render')
    return result
  }
}

// 使用 HOC
const EnhancedButton = withLogging(Button)

// 或装饰器语法(实验性)
@withLogging
class Button extends React.Component {
  // ...
}
```

### 为什么使用装饰器?

**优势**:

- ✅ **关注点分离**: 将横切关注点(日志、缓存、权限)与业务逻辑分离
- ✅ **代码复用**: 一次编写,到处使用
- ✅ **声明式**: `@decorator` 语法清晰直观
- ✅ **可组合**: 多个装饰器可堆叠使用
- ✅ **不侵入原代码**: 不修改原函数实现

## 函数装饰器

### 基本装饰器

```python
def log(func):
    """日志装饰器"""
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__} with {args}, {kwargs}")
        result = func(*args, **kwargs)
        print(f"{func.__name__} returned {result}")
        return result
    return wrapper

@log
def add(a, b):
    return a + b

add(1, 2)
# Calling add with (1, 2), {}
# add returned 3
```

### 保留函数元数据

[🔗 functools.wraps 官方文档](https://docs.python.org/3/library/functools.html#functools.wraps){target="_blank" rel="noopener"}

```python
from functools import wraps

def my_decorator(func):
    @wraps(func)  # 保留原函数的 __name__, __doc__ 等
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@my_decorator
def greet(name: str) -> str:
    """Greet a person"""
    return f"Hello, {name}!"

print(greet.__name__)  # greet (而不是 wrapper)
print(greet.__doc__)   # Greet a person
```

### 常见装饰器模式

#### 1. 计时装饰器

```python
import time
from functools import wraps

def timer(func):
    """测量函数执行时间"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        end = time.perf_counter()
        print(f"{func.__name__} took {end - start:.4f}s")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)
    return "Done"

slow_function()  # slow_function took 1.0012s
```

```javascript
// JavaScript 对比
function timer(target, propertyKey, descriptor) {
  const originalMethod = descriptor.value
  descriptor.value = function (...args) {
    const start = performance.now()
    const result = originalMethod.apply(this, args)
    const end = performance.now()
    console.log(`${propertyKey} took ${end - start}ms`)
    return result
  }
  return descriptor
}

class MyClass {
  @timer
  slowMethod() {
    // ...
  }
}
```

#### 2. 缓存装饰器

```python
from functools import wraps

def memoize(func):
    """缓存函数结果"""
    cache = {}

    @wraps(func)
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]
    return wrapper

@memoize
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# 第一次调用慢,后续调用快
print(fibonacci(100))  # 很快,因为缓存了中间结果

# Python 内置缓存装饰器
from functools import lru_cache

@lru_cache(maxsize=128)
def expensive_function(n):
    # 计算密集型操作
    return n ** 2
```

#### 3. 重试装饰器

```python
import time
from functools import wraps

def retry(max_attempts=3, delay=1):
    """失败时重试"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
                    print(f"Attempt {attempt + 1} failed, retrying...")
                    time.sleep(delay)
        return wrapper
    return decorator

@retry(max_attempts=3, delay=0.5)
def unstable_api_call():
    import random
    if random.random() < 0.7:
        raise ConnectionError("API unavailable")
    return "Success"
```

#### 4. 权限检查装饰器

```python
from functools import wraps

def require_auth(func):
    """检查用户是否已认证"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        # 假设从上下文获取当前用户
        user = get_current_user()
        if not user or not user.is_authenticated:
            raise PermissionError("Authentication required")
        return func(*args, **kwargs)
    return wrapper

def require_role(role):
    """检查用户角色"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            user = get_current_user()
            if role not in user.roles:
                raise PermissionError(f"Role '{role}' required")
            return func(*args, **kwargs)
        return wrapper
    return decorator

@require_auth
@require_role("admin")
def delete_user(user_id):
    # 只有已认证的 admin 才能调用
    pass
```

#### 5. 类型检查装饰器

```python
from functools import wraps

def validate_types(**type_map):
    """运行时类型检查"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # 检查参数类型
            for param_name, expected_type in type_map.items():
                if param_name in kwargs:
                    value = kwargs[param_name]
                    if not isinstance(value, expected_type):
                        raise TypeError(
                            f"{param_name} must be {expected_type}, "
                            f"got {type(value)}"
                        )
            return func(*args, **kwargs)
        return wrapper
    return decorator

@validate_types(name=str, age=int)
def create_user(name, age):
    return {"name": name, "age": age}

create_user(name="Alice", age=25)       # ✅
create_user(name="Bob", age="invalid")  # ❌ TypeError
```

## 带参数的装饰器

### 装饰器工厂模式

```python
def repeat(times):
    """重复执行函数 n 次"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            results = []
            for _ in range(times):
                result = func(*args, **kwargs)
                results.append(result)
            return results
        return wrapper
    return decorator

@repeat(3)
def say_hello(name):
    return f"Hello, {name}!"

print(say_hello("Alice"))
# ['Hello, Alice!', 'Hello, Alice!', 'Hello, Alice!']

# 装饰器工厂等价于:
# say_hello = repeat(3)(say_hello)
```

### 可选参数装饰器

```python
from functools import wraps

def smart_decorator(func=None, *, option="default"):
    """可以带参数或不带参数使用的装饰器"""
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            print(f"Option: {option}")
            return f(*args, **kwargs)
        return wrapper

    if func is None:
        # 带参数调用: @smart_decorator(option="value")
        return decorator
    else:
        # 不带参数调用: @smart_decorator
        return decorator(func)

# 两种用法都可以
@smart_decorator
def func1():
    pass

@smart_decorator(option="custom")
def func2():
    pass
```

## 类装饰器

### 装饰类的方法

```python
class MyClass:
    @staticmethod
    def static_method():
        return "Static"

    @classmethod
    def class_method(cls):
        return f"Class: {cls.__name__}"

    @property
    def my_property(self):
        return self._value

    @my_property.setter
    def my_property(self, value):
        self._value = value
```

### 装饰整个类

```python
def add_str_method(cls):
    """为类添加 __str__ 方法"""
    original_str = cls.__str__

    def new_str(self):
        return f"<{cls.__name__} instance>"

    cls.__str__ = new_str
    return cls

@add_str_method
class User:
    def __init__(self, name):
        self.name = name

user = User("Alice")
print(user)  # <User instance>
```

### 单例装饰器

```python
from functools import wraps

def singleton(cls):
    """单例模式装饰器"""
    instances = {}

    @wraps(cls)
    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]

    return get_instance

@singleton
class Database:
    def __init__(self):
        print("Connecting to database...")

db1 = Database()  # Connecting to database...
db2 = Database()  # 不会再次连接
print(db1 is db2)  # True
```

### dataclass 装饰器

```python
from dataclasses import dataclass

@dataclass
class User:
    name: str
    age: int
    email: str = ""

    def greet(self):
        return f"Hi, I'm {self.name}"

# dataclass 自动生成 __init__, __repr__, __eq__ 等方法
user = User(name="Alice", age=25)
print(user)  # User(name='Alice', age=25, email='')
```

## 多个装饰器组合

### 装饰器堆叠

```python
@decorator1
@decorator2
@decorator3
def my_function():
    pass

# 等价于:
# my_function = decorator1(decorator2(decorator3(my_function)))

# 执行顺序:从下到上应用,从上到下执行
```

### 实际示例

```python
from functools import wraps
import time

def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"Time: {end - start:.2f}s")
        return result
    return wrapper

def log(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__}")
        result = func(*args, **kwargs)
        print(f"Finished {func.__name__}")
        return result
    return wrapper

@timer
@log
def process_data(n):
    time.sleep(1)
    return n * 2

process_data(5)
# Calling process_data
# Finished process_data
# Time: 1.00s
```

## 内置装饰器

### @property

```python
class Circle:
    def __init__(self, radius):
        self._radius = radius

    @property
    def radius(self):
        """获取半径"""
        return self._radius

    @radius.setter
    def radius(self, value):
        """设置半径"""
        if value <= 0:
            raise ValueError("Radius must be positive")
        self._radius = value

    @property
    def area(self):
        """计算面积(只读属性)"""
        return 3.14 * self._radius ** 2

circle = Circle(5)
print(circle.radius)  # 5
circle.radius = 10    # 使用 setter
print(circle.area)    # 314.0
# circle.area = 100   # AttributeError: can't set attribute
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
    if (value <= 0) throw new Error('Radius must be positive')
    this._radius = value
  }

  get area() {
    return Math.PI * this._radius ** 2
  }
}
```

### @staticmethod 和 @classmethod

```python
class MathUtils:
    PI = 3.14

    @staticmethod
    def add(a, b):
        """静态方法:不访问实例或类"""
        return a + b

    @classmethod
    def get_pi(cls):
        """类方法:访问类属性"""
        return cls.PI

    @classmethod
    def create_instance(cls):
        """工厂方法"""
        return cls()

print(MathUtils.add(1, 2))  # 3
print(MathUtils.get_pi())   # 3.14
```

### @functools.lru_cache

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# 非常快,因为缓存了结果
print(fibonacci(100))

# 查看缓存信息
print(fibonacci.cache_info())
# CacheInfo(hits=98, misses=101, maxsize=128, currsize=101)

# 清空缓存
fibonacci.cache_clear()
```

## 装饰器高级技巧

### 装饰器类

```python
class CountCalls:
    """使用类作为装饰器"""
    def __init__(self, func):
        self.func = func
        self.count = 0

    def __call__(self, *args, **kwargs):
        self.count += 1
        print(f"Call {self.count} of {self.func.__name__}")
        return self.func(*args, **kwargs)

@CountCalls
def say_hello():
    print("Hello!")

say_hello()  # Call 1 of say_hello
say_hello()  # Call 2 of say_hello
```

### 上下文管理装饰器

```python
from contextlib import contextmanager

@contextmanager
def timer_context():
    """计时上下文管理器"""
    start = time.time()
    yield
    end = time.time()
    print(f"Elapsed: {end - start:.2f}s")

with timer_context():
    time.sleep(1)
# Elapsed: 1.00s
```

### 异步装饰器

```python
import asyncio
from functools import wraps

def async_timer(func):
    """异步函数计时装饰器"""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start = time.time()
        result = await func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.2f}s")
        return result
    return wrapper

@async_timer
async def async_operation():
    await asyncio.sleep(1)
    return "Done"

asyncio.run(async_operation())
```

## 装饰器最佳实践

### 1. 始终使用 @wraps

```python
from functools import wraps

# ✅ 好的做法
def my_decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

# ❌ 避免
def my_decorator(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper  # 丢失了原函数的元数据
```

### 2. 装饰器应该透明

```python
# ✅ 好的做法:装饰器不改变函数签名
@log
def add(a: int, b: int) -> int:
    return a + b

# 调用方式不变
result = add(1, 2)

# ❌ 避免:装饰器改变了函数行为
@returns_list  # 将返回值包装成列表
def add(a, b):
    return a + b

result = add(1, 2)  # 现在返回 [3] 而不是 3
```

### 3. 合理使用装饰器层级

```python
# ✅ 好的做法:装饰器职责单一
@timer
@cache
@validate_input
def process_data(data):
    pass

# ❌ 避免:一个装饰器做太多事情
@do_everything  # 计时+缓存+验证+日志+...
def process_data(data):
    pass
```

## 对前端开发者

### 装饰器 vs HOC 对照

| Python 装饰器  | React HOC            | 说明         |
| -------------- | -------------------- | ------------ |
| `@decorator`   | `withXxx(Component)` | 语法糖       |
| 装饰函数       | 增强组件             | 核心理念相同 |
| `@wraps(func)` | `hoistStatics`       | 保留元数据   |
| 多装饰器堆叠   | HOC 组合             | 可组合性     |
| `@property`    | `getter/setter`      | 计算属性     |

### 装饰器 vs Vue Composition

```python
# Python 装饰器
@timer
@cache
def fetch_data():
    pass
```

```javascript
// Vue 3 Composition API
import { useTimer } from './useTimer'
import { useCache } from './useCache'

export default {
  setup() {
    const { time } = useTimer()
    const { cached, fetchData } = useCache()
    return { time, cached, fetchData }
  },
}
```

## 小结

- 装饰器是 Python 的强大特性,用于增强函数/类
- 本质是高阶函数:接受函数,返回增强后的函数
- 常见用途:日志、缓存、权限、计时、重试等
- 使用 `@wraps` 保留原函数元数据
- 可以堆叠多个装饰器
- 内置装饰器:`@property`, `@staticmethod`, `@classmethod`, `@lru_cache`
- 类似前端的 HOC 和 AOP 编程思想

更多信息请参考:

- [PEP 318 - Decorators](https://www.python.org/dev/peps/pep-0318/)
- [Python Decorators Guide](https://realpython.com/primer-on-python-decorators/)
- [functools 文档](https://docs.python.org/3/library/functools.html)

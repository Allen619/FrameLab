---
title: contextlib - 上下文管理工具
description: Python contextlib 模块详解，上下文管理器工具集
---

# contextlib 上下文管理工具

## 学习目标

- 理解上下文管理器协议
- 掌握 contextmanager 装饰器
- 学会资源管理和异常处理
- 与 JavaScript try-finally 对比

## 概述

| Python contextlib | JavaScript | 说明 |
|------------------|------------|------|
| `with` 语句 | `try-finally` | 资源管理 |
| `@contextmanager` | 无直接对应 | 创建上下文管理器 |
| `ExitStack` | 无直接对应 | 管理多个上下文 |
| `suppress()` | `try-catch` 空 | 抑制异常 |
| `closing()` | 无直接对应 | 确保关闭 |

## 上下文管理器基础

### with 语句原理

```python
# with 语句的工作原理
with open('file.txt') as f:
    content = f.read()

# 等价于
f = open('file.txt')
try:
    content = f.read()
finally:
    f.close()
```

```javascript
// JavaScript 对比 - 没有 with 语句
let f
try {
    f = fs.openSync('file.txt', 'r')
    const content = fs.readFileSync(f, 'utf-8')
} finally {
    if (f !== undefined) fs.closeSync(f)
}

// 或使用 using 提案 (Stage 3)
// using f = fs.openSync('file.txt', 'r')
```

### 自定义上下文管理器 (类)

```python
class Timer:
    """计时上下文管理器"""

    def __enter__(self):
        import time
        self.start = time.perf_counter()
        return self  # 返回值绑定到 as 后的变量

    def __exit__(self, exc_type, exc_val, exc_tb):
        import time
        self.end = time.perf_counter()
        self.elapsed = self.end - self.start
        print(f"Elapsed: {self.elapsed:.4f}s")
        return False  # 不抑制异常

# 使用
with Timer() as t:
    # 执行操作
    sum(range(1000000))

print(f"Time recorded: {t.elapsed:.4f}s")
```

## contextmanager 装饰器

### 基本用法

```python
from contextlib import contextmanager

@contextmanager
def timer():
    """简化的计时上下文管理器"""
    import time
    start = time.perf_counter()
    try:
        yield  # yield 之前是 __enter__，之后是 __exit__
    finally:
        elapsed = time.perf_counter() - start
        print(f"Elapsed: {elapsed:.4f}s")

# 使用
with timer():
    sum(range(1000000))
```

### yield 返回值

```python
from contextlib import contextmanager

@contextmanager
def open_file(path, mode='r'):
    """文件打开上下文管理器"""
    f = open(path, mode)
    try:
        yield f  # yield 的值可以被 as 捕获
    finally:
        f.close()

# 使用
with open_file('data.txt', 'w') as f:
    f.write('Hello, World!')
```

### 异常处理

```python
from contextlib import contextmanager

@contextmanager
def transaction(conn):
    """数据库事务上下文管理器"""
    try:
        yield conn
        conn.commit()  # 正常完成则提交
    except Exception:
        conn.rollback()  # 异常则回滚
        raise  # 重新抛出异常

# 使用
# with transaction(db_conn) as conn:
#     conn.execute("INSERT INTO ...")
```

### 嵌套上下文

```python
from contextlib import contextmanager

@contextmanager
def logging_context(name):
    """日志上下文"""
    print(f"Entering {name}")
    try:
        yield
    finally:
        print(f"Exiting {name}")

# 嵌套使用
with logging_context("outer"):
    with logging_context("inner"):
        print("Doing work")

# 输出:
# Entering outer
# Entering inner
# Doing work
# Exiting inner
# Exiting outer
```

## 常用工具

### closing - 确保关闭

```python
from contextlib import closing
from urllib.request import urlopen

# closing 确保对象的 close() 方法被调用
with closing(urlopen('https://example.com')) as page:
    content = page.read()

# 等价于
page = urlopen('https://example.com')
try:
    content = page.read()
finally:
    page.close()
```

### suppress - 抑制异常

```python
from contextlib import suppress

# 抑制特定异常
with suppress(FileNotFoundError):
    os.remove('nonexistent_file.txt')

# 等价于
try:
    os.remove('nonexistent_file.txt')
except FileNotFoundError:
    pass

# 抑制多种异常
with suppress(FileNotFoundError, PermissionError):
    os.remove('some_file.txt')
```

```javascript
// JavaScript 对比
try {
    fs.unlinkSync('nonexistent_file.txt')
} catch (e) {
    if (e.code !== 'ENOENT') throw e
}
```

### redirect_stdout / redirect_stderr

```python
from contextlib import redirect_stdout, redirect_stderr
import io

# 重定向标准输出
f = io.StringIO()
with redirect_stdout(f):
    print("This goes to the StringIO")

output = f.getvalue()
print(f"Captured: {output}")

# 重定向到文件
with open('output.txt', 'w') as f:
    with redirect_stdout(f):
        print("This goes to file")

# 重定向标准错误
with redirect_stderr(io.StringIO()) as err:
    import sys
    print("Error message", file=sys.stderr)
```

### nullcontext - 空上下文

```python
from contextlib import nullcontext

# 条件性使用上下文管理器
def process(data, lock=None):
    with lock if lock else nullcontext():
        # 处理数据
        return data * 2

# 无锁
result = process(10)  # 使用 nullcontext

# 有锁
import threading
lock = threading.Lock()
result = process(10, lock)  # 使用实际锁
```

## ExitStack - 管理多个上下文

### 基本用法

```python
from contextlib import ExitStack

# 动态管理多个上下文
with ExitStack() as stack:
    files = [
        stack.enter_context(open(f'file{i}.txt', 'w'))
        for i in range(3)
    ]
    for i, f in enumerate(files):
        f.write(f"Content {i}")
# 所有文件自动关闭
```

### 动态添加清理回调

```python
from contextlib import ExitStack

def cleanup(name):
    print(f"Cleaning up {name}")

with ExitStack() as stack:
    # 注册清理回调 (后注册的先执行)
    stack.callback(cleanup, "first")
    stack.callback(cleanup, "second")
    print("Doing work")

# 输出:
# Doing work
# Cleaning up second
# Cleaning up first
```

### 条件性进入上下文

```python
from contextlib import ExitStack
import threading

def process_files(files, use_lock=False):
    with ExitStack() as stack:
        # 条件性添加锁
        if use_lock:
            stack.enter_context(threading.Lock())

        # 打开所有文件
        handles = [stack.enter_context(open(f)) for f in files]

        # 处理文件
        for handle in handles:
            print(handle.read())
```

### 保留上下文供后续使用

```python
from contextlib import ExitStack

# 创建可复用的上下文
stack = ExitStack()
files = []

try:
    files.append(stack.enter_context(open('file1.txt')))
    files.append(stack.enter_context(open('file2.txt')))

    # 使用文件...
    for f in files:
        print(f.name)
finally:
    stack.close()  # 手动关闭所有
```

## AsyncExitStack - 异步上下文

```python
from contextlib import asynccontextmanager, AsyncExitStack
import asyncio

@asynccontextmanager
async def async_resource(name):
    print(f"Acquiring {name}")
    try:
        yield name
    finally:
        print(f"Releasing {name}")
        await asyncio.sleep(0.1)

async def main():
    async with AsyncExitStack() as stack:
        resources = []
        for i in range(3):
            r = await stack.enter_async_context(async_resource(f"resource_{i}"))
            resources.append(r)

        print(f"Using: {resources}")

asyncio.run(main())
```

## 实用示例

### 临时目录

```python
from contextlib import contextmanager
import tempfile
import shutil
import os

@contextmanager
def temp_directory():
    """创建临时目录，使用后自动删除"""
    dirpath = tempfile.mkdtemp()
    try:
        yield dirpath
    finally:
        shutil.rmtree(dirpath)

# 使用
with temp_directory() as tmpdir:
    filepath = os.path.join(tmpdir, 'temp.txt')
    with open(filepath, 'w') as f:
        f.write('temporary content')
    print(f"Working in: {tmpdir}")
# 目录已删除
```

### 环境变量临时修改

```python
from contextlib import contextmanager
import os

@contextmanager
def env_var(key, value):
    """临时设置环境变量"""
    old_value = os.environ.get(key)
    os.environ[key] = value
    try:
        yield
    finally:
        if old_value is None:
            del os.environ[key]
        else:
            os.environ[key] = old_value

# 使用
with env_var('DEBUG', 'true'):
    print(os.environ['DEBUG'])  # true
print(os.environ.get('DEBUG'))  # None 或原值
```

### 工作目录切换

```python
from contextlib import contextmanager
import os

@contextmanager
def working_directory(path):
    """临时切换工作目录"""
    old_cwd = os.getcwd()
    os.chdir(path)
    try:
        yield
    finally:
        os.chdir(old_cwd)

# 使用
with working_directory('/tmp'):
    print(os.getcwd())  # /tmp
print(os.getcwd())  # 原目录
```

### 数据库连接池

```python
from contextlib import contextmanager
from queue import Queue
import sqlite3

class ConnectionPool:
    def __init__(self, db_path, pool_size=5):
        self.pool = Queue(maxsize=pool_size)
        for _ in range(pool_size):
            conn = sqlite3.connect(db_path, check_same_thread=False)
            self.pool.put(conn)

    @contextmanager
    def get_connection(self):
        conn = self.pool.get()
        try:
            yield conn
        finally:
            self.pool.put(conn)

# 使用
pool = ConnectionPool(':memory:')

with pool.get_connection() as conn:
    cursor = conn.cursor()
    cursor.execute('SELECT 1')
```

### 计时与日志

```python
from contextlib import contextmanager
import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@contextmanager
def timed_operation(operation_name):
    """记录操作耗时"""
    logger.info(f"Starting: {operation_name}")
    start = time.perf_counter()
    try:
        yield
    except Exception as e:
        logger.error(f"Failed: {operation_name} - {e}")
        raise
    finally:
        elapsed = time.perf_counter() - start
        logger.info(f"Completed: {operation_name} in {elapsed:.3f}s")

# 使用
with timed_operation("data processing"):
    time.sleep(1)
    # 处理数据
```

### 资源获取锁

```python
from contextlib import contextmanager
import threading
import time

class ResourceManager:
    def __init__(self):
        self.lock = threading.Lock()
        self.resources = {}

    @contextmanager
    def acquire(self, resource_id, timeout=None):
        """获取资源锁"""
        acquired = self.lock.acquire(timeout=timeout)
        if not acquired:
            raise TimeoutError(f"Could not acquire lock for {resource_id}")

        try:
            if resource_id not in self.resources:
                self.resources[resource_id] = {"data": None}
            yield self.resources[resource_id]
        finally:
            self.lock.release()

# 使用
manager = ResourceManager()

with manager.acquire("user_123") as resource:
    resource["data"] = "updated"
```

## 与 JS 的关键差异

| 特性 | Python with | JavaScript |
|-----|------------|------------|
| 语法 | `with x as y:` | `try-finally` |
| 协议 | `__enter__/__exit__` | 无标准协议 |
| 装饰器 | `@contextmanager` | 无对应 |
| 多上下文 | `ExitStack` | 手动管理 |
| 异步 | `async with` | 无直接对应 |

```javascript
// JavaScript 未来可能的 using 语法 (Stage 3 提案)
{
    using file = new FileHandle('file.txt')
    // file 在块结束时自动关闭
}
```

## 小结

**创建上下文管理器**:
- 类: 实现 `__enter__` 和 `__exit__`
- 装饰器: `@contextmanager` + `yield`
- 异步: `@asynccontextmanager`

**内置工具**:
- `closing()`: 确保调用 `close()`
- `suppress()`: 抑制异常
- `redirect_stdout/stderr()`: 重定向输出
- `nullcontext()`: 空上下文

**高级功能**:
- `ExitStack`: 管理多个上下文
- `AsyncExitStack`: 异步版本
- `callback()`: 注册清理回调

::: tip 最佳实践
- 使用 `with` 语句管理资源
- 优先使用 `@contextmanager` 创建简单上下文
- 复杂场景使用 `ExitStack`
- 异步资源使用 `async with`
:::

::: info 相关内容
- [functools 高阶函数](../collections/functools.md) - 装饰器相关
:::

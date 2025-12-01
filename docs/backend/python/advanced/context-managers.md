---
title: 上下文管理器 Context Managers
description: Python 上下文管理器完整指南,with 语句与资源管理
---

# 上下文管理器 Context Managers

上下文管理器是 Python 用于资源管理的强大机制,通过 `with` 语句确保资源的正确获取和释放,即使发生异常也能保证清理代码执行。

## 什么是上下文管理器?

### 核心概念

```python
# 不使用上下文管理器 - 容易出错
f = open("file.txt")
try:
    content = f.read()
finally:
    f.close()  # 必须手动关闭

# 使用上下文管理器 - 自动管理资源
with open("file.txt") as f:
    content = f.read()
# 文件自动关闭,即使发生异常
```

```javascript
// JavaScript 传统方式
const f = fs.openSync('file.txt', 'r')
try {
  const content = fs.readFileSync(f)
} finally {
  fs.closeSync(f) // 手动关闭
}

// JavaScript using 提案 (TC39 Stage 3)
{
  using file = await openFile('file.txt')
  // 块结束时自动清理
}
```

### 为什么使用上下文管理器?

**优势**:

- ✅ **自动资源管理**: 确保资源正确释放
- ✅ **异常安全**: 即使发生异常也会执行清理
- ✅ **代码简洁**: 减少样板代码
- ✅ **可读性强**: 清晰表达资源生命周期
- ✅ **防止泄漏**: 避免忘记释放资源

## with 语句基础

### 文件操作

```python
# 读取文件
with open("data.txt", "r", encoding="utf-8") as f:
    content = f.read()
    print(content)
# 文件自动关闭

# 写入文件
with open("output.txt", "w", encoding="utf-8") as f:
    f.write("Hello, World!\n")
# 文件自动关闭并刷新缓冲区

# 同时打开多个文件
with open("input.txt") as fin, open("output.txt", "w") as fout:
    for line in fin:
        fout.write(line.upper())
# 两个文件都自动关闭
```

### 锁管理

```python
import threading

lock = threading.Lock()

# 手动管理锁 - 容易出错
lock.acquire()
try:
    # 临界区代码
    shared_resource.update()
finally:
    lock.release()

# 使用上下文管理器 - 自动释放
with lock:
    # 临界区代码
    shared_resource.update()
# 锁自动释放
```

### 数据库连接

```python
import sqlite3

# 使用上下文管理器管理事务
with sqlite3.connect("database.db") as conn:
    cursor = conn.cursor()
    cursor.execute("INSERT INTO users (name) VALUES (?)", ("Alice",))
    # 成功时自动 commit,失败时自动 rollback
```

## 创建自定义上下文管理器

### 方法1: 类实现

```python
import time

class Timer:
    """计时上下文管理器"""

    def __enter__(self):
        """进入上下文时调用"""
        self.start = time.perf_counter()
        print("Timer started")
        return self  # 返回值绑定到 as 变量

    def __exit__(self, exc_type, exc_val, exc_tb):
        """退出上下文时调用"""
        self.end = time.perf_counter()
        elapsed = self.end - self.start
        print(f"Elapsed: {elapsed:.4f}s")

        # 返回 False 表示异常会继续传播
        # 返回 True 表示异常被抑制
        return False

# 使用
with Timer() as timer:
    time.sleep(1)
    print("Working...")
# Timer started
# Working...
# Elapsed: 1.0012s

# 异常处理
class SafeOperation:
    def __enter__(self):
        print("Starting operation")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is not None:
            print(f"Exception occurred: {exc_type.__name__}: {exc_val}")
            # 返回 True 抑制异常
            return True
        print("Operation completed successfully")
        return False

with SafeOperation():
    raise ValueError("Something went wrong")
# Starting operation
# Exception occurred: ValueError: Something went wrong
# 异常被抑制,不会传播
```

### 方法2: 使用 @contextmanager

```python
from contextlib import contextmanager
import time

@contextmanager
def timer(name="Operation"):
    """简化版计时器"""
    start = time.perf_counter()
    print(f"{name} started")

    try:
        yield  # 暂停,执行 with 块中的代码
    finally:
        # 无论是否异常,都会执行
        end = time.perf_counter()
        print(f"{name} took {end - start:.4f}s")

# 使用
with timer("Data processing"):
    time.sleep(1)
    process_data()
# Data processing started
# Data processing took 1.0012s

# 带返回值
@contextmanager
def database_transaction(db_conn):
    """数据库事务管理器"""
    cursor = db_conn.cursor()
    try:
        yield cursor  # 返回 cursor 供 with 块使用
        db_conn.commit()  # 成功时提交
        print("Transaction committed")
    except Exception as e:
        db_conn.rollback()  # 失败时回滚
        print(f"Transaction rolled back: {e}")
        raise  # 重新抛出异常

with database_transaction(conn) as cursor:
    cursor.execute("INSERT INTO users ...")
    cursor.execute("UPDATE accounts ...")
```

## 常见上下文管理器应用

### 1. 临时目录切换

```python
import os
from contextlib import contextmanager

@contextmanager
def change_directory(path):
    """临时切换工作目录"""
    original_dir = os.getcwd()
    try:
        os.chdir(path)
        yield
    finally:
        os.chdir(original_dir)

# 使用
print(f"Current: {os.getcwd()}")
with change_directory("/tmp"):
    print(f"Inside with: {os.getcwd()}")
    # 在 /tmp 中执行操作
print(f"After with: {os.getcwd()}")
# 自动恢复到原目录
```

### 2. 临时环境变量

```python
import os
from contextlib import contextmanager

@contextmanager
def temporary_env_var(key, value):
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

with temporary_env_var("DEBUG", "true"):
    print(os.environ["DEBUG"])  # true
    run_tests()
# DEBUG 环境变量自动恢复
```

### 3. 临时文件

```python
import tempfile
import os

# 临时文件(自动删除)
with tempfile.NamedTemporaryFile(mode="w", delete=True) as tmp:
    tmp.write("Temporary data")
    tmp.flush()
    print(f"Temp file: {tmp.name}")
    process_file(tmp.name)
# 文件自动删除

# 临时目录
with tempfile.TemporaryDirectory() as tmpdir:
    print(f"Temp dir: {tmpdir}")
    # 在临时目录中创建文件
    filepath = os.path.join(tmpdir, "data.txt")
    with open(filepath, "w") as f:
        f.write("data")
# 临时目录及其内容自动删除
```

### 4. 性能分析

```python
import cProfile
from contextlib import contextmanager

@contextmanager
def profile(sort_by="cumulative"):
    """性能分析上下文管理器"""
    profiler = cProfile.Profile()
    profiler.enable()
    try:
        yield profiler
    finally:
        profiler.disable()
        profiler.print_stats(sort=sort_by)

with profile():
    # 需要分析的代码
    expensive_operation()
# 自动打印性能报告
```

### 5. 异常捕获与抑制

```python
from contextlib import suppress

# 抑制特定异常
with suppress(FileNotFoundError):
    os.remove("nonexistent.txt")
# 如果文件不存在,不会抛出异常

# 等价于
try:
    os.remove("nonexistent.txt")
except FileNotFoundError:
    pass

# 抑制多个异常
with suppress(KeyError, AttributeError, TypeError):
    result = data["key"].method()
```

### 6. 重定向标准输出

```python
from contextlib import redirect_stdout, redirect_stderr
import io

# 捕获标准输出
output = io.StringIO()
with redirect_stdout(output):
    print("This goes to StringIO")
    print("Not to console")

captured = output.getvalue()
print(f"Captured: {captured}")

# 重定向到文件
with open("output.log", "w") as f:
    with redirect_stdout(f):
        print("This goes to file")
        run_verbose_function()
```

### 7. 网络连接管理

```python
import socket
from contextlib import contextmanager

@contextmanager
def socket_connection(host, port):
    """管理 socket 连接"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        sock.connect((host, port))
        yield sock
    finally:
        sock.close()

with socket_connection("example.com", 80) as sock:
    sock.send(b"GET / HTTP/1.1\r\n\r\n")
    response = sock.recv(4096)
# Socket 自动关闭
```

## contextlib 模块工具

### closing

```python
from contextlib import closing
from urllib.request import urlopen

# 确保对象的 close() 方法被调用
with closing(urlopen("http://example.com")) as page:
    content = page.read()
# page.close() 自动调用

# 等价于
page = urlopen("http://example.com")
try:
    content = page.read()
finally:
    page.close()
```

### ExitStack (动态管理多个上下文)

```python
from contextlib import ExitStack

# 动态数量的文件
filenames = ["file1.txt", "file2.txt", "file3.txt"]

with ExitStack() as stack:
    files = [stack.enter_context(open(fname)) for fname in filenames]
    # 同时处理所有文件
    for f in files:
        print(f.read())
# 所有文件自动关闭

# 条件性上下文管理
with ExitStack() as stack:
    if need_transaction:
        db_context = stack.enter_context(database_transaction(conn))

    if need_lock:
        stack.enter_context(lock)

    # 根据条件使用不同的上下文管理器
    process_data()
```

### nullcontext (无操作上下文)

```python
from contextlib import nullcontext

def process_data(data, use_lock=True):
    """可选的锁"""
    lock = threading.Lock() if use_lock else nullcontext()

    with lock:
        # 处理数据
        data.append(1)

# 有锁
process_data(shared_data, use_lock=True)

# 无锁
process_data(local_data, use_lock=False)
```

## 异步上下文管理器

### async with 语句

```python
class AsyncResource:
    async def __aenter__(self):
        """异步进入"""
        print("Acquiring resource...")
        await asyncio.sleep(0.1)  # 模拟异步操作
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """异步退出"""
        print("Releasing resource...")
        await asyncio.sleep(0.1)  # 模拟异步清理
        return False

# 使用
async def main():
    async with AsyncResource() as resource:
        print("Using resource")
        await resource.do_something()

asyncio.run(main())
```

### @asynccontextmanager

```python
from contextlib import asynccontextmanager
import aiohttp

@asynccontextmanager
async def http_session():
    """异步 HTTP 会话管理器"""
    session = aiohttp.ClientSession()
    try:
        yield session
    finally:
        await session.close()

async def fetch_data(url):
    async with http_session() as session:
        async with session.get(url) as response:
            return await response.text()
```

## 上下文管理器最佳实践

### 1. 优先使用 @contextmanager

```python
# ✅ 好的做法:简单场景用装饰器
@contextmanager
def managed_resource():
    resource = acquire()
    try:
        yield resource
    finally:
        release(resource)

# ❌ 避免:简单场景不需要类
class ManagedResource:
    def __enter__(self):
        self.resource = acquire()
        return self.resource

    def __exit__(self, *args):
        release(self.resource)
```

### 2. 始终处理异常

```python
# ✅ 好的做法:finally 确保清理
@contextmanager
def safe_resource():
    resource = acquire()
    try:
        yield resource
    finally:
        # 即使发生异常也会清理
        release(resource)

# ❌ 避免:忘记 finally
@contextmanager
def unsafe_resource():
    resource = acquire()
    yield resource
    release(resource)  # 异常时不会执行
```

### 3. 明确异常传播

```python
@contextmanager
def transaction():
    begin_transaction()
    try:
        yield
        commit()  # 成功时提交
    except Exception:
        rollback()  # 失败时回滚
        raise  # 重新抛出异常
```

### 4. 使用 ExitStack 管理多个资源

```python
# ✅ 好的做法:使用 ExitStack
from contextlib import ExitStack

with ExitStack() as stack:
    f1 = stack.enter_context(open("file1.txt"))
    f2 = stack.enter_context(open("file2.txt"))
    lock = stack.enter_context(threading.Lock())
    # 所有资源自动清理

# ❌ 避免:嵌套 with
with open("file1.txt") as f1:
    with open("file2.txt") as f2:
        with threading.Lock():
            # 嵌套太深
            pass
```

## 对前端开发者

### 上下文管理器 vs JavaScript

| Python                  | JavaScript                | 说明         |
| ----------------------- | ------------------------- | ------------ |
| `with open(f) as file:` | `using file = openFile()` | 自动资源管理 |
| `@contextmanager`       | -                         | Python 独有  |
| `__enter__/__exit__`    | `[Symbol.dispose]()`      | 清理协议     |
| `try...finally`         | `try...finally`           | 手动清理     |
| `async with`            | `await using`             | 异步资源管理 |

### 使用场景对比

```python
# Python: 上下文管理器
with open("file.txt") as f:
    content = f.read()
# 自动关闭

@contextmanager
def timer():
    start = time.time()
    yield
    print(f"Elapsed: {time.time() - start}s")

with timer():
    process_data()
```

```javascript
// JavaScript: using 提案 (TC39 Stage 3)
{
  using file = openFile('file.txt')
  const content = file.read()
}
// 自动关闭

// JavaScript 传统方式: try-finally
const file = openFile('file.txt')
try {
  const content = file.read()
} finally {
  file.close()
}
```

### React Hooks 类比

```python
# Python 上下文管理器管理资源生命周期
@contextmanager
def use_database():
    conn = connect_db()
    try:
        yield conn
    finally:
        conn.close()

with use_database() as db:
    db.query("SELECT * FROM users")
```

```javascript
// React Hooks 管理组件生命周期
function useDatabase() {
  useEffect(() => {
    const conn = connectDB()
    return () => conn.close() // 清理函数
  }, [])
}
```

## 小结

- 上下文管理器确保资源正确获取和释放
- `with` 语句简化资源管理,保证异常安全
- 两种实现方式:类(`__enter__`/`__exit__`)或 `@contextmanager`
- `contextlib` 模块提供丰富的工具:suppress, redirect_stdout, ExitStack 等
- 异步上下文管理器使用 `async with` 和 `@asynccontextmanager`
- 适用场景:文件、锁、数据库事务、网络连接、临时状态等
- 类似 JavaScript 的 using 提案和 React 的清理机制

更多信息请参考:

- [PEP 343 - The "with" Statement](https://www.python.org/dev/peps/pep-0343/)
- [contextlib 文档](https://docs.python.org/3/library/contextlib.html)
- [Context Manager Types](https://docs.python.org/3/library/stdtypes.html#context-manager-types)

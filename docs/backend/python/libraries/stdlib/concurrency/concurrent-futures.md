---
title: concurrent.futures - 并发执行器
description: Python concurrent.futures 模块详解，高级并发接口
---

# concurrent.futures 并发执行器

## 学习目标

- 理解 Executor 抽象和 Future 对象
- 掌握线程池和进程池的使用
- 学会处理并发任务的结果
- 与 JavaScript Promise 对比

## 概述

| Python concurrent.futures | JavaScript | 说明 |
|--------------------------|------------|------|
| `Future` | `Promise` | 异步结果 |
| `ThreadPoolExecutor` | Worker Pool | 线程池 |
| `ProcessPoolExecutor` | 无直接对应 | 进程池 |
| `executor.submit()` | `new Promise()` | 提交任务 |
| `as_completed()` | `Promise.race()` 循环 | 按完成顺序 |
| `executor.map()` | `Promise.all()` | 批量执行 |

## 基本使用

### ThreadPoolExecutor - 线程池

```python
from concurrent.futures import ThreadPoolExecutor
import time

def task(name, delay):
    print(f"{name} starting")
    time.sleep(delay)
    return f"{name} completed"

# 创建线程池
with ThreadPoolExecutor(max_workers=3) as executor:
    # 提交单个任务
    future = executor.submit(task, "Task-1", 2)

    # 获取结果 (会阻塞)
    result = future.result()
    print(result)  # Task-1 completed
```

```javascript
// JavaScript 对比 - Promise
function task(name, delay) {
    return new Promise(resolve => {
        console.log(`${name} starting`)
        setTimeout(() => {
            resolve(`${name} completed`)
        }, delay)
    })
}

const result = await task('Task-1', 2000)
console.log(result)
```

### ProcessPoolExecutor - 进程池

```python
from concurrent.futures import ProcessPoolExecutor
import os

def cpu_bound_task(n):
    """CPU 密集型任务"""
    result = sum(i * i for i in range(n))
    return f"Process {os.getpid()}: {result}"

# 进程池 - 适合 CPU 密集型任务
if __name__ == '__main__':
    with ProcessPoolExecutor(max_workers=4) as executor:
        futures = [executor.submit(cpu_bound_task, 10**6) for _ in range(4)]

        for future in futures:
            print(future.result())
```

::: warning 注意
`ProcessPoolExecutor` 必须在 `if __name__ == '__main__':` 中使用，否则在 Windows 上会报错。
:::

## Future 对象

### Future 的状态和方法

```python
from concurrent.futures import ThreadPoolExecutor
import time

def slow_task():
    time.sleep(2)
    return "done"

with ThreadPoolExecutor() as executor:
    future = executor.submit(slow_task)

    # 检查状态
    print(future.done())      # False - 是否完成
    print(future.running())   # True - 是否正在运行
    print(future.cancelled()) # False - 是否被取消

    # 获取结果 (带超时)
    try:
        result = future.result(timeout=1)
    except TimeoutError:
        print("Timeout!")

    # 等待完成后获取
    result = future.result()
    print(result)  # done
```

```javascript
// JavaScript Promise 对比
const promise = new Promise(resolve => {
    setTimeout(() => resolve('done'), 2000)
})

// Promise 没有 done/running 方法
// 但可以用 Promise.race 实现超时
const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), 1000)
)

try {
    const result = await Promise.race([promise, timeout])
} catch (e) {
    console.log('Timeout!')
}
```

### 添加回调

```python
from concurrent.futures import ThreadPoolExecutor
import time

def task():
    time.sleep(1)
    return 42

def callback(future):
    """任务完成时调用"""
    print(f"Callback: result = {future.result()}")

with ThreadPoolExecutor() as executor:
    future = executor.submit(task)
    future.add_done_callback(callback)

    # 继续其他工作...
    print("Doing other work...")

# 输出:
# Doing other work...
# Callback: result = 42
```

```javascript
// JavaScript - then 回调
const promise = new Promise(resolve => {
    setTimeout(() => resolve(42), 1000)
})

promise.then(result => {
    console.log(`Callback: result = ${result}`)
})

console.log('Doing other work...')
```

### 取消任务

```python
from concurrent.futures import ThreadPoolExecutor
import time

def task():
    time.sleep(10)
    return "completed"

with ThreadPoolExecutor(max_workers=1) as executor:
    future1 = executor.submit(task)  # 立即开始
    future2 = executor.submit(task)  # 排队等待

    # 尝试取消
    print(future1.cancel())  # False - 已经开始，无法取消
    print(future2.cancel())  # True - 还在队列中，可以取消

    print(future2.cancelled())  # True
```

## 批量执行

### executor.map - 批量映射

```python
from concurrent.futures import ThreadPoolExecutor
import time

def process(item):
    time.sleep(1)
    return item * 2

items = [1, 2, 3, 4, 5]

# map 方法 - 保持顺序
with ThreadPoolExecutor(max_workers=3) as executor:
    results = executor.map(process, items)
    print(list(results))  # [2, 4, 6, 8, 10]
```

```javascript
// JavaScript 对比 - Promise.all
async function process(item) {
    await new Promise(r => setTimeout(r, 1000))
    return item * 2
}

const items = [1, 2, 3, 4, 5]
const results = await Promise.all(items.map(process))
console.log(results)  // [2, 4, 6, 8, 10]
```

### as_completed - 按完成顺序

```python
from concurrent.futures import ThreadPoolExecutor, as_completed
import time
import random

def task(name):
    delay = random.uniform(0.5, 2)
    time.sleep(delay)
    return f"{name} (took {delay:.2f}s)"

with ThreadPoolExecutor(max_workers=3) as executor:
    futures = {
        executor.submit(task, f"Task-{i}"): i
        for i in range(5)
    }

    # 按完成顺序处理结果
    for future in as_completed(futures):
        task_id = futures[future]
        result = future.result()
        print(f"Completed: {result}")
```

```javascript
// JavaScript - 模拟 as_completed
async function* asCompleted(promises) {
    const remaining = [...promises]
    while (remaining.length > 0) {
        const winner = await Promise.race(
            remaining.map((p, i) => p.then(() => i))
        )
        yield remaining[winner]
        remaining.splice(winner, 1)
    }
}

// 使用
const tasks = [task('Task-1'), task('Task-2'), task('Task-3')]
for await (const result of asCompleted(tasks)) {
    console.log(`Completed: ${await result}`)
}
```

### wait - 等待完成

```python
from concurrent.futures import ThreadPoolExecutor, wait, FIRST_COMPLETED, ALL_COMPLETED
import time

def task(n):
    time.sleep(n)
    return n

with ThreadPoolExecutor() as executor:
    futures = [executor.submit(task, i) for i in [3, 1, 2]]

    # 等待第一个完成
    done, not_done = wait(futures, return_when=FIRST_COMPLETED)
    print(f"First completed: {done.pop().result()}")  # 1

    # 等待全部完成
    done, not_done = wait(futures, return_when=ALL_COMPLETED)
    print(f"All done: {len(done)}")  # 3

    # 带超时等待
    done, not_done = wait(futures, timeout=1.5)
```

## 异常处理

### 捕获任务异常

```python
from concurrent.futures import ThreadPoolExecutor

def risky_task(n):
    if n == 0:
        raise ValueError("Cannot process zero")
    return 100 / n

with ThreadPoolExecutor() as executor:
    futures = [executor.submit(risky_task, i) for i in [2, 0, 5]]

    for future in futures:
        try:
            result = future.result()
            print(f"Result: {result}")
        except ValueError as e:
            print(f"Error: {e}")
        except Exception as e:
            print(f"Unexpected error: {e}")

# 输出:
# Result: 50.0
# Error: Cannot process zero
# Result: 20.0
```

```javascript
// JavaScript 对比
async function riskyTask(n) {
    if (n === 0) throw new Error('Cannot process zero')
    return 100 / n
}

const promises = [2, 0, 5].map(riskyTask)

for (const promise of promises) {
    try {
        const result = await promise
        console.log(`Result: ${result}`)
    } catch (e) {
        console.log(`Error: ${e.message}`)
    }
}
```

### exception() 方法

```python
from concurrent.futures import ThreadPoolExecutor

def failing_task():
    raise RuntimeError("Task failed!")

with ThreadPoolExecutor() as executor:
    future = executor.submit(failing_task)

    # 获取异常而不抛出
    exception = future.exception()
    if exception:
        print(f"Task raised: {type(exception).__name__}: {exception}")
    else:
        print(f"Result: {future.result()}")
```

## 实用示例

### 并发 HTTP 请求

```python
from concurrent.futures import ThreadPoolExecutor, as_completed
import urllib.request
import time

def fetch_url(url):
    """获取 URL 内容"""
    start = time.time()
    with urllib.request.urlopen(url, timeout=10) as response:
        data = response.read()
        return {
            'url': url,
            'size': len(data),
            'time': time.time() - start
        }

urls = [
    'https://httpbin.org/delay/1',
    'https://httpbin.org/delay/2',
    'https://httpbin.org/get',
    'https://httpbin.org/headers',
]

start = time.time()

with ThreadPoolExecutor(max_workers=4) as executor:
    future_to_url = {executor.submit(fetch_url, url): url for url in urls}

    for future in as_completed(future_to_url):
        url = future_to_url[future]
        try:
            data = future.result()
            print(f"{url}: {data['size']} bytes in {data['time']:.2f}s")
        except Exception as e:
            print(f"{url}: Error - {e}")

print(f"\nTotal time: {time.time() - start:.2f}s")
```

### 带进度条的并发处理

```python
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

def process_item(item):
    time.sleep(0.5)  # 模拟处理
    return item * 2

def process_with_progress(items, max_workers=4):
    """带进度显示的并发处理"""
    results = []
    total = len(items)

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(process_item, item): item for item in items}

        for i, future in enumerate(as_completed(futures), 1):
            result = future.result()
            results.append(result)

            # 显示进度
            progress = i / total * 100
            print(f"\rProgress: {progress:.1f}% ({i}/{total})", end='')

    print()  # 换行
    return results

items = list(range(20))
results = process_with_progress(items)
print(f"Results: {results[:5]}...")
```

### 限制并发数的下载器

```python
from concurrent.futures import ThreadPoolExecutor
import threading
import time

class RateLimitedExecutor:
    """限制并发数和速率的执行器"""

    def __init__(self, max_workers=5, rate_limit=10):
        self.executor = ThreadPoolExecutor(max_workers=max_workers)
        self.semaphore = threading.Semaphore(rate_limit)

    def submit(self, fn, *args, **kwargs):
        def rate_limited():
            with self.semaphore:
                return fn(*args, **kwargs)
        return self.executor.submit(rate_limited)

    def shutdown(self, wait=True):
        self.executor.shutdown(wait=wait)

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.shutdown()

# 使用
def download(url):
    print(f"Downloading {url}")
    time.sleep(1)
    return f"Downloaded {url}"

urls = [f"http://example.com/{i}" for i in range(20)]

with RateLimitedExecutor(max_workers=3, rate_limit=5) as executor:
    futures = [executor.submit(download, url) for url in urls]
    for future in futures:
        print(future.result())
```

### 并行计算 (进程池)

```python
from concurrent.futures import ProcessPoolExecutor
import math

def is_prime(n):
    """检查是否为质数"""
    if n < 2:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False
    for i in range(3, int(math.sqrt(n)) + 1, 2):
        if n % i == 0:
            return False
    return True

def find_primes_in_range(start, end):
    """在范围内找质数"""
    return [n for n in range(start, end) if is_prime(n)]

if __name__ == '__main__':
    import time

    # 将范围分成多个块
    ranges = [(i, i + 100000) for i in range(0, 1000000, 100000)]

    # 串行
    start = time.time()
    serial_result = []
    for r in ranges:
        serial_result.extend(find_primes_in_range(*r))
    print(f"Serial: {time.time() - start:.2f}s, found {len(serial_result)} primes")

    # 并行
    start = time.time()
    with ProcessPoolExecutor() as executor:
        results = executor.map(lambda r: find_primes_in_range(*r), ranges)
        parallel_result = []
        for r in results:
            parallel_result.extend(r)
    print(f"Parallel: {time.time() - start:.2f}s, found {len(parallel_result)} primes")
```

### 超时和重试

```python
from concurrent.futures import ThreadPoolExecutor, TimeoutError
import time
import random

def unreliable_task():
    """不可靠的任务"""
    if random.random() < 0.5:
        raise RuntimeError("Random failure")
    time.sleep(random.uniform(0.5, 2))
    return "success"

def run_with_retry(executor, fn, max_retries=3, timeout=3):
    """带重试和超时的任务执行"""
    for attempt in range(max_retries):
        future = executor.submit(fn)
        try:
            result = future.result(timeout=timeout)
            return result
        except TimeoutError:
            print(f"Attempt {attempt + 1}: Timeout")
            future.cancel()
        except Exception as e:
            print(f"Attempt {attempt + 1}: {e}")

    raise RuntimeError(f"Failed after {max_retries} attempts")

with ThreadPoolExecutor() as executor:
    try:
        result = run_with_retry(executor, unreliable_task)
        print(f"Final result: {result}")
    except RuntimeError as e:
        print(f"All attempts failed: {e}")
```

## 线程池 vs 进程池

| 特性 | ThreadPoolExecutor | ProcessPoolExecutor |
|-----|-------------------|---------------------|
| GIL | 受限 | 不受限 |
| 适用 | I/O 密集型 | CPU 密集型 |
| 开销 | 低 | 高 |
| 数据共享 | 共享内存 | 需要序列化 |
| 启动速度 | 快 | 慢 |

## 与 JS 的关键差异

| 特性 | Python Future | JavaScript Promise |
|-----|--------------|-------------------|
| 状态检查 | `done()`, `running()` | 无直接方法 |
| 取消 | `cancel()` | `AbortController` |
| 异常获取 | `exception()` | `catch()` |
| 批量等待 | `wait()`, `as_completed()` | `Promise.all()`, `Promise.race()` |
| 超时 | `result(timeout=)` | `Promise.race()` |

## 小结

**执行器**:
- `ThreadPoolExecutor`: 线程池，I/O 密集型
- `ProcessPoolExecutor`: 进程池，CPU 密集型

**Future 方法**:
- `result()`: 获取结果
- `exception()`: 获取异常
- `done()`: 检查完成
- `cancel()`: 取消任务
- `add_done_callback()`: 添加回调

**等待函数**:
- `as_completed()`: 按完成顺序迭代
- `wait()`: 等待多个 Future
- `executor.map()`: 批量映射

::: tip 最佳实践
- I/O 密集型使用 `ThreadPoolExecutor`
- CPU 密集型使用 `ProcessPoolExecutor`
- 使用 `with` 语句确保资源释放
- 使用 `as_completed` 尽早处理结果
:::

::: info 相关内容
- [threading 多线程](./threading.md) - 底层线程 API
:::

---
title: threading - 多线程编程
description: Python threading 模块详解，线程创建、同步和通信
---

# threading 多线程编程

## 学习目标

- 理解 Python 线程模型和 GIL
- 掌握线程创建和管理
- 学会线程同步机制
- 与 JavaScript 并发模型对比

## 概述

| Python threading | JavaScript | 说明 |
|-----------------|------------|------|
| `Thread` | `Worker` | 创建线程 |
| `Lock` | 无需 (单线程) | 互斥锁 |
| `Event` | `EventTarget` | 事件通知 |
| `Queue` | 无直接对应 | 线程安全队列 |
| GIL | 无 | 全局解释器锁 |

::: warning 关于 GIL
Python 的 GIL (Global Interpreter Lock) 使得同一时刻只有一个线程执行 Python 字节码。
- **I/O 密集型任务**: 线程有效，I/O 期间释放 GIL
- **CPU 密集型任务**: 线程无效，应使用 `multiprocessing`
:::

## 创建线程

### 函数方式

```python
import threading
import time

def worker(name, delay):
    """工作函数"""
    print(f"{name} starting")
    time.sleep(delay)
    print(f"{name} finished")

# 创建线程
t1 = threading.Thread(target=worker, args=("Thread-1", 2))
t2 = threading.Thread(target=worker, args=("Thread-2", 1))

# 启动线程
t1.start()
t2.start()

# 等待线程完成
t1.join()
t2.join()

print("All threads completed")
```

```javascript
// JavaScript 对比 - Web Worker
// main.js
const worker = new Worker('worker.js')
worker.postMessage({ name: 'Worker-1', delay: 2000 })
worker.onmessage = (e) => console.log(e.data)

// worker.js
self.onmessage = (e) => {
    const { name, delay } = e.data
    console.log(`${name} starting`)
    setTimeout(() => {
        self.postMessage(`${name} finished`)
    }, delay)
}
```

### 类继承方式

```python
import threading

class MyThread(threading.Thread):
    def __init__(self, name, count):
        super().__init__()
        self.name = name
        self.count = count
        self.result = None

    def run(self):
        """线程执行的代码"""
        total = 0
        for i in range(self.count):
            total += i
        self.result = total

# 使用
thread = MyThread("Counter", 1000000)
thread.start()
thread.join()
print(f"Result: {thread.result}")
```

### 守护线程

```python
import threading
import time

def background_task():
    """后台任务"""
    while True:
        print("Background running...")
        time.sleep(1)

# 守护线程会在主线程结束时自动终止
daemon = threading.Thread(target=background_task, daemon=True)
daemon.start()

time.sleep(3)
print("Main thread ending")
# 程序结束，守护线程自动终止
```

## 线程同步

### Lock - 互斥锁

```python
import threading

counter = 0
lock = threading.Lock()

def increment():
    global counter
    for _ in range(100000):
        # 获取锁
        lock.acquire()
        try:
            counter += 1
        finally:
            # 释放锁
            lock.release()

# 更推荐的写法：使用 with
def increment_better():
    global counter
    for _ in range(100000):
        with lock:  # 自动获取和释放锁
            counter += 1

# 测试
threads = [threading.Thread(target=increment_better) for _ in range(5)]
for t in threads:
    t.start()
for t in threads:
    t.join()

print(f"Counter: {counter}")  # 500000
```

```javascript
// JavaScript 单线程不需要锁
// 但 SharedArrayBuffer + Atomics 提供原子操作
const sab = new SharedArrayBuffer(4)
const counter = new Int32Array(sab)

// 原子操作
Atomics.add(counter, 0, 1)
```

### RLock - 可重入锁

```python
import threading

# 普通 Lock 不能重复获取
lock = threading.Lock()

def outer():
    with lock:
        print("outer")
        # inner()  # 会死锁！

# RLock 允许同一线程多次获取
rlock = threading.RLock()

def outer_safe():
    with rlock:
        print("outer")
        inner_safe()  # 可以！

def inner_safe():
    with rlock:
        print("inner")

outer_safe()
# outer
# inner
```

### Semaphore - 信号量

```python
import threading
import time

# 限制同时访问资源的线程数
semaphore = threading.Semaphore(3)  # 最多 3 个线程同时访问

def limited_resource(name):
    with semaphore:
        print(f"{name} acquired")
        time.sleep(2)
        print(f"{name} released")

# 创建 10 个线程，但同时只有 3 个能访问
threads = [
    threading.Thread(target=limited_resource, args=(f"Thread-{i}",))
    for i in range(10)
]

for t in threads:
    t.start()
for t in threads:
    t.join()
```

### Event - 事件通知

```python
import threading
import time

event = threading.Event()

def waiter(name):
    print(f"{name} waiting for event...")
    event.wait()  # 阻塞直到事件被设置
    print(f"{name} received event!")

def setter():
    time.sleep(2)
    print("Setting event")
    event.set()  # 设置事件，唤醒所有等待的线程

# 启动等待线程
threads = [threading.Thread(target=waiter, args=(f"Waiter-{i}",)) for i in range(3)]
for t in threads:
    t.start()

# 启动设置线程
threading.Thread(target=setter).start()

for t in threads:
    t.join()
```

```javascript
// JavaScript 对比 - Promise/async-await
let resolveEvent
const eventPromise = new Promise(resolve => {
    resolveEvent = resolve
})

async function waiter(name) {
    console.log(`${name} waiting...`)
    await eventPromise
    console.log(`${name} received event!`)
}

// 等待
waiter('Waiter-1')
waiter('Waiter-2')

// 2秒后触发
setTimeout(() => {
    console.log('Setting event')
    resolveEvent()
}, 2000)
```

### Condition - 条件变量

```python
import threading
import time

condition = threading.Condition()
items = []

def producer():
    for i in range(5):
        time.sleep(1)
        with condition:
            items.append(i)
            print(f"Produced: {i}")
            condition.notify()  # 通知一个等待的线程

def consumer():
    while True:
        with condition:
            while not items:  # 使用 while 防止虚假唤醒
                condition.wait()  # 等待通知
            item = items.pop(0)
            print(f"Consumed: {item}")
            if item == 4:
                break

# 启动
t1 = threading.Thread(target=producer)
t2 = threading.Thread(target=consumer)
t2.start()
t1.start()
t1.join()
t2.join()
```

### Barrier - 栅栏

```python
import threading
import time
import random

# 等待所有线程到达后再继续
barrier = threading.Barrier(3)

def worker(name):
    # 准备阶段
    prep_time = random.uniform(0.5, 2)
    print(f"{name} preparing ({prep_time:.1f}s)")
    time.sleep(prep_time)

    print(f"{name} waiting at barrier")
    barrier.wait()  # 等待所有线程到达

    print(f"{name} passed barrier, continuing")

threads = [threading.Thread(target=worker, args=(f"Worker-{i}",)) for i in range(3)]
for t in threads:
    t.start()
for t in threads:
    t.join()
```

## 线程安全数据结构

### Queue - 线程安全队列

```python
import threading
import queue
import time

# 创建队列
q = queue.Queue(maxsize=10)

def producer():
    for i in range(5):
        q.put(i)  # 线程安全的放入
        print(f"Produced: {i}")
        time.sleep(0.5)
    q.put(None)  # 结束信号

def consumer():
    while True:
        item = q.get()  # 线程安全的取出，会阻塞
        if item is None:
            break
        print(f"Consumed: {item}")
        q.task_done()  # 标记任务完成

t1 = threading.Thread(target=producer)
t2 = threading.Thread(target=consumer)
t1.start()
t2.start()
t1.join()
t2.join()
```

### 不同类型的队列

```python
import queue

# FIFO 队列 (先进先出)
fifo = queue.Queue()
fifo.put(1)
fifo.put(2)
print(fifo.get())  # 1

# LIFO 队列 (后进先出，栈)
lifo = queue.LifoQueue()
lifo.put(1)
lifo.put(2)
print(lifo.get())  # 2

# 优先级队列
pq = queue.PriorityQueue()
pq.put((2, "low priority"))
pq.put((1, "high priority"))
pq.put((3, "lowest priority"))
print(pq.get())  # (1, 'high priority')

# 非阻塞操作
try:
    item = fifo.get_nowait()  # 不阻塞
except queue.Empty:
    print("Queue is empty")
```

## 线程本地数据

### local - 线程局部存储

```python
import threading

# 每个线程有独立的数据副本
local_data = threading.local()

def worker(name):
    local_data.name = name  # 每个线程独立
    process()

def process():
    # 访问当前线程的数据
    print(f"Processing for {local_data.name}")

threads = [
    threading.Thread(target=worker, args=(f"Thread-{i}",))
    for i in range(3)
]
for t in threads:
    t.start()
for t in threads:
    t.join()
```

```javascript
// JavaScript - AsyncLocalStorage (Node.js)
const { AsyncLocalStorage } = require('async_hooks')
const asyncLocalStorage = new AsyncLocalStorage()

function process() {
    const store = asyncLocalStorage.getStore()
    console.log(`Processing for ${store.name}`)
}

asyncLocalStorage.run({ name: 'Worker-1' }, () => {
    process()
})
```

## 实用示例

### 线程池模式

```python
import threading
import queue
import time

class ThreadPool:
    def __init__(self, num_workers):
        self.tasks = queue.Queue()
        self.workers = []
        for _ in range(num_workers):
            worker = threading.Thread(target=self._worker)
            worker.daemon = True
            worker.start()
            self.workers.append(worker)

    def _worker(self):
        while True:
            func, args, kwargs = self.tasks.get()
            try:
                func(*args, **kwargs)
            except Exception as e:
                print(f"Error: {e}")
            finally:
                self.tasks.task_done()

    def submit(self, func, *args, **kwargs):
        self.tasks.put((func, args, kwargs))

    def wait(self):
        self.tasks.join()

# 使用
def process_item(item):
    print(f"Processing {item}")
    time.sleep(1)
    print(f"Done {item}")

pool = ThreadPool(3)
for i in range(10):
    pool.submit(process_item, i)
pool.wait()
print("All tasks completed")
```

### 生产者-消费者模式

```python
import threading
import queue
import time
import random

def producer(q, producer_id):
    for i in range(5):
        item = f"item-{producer_id}-{i}"
        q.put(item)
        print(f"Producer {producer_id} produced {item}")
        time.sleep(random.uniform(0.1, 0.5))
    q.put(None)  # 结束信号

def consumer(q, consumer_id, num_producers):
    finished_producers = 0
    while finished_producers < num_producers:
        item = q.get()
        if item is None:
            finished_producers += 1
        else:
            print(f"Consumer {consumer_id} consumed {item}")
            time.sleep(random.uniform(0.2, 0.6))
        q.task_done()

# 运行
q = queue.Queue()
num_producers = 2

producers = [
    threading.Thread(target=producer, args=(q, i))
    for i in range(num_producers)
]
consumer_thread = threading.Thread(target=consumer, args=(q, 0, num_producers))

for p in producers:
    p.start()
consumer_thread.start()

for p in producers:
    p.join()
consumer_thread.join()
```

### 超时控制

```python
import threading
import time

def long_running_task():
    time.sleep(10)
    return "completed"

# 使用线程实现超时
def run_with_timeout(func, timeout):
    result = [None]
    exception = [None]

    def wrapper():
        try:
            result[0] = func()
        except Exception as e:
            exception[0] = e

    thread = threading.Thread(target=wrapper)
    thread.start()
    thread.join(timeout=timeout)

    if thread.is_alive():
        raise TimeoutError("Operation timed out")

    if exception[0]:
        raise exception[0]

    return result[0]

try:
    result = run_with_timeout(long_running_task, timeout=2)
except TimeoutError as e:
    print(e)  # Operation timed out
```

### 并发下载

```python
import threading
import urllib.request
import time

def download(url, results, index):
    """下载 URL 内容"""
    try:
        start = time.time()
        with urllib.request.urlopen(url, timeout=10) as response:
            data = response.read()
            elapsed = time.time() - start
            results[index] = (url, len(data), elapsed)
    except Exception as e:
        results[index] = (url, 0, str(e))

def parallel_download(urls):
    """并行下载多个 URL"""
    results = [None] * len(urls)
    threads = []

    for i, url in enumerate(urls):
        t = threading.Thread(target=download, args=(url, results, i))
        threads.append(t)
        t.start()

    for t in threads:
        t.join()

    return results

# 使用
urls = [
    "https://httpbin.org/delay/1",
    "https://httpbin.org/delay/2",
    "https://httpbin.org/delay/1",
]

start = time.time()
results = parallel_download(urls)
print(f"Total time: {time.time() - start:.2f}s")
# 并行下载约 2 秒，串行需要 4 秒

for url, size, elapsed in results:
    print(f"{url}: {size} bytes in {elapsed}")
```

## 线程调试

### 获取线程信息

```python
import threading
import time

def worker():
    time.sleep(5)

# 创建线程
t = threading.Thread(target=worker, name="MyWorker")
t.start()

# 当前线程信息
current = threading.current_thread()
print(f"Current thread: {current.name}")

# 主线程
main = threading.main_thread()
print(f"Main thread: {main.name}")

# 所有活动线程
print(f"Active threads: {threading.active_count()}")
for thread in threading.enumerate():
    print(f"  - {thread.name}: alive={thread.is_alive()}")
```

## Python vs JavaScript 并发模型

| 特性 | Python threading | JavaScript |
|-----|-----------------|------------|
| 模型 | 多线程 (受 GIL 限制) | 单线程 + 事件循环 |
| 真并行 | 仅 I/O 操作 | Web Workers |
| 共享内存 | 是 (需要锁) | SharedArrayBuffer |
| 适用场景 | I/O 密集型 | 异步 I/O |
| 同步原语 | Lock, Event, Condition | Promise, async/await |
| CPU 密集 | 使用 multiprocessing | Worker Threads |

## 小结

**线程创建**:
- `Thread(target=func)`: 函数方式
- 继承 `Thread` 类: 面向对象方式
- `daemon=True`: 守护线程

**同步原语**:
- `Lock`: 互斥锁
- `RLock`: 可重入锁
- `Semaphore`: 信号量
- `Event`: 事件通知
- `Condition`: 条件变量
- `Barrier`: 栅栏

**线程安全**:
- `queue.Queue`: 线程安全队列
- `threading.local`: 线程本地存储

::: tip 最佳实践
- I/O 密集型用 `threading`，CPU 密集型用 `multiprocessing`
- 优先使用 `concurrent.futures` 高级 API
- 使用 `with` 语句管理锁
- 使用 `Queue` 而非共享变量通信
:::

::: info 相关内容
- [concurrent.futures 并发执行器](./concurrent-futures.md) - 高级并发接口
:::

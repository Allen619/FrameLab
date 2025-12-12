---
title: multiprocessing - 多进程编程
description: Python multiprocessing 模块详解，实现多进程并行计算
---

# multiprocessing 多进程编程

## 学习目标

- 理解进程与线程的区别
- 掌握 Process、Pool 的使用
- 学会进程间通信 (Queue, Pipe)
- 对比 Node.js 的 worker_threads 和 cluster

## 概览

| Python multiprocessing | Node.js | 说明 |
|----------------------|---------|------|
| `Process` | `child_process.fork()` | 创建子进程 |
| `Pool` | Worker pool 库 | 进程池 |
| `Queue` | 无直接对应 | 进程安全队列 |
| `Pipe` | IPC 通道 | 管道通信 |
| `Manager` | 无直接对应 | 共享状态管理 |

::: tip 何时使用
- **CPU 密集型**: 大量数据计算、图像处理 → 用 `multiprocessing`
- **I/O 密集型**: 网络请求、文件读写 → 用 `threading` 或 `asyncio`

Python 的 GIL 限制了多线程 CPU 并行，多进程可绕过此限制
:::

## 基础用法

### 创建进程

```python
from multiprocessing import Process
import os

def worker(name):
    """子进程执行的函数"""
    print(f"Worker {name}, PID: {os.getpid()}, Parent PID: {os.getppid()}")

if __name__ == '__main__':
    print(f"Main process PID: {os.getpid()}")

    # 创建进程
    p1 = Process(target=worker, args=('A',))
    p2 = Process(target=worker, args=('B',))

    # 启动进程
    p1.start()
    p2.start()

    # 等待进程结束
    p1.join()
    p2.join()

    print("All workers finished")
```

```javascript
// Node.js 对比
const { fork } = require('child_process')

// 主进程
console.log(`Main process PID: ${process.pid}`)

const worker1 = fork('./worker.js', ['A'])
const worker2 = fork('./worker.js', ['B'])

// worker.js
// console.log(`Worker ${process.argv[2]}, PID: ${process.pid}`)
```

### 进程类继承

```python
from multiprocessing import Process

class MyProcess(Process):
    def __init__(self, name):
        super().__init__()
        self.name = name

    def run(self):
        """重写 run 方法"""
        print(f"Process {self.name} is running")
        # 执行任务...

if __name__ == '__main__':
    processes = [MyProcess(f"Worker-{i}") for i in range(3)]

    for p in processes:
        p.start()

    for p in processes:
        p.join()
```

### 进程属性

```python
from multiprocessing import Process, current_process
import time

def task():
    proc = current_process()
    print(f"Name: {proc.name}")
    print(f"PID: {proc.pid}")
    print(f"Is alive: {proc.is_alive()}")
    time.sleep(1)

if __name__ == '__main__':
    p = Process(target=task, name="MyWorker")
    print(f"Before start - alive: {p.is_alive()}")  # False

    p.start()
    print(f"After start - alive: {p.is_alive()}")   # True

    p.join()
    print(f"After join - alive: {p.is_alive()}")    # False

    # 获取退出码
    print(f"Exit code: {p.exitcode}")  # 0 表示正常退出
```

## 进程池 Pool

### 基础用法

```python
from multiprocessing import Pool
import time

def square(x):
    time.sleep(0.5)  # 模拟耗时操作
    return x * x

if __name__ == '__main__':
    # 创建包含 4 个工作进程的池
    with Pool(4) as pool:
        # map - 阻塞，返回结果列表
        results = pool.map(square, range(10))
        print(results)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

        # map_async - 非阻塞
        async_result = pool.map_async(square, range(5))
        # 做其他事情...
        results = async_result.get()  # 获取结果
        print(results)
```

### apply 和 starmap

```python
from multiprocessing import Pool

def add(a, b):
    return a + b

def process_item(item):
    return item['value'] * 2

if __name__ == '__main__':
    with Pool(4) as pool:
        # apply - 单个任务，阻塞
        result = pool.apply(add, (1, 2))
        print(result)  # 3

        # apply_async - 单个任务，非阻塞
        async_result = pool.apply_async(add, (3, 4))
        print(async_result.get())  # 7

        # starmap - 多参数版 map
        pairs = [(1, 2), (3, 4), (5, 6)]
        results = pool.starmap(add, pairs)
        print(results)  # [3, 7, 11]

        # imap - 惰性迭代器版本
        for result in pool.imap(process_item, [{'value': i} for i in range(5)]):
            print(result)  # 0, 2, 4, 6, 8
```

### 进度回调

```python
from multiprocessing import Pool
from tqdm import tqdm

def task(x):
    return x * x

if __name__ == '__main__':
    items = range(100)

    with Pool(4) as pool:
        # 使用 imap_unordered 获取完成的结果
        results = []
        with tqdm(total=len(items)) as pbar:
            for result in pool.imap_unordered(task, items):
                results.append(result)
                pbar.update()

        print(f"Processed {len(results)} items")
```

## 进程间通信

### Queue

```python
from multiprocessing import Process, Queue
import time

def producer(queue, items):
    """生产者进程"""
    for item in items:
        print(f"Producing: {item}")
        queue.put(item)
        time.sleep(0.1)
    queue.put(None)  # 结束信号

def consumer(queue):
    """消费者进程"""
    while True:
        item = queue.get()
        if item is None:
            break
        print(f"Consuming: {item}")
        time.sleep(0.2)

if __name__ == '__main__':
    queue = Queue()

    # 创建生产者和消费者
    prod = Process(target=producer, args=(queue, range(5)))
    cons = Process(target=consumer, args=(queue,))

    prod.start()
    cons.start()

    prod.join()
    cons.join()
```

### Pipe

```python
from multiprocessing import Process, Pipe

def sender(conn):
    """发送端"""
    messages = ['Hello', 'World', 'Done']
    for msg in messages:
        conn.send(msg)
        print(f"Sent: {msg}")
    conn.close()

def receiver(conn):
    """接收端"""
    while True:
        try:
            msg = conn.recv()
            print(f"Received: {msg}")
            if msg == 'Done':
                break
        except EOFError:
            break
    conn.close()

if __name__ == '__main__':
    # 创建管道，返回两端连接
    parent_conn, child_conn = Pipe()

    p1 = Process(target=sender, args=(parent_conn,))
    p2 = Process(target=receiver, args=(child_conn,))

    p1.start()
    p2.start()

    p1.join()
    p2.join()
```

### Manager - 共享状态

```python
from multiprocessing import Process, Manager

def worker(shared_dict, shared_list, lock, worker_id):
    """修改共享数据"""
    with lock:
        shared_dict[worker_id] = worker_id * 10
        shared_list.append(worker_id)

if __name__ == '__main__':
    with Manager() as manager:
        # 创建共享数据结构
        shared_dict = manager.dict()
        shared_list = manager.list()
        lock = manager.Lock()

        processes = []
        for i in range(5):
            p = Process(target=worker, args=(shared_dict, shared_list, lock, i))
            processes.append(p)
            p.start()

        for p in processes:
            p.join()

        print(f"Dict: {dict(shared_dict)}")  # {0: 0, 1: 10, 2: 20, 3: 30, 4: 40}
        print(f"List: {list(shared_list)}")  # [0, 1, 2, 3, 4] (顺序可能不同)
```

## 共享内存

### Value 和 Array

```python
from multiprocessing import Process, Value, Array

def increment(counter, array):
    """修改共享值"""
    for _ in range(1000):
        counter.value += 1

    for i in range(len(array)):
        array[i] += 1

if __name__ == '__main__':
    # 共享整数 ('i' = int)
    counter = Value('i', 0)

    # 共享数组 ('d' = double)
    array = Array('d', [0.0, 1.0, 2.0])

    processes = [Process(target=increment, args=(counter, array)) for _ in range(4)]

    for p in processes:
        p.start()
    for p in processes:
        p.join()

    print(f"Counter: {counter.value}")  # 可能不是 4000 (需要锁)
    print(f"Array: {array[:]}")
```

### 带锁的共享内存

```python
from multiprocessing import Process, Value, Lock

def safe_increment(counter, lock):
    """线程安全的递增"""
    for _ in range(1000):
        with lock:
            counter.value += 1

if __name__ == '__main__':
    counter = Value('i', 0)
    lock = Lock()

    processes = [Process(target=safe_increment, args=(counter, lock)) for _ in range(4)]

    for p in processes:
        p.start()
    for p in processes:
        p.join()

    print(f"Counter: {counter.value}")  # 4000
```

## 同步原语

### Lock 和 RLock

```python
from multiprocessing import Process, Lock, RLock

def task_with_lock(lock, name):
    print(f"{name} waiting for lock")
    with lock:
        print(f"{name} acquired lock")
        # 临界区代码...
    print(f"{name} released lock")

if __name__ == '__main__':
    lock = Lock()

    processes = [
        Process(target=task_with_lock, args=(lock, f"Process-{i}"))
        for i in range(3)
    ]

    for p in processes:
        p.start()
    for p in processes:
        p.join()
```

### Semaphore

```python
from multiprocessing import Process, Semaphore
import time

def limited_resource(sem, name):
    """限制并发访问的资源"""
    with sem:
        print(f"{name} acquired semaphore")
        time.sleep(1)  # 使用资源
        print(f"{name} released semaphore")

if __name__ == '__main__':
    # 最多允许 2 个进程同时访问
    sem = Semaphore(2)

    processes = [
        Process(target=limited_resource, args=(sem, f"Process-{i}"))
        for i in range(5)
    ]

    for p in processes:
        p.start()
    for p in processes:
        p.join()
```

### Event

```python
from multiprocessing import Process, Event
import time

def waiter(event, name):
    print(f"{name} waiting for event")
    event.wait()
    print(f"{name} event received!")

def setter(event):
    print("Setting event in 2 seconds...")
    time.sleep(2)
    event.set()

if __name__ == '__main__':
    event = Event()

    waiters = [Process(target=waiter, args=(event, f"Waiter-{i}")) for i in range(3)]
    setter_proc = Process(target=setter, args=(event,))

    for w in waiters:
        w.start()
    setter_proc.start()

    for w in waiters:
        w.join()
    setter_proc.join()
```

## 实际应用

### 并行数据处理

```python
from multiprocessing import Pool
import json

def process_record(record):
    """处理单条记录"""
    # 模拟复杂计算
    result = {
        'id': record['id'],
        'processed': record['value'] ** 2,
        'category': 'high' if record['value'] > 50 else 'low'
    }
    return result

def parallel_process(data, workers=4):
    """并行处理数据"""
    with Pool(workers) as pool:
        results = pool.map(process_record, data)
    return results

if __name__ == '__main__':
    # 模拟大量数据
    data = [{'id': i, 'value': i * 2} for i in range(10000)]

    results = parallel_process(data)
    print(f"Processed {len(results)} records")
    print(f"First result: {results[0]}")
```

### CPU 密集型任务

```python
from multiprocessing import Pool, cpu_count
import time

def compute_heavy(n):
    """CPU 密集型计算"""
    result = 0
    for i in range(n):
        result += i ** 2
    return result

if __name__ == '__main__':
    numbers = [10**6] * 8

    # 串行执行
    start = time.time()
    serial_results = [compute_heavy(n) for n in numbers]
    serial_time = time.time() - start

    # 并行执行
    start = time.time()
    with Pool(cpu_count()) as pool:
        parallel_results = pool.map(compute_heavy, numbers)
    parallel_time = time.time() - start

    print(f"Serial: {serial_time:.2f}s")
    print(f"Parallel: {parallel_time:.2f}s")
    print(f"Speedup: {serial_time / parallel_time:.2f}x")
```

### 生产者-消费者模式

```python
from multiprocessing import Process, Queue, Event
import time
import random

def producer(queue, stop_event, producer_id):
    """生产者"""
    while not stop_event.is_set():
        item = random.randint(1, 100)
        queue.put((producer_id, item))
        print(f"Producer {producer_id} produced: {item}")
        time.sleep(random.uniform(0.1, 0.5))

def consumer(queue, stop_event, consumer_id):
    """消费者"""
    while not stop_event.is_set() or not queue.empty():
        try:
            producer_id, item = queue.get(timeout=1)
            print(f"Consumer {consumer_id} consumed: {item} from Producer {producer_id}")
            time.sleep(random.uniform(0.2, 0.4))
        except:
            continue

if __name__ == '__main__':
    queue = Queue(maxsize=10)
    stop_event = Event()

    # 创建生产者和消费者
    producers = [Process(target=producer, args=(queue, stop_event, i)) for i in range(2)]
    consumers = [Process(target=consumer, args=(queue, stop_event, i)) for i in range(3)]

    # 启动所有进程
    for p in producers + consumers:
        p.start()

    # 运行 3 秒后停止
    time.sleep(3)
    stop_event.set()

    # 等待所有进程结束
    for p in producers + consumers:
        p.join()

    print("All processes finished")
```

### 并行文件处理

```python
from multiprocessing import Pool
from pathlib import Path
import hashlib

def process_file(filepath):
    """计算文件哈希"""
    try:
        with open(filepath, 'rb') as f:
            content = f.read()
            return {
                'path': str(filepath),
                'size': len(content),
                'hash': hashlib.md5(content).hexdigest()
            }
    except Exception as e:
        return {'path': str(filepath), 'error': str(e)}

def parallel_file_process(directory, pattern='*.*', workers=4):
    """并行处理目录下的文件"""
    files = list(Path(directory).glob(pattern))

    with Pool(workers) as pool:
        results = pool.map(process_file, files)

    return results

if __name__ == '__main__':
    results = parallel_file_process('.', '*.py')
    for r in results[:5]:
        print(r)
```

## ProcessPoolExecutor

```python
from concurrent.futures import ProcessPoolExecutor, as_completed
import time

def task(n):
    time.sleep(0.5)
    return n ** 2

if __name__ == '__main__':
    # 推荐使用 ProcessPoolExecutor
    with ProcessPoolExecutor(max_workers=4) as executor:
        # submit 单个任务
        future = executor.submit(task, 5)
        print(f"Result: {future.result()}")

        # map 批量任务
        results = list(executor.map(task, range(10)))
        print(f"Results: {results}")

        # as_completed 获取完成的任务
        futures = [executor.submit(task, i) for i in range(5)]
        for future in as_completed(futures):
            print(f"Completed: {future.result()}")
```

## 与 Node.js 的主要差异

| 特性 | Python multiprocessing | Node.js |
|-----|----------------------|---------|
| 模型 | 多进程 | 单线程 + worker_threads/cluster |
| GIL | 每个进程独立 GIL | 无 GIL 问题 |
| 通信 | Queue, Pipe, Manager | 消息传递, SharedArrayBuffer |
| 共享状态 | Manager, 共享内存 | SharedArrayBuffer |
| CPU 密集型 | 直接并行 | 需要 worker_threads |

## 总结

**进程创建**:
- `Process`: 创建单个进程
- `Pool`: 进程池管理
- `ProcessPoolExecutor`: 高级接口

**进程通信**:
- `Queue`: 进程安全队列
- `Pipe`: 双向管道
- `Manager`: 共享状态管理

**同步原语**:
- `Lock/RLock`: 互斥锁
- `Semaphore`: 信号量
- `Event`: 事件通知

::: tip 最佳实践
- CPU 密集型任务使用多进程
- 优先使用 `ProcessPoolExecutor`
- 注意进程间通信开销
- 在 `if __name__ == '__main__':` 中启动进程
:::

::: info 相关模块
- `threading` - 多线程
- `concurrent.futures` - 高级并发接口
- `asyncio` - 异步 IO
:::

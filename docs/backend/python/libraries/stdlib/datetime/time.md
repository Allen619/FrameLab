---
title: time - 时间函数
description: Python time 模块详解，时间获取、格式化和性能测量
---

# time 时间函数

## 学习目标

- 理解时间戳的概念和转换
- 掌握时间格式化方法
- 学会性能计时的最佳实践
- 对比 JavaScript Date 特性

## 概览

| Python time | JavaScript | 说明 |
|------------|------------|------|
| `time()` | `Date.now() / 1000` | Unix 时间戳 (秒) |
| `time_ns()` | `performance.now()` | 纳秒精度 |
| `sleep()` | `setTimeout` | 暂停执行 |
| `strftime()` | `toLocaleString()` | 格式化时间 |
| `strptime()` | `new Date(string)` | 解析时间字符串 |

## 基础用法

### 获取当前时间

```python
import time

# 获取 Unix 时间戳 (秒，浮点数)
timestamp = time.time()
print(timestamp)  # 1703123456.789012

# 获取纳秒精度时间戳
timestamp_ns = time.time_ns()
print(timestamp_ns)  # 1703123456789012345

# 获取本地时间结构
local_time = time.localtime()
print(local_time)
# time.struct_time(tm_year=2024, tm_mon=12, tm_mday=21, ...)

# 获取 UTC 时间结构
utc_time = time.gmtime()
print(utc_time)
```

```javascript
// JavaScript 对比
const timestamp = Date.now() / 1000  // 秒
console.log(timestamp)

const date = new Date()
console.log(date.getFullYear(), date.getMonth() + 1, date.getDate())
```

### 时间结构 struct_time

```python
import time

t = time.localtime()

# 访问各个字段
print(f"年: {t.tm_year}")      # 2024
print(f"月: {t.tm_mon}")       # 1-12
print(f"日: {t.tm_mday}")      # 1-31
print(f"时: {t.tm_hour}")      # 0-23
print(f"分: {t.tm_min}")       # 0-59
print(f"秒: {t.tm_sec}")       # 0-61 (闰秒)
print(f"星期: {t.tm_wday}")    # 0-6 (周一=0)
print(f"年中天数: {t.tm_yday}")  # 1-366
print(f"夏令时: {t.tm_isdst}")  # 0, 1, -1

# 从时间戳创建
t = time.localtime(0)  # Unix 纪元
print(t)  # 1970年1月1日
```

```javascript
// JavaScript 对比
const date = new Date()
console.log(date.getFullYear())   // 年
console.log(date.getMonth() + 1)  // 月 (0-11 需要 +1)
console.log(date.getDate())       // 日
console.log(date.getDay())        // 星期 (0=周日)
```

## 时间格式化

### strftime - 格式化输出

```python
import time

t = time.localtime()

# 常用格式
print(time.strftime("%Y-%m-%d", t))          # 2024-12-21
print(time.strftime("%H:%M:%S", t))          # 14:30:45
print(time.strftime("%Y-%m-%d %H:%M:%S", t)) # 2024-12-21 14:30:45

# ISO 格式
print(time.strftime("%Y-%m-%dT%H:%M:%S", t)) # 2024-12-21T14:30:45

# 更多格式符
print(time.strftime("%A, %B %d, %Y", t))     # Saturday, December 21, 2024
print(time.strftime("%Y年%m月%d日", t))       # 2024年12月21日

# 直接从时间戳格式化
print(time.strftime("%Y-%m-%d", time.localtime(0)))  # 1970-01-01
```

### 常用格式符

| 格式符 | 说明 | 示例 |
|--------|------|------|
| `%Y` | 四位年份 | 2024 |
| `%m` | 两位月份 | 01-12 |
| `%d` | 两位日期 | 01-31 |
| `%H` | 24小时制 | 00-23 |
| `%M` | 分钟 | 00-59 |
| `%S` | 秒 | 00-59 |
| `%f` | 微秒 | 000000-999999 |
| `%A` | 完整星期名 | Monday |
| `%a` | 缩写星期名 | Mon |
| `%B` | 完整月份名 | January |
| `%b` | 缩写月份名 | Jan |
| `%j` | 年中天数 | 001-366 |
| `%U` | 年中周数 (周日起始) | 00-53 |
| `%W` | 年中周数 (周一起始) | 00-53 |

```javascript
// JavaScript 对比
const date = new Date()

// 手动格式化
const year = date.getFullYear()
const month = String(date.getMonth() + 1).padStart(2, '0')
const day = String(date.getDate()).padStart(2, '0')
console.log(`${year}-${month}-${day}`)

// 使用 toLocaleString
console.log(date.toLocaleDateString('zh-CN'))  // 2024/12/21
console.log(date.toISOString())  // 2024-12-21T06:30:45.000Z
```

### strptime - 解析时间字符串

```python
import time

# 解析时间字符串
time_str = "2024-12-21 14:30:45"
t = time.strptime(time_str, "%Y-%m-%d %H:%M:%S")
print(t)  # struct_time

# 转换为时间戳
timestamp = time.mktime(t)
print(timestamp)

# 解析各种格式
formats = [
    ("2024/12/21", "%Y/%m/%d"),
    ("21-Dec-2024", "%d-%b-%Y"),
    ("14:30:45", "%H:%M:%S"),
]

for time_str, fmt in formats:
    t = time.strptime(time_str, fmt)
    print(f"{time_str} -> {t.tm_year}/{t.tm_mon}/{t.tm_mday}")
```

```javascript
// JavaScript 对比
const dateStr = "2024-12-21T14:30:45"
const date = new Date(dateStr)
console.log(date.getTime() / 1000)  // Unix 时间戳
```

## 睡眠和暂停

### time.sleep()

```python
import time

print("开始")
time.sleep(1)      # 睡眠 1 秒
print("1 秒后")

time.sleep(0.5)    # 睡眠 500 毫秒
print("0.5 秒后")

time.sleep(0.001)  # 睡眠 1 毫秒
print("1 毫秒后")
```

```javascript
// JavaScript 对比 - 异步
console.log("开始")
setTimeout(() => {
    console.log("1 秒后")
}, 1000)

// Promise 版本
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
await sleep(1000)
console.log("1 秒后")
```

### 精确睡眠

```python
import time

def precise_sleep(seconds):
    """更精确的睡眠"""
    end_time = time.perf_counter() + seconds
    while time.perf_counter() < end_time:
        remaining = end_time - time.perf_counter()
        if remaining > 0.001:
            time.sleep(remaining / 2)

# 使用
start = time.perf_counter()
precise_sleep(0.1)
elapsed = time.perf_counter() - start
print(f"实际睡眠: {elapsed:.6f}s")  # 更接近 0.1s
```

## 性能计时

### perf_counter - 高精度计时器

```python
import time

# perf_counter - 推荐用于性能测量
start = time.perf_counter()
# 执行代码...
time.sleep(0.1)
elapsed = time.perf_counter() - start
print(f"耗时: {elapsed:.6f}s")

# perf_counter_ns - 纳秒版本
start_ns = time.perf_counter_ns()
# 执行代码...
elapsed_ns = time.perf_counter_ns() - start_ns
print(f"耗时: {elapsed_ns}ns")
```

```javascript
// JavaScript 对比
const start = performance.now()
// 执行代码...
const elapsed = performance.now() - start
console.log(`耗时: ${elapsed}ms`)
```

### 不同计时器的区别

```python
import time

# time() - 系统时间，受系统时间调整影响
# perf_counter() - 高精度，包含睡眠时间，不受系统时间调整影响
# process_time() - 进程 CPU 时间，不包含睡眠时间
# monotonic() - 单调递增，不受系统时间调整影响

def compare_timers():
    start_time = time.time()
    start_perf = time.perf_counter()
    start_proc = time.process_time()
    start_mono = time.monotonic()

    # CPU 密集型操作
    sum(range(1000000))

    # 睡眠
    time.sleep(0.1)

    print(f"time():         {time.time() - start_time:.4f}s")
    print(f"perf_counter(): {time.perf_counter() - start_perf:.4f}s")
    print(f"process_time(): {time.process_time() - start_proc:.4f}s")  # 不含睡眠
    print(f"monotonic():    {time.monotonic() - start_mono:.4f}s")

compare_timers()
```

### 计时装饰器

```python
import time
from functools import wraps

def timer(func):
    """计时装饰器"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} 耗时: {elapsed:.4f}s")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(0.5)
    return "done"

result = slow_function()  # slow_function 耗时: 0.5001s
```

### 上下文管理器计时

```python
import time
from contextlib import contextmanager

@contextmanager
def timer(name="代码块"):
    start = time.perf_counter()
    try:
        yield
    finally:
        elapsed = time.perf_counter() - start
        print(f"{name} 耗时: {elapsed:.4f}s")

# 使用
with timer("数据处理"):
    data = [i ** 2 for i in range(100000)]

with timer("排序"):
    sorted_data = sorted(data)
```

## 时区处理

### 时区相关函数

```python
import time
import os

# 获取时区信息
print(f"时区名称: {time.tzname}")  # ('CST', 'CST') 中国标准时间
print(f"UTC 偏移: {time.timezone}s")  # -28800 (8小时)
print(f"夏令时偏移: {time.daylight}")

# 本地时间 vs UTC 时间
local = time.localtime()
utc = time.gmtime()

print(f"本地时间: {time.strftime('%Y-%m-%d %H:%M:%S', local)}")
print(f"UTC 时间: {time.strftime('%Y-%m-%d %H:%M:%S', utc)}")

# 临时更改时区
original_tz = os.environ.get('TZ')
os.environ['TZ'] = 'America/New_York'
time.tzset()  # 更新时区
print(f"纽约时间: {time.strftime('%Y-%m-%d %H:%M:%S', time.localtime())}")

# 恢复时区
if original_tz:
    os.environ['TZ'] = original_tz
else:
    del os.environ['TZ']
time.tzset()
```

## 实际应用

### 执行时间统计器

```python
import time
from collections import defaultdict

class TimeTracker:
    """执行时间统计器"""

    def __init__(self):
        self.timings = defaultdict(list)

    def track(self, name):
        """返回上下文管理器"""
        class Timer:
            def __init__(self, tracker, name):
                self.tracker = tracker
                self.name = name

            def __enter__(self):
                self.start = time.perf_counter()
                return self

            def __exit__(self, *args):
                elapsed = time.perf_counter() - self.start
                self.tracker.timings[self.name].append(elapsed)

        return Timer(self, name)

    def report(self):
        """生成报告"""
        print("\n执行时间报告:")
        print("-" * 50)
        for name, times in sorted(self.timings.items()):
            avg = sum(times) / len(times)
            total = sum(times)
            print(f"{name}:")
            print(f"  次数: {len(times)}, 总计: {total:.4f}s, 平均: {avg:.4f}s")

# 使用
tracker = TimeTracker()

for i in range(3):
    with tracker.track("数据处理"):
        time.sleep(0.1)

    with tracker.track("计算"):
        sum(range(100000))

tracker.report()
```

### 限速器

```python
import time

class RateLimiter:
    """简单限速器"""

    def __init__(self, max_calls, period=1.0):
        self.max_calls = max_calls
        self.period = period
        self.calls = []

    def acquire(self):
        """获取执行许可"""
        now = time.time()

        # 清理过期记录
        self.calls = [t for t in self.calls if now - t < self.period]

        if len(self.calls) >= self.max_calls:
            # 需要等待
            sleep_time = self.calls[0] + self.period - now
            if sleep_time > 0:
                time.sleep(sleep_time)
            return self.acquire()

        self.calls.append(now)
        return True

# 使用
limiter = RateLimiter(max_calls=3, period=1.0)

for i in range(10):
    limiter.acquire()
    print(f"请求 {i} 在 {time.strftime('%H:%M:%S')}")
```

### 超时控制

```python
import time
import signal

class TimeoutError(Exception):
    pass

def timeout(seconds):
    """超时装饰器"""
    def decorator(func):
        def handler(signum, frame):
            raise TimeoutError(f"函数 {func.__name__} 超时 ({seconds}s)")

        def wrapper(*args, **kwargs):
            # 设置信号处理器
            old_handler = signal.signal(signal.SIGALRM, handler)
            signal.alarm(seconds)

            try:
                result = func(*args, **kwargs)
            finally:
                signal.alarm(0)
                signal.signal(signal.SIGALRM, old_handler)

            return result
        return wrapper
    return decorator

# 注意: 仅在 Unix 系统有效
# @timeout(2)
# def slow_operation():
#     time.sleep(5)
#     return "done"
```

### 时间戳工具函数

```python
import time

def timestamp_to_str(ts, fmt="%Y-%m-%d %H:%M:%S"):
    """时间戳转字符串"""
    return time.strftime(fmt, time.localtime(ts))

def str_to_timestamp(date_str, fmt="%Y-%m-%d %H:%M:%S"):
    """字符串转时间戳"""
    return time.mktime(time.strptime(date_str, fmt))

def get_today_start():
    """获取今天开始的时间戳"""
    today = time.strftime("%Y-%m-%d")
    return str_to_timestamp(today + " 00:00:00")

def get_today_end():
    """获取今天结束的时间戳"""
    today = time.strftime("%Y-%m-%d")
    return str_to_timestamp(today + " 23:59:59")

def days_ago(n):
    """获取 n 天前的时间戳"""
    return time.time() - n * 86400

# 使用
now = time.time()
print(f"当前: {timestamp_to_str(now)}")
print(f"今天开始: {timestamp_to_str(get_today_start())}")
print(f"7天前: {timestamp_to_str(days_ago(7))}")
```

### 简单定时任务

```python
import time
import threading

class SimpleScheduler:
    """简单定时调度器"""

    def __init__(self):
        self.tasks = []
        self.running = False

    def schedule(self, interval, func, *args, **kwargs):
        """添加定时任务"""
        self.tasks.append({
            'interval': interval,
            'func': func,
            'args': args,
            'kwargs': kwargs,
            'next_run': time.time()
        })

    def run(self):
        """运行调度器"""
        self.running = True
        while self.running:
            now = time.time()
            for task in self.tasks:
                if now >= task['next_run']:
                    task['func'](*task['args'], **task['kwargs'])
                    task['next_run'] = now + task['interval']
            time.sleep(0.1)

    def stop(self):
        self.running = False

# 使用
def heartbeat():
    print(f"心跳: {time.strftime('%H:%M:%S')}")

def cleanup():
    print(f"清理: {time.strftime('%H:%M:%S')}")

scheduler = SimpleScheduler()
scheduler.schedule(1.0, heartbeat)
scheduler.schedule(5.0, cleanup)

# 在后台线程运行
# thread = threading.Thread(target=scheduler.run)
# thread.start()
# time.sleep(10)
# scheduler.stop()
```

## 与 JavaScript 的主要差异

| 特性 | Python time | JavaScript Date |
|-----|-------------|-----------------|
| 时间戳单位 | 秒 (浮点数) | 毫秒 (整数) |
| 月份索引 | 1-12 | 0-11 |
| 星期索引 | 0-6 (周一=0) | 0-6 (周日=0) |
| 格式化 | strftime | toLocaleString |
| 睡眠 | 同步 | 异步 (setTimeout) |
| 高精度计时 | perf_counter | performance.now |

## 总结

**时间获取**:
- `time()`: Unix 时间戳 (秒)
- `time_ns()`: 纳秒时间戳
- `localtime()`: 本地时间结构
- `gmtime()`: UTC 时间结构

**格式化**:
- `strftime()`: 时间结构 → 字符串
- `strptime()`: 字符串 → 时间结构
- `mktime()`: 时间结构 → 时间戳

**计时**:
- `perf_counter()`: 性能计时 (推荐)
- `process_time()`: CPU 时间
- `monotonic()`: 单调时间

::: tip 最佳实践
- 性能测量用 `perf_counter()`
- 日期时间处理推荐使用 `datetime` 模块
- 时区处理推荐使用 `zoneinfo` 模块 (3.9+)
- 避免使用 `time()` 做性能测量
:::

::: info 相关模块
- `datetime` - 日期时间处理
- `calendar` - 日历功能
- `zoneinfo` - 时区信息
:::

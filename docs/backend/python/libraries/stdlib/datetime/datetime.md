---
title: datetime - 日期时间处理
description: Python datetime 模块详解，日期时间的创建、格式化和计算
---

# datetime 日期时间处理

## 学习目标

- 掌握 date、time、datetime 类的使用
- 学会日期时间的格式化和解析
- 理解时区处理
- 与 JavaScript Date 对比

## 概述

| Python datetime | JavaScript | 说明 |
|----------------|------------|------|
| `datetime.now()` | `new Date()` | 当前时间 |
| `datetime.strftime()` | `toLocaleString()` | 格式化 |
| `datetime.strptime()` | `Date.parse()` | 解析 |
| `timedelta` | 手动计算 | 时间差 |
| `zoneinfo` | `Intl.DateTimeFormat` | 时区 |

## 基本类型

### date - 日期

```python
from datetime import date

# 创建日期
today = date.today()
print(today)  # 2024-01-15

birthday = date(1990, 5, 20)
print(birthday)  # 1990-05-20

# 属性
print(today.year)   # 2024
print(today.month)  # 1
print(today.day)    # 15

# 星期 (0=周一, 6=周日)
print(today.weekday())   # 0
print(today.isoweekday())  # 1 (1=周一, 7=周日)

# ISO 格式
print(today.isoformat())  # '2024-01-15'
```

```javascript
// JavaScript 对比
const today = new Date()
const birthday = new Date(1990, 4, 20)  // 月份从0开始!

console.log(today.getFullYear())  // 2024
console.log(today.getMonth() + 1) // 1 (月份从0开始)
console.log(today.getDate())      // 15
console.log(today.getDay())       // 0=周日, 1=周一
```

### time - 时间

```python
from datetime import time

# 创建时间
t = time(14, 30, 0)
print(t)  # 14:30:00

t_micro = time(14, 30, 45, 123456)
print(t_micro)  # 14:30:45.123456

# 属性
print(t.hour)        # 14
print(t.minute)      # 30
print(t.second)      # 0
print(t.microsecond) # 0

# ISO 格式
print(t.isoformat())  # '14:30:00'
```

### datetime - 日期时间

```python
from datetime import datetime

# 当前时间
now = datetime.now()
print(now)  # 2024-01-15 14:30:45.123456

# 创建指定时间
dt = datetime(2024, 1, 15, 14, 30, 0)
print(dt)  # 2024-01-15 14:30:00

# 从 date 和 time 组合
d = date(2024, 1, 15)
t = time(14, 30)
dt = datetime.combine(d, t)

# 分解
print(dt.date())  # 2024-01-15
print(dt.time())  # 14:30:00

# 时间戳
timestamp = dt.timestamp()
print(timestamp)  # 1705304400.0

# 从时间戳创建
dt_from_ts = datetime.fromtimestamp(timestamp)
```

```javascript
// JavaScript 对比
const now = new Date()
const dt = new Date(2024, 0, 15, 14, 30, 0)  // 月份从0开始

// 时间戳 (毫秒)
const timestamp = dt.getTime()
const fromTs = new Date(timestamp)
```

## 格式化与解析

### strftime - 格式化

```python
from datetime import datetime

now = datetime.now()

# 常用格式
print(now.strftime('%Y-%m-%d'))           # 2024-01-15
print(now.strftime('%Y/%m/%d %H:%M:%S'))  # 2024/01/15 14:30:45
print(now.strftime('%Y年%m月%d日'))        # 2024年01月15日
print(now.strftime('%A, %B %d, %Y'))      # Monday, January 15, 2024

# 常用格式符
# %Y - 四位年份 (2024)
# %m - 两位月份 (01-12)
# %d - 两位日期 (01-31)
# %H - 24小时制小时 (00-23)
# %I - 12小时制小时 (01-12)
# %M - 分钟 (00-59)
# %S - 秒 (00-59)
# %p - AM/PM
# %A - 星期全名 (Monday)
# %a - 星期缩写 (Mon)
# %B - 月份全名 (January)
# %b - 月份缩写 (Jan)
```

```javascript
// JavaScript 对比
const now = new Date()

// toLocaleString
now.toLocaleDateString('zh-CN')  // '2024/1/15'
now.toLocaleTimeString('zh-CN')  // '14:30:45'

// Intl.DateTimeFormat
new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
}).format(now)  // '2024/01/15'
```

### strptime - 解析

```python
from datetime import datetime

# 解析字符串为 datetime
dt = datetime.strptime('2024-01-15', '%Y-%m-%d')
print(dt)  # 2024-01-15 00:00:00

dt = datetime.strptime('2024/01/15 14:30:45', '%Y/%m/%d %H:%M:%S')
print(dt)  # 2024-01-15 14:30:45

# 解析 ISO 格式
dt = datetime.fromisoformat('2024-01-15T14:30:45')
print(dt)  # 2024-01-15 14:30:45

# 解析时间戳
dt = datetime.fromtimestamp(1705304400)
```

```javascript
// JavaScript 对比
const dt = new Date('2024-01-15')
const dt2 = new Date('2024-01-15T14:30:45')
const dt3 = new Date(1705304400 * 1000)  // 毫秒
```

## timedelta - 时间差

```python
from datetime import datetime, timedelta

now = datetime.now()

# 创建时间差
delta = timedelta(days=7)
delta = timedelta(hours=2, minutes=30)
delta = timedelta(weeks=1, days=2, hours=3)

# 日期计算
tomorrow = now + timedelta(days=1)
yesterday = now - timedelta(days=1)
next_week = now + timedelta(weeks=1)

# 两个日期的差
dt1 = datetime(2024, 1, 15)
dt2 = datetime(2024, 1, 10)
diff = dt1 - dt2
print(diff)           # 5 days, 0:00:00
print(diff.days)      # 5
print(diff.seconds)   # 0
print(diff.total_seconds())  # 432000.0

# timedelta 运算
delta1 = timedelta(hours=2)
delta2 = timedelta(hours=3)
print(delta1 + delta2)  # 5:00:00
print(delta2 - delta1)  # 1:00:00
print(delta1 * 3)       # 6:00:00
```

```javascript
// JavaScript 对比 - 手动计算
const now = new Date()
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

const dt1 = new Date('2024-01-15')
const dt2 = new Date('2024-01-10')
const diffMs = dt1 - dt2
const diffDays = diffMs / (1000 * 60 * 60 * 24)  // 5
```

## 时区处理

### zoneinfo (Python 3.9+)

```python
from datetime import datetime
from zoneinfo import ZoneInfo

# 创建带时区的时间
utc_now = datetime.now(ZoneInfo('UTC'))
print(utc_now)  # 2024-01-15 06:30:45+00:00

shanghai = datetime.now(ZoneInfo('Asia/Shanghai'))
print(shanghai)  # 2024-01-15 14:30:45+08:00

# 时区转换
utc_time = datetime(2024, 1, 15, 6, 30, tzinfo=ZoneInfo('UTC'))
shanghai_time = utc_time.astimezone(ZoneInfo('Asia/Shanghai'))
print(shanghai_time)  # 2024-01-15 14:30:00+08:00

# 常用时区
# 'UTC', 'Asia/Shanghai', 'Asia/Tokyo', 'America/New_York', 'Europe/London'
```

### timezone (基础时区)

```python
from datetime import datetime, timezone, timedelta

# UTC
utc = timezone.utc
now_utc = datetime.now(utc)

# 自定义偏移
cst = timezone(timedelta(hours=8))  # UTC+8
now_cst = datetime.now(cst)

# 添加时区信息
naive_dt = datetime(2024, 1, 15, 14, 30)  # 无时区
aware_dt = naive_dt.replace(tzinfo=cst)   # 有时区
```

## 实用示例

### 日期范围生成

```python
from datetime import datetime, timedelta

def date_range(start, end, step=timedelta(days=1)):
    """生成日期范围"""
    current = start
    while current <= end:
        yield current
        current += step

# 使用
start = datetime(2024, 1, 1)
end = datetime(2024, 1, 7)

for dt in date_range(start, end):
    print(dt.strftime('%Y-%m-%d'))
```

### 计算年龄

```python
from datetime import date

def calculate_age(birth_date):
    """计算年龄"""
    today = date.today()
    age = today.year - birth_date.year
    if (today.month, today.day) < (birth_date.month, birth_date.day):
        age -= 1
    return age

birthday = date(1990, 5, 20)
print(f"Age: {calculate_age(birthday)}")
```

### 工作日计算

```python
from datetime import date, timedelta

def add_workdays(start_date, days):
    """添加工作日"""
    current = start_date
    added = 0
    while added < days:
        current += timedelta(days=1)
        if current.weekday() < 5:  # 周一到周五
            added += 1
    return current

today = date.today()
deadline = add_workdays(today, 5)
print(f"5 workdays later: {deadline}")
```

### 相对时间显示

```python
from datetime import datetime, timedelta

def relative_time(dt):
    """显示相对时间"""
    now = datetime.now()
    diff = now - dt

    if diff < timedelta(minutes=1):
        return "刚刚"
    elif diff < timedelta(hours=1):
        return f"{diff.seconds // 60} 分钟前"
    elif diff < timedelta(days=1):
        return f"{diff.seconds // 3600} 小时前"
    elif diff < timedelta(days=30):
        return f"{diff.days} 天前"
    else:
        return dt.strftime('%Y-%m-%d')

past = datetime.now() - timedelta(hours=3)
print(relative_time(past))  # "3 小时前"
```

## 与 JS 的关键差异

| 特性 | Python datetime | JavaScript Date |
|-----|----------------|-----------------|
| 月份 | 1-12 | 0-11 |
| 星期 | weekday() 0=周一 | getDay() 0=周日 |
| 时间戳 | 秒 | 毫秒 |
| 不可变 | 是 | 否 |
| 时间差 | timedelta 类 | 手动计算毫秒 |
| 格式化 | strftime | toLocaleString |
| 时区 | zoneinfo | Intl API |

## 小结

**核心类**:
- `date`: 日期 (年月日)
- `time`: 时间 (时分秒)
- `datetime`: 日期时间
- `timedelta`: 时间差

**常用操作**:
- `datetime.now()`: 当前时间
- `strftime()`: 格式化为字符串
- `strptime()`: 解析字符串
- `timedelta`: 日期计算

**时区处理**:
- `zoneinfo.ZoneInfo`: 时区信息
- `astimezone()`: 时区转换

::: tip 注意事项
- Python 月份从 1 开始，JavaScript 从 0 开始
- Python 时间戳是秒，JavaScript 是毫秒
- 尽量使用带时区的 datetime
:::

::: info 相关内容
- [time 时间函数](./time.md) - 底层时间函数
- [calendar 日历工具](./calendar.md) - 日历相关
:::

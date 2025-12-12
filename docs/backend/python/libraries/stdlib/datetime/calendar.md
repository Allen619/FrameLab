---
title: calendar - 日历功能
description: Python calendar 模块详解，日历生成和日期计算
---

# calendar 日历功能

## 学习目标

- 理解日历的生成和显示
- 学会日期相关计算
- 掌握星期和月份操作
- 对比 JavaScript 日期处理

## 概览

| Python calendar | JavaScript | 说明 |
|----------------|------------|------|
| `calendar()` | 无直接对应 | 生成年日历 |
| `month()` | 无直接对应 | 生成月日历 |
| `weekday()` | `getDay()` | 获取星期几 |
| `isleap()` | 手动计算 | 判断闰年 |
| `monthrange()` | 无直接对应 | 月份天数信息 |

## 基础用法

### 显示日历

```python
import calendar

# 打印某年某月的日历
print(calendar.month(2024, 12))
#     December 2024
# Mo Tu We Th Fr Sa Su
#                    1
#  2  3  4  5  6  7  8
# ...

# 打印整年日历
print(calendar.calendar(2024))

# 设置每周起始日 (0=周一, 6=周日)
calendar.setfirstweekday(6)  # 周日为第一天
print(calendar.month(2024, 12))
```

```javascript
// JavaScript 对比 - 无内置日历显示
// 需要手动实现或使用库
function printMonth(year, month) {
    const date = new Date(year, month - 1, 1)
    const daysInMonth = new Date(year, month, 0).getDate()
    // 手动格式化...
}
```

### 获取日历数据

```python
import calendar

# 获取某月的日历数据 (二维列表)
cal = calendar.monthcalendar(2024, 12)
for week in cal:
    print(week)
# [0, 0, 0, 0, 0, 0, 1]
# [2, 3, 4, 5, 6, 7, 8]
# ...

# 0 表示不属于该月的日期

# 获取某月的天数和首日星期
first_weekday, days_in_month = calendar.monthrange(2024, 12)
print(f"首日是星期 {first_weekday}")  # 6 (周日，因为 0=周一)
print(f"该月有 {days_in_month} 天")   # 31
```

### 星期和日期

```python
import calendar

# 获取某天是星期几 (0=周一, 6=周日)
weekday = calendar.weekday(2024, 12, 25)
print(weekday)  # 2 (周三)

# 星期名称
print(calendar.day_name[weekday])   # Wednesday
print(calendar.day_abbr[weekday])   # Wed

# 月份名称
print(calendar.month_name[12])  # December
print(calendar.month_abbr[12])  # Dec

# 所有星期名称
print(list(calendar.day_name))
# ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
```

```javascript
// JavaScript 对比
const date = new Date(2024, 11, 25)
const weekday = date.getDay()  // 3 (0=周日)

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
console.log(dayNames[weekday])  // Wednesday
```

## 闰年判断

```python
import calendar

# 判断是否闰年
print(calendar.isleap(2024))  # True
print(calendar.isleap(2023))  # False
print(calendar.isleap(2100))  # False (整百年需被400整除)
print(calendar.isleap(2000))  # True

# 计算两年间的闰年数量
count = calendar.leapdays(2000, 2024)
print(f"2000-2024 间有 {count} 个闰年")  # 6
```

```javascript
// JavaScript 对比 - 手动实现
function isLeap(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
}

console.log(isLeap(2024))  // true
```

## Calendar 类

### TextCalendar

```python
import calendar

# 创建文本日历
cal = calendar.TextCalendar(firstweekday=0)  # 周一起始

# 生成月份字符串
month_str = cal.formatmonth(2024, 12)
print(month_str)

# 生成年份字符串
year_str = cal.formatyear(2024)
print(year_str)

# 迭代某月的天数
for day in cal.itermonthdays(2024, 12):
    if day != 0:
        print(day, end=' ')
# 1 2 3 4 5 ... 31

# 迭代某月的 (weekday, day) 元组
for weekday, day in cal.itermonthdays2(2024, 12):
    if day != 0:
        print(f"星期{weekday}: {day}日")
```

### HTMLCalendar

```python
import calendar

# 创建 HTML 日历
cal = calendar.HTMLCalendar(firstweekday=0)

# 生成月份 HTML
html = cal.formatmonth(2024, 12)
print(html)
# <table border="0" cellpadding="0" cellspacing="0" class="month">
# <tr><th colspan="7" class="month">December 2024</th></tr>
# ...

# 生成整年 HTML
year_html = cal.formatyear(2024)

# 自定义样式
class StyledCalendar(calendar.HTMLCalendar):
    def formatday(self, day, weekday):
        if day == 0:
            return '<td class="noday">&nbsp;</td>'
        if weekday in (5, 6):  # 周末
            return f'<td class="weekend">{day}</td>'
        return f'<td class="weekday">{day}</td>'

styled_cal = StyledCalendar()
print(styled_cal.formatmonth(2024, 12))
```

## 实际应用

### 计算指定日期

```python
import calendar
from datetime import date

def get_nth_weekday(year, month, weekday, n):
    """获取某月第 n 个星期几的日期

    Args:
        year: 年份
        month: 月份
        weekday: 星期几 (0=周一, 6=周日)
        n: 第几个 (负数表示倒数)
    """
    cal = calendar.monthcalendar(year, month)

    # 筛选出所有该星期的日期
    days = [week[weekday] for week in cal if week[weekday] != 0]

    if n > 0:
        return date(year, month, days[n - 1])
    else:
        return date(year, month, days[n])

# 获取 2024 年 11 月第 4 个星期四 (感恩节)
thanksgiving = get_nth_weekday(2024, 11, 3, 4)
print(f"感恩节: {thanksgiving}")  # 2024-11-28

# 获取某月最后一个星期五
last_friday = get_nth_weekday(2024, 12, 4, -1)
print(f"最后一个周五: {last_friday}")
```

### 工作日计算

```python
import calendar
from datetime import date, timedelta

def count_workdays(year, month):
    """计算某月的工作日数量"""
    cal = calendar.monthcalendar(year, month)
    workdays = 0

    for week in cal:
        for i, day in enumerate(week):
            if day != 0 and i < 5:  # 周一到周五
                workdays += 1

    return workdays

def add_workdays(start_date, days):
    """给日期添加工作日"""
    current = start_date
    added = 0

    while added < days:
        current += timedelta(days=1)
        if current.weekday() < 5:  # 周一到周五
            added += 1

    return current

# 计算 2024 年 12 月有多少个工作日
print(f"2024年12月工作日: {count_workdays(2024, 12)}")

# 从今天起算 10 个工作日后是哪天
today = date.today()
future = add_workdays(today, 10)
print(f"10 个工作日后: {future}")
```

### 日历生成器

```python
import calendar
from datetime import date

class CalendarGenerator:
    """日历生成器"""

    def __init__(self, year, month):
        self.year = year
        self.month = month
        self.cal = calendar.Calendar(firstweekday=0)

    def get_weeks(self):
        """获取该月所有周的数据"""
        weeks = []
        for week in self.cal.monthdayscalendar(self.year, self.month):
            week_data = []
            for i, day in enumerate(week):
                if day == 0:
                    week_data.append(None)
                else:
                    d = date(self.year, self.month, day)
                    week_data.append({
                        'day': day,
                        'date': d,
                        'weekday': i,
                        'is_weekend': i >= 5,
                        'is_today': d == date.today()
                    })
            weeks.append(week_data)
        return weeks

    def to_dict(self):
        """转换为字典格式"""
        return {
            'year': self.year,
            'month': self.month,
            'month_name': calendar.month_name[self.month],
            'weeks': self.get_weeks(),
            'prev_month': (self.year, self.month - 1) if self.month > 1 else (self.year - 1, 12),
            'next_month': (self.year, self.month + 1) if self.month < 12 else (self.year + 1, 1)
        }

# 使用
gen = CalendarGenerator(2024, 12)
data = gen.to_dict()
print(f"月份: {data['month_name']} {data['year']}")
for week in data['weeks']:
    for day in week:
        if day:
            marker = '*' if day['is_today'] else ''
            print(f"{day['day']:2}{marker}", end=' ')
        else:
            print('  ', end=' ')
    print()
```

### 事件日历

```python
import calendar
from datetime import date
from collections import defaultdict

class EventCalendar:
    """带事件的日历"""

    def __init__(self):
        self.events = defaultdict(list)

    def add_event(self, event_date, title, description=''):
        """添加事件"""
        self.events[event_date].append({
            'title': title,
            'description': description
        })

    def get_events(self, event_date):
        """获取某天的事件"""
        return self.events.get(event_date, [])

    def get_month_view(self, year, month):
        """获取月视图数据"""
        cal = calendar.Calendar()
        month_data = []

        for week in cal.monthdayscalendar(year, month):
            week_data = []
            for day in week:
                if day == 0:
                    week_data.append({'day': None, 'events': []})
                else:
                    d = date(year, month, day)
                    week_data.append({
                        'day': day,
                        'date': d,
                        'events': self.get_events(d)
                    })
            month_data.append(week_data)

        return month_data

    def print_month(self, year, month):
        """打印带事件标记的月历"""
        print(f"\n{calendar.month_name[month]} {year}")
        print("Mo Tu We Th Fr Sa Su")

        for week in self.get_month_view(year, month):
            for day_data in week:
                if day_data['day'] is None:
                    print('  ', end=' ')
                elif day_data['events']:
                    print(f"{day_data['day']:2}*", end='')
                else:
                    print(f"{day_data['day']:2} ", end='')
            print()

# 使用
ecal = EventCalendar()
ecal.add_event(date(2024, 12, 25), "圣诞节", "Merry Christmas!")
ecal.add_event(date(2024, 12, 31), "跨年", "New Year's Eve")
ecal.add_event(date(2024, 12, 31), "年度总结", "Annual Review")

ecal.print_month(2024, 12)

# 查看某天事件
events = ecal.get_events(date(2024, 12, 31))
for event in events:
    print(f"- {event['title']}: {event['description']}")
```

### 日期范围生成

```python
import calendar
from datetime import date, timedelta

def date_range(start, end):
    """生成日期范围"""
    current = start
    while current <= end:
        yield current
        current += timedelta(days=1)

def month_range(year, month):
    """生成某月的所有日期"""
    _, days = calendar.monthrange(year, month)
    return date_range(date(year, month, 1), date(year, month, days))

def year_months(year):
    """生成某年所有月份的 (year, month) 元组"""
    for month in range(1, 13):
        yield year, month

# 使用
print("2024年12月所有日期:")
for d in month_range(2024, 12):
    print(d)

print("\n2024年所有月份:")
for year, month in year_months(2024):
    print(f"{year}-{month:02d}")
```

## 与 JavaScript 的主要差异

| 特性 | Python calendar | JavaScript |
|-----|-----------------|------------|
| 日历生成 | 内置支持 | 需手动实现 |
| 星期起始 | 可配置 (默认周一) | 固定周日 |
| 星期索引 | 0-6 (周一=0) | 0-6 (周日=0) |
| 闰年判断 | `isleap()` | 需手动实现 |
| HTML 日历 | 内置支持 | 需使用库 |

## 总结

**日历显示**:
- `month()`: 月份文本
- `calendar()`: 年份文本
- `HTMLCalendar`: HTML 格式

**日期信息**:
- `monthrange()`: 月份首日星期和天数
- `weekday()`: 获取星期几
- `isleap()`: 判断闰年

**数据获取**:
- `monthcalendar()`: 月份二维列表
- `itermonthdays()`: 迭代月份天数
- `day_name/month_name`: 名称列表

::: tip 最佳实践
- 日历显示用 `calendar` 模块
- 日期计算用 `datetime` 模块
- 需要 HTML 输出用 `HTMLCalendar`
- 复杂日期操作考虑 `dateutil` 库
:::

::: info 相关模块
- `datetime` - 日期时间处理
- `time` - 时间函数
- `dateutil` - 日期工具扩展
:::

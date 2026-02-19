---
title: APScheduler 触发器
description: Date、Interval、Cron 与组合触发器
---

# APScheduler 触发器

触发器负责定义“下一次什么时候触发”。

## 常用触发器

- DateTrigger：一次性任务
- IntervalTrigger：固定间隔
- CronTrigger：Cron 表达式
- CalendarIntervalTrigger：按日历间隔

## 组合触发器

APScheduler 4.x 支持 `AndTrigger` / `OrTrigger`，用于组合多条触发规则。

## 示例：Interval + Cron

```python
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.triggers.cron import CronTrigger

interval = IntervalTrigger(minutes=10)
cron = CronTrigger(hour=9, minute=30)
```

## 前端类比与差异

- 前端通常只有“固定延时或固定周期”
- APScheduler 触发器支持更丰富规则和时区语义
- 真实语义：组合触发器会维护下一次候选时间等运行态信息，升级版本时要复核触发行为

## 触发器选型建议

- 简单保活/轮询：Interval
- 固定时间批处理：Cron
- 节假日/自然日驱动：CalendarInterval
- 复杂规则：组合触发器

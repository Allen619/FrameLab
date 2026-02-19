---
title: APScheduler 快速上手
description: 使用最小示例启动 APScheduler 4.x
---

# APScheduler 快速上手

## 安装

```bash
pip install apscheduler
```

## 最小示例（异步调度器）

```python
import asyncio
from apscheduler import AsyncScheduler
from apscheduler.triggers.interval import IntervalTrigger


async def heartbeat() -> None:
    print("tick")


async def main() -> None:
    async with AsyncScheduler() as scheduler:
        await scheduler.add_schedule(
            heartbeat,
            IntervalTrigger(seconds=5),
            id="heartbeat-5s",
        )
        await scheduler.run_until_stopped()


if __name__ == "__main__":
    asyncio.run(main())
```

## 从前端视角理解启动流程

- 类比：像在应用启动时注册一个“长期定时任务”
- 真实语义：调度器会持续处理到期 schedule 并派发 job，不是单纯 `setInterval`

## 常见初始化参数

- `identity`：调度器实例标识（多节点时建议显式设置）
- `max_concurrent_jobs`：全局并发上限
- 数据存储和事件代理：生产环境建议显式配置

## 最小上线检查

1. 时区是否统一（推荐 `zoneinfo`）
2. misfire（错过触发）策略是否符合业务
3. 任务幂等性是否满足重试或重复触发场景

---
title: APScheduler 概览
description: APScheduler 的定位、组件与版本说明
---

# APScheduler 概览

APScheduler 是 Python 的任务调度库，支持一次性任务、固定间隔任务、Cron 风格任务，以及多实例协作。

## 它解决什么问题

- 让任务按时间策略执行，而不是只在请求到达时执行
- 给任务执行增加并发、错过执行窗口、结果保存等控制能力
- 在需要时把调度状态放到外部存储，支持多节点协作

## 与前端的直觉类比

- 前端 `setInterval(fn, 5000)` 类比 APScheduler 的周期调度
- 但 APScheduler 的真实语义是“调度 + 持久化 + 执行编排”
- 浏览器刷新会丢失定时器；APScheduler 可结合数据存储恢复调度状态

## 版本与术语基线（建议）

本文档按 APScheduler 4.x 术语组织：

- `Task`：可执行目标与执行约束
- `Schedule`：触发规则与调度配置
- `Job`：某次具体执行实例

> 从 v3 到 v4 的关键变化：`job` 概念拆分为 Task/Schedule/Job，并引入事件代理（event broker）与新的数据存储设计。

## 版本敏感核对清单

在更新此文档时，建议逐项复核：

1. 当前稳定版本号与发布时间
2. 是否仍使用 Task/Schedule/Job 三层模型
3. `add_schedule()` / `add_job()` API 参数是否变化
4. 触发器组合行为与状态管理语义是否变化（重点核对 `AndTrigger` / `OrTrigger`）
5. 时区建议是否仍基于 `zoneinfo`（而非 `pytz`）
6. 多节点场景下 event broker 的要求是否变化

## 下一步

- [核心概念](./apscheduler-core-concepts.md)
- [快速上手](./apscheduler-quickstart.md)

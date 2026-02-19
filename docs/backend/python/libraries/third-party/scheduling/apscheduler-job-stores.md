---
title: APScheduler 作业存储
description: Data Store（Job Store）的职责与选型
---

# APScheduler 作业存储

在 APScheduler 4.x 中，更准确叫法是 Data Store（历史上常叫 Job Store）。

## 职责

- 保存 Task、Schedule、Job、JobResult
- 支持调度器实例间共享状态
- 为错过执行窗口、恢复、领取任务提供基础

## 选型建议

- 开发环境：可先用内存存储快速验证
- 生产环境：优先选可持久化且支持并发访问的后端

## 前端类比与差异

- 类比：像把内存状态从 Redux 临时 store 升级到数据库
- 真实语义：Data Store 还承担了分布式“领取任务”的一致性责任

## 配置注意点

1. 明确数据保留策略（尤其 JobResult 过期时间）
2. 评估多实例并发下的锁竞争与吞吐
3. 与 event broker 组合验证跨节点事件可见性

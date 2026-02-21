---
title: 并发编程
description: Python 标准库中的并发与并行编程模块
---

# 并发编程

Python 标准库提供了多层级的并发编程支持，从底层线程/进程到高层执行器抽象。

| 模块 | 说明 |
|------|------|
| [threading 线程](./threading.md) | 基于线程的并行，适合 I/O 密集型任务 |
| [multiprocessing 多进程](./multiprocessing.md) | 基于进程的并行，绕过 GIL 限制 |
| [concurrent.futures](./concurrent-futures.md) | 高层异步执行器，统一线程池和进程池接口 |

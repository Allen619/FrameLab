---
title: 数据处理
description: Python 数据处理与分析库
---

# 数据处理

数据处理与分析的 Python 库。

## 库概览

| 库 | 特点 | 最佳场景 |
|----|------|----------|
| pandas | 功能全面，生态丰富 | 通用数据分析 |
| numpy | 数值计算基础 | 数组运算 |
| polars | 高性能，Rust 实现 | 大数据集 |

## 选择建议

- **数据分析**: pandas（功能最全）
- **数值计算**: numpy（基础库）
- **大数据集**: polars（性能更好）

## 文档

- [pandas](./pandas.md) - 数据分析库
- [numpy](./numpy.md) - 数值计算库
- [polars](./polars.md) - 高性能数据帧

## 快速对比

```python
# pandas
import pandas as pd
df = pd.read_csv("data.csv")
result = df.groupby("category")["value"].mean()

# numpy
import numpy as np
arr = np.array([1, 2, 3, 4, 5])
mean = arr.mean()

# polars
import polars as pl
df = pl.read_csv("data.csv")
result = df.group_by("category").agg(pl.col("value").mean())
```

## 性能对比

| 操作 | pandas | polars | 说明 |
|------|--------|--------|------|
| 读取 CSV | 较慢 | 快 | polars 多线程 |
| 聚合操作 | 中等 | 快 | polars 懒执行 |
| 内存占用 | 较大 | 小 | polars 更高效 |

## Node.js 对比

| Python | Node.js | 说明 |
|--------|---------|------|
| pandas | danfojs | 数据分析 |
| numpy | numjs | 数值计算 |
| polars | arquero | 数据帧 |

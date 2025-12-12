---
title: polars - 高性能数据帧
description: Python Polars 高性能数据帧库
---

# polars 高性能数据帧

## 本章目标

- 掌握 Polars 数据帧操作
- 理解懒执行与表达式
- 学习与 pandas 的差异
- 对比性能优势

## 对比

| Polars | pandas | 说明 |
|--------|--------|------|
| `pl.DataFrame` | `pd.DataFrame` | 数据帧 |
| `df.lazy()` | 无 | 懒执行 |
| `pl.col()` | `df["col"]` | 列选择 |
| 不可变 | 可变 | 数据模型 |

## 安装

```bash
pip install polars

# poetry
poetry add polars
```

## 基础用法

### 创建 DataFrame

```python
import polars as pl

# 从字典创建
df = pl.DataFrame({
    "name": ["Alice", "Bob", "Charlie"],
    "age": [25, 30, 35],
    "city": ["Beijing", "Shanghai", "Guangzhou"]
})

print(df)

# 从列表创建
df = pl.DataFrame([
    {"name": "Alice", "age": 25},
    {"name": "Bob", "age": 30},
])
```

### 基本操作

```python
import polars as pl

df = pl.DataFrame({
    "name": ["Alice", "Bob", "Charlie"],
    "age": [25, 30, 35],
    "score": [85.5, 90.0, 78.5]
})

# 查看信息
print(df.shape)       # (3, 3)
print(df.columns)     # ['name', 'age', 'score']
print(df.dtypes)      # 数据类型

# 选择列
print(df.select("name", "age"))
print(df.select(pl.col("name")))

# 筛选行
print(df.filter(pl.col("age") > 25))
print(df.filter((pl.col("age") > 25) & (pl.col("score") > 80)))
```

### 表达式系统

```python
import polars as pl

df = pl.DataFrame({
    "a": [1, 2, 3],
    "b": [4, 5, 6]
})

# 使用表达式
result = df.select(
    pl.col("a"),
    pl.col("b"),
    (pl.col("a") + pl.col("b")).alias("sum"),
    (pl.col("a") * 2).alias("a_doubled"),
)
print(result)
```

## 数据处理

### 分组聚合

```python
import polars as pl

df = pl.DataFrame({
    "category": ["A", "B", "A", "B", "A"],
    "value": [10, 20, 30, 40, 50]
})

# 分组聚合
result = df.group_by("category").agg(
    pl.col("value").sum().alias("total"),
    pl.col("value").mean().alias("average"),
    pl.col("value").count().alias("count"),
)
print(result)
```

### 排序与去重

```python
import polars as pl

df = pl.DataFrame({
    "name": ["Alice", "Bob", "Alice", "Charlie"],
    "score": [85, 90, 85, 78]
})

# 排序
print(df.sort("score", descending=True))

# 去重
print(df.unique("name"))
```

### 连接操作

```python
import polars as pl

df1 = pl.DataFrame({
    "id": [1, 2, 3],
    "name": ["Alice", "Bob", "Charlie"]
})

df2 = pl.DataFrame({
    "id": [1, 2, 4],
    "score": [85, 90, 75]
})

# 内连接
result = df1.join(df2, on="id", how="inner")

# 左连接
result = df1.join(df2, on="id", how="left")
```

## 懒执行

```python
import polars as pl

# 创建懒数据帧
lazy_df = pl.DataFrame({
    "a": range(1000000),
    "b": range(1000000)
}).lazy()

# 链式操作（不立即执行）
result = (
    lazy_df
    .filter(pl.col("a") > 500000)
    .with_columns((pl.col("a") + pl.col("b")).alias("sum"))
    .group_by(pl.col("a") % 10)
    .agg(pl.col("sum").mean())
)

# 执行并收集结果
df = result.collect()
print(df)
```

## 读写数据

```python
import polars as pl

# CSV
df = pl.read_csv("data.csv")
df.write_csv("output.csv")

# Parquet（推荐大数据）
df = pl.read_parquet("data.parquet")
df.write_parquet("output.parquet")

# JSON
df = pl.read_json("data.json")
df.write_json("output.json")
```

## 与 pandas 对比

```python
# Polars
import polars as pl

df = pl.read_csv("data.csv")
result = (
    df.lazy()
    .filter(pl.col("age") > 25)
    .group_by("city")
    .agg(pl.col("salary").mean())
    .collect()
)
```

```python
# pandas
import pandas as pd

df = pd.read_csv("data.csv")
result = (
    df[df["age"] > 25]
    .groupby("city")["salary"]
    .mean()
)
```

## 小结

**核心特点**:
- Rust 实现，高性能
- 懒执行优化查询
- 表达式系统强大

**常用操作**:
- `select()`: 选择列
- `filter()`: 筛选行
- `group_by()`: 分组聚合

::: tip 最佳实践
- 使用懒执行处理大数据
- 链式操作提高可读性
- 优先使用 Parquet 格式
:::

::: info 相关库
- `pandas` - 传统数据分析
- `numpy` - 数值计算
- `duckdb` - SQL 分析
:::

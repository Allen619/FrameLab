---
title: 数据处理库
description: Python 数据处理 - pandas 和 json 模块
---

# 数据处理库

## 概述

| Python        | JavaScript        | 说明                 |
| ------------- | ----------------- | -------------------- |
| `json` (内置) | `JSON`            | JSON 序列化/反序列化 |
| `pandas`      | lodash + 手动处理 | 表格数据处理         |

## json 模块 - JSON 处理

### 基础用法

```python
import json

# 解析 JSON 字符串
data = json.loads('{"name": "Alice", "age": 30}')
print(data['name'])  # Alice

# 转换为 JSON 字符串
json_str = json.dumps({'name': 'Bob', 'age': 25})

# 读写文件
with open('data.json', 'r') as f:
    data = json.load(f)

with open('data.json', 'w') as f:
    json.dump(data, f, indent=2)
```

### 对比 JavaScript

```javascript
// JavaScript
const data = JSON.parse('{"name": "Alice", "age": 30}')
const jsonStr = JSON.stringify({ name: 'Bob', age: 25 })
```

| Python                 | JavaScript                | 说明       |
| ---------------------- | ------------------------- | ---------- |
| `json.loads(str)`      | `JSON.parse(str)`         | 解析字符串 |
| `json.dumps(obj)`      | `JSON.stringify(obj)`     | 转为字符串 |
| `json.load(file)`      | `fs.readFileSync` + parse | 读文件     |
| `json.dump(obj, file)` | `fs.writeFileSync`        | 写文件     |

## pandas - 数据分析利器

### 安装

```bash
pip install pandas
poetry add pandas
```

### 基础用法

```python
import pandas as pd

# 创建 DataFrame
df = pd.DataFrame({
    'name': ['Alice', 'Bob', 'Charlie'],
    'age': [25, 30, 35],
    'city': ['北京', '上海', '广州']
})

# 读取 CSV
df = pd.read_csv('users.csv')

# 筛选数据
adults = df[df['age'] >= 30]

# 分组统计
city_stats = df.groupby('city')['age'].mean()
```

### 对比 JavaScript 数组操作

```javascript
// JavaScript 实现类似功能
const data = [
  { name: 'Alice', age: 25, city: '北京' },
  { name: 'Bob', age: 30, city: '上海' },
  { name: 'Charlie', age: 35, city: '广州' },
]

// 筛选
const adults = data.filter((item) => item.age >= 30)

// 分组统计需要更多代码...
const cityStats = data.reduce((acc, item) => {
  // 复杂的分组逻辑
}, {})
```

## pandas 常用操作速查

| 操作 | pandas                  | JavaScript       |
| ---- | ----------------------- | ---------------- |
| 筛选 | `df[df['col'] > 10]`    | `arr.filter()`   |
| 映射 | `df['col'].apply(fn)`   | `arr.map()`      |
| 排序 | `df.sort_values('col')` | `arr.sort()`     |
| 去重 | `df.drop_duplicates()`  | `[...new Set()]` |
| 合并 | `pd.merge(df1, df2)`    | 手动实现         |

## 何时使用 pandas

- 处理 CSV/Excel 文件
- 数据清洗和转换
- 统计分析
- 大量数据操作

---
title: csv - CSV 文件处理
description: Python csv 模块详解，与 JavaScript 对比
---

# csv CSV 文件处理

## 学习目标

- 掌握 CSV 文件的读写操作
- 理解 DictReader 和 DictWriter 的使用
- 处理不同格式和编码的 CSV 文件
- 与 JavaScript 的 CSV 处理对比

## 概述

CSV（Comma-Separated Values）是最常见的数据交换格式之一。Python 内置 `csv` 模块提供了完善的 CSV 处理功能。

| Python csv | JavaScript | 说明 |
|-----------|-----------|------|
| `csv.reader()` | 第三方库 (papaparse) | 读取 CSV |
| `csv.writer()` | 手动处理或第三方库 | 写入 CSV |
| `csv.DictReader()` | papaparse header 选项 | 读取为字典 |
| `csv.DictWriter()` | - | 写入字典 |

## 基础读取

### 读取 CSV 文件

```python
import csv

# 基础读取
with open('data.csv', 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    for row in reader:
        print(row)  # row 是列表: ['value1', 'value2', ...]

# 跳过标题行
with open('data.csv', 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    header = next(reader)  # 读取并跳过标题
    for row in reader:
        print(row)

# 读取为列表
with open('data.csv', 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    data = list(reader)
    print(data[0])  # 标题行
    print(data[1:]) # 数据行
```

```javascript
// Node.js 对比（使用 papaparse）
const Papa = require('papaparse')
const fs = require('fs')

const file = fs.readFileSync('data.csv', 'utf8')
const result = Papa.parse(file, { header: true })
console.log(result.data)

// 原生处理（简单情况）
const csv = fs.readFileSync('data.csv', 'utf8')
const lines = csv.split('\n')
const data = lines.map((line) => line.split(','))
```

### DictReader - 读取为字典

```python
import csv

# DictReader 将每行转为字典
with open('users.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)

    # 获取字段名
    print(reader.fieldnames)  # ['name', 'age', 'email']

    for row in reader:
        print(row)
        # {'name': 'Alice', 'age': '25', 'email': 'alice@example.com'}
        print(f"姓名: {row['name']}, 年龄: {row['age']}")

# 自定义字段名（如果 CSV 没有标题行）
with open('data.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f, fieldnames=['col1', 'col2', 'col3'])
    for row in reader:
        print(row)
```

```javascript
// Node.js 对比（papaparse）
const result = Papa.parse(csvString, {
  header: true, // 第一行作为字段名
})

result.data.forEach((row) => {
  console.log(row.name, row.age)
})
```

## 基础写入

### 写入 CSV 文件

```python
import csv

data = [
    ['name', 'age', 'city'],
    ['Alice', 25, 'Beijing'],
    ['Bob', 30, 'Shanghai'],
    ['Charlie', 35, 'Shenzhen']
]

# 基础写入
with open('output.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    for row in data:
        writer.writerow(row)

# 一次写入多行
with open('output.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(data)
```

::: warning newline 参数
在 Windows 上，必须指定 `newline=''`，否则会出现空行问题。
:::

### DictWriter - 写入字典

```python
import csv

users = [
    {'name': 'Alice', 'age': 25, 'email': 'alice@example.com'},
    {'name': 'Bob', 'age': 30, 'email': 'bob@example.com'},
]

with open('users.csv', 'w', encoding='utf-8', newline='') as f:
    fieldnames = ['name', 'age', 'email']
    writer = csv.DictWriter(f, fieldnames=fieldnames)

    writer.writeheader()  # 写入标题行
    writer.writerows(users)

# 或逐行写入
with open('users.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['name', 'age', 'email'])
    writer.writeheader()
    for user in users:
        writer.writerow(user)
```

```javascript
// Node.js 对比
const Papa = require('papaparse')

const data = [
  { name: 'Alice', age: 25, email: 'alice@example.com' },
  { name: 'Bob', age: 30, email: 'bob@example.com' },
]

const csv = Papa.unparse(data)
fs.writeFileSync('users.csv', csv)
```

## 处理特殊情况

### 不同分隔符

```python
import csv

# 读取制表符分隔文件（TSV）
with open('data.tsv', 'r', encoding='utf-8') as f:
    reader = csv.reader(f, delimiter='\t')
    for row in reader:
        print(row)

# 读取分号分隔文件
with open('data.csv', 'r', encoding='utf-8') as f:
    reader = csv.reader(f, delimiter=';')
    for row in reader:
        print(row)

# 写入自定义分隔符
with open('output.tsv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f, delimiter='\t')
    writer.writerows(data)
```

### 处理引号和特殊字符

```python
import csv

# 数据包含逗号、换行、引号
data = [
    ['name', 'description'],
    ['Product A', 'Contains comma, here'],
    ['Product B', 'Has "quotes" inside'],
    ['Product C', 'Multi\nline\ntext'],
]

# 写入时自动处理
with open('output.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f, quoting=csv.QUOTE_MINIMAL)
    writer.writerows(data)

# 不同的引用策略
csv.QUOTE_MINIMAL   # 仅在必要时引用（默认）
csv.QUOTE_ALL       # 引用所有字段
csv.QUOTE_NONNUMERIC  # 引用非数字字段
csv.QUOTE_NONE      # 不引用（需要设置 escapechar）
```

### 处理编码

```python
import csv

# 读取 GBK 编码的 CSV（中文 Windows 常见）
with open('chinese.csv', 'r', encoding='gbk') as f:
    reader = csv.reader(f)
    for row in reader:
        print(row)

# 读取带 BOM 的 UTF-8
with open('excel.csv', 'r', encoding='utf-8-sig') as f:
    reader = csv.reader(f)
    for row in reader:
        print(row)

# 写入 Excel 兼容的 CSV（带 BOM）
with open('for_excel.csv', 'w', encoding='utf-8-sig', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(data)
```

### 处理大文件

```python
import csv

def process_large_csv(filename, chunk_size=1000):
    """分块处理大 CSV 文件"""
    with open(filename, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)

        chunk = []
        for i, row in enumerate(reader):
            chunk.append(row)

            if len(chunk) >= chunk_size:
                yield chunk
                chunk = []

        if chunk:  # 处理最后一批
            yield chunk

# 使用
for batch in process_large_csv('large_file.csv'):
    print(f"处理 {len(batch)} 行")
    # 处理这批数据
```

## 实用示例

### CSV 数据转换

```python
import csv
from pathlib import Path

def csv_to_json(csv_path: str) -> list:
    """CSV 转 JSON"""
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        return list(reader)

def json_to_csv(data: list, csv_path: str):
    """JSON 转 CSV"""
    if not data:
        return

    with open(csv_path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=data[0].keys())
        writer.writeheader()
        writer.writerows(data)

# 使用
data = csv_to_json('input.csv')
json_to_csv(data, 'output.csv')
```

### 数据清洗和转换

```python
import csv

def clean_csv(input_file, output_file):
    """清洗 CSV 数据"""
    with open(input_file, 'r', encoding='utf-8') as fin:
        reader = csv.DictReader(fin)

        # 收集清洗后的数据
        cleaned = []
        for row in reader:
            # 去除空白
            row = {k: v.strip() for k, v in row.items()}

            # 跳过空行
            if not any(row.values()):
                continue

            # 类型转换
            if 'age' in row:
                try:
                    row['age'] = int(row['age'])
                except ValueError:
                    row['age'] = None

            # 标准化
            if 'email' in row:
                row['email'] = row['email'].lower()

            cleaned.append(row)

    # 写入清洗后的数据
    with open(output_file, 'w', encoding='utf-8', newline='') as fout:
        if cleaned:
            writer = csv.DictWriter(fout, fieldnames=cleaned[0].keys())
            writer.writeheader()
            writer.writerows(cleaned)

    return len(cleaned)

count = clean_csv('dirty.csv', 'clean.csv')
print(f"处理了 {count} 行数据")
```

### 合并多个 CSV 文件

```python
import csv
from pathlib import Path

def merge_csv_files(input_dir: str, output_file: str):
    """合并目录下所有 CSV 文件"""
    input_path = Path(input_dir)
    csv_files = list(input_path.glob('*.csv'))

    if not csv_files:
        print("没有找到 CSV 文件")
        return

    all_data = []
    fieldnames = None

    for csv_file in csv_files:
        with open(csv_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)

            if fieldnames is None:
                fieldnames = reader.fieldnames
            elif reader.fieldnames != fieldnames:
                print(f"警告: {csv_file} 的字段不匹配")
                continue

            for row in reader:
                row['_source'] = csv_file.name  # 添加来源标记
                all_data.append(row)

    # 写入合并后的文件
    with open(output_file, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=list(fieldnames) + ['_source'])
        writer.writeheader()
        writer.writerows(all_data)

    print(f"合并了 {len(csv_files)} 个文件，共 {len(all_data)} 行")

merge_csv_files('./data', 'merged.csv')
```

### CSV 数据分析

```python
import csv
from collections import Counter, defaultdict

def analyze_csv(filename: str):
    """分析 CSV 文件"""
    with open(filename, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    if not rows:
        print("空文件")
        return

    # 基本统计
    print(f"总行数: {len(rows)}")
    print(f"字段: {list(rows[0].keys())}")

    # 每列统计
    for field in rows[0].keys():
        values = [row[field] for row in rows if row[field]]
        unique = len(set(values))
        empty = len([row for row in rows if not row[field]])

        print(f"\n字段: {field}")
        print(f"  非空值: {len(values)}")
        print(f"  空值: {empty}")
        print(f"  唯一值: {unique}")

        # 数值列统计
        try:
            nums = [float(v) for v in values]
            print(f"  最小值: {min(nums)}")
            print(f"  最大值: {max(nums)}")
            print(f"  平均值: {sum(nums) / len(nums):.2f}")
        except ValueError:
            # 非数值列显示最常见的值
            counter = Counter(values)
            print(f"  最常见: {counter.most_common(3)}")

analyze_csv('sales.csv')
```

## 与 JS 的关键差异

| 特性 | Python csv | JavaScript |
|-----|-----------|-----------|
| 内置支持 | ✅ 标准库 | ❌ 需要第三方库 |
| 字典读写 | DictReader/DictWriter | papaparse header 选项 |
| 编码处理 | open() 的 encoding 参数 | 手动处理 |
| 流式处理 | 默认支持 | 需要配置 |
| 换行处理 | newline='' 参数 | 自动处理 |

## 常见陷阱

```python
import csv

# 1. Windows 换行问题
# 错误：可能产生空行
with open('output.csv', 'w', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerows(data)

# 正确：指定 newline=''
with open('output.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(data)

# 2. 忘记处理编码
# Excel 保存的 CSV 通常是 GBK 或 UTF-8 BOM
try:
    with open('file.csv', 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        data = list(reader)
except UnicodeDecodeError:
    with open('file.csv', 'r', encoding='gbk') as f:
        reader = csv.reader(f)
        data = list(reader)

# 3. DictReader 字段名空格问题
# CSV: "name", " age"  (age 前有空格)
reader = csv.DictReader(f)
row[' age']  # 需要包含空格

# 4. 数值类型
# CSV 读取的都是字符串
row['age']      # '25' (字符串)
int(row['age']) # 25 (整数)

# 5. 空值处理
row['field']  # '' (空字符串，不是 None)
row['field'] or 'default'  # 处理空值
```

## 小结

- `csv.reader()` / `csv.writer()` 处理列表格式
- `csv.DictReader()` / `csv.DictWriter()` 处理字典格式
- Windows 写入时必须指定 `newline=''`
- 注意文件编码，特别是 GBK 和 UTF-8 BOM
- CSV 读取的值都是字符串，需要手动类型转换
- 处理大文件时使用迭代器，避免一次性加载

::: info 相关内容
- [json 数据格式](./json.md) - JSON 数据处理
- [pandas](/backend/python/libraries/third-party/data/pandas.md) - 更强大的数据处理
:::

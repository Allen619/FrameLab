---
title: 文本与数据处理
description: Python 文本和数据处理相关的标准库
---

# 文本与数据处理

这组模块提供文本处理、正则表达式、数据格式解析等功能。

## 模块概览

| 模块 | 用途 | Node.js 对应 |
|------|------|-------------|
| [re](./re.md) | 正则表达式 | `RegExp` |
| [json](./json.md) | JSON 编解码 | `JSON` |
| [csv](./csv.md) | CSV 文件处理 | `papaparse` 等 |
| [string](./string.md) | 字符串常量和模板 | - |
| [pickle](./pickle.md) | Python 对象序列化 | - |

## 快速对比

### 正则表达式

```python
# Python
import re
result = re.findall(r'\d+', 'a1b2c3')  # ['1', '2', '3']
```

```javascript
// JavaScript
const result = 'a1b2c3'.match(/\d+/g) // ['1', '2', '3']
```

### JSON 处理

```python
# Python
import json
data = json.loads('{"name": "Alice"}')
text = json.dumps(data, indent=2)
```

```javascript
// JavaScript
const data = JSON.parse('{"name": "Alice"}')
const text = JSON.stringify(data, null, 2)
```

### CSV 处理

```python
# Python
import csv
with open('data.csv', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row['name'])
```

```javascript
// JavaScript (需要第三方库)
const Papa = require('papaparse')
const result = Papa.parse(csvString, { header: true })
```

## 学习路径

1. **必学**: [json](./json.md) - 最常用的数据格式
2. **必学**: [re](./re.md) - 文本处理利器
3. **常用**: [csv](./csv.md) - 数据导入导出
4. **了解**: [string](./string.md) - 字符串工具
5. **进阶**: [pickle](./pickle.md) - Python 对象持久化

## 使用建议

| 场景 | 推荐模块 |
|------|---------|
| API 数据交换 | json |
| 配置文件 | json |
| 表格数据 | csv |
| 文本匹配和提取 | re |
| 密码生成 | string |
| 缓存 Python 对象 | pickle |
| 跨语言数据交换 | json (不要用 pickle) |

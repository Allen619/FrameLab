---
title: json - JSON 数据处理
description: Python json 模块详解，与 JavaScript JSON 对象对比
---

# json 数据处理

## 学习目标

- 掌握 JSON 序列化和反序列化
- 理解 Python 与 JSON 类型的映射关系
- 学会自定义编码和解码
- 与 JavaScript JSON 对象对比

## 概述

| Python | JavaScript | 说明 |
|--------|-----------|------|
| `json.loads(str)` | `JSON.parse(str)` | 解析 JSON 字符串 |
| `json.dumps(obj)` | `JSON.stringify(obj)` | 转为 JSON 字符串 |
| `json.load(file)` | `fs.readFile` + `JSON.parse` | 从文件读取 |
| `json.dump(obj, file)` | `fs.writeFile` | 写入文件 |

## 基础用法

### 字符串序列化

```python
import json

# 解析 JSON 字符串
json_str = '{"name": "Alice", "age": 30, "active": true}'
data = json.loads(json_str)
print(data)        # {'name': 'Alice', 'age': 30, 'active': True}
print(data['name'])  # 'Alice'

# 转换为 JSON 字符串
user = {'name': 'Bob', 'age': 25, 'hobbies': ['reading', 'coding']}
json_str = json.dumps(user)
print(json_str)  # {"name": "Bob", "age": 25, "hobbies": ["reading", "coding"]}

# 格式化输出
json_str = json.dumps(user, indent=2)
print(json_str)
# {
#   "name": "Bob",
#   "age": 25,
#   "hobbies": [
#     "reading",
#     "coding"
#   ]
# }

# 不转义非 ASCII 字符（如中文）
data = {'city': '北京', 'country': '中国'}
json.dumps(data)                         # {"city": "\u5317\u4eac", ...}
json.dumps(data, ensure_ascii=False)     # {"city": "北京", "country": "中国"}
```

```javascript
// JavaScript 对比
const jsonStr = '{"name": "Alice", "age": 30, "active": true}'
const data = JSON.parse(jsonStr)
console.log(data.name) // 'Alice'

const user = { name: 'Bob', age: 25, hobbies: ['reading', 'coding'] }
const str = JSON.stringify(user)

// 格式化输出
const formatted = JSON.stringify(user, null, 2)
```

### 文件读写

```python
import json
from pathlib import Path

# 写入 JSON 文件
data = {
    'users': [
        {'name': 'Alice', 'age': 30},
        {'name': 'Bob', 'age': 25}
    ],
    'total': 2
}

# 方式1: 使用 dump
with open('data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

# 方式2: 使用 pathlib + dumps
path = Path('data.json')
path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding='utf-8')

# 读取 JSON 文件
with open('data.json', 'r', encoding='utf-8') as f:
    loaded = json.load(f)

# 或者
loaded = json.loads(Path('data.json').read_text(encoding='utf-8'))

print(loaded['users'][0]['name'])  # 'Alice'
```

```javascript
// Node.js 对比
const fs = require('fs')

// 写入
fs.writeFileSync('data.json', JSON.stringify(data, null, 2))

// 读取
const loaded = JSON.parse(fs.readFileSync('data.json', 'utf8'))
```

## 类型映射

### Python 到 JSON

| Python | JSON |
|--------|------|
| `dict` | object |
| `list`, `tuple` | array |
| `str` | string |
| `int`, `float` | number |
| `True` | true |
| `False` | false |
| `None` | null |

```python
import json

# Python 到 JSON 的类型转换
python_data = {
    'string': 'hello',
    'integer': 42,
    'float': 3.14,
    'boolean_true': True,
    'boolean_false': False,
    'none': None,
    'list': [1, 2, 3],
    'tuple': (4, 5, 6),  # 转为数组
    'nested': {'a': 1}
}

json_str = json.dumps(python_data, indent=2)
print(json_str)
```

### JSON 到 Python

```python
import json

json_str = '''
{
    "string": "hello",
    "number": 42,
    "float": 3.14,
    "true": true,
    "false": false,
    "null": null,
    "array": [1, 2, 3],
    "object": {"a": 1}
}
'''

data = json.loads(json_str)
print(type(data['string']))  # <class 'str'>
print(type(data['number']))  # <class 'int'>
print(type(data['float']))   # <class 'float'>
print(type(data['true']))    # <class 'bool'>
print(type(data['null']))    # <class 'NoneType'>
print(type(data['array']))   # <class 'list'>
print(type(data['object']))  # <class 'dict'>
```

## 自定义序列化

### 处理不支持的类型

```python
import json
from datetime import datetime, date
from decimal import Decimal
from pathlib import Path

# 默认不支持的类型会报错
data = {'now': datetime.now()}
# json.dumps(data)  # TypeError: Object of type datetime is not JSON serializable

# 方式1: 使用 default 参数
def custom_encoder(obj):
    """自定义编码器"""
    if isinstance(obj, datetime):
        return obj.isoformat()
    if isinstance(obj, date):
        return obj.isoformat()
    if isinstance(obj, Decimal):
        return float(obj)
    if isinstance(obj, Path):
        return str(obj)
    if isinstance(obj, set):
        return list(obj)
    raise TypeError(f"Object of type {type(obj).__name__} is not JSON serializable")

data = {
    'created_at': datetime.now(),
    'date': date.today(),
    'price': Decimal('19.99'),
    'path': Path('/home/user'),
    'tags': {'python', 'json'}
}

json_str = json.dumps(data, default=custom_encoder, indent=2)
print(json_str)

# 方式2: 继承 JSONEncoder
class CustomEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        if isinstance(obj, Decimal):
            return float(obj)
        return super().default(obj)

json_str = json.dumps(data, cls=CustomEncoder)
```

```javascript
// JavaScript 对比
const data = {
    created_at: new Date(),
    tags: new Set(['python', 'json'])
}

// 使用 replacer 函数
const jsonStr = JSON.stringify(data, (key, value) => {
    if (value instanceof Date) return value.toISOString()
    if (value instanceof Set) return [...value]
    return value
})
```

### 自定义反序列化

```python
import json
from datetime import datetime

json_str = '''
{
    "name": "Event",
    "created_at": "2024-01-15T10:30:00",
    "tags": ["python", "json"]
}
'''

# 方式1: 使用 object_hook
def custom_decoder(obj):
    """自定义解码器"""
    for key, value in obj.items():
        # 检测 ISO 格式日期字符串
        if isinstance(value, str) and 'T' in value:
            try:
                obj[key] = datetime.fromisoformat(value)
            except ValueError:
                pass
    return obj

data = json.loads(json_str, object_hook=custom_decoder)
print(type(data['created_at']))  # <class 'datetime.datetime'>

# 方式2: 使用 object_pairs_hook（保留顺序）
def pairs_hook(pairs):
    """处理键值对"""
    result = {}
    for key, value in pairs:
        # 自定义处理逻辑
        result[key] = value
    return result

data = json.loads(json_str, object_pairs_hook=pairs_hook)
```

## 常用选项

### dumps 选项

```python
import json

data = {'name': '张三', 'scores': [90, 85, 92]}

# indent: 缩进
json.dumps(data, indent=2)
json.dumps(data, indent='\t')  # 使用制表符

# ensure_ascii: 是否转义非 ASCII
json.dumps(data, ensure_ascii=False)  # 保留中文

# sort_keys: 按键排序
json.dumps(data, sort_keys=True)

# separators: 自定义分隔符（压缩输出）
json.dumps(data, separators=(',', ':'))  # 无空格，最小化

# skipkeys: 跳过非字符串键
data = {1: 'one', 'two': 2}
json.dumps(data, skipkeys=True)  # {"two": 2}

# 组合使用
json_str = json.dumps(
    data,
    indent=2,
    ensure_ascii=False,
    sort_keys=True
)
```

### 解析选项

```python
import json
from decimal import Decimal

# parse_float: 自定义浮点数解析
json_str = '{"price": 19.99}'
data = json.loads(json_str, parse_float=Decimal)
print(type(data['price']))  # <class 'decimal.Decimal'>

# parse_int: 自定义整数解析
json_str = '{"count": 100}'
data = json.loads(json_str, parse_int=str)
print(data['count'])  # '100' (字符串)

# strict: 是否严格模式（默认 True）
# 非严格模式允许控制字符
json_str = '{"text": "line1\nline2"}'  # 包含换行
# json.loads(json_str)  # 严格模式会报错
```

## 实用示例

### 配置文件管理

```python
import json
from pathlib import Path
from typing import Any

class ConfigManager:
    """JSON 配置文件管理器"""

    def __init__(self, config_path: str):
        self.path = Path(config_path)
        self._config = self._load()

    def _load(self) -> dict:
        """加载配置"""
        if self.path.exists():
            return json.loads(self.path.read_text(encoding='utf-8'))
        return {}

    def save(self):
        """保存配置"""
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.write_text(
            json.dumps(self._config, indent=2, ensure_ascii=False),
            encoding='utf-8'
        )

    def get(self, key: str, default: Any = None) -> Any:
        """获取配置值，支持点号路径"""
        keys = key.split('.')
        value = self._config
        for k in keys:
            if isinstance(value, dict):
                value = value.get(k)
            else:
                return default
            if value is None:
                return default
        return value

    def set(self, key: str, value: Any):
        """设置配置值，支持点号路径"""
        keys = key.split('.')
        config = self._config
        for k in keys[:-1]:
            config = config.setdefault(k, {})
        config[keys[-1]] = value
        self.save()

# 使用
config = ConfigManager('config.json')
config.set('database.host', 'localhost')
config.set('database.port', 5432)
print(config.get('database.host'))  # 'localhost'
```

### API 响应处理

```python
import json
from dataclasses import dataclass, asdict
from typing import List, Optional
from datetime import datetime

@dataclass
class User:
    id: int
    name: str
    email: str
    created_at: datetime = None

    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now()

class APIResponse:
    """API 响应封装"""

    def __init__(self, data=None, error=None, status='success'):
        self.data = data
        self.error = error
        self.status = status
        self.timestamp = datetime.now()

    def to_json(self) -> str:
        return json.dumps(self.to_dict(), default=self._encoder, ensure_ascii=False)

    def to_dict(self) -> dict:
        return {
            'status': self.status,
            'data': self.data,
            'error': self.error,
            'timestamp': self.timestamp
        }

    @staticmethod
    def _encoder(obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        if hasattr(obj, '__dataclass_fields__'):
            return asdict(obj)
        raise TypeError(f"Object of type {type(obj).__name__} is not JSON serializable")

# 使用
user = User(id=1, name='Alice', email='alice@example.com')
response = APIResponse(data=user)
print(response.to_json())
# {"status": "success", "data": {"id": 1, "name": "Alice", ...}, ...}
```

### JSON 数据验证

```python
import json

def validate_json_schema(data: dict, schema: dict) -> tuple[bool, str]:
    """简单的 JSON Schema 验证"""

    for field, rules in schema.items():
        # 检查必需字段
        if rules.get('required', False) and field not in data:
            return False, f"缺少必需字段: {field}"

        if field in data:
            value = data[field]

            # 检查类型
            expected_type = rules.get('type')
            if expected_type:
                type_map = {
                    'string': str,
                    'number': (int, float),
                    'integer': int,
                    'boolean': bool,
                    'array': list,
                    'object': dict
                }
                if not isinstance(value, type_map.get(expected_type, object)):
                    return False, f"字段 {field} 类型错误，期望 {expected_type}"

            # 检查最小长度
            min_length = rules.get('minLength')
            if min_length and len(str(value)) < min_length:
                return False, f"字段 {field} 长度不足 {min_length}"

            # 检查范围
            minimum = rules.get('minimum')
            if minimum is not None and value < minimum:
                return False, f"字段 {field} 小于最小值 {minimum}"

    return True, "验证通过"

# 定义 Schema
user_schema = {
    'name': {'type': 'string', 'required': True, 'minLength': 2},
    'age': {'type': 'integer', 'required': True, 'minimum': 0},
    'email': {'type': 'string', 'required': True}
}

# 验证数据
data1 = {'name': 'Alice', 'age': 30, 'email': 'alice@example.com'}
print(validate_json_schema(data1, user_schema))  # (True, '验证通过')

data2 = {'name': 'A', 'age': -1}
print(validate_json_schema(data2, user_schema))  # (False, '...')
```

### JSON Lines 处理

```python
import json
from pathlib import Path
from typing import Iterator

def read_jsonl(file_path: str) -> Iterator[dict]:
    """读取 JSON Lines 文件"""
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line:
                yield json.loads(line)

def write_jsonl(file_path: str, items: list):
    """写入 JSON Lines 文件"""
    with open(file_path, 'w', encoding='utf-8') as f:
        for item in items:
            f.write(json.dumps(item, ensure_ascii=False) + '\n')

def append_jsonl(file_path: str, item: dict):
    """追加到 JSON Lines 文件"""
    with open(file_path, 'a', encoding='utf-8') as f:
        f.write(json.dumps(item, ensure_ascii=False) + '\n')

# 使用
logs = [
    {'level': 'INFO', 'message': 'Started'},
    {'level': 'ERROR', 'message': 'Failed'},
    {'level': 'INFO', 'message': 'Completed'}
]

write_jsonl('logs.jsonl', logs)

for log in read_jsonl('logs.jsonl'):
    print(f"[{log['level']}] {log['message']}")
```

## 与 JS 的关键差异

| 特性 | Python json | JavaScript JSON |
|-----|------------|----------------|
| 方法名 | `loads`/`dumps` (s=string) | `parse`/`stringify` |
| 文件操作 | `load`/`dump` 直接支持 | 需要单独读写文件 |
| 布尔值 | `True`/`False` | `true`/`false` |
| 空值 | `None` | `null` |
| 单引号 | 不支持 | 不支持 |
| 尾随逗号 | 不支持 | 不支持 |
| 注释 | 不支持 | 不支持 |

## 常见陷阱

```python
import json

# 1. 单引号不是合法 JSON
# json.loads("{'name': 'Alice'}")  # JSONDecodeError
json.loads('{"name": "Alice"}')    # 正确

# 2. 元组会转为数组
data = {'tuple': (1, 2, 3)}
loaded = json.loads(json.dumps(data))
print(type(loaded['tuple']))  # <class 'list'>

# 3. 字典键必须是字符串
data = {1: 'one', 2: 'two'}
json.dumps(data)  # {"1": "one", "2": "two"} - 键被转为字符串

# 4. NaN 和 Infinity 不是标准 JSON
import math
data = {'value': float('nan')}
json.dumps(data)              # {"value": NaN} - 非标准
json.dumps(data, allow_nan=False)  # ValueError

# 5. 循环引用
a = {}
a['self'] = a
# json.dumps(a)  # ValueError: Circular reference detected

# 6. 编码问题
data = {'text': '中文'}
json.dumps(data)                      # {"text": "\u4e2d\u6587"}
json.dumps(data, ensure_ascii=False)  # {"text": "中文"}

# 7. 大整数精度
big_num = 9007199254740993
json_str = json.dumps({'n': big_num})
# JavaScript 中可能丢失精度
```

## 性能优化

```python
import json

# 1. 重复使用编码器
encoder = json.JSONEncoder(ensure_ascii=False, indent=2)
for item in large_list:
    json_str = encoder.encode(item)

# 2. 使用更快的 JSON 库
# pip install orjson  # 最快
# pip install ujson   # 较快

# orjson 示例
import orjson

data = {'name': 'Alice', 'age': 30}
json_bytes = orjson.dumps(data)  # 返回 bytes
json_str = json_bytes.decode('utf-8')

loaded = orjson.loads(json_str)

# 3. 流式处理大文件
def process_large_json(file_path):
    """流式处理大型 JSON 数组"""
    with open(file_path, 'r') as f:
        # 跳过开头的 [
        f.read(1)

        buffer = ''
        depth = 0

        for char in iter(lambda: f.read(1), ''):
            buffer += char

            if char == '{':
                depth += 1
            elif char == '}':
                depth -= 1
                if depth == 0:
                    obj = json.loads(buffer.strip().rstrip(','))
                    yield obj
                    buffer = ''
```

## 小结

- `json.loads()`/`json.dumps()` 处理字符串
- `json.load()`/`json.dump()` 处理文件
- 使用 `ensure_ascii=False` 保留中文
- 使用 `indent` 格式化输出
- 使用 `default` 或 `JSONEncoder` 处理自定义类型
- 使用 `object_hook` 自定义反序列化
- 注意 Python 布尔值 `True`/`False` vs JSON `true`/`false`

::: info 相关内容
- [csv 表格处理](./csv.md) - CSV 文件处理
- [pickle 序列化](./pickle.md) - Python 对象序列化
- [pathlib 路径操作](../file-system/pathlib.md) - 文件路径处理
:::

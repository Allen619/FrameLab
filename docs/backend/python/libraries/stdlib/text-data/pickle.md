---
title: pickle - 对象序列化
description: Python pickle 模块详解，对象持久化和序列化
---

# pickle 对象序列化

## 学习目标

- 理解 pickle 序列化的概念和用途
- 掌握对象的保存和加载
- 了解 pickle 的安全风险
- 与 JSON 序列化的对比

## 概述

`pickle` 是 Python 特有的序列化模块，可以将几乎任何 Python 对象转换为字节流，并能完整恢复。

| pickle | JSON | 说明 |
|--------|------|------|
| Python 专用 | 跨语言通用 | 兼容性 |
| 支持几乎所有对象 | 仅支持基本类型 | 支持范围 |
| 二进制格式 | 文本格式 | 格式 |
| 有安全风险 | 相对安全 | 安全性 |
| 需要 pickle | 需要 json | 模块 |

::: warning 安全警告
**永远不要加载不信任来源的 pickle 数据**！pickle 可以执行任意代码，恶意数据可能导致系统被入侵。
:::

## 基础用法

### 序列化到字节流

```python
import pickle

# 基本类型
data = {
    'name': 'Alice',
    'age': 25,
    'scores': [95, 87, 92],
    'active': True
}

# 序列化为字节
pickled = pickle.dumps(data)
print(type(pickled))  # <class 'bytes'>
print(pickled[:50])   # b'\x80\x05\x95...'

# 反序列化
restored = pickle.loads(pickled)
print(restored)       # {'name': 'Alice', 'age': 25, ...}
print(data == restored)  # True
```

### 保存到文件

```python
import pickle

data = {'users': ['Alice', 'Bob'], 'count': 2}

# 保存到文件
with open('data.pkl', 'wb') as f:  # 注意: 二进制模式
    pickle.dump(data, f)

# 从文件加载
with open('data.pkl', 'rb') as f:
    loaded = pickle.load(f)

print(loaded)  # {'users': ['Alice', 'Bob'], 'count': 2}
```

```javascript
// JavaScript 没有直接等价物
// 通常使用 JSON 或 MessagePack

const data = { users: ['Alice', 'Bob'], count: 2 }

// JSON 方式
const fs = require('fs')
fs.writeFileSync('data.json', JSON.stringify(data))
const loaded = JSON.parse(fs.readFileSync('data.json', 'utf8'))
```

## 序列化复杂对象

### 自定义类

```python
import pickle

class User:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def greet(self):
        return f"Hello, I'm {self.name}"

# 序列化自定义对象
user = User('Alice', 25)
pickled = pickle.dumps(user)

# 反序列化
restored = pickle.loads(pickled)
print(restored.name)    # 'Alice'
print(restored.greet()) # "Hello, I'm Alice"
print(type(restored))   # <class '__main__.User'>
```

### 嵌套和循环引用

```python
import pickle

# 嵌套对象
class Company:
    def __init__(self, name):
        self.name = name
        self.employees = []

class Employee:
    def __init__(self, name, company):
        self.name = name
        self.company = company

company = Company('TechCorp')
emp1 = Employee('Alice', company)
emp2 = Employee('Bob', company)
company.employees = [emp1, emp2]

# pickle 可以处理循环引用
pickled = pickle.dumps(company)
restored = pickle.loads(pickled)

print(restored.name)  # 'TechCorp'
print(restored.employees[0].name)  # 'Alice'
print(restored.employees[0].company.name)  # 'TechCorp'
# 循环引用被正确恢复
print(restored.employees[0].company is restored)  # True
```

### 不能序列化的对象

```python
import pickle

# 1. lambda 函数
# pickle.dumps(lambda x: x * 2)  # PicklingError

# 2. 打开的文件对象
# f = open('file.txt')
# pickle.dumps(f)  # TypeError

# 3. 网络连接、线程、进程
# 4. 某些 C 扩展对象

# 解决方案: 自定义序列化
class Connection:
    def __init__(self, host, port):
        self.host = host
        self.port = port
        self._socket = None  # 不能序列化

    def __getstate__(self):
        """定义要序列化的状态"""
        state = self.__dict__.copy()
        del state['_socket']  # 排除不能序列化的属性
        return state

    def __setstate__(self, state):
        """从序列化状态恢复"""
        self.__dict__.update(state)
        self._socket = None  # 重新初始化

conn = Connection('localhost', 8080)
pickled = pickle.dumps(conn)
restored = pickle.loads(pickled)
print(restored.host)  # 'localhost'
```

## 协议版本

```python
import pickle

data = {'key': 'value'}

# 指定协议版本
pickled_0 = pickle.dumps(data, protocol=0)  # ASCII，可读
pickled_4 = pickle.dumps(data, protocol=4)  # Python 3.4+
pickled_5 = pickle.dumps(data, protocol=5)  # Python 3.8+

# 使用最高协议（推荐）
pickled = pickle.dumps(data, protocol=pickle.HIGHEST_PROTOCOL)

# 查看协议
print(pickle.HIGHEST_PROTOCOL)  # 5 (Python 3.8+)
print(pickle.DEFAULT_PROTOCOL)  # 4 (Python 3.8+)

# 协议 0 是 ASCII，可以查看
print(pickled_0)
# b"(dp0\nVkey\np1\nVvalue\np2\ns."

# 高版本协议更高效但不可读
print(len(pickled_0), len(pickled_5))  # ASCII 更大
```

## 安全使用

### 风险示例

```python
import pickle
import os

# 恶意 pickle 数据可以执行任意代码！
class Malicious:
    def __reduce__(self):
        # 这会在反序列化时执行
        return (os.system, ('echo HACKED!',))

# 永远不要加载不信任的数据
# malicious_data = pickle.dumps(Malicious())
# pickle.loads(malicious_data)  # 执行 os.system('echo HACKED!')
```

### 安全替代方案

```python
import json
import pickle

# 方案1: 使用 JSON（安全但功能有限）
def safe_serialize(obj):
    """安全序列化，仅支持基本类型"""
    try:
        return json.dumps(obj)
    except TypeError:
        raise ValueError("对象包含不支持的类型")

# 方案2: 白名单验证
import io

class SafeUnpickler(pickle.Unpickler):
    """限制可反序列化的类"""

    ALLOWED_CLASSES = {
        ('__main__', 'User'),
        ('__main__', 'Product'),
        # 添加允许的类
    }

    def find_class(self, module, name):
        if (module, name) not in self.ALLOWED_CLASSES:
            raise pickle.UnpicklingError(f"不允许的类: {module}.{name}")
        return super().find_class(module, name)

def safe_loads(data):
    """安全加载 pickle 数据"""
    return SafeUnpickler(io.BytesIO(data)).load()

# 使用
class User:
    def __init__(self, name):
        self.name = name

user = User('Alice')
pickled = pickle.dumps(user)

# 安全加载
try:
    restored = safe_loads(pickled)
    print(restored.name)
except pickle.UnpicklingError as e:
    print(f"不安全的数据: {e}")
```

## 实用示例

### 缓存装饰器

```python
import pickle
import functools
from pathlib import Path
import hashlib

def disk_cache(cache_dir='.cache'):
    """基于 pickle 的磁盘缓存"""

    def decorator(func):
        cache_path = Path(cache_dir)
        cache_path.mkdir(exist_ok=True)

        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            # 生成缓存键
            key_data = (func.__name__, args, tuple(sorted(kwargs.items())))
            key_hash = hashlib.md5(pickle.dumps(key_data)).hexdigest()
            cache_file = cache_path / f"{key_hash}.pkl"

            # 尝试从缓存读取
            if cache_file.exists():
                with open(cache_file, 'rb') as f:
                    return pickle.load(f)

            # 执行函数并缓存结果
            result = func(*args, **kwargs)
            with open(cache_file, 'wb') as f:
                pickle.dump(result, f)

            return result

        def clear_cache():
            for f in cache_path.glob('*.pkl'):
                f.unlink()

        wrapper.clear_cache = clear_cache
        return wrapper

    return decorator

# 使用
@disk_cache()
def expensive_computation(n):
    """耗时计算"""
    import time
    time.sleep(2)  # 模拟耗时
    return sum(i * i for i in range(n))

# 第一次调用会慢
result1 = expensive_computation(1000)
# 第二次调用从缓存读取
result2 = expensive_computation(1000)

# 清除缓存
expensive_computation.clear_cache()
```

### 会话状态保存

```python
import pickle
from pathlib import Path
from datetime import datetime

class Session:
    """应用会话管理"""

    def __init__(self, session_file='session.pkl'):
        self.session_file = Path(session_file)
        self.data = self._load()

    def _load(self):
        """加载会话"""
        if self.session_file.exists():
            try:
                with open(self.session_file, 'rb') as f:
                    return pickle.load(f)
            except Exception:
                return {}
        return {}

    def save(self):
        """保存会话"""
        self.data['_last_saved'] = datetime.now()
        with open(self.session_file, 'wb') as f:
            pickle.dump(self.data, f)

    def get(self, key, default=None):
        return self.data.get(key, default)

    def set(self, key, value):
        self.data[key] = value
        self.save()

    def delete(self, key):
        if key in self.data:
            del self.data[key]
            self.save()

    def clear(self):
        self.data = {}
        self.save()

# 使用
session = Session()
session.set('user', {'name': 'Alice', 'role': 'admin'})
session.set('preferences', {'theme': 'dark', 'language': 'zh'})

# 下次启动时自动恢复
session2 = Session()
print(session2.get('user'))  # {'name': 'Alice', 'role': 'admin'}
```

### 对象深拷贝

```python
import pickle
import copy

class ComplexObject:
    def __init__(self):
        self.data = {'nested': {'deep': [1, 2, 3]}}
        self.children = []

obj = ComplexObject()
obj.children.append(ComplexObject())

# 方法1: copy.deepcopy (推荐)
obj_copy1 = copy.deepcopy(obj)

# 方法2: pickle (有时更快)
obj_copy2 = pickle.loads(pickle.dumps(obj))

# 验证是深拷贝
obj.data['nested']['deep'].append(4)
print(obj.data['nested']['deep'])       # [1, 2, 3, 4]
print(obj_copy1.data['nested']['deep']) # [1, 2, 3]
print(obj_copy2.data['nested']['deep']) # [1, 2, 3]
```

### 模型保存（机器学习场景）

```python
import pickle
from dataclasses import dataclass
from typing import List

@dataclass
class ModelMetadata:
    name: str
    version: str
    accuracy: float
    features: List[str]

class SimpleModel:
    """简单的模型示例"""

    def __init__(self, name='model'):
        self.name = name
        self.weights = None
        self.metadata = None

    def train(self, data):
        """训练模型"""
        # 模拟训练
        self.weights = [0.1, 0.2, 0.3]
        self.metadata = ModelMetadata(
            name=self.name,
            version='1.0',
            accuracy=0.95,
            features=['feature1', 'feature2']
        )

    def predict(self, x):
        """预测"""
        if self.weights is None:
            raise ValueError("模型未训练")
        return sum(w * xi for w, xi in zip(self.weights, x))

    def save(self, filepath):
        """保存模型"""
        with open(filepath, 'wb') as f:
            pickle.dump(self, f)
        print(f"模型已保存到 {filepath}")

    @classmethod
    def load(cls, filepath):
        """加载模型"""
        with open(filepath, 'rb') as f:
            model = pickle.load(f)
        print(f"模型已加载: {model.metadata.name} v{model.metadata.version}")
        return model

# 使用
model = SimpleModel('my_model')
model.train([1, 2, 3])
model.save('model.pkl')

# 加载并使用
loaded_model = SimpleModel.load('model.pkl')
result = loaded_model.predict([1, 2, 3])
print(f"预测结果: {result}")
```

## pickle vs JSON

| 特性 | pickle | JSON |
|-----|--------|------|
| 数据类型 | 几乎所有 Python 对象 | dict, list, str, int, float, bool, None |
| 自定义类 | ✅ 支持 | ❌ 需要手动转换 |
| 跨语言 | ❌ Python 专用 | ✅ 通用格式 |
| 可读性 | ❌ 二进制 | ✅ 文本可读 |
| 安全性 | ⚠️ 可执行代码 | ✅ 相对安全 |
| 性能 | 通常更快 | 较慢 |
| 版本兼容 | 可能有问题 | 稳定 |

### 选择建议

```python
# 使用 JSON 当:
# - 需要与其他语言/系统交互
# - 数据只包含基本类型
# - 需要人类可读
# - 安全性要求高

# 使用 pickle 当:
# - 仅在 Python 内部使用
# - 需要保存复杂对象（类实例、函数等）
# - 性能是关键考虑
# - 数据来源可信
```

## 常见陷阱

```python
import pickle

# 1. 安全风险 - 永远不要加载不信任的数据
# pickle.loads(untrusted_data)  # 危险！

# 2. 类定义必须可用
# 反序列化时，类必须能被导入
class MyClass:
    pass

obj = MyClass()
pickled = pickle.dumps(obj)
# 如果删除 MyClass 定义，loads 会失败

# 3. 跨版本兼容性
# Python 版本更新可能导致旧 pickle 无法加载

# 4. 文件模式必须是二进制
# with open('data.pkl', 'w') as f:  # 错误！
#     pickle.dump(data, f)

with open('data.pkl', 'wb') as f:  # 正确
    pickle.dump(data, f)

# 5. lambda 和局部函数不能序列化
# pickle.dumps(lambda x: x)  # 错误

# 6. 修改类后加载旧数据可能出问题
class User:
    def __init__(self, name):
        self.name = name
        # 新增字段
        self.email = None  # 旧数据没有这个字段
```

## 小结

- `pickle` 可以序列化几乎任何 Python 对象
- 使用 `dump()`/`load()` 操作文件，`dumps()`/`loads()` 操作字节
- **永远不要加载不信任来源的 pickle 数据**
- 需要跨语言兼容时使用 JSON，Python 内部使用 pickle
- 使用 `protocol=pickle.HIGHEST_PROTOCOL` 获得最佳性能
- 自定义 `__getstate__`/`__setstate__` 控制序列化行为

::: info 相关内容
- [json 数据格式](./json.md) - 安全的跨语言序列化
- [copy 拷贝](/backend/python/libraries/stdlib/utilities/copy.md) - 对象拷贝
:::

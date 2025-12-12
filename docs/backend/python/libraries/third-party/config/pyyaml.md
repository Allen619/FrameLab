---
title: pyyaml - YAML 解析
description: Python PyYAML 库解析 YAML 配置文件
---

# pyyaml YAML 解析

## 本章目标

- 掌握 YAML 文件读写
- 理解安全加载机制
- 学习自定义类型序列化
- 对比 Node.js js-yaml

## 对比

| Python PyYAML | Node.js js-yaml | 说明 |
|---------------|-----------------|------|
| `yaml.safe_load()` | `yaml.load()` | 安全加载 |
| `yaml.dump()` | `yaml.dump()` | 序列化 |
| `yaml.safe_load_all()` | 多文档 | 多文档解析 |

## 安装

```bash
pip install pyyaml

# poetry
poetry add pyyaml
```

## 基础用法

### 读取 YAML

```python
import yaml

# YAML 字符串
yaml_str = """
name: Alice
age: 30
skills:
  - Python
  - JavaScript
  - Go
"""

# 解析 YAML
data = yaml.safe_load(yaml_str)
print(data)
# {'name': 'Alice', 'age': 30, 'skills': ['Python', 'JavaScript', 'Go']}

# 从文件读取
with open("config.yaml", "r", encoding="utf-8") as f:
    config = yaml.safe_load(f)
```

### 写入 YAML

```python
import yaml

data = {
    "database": {
        "host": "localhost",
        "port": 5432,
        "name": "myapp"
    },
    "debug": True,
    "features": ["auth", "api", "admin"]
}

# 转为 YAML 字符串
yaml_str = yaml.dump(data, allow_unicode=True, default_flow_style=False)
print(yaml_str)

# 写入文件
with open("output.yaml", "w", encoding="utf-8") as f:
    yaml.dump(data, f, allow_unicode=True)
```

### 多文档处理

```python
import yaml

# 多文档 YAML
yaml_str = """
---
name: doc1
value: 100
---
name: doc2
value: 200
"""

# 解析所有文档
docs = list(yaml.safe_load_all(yaml_str))
print(docs)
# [{'name': 'doc1', 'value': 100}, {'name': 'doc2', 'value': 200}]

# 写入多文档
with open("multi.yaml", "w") as f:
    yaml.dump_all(docs, f)
```

## 安全性

### safe_load vs load

```python
import yaml

# 安全加载（推荐）- 只解析基本类型
data = yaml.safe_load(yaml_str)

# 不安全加载 - 可执行任意 Python 代码
# data = yaml.load(yaml_str, Loader=yaml.FullLoader)  # 不推荐

# 各种 Loader
# yaml.SafeLoader   - 最安全，只解析基本类型
# yaml.FullLoader   - 默认，解析大部分类型
# yaml.UnsafeLoader - 不安全，可执行代码
```

### 安全加载配置

```python
import yaml

# 始终使用 safe_load
def load_config(path: str) -> dict:
    """安全加载 YAML 配置"""
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f) or {}

config = load_config("config.yaml")
```

## 序列化选项

### 格式控制

```python
import yaml

data = {"name": "Alice", "items": [1, 2, 3]}

# 块样式（默认）
print(yaml.dump(data, default_flow_style=False))
# name: Alice
# items:
# - 1
# - 2
# - 3

# 流样式
print(yaml.dump(data, default_flow_style=True))
# {name: Alice, items: [1, 2, 3]}

# 缩进控制
print(yaml.dump(data, indent=4))
```

### 中文支持

```python
import yaml

data = {"名字": "张三", "年龄": 25}

# 支持中文
yaml_str = yaml.dump(data, allow_unicode=True)
print(yaml_str)
# 名字: 张三
# 年龄: 25
```

### 排序键

```python
import yaml

data = {"c": 3, "a": 1, "b": 2}

# 按键排序
yaml_str = yaml.dump(data, sort_keys=True)
print(yaml_str)
# a: 1
# b: 2
# c: 3
```

## 自定义类型

### 使用标签

```python
import yaml
from datetime import datetime

yaml_str = """
created: 2024-01-15
updated: !timestamp 2024-01-20T10:30:00
"""

# 自定义构造器
def timestamp_constructor(loader, node):
    value = loader.construct_scalar(node)
    return datetime.fromisoformat(value)

yaml.SafeLoader.add_constructor("!timestamp", timestamp_constructor)
data = yaml.safe_load(yaml_str)
print(data["updated"])  # datetime 对象
```

### 序列化自定义对象

```python
import yaml

class User:
    def __init__(self, name: str, email: str):
        self.name = name
        self.email = email

# 表示器
def user_representer(dumper, user):
    return dumper.represent_mapping(
        "!user",
        {"name": user.name, "email": user.email}
    )

# 构造器
def user_constructor(loader, node):
    value = loader.construct_mapping(node)
    return User(**value)

yaml.SafeDumper.add_representer(User, user_representer)
yaml.SafeLoader.add_constructor("!user", user_constructor)

# 使用
user = User("Alice", "alice@example.com")
yaml_str = yaml.dump(user, Dumper=yaml.SafeDumper)
print(yaml_str)
# !user
# email: alice@example.com
# name: Alice

loaded = yaml.safe_load(yaml_str)
print(loaded.name)  # Alice
```

## 实战示例

### 配置文件管理

```python
import yaml
from pathlib import Path
from typing import Any

class ConfigManager:
    def __init__(self, config_path: str):
        self.path = Path(config_path)
        self._config = self._load()

    def _load(self) -> dict:
        if self.path.exists():
            with open(self.path, "r", encoding="utf-8") as f:
                return yaml.safe_load(f) or {}
        return {}

    def save(self):
        with open(self.path, "w", encoding="utf-8") as f:
            yaml.dump(self._config, f, allow_unicode=True)

    def get(self, key: str, default: Any = None) -> Any:
        keys = key.split(".")
        value = self._config
        for k in keys:
            if isinstance(value, dict):
                value = value.get(k)
            else:
                return default
        return value if value is not None else default

    def set(self, key: str, value: Any):
        keys = key.split(".")
        config = self._config
        for k in keys[:-1]:
            config = config.setdefault(k, {})
        config[keys[-1]] = value

# 使用
config = ConfigManager("app.yaml")
print(config.get("database.host", "localhost"))
config.set("database.port", 5432)
config.save()
```

### 多环境配置

```python
import yaml
from pathlib import Path

def load_config(env: str = "development") -> dict:
    """加载环境配置"""
    base_path = Path("config")

    # 加载基础配置
    with open(base_path / "base.yaml", encoding="utf-8") as f:
        config = yaml.safe_load(f) or {}

    # 加载环境配置
    env_file = base_path / f"{env}.yaml"
    if env_file.exists():
        with open(env_file, encoding="utf-8") as f:
            env_config = yaml.safe_load(f) or {}
            # 深度合并
            deep_merge(config, env_config)

    return config

def deep_merge(base: dict, override: dict):
    """深度合并字典"""
    for key, value in override.items():
        if key in base and isinstance(base[key], dict) and isinstance(value, dict):
            deep_merge(base[key], value)
        else:
            base[key] = value
```

## 与 Node.js js-yaml 对比

```python
# Python
import yaml

with open("config.yaml") as f:
    config = yaml.safe_load(f)
```

```javascript
// Node.js
const yaml = require('js-yaml')
const fs = require('fs')

const config = yaml.load(fs.readFileSync('config.yaml', 'utf8'))
```

## 小结

**核心函数**:
- `yaml.safe_load()`: 安全解析
- `yaml.dump()`: 序列化
- `yaml.safe_load_all()`: 多文档

**安全性**:
- 始终使用 `safe_load`
- 避免 `yaml.load()` 无 Loader

::: tip 最佳实践
- 使用 safe_load 防止代码注入
- 配置 allow_unicode 支持中文
- 使用类型提示和 dataclass
:::

::: warning 安全警告
不要使用 `yaml.load()` 加载不可信数据，可能导致任意代码执行！
:::

::: info 相关库
- `ruamel.yaml` - 保留格式的 YAML
- `strictyaml` - 更严格的 YAML
- `pydantic` - 配置验证
:::

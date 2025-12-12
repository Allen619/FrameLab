---
title: toml - TOML 配置
description: Python TOML 配置文件解析库
---

# toml TOML 配置

## 本章目标

- 掌握 TOML 文件读写
- 理解 Python 3.11+ 内置支持
- 学习 pyproject.toml 解析
- 对比 YAML 和 JSON

## 对比

| 格式 | 优点 | 缺点 |
|------|------|------|
| TOML | 简洁、可读性好 | 嵌套深时略复杂 |
| YAML | 灵活、支持复杂结构 | 空格敏感、安全问题 |
| JSON | 通用、工具支持好 | 不支持注释 |

## 安装

```bash
# Python 3.11+ 内置 tomllib（只读）
# 如需写入或 Python < 3.11
pip install toml

# 或使用 tomli (只读，性能更好)
pip install tomli

# 写入使用 tomli-w
pip install tomli-w

# poetry
poetry add toml
```

## 基础用法

### 读取 TOML (Python 3.11+)

```python
import tomllib  # Python 3.11+ 内置

# 从文件读取
with open("config.toml", "rb") as f:
    config = tomllib.load(f)

# 从字符串读取
toml_str = """
[database]
host = "localhost"
port = 5432
"""
config = tomllib.loads(toml_str)
print(config)
# {'database': {'host': 'localhost', 'port': 5432}}
```

### 读取 TOML (兼容方式)

```python
# 兼容 Python < 3.11
try:
    import tomllib
except ImportError:
    import tomli as tomllib

with open("config.toml", "rb") as f:
    config = tomllib.load(f)
```

### 写入 TOML

```python
import toml  # 需要 toml 库

data = {
    "title": "My App",
    "database": {
        "host": "localhost",
        "port": 5432,
    },
    "features": ["auth", "api"],
}

# 转为字符串
toml_str = toml.dumps(data)
print(toml_str)

# 写入文件
with open("output.toml", "w") as f:
    toml.dump(data, f)
```

### 使用 tomli-w 写入

```python
import tomli_w

data = {"name": "app", "version": "1.0.0"}

# 写入文件
with open("config.toml", "wb") as f:
    tomli_w.dump(data, f)

# 转为字符串
toml_str = tomli_w.dumps(data)
```

## TOML 语法

### 基本类型

```toml
# 字符串
name = "Alice"
multiline = """
多行
字符串
"""

# 数字
integer = 42
float = 3.14
hex = 0xDEADBEEF

# 布尔
enabled = true
disabled = false

# 日期时间
date = 2024-01-15
datetime = 2024-01-15T10:30:00Z
```

### 表（节）

```toml
[database]
host = "localhost"
port = 5432

[database.connection]
timeout = 30
pool_size = 10

# 等价于
# database = {host = "localhost", port = 5432, connection = {timeout = 30, pool_size = 10}}
```

### 数组

```toml
# 简单数组
numbers = [1, 2, 3]
strings = ["a", "b", "c"]

# 表数组
[[servers]]
name = "web1"
ip = "10.0.0.1"

[[servers]]
name = "web2"
ip = "10.0.0.2"

# 等价于
# servers = [{name = "web1", ip = "10.0.0.1"}, {name = "web2", ip = "10.0.0.2"}]
```

## pyproject.toml

### 解析项目配置

```python
try:
    import tomllib
except ImportError:
    import tomli as tomllib
from pathlib import Path

def load_pyproject() -> dict:
    """加载 pyproject.toml"""
    pyproject_path = Path("pyproject.toml")
    if not pyproject_path.exists():
        return {}

    with open(pyproject_path, "rb") as f:
        return tomllib.load(f)

config = load_pyproject()

# 获取项目信息
project = config.get("project", {})
print(f"Name: {project.get('name')}")
print(f"Version: {project.get('version')}")

# 获取工具配置
tool = config.get("tool", {})
ruff_config = tool.get("ruff", {})
pytest_config = tool.get("pytest", {})
```

### pyproject.toml 结构

```toml
[project]
name = "my-app"
version = "1.0.0"
description = "My Application"
authors = [{name = "Author", email = "author@example.com"}]
requires-python = ">=3.10"
dependencies = [
    "fastapi>=0.100.0",
    "pydantic>=2.0.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.0.0",
    "ruff>=0.1.0",
]

[project.scripts]
my-app = "my_app.cli:main"

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.ruff]
line-length = 88
select = ["E", "F", "W"]

[tool.pytest.ini_options]
testpaths = ["tests"]
```

## 实战示例

### 配置管理类

```python
try:
    import tomllib
except ImportError:
    import tomli as tomllib
import tomli_w
from pathlib import Path
from dataclasses import dataclass
from typing import Optional

@dataclass
class DatabaseConfig:
    host: str = "localhost"
    port: int = 5432
    name: str = "app"

@dataclass
class AppConfig:
    name: str = "My App"
    debug: bool = False
    database: DatabaseConfig = None

    def __post_init__(self):
        if self.database is None:
            self.database = DatabaseConfig()

class ConfigLoader:
    def __init__(self, path: str = "config.toml"):
        self.path = Path(path)

    def load(self) -> AppConfig:
        if not self.path.exists():
            return AppConfig()

        with open(self.path, "rb") as f:
            data = tomllib.load(f)

        db_data = data.get("database", {})
        return AppConfig(
            name=data.get("name", "My App"),
            debug=data.get("debug", False),
            database=DatabaseConfig(**db_data),
        )

    def save(self, config: AppConfig):
        data = {
            "name": config.name,
            "debug": config.debug,
            "database": {
                "host": config.database.host,
                "port": config.database.port,
                "name": config.database.name,
            },
        }
        with open(self.path, "wb") as f:
            tomli_w.dump(data, f)

# 使用
loader = ConfigLoader()
config = loader.load()
print(config.database.host)
```

### 环境配置切换

```python
try:
    import tomllib
except ImportError:
    import tomli as tomllib
from pathlib import Path
import os

def load_config(env: Optional[str] = None) -> dict:
    """加载环境特定配置"""
    env = env or os.environ.get("APP_ENV", "development")
    config_dir = Path("config")

    # 基础配置
    base_file = config_dir / "base.toml"
    config = {}
    if base_file.exists():
        with open(base_file, "rb") as f:
            config = tomllib.load(f)

    # 环境配置
    env_file = config_dir / f"{env}.toml"
    if env_file.exists():
        with open(env_file, "rb") as f:
            env_config = tomllib.load(f)
            # 合并配置
            deep_update(config, env_config)

    return config

def deep_update(base: dict, override: dict):
    for key, value in override.items():
        if key in base and isinstance(base[key], dict) and isinstance(value, dict):
            deep_update(base[key], value)
        else:
            base[key] = value
```

## 与其他格式对比

```toml
# TOML
[database]
host = "localhost"
port = 5432
```

```yaml
# YAML
database:
  host: localhost
  port: 5432
```

```json
{
  "database": {
    "host": "localhost",
    "port": 5432
  }
}
```

## 小结

**读取方式**:
- Python 3.11+: `tomllib`
- Python < 3.11: `tomli`
- 需要写入: `toml` 或 `tomli-w`

**特点**:
- 语法简洁清晰
- 支持注释
- Python 项目标准配置

::: tip 最佳实践
- 优先使用 tomllib（Python 3.11+）
- 项目配置使用 pyproject.toml
- 复杂嵌套考虑用 YAML
:::

::: info 相关库
- `tomllib` - Python 3.11+ 内置
- `tomli` - 兼容库（只读）
- `tomli-w` - 写入支持
- `toml` - 读写支持
:::

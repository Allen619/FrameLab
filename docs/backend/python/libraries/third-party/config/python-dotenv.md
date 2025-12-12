---
title: python-dotenv - 环境变量
description: Python python-dotenv 环境变量管理库
---

# python-dotenv 环境变量

## 本章目标

- 掌握 .env 文件加载
- 理解环境变量管理
- 学习多环境配置
- 对比 Node.js dotenv

## 对比

| Python | Node.js | 说明 |
|--------|---------|------|
| `load_dotenv()` | `dotenv.config()` | 加载配置 |
| `os.environ.get()` | `process.env` | 读取变量 |
| `dotenv_values()` | 自定义解析 | 获取字典 |

## 安装

```bash
pip install python-dotenv

# poetry
poetry add python-dotenv
```

## 基础用法

### .env 文件格式

```ini
# .env 文件
DATABASE_URL=postgresql://localhost/mydb
SECRET_KEY=your-secret-key
DEBUG=true
PORT=8000

# 带引号的值
APP_NAME="My Application"

# 多行值
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQ...
-----END RSA PRIVATE KEY-----"
```

### 加载环境变量

```python
from dotenv import load_dotenv
import os

# 加载 .env 文件
load_dotenv()

# 读取环境变量
database_url = os.environ.get("DATABASE_URL")
secret_key = os.environ.get("SECRET_KEY")
debug = os.environ.get("DEBUG", "false").lower() == "true"
port = int(os.environ.get("PORT", "8000"))

print(f"Database: {database_url}")
print(f"Debug: {debug}")
```

### 指定文件路径

```python
from dotenv import load_dotenv
from pathlib import Path

# 指定 .env 文件路径
env_path = Path(".") / ".env.local"
load_dotenv(dotenv_path=env_path)

# 或使用字符串路径
load_dotenv(".env.production")
```

### 获取为字典

```python
from dotenv import dotenv_values

# 直接获取为字典，不污染环境变量
config = dotenv_values(".env")
print(config["DATABASE_URL"])

# 合并多个配置
config = {
    **dotenv_values(".env.shared"),
    **dotenv_values(".env.local"),
}
```

## 高级用法

### 覆盖已有变量

```python
from dotenv import load_dotenv

# 默认不覆盖已存在的环境变量
load_dotenv()

# 强制覆盖
load_dotenv(override=True)
```

### 变量插值

```python
# .env 文件支持变量引用
# BASE_DIR=/app
# LOG_DIR=${BASE_DIR}/logs
# DATA_DIR=${BASE_DIR}/data

from dotenv import load_dotenv
import os

load_dotenv()
print(os.environ.get("LOG_DIR"))  # /app/logs
```

### 流式加载

```python
from dotenv import load_dotenv
from io import StringIO

# 从字符串加载
env_content = """
DATABASE_URL=postgresql://localhost/test
DEBUG=true
"""

load_dotenv(stream=StringIO(env_content))
```

## 多环境配置

### 环境切换

```python
import os
from dotenv import load_dotenv

# 根据 APP_ENV 加载不同配置
env = os.environ.get("APP_ENV", "development")

# 先加载基础配置
load_dotenv(".env")

# 再加载环境特定配置（覆盖）
load_dotenv(f".env.{env}", override=True)
```

### 配置类模式

```python
from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    """应用配置"""
    DATABASE_URL: str = os.environ.get("DATABASE_URL", "sqlite:///app.db")
    SECRET_KEY: str = os.environ.get("SECRET_KEY", "dev-secret")
    DEBUG: bool = os.environ.get("DEBUG", "false").lower() == "true"

    # 类型转换
    PORT: int = int(os.environ.get("PORT", "8000"))
    ALLOWED_HOSTS: list = os.environ.get("ALLOWED_HOSTS", "localhost").split(",")

config = Config()
```

### 配合 Pydantic

```python
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    database_url: str
    secret_key: str = Field(min_length=32)
    debug: bool = False
    port: int = 8000

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

# 自动从 .env 加载并验证类型
settings = Settings()
print(settings.database_url)
```

## 实战示例

### Flask 配置

```python
# config.py
from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY")
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

# app.py
from flask import Flask
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
```

### FastAPI 配置

```python
from fastapi import FastAPI
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "My API"
    debug: bool = False
    database_url: str

    class Config:
        env_file = ".env"

settings = Settings()
app = FastAPI(title=settings.app_name, debug=settings.debug)

@app.get("/info")
def info():
    return {"app": settings.app_name}
```

## 与 Node.js dotenv 对比

```python
# Python
from dotenv import load_dotenv
import os

load_dotenv()
db_url = os.environ.get("DATABASE_URL")
```

```javascript
// Node.js
require('dotenv').config()
const dbUrl = process.env.DATABASE_URL
```

## 小结

**核心函数**:
- `load_dotenv()`: 加载 .env
- `dotenv_values()`: 获取字典
- `os.environ.get()`: 读取变量

**配置选项**:
- `dotenv_path`: 指定文件
- `override`: 覆盖已有
- `stream`: 流式加载

::: tip 最佳实践
- .env 文件不要提交到版本控制
- 提供 .env.example 示例文件
- 生产环境使用真实环境变量
- 配合 pydantic-settings 做类型验证
:::

::: warning 安全提示
- 不要在 .env 中存储高敏感信息
- 生产环境考虑使用 secrets 管理
- 定期轮换密钥和令牌
:::

::: info 相关库
- `pydantic-settings` - 类型安全配置
- `environs` - 环境变量解析
- `dynaconf` - 高级配置管理
:::

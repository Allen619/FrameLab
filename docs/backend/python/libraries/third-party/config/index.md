---
title: 配置管理
description: Python 配置管理与环境变量库
---

# 配置管理

管理应用配置和环境变量的 Python 库。

## 库概览

| 库 | 用途 | 最佳场景 |
|----|------|----------|
| python-dotenv | 加载 .env 文件 | 环境变量管理 |
| pyyaml | YAML 解析 | 配置文件 |
| toml | TOML 解析(3.11+内置) | pyproject.toml |

## 选择建议

- **环境变量**: python-dotenv
- **配置文件**: YAML 或 TOML
- **类型安全**: 配合 pydantic-settings

## 文档

- [python-dotenv](./python-dotenv.md) - 环境变量管理
- [pyyaml](./pyyaml.md) - YAML 解析器
- [toml](./toml.md) - TOML 配置

## 典型用法

```python
# 加载环境配置文件
from dotenv import load_dotenv
import os

load_dotenv()  # 加载 .env

DATABASE_URL = os.environ.get('DATABASE_URL')
DEBUG = os.environ.get('DEBUG', 'false').lower() == 'true'
```

## 配置格式对比

| 格式 | 优点 | 场景 |
|-----|------|------|
| .env | 简单，环境隔离 | 不提交仓库 |
| YAML | 层级清晰，注释方便 | 复杂配置 |
| TOML | 简洁，Python 原生 | 比 YAML 简单 |
| JSON | 通用，工具支持好 | 不支持注释 |

## Node.js 对比

| Python | Node.js | 说明 |
|--------|---------|------|
| python-dotenv | dotenv | 环境变量 |
| pyyaml | js-yaml | YAML |
| tomllib | @iarna/toml | TOML |

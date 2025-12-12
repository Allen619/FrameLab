---
title: 数据库
description: Python 数据库客户端与 ORM 库
---

# 数据库

Python 数据库驱动与 ORM 库。

## 库概览

| 库 | 数据库 | 用途 |
|----|--------|------|
| SQLAlchemy | SQL | ORM 与 Core 两种风格 |
| pymongo | MongoDB | 官方驱动，丰富功能 |
| redis-py | Redis | 官方驱动，缓存/队列 |

## 选择建议

- **关系型数据库**: SQLAlchemy
- **MongoDB**: pymongo / motor(异步)
- **Redis**: redis-py

## 快速选择

| 数据库类型 | 推荐 | 原因 |
|------------|------|------|
| PostgreSQL/MySQL/SQLite | ⭐ SQLAlchemy | 业界标准ORM、功能完整 |
| MongoDB | pymongo | 官方维护、生态成熟 |
| Redis 缓存/队列 | redis-py | 官方维护、支持异步 |

## 文档

- [sqlalchemy](./sqlalchemy.md) - SQL ORM 框架
- [pymongo](./pymongo.md) - MongoDB 客户端
- [redis-py](./redis-py.md) - Redis 客户端

## 快速示例

```python
# SQLAlchemy
from sqlalchemy import create_engine
engine = create_engine("postgresql://user:pass@localhost/db")

# MongoDB
from pymongo import MongoClient
client = MongoClient("mongodb://localhost:27017/")

# Redis
import redis
r = redis.Redis(host='localhost', port=6379)
```

## Node.js 对比

| Python | Node.js | 说明 |
|--------|---------|------|
| SQLAlchemy | Prisma / TypeORM | ORM |
| pymongo | mongodb | MongoDB |
| redis-py | ioredis | Redis |

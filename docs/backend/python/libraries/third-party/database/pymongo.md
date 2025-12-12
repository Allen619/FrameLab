---
title: pymongo - MongoDB 客户端
description: Python PyMongo MongoDB 数据库客户端
---

# pymongo MongoDB 客户端

## 本章目标

- 掌握 PyMongo 基本操作
- 理解 CRUD 与聚合查询
- 学习索引与性能优化
- 对比 Node.js mongodb 驱动

## 对比

| PyMongo | Node.js mongodb | 说明 |
|---------|-----------------|------|
| `MongoClient` | `MongoClient` | 客户端 |
| `find()` | `find()` | 查询 |
| `insert_one()` | `insertOne()` | 插入 |
| `aggregate()` | `aggregate()` | 聚合 |

## 安装

```bash
pip install pymongo

# poetry
poetry add pymongo
```

## 基础用法

### 连接数据库

```python
from pymongo import MongoClient

# 连接本地
client = MongoClient("mongodb://localhost:27017/")

# 连接远程
client = MongoClient("mongodb://user:pass@host:27017/dbname")

# 获取数据库和集合
db = client["mydb"]
collection = db["users"]
```

### CRUD 操作

```python
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["mydb"]
users = db["users"]

# 插入
user = {"name": "Alice", "age": 25, "email": "alice@example.com"}
result = users.insert_one(user)
print(result.inserted_id)

# 批量插入
users_list = [
    {"name": "Bob", "age": 30},
    {"name": "Charlie", "age": 35}
]
result = users.insert_many(users_list)

# 查询
user = users.find_one({"name": "Alice"})
all_users = list(users.find())
adult_users = list(users.find({"age": {"$gte": 18}}))

# 更新
users.update_one(
    {"name": "Alice"},
    {"$set": {"age": 26}}
)

# 删除
users.delete_one({"name": "Alice"})
```

### 查询操作符

```python
from pymongo import MongoClient

db = MongoClient()["mydb"]
users = db["users"]

# 比较操作符
users.find({"age": {"$gt": 25}})      # 大于
users.find({"age": {"$gte": 25}})     # 大于等于
users.find({"age": {"$lt": 30}})      # 小于
users.find({"age": {"$in": [25, 30]}})  # 在列表中

# 逻辑操作符
users.find({"$and": [{"age": {"$gt": 20}}, {"age": {"$lt": 30}}]})
users.find({"$or": [{"name": "Alice"}, {"name": "Bob"}]})

# 正则匹配
users.find({"name": {"$regex": "^A"}})

# 投影（选择字段）
users.find({}, {"name": 1, "email": 1, "_id": 0})

# 排序和分页
users.find().sort("age", -1).skip(10).limit(5)
```

## 聚合管道

```python
from pymongo import MongoClient

db = MongoClient()["mydb"]
orders = db["orders"]

# 聚合查询
pipeline = [
    {"$match": {"status": "completed"}},
    {"$group": {
        "_id": "$user_id",
        "total": {"$sum": "$amount"},
        "count": {"$sum": 1}
    }},
    {"$sort": {"total": -1}},
    {"$limit": 10}
]

results = list(orders.aggregate(pipeline))
```

## 索引

```python
from pymongo import MongoClient, ASCENDING, DESCENDING

db = MongoClient()["mydb"]
users = db["users"]

# 创建索引
users.create_index("email", unique=True)
users.create_index([("name", ASCENDING), ("age", DESCENDING)])

# 查看索引
print(list(users.list_indexes()))

# 删除索引
users.drop_index("email_1")
```

## 异步支持 (Motor)

```python
import motor.motor_asyncio
import asyncio

async def main():
    client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["mydb"]
    users = db["users"]

    # 异步插入
    await users.insert_one({"name": "Alice", "age": 25})

    # 异步查询
    async for user in users.find({"age": {"$gt": 20}}):
        print(user)

asyncio.run(main())
```

## 小结

**核心操作**:
- `insert_one/many()`: 插入
- `find/find_one()`: 查询
- `update_one/many()`: 更新
- `delete_one/many()`: 删除

**高级功能**:
- 聚合管道
- 索引优化
- Motor 异步

::: tip 最佳实践
- 合理创建索引
- 使用投影减少数据传输
- 批量操作提高性能
:::

::: info 相关库
- `motor` - 异步 MongoDB
- `mongoengine` - ODM
- `beanie` - 异步 ODM
:::

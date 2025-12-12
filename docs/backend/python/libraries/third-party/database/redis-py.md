---
title: redis-py - Redis 客户端
description: Python redis-py Redis 数据库客户端
---

# redis-py Redis 客户端

## 本章目标

- 掌握 Redis 基本操作
- 理解各种数据类型
- 学习发布订阅与管道
- 对比 Node.js ioredis

## 对比

| redis-py | Node.js ioredis | 说明 |
|----------|-----------------|------|
| `Redis()` | `new Redis()` | 客户端 |
| `r.set()` | `redis.set()` | 设置值 |
| `r.get()` | `redis.get()` | 获取值 |
| `r.pipeline()` | `pipeline()` | 管道 |

## 安装

```bash
pip install redis

# poetry
poetry add redis
```

## 基础用法

### 连接 Redis

```python
import redis

# 简单连接
r = redis.Redis(host='localhost', port=6379, db=0)

# 使用 URL
r = redis.from_url("redis://localhost:6379/0")

# 带密码
r = redis.Redis(host='localhost', port=6379, password='secret')

# 测试连接
print(r.ping())  # True
```

### 字符串操作

```python
import redis

r = redis.Redis()

# 设置和获取
r.set("name", "Alice")
name = r.get("name")  # b'Alice'
name = r.get("name").decode()  # 'Alice'

# 设置过期时间
r.setex("token", 3600, "abc123")  # 1小时后过期
r.set("key", "value", ex=60)  # 60秒过期

# 自增
r.set("counter", 0)
r.incr("counter")  # 1
r.incrby("counter", 5)  # 6
```

### 哈希操作

```python
import redis

r = redis.Redis()

# 设置哈希字段
r.hset("user:1", "name", "Alice")
r.hset("user:1", mapping={"age": 25, "email": "alice@example.com"})

# 获取
name = r.hget("user:1", "name")
user = r.hgetall("user:1")  # 所有字段

# 检查和删除
r.hexists("user:1", "name")  # True
r.hdel("user:1", "email")
```

### 列表操作

```python
import redis

r = redis.Redis()

# 添加元素
r.lpush("queue", "task1", "task2")  # 左边添加
r.rpush("queue", "task3")  # 右边添加

# 获取
r.lrange("queue", 0, -1)  # 所有元素
r.lindex("queue", 0)  # 第一个

# 弹出
task = r.lpop("queue")  # 左边弹出
task = r.rpop("queue")  # 右边弹出
task = r.blpop("queue", timeout=5)  # 阻塞弹出
```

### 集合操作

```python
import redis

r = redis.Redis()

# 添加
r.sadd("tags", "python", "redis", "database")

# 查询
r.smembers("tags")  # 所有成员
r.sismember("tags", "python")  # 是否存在

# 集合运算
r.sadd("tags2", "python", "golang")
r.sinter("tags", "tags2")  # 交集
r.sunion("tags", "tags2")  # 并集
```

### 有序集合

```python
import redis

r = redis.Redis()

# 添加带分数的成员
r.zadd("leaderboard", {"alice": 100, "bob": 85, "charlie": 92})

# 查询
r.zrange("leaderboard", 0, -1, withscores=True)  # 升序
r.zrevrange("leaderboard", 0, 2, withscores=True)  # 降序前3

# 排名
r.zrank("leaderboard", "alice")  # 排名（从0开始）
r.zscore("leaderboard", "alice")  # 分数
```

## 高级功能

### 管道

```python
import redis

r = redis.Redis()

# 使用管道批量执行
pipe = r.pipeline()
pipe.set("key1", "value1")
pipe.set("key2", "value2")
pipe.get("key1")
pipe.get("key2")
results = pipe.execute()
```

### 发布订阅

```python
import redis

r = redis.Redis()

# 发布
r.publish("channel", "Hello!")

# 订阅
pubsub = r.pubsub()
pubsub.subscribe("channel")

for message in pubsub.listen():
    if message["type"] == "message":
        print(message["data"])
```

### 分布式锁

```python
import redis
import time

r = redis.Redis()

def acquire_lock(name, timeout=10):
    """获取分布式锁"""
    return r.set(f"lock:{name}", "1", nx=True, ex=timeout)

def release_lock(name):
    """释放锁"""
    r.delete(f"lock:{name}")

# 使用
if acquire_lock("my_task"):
    try:
        # 执行任务
        pass
    finally:
        release_lock("my_task")
```

## 异步支持

```python
import redis.asyncio as redis
import asyncio

async def main():
    r = redis.Redis()

    await r.set("key", "value")
    value = await r.get("key")
    print(value)

    await r.close()

asyncio.run(main())
```

## 小结

**数据类型**:
- 字符串: `set/get`
- 哈希: `hset/hget`
- 列表: `lpush/rpop`
- 集合: `sadd/smembers`
- 有序集合: `zadd/zrange`

**高级功能**:
- 管道批量操作
- 发布订阅
- 分布式锁

::: tip 最佳实践
- 使用管道减少网络往返
- 合理设置过期时间
- 使用连接池
:::

::: info 相关库
- `aioredis` - 异步 Redis
- `redis-om` - 对象映射
- `celery` - 任务队列
:::

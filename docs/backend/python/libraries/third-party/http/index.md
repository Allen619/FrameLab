---
title: HTTP 客户端
description: Python HTTP 请求库
---

# HTTP 客户端

发送 HTTP 请求的 Python 库。

## 库概览

| 库 | 类型 | 最佳场景 |
|----|------|----------|
| requests | 同步请求 | 简单场景 |
| httpx | 同步/异步 | 现代项目 |
| aiohttp | 纯异步 | 高并发场景 |

## 选择建议

- **简单场景**: requests（最简单）
- **现代项目**: httpx（同步异步兼容）
- **高并发**: aiohttp（纯异步）

## 快速选择

| 你的需求 | 推荐 | 原因 |
|----------|------|------|
| 新项目/通用场景 | ⭐ httpx | 同步异步兼容、API类似requests |
| 只需同步、最简单 | requests | 社区最广、文档最多 |
| 纯异步/WebSocket | aiohttp | 性能最优、功能完整 |

## 文档

- [requests](./requests.md) - 同步 HTTP 客户端
- [httpx](./httpx.md) - 现代 HTTP 客户端
- [aiohttp](./aiohttp.md) - 异步 HTTP 客户端

## 快速示例

```python
# requests (同步)
import requests
resp = requests.get("https://api.example.com/data")
data = resp.json()

# httpx (同步/异步)
import httpx
resp = httpx.get("https://api.example.com/data")

async with httpx.AsyncClient() as client:
    resp = await client.get("https://api.example.com/data")

# aiohttp (异步)
import aiohttp
async with aiohttp.ClientSession() as session:
    async with session.get("https://api.example.com/data") as resp:
        data = await resp.json()
```

## Node.js 对比

| Python | Node.js | 说明 |
|--------|---------|------|
| requests | axios (同步风格) | 简单场景 |
| httpx | fetch / axios | 现代 HTTP |
| aiohttp | node-fetch | 异步 HTTP |

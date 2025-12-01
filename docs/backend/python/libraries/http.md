---
title: HTTP 请求库
description: Python 中的 HTTP 请求库 - requests 和 httpx
---

# HTTP 请求库

## 概述

| Python     | JavaScript | 说明             |
| ---------- | ---------- | ---------------- |
| `requests` | `axios`    | 同步 HTTP 客户端 |
| `httpx`    | `fetch`    | 支持 async/await |

## requests - 最流行的 HTTP 库

### 安装

```bash
pip install requests
# 或使用 Poetry
poetry add requests
```

### 基础用法

```python
import requests

# GET 请求
response = requests.get('https://api.example.com/users')
data = response.json()

# POST 请求
response = requests.post('https://api.example.com/users', json={
    'name': 'Alice',
    'email': 'alice@example.com'
})
```

### 对比 JavaScript (axios)

```javascript
// JavaScript (axios)
const response = await axios.get('https://api.example.com/users')
const data = response.data

const response = await axios.post('https://api.example.com/users', {
  name: 'Alice',
  email: 'alice@example.com',
})
```

## httpx - 现代异步 HTTP 库

### 安装

```bash
pip install httpx
poetry add httpx
```

### 异步用法

```python
import httpx

async def fetch_users():
    async with httpx.AsyncClient() as client:
        response = await client.get('https://api.example.com/users')
        return response.json()
```

### 对比 JavaScript (fetch)

```javascript
// JavaScript (fetch)
async function fetchUsers() {
  const response = await fetch('https://api.example.com/users')
  return await response.json()
}
```

## 常用功能对比

| 功能       | requests/httpx                | fetch/axios                  |
| ---------- | ----------------------------- | ---------------------------- |
| 设置请求头 | `headers={'Auth': 'token'}`   | `headers: {'Auth': 'token'}` |
| 查询参数   | `params={'page': 1}`          | `params: {page: 1}`          |
| 超时设置   | `timeout=10`                  | `timeout: 10000`             |
| 错误处理   | `response.raise_for_status()` | `if (!response.ok)`          |

## 选择建议

- **requests**: 简单脚本、同步场景
- **httpx**: 需要异步、与 FastAPI 配合使用

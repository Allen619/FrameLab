---
title: aiohttp - 异步 HTTP
description: Python aiohttp 异步 HTTP 客户端与服务端
---

# aiohttp 异步 HTTP

## 本章目标

- 掌握异步 HTTP 客户端
- 理解 ClientSession 用法
- 学习 Web 服务端开发
- 对比 httpx 和 requests

## 对比

| aiohttp | httpx | 说明 |
|---------|-------|------|
| 纯异步 | 同步/异步 | 执行模式 |
| `ClientSession` | `AsyncClient` | 会话管理 |
| 内置 WebSocket | 需扩展 | WebSocket |
| 内置服务端 | 无 | Web 服务 |

## 安装

```bash
pip install aiohttp

# poetry
poetry add aiohttp
```

## 客户端用法

### 基本请求

```python
import aiohttp
import asyncio

async def main():
    async with aiohttp.ClientSession() as session:
        # GET 请求
        async with session.get("https://api.example.com/data") as resp:
            print(resp.status)
            data = await resp.json()
            print(data)

        # POST 请求
        async with session.post(
            "https://api.example.com/users",
            json={"name": "Alice", "email": "alice@example.com"}
        ) as resp:
            result = await resp.json()

asyncio.run(main())
```

### 请求配置

```python
import aiohttp
import asyncio

async def main():
    # 超时配置
    timeout = aiohttp.ClientTimeout(total=30)

    async with aiohttp.ClientSession(timeout=timeout) as session:
        # 带请求头
        headers = {"Authorization": "Bearer token123"}
        async with session.get(
            "https://api.example.com/data",
            headers=headers
        ) as resp:
            data = await resp.json()

        # 带查询参数
        params = {"page": 1, "limit": 10}
        async with session.get(
            "https://api.example.com/items",
            params=params
        ) as resp:
            data = await resp.json()

asyncio.run(main())
```

### 并发请求

```python
import aiohttp
import asyncio

async def fetch(session, url):
    async with session.get(url) as resp:
        return await resp.json()

async def main():
    urls = [
        "https://api.example.com/users/1",
        "https://api.example.com/users/2",
        "https://api.example.com/users/3",
    ]

    async with aiohttp.ClientSession() as session:
        # 并发执行
        tasks = [fetch(session, url) for url in urls]
        results = await asyncio.gather(*tasks)
        print(results)

asyncio.run(main())
```

### 文件上传

```python
import aiohttp
import asyncio

async def upload_file():
    async with aiohttp.ClientSession() as session:
        data = aiohttp.FormData()
        data.add_field("file",
                       open("document.pdf", "rb"),
                       filename="document.pdf",
                       content_type="application/pdf")

        async with session.post(
            "https://api.example.com/upload",
            data=data
        ) as resp:
            return await resp.json()

asyncio.run(upload_file())
```

## Web 服务端

### 基本服务器

```python
from aiohttp import web

async def hello(request):
    return web.Response(text="Hello, World!")

async def get_user(request):
    user_id = request.match_info["id"]
    return web.json_response({"id": user_id, "name": "Alice"})

async def create_user(request):
    data = await request.json()
    return web.json_response({"status": "created", "data": data})

app = web.Application()
app.router.add_get("/", hello)
app.router.add_get("/users/{id}", get_user)
app.router.add_post("/users", create_user)

if __name__ == "__main__":
    web.run_app(app, port=8080)
```

### 中间件

```python
from aiohttp import web

@web.middleware
async def logging_middleware(request, handler):
    print(f"Request: {request.method} {request.path}")
    response = await handler(request)
    print(f"Response: {response.status}")
    return response

app = web.Application(middlewares=[logging_middleware])
```

## WebSocket

### 客户端

```python
import aiohttp
import asyncio

async def websocket_client():
    async with aiohttp.ClientSession() as session:
        async with session.ws_connect("ws://localhost:8080/ws") as ws:
            await ws.send_str("Hello!")

            async for msg in ws:
                if msg.type == aiohttp.WSMsgType.TEXT:
                    print(f"Received: {msg.data}")
                elif msg.type == aiohttp.WSMsgType.ERROR:
                    break

asyncio.run(websocket_client())
```

### 服务端

```python
from aiohttp import web

async def websocket_handler(request):
    ws = web.WebSocketResponse()
    await ws.prepare(request)

    async for msg in ws:
        if msg.type == web.WSMsgType.TEXT:
            await ws.send_str(f"Echo: {msg.data}")
        elif msg.type == web.WSMsgType.ERROR:
            print(f"Error: {ws.exception()}")

    return ws

app = web.Application()
app.router.add_get("/ws", websocket_handler)
```

## 与其他库对比

```python
# aiohttp
async with aiohttp.ClientSession() as session:
    async with session.get(url) as resp:
        data = await resp.json()

# httpx
async with httpx.AsyncClient() as client:
    resp = await client.get(url)
    data = resp.json()

# requests (同步)
resp = requests.get(url)
data = resp.json()
```

## 小结

**客户端**:
- `ClientSession`: 连接复用
- `session.get/post()`: HTTP 方法
- `asyncio.gather()`: 并发请求

**服务端**:
- `web.Application`: 应用
- `web.Response`: 响应
- WebSocket 支持

::: tip 最佳实践
- 复用 ClientSession
- 设置合理超时
- 使用 gather 并发
:::

::: info 相关库
- `httpx` - 更现代的异步 HTTP
- `fastapi` - 异步 Web 框架
- `websockets` - WebSocket 库
:::

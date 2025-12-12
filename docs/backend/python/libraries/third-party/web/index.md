---
title: Web 框架
description: Python Web 开发框架与数据验证库
---

# Web 框架

Python Web 开发相关的框架和工具库。

## 库概览

| 库 | 类型 | 最佳场景 |
|----|------|----------|
| FastAPI | 异步 API 框架 | 现代 REST API |
| Flask | 轻量 Web 框架 | 小型应用/原型 |
| Django | 全栈框架 | 大型 Web 应用 |
| Pydantic | 数据验证 | 配合 FastAPI |

## 选择建议

- **REST API**: FastAPI（性能好，类型安全）
- **快速原型**: Flask（简单灵活）
- **全栈应用**: Django（内置功能丰富）
- **数据验证**: Pydantic（类型推断）

## 快速选择

| 你的需求 | 推荐 | 原因 |
|----------|------|------|
| 新项目 REST API | ⭐ FastAPI | 类型安全、自动文档、高性能 |
| 简单原型/小应用 | Flask | 轻量、灵活、学习曲线低 |
| 全栈+后台管理 | Django | 内置Admin、ORM、认证 |
| 数据验证 | ⭐ Pydantic | 与 FastAPI 完美配合 |

## 文档

- [fastapi](./fastapi.md) - 现代异步 API 框架
- [flask](./flask.md) - 轻量级 Web 框架
- [django-overview](./django-overview.md) - Django 全栈框架
- [pydantic](./pydantic.md) - 数据验证库

## 快速示例

```python
# FastAPI
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float

@app.post("/items")
async def create_item(item: Item):
    return item

# Flask
from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/items", methods=["POST"])
def create_item():
    return jsonify({"status": "ok"})
```

## Node.js 对比

| Python | Node.js | 说明 |
|--------|---------|------|
| FastAPI | Fastify / NestJS | 现代 API |
| Flask | Express | 轻量框架 |
| Django | Next.js (全栈) | 全栈方案 |
| Pydantic | Zod | 数据验证 |

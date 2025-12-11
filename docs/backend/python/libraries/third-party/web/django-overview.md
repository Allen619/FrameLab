---
title: Web 框架
description: Python Web 框架 - FastAPI 和 Flask
---

# Web 框架

## 概述

| Python  | JavaScript           | 特点                 |
| ------- | -------------------- | -------------------- |
| FastAPI | Express + TypeScript | 现代、异步、类型安全 |
| Flask   | Express              | 轻量、灵活           |
| Django  | Nest.js              | 全功能框架           |

## FastAPI - 推荐首选

### 安装

```bash
pip install fastapi uvicorn
poetry add fastapi uvicorn
```

### 基础示例

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/users/{user_id}")
async def get_user(user_id: int):
    return {"user_id": user_id}

@app.post("/users")
async def create_user(name: str, email: str):
    return {"name": name, "email": email}
```

### 运行

```bash
uvicorn main:app --reload
```

### 对比 Express

```javascript
// Express.js
const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' })
})

app.get('/users/:userId', (req, res) => {
  res.json({ user_id: req.params.userId })
})

app.listen(3000)
```

## Flask - 轻量级选择

### 安装

```bash
pip install flask
poetry add flask
```

### 基础示例

```python
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def hello():
    return jsonify(message='Hello World')

@app.route('/users/<int:user_id>')
def get_user(user_id):
    return jsonify(user_id=user_id)

if __name__ == '__main__':
    app.run(debug=True)
```

## 路由对比

| 功能     | FastAPI  | Flask   | Express |
| -------- | -------- | ------- | ------- |
| 路由参数 | `/{id}`  | `/<id>` | `/:id`  |
| 类型校验 | 自动     | 手动    | 手动    |
| 异步支持 | 原生     | 需扩展  | 原生    |
| API 文档 | 自动生成 | 需插件  | 需插件  |

## FastAPI 优势

1. **自动 API 文档** - 访问 `/docs` 获得 Swagger UI
2. **类型校验** - 基于 Python 类型提示自动校验
3. **异步原生** - async/await 支持
4. **性能优秀** - 基于 Starlette 和 Pydantic

## 选择建议

| 场景            | 推荐    |
| --------------- | ------- |
| 新项目/API 服务 | FastAPI |
| 简单原型        | Flask   |
| 全栈应用        | Django  |

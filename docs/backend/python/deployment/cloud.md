---
title: 云平台部署
description: 部署到 Railway、Fly.io、Render 等平台
---

# 云平台部署

云平台提供最简单的部署方式，类似前端的 Vercel/Netlify。

## 平台对比

| 平台    | 免费额度   | 特点         | 对标       |
| ------- | ---------- | ------------ | ---------- |
| Railway | 500小时/月 | 简单、快速   | Vercel     |
| Fly.io  | 3个应用    | 全球边缘部署 | Cloudflare |
| Render  | 750小时/月 | 功能全面     | Heroku     |

## Railway 部署

### 1. 准备文件

项目根目录需要：

```text
my-api/
├── main.py
├── requirements.txt    # 或 pyproject.toml
└── Procfile           # 可选
```

**requirements.txt**:

```text
fastapi
uvicorn
```

**Procfile**（可选）:

```text
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### 2. 部署步骤

```bash
# 安装 Railway CLI
npm install -g @railway/cli

# 登录
railway login

# 初始化项目
railway init

# 部署
railway up

# 生成域名
railway domain
```

### 3. 环境变量

```bash
railway variables set DATABASE_URL=xxx
railway variables set SECRET_KEY=xxx
```

## Fly.io 部署

### 1. 安装 CLI

```bash
# macOS
brew install flyctl

# Windows
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

### 2. 部署

```bash
# 登录
fly auth login

# 初始化（会生成 fly.toml）
fly launch

# 部署
fly deploy

# 查看日志
fly logs
```

### 3. fly.toml 配置

```toml
app = "my-python-api"
primary_region = "nrt"  # 东京

[build]
  builder = "paketobuildpacks/builder:base"

[env]
  PORT = "8080"

[http_service]
  internal_port = 8080
  force_https = true

[[services]]
  internal_port = 8080
  protocol = "tcp"

  [[services.ports]]
    port = 80
    handlers = ["http"]

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]
```

## Render 部署

### 1. 连接 GitHub

1. 访问 [render.com](https://render.com)
2. 连接 GitHub 仓库
3. 选择 "Web Service"

### 2. 配置

- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### 3. render.yaml（可选）

```yaml
services:
  - type: web
    name: my-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
```

## 对比 Vercel 部署

| 步骤       | Vercel (前端)     | Railway (Python)        |
| ---------- | ----------------- | ----------------------- |
| 安装 CLI   | `npm i -g vercel` | `npm i -g @railway/cli` |
| 部署       | `vercel`          | `railway up`            |
| 环境变量   | Vercel 面板       | `railway variables set` |
| 自定义域名 | 支持              | 支持                    |

## 选择建议

- **Railway**: 最简单，适合快速上手
- **Fly.io**: 需要全球部署、边缘计算
- **Render**: 需要更多功能（如定时任务）

## 常见问题

### 端口配置

云平台通常通过 `$PORT` 环境变量指定端口：

```python
import os
port = int(os.getenv("PORT", 8000))
```

### 静态文件

如需提供静态文件，使用 FastAPI 的 StaticFiles：

```python
from fastapi.staticfiles import StaticFiles
app.mount("/static", StaticFiles(directory="static"), name="static")
```

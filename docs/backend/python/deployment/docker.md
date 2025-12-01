---
title: Docker 部署
description: 使用 Docker 部署 Python 应用
---

# Docker 部署

Docker 是最通用的部署方式，与前端项目的 Docker 部署流程类似。

## Dockerfile 示例

### FastAPI 应用

```dockerfile
# 使用官方 Python 镜像
FROM python:3.11-slim

# 设置工作目录
WORKDIR /app

# 安装依赖
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制源码
COPY . .

# 暴露端口
EXPOSE 8000

# 启动命令
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 使用 Poetry

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# 安装 Poetry
RUN pip install poetry

# 复制依赖文件
COPY pyproject.toml poetry.lock ./

# 安装依赖（不创建虚拟环境）
RUN poetry config virtualenvs.create false \
    && poetry install --no-dev --no-interaction

COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 对比 Node.js Dockerfile

```dockerfile
# Node.js
FROM node:18-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

```dockerfile
# Python
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## docker-compose.yml

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - '8000:8000'
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/app
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=app
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 常用命令

```bash
# 构建镜像
docker build -t my-python-app .

# 运行容器
docker run -p 8000:8000 my-python-app

# 使用 docker-compose
docker-compose up -d

# 查看日志
docker-compose logs -f api

# 停止服务
docker-compose down
```

## .dockerignore

```text
__pycache__
*.pyc
.venv
venv
.git
.gitignore
.env
*.md
tests/
.pytest_cache
.mypy_cache
```

## 多阶段构建（优化镜像大小）

```dockerfile
# 构建阶段
FROM python:3.11-slim as builder

WORKDIR /app
RUN pip install poetry

COPY pyproject.toml poetry.lock ./
RUN poetry export -f requirements.txt -o requirements.txt

# 运行阶段
FROM python:3.11-slim

WORKDIR /app
COPY --from=builder /app/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 最佳实践

1. **使用 slim 镜像** - `python:3.11-slim` 而非 `python:3.11`
2. **分层缓存** - 先复制依赖文件，再复制源码
3. **不安装开发依赖** - `poetry install --no-dev`
4. **非 root 用户运行**（生产环境）
5. **健康检查** - 添加 HEALTHCHECK 指令

---
title: 生产部署
description: 学习如何将 LangChain 应用部署到生产环境
---

# 生产部署

## 概述

将 LangChain 应用从开发环境部署到生产环境，需要考虑性能、安全性、可扩展性等多个方面。LangServe 是 LangChain 官方推荐的部署方案，它基于 FastAPI 构建，提供了开箱即用的 REST API 部署能力。

### LangServe 是什么？

LangServe 帮助开发者将 LangChain 的 Runnable 和 Chain 部署为 REST API：

- **自动 API 生成**: 基于 FastAPI，自动生成 OpenAPI 文档
- **多端点支持**: 同时提供 invoke、stream、batch 等端点
- **Playground**: 内置可视化测试界面
- **流式支持**: 原生支持 Server-Sent Events (SSE)

### 部署架构

```mermaid
graph TB
    subgraph "客户端"
        A[Web 应用] --> B[LangServe Client]
        C[移动应用] --> B
    end

    subgraph "服务端"
        B --> D[FastAPI + LangServe]
        D --> E[LangChain Agent/Chain]
        E --> F[LLM API]
        E --> G[工具/数据库]
    end

    subgraph "基础设施"
        D --> H[Docker Container]
        H --> I[云服务]
    end

    style D fill:#e1f5ff
    style H fill:#c8e6c9
```

## 核心概念

### add_routes 函数

`add_routes` 是 LangServe 的核心函数，用于将 LangChain Runnable 注册为 API 端点：

```python
from langserve import add_routes

add_routes(
    app,           # FastAPI 应用实例
    runnable,      # LangChain Runnable（Chain、Agent 等）
    path="/api",   # API 路径前缀
)
```

注册后，LangServe 会自动创建以下端点：

| 端点                 | 方法 | 描述            |
| -------------------- | ---- | --------------- |
| `/api/invoke`        | POST | 同步调用        |
| `/api/stream`        | POST | 流式调用（SSE） |
| `/api/batch`         | POST | 批量调用        |
| `/api/input_schema`  | GET  | 输入 Schema     |
| `/api/output_schema` | GET  | 输出 Schema     |
| `/api/playground`    | GET  | 可视化测试界面  |

### RemoteRunnable 客户端

LangServe 提供 Python 客户端，可以像调用本地 Runnable 一样调用远程 API：

```python
from langserve import RemoteRunnable

# 连接远程服务
remote = RemoteRunnable("http://localhost:8000/api")

# 同步调用
result = remote.invoke({"input": "hello"})

# 流式调用
for chunk in remote.stream({"input": "hello"}):
    print(chunk)
```

## 代码示例 1: 基础 LangServe 部署

最简单的 LangServe 部署示例：

```python
#!/usr/bin/env python
from fastapi import FastAPI
from langchain.chat_models import init_chat_model
from langchain.prompts import ChatPromptTemplate
from langserve import add_routes

# 创建 FastAPI 应用
app = FastAPI(
    title="LangChain API Server",
    version="1.0",
    description="基于 LangServe 的 LangChain API 服务",
)

# 初始化模型
llm = init_chat_model("claude-sonnet-4-5-20250929")

# 创建简单的 Chain
prompt = ChatPromptTemplate.from_template("请用中文回答: {question}")
chain = prompt | llm

# 注册路由
add_routes(app, chain, path="/chat")

# 启动服务
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

**运行方式**:

```bash
# 安装依赖
pip install langserve fastapi uvicorn

# 启动服务
python server.py

# 访问 API 文档
# http://localhost:8000/docs

# 访问 Playground
# http://localhost:8000/chat/playground
```

## 代码示例 2: 部署 Agent

将完整的 Agent 部署为 API：

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langchain.agents import create_agent
from langchain.tools import tool
from langserve import add_routes

app = FastAPI(title="Agent API Server")

# 配置 CORS（允许浏览器访问）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 定义工具
@tool
def get_weather(city: str) -> str:
    """获取城市天气信息"""
    # 实际应用中调用天气 API
    return f"{city}今天晴天，气温 25°C"

@tool
def search_database(query: str) -> str:
    """搜索数据库"""
    # 实际应用中查询数据库
    return f"找到关于 '{query}' 的 5 条记录"

# 创建 Agent
agent = create_agent(
    model="claude-sonnet-4-5-20250929",
    tools=[get_weather, search_database],
    system_prompt="你是一个智能助手，可以查询天气和搜索数据库。",
)

# 注册 Agent 路由
add_routes(app, agent, path="/agent")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

**调用示例**:

```python
from langserve import RemoteRunnable

agent = RemoteRunnable("http://localhost:8000/agent")

# 调用 Agent
result = agent.invoke({
    "messages": [{"role": "user", "content": "北京天气怎么样？"}]
})
print(result)

# 流式调用
for chunk in agent.stream({
    "messages": [{"role": "user", "content": "搜索用户信息"}]
}):
    print(chunk)
```

## 代码示例 3: Docker 容器化

### 项目结构

```
my-langchain-app/
├── app/
│   ├── __init__.py
│   └── server.py
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── .env.example
```

### Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# 安装依赖
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY app/ ./app/

# 暴露端口
EXPOSE 8000

# 启动命令
CMD ["uvicorn", "app.server:app", "--host", "0.0.0.0", "--port", "8000"]
```

### requirements.txt

```text
langchain>=0.3.0
langchain-anthropic>=0.2.0
langserve>=0.3.0
fastapi>=0.100.0
uvicorn>=0.23.0
python-dotenv>=1.0.0
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  langchain-api:
    build: .
    ports:
      - '8000:8000'
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    env_file:
      - .env
    restart: unless-stopped
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:8000/docs']
      interval: 30s
      timeout: 10s
      retries: 3
```

### 构建和运行

```bash
# 构建镜像
docker build -t langchain-api .

# 运行容器
docker run -p 8000:8000 --env-file .env langchain-api

# 或使用 docker-compose
docker-compose up -d
```

## 代码示例 4: 环境变量和 API Key 管理

### 安全的配置管理

```python
import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# 加载环境变量
load_dotenv()

app = FastAPI()
security = HTTPBearer()

# 验证 API Key
def verify_api_key(credentials: HTTPAuthorizationCredentials = Depends(security)):
    expected_key = os.getenv("API_KEY")
    if credentials.credentials != expected_key:
        raise HTTPException(status_code=401, detail="Invalid API Key")
    return credentials.credentials

# 受保护的端点
@app.get("/protected")
def protected_endpoint(api_key: str = Depends(verify_api_key)):
    return {"message": "访问成功"}
```

### .env 文件示例

```bash
# LLM API Keys
ANTHROPIC_API_KEY=sk-ant-xxx
OPENAI_API_KEY=sk-xxx

# 应用配置
API_KEY=your-api-key-for-clients
LOG_LEVEL=INFO
MAX_TOKENS=4096

# 数据库（如需要）
DATABASE_URL=postgresql://user:pass@localhost:5432/db
```

### 环境变量最佳实践

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """应用配置"""
    anthropic_api_key: str
    openai_api_key: str | None = None
    api_key: str
    log_level: str = "INFO"
    max_tokens: int = 4096

    class Config:
        env_file = ".env"

# 使用配置
settings = Settings()

# 在应用中使用
llm = init_chat_model(
    "claude-sonnet-4-5-20250929",
    api_key=settings.anthropic_api_key,
    max_tokens=settings.max_tokens,
)
```

## 云平台部署

### AWS 部署 (Copilot CLI)

```bash
# 初始化并部署
copilot init \
    --app langchain-app \
    --name api-service \
    --type 'Load Balanced Web Service' \
    --dockerfile './Dockerfile' \
    --deploy
```

### GCP Cloud Run 部署

```bash
# 部署到 Cloud Run
gcloud run deploy langchain-api \
    --source . \
    --port 8001 \
    --allow-unauthenticated \
    --region us-central1 \
    --set-env-vars=ANTHROPIC_API_KEY=your_key
```

### Azure Container Apps 部署

```bash
# 部署到 Azure
az containerapp up \
    --name langchain-api \
    --source . \
    --resource-group my-rg \
    --environment my-env \
    --ingress external \
    --target-port 8001 \
    --env-vars ANTHROPIC_API_KEY=your_key
```

## 生产环境清单

### 安全性

- [ ] 使用 HTTPS（配置 SSL 证书）
- [ ] 实现 API Key 认证
- [ ] 配置 CORS 白名单（不要在生产环境使用 `*`）
- [ ] 敏感信息使用环境变量，不要硬编码
- [ ] 定期轮换 API Key

### 性能

- [ ] 配置适当的超时时间
- [ ] 实现请求速率限制
- [ ] 使用连接池（数据库、HTTP 客户端）
- [ ] 考虑缓存策略

### 可观测性

- [ ] 配置日志收集（结构化日志）
- [ ] 集成 LangSmith 进行追踪
- [ ] 设置健康检查端点
- [ ] 配置告警和监控

### 可靠性

- [ ] 配置自动重启
- [ ] 实现优雅关闭
- [ ] 设置资源限制（CPU、内存）
- [ ] 配置水平扩展策略

## 最佳实践

### 1. 结构化日志

```python
import logging
import json

class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_data = {
            "timestamp": self.formatTime(record),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
        }
        return json.dumps(log_data)

# 配置日志
handler = logging.StreamHandler()
handler.setFormatter(JSONFormatter())
logging.getLogger().addHandler(handler)
```

### 2. 健康检查端点

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/ready")
def readiness_check():
    # 检查依赖服务
    try:
        # 检查 LLM API 连接
        # 检查数据库连接
        return {"status": "ready"}
    except Exception as e:
        return {"status": "not ready", "error": str(e)}
```

### 3. 优雅关闭

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 启动时执行
    print("应用启动，初始化资源...")
    yield
    # 关闭时执行
    print("应用关闭，清理资源...")

app = FastAPI(lifespan=lifespan)
```

## 常见问题

**Q: LangServe 和直接使用 FastAPI 有什么区别？**

A: LangServe 在 FastAPI 基础上提供了：

- 自动为 LangChain Runnable 生成 REST API
- 内置 Playground 测试界面
- 自动处理流式响应
- 客户端 SDK 支持

如果你只是部署简单的 API，直接用 FastAPI 即可。如果要部署完整的 LangChain 应用，LangServe 更方便。

**Q: 如何处理长时间运行的请求？**

A: 建议：

1. 使用流式响应（stream）而非同步调用
2. 配置适当的超时时间
3. 对于非常长的任务，考虑异步处理 + 回调

**Q: 如何扩展服务处理更多请求？**

A:

1. 水平扩展：部署多个实例，使用负载均衡
2. 使用 Gunicorn + Uvicorn workers
3. 配置云服务的自动扩展策略

```bash
# 多 worker 启动
gunicorn app.server:app -w 4 -k uvicorn.workers.UvicornWorker
```

**Q: 如何保护 API 端点？**

A: 推荐的认证方式：

1. API Key 认证（简单场景）
2. JWT Token（用户认证）
3. OAuth 2.0（企业集成）

## 下一步

恭喜你完成了 LangChain 1.0 教程的学习！接下来可以：

- 回顾 [Streaming 流式响应](/ai/langchain/guide/streaming) - 优化用户体验
- 回顾 [LangGraph 工作流](/ai/langchain/guide/langgraph-intro) - 构建复杂应用
- 查看 [Legacy 迁移指南](/ai/langchain/guide/legacy-migration) - 从旧版本迁移

## 参考资源

- [LangServe 官方文档](https://github.com/langchain-ai/langserve)
- [FastAPI 官方文档](https://fastapi.tiangolo.com/)
- [Docker 官方文档](https://docs.docker.com/)
- [LangSmith 追踪平台](https://smith.langchain.com/)

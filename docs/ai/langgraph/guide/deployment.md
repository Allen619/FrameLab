---
title: 部署
description: 将 LangGraph Agent 从本地开发推向生产：LangSmith Agent Server、自托管与扩展策略
---

# 部署

## 部署概述

LangGraph Agent 不是普通的 REST API。它是有状态的、长运行的、可中断的执行流程。这意味着你不能简单地把它当成一个 Flask/FastAPI 应用部署——你需要考虑：

- **状态持久化**：每个会话的 checkpoint 存在哪里？
- **长连接支持**：流式输出需要 SSE 或 WebSocket
- **执行恢复**：服务重启后，中断的流程怎么继续？
- **水平扩展**：多实例如何共享 checkpoint 存储？

**前端类比**：把 LangGraph Agent 的部署想象成部署一个**有状态的 Next.js 应用**。普通的 Next.js 页面是无状态的（Vercel 可以随意扩缩），但如果你的 Next.js 应用依赖了 WebSocket 长连接和服务端 session，部署就复杂多了。LangGraph Agent 更接近后者。

**LangGraph 原生语义**：LangGraph 的部署架构围绕两个核心组件设计——**API Server**（接收请求、管理会话）和 **Checkpointer**（持久化状态）。理解了这两点，就理解了所有部署选项的差异。

## LangSmith Agent Server（托管方案）

### 什么是 Agent Server

LangSmith Agent Server 是 LangChain 官方提供的**托管部署平台**，专为 LangGraph Agent 设计。它解决了上述所有部署难题：

- 内置 checkpoint 存储
- 内置流式输出支持
- 内置执行恢复机制
- 自动扩缩容
- 与 LangSmith 可观测性无缝集成

**前端类比**：LangSmith Agent Server 之于 LangGraph，就像 Vercel 之于 Next.js。它是"最佳实践"的托管方案——零运维负担，直接推代码就能上线。

| Vercel for Next.js         | Agent Server for LangGraph   |
| -------------------------- | ---------------------------- |
| `vercel deploy`            | `langgraph deploy`           |
| 自动 CDN / Edge 分发       | 自动 checkpoint 存储管理     |
| Preview Deployments        | 多版本 Agent 共存            |
| Serverless Functions       | Stateful Agent Execution     |
| Analytics 集成             | LangSmith 可观测性集成       |

**LangGraph 原生语义**：Agent Server 不是一个通用的 PaaS。它专门实现了 LangGraph 的 runtime 协议，包括 `runs/stream`、`threads`、`checkpoints` 等 API 端点。这意味着你本地用 `langgraph dev` 开发的 Agent，部署到 Agent Server 后行为完全一致。

### 部署流程

#### 步骤 1：确保项目结构正确

你的项目需要：

```plaintext
my-agent/
├── my_agent/
│   └── agent.py          # 包含 compile() 后的图
├── langgraph.json        # 核心配置
├── .env                  # 环境变量
└── pyproject.toml        # 依赖
```

#### 步骤 2：配置 langgraph.json

```json
{
  "dependencies": ["langchain_openai", "."],
  "graphs": {
    "agent": "./my_agent/agent.py:graph"
  },
  "env": ".env"
}
```

#### 步骤 3：部署

```bash
# 安装 CLI
pip install -U langgraph-cli

# 部署到 LangSmith
langgraph deploy
```

CLI 会引导你完成：
1. 选择目标项目（或创建新项目）
2. 配置环境变量（API keys 等）
3. 构建 Docker 镜像
4. 推送并启动服务

#### 步骤 4：验证部署

```bash
# 使用 curl 测试部署端点
curl -s --request POST \
    --url <DEPLOYMENT_URL>/runs/stream \
    --header 'Content-Type: application/json' \
    --header "X-Api-Key: <LANGSMITH_API_KEY>" \
    --data '{
        "assistant_id": "agent",
        "input": {
            "messages": [
                {
                    "role": "human",
                    "content": "Hello!"
                }
            ]
        },
        "stream_mode": "updates"
    }'
```

### 通过 Python SDK 调用

```python
from langgraph_sdk import get_client

# 连接到部署的 Agent
client = get_client(
    url="<DEPLOYMENT_URL>",
    api_key="<LANGSMITH_API_KEY>"
)

# 创建会话
thread = await client.threads.create()

# 发送消息并获取流式响应
async for event in client.runs.stream(
    thread_id=thread["thread_id"],
    assistant_id="agent",
    input={"messages": [{"role": "user", "content": "Hello!"}]},
    stream_mode=["messages", "updates"],
):
    print(event)
```

## 自托管部署选项

如果你不想使用托管方案（数据合规、成本控制、内网部署等），LangGraph 支持完全自托管。

### 方式一：Docker 容器部署

```bash
# 构建 Docker 镜像
langgraph build -t my-agent:latest

# 运行容器
docker run -d \
    --name my-agent \
    -p 8000:8000 \
    -e OPENAI_API_KEY=sk-... \
    -e LANGSMITH_API_KEY=lsv2_... \
    my-agent:latest
```

`langgraph build` 会根据 `langgraph.json` 中的 `dependencies` 生成 Dockerfile，构建包含所有依赖的镜像。

### 方式二：Docker Compose（推荐用于中小规模）

```yaml
# docker-compose.yml
version: "3.8"
services:
  agent-server:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - LANGSMITH_API_KEY=${LANGSMITH_API_KEY}
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/langgraph
    depends_on:
      - db

  db:
    image: postgres:16
    environment:
      POSTGRES_DB: langgraph
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  pgdata:
```

### 方式三：Kubernetes 部署

对大规模生产环境，Kubernetes 部署提供更好的扩展性和可管理性：

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: langgraph-agent
spec:
  replicas: 3
  selector:
    matchLabels:
      app: langgraph-agent
  template:
    metadata:
      labels:
        app: langgraph-agent
    spec:
      containers:
        - name: agent
          image: my-agent:latest
          ports:
            - containerPort: 8000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: agent-secrets
                  key: database-url
          resources:
            requests:
              memory: "512Mi"
              cpu: "250m"
            limits:
              memory: "1Gi"
              cpu: "500m"
```

**前端类比**：
- Docker 部署 ≈ 把 Next.js 打包成 Docker 镜像部署到 ECS
- Docker Compose ≈ 用 docker-compose 同时跑前端 + 后端 + 数据库
- Kubernetes ≈ 大规模微服务架构，和你在公司里见过的 K8s 部署一样

## 扩展策略

### 水平扩展的关键：共享 Checkpoint 存储

LangGraph Agent 是有状态的，但状态不在内存中——它在 checkpointer 中。只要多个实例共享同一个 checkpointer（如 Postgres），就能水平扩展。

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Agent 实例1 │     │  Agent 实例2 │     │  Agent 实例3 │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                  ┌────────▼────────┐
                  │  Postgres       │
                  │  (Checkpointer) │
                  └─────────────────┘
```

### Checkpointer 选型

| 场景         | 推荐 Checkpointer     | 理由                         |
| ------------ | ---------------------- | ---------------------------- |
| 本地开发     | `MemorySaver`          | 零配置，重启即清空           |
| 小规模生产   | SQLite                 | 轻量，单实例足够             |
| 中大规模生产 | PostgreSQL             | 支持多实例共享，可靠性高     |
| 云原生       | 托管 Postgres (RDS等)  | 免运维，自动备份             |

```python
# 本地开发
from langgraph.checkpoint.memory import MemorySaver
checkpointer = MemorySaver()

# 生产环境
from langgraph.checkpoint.postgres import PostgresSaver
checkpointer = PostgresSaver(conn_string="postgresql://...")

# 编译图时传入
graph = builder.compile(checkpointer=checkpointer)
```

### 负载均衡注意事项

- **流式连接**：使用 SSE 时，负载均衡器需要支持长连接（避免过早断开）
- **会话亲和性**：不是必需的（因为状态在数据库中），但可以减少 checkpoint 读取次数
- **超时设置**：LLM 调用可能很慢（10-60秒），确保代理/负载均衡器的超时设置足够长

## 团队协作与 Agent 共享

### 多 Agent 共存

一个部署可以包含多个 Agent（通过 `langgraph.json` 的 `graphs` 字段）：

```json
{
  "graphs": {
    "support_agent": "./agents/support.py:graph",
    "review_agent": "./agents/review.py:graph",
    "analytics_agent": "./agents/analytics.py:graph"
  }
}
```

每个 Agent 通过不同的 `assistant_id` 访问：

```python
# 调用客服 Agent
client.runs.stream(assistant_id="support_agent", ...)

# 调用审核 Agent
client.runs.stream(assistant_id="review_agent", ...)
```

### 版本管理

- 使用 Git tag 标记 Agent 版本
- 通过 LangSmith 的多版本部署能力进行灰度发布
- 保持 `langgraph.json` 和代码版本同步

### 团队工作流

```
开发者 A ──→ 本地开发 (langgraph dev)
              ↓
           提交 PR
              ↓
         CI 运行测试 (pytest)
              ↓
         合并到 main
              ↓
         自动部署到 staging
              ↓
         团队在 Studio 验证
              ↓
         发布到 production
```

## 环境配置与密钥管理

### 环境分层

```bash
# .env.development
OPENAI_API_KEY=sk-dev-...
LANGSMITH_TRACING=true
LANGSMITH_PROJECT=my-agent-dev

# .env.staging
OPENAI_API_KEY=sk-staging-...
LANGSMITH_TRACING=true
LANGSMITH_PROJECT=my-agent-staging

# .env.production（使用平台的密钥管理服务）
# 不要放在文件中，通过 CI/CD 注入
```

### 密钥管理最佳实践

1. **永远不要**在代码或 Git 中存储真实的 API Key
2. 本地开发使用 `.env` + `.gitignore`
3. CI/CD 使用 GitHub Secrets / GitLab CI Variables
4. 生产环境使用云厂商的密钥管理服务（AWS Secrets Manager、GCP Secret Manager 等）
5. 定期轮换 API Key

```python
# 代码中不要硬编码
import os

# 正确：从环境变量读取
api_key = os.environ["OPENAI_API_KEY"]

# 错误：硬编码
# api_key = "sk-abc123..."  # 绝对不要这样做
```

## 部署检查清单

- [ ] `langgraph.json` 配置正确且与代码一致
- [ ] 所有依赖在 `pyproject.toml` 中声明
- [ ] 环境变量通过安全方式注入（非明文文件）
- [ ] Checkpointer 选型适合部署规模
- [ ] 负载均衡器支持 SSE 长连接
- [ ] 超时设置满足 LLM 调用需求（建议 >= 60 秒）
- [ ] 监控和告警已配置（见[可观测性](/ai/langgraph/guide/observability)）
- [ ] 回滚方案已验证
- [ ] 日志级别正确（生产不要用 DEBUG）

## 先修与下一步

**先修内容**：
- [应用结构](/ai/langgraph/guide/application-structure) — 确保项目结构符合部署要求
- [测试](/ai/langgraph/guide/testing) — 部署前完成充分测试

**下一步**：
- [可观测性](/ai/langgraph/guide/observability) — 部署后的监控与追踪
- [Agent Chat UI](/ai/langgraph/guide/chat-ui) — 为部署的 Agent 配置前端界面
- [生产实践](/ai/langgraph/guide/application-structure) — 完整的生产化指南

## 参考

- [LangGraph Deploy](https://langchain-ai.github.io/langgraph/cloud/deployment/)
- [LangGraph CLI Reference](https://langchain-ai.github.io/langgraph/cloud/reference/cli/)
- [LangGraph API Reference](https://langchain-ai.github.io/langgraph/cloud/reference/api/)
- [LangSmith Agent Server](https://docs.smith.langchain.com/)

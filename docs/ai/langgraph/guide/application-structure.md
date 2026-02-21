---
title: 应用结构
description: LangGraph 应用的组织方式、配置文件、依赖管理与工程最佳实践
---

# 应用结构

## 为什么要关注项目结构

LangGraph 不是写一个脚本就结束的框架。当你的 Agent 开始拥有多个节点、工具、状态定义和子图时，混乱的文件组织会迅速拖慢开发效率。

**前端类比**：这就像 Next.js 的约定式目录结构——`app/`、`components/`、`lib/`、`middleware.ts` 各有归属。LangGraph 也有自己的推荐组织方式，核心围绕 `langgraph.json` 配置文件展开。

**LangGraph 原生语义**：LangGraph 的项目结构服务于两个目标——**本地开发调试**（通过 `langgraph dev` 启动 Studio）和**部署上线**（通过 LangSmith Agent Server 或 Docker）。结构合理意味着 CLI 工具能自动发现你的图定义。

## 推荐文件结构

### 使用 pyproject.toml（推荐）

```plaintext
my-app/
├── my_agent/                # 所有业务代码
│   ├── utils/               # 工具函数模块
│   │   ├── __init__.py
│   │   ├── tools.py         # 工具定义（搜索、数据库查询等）
│   │   ├── nodes.py         # 节点函数（每个节点一个函数）
│   │   └── state.py         # 状态类型定义
│   ├── __init__.py
│   └── agent.py             # 图的构建与编译入口
├── tests/                   # 测试目录
│   ├── test_nodes.py        # 节点单元测试
│   └── test_graph.py        # 图集成测试
├── .env                     # 环境变量（API keys 等）
├── langgraph.json           # LangGraph 配置文件（核心）
└── pyproject.toml           # Python 项目依赖管理
```

### 使用 requirements.txt

```plaintext
my-app/
├── my_agent/
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── tools.py
│   │   ├── nodes.py
│   │   └── state.py
│   ├── __init__.py
│   └── agent.py
├── .env
├── requirements.txt         # 依赖列表
└── langgraph.json
```

### 与前端项目结构的对照

| 前端（Next.js）         | LangGraph                | 职责         |
| ----------------------- | ------------------------ | ------------ |
| `app/` 路由目录         | `my_agent/agent.py`      | 核心流程定义 |
| `components/`           | `utils/nodes.py`         | 可复用处理单元 |
| `lib/` 工具函数         | `utils/tools.py`         | 工具 / 辅助逻辑 |
| `types/` 类型定义       | `utils/state.py`         | 状态类型     |
| `next.config.js`        | `langgraph.json`         | 框架配置     |
| `package.json`          | `pyproject.toml`         | 依赖管理     |
| `.env.local`            | `.env`                   | 环境变量     |

> 注意：这只是辅助理解的类比。LangGraph 的 `agent.py` 不是"路由"，而是一个有向图的构建脚本，最终 `compile()` 产出一个可执行的 `CompiledGraph` 对象。

## 核心配置文件：langgraph.json

`langgraph.json` 是 LangGraph CLI 和 Studio 定位你的图的关键配置文件。它告诉框架：

1. **依赖在哪里**
2. **图定义在哪里**
3. **环境变量从哪里加载**

### 基础示例

```json
{
  "dependencies": ["."],
  "graphs": {
    "agent": "./my_agent/agent.py:graph"
  },
  "env": ".env"
}
```

### 字段详解

#### `dependencies`

```json
{
  "dependencies": ["langchain_openai", "./my_agent"]
}
```

- `"."` 或 `"./my_agent"`：指向本地包（需要 `pyproject.toml` 或可安装的 Python 包）
- `"langchain_openai"`：指向 PyPI 上的第三方包
- 数组形式，可混合使用本地路径和 PyPI 包名

**前端类比**：类似 `package.json` 的 `dependencies` 字段，但这里是给 LangGraph 运行时用的，不是给 `pip install` 用的。

**LangGraph 原生语义**：`dependencies` 主要用于 `langgraph build` 构建 Docker 镜像时确定需要安装哪些包。本地开发时你仍需自行 `pip install`。

#### `graphs`

```json
{
  "graphs": {
    "my_agent": "./my_agent/agent.py:graph",
    "review_agent": "./my_agent/review.py:review_graph"
  }
}
```

- **key**：图的名称标识（部署后用于 API 路由）
- **value**：`文件路径:变量名` 格式，指向编译后的 `CompiledGraph` 对象

一个项目可以注册多个图，每个图在部署后有独立的 API 端点。

#### `env`

```json
{
  "env": "./.env"
}
```

指定环境变量文件路径，LangGraph CLI 启动时会自动加载。

### 完整配置示例

```json
{
  "dependencies": ["langchain_openai", "langchain_anthropic", "./my_agent"],
  "graphs": {
    "customer_support": "./my_agent/support.py:support_graph",
    "content_review": "./my_agent/review.py:review_graph"
  },
  "env": "./.env"
}
```

## 依赖管理

### pyproject.toml（推荐方式）

```toml
[project]
name = "my-agent"
version = "0.1.0"
description = "Customer support agent built with LangGraph"
requires-python = ">=3.10"
dependencies = [
    "langgraph>=0.4",
    "langchain-openai>=0.3",
    "langchain-community>=0.3",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0",
    "pytest-asyncio>=0.24",
]
```

### requirements.txt

```text
langgraph>=0.4
langchain-openai>=0.3
langchain-community>=0.3
```

**工程建议**：优先使用 `pyproject.toml` + `uv` 的组合。`uv` 是 Rust 实现的 Python 包管理器，安装速度比 `pip` 快 10-100 倍，对前端开发者来说，体验接近 `pnpm`。

```bash
# 初始化项目
uv init my-agent
cd my-agent

# 添加依赖
uv add langgraph langchain-openai

# 添加开发依赖
uv add --dev pytest pytest-asyncio
```

## 定义 Graphs

图的定义是 `agent.py`（或任何你在 `langgraph.json` 中指定的文件）的核心职责。

### 最小图定义

```python
# my_agent/agent.py
from langgraph.graph import StateGraph, MessagesState, START, END


def chatbot(state: MessagesState):
    """主对话节点"""
    return {"messages": [{"role": "ai", "content": "Hello!"}]}


# 构建图
builder = StateGraph(MessagesState)
builder.add_node("chatbot", chatbot)
builder.add_edge(START, "chatbot")
builder.add_edge("chatbot", END)

# 编译图 —— 这个变量名要和 langgraph.json 中的一致
graph = builder.compile()
```

### 结构化拆分（生产推荐）

当图变复杂时，建议把状态、节点、工具分文件管理：

```python
# my_agent/utils/state.py
from typing import TypedDict, Annotated
import operator


class AgentState(TypedDict):
    messages: Annotated[list, operator.add]
    context: str
    risk_score: int
```

```python
# my_agent/utils/nodes.py
from my_agent.utils.state import AgentState


def evaluate(state: AgentState) -> dict:
    """评估节点：分析用户意图并计算风险分"""
    # 业务逻辑...
    return {"risk_score": 42}


def respond(state: AgentState) -> dict:
    """响应节点：生成最终回复"""
    return {"messages": [{"role": "ai", "content": "处理完成"}]}
```

```python
# my_agent/utils/tools.py
from langchain_core.tools import tool


@tool
def search_database(query: str) -> str:
    """搜索知识库"""
    # 实际搜索逻辑...
    return f"搜索结果：{query}"
```

```python
# my_agent/agent.py
from langgraph.graph import StateGraph, START, END
from my_agent.utils.state import AgentState
from my_agent.utils.nodes import evaluate, respond


builder = StateGraph(AgentState)
builder.add_node("evaluate", evaluate)
builder.add_node("respond", respond)
builder.add_edge(START, "evaluate")
builder.add_edge("evaluate", "respond")
builder.add_edge("respond", END)

graph = builder.compile()
```

**前端类比**：这就像 React 项目里，你不会把所有组件写在 `App.tsx` 里，而是拆成 `components/`、`hooks/`、`utils/`。

**LangGraph 原生语义**：拆分的目标是让每个节点函数可独立测试、可独立 mock。`agent.py` 只做"连线"，不做业务逻辑。

## 环境变量管理

### .env 文件

```bash
# .env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
LANGSMITH_API_KEY=lsv2_...
LANGSMITH_TRACING=true
LANGSMITH_PROJECT=my-agent-dev
```

### 环境变量分层策略

| 环境     | 文件             | 用途             |
| -------- | ---------------- | ---------------- |
| 本地开发 | `.env`           | 个人 API keys    |
| CI/CD    | GitHub Secrets   | 测试用 keys      |
| 生产     | 平台环境变量     | 正式 keys + 配置 |

**前端类比**：和 Next.js 的 `.env.local` / `.env.production` 分层策略一样。

**安全提醒**：

```gitignore
# .gitignore —— 务必添加
.env
.env.*
```

永远不要将 `.env` 文件提交到版本控制。这是前端和后端通用的安全准则。

### 在代码中访问环境变量

```python
import os

# 直接使用（LangChain/LangGraph 会自动读取已知 key）
# OPENAI_API_KEY 会被 langchain-openai 自动拾取

# 自定义环境变量
my_config = os.environ.get("MY_CUSTOM_CONFIG", "default_value")
```

## 多图项目组织

当一个项目包含多个 Agent 时，推荐以下结构：

```plaintext
my-platform/
├── agents/
│   ├── support/
│   │   ├── __init__.py
│   │   ├── agent.py          # 客服 Agent
│   │   ├── nodes.py
│   │   └── state.py
│   ├── review/
│   │   ├── __init__.py
│   │   ├── agent.py          # 内容审核 Agent
│   │   ├── nodes.py
│   │   └── state.py
│   └── shared/
│       ├── __init__.py
│       └── tools.py           # 共享工具
├── .env
├── langgraph.json
└── pyproject.toml
```

对应的 `langgraph.json`：

```json
{
  "dependencies": ["."],
  "graphs": {
    "support": "./agents/support/agent.py:graph",
    "review": "./agents/review/agent.py:graph"
  },
  "env": ".env"
}
```

## 常见问题

### Q: langgraph.json 中的路径是相对于什么的？

相对于 `langgraph.json` 文件本身所在的目录。

### Q: 可以不用 langgraph.json 吗？

可以。如果你只做本地脚本开发（直接 `python main.py`），不需要此文件。但如果你要使用 LangGraph Studio 调试或部署到 LangSmith Agent Server，就必须有。

### Q: 一个文件里可以导出多个图吗？

可以，但建议每个图一个入口文件，保持职责单一。

```json
{
  "graphs": {
    "agent_a": "./agents/multi.py:graph_a",
    "agent_b": "./agents/multi.py:graph_b"
  }
}
```

## 生产化检查清单

在应用上线前，建议逐项确认以下要点：

### 四个核心关切

1. **可恢复**：关键流程必须可从中断点恢复
2. **可观测**：能看到每个节点执行轨迹和输入输出
3. **可回滚**：高风险动作必须可审批、可取消
4. **可演进**：状态结构和节点接口要可版本化

### Checkpointer 选型

- 本地开发：`InMemorySaver` 或 SQLite
- 小规模服务：SQLite / Postgres
- 生产推荐：Postgres（或云上托管实现）

### 可观测性最小清单

1. 每个节点都有明确名称和输入输出契约
2. 关键分支有可解释 route 字段
3. 中断点 payload 可被前端直接渲染
4. 每次调用保留 thread_id / user_id 关联
5. 故障后能通过 state history 快速定位失败 superstep

### 推荐验证流程

1. 单节点单测（输入/输出契约）
2. 子图集成测试（分支覆盖）
3. 中断恢复测试（`interrupt -> resume`）
4. 失败恢复测试（模拟超时/异常）
5. 回放分叉测试（checkpoint 回放 + update_state）
6. 流式一致性测试（messages/updates/custom 三路校验）

### 发布前检查表

- [ ] 是否所有高风险动作都有审批或保护策略
- [ ] 是否所有恢复链路都绑定稳定 `thread_id`
- [ ] 是否完成幂等性检查（至少覆盖支付/通知类副作用）
- [ ] 是否在 staging 验证 replay/time travel
- [ ] 是否验证移动端与桌面端的流程状态可视化

## 先修与下一步

**先修内容**：
- [快速开始](/ai/langgraph/guide/quickstart) — 确保你已跑通最小图
- [Graph API 基础](/ai/langgraph/guide/graph-api) — 理解 State / Node / Edge

**下一步**：
- [测试](/ai/langgraph/guide/testing) — 学习如何测试你的 LangGraph 应用
- [LangSmith Studio](/ai/langgraph/guide/studio) — 可视化调试你的图
- [部署](/ai/langgraph/guide/deployment) — 将 Agent 部署上线

## 参考

- [LangGraph Application Structure](https://langchain-ai.github.io/langgraph/cloud/reference/cli/)
- [LangGraph Overview](https://langchain-ai.github.io/langgraph/)
- [LangGraph Studio](https://langchain-ai.github.io/langgraph/concepts/langgraph_studio/)

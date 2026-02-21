---
title: 持久化
description: Threads、Checkpoints、Memory Store 与 Checkpointer 库 — LangGraph 持久化全貌
---

# 持久化 (Persistence)

> 持久化是 LangGraph 一切高级能力的基石。没有持久化，就没有中断恢复、时间旅行、记忆系统和容错能力。

## 前端类比：先建立直觉

如果你是前端开发者，可以这样快速映射：

| 前端概念 | LangGraph 概念 | 说明 |
|---------|---------------|------|
| `sessionStorage` | Thread | 一次会话的隔离上下文 |
| `localStorage` | Memory Store | 跨会话的持久数据 |
| Redux persist + snapshot | Checkpoint | 每一步的完整状态快照 |
| Redux DevTools | `get_state_history` | 可以回溯任意历史状态 |

**LangGraph 原生语义**：持久化层由 **Checkpointer**（负责 checkpoint 读写）和 **Store**（负责跨线程长期记忆）两个组件共同构成。Checkpointer 在每个 superstep（超步）结束后自动写入 checkpoint，Store 则按 namespace 组织的 key-value 对提供长期存储。

[🔗 Persistence 官方概念文档](https://langchain-ai.github.io/langgraph/concepts/persistence/){target="_blank" rel="noopener"}

---

## 1. Threads（线程）

### 什么是 Thread

Thread 是 LangGraph 中**一次独立会话的标识**。每个 thread 拥有自己的 checkpoint 序列，彼此完全隔离。

```python
# 通过 configurable 中的 thread_id 区分不同会话
config_user_a = {"configurable": {"thread_id": "user-a-session-1"}}
config_user_b = {"configurable": {"thread_id": "user-b-session-1"}}

# 同一个编译好的 graph，不同 thread 完全独立
graph.invoke({"messages": [{"role": "user", "content": "你好"}]}, config_user_a)
graph.invoke({"messages": [{"role": "user", "content": "hello"}]}, config_user_b)
```

### 前端类比

Thread 类似于前端中给每个用户创建独立的 `sessionStorage` 命名空间。每个 `thread_id` 就像一个独立的浏览器标签页——标签页之间互不干扰。

**LangGraph 原生语义**：`thread_id` 是字符串类型的唯一标识符，通常由业务层生成（如 UUID）。它作为 `configurable` 的一部分传入 `invoke` / `stream` 调用。所有 checkpoint 都归属于某个 thread。

### 生产建议

```python
import uuid

def create_thread_config(user_id: str, session_id: str | None = None):
    """为每个用户会话创建稳定的 thread 配置"""
    tid = session_id or f"{user_id}-{uuid.uuid4().hex[:8]}"
    return {"configurable": {"thread_id": tid}}
```

---

## 2. Checkpoints（检查点）

### 核心概念

Checkpoint 是某个 thread 在某个执行步骤的**完整状态快照**。LangGraph 在每个 superstep 结束后自动创建 checkpoint。

```mermaid
flowchart LR
    A[START] -->|superstep 0| B[node_a]
    B -->|checkpoint 写入| C((CP-0))
    B -->|superstep 1| D[node_b]
    D -->|checkpoint 写入| E((CP-1))
    D -->|superstep 2| F[END]
    F -->|checkpoint 写入| G((CP-2))

    style C fill:#4CAF50,color:#fff
    style E fill:#4CAF50,color:#fff
    style G fill:#4CAF50,color:#fff
```

每个 checkpoint 包含：

- **state**：该时刻的完整状态数据
- **metadata**：执行元信息（来源节点、步骤号等）
- **checkpoint_id**：唯一标识符
- **parent_config**：指向前一个 checkpoint 的引用（形成链表）

### 四大操作

#### `get_state` — 查看当前状态

```python
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import InMemorySaver
from typing import Annotated, TypedDict
from operator import add

class State(TypedDict):
    foo: str
    bar: Annotated[list[str], add]

def node_a(state: State):
    return {"foo": "a", "bar": ["a"]}

def node_b(state: State):
    return {"foo": "b", "bar": ["b"]}

workflow = StateGraph(State)
workflow.add_node(node_a)
workflow.add_node(node_b)
workflow.add_edge(START, "node_a")
workflow.add_edge("node_a", "node_b")
workflow.add_edge("node_b", END)

checkpointer = InMemorySaver()
graph = workflow.compile(checkpointer=checkpointer)

config = {"configurable": {"thread_id": "demo-1"}}
graph.invoke({"foo": "", "bar": []}, config)

# 查看最新状态
snapshot = graph.get_state(config)
print(snapshot.values)   # {'foo': 'b', 'bar': ['a', 'b']}
print(snapshot.next)     # () — 已执行完毕
```

#### `get_state_history` — 查看历史轨迹

```python
# 遍历所有历史 checkpoint（从新到旧）
for state in graph.get_state_history(config):
    print(f"Step {state.metadata.get('step')}: {state.values}")
    print(f"  checkpoint_id: {state.config['configurable']['checkpoint_id']}")
    print(f"  next nodes: {state.next}")
    print()
```

这就像 Redux DevTools 中的 action 历史列表——你能看到每一步状态是如何变化的。

#### `replay` — 回放执行

```python
# 从特定 checkpoint 回放
target_config = {
    "configurable": {
        "thread_id": "demo-1",
        "checkpoint_id": "0c62ca34-ac19-445d-bbb0-5b4984975b2a"
    }
}

# LangGraph 会智能地：
# 1. 重用已执行过的 checkpoint（不重新计算）
# 2. 从该 checkpoint 之后继续执行
result = graph.invoke(None, config=target_config)
```

#### `update_state` — 修改状态并分叉

```python
# 在指定 checkpoint 上注入修改，创建新的分支
graph.update_state(
    config,
    values={"foo": "manually_fixed"},
    as_node="node_a"  # 伪装成某个节点的输出
)

# 此时 get_state 会返回修改后的新状态
# 后续 invoke 会从这个修改点继续执行
```

**前端类比**：这等价于在 Redux DevTools 中手动 dispatch 一个 action 修改 state，然后让应用从修改后的 state 继续运行。

---

## 3. Memory Store

### 基础概念

Memory Store 是 LangGraph 提供的**跨线程持久化存储**。如果说 Checkpoint 是"一次会话内的状态快照"，那 Store 就是"跨会话的长期记忆数据库"。[🔗 Memory Store API 参考](https://langchain-ai.github.io/langgraph/concepts/memory/){target="_blank" rel="noopener"}

**前端类比**：Checkpoint 相当于 `sessionStorage`（会话级），Store 相当于 `IndexedDB`（持久级）。

### 基础用法

```python
from langgraph.store.memory import InMemoryStore

# 创建 store 实例
store = InMemoryStore()

# 写入数据：namespace 是元组，key 是字符串
store.put(
    namespace=("users", "alice"),
    key="preferences",
    value={"theme": "dark", "language": "zh-CN"}
)

# 读取数据
item = store.get(namespace=("users", "alice"), key="preferences")
print(item.value)  # {"theme": "dark", "language": "zh-CN"}

# 搜索 namespace 下的所有 key
items = store.search(namespace=("users", "alice"))
for item in items:
    print(f"{item.key}: {item.value}")
```

### 语义搜索

Store 支持基于向量的语义搜索，适合存储和检索非结构化记忆：

```python
from langgraph.store.memory import InMemoryStore

# 配置嵌入模型以启用语义搜索
store = InMemoryStore(
    index={
        "embed": "openai:text-embedding-3-small",
        "dims": 1536,
        "fields": ["text"],  # 对哪些字段建索引
    }
)

# 存入记忆
store.put(("memories", "alice"), "mem-1", {"text": "我喜欢用 TypeScript 开发"})
store.put(("memories", "alice"), "mem-2", {"text": "我最近在学习 LangGraph"})
store.put(("memories", "alice"), "mem-3", {"text": "我家有一只猫叫小橘"})

# 语义搜索
results = store.search(
    namespace=("memories", "alice"),
    query="编程语言偏好",
    limit=2
)
for r in results:
    print(f"[score={r.score:.2f}] {r.value['text']}")
# 输出可能：
# [score=0.89] 我喜欢用 TypeScript 开发
# [score=0.72] 我最近在学习 LangGraph
```

### 在 LangGraph 节点中使用 Store

```python
from dataclasses import dataclass
from langgraph.graph import StateGraph, MessagesState, START, END
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.store.memory import InMemoryStore
from langgraph.runtime import Runtime

@dataclass
class AppContext:
    user_id: str

store = InMemoryStore()
checkpointer = InMemorySaver()

def save_memory(state: MessagesState, runtime: Runtime[AppContext]):
    """节点内访问 store 保存长期记忆"""
    last_msg = state["messages"][-1]
    runtime.store.put(
        namespace=("conversation_facts",),
        key=f"fact-{len(state['messages'])}",
        value={"content": last_msg.content}
    )
    return state

def retrieve_memory(state: MessagesState, runtime: Runtime[AppContext]):
    """节点内检索长期记忆"""
    facts = runtime.store.search(namespace=("conversation_facts",), limit=5)
    context = "\n".join(f.value["content"] for f in facts)
    # 将记忆注入到后续处理...
    return state

builder = StateGraph(MessagesState, context_schema=AppContext)
builder.add_node(retrieve_memory)
builder.add_node(save_memory)
builder.add_edge(START, "retrieve_memory")
builder.add_edge("retrieve_memory", "save_memory")
builder.add_edge("save_memory", END)

# 同时传入 checkpointer 和 store
graph = builder.compile(checkpointer=checkpointer, store=store)
```

---

## 4. Checkpointer 库

LangGraph 提供多个 Checkpointer 实现，选择取决于你的环境：

### InMemorySaver — 开发/测试

```python
from langgraph.checkpoint.memory import InMemorySaver

checkpointer = InMemorySaver()
graph = workflow.compile(checkpointer=checkpointer)
```

- 进程结束即丢失
- 零外部依赖
- 适合本地开发和单元测试

### SqliteSaver — 单机持久化

```python
import sqlite3
from langgraph.checkpoint.sqlite import SqliteSaver

# 基础用法
conn = sqlite3.connect("checkpoints.db")
checkpointer = SqliteSaver(conn)
graph = workflow.compile(checkpointer=checkpointer)

# 带加密的用法
from langgraph.checkpoint.serde.encrypted import EncryptedSerializer

serde = EncryptedSerializer.from_pycryptodome_aes()  # 读取 LANGGRAPH_AES_KEY 环境变量
checkpointer = SqliteSaver(sqlite3.connect("secure_checkpoints.db"), serde=serde)
```

- 适合小规模服务 / 单体应用
- 需要 `pip install langgraph-checkpoint-sqlite`

### PostgresSaver — 生产推荐

```python
from langgraph.checkpoint.postgres import PostgresSaver

DB_URI = "postgresql://user:pass@localhost:5432/mydb?sslmode=require"

# 同步用法
with PostgresSaver.from_conn_string(DB_URI) as checkpointer:
    graph = workflow.compile(checkpointer=checkpointer)
    # ...使用 graph

# 异步用法
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver

async with AsyncPostgresSaver.from_conn_string(DB_URI) as checkpointer:
    graph = workflow.compile(checkpointer=checkpointer)
    # ...使用 graph
```

- 需要 `pip install langgraph-checkpoint-postgres`
- 支持连接池、并发读写
- 生产环境首选

### 选型对照表

| Checkpointer | 持久性 | 并发 | 加密 | 适用场景 |
|--------------|--------|------|------|---------|
| `InMemorySaver` | 无 | 单进程 | N/A | 开发/测试 |
| `SqliteSaver` | 文件级 | 单进程 | 支持 | 小规模/单体 |
| `PostgresSaver` | 数据库级 | 多进程 | 支持 | 生产环境 |

---

## 5. Checkpointer 接口与序列化器

### 自定义 Checkpointer 接口

如果内置实现不满足需求，可以实现 `BaseCheckpointSaver` 接口：

```python
from langgraph.checkpoint.base import BaseCheckpointSaver

class MyCustomCheckpointer(BaseCheckpointSaver):
    """自定义 checkpointer 需要实现以下方法"""

    def get_tuple(self, config):
        """根据 config 获取 checkpoint 元组"""
        ...

    def put(self, config, checkpoint, metadata, new_versions):
        """写入 checkpoint"""
        ...

    def list(self, config, *, filter=None, before=None, limit=None):
        """列出 checkpoint 历史"""
        ...

    def put_writes(self, config, writes, task_id):
        """写入中间写操作（用于 pending writes）"""
        ...
```

### 序列化器

Checkpointer 使用序列化器将 Python 对象转换为可存储的格式。默认使用 JSON + pickle 混合策略，你可以替换为加密序列化器：

```python
from langgraph.checkpoint.serde.encrypted import EncryptedSerializer
import os

# 设置加密密钥（AES-256）
os.environ["LANGGRAPH_AES_KEY"] = "your-32-byte-hex-key-here"

serde = EncryptedSerializer.from_pycryptodome_aes()
checkpointer = SqliteSaver(conn, serde=serde)
```

**前端类比**：序列化器的角色类似于前端中 `JSON.stringify/parse` 的增强版——你可以在"写入存储之前"和"从存储读出之后"加入自定义逻辑（如加密解密、压缩解压）。

---

## 6. 持久化支撑的能力全景

```mermaid
mindmap
  root((Persistence))
    Checkpoint
      get_state
      get_state_history
      update_state
      replay
    HITL
      interrupt 暂停
      resume 恢复
      审批 / 拒绝
    Memory
      短期：thread 内
      长期：Store 跨 thread
      语义搜索
    Time Travel
      回放历史步骤
      从任意 checkpoint 分叉
    容错
      进程崩溃后恢复
      网络超时后重试
      Durable Execution
```

### Human-in-the-Loop (HITL)

持久化使得 `interrupt()` 可以暂停执行——因为当前状态被保存在 checkpoint 中，用户审批后可以用 `Command(resume=...)` 恢复执行。没有持久化，中断后状态就丢失了。

### Memory

- **短期记忆**：自动存储在 checkpoint 中（同一 thread 的多轮对话上下文）
- **长期记忆**：存储在 Store 中（跨 thread 的用户偏好、知识积累）

### Time Travel

因为每一步都有 checkpoint，你可以：
1. 回溯到任意历史步骤查看当时的状态
2. 从历史步骤创建新的分支（fork）
3. 修改某个历史状态后重新执行

### 容错

如果进程崩溃或 LLM 调用超时，只要有 checkpoint，就能从最后成功的步骤恢复执行，而不需要从头开始。

---

## 7. Checkpoint 生命周期

```mermaid
sequenceDiagram
    participant Client as 客户端
    participant Graph as LangGraph Runtime
    participant CP as Checkpointer
    participant Store as Memory Store

    Client->>Graph: invoke(input, config)
    Graph->>CP: 加载最新 checkpoint (thread_id)
    CP-->>Graph: 返回 state 或 None

    loop 每个 superstep
        Graph->>Graph: 执行当前节点
        Graph->>CP: 写入 checkpoint
        CP-->>Graph: 确认写入

        opt 节点访问 store
            Graph->>Store: get / put / search
            Store-->>Graph: 返回数据
        end

        opt 遇到 interrupt
            Graph-->>Client: 返回中断信息 + __interrupt__
            Note over Client: 等待人工输入...
            Client->>Graph: invoke(Command(resume=...), config)
            Graph->>CP: 加载中断时的 checkpoint
        end
    end

    Graph-->>Client: 返回最终结果
```

---

## 要点回顾

| 概念 | 一句话 |
|------|--------|
| Thread | 一次会话的唯一标识，所有 checkpoint 归属于它 |
| Checkpoint | superstep 结束时的完整状态快照 |
| Store | 跨 thread 的长期 key-value 存储 |
| Checkpointer | checkpoint 的读写引擎，可选内存/SQLite/Postgres |
| 序列化器 | 控制 checkpoint 如何编码存储，支持加密 |

---

## 先修与下一步

- **先修**：[快速开始](/ai/langgraph/guide/quickstart) | [Graph API 基础](/ai/langgraph/guide/graph-api)
- **下一步**：[Durable Execution](/ai/langgraph/guide/durable-execution) | [Interrupts (HITL)](/ai/langgraph/guide/interrupts) | [Time Travel](/ai/langgraph/guide/time-travel) | [Memory 记忆系统](/ai/langgraph/guide/memory)

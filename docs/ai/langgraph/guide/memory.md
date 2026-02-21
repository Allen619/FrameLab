---
title: Memory 记忆系统
description: 短期记忆与长期记忆 — 从组件 state 到 IndexedDB，LangGraph 的记忆架构全解
---

# Memory 记忆系统

> Agent 没有记忆就像 React 组件没有 state——每次渲染都是全新的。LangGraph 的 Memory 系统让 Agent 既能"记住上下文"（短期），又能"记住用户偏好"（长期）。

## 前端类比：先建立直觉

| 前端概念 | LangGraph 概念 | 说明 |
|---------|---------------|------|
| `useState` / 组件 state | 短期记忆 (Checkpoint) | 当前会话内的上下文 |
| `useRef` 跨渲染持久值 | Thread 内多轮记忆 | 对话历史在同一 thread 中保留 |
| IndexedDB / 后端数据库 | 长期记忆 (Store) | 跨会话持久化的用户数据 |
| Context API | Store namespace | 按作用域组织数据 |
| 搜索引擎全文检索 | 语义搜索 | 基于语义相似度检索记忆 |

**LangGraph 原生语义**：LangGraph 的记忆分两层——**短期记忆**通过 Checkpointer 实现，存在 checkpoint 的 state 中（同一 thread 的多轮对话）；**长期记忆**通过 Store 实现，按 namespace 隔离，支持语义搜索（跨 thread 的用户偏好、知识）。

[🔗 Memory 官方概念文档](https://langchain-ai.github.io/langgraph/concepts/memory/){target="_blank" rel="noopener"}

---

## 1. 短期记忆 (Short-term Memory)

### 什么是短期记忆

短期记忆就是**同一个 thread 内的对话上下文**。它自动存储在 checkpoint 的 state 中。

```mermaid
flowchart LR
    subgraph thread["Thread: user-session-1"]
        M1["Turn 1: 你好"] --> M2["Turn 2: 我叫 Alice"]
        M2 --> M3["Turn 3: 我叫什么？"]
        M3 --> M4["Agent: 你叫 Alice"]
    end

    CP["Checkpoint<br/>保存完整消息历史"]
    thread -.->|"每轮自动保存"| CP

    style CP fill:#4CAF50,color:#fff
```

### 添加短期记忆

使用 `MessagesState`，消息历史自动累积：

```python
from langgraph.graph import StateGraph, MessagesState, START, END
from langgraph.checkpoint.memory import InMemorySaver
from langchain.chat_models import init_chat_model

model = init_chat_model("gpt-4.1-mini")

def chatbot(state: MessagesState):
    """消息列表自动包含完整历史，LLM 能看到所有上下文"""
    response = model.invoke(state["messages"])
    return {"messages": [response]}

builder = StateGraph(MessagesState)
builder.add_node("chat", chatbot)
builder.add_edge(START, "chat")
builder.add_edge("chat", END)

# 必须挂 checkpointer 才有短期记忆
checkpointer = InMemorySaver()
graph = builder.compile(checkpointer=checkpointer)

config = {"configurable": {"thread_id": "alice-session-1"}}

# 第一轮
graph.invoke({"messages": [{"role": "user", "content": "你好，我叫 Alice"}]}, config)

# 第二轮 — 传入新消息，LangGraph 自动合并历史
result = graph.invoke({"messages": [{"role": "user", "content": "我叫什么？"}]}, config)
print(result["messages"][-1].content)
# "你叫 Alice"
```

**前端类比**：这就像 React 中 `useState` 管理的聊天记录——新消息 append 到数组里，组件重新渲染时总能看到完整历史。区别是 LangGraph 把这个 state 持久化了，即使进程重启也不丢失。

### 生产环境使用

在生产环境中，使用持久化 checkpointer 保证短期记忆不丢失：

```python
from langgraph.checkpoint.postgres import PostgresSaver

DB_URI = "postgresql://user:pass@localhost:5432/mydb"

with PostgresSaver.from_conn_string(DB_URI) as checkpointer:
    graph = builder.compile(checkpointer=checkpointer)

    # 即使服务重启，同一 thread_id 的对话历史仍然完整
    config = {"configurable": {"thread_id": "alice-session-1"}}
    result = graph.invoke(
        {"messages": [{"role": "user", "content": "继续上次的话题"}]},
        config
    )
```

### 在 Subgraph 中使用短期记忆

子图默认共享父图的 checkpoint（通过 `MessagesState` 的 `messages` key 传递）：

```python
from langgraph.graph import StateGraph, MessagesState, START, END

# 子图
def sub_node(state: MessagesState):
    # 子图能看到从父图传入的消息历史
    history_len = len(state["messages"])
    return {"messages": [{"role": "assistant", "content": f"子图收到 {history_len} 条消息"}]}

sub_builder = StateGraph(MessagesState)
sub_builder.add_node("process", sub_node)
sub_builder.add_edge(START, "process")
sub_builder.add_edge("process", END)
sub_graph = sub_builder.compile()

# 主图
def main_node(state: MessagesState):
    return {"messages": [{"role": "assistant", "content": "主图处理"}]}

main_builder = StateGraph(MessagesState)
main_builder.add_node("main", main_node)
main_builder.add_node("sub", sub_graph)
main_builder.add_edge(START, "main")
main_builder.add_edge("main", "sub")
main_builder.add_edge("sub", END)

checkpointer = InMemorySaver()
graph = main_builder.compile(checkpointer=checkpointer)
```

---

## 2. 长期记忆 (Long-term Memory)

### 什么是长期记忆

长期记忆存储在 **Store** 中，它是**跨 thread 的持久化 key-value 存储**。[🔗 Store 与长期记忆指南](https://langchain-ai.github.io/langgraph/how-tos/cross-thread-persistence/){target="_blank" rel="noopener"} 适合存储：

- 用户偏好和配置
- 学到的知识和事实
- 历史交互模式的总结

```mermaid
flowchart TB
    subgraph threads["不同 Thread（会话）"]
        T1["Thread 1: 早上的对话"]
        T2["Thread 2: 下午的对话"]
        T3["Thread 3: 第二天的对话"]
    end

    subgraph store["Store（长期记忆）"]
        NS["namespace: ('users', 'alice')"]
        NS --> K1["key: preferences<br/>theme=dark, lang=zh"]
        NS --> K2["key: facts<br/>likes TypeScript"]
        NS --> K3["key: history_summary<br/>讨论过 LangGraph"]
    end

    T1 -.->|"写入"| store
    T2 -.->|"读+写"| store
    T3 -.->|"读+写"| store

    style store fill:#e3f2fd
```

### 在节点中访问 Store

```python
from dataclasses import dataclass
from langgraph.graph import StateGraph, MessagesState, START, END
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.store.memory import InMemoryStore
from langgraph.runtime import Runtime

@dataclass
class UserContext:
    user_id: str

store = InMemoryStore()
checkpointer = InMemorySaver()

# 预存一些用户偏好
store.put(("users", "alice"), "preferences", {"language": "zh-CN", "style": "concise"})

def personalized_response(state: MessagesState, runtime: Runtime[UserContext]):
    """根据长期记忆个性化回复"""
    user_id = runtime.context.user_id

    # 读取用户偏好
    prefs = runtime.store.get(("users", user_id), "preferences")
    if prefs:
        language = prefs.value.get("language", "en")
        style = prefs.value.get("style", "normal")
        context = f"用户偏好语言={language}，风格={style}"
    else:
        context = "无已知偏好"

    return {
        "messages": [{
            "role": "assistant",
            "content": f"[{context}] 基于你的偏好回复..."
        }]
    }

def learn_from_conversation(state: MessagesState, runtime: Runtime[UserContext]):
    """从对话中提取信息存入长期记忆"""
    user_id = runtime.context.user_id

    last_msg = state["messages"][-1]
    # 简化示例：实际中你会用 LLM 来提取关键信息
    runtime.store.put(
        ("users", user_id),
        f"fact-{len(state['messages'])}",
        {"content": last_msg.content, "type": "learned_fact"}
    )
    return state

builder = StateGraph(MessagesState, context_schema=UserContext)
builder.add_node("respond", personalized_response)
builder.add_node("learn", learn_from_conversation)
builder.add_edge(START, "respond")
builder.add_edge("respond", "learn")
builder.add_edge("learn", END)

graph = builder.compile(checkpointer=checkpointer, store=store)
```

### 生产环境使用

在生产中，Store 应使用持久化后端：

```python
# 当前 LangGraph 提供 InMemoryStore
# 生产环境建议搭配 LangGraph Platform 或自定义 Store 实现
from langgraph.store.memory import InMemoryStore

# InMemoryStore 支持配置向量嵌入以启用语义搜索
store = InMemoryStore(
    index={
        "embed": "openai:text-embedding-3-small",
        "dims": 1536,
        "fields": ["text"]
    }
)
```

### 语义搜索

当长期记忆中存储了大量非结构化文本时，语义搜索比精确匹配更有用：

```python
from langgraph.store.memory import InMemoryStore

store = InMemoryStore(
    index={
        "embed": "openai:text-embedding-3-small",
        "dims": 1536,
        "fields": ["text"],
    }
)

# 存入多条记忆
memories = [
    ("mem-1", {"text": "用户是一位前端工程师，擅长 React 和 TypeScript"}),
    ("mem-2", {"text": "用户对 Python 的装饰器语法有困惑"}),
    ("mem-3", {"text": "用户的项目使用 FastAPI 作为后端框架"}),
    ("mem-4", {"text": "用户喜欢简洁的代码风格，不喜欢过度抽象"}),
    ("mem-5", {"text": "用户家里养了两只猫"}),
]

for key, value in memories:
    store.put(("users", "bob"), key, value)

# 语义搜索：找到与"编程背景"相关的记忆
results = store.search(
    ("users", "bob"),
    query="这个用户的编程技术背景是什么",
    limit=3
)

for r in results:
    print(f"  [score={r.score:.2f}] {r.value['text']}")
# 可能输出：
# [score=0.91] 用户是一位前端工程师，擅长 React 和 TypeScript
# [score=0.82] 用户的项目使用 FastAPI 作为后端框架
# [score=0.75] 用户对 Python 的装饰器语法有困惑
```

**前端类比**：这类似于在 Algolia 或 ElasticSearch 中做全文搜索，但基于语义向量而不是关键词匹配。"编程背景"能匹配到"React 和 TypeScript"，即使两者没有共同关键词。

---

## 3. 管理短期记忆

随着对话轮数增加，消息历史会变得很长，导致：
- LLM 上下文窗口溢出
- 推理质量下降（信息过载）
- Token 成本增加

### 裁剪消息 (Trim)

```python
from langchain_core.messages import trim_messages

def chatbot_with_trim(state: MessagesState):
    """裁剪消息历史，只保留最近的消息"""
    # 只保留最近 10 条消息（或最近 4000 tokens）
    trimmed = trim_messages(
        state["messages"],
        max_tokens=4000,
        strategy="last",  # 保留最后的消息
        token_counter=len,  # 简化的 token 计数器
        include_system=True,  # 始终保留 system 消息
    )

    response = model.invoke(trimmed)
    return {"messages": [response]}
```

**前端类比**：类似于 React 虚拟列表——列表可能有 10000 项，但 DOM 中只渲染可见的 20 项。这里是消息可能有 100 轮，但发给 LLM 的只有最近 10 轮。

### 删除消息

```python
from langchain_core.messages import RemoveMessage

def cleanup_messages(state: MessagesState):
    """删除特定消息"""
    messages_to_remove = []
    for msg in state["messages"]:
        # 删除所有工具调用消息（减少噪音）
        if msg.type == "tool":
            messages_to_remove.append(RemoveMessage(id=msg.id))

    return {"messages": messages_to_remove}
```

### 总结消息

将冗长的对话历史压缩为一条总结消息：

```python
from langchain_core.messages import RemoveMessage

def summarize_conversation(state: MessagesState):
    """将历史消息总结为一条，减少上下文长度"""
    if len(state["messages"]) <= 10:
        return state  # 消息不多，不需要总结

    # 用 LLM 生成总结
    summary_prompt = (
        "请用 2-3 句话总结以下对话的关键信息：\n\n"
        + "\n".join(
            f"{m.type}: {m.content}" for m in state["messages"][:-2]
        )
    )
    summary = model.invoke([{"role": "user", "content": summary_prompt}])

    # 删除旧消息，保留总结 + 最近 2 条
    remove_msgs = [
        RemoveMessage(id=m.id) for m in state["messages"][:-2]
    ]

    # 插入总结消息
    summary_message = {
        "role": "system",
        "content": f"之前对话的总结：{summary.content}"
    }

    return {"messages": remove_msgs + [summary_message]}
```

```mermaid
flowchart LR
    subgraph before["总结前 (20 条消息)"]
        B1["msg 1"] --> B2["msg 2"] --> B3["..."] --> B20["msg 20"]
    end

    subgraph after["总结后 (3 条消息)"]
        A1["system: 之前对话的总结..."] --> A2["msg 19"] --> A3["msg 20"]
    end

    before -->|"summarize"| after

    style before fill:#fff3e0
    style after fill:#e8f5e9
```

### 管理 Checkpoints

对于长期运行的 thread，checkpoint 也需要管理：

```python
# 查看 checkpoint 占用情况
checkpoint_count = 0
for _ in graph.get_state_history(config):
    checkpoint_count += 1

print(f"当前 thread 有 {checkpoint_count} 个 checkpoint")

# 在生产中，可以通过 checkpointer 的底层接口清理旧 checkpoint
# PostgresSaver 可以通过 SQL 清理：
# DELETE FROM checkpoints WHERE thread_id = 'xxx' AND created_at < '2024-01-01'
```

---

## 4. 记忆系统架构全景

```mermaid
flowchart TB
    subgraph app["LangGraph Application"]
        subgraph short["短期记忆"]
            MSG["MessagesState<br/>消息历史"]
            TRIM["trim_messages<br/>裁剪"]
            SUM["summarize<br/>总结"]
            MSG --> TRIM
            MSG --> SUM
        end

        subgraph long["长期记忆"]
            STORE["Store"]
            NS1["namespace: users/alice"]
            NS2["namespace: users/bob"]
            SEM["语义搜索<br/>embedding index"]
            STORE --> NS1
            STORE --> NS2
            STORE --> SEM
        end

        short -.->|"关键信息提取"| long
        long -.->|"注入上下文"| short
    end

    subgraph persistence["持久化层"]
        CKP["Checkpointer<br/>Postgres / SQLite"]
        DB["Store Backend<br/>InMemory / 自定义"]
    end

    short -->|"保存在"| CKP
    long -->|"保存在"| DB
```

### 短期与长期记忆的协作

典型的工作流是：

1. **短期记忆**承载当前对话上下文
2. 从短期记忆中**提取关键信息**写入长期记忆
3. 新对话开始时，从长期记忆**注入个性化上下文**

```python
from dataclasses import dataclass
from langgraph.graph import StateGraph, MessagesState, START, END
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.store.memory import InMemoryStore
from langgraph.runtime import Runtime

@dataclass
class UserContext:
    user_id: str

def inject_long_term_memory(state: MessagesState, runtime: Runtime[UserContext]):
    """对话开始时注入长期记忆"""
    user_id = runtime.context.user_id
    # 搜索与当前话题相关的记忆
    last_user_msg = state["messages"][-1].content if state["messages"] else ""
    memories = runtime.store.search(
        ("users", user_id),
        query=last_user_msg,
        limit=3
    )

    if memories:
        context = "\n".join(m.value.get("text", "") for m in memories)
        system_msg = {
            "role": "system",
            "content": f"用户的历史信息：\n{context}"
        }
        return {"messages": [system_msg]}
    return state

def extract_to_long_term(state: MessagesState, runtime: Runtime[UserContext]):
    """对话结束时提取关键信息到长期记忆"""
    user_id = runtime.context.user_id

    # 用最后一轮交互内容存入长期记忆
    if len(state["messages"]) >= 2:
        last_exchange = state["messages"][-2:]
        content = " | ".join(m.content for m in last_exchange if hasattr(m, "content"))
        runtime.store.put(
            ("users", user_id),
            f"conv-{len(state['messages'])}",
            {"text": content}
        )
    return state
```

---

## 5. 数据库管理

### 存储选型

| 需求 | 短期记忆方案 | 长期记忆方案 |
|------|------------|------------|
| 本地开发 | `InMemorySaver` | `InMemoryStore` |
| 小规模生产 | `SqliteSaver` | `InMemoryStore` + 定期导出 |
| 大规模生产 | `PostgresSaver` | 自定义 Store（Postgres/Redis） |
| 需要语义搜索 | N/A | `InMemoryStore(index={...})` |

### 数据安全

```python
# 对敏感记忆数据加密存储
from langgraph.checkpoint.serde.encrypted import EncryptedSerializer
import os

os.environ["LANGGRAPH_AES_KEY"] = "your-aes-256-key"
serde = EncryptedSerializer.from_pycryptodome_aes()

# Checkpoint 加密
from langgraph.checkpoint.sqlite import SqliteSaver
import sqlite3
encrypted_checkpointer = SqliteSaver(sqlite3.connect("secure.db"), serde=serde)
```

### 数据隔离

```python
# 按用户隔离 namespace
def get_user_namespace(user_id: str):
    return ("users", user_id)

# 按租户 + 用户隔离
def get_tenant_user_namespace(tenant_id: str, user_id: str):
    return ("tenants", tenant_id, "users", user_id)

# 写入
store.put(
    get_tenant_user_namespace("company-a", "alice"),
    "preferences",
    {"theme": "dark"}
)

# 搜索时只能看到自己 namespace 下的数据
results = store.search(
    get_tenant_user_namespace("company-a", "alice"),
    query="偏好"
)
```

### 数据生命周期

```python
# 短期记忆管理
# - 活跃 thread：保留完整 checkpoint 链
# - 不活跃 thread（>30 天）：只保留最终 checkpoint
# - 已完成 thread（>90 天）：归档后删除

# 长期记忆管理
# - 定期评估记忆的"新鲜度"
# - 过时的记忆降低优先级或删除
# - 矛盾的记忆需要人工审核

def cleanup_stale_memories(store, namespace, max_age_days=90):
    """清理过期记忆（示意代码）"""
    from datetime import datetime, timedelta
    cutoff = datetime.now() - timedelta(days=max_age_days)

    items = store.search(namespace)
    for item in items:
        # 检查创建时间（需要在 value 中记录）
        created = item.value.get("created_at")
        if created and datetime.fromisoformat(created) < cutoff:
            store.delete(namespace, item.key)
```

---

## 6. 最佳实践总结

### 短期记忆

- 一定要使用 `trim_messages` 或总结机制防止消息爆炸
- System prompt 要始终保留（`include_system=True`）
- 工具调用消息可以适当清理以减少噪音

### 长期记忆

- namespace 设计要考虑多租户隔离
- 语义搜索的 embedding 模型选择影响检索质量
- 记忆提取逻辑建议用 LLM 做（比正则提取更鲁棒）
- 定期审计和清理过期记忆

### 两者协作

- 不要在短期记忆中存储"应该是长期的"数据（如用户偏好）
- 不要在长期记忆中存储"应该是短期的"数据（如当前任务上下文）
- 将关键信息从短期提取到长期应在对话结束时或周期性进行

---

## 要点回顾

| 概念 | 机制 | 前端类比 |
|------|------|---------|
| 短期记忆 | Checkpoint (state) | `useState` / 组件 state |
| 长期记忆 | Store (namespace + key-value) | IndexedDB / 后端数据库 |
| 消息裁剪 | `trim_messages` | 虚拟列表（只渲染可见部分） |
| 消息总结 | LLM summarize + `RemoveMessage` | 列表分页 + 摘要 |
| 语义搜索 | Store + embedding index | Algolia / ElasticSearch |

---

## 先修与下一步

- **先修**：[持久化](/ai/langgraph/guide/persistence) | [Interrupts (HITL)](/ai/langgraph/guide/interrupts)
- **下一步**：[Subgraphs 子图](/ai/langgraph/guide/subgraphs) | [Time Travel](/ai/langgraph/guide/time-travel)

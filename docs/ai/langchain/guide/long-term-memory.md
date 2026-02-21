---
title: 长期记忆
description: 掌握 LangChain 1.0 的长期记忆机制——通过 Store 接口实现跨对话持久化知识，支持用户偏好学习、事实记忆与个性化交互
---

# 长期记忆

## 概述

[短期记忆](/ai/langchain/guide/short-term-memory)通过 Checkpointer 在单个对话线程内维护上下文，但当用户关闭对话再回来时，Agent 就"忘了"之前的一切。**长期记忆（Long-term Memory）** 解决的正是这个问题——它让 Agent 能够跨对话、跨会话地记住用户的偏好、习惯和重要事实。

长期记忆的本质是一个独立于对话线程的**持久化键值存储**。Agent 在对话过程中可以主动将重要信息写入存储，也可以在后续对话中读取这些信息来提供个性化的回答。

::: tip 前端类比
长期记忆类似浏览器的 `localStorage` 或 `IndexedDB`——数据跨页面刷新、跨标签页持久存在。短期记忆（Checkpointer）对应 `sessionStorage`，关掉标签页就没了；长期记忆（Store）对应 `localStorage`，只要不手动清除就一直在。应用场景也类似：`sessionStorage` 存购物车临时状态，`localStorage` 存用户主题偏好、语言设置等。
:::

理解类比之后，也要注意长期记忆的**原生语义**：它通过 `BaseStore` 接口提供命名空间隔离的键值存储，工具函数在运行时通过 `ToolRuntime` 访问 Store 进行读写操作。与短期记忆不同，长期记忆的写入需要**显式编程**——Agent 不会自动记住任何东西，而是需要你定义"什么值得记住"和"如何记住"。

### 先修知识

- 了解 [短期记忆](/ai/langchain/guide/short-term-memory) 的 Checkpointer 机制
- 掌握 [Agent 实战指南](/ai/langchain/guide/agents) 和 [工具 Tools](/ai/langchain/guide/tools) 的基本用法

## 核心概念

### Store 接口（BaseStore）

Store 是 LangChain 长期记忆的存储抽象，提供简单的键值读写 API：

```python
from langgraph.store.base import BaseStore

# Store 的核心操作
store.put(namespace, key, value)      # 写入一条记忆
store.get(namespace, key)             # 读取一条记忆
store.search(namespace, query=...)    # 搜索记忆（支持语义搜索）
store.delete(namespace, key)          # 删除一条记忆
store.list_namespaces(prefix=...)     # 列出命名空间
```

**核心概念：**

| 概念 | 说明 | 示例 |
|------|------|------|
| namespace | 记忆的命名空间（元组），用于隔离不同用户/场景的数据 | `("users", "alice", "preferences")` |
| key | 记忆条目的唯一标识 | `"favorite_language"` |
| value | 存储的数据（字典） | `{"language": "Python", "reason": "简洁优雅"}` |

### 命名空间与作用域

命名空间是长期记忆的核心组织方式，支持多级嵌套，实现灵活的数据隔离：

```python
# 用户级记忆 — 每个用户独立
("users", "alice", "preferences")    # Alice 的偏好
("users", "bob", "preferences")      # Bob 的偏好

# 组织级记忆 — 团队共享
("org", "engineering", "standards")  # 工程团队的编码规范

# 全局记忆 — 所有用户共享
("global", "faq")                    # 常见问题知识库
```

这种层级结构允许你在不同粒度上组织数据：用户级存储个人偏好，组织级存储团队知识，全局级存储通用信息。

## Store 后端

### InMemoryStore（开发测试）

```python
from langgraph.store.memory import InMemoryStore

store = InMemoryStore()
```

- 数据存储在进程内存中，重启后丢失
- 零配置，适合本地开发和快速原型
- 支持基本的 put/get/search/delete 操作

### PostgresStore（生产环境）

```python
from langgraph.store.postgres import PostgresStore

store = PostgresStore.from_conn_string(
    "postgresql://user:pass@localhost:5432/mydb"
)
store.setup()  # 首次运行时创建必要的表
```

- 数据持久化到 PostgreSQL，服务重启后记忆不丢失
- 支持多实例共享，适合生产环境分布式部署
- 搭配 pgvector 扩展可实现语义搜索

### 后端对比

| Store | 安装包 | 持久化 | 语义搜索 | 适用环境 |
|-------|--------|--------|---------|---------|
| `InMemoryStore` | `langgraph`（内置） | 否 | 否 | 开发/测试 |
| `PostgresStore` | `langgraph-store-postgres` | 是 | 是（需 pgvector） | 生产 |

## 在工具中读写记忆

长期记忆的读写通过工具函数完成。Agent 在对话中调用记忆相关的工具来存储和检索信息：

```python
from langchain.agents import create_agent
from langchain.tools import tool
from langgraph.config import get_store
from langgraph.store.memory import InMemoryStore

store = InMemoryStore()

@tool
def save_user_preference(key: str, value: str) -> str:
    """保存用户的偏好信息。当用户明确表达偏好时调用此工具。

    Args:
        key: 偏好类型，如 "language"、"style"、"interests"
        value: 偏好内容描述
    """
    mem_store = get_store()
    # 使用固定的用户 namespace（实际项目中从 context 获取 user_id）
    namespace = ("users", "default", "preferences")
    mem_store.put(namespace, key, {"value": value})
    return f"已记住你的偏好: {key} = {value}"

@tool
def recall_user_preferences() -> str:
    """回忆用户的所有已知偏好。在需要个性化回答时调用此工具。"""
    mem_store = get_store()
    namespace = ("users", "default", "preferences")
    items = mem_store.search(namespace)
    if not items:
        return "暂时没有记录任何偏好信息。"
    prefs = []
    for item in items:
        prefs.append(f"- {item.key}: {item.value.get('value', '未知')}")
    return "已知偏好:\n" + "\n".join(prefs)

agent = create_agent(
    model="anthropic:claude-sonnet-4-5-20250929",
    tools=[save_user_preference, recall_user_preferences],
    prompt="""你是一个贴心的个性化助手。对话中注意：
1. 当用户提到偏好或习惯时，主动调用保存工具记住
2. 回答问题前先回忆用户偏好，提供个性化建议
3. 自然地使用记忆信息，不要生硬地列出""",
    store=store,
)
```

## 运行时上下文与记忆结合

在实际项目中，用户身份信息通过运行时上下文注入，记忆按用户隔离存储：

```python
from dataclasses import dataclass
from langchain.agents import create_agent
from langchain.tools import tool
from langgraph.config import get_store, get_config

@dataclass
class UserContext:
    user_id: str
    user_name: str

@tool
def remember(fact_key: str, fact_value: str) -> str:
    """记住关于用户的一个事实或偏好

    Args:
        fact_key: 事实类别，如 "name"、"role"、"preference"
        fact_value: 具体内容
    """
    store = get_store()
    config = get_config()
    user_id = config["configurable"].get("user_id", "anonymous")
    namespace = ("users", user_id, "facts")
    store.put(namespace, fact_key, {"content": fact_value})
    return f"已记录: {fact_key}"

@tool
def recall(query: str) -> str:
    """回忆关于当前用户的已知信息

    Args:
        query: 想要回忆的内容类别或关键词
    """
    store = get_store()
    config = get_config()
    user_id = config["configurable"].get("user_id", "anonymous")
    namespace = ("users", user_id, "facts")
    items = store.search(namespace)
    if not items:
        return "暂无该用户的记录。"
    facts = [f"- {item.key}: {item.value['content']}" for item in items]
    return "已知信息:\n" + "\n".join(facts)

agent = create_agent(
    model="anthropic:claude-sonnet-4-5-20250929",
    tools=[remember, recall],
    prompt="你是一个有记忆力的助手。在对话中主动记住用户分享的重要信息，并在适当时使用。",
    store=store,
)

# 调用时传入用户标识
result = agent.invoke(
    {"messages": [{"role": "user", "content": "我叫小明，最喜欢用 TypeScript 写前端"}]},
    config={"configurable": {"user_id": "user-alice"}},
)
```

## 短期记忆 vs 长期记忆

| 维度 | 短期记忆（Checkpointer） | 长期记忆（Store） |
|------|------------------------|------------------|
| **作用域** | 单个对话线程内 | 跨所有对话线程 |
| **内容** | 完整的消息历史 | 结构化的事实、偏好、知识 |
| **存储方式** | 自动保存每轮对话 | 工具显式写入 |
| **读取方式** | 自动加载到上下文 | 工具显式读取 |
| **生命周期** | 对话结束可丢弃 | 长期保留 |
| **容量影响** | 受模型上下文窗口限制 | 不受限，按需检索 |
| **类比** | `sessionStorage` | `localStorage` |
| **配置方式** | `checkpointer=InMemorySaver()` | `store=InMemoryStore()` |

**最佳实践：** 两者通常组合使用——Checkpointer 维持当前对话的连贯性，Store 提供跨对话的个性化知识。

## 实战示例：用户偏好学习 Agent

以下是一个完整的用户偏好学习 Agent，能记住用户习惯并在后续对话中提供个性化建议：

```python
from langchain.agents import create_agent
from langchain.tools import tool
from langgraph.config import get_store, get_config
from langgraph.store.memory import InMemoryStore
from langgraph.checkpoint.memory import InMemorySaver

store = InMemoryStore()
checkpointer = InMemorySaver()

@tool
def save_preference(category: str, detail: str) -> str:
    """保存用户偏好。当用户表达喜好、习惯或要求时使用。

    Args:
        category: 偏好分类，如 "code_style"、"language"、"framework"、"food"、"hobby"
        detail: 偏好的具体描述
    """
    mem = get_store()
    config = get_config()
    uid = config["configurable"].get("user_id", "default")
    namespace = ("users", uid, "preferences")
    mem.put(namespace, category, {"detail": detail, "source": "conversation"})
    return f"已记住偏好 [{category}]: {detail}"

@tool
def get_preferences() -> str:
    """获取当前用户的所有已知偏好。在需要个性化推荐时使用。"""
    mem = get_store()
    config = get_config()
    uid = config["configurable"].get("user_id", "default")
    namespace = ("users", uid, "preferences")
    items = mem.search(namespace)
    if not items:
        return "暂无偏好记录，请在对话中了解用户偏好。"
    prefs = []
    for item in items:
        prefs.append(f"- {item.key}: {item.value['detail']}")
    return "用户偏好:\n" + "\n".join(prefs)

@tool
def recommend(topic: str) -> str:
    """基于用户偏好生成个性化推荐

    Args:
        topic: 推荐主题，如 "学习路线"、"技术选型"、"项目方向"
    """
    mem = get_store()
    config = get_config()
    uid = config["configurable"].get("user_id", "default")
    namespace = ("users", uid, "preferences")
    items = mem.search(namespace)
    pref_summary = ", ".join([f"{i.key}={i.value['detail']}" for i in items])
    return f"基于偏好 [{pref_summary}] 为主题 [{topic}] 生成推荐（由 LLM 综合分析）"

agent = create_agent(
    model="anthropic:claude-sonnet-4-5-20250929",
    tools=[save_preference, get_preferences, recommend],
    prompt="""你是一个有记忆力的个性化技术助手。请遵循：
1. 对话中留意用户提到的偏好和习惯，主动保存
2. 给建议前先查看已有偏好，确保推荐符合用户喜好
3. 自然地融入记忆信息，避免机械地列举偏好
4. 新一轮对话开始时主动回忆用户偏好""",
    store=store,
    checkpointer=checkpointer,
)

# 第一次对话：用户分享偏好
config = {"configurable": {"thread_id": "session-1", "user_id": "alice"}}
agent.invoke(
    {"messages": [{"role": "user", "content": "我是前端开发，主要用 React + TypeScript，喜欢函数式编程风格"}]},
    config,
)

# 第二次对话（新线程）：Agent 仍然记得用户偏好
config2 = {"configurable": {"thread_id": "session-2", "user_id": "alice"}}
result = agent.invoke(
    {"messages": [{"role": "user", "content": "推荐一个适合我的后端框架"}]},
    config2,
)
print(result["messages"][-1].content)
# Agent 会基于"前端开发、React、TypeScript、函数式"等偏好推荐
# 例如推荐 Hono / Fastify（TypeScript 友好）而非 Django（Python）
```

## 常见问题

**Q: 长期记忆会自动记住对话内容吗？**

A: 不会。长期记忆需要通过工具显式写入。你需要定义"记忆工具"并在系统提示词中引导 Agent 在合适的时机使用它。这给了你完全的控制权——决定什么信息值得长期保存。

**Q: Store 和 Checkpointer 可以用同一个数据库吗？**

A: 可以。PostgresStore 和 PostgresSaver 可以指向同一个 PostgreSQL 实例（使用不同的表）。这简化了基础设施管理。

**Q: 长期记忆的数据量会不会影响性能？**

A: Store 的 `search` 操作独立于模型的上下文窗口。即使存储了大量记忆，每次只检索相关的少量条目注入上下文。PostgresStore 搭配索引可以高效处理大规模数据。

**Q: 如何清除用户的长期记忆？**

A: 通过 `store.delete(namespace, key)` 删除单条记忆，或者遍历 namespace 批量删除。你也可以定义一个"忘记"工具让用户主动要求清除某些记忆。

## 下一步

- [短期记忆](/ai/langchain/guide/short-term-memory) -- 了解 Checkpointer 的对话内记忆机制
- [运行时配置](/ai/langchain/guide/runtime) -- 深入 Runtime 上下文与依赖注入
- [Agent 实战指南](/ai/langchain/guide/agents) -- 将记忆能力集成到 Agent 中

## 参考资源

- [LangChain Memory 概念文档](https://python.langchain.com/docs/concepts/memory/)
- [LangGraph Store API](https://langchain-ai.github.io/langgraph/reference/store/)
- [LangGraph Persistence 指南](https://langchain-ai.github.io/langgraph/concepts/persistence/)

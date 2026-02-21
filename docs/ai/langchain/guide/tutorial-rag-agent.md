---
title: RAG Agent 实战
description: 从零构建一个基于知识库的智能问答 Agent——文档索引、检索工具、Agent 创建、对话记忆与质量优化
---

# RAG Agent 实战

## 我们要构建什么

本教程将带你构建一个**知识库问答 Agent**——用户用自然语言提问，Agent 自动从文档库中检索相关内容，然后基于检索结果生成准确的回答。与简单的语义搜索不同，RAG Agent 具备**推理能力**：它能判断何时需要搜索、如何组合多次检索的结果、以及如何结合上下文给出连贯的多轮对话。

完成本教程后，你将拥有一个支持多轮对话、可追溯信息来源的智能知识库助手。

::: tip 前端类比
RAG Agent 类似于带有搜索功能的 ChatGPT——它不是凭记忆回答，而是像一个研究员，每次回答前先去知识库"查资料"，然后基于查到的内容组织答案。你可以把它想象成一个会自动调用 `fetch('/api/search?q=...')` 的 AI 聊天组件。
:::

### 先修知识

- 已完成 [环境搭建](/ai/langchain/guide/install)
- 了解 [检索增强 RAG](/ai/langchain/guide/retrieval) 的核心概念
- 了解 [Agent 实战指南](/ai/langchain/guide/agents) 和 [工具 Tools](/ai/langchain/guide/tools) 的基本用法
- 了解 [短期记忆](/ai/langchain/guide/short-term-memory) 中 `thread_id` 的概念

## RAG Agent 架构

RAG Agent 的核心是将**检索能力**封装为工具，让 Agent 自主决定何时检索、搜索什么关键词：

```mermaid
flowchart TB
    A([用户提问]) --> B[Agent 接收消息]
    B --> C[调用 LLM 推理]
    C --> D{LLM 决策}

    D -->|需要查资料| E["调用检索工具<br/>search_knowledge_base"]
    E --> F[向量库相似度搜索]
    F --> G[返回相关文档片段]
    G --> H[文档作为上下文<br/>送回 LLM]
    H --> C

    D -->|信息充分| I[基于检索内容<br/>生成回答]
    I --> J([返回最终回答<br/>+ 来源引用])

    subgraph 知识库["知识库（离线构建）"]
        K["原始文档"] --> L["切分 & 向量化"]
        L --> M[("Chroma 向量库")]
    end

    F -.-> M

    style A fill:#e1f5ff
    style J fill:#c8e6c9
    style M fill:#fff9c4
```

**关键理解：**

1. Agent 拥有"搜索知识库"这个工具，但由 LLM 自主决定是否调用
2. 对于简单问候（如"你好"），Agent 直接回答，不触发检索
3. 对于知识型问题，Agent 可能多次检索不同关键词，直到信息充分
4. 对话记忆让 Agent 能理解上下文中的指代（"它的用法"指代上文提到的技术）

## 前置准备

### 安装依赖

```bash
pip install langchain langchain-openai langchain-chroma langchain-community
pip install langchain-text-splitters langgraph
```

### 准备知识库文档

创建一个包含技术文档的知识库目录：

```python
# prepare_knowledge_base.py
import os

os.makedirs("knowledge_base", exist_ok=True)

docs = {
    "api-auth.md": """# API 认证指南

## JWT Token 认证
本系统采用 JWT（JSON Web Token）进行 API 认证。

### 获取 Token
发送 POST 请求到 /api/auth/login，携带用户名和密码：
```
POST /api/auth/login
Content-Type: application/json
{"username": "admin", "password": "your_password"}
```
成功后返回 access_token 和 refresh_token。

### Token 刷新
access_token 有效期为 2 小时。过期前使用 refresh_token 获取新的 access_token：
```
POST /api/auth/refresh
Authorization: Bearer {refresh_token}
```

### 权限级别
- admin：全部权限
- editor：读写权限，不可管理用户
- viewer：只读权限
""",
    "api-endpoints.md": """# API 端点文档

## 用户管理
- GET /api/users — 获取用户列表（需要 admin 权限）
- GET /api/users/{id} — 获取单个用户详情
- POST /api/users — 创建新用户（需要 admin 权限）
- PUT /api/users/{id} — 更新用户信息
- DELETE /api/users/{id} — 删除用户（需要 admin 权限）

## 文章管理
- GET /api/articles — 获取文章列表，支持分页和过滤
- GET /api/articles/{id} — 获取文章详情
- POST /api/articles — 创建文章（需要 editor 权限）
- PUT /api/articles/{id} — 更新文章
- DELETE /api/articles/{id} — 删除文章

## 查询参数
所有列表接口支持以下查询参数：
- page: 页码，默认 1
- per_page: 每页数量，默认 20，最大 100
- sort: 排序字段
- order: 排序方向，asc 或 desc
""",
    "troubleshooting.md": """# 常见问题排查

## 401 Unauthorized 错误
原因：Token 过期或无效。
解决方案：
1. 检查 Token 是否已过期（有效期 2 小时）
2. 使用 refresh_token 获取新的 access_token
3. 确认 Authorization 头格式正确：Bearer {token}

## 403 Forbidden 错误
原因：当前用户权限不足。
解决方案：
1. 检查当前用户的权限级别
2. 联系管理员提升权限
3. 确认请求的接口所需的最低权限

## 429 Too Many Requests 错误
原因：请求频率超出限制。
解决方案：
1. API 限制为每分钟 60 次请求
2. 使用指数退避策略重试
3. 考虑批量接口减少请求次数

## 数据库连接超时
原因：数据库连接池耗尽或网络问题。
解决方案：
1. 检查连接池配置（默认最大 20 连接）
2. 确认数据库服务器状态
3. 检查网络防火墙设置
""",
}

for filename, content in docs.items():
    with open(f"knowledge_base/{filename}", "w", encoding="utf-8") as f:
        f.write(content)

print(f"已创建 {len(docs)} 个知识库文档")
```

## Step 1: 准备知识库

加载文档并切分为合适大小的片段：

```python
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

# 加载所有文档
loader = DirectoryLoader(
    "knowledge_base/",
    glob="**/*.md",
    loader_cls=TextLoader,
    loader_kwargs={"encoding": "utf-8"},
)
documents = loader.load()
print(f"加载 {len(documents)} 个文档")

# 切分文档
splitter = RecursiveCharacterTextSplitter(
    chunk_size=600,         # 适中的片段大小，兼顾精度和上下文
    chunk_overlap=100,      # 重叠部分防止信息丢失
    separators=["\n\n", "\n", "。", " ", ""],
)
chunks = splitter.split_documents(documents)
print(f"切分为 {len(chunks)} 个片段")

# 查看切分效果
for i, chunk in enumerate(chunks[:3]):
    print(f"\n[片段 {i+1}] 来源: {chunk.metadata['source']}")
    print(f"长度: {len(chunk.page_content)} 字符")
    print(f"内容: {chunk.page_content[:80]}...")
```

## Step 2: 构建向量库索引

将文档片段向量化并存储到 Chroma：

```python
from langchain.embeddings import init_embeddings
from langchain_chroma import Chroma

embeddings = init_embeddings("openai:text-embedding-3-small")

vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    collection_name="project_docs",
    persist_directory="./chroma_db",
)

print(f"索引构建完成，共 {vectorstore._collection.count()} 个片段")
```

## Step 3: 创建检索工具

将向量库检索封装为 Agent 可用的工具：

```python
from langchain.tools import tool

# 初始化检索器（MMR 策略兼顾相关性和多样性）
retriever = vectorstore.as_retriever(
    search_type="mmr",
    search_kwargs={"k": 4, "fetch_k": 10},
)


@tool
def search_knowledge_base(query: str) -> str:
    """在项目知识库中搜索相关文档。当用户询问 API 用法、认证方式、
    接口说明、错误排查等与项目文档相关的问题时，使用此工具搜索答案。

    Args:
        query: 搜索关键词或问题描述。建议使用具体的技术术语，
               如 "JWT Token 认证" 而非 "怎么登录"
    """
    docs = retriever.invoke(query)

    if not docs:
        return "未在知识库中找到相关文档。请尝试换个关键词搜索。"

    results = []
    for i, doc in enumerate(docs, 1):
        source = doc.metadata.get("source", "未知来源")
        results.append(
            f"[文档 {i} | 来源: {source}]\n{doc.page_content}"
        )

    return "\n\n---\n\n".join(results)
```

**工具设计要点：**

- docstring 明确说明工具的功能和适用场景，LLM 据此判断何时调用
- `Args` 描述中给出使用建议，引导 LLM 构造更好的搜索关键词
- 返回结果包含来源信息，方便 Agent 在回答中引用

## Step 4: 构建 RAG Agent

使用 `create_agent` 创建一个配备检索工具的智能 Agent：

```python
from langchain.agents import create_agent
from langgraph.checkpoint.memory import InMemorySaver

# 使用内存检查点实现对话记忆
checkpointer = InMemorySaver()

SYSTEM_PROMPT = """你是一个项目文档助手，专门回答与项目 API、技术文档相关的问题。

## 工作原则
1. 回答任何技术问题之前，先使用 search_knowledge_base 工具搜索相关文档
2. 严格基于检索到的文档内容回答，不要编造不存在的 API 或功能
3. 如果文档中没有相关信息，明确告知用户"文档中暂无此信息"
4. 回答时标注信息来源（如"根据 api-auth.md 文档..."）
5. 对于复杂问题，可以多次搜索不同关键词以获取全面信息

## 回答格式
- 先给出直接回答
- 如有必要，附上代码示例或步骤说明
- 最后标注信息来源"""

agent = create_agent(
    model="anthropic:claude-sonnet-4-5-20250929",
    tools=[search_knowledge_base],
    prompt=SYSTEM_PROMPT,
    checkpointer=checkpointer,
)
```

## Step 5: 添加对话记忆

通过 `thread_id` 实现多轮对话的上下文记忆：

```python
# 同一个 thread_id 代表同一个对话会话
config = {"configurable": {"thread_id": "user-session-001"}}

# 第一轮对话
result1 = agent.invoke(
    {"messages": [{"role": "user", "content": "系统的认证方式是什么？"}]},
    config,
)
print("=== 第一轮 ===")
print(result1["messages"][-1].content)

# 第二轮对话（Agent 能理解"它"指代上文的 JWT Token）
result2 = agent.invoke(
    {"messages": [{"role": "user", "content": "它的有效期是多久？过期了怎么办？"}]},
    config,
)
print("\n=== 第二轮 ===")
print(result2["messages"][-1].content)

# 第三轮对话
result3 = agent.invoke(
    {"messages": [{"role": "user", "content": "如果遇到 403 错误应该怎么排查？"}]},
    config,
)
print("\n=== 第三轮 ===")
print(result3["messages"][-1].content)
```

**对话记忆的工作原理：**

- `InMemorySaver` 在内存中保存每个 `thread_id` 的完整消息历史
- 每次调用时，Agent 自动加载该线程的历史消息作为上下文
- LLM 能看到之前的问答，因此能理解"它"、"这个"等指代词
- 切换 `thread_id` 就开始一个全新的对话

## Step 6: 测试各种问题

验证 Agent 在不同类型问题上的表现：

```python
def ask(question: str, thread_id: str = "test"):
    """便捷的问答函数"""
    config = {"configurable": {"thread_id": thread_id}}
    result = agent.invoke(
        {"messages": [{"role": "user", "content": question}]},
        config,
    )
    answer = result["messages"][-1].content
    print(f"Q: {question}")
    print(f"A: {answer}\n")
    return answer


# 测试 1：直接知识问题
ask("API 有哪些用户管理相关的接口？")

# 测试 2：排查类问题
ask("请求返回 429 错误怎么解决？")

# 测试 3：综合问题（需要跨文档检索）
ask("我想调用创建文章的接口，需要什么权限？请求格式是什么？")

# 测试 4：知识库中没有的问题
ask("系统支持 OAuth2 登录吗？")

# 测试 5：非技术问题（Agent 应直接回答，不触发检索）
ask("你好，你能做什么？")
```

## Step 7: 质量优化

### 1. Chunk Size 调优

不同类型的文档适合不同的切分大小：

```python
# FAQ 类文档：小 chunk，精确匹配
faq_splitter = RecursiveCharacterTextSplitter(
    chunk_size=300,
    chunk_overlap=50,
)

# API 文档：中等 chunk，保持完整的接口描述
api_splitter = RecursiveCharacterTextSplitter(
    chunk_size=600,
    chunk_overlap=100,
)

# 教程类文档：大 chunk，保持上下文连贯
tutorial_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
)
```

### 2. 添加元数据增强检索

```python
from langchain_core.documents import Document

# 为不同类型的文档添加元数据
for doc in documents:
    source = doc.metadata["source"]
    if "auth" in source:
        doc.metadata["category"] = "authentication"
    elif "endpoint" in source:
        doc.metadata["category"] = "api-reference"
    elif "troubleshoot" in source:
        doc.metadata["category"] = "troubleshooting"
```

### 3. Re-ranking 重排序

当检索结果较多时，使用 LLM 对结果进行重排序，将最相关的内容排在前面：

```python
@tool
def search_with_rerank(query: str) -> str:
    """在知识库中搜索并对结果进行智能排序。
    优先返回与问题最相关的文档片段。

    Args:
        query: 搜索关键词或完整问题
    """
    # 先多检索一些候选结果
    docs = vectorstore.similarity_search_with_score(query=query, k=8)

    if not docs:
        return "未找到相关文档。"

    # 按相似度分数排序（分数越低越相似）
    sorted_docs = sorted(docs, key=lambda x: x[1])

    # 只取 top-4 最相关的结果
    top_docs = sorted_docs[:4]

    results = []
    for i, (doc, score) in enumerate(top_docs, 1):
        source = doc.metadata.get("source", "未知")
        similarity = max(0, 1 - score / 2)
        results.append(
            f"[文档 {i} | 来源: {source} | 相关度: {similarity:.2f}]\n{doc.page_content}"
        )

    return "\n\n---\n\n".join(results)
```

### 4. 多查询检索

对于模糊的用户问题，生成多个搜索查询以提高召回率：

```python
@tool
def multi_query_search(question: str) -> str:
    """对复杂问题进行多角度搜索。自动将问题拆解为多个搜索关键词，
    合并去重后返回最相关的结果。

    Args:
        question: 用户的完整问题
    """
    # 从不同角度搜索
    all_docs = []
    seen_contents = set()

    # 原始问题搜索
    for doc in retriever.invoke(question):
        content_key = doc.page_content[:80]
        if content_key not in seen_contents:
            seen_contents.add(content_key)
            all_docs.append(doc)

    # 提取关键词再搜索一次（简单的关键词提取）
    keywords = question.replace("？", "").replace("怎么", "").replace("如何", "")
    for doc in retriever.invoke(keywords):
        content_key = doc.page_content[:80]
        if content_key not in seen_contents:
            seen_contents.add(content_key)
            all_docs.append(doc)

    if not all_docs:
        return "多角度搜索后仍未找到相关文档。"

    results = []
    for i, doc in enumerate(all_docs[:5], 1):
        source = doc.metadata.get("source", "未知")
        results.append(f"[文档 {i} | 来源: {source}]\n{doc.page_content}")

    return "\n\n---\n\n".join(results)
```

## 完整代码

```python
"""
rag_agent.py — 完整的 RAG 知识库问答 Agent
"""

from langchain.agents import create_agent
from langchain.tools import tool
from langchain.embeddings import init_embeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_chroma import Chroma
from langgraph.checkpoint.memory import InMemorySaver

# ========== Step 1: 构建知识库索引 ==========

loader = DirectoryLoader(
    "knowledge_base/",
    glob="**/*.md",
    loader_cls=TextLoader,
    loader_kwargs={"encoding": "utf-8"},
)
documents = loader.load()

splitter = RecursiveCharacterTextSplitter(
    chunk_size=600,
    chunk_overlap=100,
    separators=["\n\n", "\n", "。", " ", ""],
)
chunks = splitter.split_documents(documents)

embeddings = init_embeddings("openai:text-embedding-3-small")
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    collection_name="project_docs",
    persist_directory="./chroma_db",
)

print(f"索引完成: {len(documents)} 个文档 → {len(chunks)} 个片段")

# ========== Step 2: 定义检索工具 ==========

retriever = vectorstore.as_retriever(
    search_type="mmr",
    search_kwargs={"k": 4, "fetch_k": 10},
)


@tool
def search_knowledge_base(query: str) -> str:
    """在项目知识库中搜索相关文档。当用户询问 API 用法、认证方式、
    接口说明、错误排查等与项目文档相关的问题时，使用此工具搜索答案。

    Args:
        query: 搜索关键词或问题描述
    """
    docs = retriever.invoke(query)
    if not docs:
        return "未在知识库中找到相关文档。"
    results = []
    for i, doc in enumerate(docs, 1):
        source = doc.metadata.get("source", "未知")
        results.append(f"[文档 {i} | 来源: {source}]\n{doc.page_content}")
    return "\n\n---\n\n".join(results)


# ========== Step 3: 构建 Agent ==========

agent = create_agent(
    model="anthropic:claude-sonnet-4-5-20250929",
    tools=[search_knowledge_base],
    prompt="""你是一个项目文档助手。回答问题时：
1. 先用 search_knowledge_base 搜索相关文档
2. 严格基于检索到的内容回答，不编造信息
3. 回答时标注信息来源
4. 文档中没有的信息如实告知""",
    checkpointer=InMemorySaver(),
)

# ========== Step 4: 交互式问答 ==========

config = {"configurable": {"thread_id": "session-1"}}


def chat(question: str) -> str:
    result = agent.invoke(
        {"messages": [{"role": "user", "content": question}]},
        config,
    )
    return result["messages"][-1].content


# 测试
print(chat("系统的认证方式是什么？"))
print(chat("Token 过期了怎么办？"))
print(chat("有哪些 API 接口？"))
```

## 生产环境注意事项

### 持久化存储

生产环境中应使用数据库作为 Checkpointer，而非内存：

```python
# 使用 PostgreSQL 持久化对话历史
from langgraph.checkpoint.postgres import PostgresSaver

checkpointer = PostgresSaver.from_conn_string(
    "postgresql://user:pass@localhost:5432/mydb"
)
```

### 并发与性能

- 向量库应部署为独立服务（如 Pinecone、Milvus），避免嵌入式数据库成为瓶颈
- Embedding 请求可使用批量接口减少 API 调用次数
- 对于高并发场景，考虑在检索层添加缓存

### 安全考量

- 工具的 docstring 会影响 LLM 的行为，避免在其中包含敏感信息
- 对用户输入进行基本的注入检测，防止 Prompt Injection
- 检索结果中可能包含敏感数据，需配合权限系统过滤

## 下一步

- [SQL Agent 实战](/ai/langchain/guide/tutorial-sql-agent) -- 构建能用自然语言查询数据库的 Agent
- [语义搜索实战](/ai/langchain/guide/tutorial-semantic-search) -- 深入语义搜索引擎的构建细节
- [安全护栏 Guardrails](/ai/langchain/guide/guardrails) -- 为 Agent 添加输入输出安全检查
- [流式响应 Streaming](/ai/langchain/guide/streaming) -- 实时展示 Agent 的推理过程

## 参考资源

- [LangChain RAG 教程](https://python.langchain.com/docs/tutorials/rag/)
- [LangChain Agents 文档](https://python.langchain.com/docs/concepts/agents/)
- [LangGraph Persistence 文档](https://langchain-ai.github.io/langgraph/concepts/persistence/)
- [Chroma 官方文档](https://docs.trychroma.com/)

# Research: LlamaIndex 学习路线图

**Feature Branch**: `002-llamaindex-tutorial`
**Research Date**: 2025-12-29
**Sources**: Context7 (LlamaIndex official docs), Tavily (latest API changes)

## 1. LlamaIndex 版本与 API 现状

### Decision: 基于 LlamaIndex 0.10.x+ 版本编写教程

**Rationale**:
- LlamaIndex 0.10 (2024年2月发布) 引入了重大架构变更，将核心包拆分为多个命名空间包
- 0.10+ 版本移除了 `ServiceContext`，改用直接模块导入或全局 Settings 对象
- 当前最新稳定版本为 0.14.x，API 已趋于稳定
- 社区文档和示例主要基于 0.10+ 版本

**Alternatives Considered**:
- 基于 0.9.x 旧版本：已不推荐，大量 API 已废弃
- 仅支持最新版本：可能导致教程快速过时

**Key Breaking Changes (0.10+)**:
```python
# 旧版本 (0.9.x)
from llama_index import ServiceContext, VectorStoreIndex

# 新版本 (0.10+)
from llama_index.core import VectorStoreIndex, Settings
from llama_index.llms.openai import OpenAI
```

## 2. 核心组件与 API 结构

### Decision: 教程章节按 LlamaIndex 核心模块组织

**核心模块映射**:

| 模块 | 导入路径 | 教程章节 |
|------|----------|----------|
| 数据加载 | `llama_index.core.SimpleDirectoryReader` | Data Connectors |
| 向量索引 | `llama_index.core.VectorStoreIndex` | Index 构建 |
| 查询引擎 | `index.as_query_engine()` | Query Engine |
| ReAct Agent | `llama_index.core.agent.workflow.ReActAgent` | Agent 模式 |

**Rationale**:
- 与 LlamaIndex 官方文档结构保持一致，便于读者深入学习
- 模块化设计便于增量开发和独立测试

## 3. 数据加载器 (Data Connectors)

### Decision: 以 SimpleDirectoryReader 为核心，覆盖常用文件格式

**核心 API**:
```python
from llama_index.core import SimpleDirectoryReader

# 基础用法
documents = SimpleDirectoryReader("./data/").load_data()

# 指定文件类型
reader = SimpleDirectoryReader(
    input_dir="./data",
    required_exts=[".pdf", ".md"],
    recursive=True,
)

# 自定义文件解析器
reader = SimpleDirectoryReader(
    input_dir="./data",
    file_extractor={".pdf": PDFReader(), ".doc": LegacyOfficeReader()},
)
```

**教程覆盖范围**:
1. PDF 文档加载 (默认支持)
2. Markdown 文件加载
3. 自定义文件解析器扩展
4. 远程文件系统 (S3) 加载

**Rationale**:
- SimpleDirectoryReader 是最常用的数据加载入口
- 覆盖 PDF 和 Markdown 满足 80% 的使用场景

## 4. 索引构建 (Index)

### Decision: 以 VectorStoreIndex 为主，介绍 SummaryIndex 作为补充

**核心 API**:
```python
from llama_index.core import VectorStoreIndex, SummaryIndex

# 从文档创建向量索引
index = VectorStoreIndex.from_documents(documents)

# 从节点创建索引
index = VectorStoreIndex(nodes)

# 持久化索引
index.storage_context.persist(persist_dir="./storage")

# 加载已有索引
from llama_index.core import StorageContext, load_index_from_storage
storage_context = StorageContext.from_defaults(persist_dir="./storage")
index = load_index_from_storage(storage_context)
```

**Rationale**:
- VectorStoreIndex 是 RAG 应用的标准选择
- SummaryIndex 适用于需要全文总结的场景
- 持久化是生产环境的必需功能

## 5. 查询引擎 (Query Engine)

### Decision: 覆盖从基础到高级的查询配置

**核心 API**:
```python
# 基础查询引擎
query_engine = index.as_query_engine()

# 配置检索参数
query_engine = index.as_query_engine(
    similarity_top_k=5,
    response_mode="tree_summarize",
)

# 添加后处理器 (重排序)
query_engine = index.as_query_engine(
    similarity_top_k=10,
    node_postprocessors=[reranker],
)

# 执行查询
response = query_engine.query("你的问题")
```

**教程覆盖范围**:
1. 基础查询配置 (similarity_top_k, response_mode)
2. 重排序后处理器
3. 多模态查询引擎
4. 流式响应

## 6. Agent 模式

### Decision: 以 ReActAgent 为核心，展示工具调用和多步推理

**核心 API**:
```python
from llama_index.core.agent.workflow import ReActAgent
from llama_index.core.tools import FunctionTool, QueryEngineTool
from llama_index.core.workflow import Context

# 定义函数工具
def multiply(x: int, y: int) -> int:
    """Multiply two numbers."""
    return x * y

tools = [FunctionTool.from_defaults(multiply)]

# 创建 ReAct Agent
agent = ReActAgent(
    tools=tools,
    llm=OpenAI(model="gpt-4o-mini"),
    verbose=True,
)

# 执行 Agent
ctx = Context(agent)
handler = agent.run("What is 20 * 4?", ctx=ctx)
response = await handler
```

**教程覆盖范围**:
1. FunctionTool 自定义工具
2. QueryEngineTool RAG 工具
3. ReAct 推理循环
4. 流式事件处理

## 7. LLM 后端配置

### Decision: 默认使用 OpenAI，提供本地模型替代方案

**OpenAI 配置**:
```python
from llama_index.llms.openai import OpenAI
from llama_index.core import Settings

Settings.llm = OpenAI(model="gpt-4o-mini")
```

**本地模型替代 (Ollama)**:
```python
from llama_index.llms.ollama import Ollama

Settings.llm = Ollama(model="llama3.2", request_timeout=120.0)
```

**Rationale**:
- OpenAI 是最广泛使用的 LLM 后端
- Ollama 提供免费的本地模型方案，适合网络受限用户

## 8. 目录结构设计

### Decision: 遵循现有 LangChain 教程结构

**建议目录结构**:
```
docs/ai/llamaindex/
├── index.md                    # 首页 (hero layout)
├── guide/
│   ├── getting-started.md      # 环境搭建
│   ├── rag-basics.md           # RAG 基础概念
│   ├── data-connectors.md      # 数据加载器
│   ├── index-building.md       # 索引构建
│   ├── query-engine.md         # 查询引擎
│   ├── agent-basics.md         # Agent 基础
│   ├── agent-advanced.md       # Agent 进阶
│   └── production.md           # 生产部署
```

**Rationale**:
- 与现有 `/ai/langchain/` 结构保持一致
- 章节顺序遵循学习曲线：概念 → 实践 → 进阶

## 9. 依赖包清单

### Decision: 提供最小化和完整两种依赖配置

**最小依赖 (入门)**:
```
llama-index-core>=0.10.0
llama-index-llms-openai>=0.1.0
llama-index-embeddings-openai>=0.1.0
```

**完整依赖 (生产)**:
```
llama-index>=0.10.0
llama-index-llms-openai>=0.1.0
llama-index-llms-ollama>=0.1.0
llama-index-embeddings-openai>=0.1.0
llama-index-embeddings-huggingface>=0.1.0
llama-index-vector-stores-chroma>=0.1.0
llama-index-readers-file>=0.1.0
```

## 10. VitePress 集成方案

### Decision: 通过添加新配置项集成到侧边栏

**需要更新的文件**:
1. `docs/.vitepress/config.mts` - 添加 LlamaIndex 侧边栏配置
2. `docs/ai/index.md` - 添加 LlamaIndex 入口链接

**侧边栏配置示例**:
```typescript
'/ai/llamaindex/': [
  {
    text: '基础',
    items: [
      { text: '环境搭建', link: '/ai/llamaindex/guide/getting-started' },
      { text: 'RAG 基础', link: '/ai/llamaindex/guide/rag-basics' },
      { text: '数据加载', link: '/ai/llamaindex/guide/data-connectors' },
      { text: '索引构建', link: '/ai/llamaindex/guide/index-building' },
    ],
  },
  {
    text: '进阶',
    items: [
      { text: '查询引擎', link: '/ai/llamaindex/guide/query-engine' },
      { text: 'Agent 基础', link: '/ai/llamaindex/guide/agent-basics' },
      { text: 'Agent 进阶', link: '/ai/llamaindex/guide/agent-advanced' },
    ],
  },
  {
    text: '生产',
    items: [
      { text: '部署与优化', link: '/ai/llamaindex/guide/production' },
    ],
  },
],
```

**Rationale**:
- 遵循宪法 VI 增量式开发约束，仅添加新配置项
- 结构与现有 LangChain 侧边栏保持一致

## 11. 比喻化解释标准

### Decision: 为每个核心概念准备标准化类比

| 概念 | 类比 |
|------|------|
| RAG | "考试前查阅笔记再作答" |
| Embedding | "将文字转化为计算机能理解的坐标位置" |
| Vector Store | "图书馆的索引卡片系统" |
| Query Engine | "智能问答助手" |
| Retriever | "图书管理员帮你找书" |
| Index | "书籍的目录页" |
| Agent | "能自主思考和行动的 AI 助手" |
| ReAct | "思考-行动-观察的循环" |

## 12. 避坑指南重点

### Decision: 基于社区 FAQ 整理常见问题

**环境搭建阶段**:
1. Python 版本不兼容 (需要 3.8+)
2. 依赖冲突 (pip vs poetry vs uv)
3. API Key 配置错误

**数据加载阶段**:
1. 文件编码问题 (UTF-8)
2. PDF 解析失败 (需要额外依赖)
3. 大文件内存溢出

**索引构建阶段**:
1. Embedding 模型下载失败 (网络问题)
2. 向量维度不匹配
3. 持久化路径权限问题

**查询引擎阶段**:
1. 回答不相关 (top_k 过小)
2. 上下文过长 (chunk_size 不合理)
3. 响应超时 (LLM API 问题)

**Agent 阶段**:
1. 工具调用失败 (参数类型错误)
2. 无限循环 (退出条件缺失)
3. Token 超限 (上下文过长)

---

## Summary

本研究确认了 LlamaIndex 教程的技术方案：

1. **版本**: 基于 0.10.x+ 版本，兼容最新 0.14.x
2. **结构**: 8 个核心章节，遵循学习曲线
3. **API**: 使用最新稳定 API，避免废弃调用
4. **集成**: 增量式添加到 VitePress 配置
5. **比喻**: 12 个核心概念的标准化类比
6. **避坑**: 5 个阶段的常见问题覆盖

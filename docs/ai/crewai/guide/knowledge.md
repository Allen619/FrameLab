---
title: Knowledge 知识库
description: 知识库概念、知识源配置、Agent 与 Crew 级别绑定、Embedder 配置
---

# Knowledge 知识库

> Knowledge 让你为 Agent 注入**领域专属知识**——文档、文本或文件目录，Agent 在执行任务时自动检索相关内容。

## 1. 知识库是什么

Knowledge 和 Memory 的区别：

| 维度 | Memory | Knowledge |
|------|--------|-----------|
| **内容来源** | Agent 执行中自动生成 | 开发者预先提供 |
| **更新方式** | 运行时自动积累 | 部署前手动配置 |
| **用途** | 记住执行经验 | 提供领域知识 |
| **类比** | 工作笔记 | 参考资料库 |

> **前端类比**：Knowledge 类似 Next.js 中的静态数据文件（`data/` 目录下的 JSON/MDX）——在构建时准备好，运行时按需读取。

## 2. 知识源类型

| 类型 | 说明 | 支持格式 |
|------|------|----------|
| 文本 | 直接传入文本字符串 | 纯文本 |
| 文件 | 指定文件路径 | `.txt`, `.pdf`, `.md`, `.csv` 等 |
| 目录 | 指定目录路径 | 递归加载目录下所有文件 |

## 3. Crew 级别知识

```python
from crewai import Crew, Agent, Task
from crewai.knowledge.source.text_knowledge_source import TextKnowledgeSource
from crewai.knowledge.source.pdf_knowledge_source import PDFKnowledgeSource

# 文本知识源
company_info = TextKnowledgeSource(
    content="我们公司成立于 2020 年，专注于 AI Agent 技术研发..."
)

# PDF 知识源
product_docs = PDFKnowledgeSource(
    file_paths=["./knowledge/product-manual.pdf"]
)

crew = Crew(
    agents=[support_agent],
    tasks=[support_task],
    knowledge_sources=[company_info, product_docs],
    embedder={
        "provider": "openai",
        "config": {"model": "text-embedding-3-small"}
    }
)
```

## 4. Agent 级别知识

```python
from crewai import Agent
from crewai.knowledge.source.text_knowledge_source import TextKnowledgeSource

domain_knowledge = TextKnowledgeSource(
    content="Python 3.12 新特性包括：改进的错误消息、f-string 增强..."
)

python_expert = Agent(
    role="Python 专家",
    goal="回答 Python 相关问题",
    backstory="资深 Python 开发者",
    knowledge_sources=[domain_knowledge]
)
```

## 5. 使用项目知识目录

CrewAI 项目默认包含 `knowledge/` 目录：

```
my_project/
├── knowledge/          # 知识库文件放这里
│   ├── product.md
│   ├── faq.txt
│   └── manual.pdf
└── src/
    └── my_project/
        └── crew.py
```

```python
from crewai.knowledge.source.crew_docling_source import CrewDoclingSource

# 加载 knowledge/ 目录下所有文件
knowledge = CrewDoclingSource(
    file_paths=["knowledge/product.md", "knowledge/faq.txt"]
)
```

## 6. Embedder 配置

知识库需要 Embedder 将文本转换为向量进行语义搜索：

```python
crew = Crew(
    agents=[agent],
    tasks=[task],
    knowledge_sources=[knowledge],
    embedder={
        "provider": "openai",
        "config": {
            "model": "text-embedding-3-small"
        }
    }
)
```

与 Memory 使用相同的 Embedder 配置，支持 OpenAI、Google、Cohere、Ollama 等提供商。

## 7. 最佳实践

- **结构化知识**：将大文档拆分为小主题文件，提高检索精度
- **定期更新**：知识源内容变化时需重新部署
- **控制规模**：知识库过大会影响检索速度和 Token 消耗
- **配合 Memory**：Knowledge 提供静态知识，Memory 提供动态经验，两者互补

---

**先修**：[Memory 记忆系统](/ai/crewai/guide/memory)

**下一步**：
- [Collaboration 协作与委托](/ai/crewai/guide/collaboration) — Agent 间的协作机制
- [Planning & Reasoning](/ai/crewai/guide/planning-reasoning) — 规划与推理能力

**参考**：
- [🔗 CrewAI Knowledge (Official)](https://docs.crewai.com/en/concepts/knowledge){target="_blank" rel="noopener"}

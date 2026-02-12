# RAG 增强 (查询分解与重写)

Retrieval-Augmented Generation (RAG) 是构建私有知识库应用的核心技术。传统的 RAG 通常直接检索用户查询，但用户查询往往是不完整的、模糊的或多义的。Instructor 可以通过**查询分解 (Query Decomposition)** 和**查询重写 (Query Rewriting)** 来显著提升检索质量。

## 场景分析

**用户查询**：_"How does the Transformer architecture differ from RNNs in terms of parallelization?"_

**挑战**：

- 直接检索可能找不到同时包含 "Transformer" 和 "RNN" 的文档片段。
- 需要分别检索 Transformer 的并行化机制和 RNN 的序列处理机制，然后综合回答。

## 解决方案：Query Decomposition

我们可以让 LLM 将复杂查询分解为多个独立的子查询 (Sub-queries)，然后针对每个子查询进行检索。

### 1. 定义数据结构

```python
from typing import List
from pydantic import BaseModel, Field

class SubQuery(BaseModel):
    query: str = Field(..., description="A specific question to retrieve information for")
    source: str = Field(..., description="Target source type if applicable (e.g., 'wikipedia', 'documentation')")

class DecomposedQueries(BaseModel):
    original_query: str
    sub_queries: List[SubQuery] = Field(..., description="List of sub-queries needed to answer the original query")
```

### 2. 执行分解

```python
import instructor
from openai import OpenAI

client = instructor.from_openai(OpenAI())

original_query = "Compare the parallelization capabilities of Transformer and RNN architectures."

response = client.chat.completions.create(
    model="gpt-4o",
    response_model=DecomposedQueries,
    messages=[
        {
            "role": "system",
            "content": "You are a helpful assistant that decomposes complex questions into simpler sub-questions for retrieval."
        },
        {"role": "user", "content": original_query}
    ]
)

for q in response.sub_queries:
    print(f"- {q.query} ({q.source})")

# Output:
# - How does the Transformer architecture handle parallel processing? (documentation)
# - How does Recurrent Neural Network (RNN) process sequences? (documentation)
# - What are the limitations of RNN regarding parallelization? (documentation)
```

### 3. 后续步骤 (Retreival & Synthesis)

获得子查询后，你可以：

1.  **并行检索**：对每个 `sub_query` 调用你的向量数据库检索函数。
2.  **上下文合并**：将检索到的文档片段合并。
3.  **最终回答**：将合并后的上下文和原始查询发给 LLM 生成最终答案。

## 场景：查询重写 (Query Rewriting)

有时用户的查询非常口语化，缺乏关键词。我们可以让 LLM 生成更适合检索的专业查询。

```python
class SearchQuery(BaseModel):
    optimized_query: str = Field(..., description="Optimized search query with keywords")
    keywords: List[str] = Field(..., description="List of key terms")

user_input = "Why is my python code running so slow with loops?"

rewrite = client.chat.completions.create(
    response_model=SearchQuery,
    messages=[
        {"role": "user", "content": f"Optimize for search engine: {user_input}"}
    ]
)

print(rewrite.optimized_query)
#> "Python loop performance optimization vectorization"
print(rewrite.keywords)
#> ["python", "performance", "loops", "optimization", "vectorization"]
```

通过这种方式，我们可以利用 Instructor 将非结构化的用户意图转化为精确的检索指令，从而构建更智能的 RAG 系统。

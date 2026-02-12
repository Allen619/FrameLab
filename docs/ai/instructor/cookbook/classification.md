# ⭐ 文本分类 (单标签/多标签)

文本分类是 NLP 中最常见的任务之一。Instructor 允许你使用 Python 的 `Literal` 类型，轻松实现结构化的分类任务。

## 单标签分类 (Single-Label)

**场景**：将一段文本分类为预定义的几个类别之一（互斥）。

### 代码实现

使用 `Literal` 定义类别。

```python
import instructor
from openai import OpenAI
from pydantic import BaseModel
from typing import Literal

client = instructor.from_openai(OpenAI())

class Classification(BaseModel):
    category: Literal["spam", "not_spam", "urgent"]
    confidence: float # 可选：让模型输出置信度

def classify(text: str):
    return client.chat.completions.create(
        model="gpt-3.5-turbo",
        response_model=Classification,
        messages=[
            {"role": "user", "content": f"Classify this email: {text}"}
        ]
    )

print(classify("Win a free iPhone now!").category)
#> spam
print(classify("Can you send me the report by 5pm?").category)
#> urgent
```

## 多标签分类 (Multi-Label)

**场景**：一段文本可能属于多个类别（非互斥）。例如，客服工单既可以是 "Billing" 问题，也可以是 "Urgent" 问题。

### 代码实现

使用 `List[Literal]` 定义多标签。

```python
from typing import List

class MultiLabelClassification(BaseModel):
    tags: List[Literal["billing", "technical", "ui_ux", "urgent"]]

def classify_multi(text: str):
    return client.chat.completions.create(
        model="gpt-3.5-turbo",
        response_model=MultiLabelClassification,
        messages=[
            {"role": "user", "content": f"Tag this ticket: {text}"}
        ]
    )

ticket = "I was charged twice for my subscription and I need a refund immediately!"
print(classify_multi(ticket).tags)
#> ['billing', 'urgent']
```

## 带有思维链 (Chain of Thought) 的分类

为了提高准确率，特别是对于复杂的分类任务，可以让模型先输出推理过程（Chain of Thought），再输出最终标签。

```python
from pydantic import Field

class CoTClassification(BaseModel):
    reasoning: str = Field(..., description="Explain why you chose this category")
    category: Literal["positive", "negative", "neutral"]

result = client.chat.completions.create(
    response_model=CoTClassification,
    messages=[
        {"role": "user", "content": "Analyze sentiment: The movie was visually stunning but the plot was weak."}
    ]
)

print(result.reasoning)
#> "The reviewer praises the visuals ('visually stunning') but criticizes the plot ('plot was weak'). Since the criticism is significant, the overall sentiment leans towards mixed or neutral, but given the options, 'neutral' fits best as it balances positive and negative aspects."
print(result.category)
#> neutral
```

::: tip 生产建议
对于需要高准确率的分类任务，始终推荐使用 **CoT (Chain of Thought)** 模式。虽然会消耗更多 Token，但在处理模糊边界的分类时效果显著提升。
:::

# Instructor 简介

Instructor 是一个基于 Pydantic 的库，旨在简化从 LLM 获取结构化输出的过程。

## 为什么选择 Instructor？

在传统的 LLM 开发中，我们通常需要手动解析 JSON 字符串，这不仅容易出错，而且缺乏类型安全。Instructor 通过与 Pydantic 的深度集成，解决了这个问题。

### 传统 API vs Instructor

::: code-group

```python [Vanilla API]
import openai
import json

client = openai.OpenAI()
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": "Extract: John is 30"}],
)
# 需要手动解析 JSON，容易出错
data = json.loads(response.choices[0].message.content)
print(data["name"])  # 没有任何类型提示
```

```python [Instructor]
import instructor
from openai import OpenAI
from pydantic import BaseModel

class User(BaseModel):
    name: str
    age: int

# Patch the client
client = instructor.from_openai(OpenAI())

# 直接返回 User 对象，拥有完整的类型提示
user = client.chat.completions.create(
    model="gpt-3.5-turbo",
    response_model=User,
    messages=[{"role": "user", "content": "Extract: John is 30"}],
)

print(user.name)  # IDE 会自动补全
```

:::

## 核心特性

- **类型安全**：基于 Pydantic，提供完整的 IDE 自动补全和类型检查。
- **自动验证**：利用 LLM 的重试机制，自动修正格式错误的输出。
- **多模型支持**：支持 OpenAI, Anthropic, Gemini 等多种模型。
- **灵活性**：可以随时切换回原始 API，无缝集成到现有项目。

## 适用场景

- 数据提取（从文本中提取结构化数据）
- 实体识别
- 文本分类
- 增强 RAG（生成结构化查询）

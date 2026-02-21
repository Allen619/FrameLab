# ⭐ Partial Streaming (部分流式传输)

在构建 LLM 应用时，用户体验（UX）至关重要。传统的请求-响应模式会导致用户在等待复杂 JSON 结构生成时面临长时间的空白。**Partial Streaming** 允许你在结构化数据完全生成之前，实时获取并展示已有的部分数据。

## 核心概念

Instructor 引入了 `Partial[T]` 类型，它将 Pydantic 模型的所有字段标记为可选（Optional）。这意味着你可以处理尚未完全填充的对象。

[🔗 Instructor Partial Streaming 官方文档](https://python.useinstructor.com/concepts/partial/){target="_blank" rel="noopener"}

### 为什么需要 `Partial`？

假设你有一个包含多个字段的 `User` 模型。LLM 是逐个 token 生成 JSON 的。

1.  `{`
2.  `"name": "J"`
3.  `"name": "Jason"`
4.  `"name": "Jason", "age": 25`
5.  `"name": "Jason", "age": 25}`

如果你使用标准的 `User` 模型，只有最后一步生成的完整 JSON 才能通过验证。而使用 `Partial[User]`，每一步生成的中间状态都是合法的，可以立即推送给前端。

## 代码实现

### 基础用法

```python
import instructor
from openai import OpenAI
from pydantic import BaseModel
from typing import List

# 1. 定义模型
class User(BaseModel):
    name: str
    bio: str
    skills: List[str]

# 2. 初始化客户端
client = instructor.from_openai(OpenAI())

# 3. 使用 instructor.Partial[T] 请求流式数据
response_stream = client.chat.completions.create(
    model="gpt-4o",
    response_model=instructor.Partial[User],  # 关键：使用 Partial 包装
    messages=[
        {"role": "user", "content": "Create a user profile for a Python expert named Jason."}
    ],
    stream=True,  # 关键：启用流式传输
)

# 4. 迭代流
print("Streaming response:")
for partial_user in response_stream:
    # partial_user 是 User 的实例，但所有字段都可能是 None 或部分填充
    print(f"\033[H\033[J{partial_user.model_dump_json(indent=2)}") # 清屏并打印
```

### 嵌套结构支持

Partial Streaming 对嵌套结构同样有效，这对于生成复杂报告非常有用。

```python
class Address(BaseModel):
    city: str
    street: str

class UserProfile(BaseModel):
    username: str
    address: Address

stream = client.chat.completions.create(
    response_model=instructor.Partial[UserProfile],
    ...,
    stream=True
)

for chunk in stream:
    # chunk.address 也会随着流式传输逐步填充
    if chunk.address:
        print(f"City: {chunk.address.city}")
```

## 前端集成建议

在实际的全栈应用中，后端通常通过 **Server-Sent Events (SSE)** 或 **WebSocket** 将这些 partial chunk 推送给前端。

1.  **后端 (Python/FastAPI)**: 迭代 `instructor` 的流，将每个 chunk 序列化并通过 SSE 发送。
2.  **前端 (React/Vue)**: 接收 SSE 消息，直接更新状态对象。由于 Instructor 保证了每个 chunk 都是合法的（尽管是部分的）对象结构，前端可以直接 merge 或 replace 现有状态，轻松实现 "打字机" 效果。

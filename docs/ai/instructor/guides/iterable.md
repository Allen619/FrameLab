# 处理列表 (Iterable DSL)

在处理大量数据时，等待整个列表生成完毕不仅延迟高，而且可能受限于上下文窗口（Context Window）。Instructor 提供了强大的 `iterable()` DSL，让你能够**流式迭代**数组中的元素。

## 场景分析

**任务**：让 AI 生成一份包含 10 个用户画像的列表。

**痛点**：

- **延迟高**：你需要等 LLM 生成完所有 10 个用户，才能拿到第 1 个。
- **内存消耗**：如果列表很大，一次性加载所有 JSON 对象可能不可行。

## 解决方案：`iterable()`

通过将 Pydantic 字段标记为 `iterable()`，Instructor 会启用流式处理模式。

### 基础用法

```python
import instructor
from openai import OpenAI
from pydantic import BaseModel
from typing import List
from instructor.dsl import iterable

class User(BaseModel):
    name: str
    age: int

# 注意：使用 PeopleList 作为响应模型，其中 people 字段使用 iterable()
class PeopleList(BaseModel):
    people: List[User] = iterable()

client = instructor.from_openai(OpenAI())

# 发送流式请求
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    response_model=PeopleList,
    messages=[
        {"role": "user", "content": "Create 10 fictional users with diverse backgrounds."}
    ],
    stream=True  # 必须启用流式传输
)

# 迭代器模式：直接遍历 response.people
print("Streaming individual users:")
for user in response.people:
    # 每次迭代返回一个完全填充的 User 对象
    print(f"Received user: {user.name} ({user.age})")
```

### 关键特性

1.  **Item-Level Streaming**: 你可以立即处理第一个生成的 `User`，而不需要等待后续的 `User` 生成完毕。
2.  **完整对象保证**: 与 `Partial[T]` 不同，这里每次 `yield` 的是一个**完整的** `User` 对象。`iterable()` 会在收集到足以构建一个完整 `User` 的 JSON 片段后才 yield 出来。

## 高级技巧：自定义停止条件

由于是流式迭代，你可以在满足特定条件时主动停止生成，从而节省 token。

```python
count = 0
for user in response.people:
    process_user(user)
    count += 1
    if count >= 5:
        # 我们可以主动关闭流，虽然这在 client 端无法强制 LLM 停止生成，
        # 但可以停止接收后续数据。
        response.stream.close()
        break
```

::: warning 注意事项
`iterable()` 仅适用于顶层字段是列表的情况。如果你需要从嵌套结构中流式提取列表，可能需要结合 `Partial` 或重新设计你的 Prompt。
:::

# ⭐ 快速开始

本指南将带你快速上手 Instructor，完成你的第一个结构化数据提取。

[🔗 Instructor 官方文档](https://python.useinstructor.com/){target="_blank" rel="noopener"}

## 安装

首先，你需要安装 `instructor` 和 `pydantic`。

::: code-group

```bash [npm]
# 前端开发者习惯：npm install instructor pydantic
# 对应 Python 命令：
pip install instructor pydantic
```

:::

## 你的第一个结构化响应

我们将定义一个简单的用户模型，并让 AI 从文本中提取信息。

```python
import instructor
from openai import OpenAI
from pydantic import BaseModel

# 1. 定义数据结构 (类似于 TypeScript interface)
class User(BaseModel):
    name: str
    age: int

# 2. Patch OpenAI 客户端
client = instructor.from_openai(OpenAI())

# 3. 发送请求并指定返回模型
user = client.chat.completions.create(
    model="gpt-3.5-turbo",
    response_model=User,
    messages=[
        {"role": "user", "content": "Extract: Jason is 25 years old"},
    ],
)

# 4. 直接使用对象 (拥有类型提示)
print(user.name)
#> Jason
print(user.age)
#> 25
```

## 错误处理与重试

Instructor 的强大之处在于它可以自动处理验证错误。如果 LLM 返回的格式不正确，Instructor 会自动将错误信息反馈给 LLM 并要求重试。

```python
from pydantic import BaseModel, Field, ValidationError

class User(BaseModel):
    name: str = Field(..., description="The name of the user")
    age: int = Field(..., gt=0, description="The age of the user (must be positive)")

try:
    user = client.chat.completions.create(
        model="gpt-3.5-turbo",
        response_model=User,
        messages=[
            {"role": "user", "content": "Extract: Jason is -5 years old"}, # 故意给出错误数据
        ],
        max_retries=3, # 设置最大重试次数
    )
    print(user)
except ValidationError as e:
    print(f"Failed to extract valid user: {e}")
```

在这个例子中，如果 LLM 最初提取了 `-5`，Pydantic 会抛出验证错误。Instructor 会捕获这个错误，并将它作为新的 prompt 发送给 LLM，提示它修正错误。

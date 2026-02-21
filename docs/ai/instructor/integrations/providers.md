# ⭐ 主流模型集成 (Anthropic, Gemini)

Instructor 不仅仅局限于 OpenAI。它支持所有主流的模型提供商，提供了统一的接口风格。

[🔗 Instructor 集成文档](https://python.useinstructor.com/integrations/){target="_blank" rel="noopener"}

## Anthropic (Claude)

要使用 Claude 模型（如 Claude 3 Opus, Sonnet, Haiku），你需要安装 `instructor[anthropic]`。

### 安装

```bash
pip install instructor[anthropic]
```

### 基础用法

Instructor 提供了 `from_anthropic` 辅助函数来 Patch `Anthropic` 客户端。

```python
import instructor
from anthropic import Anthropic
from pydantic import BaseModel

class User(BaseModel):
    name: str
    age: int

# 1. 初始化并 Patch
client = instructor.from_anthropic(Anthropic())

# 2. 发送请求 (注意：使用的是 messages.create)
user = client.messages.create(
    model="claude-3-opus-20240229",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Extract: Jason is 30 years old"}
    ],
    response_model=User,
)

print(user.name)
#> Jason
```

### 高级配置 (Thinking Mode)

Claude 3.7 Sonnet 支持 Thinking Mode，可以结合 Instructor 使用。

```python
user = client.messages.create(
    model="claude-3-7-sonnet-20250219",
    max_tokens=20000,
    thinking={"type": "enabled", "budget_tokens": 16000},  # 开启思考模式
    messages=[...],
    response_model=User,
)
```

## Google Gemini (Vertex AI / AI Studio)

Instructor 支持通过 Google Generative AI SDK (`google-generativeai`) 或 Vertex AI SDK (`google-cloud-aiplatform`) 调用 Gemini 模型。

### 安装

```bash
pip install instructor[google-generativeai]
# 或者
pip install instructor[vertexai]
```

### 使用 AI Studio (免费/付费 API)

```python
import instructor
import google.generativeai as genai
from pydantic import BaseModel

# 配置 API Key
genai.configure(api_key="YOUR_API_KEY")

class User(BaseModel):
    name: str
    age: int

# Patch client
client = instructor.from_gemini(
    client=genai.GenerativeModel(
        model_name="models/gemini-1.5-pro-latest",  # 指定模型
    ),
    mode=instructor.Mode.GEMINI_JSON, # 使用 JSON Mode
)

# 调用
user = client.chat.completions.create(
    messages=[
        {"role": "user", "content": "Extract: Jason is 30 years old"}
    ],
    response_model=User,
)
```

### 使用 Vertex AI (企业级)

```python
import instructor
from vertexai.generative_models import GenerativeModel
import vertexai

vertexai.init(project="your-project-id", location="us-central1")

client = instructor.from_vertexai(
    client=GenerativeModel("gemini-1.5-pro-preview-0409"),
    mode=instructor.Mode.VERTEXAI_TOOLS,
)
```

## Groq (极速推理)

Groq 兼容 OpenAI API 格式，因此可以直接使用 `from_openai`，只需修改 `base_url`。

```python
import instructor
from openai import OpenAI

client = instructor.from_openai(
    OpenAI(
        base_url="https://api.groq.com/openai/v1",
        api_key="your_groq_api_key",
    ),
    mode=instructor.Mode.JSON,
)

user = client.chat.completions.create(
    model="llama3-70b-8192",
    messages=[...],
    response_model=User,
)
```

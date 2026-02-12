# 本地模型 (Ollama/LlamaCpp)

使用本地模型运行 Instructor 可以极大地降低成本，并提升数据隐私安全。Ollama 是最简单的本地模型运行方式。

## Ollama

Ollama 提供了与 OpenAI 兼容的 API 接口，这使得它与 Instructor 的集成非常简单。

### 安装

1.  下载并安装 Ollama (https://ollama.com/)
2.  运行一个模型 (如 Llama 3)
    ```bash
    ollama pull llama3
    ollama run llama3
    ```

### 代码集成

只需将 `base_url` 指向 Ollama 的默认端口 `http://localhost:11434/v1`。

```python
import instructor
from openai import OpenAI
from pydantic import BaseModel

class User(BaseModel):
    name: str
    age: int

# 1. 初始化客户端
client = instructor.from_openai(
    OpenAI(
        base_url="http://localhost:11434/v1",
        api_key="ollama", # 任意字符串，Ollama 不需要 Key
    ),
    mode=instructor.Mode.JSON, # 推荐使用 JSON Mode
)

# 2. 调用 (指定 Ollama 中已下载的模型)
user = client.chat.completions.create(
    model="llama3",
    messages=[
        {"role": "user", "content": "Extract: Jason is 30 years old"},
    ],
    response_model=User,
)

print(user.name)
#> Jason
```

::: warning 性能提示
本地模型的推理速度取决于显存和 CPU。Llama 3 8B 在 16GB 内存的 Mac M1 上运行非常流畅。
:::

## LlamaCpp (Python Binding)

如果你需要更底层的控制，可以使用 `llama-cpp-python` 库。

### 安装

```bash
pip install llama-cpp-python instructor
```

### 代码集成

```python
from llama_cpp import Llama
from instructor import patch

# 1. 加载模型 (GGUF 格式)
llm = Llama(
    model_path="./models/llama-3-8b-instruct.Q4_K_M.gguf",
    n_ctx=2048,
    n_gpu_layers=-1, # 使用 GPU 加速
)

# 2. Patch create_chat_completion 方法
create = patch(
    create=llm.create_chat_completion,
    mode=instructor.Mode.JSON_SCHEMA, # 使用 JSON Schema 约束生成
)

# 3. 调用
user = create(
    messages=[
        {"role": "user", "content": "Extract: Jason is 30 years old"},
    ],
    response_model=User,
)

print(user.name)
#> Jason
```

::: tip 为什么选择 LlamaCpp？
LlamaCpp 支持 **Grammar Constraints** (语法约束)，它可以强制 LLM 严格按照 JSON Schema 生成输出，杜绝幻觉产生的非法 JSON。这比 Ollama 的 JSON Mode 更可靠。
:::

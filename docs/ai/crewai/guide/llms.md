---
title: LLMs 模型配置
description: 支持的 LLM 提供商列表、配置方式、本地模型（Ollama）与高级特性
---

# LLMs 模型配置

> CrewAI 通过原生 SDK 集成了 20+ 家 LLM 提供商，支持灵活的模型配置。

## 1. 支持的提供商

| 提供商 | 模型前缀 | 环境变量 | 代表模型 |
|--------|----------|----------|----------|
| **OpenAI** | `openai/` | `OPENAI_API_KEY` | gpt-4o, gpt-4.1, o4-mini |
| **Anthropic** | `anthropic/` | `ANTHROPIC_API_KEY` | claude-sonnet-4, claude-3-7-sonnet |
| **Google Gemini** | `gemini/` | `GOOGLE_API_KEY` | gemini-2.5-pro, gemini-2.5-flash |
| **Azure** | `azure/` | `AZURE_API_KEY` | Azure 上的 OpenAI 模型 |
| **AWS Bedrock** | `bedrock/` | `AWS_ACCESS_KEY_ID` | Bedrock 上的各模型 |
| **Meta Llama** | `meta_llama/` | `LLAMA_API_KEY` | Llama-4-Scout, Llama-3.3-70B |
| **Mistral** | `mistral/` | `MISTRAL_API_KEY` | Mistral Large |
| **Groq** | `groq/` | `GROQ_API_KEY` | Groq 上的开源模型 |
| **Ollama** | `ollama/` | — | 本地部署模型 |
| **Fireworks AI** | `fireworks_ai/` | `FIREWORKS_API_KEY` | 开源模型加速 |
| **Nvidia NIM** | `nvidia_nim/` | `NVIDIA_API_KEY` | Nvidia 模型 |
| **Hugging Face** | `huggingface/` | `HF_TOKEN` | 开源模型 |
| **Open Router** | `openrouter/` | `OPENROUTER_API_KEY` | 多模型聚合 |

## 2. 配置方式

### 2.1 环境变量（最简单）

```bash
# .env
OPENAI_API_KEY=sk-your-key
OPENAI_MODEL_NAME=gpt-4o  # 可选，默认 gpt-4
```

所有 Agent 默认使用此模型，无需额外配置。

### 2.2 YAML 配置

```yaml
# config/agents.yaml
researcher:
  role: 研究员
  goal: 搜集信息
  backstory: 资深研究员
  llm: openai/gpt-4o

analyst:
  role: 分析师
  goal: 分析数据
  backstory: 数据分析师
  llm: anthropic/claude-sonnet-4
```

### 2.3 代码配置（最灵活）

```python
from crewai import LLM, Agent

# 基础用法
agent = Agent(
    role="研究员",
    goal="搜集信息",
    backstory="资深研究员",
    llm="openai/gpt-4o"  # 字符串简写
)

# 高级配置
llm = LLM(
    model="openai/gpt-4o",
    temperature=0.7,
    max_tokens=4000,
    top_p=0.9,
    stream=True
)

agent = Agent(
    role="研究员",
    goal="搜集信息",
    backstory="资深研究员",
    llm=llm  # LLM 对象
)
```

### 2.4 LLM 配置参数

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `model` | 模型 ID（含前缀） | 必填 |
| `temperature` | 随机性（0.0-1.0） | 模型默认 |
| `max_tokens` | 最大输出 Token | 模型默认 |
| `top_p` | 核采样 | 模型默认 |
| `timeout` | 超时（秒） | — |
| `max_retries` | 最大重试次数 | — |
| `stream` | 流式输出 | `False` |
| `seed` | 随机种子（可复现） | — |

## 3. 不同 Agent 使用不同模型

```python
# 研究员用大模型（质量优先）
researcher = Agent(
    role="研究员",
    goal="深度研究",
    backstory="...",
    llm="openai/gpt-4o"
)

# 写作用快速模型（速度优先）
writer = Agent(
    role="作者",
    goal="撰写文章",
    backstory="...",
    llm="openai/gpt-4o-mini"
)

# 分析用 Claude（推理优先）
analyst = Agent(
    role="分析师",
    goal="数据分析",
    backstory="...",
    llm="anthropic/claude-sonnet-4"
)
```

## 4. 本地模型（Ollama）

```bash
# 1. 安装 Ollama (https://ollama.ai)
# 2. 拉取模型
ollama pull llama3.3

# 3. 启动 Ollama 服务（默认 http://localhost:11434）
ollama serve
```

```python
from crewai import LLM, Agent

llm = LLM(
    model="ollama/llama3.3",
    base_url="http://localhost:11434"
)

agent = Agent(
    role="助手",
    goal="回答问题",
    backstory="本地 AI 助手",
    llm=llm
)
```

## 5. 高级特性

### 5.1 结构化 LLM 调用

```python
from pydantic import BaseModel
from crewai import LLM

class PersonInfo(BaseModel):
    name: str
    age: int
    occupation: str

llm = LLM(model="openai/gpt-4o", response_format=PersonInfo)
result = llm.call("张三，28岁，软件工程师")
# PersonInfo(name='张三', age=28, occupation='软件工程师')
```

### 5.2 Anthropic Extended Thinking

```python
llm = LLM(
    model="anthropic/claude-sonnet-4",
    thinking={"type": "enabled", "budget_tokens": 5000},
    max_tokens=10000
)
```

### 5.3 异步调用

```python
result = await llm.acall("法国的首都是什么？")
```

---

**先修**：[Agents 智能体](/ai/crewai/guide/agents)

**下一步**：
- [Memory 记忆系统](/ai/crewai/guide/memory) — 让 Agent 具有记忆能力
- [Knowledge 知识库](/ai/crewai/guide/knowledge) — 为 Agent 注入领域知识

**参考**：
- [🔗 CrewAI LLMs (Official)](https://docs.crewai.com/en/concepts/llms){target="_blank" rel="noopener"}

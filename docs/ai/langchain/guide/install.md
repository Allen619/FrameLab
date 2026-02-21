---
title: 安装与配置
description: 搭建 LangChain 开发环境，安装核心包和 Provider 集成
---

# 安装与配置

## 概述

本章将指导你完成 LangChain 的环境搭建，包括核心包安装、Provider 集成包配置和环境变量设置。

::: tip 前端类比
安装 LangChain 的过程类似于搭建前端项目：`langchain` 是核心框架（类似 `react`），`langchain-anthropic` / `langchain-openai` 是 Provider 适配包（类似 `@tanstack/react-query` 对不同数据源的适配），API Key 配置类似 `.env` 中的环境变量管理。
:::

## 前置要求

- **Python**: 3.9 或更高版本
- **包管理器**: pip 或 uv（推荐 uv，速度快 10-100 倍）

```bash
# 检查 Python 版本
python --version  # 需要 >= 3.9
```

## 安装核心包

### 使用 pip

```bash
pip install -U langchain
```

### 使用 uv（推荐）

[uv](https://docs.astral.sh/uv/) 是新一代 Python 包管理器，安装速度显著优于 pip：

```bash
# 安装 uv（如果尚未安装）
pip install uv

# 使用 uv 安装 langchain
uv add langchain
```

## 安装 Provider 集成包

LangChain 本身不包含具体的模型实现，需要根据使用的 LLM Provider 安装对应的集成包：

| Provider | 安装命令 | 模型示例 |
|----------|----------|----------|
| **Anthropic** | `pip install langchain-anthropic` | claude-sonnet-4-5-20250929 |
| **OpenAI** | `pip install langchain-openai` | gpt-4o, gpt-4o-mini |
| **Google** | `pip install langchain-google-genai` | gemini-2.0-flash |

```bash
# 安装你需要的 Provider（以 Anthropic 为例）
pip install langchain-anthropic

# 也可以一次安装多个
pip install langchain-anthropic langchain-openai
```

## 配置 API Key

每个 Provider 需要配置对应的 API Key。推荐使用环境变量方式：

### 方式一：命令行设置（临时）

```bash
# Linux / macOS
export ANTHROPIC_API_KEY="your-api-key"
export OPENAI_API_KEY="your-api-key"

# Windows (PowerShell)
$env:ANTHROPIC_API_KEY="your-api-key"
```

### 方式二：.env 文件（推荐）

创建 `.env` 文件，配合 `python-dotenv` 使用：

```bash
# .env
ANTHROPIC_API_KEY=your-anthropic-key
OPENAI_API_KEY=your-openai-key
GOOGLE_API_KEY=your-google-key
```

```python
# 在代码中加载
from dotenv import load_dotenv
load_dotenv()
```

::: warning 安全提示
永远不要将 API Key 硬编码在代码中或提交到版本控制。将 `.env` 加入 `.gitignore`。
:::

## 验证安装

安装完成后，运行以下代码验证环境是否正确：

```python
# 验证核心包
import langchain
print(f"LangChain 版本: {langchain.__version__}")

# 验证核心导入
from langchain.agents import create_agent
from langchain.tools import tool
from langchain.chat_models import init_chat_model
print("核心组件导入成功!")

# 验证 Provider 包（以 Anthropic 为例）
from langchain_anthropic import ChatAnthropic
print("Anthropic Provider 导入成功!")
```

### 验证模型连接

```python
from langchain.chat_models import init_chat_model

# 初始化模型（确保已设置 API Key）
model = init_chat_model("anthropic:claude-sonnet-4-5-20250929")

# 测试调用
response = model.invoke("你好，请用一句话介绍自己")
print(response.content)
```

## 导入命名空间

LangChain 提供清晰的导入路径：

```python
# Agent 创建
from langchain.agents import create_agent

# 工具定义
from langchain.tools import tool

# 模型初始化
from langchain.chat_models import init_chat_model
from langchain.embeddings import init_embeddings

# 消息类型
from langchain_core.messages import (
    AIMessage,
    HumanMessage,
    SystemMessage,
    ToolMessage,
)

# 中间件
from langchain.agents.middleware import (
    PIIMiddleware,
    SummarizationMiddleware,
    HumanInTheLoopMiddleware,
)
```

## 可选依赖

根据项目需求，可能还需要安装以下依赖：

```bash
# 结构化输出（通常已随 langchain 安装）
pip install pydantic

# 环境变量管理
pip install python-dotenv

# Web 服务部署
pip install fastapi uvicorn

# 向量存储（RAG 场景）
pip install langchain-chroma  # 或 langchain-pinecone、langchain-qdrant
```

## 常见问题

**Q: `pip install langchain` 和 `pip install langchain-core` 的区别？**

A: `langchain` 是面向应用开发者的高层包（包含 `create_agent` 等），`langchain-core` 是底层抽象（消息类型、工具接口等），通常作为依赖自动安装，无需单独安装。

**Q: 安装时遇到依赖冲突怎么办？**

A: 推荐使用虚拟环境隔离依赖：

```bash
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
.venv\Scripts\activate     # Windows
pip install langchain langchain-anthropic
```

**Q: 需要同时安装 langchain 和 langgraph 吗？**

A: 不需要。`langchain` 已包含 `langgraph` 作为依赖。如果你只使用 LangChain 的高层 API（`create_agent`），无需关心 LangGraph。

## 下一步

- [快速上手](/ai/langchain/guide/quickstart) — 创建你的第一个 Agent
- [设计理念](/ai/langchain/guide/philosophy) — 理解 LangChain 的架构思想

## 参考资源

- [LangChain 安装文档](https://docs.langchain.com/oss/python/langchain/install)
- [Provider 列表](https://docs.langchain.com/oss/python/integrations/providers/overview)
- [uv 官方文档](https://docs.astral.sh/uv/)

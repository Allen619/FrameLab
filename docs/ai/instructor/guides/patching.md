# Patching 原理与 Mode 选择

Patching 是 Instructor 的核心机制，它通过装饰 OpenAI 客户端的方法，将 Pydantic 模型作为 JSON Schema 注入到请求中。

## Patching 工作原理

1.  **Schema 生成**：将 Pydantic `BaseModel` 转换为 JSON Schema (OpenAI Function Calling Format)。
2.  **Request Construction**：构造包含 `response_format` 或 `tools` 的 API 请求。
3.  **Response Parsing**：拦截 LLM 响应，提取 JSON 字符串。
4.  **Validation & Retry**：使用 Pydantic 验证 JSON。如果失败，自动重试。

## Mode 选择指南

Instructor 支持多种 Patching 模式，以适应不同 LLM 的能力。

### 1. `instructor.Mode.TOOLS` (默认 & 推荐)

利用 OpenAI 的 `tool_choice` API。最稳定，支持流式传输。

**适用场景**：

- GPT-4, GPT-3.5-turbo (最新版本)
- 需要高可靠性的结构化输出
- 需要流式传输

```python
client = instructor.from_openai(OpenAI(), mode=instructor.Mode.TOOLS)
```

### 2. `instructor.Mode.JSON`

强制 LLM 输出 JSON 格式。适用于不支持 Tool Calling 但遵循 JSON Mode 的模型。

**适用场景**：

- 旧版 GPT 模型
- 某些开源模型 (Mistral, Llama 2 via vLLM)
- 不需要复杂的函数调用逻辑

```python
client = instructor.from_openai(OpenAI(), mode=instructor.Mode.JSON)
```

### 3. `instructor.Mode.MD_JSON`

从 Markdown 代码块 (`json ... `) 中提取 JSON。

**适用场景**：

- 通用 Chat 模型 (Claude 2, Llama 2 Base)
- 对 JSON 格式遵循不严格的模型

```python
client = instructor.from_openai(OpenAI(), mode=instructor.Mode.MD_JSON)
```

### 4. `instructor.Mode.PARALLEL_TOOLS`

利用 OpenAI 的并行工具调用能力，一次生成多个对象。

**适用场景**：

- 批量提取任务 (Extraction)
- 需要同时调用多个工具

## 最佳实践

- **GPT-4o / GPT-4-turbo**: 始终使用 `Mode.TOOLS`。
- **Claude 3**: 推荐使用 `Mode.ANTHROPIC_TOOLS` (如果你使用 `from_anthropic`)。
- **Local LLM**: 如果模型支持 Function Calling，用 `TOOLS`；否则用 `JSON` 或 `MD_JSON`。

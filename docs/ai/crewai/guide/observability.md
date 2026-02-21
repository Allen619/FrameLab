---
title: 可观测性与调试
description: CrewAI Tracing、第三方集成平台、Event Listener、执行钩子
---

# 可观测性与调试

> 可观测性让你**看到 Agent 内部在做什么**——执行了哪些步骤、调用了哪些工具、花了多少 Token。

## 1. CrewAI 原生 Tracing

最简单的方式——登录 CrewAI 即可启用：

```bash
crewai login
```

登录后，所有 Crew 执行会自动上报到 CrewAI 平台，可在 Web 界面查看执行追踪。

## 2. 第三方可观测性平台

CrewAI 集成了 16+ 个第三方平台：

| 平台 | 特点 | 适用场景 |
|------|------|----------|
| **Langfuse** | 开源，LLM 专用 | 自托管需求 |
| **Arize Phoenix** | 开源，ML 可观测性 | 数据科学团队 |
| **MLflow** | 开源，实验追踪 | ML 实验管理 |
| **Datadog** | 商业，全栈监控 | 企业级运维 |
| **Langtrace** | 开源，OpenTelemetry | 标准化追踪 |
| **Opik** | Comet 出品 | LLM 评估 |
| **Portkey** | AI 网关 | 多模型管理 |
| **Weave** | Weights & Biases | 实验追踪 |

## 3. Event Listener 事件监听

CrewAI 提供事件监听系统，可以在各个执行阶段挂载回调：

```python
from crewai.utilities.events import (
    crewai_event_bus,
    AgentExecutionStarted,
    AgentExecutionCompleted,
    TaskExecutionStarted,
    TaskExecutionCompleted,
    ToolUsageStarted,
    ToolUsageCompleted,
    CrewKickoffStarted,
    CrewKickoffCompleted,
)

# 注册事件监听器
@crewai_event_bus.on(AgentExecutionStarted)
def on_agent_start(source, event):
    print(f"Agent 开始执行: {event.agent.role}")

@crewai_event_bus.on(TaskExecutionCompleted)
def on_task_complete(source, event):
    print(f"任务完成: {event.task.description[:50]}...")

@crewai_event_bus.on(ToolUsageStarted)
def on_tool_use(source, event):
    print(f"工具调用: {event.tool_name}")
```

## 4. 执行钩子 (Hooks)

### 4.1 LLM Call Hooks

```python
from crewai import Agent

def on_llm_start(prompt):
    """LLM 调用前"""
    print(f"发送 prompt: {prompt[:100]}...")

def on_llm_end(response):
    """LLM 调用后"""
    print(f"收到响应: {len(response)} 字符")

agent = Agent(
    role="助手",
    goal="回答问题",
    backstory="智能助手",
    step_callback=on_llm_end  # 每步执行后回调
)
```

### 4.2 Task / Crew 回调

```python
from crewai import Task, Crew

# Task 级回调
task = Task(
    description="分析数据",
    expected_output="分析报告",
    agent=analyst,
    callback=lambda output: print(f"任务完成: {len(output.raw)} 字")
)

# Crew 级回调
crew = Crew(
    agents=[researcher, analyst],
    tasks=[research_task, analysis_task],
    step_callback=lambda step: print(f"步骤完成: {step}"),
    task_callback=lambda task: print(f"任务完成: {task.description[:30]}")
)
```

## 5. 日志输出

### 5.1 Verbose 模式

```python
# Agent 级别
agent = Agent(role="研究员", ..., verbose=True)

# Crew 级别
crew = Crew(agents=[agent], tasks=[task], verbose=True)
```

### 5.2 日志文件

```python
crew = Crew(
    agents=[researcher],
    tasks=[research_task],
    output_log_file="logs/crew_execution.json"  # .json 或 .txt
)
```

## 6. 调试技巧

| 技巧 | 说明 |
|------|------|
| `verbose=True` | 开启后查看完整思考过程和工具调用 |
| `output_log_file` | 将执行日志保存到文件，方便事后分析 |
| `step_callback` | 实时监控每个执行步骤 |
| Event Listener | 细粒度监控特定事件 |
| `max_iter=5` | 开发时限制迭代次数，加速调试 |

---

**先修**：[Crews 团队编排](/ai/crewai/guide/crews)

**下一步**：
- [CLI 与项目管理](/ai/crewai/guide/cli) — 命令行工具详解

**参考**：
- [🔗 CrewAI Observability (Official)](https://docs.crewai.com/en/observability/overview){target="_blank" rel="noopener"}
- [🔗 CrewAI Tracing (Official)](https://docs.crewai.com/en/observability/tracing){target="_blank" rel="noopener"}
- [🔗 CrewAI Event Listener (Official)](https://docs.crewai.com/en/concepts/event-listener){target="_blank" rel="noopener"}

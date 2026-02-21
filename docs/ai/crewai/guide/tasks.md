---
title: Tasks 任务
description: Task 核心属性、上下文传递、结构化输出、Guardrails、回调与条件任务
---

# 🔥 Tasks 任务

> Task 是 Agent 需要完成的**具体工作单元**，定义了做什么（description）、期望什么结果（expected_output）、谁来做（agent）。

## 1. Task 核心属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `description` | `str` | **必填** | 任务描述（支持 `{variable}` 占位符） |
| `expected_output` | `str` | **必填** | 期望输出的详细描述 |
| `agent` | `BaseAgent` | `None` | 执行此任务的 Agent |
| `context` | `List[Task]` | `None` | 上游任务列表（输出作为上下文） |
| `tools` | `List[BaseTool]` | `[]` | 任务专属工具（覆盖 Agent 工具） |
| `output_pydantic` | `Type[BaseModel]` | `None` | Pydantic 结构化输出 |
| `output_json` | `Type[BaseModel]` | `None` | JSON 结构化输出 |
| `output_file` | `str` | `None` | 输出文件路径 |
| `callback` | `Callable` | `None` | 任务完成回调 |
| `human_input` | `bool` | `False` | 完成前需人工审核 |
| `async_execution` | `bool` | `False` | 异步执行 |
| `guardrail` | `Callable \| str` | `None` | 输出验证守卫 |
| `guardrails` | `List` | `None` | 多个守卫（顺序执行） |
| `guardrail_max_retries` | `int` | `3` | 守卫验证失败最大重试 |

## 2. 基础用法

### 2.1 创建简单 Task

```python
from crewai import Task

task = Task(
    description="搜集关于 {topic} 的最新研究数据",
    expected_output="包含 5 个关键数据点的研究摘要",
    agent=researcher
)
```

### 2.2 YAML 配置方式

```yaml
# config/tasks.yaml
research_task:
  description: >
    对 {topic} 进行全面研究，覆盖市场规模、竞争格局和技术趋势。
  expected_output: >
    一份结构化的研究报告，包含市场规模、主要参与者和技术方向。
  agent: researcher

analysis_task:
  description: >
    基于研究报告，识别 3 个最有前景的机会并评估风险。
  expected_output: >
    包含 3 个机会的分析报告，含风险评估和优先级排序。
  agent: analyst
  context:
    - research_task
```

## 3. 上下文传递

通过 `context` 参数建立任务间的数据流：

```python
research_task = Task(
    description="搜集 AI 市场数据",
    expected_output="市场数据报告",
    agent=researcher
)

analysis_task = Task(
    description="分析市场数据并识别机会",
    expected_output="机会分析报告",
    agent=analyst,
    context=[research_task]  # 接收 research_task 的输出
)

writing_task = Task(
    description="基于分析撰写执行摘要",
    expected_output="执行摘要文档",
    agent=writer,
    context=[analysis_task]  # 接收 analysis_task 的输出
)
```

> **前端类比**：`context` 类似 React 的 props drilling 或 Context API——上游组件的数据向下传递给消费者组件。区别是 CrewAI 的 context 传递的是任务执行的**完整输出文本**。

## 4. 结构化输出

### 4.1 Pydantic 模型输出

```python
from pydantic import BaseModel
from typing import List

class Opportunity(BaseModel):
    name: str
    risk_level: str  # "低" | "中" | "高"
    priority: int
    rationale: str

class AnalysisReport(BaseModel):
    opportunities: List[Opportunity]
    summary: str

task = Task(
    description="分析数据并识别 3 个机会",
    expected_output="结构化机会分析报告",
    agent=analyst,
    output_pydantic=AnalysisReport
)

# 执行后访问
result = crew.kickoff()
report = result.pydantic  # AnalysisReport 实例
for opp in report.opportunities:
    print(f"{opp.name}: 风险{opp.risk_level}, 优先级{opp.priority}")
```

### 4.2 文件输出

```python
task = Task(
    description="生成研究报告",
    expected_output="Markdown 格式报告",
    agent=researcher,
    output_file="reports/research.md",
    create_directory=True  # 自动创建目录
)
```

## 5. Guardrails 任务守卫

Guardrail 在任务完成后**验证输出质量**，不合格则自动重试：

### 5.1 函数式 Guardrail

```python
from crewai import Task
from crewai.tasks.task_output import TaskOutput
from typing import Tuple, Any

def validate_word_count(result: TaskOutput) -> Tuple[bool, Any]:
    """验证输出不超过 200 字"""
    word_count = len(result.raw.split())
    if word_count > 200:
        return (False, f"输出超过 200 字（当前 {word_count} 字），请精简")
    return (True, result.raw)

task = Task(
    description="写一段产品简介",
    expected_output="200 字以内的产品简介",
    agent=writer,
    guardrail=validate_word_count,
    guardrail_max_retries=3
)
```

### 5.2 LLM 式 Guardrail

```python
task = Task(
    description="撰写技术博客",
    expected_output="通俗易懂的技术博客",
    agent=writer,
    guardrail="内容必须 200 字以内，不能包含专业术语"  # 字符串描述
)
```

### 5.3 混合多个 Guardrails

```python
task = Task(
    description="撰写博客",
    expected_output="高质量博客文章",
    agent=writer,
    guardrails=[
        validate_word_count,          # 函数式
        "内容必须引人入胜且易于理解",   # LLM 式
    ],
    guardrail_max_retries=3
)
```

## 6. 回调函数

```python
def on_task_complete(output):
    """任务完成后执行"""
    print(f"任务完成！输出长度: {len(output.raw)}")
    # 可以在这里保存结果、发送通知等

task = Task(
    description="生成报告",
    expected_output="分析报告",
    agent=analyst,
    callback=on_task_complete
)
```

## 7. 人工审核

```python
task = Task(
    description="撰写重要通知邮件",
    expected_output="正式的通知邮件",
    agent=writer,
    human_input=True  # 完成前暂停等待人工确认
)
```

## 8. TaskOutput 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `raw` | `str` | 原始文本输出 |
| `pydantic` | `BaseModel \| None` | Pydantic 对象 |
| `json_dict` | `dict \| None` | JSON 字典 |
| `agent` | `str` | 执行的 Agent 角色 |
| `description` | `str` | 任务描述 |

---

**先修**：[Agents 智能体](/ai/crewai/guide/agents)

**下一步**：
- [Crews 团队编排](/ai/crewai/guide/crews) — 将 Agent 和 Task 组装成团队
- [Guardrails 任务守卫](/ai/crewai/guide/guardrails) — 深入了解守卫机制

**参考**：
- [🔗 CrewAI Tasks (Official)](https://docs.crewai.com/en/concepts/tasks){target="_blank" rel="noopener"}

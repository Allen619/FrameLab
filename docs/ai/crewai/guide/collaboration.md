---
title: Collaboration 协作与委托
description: Agent 间信息共享、任务委托（delegation）机制、协作模式与最佳实践
---

# Collaboration 协作与委托

> CrewAI 的核心优势在于**多 Agent 协作**——Agent 之间可以共享信息、委托任务，像真实团队一样分工合作。

## 1. 协作机制概览

CrewAI 提供两种协作方式：

| 方式 | 说明 | 触发方式 |
|------|------|----------|
| **上下文传递** | 前一个任务的输出作为下一个任务的输入 | `context` 参数 |
| **任务委托** | Agent 将子任务动态委派给更合适的 Agent | `allow_delegation=True` |

## 2. 上下文传递

通过 Task 的 `context` 参数实现数据流：

```python
research_task = Task(
    description="搜集 AI 市场数据",
    expected_output="市场研究报告",
    agent=researcher
)

analysis_task = Task(
    description="分析市场数据",
    expected_output="分析报告",
    agent=analyst,
    context=[research_task]  # 接收研究任务输出
)
```

在 Sequential 流程中，**前一个任务的输出会自动传递**给下一个任务，无需显式配置 `context`。`context` 在以下场景更有用：
- 非相邻任务的数据传递
- 多个任务的输出汇总

## 3. 任务委托 (Delegation)

### 3.1 启用委托

```python
project_manager = Agent(
    role="项目经理",
    goal="协调团队高效完成项目",
    backstory="经验丰富的项目经理",
    allow_delegation=True  # 允许委托
)

developer = Agent(
    role="开发工程师",
    goal="编写高质量代码",
    backstory="全栈开发工程师",
    allow_delegation=False  # 不允许委托
)
```

### 3.2 委托工作方式

当 `allow_delegation=True` 时，Agent 可以：

1. **评估任务**：判断当前任务是否超出自身能力范围
2. **识别合适的 Agent**：在 Crew 中找到更适合的执行者
3. **委派子任务**：将具体工作委托给目标 Agent
4. **接收结果**：获取被委托 Agent 的执行结果
5. **整合输出**：将委托结果与自身工作整合

### 3.3 层级流程中的委托

在 Hierarchical 流程中，Manager Agent 天然具备委托能力：

```python
from crewai import Crew, Process

crew = Crew(
    agents=[researcher, analyst, writer],
    tasks=[complex_task],
    process=Process.hierarchical,
    manager_llm="openai/gpt-4o"
)
```

Manager 会自动：
- 分析任务需求
- 选择最合适的 Agent
- 分配和监督执行
- 审查和汇总结果

## 4. 协作模式

### 4.1 管道模式（Pipeline）

```python
# 每个 Agent 处理一个环节，按顺序传递
crew = Crew(
    agents=[researcher, analyst, writer],
    tasks=[research_task, analysis_task, writing_task],
    process=Process.sequential
)
```

### 4.2 协调者模式（Coordinator）

```python
# Manager 统一协调分配
crew = Crew(
    agents=[researcher, analyst, writer],
    tasks=[research_task, analysis_task, writing_task],
    process=Process.hierarchical,
    manager_llm="openai/gpt-4o"
)
```

### 4.3 专家委托模式

```python
# 通用 Agent 可以向专家委托
generalist = Agent(
    role="通用助手",
    goal="回答各类问题",
    backstory="全面但不深入的助手",
    allow_delegation=True  # 遇到专业问题可委托
)

specialist = Agent(
    role="数据库专家",
    goal="解决复杂的数据库问题",
    backstory="资深 DBA",
    allow_delegation=False
)
```

## 5. 最佳实践

- **明确角色边界**：每个 Agent 的 role 和 goal 要清晰，避免职责重叠
- **谨慎开启委托**：只对需要动态分配的 Agent 开启 `allow_delegation`
- **控制委托深度**：避免 Agent 之间循环委托，通过 `max_iter` 限制
- **使用 verbose**：开发期间开启 `verbose=True` 观察委托行为

---

**先修**：[Crews 团队编排](/ai/crewai/guide/crews) | [Processes 执行流程](/ai/crewai/guide/processes)

**下一步**：
- [Planning & Reasoning](/ai/crewai/guide/planning-reasoning) — 规划与推理能力
- [Guardrails 任务守卫](/ai/crewai/guide/guardrails) — 输出质量验证

**参考**：
- [🔗 CrewAI Collaboration (Official)](https://docs.crewai.com/en/concepts/collaboration){target="_blank" rel="noopener"}

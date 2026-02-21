---
title: 可观测性
description: LangGraph 应用的可观测性：追踪、评估、监控与运行时指标
---

# 可观测性

## 可观测性概述

当你的 LangGraph Agent 从本地脚本走向生产环境时，"能跑"远远不够——你需要知道它**为什么这样跑**、**跑得好不好**、**哪里出了问题**。

可观测性（Observability）解决的就是这三个问题：

1. **追踪（Tracing）**：每次执行走了哪条路径？每个节点的输入输出是什么？
2. **评估（Evaluation）**：Agent 的输出质量怎么样？是否在退化？
3. **监控（Monitoring）**：系统运行状态如何？延迟、错误率、吞吐量如何？

**前端类比**：如果你用过 Sentry + DataDog（或 New Relic）来监控前端应用，LangSmith 的可观测性就是 AI 应用版的同类工具。

| 前端可观测性工具         | LangSmith 对应能力       | 说明                                 |
| ------------------------ | ------------------------ | ------------------------------------ |
| Sentry Error Tracking    | 追踪（Tracing）          | 捕获错误堆栈 → 捕获执行路径          |
| DataDog APM              | 运行时指标（Metrics）    | 请求延迟/吞吐 → 节点延迟/Token 消耗  |
| Lighthouse / Web Vitals  | 评估（Evaluation）       | 页面性能评分 → 输出质量评分           |
| Grafana Dashboard        | 监控面板（Dashboard）    | 系统指标仪表盘 → Agent 指标仪表盘    |
| Chrome DevTools Timeline | 追踪时间线               | 渲染时间线 → 执行时间线               |

**LangGraph 原生语义**：LangGraph 的可观测性由 **LangSmith** 平台提供。LangSmith 不是一个通用的 APM 工具——它专门为 LLM 应用设计，理解 prompt/completion/tool call 的语义，能提供比通用 APM 更深度的 AI 应用洞察。

## 快速接入

### 步骤 1：配置环境变量

```bash
# .env
LANGSMITH_API_KEY=lsv2_pt_...     # 你的 LangSmith API Key
LANGSMITH_TRACING=true             # 启用追踪
LANGSMITH_PROJECT=my-agent-prod    # 项目名称（用于组织追踪数据）
```

### 步骤 2：就这样——没有步骤 2

是的，配置完环境变量后，LangGraph（以及 LangChain）会**自动**将所有执行追踪发送到 LangSmith。你不需要修改任何业务代码。

```python
# 你的代码不需要任何改动
graph = builder.compile(checkpointer=checkpointer)
result = graph.invoke({"messages": [...]}, config=config)
# 这次执行的完整追踪已经自动发送到 LangSmith
```

**前端类比**：这就像 Sentry 的 SDK——安装后一行 `Sentry.init()` 就能自动捕获所有未处理异常。LangSmith 也是类似的"安装即生效"体验。

**LangGraph 原生语义**：LangSmith 的追踪通过 Python 的 `contextvars` 和 LangChain 的回调机制实现。每个 `invoke` / `stream` 调用会创建一个追踪上下文，所有在该上下文中的 LLM 调用、工具调用都会被自动关联。

## 追踪（Tracing）：执行路径可视化

### 什么是追踪

追踪记录了一次 Agent 执行的**完整路径**，包括：

- 每个节点的执行顺序和耗时
- 每次 LLM 调用的 prompt 和 response
- 每次工具调用的参数和返回值
- 条件边的路由决策
- 状态在每个节点间的变化

### 追踪的层级结构

```
Trace (一次完整的 Agent 调用)
├── Run: graph.invoke()
│   ├── Run: node "evaluate" (12ms)
│   │   ├── Run: ChatOpenAI.invoke() (450ms)
│   │   │   ├── Input: [system_msg, user_msg]
│   │   │   └── Output: "risk_score: 85"
│   │   └── State Update: {risk_score: 85}
│   ├── Run: conditional_edge "route" → "manual_review"
│   ├── Run: node "manual_review" (2.3s)  ← 包含 interrupt
│   │   └── Interrupt: {question: "是否批准？"}
│   └── (等待人工恢复...)
```

**前端类比**：这就像 Chrome DevTools 的 Performance 面板中的火焰图（Flame Chart）。你可以看到每个"函数调用"（节点执行）的嵌套关系和耗时，快速定位瓶颈。

### 添加自定义元数据和标签

为追踪添加业务上下文，便于后续筛选和分析：

```python
# 方式 1：在 invoke 时传入
response = graph.invoke(
    {"messages": [{"role": "user", "content": "帮我退款"}]},
    config={
        "tags": ["production", "support-agent", "v2.1"],
        "metadata": {
            "user_id": "user_123",
            "session_id": "session_456",
            "environment": "production",
            "region": "cn-east",
        },
    },
)
```

```python
# 方式 2：使用 tracing_context 上下文管理器
import langsmith as ls

with ls.tracing_context(
    project_name="support-agent-prod",
    enabled=True,
    tags=["production", "support-agent"],
    metadata={
        "user_id": "user_123",
        "deployment_version": "v2.1",
    },
):
    response = graph.invoke(
        {"messages": [{"role": "user", "content": "帮我退款"}]}
    )
```

**前端类比**：这就像给 Sentry 事件添加 `tags` 和 `extra` 信息——`Sentry.setTag("user_id", "123")`。让你在海量追踪数据中快速筛选出特定用户、特定版本的执行记录。

### 追踪的常见用途

#### 调试异常执行

当 Agent 产出了意料之外的结果：

1. 在 LangSmith 中找到该次执行的追踪
2. 逐节点检查输入/输出
3. 重点查看条件边的路由决策
4. 检查 LLM 的 prompt 是否包含了正确的上下文

#### 定位性能瓶颈

当 Agent 响应变慢：

1. 查看追踪的时间线视图
2. 找到耗时最长的节点
3. 通常瓶颈在 LLM 调用或外部 API 调用
4. 考虑缓存、并行或模型降级策略

#### 审计与合规

对高风险业务（金融、医疗）：

1. 每次决策都有完整的执行轨迹
2. 可追溯"为什么做了这个决策"
3. 满足监管对 AI 决策可解释性的要求

## 评估（Evaluation）：输出质量监控

### 为什么需要评估

LLM 的输出具有不确定性。即使同一个 prompt，不同时间、不同模型版本的输出也可能不同。评估帮你回答：

- Agent 的回答**准确**吗？
- Agent 的回答**相关**吗？
- Agent 的回答**安全**吗？
- 随着模型更新或 prompt 修改，质量是**提升**还是**下降**了？

### 评估方式

#### 基于数据集的离线评估

预先准备一组"标准输入-期望输出"对，定期运行评估：

```python
import langsmith as ls

# 创建评估数据集
dataset = ls.Client().create_dataset("support-agent-qa")

# 添加测试用例
ls.Client().create_examples(
    dataset_id=dataset.id,
    inputs=[
        {"messages": [{"role": "user", "content": "我的订单在哪"}]},
        {"messages": [{"role": "user", "content": "退款流程是什么"}]},
    ],
    outputs=[
        {"expected": "应该查询订单状态并返回物流信息"},
        {"expected": "应该说明退款步骤并提供链接"},
    ],
)
```

#### 基于 LLM 的自动评估

用另一个 LLM 来评判 Agent 输出的质量：

```python
from langsmith.evaluation import evaluate

def quality_evaluator(run, example):
    """用 LLM 评判输出质量"""
    # run.outputs 是 Agent 的实际输出
    # example.outputs 是期望输出
    # 使用评判 LLM 进行比较
    score = judge_llm.invoke(
        f"评判以下回答的质量（0-1分）：\n"
        f"问题：{example.inputs}\n"
        f"期望：{example.outputs}\n"
        f"实际：{run.outputs}"
    )
    return {"score": float(score.content)}

# 运行评估
results = evaluate(
    target=graph.invoke,
    data="support-agent-qa",
    evaluators=[quality_evaluator],
)
```

**前端类比**：这类似 Lighthouse 对网页的自动评分。Lighthouse 会从性能、可访问性等维度给你打分。LangSmith 的评估也是类似的——从准确性、相关性、安全性等维度给 Agent 输出打分。

**LangGraph 原生语义**：评估不是 LangGraph 框架本身的功能，而是 LangSmith 平台提供的能力。LangGraph 负责"运行 Agent"，LangSmith 负责"评估 Agent 运行得好不好"。两者通过追踪数据关联。

## 监控（Monitoring）：部署状态监控

### 运行时监控仪表盘

LangSmith 提供实时监控面板，展示：

- **请求量**：每分钟/小时/天的调用次数
- **成功率**：成功执行 vs 异常终止的比例
- **延迟分布**：P50 / P95 / P99 响应时间
- **Token 消耗**：每次调用的 token 用量和成本
- **错误分布**：按错误类型分类的统计

### 告警设置

为关键指标设置告警：

```
告警规则示例：
- 错误率 > 5% 持续 5 分钟 → 告警
- P95 延迟 > 30 秒 → 告警
- 每小时 Token 消耗 > 100万 → 告警（可能有滥用）
```

**前端类比**：这就像 DataDog 或 Grafana 的仪表盘和告警。你设定阈值，当指标异常时自动通知团队。

### 监控的维度

```
┌──────────────────────────────────────────────────┐
│              LangSmith 监控面板                    │
├──────────────┬──────────────┬────────────────────┤
│  请求指标    │  质量指标     │  成本指标          │
│              │              │                    │
│  - 总调用量  │  - 评估分数  │  - Token 消耗      │
│  - 成功率    │  - 用户反馈  │  - API 调用成本    │
│  - 错误率    │  - 回答相关性│  - 工具调用成本    │
│  - 延迟分布  │  - 安全性分数│  - 每用户平均成本  │
└──────────────┴──────────────┴────────────────────┘
```

## 运行时指标（Runtime Metrics）

### Token 消耗追踪

每次 LLM 调用的 token 消耗都会被自动记录：

```python
# 追踪中自动记录的 token 信息
{
    "prompt_tokens": 1250,
    "completion_tokens": 380,
    "total_tokens": 1630,
    "model": "gpt-4o",
    "estimated_cost": 0.0089  # USD
}
```

你可以在 LangSmith 中按时间、按 Agent、按用户维度聚合这些数据。

### 执行路径统计

了解你的 Agent 最常走哪条路径：

```
路径统计（最近 7 天）：
  evaluate → auto_reply → END           : 72%
  evaluate → manual_review → execute → END: 18%
  evaluate → manual_review → cancel → END :  7%
  evaluate → ERROR                        :  3%
```

这帮助你理解 Agent 的实际行为模式，发现异常趋势。

### 延迟分析

```
节点级延迟分布（P95）：
  evaluate      :  0.8s  (主要是 LLM 调用)
  search_tool   :  1.2s  (外部 API 调用)
  manual_review : 45.0s  (等待人工审批)
  auto_reply    :  0.5s  (LLM 生成回复)
  总端到端      :  3.2s  (自动路径)
```

**前端类比**：这就像 Web Vitals 的 LCP、FID、CLS 指标——每个指标告诉你体验的某个维度。在 LangGraph 中，你关注的是每个节点的延迟、总端到端延迟和等待人工介入的时间。

### 自定义指标

你可以在节点中记录自定义的业务指标：

```python
import langsmith as ls


def evaluate_node(state: dict) -> dict:
    """评估节点 —— 记录自定义指标"""
    risk_score = calculate_risk(state)

    # 记录业务指标到追踪
    ls.trace(
        name="risk_evaluation",
        metadata={
            "risk_score": risk_score,
            "risk_category": "high" if risk_score > 80 else "low",
            "input_length": len(str(state.get("messages", []))),
        },
    )

    return {"risk_score": risk_score}
```

## 最佳实践

### 可观测性分级策略

不是所有环境都需要同等级别的可观测性：

| 环境       | 追踪     | 评估     | 监控     | 说明                     |
| ---------- | -------- | -------- | -------- | ------------------------ |
| 本地开发   | 开启     | 按需     | 关闭     | 用于调试，不需要告警     |
| CI/CD      | 关闭     | 开启     | 关闭     | 自动化评估，不需要追踪   |
| Staging    | 开启     | 开启     | 基础     | 完整验证，基础告警       |
| Production | 开启     | 定期     | 完整     | 全量追踪 + 告警 + 仪表盘 |

### 控制追踪开销

在高吞吐场景中，全量追踪可能带来显著的性能和成本开销：

```python
import os

# 环境变量控制采样率
# 方式 1：完全关闭追踪
os.environ["LANGSMITH_TRACING"] = "false"

# 方式 2：只追踪特定操作
with ls.tracing_context(enabled=True):
    # 只有这个上下文中的操作会被追踪
    result = graph.invoke(input_data, config=config)
```

### 敏感数据处理

追踪数据可能包含用户的敏感信息（PII）：

- 配置 LangSmith 的数据脱敏规则
- 在发送追踪前过滤掉敏感字段
- 合规场景下考虑自托管 LangSmith

```python
# 在节点中手动脱敏
def process_user_data(state: dict) -> dict:
    user_input = state["messages"][-1]["content"]

    # 脱敏后再传给 LLM
    sanitized_input = mask_pii(user_input)

    response = llm.invoke(sanitized_input)
    return {"messages": [response]}
```

## 工程检查清单

- [ ] 所有环境都配置了 `LANGSMITH_API_KEY`
- [ ] 生产环境开启了 `LANGSMITH_TRACING=true`
- [ ] 设置了有意义的 `LANGSMITH_PROJECT` 名称（区分环境）
- [ ] 关键调用添加了 `tags` 和 `metadata`
- [ ] 建立了评估数据集和定期评估流程
- [ ] 配置了关键指标的告警规则
- [ ] 制定了敏感数据处理方案
- [ ] 团队成员都有 LangSmith 项目访问权限

## 先修与下一步

**先修内容**：
- [快速开始](/ai/langgraph/guide/quickstart) — 确保你有可运行的 Agent
- [部署](/ai/langgraph/guide/deployment) — 可观测性在部署后最有价值

**下一步**：
- [生产实践](/ai/langgraph/guide/application-structure) — 完整的生产化指南
- [测试](/ai/langgraph/guide/testing) — 评估与测试的配合策略
- [LangSmith Studio](/ai/langgraph/guide/studio) — 开发阶段的可视化调试

## 参考

- [LangSmith Observability](https://docs.smith.langchain.com/observability)
- [LangSmith Evaluation](https://docs.smith.langchain.com/evaluation)
- [LangGraph Tracing](https://langchain-ai.github.io/langgraph/how-tos/tracing/)
- [LangSmith SDK](https://docs.smith.langchain.com/reference/sdk)

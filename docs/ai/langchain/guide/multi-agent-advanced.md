---
title: 高级多智能体
description: 掌握 Skills 技能模式、LangGraph 自定义工作流、多 Agent 内存共享与错误处理策略
---

# 高级多智能体

> 前置阅读：[多智能体概览](/ai/langchain/guide/multi-agent-overview) · [多智能体模式](/ai/langchain/guide/multi-agent-patterns)

本章覆盖两种高级模式（Skills、Custom Workflow）以及多 Agent 系统的共性问题：内存共享、错误处理、最佳实践。

## Skills 技能模式

### 概念

Skills 模式将 Agent 的能力封装为**可复用的技能单元**。与 Subagents 不同，技能不是独立的 Agent，而是一组工具 + prompt 片段的组合，可以"插入"到任意 Agent 中使用。

类比软件工程中的**组合优于继承**：与其创建一个"什么都会"的 Agent，不如让 Agent 按需装载技能模块。

### 适用场景

- **SQL 技能**：任何需要数据库查询的 Agent 都能装载
- **搜索技能**：网页搜索 + 结果解析，跨 Agent 复用
- **代码生成技能**：代码编写 + 执行 + 测试，作为可选能力提供

### 代码示例：可插拔技能系统

```python
from langchain.chat_models import init_chat_model
from langchain.tools import tool
from langgraph.prebuilt import create_react_agent
from dataclasses import dataclass, field

model = init_chat_model("openai:gpt-4o")

# ============ 技能定义 ============

@dataclass
class Skill:
    """可复用的 Agent 技能单元"""
    name: str
    description: str
    tools: list
    prompt_fragment: str  # 附加到 Agent prompt 的指令片段

# --- SQL 技能 ---
@tool
def execute_sql(query: str) -> str:
    """执行 SQL 查询并返回结果"""
    # 实际项目中连接数据库
    return f"SQL 执行结果：查询 '{query}' 返回 15 行数据"

@tool
def explain_sql(query: str) -> str:
    """解释 SQL 查询的执行计划"""
    return f"执行计划：全表扫描 → 索引过滤 → 排序 → 返回前 15 行"

sql_skill = Skill(
    name="SQL",
    description="数据库查询与分析能力",
    tools=[execute_sql, explain_sql],
    prompt_fragment="你具备 SQL 能力，可以编写和执行 SQL 查询来获取数据。始终先 explain 再 execute。"
)

# --- 搜索技能 ---
@tool
def web_search(query: str) -> str:
    """搜索网页"""
    return f"搜索结果：找到 5 条关于 '{query}' 的信息"

@tool
def parse_url(url: str) -> str:
    """解析网页内容"""
    return f"网页内容摘要：...来自 {url} 的关键信息..."

search_skill = Skill(
    name="Search",
    description="网页搜索与内容解析能力",
    tools=[web_search, parse_url],
    prompt_fragment="你具备网络搜索能力，可以搜索最新信息并解析网页内容。"
)

# --- 代码生成技能 ---
@tool
def generate_code(spec: str, language: str = "python") -> str:
    """根据需求描述生成代码"""
    return f"```{language}\n# 根据需求生成的代码\ndef solution():\n    pass\n```"

@tool
def run_code(code: str) -> str:
    """执行代码并返回结果"""
    return "代码执行成功，输出：Hello World"

code_skill = Skill(
    name="Code",
    description="代码生成与执行能力",
    tools=[generate_code, run_code],
    prompt_fragment="你具备代码生成和执行能力。生成代码前先确认需求，生成后建议测试运行。"
)

# ============ 技能装载器 ============

def create_agent_with_skills(
    base_prompt: str,
    skills: list[Skill],
    model_name: str = "openai:gpt-4o"
) -> object:
    """根据技能列表创建 Agent"""
    # 合并所有技能的工具
    all_tools = []
    for skill in skills:
        all_tools.extend(skill.tools)

    # 合并 prompt
    skill_prompts = "\n".join(
        f"[{s.name} 技能] {s.prompt_fragment}" for s in skills
    )
    full_prompt = f"{base_prompt}\n\n你装载了以下技能：\n{skill_prompts}"

    return create_react_agent(
        init_chat_model(model_name),
        tools=all_tools,
        prompt=full_prompt,
    )

# ============ 按需创建 Agent ============

# 数据分析 Agent = 基础 + SQL + 搜索
data_analyst = create_agent_with_skills(
    base_prompt="你是数据分析师，帮助用户从数据中获取洞察。",
    skills=[sql_skill, search_skill],
)

# 全栈助手 = 基础 + SQL + 搜索 + 代码
fullstack_assistant = create_agent_with_skills(
    base_prompt="你是全栈开发助手，帮助用户解决开发中的各种问题。",
    skills=[sql_skill, search_skill, code_skill],
)

# 轻量搜索助手 = 基础 + 搜索
search_assistant = create_agent_with_skills(
    base_prompt="你是搜索助手，帮助用户查找信息。",
    skills=[search_skill],
)

# 执行
result = data_analyst.invoke(
    {"messages": [{"role": "user", "content": "查一下上个月的用户增长数据"}]}
)
print(result["messages"][-1].content)
```

技能模式的核心优势是**复用**：同一个 SQL 技能可以被数据分析 Agent、运维 Agent、BI Agent 同时使用，修改技能定义后所有使用该技能的 Agent 同步生效。

## Custom Workflow 自定义工作流

### 概念

当 LangChain 内置的多 Agent 模式无法满足需求时，可以使用 **LangGraph** 构建完全自定义的多 Agent 工作流。LangGraph 提供了图（Graph）抽象，支持条件分支、并行执行、循环和人工干预。

### 何时从 LangChain 升级到 LangGraph

| 场景 | LangChain 多 Agent | LangGraph 自定义工作流 |
|------|--------------------|-----------------------|
| 简单路由分发 | 足够 | 过度设计 |
| 固定流程的多步骤 | 足够 | 可选 |
| 条件分支 + 循环 | 勉强 | 推荐 |
| 并行执行多个 Agent | 不支持 | 原生支持 |
| 人工审批中断 | 不支持 | 原生支持 |
| 持久化检查点 | 不支持 | 原生支持 |
| 生产级错误恢复 | 有限 | 完善 |

### 代码示例：条件路由工作流

```python
from langchain.chat_models import init_chat_model
from langchain.tools import tool
from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import create_react_agent
from typing import TypedDict, Annotated, Literal
from langchain.messages import HumanMessage, BaseMessage
import operator

model = init_chat_model("openai:gpt-4o")

# ============ 状态定义 ============

class WorkflowState(TypedDict):
    messages: Annotated[list[BaseMessage], operator.add]
    category: str  # 分类结果
    result: str    # 最终结果

# ============ 节点定义 ============

def classify_node(state: WorkflowState) -> dict:
    """分类节点：判断问题类型"""
    last_message = state["messages"][-1].content
    response = model.invoke([
        {"role": "system", "content": "将用户问题分类为 'technical' 或 'business' 或 'general'。只返回分类标签。"},
        {"role": "user", "content": last_message}
    ])
    return {"category": response.content.strip().lower()}

# 技术处理 Agent
@tool
def debug_code(code: str) -> str:
    """调试代码问题"""
    return f"代码分析完成：发现 2 个潜在问题"

@tool
def suggest_fix(issue: str) -> str:
    """建议修复方案"""
    return f"修复建议：{issue} → 使用缓存优化 + 异步处理"

tech_agent = create_react_agent(model, tools=[debug_code, suggest_fix], prompt="你是技术专家。")

def tech_node(state: WorkflowState) -> dict:
    """技术处理节点"""
    result = tech_agent.invoke({"messages": state["messages"]})
    return {"result": result["messages"][-1].content}

# 业务处理 Agent
@tool
def market_analysis(topic: str) -> str:
    """市场分析"""
    return f"{topic} 市场分析：增长率 15%，竞争格局稳定"

business_agent = create_react_agent(model, tools=[market_analysis], prompt="你是商业顾问。")

def business_node(state: WorkflowState) -> dict:
    """业务处理节点"""
    result = business_agent.invoke({"messages": state["messages"]})
    return {"result": result["messages"][-1].content}

def general_node(state: WorkflowState) -> dict:
    """通用处理节点"""
    response = model.invoke(state["messages"])
    return {"result": response.content}

# 汇总节点
def summary_node(state: WorkflowState) -> dict:
    """汇总结果"""
    response = model.invoke([
        {"role": "system", "content": "将以下处理结果整理为用户友好的回复"},
        {"role": "user", "content": state["result"]}
    ])
    return {"messages": [response]}

# ============ 条件路由 ============

def route_by_category(state: WorkflowState) -> Literal["tech", "business", "general"]:
    """根据分类结果路由"""
    category = state.get("category", "general")
    if "technical" in category:
        return "tech"
    elif "business" in category:
        return "business"
    return "general"

# ============ 构建图 ============

workflow = StateGraph(WorkflowState)

# 添加节点
workflow.add_node("classify", classify_node)
workflow.add_node("tech", tech_node)
workflow.add_node("business", business_node)
workflow.add_node("general", general_node)
workflow.add_node("summary", summary_node)

# 添加边
workflow.add_edge(START, "classify")
workflow.add_conditional_edges("classify", route_by_category)
workflow.add_edge("tech", "summary")
workflow.add_edge("business", "summary")
workflow.add_edge("general", "summary")
workflow.add_edge("summary", END)

# 编译并执行
app = workflow.compile()
result = app.invoke({
    "messages": [HumanMessage(content="我们的 API 响应时间最近变慢了，该怎么排查？")]
})
print(result["result"])
```

关于 LangGraph 的完整教程，请参阅 [LangGraph 概览](/ai/langgraph/guide/overview) 和 [子图编排](/ai/langgraph/guide/subgraphs)。

## 多 Agent 内存共享

多个 Agent 协作时，如何共享上下文是核心挑战。LangChain 提供了几种方案：

### 方案一：消息传递（最常用）

Agent 之间通过函数参数传递必要信息，每次交互显式传入上下文：

```python
@tool
def delegate_to_analyst(task: str, context: str) -> str:
    """委派分析任务。
    Args:
        task: 具体的分析任务
        context: 之前步骤的结果摘要，作为分析依据
    """
    result = analyst_agent.invoke({
        "messages": [
            {"role": "system", "content": f"参考上下文：{context}"},
            {"role": "user", "content": task}
        ]
    })
    return result["messages"][-1].content
```

优点：简单直接，无隐式依赖。缺点：上下文可能在多次传递中丢失细节。

### 方案二：共享 State（LangGraph）

使用 LangGraph 的 `StateGraph`，所有节点共享同一个状态对象：

```python
class SharedState(TypedDict):
    messages: Annotated[list, operator.add]
    research_data: str      # 搜索 Agent 写入
    analysis_result: str    # 分析 Agent 写入
    final_report: str       # 写作 Agent 写入

# 每个节点都能读写 SharedState
def research_node(state: SharedState) -> dict:
    # 读取 messages，写入 research_data
    return {"research_data": "搜索到的原始数据..."}

def analysis_node(state: SharedState) -> dict:
    # 读取 research_data，写入 analysis_result
    data = state["research_data"]
    return {"analysis_result": f"基于 {data} 的分析结果..."}
```

优点：所有 Agent 共享完整上下文，无信息丢失。缺点：需要 LangGraph，状态可能膨胀。

### 方案三：外部存储

对于长期记忆或跨会话共享，使用外部存储（数据库、向量数据库）：

```python
from langchain.vectorstores import InMemoryVectorStore
from langchain.embeddings import init_embeddings

# 共享的向量存储
shared_memory = InMemoryVectorStore(init_embeddings("openai:text-embedding-3-small"))

@tool
def save_to_memory(content: str, metadata: str = "") -> str:
    """保存信息到共享记忆"""
    shared_memory.add_texts([content], metadatas=[{"source": metadata}])
    return "已保存"

@tool
def recall_from_memory(query: str) -> str:
    """从共享记忆中检索相关信息"""
    docs = shared_memory.similarity_search(query, k=3)
    return "\n".join(d.page_content for d in docs)
```

## 错误处理

多 Agent 系统的错误处理比单 Agent 更复杂——任何一个子 Agent 的失败都可能影响整体流程。

### 策略一：子 Agent 级别的重试

```python
import time

def invoke_with_retry(agent, messages, max_retries=3):
    """带重试的 Agent 调用"""
    for attempt in range(max_retries):
        try:
            result = agent.invoke({"messages": messages})
            return result["messages"][-1].content
        except Exception as e:
            if attempt == max_retries - 1:
                return f"[错误] Agent 调用失败（{max_retries} 次重试后）：{str(e)}"
            wait = 2 ** attempt
            print(f"第 {attempt + 1} 次失败，{wait}s 后重试：{e}")
            time.sleep(wait)
```

### 策略二：降级回退

当专家 Agent 不可用时，回退到通用 Agent：

```python
@tool
def route_to_expert(question: str) -> str:
    """路由到专家 Agent，不可用时降级到通用回答"""
    try:
        result = expert_agent.invoke(
            {"messages": [{"role": "user", "content": question}]}
        )
        return result["messages"][-1].content
    except Exception:
        # 降级：用通用模型直接回答
        response = model.invoke([{"role": "user", "content": question}])
        return f"[降级回复] {response.content}"
```

### 策略三：超时控制

防止子 Agent 无限循环或长时间等待：

```python
import signal

class TimeoutError(Exception):
    pass

def invoke_with_timeout(agent, messages, timeout_seconds=30):
    """带超时控制的 Agent 调用"""
    # 注意：signal.alarm 仅适用于 Unix 系统
    def handler(signum, frame):
        raise TimeoutError("Agent 执行超时")

    old_handler = signal.signal(signal.SIGALRM, handler)
    signal.alarm(timeout_seconds)
    try:
        result = agent.invoke({"messages": messages})
        return result["messages"][-1].content
    except TimeoutError:
        return "[超时] Agent 未能在规定时间内完成"
    finally:
        signal.alarm(0)
        signal.signal(signal.SIGALRM, old_handler)
```

## 最佳实践

### 1. 最小权限原则

每个 Agent 只装载它需要的工具，避免"全能 Agent"：

```python
# 好的做法：按职责分配工具
billing_agent = create_react_agent(model, tools=[check_balance, process_refund])
readonly_agent = create_react_agent(model, tools=[query_data])  # 只读权限

# 不好的做法：所有 Agent 都能做所有事
agent = create_react_agent(model, tools=[all_100_tools])
```

### 2. 明确的角色边界

每个 Agent 的 system prompt 应该清晰定义：能做什么、不能做什么、什么时候应该求助。

```python
prompt = """你是账单处理专家。
能做：查询余额、处理退款、解释账单明细
不能做：技术问题排查、密码重置、账户注销
遇到不能做的事：告知用户你是账单专家，建议他联系对应部门"""
```

### 3. 可观测性

在生产环境中，记录每个 Agent 的调用链：

```python
import logging

logger = logging.getLogger("multi_agent")

@tool
def delegate_with_logging(agent_name: str, task: str) -> str:
    """带日志的任务委派"""
    logger.info(f"[委派] {agent_name} <- {task[:50]}...")
    try:
        result = agents[agent_name].invoke(
            {"messages": [{"role": "user", "content": task}]}
        )
        response = result["messages"][-1].content
        logger.info(f"[完成] {agent_name} -> {response[:50]}...")
        return response
    except Exception as e:
        logger.error(f"[失败] {agent_name}: {e}")
        raise
```

### 4. 测试策略

多 Agent 系统的测试需要分层进行：

```python
# 单元测试：单个 Agent 的工具调用
def test_billing_agent_check_balance():
    result = billing_agent.invoke(
        {"messages": [{"role": "user", "content": "查询账户 A001 的余额"}]}
    )
    assert "余额" in result["messages"][-1].content

# 集成测试：Agent 间的交接
def test_handoff_triage_to_billing():
    result = triage_agent.invoke(
        {"messages": [{"role": "user", "content": "我上个月的账单有问题"}]}
    )
    assert "账单" in result["messages"][-1].content

# 端到端测试：完整流程
def test_full_research_pipeline():
    result = supervisor.invoke(
        {"messages": [{"role": "user", "content": "研究 2024 年 AI 安全进展"}]}
    )
    assert len(result["messages"][-1].content) > 100
```

### 5. 成本控制

多 Agent 系统的 LLM 调用次数成倍增长，需要关注成本：

- **使用分层模型**：路由器用便宜快速的模型（GPT-4o-mini），专家用强模型（GPT-4o / Claude）
- **缓存频繁查询**：对确定性工具的结果做缓存
- **限制迭代次数**：设置 `max_iterations` 防止无限循环
- **监控 Token 用量**：追踪每个 Agent 的 Token 消耗

::: tip 前端类比
多 Agent 的成本控制类似前端的**性能预算（Performance Budget）**：

- 给每个 Agent 设定 Token 预算，就像给每个页面设定 JS bundle 大小上限
- 路由器用小模型 ≈ 关键路径用轻量代码，非关键路径懒加载
- 缓存工具结果 ≈ HTTP 缓存 / Service Worker 缓存

核心原则一样：**在用户无感知的地方省成本，在用户体验关键点投入资源**。
:::

## 常见问题

**Q：Skills 模式和给 Agent 加更多工具有什么区别？**

A：Skills 模式的核心价值是**封装和复用**。一个技能包含工具 + prompt 片段 + 使用指引，是一个完整的能力单元。直接加工具只是增加了函数列表，缺乏使用指导。

**Q：Custom Workflow 什么时候才值得用？**

A：满足以下任一条件时考虑 LangGraph Custom Workflow：
- 需要条件分支（if/else 路由）
- 需要并行执行多个 Agent
- 需要人工审批中断
- 需要持久化检查点和错误恢复
- 流程复杂度超过 3 个 Agent 的线性组合

**Q：多 Agent 系统的延迟怎么优化？**

A：
1. **并行化**：用 LangGraph 并行执行无依赖的子 Agent
2. **流式输出**：使用 `stream_mode="messages"` 减少用户感知延迟
3. **模型选择**：非关键路径用快速模型
4. **预热缓存**：对常见查询预计算结果

## 下一步

- [多智能体概览](/ai/langchain/guide/multi-agent-overview) — 回顾五种模式和选型决策
- [多智能体模式](/ai/langchain/guide/multi-agent-patterns) — Subagents / Handoffs / Router 核心模式
- [LangGraph 概览](/ai/langgraph/guide/overview) — LangGraph 完整教程入口
- [子图编排](/ai/langgraph/guide/subgraphs) — LangGraph 中的多 Agent 子图模式

## 参考资源

- [LangChain Multi-Agent 官方文档](https://python.langchain.com/docs/concepts/multi_agent/)
- [LangGraph 多 Agent 教程](https://langchain-ai.github.io/langgraph/tutorials/multi_agent/)
- [Agent 系统设计模式](https://langchain-ai.github.io/langgraph/concepts/multi_agent/)

---
title: 测试
description: 如何测试 LangGraph 应用：节点单测、边测试、部分执行与 Mock LLM
---

# 测试

## 为什么 LangGraph 应用需要认真测试

LangGraph 应用不是简单的输入-输出函数。它包含多个节点、条件分支、状态流转和外部调用（LLM、API）。任何一个环节出错都可能导致整条流程崩溃或产出意料之外的结果。

**前端类比**：这就像 React 应用的测试策略——你需要单元测试（组件级）、集成测试（页面级）和 E2E 测试（用户流程级）。LangGraph 测试的思路完全对应：

| React 测试层级          | LangGraph 对应           | 工具         |
| ----------------------- | ------------------------ | ------------ |
| 组件单元测试            | 节点函数测试             | pytest       |
| 组件交互测试            | 边 / 条件路由测试        | pytest       |
| 页面集成测试            | 子图 / 全图执行测试      | pytest       |
| Mock API 调用           | Mock LLM 调用            | unittest.mock |
| Storybook 隔离渲染      | 部分执行（Partial exec） | checkpointer |

**LangGraph 原生语义**：LangGraph 提供了一套基于 checkpointer 的测试机制，让你能从任意节点开始执行、在任意节点停止，而不需要重构图结构。这是状态机框架的天然优势。

## 前置条件

```bash
pip install -U pytest pytest-asyncio
```

如果你使用 `uv`：

```bash
uv add --dev pytest pytest-asyncio
```

项目结构建议（与 [应用结构](/ai/langgraph/guide/application-structure) 保持一致）：

```plaintext
my-app/
├── my_agent/
│   ├── agent.py
│   └── utils/
│       ├── nodes.py
│       └── state.py
├── tests/
│   ├── test_nodes.py      # 节点单测
│   ├── test_edges.py      # 边 / 路由测试
│   └── test_graph.py      # 全图集成测试
├── langgraph.json
└── pyproject.toml
```

## 测试入门：最简单的图测试

先从最基本的开始——创建一个图，调用它，断言输出：

```python
# tests/test_graph.py
import pytest
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END


class MyState(TypedDict):
    message: str


def greet(state: MyState) -> dict:
    return {"message": f"Hello, {state['message']}!"}


def test_basic_graph():
    """测试最简单的单节点图"""
    builder = StateGraph(MyState)
    builder.add_node("greet", greet)
    builder.add_edge(START, "greet")
    builder.add_edge("greet", END)

    graph = builder.compile()
    result = graph.invoke({"message": "World"})

    assert result["message"] == "Hello, World!"
```

运行测试：

```bash
pytest tests/test_graph.py -v
```

**前端类比**：这就像用 React Testing Library 渲染一个组件然后检查输出——`render(<Greet name="World" />)` 然后 `expect(screen.getByText("Hello, World!")).toBeInTheDocument()`。

**LangGraph 原生语义**：`graph.invoke()` 会执行完整的图流程并返回最终状态。在测试中你可以直接用 `assert` 检查状态中的任何字段。

## 测试单独节点

节点函数本质上就是普通的 Python 函数——接收 state，返回状态更新。你可以完全绕过图编排，直接测试节点逻辑。

### 方式一：直接调用函数

```python
# tests/test_nodes.py
from my_agent.utils.nodes import evaluate, respond


def test_evaluate_low_risk():
    """测试评估节点 —— 低风险场景"""
    state = {"messages": [], "context": "普通咨询", "risk_score": 0}
    result = evaluate(state)
    assert result["risk_score"] < 50


def test_evaluate_high_risk():
    """测试评估节点 —— 高风险场景"""
    state = {"messages": [], "context": "退款申请", "risk_score": 0}
    result = evaluate(state)
    assert result["risk_score"] >= 50
```

这是最简单、最快的测试方式。节点函数是纯函数时，测试起来就像测试任何 JS/TS 工具函数一样直接。

### 方式二：通过编译图访问节点

如果你需要在图的上下文中测试某个节点：

```python
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from typing_extensions import TypedDict


class MyState(TypedDict):
    my_key: str


def create_graph():
    graph = StateGraph(MyState)
    graph.add_node("node1", lambda state: {"my_key": "hello from node1"})
    graph.add_node("node2", lambda state: {"my_key": "hello from node2"})
    graph.add_edge(START, "node1")
    graph.add_edge("node1", "node2")
    graph.add_edge("node2", END)
    return graph


def test_individual_node():
    """通过编译图直接调用单个节点"""
    checkpointer = MemorySaver()
    graph = create_graph()
    compiled = graph.compile(checkpointer=checkpointer)

    # 直接调用 node1，绕过图的执行流程
    result = compiled.nodes["node1"].invoke({"my_key": "initial"})
    assert result["my_key"] == "hello from node1"
```

**前端类比**：方式一就像直接测试一个 `utils` 函数；方式二就像通过 `renderHook` 在 React 上下文中测试一个 hook。

## 测试条件边

条件边（conditional edges）决定了图的分支走向。测试它们的关键是：**验证路由函数在不同状态下返回正确的目标节点**。

```python
from typing import Literal


def route_by_risk(state: dict) -> Literal["manual_review", "auto_reply"]:
    """根据风险分决定走人工还是自动"""
    return "manual_review" if state.get("risk_score", 0) > 80 else "auto_reply"


def test_route_high_risk():
    """高风险应走人工审核"""
    result = route_by_risk({"risk_score": 95})
    assert result == "manual_review"


def test_route_low_risk():
    """低风险应走自动回复"""
    result = route_by_risk({"risk_score": 30})
    assert result == "auto_reply"


def test_route_boundary():
    """边界值：刚好 80 分应走自动"""
    result = route_by_risk({"risk_score": 80})
    assert result == "auto_reply"


def test_route_exact_boundary():
    """边界值：81 分应走人工"""
    result = route_by_risk({"risk_score": 81})
    assert result == "manual_review"
```

**前端类比**：路由函数的测试就像测试 React Router 的路由守卫（route guard）——给定不同的条件，验证跳转方向是否正确。

**LangGraph 原生语义**：条件边的路由函数应该是纯函数（只依赖 state），这样测试起来最简单，回放时行为也最稳定。

## 部分执行（Partial Execution）

这是 LangGraph 测试的杀手级特性。你可以**从图的任意中间点开始执行**，也可以**在任意节点后停止**，无需拆改图结构。

### 原理

利用 checkpointer 的 `update_state` 方法模拟"已经执行到某个节点"的状态，然后从该节点之后继续执行，并用 `interrupt_after` 控制停止位置。

### 示例：只测试 node2 到 node3

```python
import pytest
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver


class MyState(TypedDict):
    my_key: str


def create_linear_graph():
    graph = StateGraph(MyState)
    graph.add_node("node1", lambda s: {"my_key": "from node1"})
    graph.add_node("node2", lambda s: {"my_key": "from node2"})
    graph.add_node("node3", lambda s: {"my_key": "from node3"})
    graph.add_node("node4", lambda s: {"my_key": "from node4"})
    graph.add_edge(START, "node1")
    graph.add_edge("node1", "node2")
    graph.add_edge("node2", "node3")
    graph.add_edge("node3", "node4")
    graph.add_edge("node4", END)
    return graph


def test_partial_execution_node2_to_node3():
    """只测试 node2 → node3 这一段"""
    checkpointer = MemorySaver()
    graph = create_linear_graph()
    compiled = graph.compile(checkpointer=checkpointer)

    config = {"configurable": {"thread_id": "test-1"}}

    # 步骤 1：模拟 node1 已完成，设置进入 node2 时的状态
    compiled.update_state(
        config=config,
        values={"my_key": "simulated_input"},
        as_node="node1",  # 假装这个状态来自 node1
    )

    # 步骤 2：从 node2 开始执行，在 node3 之后停止
    result = compiled.invoke(
        None,  # 传 None 表示"继续执行"
        config=config,
        interrupt_after=["node3"],  # 在 node3 执行完后中断
    )

    assert result["my_key"] == "from node3"
```

**前端类比**：这就像 React Testing Library 中，你可以给组件传入特定的 `initialState` 来测试某个中间状态下的渲染行为，而不需要模拟用户从头开始操作。

**LangGraph 原生语义**：

- `update_state(as_node="node1")`：告诉 checkpointer "把状态记录为 node1 的输出"，所以后续执行会从 node1 的下一个节点（node2）开始
- `interrupt_after=["node3"]`：在 node3 执行完后暂停，node4 不会运行
- 传入 `None` 作为输入：表示"从 checkpoint 恢复执行"

## Mock LLM 调用

在测试中调用真实 LLM 有三个问题：慢、贵、不确定。Mock 是必须的。

### 方式一：替换节点函数

最直接的方式——在测试中用 mock 函数替代真实的 LLM 节点：

```python
from unittest.mock import patch


def real_llm_node(state: dict) -> dict:
    """实际会调用 OpenAI 的节点"""
    from langchain_openai import ChatOpenAI
    llm = ChatOpenAI()
    response = llm.invoke(state["messages"])
    return {"messages": [response]}


def mock_llm_node(state: dict) -> dict:
    """Mock 版本：返回固定响应"""
    return {"messages": [{"role": "ai", "content": "这是 mock 响应"}]}


def test_graph_with_mock_llm():
    """用 mock 节点替代真实 LLM"""
    builder = StateGraph(MessagesState)
    # 用 mock 函数注册节点
    builder.add_node("llm", mock_llm_node)
    builder.add_edge(START, "llm")
    builder.add_edge("llm", END)

    graph = builder.compile()
    result = graph.invoke({"messages": [{"role": "user", "content": "hi"}]})

    assert result["messages"][-1]["content"] == "这是 mock 响应"
```

### 方式二：使用 FakeListLLM

LangChain 提供了测试用的 fake LLM：

```python
from langchain_core.language_models import FakeListLLM


def test_with_fake_llm():
    """使用 LangChain 的 FakeListLLM"""
    fake_llm = FakeListLLM(
        responses=["第一次调用的响应", "第二次调用的响应"]
    )

    # 在你的节点中使用 fake_llm 替代真实模型
    def llm_node(state: dict) -> dict:
        response = fake_llm.invoke("任何输入")
        return {"messages": [{"role": "ai", "content": response}]}

    builder = StateGraph(MessagesState)
    builder.add_node("llm", llm_node)
    builder.add_edge(START, "llm")
    builder.add_edge("llm", END)

    graph = builder.compile()
    result = graph.invoke({"messages": [{"role": "user", "content": "hi"}]})
    assert "第一次调用" in result["messages"][-1]["content"]
```

### 方式三：使用 unittest.mock.patch

对已有代码最小侵入的方式：

```python
from unittest.mock import patch, MagicMock


def test_with_patch():
    """用 patch 拦截 LLM 调用"""
    mock_response = MagicMock()
    mock_response.content = "patched 响应"

    with patch("langchain_openai.ChatOpenAI.invoke", return_value=mock_response):
        # 这里正常构建和执行图
        # 所有对 ChatOpenAI.invoke 的调用都会返回 mock_response
        pass
```

**前端类比**：
- 方式一像给 React 组件传入 mock props
- 方式二像使用 MSW（Mock Service Worker）拦截 API 请求
- 方式三像 Jest 的 `jest.mock('axios')` 模块级 mock

## 测试异步图

如果你的图使用了 `ainvoke` / `astream`，需要用 `pytest-asyncio`：

```python
import pytest


@pytest.mark.asyncio
async def test_async_graph():
    """测试异步图执行"""
    builder = StateGraph(MyState)
    builder.add_node("node1", lambda s: {"my_key": "async result"})
    builder.add_edge(START, "node1")
    builder.add_edge("node1", END)

    graph = builder.compile()
    result = await graph.ainvoke({"my_key": "input"})

    assert result["my_key"] == "async result"
```

## 测试策略总结

### 金字塔模型

```
        ╱╲
       ╱  ╲         全图集成测试（少量）
      ╱    ╲        - 端到端流程验证
     ╱──────╲       - Mock 所有外部调用
    ╱        ╲
   ╱   部分   ╲     部分执行测试（适量）
  ╱   执行测试  ╲    - 验证关键路径段
 ╱──────────────╲
╱   节点 + 边    ╲   单元测试（大量）
╱   单元测试      ╲  - 快速、确定性、无外部依赖
╱──────────────────╲
```

### 实践清单

- [ ] 每个节点函数都有独立的单元测试
- [ ] 每个条件路由函数都有边界值测试
- [ ] 关键流程路径有部分执行测试覆盖
- [ ] 所有 LLM 调用在测试中被 mock
- [ ] 中断-恢复场景有专门的集成测试
- [ ] CI 中运行完整测试套件

## 先修与下一步

**先修内容**：
- [快速开始](/ai/langgraph/guide/quickstart) — 确保你已跑通最小图
- [应用结构](/ai/langgraph/guide/application-structure) — 了解项目文件组织

**下一步**：
- [LangSmith Studio](/ai/langgraph/guide/studio) — 用可视化工具调试你的图
- [可观测性](/ai/langgraph/guide/observability) — 在生产中监控 Agent 行为
- [常见坑与排查](/ai/langgraph/guide/pitfalls) — 避免测试中的常见陷阱

## 参考

- [LangGraph Test](https://langchain-ai.github.io/langgraph/how-tos/test/)
- [pytest Documentation](https://docs.pytest.org/)
- [LangGraph Persistence](https://langchain-ai.github.io/langgraph/concepts/persistence/)

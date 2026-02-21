---
title: MCP 集成
description: MCP 协议概述、三种传输方式、将 MCP 服务器作为 CrewAI 工具使用
---

# MCP 集成

> CrewAI 支持将 **MCP（Model Context Protocol）** 服务器作为工具使用，让 Agent 能够调用外部工具生态。

## 1. MCP 是什么

MCP 是 Anthropic 提出的**模型上下文协议**——一个标准化的协议，让 AI 模型能够与外部工具和数据源交互。

> **前端类比**：MCP 类似 REST API 或 GraphQL——定义了客户端（AI 模型）与服务端（工具提供者）之间的通信标准。不同的是，MCP 专门为 AI 工具调用场景设计。

## 2. 三种传输方式

| 传输方式 | 特点 | 适用场景 |
|----------|------|----------|
| **Stdio** | 标准输入输出，本地进程通信 | 本地开发、CLI 工具 |
| **SSE** | Server-Sent Events，单向流 | Web 服务 |
| **Streamable HTTP** | 可流式 HTTP，双向通信 | 生产环境、远程服务 |

## 3. Stdio 传输（本地工具）

```python
from crewai import Agent, Task, Crew
from crewai.tools import MCPServerAdapter

# 连接本地 MCP 服务器（以文件系统工具为例）
mcp_tools = MCPServerAdapter(
    server_params={
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"]
    }
)

# 启动 MCP 连接并获取工具
with mcp_tools:
    agent = Agent(
        role="文件管理员",
        goal="管理和操作文件",
        backstory="文件系统管理专家",
        tools=mcp_tools.tools  # MCP 工具自动转为 CrewAI 工具
    )

    task = Task(
        description="列出 /tmp 目录下的所有文件",
        expected_output="文件列表",
        agent=agent
    )

    crew = Crew(agents=[agent], tasks=[task])
    result = crew.kickoff()
```

## 4. SSE 传输（远程服务）

```python
from crewai.tools import MCPServerAdapter

mcp_tools = MCPServerAdapter(
    server_params={
        "url": "http://localhost:8080/sse"
    }
)

with mcp_tools:
    agent = Agent(
        role="助手",
        goal="使用远程工具",
        backstory="全能助手",
        tools=mcp_tools.tools
    )
```

## 5. Streamable HTTP 传输

```python
mcp_tools = MCPServerAdapter(
    server_params={
        "url": "http://api.example.com/mcp"
    }
)
```

## 6. 连接多个 MCP 服务器

```python
from crewai.tools import MCPServerAdapter

# 文件系统工具
fs_tools = MCPServerAdapter(
    server_params={
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem", "/data"]
    }
)

# 搜索工具
search_tools = MCPServerAdapter(
    server_params={
        "url": "http://localhost:9090/sse"
    }
)

with fs_tools, search_tools:
    agent = Agent(
        role="研究员",
        goal="搜索并整理信息",
        backstory="资深研究员",
        tools=fs_tools.tools + search_tools.tools  # 合并工具
    )
```

## 7. 安全注意事项

- **信任边界**：仅连接可信的 MCP 服务器
- **权限控制**：MCP 服务器可能有文件系统、网络等访问权限
- **网络安全**：远程 MCP 连接应使用 HTTPS
- **资源限制**：监控 MCP 工具的调用频率和资源消耗

---

**先修**：[Tools 工具系统](/ai/crewai/guide/tools)

**下一步**：
- [可观测性与调试](/ai/crewai/guide/observability) — 监控 Agent 执行
- [CLI 与项目管理](/ai/crewai/guide/cli) — 管理 CrewAI 项目

**参考**：
- [🔗 CrewAI MCP Overview (Official)](https://docs.crewai.com/en/mcp/overview){target="_blank" rel="noopener"}
- [🔗 MCP Protocol (Official)](https://modelcontextprotocol.io){target="_blank" rel="noopener"}

---
title: Tools 工具系统
description: 工具分类概览、代表性工具使用、自定义工具创建、异步工具与缓存
---

# 🔥 Tools 工具系统

> Tool 是 Agent 可以调用的**外部能力**——搜索网页、读取文件、查询数据库等。CrewAI 提供 40+ 预构建工具，也支持自定义。

## 1. 工具概览

CrewAI 的工具分为 **8 大类**：

| 类别 | 代表工具 | 用途 |
|------|----------|------|
| **文件与文档** | FileReadTool, PDFSearchTool, CSVSearchTool | 读取和搜索各类文件 |
| **网页抓取** | ScrapeWebsiteTool, FirecrawlScrapeWebsiteTool | 网页内容提取 |
| **搜索与研究** | SerperDevTool, YoutubeVideoSearchTool | 搜索引擎和视频搜索 |
| **数据库** | PGSearchTool | 数据库查询 |
| **AI / ML** | DALL-E Tool, Vision Tool, CodeInterpreterTool | 图像生成、代码执行 |
| **云存储** | — | AWS S3 等云服务 |
| **自动化** | ApifyActorsTool, ComposioTool | 自动化工作流 |
| **集成** | LlamaIndexTool | 与其他框架集成 |

## 2. 使用预构建工具

### 2.1 安装

```bash
uv add crewai-tools
```

### 2.2 配置给 Agent

```python
from crewai import Agent
from crewai_tools import SerperDevTool, FileReadTool

# 搜索工具（需要 SERPER_API_KEY 环境变量）
search_tool = SerperDevTool()

# 文件读取工具
file_tool = FileReadTool()

researcher = Agent(
    role="研究员",
    goal="搜集最新信息",
    backstory="资深研究员",
    tools=[search_tool, file_tool]  # 配置工具
)
```

### 2.3 配置给 Task

```python
from crewai import Task

# Task 级别的工具会覆盖 Agent 的工具
task = Task(
    description="搜索 AI 最新动态",
    expected_output="新闻摘要",
    agent=researcher,
    tools=[search_tool]  # 仅此任务可用
)
```

## 3. 常用工具示例

### 3.1 SerperDevTool（网络搜索）

```python
from crewai_tools import SerperDevTool

# 需设置环境变量 SERPER_API_KEY
search = SerperDevTool()

agent = Agent(
    role="研究员",
    goal="搜集最新信息",
    backstory="善于搜索的研究员",
    tools=[search]
)
```

### 3.2 FileReadTool（文件读取）

```python
from crewai_tools import FileReadTool

# 读取任意文件
file_reader = FileReadTool()

# 或限定特定文件
file_reader = FileReadTool(file_path="./data/report.md")
```

### 3.3 PDFSearchTool（PDF 搜索）

```python
from crewai_tools import PDFSearchTool

pdf_tool = PDFSearchTool(pdf="./docs/whitepaper.pdf")
```

## 4. 创建自定义工具

### 4.1 继承 BaseTool（推荐）

```python
from crewai.tools import BaseTool
from pydantic import BaseModel, Field
from typing import Type

class WeatherInput(BaseModel):
    """工具输入参数定义"""
    city: str = Field(..., description="城市名称")

class WeatherTool(BaseTool):
    name: str = "天气查询"
    description: str = "查询指定城市的当前天气信息"
    args_schema: Type[BaseModel] = WeatherInput

    def _run(self, city: str) -> str:
        # 实际项目中调用天气 API
        return f"{city} 当前天气：晴，25°C"

# 使用
weather = WeatherTool()
agent = Agent(
    role="助手",
    goal="回答问题",
    backstory="全能助手",
    tools=[weather]
)
```

### 4.2 @tool 装饰器（快速方式）

```python
from crewai.tools import tool

@tool("计算器")
def calculator(expression: str) -> str:
    """计算数学表达式。输入数学表达式字符串。"""
    try:
        result = eval(expression)
        return str(result)
    except Exception as e:
        return f"计算错误: {e}"
```

### 4.3 异步工具

```python
import asyncio
from crewai.tools import tool

@tool("异步数据获取")
async def fetch_data(url: str) -> str:
    """异步获取远程数据"""
    await asyncio.sleep(1)  # 模拟异步请求
    return f"数据来自 {url}"
```

## 5. 工具缓存

默认开启缓存。自定义缓存逻辑：

```python
def should_cache(args, result):
    """仅缓存成功的结果"""
    return "错误" not in result

weather_tool = WeatherTool()
weather_tool.cache_function = should_cache
```

## 6. 限制工具调用次数

```python
from crewai_tools import SerperDevTool

# 整个 Crew 执行期间最多调用 5 次
search = SerperDevTool(max_usage_count=5)
```

---

**先修**：[Agents 智能体](/ai/crewai/guide/agents)

**下一步**：
- [LLMs 模型配置](/ai/crewai/guide/llms) — 配置不同的 AI 模型
- [MCP 集成](/ai/crewai/guide/mcp-integration) — 通过 MCP 协议扩展工具

**参考**：
- [🔗 CrewAI Tools (Official)](https://docs.crewai.com/en/concepts/tools){target="_blank" rel="noopener"}
- [🔗 CrewAI Tools Overview (Official)](https://docs.crewai.com/en/tools/overview){target="_blank" rel="noopener"}

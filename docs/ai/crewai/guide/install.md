---
title: 安装与环境配置
description: Python 版本要求、uv 包管理器、CrewAI CLI 安装、项目创建与目录结构
---

# 安装与环境配置

> 本页将帮助你从零开始搭建 CrewAI 开发环境，创建你的第一个项目骨架。

## 1. 前置要求

### 1.1 Python 版本

CrewAI 要求 **Python >= 3.10 且 < 3.14**。检查当前版本：

```bash
python --version
#> Python 3.12.x
```

如果你来自前端背景，还没有 Python 环境，可以参考本站的 [Python 环境安装指南](/backend/python/guide/setup)。

### 1.2 uv 包管理器

CrewAI 官方推荐使用 **uv** 作为包管理器（类似前端的 pnpm，速度快、依赖解析可靠）。

```bash
# macOS / Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

验证安装：

```bash
uv --version
#> uv 0.6.x
```

> 如果你已经熟悉 uv，可以参考本站的 [uv 详解教程](/backend/python/tooling/dependency-management/uv)。

## 2. 安装 CrewAI CLI

```bash
uv tool install crewai
```

验证安装：

```bash
crewai version
#> crewai version 0.114.x
```

> **前端类比**：`uv tool install crewai` 类似 `npm install -g create-react-app`——安装一个全局 CLI 工具用于创建和管理项目。

## 3. 创建项目

```bash
crewai create crew my_first_crew
```

这会生成一个完整的项目骨架：

```
my_first_crew/
├── .gitignore
├── pyproject.toml          # 项目配置（类似 package.json）
├── README.md
├── .env                    # API Keys 配置
├── knowledge/              # 知识库文件目录
└── src/
    └── my_first_crew/
        ├── __init__.py
        ├── main.py         # 入口文件（类似 index.js）
        ├── crew.py         # Crew 编排定义（核心文件）
        ├── tools/          # 自定义工具目录
        │   ├── custom_tool.py
        │   └── __init__.py
        └── config/
            ├── agents.yaml # Agent 角色定义
            └── tasks.yaml  # Task 任务定义
```

> **前端类比**：这和 `npx create-next-app` 生成的项目结构非常像——有入口文件、配置文件和模块化的目录结构。`pyproject.toml` 对应 `package.json`，`.env` 用于存放 API 密钥。

### 3.1 关键文件说明

| 文件 | 作用 | 前端对应 |
|------|------|----------|
| `pyproject.toml` | 项目元信息与依赖声明 | `package.json` |
| `.env` | 环境变量（API Keys） | `.env.local` |
| `main.py` | 启动入口 | `index.js` / `main.ts` |
| `crew.py` | Crew/Agent/Task 编排 | 业务逻辑主文件 |
| `config/agents.yaml` | Agent 角色声明 | 组件配置 |
| `config/tasks.yaml` | Task 任务声明 | 路由配置 |

## 4. 配置 API Keys

CrewAI 默认使用 OpenAI 模型。在 `.env` 文件中配置：

```bash
# .env
OPENAI_API_KEY=sk-your-openai-key

# 如果使用其他提供商（可选）
ANTHROPIC_API_KEY=your-anthropic-key
SERPER_API_KEY=your-serper-key  # 搜索工具
```

> 支持的 LLM 提供商非常丰富（OpenAI、Anthropic、Google Gemini、Ollama 等），详见 [LLMs 模型配置](/ai/crewai/guide/llms)。

## 5. 安装依赖并运行

```bash
cd my_first_crew

# 安装项目依赖（类似 npm install）
crewai install

# 运行项目（类似 npm run dev）
crewai run
```

如果需要添加额外的 Python 包：

```bash
uv add <package-name>
```

## 6. 常用 CLI 命令速查

| 命令 | 作用 | 前端类比 |
|------|------|----------|
| `crewai create crew <name>` | 创建新项目 | `npx create-next-app` |
| `crewai install` | 安装依赖 | `npm install` |
| `crewai run` | 运行项目 | `npm run dev` |
| `crewai test` | 测试 Crew | `npm test` |
| `crewai version` | 查看版本 | `node --version` |

---

**先修**：[CrewAI 概览](/ai/crewai/guide/overview)

**下一步**：
- [快速上手：第一个 Crew](/ai/crewai/guide/quickstart-crew) — 创建你的第一个多 Agent 团队
- [快速上手：第一个 Flow](/ai/crewai/guide/quickstart-flow) — 构建你的第一个工作流

**参考**：
- [🔗 CrewAI Installation (Official)](https://docs.crewai.com/en/installation){target="_blank" rel="noopener"}

---
title: CLI 与项目管理
description: CrewAI CLI 命令列表、项目结构管理、YAML 配置文件编写规范
---

# CLI 与项目管理

> CrewAI 提供了完善的 CLI 工具，帮助你创建、运行、测试和管理项目。

## 1. 命令速查表

| 命令 | 说明 |
|------|------|
| `crewai create crew <name>` | 创建 Crew 项目 |
| `crewai create flow <name>` | 创建 Flow 项目 |
| `crewai install` | 安装项目依赖 |
| `crewai run` | 运行项目 |
| `crewai test` | 测试 Crew 执行 |
| `crewai train -n <次数>` | 训练 Crew（迭代优化） |
| `crewai log-tasks-outputs` | 查看任务输出日志 |
| `crewai login` | 登录 CrewAI 平台 |
| `crewai version` | 查看版本 |

## 2. 项目结构

### 2.1 Crew 项目

```
my_crew/
├── .gitignore
├── pyproject.toml
├── README.md
├── .env
├── knowledge/               # 知识库文件
└── src/
    └── my_crew/
        ├── __init__.py
        ├── main.py          # 入口
        ├── crew.py          # Crew 编排
        ├── tools/
        │   ├── __init__.py
        │   └── custom_tool.py
        └── config/
            ├── agents.yaml  # Agent 配置
            └── tasks.yaml   # Task 配置
```

### 2.2 Flow 项目

```
my_flow/
├── .gitignore
├── pyproject.toml
├── README.md
├── .env
├── knowledge/
└── src/
    └── my_flow/
        ├── __init__.py
        ├── main.py          # 入口
        ├── crews/           # 可包含多个 Crew
        │   └── research/
        │       ├── crew.py
        │       └── config/
        └── config/
```

## 3. YAML 配置规范

### 3.1 agents.yaml

```yaml
# 支持变量插值 {variable_name}
researcher:
  role: >
    {topic} 高级研究员
  goal: >
    对 {topic} 进行全面深入的研究
  backstory: >
    你是一位经验丰富的研究员，擅长从海量信息中
    筛选出最有价值的内容。
  llm: openai/gpt-4o          # 可选：指定 LLM
  # verbose: true              # 可选：详细日志
  # allow_delegation: false    # 可选：允许委托
  # max_iter: 20               # 可选：最大迭代
  # tools:                     # 可选：工具列表
  #   - myCustomTool

analyst:
  role: >
    数据分析师
  goal: >
    分析研究数据并提炼关键洞察
  backstory: >
    严谨的数据分析师，善于发现数据背后的规律。
  llm: anthropic/claude-sonnet-4
```

### 3.2 tasks.yaml

```yaml
research_task:
  description: >
    对 {topic} 进行全面研究，覆盖以下维度：
    1. 市场规模和增长趋势
    2. 主要参与者和竞争格局
    3. 技术发展方向
  expected_output: >
    一份结构化的研究报告，包含以上三个维度的详细数据。
  agent: researcher              # 对应 agents.yaml 中的 key

analysis_task:
  description: >
    基于研究报告，识别 3 个最有前景的机会。
  expected_output: >
    包含 3 个机会的分析报告，含风险评估和优先级。
  agent: analyst
  context:                       # 依赖的任务
    - research_task
  # output_file: reports/analysis.md  # 可选：输出文件
```

### 3.3 配置规则

| 规则 | 说明 |
|------|------|
| Agent key = 方法名 | `agents.yaml` 中的 key 必须与 `crew.py` 中 `@agent` 方法名一致 |
| Task key = 方法名 | `tasks.yaml` 中的 key 必须与 `crew.py` 中 `@task` 方法名一致 |
| 变量插值 | `{variable}` 在 `kickoff(inputs={...})` 时替换 |
| 多行文本 | 使用 YAML 的 `>` 折叠换行符 |

## 4. 训练与测试

### 4.1 测试 Crew

```bash
crewai test
```

### 4.2 训练 Crew

```bash
# 执行 5 轮训练迭代
crewai train -n 5
```

训练会多次执行 Crew，收集人工反馈来优化 Agent 的行为。

### 4.3 查看历史输出

```bash
crewai log-tasks-outputs
```

## 5. 典型工作流

```bash
# 1. 创建项目
crewai create crew research_crew

# 2. 进入项目目录
cd research_crew

# 3. 配置 .env（API Keys）
echo "OPENAI_API_KEY=sk-your-key" > .env

# 4. 编辑 agents.yaml 和 tasks.yaml

# 5. 编辑 crew.py

# 6. 安装依赖
crewai install

# 7. 运行
crewai run

# 8. 测试
crewai test
```

---

**先修**：[安装与环境配置](/ai/crewai/guide/install)

**下一步**：
- [实战：构建研究分析 Crew](/ai/crewai/guide/tutorial-research-crew) — 动手实践
- [实战：构建多步骤 Flow](/ai/crewai/guide/tutorial-flow-workflow) — Flow 实战

**参考**：
- [🔗 CrewAI CLI (Official)](https://docs.crewai.com/en/concepts/cli){target="_blank" rel="noopener"}

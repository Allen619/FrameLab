---
title: SQL Agent 实战
description: 从零构建一个用自然语言查询数据库的 Agent——数据库连接、SQL 工具定义、Agent 创建、安全护栏与生产最佳实践
---

# SQL Agent 实战

## 我们要构建什么

本教程将带你构建一个**SQL Agent**——用户用自然语言提问（如"上个月销量最高的产品是什么？"），Agent 自动将问题翻译为 SQL 查询，执行后以自然语言返回结果。它不只是一个"文本转 SQL"工具，而是一个能理解数据库结构、自主规划查询策略、处理错误并重试的智能 Agent。

完成本教程后，你将拥有一个安全可控、支持多表查询的数据库问答助手。

::: tip 前端类比
SQL Agent 类似于带有 "AI 助手" 功能的数据库管理工具（如 DBeaver、DataGrip 的 AI 插件）。它的工作方式类似一个智能的 API Gateway——接收自然语言请求，内部转换为 SQL 执行，然后将结果格式化返回。你可以把它想象成一个永远不会写错 SQL 语法的后端工程师。
:::

### 先修知识

- 已完成 [环境搭建](/ai/langchain/guide/install)
- 了解 [Agent 实战指南](/ai/langchain/guide/agents) 和 [工具 Tools](/ai/langchain/guide/tools) 的基本用法
- 了解 [安全护栏 Guardrails](/ai/langchain/guide/guardrails) 的基本概念

## SQL Agent 工作流程

Agent 通过一系列工具完成"自然语言到查询结果"的全过程：

```mermaid
flowchart TB
    A([用户自然语言提问]) --> B[Agent 接收消息]
    B --> C[调用 LLM 推理]
    C --> D{分析需求}

    D -->|需要了解数据库| E["调用 list_tables<br/>查看可用表"]
    E --> C

    D -->|需要了解表结构| F["调用 get_table_schema<br/>获取字段信息"]
    F --> C

    D -->|准备好查询| G["调用 execute_query<br/>执行 SQL"]
    G --> H{执行结果}

    H -->|成功| I[将查询结果<br/>送回 LLM]
    I --> C

    H -->|SQL 错误| J[错误信息<br/>送回 LLM]
    J --> C

    D -->|信息充分| K[生成自然语言回答]
    K --> L([返回最终回答])

    style A fill:#e1f5ff
    style L fill:#c8e6c9
    style J fill:#ffcdd2
```

**Agent 的典型执行路径：**

1. 调用 `list_tables` 了解数据库有哪些表
2. 调用 `get_table_schema` 查看相关表的字段和类型
3. 根据表结构生成 SQL 并调用 `execute_query` 执行
4. 如果 SQL 报错，Agent 自动分析错误原因并修正 SQL 重试
5. 拿到查询结果后，用自然语言组织回答

## 前置准备

### 安装依赖

```bash
pip install langchain langchain-openai langchain-community
pip install sqlalchemy
```

本教程使用 SQLite 作为示例数据库，无需额外安装数据库服务。

### 创建示例数据库

构建一个包含用户、产品、订单的示例电商数据库：

```python
# setup_database.py
import sqlite3

conn = sqlite3.connect("ecommerce.db")
cursor = conn.cursor()

# 创建表结构
cursor.executescript("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'customer',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    stock INTEGER DEFAULT 0,
    description TEXT
);

CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    total_price REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
""")

# 插入示例数据
cursor.executemany(
    "INSERT OR IGNORE INTO users (name, email, role) VALUES (?, ?, ?)",
    [
        ("张三", "zhangsan@example.com", "customer"),
        ("李四", "lisi@example.com", "customer"),
        ("王五", "wangwu@example.com", "admin"),
        ("赵六", "zhaoliu@example.com", "customer"),
        ("钱七", "qianqi@example.com", "customer"),
    ],
)

cursor.executemany(
    "INSERT OR IGNORE INTO products (name, category, price, stock, description) VALUES (?, ?, ?, ?, ?)",
    [
        ("MacBook Pro 16", "electronics", 18999.0, 50, "苹果笔记本电脑"),
        ("iPhone 15 Pro", "electronics", 8999.0, 200, "苹果智能手机"),
        ("AirPods Pro", "electronics", 1899.0, 500, "苹果无线耳机"),
        ("Python 编程入门", "books", 79.0, 1000, "Python 基础教程"),
        ("深度学习实战", "books", 129.0, 300, "AI 深度学习指南"),
        ("机械键盘", "accessories", 599.0, 150, "Cherry 轴机械键盘"),
        ("显示器支架", "accessories", 299.0, 200, "桌面显示器支架"),
    ],
)

cursor.executemany(
    "INSERT OR IGNORE INTO orders (user_id, product_id, quantity, total_price, status, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    [
        (1, 2, 1, 8999.0, "completed", "2025-01-15 10:30:00"),
        (1, 3, 2, 3798.0, "completed", "2025-01-15 10:30:00"),
        (2, 1, 1, 18999.0, "completed", "2025-01-20 14:00:00"),
        (2, 4, 1, 79.0, "completed", "2025-01-22 09:00:00"),
        (3, 6, 2, 1198.0, "shipped", "2025-02-01 16:00:00"),
        (4, 2, 1, 8999.0, "pending", "2025-02-05 11:00:00"),
        (4, 5, 1, 129.0, "pending", "2025-02-05 11:00:00"),
        (5, 1, 1, 18999.0, "completed", "2025-02-10 08:00:00"),
        (5, 7, 3, 897.0, "shipped", "2025-02-12 13:00:00"),
        (1, 6, 1, 599.0, "completed", "2025-02-15 15:00:00"),
    ],
)

conn.commit()
conn.close()
print("示例数据库创建完成: ecommerce.db")
```

## Step 1: 建立数据库连接

使用 SQLAlchemy 创建数据库连接，便于后续工具函数使用：

```python
from sqlalchemy import create_engine, text, inspect

# 创建数据库引擎
engine = create_engine("sqlite:///ecommerce.db", echo=False)

# 验证连接
with engine.connect() as conn:
    result = conn.execute(text("SELECT COUNT(*) FROM users"))
    print(f"数据库连接成功，用户表有 {result.scalar()} 条记录")
```

## Step 2: 定义数据库工具

创建三个核心工具，让 Agent 能够探索数据库结构并执行查询：

```python
from langchain.tools import tool
from sqlalchemy import text, inspect


@tool
def list_tables() -> str:
    """列出数据库中所有可用的表名。
    在构建 SQL 查询之前，先调用此工具了解数据库有哪些表。

    Returns:
        所有表名的列表
    """
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    return f"数据库中有以下 {len(tables)} 张表:\n" + "\n".join(
        f"  - {table}" for table in tables
    )


@tool
def get_table_schema(table_name: str) -> str:
    """获取指定表的字段结构（列名、类型、是否可空、主键等）。
    在编写 SQL 查询之前，使用此工具了解表的字段信息。

    Args:
        table_name: 表名，如 'users'、'orders'、'products'
    """
    inspector = inspect(engine)

    # 检查表是否存在
    if table_name not in inspector.get_table_names():
        return f"错误: 表 '{table_name}' 不存在。请先调用 list_tables 查看可用的表。"

    columns = inspector.get_columns(table_name)
    pk = inspector.get_pk_constraint(table_name)
    fks = inspector.get_foreign_keys(table_name)

    result = f"表 '{table_name}' 的结构:\n\n"
    result += "| 列名 | 类型 | 可空 | 默认值 |\n"
    result += "|------|------|------|--------|\n"

    for col in columns:
        nullable = "是" if col.get("nullable", True) else "否"
        default = col.get("default", "-") or "-"
        result += f"| {col['name']} | {col['type']} | {nullable} | {default} |\n"

    if pk and pk.get("constrained_columns"):
        result += f"\n主键: {', '.join(pk['constrained_columns'])}"

    if fks:
        result += "\n外键关系:"
        for fk in fks:
            result += (
                f"\n  - {', '.join(fk['constrained_columns'])} → "
                f"{fk['referred_table']}.{', '.join(fk['referred_columns'])}"
            )

    return result


@tool
def execute_query(sql: str) -> str:
    """执行 SQL 查询并返回结果。仅支持 SELECT 查询，禁止执行任何修改操作。

    Args:
        sql: SQL SELECT 查询语句。禁止使用 INSERT、UPDATE、DELETE、DROP、
             ALTER、CREATE 等修改数据的语句。
    """
    # 安全检查：只允许 SELECT 查询
    sql_upper = sql.strip().upper()
    forbidden_keywords = [
        "INSERT", "UPDATE", "DELETE", "DROP", "ALTER",
        "CREATE", "TRUNCATE", "REPLACE", "MERGE",
    ]

    for keyword in forbidden_keywords:
        if keyword in sql_upper.split():
            return (
                f"安全限制: 禁止执行 {keyword} 操作。"
                f"此工具仅支持 SELECT 查询。"
            )

    if not sql_upper.startswith("SELECT"):
        return "安全限制: 查询必须以 SELECT 开头。"

    try:
        with engine.connect() as conn:
            result = conn.execute(text(sql))
            rows = result.fetchall()
            columns = list(result.keys())

            if not rows:
                return "查询执行成功，但没有返回任何数据。"

            # 限制返回行数，防止结果过大
            max_rows = 50
            truncated = len(rows) > max_rows
            display_rows = rows[:max_rows]

            # 格式化为表格
            output = f"查询返回 {len(rows)} 行数据"
            if truncated:
                output += f"（仅显示前 {max_rows} 行）"
            output += ":\n\n"

            # 表头
            output += " | ".join(columns) + "\n"
            output += " | ".join(["---"] * len(columns)) + "\n"

            # 数据行
            for row in display_rows:
                output += " | ".join(str(v) for v in row) + "\n"

            return output

    except Exception as e:
        return (
            f"SQL 执行错误: {str(e)}\n"
            f"请检查 SQL 语法是否正确，表名和列名是否存在。\n"
            f"原始 SQL: {sql}"
        )
```

**工具设计要点：**

- `list_tables`：让 Agent 知道数据库有哪些表，避免猜测表名
- `get_table_schema`：让 Agent 了解字段信息，生成正确的 SQL
- `execute_query`：执行查询并返回格式化的结果，包含安全检查

## Step 3: 构建 SQL Agent

```python
from langchain.agents import create_agent

SYSTEM_PROMPT = """你是一个数据库查询助手，能够将用户的自然语言问题转换为 SQL 查询并返回结果。

## 工作流程
1. 先调用 list_tables 了解数据库有哪些表
2. 对相关的表调用 get_table_schema 了解表结构
3. 根据用户问题编写 SQL 查询
4. 调用 execute_query 执行查询
5. 用自然语言总结查询结果

## 重要规则
- 只使用 SELECT 查询，绝不修改数据
- SQL 语法使用 SQLite 方言
- 不要猜测表名或列名，先查看 schema
- 如果查询报错，分析错误原因并修正 SQL 后重试
- 处理 NULL 值时使用 COALESCE 或 IS NULL
- 回答时附上你使用的 SQL 查询，方便用户验证

## 回答格式
1. 直接回答用户问题
2. 附上查询使用的 SQL
3. 如有必要，补充数据说明或建议"""

agent = create_agent(
    model="anthropic:claude-sonnet-4-5-20250929",
    tools=[list_tables, get_table_schema, execute_query],
    prompt=SYSTEM_PROMPT,
    recursion_limit=15,  # SQL 场景可能需要多轮工具调用
)
```

## Step 4: 测试自然语言查询

```python
def ask_db(question: str):
    """便捷的数据库问答函数"""
    result = agent.invoke(
        {"messages": [{"role": "user", "content": question}]}
    )
    answer = result["messages"][-1].content
    print(f"Q: {question}")
    print(f"A: {answer}")
    print("-" * 60)
    return answer


# 测试 1：简单查询
ask_db("数据库里有多少个用户？")

# 测试 2：过滤查询
ask_db("电子产品类别下有哪些商品？价格分别是多少？")

# 测试 3：聚合查询
ask_db("每个用户的总消费金额是多少？按消费从高到低排列")

# 测试 4：多表关联
ask_db("张三买了哪些商品？")

# 测试 5：复杂分析
ask_db("哪个产品类别的销售额最高？")

# 测试 6：时间范围查询
ask_db("2025年2月份的订单有多少？总金额是多少？")
```

## Step 5: 添加安全护栏

### 查询复杂度限制

防止 Agent 生成过于复杂或消耗资源的查询：

```python
import re


@tool
def execute_query_safe(sql: str) -> str:
    """执行经过安全检查的 SQL 查询。包含查询复杂度限制和超时保护。

    Args:
        sql: SQL SELECT 查询语句
    """
    sql_upper = sql.strip().upper()

    # 基础安全检查
    forbidden = ["INSERT", "UPDATE", "DELETE", "DROP", "ALTER", "CREATE", "TRUNCATE"]
    for kw in forbidden:
        if kw in sql_upper.split():
            return f"安全限制: 禁止执行 {kw} 操作。"

    if not sql_upper.startswith("SELECT"):
        return "安全限制: 查询必须以 SELECT 开头。"

    # 复杂度检查
    join_count = sql_upper.count("JOIN")
    if join_count > 3:
        return f"复杂度限制: 查询包含 {join_count} 个 JOIN，最多允许 3 个。请简化查询。"

    subquery_count = sql_upper.count("SELECT") - 1
    if subquery_count > 2:
        return f"复杂度限制: 查询包含 {subquery_count} 个子查询，最多允许 2 个。请简化查询。"

    # 防止 LIKE '%...%' 全表扫描
    if re.search(r"LIKE\s+'%[^']+%'", sql_upper):
        pass  # 允许但记录日志

    # 强制添加 LIMIT（如果没有）
    if "LIMIT" not in sql_upper:
        sql = sql.rstrip(";") + " LIMIT 100;"

    try:
        with engine.connect() as conn:
            result = conn.execute(text(sql))
            rows = result.fetchall()
            columns = list(result.keys())

            if not rows:
                return "查询成功，无数据返回。"

            output = f"返回 {len(rows)} 行:\n\n"
            output += " | ".join(columns) + "\n"
            output += " | ".join(["---"] * len(columns)) + "\n"
            for row in rows[:50]:
                output += " | ".join(str(v) for v in row) + "\n"

            return output

    except Exception as e:
        return f"SQL 错误: {str(e)}\n请检查语法后重试。"
```

### 查询审计日志

记录所有查询，便于安全审计和问题排查：

```python
import logging
from datetime import datetime

# 配置审计日志
audit_logger = logging.getLogger("sql_audit")
audit_logger.setLevel(logging.INFO)
handler = logging.FileHandler("sql_audit.log", encoding="utf-8")
handler.setFormatter(
    logging.Formatter("%(asctime)s | %(message)s")
)
audit_logger.addHandler(handler)


@tool
def execute_query_audited(sql: str) -> str:
    """执行 SQL 查询（带审计日志）。所有查询会被记录到审计日志中。

    Args:
        sql: SQL SELECT 查询语句
    """
    # 记录查询到审计日志
    audit_logger.info(f"SQL: {sql}")

    sql_upper = sql.strip().upper()
    if not sql_upper.startswith("SELECT"):
        audit_logger.warning(f"BLOCKED: 非 SELECT 查询被拦截: {sql}")
        return "安全限制: 仅支持 SELECT 查询。"

    try:
        with engine.connect() as conn:
            start_time = datetime.now()
            result = conn.execute(text(sql))
            rows = result.fetchall()
            duration = (datetime.now() - start_time).total_seconds()

            audit_logger.info(
                f"RESULT: {len(rows)} rows, {duration:.3f}s"
            )

            columns = list(result.keys())
            if not rows:
                return "查询成功，无数据返回。"

            output = f"返回 {len(rows)} 行 (耗时 {duration:.3f}s):\n\n"
            output += " | ".join(columns) + "\n"
            output += " | ".join(["---"] * len(columns)) + "\n"
            for row in rows[:50]:
                output += " | ".join(str(v) for v in row) + "\n"
            return output

    except Exception as e:
        audit_logger.error(f"ERROR: {str(e)}, SQL: {sql}")
        return f"SQL 错误: {str(e)}"
```

## 完整代码

```python
"""
sql_agent.py — 完整的 SQL 数据库问答 Agent
"""

from langchain.agents import create_agent
from langchain.tools import tool
from sqlalchemy import create_engine, text, inspect

# ========== 数据库连接 ==========

engine = create_engine("sqlite:///ecommerce.db", echo=False)

# ========== 工具定义 ==========


@tool
def list_tables() -> str:
    """列出数据库中所有可用的表名。

    Returns:
        所有表名的列表
    """
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    return f"数据库有 {len(tables)} 张表:\n" + "\n".join(
        f"  - {t}" for t in tables
    )


@tool
def get_table_schema(table_name: str) -> str:
    """获取指定表的字段结构。

    Args:
        table_name: 表名，如 'users'、'orders'
    """
    inspector = inspect(engine)
    if table_name not in inspector.get_table_names():
        return f"表 '{table_name}' 不存在。请先调用 list_tables。"

    columns = inspector.get_columns(table_name)
    fks = inspector.get_foreign_keys(table_name)

    result = f"表 '{table_name}' 结构:\n"
    for col in columns:
        result += f"  - {col['name']}: {col['type']}"
        if not col.get("nullable", True):
            result += " (NOT NULL)"
        result += "\n"

    if fks:
        result += "外键:\n"
        for fk in fks:
            result += (
                f"  - {', '.join(fk['constrained_columns'])} → "
                f"{fk['referred_table']}.{', '.join(fk['referred_columns'])}\n"
            )
    return result


@tool
def execute_query(sql: str) -> str:
    """执行只读 SQL 查询。禁止 INSERT/UPDATE/DELETE/DROP 等修改操作。

    Args:
        sql: SQL SELECT 查询语句
    """
    sql_upper = sql.strip().upper()
    forbidden = ["INSERT", "UPDATE", "DELETE", "DROP", "ALTER", "CREATE", "TRUNCATE"]
    for kw in forbidden:
        if kw in sql_upper.split():
            return f"安全限制: 禁止 {kw} 操作。"

    if not sql_upper.startswith("SELECT"):
        return "安全限制: 必须以 SELECT 开头。"

    if "LIMIT" not in sql_upper:
        sql = sql.rstrip(";") + " LIMIT 100;"

    try:
        with engine.connect() as conn:
            result = conn.execute(text(sql))
            rows = result.fetchall()
            columns = list(result.keys())
            if not rows:
                return "查询成功，无数据。"

            output = f"返回 {len(rows)} 行:\n\n"
            output += " | ".join(columns) + "\n"
            output += " | ".join(["---"] * len(columns)) + "\n"
            for row in rows[:50]:
                output += " | ".join(str(v) for v in row) + "\n"
            return output
    except Exception as e:
        return f"SQL 错误: {str(e)}\n请检查语法后重试。"


# ========== 构建 Agent ==========

agent = create_agent(
    model="anthropic:claude-sonnet-4-5-20250929",
    tools=[list_tables, get_table_schema, execute_query],
    prompt="""你是数据库查询助手。工作流程：
1. list_tables 了解数据库结构
2. get_table_schema 查看表字段
3. 编写 SQL 并 execute_query 执行
4. 用自然语言总结结果

规则：只用 SELECT 查询，不猜测表名列名，回答时附上 SQL。""",
    recursion_limit=15,
)


# ========== 交互测试 ==========

def ask(question: str) -> str:
    result = agent.invoke(
        {"messages": [{"role": "user", "content": question}]}
    )
    return result["messages"][-1].content


if __name__ == "__main__":
    print(ask("数据库里有哪些表？每张表有多少条数据？"))
    print("=" * 60)
    print(ask("每个用户的总消费金额是多少？"))
    print("=" * 60)
    print(ask("哪个产品类别的销量最高？"))
```

## 安全注意事项

### SQL 注入防护

虽然 Agent 生成的 SQL 来自 LLM 而非用户直接输入，但仍需防范 Prompt Injection 攻击——恶意用户可能通过精心构造的提问诱导 LLM 生成破坏性 SQL：

```python
# 多层防护策略

# 第 1 层：工具内部的关键词过滤（已实现）
# 第 2 层：数据库层面使用只读账号
engine_readonly = create_engine(
    "postgresql://readonly_user:password@localhost:5432/mydb",
    # SQLite 可使用 URI 模式限制为只读
    # "sqlite:///file:ecommerce.db?mode=ro&uri=true"
)

# 第 3 层：在系统提示词中明确禁止
SYSTEM_PROMPT = """...
## 绝对禁止
- 不要执行任何修改数据的操作（INSERT、UPDATE、DELETE）
- 不要执行任何修改数据库结构的操作（CREATE、DROP、ALTER）
- 如果用户要求执行以上操作，拒绝并说明原因
..."""
```

### 权限控制

不同用户应该只能查询自己有权限访问的数据：

```python
@tool
def execute_query_with_rbac(sql: str, user_role: str = "viewer") -> str:
    """执行带权限检查的 SQL 查询。

    Args:
        sql: SQL SELECT 查询语句
        user_role: 用户角色，viewer 只能查看非敏感数据
    """
    sql_upper = sql.strip().upper()

    # viewer 角色不能查询敏感字段
    if user_role == "viewer":
        sensitive_fields = ["email", "password", "api_key", "token"]
        for field in sensitive_fields:
            if field.upper() in sql_upper:
                return (
                    f"权限不足: viewer 角色无法查询 {field} 字段。"
                    f"请联系管理员获取更高权限。"
                )

    # 继续正常的查询执行...
    return _execute_sql(sql)
```

### 查询结果脱敏

对返回结果中的敏感信息进行脱敏处理：

```python
import re


def mask_sensitive_data(text: str) -> str:
    """对查询结果中的敏感信息进行脱敏"""
    # 脱敏邮箱
    text = re.sub(
        r"(\w{2})\w+@(\w+\.\w+)",
        r"\1***@\2",
        text,
    )
    # 脱敏手机号
    text = re.sub(
        r"(\d{3})\d{4}(\d{4})",
        r"\1****\2",
        text,
    )
    return text
```

## 下一步

- [语义搜索实战](/ai/langchain/guide/tutorial-semantic-search) -- 构建基于向量的语义搜索引擎
- [RAG Agent 实战](/ai/langchain/guide/tutorial-rag-agent) -- 构建基于知识库的问答 Agent
- [安全护栏 Guardrails](/ai/langchain/guide/guardrails) -- 深入学习 Agent 安全机制
- [工具 Tools](/ai/langchain/guide/tools) -- 高级工具模式：异步工具、动态工具

## 参考资源

- [LangChain SQL 教程](https://python.langchain.com/docs/tutorials/sql_qa/)
- [SQLAlchemy 官方文档](https://docs.sqlalchemy.org/)
- [LangChain Agents 文档](https://python.langchain.com/docs/concepts/agents/)
- [OWASP SQL Injection 防护指南](https://owasp.org/www-community/attacks/SQL_Injection)

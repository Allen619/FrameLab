---
title: typer - 现代 CLI 框架
description: Python typer 基于类型提示的现代 CLI 框架
---

# typer 现代 CLI 框架

## 本章目标

- 掌握 typer 的 CLI 构建
- 理解类型提示驱动的参数定义
- 学习命令组与嵌套命令
- 对比 click 与 TypeScript CLI 差异

## 对比

typer 是基于 click 的高层级 CLI 框架，用 Python 类型提示自动生成命令行接口。

| typer 特性 | click | 说明 |
|-----------|-------|------|
| 类型注解 | 装饰器 | 参数定义方式 |
| 自动补全 | 手动配置 | Shell 补全 |
| 更少代码 | 更多控制 | 开发效率 |
| Rich 集成 | 基础输出 | 终端美化 |

## 安装

```bash
pip install typer

# 包含 rich 支持
pip install "typer[all]"

# poetry
poetry add typer
```

## 基础用法

### 简单命令

```python
import typer

def main(name: str):
    """简单的问候程序"""
    print(f"Hello {name}!")

if __name__ == "__main__":
    typer.run(main)
```

```bash
python hello.py Alice
# Hello Alice!

python hello.py --help
# Usage: hello.py [OPTIONS] NAME
# 简单的问候程序
```

### 可选参数

```python
import typer
from typing import Optional

def main(
    name: str,
    formal: bool = False,
    count: int = 1
):
    """带可选参数的问候"""
    greeting = "Good day" if formal else "Hello"
    for _ in range(count):
        print(f"{greeting} {name}!")

if __name__ == "__main__":
    typer.run(main)
```

```bash
python hello.py Alice
# Hello Alice!

python hello.py Alice --formal --count 2
# Good day Alice!
# Good day Alice!
```

### 类型自动转换

```python
import typer
from pathlib import Path
from datetime import datetime
from enum import Enum

class Color(str, Enum):
    red = "red"
    green = "green"
    blue = "blue"

def main(
    path: Path,                    # 自动转 Path
    count: int = 1,                # 整数
    rate: float = 0.5,             # 浮点
    verbose: bool = False,         # 布尔标志
    color: Color = Color.green,    # 枚举选项
):
    """类型自动转换示例"""
    print(f"Path: {path} (exists: {path.exists()})")
    print(f"Count: {count}, Rate: {rate}")
    print(f"Verbose: {verbose}, Color: {color.value}")

if __name__ == "__main__":
    typer.run(main)
```

## 选项与参数

### Option 详细配置

```python
import typer
from typing import Annotated

def main(
    name: Annotated[str, typer.Option(
        "--name", "-n",
        help="用户名",
        prompt="请输入名字"
    )],
    password: Annotated[str, typer.Option(
        "--password", "-p",
        help="密码",
        prompt=True,
        hide_input=True
    )],
    age: Annotated[int, typer.Option(
        min=0, max=150,
        help="年龄"
    )] = 0,
):
    """带详细配置的选项"""
    print(f"Hello {name}, age {age}")

if __name__ == "__main__":
    typer.run(main)
```

### Argument 配置

```python
import typer
from typing import Annotated, List

def main(
    name: Annotated[str, typer.Argument(help="用户名")],
    files: Annotated[List[Path], typer.Argument(help="文件列表")] = None,
):
    """位置参数配置"""
    print(f"Name: {name}")
    if files:
        for f in files:
            print(f"File: {f}")

if __name__ == "__main__":
    typer.run(main)
```

## 命令组

### 多命令应用

```python
import typer

app = typer.Typer(help="用户管理工具")

@app.command()
def create(name: str, age: int = 0):
    """创建用户"""
    print(f"创建用户: {name}, 年龄: {age}")

@app.command()
def delete(name: str, force: bool = False):
    """删除用户"""
    if force or typer.confirm(f"确定删除 {name}?"):
        print(f"已删除用户: {name}")

@app.command()
def list():
    """列出所有用户"""
    users = ["Alice", "Bob", "Charlie"]
    for user in users:
        print(f"- {user}")

if __name__ == "__main__":
    app()
```

```bash
python app.py create Alice --age 25
# 创建用户: Alice, 年龄: 25

python app.py delete Bob
# 确定删除 Bob? [y/N]: y
# 已删除用户: Bob

python app.py list
# - Alice
# - Bob
# - Charlie
```

### 嵌套命令组

```python
import typer

app = typer.Typer(help="项目管理工具")
db_app = typer.Typer(help="数据库命令")
user_app = typer.Typer(help="用户命令")

app.add_typer(db_app, name="db")
app.add_typer(user_app, name="user")

@db_app.command("init")
def db_init():
    """初始化数据库"""
    print("数据库初始化完成")

@db_app.command("migrate")
def db_migrate(version: str = "latest"):
    """迁移数据库"""
    print(f"迁移到版本: {version}")

@user_app.command("create")
def user_create(name: str):
    """创建用户"""
    print(f"创建用户: {name}")

@user_app.command("list")
def user_list():
    """列出用户"""
    print("用户列表...")

if __name__ == "__main__":
    app()
```

```bash
python app.py db init
# 数据库初始化完成

python app.py user create Alice
# 创建用户: Alice
```

## 高级功能

### 回调函数

```python
import typer
from typing import Optional

app = typer.Typer()
state = {"verbose": False}

@app.callback()
def main(
    verbose: bool = typer.Option(False, "--verbose", "-v", help="详细模式")
):
    """全局回调，处理全局选项"""
    state["verbose"] = verbose

@app.command()
def create(name: str):
    """创建资源"""
    if state["verbose"]:
        print(f"详细: 正在创建 {name}...")
    print(f"已创建: {name}")

@app.command()
def delete(name: str):
    """删除资源"""
    if state["verbose"]:
        print(f"详细: 正在删除 {name}...")
    print(f"已删除: {name}")

if __name__ == "__main__":
    app()
```

### Rich 集成

```python
import typer
from rich.console import Console
from rich.table import Table
from rich.progress import track
import time

app = typer.Typer()
console = Console()

@app.command()
def users():
    """显示用户表格"""
    table = Table(title="用户列表")
    table.add_column("ID", style="cyan")
    table.add_column("Name", style="magenta")
    table.add_column("Email", style="green")

    table.add_row("1", "Alice", "alice@example.com")
    table.add_row("2", "Bob", "bob@example.com")
    table.add_row("3", "Charlie", "charlie@example.com")

    console.print(table)

@app.command()
def process():
    """带进度条的处理"""
    for _ in track(range(100), description="处理中..."):
        time.sleep(0.05)
    console.print("[green]处理完成![/green]")

if __name__ == "__main__":
    app()
```

### 上下文对象

```python
import typer
from typing import Annotated

class Config:
    def __init__(self, debug: bool = False):
        self.debug = debug

app = typer.Typer()

@app.callback()
def callback(
    ctx: typer.Context,
    debug: bool = False
):
    """初始化配置"""
    ctx.obj = Config(debug=debug)

@app.command()
def run(ctx: typer.Context):
    """运行命令"""
    config: Config = ctx.obj
    if config.debug:
        print("Debug 模式")
    print("运行中...")

if __name__ == "__main__":
    app()
```

## 实战示例

### 项目脚手架工具

```python
import typer
from pathlib import Path
from typing import Optional
from enum import Enum

class Template(str, Enum):
    basic = "basic"
    web = "web"
    api = "api"

app = typer.Typer(help="项目脚手架工具")

@app.command()
def init(
    name: str = typer.Argument(..., help="项目名称"),
    template: Template = typer.Option(Template.basic, help="项目模板"),
    path: Path = typer.Option(".", help="创建路径"),
):
    """初始化新项目"""
    project_path = path / name

    if project_path.exists():
        typer.secho(f"错误: {project_path} 已存在", fg=typer.colors.RED)
        raise typer.Exit(1)

    project_path.mkdir(parents=True)
    (project_path / "README.md").write_text(f"# {name}\n")
    (project_path / "main.py").write_text('print("Hello World!")\n')

    typer.secho(f"项目 {name} 创建成功!", fg=typer.colors.GREEN)
    typer.echo(f"模板: {template.value}")
    typer.echo(f"路径: {project_path.absolute()}")

@app.command()
def add(
    component: str = typer.Argument(..., help="组件名称"),
    force: bool = typer.Option(False, "--force", "-f", help="强制覆盖"),
):
    """添加组件"""
    typer.echo(f"添加组件: {component}")
    if force:
        typer.echo("(强制模式)")

if __name__ == "__main__":
    app()
```

## 与 click 对比

```python
# typer - 更简洁
import typer

def main(name: str, count: int = 1):
    for _ in range(count):
        print(f"Hello {name}!")

typer.run(main)
```

```python
# click - 更灵活
import click

@click.command()
@click.argument("name")
@click.option("--count", default=1, type=int)
def main(name, count):
    for _ in range(count):
        click.echo(f"Hello {name}!")

if __name__ == "__main__":
    main()
```

## 小结

**核心概念**:
- 类型注解自动生成 CLI
- `typer.Argument`: 位置参数
- `typer.Option`: 命名选项
- `typer.Typer()`: 命令组

**高级功能**:
- Rich 美化输出
- 自动生成帮助
- Shell 自动补全
- 上下文传递

::: tip 最佳实践
- 使用 Annotated 类型提供更多配置
- 配合 Rich 美化输出
- 合理组织命令层级
- 为命令添加文档字符串
:::

::: info 相关库
- `click` - typer 的底层库
- `rich` - 终端美化
- `argparse` - 标准库方案
:::

---
title: rich - 终端美化
description: Python rich 终端美化输出库
---

# rich 终端美化

## 本章目标

- 掌握 rich 的基本用法
- 学习表格、进度条与面板
- 了解语法高亮与 Markdown 渲染
- 对比 Node.js chalk/ora 等工具

## 对比

| Python rich | Node.js | 说明 |
|------------|---------|------|
| `Console.print()` | `console.log()` + chalk | 彩色输出 |
| `Table` | cli-table3 | 表格 |
| `Progress` | ora / cli-progress | 进度条 |
| `Syntax` | highlight.js (CLI) | 语法高亮 |
| `Markdown` | marked-terminal | Markdown |

## 安装

```bash
pip install rich

# poetry
poetry add rich
```

## 基础用法

### Console 输出

```python
from rich.console import Console

console = Console()

# 基本输出
console.print("Hello World!")

# 样式输出
console.print("Hello", style="bold red")
console.print("World", style="italic green on white")

# 内联样式标记
console.print("[bold blue]Hello[/bold blue] [red]World[/red]!")

# 表情符号
console.print(":rocket: Launch! :sparkles:")
```

### 样式系统

```python
from rich.console import Console
from rich.style import Style

console = Console()

# 预定义样式
error_style = Style(color="red", bold=True)
success_style = Style(color="green")

console.print("Error!", style=error_style)
console.print("Success!", style=success_style)

# 样式组合
console.print("Important", style="bold underline yellow")

# 背景色
console.print("Highlighted", style="black on yellow")
```

### 日志输出

```python
from rich.console import Console

console = Console()

# 日志方法
console.log("Starting process...")
console.log("Processing item", 1, "of", 100)

# 带时间戳的日志
console.log("Task completed!", log_locals=True)
```

## 表格

### 基本表格

```python
from rich.console import Console
from rich.table import Table

console = Console()

table = Table(title="用户列表")

# 添加列
table.add_column("ID", style="cyan", justify="center")
table.add_column("Name", style="magenta")
table.add_column("Email", style="green")
table.add_column("Status", justify="center")

# 添加行
table.add_row("1", "Alice", "alice@example.com", "[green]Active[/green]")
table.add_row("2", "Bob", "bob@example.com", "[yellow]Pending[/yellow]")
table.add_row("3", "Charlie", "charlie@example.com", "[red]Inactive[/red]")

console.print(table)
```

### 表格样式

```python
from rich.console import Console
from rich.table import Table

console = Console()

# 无边框表格
table = Table(show_header=True, header_style="bold", box=None)
table.add_column("Key")
table.add_column("Value")
table.add_row("Name", "Alice")
table.add_row("Age", "25")
console.print(table)

# 带边框样式
from rich.box import ROUNDED, DOUBLE, SIMPLE

table = Table(box=ROUNDED, title="Rounded Box")
table.add_column("A")
table.add_column("B")
table.add_row("1", "2")
console.print(table)
```

## 进度条

### 基本进度条

```python
from rich.progress import track
import time

# 简单进度条
for item in track(range(100), description="处理中..."):
    time.sleep(0.05)
```

### 高级进度条

```python
from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn
import time

with Progress(
    SpinnerColumn(),
    TextColumn("[progress.description]{task.description}"),
    BarColumn(),
    TextColumn("[progress.percentage]{task.percentage:>3.0f}%"),
) as progress:
    task1 = progress.add_task("[red]下载...", total=100)
    task2 = progress.add_task("[green]处理...", total=100)
    task3 = progress.add_task("[blue]上传...", total=100)

    while not progress.finished:
        progress.update(task1, advance=0.5)
        progress.update(task2, advance=0.3)
        progress.update(task3, advance=0.9)
        time.sleep(0.02)
```

### 不确定进度

```python
from rich.progress import Progress, SpinnerColumn, TextColumn
import time

with Progress(
    SpinnerColumn(),
    TextColumn("[progress.description]{task.description}"),
    transient=True,  # 完成后消失
) as progress:
    task = progress.add_task("加载中...", total=None)
    time.sleep(3)
    progress.update(task, description="完成!")
```

## 面板与布局

### Panel 面板

```python
from rich.console import Console
from rich.panel import Panel

console = Console()

# 基本面板
console.print(Panel("Hello World"))

# 带标题的面板
console.print(Panel(
    "这是面板内容",
    title="标题",
    subtitle="副标题",
    border_style="green"
))

# 展开面板
console.print(Panel("宽面板", expand=True))
```

### Columns 列布局

```python
from rich.console import Console
from rich.columns import Columns
from rich.panel import Panel

console = Console()

# 多列布局
panels = [
    Panel("第一列", title="1"),
    Panel("第二列", title="2"),
    Panel("第三列", title="3"),
]

console.print(Columns(panels))
```

### Layout 复杂布局

```python
from rich.console import Console
from rich.layout import Layout
from rich.panel import Panel

console = Console()

layout = Layout()

layout.split(
    Layout(name="header", size=3),
    Layout(name="body"),
    Layout(name="footer", size=3),
)

layout["body"].split_row(
    Layout(name="left"),
    Layout(name="right"),
)

layout["header"].update(Panel("Header"))
layout["left"].update(Panel("Left"))
layout["right"].update(Panel("Right"))
layout["footer"].update(Panel("Footer"))

console.print(layout)
```

## 语法高亮

### 代码高亮

```python
from rich.console import Console
from rich.syntax import Syntax

console = Console()

code = '''
def hello(name: str) -> str:
    """问候函数"""
    return f"Hello {name}!"

if __name__ == "__main__":
    print(hello("World"))
'''

syntax = Syntax(code, "python", theme="monokai", line_numbers=True)
console.print(syntax)
```

### Markdown 渲染

```python
from rich.console import Console
from rich.markdown import Markdown

console = Console()

md = """
# 标题

这是一段 **加粗** 和 *斜体* 文本。

## 列表

- 项目 1
- 项目 2
- 项目 3

## 代码

```python
print("Hello World!")
```
"""

markdown = Markdown(md)
console.print(markdown)
```

## 树形结构

```python
from rich.console import Console
from rich.tree import Tree

console = Console()

tree = Tree("[bold blue]项目目录")
src = tree.add("[bold]src")
src.add("main.py")
src.add("utils.py")
components = src.add("[bold]components")
components.add("button.py")
components.add("input.py")

tests = tree.add("[bold]tests")
tests.add("test_main.py")

tree.add("README.md")
tree.add("pyproject.toml")

console.print(tree)
```

## 实时显示

### Live 实时更新

```python
from rich.console import Console
from rich.live import Live
from rich.table import Table
import time
import random

console = Console()

def generate_table() -> Table:
    table = Table(title="实时数据")
    table.add_column("ID")
    table.add_column("Value")
    table.add_column("Status")

    for i in range(5):
        value = random.randint(1, 100)
        status = "[green]OK" if value > 50 else "[red]LOW"
        table.add_row(str(i), str(value), status)

    return table

with Live(generate_table(), console=console, refresh_per_second=4) as live:
    for _ in range(20):
        time.sleep(0.25)
        live.update(generate_table())
```

## 实战示例

### CLI 工具美化

```python
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.progress import track
import time

console = Console()

def main():
    # 欢迎信息
    console.print(Panel.fit(
        "[bold blue]My CLI Tool[/bold blue]\n"
        "Version 1.0.0",
        border_style="blue"
    ))

    # 进度处理
    console.print("\n[bold]Processing files...[/bold]")
    files = ["file1.py", "file2.py", "file3.py", "file4.py", "file5.py"]

    for file in track(files, description="[green]Analyzing"):
        time.sleep(0.5)

    # 结果表格
    table = Table(title="\n[bold]Analysis Results[/bold]")
    table.add_column("File", style="cyan")
    table.add_column("Lines", justify="right")
    table.add_column("Status", justify="center")

    table.add_row("file1.py", "120", "[green]OK[/green]")
    table.add_row("file2.py", "85", "[green]OK[/green]")
    table.add_row("file3.py", "200", "[yellow]Warning[/yellow]")
    table.add_row("file4.py", "45", "[green]OK[/green]")
    table.add_row("file5.py", "0", "[red]Error[/red]")

    console.print(table)

    # 总结
    console.print("\n[bold green]Done![/bold green] 5 files processed.")

if __name__ == "__main__":
    main()
```

## 与 Node.js 工具对比

```python
# Python rich
from rich.console import Console
console = Console()
console.print("[bold red]Error:[/bold red] Something went wrong")
```

```javascript
// Node.js chalk
const chalk = require('chalk')
console.log(chalk.bold.red('Error:') + ' Something went wrong')
```

## 小结

**核心组件**:
- `Console`: 输出控制台
- `Table`: 表格显示
- `Progress`: 进度条
- `Panel`: 面板容器

**高级功能**:
- `Syntax`: 代码高亮
- `Markdown`: Markdown 渲染
- `Tree`: 树形结构
- `Live`: 实时更新

::: tip 最佳实践
- 使用 Console 替代 print
- 合理使用样式标记
- 进度条提升用户体验
- 表格展示结构化数据
:::

::: info 相关库
- `typer` - CLI 框架集成
- `click` - CLI 框架
- `textual` - TUI 应用
:::

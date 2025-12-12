---
title: CLI 工具
description: Python CLI 命令行工具库
---

# CLI 工具

构建命令行工具的 Python 库。

## 库概览

| 库 | 用途 | 最佳场景 |
|----|------|----------|
| click | 装饰器风格，功能强大 | 复杂 CLI 应用 |
| typer | 类型提示，自动补全 | 现代项目 |
| rich | 美化输出，丰富样式 | 终端美化 |

## 选择建议

- **现代项目**: 用 typer + rich
- **复杂应用**: 用 click
- **美化输出**: 用 rich

## 快速选择

| 你的需求 | 推荐 | 原因 |
|----------|------|------|
| 新项目 CLI | ⭐ typer | 类型提示、自动文档、基于click |
| 更底层控制 | click | 功能更全、生态更成熟 |
| 终端美化 | rich | 表格、进度条、语法高亮 |
| 最佳组合 | typer + rich | typer 内置 rich 支持 |

## 文档

- [click](./click.md) - 命令行工具框架
- [typer](./typer.md) - 现代 CLI 框架
- [rich](./rich.md) - 终端美化库

## 快速对比

```python
# click
import click

@click.command()
@click.option('--name', '-n', default='World')
def hello(name):
    click.echo(f'Hello {name}!')

# typer
import typer

def hello(name: str = "World"):
    print(f"Hello {name}!")

typer.run(hello)
```

## Node.js 对比

| Python | Node.js | 说明 |
|--------|---------|------|
| click | commander | CLI 框架 |
| typer | oclif | 现代 CLI |
| rich | chalk + ora | 终端美化 |

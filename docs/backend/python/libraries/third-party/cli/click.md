---
title: click - 命令行工具框架
description: Python click 装饰器风格命令行工具库
---

# click 命令行工具框架

## 本章目标

- 掌握 click 的 CLI 构建
- 理解命令、选项与参数
- 学习命令组与嵌套命令
- 对比 Node.js commander 用法

## 对比

| Python click | Node.js | 说明 |
|-------------|---------|------|
| `@click.command()` | `commander.command()` | 定义命令 |
| `@click.option()` | `.option()` | 选项配置 |
| `@click.argument()` | `.argument()` | 位置参数 |
| `@click.group()` | 子命令 | 命令分组 |

## 安装

```bash
pip install click

# poetry
poetry add click
```

## 基础用法

### 简单命令

```python
import click

@click.command()
def hello():
    """简单的问候程序"""
    click.echo("Hello World!")

if __name__ == "__main__":
    hello()
```

```bash
python hello.py
# Hello World!

python hello.py --help
# Usage: hello.py [OPTIONS]
# 简单的问候程序
```

### 选项 (Options)

```python
import click

@click.command()
@click.option("--name", "-n", default="World", help="要问候的名字")
@click.option("--count", "-c", default=1, type=int, help="问候次数")
@click.option("--verbose", "-v", is_flag=True, help="详细模式")
def hello(name, count, verbose):
    """带选项的问候程序"""
    for _ in range(count):
        if verbose:
            click.echo(f"正在问候: {name}")
        click.echo(f"Hello {name}!")

if __name__ == "__main__":
    hello()
```

```bash
python hello.py --name Alice --count 2
# Hello Alice!
# Hello Alice!

python hello.py -n Bob -c 3 -v
# 正在问候: Bob
# Hello Bob!
# ...
```

### 参数 (Arguments)

```python
import click

@click.command()
@click.argument("name")
@click.argument("count", type=int, default=1)
def greet(name, count):
    """位置参数示例"""
    for _ in range(count):
        click.echo(f"Hello {name}!")

if __name__ == "__main__":
    greet()
```

```bash
python greet.py Alice
# Hello Alice!

python greet.py Alice 3
# Hello Alice!
# Hello Alice!
# Hello Alice!
```

### 选项类型

```python
import click
from pathlib import Path

@click.command()
@click.option("--count", type=int, help="整数")
@click.option("--rate", type=float, help="浮点数")
@click.option("--debug/--no-debug", default=False, help="布尔开关")
@click.option("--level", type=click.Choice(["low", "medium", "high"]))
@click.option("--config", type=click.Path(exists=True), help="配置文件路径")
@click.option("--output", type=click.File("w"), help="输出文件")
def process(count, rate, debug, level, config, output):
    """各种选项类型示例"""
    click.echo(f"Count: {count}, Rate: {rate}")
    click.echo(f"Debug: {debug}, Level: {level}")
    if output:
        output.write("Hello from click!")

if __name__ == "__main__":
    process()
```

## 命令组

### 基本分组

```python
import click

@click.group()
def cli():
    """主命令组"""
    pass

@cli.command()
@click.argument("name")
def hello(name):
    """问候命令"""
    click.echo(f"Hello {name}!")

@cli.command()
@click.argument("name")
def goodbye(name):
    """告别命令"""
    click.echo(f"Goodbye {name}!")

if __name__ == "__main__":
    cli()
```

```bash
python app.py hello Alice
# Hello Alice!

python app.py goodbye Bob
# Goodbye Bob!

python app.py --help
# Usage: app.py [OPTIONS] COMMAND [ARGS]...
# Commands:
#   goodbye  告别命令
#   hello    问候命令
```

### 嵌套命令组

```python
import click

@click.group()
def cli():
    """数据库管理工具"""
    pass

@click.group()
def db():
    """数据库命令"""
    pass

@db.command()
def init():
    """初始化数据库"""
    click.echo("数据库初始化完成")

@db.command()
def migrate():
    """迁移数据库"""
    click.echo("数据库迁移完成")

@click.group()
def user():
    """用户命令"""
    pass

@user.command()
@click.argument("name")
def create(name):
    """创建用户"""
    click.echo(f"创建用户: {name}")

cli.add_command(db)
cli.add_command(user)

if __name__ == "__main__":
    cli()
```

```bash
python app.py db init
# 数据库初始化完成

python app.py user create Alice
# 创建用户: Alice
```

## 高级功能

### 上下文传递

```python
import click

@click.group()
@click.option("--debug/--no-debug", default=False)
@click.pass_context
def cli(ctx, debug):
    """带上下文的命令组"""
    ctx.ensure_object(dict)
    ctx.obj["DEBUG"] = debug

@cli.command()
@click.pass_context
def status(ctx):
    """查看状态"""
    debug = ctx.obj["DEBUG"]
    click.echo(f"Debug mode: {debug}")

if __name__ == "__main__":
    cli()
```

### 确认与提示

```python
import click

@click.command()
@click.option("--name", prompt="请输入名字", help="用户名")
@click.option("--password", prompt=True, hide_input=True, confirmation_prompt=True)
def login(name, password):
    """登录命令"""
    click.echo(f"用户 {name} 登录中...")

@click.command()
@click.confirmation_option(prompt="确定要删除吗?")
def delete():
    """删除命令（需确认）"""
    click.echo("已删除!")

if __name__ == "__main__":
    login()
```

### 进度条

```python
import click
import time

@click.command()
def process():
    """带进度条的处理"""
    items = range(100)

    with click.progressbar(items, label="处理中") as bar:
        for item in bar:
            time.sleep(0.05)  # 模拟处理

    click.echo("处理完成!")

if __name__ == "__main__":
    process()
```

### 彩色输出

```python
import click

@click.command()
def colors():
    """彩色输出示例"""
    click.secho("成功!", fg="green", bold=True)
    click.secho("警告!", fg="yellow")
    click.secho("错误!", fg="red", bg="white")
    click.secho("信息", fg="blue", underline=True)

if __name__ == "__main__":
    colors()
```

## 实战示例

### 文件处理工具

```python
import click
from pathlib import Path

@click.group()
def cli():
    """文件处理工具"""
    pass

@cli.command()
@click.argument("source", type=click.Path(exists=True))
@click.argument("dest", type=click.Path())
@click.option("--force", "-f", is_flag=True, help="强制覆盖")
def copy(source, dest, force):
    """复制文件"""
    src = Path(source)
    dst = Path(dest)

    if dst.exists() and not force:
        if not click.confirm(f"{dest} 已存在，是否覆盖?"):
            click.echo("操作取消")
            return

    dst.write_bytes(src.read_bytes())
    click.secho(f"已复制 {source} -> {dest}", fg="green")

@cli.command()
@click.argument("path", type=click.Path(exists=True))
def info(path):
    """显示文件信息"""
    p = Path(path)
    click.echo(f"文件名: {p.name}")
    click.echo(f"大小: {p.stat().st_size} bytes")
    click.echo(f"类型: {'目录' if p.is_dir() else '文件'}")

if __name__ == "__main__":
    cli()
```

### 配置管理工具

```python
import click
import json
from pathlib import Path

CONFIG_FILE = Path.home() / ".myapp.json"

def load_config():
    if CONFIG_FILE.exists():
        return json.loads(CONFIG_FILE.read_text())
    return {}

def save_config(config):
    CONFIG_FILE.write_text(json.dumps(config, indent=2))

@click.group()
def cli():
    """配置管理工具"""
    pass

@cli.command()
@click.argument("key")
@click.argument("value")
def set(key, value):
    """设置配置项"""
    config = load_config()
    config[key] = value
    save_config(config)
    click.secho(f"已设置 {key} = {value}", fg="green")

@cli.command()
@click.argument("key", required=False)
def get(key):
    """获取配置项"""
    config = load_config()
    if key:
        value = config.get(key, "未设置")
        click.echo(f"{key} = {value}")
    else:
        for k, v in config.items():
            click.echo(f"{k} = {v}")

@cli.command()
@click.argument("key")
def delete(key):
    """删除配置项"""
    config = load_config()
    if key in config:
        del config[key]
        save_config(config)
        click.secho(f"已删除 {key}", fg="yellow")
    else:
        click.secho(f"{key} 不存在", fg="red")

if __name__ == "__main__":
    cli()
```

## 与 Node.js commander 对比

```python
# Python click
import click

@click.command()
@click.option("--name", "-n", default="World")
@click.option("--loud", "-l", is_flag=True)
def hello(name, loud):
    msg = f"Hello {name}!"
    if loud:
        msg = msg.upper()
    click.echo(msg)
```

```javascript
// Node.js commander
const { program } = require('commander')

program
  .option('-n, --name <name>', 'name to greet', 'World')
  .option('-l, --loud', 'loud mode')
  .action((options) => {
    let msg = `Hello ${options.name}!`
    if (options.loud) msg = msg.toUpperCase()
    console.log(msg)
  })

program.parse()
```

## 小结

**核心装饰器**:
- `@click.command()`: 定义命令
- `@click.option()`: 定义选项
- `@click.argument()`: 定义参数
- `@click.group()`: 命令分组

**常用功能**:
- 类型验证与转换
- 彩色输出与进度条
- 确认提示与密码输入
- 上下文传递

::: tip 最佳实践
- 为每个命令添加文档字符串
- 使用类型注解提高可读性
- 合理组织命令层级
- 配合 setuptools 打包分发
:::

::: info 相关库
- `typer` - 基于 click 的现代 CLI
- `rich` - 美化终端输出
- `argparse` - 标准库方案
:::

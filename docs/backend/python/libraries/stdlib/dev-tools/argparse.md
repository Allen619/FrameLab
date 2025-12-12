---
title: argparse - 命令行参数解析
description: Python argparse 模块详解，构建命令行工具
---

# argparse 命令行参数解析

## 学习目标

- 掌握命令行参数的定义和解析
- 学会子命令和参数组的使用
- 理解参数验证和类型转换
- 与 Node.js 命令行工具对比

## 概述

| Python argparse | Node.js (commander/yargs) | 说明 |
|----------------|---------------------------|------|
| `ArgumentParser` | `program` | 解析器 |
| `add_argument()` | `option()/argument()` | 添加参数 |
| `parse_args()` | `parse()` | 解析参数 |
| `add_subparsers()` | `command()` | 子命令 |
| `nargs` | `variadic` | 参数数量 |

## 基本使用

### 创建解析器

```python
import argparse

# 创建解析器
parser = argparse.ArgumentParser(
    prog='myapp',
    description='My awesome application',
    epilog='For more info, visit example.com'
)

# 添加参数
parser.add_argument('filename', help='File to process')
parser.add_argument('-v', '--verbose', action='store_true', help='Verbose output')

# 解析参数
args = parser.parse_args()

print(f"Processing {args.filename}")
if args.verbose:
    print("Verbose mode enabled")
```

```bash
# 使用
python myapp.py input.txt -v
python myapp.py --help
```

```javascript
// Node.js 对比 - commander
const { program } = require('commander')

program
    .name('myapp')
    .description('My awesome application')
    .argument('<filename>', 'File to process')
    .option('-v, --verbose', 'Verbose output')
    .action((filename, options) => {
        console.log(`Processing ${filename}`)
        if (options.verbose) {
            console.log('Verbose mode enabled')
        }
    })

program.parse()
```

### 位置参数 vs 可选参数

```python
import argparse

parser = argparse.ArgumentParser()

# 位置参数 (必需)
parser.add_argument('input', help='Input file')
parser.add_argument('output', help='Output file')

# 可选参数 (以 - 或 -- 开头)
parser.add_argument('-f', '--format', default='json', help='Output format')
parser.add_argument('-c', '--count', type=int, default=1, help='Repeat count')
parser.add_argument('--debug', action='store_true', help='Debug mode')

args = parser.parse_args()
print(args)
# Namespace(input='in.txt', output='out.txt', format='json', count=1, debug=False)
```

```bash
python script.py in.txt out.txt -f yaml -c 5 --debug
```

## 参数类型

### type - 类型转换

```python
import argparse

parser = argparse.ArgumentParser()

# 内置类型
parser.add_argument('--count', type=int, help='Integer count')
parser.add_argument('--ratio', type=float, help='Float ratio')

# 文件类型
parser.add_argument('--input', type=argparse.FileType('r'), help='Input file')
parser.add_argument('--output', type=argparse.FileType('w'), help='Output file')

# 自定义类型函数
def positive_int(value):
    ivalue = int(value)
    if ivalue <= 0:
        raise argparse.ArgumentTypeError(f"{value} is not a positive integer")
    return ivalue

parser.add_argument('--port', type=positive_int, default=8080)

args = parser.parse_args()
```

### choices - 限制选项

```python
import argparse

parser = argparse.ArgumentParser()

parser.add_argument(
    '--format',
    choices=['json', 'yaml', 'xml'],
    default='json',
    help='Output format'
)

parser.add_argument(
    '--level',
    type=int,
    choices=range(1, 6),
    default=3,
    help='Level (1-5)'
)

args = parser.parse_args(['--format', 'csv'])  # 报错！
```

### nargs - 参数数量

```python
import argparse

parser = argparse.ArgumentParser()

# 固定数量
parser.add_argument('--coords', nargs=2, type=float, metavar=('X', 'Y'))

# 零个或多个
parser.add_argument('--tags', nargs='*', default=[])

# 一个或多个
parser.add_argument('files', nargs='+')

# 零个或一个
parser.add_argument('--config', nargs='?', const='default.cfg', default=None)

args = parser.parse_args([
    '--coords', '1.5', '2.5',
    '--tags', 'python', 'cli',
    'file1.txt', 'file2.txt'
])

print(args.coords)  # [1.5, 2.5]
print(args.tags)    # ['python', 'cli']
print(args.files)   # ['file1.txt', 'file2.txt']
```

```javascript
// Node.js commander - variadic
program
    .option('--tags <tags...>', 'Tags')  // 多个参数
    .argument('<files...>', 'Files to process')  // 多个位置参数
```

## 参数动作

### action - 参数行为

```python
import argparse

parser = argparse.ArgumentParser()

# store (默认): 存储值
parser.add_argument('--name', action='store')

# store_const: 存储常量
parser.add_argument('--debug', action='store_const', const=True, default=False)

# store_true / store_false: 布尔标志
parser.add_argument('-v', '--verbose', action='store_true')
parser.add_argument('--no-cache', action='store_false', dest='cache')

# append: 多次使用追加到列表
parser.add_argument('-i', '--include', action='append', default=[])

# count: 计数
parser.add_argument('-v', '--verbose', action='count', default=0)

# version: 显示版本
parser.add_argument('--version', action='version', version='%(prog)s 1.0')

args = parser.parse_args(['-i', 'a', '-i', 'b', '-vvv'])
print(args.include)  # ['a', 'b']
print(args.verbose)  # 3
```

```javascript
// Node.js 对比
program
    .option('-v, --verbose', 'Verbose', (_, prev) => prev + 1, 0)  // 计数
    .option('-i, --include <item>', 'Include', (val, prev) => [...prev, val], [])  // 追加
```

### required - 必需参数

```python
import argparse

parser = argparse.ArgumentParser()

# 位置参数默认必需
parser.add_argument('input')

# 可选参数设为必需
parser.add_argument('--output', '-o', required=True, help='Output file (required)')

# 解析时会检查必需参数
args = parser.parse_args()
```

### default - 默认值

```python
import argparse

parser = argparse.ArgumentParser()

# 简单默认值
parser.add_argument('--count', type=int, default=10)

# SUPPRESS: 不存在时不添加到 namespace
parser.add_argument('--optional', default=argparse.SUPPRESS)

# 环境变量作为默认值
import os
parser.add_argument(
    '--api-key',
    default=os.environ.get('API_KEY', ''),
    help='API key (default: $API_KEY)'
)

args = parser.parse_args([])
print(args.count)  # 10
print(hasattr(args, 'optional'))  # False
```

## 子命令

### 创建子命令

```python
import argparse

parser = argparse.ArgumentParser(prog='git')
subparsers = parser.add_subparsers(dest='command', help='Commands')

# add 子命令
add_parser = subparsers.add_parser('add', help='Add files')
add_parser.add_argument('files', nargs='+', help='Files to add')
add_parser.add_argument('-f', '--force', action='store_true')

# commit 子命令
commit_parser = subparsers.add_parser('commit', help='Commit changes')
commit_parser.add_argument('-m', '--message', required=True, help='Commit message')
commit_parser.add_argument('-a', '--all', action='store_true')

# push 子命令
push_parser = subparsers.add_parser('push', help='Push to remote')
push_parser.add_argument('remote', nargs='?', default='origin')
push_parser.add_argument('branch', nargs='?', default='main')

# 解析
args = parser.parse_args(['commit', '-m', 'Initial commit'])
print(args.command)  # commit
print(args.message)  # Initial commit
```

```javascript
// Node.js commander 子命令
program
    .command('add <files...>')
    .option('-f, --force', 'Force add')
    .action((files, options) => {
        console.log('Adding:', files)
    })

program
    .command('commit')
    .requiredOption('-m, --message <msg>', 'Commit message')
    .option('-a, --all', 'Stage all')
    .action((options) => {
        console.log('Committing:', options.message)
    })

program.parse()
```

### 子命令处理函数

```python
import argparse

def cmd_add(args):
    print(f"Adding files: {args.files}")

def cmd_commit(args):
    print(f"Committing: {args.message}")

parser = argparse.ArgumentParser()
subparsers = parser.add_subparsers()

add_parser = subparsers.add_parser('add')
add_parser.add_argument('files', nargs='+')
add_parser.set_defaults(func=cmd_add)

commit_parser = subparsers.add_parser('commit')
commit_parser.add_argument('-m', '--message', required=True)
commit_parser.set_defaults(func=cmd_commit)

args = parser.parse_args()

# 调用对应的处理函数
if hasattr(args, 'func'):
    args.func(args)
else:
    parser.print_help()
```

## 参数组

### 参数分组显示

```python
import argparse

parser = argparse.ArgumentParser()

# 输入输出组
io_group = parser.add_argument_group('Input/Output', 'File options')
io_group.add_argument('-i', '--input', help='Input file')
io_group.add_argument('-o', '--output', help='Output file')

# 处理选项组
process_group = parser.add_argument_group('Processing', 'Processing options')
process_group.add_argument('--format', choices=['json', 'yaml'])
process_group.add_argument('--compress', action='store_true')

parser.print_help()
# 输出会按组显示参数
```

### 互斥组

```python
import argparse

parser = argparse.ArgumentParser()

# 互斥组 - 只能选一个
group = parser.add_mutually_exclusive_group(required=True)
group.add_argument('-v', '--verbose', action='store_true', help='Verbose output')
group.add_argument('-q', '--quiet', action='store_true', help='Quiet output')

# 解析
args = parser.parse_args(['-v'])
# args = parser.parse_args(['-v', '-q'])  # 错误！不能同时使用
```

## 自定义帮助

### 格式化帮助信息

```python
import argparse

parser = argparse.ArgumentParser(
    formatter_class=argparse.RawDescriptionHelpFormatter,
    description='''
This is a multi-line description.
It preserves formatting.

Examples:
    %(prog)s input.txt -o output.txt
    %(prog)s --verbose input.txt
    ''',
    epilog='Report bugs to: bugs@example.com'
)

parser.add_argument('input')
parser.add_argument('-o', '--output')
parser.add_argument('-v', '--verbose', action='store_true')

# 自定义 usage
parser = argparse.ArgumentParser(
    usage='%(prog)s [options] <input> [output]'
)
```

### metavar - 参数占位符

```python
import argparse

parser = argparse.ArgumentParser()

# 默认使用参数名大写
parser.add_argument('--file', help='File path')  # --file FILE

# 自定义占位符
parser.add_argument('--config', metavar='PATH', help='Config file')  # --config PATH

# 多个值的占位符
parser.add_argument(
    '--size',
    nargs=2,
    type=int,
    metavar=('WIDTH', 'HEIGHT'),
    help='Image size'
)
```

## 实用示例

### 完整 CLI 工具

```python
#!/usr/bin/env python
"""
A complete CLI tool example.
"""
import argparse
import sys

def setup_parser():
    parser = argparse.ArgumentParser(
        prog='mytool',
        description='A powerful CLI tool for processing files',
        formatter_class=argparse.RawDescriptionHelpFormatter
    )

    parser.add_argument(
        '--version',
        action='version',
        version='%(prog)s 1.0.0'
    )

    subparsers = parser.add_subparsers(
        title='commands',
        dest='command',
        metavar='<command>'
    )

    # process 命令
    process_parser = subparsers.add_parser(
        'process',
        help='Process input files',
        description='Process one or more input files'
    )
    process_parser.add_argument('files', nargs='+', help='Input files')
    process_parser.add_argument(
        '-o', '--output',
        default='output',
        help='Output directory (default: output)'
    )
    process_parser.add_argument(
        '-f', '--format',
        choices=['json', 'yaml', 'csv'],
        default='json',
        help='Output format (default: json)'
    )
    process_parser.add_argument(
        '-v', '--verbose',
        action='count',
        default=0,
        help='Increase verbosity (-v, -vv, -vvv)'
    )
    process_parser.set_defaults(func=cmd_process)

    # config 命令
    config_parser = subparsers.add_parser(
        'config',
        help='Manage configuration'
    )
    config_subparsers = config_parser.add_subparsers(dest='config_command')

    config_get = config_subparsers.add_parser('get', help='Get config value')
    config_get.add_argument('key', help='Configuration key')
    config_get.set_defaults(func=cmd_config_get)

    config_set = config_subparsers.add_parser('set', help='Set config value')
    config_set.add_argument('key', help='Configuration key')
    config_set.add_argument('value', help='Configuration value')
    config_set.set_defaults(func=cmd_config_set)

    return parser

def cmd_process(args):
    print(f"Processing {len(args.files)} files")
    print(f"Output: {args.output}")
    print(f"Format: {args.format}")
    if args.verbose >= 1:
        print(f"Files: {args.files}")
    if args.verbose >= 2:
        print("Extra verbose output...")

def cmd_config_get(args):
    print(f"Getting config: {args.key}")

def cmd_config_set(args):
    print(f"Setting config: {args.key} = {args.value}")

def main():
    parser = setup_parser()
    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(1)

    args.func(args)

if __name__ == '__main__':
    main()
```

```bash
# 使用示例
python mytool.py --help
python mytool.py process file1.txt file2.txt -o result -f yaml -vv
python mytool.py config set api_key abc123
python mytool.py config get api_key
```

### 环境变量与配置文件

```python
import argparse
import os
import json

def load_config(config_file):
    """从配置文件加载默认值"""
    if os.path.exists(config_file):
        with open(config_file) as f:
            return json.load(f)
    return {}

def create_parser(defaults=None):
    defaults = defaults or {}

    parser = argparse.ArgumentParser()

    # 优先级: 命令行 > 环境变量 > 配置文件 > 硬编码默认值
    parser.add_argument(
        '--api-key',
        default=os.environ.get('API_KEY', defaults.get('api_key', '')),
        help='API key (env: API_KEY)'
    )

    parser.add_argument(
        '--host',
        default=os.environ.get('HOST', defaults.get('host', 'localhost')),
        help='Server host (env: HOST)'
    )

    parser.add_argument(
        '--port',
        type=int,
        default=int(os.environ.get('PORT', defaults.get('port', 8080))),
        help='Server port (env: PORT)'
    )

    return parser

# 使用
config = load_config('config.json')
parser = create_parser(config)
args = parser.parse_args()
```

### 带验证的参数

```python
import argparse
import os
from pathlib import Path

def existing_file(path):
    """验证文件存在"""
    if not os.path.isfile(path):
        raise argparse.ArgumentTypeError(f"File not found: {path}")
    return path

def existing_dir(path):
    """验证目录存在"""
    if not os.path.isdir(path):
        raise argparse.ArgumentTypeError(f"Directory not found: {path}")
    return path

def valid_port(value):
    """验证端口号"""
    port = int(value)
    if not 1 <= port <= 65535:
        raise argparse.ArgumentTypeError(f"Invalid port: {value} (must be 1-65535)")
    return port

def valid_url(value):
    """验证 URL 格式"""
    from urllib.parse import urlparse
    result = urlparse(value)
    if not all([result.scheme, result.netloc]):
        raise argparse.ArgumentTypeError(f"Invalid URL: {value}")
    return value

parser = argparse.ArgumentParser()
parser.add_argument('--input', type=existing_file, required=True)
parser.add_argument('--output-dir', type=existing_dir, default='.')
parser.add_argument('--port', type=valid_port, default=8080)
parser.add_argument('--url', type=valid_url)

args = parser.parse_args()
```

## 与 Node.js CLI 工具对比

| 特性 | Python argparse | Node.js commander |
|-----|----------------|-------------------|
| 位置参数 | `add_argument('name')` | `argument('<name>')` |
| 可选参数 | `add_argument('-n')` | `option('-n')` |
| 子命令 | `add_subparsers()` | `command()` |
| 类型转换 | `type=int` | 自定义函数 |
| 默认值 | `default=` | `default()` |
| 必需参数 | `required=True` | `requiredOption()` |
| 多值 | `nargs='+'/''` | `<items...>` |

## 小结

**基本参数**:
- 位置参数: `add_argument('name')`
- 可选参数: `add_argument('-n', '--name')`
- 类型: `type=int/float/str`
- 默认值: `default=value`

**参数行为**:
- `action='store_true'`: 布尔标志
- `action='count'`: 计数
- `action='append'`: 追加到列表
- `nargs`: 参数数量控制

**高级功能**:
- `add_subparsers()`: 子命令
- `add_mutually_exclusive_group()`: 互斥参数
- `add_argument_group()`: 参数分组
- `set_defaults(func=)`: 绑定处理函数

::: tip 最佳实践
- 为参数提供清晰的 help 信息
- 使用子命令组织复杂 CLI
- 支持环境变量覆盖默认值
- 使用类型函数验证参数
:::

::: info 相关模块
- `sys.argv` - 访问命令行参数
- `os.environ` - 环境变量访问
- `click` / `typer` - 第三方 CLI 库
:::

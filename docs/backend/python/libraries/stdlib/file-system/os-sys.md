---
title: os/sys - 系统接口
description: Python os 和 sys 模块详解，与 Node.js process/os 模块对比
---

# os/sys 系统接口

## 学习目标

- 掌握 os 模块的文件系统和环境变量操作
- 理解 sys 模块的解释器相关功能
- 与 Node.js 的 `process` 和 `os` 模块对比
- 常见跨平台开发注意事项

## 概述

| Python | Node.js | 说明 |
|--------|---------|------|
| `os.environ` | `process.env` | 环境变量 |
| `os.getcwd()` | `process.cwd()` | 当前工作目录 |
| `os.chdir()` | `process.chdir()` | 切换目录 |
| `sys.argv` | `process.argv` | 命令行参数 |
| `sys.exit()` | `process.exit()` | 退出程序 |
| `os.name` | `process.platform` | 操作系统标识 |

## os 模块

### 环境变量

```python
import os

# 获取环境变量
path = os.environ.get('PATH')
home = os.environ.get('HOME', '/default/path')  # 带默认值

# 获取环境变量（不存在则报错）
try:
    secret = os.environ['SECRET_KEY']
except KeyError:
    print("SECRET_KEY 未设置")

# 设置环境变量（仅当前进程有效）
os.environ['MY_VAR'] = 'my_value'

# 删除环境变量
del os.environ['MY_VAR']

# 获取所有环境变量
for key, value in os.environ.items():
    print(f"{key}={value}")
```

```javascript
// Node.js 对比
const path = process.env.PATH
const home = process.env.HOME || '/default/path'

// 设置环境变量
process.env.MY_VAR = 'my_value'

// 删除环境变量
delete process.env.MY_VAR

// 获取所有环境变量
Object.entries(process.env).forEach(([key, value]) => {
  console.log(`${key}=${value}`)
})
```

### 工作目录

```python
import os

# 获取当前工作目录
cwd = os.getcwd()
print(cwd)  # /Users/alice/project

# 切换工作目录
os.chdir('/tmp')
print(os.getcwd())  # /tmp

# 切换回原目录
os.chdir(cwd)
```

```javascript
// Node.js 对比
const cwd = process.cwd()
console.log(cwd)

process.chdir('/tmp')
console.log(process.cwd())
```

### 文件和目录操作

```python
import os

# 创建目录
os.mkdir('new_dir')           # 创建单层目录
os.makedirs('a/b/c')          # 递归创建目录（类似 mkdir -p）
os.makedirs('a/b/c', exist_ok=True)  # 存在时不报错

# 删除
os.remove('file.txt')         # 删除文件
os.rmdir('empty_dir')         # 删除空目录
os.removedirs('a/b/c')        # 递归删除空目录

# 重命名/移动
os.rename('old.txt', 'new.txt')
os.renames('old/path/file.txt', 'new/path/file.txt')  # 自动创建目录

# 列出目录内容
files = os.listdir('.')
print(files)  # ['file1.txt', 'file2.txt', 'subdir']

# 遍历目录树
for root, dirs, files in os.walk('.'):
    print(f"目录: {root}")
    for f in files:
        print(f"  文件: {f}")
```

```javascript
// Node.js 对比
const fs = require('fs')

// 创建目录
fs.mkdirSync('new_dir')
fs.mkdirSync('a/b/c', { recursive: true })

// 删除
fs.unlinkSync('file.txt')
fs.rmdirSync('empty_dir')
fs.rmSync('a/b/c', { recursive: true })

// 重命名
fs.renameSync('old.txt', 'new.txt')

// 列出目录
const files = fs.readdirSync('.')
```

### 路径操作（os.path）

::: tip 推荐
对于路径操作，推荐使用更现代的 [pathlib](./pathlib.md) 模块
:::

```python
import os.path

# 路径拼接
path = os.path.join('data', 'users', 'config.json')
print(path)  # data/users/config.json (Unix) 或 data\users\config.json (Windows)

# 获取绝对路径
abs_path = os.path.abspath('config.json')

# 路径分解
dirname = os.path.dirname('/home/user/file.txt')   # /home/user
basename = os.path.basename('/home/user/file.txt') # file.txt
name, ext = os.path.splitext('file.txt')           # ('file', '.txt')

# 路径检查
os.path.exists('file.txt')    # 是否存在
os.path.isfile('file.txt')    # 是否为文件
os.path.isdir('data')         # 是否为目录
os.path.isabs('/home/user')   # 是否为绝对路径

# 获取文件信息
size = os.path.getsize('file.txt')   # 文件大小（字节）
mtime = os.path.getmtime('file.txt') # 修改时间（时间戳）
```

```javascript
// Node.js path 对比
const path = require('path')
const fs = require('fs')

const p = path.join('data', 'users', 'config.json')
const abs = path.resolve('config.json')
const dir = path.dirname('/home/user/file.txt')
const base = path.basename('/home/user/file.txt')
const { name, ext } = path.parse('file.txt')

fs.existsSync('file.txt')
fs.statSync('file.txt').isFile()
fs.statSync('file.txt').size
```

### 系统信息

```python
import os

# 操作系统标识
print(os.name)      # 'posix' (Unix/Linux/Mac) 或 'nt' (Windows)

# CPU 核心数
cpu_count = os.cpu_count()
print(f"CPU 核心数: {cpu_count}")

# 终端大小
try:
    size = os.get_terminal_size()
    print(f"终端大小: {size.columns}x{size.lines}")
except OSError:
    print("无法获取终端大小")

# 用户信息
uid = os.getuid()    # Unix 用户 ID
gid = os.getgid()    # Unix 组 ID
login = os.getlogin()  # 登录用户名

# 进程 ID
pid = os.getpid()     # 当前进程 ID
ppid = os.getppid()   # 父进程 ID
```

```javascript
// Node.js os 对比
const os = require('os')

console.log(process.platform) // 'darwin', 'linux', 'win32'
console.log(os.cpus().length) // CPU 核心数
console.log(os.userInfo())    // 用户信息
console.log(process.pid)      // 进程 ID
console.log(process.ppid)     // 父进程 ID
```

## sys 模块

### 命令行参数

```python
import sys

# sys.argv 是命令行参数列表
# 运行: python script.py arg1 arg2
print(sys.argv)       # ['script.py', 'arg1', 'arg2']
print(sys.argv[0])    # 脚本名: 'script.py'
print(sys.argv[1:])   # 参数: ['arg1', 'arg2']

# 实际使用示例
if len(sys.argv) < 2:
    print("用法: python script.py <filename>")
    sys.exit(1)

filename = sys.argv[1]
print(f"处理文件: {filename}")
```

```javascript
// Node.js 对比
// 运行: node script.js arg1 arg2
console.log(process.argv)
// ['node', '/path/to/script.js', 'arg1', 'arg2']

console.log(process.argv[0]) // 'node'
console.log(process.argv[1]) // 脚本路径
console.log(process.argv.slice(2)) // ['arg1', 'arg2']
```

> **关键差异**: Python 的 `sys.argv[0]` 是脚本名，Node.js 的 `process.argv[0]` 是 node 可执行文件路径，`argv[1]` 才是脚本路径。

### 程序退出

```python
import sys

# 正常退出
sys.exit(0)

# 异常退出（非零退出码）
sys.exit(1)

# 带消息退出
sys.exit("发生错误，程序退出")

# 实际使用
def main():
    try:
        # 业务逻辑
        result = do_something()
        return 0
    except Exception as e:
        print(f"错误: {e}", file=sys.stderr)
        return 1

if __name__ == '__main__':
    sys.exit(main())
```

```javascript
// Node.js 对比
process.exit(0) // 正常退出
process.exit(1) // 异常退出

// 退出前执行清理
process.on('exit', (code) => {
  console.log(`退出码: ${code}`)
})
```

### 标准输入输出

```python
import sys

# 标准输出
sys.stdout.write("Hello\n")  # 等同于 print("Hello")

# 标准错误
sys.stderr.write("Error!\n")
print("Error!", file=sys.stderr)

# 标准输入
line = sys.stdin.readline()

# 刷新输出缓冲区
sys.stdout.flush()

# 重定向输出到文件
original_stdout = sys.stdout
sys.stdout = open('output.txt', 'w')
print("这会写入文件")
sys.stdout.close()
sys.stdout = original_stdout
```

```javascript
// Node.js 对比
process.stdout.write('Hello\n')
process.stderr.write('Error!\n')
console.log('stdout')
console.error('stderr')

// 读取 stdin
process.stdin.on('data', (data) => {
  console.log(`收到: ${data}`)
})
```

### Python 解释器信息

```python
import sys

# Python 版本
print(sys.version)        # '3.11.0 (main, Oct 24 2022, ...)'
print(sys.version_info)   # sys.version_info(major=3, minor=11, micro=0, ...)

# 版本检查
if sys.version_info >= (3, 10):
    print("Python 3.10+")

# 平台信息
print(sys.platform)       # 'darwin', 'linux', 'win32'

# 模块搜索路径
print(sys.path)           # ['.', '/usr/lib/python3.11', ...]

# 添加自定义模块路径
sys.path.insert(0, '/my/custom/modules')

# 已导入的模块
print(list(sys.modules.keys())[:10])

# 递归限制
print(sys.getrecursionlimit())  # 默认 1000
sys.setrecursionlimit(2000)     # 修改限制

# 默认编码
print(sys.getdefaultencoding())  # 'utf-8'
```

```javascript
// Node.js 对比
console.log(process.version) // 'v18.12.0'
console.log(process.versions) // { node: '18.12.0', v8: '10.2.154.15', ... }
console.log(process.platform) // 'darwin', 'linux', 'win32'

// 模块路径
console.log(module.paths)
```

## 实用示例

### 跨平台路径处理

```python
import os
import sys

def get_config_dir():
    """获取配置目录（跨平台）"""
    if sys.platform == 'win32':
        base = os.environ.get('APPDATA', os.path.expanduser('~'))
    elif sys.platform == 'darwin':
        base = os.path.expanduser('~/Library/Application Support')
    else:  # Linux 等
        base = os.environ.get('XDG_CONFIG_HOME', os.path.expanduser('~/.config'))

    return os.path.join(base, 'myapp')

config_dir = get_config_dir()
os.makedirs(config_dir, exist_ok=True)
print(f"配置目录: {config_dir}")
```

### 环境变量配置

```python
import os

class Config:
    """从环境变量读取配置"""
    DEBUG = os.environ.get('DEBUG', 'false').lower() == 'true'
    DATABASE_URL = os.environ.get('DATABASE_URL', 'sqlite:///default.db')
    SECRET_KEY = os.environ.get('SECRET_KEY')
    PORT = int(os.environ.get('PORT', 8000))

    @classmethod
    def validate(cls):
        """验证必需的配置"""
        required = ['SECRET_KEY']
        missing = [key for key in required if not getattr(cls, key)]
        if missing:
            raise ValueError(f"缺少必需的环境变量: {', '.join(missing)}")

# 使用
try:
    Config.validate()
except ValueError as e:
    print(f"配置错误: {e}")
    sys.exit(1)
```

```javascript
// Node.js 对比
class Config {
  static DEBUG = process.env.DEBUG?.toLowerCase() === 'true'
  static DATABASE_URL = process.env.DATABASE_URL || 'sqlite:///default.db'
  static SECRET_KEY = process.env.SECRET_KEY
  static PORT = parseInt(process.env.PORT || '8000', 10)

  static validate() {
    const required = ['SECRET_KEY']
    const missing = required.filter((key) => !this[key])
    if (missing.length) {
      throw new Error(`缺少必需的环境变量: ${missing.join(', ')}`)
    }
  }
}
```

### 简单的命令行工具

```python
import sys
import os

def main():
    if len(sys.argv) < 2:
        print("用法: python tool.py <command> [args...]")
        print("命令:")
        print("  list <dir>    - 列出目录内容")
        print("  size <file>   - 显示文件大小")
        print("  env <name>    - 显示环境变量")
        return 1

    command = sys.argv[1]

    if command == 'list':
        dir_path = sys.argv[2] if len(sys.argv) > 2 else '.'
        for item in os.listdir(dir_path):
            print(item)

    elif command == 'size':
        if len(sys.argv) < 3:
            print("错误: 缺少文件参数", file=sys.stderr)
            return 1
        file_path = sys.argv[2]
        size = os.path.getsize(file_path)
        print(f"{file_path}: {size} 字节")

    elif command == 'env':
        name = sys.argv[2] if len(sys.argv) > 2 else None
        if name:
            print(os.environ.get(name, f"<{name} 未设置>"))
        else:
            for k, v in sorted(os.environ.items()):
                print(f"{k}={v}")

    else:
        print(f"未知命令: {command}", file=sys.stderr)
        return 1

    return 0

if __name__ == '__main__':
    sys.exit(main())
```

## 与 JS 的关键差异

| 特性 | Python os/sys | Node.js process/os |
|-----|--------------|-------------------|
| 环境变量访问 | `os.environ['KEY']` | `process.env.KEY` |
| 参数起始索引 | `sys.argv[0]` 是脚本名 | `process.argv[0]` 是 node 路径 |
| 路径分隔符 | `os.sep` (`/` 或 `\`) | `path.sep` |
| 换行符 | `os.linesep` | `os.EOL` |
| 目录遍历 | `os.walk()` 生成器 | 需要递归或第三方库 |
| 异步支持 | 需要 `asyncio` + `aiofiles` | 原生异步 API |

## 常见陷阱

```python
import os
import sys

# 1. 环境变量值都是字符串
os.environ['PORT'] = 8000      # TypeError!
os.environ['PORT'] = '8000'    # 正确

port = int(os.environ.get('PORT', '8000'))  # 需要类型转换

# 2. os.path.join 不处理绝对路径
os.path.join('/home', '/etc', 'passwd')  # '/etc/passwd' - 后面的绝对路径覆盖前面的

# 3. sys.argv 在交互式环境下可能为空
# 在 REPL 中 sys.argv 可能是 ['']

# 4. os.getcwd() 可能抛出异常
# 如果当前目录被删除
try:
    cwd = os.getcwd()
except FileNotFoundError:
    cwd = os.path.expanduser('~')

# 5. 跨平台路径问题
# 避免硬编码路径分隔符
bad = 'data/users/config.json'  # 可能在 Windows 上有问题
good = os.path.join('data', 'users', 'config.json')
```

## 小结

- `os` 模块提供操作系统交互功能：文件操作、环境变量、进程信息
- `sys` 模块提供 Python 解释器相关功能：命令行参数、标准 I/O、模块路径
- 路径操作推荐使用更现代的 `pathlib` 模块
- 环境变量值都是字符串，需要手动类型转换
- 注意跨平台兼容性，使用 `os.path.join()` 而非硬编码路径分隔符

::: info 进阶学习
- [pathlib 路径操作](./pathlib.md) - 更现代的路径处理方式
- [subprocess 子进程](./subprocess.md) - 运行外部命令
- [argparse 命令行](../dev-tools/argparse.md) - 专业的命令行参数解析
:::

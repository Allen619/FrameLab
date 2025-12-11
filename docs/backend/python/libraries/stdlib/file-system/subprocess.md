---
title: subprocess - 子进程管理
description: Python subprocess 模块详解，与 Node.js child_process 对比
---

# subprocess 子进程管理

## 学习目标

- 掌握运行外部命令的各种方式
- 理解输入输出重定向和管道
- 处理命令执行的错误和超时
- 与 Node.js child_process 模块对比

## 概述

| Python subprocess | Node.js child_process | 说明 |
|------------------|----------------------|------|
| `subprocess.run()` | `execSync()` / `spawnSync()` | 运行命令并等待完成 |
| `subprocess.Popen()` | `spawn()` | 异步运行，精细控制 |
| `subprocess.check_output()` | `execSync()` | 获取命令输出 |
| `subprocess.call()` | `execSync()` | 运行命令返回退出码 |

## 基础用法

### run() - 推荐方式

```python
import subprocess

# 最简单的用法
result = subprocess.run(['ls', '-l'])
print(f"退出码: {result.returncode}")

# 捕获输出
result = subprocess.run(
    ['echo', 'Hello World'],
    capture_output=True,
    text=True  # 以字符串返回，否则是 bytes
)
print(result.stdout)  # 'Hello World\n'
print(result.stderr)  # ''

# 检查命令是否成功
result = subprocess.run(['ls', 'nonexistent'], capture_output=True, text=True)
if result.returncode != 0:
    print(f"命令失败: {result.stderr}")

# 自动抛出异常（命令失败时）
try:
    subprocess.run(['false'], check=True)
except subprocess.CalledProcessError as e:
    print(f"命令失败，退出码: {e.returncode}")
```

```javascript
// Node.js 对比
const { execSync, spawnSync } = require('child_process')

// 同步执行
const result = execSync('ls -l', { encoding: 'utf8' })
console.log(result)

// 更多控制
const { status, stdout, stderr } = spawnSync('echo', ['Hello World'], {
  encoding: 'utf8',
})
console.log(stdout) // 'Hello World\n'

// 检查退出码
try {
  execSync('false')
} catch (e) {
  console.log('命令失败')
}
```

### 使用 shell 执行

```python
import subprocess

# shell=True 允许使用 shell 特性（管道、通配符等）
result = subprocess.run(
    'ls -l | grep .py',
    shell=True,
    capture_output=True,
    text=True
)
print(result.stdout)

# 在 shell 中使用环境变量
result = subprocess.run(
    'echo $HOME',
    shell=True,
    capture_output=True,
    text=True
)
print(result.stdout.strip())  # /home/user

# 多条命令
result = subprocess.run(
    'cd /tmp && pwd',
    shell=True,
    capture_output=True,
    text=True
)
```

::: warning 安全警告
`shell=True` 时要小心命令注入！不要直接拼接用户输入。
```python
# 危险！
user_input = "; rm -rf /"
subprocess.run(f"echo {user_input}", shell=True)  # 可能执行恶意命令

# 安全：使用列表形式（不使用 shell）
subprocess.run(['echo', user_input])
```
:::

### 传递输入数据

```python
import subprocess

# 通过 input 参数传递输入
result = subprocess.run(
    ['cat'],
    input='Hello\nWorld\n',
    capture_output=True,
    text=True
)
print(result.stdout)  # 'Hello\nWorld\n'

# 传递二进制数据
result = subprocess.run(
    ['cat'],
    input=b'binary data',
    capture_output=True
)
print(result.stdout)  # b'binary data'

# 模拟交互式输入
result = subprocess.run(
    ['python', '-c', 'name = input("Name: "); print(f"Hello {name}")'],
    input='Alice\n',
    capture_output=True,
    text=True
)
print(result.stdout)  # 'Name: Hello Alice\n'
```

```javascript
// Node.js 对比
const { spawnSync } = require('child_process')

const result = spawnSync('cat', [], {
  input: 'Hello\nWorld\n',
  encoding: 'utf8',
})
console.log(result.stdout)
```

## Popen - 高级控制

### 异步执行和流式处理

```python
import subprocess

# 启动进程但不等待
process = subprocess.Popen(
    ['ping', '-c', '4', 'localhost'],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

# 实时读取输出
for line in process.stdout:
    print(f"[实时] {line.strip()}")

# 等待进程结束
process.wait()
print(f"退出码: {process.returncode}")
```

```javascript
// Node.js 对比
const { spawn } = require('child_process')

const process = spawn('ping', ['-c', '4', 'localhost'])

process.stdout.on('data', (data) => {
  console.log(`[实时] ${data}`)
})

process.on('close', (code) => {
  console.log(`退出码: ${code}`)
})
```

### 管道连接多个命令

```python
import subprocess

# 模拟: ps aux | grep python | head -5
p1 = subprocess.Popen(
    ['ps', 'aux'],
    stdout=subprocess.PIPE
)

p2 = subprocess.Popen(
    ['grep', 'python'],
    stdin=p1.stdout,
    stdout=subprocess.PIPE
)

p3 = subprocess.Popen(
    ['head', '-5'],
    stdin=p2.stdout,
    stdout=subprocess.PIPE,
    text=True
)

# 关闭中间进程的 stdout，允许接收 SIGPIPE
p1.stdout.close()
p2.stdout.close()

output = p3.communicate()[0]
print(output)
```

### 双向通信

```python
import subprocess

# 与进程进行交互
process = subprocess.Popen(
    ['python', '-i'],  # Python 交互模式
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

# 发送命令并获取输出
stdout, stderr = process.communicate(input='print("Hello")\nexit()\n')
print(f"输出: {stdout}")
```

## 超时和错误处理

### 设置超时

```python
import subprocess

# run() 的超时
try:
    result = subprocess.run(
        ['sleep', '10'],
        timeout=2  # 2 秒超时
    )
except subprocess.TimeoutExpired:
    print("命令执行超时")

# Popen 的超时
process = subprocess.Popen(['sleep', '10'])
try:
    process.wait(timeout=2)
except subprocess.TimeoutExpired:
    process.kill()  # 强制终止
    print("进程已终止")
```

```javascript
// Node.js 对比
const { execSync } = require('child_process')

try {
  execSync('sleep 10', { timeout: 2000 }) // 毫秒
} catch (e) {
  if (e.killed) {
    console.log('命令执行超时')
  }
}
```

### 错误处理

```python
import subprocess

# 捕获 CalledProcessError
try:
    result = subprocess.run(
        ['ls', '/nonexistent'],
        check=True,  # 失败时抛出异常
        capture_output=True,
        text=True
    )
except subprocess.CalledProcessError as e:
    print(f"命令失败")
    print(f"退出码: {e.returncode}")
    print(f"标准输出: {e.stdout}")
    print(f"标准错误: {e.stderr}")
    print(f"命令: {e.cmd}")

# 命令不存在
try:
    subprocess.run(['nonexistent_command'])
except FileNotFoundError:
    print("命令不存在")

# 综合错误处理
def run_command(cmd):
    try:
        result = subprocess.run(
            cmd,
            check=True,
            capture_output=True,
            text=True,
            timeout=30
        )
        return result.stdout
    except FileNotFoundError:
        raise RuntimeError(f"命令不存在: {cmd[0]}")
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"命令失败: {e.stderr}")
    except subprocess.TimeoutExpired:
        raise RuntimeError("命令执行超时")
```

## 环境变量和工作目录

```python
import subprocess
import os

# 自定义环境变量
my_env = os.environ.copy()
my_env['MY_VAR'] = 'my_value'
my_env['PATH'] = '/custom/bin:' + my_env['PATH']

result = subprocess.run(
    ['printenv', 'MY_VAR'],
    env=my_env,
    capture_output=True,
    text=True
)
print(result.stdout.strip())  # 'my_value'

# 设置工作目录
result = subprocess.run(
    ['pwd'],
    cwd='/tmp',
    capture_output=True,
    text=True
)
print(result.stdout.strip())  # '/tmp'

# 完全替换环境变量（不继承当前环境）
result = subprocess.run(
    ['printenv'],
    env={'PATH': '/bin', 'HOME': '/root'},
    capture_output=True,
    text=True
)
```

```javascript
// Node.js 对比
const { execSync } = require('child_process')

const result = execSync('printenv MY_VAR', {
  env: { ...process.env, MY_VAR: 'my_value' },
  encoding: 'utf8',
})

// 设置工作目录
execSync('pwd', { cwd: '/tmp', encoding: 'utf8' })
```

## 实用示例

### Git 操作封装

```python
import subprocess
from pathlib import Path

class Git:
    def __init__(self, repo_path: str = '.'):
        self.repo_path = Path(repo_path)

    def _run(self, *args, check=True):
        """运行 git 命令"""
        result = subprocess.run(
            ['git'] + list(args),
            cwd=self.repo_path,
            capture_output=True,
            text=True,
            check=check
        )
        return result.stdout.strip()

    def status(self):
        """获取状态"""
        return self._run('status', '--short')

    def log(self, n=10):
        """获取提交日志"""
        return self._run('log', f'-{n}', '--oneline')

    def branch(self):
        """获取当前分支"""
        return self._run('branch', '--show-current')

    def diff(self, staged=False):
        """获取差异"""
        args = ['diff']
        if staged:
            args.append('--staged')
        return self._run(*args)

    def commit(self, message: str):
        """提交更改"""
        self._run('add', '.')
        return self._run('commit', '-m', message)

    def pull(self):
        """拉取更新"""
        return self._run('pull')

    def push(self):
        """推送更改"""
        return self._run('push')

# 使用
git = Git('/path/to/repo')
print(f"当前分支: {git.branch()}")
print(f"状态:\n{git.status()}")
print(f"最近提交:\n{git.log(5)}")
```

### 命令行工具检测

```python
import subprocess
import shutil

def check_command(cmd: str) -> dict:
    """检查命令是否可用及其版本"""
    result = {'available': False, 'path': None, 'version': None}

    # 检查命令是否存在
    path = shutil.which(cmd)
    if not path:
        return result

    result['available'] = True
    result['path'] = path

    # 尝试获取版本
    version_flags = ['--version', '-v', '-V', 'version']
    for flag in version_flags:
        try:
            output = subprocess.run(
                [cmd, flag],
                capture_output=True,
                text=True,
                timeout=5
            )
            if output.returncode == 0 and output.stdout:
                # 提取第一行作为版本信息
                result['version'] = output.stdout.split('\n')[0].strip()
                break
        except (subprocess.TimeoutExpired, FileNotFoundError):
            continue

    return result

# 检查常用命令
for cmd in ['python', 'node', 'git', 'docker']:
    info = check_command(cmd)
    if info['available']:
        print(f"{cmd}: {info['version']} ({info['path']})")
    else:
        print(f"{cmd}: 未安装")
```

### 并行执行命令

```python
import subprocess
from concurrent.futures import ThreadPoolExecutor, as_completed

def run_command(cmd):
    """运行命令并返回结果"""
    try:
        result = subprocess.run(
            cmd,
            shell=isinstance(cmd, str),
            capture_output=True,
            text=True,
            timeout=30
        )
        return {
            'cmd': cmd,
            'success': result.returncode == 0,
            'output': result.stdout,
            'error': result.stderr
        }
    except subprocess.TimeoutExpired:
        return {'cmd': cmd, 'success': False, 'error': 'Timeout'}
    except Exception as e:
        return {'cmd': cmd, 'success': False, 'error': str(e)}

def run_parallel(commands, max_workers=4):
    """并行执行多个命令"""
    results = []
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(run_command, cmd): cmd for cmd in commands}

        for future in as_completed(futures):
            results.append(future.result())

    return results

# 使用
commands = [
    'echo "Task 1"',
    'sleep 1 && echo "Task 2"',
    'echo "Task 3"',
    'sleep 2 && echo "Task 4"'
]

results = run_parallel(commands)
for r in results:
    status = "✓" if r['success'] else "✗"
    print(f"{status} {r['cmd']}")
    if r.get('output'):
        print(f"   {r['output'].strip()}")
```

### 进度显示包装器

```python
import subprocess
import sys
import time

def run_with_spinner(cmd, message="处理中"):
    """带加载动画的命令执行"""
    spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

    process = subprocess.Popen(
        cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    i = 0
    while process.poll() is None:
        sys.stdout.write(f'\r{spinner[i % len(spinner)]} {message}...')
        sys.stdout.flush()
        time.sleep(0.1)
        i += 1

    stdout, stderr = process.communicate()

    if process.returncode == 0:
        sys.stdout.write(f'\r✓ {message} 完成\n')
    else:
        sys.stdout.write(f'\r✗ {message} 失败\n')
        if stderr:
            print(f"  错误: {stderr.strip()}")

    return process.returncode == 0, stdout, stderr

# 使用
success, out, err = run_with_spinner(['sleep', '2'], "安装依赖")
```

## 与 JS 的关键差异

| 特性 | Python subprocess | Node.js child_process |
|-----|------------------|----------------------|
| 默认模式 | 同步（`run()`） | 异步（`spawn()`） |
| Shell 执行 | 需要 `shell=True` | `exec()` 默认使用 shell |
| 输出捕获 | `capture_output=True` | 默认不捕获 |
| 文本模式 | 需要 `text=True` | 使用 `encoding: 'utf8'` |
| 管道连接 | 手动连接 `Popen` | 使用 `pipe()` |
| 错误处理 | `CalledProcessError` | 检查 error 事件 |

## 常见陷阱

```python
import subprocess

# 1. shell=True 的安全问题
user_input = "file.txt; rm -rf /"
# 危险！
subprocess.run(f"cat {user_input}", shell=True)
# 安全
subprocess.run(['cat', user_input])

# 2. 忘记 capture_output 导致看不到输出
result = subprocess.run(['echo', 'hello'])
print(result.stdout)  # None！
# 正确
result = subprocess.run(['echo', 'hello'], capture_output=True, text=True)
print(result.stdout)  # 'hello\n'

# 3. 死锁问题（Popen 的 stdout/stderr 缓冲区满）
# 错误：可能死锁
p = subprocess.Popen(['cmd'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
p.wait()  # 如果输出很多，可能死锁
stdout = p.stdout.read()

# 正确：使用 communicate()
p = subprocess.Popen(['cmd'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
stdout, stderr = p.communicate()  # 不会死锁

# 4. Windows 路径问题
# Windows 上可能需要 shell=True 来执行 .bat/.cmd 文件
subprocess.run(['script.bat'], shell=True)  # Windows

# 5. 编码问题
# 非 UTF-8 输出
result = subprocess.run(
    ['cmd'],
    capture_output=True,
    encoding='gbk'  # Windows 中文环境
)
```

## 小结

- `subprocess.run()` 是推荐的简单用法，适合大多数场景
- `subprocess.Popen()` 提供更精细的控制，适合复杂场景
- 使用 `capture_output=True, text=True` 捕获文本输出
- 使用 `check=True` 在命令失败时自动抛出异常
- **避免 `shell=True` 处理用户输入**，防止命令注入
- 使用 `timeout` 参数防止命令卡死
- `Popen` 需要使用 `communicate()` 避免死锁

::: info 相关内容
- [os/sys 系统接口](./os-sys.md) - 环境变量和进程信息
- [argparse 命令行](../dev-tools/argparse.md) - 解析命令行参数
- [asyncio 异步编程](/backend/python/advanced/async.md) - 异步子进程
:::

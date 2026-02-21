---
title: pathlib 文件路径操作
description: Python pathlib 模块详解,与 Node.js path/fs 模块对比
---

# pathlib 文件路径操作

## 学习目标

本章节你将学习:

- pathlib.Path 的核心 API 和使用方式
- 路径操作(创建、拼接、解析)
- 文件操作(读写、检查、遍历)
- 与 Node.js path/fs 模块的对比
- pathlib 与传统 os.path 的区别

[🔗 pathlib 官方文档](https://docs.python.org/3/library/pathlib.html){target="_blank" rel="noopener"}

## 为什么使用 pathlib?

```python
# 传统 os.path 方式 (Python 3.4 之前)
import os
path = os.path.join('data', 'users', 'profile.json')
if os.path.exists(path) and os.path.isfile(path):
    with open(path, 'r') as f:
        content = f.read()

# pathlib 面向对象方式 (推荐)
from pathlib import Path
path = Path('data') / 'users' / 'profile.json'
if path.exists() and path.is_file():
    content = path.read_text()
```

> **对前端开发者**: pathlib 类似 Node.js 的 `path` 模块,但采用面向对象 API,更加简洁优雅。

## 创建路径对象

### 基本创建

```python
from pathlib import Path

# 创建路径对象
p = Path('data/users/profile.json')
p = Path('data', 'users', 'profile.json')  # 自动拼接

# 当前工作目录
cwd = Path.cwd()
print(cwd)  # 如: /Users/alice/project

# 用户主目录
home = Path.home()
print(home)  # 如: /Users/alice

# 绝对路径
abs_path = Path('/usr/local/bin')

# 相对路径
rel_path = Path('./data/config.json')
```

```javascript
// Node.js 对比
const path = require('path')
const os = require('os')

const p = path.join('data', 'users', 'profile.json')
const cwd = process.cwd()
const home = os.homedir()
```

### 路径拼接

```python
# 使用 / 运算符拼接路径 (Pythonic!)
base = Path('data')
file = base / 'users' / 'profile.json'
print(file)  # data/users/profile.json

# 也可以用字符串
file = base / 'users/profile.json'

# joinpath 方法 (不推荐,用 / 更简洁)
file = base.joinpath('users', 'profile.json')

# 拼接多个路径
parts = ['data', 'images', '2024', 'photo.jpg']
path = Path(*parts)  # 解包列表
```

```javascript
// Node.js 对比
const base = 'data'
const file = path.join(base, 'users', 'profile.json')
// Node.js 没有 / 运算符重载
```

> **关键差异**: Python 的 `/` 运算符让路径拼接更直观,类似文件系统路径的书写方式。

## 路径属性与解析

### 路径组成部分

```python
p = Path('/Users/alice/projects/myapp/src/main.py')

# 完整路径字符串
print(str(p))           # /Users/alice/projects/myapp/src/main.py

# 父目录
print(p.parent)         # /Users/alice/projects/myapp/src
print(p.parent.parent)  # /Users/alice/projects/myapp
print(p.parents[0])     # src 的父目录
print(p.parents[1])     # myapp
print(p.parents[2])     # projects

# 文件名
print(p.name)           # main.py

# 文件名(不含扩展名)
print(p.stem)           # main

# 扩展名
print(p.suffix)         # .py

# 所有扩展名 (如 .tar.gz)
p2 = Path('archive.tar.gz')
print(p2.suffixes)      # ['.tar', '.gz']

# 路径各部分
print(p.parts)          # ('/', 'Users', 'alice', 'projects', 'myapp', 'src', 'main.py')

# 驱动器 (Windows)
p_win = Path('C:/Users/alice/data.txt')
print(p_win.drive)      # C:
print(p_win.root)       # /
```

```javascript
// Node.js 对比
const p = '/Users/alice/projects/myapp/src/main.py'
const parsed = path.parse(p)

console.log(parsed.dir) // /Users/alice/projects/myapp/src
console.log(parsed.name) // main
console.log(parsed.ext) // .py
console.log(parsed.base) // main.py
console.log(path.dirname(p)) // 父目录
console.log(path.basename(p)) // 文件名
```

### API 对照表

| pathlib (Python) | path (Node.js)        | 说明               |
| ---------------- | --------------------- | ------------------ |
| `p.parent`       | `path.dirname()`      | 父目录             |
| `p.name`         | `path.basename()`     | 文件名             |
| `p.stem`         | `path.parse().name`   | 文件名(不含扩展名) |
| `p.suffix`       | `path.extname()`      | 扩展名             |
| `p.parts`        | `p.split(path.sep)`   | 路径分段           |
| `str(p)`         | `p`                   | 字符串形式         |
| `p / 'sub'`      | `path.join(p, 'sub')` | 路径拼接           |

## 路径检查操作

### 存在性检查

```python
from pathlib import Path

p = Path('data/config.json')

# 路径是否存在
if p.exists():
    print("文件或目录存在")

# 是否为文件
if p.is_file():
    print("是文件")

# 是否为目录
if p.is_dir():
    print("是目录")

# 是否为符号链接
if p.is_symlink():
    print("是符号链接")

# 是否为绝对路径
if p.is_absolute():
    print("是绝对路径")
else:
    print("是相对路径")

# 转换为绝对路径
abs_p = p.resolve()
print(abs_p)  # /Users/alice/project/data/config.json

# 检查是否为特定类型
if p.suffix == '.json':
    print("是 JSON 文件")
```

```javascript
// Node.js 对比
const fs = require('fs')
const p = 'data/config.json'

// 检查存在性 (异步)
fs.access(p, fs.constants.F_OK, (err) => {
  if (!err) console.log('存在')
})

// 同步检查
if (fs.existsSync(p)) {
  const stats = fs.statSync(p)
  if (stats.isFile()) console.log('是文件')
  if (stats.isDirectory()) console.log('是目录')
}

// 绝对路径
const abs = path.resolve(p)
```

### 路径比较与匹配

```python
# 路径匹配 (支持通配符)
p = Path('src/components/Button.tsx')

print(p.match('*.tsx'))              # True - 匹配扩展名
print(p.match('**/Button.tsx'))      # True - 匹配任意层级
print(p.match('src/*/*.tsx'))        # True
print(p.match('src/**/*.tsx'))       # True - 递归匹配

# 相对路径计算
base = Path('/Users/alice/projects')
target = Path('/Users/alice/projects/myapp/src/main.py')
rel = target.relative_to(base)
print(rel)  # myapp/src/main.py

# 路径比较
p1 = Path('data')
p2 = Path('data/')
print(p1 == p2)  # True - 自动规范化
```

## 文件操作

### 读取文件

```python
from pathlib import Path

# 读取文本文件
p = Path('data/users.json')
content = p.read_text(encoding='utf-8')
print(content)

# 读取二进制文件
p = Path('images/photo.jpg')
data = p.read_bytes()
print(len(data))  # 字节数

# 按行读取
p = Path('data/log.txt')
lines = p.read_text().splitlines()
for line in lines:
    print(line)

# 使用 with 语句 (更灵活)
p = Path('data/large_file.txt')
with p.open('r', encoding='utf-8') as f:
    for line in f:
        print(line.strip())
```

```javascript
// Node.js 对比
const fs = require('fs')

// 异步读取
fs.readFile('data/users.json', 'utf8', (err, data) => {
  if (err) throw err
  console.log(data)
})

// 同步读取
const content = fs.readFileSync('data/users.json', 'utf8')

// 按行读取 (需要 readline 模块)
const readline = require('readline')
const stream = fs.createReadStream('data/log.txt')
const rl = readline.createInterface({ input: stream })
rl.on('line', (line) => console.log(line))
```

### 写入文件

```python
# 写入文本文件
p = Path('output/result.txt')
p.write_text('Hello, World!\n', encoding='utf-8')

# 写入二进制文件
p = Path('output/data.bin')
p.write_bytes(b'\x00\x01\x02\x03')

# 追加内容 (使用 open)
p = Path('output/log.txt')
with p.open('a', encoding='utf-8') as f:
    f.write('New log entry\n')

# 创建父目录 (如果不存在)
p = Path('output/nested/deep/file.txt')
p.parent.mkdir(parents=True, exist_ok=True)
p.write_text('Content')
```

```javascript
// Node.js 对比
const fs = require('fs')

// 异步写入
fs.writeFile('output/result.txt', 'Hello, World!\n', (err) => {
  if (err) throw err
})

// 同步写入
fs.writeFileSync('output/result.txt', 'Hello, World!\n')

// 追加内容
fs.appendFileSync('output/log.txt', 'New log entry\n')

// 创建目录
fs.mkdirSync('output/nested/deep', { recursive: true })
```

> **关键差异**: Python pathlib 的 `read_text()`/`write_text()` 默认同步,而 Node.js fs 更推荐异步。Python 中处理异步文件 I/O 需要使用 `aiofiles` 库。

## 目录操作

### 创建目录

```python
from pathlib import Path

# 创建单层目录
p = Path('output')
p.mkdir()

# 创建多层目录
p = Path('output/data/2024')
p.mkdir(parents=True, exist_ok=True)
# parents=True: 自动创建父目录
# exist_ok=True: 如果已存在不报错

# 删除空目录
p = Path('output/empty_dir')
p.rmdir()  # 只能删除空目录
```

```javascript
// Node.js 对比
const fs = require('fs')

// 创建目录
fs.mkdirSync('output')

// 创建多层目录
fs.mkdirSync('output/data/2024', { recursive: true })

// 删除空目录
fs.rmdirSync('output/empty_dir')
```

### 遍历目录

```python
from pathlib import Path

base = Path('src')

# iterdir - 遍历直接子项 (不递归)
for item in base.iterdir():
    if item.is_file():
        print(f"文件: {item.name}")
    elif item.is_dir():
        print(f"目录: {item.name}")

# glob - 通配符匹配
for file in base.glob('*.py'):
    print(file)  # 当前目录下所有 .py 文件

for file in base.glob('**/*.py'):
    print(file)  # 递归查找所有 .py 文件

# rglob - 递归 glob (相当于 glob('**/<pattern>'))
for file in base.rglob('*.py'):
    print(file)

# 实用例子: 统计代码行数
total_lines = 0
for py_file in Path('src').rglob('*.py'):
    lines = len(py_file.read_text().splitlines())
    total_lines += lines
    print(f"{py_file.name}: {lines} 行")
print(f"总计: {total_lines} 行")
```

```javascript
// Node.js 对比
const fs = require('fs')
const path = require('path')

// 遍历目录
const files = fs.readdirSync('src')
files.forEach((file) => {
  const fullPath = path.join('src', file)
  const stats = fs.statSync(fullPath)
  if (stats.isFile()) {
    console.log(`文件: ${file}`)
  } else if (stats.isDirectory()) {
    console.log(`目录: ${file}`)
  }
})

// 递归查找 (需要自己实现或使用 glob 库)
const glob = require('glob')
glob('src/**/*.js', (err, files) => {
  files.forEach((file) => console.log(file))
})
```

### 完整示例: 文件树展示

```python
from pathlib import Path

def print_tree(directory: Path, prefix: str = '', level: int = 0):
    """打印目录树结构"""
    if level > 3:  # 限制深度
        return

    items = sorted(directory.iterdir(), key=lambda x: (not x.is_dir(), x.name))

    for i, item in enumerate(items):
        is_last = i == len(items) - 1
        connector = '└── ' if is_last else '├── '

        print(f"{prefix}{connector}{item.name}")

        if item.is_dir() and not item.name.startswith('.'):
            extension = '    ' if is_last else '│   '
            print_tree(item, prefix + extension, level + 1)

# 使用
print_tree(Path('src'))
```

输出示例:

```
src
├── components
│   ├── Button.tsx
│   └── Input.tsx
├── utils
│   ├── format.py
│   └── validate.py
└── main.py
```

## 实用模式

### 配置文件加载

```python
from pathlib import Path
import json

class Config:
    def __init__(self, config_dir: Path = None):
        if config_dir is None:
            # 默认在用户主目录下的 .config
            config_dir = Path.home() / '.config' / 'myapp'

        self.config_dir = config_dir
        self.config_dir.mkdir(parents=True, exist_ok=True)
        self.config_file = self.config_dir / 'settings.json'

    def load(self) -> dict:
        """加载配置"""
        if self.config_file.exists():
            return json.loads(self.config_file.read_text())
        return {}

    def save(self, config: dict):
        """保存配置"""
        self.config_file.write_text(json.dumps(config, indent=2))

# 使用
config = Config()
settings = config.load()
settings['theme'] = 'dark'
config.save(settings)
```

```javascript
// Node.js 对比
const fs = require('fs')
const path = require('path')
const os = require('os')

class Config {
  constructor(configDir = null) {
    if (!configDir) {
      configDir = path.join(os.homedir(), '.config', 'myapp')
    }
    this.configDir = configDir
    this.configFile = path.join(configDir, 'settings.json')
    fs.mkdirSync(configDir, { recursive: true })
  }

  load() {
    if (fs.existsSync(this.configFile)) {
      return JSON.parse(fs.readFileSync(this.configFile, 'utf8'))
    }
    return {}
  }

  save(config) {
    fs.writeFileSync(this.configFile, JSON.stringify(config, null, 2))
  }
}
```

### 临时文件处理

```python
from pathlib import Path
import tempfile

# 获取临时目录
temp_dir = Path(tempfile.gettempdir())
print(temp_dir)  # 如: /tmp (Unix) 或 C:\Users\...\Temp (Windows)

# 创建临时文件
temp_file = temp_dir / 'processing.tmp'
temp_file.write_text('Temporary data')

# 使用 with 语句自动清理
from tempfile import TemporaryDirectory

with TemporaryDirectory() as tmp:
    tmp_path = Path(tmp)
    (tmp_path / 'data.txt').write_text('Content')
    # 退出 with 块时自动删除目录
```

### 备份文件

```python
from pathlib import Path
from datetime import datetime

def backup_file(file_path: Path) -> Path:
    """创建文件备份"""
    if not file_path.exists():
        raise FileNotFoundError(f"{file_path} 不存在")

    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_path = file_path.with_stem(f"{file_path.stem}_{timestamp}")

    # 复制文件
    backup_path.write_bytes(file_path.read_bytes())
    return backup_path

# 使用
original = Path('important_data.json')
backup = backup_file(original)
print(f"备份到: {backup}")
# 输出: important_data_20240115_143022.json
```

## 路径兼容性

### 跨平台路径

```python
from pathlib import Path, PurePosixPath, PureWindowsPath

# Path 自动适配当前系统
p = Path('data/users')  # Unix: data/users, Windows: data\users

# 强制使用 Unix 风格路径
posix = PurePosixPath('data/users/profile.json')
print(posix)  # data/users/profile.json

# 强制使用 Windows 风格路径
windows = PureWindowsPath('data\\users\\profile.json')
print(windows)  # data\users\profile.json

# Pure 路径不访问文件系统,只做路径操作
# 适合在 Unix 系统上处理 Windows 路径 (或反之)
```

### 与字符串互转

```python
from pathlib import Path

# 字符串 → Path
p = Path('data/config.json')
p = Path.cwd() / 'data/config.json'

# Path → 字符串
s = str(p)
s = p.as_posix()  # 强制使用 / 分隔符

# Path → URI
uri = p.as_uri()
print(uri)  # file:///Users/alice/project/data/config.json

# 与 os.path 兼容
import os
os.path.join(str(p.parent), 'other.json')
```

## 对前端开发者

### pathlib vs Node.js fs/path

| 特性       | pathlib (Python)  | Node.js                      |
| ---------- | ----------------- | ---------------------------- |
| 面向对象   | ✅ `Path` 对象    | ❌ 函数式 API                |
| 路径拼接   | `p / 'sub'`       | `path.join(p, 'sub')`        |
| 读取文件   | `p.read_text()`   | `fs.readFileSync(p, 'utf8')` |
| 写入文件   | `p.write_text(s)` | `fs.writeFileSync(p, s)`     |
| 检查存在   | `p.exists()`      | `fs.existsSync(p)`           |
| 遍历目录   | `p.iterdir()`     | `fs.readdirSync(p)`          |
| 通配符匹配 | `p.glob('*.py')`  | 需要 `glob` 库               |
| 默认模式   | 同步              | 异步优先                     |

### Python with 语句 vs Node.js

```python
# Python: with 自动关闭文件
with Path('data.txt').open('r') as f:
    content = f.read()
# 退出 with 块时自动 f.close()
```

```javascript
// Node.js: 手动关闭或使用 fs.promises
const fs = require('fs').promises

// 方式1: 手动关闭 (不推荐)
const fd = fs.openSync('data.txt', 'r')
const buffer = Buffer.alloc(1024)
fs.readSync(fd, buffer)
fs.closeSync(fd)

// 方式2: 使用 fs.promises (推荐)
const data = await fs.readFile('data.txt', 'utf8')
```

> **关键差异**: Python 的 `with` 语句保证资源自动释放,Node.js 通常使用回调或 Promise 管理异步操作。

### 常见陷阱

```python
# 1. 路径拼接必须用 / 运算符或 joinpath
base = Path('data')
# 错误: base + '/users'  # TypeError
# 正确:
users = base / 'users'

# 2. read_text/write_text 需要注意编码
p = Path('utf8.txt')
# 指定编码避免问题
p.write_text('中文内容', encoding='utf-8')
content = p.read_text(encoding='utf-8')

# 3. 相对路径 vs 绝对路径
p = Path('data.txt')
print(p)          # data.txt (相对路径)
print(p.resolve())  # /Users/alice/project/data.txt (绝对路径)

# 4. mkdir 的 exist_ok 参数
p = Path('output')
p.mkdir(exist_ok=True)  # 如果存在不报错
```

## 小结

- **pathlib** 是 Python 3.4+ 推荐的文件路径操作方式,取代传统 `os.path`
- **面向对象 API** 让代码更简洁:`p.read_text()` vs `open(p).read()`
- **`/` 运算符** 让路径拼接更直观:`base / 'sub' / 'file.txt'`
- **跨平台兼容**:`Path` 自动适配 Unix/Windows 路径分隔符
- **丰富的方法**: 检查、读写、遍历一应俱全
- **与 Node.js 的差异**: Python 默认同步,Node.js 推荐异步

### 推荐实践

1. ✅ 始终使用 `Path` 而非字符串拼接路径
2. ✅ 使用 `/` 运算符拼接路径
3. ✅ 创建目录时指定 `parents=True, exist_ok=True`
4. ✅ 读写文件时明确指定 `encoding='utf-8'`
5. ✅ 使用 `with` 语句打开文件,确保自动关闭
6. ✅ 使用 `rglob()` 递归查找文件,替代手写递归

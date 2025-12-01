---
title: Python 文件 I/O 操作
description: 学习使用 pathlib.Path 进行路径操作,使用 with 语句安全读写文件,对比 Node.js fs 模块
outline: deep
---

# Python 文件 I/O 操作

Python 提供了强大的文件操作能力,推荐使用 `pathlib.Path` (现代) 和 `with` 语句 (安全) 进行文件 I/O。

## 学习目标

- 掌握 pathlib.Path 路径操作 (推荐方式)
- 学习使用 with 语句安全读写文件
- 理解文本文件与二进制文件的区别
- 了解常用文件操作 (检查存在、创建目录、遍历文件)
- 对比 Python 与 Node.js 的文件 I/O

## 核心概念

### pathlib.Path 路径操作

`pathlib.Path` 是 Python 3.4+ 引入的面向对象路径操作库,推荐使用它替代 `os.path`。

```python
from pathlib import Path

# 创建路径对象
path = Path("data/users.json")

# 路径拼接 (使用 / 运算符)
config_dir = Path.home() / ".config" / "myapp"
data_file = Path.cwd() / "data" / "users.json"

# 路径属性
print(path.name)        # users.json (文件名)
print(path.stem)        # users (文件名无扩展名)
print(path.suffix)      # .json (扩展名)
print(path.parent)      # data (父目录)
print(path.absolute())  # 绝对路径
```

**常用路径操作**:

```python
from pathlib import Path

# 当前工作目录
cwd = Path.cwd()

# 用户主目录
home = Path.home()

# 临时目录
import tempfile
tmp = Path(tempfile.gettempdir())

# 检查路径属性
path = Path("data/users.json")
print(path.exists())    # 文件或目录是否存在
print(path.is_file())   # 是否为文件
print(path.is_dir())    # 是否为目录
print(path.is_absolute())  # 是否为绝对路径

# 创建目录
Path("output/logs").mkdir(parents=True, exist_ok=True)
# parents=True: 创建父目录 (如 output)
# exist_ok=True: 目录已存在不报错
```

### 文本文件读写

#### 读取文本文件

**方法 1: Path.read_text() (简洁)**

```python
from pathlib import Path

# 读取整个文件为字符串
content = Path("data.txt").read_text(encoding="utf-8")
print(content)
```

**方法 2: with open() (推荐,自动关闭)**

```python
# 读取整个文件
with open("data.txt", "r", encoding="utf-8") as f:
    content = f.read()

# 逐行读取
with open("data.txt", "r", encoding="utf-8") as f:
    for line in f:
        print(line.strip())

# 读取所有行为列表
with open("data.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()
```

#### 写入文本文件

**方法 1: Path.write_text() (简洁)**

```python
from pathlib import Path

# 写入字符串 (覆盖)
Path("output.txt").write_text("Hello, World!", encoding="utf-8")
```

**方法 2: with open() (推荐,更多控制)**

```python
# 写入模式 (覆盖)
with open("output.txt", "w", encoding="utf-8") as f:
    f.write("Hello, World!\n")
    f.write("Second line\n")

# 追加模式
with open("output.txt", "a", encoding="utf-8") as f:
    f.write("Appended line\n")

# 写入多行
lines = ["Line 1\n", "Line 2\n", "Line 3\n"]
with open("output.txt", "w", encoding="utf-8") as f:
    f.writelines(lines)
```

### 二进制文件操作

```python
from pathlib import Path

# 读取二进制文件
data = Path("image.png").read_bytes()
print(type(data))  # <class 'bytes'>

# 写入二进制文件
Path("copy.png").write_bytes(data)

# 使用 with 语句
with open("image.png", "rb") as f:
    content = f.read()

with open("copy.png", "wb") as f:
    f.write(content)
```

### 常用文件操作

#### 检查文件是否存在

```python
from pathlib import Path

path = Path("data.txt")

if path.exists():
    print("File exists")
else:
    print("File does not exist")

# 更精确的检查
if path.is_file():
    print("It's a file")

if path.is_dir():
    print("It's a directory")
```

#### 遍历目录

```python
from pathlib import Path

# 列出当前目录所有文件
for item in Path(".").iterdir():
    print(item)

# 递归查找所有 .py 文件
for py_file in Path(".").rglob("*.py"):
    print(py_file)

# 只查找当前目录的 .py 文件
for py_file in Path(".").glob("*.py"):
    print(py_file)
```

#### 复制、移动、删除文件

```python
from pathlib import Path
import shutil

# 复制文件
shutil.copy("source.txt", "dest.txt")

# 复制目录
shutil.copytree("source_dir", "dest_dir")

# 移动/重命名文件
Path("old_name.txt").rename("new_name.txt")

# 删除文件
Path("temp.txt").unlink()

# 删除空目录
Path("empty_dir").rmdir()

# 删除目录及其内容
shutil.rmtree("dir_with_contents")
```

### with 语句 (上下文管理器)

`with` 语句确保文件在使用后自动关闭,即使发生异常也会正确清理资源。

```python
# ❌ 不推荐:手动关闭文件
f = open("data.txt", "r")
content = f.read()
f.close()  # 容易忘记关闭,或异常时未关闭

# ✅ 推荐:with 语句自动关闭
with open("data.txt", "r", encoding="utf-8") as f:
    content = f.read()
# 文件在 with 块结束时自动关闭
```

## 💡 对前端开发者

### 与 Node.js fs 模块对比

| Node.js              | Python              | 说明             |
| -------------------- | ------------------- | ---------------- |
| `fs.readFileSync()`  | `Path.read_text()`  | 读取文本文件     |
| `fs.writeFileSync()` | `Path.write_text()` | 写入文本文件     |
| `fs.existsSync()`    | `Path.exists()`     | 检查文件是否存在 |
| `fs.mkdirSync()`     | `Path.mkdir()`      | 创建目录         |
| `path.join()`        | `Path() / "subdir"` | 路径拼接         |
| `fs.readdirSync()`   | `Path.iterdir()`    | 列出目录内容     |
| `fs.unlinkSync()`    | `Path.unlink()`     | 删除文件         |

**示例对比**:

```javascript
// Node.js
const fs = require('fs')
const path = require('path')

// 读取文件
const content = fs.readFileSync('data.txt', 'utf-8')

// 写入文件
fs.writeFileSync('output.txt', 'Hello, World!', 'utf-8')

// 路径拼接
const filePath = path.join(__dirname, 'data', 'users.json')

// 检查文件存在
if (fs.existsSync(filePath)) {
  console.log('File exists')
}
```

```python
# Python
from pathlib import Path

# 读取文件
content = Path("data.txt").read_text(encoding="utf-8")

# 写入文件
Path("output.txt").write_text("Hello, World!", encoding="utf-8")

# 路径拼接
file_path = Path(__file__).parent / "data" / "users.json"

# 检查文件存在
if file_path.exists():
    print("File exists")
```

**关键差异**:

- **路径拼接**: Python 使用 `/` 运算符,Node.js 使用 `path.join()`
- **自动关闭**: Python 的 `with` 语句自动管理资源,Node.js 同步 API 立即返回
- **异步 I/O**: Node.js 默认异步,Python 默认同步 (有 `asyncio` 支持异步)
- **编码**: Python 必须显式指定编码 (推荐 `utf-8`),Node.js 默认 `utf-8`

## ⚠️ 常见误区

### 忘记指定编码

❌ **错误示例**:

```python
# 未指定编码,依赖系统默认 (可能导致乱码)
with open("data.txt", "r") as f:
    content = f.read()
```

✅ **正确示例**:

```python
# 明确指定 UTF-8 编码
with open("data.txt", "r", encoding="utf-8") as f:
    content = f.read()
```

### 使用 os.path 而非 pathlib

❌ **旧写法 (不推荐)**:

```python
import os

# 复杂的路径拼接
config_path = os.path.join(
    os.path.expanduser("~"),
    ".config",
    "app.json"
)
```

✅ **现代写法 (推荐)**:

```python
from pathlib import Path

# 简洁的路径拼接
config_path = Path.home() / ".config" / "app.json"
```

### 不使用 with 语句

❌ **错误示例**:

```python
f = open("data.txt", "r")
content = f.read()
f.close()  # 容易忘记,或异常时未执行
```

✅ **正确示例**:

```python
with open("data.txt", "r", encoding="utf-8") as f:
    content = f.read()
# 自动关闭,异常时也会关闭
```

## 小结

### 本章要点

- 使用 `pathlib.Path` 进行路径操作 (现代、跨平台)
- 使用 `with` 语句读写文件 (自动关闭,安全)
- 文本文件必须指定编码 (推荐 `utf-8`)
- `Path.read_text()` / `Path.write_text()` 适合简单场景
- `Path() / "subdir"` 拼接路径 (优于 `os.path.join()`)

### 与 Node.js 的关键差异

| Node.js             | Python             | 差异说明                   |
| ------------------- | ------------------ | -------------------------- |
| 默认异步 I/O        | 默认同步 I/O       | Python 有 asyncio 支持异步 |
| `path.join()`       | `Path() / "sub"`   | Python 使用 `/` 运算符     |
| 默认 UTF-8          | 需显式指定编码     | Python 避免编码问题        |
| `fs.readFileSync()` | `Path.read_text()` | API 设计相似               |

### 推荐下一步阅读

- [异常处理](./exceptions) - 处理文件 I/O 异常
- [pathlib 库](../libraries/pathlib) - 深入 pathlib 高级用法
- [上下文管理器](../advanced/context-managers) - 理解 with 语句原理

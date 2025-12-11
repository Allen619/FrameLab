---
title: 文件与系统操作
description: Python 文件系统和操作系统相关的标准库
---

# 文件与系统操作

这组模块提供文件系统操作和操作系统交互功能，是日常开发中最常用的标准库之一。

## 模块概览

| 模块 | 用途 | Node.js 对应 |
|------|------|-------------|
| [os/sys](./os-sys.md) | 操作系统接口、环境变量 | `process`, `os` |
| [pathlib](./pathlib.md) | 面向对象的路径操作 | `path` |
| [shutil](./shutil.md) | 高级文件操作（复制、移动、压缩） | `fs-extra` |
| [subprocess](./subprocess.md) | 运行外部命令 | `child_process` |

## 快速对比

### 读取文件

```python
# Python (pathlib)
from pathlib import Path
content = Path('file.txt').read_text(encoding='utf-8')

# Python (传统方式)
with open('file.txt', 'r', encoding='utf-8') as f:
    content = f.read()
```

```javascript
// Node.js
const fs = require('fs')
const content = fs.readFileSync('file.txt', 'utf8')
```

### 遍历目录

```python
# Python (pathlib)
from pathlib import Path
for file in Path('src').rglob('*.py'):
    print(file)

# Python (os.walk)
import os
for root, dirs, files in os.walk('src'):
    for f in files:
        if f.endswith('.py'):
            print(os.path.join(root, f))
```

```javascript
// Node.js (需要 glob 库)
const glob = require('glob')
glob('src/**/*.py', (err, files) => {
  files.forEach(console.log)
})
```

### 运行命令

```python
# Python
import subprocess
result = subprocess.run(['ls', '-l'], capture_output=True, text=True)
print(result.stdout)
```

```javascript
// Node.js
const { execSync } = require('child_process')
console.log(execSync('ls -l', { encoding: 'utf8' }))
```

## 学习路径

1. **入门**: 先学习 [pathlib](./pathlib.md)，这是最现代和推荐的路径操作方式
2. **进阶**: 学习 [os/sys](./os-sys.md) 了解环境变量和系统交互
3. **实用**: 学习 [shutil](./shutil.md) 进行文件复制、移动等操作
4. **自动化**: 学习 [subprocess](./subprocess.md) 运行外部命令和脚本

## 常见任务速查

| 任务 | 推荐模块 |
|------|---------|
| 路径拼接和解析 | `pathlib` |
| 读写文件 | `pathlib` 或 `open()` |
| 遍历目录 | `pathlib.rglob()` |
| 环境变量 | `os.environ` |
| 复制/移动文件 | `shutil` |
| 压缩/解压 | `shutil` |
| 运行外部命令 | `subprocess` |
| 获取系统信息 | `os` / `sys` |

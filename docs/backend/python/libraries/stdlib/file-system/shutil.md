---
title: shutil - 高级文件操作
description: Python shutil 模块详解，文件复制、移动、压缩等高级操作
---

# shutil 高级文件操作

## 学习目标

- 掌握文件和目录的复制、移动、删除操作
- 理解 shutil 与 os 模块的区别
- 学会使用压缩和解压功能
- 与 Node.js fs-extra 对比

## 概述

`shutil` (shell utilities) 提供高级文件操作，比 `os` 模块更方便。

| Python shutil | Node.js | 说明 |
|--------------|---------|------|
| `shutil.copy()` | `fs.copyFileSync()` | 复制文件 |
| `shutil.copytree()` | `fs-extra.copySync()` | 复制目录树 |
| `shutil.move()` | `fs.renameSync()` | 移动文件/目录 |
| `shutil.rmtree()` | `fs-extra.removeSync()` | 递归删除目录 |
| `shutil.make_archive()` | `archiver` 库 | 创建压缩包 |

## 文件复制

### 复制文件

```python
import shutil
from pathlib import Path

# copy - 复制文件（保留权限）
shutil.copy('source.txt', 'dest.txt')
shutil.copy('source.txt', 'dest_dir/')  # 复制到目录

# copy2 - 复制文件（保留所有元数据：权限、时间戳等）
shutil.copy2('source.txt', 'dest.txt')

# copyfile - 仅复制内容（不保留权限）
shutil.copyfile('source.txt', 'dest.txt')

# 复制文件对象
with open('source.txt', 'rb') as src:
    with open('dest.txt', 'wb') as dst:
        shutil.copyfileobj(src, dst)
```

```javascript
// Node.js 对比
const fs = require('fs')
const path = require('path')

// 复制文件
fs.copyFileSync('source.txt', 'dest.txt')

// 复制到目录
fs.copyFileSync('source.txt', path.join('dest_dir', 'source.txt'))

// fs-extra 提供更多功能
const fse = require('fs-extra')
fse.copySync('source.txt', 'dest.txt')
```

### 复制权限和元数据

```python
import shutil

# 只复制权限
shutil.copymode('source.txt', 'dest.txt')

# 复制所有元数据（权限、时间戳等）
shutil.copystat('source.txt', 'dest.txt')

# copy vs copy2 区别
shutil.copy('a.txt', 'b.txt')   # 保留权限
shutil.copy2('a.txt', 'c.txt')  # 保留权限 + 时间戳
```

## 目录操作

### 复制目录树

```python
import shutil
from pathlib import Path

# 复制整个目录
shutil.copytree('src_dir', 'dst_dir')

# 目标目录已存在时
shutil.copytree('src_dir', 'dst_dir', dirs_exist_ok=True)  # Python 3.8+

# 忽略特定文件
def ignore_patterns(directory, files):
    """忽略 .pyc 文件和 __pycache__ 目录"""
    return [f for f in files if f.endswith('.pyc') or f == '__pycache__']

shutil.copytree('src_dir', 'dst_dir', ignore=ignore_patterns)

# 使用内置的 ignore_patterns
shutil.copytree(
    'src_dir', 'dst_dir',
    ignore=shutil.ignore_patterns('*.pyc', '__pycache__', '*.tmp')
)
```

```javascript
// Node.js fs-extra 对比
const fse = require('fs-extra')

// 复制目录
fse.copySync('src_dir', 'dst_dir')

// 带过滤器
fse.copySync('src_dir', 'dst_dir', {
  filter: (src) => !src.endsWith('.pyc') && !src.includes('__pycache__'),
})
```

### 删除目录树

```python
import shutil
from pathlib import Path

# 递归删除目录（包括所有内容）
shutil.rmtree('dir_to_delete')

# 忽略错误
shutil.rmtree('dir_to_delete', ignore_errors=True)

# 自定义错误处理
def on_error(func, path, exc_info):
    """处理删除错误，如只读文件"""
    import os
    import stat
    # 尝试修改权限后重试
    os.chmod(path, stat.S_IWUSR)
    func(path)

shutil.rmtree('dir_to_delete', onerror=on_error)
```

```javascript
// Node.js 对比
const fs = require('fs')

// 递归删除（Node.js 14.14+）
fs.rmSync('dir_to_delete', { recursive: true, force: true })

// fs-extra
const fse = require('fs-extra')
fse.removeSync('dir_to_delete')
```

## 移动和重命名

```python
import shutil

# 移动文件
shutil.move('old/path/file.txt', 'new/path/file.txt')

# 移动目录
shutil.move('old_dir', 'new_dir')

# 重命名（本质上是移动）
shutil.move('old_name.txt', 'new_name.txt')

# 移动到已存在的目录
shutil.move('file.txt', 'existing_dir/')  # 结果: existing_dir/file.txt

# 跨文件系统移动（自动处理）
# shutil.move 在跨文件系统时会自动复制后删除
shutil.move('/mnt/disk1/file.txt', '/mnt/disk2/file.txt')
```

```javascript
// Node.js 对比
const fs = require('fs')

// 重命名/移动（同一文件系统）
fs.renameSync('old.txt', 'new.txt')

// 跨文件系统需要复制后删除
// 或使用 fs-extra
const fse = require('fs-extra')
fse.moveSync('old.txt', 'new.txt')
```

## 压缩和解压

### 创建压缩包

```python
import shutil

# 创建 zip 压缩包
shutil.make_archive(
    'backup',           # 输出文件名（不含扩展名）
    'zip',              # 格式: 'zip', 'tar', 'gztar', 'bztar', 'xztar'
    'source_dir'        # 要压缩的目录
)
# 生成: backup.zip

# 创建 tar.gz 压缩包
shutil.make_archive('backup', 'gztar', 'source_dir')
# 生成: backup.tar.gz

# 指定根目录
shutil.make_archive(
    'backup',
    'zip',
    root_dir='project',      # 切换到此目录
    base_dir='src'           # 压缩此子目录
)
```

### 解压缩

```python
import shutil

# 解压到当前目录
shutil.unpack_archive('backup.zip')

# 解压到指定目录
shutil.unpack_archive('backup.zip', 'extracted_dir')

# 指定格式（通常自动检测）
shutil.unpack_archive('backup.tar.gz', 'extracted_dir', 'gztar')

# 查看支持的格式
print(shutil.get_archive_formats())
# [('bztar', "bzip2'ed tar-file"), ('gztar', "gzip'ed tar-file"), ...]

print(shutil.get_unpack_formats())
# [('bztar', ['.tar.bz2', '.tbz2'], ...), ...]
```

```javascript
// Node.js 对比 - 需要第三方库
const archiver = require('archiver')
const extract = require('extract-zip')

// 创建 zip
const output = fs.createWriteStream('backup.zip')
const archive = archiver('zip')
archive.pipe(output)
archive.directory('source_dir', false)
archive.finalize()

// 解压
await extract('backup.zip', { dir: 'extracted_dir' })
```

## 磁盘使用情况

```python
import shutil

# 获取磁盘使用情况
usage = shutil.disk_usage('/')
print(f"总空间: {usage.total / (1024**3):.2f} GB")
print(f"已使用: {usage.used / (1024**3):.2f} GB")
print(f"可用: {usage.free / (1024**3):.2f} GB")

# 检查特定目录所在磁盘
usage = shutil.disk_usage('/home')
percent_used = (usage.used / usage.total) * 100
print(f"使用率: {percent_used:.1f}%")
```

```javascript
// Node.js 对比
const os = require('os')
const { execSync } = require('child_process')

// 需要执行系统命令或使用第三方库
// Linux/Mac
const df = execSync("df -h /").toString()
```

## 查找可执行文件

```python
import shutil

# 查找可执行文件（类似 Unix which 命令）
python_path = shutil.which('python')
print(python_path)  # /usr/bin/python

# 找不到返回 None
result = shutil.which('nonexistent_command')
print(result)  # None

# 检查命令是否可用
if shutil.which('git'):
    print("Git 已安装")
else:
    print("Git 未安装")
```

```javascript
// Node.js 对比
const { execSync } = require('child_process')

// 使用 which 命令（Unix）或 where 命令（Windows）
try {
  const result = execSync('which python').toString().trim()
  console.log(result)
} catch {
  console.log('未找到')
}
```

## 实用示例

### 项目备份工具

```python
import shutil
from datetime import datetime
from pathlib import Path

def backup_project(project_dir: str, backup_dir: str) -> Path:
    """备份项目目录，排除不必要的文件"""
    project_path = Path(project_dir)
    backup_path = Path(backup_dir)

    # 生成备份文件名
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_name = f"{project_path.name}_{timestamp}"

    # 复制目录，排除常见的无用文件
    ignore = shutil.ignore_patterns(
        '__pycache__',
        '*.pyc',
        '.git',
        'node_modules',
        '.venv',
        'venv',
        '*.egg-info',
        '.pytest_cache',
        '.mypy_cache',
        '*.log'
    )

    dest = backup_path / backup_name
    shutil.copytree(project_path, dest, ignore=ignore)

    # 创建压缩包
    archive_path = shutil.make_archive(
        str(backup_path / backup_name),
        'zip',
        backup_path,
        backup_name
    )

    # 删除临时目录
    shutil.rmtree(dest)

    return Path(archive_path)

# 使用
backup = backup_project('./my_project', './backups')
print(f"备份完成: {backup}")
```

### 清理临时文件

```python
import shutil
from pathlib import Path

def clean_temp_files(directory: str, patterns: list = None):
    """清理目录中的临时文件"""
    if patterns is None:
        patterns = ['*.tmp', '*.log', '*.bak', '*~']

    dir_path = Path(directory)
    removed_count = 0
    removed_size = 0

    for pattern in patterns:
        for file in dir_path.rglob(pattern):
            try:
                size = file.stat().st_size
                file.unlink()
                removed_count += 1
                removed_size += size
                print(f"删除: {file}")
            except OSError as e:
                print(f"无法删除 {file}: {e}")

    # 清理空目录
    for dir in sorted(dir_path.rglob('*'), reverse=True):
        if dir.is_dir() and not any(dir.iterdir()):
            try:
                dir.rmdir()
                print(f"删除空目录: {dir}")
            except OSError:
                pass

    print(f"\n清理完成: {removed_count} 个文件, {removed_size / 1024:.2f} KB")

# 使用
clean_temp_files('./project')
```

### 安全删除（移动到回收站）

```python
import shutil
from pathlib import Path
from datetime import datetime

class SafeDelete:
    """安全删除：移动到回收站而非直接删除"""

    def __init__(self, trash_dir: str = '.trash'):
        self.trash_dir = Path(trash_dir)
        self.trash_dir.mkdir(exist_ok=True)

    def delete(self, path: str) -> Path:
        """移动文件/目录到回收站"""
        source = Path(path)
        if not source.exists():
            raise FileNotFoundError(f"{path} 不存在")

        # 生成唯一的回收站路径
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        dest_name = f"{source.name}_{timestamp}"
        dest = self.trash_dir / dest_name

        shutil.move(str(source), str(dest))
        return dest

    def restore(self, trash_name: str, restore_path: str = None):
        """从回收站恢复"""
        source = self.trash_dir / trash_name
        if not source.exists():
            raise FileNotFoundError(f"回收站中没有 {trash_name}")

        if restore_path is None:
            # 恢复原始文件名
            restore_path = trash_name.rsplit('_', 2)[0]

        shutil.move(str(source), restore_path)
        return restore_path

    def empty(self):
        """清空回收站"""
        shutil.rmtree(self.trash_dir)
        self.trash_dir.mkdir()

    def list(self):
        """列出回收站内容"""
        return list(self.trash_dir.iterdir())

# 使用
trash = SafeDelete()
trash.delete('unwanted_file.txt')
print("回收站内容:", trash.list())
```

## 与 JS 的关键差异

| 特性 | Python shutil | Node.js |
|-----|--------------|---------|
| 递归复制 | `copytree()` 内置 | 需要 fs-extra |
| 递归删除 | `rmtree()` 内置 | Node 14.14+ 的 `fs.rmSync` |
| 压缩解压 | 内置支持多格式 | 需要第三方库 |
| 磁盘信息 | `disk_usage()` 内置 | 需要系统命令 |
| 跨平台移动 | 自动处理 | 需要 fs-extra |

## 常见陷阱

```python
import shutil

# 1. copytree 目标目录不能已存在（Python 3.8 之前）
# shutil.copytree('src', 'existing_dir')  # FileExistsError
shutil.copytree('src', 'existing_dir', dirs_exist_ok=True)  # 3.8+

# 2. rmtree 不进回收站，直接删除！
# 生产环境谨慎使用
shutil.rmtree('important_data')  # 一去不复返

# 3. copy 不会自动创建目标目录
# shutil.copy('file.txt', 'new_dir/file.txt')  # 如果 new_dir 不存在会报错
Path('new_dir').mkdir(exist_ok=True)
shutil.copy('file.txt', 'new_dir/file.txt')

# 4. 大文件复制时没有进度反馈
# 需要自己实现带进度的复制
def copy_with_progress(src, dst, callback=None):
    """带进度回调的复制"""
    total_size = Path(src).stat().st_size
    copied = 0

    with open(src, 'rb') as fsrc:
        with open(dst, 'wb') as fdst:
            while True:
                buf = fsrc.read(1024 * 1024)  # 1MB
                if not buf:
                    break
                fdst.write(buf)
                copied += len(buf)
                if callback:
                    callback(copied, total_size)
```

## 小结

- `shutil` 提供高级文件操作，比 `os` 模块更方便
- `copy2()` 保留所有元数据，`copy()` 只保留权限
- `copytree()` 递归复制目录，支持忽略模式
- `rmtree()` 递归删除目录，**不进回收站**
- `make_archive()` / `unpack_archive()` 处理压缩文件
- `disk_usage()` 获取磁盘使用情况
- `which()` 查找可执行文件

::: info 相关内容
- [os/sys 系统接口](./os-sys.md) - 基础文件操作
- [pathlib 路径操作](./pathlib.md) - 现代路径处理
:::

---
title: Python 标准库
description: Python 内置标准库教程，无需安装即可使用
---

# Python 标准库

Python 标准库是 Python 安装时自带的模块集合，无需额外安装即可使用。对于前端开发者来说，这相当于 Node.js 的核心模块。

## 标准库 vs Node.js 核心模块

| Python 标准库 | Node.js 对应 | 用途 |
|--------------|-------------|------|
| `os`, `sys` | `process`, `os` | 系统交互 |
| `pathlib` | `path` | 路径操作 |
| `json` | `JSON` (内置) | JSON 处理 |
| `re` | `RegExp` (内置) | 正则表达式 |
| `datetime` | `Date` (内置) | 日期时间 |
| `asyncio` | 内置 async/await | 异步编程 |
| `http.server` | `http` | HTTP 服务 |
| `sqlite3` | 需要第三方库 | 数据库 |

## 分类导航

### 文件与系统操作
处理文件、目录和系统交互的模块。

- [os/sys 系统接口](./file-system/os-sys.md) - 操作系统接口与系统参数
- [pathlib 路径操作](./file-system/pathlib.md) - 面向对象的文件路径
- [shutil 文件操作](./file-system/shutil.md) - 高级文件操作
- [subprocess 子进程](./file-system/subprocess.md) - 运行外部命令

### 文本与数据处理
处理各种数据格式的模块。

- [re 正则表达式](./text-data/re.md) - 正则表达式操作
- [json 数据格式](./text-data/json.md) - JSON 编解码
- [csv 表格处理](./text-data/csv.md) - CSV 文件读写
- [string 字符串工具](./text-data/string.md) - 字符串常量和模板
- [pickle 序列化](./text-data/pickle.md) - Python 对象序列化

### 数学与随机
数学计算和随机数生成。

- [math 数学函数](./math-random/math.md) - 数学函数库
- [random 随机数](./math-random/random.md) - 随机数生成
- [statistics 统计](./math-random/statistics.md) - 统计计算
- [decimal 精确计算](./math-random/decimal.md) - 高精度小数

### 日期与时间
日期时间处理。

- [datetime 日期时间](./datetime/datetime.md) - 日期和时间处理
- [time 时间函数](./datetime/time.md) - 时间访问和转换
- [calendar 日历](./datetime/calendar.md) - 日历相关功能

### 数据结构增强
增强的数据结构和函数式编程工具。

- [collections 容器](./collections/collections.md) - 特殊容器数据类型
- [itertools 迭代器](./collections/itertools.md) - 迭代器工具
- [functools 函数工具](./collections/functools.md) - 高阶函数工具
- [enum 枚举](./collections/enum.md) - 枚举类型

### 开发工具
辅助开发的工具模块。

- [argparse 命令行](./dev-tools/argparse.md) - 命令行参数解析
- [unittest 单元测试](./dev-tools/unittest.md) - 单元测试框架

### 并发编程
多线程、多进程和异步编程。

- [threading 线程](./concurrency/threading.md) - 多线程编程
- [multiprocessing 多进程](./concurrency/multiprocessing.md) - 多进程编程
- [concurrent.futures](./concurrency/concurrent-futures.md) - 并发执行器

### 网络编程
网络通信相关模块。

- [urllib URL处理](./networking/urllib.md) - URL 处理和请求
- [socket 套接字](./networking/socket.md) - 底层网络接口
- [http.server](./networking/http-server.md) - 简易 HTTP 服务器

### 数据存储
数据持久化。

- [sqlite3 数据库](./storage/sqlite3.md) - SQLite 数据库接口

### 工具函数
常用工具函数。

- [hashlib 哈希](./utilities/hashlib.md) - 哈希算法
- [base64 编码](./utilities/base64.md) - Base64 编解码
- [copy 拷贝](./utilities/copy.md) - 对象拷贝
- [contextlib 上下文](./utilities/contextlib.md) - 上下文管理工具

## 学习建议

对于前端开发者，建议按以下顺序学习：

1. **第一阶段**：`json`, `pathlib`, `datetime` - 最常用
2. **第二阶段**：`re`, `os/sys`, `subprocess` - 系统交互
3. **第三阶段**：`collections`, `itertools`, `functools` - 进阶数据处理
4. **第四阶段**：并发编程模块 - 需要时再学

# Proposal: Expand Python Library Tutorials

## Why

当前 Python 教程的"常用库"章节内容有限，仅包含 6 个教程（pathlib、dataclass、HTTP、数据处理、Web 框架、测试），缺少许多前端工程师在实际开发中会频繁使用的标准库和第三方库。这导致学习者在完成基础教程后，仍需要大量额外查阅资料才能掌握日常开发所需的工具库。

## What Changes

### 1. 重构库教程目录结构

将现有的扁平结构重组为两大分类：
- **标准库** (stdlib/): Python 内置库，无需安装
- **第三方库** (third-party/): 需要 pip 安装的库

### 2. 标准库教程新增内容

#### 2.1 文件与系统操作 (file-system/)
- `os-sys.md` - 操作系统接口与系统参数
- `pathlib.md` - 文件路径操作 (已有，迁移)
- `shutil.md` - 高级文件操作
- `subprocess.md` - 子进程管理

#### 2.2 文本与数据处理 (text-data/)
- `re.md` - 正则表达式
- `json.md` - JSON 编解码 (从 data.md 拆分)
- `csv.md` - CSV 文件处理
- `string.md` - 字符串常量与模板
- `pickle.md` - 对象序列化

#### 2.3 数学与随机 (math-random/)
- `math.md` - 数学函数
- `random.md` - 随机数生成
- `statistics.md` - 统计函数
- `decimal.md` - 精确小数运算

#### 2.4 日期与时间 (datetime/)
- `datetime.md` - 日期时间处理
- `time.md` - 时间访问与转换
- `calendar.md` - 日历相关

#### 2.5 数据结构增强 (collections/)
- `collections.md` - 特殊容器数据类型
- `itertools.md` - 迭代器工具
- `functools.md` - 高阶函数工具
- `typing.md` - 类型提示 (从 tooling 迁移引用)
- `enum.md` - 枚举类型

#### 2.6 开发工具 (dev-tools/)
- `logging.md` - 日志记录 (从 debugging 迁移引用)
- `argparse.md` - 命令行参数解析
- `unittest.md` - 单元测试框架

#### 2.7 并发编程 (concurrency/)
- `threading.md` - 线程
- `multiprocessing.md` - 多进程
- `asyncio.md` - 异步 I/O (从 advanced/async 迁移引用)
- `concurrent-futures.md` - 并发执行器

#### 2.8 网络编程 (networking/)
- `urllib.md` - URL 处理
- `socket.md` - 底层网络接口
- `http.md` - HTTP 协议支持

#### 2.9 数据存储 (storage/)
- `sqlite3.md` - SQLite 数据库

#### 2.10 工具函数 (utilities/)
- `hashlib.md` - 安全哈希
- `base64.md` - 编码转换
- `copy.md` - 深浅拷贝
- `contextlib.md` - 上下文管理工具

### 3. 第三方库教程新增内容

#### 3.1 Web 开发 (web/)
- `fastapi.md` - 现代 Web 框架 (从 web-frameworks 拆分)
- `flask.md` - 轻量 Web 框架 (从 web-frameworks 拆分)
- `django.md` - 全栈 Web 框架 (新增概述)
- `pydantic.md` - 数据验证

#### 3.2 HTTP 客户端 (http/)
- `requests.md` - 同步 HTTP (从 http.md 拆分)
- `httpx.md` - 异步 HTTP (从 http.md 拆分)
- `aiohttp.md` - 异步 HTTP 框架

#### 3.3 数据处理 (data/)
- `pandas.md` - 数据分析 (从 data.md 拆分)
- `numpy.md` - 数值计算
- `polars.md` - 高性能数据帧

#### 3.4 数据库 (database/)
- `sqlalchemy.md` - ORM 框架
- `pymongo.md` - MongoDB 客户端
- `redis-py.md` - Redis 客户端

#### 3.5 测试 (testing/)
- `pytest.md` - 测试框架 (从 testing.md 拆分)
- `pytest-mock.md` - Mock 工具
- `coverage.md` - 代码覆盖率

#### 3.6 CLI 工具 (cli/)
- `click.md` - 命令行界面
- `typer.md` - 现代 CLI 框架
- `rich.md` - 终端美化

#### 3.7 配置与环境 (config/)
- `python-dotenv.md` - 环境变量管理
- `pyyaml.md` - YAML 解析
- `toml.md` - TOML 配置

## Impact

- **受影响的 specs**: python-libraries (需要大幅扩展)
- **受影响的代码/文件**:
  - `docs/backend/python/libraries/` - 重构目录结构
  - `docs/.vitepress/config.mts` - 更新侧边栏配置
  - 需要新建约 40+ 个 markdown 文件
- **对现有内容的影响**:
  - 现有的 `http.md`、`data.md`、`web-frameworks.md`、`testing.md` 需要拆分为更细粒度的文档
  - `pathlib.md` 和 `dataclass.md` 保持不变，仅迁移位置
- **用户体验变化**:
  - 侧边栏结构更清晰，按类别组织
  - 每个库有独立详细教程
  - 标准库与第三方库区分明确

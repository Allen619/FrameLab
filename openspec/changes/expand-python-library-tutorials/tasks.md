# Tasks: Expand Python Library Tutorials

## Phase 1: 目录结构重组

- [ ] 1.1 创建新的目录结构
  - [ ] 创建 `stdlib/` 标准库目录及子目录
  - [ ] 创建 `third-party/` 第三方库目录及子目录
  - [ ] 迁移现有文件到新结构

- [ ] 1.2 更新 VitePress 配置
  - [ ] 重构 `config.mts` 中的侧边栏配置
  - [ ] 添加嵌套分组支持
  - [ ] 测试导航是否正常工作

## Phase 2: 标准库文档编写

### 2.1 文件与系统操作
- [ ] 2.1.1 编写 `os-sys.md` - os/sys 模块
- [ ] 2.1.2 迁移并更新 `pathlib.md`
- [ ] 2.1.3 编写 `shutil.md` - 高级文件操作
- [ ] 2.1.4 编写 `subprocess.md` - 子进程管理

### 2.2 文本与数据处理
- [ ] 2.2.1 编写 `re.md` - 正则表达式
- [ ] 2.2.2 编写 `json.md` - JSON 处理 (从 data.md 拆分)
- [ ] 2.2.3 编写 `csv.md` - CSV 处理
- [ ] 2.2.4 编写 `string.md` - 字符串工具
- [ ] 2.2.5 编写 `pickle.md` - 对象序列化

### 2.3 数学与随机
- [ ] 2.3.1 编写 `math.md` - 数学函数
- [ ] 2.3.2 编写 `random.md` - 随机数
- [ ] 2.3.3 编写 `statistics.md` - 统计函数
- [ ] 2.3.4 编写 `decimal.md` - 精确计算

### 2.4 日期与时间
- [ ] 2.4.1 编写 `datetime.md` - 日期时间处理
- [ ] 2.4.2 编写 `time.md` - 时间函数
- [ ] 2.4.3 编写 `calendar.md` - 日历工具

### 2.5 数据结构增强
- [ ] 2.5.1 编写 `collections.md` - 特殊容器
- [ ] 2.5.2 编写 `itertools.md` - 迭代器工具
- [ ] 2.5.3 编写 `functools.md` - 高阶函数
- [ ] 2.5.4 编写 `enum.md` - 枚举类型

### 2.6 开发工具
- [ ] 2.6.1 编写 `argparse.md` - 命令行参数
- [ ] 2.6.2 编写 `unittest.md` - 单元测试

### 2.7 并发编程
- [ ] 2.7.1 编写 `threading.md` - 线程
- [ ] 2.7.2 编写 `multiprocessing.md` - 多进程
- [ ] 2.7.3 编写 `concurrent-futures.md` - 并发执行器

### 2.8 网络编程
- [ ] 2.8.1 编写 `urllib.md` - URL 处理
- [ ] 2.8.2 编写 `socket.md` - 套接字
- [ ] 2.8.3 编写 `http-server.md` - HTTP 服务

### 2.9 数据存储
- [ ] 2.9.1 编写 `sqlite3.md` - SQLite 数据库

### 2.10 工具函数
- [ ] 2.10.1 编写 `hashlib.md` - 哈希函数
- [ ] 2.10.2 编写 `base64.md` - 编码转换
- [ ] 2.10.3 编写 `copy.md` - 深浅拷贝
- [ ] 2.10.4 编写 `contextlib.md` - 上下文工具

## Phase 3: 第三方库文档编写

### 3.1 Web 开发
- [ ] 3.1.1 拆分并扩展 `fastapi.md`
- [ ] 3.1.2 拆分并扩展 `flask.md`
- [ ] 3.1.3 编写 `django-overview.md` - Django 概述
- [ ] 3.1.4 编写 `pydantic.md` - 数据验证

### 3.2 HTTP 客户端
- [ ] 3.2.1 拆分并扩展 `requests.md`
- [ ] 3.2.2 拆分并扩展 `httpx.md`
- [ ] 3.2.3 编写 `aiohttp.md` - 异步 HTTP

### 3.3 数据处理
- [ ] 3.3.1 拆分并扩展 `pandas.md`
- [ ] 3.3.2 编写 `numpy.md` - 数值计算
- [ ] 3.3.3 编写 `polars.md` - 高性能数据帧

### 3.4 数据库
- [ ] 3.4.1 编写 `sqlalchemy.md` - ORM
- [ ] 3.4.2 编写 `pymongo.md` - MongoDB
- [ ] 3.4.3 编写 `redis-py.md` - Redis

### 3.5 测试
- [ ] 3.5.1 拆分并扩展 `pytest.md`
- [ ] 3.5.2 编写 `pytest-mock.md` - Mock 工具
- [ ] 3.5.3 编写 `coverage.md` - 代码覆盖

### 3.6 CLI 工具
- [ ] 3.6.1 编写 `click.md` - 命令行工具
- [ ] 3.6.2 编写 `typer.md` - 现代 CLI
- [ ] 3.6.3 编写 `rich.md` - 终端美化

### 3.7 配置与环境
- [ ] 3.7.1 编写 `python-dotenv.md` - 环境变量
- [ ] 3.7.2 编写 `pyyaml.md` - YAML 解析
- [ ] 3.7.3 编写 `toml.md` - TOML 配置

## Phase 4: 索引页面与交叉引用

- [ ] 4.1 更新 `libraries/index.md` 主索引
- [ ] 4.2 编写 `stdlib/index.md` 标准库索引
- [ ] 4.3 编写 `third-party/index.md` 第三方库索引
- [ ] 4.4 为每个子分类创建 `index.md`
- [ ] 4.5 添加相关教程的交叉引用链接

## Phase 5: 质量保证

- [ ] 5.1 检查所有新文档的格式一致性
- [ ] 5.2 确保所有代码示例可运行
- [ ] 5.3 添加 JS/TS 对比示例
- [ ] 5.4 检查所有内部链接有效
- [ ] 5.5 运行 VitePress 构建测试
- [ ] 5.6 移动端响应式检查

## 依赖关系

- Phase 2-3 可以并行执行，但都依赖 Phase 1 完成
- Phase 4 依赖 Phase 2-3 的大部分内容完成
- Phase 5 依赖所有前置阶段完成

## 优先级建议

**高优先级** (前端开发者最常用):
- `json.md`, `re.md`, `datetime.md`
- `subprocess.md`, `os-sys.md`
- `collections.md`, `itertools.md`
- `requests.md`, `httpx.md`
- `pytest.md`, `pydantic.md`

**中优先级** (进阶常用):
- `argparse.md`, `logging.md`
- `threading.md`, `asyncio.md`
- `sqlite3.md`, `sqlalchemy.md`
- `pandas.md`, `click.md`

**低优先级** (特定场景):
- `socket.md`, `http-server.md`
- `calendar.md`, `statistics.md`
- `pickle.md`, `base64.md`

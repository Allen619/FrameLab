---
title: Python 常见问题 (FAQ)
description: 汇总前端开发者学习 Python 时的高频问题,涵盖语法、工具链、环境和最佳实践
outline: deep
---

# Python 常见问题 (FAQ)

本 FAQ 汇总了前端开发者在学习 Python 时最常遇到的问题,按主题分类。

## 语法相关

### 为什么 Python 使用缩进而不是大括号?

Python 使用缩进表示代码块,这是语言设计的核心理念之一,目的是提高代码可读性。

```python
# Python - 使用缩进
def greet(name):
    if name:
        print(f"Hello, {name}!")
    else:
        print("Hello, stranger!")
```

```javascript
// JavaScript - 使用大括号
function greet(name) {
  if (name) {
    console.log(`Hello, ${name}!`)
  } else {
    console.log('Hello, stranger!')
  }
}
```

**最佳实践**:

- 使用 4 个空格缩进 (PEP 8 推荐)
- 不要混用空格和 Tab
- 配置编辑器自动转换 Tab 为空格

### self 是什么?为什么方法必须有 self?

`self` 是实例方法的第一个参数,代表实例本身 (类似 JavaScript 的 `this`)。

```python
class User:
    def __init__(self, name):
        self.name = name  # self 代表实例

    def greet(self):
        return f"Hello, {self.name}!"

user = User("Alice")
print(user.greet())  # Hello, Alice!
```

**为什么显式声明?**

- Python 方法调用 `obj.method()` 会自动传递 `obj` 作为第一个参数
- 显式声明 `self` 让参数传递更明确
- 可以使用其他名称 (如 `cls` 用于类方法),但 `self` 是约定俗成

### 列表推导式 vs map()/filter()?

两者都能处理序列,但列表推导式更 Pythonic。

```python
# 列表推导式 (推荐)
squares = [x ** 2 for x in range(10)]
evens = [x for x in range(10) if x % 2 == 0]

# map/filter (函数式风格)
squares = list(map(lambda x: x ** 2, range(10)))
evens = list(filter(lambda x: x % 2 == 0, range(10)))
```

**何时使用**:

- 简单转换/过滤: 使用列表推导式
- 复杂逻辑或需要函数复用: 使用 `map()/filter()`
- 生成器 (节省内存): 使用生成器表达式 `(x**2 for x in range(10))`

### Python 有三元运算符吗?

有,但语法不同:

```python
# Python
result = "成年" if age >= 18 else "未成年"

# JavaScript
const result = age >= 18 ? '成年' : '未成年';
```

### 为什么 Python 没有 switch/case?

Python 3.10+ 引入了 `match/case` (模式匹配):

```python
# Python 3.10+
def http_status(code):
    match code:
        case 200:
            return "OK"
        case 404:
            return "Not Found"
        case 500:
            return "Server Error"
        case _:
            return "Unknown"
```

**Python 3.9 及以下**: 使用字典映射或 `if/elif/else`。

### 为什么字符串拼接推荐使用 f-string?

f-string (Python 3.6+) 是最快且最易读的字符串格式化方式。

```python
name = "Alice"
age = 30

# f-string (推荐)
message = f"My name is {name}, I'm {age} years old"

# % 格式化 (旧)
message = "My name is %s, I'm %d years old" % (name, age)

# str.format() (较旧)
message = "My name is {}, I'm {} years old".format(name, age)
```

---

## 工具链相关

### pip vs Poetry vs uv,如何选择?

| 工具       | 适用场景             | 优缺点                                |
| ---------- | -------------------- | ------------------------------------- |
| **pip**    | 简单脚本,学习 Python | 内置,无额外依赖;依赖解析较弱          |
| **Poetry** | 成熟项目,发布包      | 完整项目管理,依赖锁定;速度较慢        |
| **uv**     | 现代项目,追求速度    | 极快 (10-100x),兼容 pip;较新,生态较少 |

**推荐**: 新项目使用 **uv**,现有项目保持原工具。

### 虚拟环境是什么?为什么需要?

虚拟环境隔离项目依赖,避免版本冲突 (类似 Node.js 的 `node_modules`)。

```bash
# 创建虚拟环境
python -m venv .venv

# 激活 (macOS/Linux)
source .venv/bin/activate

# 激活 (Windows)
.venv\Scripts\activate

# 或使用 uv (自动管理虚拟环境)
uv init my-project
```

**为什么需要?**

- 不同项目可能依赖同一个包的不同版本
- 避免污染系统 Python 环境
- 便于项目迁移和部署

### 如何管理多个 Python 版本?

使用 **pyenv** (类似 nvm):

```bash
# 安装多个版本
pyenv install 3.12.0
pyenv install 3.11.5

# 全局默认版本
pyenv global 3.12.0

# 项目级版本 (创建 .python-version 文件)
pyenv local 3.11.5

# 查看当前版本
pyenv version
```

详见 [环境安装指南](./setup)

### requirements.txt vs pyproject.toml?

| 文件               | 用途              | 工具       |
| ------------------ | ----------------- | ---------- |
| `requirements.txt` | 依赖列表          | pip        |
| `pyproject.toml`   | 项目元数据 + 依赖 | Poetry, uv |

**现代项目推荐**: 使用 `pyproject.toml` (PEP 518 标准)。

```toml
# pyproject.toml
[project]
name = "my-app"
version = "0.1.0"
dependencies = [
    "fastapi>=0.100.0",
    "pydantic>=2.0.0",
]
```

---

## 环境相关

### Python 2 vs Python 3,还需要关心吗?

**不需要**。Python 2 于 2020 年停止支持,所有新项目应使用 Python 3.10+。

**主要差异** (了解即可):

- `print` 是函数: `print("hello")` (不是 `print "hello"`)
- 字符串默认 Unicode
- 整数除法: `10 / 3` 返回 `3.333...` (不是 `3`)

### 如何在 Windows/macOS/Linux 安装 Python?

**推荐方式**: 使用 pyenv

```bash
# macOS (Homebrew)
brew install pyenv

# Windows (Scoop)
scoop install pyenv

# Linux (官方脚本)
curl https://pyenv.run | bash
```

**替代方式**: 从 [python.org](https://www.python.org/downloads/) 下载官方安装器。

详见 [环境安装指南](./setup)

### python vs python3 命令有什么区别?

- **macOS/Linux**: 系统可能预装 Python 2,`python` 指向 Python 2,`python3` 指向 Python 3
- **Windows**: 通常只有一个 Python,`python` 和 `python3` 都可用
- **pyenv**: 使用 `python` 即可 (pyenv 管理的版本)

**最佳实践**: 使用 `python3` 和 `pip3` 确保使用 Python 3。

---

## 最佳实践

### Python 命名规范 (PEP 8)?

| 类型      | 规范                  | 示例                      |
| --------- | --------------------- | ------------------------- |
| 变量/函数 | `snake_case`          | `user_name`, `get_data()` |
| 类        | `PascalCase`          | `User`, `DataModel`       |
| 常量      | `UPPER_SNAKE_CASE`    | `MAX_SIZE`, `API_KEY`     |
| 私有成员  | `_leading_underscore` | `_internal_method`        |
| 模块/包   | `lowercase`           | `utils`, `mypackage`      |

```python
# 推荐
class UserManager:
    MAX_USERS = 100

    def __init__(self):
        self._cache = {}

    def get_user(self, user_id):
        return self._fetch_from_cache(user_id)

    def _fetch_from_cache(self, key):
        return self._cache.get(key)
```

### 项目目录结构推荐?

```
my-project/
├── src/
│   └── my_package/
│       ├── __init__.py
│       ├── main.py
│       └── utils.py
├── tests/
│   ├── __init__.py
│   └── test_main.py
├── docs/
│   └── README.md
├── .venv/              # 虚拟环境
├── .python-version     # pyenv 版本
├── pyproject.toml      # 项目配置
└── README.md
```

**说明**:

- `src/`: 源代码目录
- `tests/`: 测试代码
- `.venv/`: 虚拟环境 (不提交到 Git)
- `pyproject.toml`: 项目元数据和依赖

### 如何组织代码模块?

**按功能划分** (推荐):

```
my_app/
├── api/          # API 路由
│   ├── routes.py
│   └── schemas.py
├── core/         # 核心业务逻辑
│   ├── engine.py
│   └── utils.py
├── models/       # 数据模型
│   └── user.py
└── config.py     # 配置
```

**按层级划分**:

```
my_app/
├── models/       # 数据层
├── services/     # 业务层
├── controllers/  # 控制层
└── views/        # 视图层
```

### type hints (类型提示) 必须使用吗?

不是必须,但**强烈推荐**:

```python
# 使用类型提示 (推荐)
def greet(name: str) -> str:
    return f"Hello, {name}!"

# 不使用类型提示
def greet(name):
    return f"Hello, {name}!"
```

**优点**:

- 提高代码可读性
- IDE 自动补全更准确
- 使用 mypy 进行静态类型检查
- 减少运行时错误

---

## 性能相关

### Python 为什么比 JavaScript 慢?

**不完全正确**。性能取决于具体场景:

- **I/O 密集型**: Python 和 Node.js 性能相近
- **CPU 密集型**: Python 较慢 (GIL 限制),但可使用多进程或 C 扩展加速
- **科学计算**: NumPy/Pandas 使用 C 扩展,性能接近 C

**何时关心性能?**

- Web 应用: FastAPI 性能接近 Node.js
- 数据处理: NumPy/Pandas 已优化
- 机器学习: PyTorch/TensorFlow 使用 GPU 加速

### 如何提升 Python 性能?

1. **使用 NumPy/Pandas** (科学计算)
2. **使用生成器** (节省内存)
3. **使用多进程** (绕过 GIL)
4. **使用 Cython** (编译为 C)
5. **使用异步 I/O** (asyncio)

---

## 调试相关

### 如何调试 Python 代码?

**方法 1: print() 调试** (最简单)

```python
def calculate(x, y):
    print(f"x={x}, y={y}")  # 调试
    result = x + y
    print(f"result={result}")  # 调试
    return result
```

**方法 2: VSCode 调试** (推荐)

1. 设置断点 (点击行号左侧)
2. 按 F5 启动调试
3. 查看变量、调用栈

**方法 3: pdb (命令行调试)**

```python
import pdb

def calculate(x, y):
    pdb.set_trace()  # 设置断点
    result = x + y
    return result
```

详见 [VSCode 调试](../debugging/vscode)

---

## 包管理相关

### 如何发布 Python 包到 PyPI?

使用 Poetry 或 Flit:

```bash
# 使用 Poetry
poetry build
poetry publish

# 或使用 twine
pip install twine
python -m build
twine upload dist/*
```

### 如何从 GitHub 安装包?

```bash
# pip
pip install git+https://github.com/user/repo.git

# uv
uv add git+https://github.com/user/repo.git

# Poetry
poetry add git+https://github.com/user/repo.git
```

---

## 小结

### 关键要点

- **语法**: 缩进表示代码块,`self` 是实例引用,f-string 是最佳字符串格式化
- **工具链**: uv (快速) > Poetry (成熟) > pip (基础)
- **环境**: 使用 pyenv 管理版本,使用虚拟环境隔离项目
- **最佳实践**: 遵循 PEP 8,使用类型提示,合理组织模块

### 推荐下一步阅读

- [环境安装指南](./setup) - 搭建开发环境
- [常见陷阱](./pitfalls) - 避免常见错误
- [进阶学习路径](./next-steps) - 选择学习方向

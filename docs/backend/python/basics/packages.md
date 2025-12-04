---
title: Python 包系统
description: 学习如何使用 __init__.py 组织多个模块为包,理解包层级结构和命名空间包
outline: deep
---

# Python 包系统

Python 包 (Package) 是组织多个模块的目录结构,通过 `__init__.py` 文件标记目录为包,实现代码的模块化组织。

## 学习目标

- 理解 Python 包的概念和组织方式
- 掌握 `__init__.py` 文件的作用
- 了解包层级结构和子包
- 理解命名空间包 (Python 3.3+)
- 对比 Python 包与 npm 包管理

## 核心概念

### **init**.py 文件

`__init__.py` 是包的初始化文件,标记目录为 Python 包,可包含包级初始化代码。

**包结构示例**:

```
myproject/
├── my_package/
│   ├── __init__.py      # 包初始化文件
│   ├── module_a.py      # 模块 A
│   └── module_b.py      # 模块 B
└── main.py
```

****init**.py 示例**:

```python
# my_package/__init__.py

# 可以为空 (Python 3.3+ 甚至可以省略,但不推荐)

# 或包含初始化代码
print("my_package is being imported")

# 或重新导出子模块的内容
from .module_a import func_a
from .module_b import func_b

# 控制 from my_package import * 的导入内容
__all__ = ['func_a', 'func_b']
```

**使用包**:

```python
# main.py
import my_package

# 访问子模块
from my_package import module_a
from my_package import module_b

# 如果 __init__.py 重新导出了,可以直接访问
from my_package import func_a, func_b
```

### 包层级结构

包可以嵌套,形成层级结构:

```
myproject/
├── app/
│   ├── __init__.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── engine.py
│   │   └── utils.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes.py
│   │   └── schemas.py
│   └── config.py
└── main.py
```

**导入子包成员**:

```python
# 绝对导入
from app.core import engine
from app.api.routes import get_user

# 相对导入 (在包内部使用)
# 在 app/api/routes.py 中:
from ..core import engine        # 上级目录的 core 包
from ..core.utils import helper  # 上级目录 core 包的 utils 模块
from . import schemas            # 同级目录的 schemas 模块
```

**相对导入语法**:

- `.` 表示当前包
- `..` 表示上级包
- `...` 表示上上级包 (可以继续向上)

### 命名空间包 (Python 3.3+)

从 Python 3.3 开始,可以省略 `__init__.py` 创建命名空间包,允许包分布在不同目录。

```
project1/
└── namespace_pkg/
    └── subpkg_a/
        └── module.py

project2/
└── namespace_pkg/
    └── subpkg_b/
        └── module.py
```

**行为说明**:

- 两个 `namespace_pkg` 目录都没有 `__init__.py`
- Python 会将它们视为同一个命名空间包的不同部分
- 可以同时导入两个子包的内容

**何时使用**:

- 多团队协作,各自维护独立子包
- 插件系统,允许第三方扩展

**注意**: 常规项目建议保留 `__init__.py`,使包结构更明确。

### **all** 变量

`__all__` 列表控制 `from package import *` 的导入内容:

```python
# my_package/__init__.py

from .module_a import func_a, func_b
from .module_b import ClassA, ClassB

# 只导出部分内容
__all__ = ['func_a', 'ClassA']
```

```python
# main.py
from my_package import *

# 只能访问 func_a 和 ClassA
func_a()
ClassA()

# func_b 和 ClassB 不在 __all__ 中,不会被 * 导入
# 但仍可显式导入:
from my_package import func_b
```

## 💡 对前端开发者

### 与 npm 包对比

Python 包与 npm 包有相似的组织理念,但实现方式不同:

| npm / Node.js           | Python                           | 差异说明                       |
| ----------------------- | -------------------------------- | ------------------------------ |
| `package.json`          | `__init__.py` / `pyproject.toml` | Python 包初始化,项目元数据分开 |
| `index.js` (入口)       | `__init__.py`                    | Python 包入口可重新导出成员    |
| `node_modules/`         | `site-packages/`                 | 第三方包安装目录               |
| `import pkg from 'pkg'` | `import pkg`                     | 导入机制相似                   |
| `export { a, b }`       | `__all__ = ['a', 'b']`           | 控制公开 API                   |

**包结构对比**:

```
# Node.js 项目
my-package/
├── package.json
├── index.js
├── lib/
│   ├── module-a.js
│   └── module-b.js
└── tests/

# Python 项目
my_package/
├── pyproject.toml
├── my_package/
│   ├── __init__.py
│   ├── module_a.py
│   └── module_b.py
└── tests/
```

**关键差异**:

- **包名约定**: npm 使用 `kebab-case`,Python 使用 `snake_case`
- **入口文件**: Node.js 的 `index.js` 可省略,Python 的 `__init__.py` 在 3.3+ 可省略但不推荐
- **相对导入**: Python 使用 `.` 和 `..`,Node.js 使用 `./` 和 `../`
- **包发布**: npm 发布到 npm registry,Python 发布到 PyPI

## ⚠️ 常见误区

### 忘记添加 **init**.py

❌ **错误示例**:

```
myproject/
├── my_package/          # 缺少 __init__.py
│   ├── module_a.py
│   └── module_b.py
└── main.py
```

```python
# main.py
import my_package  # ModuleNotFoundError (Python < 3.3)
```

**为什么错误**: Python 3.3 之前必须有 `__init__.py` 才能识别为包。虽然 3.3+ 支持命名空间包,但建议始终添加 `__init__.py` 以明确意图。

✅ **正确示例**:

```
myproject/
├── my_package/
│   ├── __init__.py      # 可以为空,但必须存在
│   ├── module_a.py
│   └── module_b.py
└── main.py
```

### 相对导入路径错误

❌ **错误示例**:

```python
# app/api/routes.py
from .core import engine  # ImportError: attempted relative import beyond top-level package
```

**为什么错误**: `.core` 表示当前包的 `core` 子模块,但 `core` 在上级包 `app` 中,应使用 `..core`。

✅ **正确示例**:

```python
# app/api/routes.py
from ..core import engine        # 正确:上级包的 core 子模块
from ..core.utils import helper  # 正确:上级包 core 的 utils 模块
```

### 在顶层脚本使用相对导入

❌ **错误示例**:

```python
# main.py (顶层脚本)
from . import my_package  # ImportError: attempted relative import with no known parent package
```

**为什么错误**: 相对导入只能在包内部使用,顶层脚本没有父包。

✅ **正确示例**:

```python
# main.py
from my_package import module_a  # 使用绝对导入
import my_package
```

## 小结

### 本章要点

- Python 包是包含 `__init__.py` 的目录,用于组织多个模块
- `__init__.py` 可以为空,或包含包初始化代码和重新导出的内容
- 包可以嵌套形成层级结构,使用绝对导入或相对导入访问子包
- `__all__` 变量控制 `from package import *` 的导入内容
- Python 3.3+ 支持命名空间包 (无 `__init__.py`),但建议保留以明确包结构

### 与 JS/TS 的关键差异

| JavaScript/TypeScript | Python                 | 差异说明                      |
| --------------------- | ---------------------- | ----------------------------- |
| `package.json` 定义包 | `__init__.py` 标记包   | Python 包结构基于文件系统     |
| `index.js` 作为入口   | `__init__.py` 作为入口 | Python 可重新导出成员         |
| `export { a, b }`     | `__all__ = ['a', 'b']` | 控制公开 API                  |
| `./` 相对路径         | `.` 相对导入           | Python 使用点号表示相对包路径 |

### 推荐下一步阅读

- [模块系统](./modules) - 回顾 Python 模块基础
- [依赖管理工具](../tooling/dependency-management/) - 学习如何管理第三方包
- [环境安装指南](../guide/setup) - 了解 Python 包管理工具 (pip/uv/Poetry)

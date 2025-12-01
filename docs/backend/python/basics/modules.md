---
title: Python 模块系统
description: 学习如何使用 import/from 语句导入模块,理解 __name__ 变量,对比 ES6 模块系统
outline: deep
---

# Python 模块系统

Python 的模块系统用于组织和重用代码,通过 `import` 和 `from` 语句导入其他文件中的功能。

## 学习目标

- 理解 Python 模块的概念和作用
- 掌握 `import` 和 `from` 语句的使用
- 了解模块搜索路径和 `__name__` 变量
- 对比 Python 模块与 JavaScript ES6 模块

## 核心概念

### import 语句

`import` 语句用于导入整个模块,使用模块名访问其中的函数、类和变量。

```python
# 导入标准库模块
import math

# 使用模块中的函数
result = math.sqrt(16)
print(result)  # 输出: 4.0

# 访问模块中的常量
print(math.pi)  # 输出: 3.141592653589793
```

**导入多个模块**:

```python
# 一次导入多个模块
import os, sys, json

# 使用别名简化模块名
import datetime as dt

now = dt.datetime.now()
print(now)
```

### from 语句

`from` 语句用于从模块中导入特定成员,可以直接使用成员名而无需模块前缀。

```python
# 从模块导入特定函数
from math import sqrt, pi

# 直接使用导入的成员
result = sqrt(16)
print(result)  # 输出: 4.0
print(pi)      # 输出: 3.141592653589793
```

**导入所有成员** (不推荐):

```python
# 导入模块的所有成员
from math import *

# 可直接使用所有函数,但容易产生命名冲突
print(sqrt(25))  # 输出: 5.0
```

### **name** 变量

每个模块都有一个内置变量 `__name__`,用于区分模块是作为脚本运行还是被导入。

```python
# my_module.py
def greet(name):
    print(f"Hello, {name}!")

if __name__ == "__main__":
    # 仅当作为脚本直接运行时执行
    greet("World")
    print("This module was run directly")
```

**行为说明**:

- 当运行 `python my_module.py` 时,`__name__` 的值为 `"__main__"`,会执行测试代码
- 当其他模块导入 `import my_module` 时,`__name__` 的值为 `"my_module"`,不会执行测试代码

### 模块搜索路径

Python 按以下顺序搜索模块:

1. 当前目录
2. `PYTHONPATH` 环境变量指定的目录
3. 标准库目录
4. 第三方包目录 (如 `site-packages`)

```python
# 查看模块搜索路径
import sys
print(sys.path)
```

## 💡 对前端开发者

### 与 JavaScript/TypeScript 对比

Python 的模块系统与 JavaScript ES6 模块有相似之处,但也有关键差异:

| JavaScript/TypeScript             | Python                       | 差异说明                                  |
| --------------------------------- | ---------------------------- | ----------------------------------------- |
| `import { foo } from './module'`  | `from module import foo`     | Python 无需 `./` 相对路径前缀             |
| `import * as mod from './module'` | `import module`              | Python 导入整个模块更常见                 |
| `export function foo() {}`        | 直接定义函数                 | Python 无需显式 export,所有顶层名称可导入 |
| `export default ...`              | 无直接对应                   | Python 使用 `__all__` 列表控制导出        |
| `if (require.main === module)`    | `if __name__ == "__main__":` | 判断是否作为主程序运行                    |

**示例对比**:

```typescript
// JavaScript ES6
import { sqrt } from './math.js'
import * as math from './math.js'

console.log(sqrt(16))
console.log(math.PI)
```

```python
# Python
from math import sqrt
import math

print(sqrt(16))
print(math.pi)
```

**关键差异**:

- **隐式导出**: Python 中所有模块级定义默认可导入,而 JS 需要显式 `export`
- **无默认导出**: Python 没有 `export default`,但可以通过 `__all__` 控制 `from module import *` 导入的内容
- **模块名解析**: Python 基于搜索路径,JS 使用相对/绝对路径
- **同步加载**: Python 模块导入是同步的,JS 支持异步 `import()`

## ⚠️ 常见误区

### 循环导入

❌ **错误示例**:

```python
# module_a.py
from module_b import func_b

def func_a():
    return func_b()

# module_b.py
from module_a import func_a  # 循环导入!

def func_b():
    return func_a()
```

**为什么错误**: 两个模块互相导入会导致 `ImportError`,因为导入时模块还未完全初始化。这在 JavaScript 中也是反模式,但 ES6 模块有更好的循环依赖处理。

✅ **正确示例**:

```python
# module_a.py
def func_a(func_b):
    return func_b()

# module_b.py
def func_b():
    return "result"

# main.py
from module_a import func_a
from module_b import func_b

result = func_a(func_b)
```

**最佳实践**:

- 重构代码避免循环依赖
- 或使用延迟导入 (在函数内部导入)
- 或将共享代码提取到第三个模块

### 使用 from module import \*

❌ **错误示例**:

```python
from math import *
from statistics import *

# 命名冲突!如果两个模块有同名函数,后者会覆盖前者
```

**为什么错误**: `import *` 会导入所有公开名称,容易产生命名冲突,且不清楚哪些名称来自哪个模块。

✅ **正确示例**:

```python
# 显式导入需要的函数
from math import sqrt, pi
from statistics import mean, median

# 或使用别名避免冲突
import math
import statistics as stats
```

## 小结

### 本章要点

- Python 使用 `import` 导入整个模块,使用 `from` 导入特定成员
- `__name__` 变量用于判断模块是作为脚本运行还是被导入
- 模块搜索路径由 `sys.path` 决定,包含当前目录和标准库路径
- 避免循环导入,保持模块依赖单向
- 避免使用 `from module import *`,显式导入可提高代码可读性

### 与 JS/TS 的关键差异

| JavaScript/TypeScript       | Python                | 差异说明                                 |
| --------------------------- | --------------------- | ---------------------------------------- |
| `export` 显式导出           | 默认全部可导入        | Python 可用 `__all__` 限制               |
| 文件路径导入 (`'./module'`) | 模块名导入 (`module`) | Python 基于搜索路径,非相对路径           |
| 异步导入 (`import()`)       | 同步导入              | Python 3.10+ 有 `importlib` 支持动态导入 |
| ESM/CommonJS 两套系统       | 统一模块系统          | Python 只有一套 import 机制              |

### 推荐下一步阅读

- [包系统](./packages) - 了解如何组织多个模块为包
- [文件 I/O](./file-io) - 学习读写文件的基本操作
- [概念映射表](../guide/mapping) - 查看更多 JS/Python 语法对照

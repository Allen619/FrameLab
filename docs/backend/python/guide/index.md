---
title: 前端迁移指南
description: 从 JavaScript/TypeScript 迁移到 Python 的完整指南
---

# 前端迁移指南

## 欢迎，前端开发者！

如果你是一位有 JavaScript/TypeScript 经验的开发者，正在学习 Python，你来对地方了。本指南将帮助你利用已有的前端知识，快速建立 Python 概念的映射。

## 为什么学 Python？

作为前端开发者，学习 Python 可以帮助你：

- **后端开发** - 使用 FastAPI、Django 等框架构建 API
- **数据分析** - 使用 Pandas、NumPy 处理数据
- **机器学习** - 使用 TensorFlow、PyTorch 构建模型
- **自动化脚本** - 编写工具脚本提升效率
- **全栈能力** - 成为更全面的开发者

## 核心差异速览

### 1. 语法差异

| 特性     | JavaScript    | Python         |
| -------- | ------------- | -------------- |
| 代码块   | `{ }`         | 缩进 (4空格)   |
| 语句结束 | `;` (可选)    | 无             |
| 注释     | `//` `/* */`  | `#` `""" """`  |
| 变量声明 | `let`/`const` | 直接赋值       |
| 常量     | `const`       | 全大写命名约定 |

### 2. 类型系统

| JavaScript  | Python                  |
| ----------- | ----------------------- |
| `number`    | `int`, `float`          |
| `string`    | `str`                   |
| `boolean`   | `bool` (`True`/`False`) |
| `null`      | `None`                  |
| `undefined` | 无对应概念              |
| `Array`     | `list`                  |
| `Object`    | `dict`                  |
| `Set`       | `set`                   |
| `Map`       | `dict`                  |

### 3. 工具链对比

| 用途     | JavaScript        | Python            |
| -------- | ----------------- | ----------------- |
| 包管理   | npm/pnpm/yarn     | Poetry/pip        |
| 依赖锁定 | package-lock.json | poetry.lock       |
| 代码检查 | ESLint            | Ruff              |
| 格式化   | Prettier          | Ruff (或 Black)   |
| 类型检查 | TypeScript        | mypy + Type Hints |
| 虚拟环境 | node_modules      | .venv             |

## 学习路径推荐

### 第一步：基础语法

从你熟悉的概念出发：

1. [变量与数据类型](/backend/python/basics/variables) - 学习 Python 的变量声明和类型
2. [控制流](/backend/python/basics/control-flow) - if/for/while 的 Python 写法
3. [函数](/backend/python/basics/functions) - def、\*args、\*\*kwargs
4. [类与对象](/backend/python/basics/classes) - Python 的面向对象

### 第二步：数据结构

理解 Python 的核心数据结构：

1. [列表 List](/backend/python/data-structures/lists) - 对应 JS Array
2. [字典 Dict](/backend/python/data-structures/dicts) - 对应 JS Object
3. [集合 Set](/backend/python/data-structures/sets) - 对应 JS Set
4. [元组 Tuple](/backend/python/data-structures/tuples) - JS 没有直接对应

### 第三步：工程化工具

掌握现代 Python 开发工具：

1. [依赖管理](/backend/python/tooling/dependency-management/) - 对应 npm/pnpm
2. [Ruff](/backend/python/tooling/ruff) - 对应 ESLint + Prettier
3. [类型系统](/backend/python/tooling/typing) - 对应 TypeScript

### 第四步：高级特性

深入 Python 独特的高级特性：

1. [装饰器](/backend/python/advanced/decorators) - 类似 HOC 概念
2. [生成器](/backend/python/advanced/generators) - 对应 JS Generator
3. [异步编程](/backend/python/advanced/async) - 对应 Promise/async-await

## 快速参考

### 概念映射表

查看完整的 [JS → Python 概念映射表](/backend/python/guide/mapping)，包含 20+ 个概念对照。

### Hello World 对比

```javascript
// JavaScript
console.log('Hello, World!')
```

```python
# Python
print("Hello, World!")
```

### 函数定义对比

```javascript
// JavaScript
function greet(name, greeting = 'Hello') {
  return `${greeting}, ${name}!`
}

const greetArrow = (name) => `Hello, ${name}!`
```

```python
# Python
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

greet_lambda = lambda name: f"Hello, {name}!"
```

### 类定义对比

```javascript
// JavaScript
class User {
  constructor(name, age) {
    this.name = name
    this.age = age
  }

  greet() {
    return `Hi, I'm ${this.name}`
  }
}

const user = new User('Alice', 25)
```

```python
# Python
class User:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def greet(self):
        return f"Hi, I'm {self.name}"

user = User("Alice", 25)
```

## 常见陷阱

### 1. 缩进敏感

```python
# Python 使用缩进表示代码块，混用空格和 Tab 会报错
def foo():
    if True:
        print("正确缩进")
    print("仍在函数内")
print("函数外")
```

### 2. 布尔值大写

```python
# 正确
is_valid = True
is_empty = False

# 错误 - NameError
# is_valid = true
```

### 3. None 检查

```python
# 推荐用 is 而非 ==
if result is None:
    print("无结果")

if result is not None:
    print(f"结果: {result}")
```

### 4. 空容器是 Falsy

```python
# Python 中空列表、空字典是 False
if []:
    print("不会执行")  # 空列表为 False

if {}:
    print("不会执行")  # 空字典为 False

# JavaScript 中 [] 和 {} 是 Truthy
```

## 下一步

准备好开始学习了吗？

- 📚 从 [基础语法](/backend/python/basics/) 开始系统学习
- 🗺️ 查看 [概念映射表](/backend/python/guide/mapping) 快速对照
- 🛠️ 了解 [工程化工具](/backend/python/tooling/) 配置开发环境

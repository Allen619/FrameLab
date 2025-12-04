---
title: 概念映射表
description: JavaScript/TypeScript 到 Python 的完整概念映射表
---

# JS/TS → Python 概念映射表

本页提供了 JavaScript/TypeScript 概念到 Python 的完整映射，帮助你快速建立概念对应关系。

## 数据类型

| JS/TS 概念                 | Python 对应             | 相似度 | 说明                     | 详情                                 |
| -------------------------- | ----------------------- | ------ | ------------------------ | ------------------------------------ |
| `number`                   | `int`, `float`          | 中     | Python 区分整数和浮点数  | [→](/backend/python/basics/variables)       |
| `string`                   | `str`                   | 高     | 基本相同，格式化语法不同 | [→](/backend/python/basics/variables)       |
| `boolean` (`true`/`false`) | `bool` (`True`/`False`) | 高     | 注意首字母大写           | [→](/backend/python/basics/variables)       |
| `null`                     | `None`                  | 高     | 用 `is None` 检查        | [→](/backend/python/basics/variables)       |
| `undefined`                | -                       | -      | Python 无此概念          | -                                    |
| `Array`                    | `list`                  | 高     | 可变有序序列             | [→](/backend/python/data-structures/lists)  |
| `Object`                   | `dict`                  | 中     | dict 键必须可哈希        | [→](/backend/python/data-structures/dicts)  |
| `Set`                      | `set`                   | 高     | 基本相同                 | [→](/backend/python/data-structures/sets)   |
| `Map`                      | `dict`                  | 中     | Python dict 保持插入顺序 | [→](/backend/python/data-structures/dicts)  |
| `Tuple` (TS)               | `tuple`                 | 高     | Python tuple 不可变      | [→](/backend/python/data-structures/tuples) |

## 变量与常量

| JS/TS 概念             | Python 对应      | 相似度 | 说明             | 详情                           |
| ---------------------- | ---------------- | ------ | ---------------- | ------------------------------ |
| `let`                  | 直接赋值         | 高     | 无需声明关键字   | [→](/backend/python/basics/variables) |
| `const`                | 全大写命名       | 低     | 只是约定，非强制 | [→](/backend/python/basics/variables) |
| `var`                  | -                | -      | 不推荐，直接赋值 | -                              |
| 模板字符串 `` `${}` `` | f-string `f"{}"` | 高     | 语法略不同       | [→](/backend/python/basics/variables) |

## 控制流

| JS/TS 概念          | Python 对应          | 相似度 | 说明                   | 详情                              |
| ------------------- | -------------------- | ------ | ---------------------- | --------------------------------- |
| `if/else if/else`   | `if/elif/else`       | 高     | elif 而非 else if      | [→](/backend/python/basics/control-flow) |
| `switch/case`       | `match/case`         | 中     | Python 3.10+，功能更强 | [→](/backend/python/basics/control-flow) |
| `for...of`          | `for...in`           | 高     | 关键字不同             | [→](/backend/python/basics/control-flow) |
| `for...in`          | `for key in dict`    | 中     | 遍历键名               | [→](/backend/python/basics/control-flow) |
| `while`             | `while`              | 高     | 基本相同               | [→](/backend/python/basics/control-flow) |
| `try/catch/finally` | `try/except/finally` | 高     | catch → except         | [→](/backend/python/basics/control-flow) |
| `throw`             | `raise`              | 高     | 关键字不同             | [→](/backend/python/basics/control-flow) |
| `&&`                | `and`                | 高     | 使用英文单词           | [→](/backend/python/basics/control-flow) |
| `\|\|`              | `or`                 | 高     | 使用英文单词           | [→](/backend/python/basics/control-flow) |
| `!`                 | `not`                | 高     | 使用英文单词           | [→](/backend/python/basics/control-flow) |
| `? :` (三元)        | `x if cond else y`   | 中     | 语序不同               | [→](/backend/python/basics/control-flow) |

## 函数

| JS/TS 概念           | Python 对应 | 相似度 | 说明              | 详情                           |
| -------------------- | ----------- | ------ | ----------------- | ------------------------------ |
| `function`           | `def`       | 高     | 关键字不同        | [→](/backend/python/basics/functions) |
| 箭头函数 `=>`        | `lambda`    | 低     | lambda 仅单表达式 | [→](/backend/python/basics/functions) |
| 默认参数             | 默认参数    | 高     | 语法相同          | [→](/backend/python/basics/functions) |
| `...args` (剩余参数) | `*args`     | 高     | 接收元组          | [→](/backend/python/basics/functions) |
| `...array` (展开)    | `*list`     | 高     | 解包列表          | [→](/backend/python/basics/functions) |
| 解构 `{a, b}`        | `**kwargs`  | 中     | 接收字典          | [→](/backend/python/basics/functions) |
| `return`             | `return`    | 高     | 基本相同          | [→](/backend/python/basics/functions) |

## 类与对象

| JS/TS 概念    | Python 对应           | 相似度 | 说明              | 详情                         |
| ------------- | --------------------- | ------ | ----------------- | ---------------------------- |
| `class`       | `class`               | 高     | 关键字相同        | [→](/backend/python/basics/classes) |
| `constructor` | `__init__`            | 高     | 方法名不同        | [→](/backend/python/basics/classes) |
| `this`        | `self`                | 高     | 必须显式声明      | [→](/backend/python/basics/classes) |
| `new Class()` | `Class()`             | 高     | 无需 new          | [→](/backend/python/basics/classes) |
| `extends`     | `class Child(Parent)` | 高     | 语法不同          | [→](/backend/python/basics/classes) |
| `super()`     | `super()`             | 高     | 基本相同          | [→](/backend/python/basics/classes) |
| `#private`    | `_name` (约定)        | 低     | Python 无真正私有 | [→](/backend/python/basics/classes) |
| `static`      | 类属性                | 中     | 概念类似          | [→](/backend/python/basics/classes) |
| `get/set`     | `@property`           | 高     | 装饰器实现        | [→](/backend/python/basics/classes) |
| `toString()`  | `__str__`             | 高     | 魔术方法          | [→](/backend/python/basics/classes) |

## 模块与包系统

| JavaScript/TypeScript             | Python                           | 相似度 | 说明                       | 详情                          |
| --------------------------------- | -------------------------------- | ------ | -------------------------- | ----------------------------- |
| `import { foo } from './module'`  | `from module import foo`         | 高     | 无需 `./` 相对路径         | [→](/backend/python/basics/modules)  |
| `import * as mod from './module'` | `import module`                  | 高     | 导入整个模块               | [→](/backend/python/basics/modules)  |
| `export function foo() {}`        | 直接定义 (模块级可见)            | 低     | Python 无需显式 export     | [→](/backend/python/basics/modules)  |
| `export default ...`              | 无直接对应                       | 低     | Python 使用 `__all__` 控制 | [→](/backend/python/basics/modules)  |
| `export { a, b }`                 | `__all__ = ['a', 'b']`           | 中     | 控制 `import *`            | [→](/backend/python/basics/modules)  |
| `package.json`                    | `__init__.py` / `pyproject.toml` | 中     | 包元数据和初始化           | [→](/backend/python/basics/packages) |
| `index.js` (入口)                 | `__init__.py` (包入口)           | 中     | Python 可重新导出成员      | [→](/backend/python/basics/packages) |
| `node_modules/`                   | `site-packages/`                 | 高     | 第三方包安装目录           | [→](/backend/python/tooling/dependency-management/)  |
| 相对导入 `'./module'`             | 相对导入 `from . import module`  | 中     | Python 使用点号            | [→](/backend/python/basics/packages) |
| 绝对导入 `'module'`               | 绝对导入 `import module`         | 高     | 基于模块搜索路径           | [→](/backend/python/basics/modules)  |

## 工程化工具

| JS/TS 概念          | Python 对应                  | 相似度 | 说明       | 详情                         |
| ------------------- | ---------------------------- | ------ | ---------- | ---------------------------- |
| npm/pnpm/yarn       | Poetry/uv                    | 高     | 命令类似   | [→](/backend/python/tooling/dependency-management/) |
| `npm init`          | `poetry init` / `uv init`    | 高     | 初始化项目 | [→](/backend/python/tooling/dependency-management/) |
| `npm install`       | `poetry install` / `uv sync` | 高     | 安装依赖   | [→](/backend/python/tooling/dependency-management/) |
| `npm add <pkg>`     | `poetry add` / `uv add`      | 高     | 添加依赖   | [→](/backend/python/tooling/dependency-management/) |
| `npm run <script>`  | `poetry run` / `uv run`      | 高     | 运行脚本   | [→](/backend/python/tooling/dependency-management/) |
| `package.json`      | `pyproject.toml`             | 高     | 项目配置   | [→](/backend/python/tooling/dependency-management/) |
| `package-lock.json` | `poetry.lock` / `uv.lock`    | 高     | 锁定文件   | [→](/backend/python/tooling/dependency-management/) |
| `node_modules/`     | `.venv/`                     | 中     | 依赖目录   | [→](/backend/python/tooling/dependency-management/) |
| ESLint              | Ruff                         | 高     | 代码检查   | [→](/backend/python/tooling/ruff)   |
| Prettier            | Ruff format                  | 高     | 代码格式化 | [→](/backend/python/tooling/ruff)   |
| `.eslintrc.js`      | `pyproject.toml [tool.ruff]` | 中     | 配置文件   | [→](/backend/python/tooling/ruff)   |
| TypeScript          | Type Hints + mypy            | 中     | 类型系统   | [→](/backend/python/tooling/typing) |
| `interface`         | `Protocol` / `TypedDict`     | 中     | 接口定义   | [→](/backend/python/tooling/typing) |

## 高级特性

| JS/TS 概念            | Python 对应      | 相似度 | 说明         | 详情                                    |
| --------------------- | ---------------- | ------ | ------------ | --------------------------------------- |
| HOC (高阶组件)        | 装饰器           | 中     | 概念类似     | [→](/backend/python/advanced/decorators)       |
| `Generator` / `yield` | `yield` 生成器   | 高     | 基本相同     | [→](/backend/python/advanced/generators)       |
| `Promise`             | `asyncio.Future` | 中     | 异步模型不同 | [→](/backend/python/advanced/async)            |
| `async/await`         | `async/await`    | 高     | 语法相似     | [→](/backend/python/advanced/async)            |
| `using` (TC39 提案)   | `with` 语句      | 高     | 上下文管理   | [→](/backend/python/advanced/context-managers) |

## 常用 API

| JS/TS 概念          | Python 对应                | 说明        |
| ------------------- | -------------------------- | ----------- |
| `console.log()`     | `print()`                  | 控制台输出  |
| `JSON.parse()`      | `json.loads()`             | JSON 解析   |
| `JSON.stringify()`  | `json.dumps()`             | JSON 序列化 |
| `fetch()` / `axios` | `requests` / `httpx`       | HTTP 请求   |
| `setTimeout()`      | `asyncio.sleep()`          | 延时 (异步) |
| `Array.map()`       | `map()` / 列表推导         | 映射        |
| `Array.filter()`    | `filter()` / 列表推导      | 过滤        |
| `Array.reduce()`    | `functools.reduce()`       | 归约        |
| `Array.find()`      | `next(x for x in ...)`     | 查找        |
| `Array.includes()`  | `in` 运算符                | 包含检查    |
| `Object.keys()`     | `dict.keys()`              | 获取键      |
| `Object.values()`   | `dict.values()`            | 获取值      |
| `Object.entries()`  | `dict.items()`             | 获取键值对  |
| `Array.forEach()`   | `for` 循环                 | 遍历        |
| `Array.sort()`      | `sorted()` / `list.sort()` | 排序        |
| `String.split()`    | `str.split()`              | 字符串分割  |
| `String.join()`     | `str.join()`               | 字符串连接  |
| `String.trim()`     | `str.strip()`              | 去除空白    |
| `String.includes()` | `in` 运算符                | 子串检查    |
| `Math.floor()`      | `math.floor()` / `//`      | 向下取整    |
| `Math.ceil()`       | `math.ceil()`              | 向上取整    |
| `Math.round()`      | `round()`                  | 四舍五入    |
| `Math.random()`     | `random.random()`          | 随机数      |

## 操作符

| JS/TS | Python          | 说明                           |
| ----- | --------------- | ------------------------------ |
| `===` | `==`            | Python 无严格相等，`==` 已足够 |
| `!==` | `!=`            | 不等于                         |
| `**`  | `**`            | 幂运算                         |
| `//`  | `//`            | 整数除法                       |
| `%`   | `%`             | 取模                           |
| `??`  | `or` (部分场景) | Python 无空值合并              |
| `?.`  | (无直接对应)    | 可用 `getattr()` 或 try/except |
| `...` | `*` / `**`      | 展开/解包                      |

## 快速对比示例

### 数组/列表操作

```javascript
// JavaScript
const arr = [1, 2, 3, 4, 5]
arr.push(6)
arr.map((x) => x * 2)
arr.filter((x) => x > 2)
arr.find((x) => x === 3)
arr.includes(3)
```

```python
# Python
arr = [1, 2, 3, 4, 5]
arr.append(6)
[x * 2 for x in arr]         # 列表推导
[x for x in arr if x > 2]    # 过滤
next(x for x in arr if x == 3)  # 查找
3 in arr                      # 包含检查
```

### 对象/字典操作

```javascript
// JavaScript
const obj = { name: 'Alice', age: 25 }
obj.city = 'Beijing'
Object.keys(obj)
Object.values(obj)
Object.entries(obj)
```

```python
# Python
obj = {"name": "Alice", "age": 25}
obj["city"] = "Beijing"
obj.keys()
obj.values()
obj.items()
```

### 异步操作

```javascript
// JavaScript
async function fetchData() {
  const response = await fetch(url)
  const data = await response.json()
  return data
}
```

```python
# Python
async def fetch_data():
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        data = response.json()
        return data
```

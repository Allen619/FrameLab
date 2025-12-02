---
title: 控制流
description: Python 控制流语句 if/for/while/match-case 与 JavaScript 对比
---

# 控制流

## 学习目标

本章节你将学习:

- 条件语句 (if/elif/else)
- 循环语句 (for/while)
- 模式匹配 (match-case，Python 3.10+)
- 异常处理 (try/except)

## 条件语句

### if/elif/else

```python
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "D"

print(f"Grade: {grade}")  # Grade: B
```

```javascript
// JavaScript 对比
const score = 85
let grade

if (score >= 90) {
  grade = 'A'
} else if (score >= 80) {
  grade = 'B'
} else if (score >= 70) {
  grade = 'C'
} else {
  grade = 'D'
}
```

> **关键差异**:
>
> - Python 用 `elif`，JavaScript 用 `else if`
> - Python 无括号 `()`，用 `:` 结尾
> - Python 用缩进代替 `{}`

### 三元表达式

```python
# Python 三元表达式
age = 20
status = "adult" if age >= 18 else "minor"
```

```javascript
// JavaScript 三元运算符
const age = 20
const status = age >= 18 ? 'adult' : 'minor'
```

### 逻辑运算符

```python
# Python 用英文单词
if x > 0 and y > 0:
    print("Both positive")

if x > 0 or y > 0:
    print("At least one positive")

if not is_admin:
    print("Not admin")
```

```javascript
// JavaScript 用符号
if (x > 0 && y > 0) {
  console.log('Both positive')
}

if (x > 0 || y > 0) {
  console.log('At least one positive')
}

if (!isAdmin) {
  console.log('Not admin')
}
```

| JavaScript | Python |
| ---------- | ------ |
| `&&`       | `and`  |
| `\|\|`     | `or`   |
| `!`        | `not`  |

### 布尔表达式规范 (PEP 8)

```python
# ✅ 推荐: 直接使用真值判断
if items:
    print("列表非空")

if not items:
    print("列表为空")

if name:
    print("名字非空")

if is_valid:
    print("有效")

# ❌ 不推荐: 与 True/False 比较
if items == True:      # 不好
    pass

if is_valid == True:   # 不好
    pass

if len(items) > 0:     # 不好，直接用 if items:
    pass

if len(items) == 0:    # 不好，直接用 if not items:
    pass

# ✅ 推荐: None 检查使用 is
if result is None:
    print("无结果")

if result is not None:
    print("有结果")

# ❌ 不推荐: 使用 == 检查 None
if result == None:     # 不好
    pass

# ✅ 推荐: 空容器检查
data = []
if not data:           # 推荐
    print("空列表")

# ❌ 不推荐
if data == []:         # 不好
    pass

if len(data) == 0:     # 不好
    pass
```

```javascript
// JavaScript 对比 - 也推荐类似风格
if (items.length) {
  console.log('数组非空')
}

if (!items.length) {
  console.log('数组为空')
}

// 但 JS 的 null/undefined 检查通常用 ===
if (result === null) {
  console.log('无结果')
}
```

**规范总结**：

| 场景 | ✅ 推荐 | ❌ 不推荐 |
|------|---------|-----------|
| 检查非空容器 | `if items:` | `if len(items) > 0:` |
| 检查空容器 | `if not items:` | `if len(items) == 0:` |
| 检查 None | `if x is None:` | `if x == None:` |
| 检查非 None | `if x is not None:` | `if x != None:` |
| 检查布尔值 | `if flag:` | `if flag == True:` |
| 检查假布尔值 | `if not flag:` | `if flag == False:` |

## for 循环

### 遍历序列

```python
# 遍历列表
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# 遍历字符串
for char in "hello":
    print(char)
```

```javascript
// JavaScript for...of 对比
const fruits = ['apple', 'banana', 'cherry']
for (const fruit of fruits) {
  console.log(fruit)
}
```

### range() 函数

```python
# range(stop) - 从 0 到 stop-1
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# range(start, stop)
for i in range(2, 5):
    print(i)  # 2, 3, 4

# range(start, stop, step)
for i in range(0, 10, 2):
    print(i)  # 0, 2, 4, 6, 8

# 倒序
for i in range(5, 0, -1):
    print(i)  # 5, 4, 3, 2, 1
```

```javascript
// JavaScript 对比
for (let i = 0; i < 5; i++) {
  console.log(i)
}
```

### 带索引遍历

```python
# 使用 enumerate() 获取索引
fruits = ["apple", "banana", "cherry"]
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")
# 0: apple
# 1: banana
# 2: cherry

# 指定起始索引
for index, fruit in enumerate(fruits, start=1):
    print(f"{index}: {fruit}")
# 1: apple
# 2: banana
# 3: cherry
```

```javascript
// JavaScript 对比
const fruits = ['apple', 'banana', 'cherry']
fruits.forEach((fruit, index) => {
  console.log(`${index}: ${fruit}`)
})
```

### 遍历字典

```python
user = {"name": "Alice", "age": 25, "city": "Beijing"}

# 遍历键
for key in user:
    print(key)

# 遍历键值对
for key, value in user.items():
    print(f"{key}: {value}")

# 遍历值
for value in user.values():
    print(value)
```

```javascript
// JavaScript 对比
const user = { name: 'Alice', age: 25, city: 'Beijing' }

for (const key in user) {
  console.log(`${key}: ${user[key]}`)
}

// 或使用 Object.entries()
for (const [key, value] of Object.entries(user)) {
  console.log(`${key}: ${value}`)
}
```

## while 循环

```python
# 基本 while 循环
count = 0
while count < 5:
    print(count)
    count += 1

# while-else (Python 特有)
count = 0
while count < 5:
    print(count)
    count += 1
else:
    print("Loop completed normally")
```

> **Python 特色**: while 和 for 循环都可以有 else 子句，当循环正常结束（非 break）时执行。

## break 和 continue

```python
# break - 跳出循环
for i in range(10):
    if i == 5:
        break
    print(i)  # 0, 1, 2, 3, 4

# continue - 跳过本次迭代
for i in range(5):
    if i == 2:
        continue
    print(i)  # 0, 1, 3, 4

# for-else 与 break
for i in range(5):
    if i == 10:  # 永远不会触发
        break
else:
    print("Loop completed without break")  # 会执行
```

## match-case (Python 3.10+)

Python 3.10 引入了结构化模式匹配，类似 JavaScript 的 switch-case，但功能更强大。

### 基本用法

```python
def http_status(status):
    match status:
        case 200:
            return "OK"
        case 404:
            return "Not Found"
        case 500:
            return "Server Error"
        case _:  # 默认情况，相当于 default
            return "Unknown"

print(http_status(200))  # OK
print(http_status(999))  # Unknown
```

```javascript
// JavaScript switch 对比
function httpStatus(status) {
  switch (status) {
    case 200:
      return 'OK'
    case 404:
      return 'Not Found'
    case 500:
      return 'Server Error'
    default:
      return 'Unknown'
  }
}
```

### 模式匹配进阶

```python
# 匹配多个值
match status:
    case 200 | 201 | 204:  # 或运算
        return "Success"
    case 400 | 401 | 403 | 404:
        return "Client Error"
    case _:
        return "Unknown"

# 解构匹配
point = (3, 4)
match point:
    case (0, 0):
        print("Origin")
    case (x, 0):
        print(f"On x-axis at {x}")
    case (0, y):
        print(f"On y-axis at {y}")
    case (x, y):
        print(f"Point at ({x}, {y})")

# 带守卫条件
match point:
    case (x, y) if x == y:
        print("On diagonal")
    case (x, y):
        print(f"Point at ({x}, {y})")
```

## 异常处理

### try/except

```python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero!")
except Exception as e:
    print(f"Error: {e}")
else:
    print(f"Result: {result}")  # 无异常时执行
finally:
    print("Cleanup")  # 总是执行
```

```javascript
// JavaScript 对比
try {
  const result = 10 / 0
} catch (e) {
  console.log(`Error: ${e}`)
} finally {
  console.log('Cleanup')
}
```

> **关键差异**:
>
> - Python 用 `except`，JavaScript 用 `catch`
> - Python 可以捕获特定类型的异常
> - Python 有 `else` 子句（无异常时执行）

### 常见异常类型

```python
# ValueError - 值错误
int("hello")

# TypeError - 类型错误
"hello" + 42

# KeyError - 键不存在
d = {}
d["missing"]

# IndexError - 索引越界
lst = [1, 2, 3]
lst[10]

# FileNotFoundError - 文件不存在
open("nonexistent.txt")
```

### 抛出异常

```python
def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

try:
    divide(10, 0)
except ValueError as e:
    print(e)  # Cannot divide by zero
```

```javascript
// JavaScript 对比
function divide(a, b) {
  if (b === 0) {
    throw new Error('Cannot divide by zero')
  }
  return a / b
}
```

## 对前端开发者

### 常见误区

```python
# 1. 没有 switch-case（Python 3.10 之前）
# 使用 if-elif-else 或字典映射代替

# 字典映射模式
def get_status_text(status):
    return {
        200: "OK",
        404: "Not Found",
        500: "Server Error"
    }.get(status, "Unknown")

# 2. 循环中修改列表要小心
# 错误做法
numbers = [1, 2, 3, 4, 5]
for n in numbers:
    if n % 2 == 0:
        numbers.remove(n)  # 危险! 可能跳过元素

# 正确做法 - 创建新列表
numbers = [n for n in numbers if n % 2 != 0]
```

## 小结

| 概念       | JavaScript    | Python               |
| ---------- | ------------- | -------------------- |
| 条件关键字 | `else if`     | `elif`               |
| 逻辑与     | `&&`          | `and`                |
| 逻辑或     | `\|\|`        | `or`                 |
| 逻辑非     | `!`           | `not`                |
| 遍历       | `for...of`    | `for...in`           |
| 带索引遍历 | `forEach`     | `enumerate()`        |
| switch     | `switch/case` | `match/case` (3.10+) |
| 异常捕获   | `catch`       | `except`             |
| 抛出异常   | `throw`       | `raise`              |

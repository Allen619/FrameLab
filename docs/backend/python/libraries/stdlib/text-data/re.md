---
title: re - 正则表达式
description: Python re 模块详解，与 JavaScript RegExp 对比
---

# re 正则表达式

## 学习目标

- 掌握 Python 正则表达式的基本语法
- 理解 match、search、findall 等函数的区别
- 学会使用分组、替换和分割
- 与 JavaScript RegExp 对比

## 概述

| Python re | JavaScript | 说明 |
|-----------|-----------|------|
| `re.search(pattern, string)` | `string.match(pattern)` | 搜索匹配 |
| `re.match(pattern, string)` | `pattern.test(string)` | 从头匹配 |
| `re.findall(pattern, string)` | `string.match(pattern)` (g flag) | 查找所有 |
| `re.sub(pattern, repl, string)` | `string.replace(pattern, repl)` | 替换 |
| `re.split(pattern, string)` | `string.split(pattern)` | 分割 |

## 基础用法

### 编译正则表达式

```python
import re

# 方式1: 直接使用（适合一次性使用）
result = re.search(r'\d+', 'abc123def')

# 方式2: 编译后使用（适合重复使用，性能更好）
pattern = re.compile(r'\d+')
result = pattern.search('abc123def')

# 使用原始字符串 r'' 避免转义问题
pattern = r'\d+'   # 推荐
pattern = '\\d+'   # 等效但不推荐
```

```javascript
// JavaScript 对比
const result = 'abc123def'.match(/\d+/)

// 或者
const pattern = /\d+/
const result = 'abc123def'.match(pattern)
```

> **关键差异**: Python 正则表达式是字符串，需要用 `r''` 避免转义；JavaScript 使用 `/pattern/` 字面量语法。

### search vs match

```python
import re

text = "Hello 123 World"

# search: 在任意位置搜索
result = re.search(r'\d+', text)
print(result.group())  # '123'

# match: 只从字符串开头匹配
result = re.match(r'\d+', text)
print(result)  # None（开头不是数字）

result = re.match(r'Hello', text)
print(result.group())  # 'Hello'

# fullmatch: 整个字符串必须完全匹配
result = re.fullmatch(r'\d+', '123')
print(result.group())  # '123'

result = re.fullmatch(r'\d+', '123abc')
print(result)  # None
```

```javascript
// JavaScript 对比
const text = 'Hello 123 World'

// 等同于 search
const searchResult = text.match(/\d+/)
console.log(searchResult[0]) // '123'

// 等同于 match（从开头）
const matchResult = text.match(/^Hello/)
console.log(matchResult[0]) // 'Hello'

// 等同于 fullmatch
const fullResult = /^\d+$/.test('123')
console.log(fullResult) // true
```

### 查找所有匹配

```python
import re

text = "a1b22c333d4444"

# findall: 返回所有匹配的字符串列表
numbers = re.findall(r'\d+', text)
print(numbers)  # ['1', '22', '333', '4444']

# finditer: 返回迭代器，包含更多信息
for match in re.finditer(r'\d+', text):
    print(f"找到 '{match.group()}' 在位置 {match.start()}-{match.end()}")
# 找到 '1' 在位置 1-2
# 找到 '22' 在位置 3-5
# 找到 '333' 在位置 6-9
# 找到 '4444' 在位置 10-14
```

```javascript
// JavaScript 对比
const text = 'a1b22c333d4444'

// 使用 g 标志查找所有
const numbers = text.match(/\d+/g)
console.log(numbers) // ['1', '22', '333', '4444']

// 使用 matchAll 获取更多信息
for (const match of text.matchAll(/\d+/g)) {
  console.log(`找到 '${match[0]}' 在位置 ${match.index}`)
}
```

## 替换操作

### 基础替换

```python
import re

text = "Hello World World"

# 替换所有匹配
result = re.sub(r'World', 'Python', text)
print(result)  # 'Hello Python Python'

# 限制替换次数
result = re.sub(r'World', 'Python', text, count=1)
print(result)  # 'Hello Python World'

# 忽略大小写
result = re.sub(r'world', 'Python', text, flags=re.IGNORECASE)
print(result)  # 'Hello Python Python'
```

```javascript
// JavaScript 对比
const text = 'Hello World World'

// 替换第一个
let result = text.replace(/World/, 'Python')
console.log(result) // 'Hello Python World'

// 替换所有（g 标志）
result = text.replace(/World/g, 'Python')
console.log(result) // 'Hello Python Python'

// 忽略大小写（i 标志）
result = text.replace(/world/gi, 'Python')
```

### 使用函数替换

```python
import re

text = "prices: $10, $25, $100"

# 使用函数处理每个匹配
def double_price(match):
    price = int(match.group(1))
    return f"${price * 2}"

result = re.sub(r'\$(\d+)', double_price, text)
print(result)  # 'prices: $20, $50, $200'

# 使用 lambda
result = re.sub(r'\$(\d+)', lambda m: f"${int(m.group(1)) * 2}", text)
```

```javascript
// JavaScript 对比
const text = 'prices: $10, $25, $100'

const result = text.replace(/\$(\d+)/g, (match, price) => {
  return `$${parseInt(price) * 2}`
})
console.log(result) // 'prices: $20, $50, $200'
```

### 反向引用

```python
import re

# \1, \2 引用分组
text = "hello hello world world"
result = re.sub(r'(\w+) \1', r'\1', text)
print(result)  # 'hello world'

# 命名分组引用
text = "2024-01-15"
result = re.sub(r'(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})',
                r'\g<month>/\g<day>/\g<year>', text)
print(result)  # '01/15/2024'
```

## 分组

### 基础分组

```python
import re

text = "John Smith, john@example.com"

# 使用括号分组
pattern = r'(\w+) (\w+), (\w+@\w+\.\w+)'
match = re.search(pattern, text)

if match:
    print(match.group())   # 整个匹配: 'John Smith, john@example.com'
    print(match.group(0))  # 同上
    print(match.group(1))  # 第一组: 'John'
    print(match.group(2))  # 第二组: 'Smith'
    print(match.group(3))  # 第三组: 'john@example.com'
    print(match.groups())  # 所有组: ('John', 'Smith', 'john@example.com')
```

```javascript
// JavaScript 对比
const text = 'John Smith, john@example.com'
const pattern = /(\w+) (\w+), (\w+@\w+\.\w+)/
const match = text.match(pattern)

console.log(match[0]) // 整个匹配
console.log(match[1]) // 第一组
console.log(match[2]) // 第二组
console.log(match[3]) // 第三组
```

### 命名分组

```python
import re

text = "2024-01-15"

# 使用 (?P<name>...) 命名分组
pattern = r'(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})'
match = re.search(pattern, text)

if match:
    print(match.group('year'))   # '2024'
    print(match.group('month'))  # '01'
    print(match.group('day'))    # '15'
    print(match.groupdict())     # {'year': '2024', 'month': '01', 'day': '15'}
```

```javascript
// JavaScript 对比（ES2018+）
const text = '2024-01-15'
const pattern = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/
const match = text.match(pattern)

console.log(match.groups.year) // '2024'
console.log(match.groups.month) // '01'
console.log(match.groups.day) // '15'
```

### 非捕获分组

```python
import re

text = "hello world"

# 普通分组会捕获
pattern = r'(hello) (world)'
match = re.search(pattern, text)
print(match.groups())  # ('hello', 'world')

# 非捕获分组 (?:...)
pattern = r'(?:hello) (world)'
match = re.search(pattern, text)
print(match.groups())  # ('world',) - hello 没有被捕获
```

### findall 与分组

```python
import re

text = "John:25, Jane:30, Bob:22"

# 无分组: 返回整个匹配
pattern = r'\w+:\d+'
print(re.findall(pattern, text))  # ['John:25', 'Jane:30', 'Bob:22']

# 单个分组: 只返回分组内容
pattern = r'(\w+):\d+'
print(re.findall(pattern, text))  # ['John', 'Jane', 'Bob']

# 多个分组: 返回元组列表
pattern = r'(\w+):(\d+)'
print(re.findall(pattern, text))  # [('John', '25'), ('Jane', '30'), ('Bob', '22')]
```

## 分割字符串

```python
import re

text = "apple, banana;  cherry\torange"

# 按多种分隔符分割
parts = re.split(r'[,;\s]+', text)
print(parts)  # ['apple', 'banana', 'cherry', 'orange']

# 保留分隔符（使用分组）
parts = re.split(r'([,;])', "a,b;c")
print(parts)  # ['a', ',', 'b', ';', 'c']

# 限制分割次数
parts = re.split(r'[,;\s]+', text, maxsplit=2)
print(parts)  # ['apple', 'banana', 'cherry\torange']
```

```javascript
// JavaScript 对比
const text = 'apple, banana;  cherry\torange'

// JavaScript split 也支持正则
const parts = text.split(/[,;\s]+/)
console.log(parts) // ['apple', 'banana', 'cherry', 'orange']
```

## 修饰符（Flags）

```python
import re

text = "Hello\nWorld"

# re.IGNORECASE (re.I): 忽略大小写
re.findall(r'hello', text, re.IGNORECASE)  # ['Hello']

# re.MULTILINE (re.M): 多行模式，^ $ 匹配每行
re.findall(r'^.+', text, re.MULTILINE)  # ['Hello', 'World']

# re.DOTALL (re.S): 点号匹配换行符
re.findall(r'.+', text)              # ['Hello', 'World']
re.findall(r'.+', text, re.DOTALL)   # ['Hello\nWorld']

# re.VERBOSE (re.X): 允许添加注释和空白
pattern = re.compile(r'''
    \d{4}    # 年
    -        # 分隔符
    \d{2}    # 月
    -        # 分隔符
    \d{2}    # 日
''', re.VERBOSE)

# 组合多个标志
re.findall(r'hello', text, re.IGNORECASE | re.MULTILINE)

# 在模式中指定标志
pattern = r'(?i)hello'  # 等同于 re.IGNORECASE
pattern = r'(?im)hello' # 等同于 re.IGNORECASE | re.MULTILINE
```

```javascript
// JavaScript 对比
const text = 'Hello\nWorld'

// 使用标志
text.match(/hello/i) // 忽略大小写
text.match(/^.+/gm) // 多行模式
text.match(/.+/gs) // dotall 模式

// 组合标志
text.match(/hello/gim)
```

## 常用正则表达式模式

```python
import re

# 邮箱
email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

# URL
url_pattern = r'https?://[^\s<>"{}|\\^`\[\]]+'

# 手机号（中国）
phone_pattern = r'^1[3-9]\d{9}$'

# IP 地址
ip_pattern = r'^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$'

# 中文字符
chinese_pattern = r'[\u4e00-\u9fa5]+'

# HTML 标签
html_tag_pattern = r'<[^>]+>'

# 验证函数
def is_valid_email(email):
    return re.match(email_pattern, email) is not None

def is_valid_phone(phone):
    return re.match(phone_pattern, phone) is not None

# 使用
print(is_valid_email('user@example.com'))  # True
print(is_valid_phone('13800138000'))       # True
```

## 实用示例

### 提取网页数据

```python
import re

html = '''
<div class="product">
    <h2>iPhone 15</h2>
    <span class="price">$999</span>
</div>
<div class="product">
    <h2>MacBook Pro</h2>
    <span class="price">$1999</span>
</div>
'''

# 提取产品信息
products = re.findall(
    r'<h2>([^<]+)</h2>\s*<span class="price">\$(\d+)</span>',
    html
)
for name, price in products:
    print(f"{name}: ${price}")
# iPhone 15: $999
# MacBook Pro: $1999
```

### 日志解析

```python
import re
from datetime import datetime

log_line = '2024-01-15 10:30:45 ERROR [main] Connection failed: timeout'

pattern = r'''
    (?P<date>\d{4}-\d{2}-\d{2})     # 日期
    \s+
    (?P<time>\d{2}:\d{2}:\d{2})     # 时间
    \s+
    (?P<level>\w+)                   # 日志级别
    \s+
    \[(?P<module>\w+)\]             # 模块名
    \s+
    (?P<message>.+)                  # 消息
'''

match = re.search(pattern, log_line, re.VERBOSE)
if match:
    data = match.groupdict()
    print(f"时间: {data['date']} {data['time']}")
    print(f"级别: {data['level']}")
    print(f"模块: {data['module']}")
    print(f"消息: {data['message']}")
```

### 密码验证

```python
import re

def validate_password(password):
    """
    验证密码强度:
    - 至少 8 个字符
    - 包含大写字母
    - 包含小写字母
    - 包含数字
    - 包含特殊字符
    """
    if len(password) < 8:
        return False, "密码至少 8 个字符"

    checks = [
        (r'[A-Z]', "需要包含大写字母"),
        (r'[a-z]', "需要包含小写字母"),
        (r'\d', "需要包含数字"),
        (r'[!@#$%^&*(),.?":{}|<>]', "需要包含特殊字符"),
    ]

    for pattern, message in checks:
        if not re.search(pattern, password):
            return False, message

    return True, "密码强度符合要求"

# 测试
print(validate_password("abc"))           # (False, '密码至少 8 个字符')
print(validate_password("abcdefgh"))      # (False, '需要包含大写字母')
print(validate_password("Abcdefgh1!"))    # (True, '密码强度符合要求')
```

### 文本清洗

```python
import re

def clean_text(text):
    """清洗文本数据"""
    # 移除 HTML 标签
    text = re.sub(r'<[^>]+>', '', text)

    # 移除多余空白
    text = re.sub(r'\s+', ' ', text)

    # 移除特殊字符（保留中文、字母、数字）
    text = re.sub(r'[^\w\s\u4e00-\u9fa5]', '', text)

    return text.strip()

html_text = '<p>Hello,  World!</p>  <br/>  欢迎使用 Python!'
print(clean_text(html_text))  # 'Hello World 欢迎使用 Python'
```

## 与 JS 的关键差异

| 特性 | Python re | JavaScript RegExp |
|-----|----------|------------------|
| 语法 | 字符串 `r'\d+'` | 字面量 `/\d+/` |
| 全局匹配 | `findall()` | `/pattern/g` |
| 命名分组 | `(?P<name>...)` | `(?<name>...)` |
| 反向引用 | `\1` 或 `\g<name>` | `$1` 或 `$<name>` |
| match 行为 | 从开头匹配 | 任意位置匹配 |
| 编译 | `re.compile()` | 自动优化 |

## 常见陷阱

```python
import re

# 1. 忘记使用原始字符串
pattern = '\d+'      # 可能有问题
pattern = r'\d+'     # 正确

# 2. match 只匹配开头
text = "hello 123"
re.match(r'\d+', text)   # None!
re.search(r'\d+', text)  # 找到 '123'

# 3. findall 与分组的行为
text = "a1b2c3"
re.findall(r'\w\d', text)      # ['a1', 'b2', 'c3']
re.findall(r'(\w)\d', text)    # ['a', 'b', 'c'] - 只返回分组

# 4. 贪婪 vs 非贪婪
text = "<div>content</div>"
re.findall(r'<.*>', text)      # ['<div>content</div>'] 贪婪
re.findall(r'<.*?>', text)     # ['<div>', '</div>'] 非贪婪

# 5. 特殊字符需要转义
re.search(r'.', 'hello')       # 匹配任意字符
re.search(r'\.', 'hello.txt')  # 匹配点号

# 6. 多行字符串
text = "line1\nline2"
re.findall(r'^line', text)              # ['line'] 只匹配开头
re.findall(r'^line', text, re.MULTILINE) # ['line', 'line']
```

## 小结

- 使用 `r''` 原始字符串定义正则表达式
- `search()` 搜索任意位置，`match()` 从开头匹配
- `findall()` 返回所有匹配，`finditer()` 返回迭代器
- `sub()` 替换匹配内容，支持函数替换
- 使用 `(?P<name>...)` 定义命名分组
- 常用修饰符：`re.IGNORECASE`、`re.MULTILINE`、`re.DOTALL`
- 注意贪婪和非贪婪匹配的区别（`*` vs `*?`）

::: info 相关内容
- [string 字符串工具](./string.md) - 字符串常量和模板
- [json 数据格式](./json.md) - JSON 数据处理
:::

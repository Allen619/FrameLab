---
title: string - 字符串工具
description: Python string 模块详解，字符串常量和模板
---

# string 字符串工具

## 学习目标

- 了解 string 模块提供的字符串常量
- 掌握 Template 字符串模板的使用
- 理解 Formatter 自定义格式化
- 与 JavaScript 模板字符串对比

## 概述

`string` 模块提供了字符串相关的常量和工具类。

| Python string | JavaScript | 说明 |
|--------------|-----------|------|
| `string.ascii_letters` | - | 所有 ASCII 字母 |
| `string.digits` | - | 数字字符 |
| `Template` | 模板字面量 \`\` | 字符串模板 |
| `Formatter` | - | 自定义格式化 |

## 字符串常量

```python
import string

# ASCII 字母
print(string.ascii_lowercase)  # 'abcdefghijklmnopqrstuvwxyz'
print(string.ascii_uppercase)  # 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
print(string.ascii_letters)    # 小写 + 大写

# 数字
print(string.digits)           # '0123456789'
print(string.hexdigits)        # '0123456789abcdefABCDEF'
print(string.octdigits)        # '01234567'

# 标点符号
print(string.punctuation)      # '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'

# 空白字符
print(string.whitespace)       # ' \t\n\r\x0b\x0c'

# 可打印字符
print(string.printable)        # digits + letters + punctuation + whitespace
```

### 常量的实际用途

```python
import string
import random

# 生成随机密码
def generate_password(length=12):
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choice(characters) for _ in range(length))

print(generate_password())  # 如: 'aB3$kL9!mN2@'

# 验证字符串只包含字母和数字
def is_alphanumeric(s):
    valid_chars = string.ascii_letters + string.digits
    return all(c in valid_chars for c in s)

print(is_alphanumeric('Hello123'))  # True
print(is_alphanumeric('Hello 123')) # False

# 移除标点符号
def remove_punctuation(text):
    return text.translate(str.maketrans('', '', string.punctuation))

print(remove_punctuation('Hello, World!'))  # 'Hello World'

# 生成随机字符串 ID
def random_id(length=8):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

print(random_id())  # 如: 'A3B5C7D9'
```

```javascript
// JavaScript 没有内置字符串常量，需要自己定义
const ASCII_LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const ASCII_UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const DIGITS = '0123456789'

// 生成随机密码
function generatePassword(length = 12) {
  const chars = ASCII_LOWERCASE + ASCII_UPPERCASE + DIGITS + '!@#$%^&*()'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}
```

## Template 字符串模板

### 基础用法

```python
from string import Template

# 创建模板（使用 $ 作为占位符）
template = Template('Hello, $name! You are $age years old.')

# 替换变量
result = template.substitute(name='Alice', age=25)
print(result)  # 'Hello, Alice! You are 25 years old.'

# 使用字典
data = {'name': 'Bob', 'age': 30}
result = template.substitute(data)
print(result)  # 'Hello, Bob! You are 30 years old.'

# 混合使用
result = template.substitute(data, name='Charlie')  # 关键字参数覆盖字典
print(result)  # 'Hello, Charlie! You are 30 years old.'
```

```javascript
// JavaScript 模板字面量对比
const name = 'Alice'
const age = 25
const result = `Hello, ${name}! You are ${age} years old.`

// 使用函数包装
const template = (name, age) => `Hello, ${name}! You are ${age} years old.`
console.log(template('Bob', 30))
```

### safe_substitute - 安全替换

```python
from string import Template

template = Template('Hello, $name! Your score is $score.')

# substitute: 缺少变量会报错
try:
    result = template.substitute(name='Alice')
except KeyError as e:
    print(f"缺少变量: {e}")

# safe_substitute: 缺少变量保持原样
result = template.safe_substitute(name='Alice')
print(result)  # 'Hello, Alice! Your score is $score.'
```

### 特殊语法

```python
from string import Template

# $$ 转义为单个 $
template = Template('Price: $$${price}')
print(template.substitute(price=99))  # 'Price: $99'

# ${name} 用于紧邻其他字符
template = Template('${item}s cost $$${price} each')
print(template.substitute(item='apple', price=2))  # 'apples cost $2 each'

# 标识符可以包含字母、数字、下划线
template = Template('$user_name at $email_123')
print(template.substitute(user_name='alice', email_123='a@b.com'))
```

### 自定义模板分隔符

```python
from string import Template

# 自定义使用 % 作为分隔符
class PercentTemplate(Template):
    delimiter = '%'

template = PercentTemplate('Hello, %name!')
print(template.substitute(name='Alice'))  # 'Hello, Alice!'

# 自定义使用 {{ }} 风格
class BraceTemplate(Template):
    delimiter = '{{'
    pattern = r'''
    \{\{(?:
        (?P<escaped>\{\{) |
        (?P<named>[a-zA-Z_][a-zA-Z0-9_]*)\}\} |
        (?P<braced>[a-zA-Z_][a-zA-Z0-9_]*)\}\} |
        (?P<invalid>)
    )
    '''

# 通常使用默认的 $ 语法即可
```

## Formatter 格式化

### 基础 format 方法

```python
# 内置 str.format() 方法
text = "Hello, {}!".format("World")
text = "Hello, {name}!".format(name="Alice")
text = "Value: {0:.2f}".format(3.14159)  # 'Value: 3.14'

# f-string (Python 3.6+, 推荐)
name = "Alice"
age = 25
text = f"Hello, {name}! Age: {age}"
```

### Formatter 类

```python
from string import Formatter

# 基础使用
formatter = Formatter()
result = formatter.format("Hello, {name}!", name="Alice")
print(result)  # 'Hello, Alice!'

# 自定义 Formatter
class UpperFormatter(Formatter):
    """将所有值转为大写"""
    def format_field(self, value, format_spec):
        if isinstance(value, str):
            value = value.upper()
        return super().format_field(value, format_spec)

formatter = UpperFormatter()
result = formatter.format("Hello, {name}!", name="Alice")
print(result)  # 'Hello, ALICE!'

# 带默认值的 Formatter
class DefaultFormatter(Formatter):
    def __init__(self, defaults=None):
        self.defaults = defaults or {}

    def get_value(self, key, args, kwargs):
        if isinstance(key, str):
            return kwargs.get(key, self.defaults.get(key, f'<{key}>'))
        return super().get_value(key, args, kwargs)

formatter = DefaultFormatter({'name': 'Guest', 'age': 0})
print(formatter.format("Hello, {name}!", name="Alice"))  # 'Hello, Alice!'
print(formatter.format("Hello, {name}!"))  # 'Hello, Guest!'
print(formatter.format("Score: {score}"))  # 'Score: <score>'
```

## 实用示例

### 密码生成器

```python
import string
import secrets  # 比 random 更安全

def generate_secure_password(
    length: int = 16,
    include_special: bool = True,
    exclude_similar: bool = True
):
    """生成安全密码"""
    chars = string.ascii_letters + string.digits

    if include_special:
        chars += '!@#$%^&*'

    if exclude_similar:
        # 排除容易混淆的字符
        chars = chars.translate(str.maketrans('', '', 'Il1O0'))

    # 确保包含各类字符
    password = [
        secrets.choice(string.ascii_lowercase),
        secrets.choice(string.ascii_uppercase),
        secrets.choice(string.digits),
    ]

    if include_special:
        password.append(secrets.choice('!@#$%^&*'))

    # 填充剩余长度
    password.extend(secrets.choice(chars) for _ in range(length - len(password)))

    # 打乱顺序
    secrets.SystemRandom().shuffle(password)

    return ''.join(password)

print(generate_secure_password())  # 如: 'aB3$kL9mN2xY'
```

### 配置文件模板

```python
from string import Template
from pathlib import Path

# 配置模板
CONFIG_TEMPLATE = Template('''
# Application Configuration
APP_NAME=$app_name
APP_VERSION=$version
DEBUG=$debug

# Database
DATABASE_URL=$db_url
DATABASE_POOL_SIZE=$pool_size

# Server
HOST=$host
PORT=$port
''')

def generate_config(output_path: str, **settings):
    """生成配置文件"""
    defaults = {
        'app_name': 'MyApp',
        'version': '1.0.0',
        'debug': 'false',
        'db_url': 'sqlite:///app.db',
        'pool_size': '5',
        'host': '0.0.0.0',
        'port': '8000'
    }

    # 合并默认值和传入的设置
    config = {**defaults, **settings}
    content = CONFIG_TEMPLATE.substitute(config)

    Path(output_path).write_text(content)
    print(f"配置文件已生成: {output_path}")

# 使用
generate_config('config.env', app_name='ProductionApp', debug='false', port='80')
```

### 邮件模板

```python
from string import Template

class EmailTemplate:
    """邮件模板管理"""

    templates = {
        'welcome': Template('''
Dear $name,

Welcome to $company! We're excited to have you.

Your account details:
- Username: $username
- Email: $email

Best regards,
$company Team
        '''),

        'password_reset': Template('''
Hi $name,

You requested a password reset. Click the link below:
$reset_link

This link expires in $expire_hours hours.

If you didn't request this, please ignore this email.
        '''),

        'order_confirmation': Template('''
Order Confirmation #$order_id

Hi $name,

Your order has been confirmed!

Items: $items
Total: $$$total

Shipping to: $address

Thank you for shopping with us!
        ''')
    }

    @classmethod
    def render(cls, template_name: str, **kwargs) -> str:
        template = cls.templates.get(template_name)
        if not template:
            raise ValueError(f"Unknown template: {template_name}")
        return template.safe_substitute(**kwargs)

# 使用
email = EmailTemplate.render(
    'welcome',
    name='Alice',
    company='TechCorp',
    username='alice123',
    email='alice@example.com'
)
print(email)
```

### 文本验证工具

```python
import string

class TextValidator:
    """文本验证工具"""

    @staticmethod
    def is_valid_username(username: str) -> tuple[bool, str]:
        """验证用户名"""
        if len(username) < 3:
            return False, "用户名至少 3 个字符"
        if len(username) > 20:
            return False, "用户名最多 20 个字符"

        valid_chars = string.ascii_letters + string.digits + '_'
        if not all(c in valid_chars for c in username):
            return False, "用户名只能包含字母、数字和下划线"

        if username[0] in string.digits:
            return False, "用户名不能以数字开头"

        return True, "有效"

    @staticmethod
    def sanitize_filename(filename: str) -> str:
        """清理文件名"""
        # 移除或替换不安全的字符
        valid_chars = string.ascii_letters + string.digits + '._-'
        return ''.join(c if c in valid_chars else '_' for c in filename)

    @staticmethod
    def mask_sensitive(text: str, visible: int = 4) -> str:
        """遮蔽敏感信息"""
        if len(text) <= visible:
            return '*' * len(text)
        return text[:visible] + '*' * (len(text) - visible)

# 使用
validator = TextValidator()

print(validator.is_valid_username('alice_123'))  # (True, '有效')
print(validator.is_valid_username('123abc'))     # (False, '用户名不能以数字开头')

print(validator.sanitize_filename('my file (1).txt'))  # 'my_file__1_.txt'
print(validator.mask_sensitive('1234567890'))  # '1234******'
```

## 与 JS 的关键差异

| 特性 | Python string | JavaScript |
|-----|--------------|-----------|
| 字符串常量 | 内置 `string.ascii_*` 等 | 需要自定义 |
| 模板语法 | `$name` 或 `${name}` | `${expression}` |
| 模板安全替换 | `safe_substitute()` | 无（需要自己处理） |
| 自定义格式化 | Formatter 类 | 无内置支持 |
| 推荐方式 | f-string | 模板字面量 |

## 常见陷阱

```python
from string import Template

# 1. substitute 缺少变量会报错
template = Template('Hello, $name!')
# template.substitute()  # KeyError: 'name'
template.safe_substitute()  # 'Hello, $name!' (安全)

# 2. $ 需要转义
template = Template('Price: $price')  # 这里 $price 是变量
template = Template('Price: $$100')   # 这里 $$ 转义为 $

# 3. 变量名后面紧跟字符
template = Template('$names')  # 变量名是 names
template = Template('${name}s')  # 变量名是 name，后面跟 s

# 4. 字符串常量是不可变的
# string.ascii_lowercase += 'äöü'  # 不能修改

# 5. 大小写敏感
import string
'A' in string.ascii_lowercase  # False
'A' in string.ascii_uppercase  # True
'A' in string.ascii_letters    # True
```

## 小结

- `string` 模块提供字符串常量：`ascii_letters`、`digits`、`punctuation` 等
- `Template` 类使用 `$name` 语法进行字符串替换
- `safe_substitute()` 在变量缺失时不会报错
- `Formatter` 类允许自定义格式化行为
- **推荐使用 f-string**，更简洁、更强大
- Template 适合用户可编辑的模板场景

::: info 相关内容
- [re 正则表达式](./re.md) - 更强大的文本处理
- [json 数据格式](./json.md) - 结构化数据处理
:::

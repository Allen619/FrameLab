---
title: decimal - 精确小数
description: Python decimal 模块详解，高精度十进制运算
---

# decimal 精确小数

## 学习目标

- 理解精确小数的必要性
- 掌握 Decimal 类型的运算
- 学会数值精度控制
- 对比 JavaScript 数字精度问题

## 概览

| Python decimal | JavaScript | 说明 |
|---------------|------------|------|
| `Decimal` | `BigInt` / 第三方库 | 精确数值 |
| `getcontext()` | 无 | 获取全局上下文 |
| `localcontext()` | 无 | 局部上下文 |
| `quantize()` | `toFixed()` | 四舍五入 |

::: warning 浮点数精度问题
```python
# Python 和 JavaScript 都有此问题
print(0.1 + 0.2)  # 0.30000000000000004
```
:::

## 基础用法

### 创建 Decimal

```python
from decimal import Decimal

# 从字符串创建 (推荐)
d1 = Decimal('0.1')
d2 = Decimal('0.2')
print(d1 + d2)  # 0.3 (精确!)

# 从整数创建
d3 = Decimal(42)
print(d3)  # 42

# 从浮点数创建 (不推荐，会保留浮点误差)
d4 = Decimal(0.1)
print(d4)  # 0.1000000000000000055511151231...

# 从元组创建 (符号, 数字元组, 指数)
d5 = Decimal((0, (1, 2, 3), -2))  # +1.23
print(d5)  # 1.23
```

```javascript
// JavaScript 对比 - 使用第三方库如 decimal.js
import Decimal from 'decimal.js'

const d1 = new Decimal('0.1')
const d2 = new Decimal('0.2')
console.log(d1.plus(d2).toString())  // '0.3'
```

### 基本运算

```python
from decimal import Decimal

a = Decimal('10.5')
b = Decimal('3')

# 四则运算
print(a + b)   # 13.5
print(a - b)   # 7.5
print(a * b)   # 31.5
print(a / b)   # 3.5

# 整除和取余
print(a // b)  # 3
print(a % b)   # 1.5

# 幂运算
print(a ** 2)  # 110.25

# 绝对值和取负
print(abs(Decimal('-5.5')))  # 5.5
print(-a)  # -10.5
```

### 比较运算

```python
from decimal import Decimal

a = Decimal('1.0')
b = Decimal('1.00')
c = Decimal('2.0')

# 数值比较 (忽略尾部零)
print(a == b)  # True
print(a < c)   # True

# 比较是否完全相同 (包括精度)
print(a.compare_total(b))  # -1 (a 在 b 前面)
```

## 精度控制

### 全局上下文

```python
from decimal import Decimal, getcontext

# 获取全局上下文
ctx = getcontext()
print(ctx.prec)  # 28 (默认精度)

# 设置精度
getcontext().prec = 6
print(Decimal('1') / Decimal('7'))  # 0.142857

getcontext().prec = 50
print(Decimal('1') / Decimal('7'))
# 0.14285714285714285714285714285714285714285714285714
```

### 局部上下文

```python
from decimal import Decimal, localcontext

# 使用局部上下文不影响全局设置
with localcontext() as ctx:
    ctx.prec = 4
    print(Decimal('1') / Decimal('3'))  # 0.3333

# 恢复到原来的精度
print(Decimal('1') / Decimal('3'))  # 使用全局精度
```

### 舍入模式

```python
from decimal import Decimal, ROUND_HALF_UP, ROUND_DOWN, ROUND_UP, ROUND_CEILING, ROUND_FLOOR, getcontext

d = Decimal('2.675')

# 四舍五入到小数点后两位
print(d.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP))  # 2.68

# 不同的舍入模式
values = [Decimal('2.5'), Decimal('2.4'), Decimal('-2.5')]
modes = {
    'ROUND_HALF_UP': ROUND_HALF_UP,    # 四舍五入
    'ROUND_DOWN': ROUND_DOWN,           # 向零取整
    'ROUND_UP': ROUND_UP,               # 远离零取整
    'ROUND_CEILING': ROUND_CEILING,     # 向正无穷
    'ROUND_FLOOR': ROUND_FLOOR,         # 向负无穷
}

for v in values:
    print(f"\n{v}:")
    for name, mode in modes.items():
        result = v.quantize(Decimal('1'), rounding=mode)
        print(f"  {name}: {result}")
```

### quantize 精度控制

```python
from decimal import Decimal, ROUND_HALF_UP

price = Decimal('19.995')

# 保留两位小数
print(price.quantize(Decimal('0.01')))  # 20.00

# 保留整数
print(price.quantize(Decimal('1')))  # 20

# 保留到十位
print(price.quantize(Decimal('10')))  # 2E+1

# 金额格式化
def format_money(amount):
    return amount.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

print(format_money(Decimal('19.999')))  # 20.00
print(format_money(Decimal('19.994')))  # 19.99
```

## 特殊值

### 无穷和 NaN

```python
from decimal import Decimal

# 正负无穷
inf = Decimal('Infinity')
neg_inf = Decimal('-Infinity')

print(inf + 1)     # Infinity
print(inf > 1000)  # True

# NaN (Not a Number)
nan = Decimal('NaN')
print(nan == nan)  # False (NaN 不等于自身)
print(nan.is_nan())  # True

# sNaN (信号 NaN，会触发异常)
snan = Decimal('sNaN')
```

### 检查方法

```python
from decimal import Decimal

d = Decimal('123.45')

print(d.is_finite())    # True
print(d.is_infinite())  # False
print(d.is_nan())       # False
print(d.is_zero())      # False
print(d.is_signed())    # False (非负数)
print(d.is_normal())    # True
print(d.is_subnormal()) # False
```

## 数学运算

### 常用数学函数

```python
from decimal import Decimal

d = Decimal('16')

# 平方根
print(d.sqrt())  # 4

# 自然对数
print(Decimal('10').ln())  # 2.302585...

# 以 10 为底的对数
print(Decimal('100').log10())  # 2

# 指数 (e^x)
print(Decimal('1').exp())  # 2.718281828...

# 取整
d = Decimal('3.7')
print(d.to_integral_value())  # 4
```

### 数字信息

```python
from decimal import Decimal

d = Decimal('-123.450')

# 符号 (0=正, 1=负)
print(d.sign())  # 1

# 调整后的指数
print(d.adjusted())  # 2

# 数字元组
print(d.as_tuple())
# DecimalTuple(sign=1, digits=(1, 2, 3, 4, 5, 0), exponent=-3)

# 复制并修改符号
print(d.copy_abs())    # 123.450
print(d.copy_negate()) # 123.450
print(d.copy_sign(Decimal('1')))  # 123.450
```

## 实际应用

### 货币计算

```python
from decimal import Decimal, ROUND_HALF_UP

class Money:
    """货币类"""

    def __init__(self, amount, currency='USD'):
        if isinstance(amount, str):
            self.amount = Decimal(amount)
        elif isinstance(amount, Decimal):
            self.amount = amount
        else:
            self.amount = Decimal(str(amount))
        self.currency = currency

    def __add__(self, other):
        if self.currency != other.currency:
            raise ValueError("Currency mismatch")
        return Money(self.amount + other.amount, self.currency)

    def __sub__(self, other):
        if self.currency != other.currency:
            raise ValueError("Currency mismatch")
        return Money(self.amount - other.amount, self.currency)

    def __mul__(self, factor):
        return Money(self.amount * Decimal(str(factor)), self.currency)

    def round(self):
        """四舍五入到分"""
        return Money(
            self.amount.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP),
            self.currency
        )

    def __repr__(self):
        return f"{self.currency} {self.amount:.2f}"

# 使用
price = Money('19.99')
quantity = 3
tax_rate = Decimal('0.08')

subtotal = price * quantity
tax = (subtotal.amount * tax_rate)
total = Money(subtotal.amount + tax).round()

print(f"小计: {subtotal}")     # USD 59.97
print(f"税: USD {tax:.2f}")    # USD 4.80
print(f"总计: {total}")        # USD 64.77
```

### 利息计算

```python
from decimal import Decimal, localcontext, ROUND_HALF_UP

def compound_interest(principal, rate, years, compounds_per_year=12):
    """复利计算

    Args:
        principal: 本金
        rate: 年利率 (如 0.05 表示 5%)
        years: 年数
        compounds_per_year: 每年复利次数
    """
    with localcontext() as ctx:
        ctx.prec = 50  # 高精度计算

        p = Decimal(str(principal))
        r = Decimal(str(rate))
        n = Decimal(str(compounds_per_year))
        t = Decimal(str(years))

        # A = P(1 + r/n)^(nt)
        amount = p * (1 + r / n) ** (n * t)

        # 四舍五入到分
        return amount.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

# 示例: $10000 存 5 年，年利率 5%
principal = 10000
rate = 0.05
years = 5

final_amount = compound_interest(principal, rate, years)
interest = final_amount - Decimal(str(principal))

print(f"本金: ${principal}")
print(f"利率: {rate * 100}%")
print(f"年数: {years}")
print(f"最终金额: ${final_amount}")
print(f"利息收入: ${interest}")
```

### 价格分摊

```python
from decimal import Decimal, ROUND_DOWN, ROUND_UP

def split_amount(total, parts):
    """将金额平均分摊，处理尾数

    Args:
        total: 总金额
        parts: 分摊份数

    Returns:
        各部分金额列表 (总和等于 total)
    """
    if isinstance(total, str):
        total = Decimal(total)

    # 向下取整的基础金额
    base = (total / parts).quantize(Decimal('0.01'), rounding=ROUND_DOWN)

    # 计算分配后的差额
    remainder = total - (base * parts)

    # 差额需要分配的份数
    extra_cents = int(remainder * 100)

    result = []
    for i in range(parts):
        if i < extra_cents:
            result.append(base + Decimal('0.01'))
        else:
            result.append(base)

    return result

# 示例: $100 分给 3 人
total = Decimal('100.00')
shares = split_amount(total, 3)

print(f"总额: ${total}")
for i, share in enumerate(shares, 1):
    print(f"  第 {i} 份: ${share}")
print(f"验证总和: ${sum(shares)}")
# 第 1 份: $33.34
# 第 2 份: $33.33
# 第 3 份: $33.33
# 验证总和: $100.00
```

### 百分比计算

```python
from decimal import Decimal, ROUND_HALF_UP

def calculate_percentage(value, percentage):
    """计算百分比"""
    v = Decimal(str(value))
    p = Decimal(str(percentage)) / 100
    return (v * p).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

def apply_discount(price, discount_percent):
    """应用折扣"""
    p = Decimal(str(price))
    d = Decimal(str(discount_percent)) / 100
    return (p * (1 - d)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

def markup_price(cost, markup_percent):
    """计算加价后的价格"""
    c = Decimal(str(cost))
    m = Decimal(str(markup_percent)) / 100
    return (c * (1 + m)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

# 示例
original_price = Decimal('99.99')
discount = 15  # 15% 折扣

discounted = apply_discount(original_price, discount)
savings = original_price - discounted

print(f"原价: ${original_price}")
print(f"折扣: {discount}%")
print(f"折后价: ${discounted}")
print(f"节省: ${savings}")
```

## 与 JavaScript 的主要差异

| 特性 | Python Decimal | JavaScript |
|-----|----------------|------------|
| 精确小数 | 原生支持 | 需要第三方库 |
| 精度控制 | getcontext | 无 |
| 舍入模式 | 多种可选 | toFixed (四舍五入) |
| 无穷/NaN | 支持 | Number 支持 |
| 性能 | 较慢 | 更快 (浮点) |

## 总结

**创建 Decimal**:
- 从字符串创建 (推荐)
- 从整数创建
- 避免从浮点数创建

**精度控制**:
- `getcontext()`: 全局上下文
- `localcontext()`: 局部上下文
- `quantize()`: 指定精度

**舍入模式**:
- `ROUND_HALF_UP`: 四舍五入
- `ROUND_DOWN`: 向零取整
- `ROUND_CEILING/FLOOR`: 向上/下取整

::: tip 最佳实践
- 金融计算必须使用 Decimal
- 从字符串创建 Decimal
- 使用 quantize 控制输出精度
- 考虑使用 localcontext 临时修改精度
:::

::: info 相关模块
- `fractions` - 分数运算
- `math` - 数学函数
- `statistics` - 统计计算
:::

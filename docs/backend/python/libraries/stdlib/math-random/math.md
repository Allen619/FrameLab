---
title: math - 数学函数
description: Python math 模块详解，与 JavaScript Math 对比
---

# math 数学函数

## 学习目标

- 掌握 math 模块的常用数学函数
- 理解数值精度和特殊值处理
- 与 JavaScript Math 对象对比

## 概述

| Python math | JavaScript Math | 说明 |
|-------------|----------------|------|
| `math.sqrt(x)` | `Math.sqrt(x)` | 平方根 |
| `math.pow(x, y)` | `Math.pow(x, y)` | 幂运算 |
| `math.floor(x)` | `Math.floor(x)` | 向下取整 |
| `math.ceil(x)` | `Math.ceil(x)` | 向上取整 |
| `math.sin(x)` | `Math.sin(x)` | 正弦 |
| `math.pi` | `Math.PI` | 圆周率 |

## 基础函数

### 幂和对数

```python
import math

# 平方根
math.sqrt(16)      # 4.0
math.isqrt(16)     # 4 (整数结果)

# 幂运算
math.pow(2, 3)     # 8.0
2 ** 3             # 8 (推荐，更快)

# 自然对数
math.log(math.e)   # 1.0
math.log(100, 10)  # 2.0 (以 10 为底)

# 常用对数
math.log10(100)    # 2.0
math.log2(8)       # 3.0

# 指数
math.exp(1)        # e^1 = 2.718281828...
math.exp(2)        # e^2 = 7.389056099...
```

```javascript
// JavaScript 对比
Math.sqrt(16) // 4
Math.pow(2, 3) // 8
Math.log(Math.E) // 1
Math.log10(100) // 2
Math.log2(8) // 3
Math.exp(1) // 2.718281828...
```

### 取整函数

```python
import math

x = 3.7
y = -3.7

# 向下取整
math.floor(x)    # 3
math.floor(y)    # -4

# 向上取整
math.ceil(x)     # 4
math.ceil(y)     # -3

# 截断（向零取整）
math.trunc(x)    # 3
math.trunc(y)    # -3

# 四舍五入（使用内置 round）
round(3.5)       # 4
round(2.5)       # 2 (银行家舍入法！)
round(3.14159, 2)  # 3.14

# 取余数和商
math.fmod(7, 3)  # 1.0 (浮点取余)
7 % 3            # 1 (推荐)
divmod(7, 3)     # (2, 1) 同时返回商和余数
```

```javascript
// JavaScript 对比
Math.floor(3.7) // 3
Math.floor(-3.7) // -4
Math.ceil(3.7) // 4
Math.trunc(3.7) // 3
Math.round(3.5) // 4 (标准四舍五入)
;(3.14159).toFixed(2) // '3.14' (返回字符串)
```

> **关键差异**: Python 的 `round()` 使用银行家舍入法（四舍六入五成双），JavaScript 的 `Math.round()` 使用标准四舍五入。

### 绝对值和符号

```python
import math

# 绝对值
abs(-5)          # 5 (内置函数)
math.fabs(-5)    # 5.0 (总是返回浮点数)

# 获取符号
math.copysign(1, -5)   # -1.0 (将 1 的符号改为 -5 的符号)
math.copysign(1, 5)    # 1.0
```

## 三角函数

```python
import math

# 角度转弧度
math.radians(180)   # 3.141592653589793 (π)
math.degrees(math.pi)  # 180.0

# 基本三角函数（参数为弧度）
math.sin(math.pi / 2)   # 1.0
math.cos(0)             # 1.0
math.tan(math.pi / 4)   # 0.9999999999999999 (≈1)

# 反三角函数
math.asin(1)    # 1.5707963... (π/2)
math.acos(0)    # 1.5707963... (π/2)
math.atan(1)    # 0.7853981... (π/4)

# atan2 - 两参数反正切
math.atan2(1, 1)   # 0.7853981... (π/4)

# 双曲函数
math.sinh(0)    # 0.0
math.cosh(0)    # 1.0
math.tanh(0)    # 0.0
```

```javascript
// JavaScript 对比
Math.sin(Math.PI / 2) // 1
Math.cos(0) // 1
Math.atan2(1, 1) // 0.785398...
```

## 常量

```python
import math

# 圆周率
math.pi        # 3.141592653589793

# 自然对数的底
math.e         # 2.718281828459045

# 正无穷
math.inf       # inf
float('inf')   # inf (等效)

# 负无穷
-math.inf      # -inf

# 非数字
math.nan       # nan
float('nan')   # nan (等效)

# tau = 2π (Python 3.6+)
math.tau       # 6.283185307179586
```

```javascript
// JavaScript 对比
Math.PI // 3.141592653589793
Math.E // 2.718281828459045
Infinity // 正无穷
-Infinity // 负无穷
NaN // 非数字
```

## 特殊值检测

```python
import math

# 检测无穷
math.isinf(math.inf)    # True
math.isinf(-math.inf)   # True
math.isinf(1.0)         # False

# 检测 NaN
math.isnan(math.nan)    # True
math.isnan(1.0)         # False

# 检测有限数
math.isfinite(1.0)      # True
math.isfinite(math.inf) # False
math.isfinite(math.nan) # False

# 浮点数近似比较
math.isclose(0.1 + 0.2, 0.3)  # True
math.isclose(0.1 + 0.2, 0.3, rel_tol=1e-9)  # 指定相对误差
```

```javascript
// JavaScript 对比
Number.isFinite(1.0) // true
Number.isNaN(NaN) // true
Number.isInteger(5) // true
```

## 组合数学

```python
import math

# 阶乘
math.factorial(5)   # 120 (5!)

# 排列
math.perm(5, 2)     # 20 (5!/(5-2)!)

# 组合
math.comb(5, 2)     # 10 (5!/2!(5-2)!)

# 最大公约数
math.gcd(12, 8)     # 4
math.gcd(12, 8, 6)  # 2 (多个数，Python 3.9+)

# 最小公倍数 (Python 3.9+)
math.lcm(4, 6)      # 12
math.lcm(4, 6, 8)   # 24
```

## 其他实用函数

```python
import math

# 累积求和（比 sum 更精确）
values = [0.1] * 10
sum(values)           # 0.9999999999999999
math.fsum(values)     # 1.0

# 累积乘积 (Python 3.8+)
math.prod([1, 2, 3, 4])  # 24

# 距离计算 (Python 3.8+)
math.dist([0, 0], [3, 4])  # 5.0 (欧几里得距离)

# 向量模长 (Python 3.8+)
math.hypot(3, 4)          # 5.0
math.hypot(1, 2, 2)       # 3.0 (多维)

# 整数位数
math.log10(1000)           # 3.0
len(str(abs(12345)))       # 5 (更直接)
```

## 实用示例

### 几何计算

```python
import math

def circle_area(radius):
    """计算圆面积"""
    return math.pi * radius ** 2

def distance_2d(p1, p2):
    """计算两点距离"""
    return math.sqrt((p2[0] - p1[0])**2 + (p2[1] - p1[1])**2)
    # 或使用 math.dist(p1, p2)

def angle_between_points(p1, p2):
    """计算两点连线与 x 轴的夹角（度）"""
    dx = p2[0] - p1[0]
    dy = p2[1] - p1[1]
    return math.degrees(math.atan2(dy, dx))

# 使用
print(circle_area(5))                    # 78.53981633974483
print(distance_2d((0, 0), (3, 4)))      # 5.0
print(angle_between_points((0, 0), (1, 1)))  # 45.0
```

### 数值精度处理

```python
import math

def safe_divide(a, b, default=0):
    """安全除法"""
    if b == 0:
        return default
    return a / b

def round_to_n(x, n):
    """四舍五入到 n 位有效数字"""
    if x == 0:
        return 0
    return round(x, -int(math.floor(math.log10(abs(x)))) + (n - 1))

def clamp(value, min_val, max_val):
    """限制值在范围内"""
    return max(min_val, min(max_val, value))

# 使用
print(round_to_n(1234.5678, 3))  # 1230.0
print(clamp(150, 0, 100))        # 100
```

### 坐标转换

```python
import math

def polar_to_cartesian(r, theta_degrees):
    """极坐标转直角坐标"""
    theta = math.radians(theta_degrees)
    x = r * math.cos(theta)
    y = r * math.sin(theta)
    return (x, y)

def cartesian_to_polar(x, y):
    """直角坐标转极坐标"""
    r = math.sqrt(x**2 + y**2)
    theta = math.degrees(math.atan2(y, x))
    return (r, theta)

# 使用
print(polar_to_cartesian(1, 45))    # (0.707..., 0.707...)
print(cartesian_to_polar(1, 1))     # (1.414..., 45.0)
```

## 与 JS 的关键差异

| 特性 | Python math | JavaScript Math |
|-----|-------------|-----------------|
| round 行为 | 银行家舍入 | 标准四舍五入 |
| 整数平方根 | `math.isqrt()` | 需要 `Math.trunc(Math.sqrt())` |
| 阶乘 | `math.factorial()` | 需要自己实现 |
| 组合排列 | `math.comb()`, `math.perm()` | 需要自己实现 |
| GCD/LCM | 内置 | 需要自己实现 |
| 精确求和 | `math.fsum()` | 无 |
| tau | `math.tau` | 无 |

## 常见陷阱

```python
import math

# 1. 浮点数精度问题
0.1 + 0.2 == 0.3          # False!
math.isclose(0.1 + 0.2, 0.3)  # True (正确做法)

# 2. round 的银行家舍入
round(0.5)    # 0 (不是 1！)
round(1.5)    # 2
round(2.5)    # 2 (不是 3！)
# 如果需要标准四舍五入:
import decimal
decimal.Decimal('2.5').quantize(decimal.Decimal('1'), rounding=decimal.ROUND_HALF_UP)  # 3

# 3. 对数的定义域
# math.log(0)   # ValueError: math domain error
# math.log(-1)  # ValueError: math domain error
# 需要用复数: cmath.log(-1)

# 4. 三角函数参数是弧度
math.sin(90)           # 0.893996... (不是 1！)
math.sin(math.pi / 2)  # 1.0 (正确)

# 5. sqrt 不能处理负数
# math.sqrt(-1)  # ValueError
import cmath
cmath.sqrt(-1)  # 1j (复数)
```

## 小结

- `math` 模块提供标准数学函数和常量
- 三角函数使用弧度，需要用 `radians()`/`degrees()` 转换
- `round()` 使用银行家舍入，可能与预期不同
- 使用 `math.isclose()` 比较浮点数
- 组合数学函数：`factorial()`, `comb()`, `perm()`, `gcd()`, `lcm()`
- 精确求和使用 `math.fsum()`

::: info 相关内容
- [random 随机数](./random.md) - 随机数生成
- [decimal 精确计算](./decimal.md) - 高精度小数运算
- [statistics 统计](./statistics.md) - 统计函数
:::

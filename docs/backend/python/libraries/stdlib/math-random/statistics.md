---
title: statistics - 统计函数
description: Python statistics 模块详解，常用统计计算
---

# statistics 统计函数

## 学习目标

- 理解基础统计概念
- 掌握均值、中位数、众数计算
- 学会方差和标准差
- 对比 JavaScript 统计实现

## 概览

| Python statistics | JavaScript | 说明 |
|------------------|------------|------|
| `mean()` | 需手动实现 | 算术平均值 |
| `median()` | 需手动实现 | 中位数 |
| `mode()` | 需手动实现 | 众数 |
| `stdev()` | 需手动实现 | 标准差 |
| `variance()` | 需手动实现 | 方差 |

## 平均值

### mean - 算术平均值

```python
import statistics

data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# 算术平均值
avg = statistics.mean(data)
print(avg)  # 5.5

# 支持高精度数据类型
from decimal import Decimal
from fractions import Fraction

print(statistics.mean([Decimal('1.5'), Decimal('2.5')]))  # 2.0
print(statistics.mean([Fraction(1, 2), Fraction(1, 3)]))  # 5/12
```

```javascript
// JavaScript 对比 - 需手动实现
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const mean = data.reduce((a, b) => a + b, 0) / data.length
console.log(mean)  // 5.5
```

### fmean - 快速浮点平均值

```python
import statistics

data = [1, 2, 3, 4, 5]

# fmean 总是返回 float
avg = statistics.fmean(data)
print(avg)  # 3.0

# 对于大数据集更高效
large_data = range(1, 1000001)
print(statistics.fmean(large_data))  # 500000.5
```

### geometric_mean - 几何平均值

```python
import statistics

# 几何平均值 - 适合计算增长率
growth_rates = [1.10, 1.05, 1.20, 0.95, 1.15]  # 年增长率

geo_mean = statistics.geometric_mean(growth_rates)
print(f"几何平均值: {geo_mean:.4f}")  # 1.0867

# 投资回报率计算
annual_returns = [1.10, 1.05, 1.20]  # 3 年的收益率
avg_annual = statistics.geometric_mean(annual_returns)
print(f"平均年化收益: {(avg_annual - 1) * 100:.2f}%")  # 11.52%
```

### harmonic_mean - 调和平均值

```python
import statistics

# 调和平均值 - 适合速度计算
# 例：60km/h 去，40km/h 返回，平均速度？
speeds = [60, 40]
avg_speed = statistics.harmonic_mean(speeds)
print(f"平均速度: {avg_speed:.2f} km/h")  # 48.00 (不是 50!)

# 更多示例
print(statistics.harmonic_mean([10, 20, 30]))  # 16.36
```

## 中位数

### median - 中位数

```python
import statistics

# 奇数个数据 - 取中间值
data_odd = [1, 3, 5, 7, 9]
print(statistics.median(data_odd))  # 5

# 偶数个数据 - 取中间两数平均
data_even = [1, 2, 3, 4]
print(statistics.median(data_even))  # 2.5

# 无需排序数据
data = [5, 1, 3, 2, 4]
print(statistics.median(data))  # 3
print(data)  # [5, 1, 3, 2, 4] (原数据不变)
```

```javascript
// JavaScript 对比
function median(arr) {
    const sorted = [...arr].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)
    return sorted.length % 2
        ? sorted[mid]
        : (sorted[mid - 1] + sorted[mid]) / 2
}

console.log(median([1, 3, 5, 7, 9]))  // 5
console.log(median([1, 2, 3, 4]))     // 2.5
```

### median_low 和 median_high

```python
import statistics

# 偶数个数据时的处理
data = [1, 2, 3, 4]

print(statistics.median(data))      # 2.5 (平均值)
print(statistics.median_low(data))  # 2 (较小值)
print(statistics.median_high(data)) # 3 (较大值)

# 对于奇数个数据都一样
data_odd = [1, 2, 3, 4, 5]
print(statistics.median(data_odd))      # 3
print(statistics.median_low(data_odd))  # 3
print(statistics.median_high(data_odd)) # 3
```

### median_grouped - 分组中位数

```python
import statistics

# 适用于连续数据
data = [52, 52, 53, 54]

# 默认区间宽度: 1
print(statistics.median_grouped(data))  # 52.5

# 指定区间宽度
print(statistics.median_grouped(data, interval=2))  # 52.0
```

## 众数

### mode - 众数

```python
import statistics

# 找众数
data = [1, 2, 2, 3, 3, 3, 4]
print(statistics.mode(data))  # 3

# 支持字符串数据
colors = ['red', 'blue', 'red', 'green', 'red', 'blue']
print(statistics.mode(colors))  # 'red'

# 多众数时，返回第一个
data = [1, 1, 2, 2, 3]
print(statistics.mode(data))  # 1
```

```javascript
// JavaScript 对比
function mode(arr) {
    const counts = {}
    arr.forEach(x => counts[x] = (counts[x] || 0) + 1)
    return Object.keys(counts).reduce((a, b) =>
        counts[a] > counts[b] ? a : b
    )
}

console.log(mode([1, 2, 2, 3, 3, 3, 4]))  // "3"
```

### multimode - 多众数

```python
import statistics

# 返回所有众数
data = [1, 1, 2, 2, 3]
print(statistics.multimode(data))  # [1, 2]

# 所有值出现次数相同
data = [1, 2, 3]
print(statistics.multimode(data))  # [1, 2, 3]

# 单众数
data = [1, 1, 2, 3]
print(statistics.multimode(data))  # [1]
```

## 离散程度

### variance - 方差

```python
import statistics

data = [2, 4, 4, 4, 5, 5, 7, 9]

# 样本方差 (n-1)
sample_var = statistics.variance(data)
print(f"样本方差: {sample_var:.4f}")  # 4.5714

# 总体方差 (n)
pop_var = statistics.pvariance(data)
print(f"总体方差: {pop_var:.4f}")  # 4.0

# 提供平均值 (避免重复计算)
avg = statistics.mean(data)
var = statistics.variance(data, avg)
print(f"方差: {var:.4f}")
```

### stdev - 标准差

```python
import statistics

data = [2, 4, 4, 4, 5, 5, 7, 9]

# 样本标准差
sample_std = statistics.stdev(data)
print(f"样本标准差: {sample_std:.4f}")  # 2.1381

# 总体标准差
pop_std = statistics.pstdev(data)
print(f"总体标准差: {pop_std:.4f}")  # 2.0

# 关系: std = sqrt(variance)
import math
print(f"验证: {math.sqrt(statistics.variance(data)):.4f}")  # 2.1381
```

```javascript
// JavaScript 对比
function stdev(arr) {
    const n = arr.length
    const mean = arr.reduce((a, b) => a + b) / n
    const variance = arr.reduce((sum, x) =>
        sum + Math.pow(x - mean, 2), 0) / (n - 1)
    return Math.sqrt(variance)
}

console.log(stdev([2, 4, 4, 4, 5, 5, 7, 9]).toFixed(4))  // 2.1381
```

## 分位数

### quantiles - 分位数

```python
import statistics

data = list(range(1, 101))  # 1 到 100

# 默认四分位数 (3 个分割点)
q = statistics.quantiles(data)
print(q)  # [25.5, 50.5, 75.5]

# 十分位数 (9 个分割点)
deciles = statistics.quantiles(data, n=10)
print(deciles)

# 百分位数
percentiles = statistics.quantiles(data, n=100)
print(f"第 90 百分位: {percentiles[89]}")

# 插值方法
# 'exclusive' (默认) - 不包含端点
# 'inclusive' - 包含端点
data = [1, 2, 3, 4, 5]
print(statistics.quantiles(data, method='exclusive'))  # [1.5, 3.0, 4.5]
print(statistics.quantiles(data, method='inclusive'))  # [1.75, 3.0, 4.25]
```

## 相关性

### correlation - 相关系数

```python
import statistics

# 皮尔逊相关系数 (Python 3.10+)
x = [1, 2, 3, 4, 5]
y = [2, 4, 5, 4, 5]

corr = statistics.correlation(x, y)
print(f"相关系数: {corr:.4f}")  # 0.7746

# 完全正相关
x = [1, 2, 3, 4, 5]
y = [1, 2, 3, 4, 5]
print(statistics.correlation(x, y))  # 1.0

# 完全负相关
y = [5, 4, 3, 2, 1]
print(statistics.correlation(x, y))  # -1.0

# 无相关
x = [1, 2, 3, 4, 5]
y = [3, 1, 4, 1, 5]
print(f"{statistics.correlation(x, y):.4f}")  # 接近 0
```

### linear_regression - 线性回归

```python
import statistics

# 简单线性回归 (Python 3.10+)
x = [1, 2, 3, 4, 5]
y = [2, 4, 5, 4, 5]

slope, intercept = statistics.linear_regression(x, y)
print(f"斜率: {slope:.4f}")      # 0.6
print(f"截距: {intercept:.4f}")  # 2.2

# 预测
def predict(x_val):
    return slope * x_val + intercept

print(f"x=6 时 y={predict(6):.2f}")  # 5.8
```

## 实际应用

### 数据描述性分析

```python
import statistics

def analyze_data(data, name="数据"):
    """数据统计分析"""
    print(f"\n=== {name} 分析 ===")
    print(f"样本量: {len(data)}")
    print(f"最小值: {min(data)}")
    print(f"最大值: {max(data)}")
    print(f"极差: {max(data) - min(data)}")
    print(f"\n集中趋势:")
    print(f"  平均值: {statistics.mean(data):.4f}")
    print(f"  中位数: {statistics.median(data):.4f}")
    print(f"  众数: {statistics.multimode(data)}")
    print(f"\n离散程度:")
    print(f"  方差: {statistics.variance(data):.4f}")
    print(f"  标准差: {statistics.stdev(data):.4f}")
    print(f"\n分位数:")
    q = statistics.quantiles(data)
    print(f"  Q1 (25%): {q[0]:.4f}")
    print(f"  Q2 (50%): {q[1]:.4f}")
    print(f"  Q3 (75%): {q[2]:.4f}")
    print(f"  IQR: {q[2] - q[0]:.4f}")

# 使用
scores = [78, 85, 92, 88, 76, 95, 89, 72, 91, 84, 87, 90, 82, 79, 93]
analyze_data(scores, "考试成绩")
```

### 异常值检测

```python
import statistics

def detect_outliers(data, k=1.5):
    """使用 IQR 方法检测异常值"""
    q1, _, q3 = statistics.quantiles(data)
    iqr = q3 - q1

    lower_bound = q1 - k * iqr
    upper_bound = q3 + k * iqr

    outliers = [x for x in data if x < lower_bound or x > upper_bound]
    normal = [x for x in data if lower_bound <= x <= upper_bound]

    return {
        'outliers': outliers,
        'normal': normal,
        'lower_bound': lower_bound,
        'upper_bound': upper_bound
    }

# 使用
data = [10, 12, 14, 15, 16, 18, 20, 100, 5]
result = detect_outliers(data)
print(f"异常值: {result['outliers']}")      # [100]
print(f"正常值: {result['normal']}")        # [10, 12, 14, 15, 16, 18, 20, 5]
print(f"边界: [{result['lower_bound']:.2f}, {result['upper_bound']:.2f}]")
```

### Z 分数标准化

```python
import statistics

def z_score(value, data):
    """计算 Z 分数"""
    mean = statistics.mean(data)
    std = statistics.stdev(data)
    return (value - mean) / std

def z_scores(data):
    """计算所有值的 Z 分数"""
    mean = statistics.mean(data)
    std = statistics.stdev(data)
    return [(x - mean) / std for x in data]

# 使用
scores = [85, 90, 78, 92, 88, 76, 95, 89]
z = z_scores(scores)

print("原始分数 -> Z分数:")
for score, z_val in zip(scores, z):
    interpretation = "高于平均" if z_val > 0 else "低于平均"
    print(f"  {score} -> {z_val:+.2f} ({interpretation})")
```

### 移动平均

```python
import statistics
from collections import deque

def moving_average(data, window_size):
    """简单移动平均"""
    result = []
    window = deque(maxlen=window_size)

    for value in data:
        window.append(value)
        if len(window) == window_size:
            result.append(statistics.mean(window))

    return result

def exponential_moving_average(data, alpha=0.3):
    """指数加权移动平均"""
    result = [data[0]]

    for i in range(1, len(data)):
        ema = alpha * data[i] + (1 - alpha) * result[-1]
        result.append(ema)

    return result

# 使用
prices = [100, 102, 101, 105, 108, 107, 110, 112, 111, 115]

sma = moving_average(prices, 3)
ema = exponential_moving_average(prices)

print("价格    SMA(3)   EMA")
for i, price in enumerate(prices):
    sma_val = sma[i-2] if i >= 2 else '-'
    print(f"{price:6}  {str(sma_val):6}  {ema[i]:.2f}")
```

### 成绩标准化

```python
import statistics

def normalize_scores(scores, target_mean=75, target_std=10):
    """将分数标准化到指定平均值和标准差"""
    current_mean = statistics.mean(scores)
    current_std = statistics.stdev(scores)

    normalized = []
    for score in scores:
        # 先转换为 Z 分数，再转换到目标分布
        z = (score - current_mean) / current_std
        new_score = z * target_std + target_mean
        normalized.append(round(new_score, 1))

    return normalized

# 使用
raw_scores = [45, 55, 62, 70, 78, 85, 92]
print(f"原始分数: {raw_scores}")
print(f"原始平均: {statistics.mean(raw_scores):.1f}")
print(f"原始标准差: {statistics.stdev(raw_scores):.1f}")

normalized = normalize_scores(raw_scores)
print(f"\n标准化分数: {normalized}")
print(f"新平均: {statistics.mean(normalized):.1f}")
print(f"新标准差: {statistics.stdev(normalized):.1f}")
```

## 与 JavaScript 的主要差异

| 特性 | Python statistics | JavaScript |
|-----|------------------|------------|
| 内置统计函数 | 支持 | 无 |
| 高精度计算 | 支持 Decimal | 浮点数 |
| 众数 | `mode()`/`multimode()` | 需手动实现 |
| 分位数 | `quantiles()` | 需手动实现 |
| 线性回归 | `linear_regression()` | 需第三方库 |

## 总结

**集中趋势**:
- `mean()`: 算术平均值
- `median()`: 中位数
- `mode()`: 众数
- `geometric_mean()`: 几何平均值
- `harmonic_mean()`: 调和平均值

**离散程度**:
- `variance()`: 样本方差
- `stdev()`: 样本标准差
- `pvariance()`: 总体方差
- `pstdev()`: 总体标准差

**其他**:
- `quantiles()`: 分位数
- `correlation()`: 相关系数
- `linear_regression()`: 线性回归

::: tip 最佳实践
- 简单数据分析用 `statistics` 模块
- 大数据集推荐 `numpy`/`pandas`
- 注意样本方差 vs 总体方差
- 异常值会影响平均值结果
:::

::: info 相关模块
- `math` - 数学函数
- `random` - 随机数
:::

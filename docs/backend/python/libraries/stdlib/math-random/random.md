---
title: random - 随机数生成
description: Python random 模块详解，与 JavaScript Math.random 对比
---

# random 随机数生成

## 学习目标

- 掌握随机数生成的各种方法
- 理解伪随机数和种子的概念
- 学会随机采样和洗牌
- 了解安全随机数的使用场景

## 概述

| Python random | JavaScript | 说明 |
|--------------|-----------|------|
| `random.random()` | `Math.random()` | 0-1 随机浮点数 |
| `random.randint(a, b)` | `Math.floor(Math.random() * (b-a+1)) + a` | 随机整数 |
| `random.choice(seq)` | `arr[Math.floor(Math.random() * arr.length)]` | 随机选择 |
| `random.shuffle(list)` | 需要自己实现 | 洗牌 |
| `random.sample(seq, k)` | 需要自己实现 | 随机采样 |

## 基础随机数

### 随机浮点数

```python
import random

# 0.0 到 1.0 之间的随机浮点数
random.random()      # 如: 0.7134657834...

# 指定范围的随机浮点数
random.uniform(1.0, 10.0)   # 1.0 到 10.0 之间

# 高斯分布（正态分布）
random.gauss(mu=0, sigma=1)   # 均值 0，标准差 1
random.normalvariate(0, 1)     # 同上，线程安全版本
```

```javascript
// JavaScript 对比
Math.random() // 0.0 到 1.0

// 指定范围
function randomUniform(min, max) {
  return Math.random() * (max - min) + min
}
```

### 随机整数

```python
import random

# 包含端点的随机整数
random.randint(1, 10)    # 1 到 10 (包含 1 和 10)

# 不包含端点的随机整数
random.randrange(1, 10)       # 1 到 9 (不包含 10)
random.randrange(0, 100, 5)   # 0, 5, 10, ..., 95 中随机选择

# 随机偶数
random.randrange(0, 100, 2)   # 0, 2, 4, ..., 98
```

```javascript
// JavaScript 对比
function randint(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
```

## 随机选择

### 从序列中选择

```python
import random

colors = ['red', 'green', 'blue', 'yellow']

# 随机选择一个
color = random.choice(colors)
print(color)  # 如: 'blue'

# 随机选择多个（可重复）
colors3 = random.choices(colors, k=3)
print(colors3)  # 如: ['red', 'red', 'blue']

# 带权重选择
colors_weighted = random.choices(
    colors,
    weights=[10, 1, 1, 1],  # red 被选中的概率更高
    k=5
)
print(colors_weighted)  # 如: ['red', 'red', 'blue', 'red', 'green']

# 随机采样（不重复）
colors2 = random.sample(colors, k=2)
print(colors2)  # 如: ['yellow', 'green']
```

```javascript
// JavaScript 对比
const colors = ['red', 'green', 'blue', 'yellow']

// 随机选择一个
const color = colors[Math.floor(Math.random() * colors.length)]

// 随机采样（不重复）需要自己实现
function sample(arr, k) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, k)
}
```

### 洗牌

```python
import random

cards = list(range(1, 53))  # 52张牌

# 原地洗牌
random.shuffle(cards)
print(cards[:5])  # 如: [23, 7, 41, 2, 15]

# 不修改原列表（使用 sample）
original = [1, 2, 3, 4, 5]
shuffled = random.sample(original, len(original))
print(original)   # [1, 2, 3, 4, 5] (未改变)
print(shuffled)   # 如: [3, 1, 5, 2, 4]
```

```javascript
// JavaScript 对比
const cards = Array.from({ length: 52 }, (_, i) => i + 1)

// Fisher-Yates 洗牌算法
function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
```

## 随机种子

```python
import random

# 设置种子使结果可重现
random.seed(42)
print(random.random())  # 0.6394267984578837
print(random.randint(1, 100))  # 82

# 再次设置相同种子
random.seed(42)
print(random.random())  # 0.6394267984578837 (相同)
print(random.randint(1, 100))  # 82 (相同)

# 使用当前时间作为种子（默认行为）
random.seed()  # 或 random.seed(None)
```

### 独立的随机数生成器

```python
import random

# 创建独立的生成器
rng1 = random.Random(42)
rng2 = random.Random(42)

print(rng1.random())  # 0.6394267984578837
print(rng2.random())  # 0.6394267984578837 (相同)

# 不影响全局状态
print(random.random())  # 不同的值
```

## 概率分布

```python
import random

# 均匀分布
random.uniform(0, 1)

# 正态分布（高斯分布）
random.gauss(mu=100, sigma=15)     # 均值 100，标准差 15
random.normalvariate(100, 15)      # 同上

# 三角分布
random.triangular(low=0, high=10, mode=5)

# 指数分布
random.expovariate(lambd=1.0)

# Beta 分布
random.betavariate(alpha=2, beta=5)

# Gamma 分布
random.gammavariate(alpha=1, beta=1)

# 对数正态分布
random.lognormvariate(mu=0, sigma=1)

# 冯·米塞斯分布（圆形数据）
random.vonmisesvariate(mu=0, kappa=1)

# 帕累托分布
random.paretovariate(alpha=1)

# 韦伯分布
random.weibullvariate(alpha=1, beta=1)
```

## 安全随机数

::: warning 安全提示
`random` 模块使用 Mersenne Twister 算法，**不适合用于密码学或安全用途**。
对于安全相关的场景，请使用 `secrets` 模块。
:::

```python
import secrets

# 安全随机数
secrets.randbelow(100)    # 0 到 99 的安全随机整数
secrets.randbits(256)     # 256 位随机数

# 安全随机选择
secrets.choice(['a', 'b', 'c'])

# 生成安全 token
secrets.token_bytes(16)      # 16 字节
secrets.token_hex(16)        # 32 字符十六进制
secrets.token_urlsafe(16)    # URL 安全的 token

# 生成密码
import string
alphabet = string.ascii_letters + string.digits
password = ''.join(secrets.choice(alphabet) for _ in range(12))
print(password)  # 如: 'aB3kL9mN2xY1'
```

## 实用示例

### 抽奖系统

```python
import random

class Lottery:
    """简单抽奖系统"""

    def __init__(self, participants):
        self.participants = list(participants)
        self.winners = []

    def draw(self, count=1):
        """抽取中奖者"""
        available = [p for p in self.participants if p not in self.winners]
        if count > len(available):
            count = len(available)

        new_winners = random.sample(available, count)
        self.winners.extend(new_winners)
        return new_winners

    def reset(self):
        """重置"""
        self.winners = []

# 使用
lottery = Lottery(['Alice', 'Bob', 'Charlie', 'David', 'Eve'])
print(f"一等奖: {lottery.draw(1)}")
print(f"二等奖: {lottery.draw(2)}")
print(f"三等奖: {lottery.draw(2)}")
```

### 验证码生成

```python
import random
import string

def generate_captcha(length=6, include_letters=True, include_digits=True):
    """生成验证码"""
    chars = ''
    if include_letters:
        # 排除容易混淆的字符
        chars += ''.join(c for c in string.ascii_uppercase if c not in 'OI')
    if include_digits:
        chars += ''.join(c for c in string.digits if c not in '01')

    return ''.join(random.choices(chars, k=length))

# 使用
print(generate_captcha())           # 如: 'A3B5C7'
print(generate_captcha(4, False))   # 如: '3847' (纯数字)
```

### 数据生成器

```python
import random
from datetime import datetime, timedelta

def generate_test_data(count=100):
    """生成测试数据"""
    names = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank']
    cities = ['北京', '上海', '广州', '深圳', '杭州']

    data = []
    for i in range(count):
        # 随机日期
        days_ago = random.randint(0, 365)
        date = datetime.now() - timedelta(days=days_ago)

        record = {
            'id': i + 1,
            'name': random.choice(names),
            'age': random.randint(18, 65),
            'city': random.choice(cities),
            'score': round(random.gauss(75, 15), 1),  # 正态分布的分数
            'created_at': date.strftime('%Y-%m-%d')
        }
        data.append(record)

    return data

# 使用
test_data = generate_test_data(10)
for item in test_data[:3]:
    print(item)
```

### 模拟投掷骰子

```python
import random
from collections import Counter

def roll_dice(num_dice=2, sides=6):
    """投掷骰子"""
    return [random.randint(1, sides) for _ in range(num_dice)]

def simulate_dice(trials=10000):
    """模拟投掷两个骰子的概率分布"""
    results = Counter()

    for _ in range(trials):
        total = sum(roll_dice(2, 6))
        results[total] += 1

    print("两个骰子点数和的概率分布:")
    for total in range(2, 13):
        probability = results[total] / trials
        bar = '*' * int(probability * 100)
        print(f"{total:2d}: {probability:.3f} {bar}")

# 运行模拟
simulate_dice()
```

### A/B 测试分配

```python
import random
import hashlib

class ABTest:
    """A/B 测试分配器"""

    def __init__(self, name, variants, weights=None):
        self.name = name
        self.variants = variants
        self.weights = weights

    def get_variant(self, user_id):
        """根据用户 ID 分配变体（确定性）"""
        # 使用用户 ID 生成确定性的随机数
        seed = hashlib.md5(f"{self.name}:{user_id}".encode()).hexdigest()
        rng = random.Random(seed)

        if self.weights:
            return rng.choices(self.variants, weights=self.weights)[0]
        return rng.choice(self.variants)

# 使用
ab_test = ABTest(
    name='button_color',
    variants=['red', 'blue', 'green'],
    weights=[50, 30, 20]  # 50% red, 30% blue, 20% green
)

# 同一用户总是得到相同的变体
print(ab_test.get_variant('user123'))  # 始终相同
print(ab_test.get_variant('user123'))  # 始终相同
print(ab_test.get_variant('user456'))  # 可能不同
```

## 与 JS 的关键差异

| 特性 | Python random | JavaScript |
|-----|--------------|-----------|
| 基础随机数 | `random.random()` | `Math.random()` |
| 随机整数 | `randint(a, b)` 包含两端 | 需要自己实现 |
| 随机选择 | `choice()`, `choices()` | 需要自己实现 |
| 洗牌 | `shuffle()` 原地修改 | 需要自己实现 |
| 随机采样 | `sample()` | 需要自己实现 |
| 种子 | `seed()` | 无内置支持 |
| 安全随机 | `secrets` 模块 | `crypto.getRandomValues()` |

## 常见陷阱

```python
import random

# 1. shuffle 返回 None
list1 = [1, 2, 3, 4, 5]
result = random.shuffle(list1)  # result 是 None!
print(result)  # None
print(list1)   # 已被修改

# 正确做法
list2 = [1, 2, 3, 4, 5]
random.shuffle(list2)
# 或者不修改原列表
shuffled = random.sample(list2, len(list2))

# 2. randint 包含两端
random.randint(1, 10)  # 可能返回 10！

# 3. random 不安全
# 不要用于密码、token 等安全场景
# password = ''.join(random.choices(string.ascii_letters, k=12))  # 不安全！

import secrets
password = ''.join(secrets.choice(string.ascii_letters) for _ in range(12))  # 安全

# 4. 忘记设置种子导致不可重现
# 测试时应该设置种子
random.seed(42)
# ... 测试代码 ...

# 5. choice 空序列会报错
# random.choice([])  # IndexError
items = []
result = random.choice(items) if items else None
```

## 小结

- `random.random()` 生成 0-1 之间的浮点数
- `random.randint(a, b)` 包含两个端点
- `random.choice()` 随机选择一个，`random.choices()` 可选多个（可重复）
- `random.sample()` 随机采样（不重复）
- `random.shuffle()` 原地洗牌，返回 None
- 使用 `random.seed()` 设置种子使结果可重现
- **安全场景使用 `secrets` 模块**

::: info 相关内容
- [math 数学函数](./math.md) - 数学计算
- [statistics 统计](./statistics.md) - 统计函数
:::

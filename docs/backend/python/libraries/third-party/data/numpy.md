---
title: numpy - 数值计算
description: Python NumPy 数组与数值计算库
---

# numpy 数值计算

## 本章目标

- 掌握 NumPy 数组基础
- 理解向量化运算
- 学习常用数学函数
- 对比 JavaScript 数组操作

## 对比

| NumPy | JavaScript | 说明 |
|-------|------------|------|
| `np.array()` | `[]` | 创建数组 |
| `arr.shape` | `arr.length` | 数组形状 |
| `np.sum()` | `arr.reduce()` | 求和 |
| `arr * 2` | `arr.map(x => x*2)` | 向量运算 |

## 安装

```bash
pip install numpy

# poetry
poetry add numpy
```

## 基础用法

### 创建数组

```python
import numpy as np

# 从列表创建
arr = np.array([1, 2, 3, 4, 5])
print(arr)  # [1 2 3 4 5]

# 二维数组
matrix = np.array([[1, 2, 3], [4, 5, 6]])
print(matrix.shape)  # (2, 3)

# 特殊数组
zeros = np.zeros((3, 3))      # 全零
ones = np.ones((2, 4))        # 全一
eye = np.eye(3)               # 单位矩阵
arange = np.arange(0, 10, 2)  # [0, 2, 4, 6, 8]
linspace = np.linspace(0, 1, 5)  # 5个均匀分布的数
```

### 数组属性

```python
import numpy as np

arr = np.array([[1, 2, 3], [4, 5, 6]])

print(arr.shape)   # (2, 3) - 形状
print(arr.ndim)    # 2 - 维度
print(arr.size)    # 6 - 元素总数
print(arr.dtype)   # int64 - 数据类型
```

### 索引与切片

```python
import numpy as np

arr = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])

# 基本索引
print(arr[0, 1])      # 2
print(arr[1])         # [4, 5, 6]

# 切片
print(arr[:2])        # 前两行
print(arr[:, 1])      # 第二列
print(arr[0:2, 1:3])  # 子矩阵

# 布尔索引
print(arr[arr > 5])   # [6, 7, 8, 9]
```

## 向量化运算

```python
import numpy as np

a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

# 算术运算
print(a + b)      # [5, 7, 9]
print(a * b)      # [4, 10, 18]
print(a ** 2)     # [1, 4, 9]

# 广播
print(a + 10)     # [11, 12, 13]
print(a * 2)      # [2, 4, 6]

# 比较
print(a > 1)      # [False, True, True]
```

## 数学函数

```python
import numpy as np

arr = np.array([1, 4, 9, 16, 25])

# 基本函数
print(np.sqrt(arr))    # 平方根
print(np.exp(arr))     # 指数
print(np.log(arr))     # 自然对数
print(np.abs(arr))     # 绝对值

# 三角函数
angles = np.array([0, np.pi/2, np.pi])
print(np.sin(angles))
print(np.cos(angles))

# 统计函数
data = np.array([1, 2, 3, 4, 5])
print(np.sum(data))    # 15
print(np.mean(data))   # 3.0
print(np.std(data))    # 标准差
print(np.min(data))    # 1
print(np.max(data))    # 5
```

## 数组操作

### 形状变换

```python
import numpy as np

arr = np.arange(12)

# reshape
matrix = arr.reshape(3, 4)
print(matrix.shape)  # (3, 4)

# flatten
flat = matrix.flatten()

# 转置
transposed = matrix.T
```

### 合并与分割

```python
import numpy as np

a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

# 合并
print(np.concatenate([a, b]))  # [1,2,3,4,5,6]
print(np.stack([a, b]))        # 沿新轴堆叠
print(np.vstack([a, b]))       # 垂直堆叠
print(np.hstack([a, b]))       # 水平堆叠

# 分割
arr = np.arange(9)
print(np.split(arr, 3))  # 分成3份
```

## 线性代数

```python
import numpy as np

A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

# 矩阵乘法
print(np.dot(A, B))     # 或 A @ B
print(A @ B)

# 矩阵运算
print(np.linalg.det(A))      # 行列式
print(np.linalg.inv(A))      # 逆矩阵
print(np.linalg.eig(A))      # 特征值和特征向量
```

## 与 JavaScript 对比

```python
# Python NumPy
import numpy as np
arr = np.array([1, 2, 3, 4, 5])
result = arr * 2  # 向量化
mean = arr.mean()
```

```javascript
// JavaScript
const arr = [1, 2, 3, 4, 5]
const result = arr.map(x => x * 2)  // 需要 map
const mean = arr.reduce((a, b) => a + b) / arr.length
```

## 小结

**核心概念**:
- `ndarray`: 多维数组
- 向量化运算
- 广播机制

**常用函数**:
- `np.array()`: 创建数组
- `np.reshape()`: 变形
- `np.dot()`: 矩阵乘法

::: tip 最佳实践
- 优先使用向量化运算
- 避免 Python 循环
- 注意数据类型
:::

::: info 相关库
- `scipy` - 科学计算
- `pandas` - 数据分析
- `matplotlib` - 数据可视化
:::

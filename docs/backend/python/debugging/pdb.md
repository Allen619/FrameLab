---
title: pdb 命令行调试
description: Python 内置调试器 pdb 使用指南
---

# pdb 命令行调试

pdb 是 Python 内置的调试器，无需安装，适合服务器和远程环境调试。

## 启动调试

### 方式一：在代码中插入断点

```python
def process_data(data):
    result = []
    for item in data:
        breakpoint()  # Python 3.7+ 推荐
        # 或: import pdb; pdb.set_trace()
        processed = item * 2
        result.append(processed)
    return result
```

### 方式二：命令行启动

```bash
python -m pdb script.py
```

## 常用命令

| 命令       | 缩写  | 说明                       |
| ---------- | ----- | -------------------------- |
| `help`     | `h`   | 显示帮助                   |
| `next`     | `n`   | 执行下一行（不进入函数）   |
| `step`     | `s`   | 单步执行（进入函数）       |
| `continue` | `c`   | 继续运行到下一个断点       |
| `return`   | `r`   | 运行到当前函数返回         |
| `quit`     | `q`   | 退出调试器                 |
| `list`     | `l`   | 显示当前代码               |
| `print x`  | `p x` | 打印变量值                 |
| `pp x`     |       | 格式化打印（pretty print） |
| `where`    | `w`   | 显示调用栈                 |
| `up`       | `u`   | 跳到上层调用栈             |
| `down`     | `d`   | 跳到下层调用栈             |

## 使用示例

```python
# example.py
def calculate(a, b):
    result = a + b
    return result

def main():
    x = 10
    y = 20
    breakpoint()  # 调试从这里开始
    z = calculate(x, y)
    print(f"结果: {z}")

main()
```

调试会话：

```text
> example.py(9)main()
-> z = calculate(x, y)
(Pdb) p x
10
(Pdb) p y
20
(Pdb) s  # 进入 calculate 函数
> example.py(2)calculate()
-> result = a + b
(Pdb) n  # 执行下一行
> example.py(3)calculate()
-> return result
(Pdb) p result
30
(Pdb) c  # 继续执行
结果: 30
```

## 高级功能

### 设置断点

```text
(Pdb) b 15           # 在第 15 行设置断点
(Pdb) b func_name    # 在函数入口设置断点
(Pdb) b file.py:20   # 在指定文件的第 20 行
(Pdb) b              # 列出所有断点
(Pdb) clear 1        # 删除断点 1
```

### 条件断点

```text
(Pdb) b 10, x > 100  # x > 100 时才暂停
```

### 执行代码

```text
(Pdb) !x = 50        # 修改变量值
(Pdb) !import json   # 导入模块
```

## 对比 Node.js 调试

| 功能       | Python pdb      | Node.js        |
| ---------- | --------------- | -------------- |
| 插入断点   | `breakpoint()`  | `debugger`     |
| 命令行启动 | `python -m pdb` | `node inspect` |
| 下一行     | `n`             | `n`            |
| 进入函数   | `s`             | `s`            |
| 继续       | `c`             | `c`            |

## ipdb - 增强版 pdb

```bash
pip install ipdb
```

```python
import ipdb; ipdb.set_trace()
```

优势：

- 语法高亮
- Tab 补全
- 更好的堆栈显示

## 何时使用 pdb

- 服务器环境（无法使用 VSCode）
- Docker 容器内调试
- 快速临时调试
- SSH 远程调试

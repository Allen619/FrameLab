---
title: VSCode 调试配置
description: 在 VSCode 中调试 Python 代码
---

# VSCode 调试配置

VSCode 是 Python 调试的最佳选择，提供图形化断点、变量监视等功能。

## 前置条件

1. 安装 [Python 扩展](https://marketplace.visualstudio.com/items?itemName=ms-python.python)
2. 选择 Python 解释器：`Ctrl+Shift+P` → "Python: Select Interpreter"

## launch.json 配置

在 `.vscode/launch.json` 中配置：

### 基础配置 - 调试当前文件

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: 当前文件",
      "type": "debugpy",
      "request": "launch",
      "program": "${file}",
      "console": "integratedTerminal",
      "cwd": "${workspaceFolder}"
    }
  ]
}
```

### 调试 FastAPI 应用

```json
{
  "name": "FastAPI",
  "type": "debugpy",
  "request": "launch",
  "module": "uvicorn",
  "args": ["main:app", "--reload"],
  "jinja": true,
  "cwd": "${workspaceFolder}"
}
```

### 调试 Flask 应用

```json
{
  "name": "Flask",
  "type": "debugpy",
  "request": "launch",
  "module": "flask",
  "env": { "FLASK_APP": "app.py", "FLASK_DEBUG": "1" },
  "args": ["run", "--no-debugger"],
  "jinja": true
}
```

### 调试 pytest 测试

```json
{
  "name": "Pytest",
  "type": "debugpy",
  "request": "launch",
  "module": "pytest",
  "args": ["-v", "${file}"],
  "cwd": "${workspaceFolder}"
}
```

## 断点使用

### 设置断点

- 点击行号左侧添加断点（红点）
- 或按 `F9` 在当前行添加/移除断点

### 条件断点

右键断点 → "Edit Breakpoint" → 输入条件：

```python
# 只在 count > 100 时暂停
count > 100

# 只在特定用户时暂停
user.name == "Alice"
```

### 日志断点（Logpoint）

不暂停执行，只输出日志：

右键 → "Add Logpoint" → 输入：

```
用户 {user.name} 登录，ID: {user.id}
```

## 调试控制

| 快捷键          | 功能      | 说明                   |
| --------------- | --------- | ---------------------- |
| `F5`            | 开始/继续 | 运行到下一个断点       |
| `F10`           | 单步跳过  | 执行当前行，不进入函数 |
| `F11`           | 单步进入  | 进入函数内部           |
| `Shift+F11`     | 单步跳出  | 跳出当前函数           |
| `Shift+F5`      | 停止调试  | 终止程序               |
| `Ctrl+Shift+F5` | 重启调试  | 重新开始               |

## 变量监视

### 查看变量

- **Variables 面板**：自动显示当前作用域变量
- **Watch 面板**：添加自定义表达式监视

### 调试控制台

在 Debug Console 中可以执行 Python 代码：

```python
>>> len(users)
42
>>> users[0].name
'Alice'
>>> [u.email for u in users[:3]]
['a@test.com', 'b@test.com', 'c@test.com']
```

## 远程调试

### 配置远程调试

```json
{
  "name": "远程调试",
  "type": "debugpy",
  "request": "attach",
  "connect": {
    "host": "192.168.1.100",
    "port": 5678
  },
  "pathMappings": [
    {
      "localRoot": "${workspaceFolder}",
      "remoteRoot": "/app"
    }
  ]
}
```

### 远程服务器启动

```python
# 在远程代码中添加
import debugpy
debugpy.listen(("0.0.0.0", 5678))
debugpy.wait_for_client()  # 等待 VSCode 连接
```

## 对比 JavaScript 调试

| 功能       | Python (VSCode) | JavaScript (VSCode) |
| ---------- | --------------- | ------------------- |
| 断点       | 相同            | 相同                |
| 条件断点   | 相同            | 相同                |
| 调试控制台 | Debug Console   | Debug Console       |
| 配置文件   | launch.json     | launch.json         |
| 异步调试   | 支持            | 支持                |

## 常见问题

### 断点不生效

1. 检查是否选择了正确的 Python 解释器
2. 确保文件已保存
3. 检查是否在虚拟环境中

### 找不到模块

在 launch.json 添加：

```json
"env": {
    "PYTHONPATH": "${workspaceFolder}"
}
```

### Poetry 虚拟环境

```json
"python": "${workspaceFolder}/.venv/Scripts/python.exe"
```

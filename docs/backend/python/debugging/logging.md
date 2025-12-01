---
title: 日志调试
description: 使用 logging 模块进行调试
---

# 日志调试

logging 是 Python 内置的日志模块，比 print 更专业，适合生产环境。

## logging vs console.log

| Python logging       | JavaScript        | 说明     |
| -------------------- | ----------------- | -------- |
| `logging.debug()`    | `console.debug()` | 调试信息 |
| `logging.info()`     | `console.info()`  | 一般信息 |
| `logging.warning()`  | `console.warn()`  | 警告     |
| `logging.error()`    | `console.error()` | 错误     |
| `logging.critical()` | -                 | 严重错误 |

## 基础用法

```python
import logging

# 配置日志级别
logging.basicConfig(level=logging.DEBUG)

# 使用日志
logging.debug("调试信息：x = %d", x)
logging.info("用户 %s 登录", username)
logging.warning("磁盘空间不足")
logging.error("连接数据库失败: %s", error)
```

## 推荐配置

```python
import logging

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

logger = logging.getLogger(__name__)

def process_user(user_id):
    logger.info("处理用户: %s", user_id)
    try:
        # 处理逻辑
        logger.debug("用户数据: %s", user_data)
    except Exception as e:
        logger.error("处理失败: %s", e, exc_info=True)
```

输出：

```text
2024-01-15 10:30:00 - __main__ - INFO - 处理用户: 123
2024-01-15 10:30:00 - __main__ - DEBUG - 用户数据: {...}
```

## 日志级别

```python
# 级别从低到高
logging.DEBUG     # 10 - 详细调试信息
logging.INFO      # 20 - 确认程序正常运行
logging.WARNING   # 30 - 警告信息
logging.ERROR     # 40 - 错误信息
logging.CRITICAL  # 50 - 严重错误
```

设置级别后，只显示该级别及以上的日志：

```python
logging.basicConfig(level=logging.INFO)  # 不显示 DEBUG
```

## 输出到文件

```python
import logging

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log', encoding='utf-8'),
        logging.StreamHandler()  # 同时输出到控制台
    ]
)
```

## 对比 console.log

```javascript
// JavaScript - 简单但功能有限
console.log('处理用户:', userId)
console.error('错误:', error)

// 没有内置的日志级别控制
// 没有内置的文件输出
// 生产环境需要额外库如 winston
```

```python
# Python - 功能完善
logger.info("处理用户: %s", user_id)
logger.error("错误: %s", error, exc_info=True)

# 内置日志级别控制
# 内置文件输出
# 生产环境直接可用
```

## 模块化日志

```python
# utils/database.py
import logging
logger = logging.getLogger(__name__)

def connect():
    logger.info("连接数据库...")

# main.py
import logging
logging.basicConfig(level=logging.DEBUG)

from utils.database import connect
connect()
```

输出：

```text
INFO:utils.database:连接数据库...
```

## 最佳实践

1. **使用 `__name__` 创建 logger**

   ```python
   logger = logging.getLogger(__name__)
   ```

2. **使用 % 格式化而非 f-string**

   ```python
   # 推荐 - 延迟求值
   logger.debug("用户: %s", user)

   # 不推荐 - 总是求值
   logger.debug(f"用户: {user}")
   ```

3. **记录异常堆栈**

   ```python
   except Exception as e:
       logger.error("失败: %s", e, exc_info=True)
   ```

4. **开发/生产环境切换**
   ```python
   import os
   level = logging.DEBUG if os.getenv('DEBUG') else logging.INFO
   logging.basicConfig(level=level)
   ```

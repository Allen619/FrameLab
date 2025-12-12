---
title: sqlite3 - SQLite 数据库
description: Python sqlite3 模块详解，嵌入式数据库操作
---

# sqlite3 SQLite 数据库

## 学习目标

- 掌握 SQLite 数据库的连接和操作
- 学会 CRUD 操作和事务管理
- 理解参数化查询防止 SQL 注入
- 与 JavaScript 数据库操作对比

## 概述

| Python sqlite3 | JavaScript (better-sqlite3) | 说明 |
|---------------|----------------------------|------|
| `connect()` | `new Database()` | 连接数据库 |
| `cursor()` | 直接调用方法 | 创建游标 |
| `execute()` | `prepare().run()` | 执行 SQL |
| `fetchall()` | `all()` | 获取所有结果 |
| `commit()` | 自动/transaction | 提交事务 |

## 基本使用

### 连接数据库

```python
import sqlite3

# 连接到文件数据库
conn = sqlite3.connect('myapp.db')

# 内存数据库 (临时)
conn = sqlite3.connect(':memory:')

# 创建游标
cursor = conn.cursor()

# 执行 SQL
cursor.execute('SELECT sqlite_version()')
print(cursor.fetchone())  # ('3.39.0',)

# 关闭连接
conn.close()
```

```javascript
// Node.js 对比 - better-sqlite3
const Database = require('better-sqlite3')
const db = new Database('myapp.db')

// 或内存数据库
const db = new Database(':memory:')

const version = db.prepare('SELECT sqlite_version()').get()
console.log(version)

db.close()
```

### 上下文管理器

```python
import sqlite3

# 推荐：使用 with 语句自动管理连接
with sqlite3.connect('myapp.db') as conn:
    cursor = conn.cursor()
    cursor.execute('SELECT 1')
    # 退出时自动 commit
# 注意：with 不会自动 close 连接

# 更完整的写法
def get_connection():
    conn = sqlite3.connect('myapp.db')
    conn.row_factory = sqlite3.Row  # 返回字典式行
    return conn

with get_connection() as conn:
    cursor = conn.cursor()
    # ...
```

## 创建表

### 定义表结构

```python
import sqlite3

conn = sqlite3.connect('myapp.db')
cursor = conn.cursor()

# 创建用户表
cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT NOT NULL,
        age INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
''')

# 创建文章表 (带外键)
cursor.execute('''
    CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
''')

conn.commit()
conn.close()
```

```javascript
// Node.js 对比
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT NOT NULL,
        age INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`)
```

## CRUD 操作

### 插入数据

```python
import sqlite3

conn = sqlite3.connect('myapp.db')
cursor = conn.cursor()

# 单条插入 - 参数化查询 (防止 SQL 注入)
cursor.execute(
    'INSERT INTO users (username, email, age) VALUES (?, ?, ?)',
    ('alice', 'alice@example.com', 25)
)

# 命名参数
cursor.execute(
    'INSERT INTO users (username, email, age) VALUES (:name, :email, :age)',
    {'name': 'bob', 'email': 'bob@example.com', 'age': 30}
)

# 批量插入
users = [
    ('charlie', 'charlie@example.com', 28),
    ('david', 'david@example.com', 35),
    ('eve', 'eve@example.com', 22),
]
cursor.executemany(
    'INSERT INTO users (username, email, age) VALUES (?, ?, ?)',
    users
)

# 获取最后插入的 ID
print(cursor.lastrowid)

conn.commit()
```

```javascript
// Node.js 对比
const stmt = db.prepare('INSERT INTO users (username, email, age) VALUES (?, ?, ?)')
stmt.run('alice', 'alice@example.com', 25)

// 批量插入
const insert = db.prepare('INSERT INTO users (username, email, age) VALUES (?, ?, ?)')
const insertMany = db.transaction((users) => {
    for (const user of users) insert.run(...user)
})
insertMany(users)
```

### 查询数据

```python
import sqlite3

conn = sqlite3.connect('myapp.db')
conn.row_factory = sqlite3.Row  # 返回类字典对象
cursor = conn.cursor()

# 查询单条
cursor.execute('SELECT * FROM users WHERE id = ?', (1,))
user = cursor.fetchone()
if user:
    print(f"Username: {user['username']}")

# 查询多条
cursor.execute('SELECT * FROM users WHERE age > ?', (25,))
users = cursor.fetchall()
for user in users:
    print(f"{user['username']}: {user['email']}")

# 迭代器方式 (节省内存)
cursor.execute('SELECT * FROM users')
for user in cursor:
    print(user['username'])

# 获取指定数量
cursor.execute('SELECT * FROM users')
first_three = cursor.fetchmany(3)

# 聚合查询
cursor.execute('SELECT COUNT(*) as count, AVG(age) as avg_age FROM users')
stats = cursor.fetchone()
print(f"Total: {stats['count']}, Average age: {stats['avg_age']}")
```

```javascript
// Node.js 对比
const user = db.prepare('SELECT * FROM users WHERE id = ?').get(1)
const users = db.prepare('SELECT * FROM users WHERE age > ?').all(25)

// 迭代器
for (const user of db.prepare('SELECT * FROM users').iterate()) {
    console.log(user.username)
}
```

### 更新数据

```python
import sqlite3

conn = sqlite3.connect('myapp.db')
cursor = conn.cursor()

# 更新单条
cursor.execute(
    'UPDATE users SET email = ? WHERE id = ?',
    ('alice_new@example.com', 1)
)

# 更新多条
cursor.execute(
    'UPDATE users SET age = age + 1 WHERE age < ?',
    (30,)
)

# 获取影响的行数
print(f"Updated {cursor.rowcount} rows")

conn.commit()
```

### 删除数据

```python
import sqlite3

conn = sqlite3.connect('myapp.db')
cursor = conn.cursor()

# 删除单条
cursor.execute('DELETE FROM users WHERE id = ?', (1,))

# 删除多条
cursor.execute('DELETE FROM users WHERE age < ?', (18,))

# 清空表
cursor.execute('DELETE FROM users')

print(f"Deleted {cursor.rowcount} rows")

conn.commit()
```

## 事务管理

### 自动提交与手动事务

```python
import sqlite3

# 默认：每个 execute 后不自动提交，需要手动 commit
conn = sqlite3.connect('myapp.db')

try:
    cursor = conn.cursor()

    # 开始事务 (隐式)
    cursor.execute('INSERT INTO users (username, email) VALUES (?, ?)',
                   ('user1', 'user1@example.com'))
    cursor.execute('INSERT INTO users (username, email) VALUES (?, ?)',
                   ('user2', 'user2@example.com'))

    # 提交事务
    conn.commit()
except Exception as e:
    # 回滚事务
    conn.rollback()
    raise e
finally:
    conn.close()
```

### isolation_level 控制

```python
import sqlite3

# 自动提交模式
conn = sqlite3.connect('myapp.db', isolation_level=None)
cursor = conn.cursor()
cursor.execute('INSERT INTO users (username, email) VALUES (?, ?)',
               ('user', 'user@example.com'))
# 自动提交，无需 commit

# 手动事务控制
conn = sqlite3.connect('myapp.db', isolation_level='DEFERRED')
cursor = conn.cursor()
cursor.execute('BEGIN')
cursor.execute('INSERT INTO users ...')
cursor.execute('COMMIT')  # 或 ROLLBACK
```

### 事务上下文管理器

```python
import sqlite3
from contextlib import contextmanager

@contextmanager
def transaction(conn):
    """事务上下文管理器"""
    try:
        yield conn.cursor()
        conn.commit()
    except Exception:
        conn.rollback()
        raise

# 使用
conn = sqlite3.connect('myapp.db')
with transaction(conn) as cursor:
    cursor.execute('INSERT INTO users (username, email) VALUES (?, ?)',
                   ('user1', 'user1@example.com'))
    cursor.execute('INSERT INTO users (username, email) VALUES (?, ?)',
                   ('user2', 'user2@example.com'))
# 自动提交或回滚
```

## 高级用法

### 自定义函数

```python
import sqlite3
import hashlib

conn = sqlite3.connect('myapp.db')

# 注册标量函数
def md5(text):
    return hashlib.md5(text.encode()).hexdigest()

conn.create_function('md5', 1, md5)

cursor = conn.cursor()
cursor.execute("SELECT md5('hello')")
print(cursor.fetchone()[0])  # 5d41402abc4b2a76b9719d911017c592

# 注册聚合函数
class Median:
    def __init__(self):
        self.values = []

    def step(self, value):
        if value is not None:
            self.values.append(value)

    def finalize(self):
        if not self.values:
            return None
        self.values.sort()
        n = len(self.values)
        if n % 2:
            return self.values[n // 2]
        return (self.values[n // 2 - 1] + self.values[n // 2]) / 2

conn.create_aggregate('median', 1, Median)

cursor.execute('SELECT median(age) FROM users')
print(cursor.fetchone()[0])
```

### 自定义类型适配

```python
import sqlite3
import json
from datetime import datetime

# 注册适配器：Python 类型 -> SQLite
def adapt_datetime(dt):
    return dt.isoformat()

sqlite3.register_adapter(datetime, adapt_datetime)

# 注册转换器：SQLite -> Python 类型
def convert_datetime(s):
    return datetime.fromisoformat(s.decode())

sqlite3.register_converter('DATETIME', convert_datetime)

# 存储和检索 JSON
def adapt_json(obj):
    return json.dumps(obj)

def convert_json(s):
    return json.loads(s.decode())

sqlite3.register_adapter(dict, adapt_json)
sqlite3.register_adapter(list, adapt_json)
sqlite3.register_converter('JSON', convert_json)

# 使用时启用类型检测
conn = sqlite3.connect('myapp.db', detect_types=sqlite3.PARSE_DECLTYPES)
```

### Row 工厂

```python
import sqlite3

conn = sqlite3.connect('myapp.db')

# 使用 sqlite3.Row (推荐)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()
cursor.execute('SELECT * FROM users WHERE id = 1')
row = cursor.fetchone()
print(row['username'])  # 像字典一样访问
print(row[0])           # 也可以用索引

# 自定义 Row 工厂 - 返回字典
def dict_factory(cursor, row):
    return {col[0]: value for col, value in zip(cursor.description, row)}

conn.row_factory = dict_factory
cursor = conn.cursor()
cursor.execute('SELECT * FROM users')
for row in cursor:
    print(row)  # {'id': 1, 'username': 'alice', ...}

# 返回命名元组
from collections import namedtuple

def namedtuple_factory(cursor, row):
    fields = [col[0] for col in cursor.description]
    Row = namedtuple('Row', fields)
    return Row(*row)

conn.row_factory = namedtuple_factory
```

## 实用示例

### 数据库管理类

```python
import sqlite3
from contextlib import contextmanager
from typing import Any, Optional

class Database:
    def __init__(self, db_path: str):
        self.db_path = db_path

    @contextmanager
    def get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        try:
            yield conn
        finally:
            conn.close()

    @contextmanager
    def transaction(self):
        with self.get_connection() as conn:
            try:
                yield conn.cursor()
                conn.commit()
            except Exception:
                conn.rollback()
                raise

    def execute(self, sql: str, params: tuple = ()) -> list:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(sql, params)
            return cursor.fetchall()

    def execute_one(self, sql: str, params: tuple = ()) -> Optional[sqlite3.Row]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(sql, params)
            return cursor.fetchone()

    def insert(self, table: str, data: dict) -> int:
        columns = ', '.join(data.keys())
        placeholders = ', '.join('?' * len(data))
        sql = f'INSERT INTO {table} ({columns}) VALUES ({placeholders})'

        with self.transaction() as cursor:
            cursor.execute(sql, tuple(data.values()))
            return cursor.lastrowid

    def update(self, table: str, data: dict, where: str, params: tuple = ()) -> int:
        set_clause = ', '.join(f'{k} = ?' for k in data.keys())
        sql = f'UPDATE {table} SET {set_clause} WHERE {where}'

        with self.transaction() as cursor:
            cursor.execute(sql, tuple(data.values()) + params)
            return cursor.rowcount

    def delete(self, table: str, where: str, params: tuple = ()) -> int:
        sql = f'DELETE FROM {table} WHERE {where}'

        with self.transaction() as cursor:
            cursor.execute(sql, params)
            return cursor.rowcount

# 使用
db = Database('myapp.db')

# 插入
user_id = db.insert('users', {
    'username': 'alice',
    'email': 'alice@example.com',
    'age': 25
})

# 查询
users = db.execute('SELECT * FROM users WHERE age > ?', (20,))

# 更新
db.update('users', {'age': 26}, 'id = ?', (user_id,))

# 删除
db.delete('users', 'id = ?', (user_id,))
```

### 简单 ORM

```python
import sqlite3
from dataclasses import dataclass, field, asdict
from typing import Optional, List

@dataclass
class User:
    username: str
    email: str
    age: int
    id: Optional[int] = None
    created_at: Optional[str] = None

class UserRepository:
    def __init__(self, conn: sqlite3.Connection):
        self.conn = conn
        self.conn.row_factory = sqlite3.Row

    def create_table(self):
        self.conn.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT NOT NULL,
                age INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        self.conn.commit()

    def save(self, user: User) -> User:
        if user.id is None:
            cursor = self.conn.execute(
                'INSERT INTO users (username, email, age) VALUES (?, ?, ?)',
                (user.username, user.email, user.age)
            )
            user.id = cursor.lastrowid
        else:
            self.conn.execute(
                'UPDATE users SET username = ?, email = ?, age = ? WHERE id = ?',
                (user.username, user.email, user.age, user.id)
            )
        self.conn.commit()
        return user

    def find_by_id(self, id: int) -> Optional[User]:
        row = self.conn.execute(
            'SELECT * FROM users WHERE id = ?', (id,)
        ).fetchone()
        return User(**dict(row)) if row else None

    def find_all(self) -> List[User]:
        rows = self.conn.execute('SELECT * FROM users').fetchall()
        return [User(**dict(row)) for row in rows]

    def delete(self, user: User) -> bool:
        if user.id is None:
            return False
        cursor = self.conn.execute('DELETE FROM users WHERE id = ?', (user.id,))
        self.conn.commit()
        return cursor.rowcount > 0

# 使用
conn = sqlite3.connect(':memory:')
repo = UserRepository(conn)
repo.create_table()

# 创建用户
user = User(username='alice', email='alice@example.com', age=25)
user = repo.save(user)
print(f"Created user with ID: {user.id}")

# 查找
found = repo.find_by_id(user.id)
print(f"Found: {found}")

# 更新
user.age = 26
repo.save(user)

# 列出所有
for u in repo.find_all():
    print(u)
```

### 数据库迁移

```python
import sqlite3

MIGRATIONS = [
    # Migration 1: Create users table
    '''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT NOT NULL
    )
    ''',
    # Migration 2: Add age column
    '''
    ALTER TABLE users ADD COLUMN age INTEGER
    ''',
    # Migration 3: Add created_at column
    '''
    ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ''',
]

def get_current_version(conn):
    try:
        cursor = conn.execute('SELECT version FROM schema_version')
        row = cursor.fetchone()
        return row[0] if row else 0
    except sqlite3.OperationalError:
        return 0

def set_version(conn, version):
    conn.execute('CREATE TABLE IF NOT EXISTS schema_version (version INTEGER)')
    conn.execute('DELETE FROM schema_version')
    conn.execute('INSERT INTO schema_version (version) VALUES (?)', (version,))

def migrate(db_path):
    conn = sqlite3.connect(db_path)
    current_version = get_current_version(conn)

    for i, migration in enumerate(MIGRATIONS[current_version:], start=current_version + 1):
        print(f"Running migration {i}...")
        conn.executescript(migration)
        set_version(conn, i)

    conn.commit()
    conn.close()
    print(f"Database migrated to version {len(MIGRATIONS)}")

# 运行迁移
migrate('myapp.db')
```

## 性能优化

### 批量操作

```python
import sqlite3

conn = sqlite3.connect('myapp.db')
cursor = conn.cursor()

# 使用事务批量插入
users = [(f'user{i}', f'user{i}@example.com', i % 50 + 18) for i in range(10000)]

# 慢：每次单独提交
# for user in users:
#     cursor.execute('INSERT INTO users ...', user)
#     conn.commit()

# 快：批量插入后一次提交
cursor.executemany(
    'INSERT INTO users (username, email, age) VALUES (?, ?, ?)',
    users
)
conn.commit()

# 更快：使用 executescript 或关闭同步
conn.execute('PRAGMA synchronous = OFF')
conn.execute('PRAGMA journal_mode = MEMORY')
cursor.executemany('INSERT INTO users ...', users)
conn.commit()
```

### 索引

```python
import sqlite3

conn = sqlite3.connect('myapp.db')
cursor = conn.cursor()

# 创建索引
cursor.execute('CREATE INDEX IF NOT EXISTS idx_users_email ON users (email)')
cursor.execute('CREATE INDEX IF NOT EXISTS idx_users_age ON users (age)')

# 复合索引
cursor.execute('CREATE INDEX IF NOT EXISTS idx_posts_user_date ON posts (user_id, created_at)')

# 查看查询计划
cursor.execute('EXPLAIN QUERY PLAN SELECT * FROM users WHERE email = ?', ('alice@example.com',))
print(cursor.fetchall())

conn.commit()
```

## 与 JS 的关键差异

| 特性 | Python sqlite3 | Node.js better-sqlite3 |
|-----|---------------|------------------------|
| 同步/异步 | 同步 | 同步 |
| 游标 | 需要创建 cursor | 直接调用方法 |
| 事务 | 手动 commit | transaction() |
| 参数 | `?` 或 `:name` | `?` 或 `$name` |
| Row 访问 | row['col'] 或 row[0] | row.col |

## 小结

**基本操作**:
- `connect()`: 连接数据库
- `cursor()`: 创建游标
- `execute()`: 执行 SQL
- `commit()/rollback()`: 事务控制

**查询结果**:
- `fetchone()`: 获取单条
- `fetchall()`: 获取全部
- `fetchmany(n)`: 获取 n 条
- 迭代 cursor

**高级功能**:
- `row_factory`: 自定义行工厂
- `create_function()`: 自定义函数
- `register_adapter/converter`: 类型转换

::: tip 最佳实践
- 使用参数化查询防止 SQL 注入
- 使用 `with` 语句管理事务
- 批量操作使用 `executemany`
- 为常用查询字段创建索引
:::

::: info 相关模块
- `json` - JSON 序列化
- `pickle` - 对象持久化
:::

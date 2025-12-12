---
title: hashlib - 哈希函数
description: Python hashlib 模块详解，消息摘要和安全哈希
---

# hashlib 哈希函数

## 学习目标

- 掌握常用哈希算法的使用
- 理解哈希在安全场景中的应用
- 学会文件完整性校验
- 与 JavaScript crypto 对比

## 概述

| Python hashlib | JavaScript (crypto) | 说明 |
|---------------|---------------------|------|
| `hashlib.md5()` | `crypto.createHash('md5')` | MD5 哈希 |
| `hashlib.sha256()` | `crypto.createHash('sha256')` | SHA-256 |
| `update()` | `update()` | 更新数据 |
| `hexdigest()` | `digest('hex')` | 十六进制输出 |
| `pbkdf2_hmac()` | `crypto.pbkdf2Sync()` | 密钥派生 |

## 基本使用

### 创建哈希对象

```python
import hashlib

# 创建 MD5 哈希
md5 = hashlib.md5()
md5.update(b'hello')
print(md5.hexdigest())  # 5d41402abc4b2a76b9719d911017c592

# 创建 SHA-256 哈希
sha256 = hashlib.sha256()
sha256.update(b'hello')
print(sha256.hexdigest())  # 2cf24dba5fb0a30e26e83b2ac5b9e29e...

# 一行写法
print(hashlib.sha256(b'hello').hexdigest())

# 字符串需要编码
text = 'hello'
print(hashlib.sha256(text.encode('utf-8')).hexdigest())
```

```javascript
// Node.js 对比
const crypto = require('crypto')

// MD5
const md5 = crypto.createHash('md5').update('hello').digest('hex')
console.log(md5)  // 5d41402abc4b2a76b9719d911017c592

// SHA-256
const sha256 = crypto.createHash('sha256').update('hello').digest('hex')
console.log(sha256)
```

### 支持的算法

```python
import hashlib

# 查看所有支持的算法
print(hashlib.algorithms_available)

# 保证可用的算法
print(hashlib.algorithms_guaranteed)
# {'sha256', 'sha384', 'sha512', 'sha1', 'md5', 'blake2b', 'blake2s', ...}

# 常用算法
hashlib.md5(b'data')       # 128 位，不安全，仅用于校验
hashlib.sha1(b'data')      # 160 位，不安全
hashlib.sha256(b'data')    # 256 位，推荐
hashlib.sha384(b'data')    # 384 位
hashlib.sha512(b'data')    # 512 位
hashlib.blake2b(b'data')   # 可变长度，高性能
hashlib.blake2s(b'data')   # blake2b 的精简版

# 通过名称创建
h = hashlib.new('sha256')
h.update(b'data')
```

### 增量更新

```python
import hashlib

# 可以分多次更新
h = hashlib.sha256()
h.update(b'hello')
h.update(b' ')
h.update(b'world')
print(h.hexdigest())

# 等价于一次性更新
h2 = hashlib.sha256()
h2.update(b'hello world')
print(h2.hexdigest())

# 两者结果相同
assert hashlib.sha256(b'hello world').hexdigest() == h.hexdigest()
```

### 输出格式

```python
import hashlib

h = hashlib.sha256(b'hello')

# 十六进制字符串
print(h.hexdigest())  # 2cf24dba5fb0a30e26e83b2ac5b9e29e...

# 字节对象
print(h.digest())  # b',\xf2M\xba_\xb0\xa3...'

# 哈希长度 (字节)
print(h.digest_size)  # 32

# 块大小 (字节)
print(h.block_size)  # 64
```

## 实用场景

### 文件哈希校验

```python
import hashlib

def file_hash(filepath, algorithm='sha256', chunk_size=8192):
    """计算文件哈希值"""
    h = hashlib.new(algorithm)
    with open(filepath, 'rb') as f:
        while chunk := f.read(chunk_size):
            h.update(chunk)
    return h.hexdigest()

# 使用
file_sha256 = file_hash('myfile.zip')
print(f"SHA-256: {file_sha256}")

# 验证文件完整性
expected = "abc123..."  # 预期的哈希值
actual = file_hash('downloaded_file.zip')
if actual == expected:
    print("File integrity verified!")
else:
    print("File corrupted or modified!")
```

```javascript
// Node.js 对比
const crypto = require('crypto')
const fs = require('fs')

function fileHash(filepath, algorithm = 'sha256') {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash(algorithm)
        const stream = fs.createReadStream(filepath)
        stream.on('data', chunk => hash.update(chunk))
        stream.on('end', () => resolve(hash.digest('hex')))
        stream.on('error', reject)
    })
}
```

### 密码哈希 (不推荐直接哈希)

```python
import hashlib
import os

# 错误做法：直接哈希密码
# password_hash = hashlib.sha256(b'password123').hexdigest()

# 正确做法：使用加盐的密钥派生函数
def hash_password(password, salt=None):
    """安全的密码哈希"""
    if salt is None:
        salt = os.urandom(32)  # 随机盐值

    # PBKDF2 密钥派生
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt,
        iterations=100000,  # 迭代次数
        dklen=32            # 派生密钥长度
    )

    return salt + key  # 盐值 + 哈希值

def verify_password(password, stored_hash):
    """验证密码"""
    salt = stored_hash[:32]
    stored_key = stored_hash[32:]

    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt,
        iterations=100000,
        dklen=32
    )

    return key == stored_key

# 使用
stored = hash_password('mypassword123')
print(verify_password('mypassword123', stored))  # True
print(verify_password('wrongpassword', stored))  # False
```

::: warning 密码存储建议
实际生产环境中，推荐使用专门的密码哈希库如 `bcrypt`、`argon2` 或 `scrypt`，而不是直接使用 hashlib。
:::

### HMAC 消息认证

```python
import hashlib
import hmac

# HMAC - 带密钥的哈希
secret_key = b'my-secret-key'
message = b'important message'

# 创建 HMAC
h = hmac.new(secret_key, message, hashlib.sha256)
print(h.hexdigest())

# 验证消息
def verify_hmac(key, message, signature):
    expected = hmac.new(key, message, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)  # 防止时序攻击

# 使用
signature = hmac.new(secret_key, message, hashlib.sha256).hexdigest()
is_valid = verify_hmac(secret_key, message, signature)
print(f"Valid: {is_valid}")  # True
```

```javascript
// Node.js 对比
const crypto = require('crypto')

const hmac = crypto.createHmac('sha256', 'my-secret-key')
hmac.update('important message')
console.log(hmac.digest('hex'))
```

### 内容去重

```python
import hashlib
import os

def find_duplicates(directory):
    """查找重复文件"""
    hashes = {}
    duplicates = []

    for root, dirs, files in os.walk(directory):
        for filename in files:
            filepath = os.path.join(root, filename)
            file_hash = get_file_hash(filepath)

            if file_hash in hashes:
                duplicates.append((filepath, hashes[file_hash]))
            else:
                hashes[file_hash] = filepath

    return duplicates

def get_file_hash(filepath, chunk_size=8192):
    h = hashlib.md5()  # 去重场景 MD5 足够
    with open(filepath, 'rb') as f:
        while chunk := f.read(chunk_size):
            h.update(chunk)
    return h.hexdigest()

# 使用
duplicates = find_duplicates('/path/to/folder')
for dup, original in duplicates:
    print(f"Duplicate: {dup}")
    print(f"Original: {original}")
    print()
```

### 数据指纹

```python
import hashlib
import json

def data_fingerprint(data):
    """生成数据指纹"""
    # 将数据序列化为确定性字符串
    serialized = json.dumps(data, sort_keys=True, ensure_ascii=True)
    return hashlib.sha256(serialized.encode()).hexdigest()[:16]

# 使用
user = {'name': 'Alice', 'email': 'alice@example.com', 'age': 25}
fingerprint = data_fingerprint(user)
print(f"Fingerprint: {fingerprint}")

# 检测数据变化
user_v2 = {'name': 'Alice', 'email': 'alice@example.com', 'age': 26}
fingerprint_v2 = data_fingerprint(user_v2)
print(f"Changed: {fingerprint != fingerprint_v2}")  # True
```

### 缓存键生成

```python
import hashlib
import json

def cache_key(*args, **kwargs):
    """根据参数生成缓存键"""
    key_data = json.dumps({'args': args, 'kwargs': kwargs}, sort_keys=True)
    return hashlib.md5(key_data.encode()).hexdigest()

# 使用示例
def expensive_function(x, y, z=None):
    key = cache_key(x, y, z=z)
    # 检查缓存
    # if key in cache:
    #     return cache[key]
    # result = ...
    # cache[key] = result
    return key

print(expensive_function(1, 2, z=3))  # 生成唯一缓存键
```

## 高级用法

### BLAKE2 哈希

```python
import hashlib

# BLAKE2b - 更快更安全的替代方案
h = hashlib.blake2b(b'hello', digest_size=32)  # 自定义长度
print(h.hexdigest())

# 带密钥的 BLAKE2 (可用作 MAC)
key = b'secret-key-12345'
h = hashlib.blake2b(b'message', key=key, digest_size=32)
print(h.hexdigest())

# 个性化 (防止彩虹表攻击)
h = hashlib.blake2b(
    b'data',
    person=b'myapp-v1',  # 应用标识
    salt=b'random-salt',  # 盐值
)
print(h.hexdigest())
```

### SHAKE 可变长度哈希

```python
import hashlib

# SHAKE128/256 - 可变长度输出
h = hashlib.shake_128(b'hello')
print(h.hexdigest(16))  # 16 字节输出
print(h.hexdigest(32))  # 32 字节输出
print(h.hexdigest(64))  # 64 字节输出
```

### 多线程文件哈希

```python
import hashlib
from concurrent.futures import ThreadPoolExecutor
import os

def hash_file(filepath):
    """计算单个文件哈希"""
    h = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(8192):
            h.update(chunk)
    return filepath, h.hexdigest()

def hash_directory(directory, max_workers=4):
    """并行计算目录下所有文件的哈希"""
    files = []
    for root, _, filenames in os.walk(directory):
        for filename in filenames:
            files.append(os.path.join(root, filename))

    results = {}
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        for filepath, file_hash in executor.map(hash_file, files):
            results[filepath] = file_hash

    return results

# 使用
# hashes = hash_directory('/path/to/dir')
```

## 安全注意事项

### 不安全的哈希算法

```python
import hashlib

# 不要用于安全场景
# MD5 - 已被破解，仅用于校验和
# SHA-1 - 已被证明不安全

# 推荐用于安全场景
# SHA-256, SHA-384, SHA-512
# BLAKE2b, BLAKE2s
```

### 防止时序攻击

```python
import hmac

def insecure_compare(a, b):
    """不安全的比较 - 容易被时序攻击"""
    return a == b

def secure_compare(a, b):
    """安全的比较 - 恒定时间"""
    return hmac.compare_digest(a, b)

# 始终使用 hmac.compare_digest 比较哈希值
```

## 与 JS 的关键差异

| 特性 | Python hashlib | Node.js crypto |
|-----|---------------|----------------|
| 创建哈希 | `hashlib.sha256()` | `crypto.createHash('sha256')` |
| 输出格式 | `hexdigest()` | `digest('hex')` |
| 更新数据 | `update(bytes)` | `update(str/buffer)` |
| HMAC | `hmac.new()` | `crypto.createHmac()` |
| 密钥派生 | `pbkdf2_hmac()` | `pbkdf2Sync()` |

## 小结

**常用算法**:
- `md5`: 快速校验，不用于安全
- `sha256`: 通用安全哈希
- `sha512`: 更强安全性
- `blake2b`: 高性能安全哈希

**基本操作**:
- `hashlib.new('algorithm')`: 创建哈希
- `update(data)`: 更新数据
- `hexdigest()`: 十六进制输出
- `digest()`: 字节输出

**安全功能**:
- `pbkdf2_hmac()`: 密钥派生
- `hmac.new()`: 消息认证码
- `hmac.compare_digest()`: 安全比较

::: tip 最佳实践
- 密码存储使用 `pbkdf2_hmac` 或专用库
- 安全场景至少使用 SHA-256
- 比较哈希值使用 `hmac.compare_digest`
- 文件校验可以用 MD5 (速度快)
:::

::: info 相关模块
- `secrets` - 安全随机数生成
- `hmac` - HMAC 消息认证
:::

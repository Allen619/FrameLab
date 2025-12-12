---
title: base64 - 编解码
description: Python base64 模块详解，Base64 编码与解码
---

# base64 编解码

## 学习目标

- 理解 Base64 编码原理
- 掌握 Base64 不同变体的使用
- 学会处理二进制数据
- 对比 JavaScript atob/btoa 特性

## 概览

| Python base64 | JavaScript | 说明 |
|--------------|------------|------|
| `b64encode()` | `btoa()` | Base64 编码 |
| `b64decode()` | `atob()` | Base64 解码 |
| `urlsafe_b64encode()` | 需手动实现 | URL 安全编码 |
| `b32encode()` | 需手动实现 | Base32 编码 |
| `b16encode()` | 需手动实现 | Base16 编码 |

## 基本用法

### Base64 编码

```python
import base64

# 字符串编码 (注意输入: bytes)
text = "Hello, World!"
encoded = base64.b64encode(text.encode('utf-8'))
print(encoded)  # b'SGVsbG8sIFdvcmxkIQ=='

# 转为字符串
encoded_str = encoded.decode('ascii')
print(encoded_str)  # SGVsbG8sIFdvcmxkIQ==

# 二进制数据编码
binary_data = bytes([0, 1, 2, 255, 254, 253])
encoded = base64.b64encode(binary_data)
print(encoded)  # b'AAEC//79'
```

```javascript
// JavaScript 对比
const text = "Hello, World!"

// 编码 (仅支持 ASCII/Latin1)
const encoded = btoa(text)
console.log(encoded)  // SGVsbG8sIFdvcmxkIQ==

// 编码 Unicode
const unicodeText = "你好"
const encoded2 = btoa(unescape(encodeURIComponent(unicodeText)))
console.log(encoded2)

// Node.js
const encoded3 = Buffer.from(text).toString('base64')
```

### Base64 解码

```python
import base64

# 解码
encoded = b'SGVsbG8sIFdvcmxkIQ=='
decoded = base64.b64decode(encoded)
print(decoded)  # b'Hello, World!'

# 转为字符串
text = decoded.decode('utf-8')
print(text)  # Hello, World!

# 字符串直接解码
decoded = base64.b64decode('SGVsbG8sIFdvcmxkIQ==')
print(decoded.decode())  # Hello, World!

# 忽略无效字符
encoded_dirty = 'SGVsbG8s\nIFdvcmxkIQ=='
decoded = base64.b64decode(encoded_dirty, validate=False)
print(decoded.decode())  # Hello, World!
```

```javascript
// JavaScript 对比
const encoded = "SGVsbG8sIFdvcmxkIQ=="
const decoded = atob(encoded)
console.log(decoded)  // Hello, World!

// Node.js
const decoded2 = Buffer.from(encoded, 'base64').toString('utf-8')
```

## URL 安全编码

### urlsafe_b64encode / urlsafe_b64decode

```python
import base64

# 标准 Base64 可能包含 + 和 /
data = bytes([255, 254, 253])
standard = base64.b64encode(data)
print(standard)  # b'//79' (包含 /)

# URL 安全版本 - 用 - 替换 +，用 _ 替换 /
url_safe = base64.urlsafe_b64encode(data)
print(url_safe)  # b'__79'

# 解码
decoded = base64.urlsafe_b64decode(url_safe)
print(decoded == data)  # True

# 实际应用：URL 参数
def encode_for_url(data):
    """编码数据用于 URL"""
    if isinstance(data, str):
        data = data.encode('utf-8')
    return base64.urlsafe_b64encode(data).decode('ascii')

def decode_from_url(encoded_str):
    """从 URL 解码数据"""
    return base64.urlsafe_b64decode(encoded_str).decode('utf-8')

# 使用
original = "user@example.com"
encoded = encode_for_url(original)
print(f"URL 参数: ?email={encoded}")
print(f"解码: {decode_from_url(encoded)}")
```

```javascript
// JavaScript URL 安全编码
function urlSafeEncode(str) {
    return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')  // 可选：移除填充
}

function urlSafeDecode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/')
    // 添加填充
    while (str.length % 4) str += '='
    return atob(str)
}
```

## 其他变体

### Base32 编码

```python
import base64

# Base32 使用 A-Z 和 2-7
text = "Hello"
encoded = base64.b32encode(text.encode())
print(encoded)  # b'JBSWY3DP'

decoded = base64.b32decode(encoded)
print(decoded.decode())  # Hello

# 大小写不敏感
decoded = base64.b32decode(b'jbswy3dp', casefold=True)
print(decoded.decode())  # Hello
```

### Base16 编码 (十六进制)

```python
import base64

# Base16 = 十六进制
data = bytes([0, 15, 255])
encoded = base64.b16encode(data)
print(encoded)  # b'000FFF'

decoded = base64.b16decode(encoded)
print(decoded)  # b'\x00\x0f\xff'

# 等效于 bytes.hex()
print(data.hex().upper())  # 000FFF
print(bytes.fromhex('000FFF'))  # b'\x00\x0f\xff'
```

### ASCII85 编码

```python
import base64

# ASCII85 比 Base64 更高效
data = b"Hello, World!"

# a85encode (Adobe 格式)
encoded = base64.a85encode(data)
print(encoded)  # b'87cURD]i,"Ebo80'

decoded = base64.a85decode(encoded)
print(decoded)  # b'Hello, World!'

# b85encode (另一种格式)
encoded = base64.b85encode(data)
print(encoded)
```

## 实际应用

### 图片 Base64 编码

```python
import base64

def image_to_base64(filepath):
    """图片文件转为 Base64"""
    with open(filepath, 'rb') as f:
        image_data = f.read()

    encoded = base64.b64encode(image_data).decode('ascii')

    # 获取 MIME 类型
    if filepath.endswith('.png'):
        mime = 'image/png'
    elif filepath.endswith('.jpg') or filepath.endswith('.jpeg'):
        mime = 'image/jpeg'
    elif filepath.endswith('.gif'):
        mime = 'image/gif'
    else:
        mime = 'application/octet-stream'

    return f"data:{mime};base64,{encoded}"

def base64_to_image(data_url, output_path):
    """将 Base64 Data URL 保存为图片"""
    # 解析 Data URL
    header, data = data_url.split(',', 1)
    image_data = base64.b64decode(data)

    with open(output_path, 'wb') as f:
        f.write(image_data)

# 使用
# data_url = image_to_base64('photo.png')
# print(data_url[:50])  # data:image/png;base64,iVBORw0KGgo...
# base64_to_image(data_url, 'output.png')
```

```javascript
// JavaScript 对比 (浏览器端)
function imageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

// Node.js
const fs = require('fs')
const imageData = fs.readFileSync('photo.png')
const base64 = imageData.toString('base64')
const dataUrl = `data:image/png;base64,${base64}`
```

### 简单加密令牌

```python
import base64
import json
import hmac
import hashlib
import time

SECRET = b'your-secret-key'

def create_token(data, expires_in=3600):
    """创建简单签名令牌"""
    payload = {
        'data': data,
        'exp': int(time.time()) + expires_in
    }

    # 编码 payload
    payload_json = json.dumps(payload)
    payload_b64 = base64.urlsafe_b64encode(payload_json.encode()).decode()

    # 签名
    signature = hmac.new(SECRET, payload_b64.encode(), hashlib.sha256).hexdigest()

    return f"{payload_b64}.{signature}"

def verify_token(token):
    """验证并解码令牌"""
    try:
        payload_b64, signature = token.split('.')

        # 验证签名
        expected = hmac.new(SECRET, payload_b64.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(signature, expected):
            return None, "Invalid signature"

        # 解码 payload
        payload_json = base64.urlsafe_b64decode(payload_b64).decode()
        payload = json.loads(payload_json)

        # 检查过期
        if payload['exp'] < time.time():
            return None, "Token expired"

        return payload['data'], None
    except Exception as e:
        return None, str(e)

# 使用
token = create_token({'user_id': 123, 'role': 'admin'})
print(f"Token: {token}")

data, error = verify_token(token)
if error:
    print(f"Error: {error}")
else:
    print(f"Data: {data}")
```

### 分块编码

```python
import base64

def encode_file_chunks(filepath, chunk_size=1024*1024):
    """分块编码文件"""
    chunks = []
    with open(filepath, 'rb') as f:
        while True:
            chunk = f.read(chunk_size)
            if not chunk:
                break
            encoded = base64.b64encode(chunk).decode('ascii')
            chunks.append(encoded)
    return chunks

def decode_chunks_to_file(chunks, output_path):
    """分块解码合并为文件"""
    with open(output_path, 'wb') as f:
        for chunk in chunks:
            data = base64.b64decode(chunk)
            f.write(data)

# 使用
# chunks = encode_file_chunks('large_file.zip')
# decode_chunks_to_file(chunks, 'restored.zip')
```

### 邮件附件

```python
import base64
import email.encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def create_email_with_attachment(to, subject, body, filepath):
    """创建带附件的邮件"""
    msg = MIMEMultipart()
    msg['To'] = to
    msg['Subject'] = subject

    # 添加正文
    msg.attach(MIMEText(body, 'plain'))

    # 添加附件
    with open(filepath, 'rb') as f:
        attachment = MIMEBase('application', 'octet-stream')
        attachment.set_payload(f.read())

    # Base64 编码
    email.encoders.encode_base64(attachment)

    filename = filepath.split('/')[-1]
    attachment.add_header(
        'Content-Disposition',
        f'attachment; filename="{filename}"'
    )
    msg.attach(attachment)

    return msg.as_string()

# 使用
# email_content = create_email_with_attachment(
#     'recipient@example.com',
#     'Test Email',
#     'Please see the attachment.',
#     'document.pdf'
# )
```

### 安全随机令牌

```python
import base64
import secrets

def generate_token(length=32):
    """生成安全随机令牌"""
    random_bytes = secrets.token_bytes(length)
    return base64.urlsafe_b64encode(random_bytes).decode('ascii').rstrip('=')

def generate_api_key():
    """生成 API 密钥"""
    return f"sk_{generate_token(24)}"

def generate_session_id():
    """生成会话 ID"""
    return generate_token(32)

# 使用
print(f"Token: {generate_token()}")
print(f"API Key: {generate_api_key()}")
print(f"Session ID: {generate_session_id()}")
```

## 性能对比

```python
import base64
import time

def benchmark():
    # 测试数据
    data = b"x" * 1000000  # 1MB

    # 测试 b64encode
    start = time.perf_counter()
    for _ in range(100):
        base64.b64encode(data)
    b64_time = time.perf_counter() - start

    # 测试 urlsafe_b64encode
    start = time.perf_counter()
    for _ in range(100):
        base64.urlsafe_b64encode(data)
    urlsafe_time = time.perf_counter() - start

    # 测试 b32encode
    start = time.perf_counter()
    for _ in range(100):
        base64.b32encode(data)
    b32_time = time.perf_counter() - start

    print(f"b64encode: {b64_time:.3f}s")
    print(f"urlsafe_b64encode: {urlsafe_time:.3f}s")
    print(f"b32encode: {b32_time:.3f}s")

# benchmark()
```

## 与 JavaScript 的主要差异

| 特性 | Python base64 | JavaScript |
|-----|--------------|------------|
| 输入类型 | bytes | string (ASCII) |
| 输出类型 | bytes | string |
| Unicode 支持 | 直接支持 | 需特殊处理 |
| URL 安全版 | `urlsafe_b64*` | 需手动实现 |
| 其他变体 | b32, b16, a85 | 需第三方库 |

## 总结

**标准 Base64**:
- `b64encode()`: 编码
- `b64decode()`: 解码
- 字符集: A-Z, a-z, 0-9, +, /

**URL 安全 Base64**:
- `urlsafe_b64encode()`: URL 安全编码
- `urlsafe_b64decode()`: URL 安全解码
- 用 - 替换 +，用 _ 替换 /

**其他变体**:
- `b32encode/b32decode`: Base32
- `b16encode/b16decode`: Base16 (十六进制)
- `a85encode/a85decode`: ASCII85

::: tip 最佳实践
- URL 参数使用 `urlsafe_b64encode`
- 编码 Unicode 先转为 UTF-8
- 处理二进制数据前先编码
- 安全令牌用 secrets 模块
:::

::: info 相关模块
- `secrets` - 安全随机数
- `hashlib` - 哈希算法
- `binascii` - 二进制与 ASCII 转换
:::

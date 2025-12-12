---
title: urllib - URL 处理
description: Python urllib 模块详解，URL 解析与请求发送
---

# urllib URL 处理

## 学习目标

- 理解 URL 解析和编码
- 掌握 HTTP 请求发送
- 学会 URL 构建
- 对比 JavaScript URL API 特性

## 概览

| Python urllib | JavaScript | 说明 |
|--------------|------------|------|
| `urllib.parse.urlparse()` | `new URL()` | 解析 URL |
| `urllib.parse.urlencode()` | `URLSearchParams` | 编码参数 |
| `urllib.parse.quote()` | `encodeURIComponent()` | URL 编码 |
| `urllib.request.urlopen()` | `fetch()` | 发送请求 |

urllib 包含多个子模块:
- `urllib.parse`: URL 解析和编码
- `urllib.request`: 发送 HTTP 请求
- `urllib.error`: 错误处理
- `urllib.robotparser`: robots.txt 解析

## urllib.parse - URL 解析

### 解析 URL

```python
from urllib.parse import urlparse, urlunparse

url = 'https://user:pass@example.com:8080/path/to/page?query=value&foo=bar#section'

# 解析 URL
result = urlparse(url)
print(result)
# ParseResult(scheme='https', netloc='user:pass@example.com:8080',
#             path='/path/to/page', params='', query='query=value&foo=bar',
#             fragment='section')

# 访问各个部分
print(f"协议: {result.scheme}")      # https
print(f"主机: {result.hostname}")     # example.com
print(f"端口: {result.port}")         # 8080
print(f"路径: {result.path}")         # /path/to/page
print(f"查询: {result.query}")        # query=value&foo=bar
print(f"锚点: {result.fragment}")     # section
print(f"用户名: {result.username}")   # user
print(f"密码: {result.password}")     # pass

# 重新组装 URL
new_url = urlunparse(result)
print(new_url)
```

```javascript
// JavaScript 对比
const url = new URL('https://user:pass@example.com:8080/path/to/page?query=value&foo=bar#section')

console.log(url.protocol)   // 'https:'
console.log(url.hostname)   // 'example.com'
console.log(url.port)       // '8080'
console.log(url.pathname)   // '/path/to/page'
console.log(url.search)     // '?query=value&foo=bar'
console.log(url.hash)       // '#section'
console.log(url.username)   // 'user'
console.log(url.password)   // 'pass'
```

### 处理查询参数

```python
from urllib.parse import parse_qs, parse_qsl, urlencode

query = 'name=Alice&age=30&hobby=reading&hobby=coding'

# parse_qs - 返回字典 (值为列表)
params = parse_qs(query)
print(params)
# {'name': ['Alice'], 'age': ['30'], 'hobby': ['reading', 'coding']}

# parse_qsl - 返回元组列表
params_list = parse_qsl(query)
print(params_list)
# [('name', 'Alice'), ('age', '30'), ('hobby', 'reading'), ('hobby', 'coding')]

# 编码查询参数
data = {'name': 'Bob', 'age': 25, 'city': '北京'}
encoded = urlencode(data)
print(encoded)  # name=Bob&age=25&city=%E5%8C%97%E4%BA%AC

# 列表值
data_list = {'tags': ['python', 'web', 'api']}
encoded = urlencode(data_list, doseq=True)
print(encoded)  # tags=python&tags=web&tags=api
```

```javascript
// JavaScript 对比
const params = new URLSearchParams('name=Alice&age=30&hobby=reading&hobby=coding')

console.log(params.get('name'))     // 'Alice'
console.log(params.getAll('hobby')) // ['reading', 'coding']

// 编码
const data = new URLSearchParams({ name: 'Bob', age: '25' })
console.log(data.toString())  // 'name=Bob&age=25'
```

### URL 编码解码

```python
from urllib.parse import quote, quote_plus, unquote, unquote_plus

# quote - URL 编码 (空格 -> %20)
text = "Hello World 你好"
encoded = quote(text)
print(encoded)  # Hello%20World%20%E4%BD%A0%E5%A5%BD

# quote_plus - 表单编码 (空格 -> +)
encoded_plus = quote_plus(text)
print(encoded_plus)  # Hello+World+%E4%BD%A0%E5%A5%BD

# 指定安全字符 (不编码)
path = "/path/to/resource"
print(quote(path))              # %2Fpath%2Fto%2Fresource
print(quote(path, safe='/'))    # /path/to/resource

# 解码
print(unquote(encoded))         # Hello World 你好
print(unquote_plus(encoded_plus))  # Hello World 你好
```

```javascript
// JavaScript 对比
const text = "Hello World 你好"

// encodeURIComponent - 类似 quote
console.log(encodeURIComponent(text))  // Hello%20World%20%E4%BD%A0%E5%A5%BD

// encodeURI - 保留 URL 特殊字符
console.log(encodeURI('https://example.com/path?q=你好'))

// 解码
console.log(decodeURIComponent('Hello%20World'))  // Hello World
```

### 构建 URL

```python
from urllib.parse import urljoin, urlunparse, urlencode

# urljoin - 合并 URL
base = 'https://example.com/path/page.html'
print(urljoin(base, 'other.html'))       # https://example.com/path/other.html
print(urljoin(base, '/absolute'))        # https://example.com/absolute
print(urljoin(base, '../sibling'))       # https://example.com/sibling
print(urljoin(base, '//other.com/path')) # https://other.com/path

# urlunparse - 从组件构建 URL
components = ('https', 'example.com', '/path', '', 'query=value', 'section')
url = urlunparse(components)
print(url)  # https://example.com/path?query=value#section

# 辅助函数构建带参数的 URL
def build_url(base, path, params=None):
    url = urljoin(base, path)
    if params:
        query = urlencode(params)
        url = f"{url}?{query}"
    return url

url = build_url('https://api.example.com', '/v1/users', {'page': 1, 'limit': 10})
print(url)  # https://api.example.com/v1/users?page=1&limit=10
```

```javascript
// JavaScript 对比
const base = new URL('https://example.com/path/page.html')
const other = new URL('other.html', base)
console.log(other.href)  // https://example.com/path/other.html
```

## urllib.request - HTTP 请求

### 基本请求

```python
from urllib.request import urlopen
from urllib.error import URLError, HTTPError

# GET 请求
try:
    with urlopen('https://httpbin.org/get', timeout=10) as response:
        # 响应信息
        print(f"状态: {response.status}")
        print(f"原因: {response.reason}")
        print(f"Headers: {response.headers}")

        # 读取响应体
        body = response.read()
        print(body.decode('utf-8'))
except HTTPError as e:
    print(f"HTTP Error: {e.code} - {e.reason}")
except URLError as e:
    print(f"URL Error: {e.reason}")
```

```javascript
// JavaScript 对比
fetch('https://httpbin.org/get')
    .then(response => {
        console.log(`状态: ${response.status}`)
        return response.json()
    })
    .then(data => console.log(data))
    .catch(error => console.error(error))
```

### POST 请求

```python
from urllib.request import urlopen, Request
from urllib.parse import urlencode
import json

# 表单数据 POST
data = {'name': 'Alice', 'age': 30}
encoded_data = urlencode(data).encode('utf-8')

with urlopen('https://httpbin.org/post', data=encoded_data) as response:
    result = json.loads(response.read())
    print(result['form'])  # {'name': 'Alice', 'age': '30'}

# JSON POST
json_data = json.dumps({'name': 'Alice', 'age': 30}).encode('utf-8')

req = Request(
    'https://httpbin.org/post',
    data=json_data,
    headers={'Content-Type': 'application/json'}
)

with urlopen(req) as response:
    result = json.loads(response.read())
    print(result['json'])  # {'name': 'Alice', 'age': 30}
```

```javascript
// JavaScript 对比
// 表单数据
fetch('https://httpbin.org/post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ name: 'Alice', age: '30' })
})

// JSON
fetch('https://httpbin.org/post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Alice', age: 30 })
})
```

### 自定义请求头

```python
from urllib.request import Request, urlopen

url = 'https://httpbin.org/headers'

# 方式 1: 使用 Request 对象
req = Request(url)
req.add_header('User-Agent', 'MyApp/1.0')
req.add_header('Accept', 'application/json')
req.add_header('Authorization', 'Bearer token123')

with urlopen(req) as response:
    print(response.read().decode())

# 方式 2: 初始化时传入
headers = {
    'User-Agent': 'MyApp/1.0',
    'Accept': 'application/json',
    'X-Custom-Header': 'custom-value'
}

req = Request(url, headers=headers)
with urlopen(req) as response:
    print(response.read().decode())
```

### 其他 HTTP 方法

```python
from urllib.request import Request, urlopen

# PUT 请求
req = Request(
    'https://httpbin.org/put',
    data=b'{"key": "value"}',
    headers={'Content-Type': 'application/json'},
    method='PUT'
)

with urlopen(req) as response:
    print(response.read().decode())

# DELETE 请求
req = Request('https://httpbin.org/delete', method='DELETE')

with urlopen(req) as response:
    print(response.read().decode())

# PATCH 请求
req = Request(
    'https://httpbin.org/patch',
    data=b'{"field": "new_value"}',
    headers={'Content-Type': 'application/json'},
    method='PATCH'
)

with urlopen(req) as response:
    print(response.read().decode())
```

### 处理响应

```python
from urllib.request import urlopen
import json

with urlopen('https://httpbin.org/json') as response:
    # 响应信息
    print(f"状态: {response.status} {response.reason}")
    print(f"URL: {response.url}")

    # 响应头
    print(f"Content-Type: {response.headers['Content-Type']}")
    print(f"所有头: {dict(response.headers)}")

    # 读取内容
    # 1. 一次性读取
    body = response.read()

    # 2. 分块读取
    # chunk = response.read(1024)

    # 3. 按行读取
    # for line in response:
    #     print(line)

    # 解析 JSON
    data = json.loads(body)
    print(data)
```

## 高级用法

### 处理重定向

```python
from urllib.request import urlopen, Request, HTTPRedirectHandler, build_opener

# 默认会自动跟随重定向
with urlopen('https://httpbin.org/redirect/2') as response:
    print(f"最终 URL: {response.url}")

# 禁用重定向
class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None

opener = build_opener(NoRedirect())
try:
    response = opener.open('https://httpbin.org/redirect/1')
except Exception as e:
    print(f"重定向被阻止: {e}")
```

### 处理 Cookie

```python
from urllib.request import urlopen, build_opener, HTTPCookieProcessor
from http.cookiejar import CookieJar

# 创建 cookie 容器
cookie_jar = CookieJar()
opener = build_opener(HTTPCookieProcessor(cookie_jar))

# 发送请求设置 cookie
response = opener.open('https://httpbin.org/cookies/set?name=value')

# 查看 cookies
for cookie in cookie_jar:
    print(f"{cookie.name} = {cookie.value}")

# 后续请求会自动携带 cookie
response = opener.open('https://httpbin.org/cookies')
print(response.read().decode())
```

### 基本认证

```python
from urllib.request import urlopen, Request, HTTPBasicAuthHandler, build_opener
from urllib.error import HTTPError
import base64

# 方式 1: 手动设置 Authorization 头
username = 'user'
password = 'passwd'
credentials = base64.b64encode(f'{username}:{password}'.encode()).decode()

req = Request('https://httpbin.org/basic-auth/user/passwd')
req.add_header('Authorization', f'Basic {credentials}')

with urlopen(req) as response:
    print(response.read().decode())

# 方式 2: 使用 HTTPBasicAuthHandler
from urllib.request import HTTPPasswordMgrWithDefaultRealm

password_mgr = HTTPPasswordMgrWithDefaultRealm()
password_mgr.add_password(None, 'https://httpbin.org', 'user', 'passwd')

auth_handler = HTTPBasicAuthHandler(password_mgr)
opener = build_opener(auth_handler)

response = opener.open('https://httpbin.org/basic-auth/user/passwd')
print(response.read().decode())
```

### 使用代理

```python
from urllib.request import ProxyHandler, build_opener

# 代理配置
proxies = {
    'http': 'http://proxy.example.com:8080',
    'https': 'http://proxy.example.com:8080'
}

proxy_handler = ProxyHandler(proxies)
opener = build_opener(proxy_handler)

response = opener.open('https://httpbin.org/ip')
print(response.read().decode())

# 设置为全局
# install_opener(opener)
```

### 文件下载

```python
from urllib.request import urlretrieve, urlopen
import shutil

# 方式 1: urlretrieve
def download_progress(block_num, block_size, total_size):
    downloaded = block_num * block_size
    percent = min(100, downloaded * 100 / total_size)
    print(f"\r下载进度: {percent:.1f}%", end='')

urlretrieve(
    'https://example.com/file.zip',
    'downloaded_file.zip',
    reporthook=download_progress
)

# 方式 2: 流式下载
with urlopen('https://example.com/file.zip') as response:
    with open('downloaded_file.zip', 'wb') as f:
        shutil.copyfileobj(response, f)
```

## 实际应用

### HTTP 客户端封装

```python
from urllib.request import Request, urlopen
from urllib.parse import urlencode, urljoin
from urllib.error import HTTPError, URLError
import json

class HTTPClient:
    def __init__(self, base_url, headers=None, timeout=30):
        self.base_url = base_url
        self.headers = headers or {}
        self.timeout = timeout

    def _request(self, method, path, data=None, params=None, json_data=None):
        url = urljoin(self.base_url, path)

        # 添加查询参数
        if params:
            url = f"{url}?{urlencode(params)}"

        # 准备请求体
        body = None
        headers = self.headers.copy()

        if json_data is not None:
            body = json.dumps(json_data).encode('utf-8')
            headers['Content-Type'] = 'application/json'
        elif data is not None:
            body = urlencode(data).encode('utf-8')
            headers['Content-Type'] = 'application/x-www-form-urlencoded'

        req = Request(url, data=body, headers=headers, method=method)

        try:
            with urlopen(req, timeout=self.timeout) as response:
                content = response.read().decode('utf-8')
                return {
                    'status': response.status,
                    'headers': dict(response.headers),
                    'body': json.loads(content) if content else None
                }
        except HTTPError as e:
            return {
                'status': e.code,
                'headers': dict(e.headers),
                'body': e.read().decode('utf-8')
            }

    def get(self, path, params=None):
        return self._request('GET', path, params=params)

    def post(self, path, data=None, json_data=None):
        return self._request('POST', path, data=data, json_data=json_data)

    def put(self, path, json_data=None):
        return self._request('PUT', path, json_data=json_data)

    def delete(self, path):
        return self._request('DELETE', path)

# 使用
client = HTTPClient(
    'https://httpbin.org',
    headers={'User-Agent': 'MyApp/1.0'}
)

# GET
response = client.get('/get', params={'page': 1})
print(response['status'], response['body'])

# POST JSON
response = client.post('/post', json_data={'name': 'Alice'})
print(response['body'])
```

### URL 构建器

```python
from urllib.parse import urljoin, urlencode, urlparse, urlunparse

class URLBuilder:
    def __init__(self, base_url):
        self.parsed = urlparse(base_url)
        self.path_parts = [self.parsed.path.rstrip('/')]
        self.params = {}

    def path(self, *parts):
        """添加路径"""
        for part in parts:
            self.path_parts.append(str(part).strip('/'))
        return self

    def query(self, **kwargs):
        """添加查询参数"""
        self.params.update(kwargs)
        return self

    def build(self):
        """构建最终 URL"""
        path = '/'.join(self.path_parts)
        query = urlencode(self.params) if self.params else ''

        return urlunparse((
            self.parsed.scheme,
            self.parsed.netloc,
            path,
            '',
            query,
            ''
        ))

# 使用
url = (URLBuilder('https://api.example.com')
    .path('v1', 'users', 123)
    .query(include='profile', fields='name,email')
    .build())

print(url)
# https://api.example.com/v1/users/123?include=profile&fields=name%2Cemail
```

### 请求重试

```python
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError
import time

def fetch_with_retry(url, max_retries=3, delay=1, backoff=2):
    """带重试机制的请求"""
    last_error = None

    for attempt in range(max_retries):
        try:
            with urlopen(url, timeout=10) as response:
                return response.read()
        except (URLError, HTTPError) as e:
            last_error = e
            if attempt < max_retries - 1:
                sleep_time = delay * (backoff ** attempt)
                print(f"请求失败，{sleep_time}秒后重试... ({attempt + 1}/{max_retries})")
                time.sleep(sleep_time)

    raise last_error

# 使用
try:
    content = fetch_with_retry('https://httpbin.org/get')
    print(content.decode())
except Exception as e:
    print(f"最终失败: {e}")
```

## 与 JavaScript 的主要差异

| 特性 | Python urllib | JavaScript |
|-----|--------------|------------|
| URL 解析 | `urlparse()` | `new URL()` |
| 查询参数 | `parse_qs()`, `urlencode()` | `URLSearchParams` |
| URL 编码 | `quote()`, `quote_plus()` | `encodeURIComponent()` |
| HTTP 请求 | `urlopen()` 同步 | `fetch()` 异步 |
| 错误处理 | 异常 | Promise reject |

## 总结

**urllib.parse**:
- `urlparse()`: 解析 URL
- `urlencode()`: 编码参数
- `quote()/unquote()`: URL 编解码
- `urljoin()`: 合并 URL

**urllib.request**:
- `urlopen()`: 发送请求
- `Request`: 自定义请求对象
- `build_opener()`: 自定义处理器

**urllib.error**:
- `HTTPError`: HTTP 错误
- `URLError`: URL/网络错误

::: tip 最佳实践
- 简单请求用 urllib
- 复杂场景推荐 requests 库
- 注意超时设置和错误处理
- 使用 URL 构建工具避免手动拼接
:::

::: info 相关模块
- `requests` - 更友好的 HTTP 库
- `http.client` - 低级 HTTP 客户端
:::

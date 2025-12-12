---
title: http.server - HTTP 服务器
description: Python http.server 模块详解，快速搭建 HTTP 服务器
---

# http.server HTTP 服务器

## 学习目标

- 理解内置 HTTP 服务器的使用
- 掌握自定义请求处理器
- 学会静态文件服务
- 对比 Node.js http 模块特性

## 概览

| Python http.server | Node.js | 说明 |
|-------------------|---------|------|
| `HTTPServer` | `http.createServer()` | 创建服务器 |
| `SimpleHTTPRequestHandler` | 需手动实现 | 静态文件服务 |
| `BaseHTTPRequestHandler` | 回调参数 | 请求基类 |
| `serve_forever()` | `server.listen()` | 启动服务 |

## 快速启动

### 命令行启动

```bash
# 最简单的启动静态文件服务器 (默认端口 8000)
python -m http.server

# 指定端口
python -m http.server 8080

# 指定绑定地址
python -m http.server 8080 --bind 127.0.0.1

# 指定目录
python -m http.server 8080 --directory /path/to/dir
```

```javascript
// Node.js 等效 serve 包
npx serve .
// 使用 http-server
npx http-server
```

### 代码启动

```python
from http.server import HTTPServer, SimpleHTTPRequestHandler

# 创建服务器
server = HTTPServer(('localhost', 8000), SimpleHTTPRequestHandler)

print("服务器已启动: http://localhost:8000")

# 启动服务 (阻塞)
server.serve_forever()
```

```javascript
// Node.js 对比
const http = require('http')
const fs = require('fs')
const path = require('path')

const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url)
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404)
            res.end('Not Found')
        } else {
            res.writeHead(200)
            res.end(data)
        }
    })
})

server.listen(8000, () => console.log('服务器已启动: http://localhost:8000'))
```

## 自定义处理器

### BaseHTTPRequestHandler

```python
from http.server import HTTPServer, BaseHTTPRequestHandler
import json

class MyHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        """处理 GET 请求"""
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write(b'<h1>Hello World!</h1>')

        elif self.path == '/api/status':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            data = {'status': 'ok', 'message': 'Server is running'}
            self.wfile.write(json.dumps(data).encode())

        else:
            self.send_error(404, 'Not Found')

    def do_POST(self):
        """处理 POST 请求"""
        if self.path == '/api/echo':
            # 获取请求体长度
            content_length = int(self.headers.get('Content-Length', 0))

            # 读取请求体
            body = self.rfile.read(content_length)

            # 发送响应
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()

            response = {
                'received': body.decode(),
                'length': content_length
            }
            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_error(404, 'Not Found')

# 启动服务器
server = HTTPServer(('localhost', 8000), MyHandler)
print("服务器已启动: http://localhost:8000")
server.serve_forever()
```

```javascript
// Node.js 对比
const http = require('http')

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        res.end('<h1>Hello World!</h1>')
    } else if (req.method === 'GET' && req.url === '/api/status') {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ status: 'ok' }))
    } else if (req.method === 'POST' && req.url === '/api/echo') {
        let body = ''
        req.on('data', chunk => body += chunk)
        req.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ received: body }))
        })
    } else {
        res.writeHead(404)
        res.end('Not Found')
    }
})

server.listen(8000)
```

### 解析请求

```python
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json

class RequestHandler(BaseHTTPRequestHandler):

    def parse_request_data(self):
        """解析请求数据"""
        # 解析 URL
        parsed = urlparse(self.path)
        query_params = parse_qs(parsed.query)

        # 获取请求头
        content_type = self.headers.get('Content-Type', '')
        content_length = int(self.headers.get('Content-Length', 0))

        # 解析请求体
        body = None
        if content_length > 0:
            raw_body = self.rfile.read(content_length)

            if 'application/json' in content_type:
                body = json.loads(raw_body.decode())
            elif 'application/x-www-form-urlencoded' in content_type:
                body = parse_qs(raw_body.decode())
            else:
                body = raw_body

        return {
            'method': self.command,
            'path': parsed.path,
            'query': query_params,
            'headers': dict(self.headers),
            'body': body
        }

    def do_POST(self):
        request_data = self.parse_request_data()

        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()

        # 返回解析结果
        response = {
            'parsed_request': request_data
        }
        self.wfile.write(json.dumps(response, indent=2).encode())

    def do_GET(self):
        request_data = self.parse_request_data()

        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()

        self.wfile.write(json.dumps(request_data, indent=2).encode())
```

### 自定义日志

```python
from http.server import HTTPServer, SimpleHTTPRequestHandler

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        """禁用默认日志"""
        pass

# 自定义日志
class CustomLogHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        print(f"[{self.log_date_time_string()}] {args[0]}")

server = HTTPServer(('localhost', 8000), QuietHandler)
server.serve_forever()
```

## 静态文件服务

### SimpleHTTPRequestHandler

```python
from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

class CustomStaticHandler(SimpleHTTPRequestHandler):
    """自定义静态文件处理器"""

    # 设置静态文件目录
    def __init__(self, *args, directory=None, **kwargs):
        self.directory = directory or os.getcwd()
        super().__init__(*args, directory=self.directory, **kwargs)

    # 自定义 MIME 类型
    extensions_map = {
        '': 'application/octet-stream',
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
    }

    def end_headers(self):
        # 添加 CORS 头
        self.send_header('Access-Control-Allow-Origin', '*')
        # 禁用缓存 (开发环境)
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

# 启动
server = HTTPServer(('localhost', 8000), CustomStaticHandler)
print("静态文件服务器已启动: http://localhost:8000")
server.serve_forever()
```

### 支持 SPA 路由

```python
from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

class SPAHandler(SimpleHTTPRequestHandler):
    """支持 SPA 的静态文件处理器"""

    def do_GET(self):
        # 获取请求路径
        path = self.translate_path(self.path)

        # 如果文件存在则返回文件
        if os.path.exists(path) and os.path.isfile(path):
            return super().do_GET()

        # 如果是目录则检查 index.html
        if os.path.isdir(path):
            index_path = os.path.join(path, 'index.html')
            if os.path.exists(index_path):
                return super().do_GET()

        # 其他情况返回根目录的 index.html (SPA fallback)
        self.path = '/index.html'
        return super().do_GET()

server = HTTPServer(('localhost', 8000), SPAHandler)
print("SPA 服务器已启动: http://localhost:8000")
server.serve_forever()
```

## 实际应用

### RESTful API 服务器

```python
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json
import re

class RESTHandler(BaseHTTPRequestHandler):
    """简单的 REST API 处理器"""

    # 模拟数据库
    users = {
        1: {'id': 1, 'name': 'Alice', 'email': 'alice@example.com'},
        2: {'id': 2, 'name': 'Bob', 'email': 'bob@example.com'},
    }
    next_id = 3

    def send_json(self, data, status=200):
        """发送 JSON 响应"""
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def read_json(self):
        """读取 JSON 请求体"""
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length == 0:
            return {}
        body = self.rfile.read(content_length)
        return json.loads(body.decode())

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        # GET /api/users - 获取所有用户
        if path == '/api/users':
            self.send_json(list(self.users.values()))

        # GET /api/users/{id} - 获取单个用户
        elif match := re.match(r'/api/users/(\d+)', path):
            user_id = int(match.group(1))
            if user_id in self.users:
                self.send_json(self.users[user_id])
            else:
                self.send_json({'error': 'User not found'}, 404)

        else:
            self.send_json({'error': 'Not found'}, 404)

    def do_POST(self):
        if self.path == '/api/users':
            data = self.read_json()
            user = {
                'id': self.next_id,
                'name': data.get('name', ''),
                'email': data.get('email', '')
            }
            self.users[self.next_id] = user
            RESTHandler.next_id += 1
            self.send_json(user, 201)
        else:
            self.send_json({'error': 'Not found'}, 404)

    def do_PUT(self):
        if match := re.match(r'/api/users/(\d+)', self.path):
            user_id = int(match.group(1))
            if user_id in self.users:
                data = self.read_json()
                self.users[user_id].update(data)
                self.send_json(self.users[user_id])
            else:
                self.send_json({'error': 'User not found'}, 404)
        else:
            self.send_json({'error': 'Not found'}, 404)

    def do_DELETE(self):
        if match := re.match(r'/api/users/(\d+)', self.path):
            user_id = int(match.group(1))
            if user_id in self.users:
                del self.users[user_id]
                self.send_json({'message': 'User deleted'})
            else:
                self.send_json({'error': 'User not found'}, 404)
        else:
            self.send_json({'error': 'Not found'}, 404)

    def do_OPTIONS(self):
        """处理预检请求"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

server = HTTPServer(('localhost', 8000), RESTHandler)
print("REST API 服务器已启动: http://localhost:8000")
print("端点: GET/POST /api/users, GET/PUT/DELETE /api/users/{id}")
server.serve_forever()
```

### 文件上传服务器

```python
from http.server import HTTPServer, BaseHTTPRequestHandler
import cgi
import os

UPLOAD_DIR = './uploads'

class UploadHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()

            html = '''
            <!DOCTYPE html>
            <html>
            <head><title>文件上传</title></head>
            <body>
                <h1>文件上传</h1>
                <form method="POST" enctype="multipart/form-data">
                    <input type="file" name="file" required>
                    <button type="submit">上传</button>
                </form>
            </body>
            </html>
            '''
            self.wfile.write(html.encode())
        else:
            self.send_error(404)

    def do_POST(self):
        if self.path == '/':
            # 解析 multipart 数据
            content_type = self.headers['Content-Type']
            ctype, pdict = cgi.parse_header(content_type)

            if ctype == 'multipart/form-data':
                pdict['boundary'] = pdict['boundary'].encode()
                form = cgi.FieldStorage(
                    fp=self.rfile,
                    headers=self.headers,
                    environ={'REQUEST_METHOD': 'POST'}
                )

                # 获取上传的文件
                if 'file' in form:
                    file_item = form['file']
                    if file_item.filename:
                        # 确保目录存在
                        os.makedirs(UPLOAD_DIR, exist_ok=True)
                        filepath = os.path.join(UPLOAD_DIR, file_item.filename)

                        with open(filepath, 'wb') as f:
                            f.write(file_item.file.read())

                        self.send_response(200)
                        self.send_header('Content-Type', 'text/html; charset=utf-8')
                        self.end_headers()
                        self.wfile.write(f'<h1>上传成功: {file_item.filename}</h1>'.encode())
                        return

            self.send_error(400, 'Bad Request')
        else:
            self.send_error(404)

server = HTTPServer(('localhost', 8000), UploadHandler)
print("文件上传服务器已启动: http://localhost:8000")
server.serve_forever()
```

### 代理服务器

```python
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.request import urlopen, Request
from urllib.error import URLError

TARGET = 'http://httpbin.org'

class ProxyHandler(BaseHTTPRequestHandler):
    """简单代理服务器"""

    def proxy_request(self, method):
        # 构建目标 URL
        target_url = TARGET + self.path

        # 复制请求头
        headers = {k: v for k, v in self.headers.items()}
        headers['Host'] = TARGET.split('//')[1]

        # 获取请求体
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length) if content_length > 0 else None

        try:
            # 转发请求
            req = Request(target_url, data=body, headers=headers, method=method)
            with urlopen(req, timeout=30) as response:
                # 转发响应
                self.send_response(response.status)
                for key, value in response.headers.items():
                    if key.lower() not in ('transfer-encoding', 'connection'):
                        self.send_header(key, value)
                self.end_headers()
                self.wfile.write(response.read())
        except URLError as e:
            self.send_error(502, f'Bad Gateway: {e}')

    def do_GET(self):
        self.proxy_request('GET')

    def do_POST(self):
        self.proxy_request('POST')

    def do_PUT(self):
        self.proxy_request('PUT')

    def do_DELETE(self):
        self.proxy_request('DELETE')

server = HTTPServer(('localhost', 8000), ProxyHandler)
print(f"代理服务器已启动: http://localhost:8000 -> {TARGET}")
server.serve_forever()
```

### 多线程服务器

```python
from http.server import HTTPServer, SimpleHTTPRequestHandler
from socketserver import ThreadingMixIn

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    """多线程 HTTP 服务器"""
    daemon_threads = True

server = ThreadedHTTPServer(('localhost', 8000), SimpleHTTPRequestHandler)
print("多线程服务器已启动: http://localhost:8000")
server.serve_forever()
```

## 与 Node.js 的主要差异

| 特性 | Python http.server | Node.js http |
|-----|-------------------|--------------|
| 使用场景 | 开发测试为主 | 生产环境也可 |
| 并发模型 | 单线程或多线程 | 事件驱动异步 |
| 静态文件 | 内置支持 | 需手动实现 |
| 中间件 | 需手动实现 | Express 等框架 |
| 性能 | 较低 | 较高 |

## 总结

**内置处理器**:
- `SimpleHTTPRequestHandler`: 静态文件服务
- `CGIHTTPRequestHandler`: CGI 脚本支持
- `BaseHTTPRequestHandler`: 自定义基类

**服务器配置**:
- `HTTPServer`: 基本 HTTP 服务器
- `ThreadingHTTPServer`: 多线程服务器

**请求属性**:
- `self.path`: 请求路径
- `self.headers`: 请求头
- `self.rfile`: 请求体流
- `self.wfile`: 响应体流

::: tip 最佳实践
- 仅用于开发调试环境
- 生产环境使用 WSGI 服务器 (Gunicorn, uWSGI)
- 使用 FastAPI/Flask 等框架
:::

::: info 相关模块
- `socketserver` - 套接字服务器框架
- `wsgiref` - WSGI 参考实现
- `flask` / `fastapi` - Web 框架
:::

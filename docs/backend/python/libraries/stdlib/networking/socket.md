---
title: socket - 网络套接字
description: Python socket 模块详解，实现网络通信
---

# socket 网络套接字

## 学习目标

- 理解 Socket 基本概念
- 掌握 TCP/UDP 编程
- 学会客户端和服务器开发
- 对比 Node.js net 模块特性

## 概览

| Python socket | Node.js | 说明 |
|--------------|---------|------|
| `socket()` | `net.Socket` | 创建套接字 |
| `bind()` | `server.listen()` | 绑定地址 |
| `listen()` | `server.listen()` | 开始监听 |
| `accept()` | `connection` 事件 | 接受连接 |
| `connect()` | `socket.connect()` | 连接服务器 |

## 基本概念

### 套接字类型

```python
import socket

# TCP 套接字 (SOCK_STREAM)
tcp_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# UDP 套接字 (SOCK_DGRAM)
udp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# IPv6 TCP
tcp6_socket = socket.socket(socket.AF_INET6, socket.SOCK_STREAM)

# Unix 域套接字
unix_socket = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
```

### 地址族

| 地址族 | 说明 |
|-------|------|
| `AF_INET` | IPv4 |
| `AF_INET6` | IPv6 |
| `AF_UNIX` | Unix 域套接字 |

### 套接字类型

| 类型 | 说明 |
|-----|------|
| `SOCK_STREAM` | TCP (可靠连接) |
| `SOCK_DGRAM` | UDP (无连接) |
| `SOCK_RAW` | 原始套接字 |

## TCP 编程

### TCP 服务器

```python
import socket

def tcp_server():
    # 创建套接字
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # 允许地址重用
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

    # 绑定地址和端口
    server.bind(('localhost', 8888))

    # 开始监听, 设置 backlog=5
    server.listen(5)
    print("服务器已启动, localhost:8888")

    while True:
        # 等待新的连接
        client, address = server.accept()
        print(f"新的连接: {address}")

        try:
            # 接收数据
            data = client.recv(1024)
            print(f"收到: {data.decode()}")

            # 发送响应
            response = f"服务器收到: {data.decode()}"
            client.send(response.encode())
        finally:
            client.close()

if __name__ == '__main__':
    tcp_server()
```

```javascript
// Node.js 对比
const net = require('net')

const server = net.createServer((socket) => {
    console.log('新的连接')

    socket.on('data', (data) => {
        console.log(`收到: ${data}`)
        socket.write(`服务器收到: ${data}`)
    })

    socket.on('end', () => {
        console.log('客户端断开')
    })
})

server.listen(8888, 'localhost', () => {
    console.log('服务器已启动, localhost:8888')
})
```

### TCP 客户端

```python
import socket

def tcp_client():
    # 创建套接字
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    try:
        # 连接服务器
        client.connect(('localhost', 8888))
        print("已连接到服务器")

        # 发送数据
        message = "Hello, Server!"
        client.send(message.encode())
        print(f"发送: {message}")

        # 接收响应
        response = client.recv(1024)
        print(f"收到: {response.decode()}")
    finally:
        client.close()

if __name__ == '__main__':
    tcp_client()
```

```javascript
// Node.js 对比
const net = require('net')

const client = net.createConnection({ port: 8888, host: 'localhost' }, () => {
    console.log('已连接到服务器')
    client.write('Hello, Server!')
})

client.on('data', (data) => {
    console.log(`收到: ${data}`)
    client.end()
})
```

### 多客户端服务器

```python
import socket
import threading

def handle_client(client, address):
    """处理单个客户端"""
    print(f"新连接: {address}")
    try:
        while True:
            data = client.recv(1024)
            if not data:
                break
            print(f"[{address}] 收到: {data.decode()}")
            client.send(f"Echo: {data.decode()}".encode())
    except ConnectionResetError:
        pass
    finally:
        print(f"连接关闭: {address}")
        client.close()

def multi_client_server():
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind(('localhost', 8888))
    server.listen(5)
    print("多客户端服务器已启动")

    try:
        while True:
            client, address = server.accept()
            # 为每个客户端创建线程
            thread = threading.Thread(
                target=handle_client,
                args=(client, address)
            )
            thread.daemon = True
            thread.start()
    except KeyboardInterrupt:
        print("\n服务器关闭")
    finally:
        server.close()

if __name__ == '__main__':
    multi_client_server()
```

## UDP 编程

### UDP 服务器

```python
import socket

def udp_server():
    # 创建 UDP 套接字
    server = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    server.bind(('localhost', 8889))
    print("UDP 服务器已启动, localhost:8889")

    while True:
        # 接收数据 (同时获取数据和客户端地址)
        data, address = server.recvfrom(1024)
        print(f"从 {address} 收到: {data.decode()}")

        # 发送响应
        response = f"服务器收到: {data.decode()}"
        server.sendto(response.encode(), address)

if __name__ == '__main__':
    udp_server()
```

```javascript
// Node.js 对比
const dgram = require('dgram')
const server = dgram.createSocket('udp4')

server.on('message', (msg, rinfo) => {
    console.log(`从 ${rinfo.address}:${rinfo.port} 收到: ${msg}`)
    server.send(`服务器收到: ${msg}`, rinfo.port, rinfo.address)
})

server.bind(8889, 'localhost', () => {
    console.log('UDP 服务器已启动')
})
```

### UDP 客户端

```python
import socket

def udp_client():
    # 创建 UDP 套接字
    client = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    server_address = ('localhost', 8889)

    try:
        # 发送数据
        message = "Hello, UDP Server!"
        client.sendto(message.encode(), server_address)
        print(f"发送: {message}")

        # 设置超时
        client.settimeout(5.0)

        # 接收响应
        data, address = client.recvfrom(1024)
        print(f"收到: {data.decode()}")
    except socket.timeout:
        print("接收超时")
    finally:
        client.close()

if __name__ == '__main__':
    udp_client()
```

## 高级用法

### 超时设置

```python
import socket

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# 设置连接超时
sock.settimeout(5.0)

try:
    sock.connect(('example.com', 80))
except socket.timeout:
    print("连接超时")

# 设置接收超时
sock.settimeout(10.0)

try:
    data = sock.recv(1024)
except socket.timeout:
    print("接收超时")

# 非阻塞模式
sock.setblocking(False)
# 等同于
sock.settimeout(0.0)
```

### 套接字选项

```python
import socket

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# 地址重用 (避免 "Address already in use")
sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

# TCP_NODELAY (禁用 Nagle 算法)
sock.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)

# 接收缓冲区大小
sock.setsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF, 65536)

# 发送缓冲区大小
sock.setsockopt(socket.SOL_SOCKET, socket.SO_SNDBUF, 65536)

# 保活连接
sock.setsockopt(socket.SOL_SOCKET, socket.SO_KEEPALIVE, 1)

# 获取选项值
rcvbuf = sock.getsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF)
print(f"接收缓冲区: {rcvbuf}")
```

### 获取主机信息

```python
import socket

# 获取主机名
hostname = socket.gethostname()
print(f"主机名: {hostname}")

# 获取主机名对应的 IP
ip = socket.gethostbyname(hostname)
print(f"IP: {ip}")

# 获取详细信息
info = socket.gethostbyname_ex(hostname)
print(f"主机信息: {info}")

# 获取地址信息 (支持 IPv6)
addrinfo = socket.getaddrinfo('google.com', 80, socket.AF_INET, socket.SOCK_STREAM)
for item in addrinfo:
    print(item)

# 根据 IP 反查主机名
try:
    hostname = socket.gethostbyaddr('8.8.8.8')
    print(f"反查: {hostname}")
except socket.herror:
    print("反查失败")
```

### 使用上下文管理器

```python
import socket

# Python 3.2+ 支持上下文管理器
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
    sock.connect(('example.com', 80))
    sock.send(b'GET / HTTP/1.1\r\nHost: example.com\r\n\r\n')
    response = sock.recv(4096)
    print(response.decode())
# 自动关闭套接字

# 服务器端
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind(('localhost', 8888))
    server.listen(5)

    with server.accept()[0] as client:
        data = client.recv(1024)
        client.send(data)
```

## 实际应用

### 简单 HTTP 服务器

```python
import socket

def simple_http_server():
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind(('localhost', 8080))
    server.listen(5)
    print("HTTP 服务器已启动: http://localhost:8080")

    while True:
        client, address = server.accept()

        try:
            # 接收请求
            request = client.recv(1024).decode()
            print(f"请求:\n{request[:200]}")

            # 解析请求行
            request_line = request.split('\r\n')[0]
            method, path, _ = request_line.split(' ')

            # 构建响应
            body = f"<html><body><h1>Hello!</h1><p>Path: {path}</p></body></html>"
            response = (
                "HTTP/1.1 200 OK\r\n"
                "Content-Type: text/html; charset=utf-8\r\n"
                f"Content-Length: {len(body.encode())}\r\n"
                "Connection: close\r\n"
                "\r\n"
                f"{body}"
            )

            client.send(response.encode())
        finally:
            client.close()

if __name__ == '__main__':
    simple_http_server()
```

### 端口扫描器

```python
import socket
import concurrent.futures

def scan_port(host, port, timeout=1):
    """扫描单个端口"""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        result = sock.connect_ex((host, port))
        sock.close()
        return port if result == 0 else None
    except:
        return None

def port_scanner(host, start_port=1, end_port=1024, workers=100):
    """并行端口扫描"""
    open_ports = []

    with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as executor:
        futures = {
            executor.submit(scan_port, host, port): port
            for port in range(start_port, end_port + 1)
        }

        for future in concurrent.futures.as_completed(futures):
            result = future.result()
            if result:
                open_ports.append(result)
                print(f"端口 {result} 开放")

    return sorted(open_ports)

# 使用
if __name__ == '__main__':
    host = 'localhost'
    print(f"扫描 {host}...")
    open_ports = port_scanner(host, 1, 1000)
    print(f"开放端口: {open_ports}")
```

### 聊天服务器

```python
import socket
import threading
import json

class ChatServer:
    def __init__(self, host='localhost', port=8888):
        self.host = host
        self.port = port
        self.clients = {}  # {socket: username}
        self.lock = threading.Lock()

    def broadcast(self, message, exclude=None):
        """广播消息给所有客户端"""
        with self.lock:
            for client in self.clients:
                if client != exclude:
                    try:
                        client.send(message.encode())
                    except:
                        pass

    def handle_client(self, client, address):
        """处理单个客户端"""
        username = None
        try:
            # 接收用户名
            data = client.recv(1024).decode()
            msg = json.loads(data)
            username = msg.get('username', str(address))

            with self.lock:
                self.clients[client] = username

            print(f"{username} 加入聊天")
            self.broadcast(f"[系统] {username} 加入聊天室")

            while True:
                data = client.recv(1024)
                if not data:
                    break

                msg = json.loads(data.decode())
                content = msg.get('content', '')
                self.broadcast(f"[{username}] {content}", exclude=client)

        except (json.JSONDecodeError, ConnectionResetError):
            pass
        finally:
            with self.lock:
                if client in self.clients:
                    del self.clients[client]

            if username:
                print(f"{username} 离开聊天")
                self.broadcast(f"[系统] {username} 离开聊天室")

            client.close()

    def start(self):
        """启动服务器"""
        server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        server.bind((self.host, self.port))
        server.listen(5)

        print(f"聊天服务器已启动: {self.host}:{self.port}")

        try:
            while True:
                client, address = server.accept()
                thread = threading.Thread(
                    target=self.handle_client,
                    args=(client, address)
                )
                thread.daemon = True
                thread.start()
        except KeyboardInterrupt:
            print("\n服务器关闭")
        finally:
            server.close()

if __name__ == '__main__':
    ChatServer().start()
```

### 文件传输

```python
import socket
import os

def send_file(filepath, host, port):
    """发送文件"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.connect((host, port))

        # 发送文件信息
        filename = os.path.basename(filepath)
        filesize = os.path.getsize(filepath)
        header = f"{filename}|{filesize}".encode()
        sock.send(header)

        # 等待确认
        sock.recv(1024)

        # 发送文件内容
        with open(filepath, 'rb') as f:
            while True:
                data = f.read(4096)
                if not data:
                    break
                sock.send(data)

        print(f"文件已发送: {filename}")

def receive_file(save_dir, port):
    """接收文件"""
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind(('localhost', port))
    server.listen(1)

    print(f"等待文件传输连接: {port}")

    client, address = server.accept()
    print(f"连接来自: {address}")

    try:
        # 接收文件信息
        header = client.recv(1024).decode()
        filename, filesize = header.split('|')
        filesize = int(filesize)

        # 发送确认
        client.send(b'OK')

        # 接收文件内容
        filepath = os.path.join(save_dir, filename)
        received = 0

        with open(filepath, 'wb') as f:
            while received < filesize:
                data = client.recv(min(4096, filesize - received))
                if not data:
                    break
                f.write(data)
                received += len(data)
                print(f"\r接收进度: {received}/{filesize}", end='')

        print(f"\n文件已接收: {filepath}")
    finally:
        client.close()
        server.close()
```

## 与 Node.js 的主要差异

| 特性 | Python socket | Node.js net |
|-----|--------------|-------------|
| 模型 | 同步阻塞 | 异步事件驱动 |
| 并行处理 | 多线程 | 事件循环回调 |
| 资源管理 | `with` 语句 | 手动或回调 |
| 错误处理 | 异常 | 事件/Promise |

## 总结

**基本操作**:
- `socket()`: 创建套接字
- `bind()`: 绑定地址
- `listen()`: 开始监听
- `accept()`: 接受连接
- `connect()`: 连接服务器

**数据传输**:
- `send()/sendall()`: 发送数据
- `recv()`: 接收数据
- `sendto()/recvfrom()`: UDP 发送接收

**选项设置**:
- `setsockopt()`: 设置选项
- `settimeout()`: 设置超时
- `setblocking()`: 设置阻塞模式

::: tip 最佳实践
- 使用 `with` 管理套接字
- 设置 `SO_REUSEADDR` 避免地址占用
- 多客户端使用多线程处理
- 高性能场景用 asyncio 框架
:::

::: info 相关模块
- `asyncio` - 异步 IO
- `http.server` - HTTP 服务器
- `socketserver` - 套接字服务器框架
:::

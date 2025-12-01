---
title: 常用库介绍
description: Python 生态中前端开发者常用的库
---

# 常用库介绍

Python 拥有丰富的第三方库生态系统，本章介绍前端开发者最常用的几类库。

## 本章内容

| 类别      | Python 库       | 对应 JS 库   |
| --------- | --------------- | ------------ |
| HTTP 请求 | requests, httpx | fetch, axios |
| 数据处理  | pandas, json    | lodash, JSON |
| Web 框架  | FastAPI, Flask  | Express, Koa |
| 测试工具  | pytest          | Jest, Vitest |

## 学习路径

```mermaid
graph LR
    A[HTTP 请求] --> B[数据处理]
    B --> C[Web 框架]
    C --> D[测试工具]
```

## 快速导航

- [HTTP 请求库](./http.md) - requests 和 httpx
- [数据处理库](./data.md) - pandas 和 json
- [Web 框架](./web-frameworks.md) - FastAPI 和 Flask
- [测试工具](./testing.md) - pytest

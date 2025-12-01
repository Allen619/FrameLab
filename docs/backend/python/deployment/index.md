---
title: 部署指南
description: Python 应用部署方式概述
---

# 部署指南

本章介绍 Python 应用的常见部署方式，帮助前端开发者将 Python 项目上线。

## 部署方式对比

| 方式   | 适用场景           | 难度 | 对应前端 |
| ------ | ------------------ | ---- | -------- |
| Docker | 通用、可移植       | 中   | Docker   |
| 云平台 | 快速部署、自动扩展 | 低   | Vercel   |
| 虚拟机 | 完全控制           | 高   | -        |

## 部署流程

```mermaid
graph LR
    A[本地开发] --> B[测试]
    B --> C[构建镜像/打包]
    C --> D[部署上线]
    D --> E[监控运维]
```

## 快速导航

- [Docker 部署](./docker.md) - 容器化部署
- [云平台部署](./cloud.md) - Railway, Fly.io, Render
- [依赖管理](./dependencies.md) - 虚拟环境和 Poetry

## 前端部署经验迁移

| 前端概念         | Python 对应            |
| ---------------- | ---------------------- |
| `npm install`    | `poetry install`       |
| `npm run build`  | 无需构建（解释型语言） |
| `node server.js` | `uvicorn main:app`     |
| `package.json`   | `pyproject.toml`       |
| `node_modules/`  | `.venv/`               |
| `Dockerfile`     | 相同                   |

## 选择建议

```mermaid
graph TD
    A[选择部署方式] --> B{项目类型?}
    B -->|API 服务| C[Railway / Fly.io]
    B -->|Web 应用| D[Docker + 云服务]
    B -->|脚本/定时任务| E[GitHub Actions]
    B -->|需要完全控制| F[VPS + Docker]
```

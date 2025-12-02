<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

﻿# docs-site Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-11-26

## Active Technologies

- TypeScript (VitePress 配置), Markdown (文档内容) + VitePress ^1.6.4, vitepress-plugin-mermaid ^2.0.17, mermaid ^11.12.1 (001-docs-site-setup)
- 静态文件系统 (001-docs-site-setup)

- [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION] + [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION] (001-docs-site-setup)

## Project Structure

```text
backend/
frontend/
tests/
```

## Commands

cd src; pytest; ruff check .

## Code Style

[e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION]: Follow standard conventions

## Recent Changes

- 001-docs-site-setup: Added TypeScript (VitePress 配置), Markdown (文档内容) + VitePress ^1.6.4, vitepress-plugin-mermaid ^2.0.17, mermaid ^11.12.1

- 001-docs-site-setup: Added [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION] + [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION]

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->

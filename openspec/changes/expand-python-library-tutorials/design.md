# Design: Expand Python Library Tutorials

## Context

当前 Python 教程面向前端开发者，采用 JS/TS 对比的教学方式。现有库教程结构扁平，仅有 6 个文档，无法满足实际开发需求。需要扩展为覆盖 40+ 个常用库的完整教程体系。

### 约束条件
- 保持现有教学风格（JS/TS 对比）
- 兼容 VitePress 侧边栏配置
- 文档结构需要清晰、可导航
- 单个文档不宜过长（建议 300-800 行）

## Goals / Non-Goals

### Goals
- 提供覆盖常用标准库和第三方库的完整教程
- 按功能分类组织，便于查找
- 每个库都有独立详细教程
- 保持前端视角的对比教学风格

### Non-Goals
- 不追求覆盖所有 Python 库（只选常用的）
- 不替代官方文档（聚焦实用场景）
- 不深入每个库的高级用法（保持入门友好）

## Decisions

### 1. 目录结构设计

**决定**: 采用两级分类结构

```
docs/backend/python/libraries/
├── index.md                    # 库教程总览
├── stdlib/                     # 标准库
│   ├── index.md               # 标准库概述
│   ├── file-system/           # 文件系统相关
│   │   ├── index.md
│   │   ├── os-sys.md
│   │   ├── pathlib.md
│   │   ├── shutil.md
│   │   └── subprocess.md
│   ├── text-data/             # 文本数据处理
│   │   ├── index.md
│   │   ├── re.md
│   │   ├── json.md
│   │   ├── csv.md
│   │   ├── string.md
│   │   └── pickle.md
│   ├── math-random/           # 数学随机
│   │   ├── index.md
│   │   ├── math.md
│   │   ├── random.md
│   │   ├── statistics.md
│   │   └── decimal.md
│   ├── datetime/              # 日期时间
│   │   ├── index.md
│   │   ├── datetime.md
│   │   ├── time.md
│   │   └── calendar.md
│   ├── collections/           # 数据结构
│   │   ├── index.md
│   │   ├── collections.md
│   │   ├── itertools.md
│   │   ├── functools.md
│   │   └── enum.md
│   ├── dev-tools/             # 开发工具
│   │   ├── index.md
│   │   ├── argparse.md
│   │   └── unittest.md
│   ├── concurrency/           # 并发编程
│   │   ├── index.md
│   │   ├── threading.md
│   │   ├── multiprocessing.md
│   │   └── concurrent-futures.md
│   ├── networking/            # 网络编程
│   │   ├── index.md
│   │   ├── urllib.md
│   │   ├── socket.md
│   │   └── http-server.md
│   ├── storage/               # 数据存储
│   │   ├── index.md
│   │   └── sqlite3.md
│   └── utilities/             # 工具函数
│       ├── index.md
│       ├── hashlib.md
│       ├── base64.md
│       ├── copy.md
│       └── contextlib.md
└── third-party/               # 第三方库
    ├── index.md
    ├── web/                   # Web 开发
    │   ├── index.md
    │   ├── fastapi.md
    │   ├── flask.md
    │   ├── django-overview.md
    │   └── pydantic.md
    ├── http/                  # HTTP 客户端
    │   ├── index.md
    │   ├── requests.md
    │   ├── httpx.md
    │   └── aiohttp.md
    ├── data/                  # 数据处理
    │   ├── index.md
    │   ├── pandas.md
    │   ├── numpy.md
    │   └── polars.md
    ├── database/              # 数据库
    │   ├── index.md
    │   ├── sqlalchemy.md
    │   ├── pymongo.md
    │   └── redis-py.md
    ├── testing/               # 测试
    │   ├── index.md
    │   ├── pytest.md
    │   ├── pytest-mock.md
    │   └── coverage.md
    ├── cli/                   # CLI 工具
    │   ├── index.md
    │   ├── click.md
    │   ├── typer.md
    │   └── rich.md
    └── config/                # 配置管理
        ├── index.md
        ├── python-dotenv.md
        ├── pyyaml.md
        └── toml.md
```

**替代方案**:
1. 扁平结构（所有文件在同一目录）- 文件过多，难以管理
2. 按字母排序 - 不利于学习路径
3. 只分标准库/第三方两级 - 分类不够细致

**理由**: 两级分类既保持结构清晰，又不过度嵌套，VitePress 侧边栏支持良好。

### 2. 文档模板设计

**决定**: 每个库文档遵循统一模板

```markdown
---
title: {库名} - {一句话描述}
description: Python {库名} 模块详解，与 Node.js {对应模块} 对比
---

# {库名}

## 学习目标
- 要点 1
- 要点 2
- 要点 3

## 概述
| Python | JavaScript | 说明 |
|--------|-----------|------|
| `xxx`  | `yyy`     | ...  |

## 核心 API

### API 1
```python
# Python 示例
```

```javascript
// JavaScript 对比
```

### API 2
...

## 实用示例

### 场景 1: {常见用例}
...

## 与 JS/TS 的关键差异
...

## 常见陷阱
...

## 小结
...
```

### 3. 侧边栏配置方案

**决定**: 使用 VitePress 嵌套分组功能

```typescript
{
  text: '常用库',
  collapsed: false,
  items: [
    { text: '概述', link: '/backend/python/libraries/' },
    {
      text: '标准库',
      collapsed: true,
      items: [
        { text: '概述', link: '/backend/python/libraries/stdlib/' },
        {
          text: '文件与系统',
          collapsed: true,
          items: [
            { text: 'os/sys', link: '/backend/python/libraries/stdlib/file-system/os-sys' },
            { text: 'pathlib', link: '/backend/python/libraries/stdlib/file-system/pathlib' },
            // ...
          ]
        },
        // 其他子分类...
      ]
    },
    {
      text: '第三方库',
      collapsed: true,
      items: [
        // ...
      ]
    }
  ]
}
```

### 4. 交叉引用策略

**决定**: 使用相对链接和提示框

- 相关内容使用 `[链接文字](../path/to/file.md)` 格式
- 前置知识使用 VitePress 的 tip 容器提示
- 进阶内容使用 info 容器推荐

```markdown
::: tip 前置知识
阅读本章前，建议先了解 [异步编程基础](../../advanced/async.md)
:::
```

## Risks / Trade-offs

### Risk 1: 内容量过大，难以维护
- **影响**: 40+ 文档的持续更新成本高
- **缓解**:
  - 使用模板保持一致性
  - 优先完成高优先级库
  - 建立贡献指南

### Risk 2: 侧边栏过深影响导航
- **影响**: 三级嵌套可能让用户迷失
- **缓解**:
  - 默认折叠低层级
  - 提供搜索功能
  - 每个 index.md 提供导航目录

### Risk 3: 与现有内容重复
- **影响**: `async.md`、`logging.md` 等已有相关内容
- **缓解**:
  - 使用引用而非重复
  - 明确区分"特性讲解"与"库 API 参考"

## Migration Plan

### Phase 1: 结构迁移（不删除原文件）
1. 创建新目录结构
2. 复制现有文件到新位置
3. 更新 VitePress 配置
4. 验证构建和导航

### Phase 2: 内容扩展
1. 按优先级编写新文档
2. 拆分合并文档（如 http.md → requests.md + httpx.md）
3. 添加交叉引用

### Phase 3: 清理
1. 删除旧位置的重复文件
2. 更新所有内部链接
3. 最终验证

### Rollback
- 保留原文件结构的 git 历史
- 如需回滚，恢复 config.mts 和文件结构即可

## Open Questions

1. **是否需要为每个库添加版本说明？**
   - 建议: 在文档头部注明适用的 Python 版本要求

2. **是否需要添加练习题？**
   - 建议: 可选，优先完成核心内容

3. **文档翻译需求？**
   - 当前仅中文，暂不考虑多语言

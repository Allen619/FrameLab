# Design: Learning Roadmap and Navigation Badges

## Architecture Overview

### 1. 学习路径页面设计

#### 页面结构
```
/backend/python/roadmap.md
├── 学习路径概览（Mermaid 流程图）
├── 阶段一：基础必学
├── 阶段二：工程化实践
├── 阶段三：应用开发
├── 阶段四：进阶专精
└── 场景化路径（按应用方向）
```

#### 优先级分类标准
| 级别 | 标准 | 示例 |
|------|------|------|
| P0 必学 | 日常开发必用 | json, pathlib, datetime, pytest |
| P1 重要 | 常见场景必备 | re, subprocess, requests, FastAPI |
| P2 进阶 | 特定场景需要 | threading, socket, pandas |
| P3 可选 | 了解即可 | pickle, calendar, statistics |

### 2. 导航栏标识系统

#### VitePress Sidebar Badge 实现
VitePress 原生支持在 sidebar item 的 text 字段中使用 emoji 或 HTML badge：

```typescript
// config.mts 示例
{
  text: '⭐ FastAPI',  // 推荐
  link: '/...'
},
{
  text: 'Flask',       // 普通
  link: '/...'
}
```

#### 标识规范
| 标识 | 含义 | 使用场景 |
|------|------|----------|
| ⭐ | 核心推荐 | 同类库中的首选 |
| 🔥 | 重点必学 | 高频使用的核心内容 |
| 📖 | 新手友好 | 适合入门的基础内容 |

#### 标识应用范围

**标准库 - 重点标识 🔥**
- pathlib（路径操作首选）
- json（数据格式标准）
- datetime（时间处理核心）
- collections（容器增强）
- re（正则必备）

**第三方库 - 推荐标识 ⭐**
- Web: FastAPI（现代首选）
- HTTP: httpx（同步异步兼容）
- 测试: pytest（事实标准）
- CLI: typer（现代推荐）
- ORM: SQLAlchemy（业界标准）

### 3. 同类库对比增强

在各分类 index.md 中添加"快速选择"表格：

```markdown
## 快速选择

| 场景 | 推荐 | 原因 |
|------|------|------|
| 新项目 API | FastAPI | 类型安全、自动文档 |
| 简单原型 | Flask | 轻量灵活 |
| 全栈应用 | Django | 功能完整 |
```

## Technical Decisions

### 为什么使用 Emoji 而非自定义图标？
1. **零配置**：VitePress 原生支持，无需额外 CSS/组件
2. **跨平台一致**：所有操作系统都能正确显示
3. **易于维护**：直接在 config.mts 中编辑

### 为什么创建独立路径页面而非仅靠标识？
1. **完整视图**：标识只能提供局部信息，路径页提供全局视角
2. **解释空间**：可以详细说明为什么某些内容重要
3. **可视化**：Mermaid 流程图比列表更直观

## File Changes

| 文件 | 变更类型 | 说明 |
|------|----------|------|
| `docs/backend/python/roadmap.md` | 新增 | 学习路径页面 |
| `docs/.vitepress/config.mts` | 修改 | 添加标识、新增路径页链接 |
| `docs/backend/python/libraries/third-party/*/index.md` | 修改 | 强化选择建议 |

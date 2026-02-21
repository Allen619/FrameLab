# Tasks: Add Learning Roadmap and Navigation Badges

## Phase 1: 学习路径页面

- [x] 1.1 创建 `roadmap.md` 学习路径页面
  - [x] 编写学习路径概览说明
  - [x] 创建 Mermaid 学习流程图
  - [x] 编写阶段一：基础必学内容
  - [x] 编写阶段二：工程化实践
  - [x] 编写阶段三：应用开发
  - [x] 编写阶段四：进阶专精
  - [x] 添加场景化学习路径（API开发、数据处理、CLI工具等）

- [x] 1.2 在导航中添加路径页入口
  - [x] 在 Python 侧边栏顶部添加"📍 学习路径"链接

## Phase 2: 导航栏标识系统

- [x] 2.1 标准库重点标识
  - [x] pathlib 🔥
  - [x] json 🔥
  - [x] datetime 🔥
  - [x] re 🔥
  - [x] collections 🔥
  - [x] subprocess 🔥

- [x] 2.2 第三方库推荐标识
  - [x] FastAPI ⭐（Web框架推荐）
  - [x] httpx ⭐（HTTP客户端推荐）
  - [x] pytest ⭐（测试框架推荐）
  - [x] typer ⭐（CLI工具推荐）
  - [x] SQLAlchemy ⭐（ORM推荐）
  - [x] Pydantic ⭐（数据验证推荐）
  - [x] pandas ⭐（数据处理推荐）
  - [x] python-dotenv ⭐（配置管理推荐）
  - [x] Poetry ⭐（包管理推荐）
  - [x] Ruff ⭐（代码检查推荐）

## Phase 3: 选择建议强化

- [x] 3.1 更新第三方库分类索引
  - [x] Web 框架 index.md - 添加快速选择表
  - [x] HTTP 客户端 index.md - 添加快速选择表
  - [x] 数据库 index.md - 添加快速选择表
  - [x] CLI 工具 index.md - 添加快速选择表
  - [x] 测试工具 index.md - 添加快速选择表

## Phase 4: 验证

- [x] 4.1 运行 VitePress 构建测试
- [x] 4.2 本地预览检查标识显示效果
- [x] 4.3 检查学习路径页面 Mermaid 图表渲染

## 依赖关系

- Phase 2 和 Phase 3 可以并行
- Phase 4 依赖前面所有阶段完成

## 优先级建议

**高优先级**：
- 1.1 学习路径页面（解决核心问题）
- 2.2 第三方库推荐标识（最常见的选择困惑）

**中优先级**：
- 2.1 标准库重点标识
- 3.1 选择建议强化

**低优先级**：
- 1.2 导航入口（简单配置）

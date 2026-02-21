## 1. 清理遗留文件

- [x] 1.1 删除已被 stdlib/third-party 结构替代的 4 个旧文件：`docs/backend/python/libraries/data.md`、`http.md`、`testing.md`、`web-frameworks.md`
- [x] 1.2 确认删除的文件在 sidebar 和其他文档中无引用

## 2. 填充空 index 文件

- [x] 2.1 填充 `docs/backend/python/libraries/stdlib/collections/index.md`（链接 counter、defaultdict、ordereddict）
- [x] 2.2 填充 `docs/backend/python/libraries/stdlib/concurrency/index.md`（链接 threading、multiprocessing、asyncio）
- [x] 2.3 填充 `docs/backend/python/libraries/stdlib/datetime/index.md`（链接 datetime、time、calendar 等）
- [x] 2.4 填充 `docs/backend/python/libraries/stdlib/dev-tools/index.md`（链接 logging、pdb 等）
- [x] 2.5 填充 `docs/backend/python/libraries/stdlib/math-random/index.md`（链接 math、random、statistics 等）
- [x] 2.6 填充 `docs/backend/python/libraries/stdlib/networking/index.md`（链接 socket、http、urllib 等）
- [x] 2.7 填充 `docs/backend/python/libraries/stdlib/storage/index.md`（链接 sqlite3 等）
- [x] 2.8 填充 `docs/backend/python/libraries/stdlib/utilities/index.md`（链接 itertools、functools、operator 等）

## 3. 收录孤儿页面到 sidebar

- [x] 3.1 评估 LangGraph 5 个孤儿页面（overview-deep-dive、getting-started、graph-api-basics、production、advanced-patterns），决定收录或合并
- [x] 3.2 将有价值的 LangGraph 孤儿页面添加到 `config.mts` sidebar
- [x] 3.3 将 `docs/ai/instructor/advanced.md` 添加到 Instructor sidebar 进阶指南分组
- [x] 3.4 将 `docs/backend/python/libraries/stdlib/text-data/dataclass.md` 添加到 Python 标准库 sidebar
- [x] 3.5 将 APScheduler 7 个子页面收录到 sidebar scheduling 子分组或从 `apscheduler.md` 页内链接

## 4. 添加外链标注 — AI 板块

- [x] 4.1 LangChain 核心页面添加外链标注（models、agents、tools、streaming、structured-output 等关键 API 概念处）
- [x] 4.2 LangGraph 核心页面添加外链标注（persistence、streaming、interrupts、memory 等核心概念处）
- [x] 4.3 LlamaIndex 核心页面添加外链标注（VectorStoreIndex、QueryEngine、Agent 等核心类处）
- [x] 4.4 Instructor 核心页面添加外链标注（Pydantic 模型、patch 方法等核心概念处）

## 5. 添加外链标注 — 后端板块

- [x] 5.1 Python 高级特性页面添加外链标注（decorators、generators、context-managers、async 中的核心 API）
- [x] 5.2 Python 标准库页面添加外链标注（pathlib、dataclass、typing 等重点模块的官方文档链接）
- [x] 5.3 Python 第三方库页面添加外链标注（FastAPI、SQLAlchemy、pytest 等框架的官方文档链接）

## 6. 添加外链标注 — 运维板块

- [x] 6.1 Kubernetes 核心页面添加外链标注（Pod、Service、Deployment 等核心资源的官方文档链接）

## 7. Playwright 验证 — 导航完整性

- [x] 7.1 启动 VitePress 开发服务器
- [x] 7.2 验证所有新收录页面的 sidebar 显示正确
- [x] 7.3 验证 8 个填充后的 index 页面渲染正确
- [x] 7.4 验证无死链（sidebar 中的每个链接都能正常跳转）

## 8. Playwright 验证 — 外链有效性

- [x] 8.1 收集所有新增的 `🔗` 外链 URL 列表
- [x] 8.2 逐一使用 Playwright 导航验证外链可达性（HTTP 2xx）
- [x] 8.3 修复所有不可达的外链

## 9. 最终验证

- [x] 9.1 运行 `npm run build` 确认构建无错误
- [x] 9.2 运行 `npm run lint` 确认无 lint 错误
- [x] 9.3 全站 Playwright 抽样验证：每个板块至少验证 2 个页面的渲染和中文显示

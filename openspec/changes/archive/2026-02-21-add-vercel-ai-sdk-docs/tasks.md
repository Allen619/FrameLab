## 1. 项目脚手架

- [x] 1.1 创建 `docs/ai/vercel-ai-sdk/` 目录和 `guide/` 子目录
- [x] 1.2 更新 `docs/.vitepress/config.mts`：nav AI 下拉菜单新增 Vercel AI SDK 入口
- [x] 1.3 更新 `docs/.vitepress/config.mts`：新增 sidebar 配置（6 个分组，28 个页面）
- [x] 1.4 更新 `docs/ai/index.md`：新增 hero action 按钮和 feature 卡片

## 2. 入门篇（4 页）

- [x] 2.1 编写 `guide/overview.md`：AI SDK 是什么、三层架构（Core/UI/Provider）、生态定位、与 LangChain 等的关系
- [x] 2.2 编写 `guide/install.md`：安装方式、环境要求、Provider 安装、环境变量配置
- [x] 2.3 编写 `guide/quickstart.md`：基于 Next.js App Router 的完整示例（API Route + useChat 前端）
- [x] 2.4 编写 `guide/foundations.md`：Providers & Models、Prompts、Tools、Streaming 四大基础概念

## 3. 核心 API 篇（6 页）

- [x] 3.1 编写 `guide/generating-text.md`：generateText / streamText 用法、参数、流式处理、多步调用
- [x] 3.2 编写 `guide/structured-output.md`：generateObject / streamObject、Zod Schema 定义、输出模式
- [x] 3.3 编写 `guide/tool-calling.md`：tool 定义、dynamicTool、多步工具调用、工具审批
- [x] 3.4 编写 `guide/mcp.md`：createMCPClient、MCP 传输层、与工具调用的结合
- [x] 3.5 编写 `guide/embeddings.md`：embed / embedMany、相似度计算、RAG 检索基础
- [x] 3.6 编写 `guide/multimodal.md`：图像生成（generateImage）、语音转写（transcribe）、语音合成（generateSpeech）

## 4. 前端集成篇（6 页）

- [x] 4.1 编写 `guide/ui-overview.md`：AI SDK UI 总览、useChat / useCompletion / useObject 三大 Hook、框架支持
- [x] 4.2 编写 `guide/chatbot.md`：useChat 完整用法、消息渲染、输入处理、加载状态、错误处理
- [x] 4.3 编写 `guide/chatbot-advanced.md`：消息持久化、流恢复（resume streams）、工具调用展示
- [x] 4.4 编写 `guide/generative-ui.md`：生成式 UI 概念、工具组件映射、动态 UI 渲染
- [x] 4.5 编写 `guide/streaming-data.md`：流式自定义数据、Transport 传输层、自定义数据类型
- [x] 4.6 编写 `guide/stream-protocol.md`：UIMessage 流协议、消息格式、与自定义后端对接

## 5. Agent 篇（4 页）

- [x] 5.1 编写 `guide/agent-overview.md`：Agent 概念、与直接 API 调用的区别、Agent 接口
- [x] 5.2 编写 `guide/building-agents.md`：ToolLoopAgent、maxSteps 控制、工具注册、Agent 执行流程
- [x] 5.3 编写 `guide/workflow-patterns.md`：顺序/路由/并行/编排四种模式、代码示例
- [x] 5.4 编写 `guide/agent-advanced.md`：记忆系统、子 Agent 协作、循环控制（stopCondition）

## 6. 进阶篇（5 页）

- [x] 6.1 编写 `guide/providers.md`：Provider 体系、OpenAI/Anthropic/DeepSeek 等主流配置、自定义 Provider
- [x] 6.2 编写 `guide/middleware.md`：Language Model Middleware、内置中间件（缓存/日志/重试）、自定义中间件
- [x] 6.3 编写 `guide/caching-and-limits.md`：响应缓存、速率限制、背压处理
- [x] 6.4 编写 `guide/error-handling.md`：错误类型体系、重试策略、测试（模拟 Provider 响应）
- [x] 6.5 编写 `guide/deployment.md`：Vercel 部署、Node.js 独立部署、环境变量管理、超时处理

## 7. 实战教程篇（2 页）

- [x] 7.1 编写 `guide/tutorial-rag-agent.md`：完整 RAG Agent 教程（嵌入 + 检索 + 生成 + 工具调用）
- [x] 7.2 编写 `guide/tutorial-multimodal-chat.md`：多模态聊天应用（文本 + 图片上传 + 图片生成）

## 8. 首页

- [x] 8.1 编写 `index.md`：layout: home，hero（名称/副标题/action 按钮）+ features 卡片（对应 6 个分组）

## 9. 外链标注

- [x] 9.1 为所有教程页面的核心 API 添加 🔗 外链（ai-sdk.dev 官方文档链接）

## 10. Playwright 验证

- [x] 10.1 启动开发服务器，验证所有 28 个页面渲染正确（非 404）
- [x] 10.2 验证 sidebar 分组和导航链接完整
- [x] 10.3 验证 AI 板块首页新增的 Vercel AI SDK 卡片显示正确
- [x] 10.4 验证 🔗 外链可达性
- [x] 10.5 运行 `npm run build` 确认构建无错误

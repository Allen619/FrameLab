import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

/**
 * VitePress 配置文件
 *
 * 侧边栏配置说明:
 * - 侧边栏按路由前缀分区 (如 '/backend/', '/ai/')
 * - 每个分区包含多个分组，每个分组有 text (标题) 和 items (子项)
 * - items 是一个数组，每项包含 text (显示文本) 和 link (链接路径)
 * - 可选属性:
 *   - collapsed: 默认折叠状态 (true/false/undefined)
 *     - true: 默认折叠
 *     - false: 默认展开
 *     - undefined: 不可折叠
 *
 * 修改侧边栏顺序: 调整 items 数组中对象的顺序即可
 * 添加新分组: 在对应路由的数组中添加新的 { text, items } 对象
 * 添加新文档: 在对应分组的 items 数组中添加 { text, link } 对象
 */
export default withMermaid(
  defineConfig({
    title: '学习文档站',
    description: '前端、后端、AI 学习资料整合',
    lang: 'zh-CN',

    themeConfig: {
      // 顶部导航栏配置 - 下拉菜单形式
      nav: [
        { text: '首页', link: '/' },
        { text: '前端', link: '/frontend/' },
        {
          text: '后端',
          items: [{ text: 'Python', link: '/backend/python/' }],
        },
        {
          text: 'AI',
          items: [{ text: 'LangChain', link: '/ai/langchain/' }],
        },
      ],

      // 侧边栏配置（按路由分区）
      // 参考上方配置说明修改侧边栏
      sidebar: {
        // 前端板块占位配置
        '/frontend/': [
          {
            text: '前端开发',
            items: [{ text: '概述', link: '/frontend/' }],
          },
        ],

        // 后端板块配置 - Python for Frontend Devs
        '/backend/python/': [
          {
            text: '前端迁移指南',
            items: [
              { text: '概述', link: '/backend/python/guide/' },
              { text: '环境安装', link: '/backend/python/guide/setup' },
              { text: '概念映射表', link: '/backend/python/guide/mapping' },
              { text: '常见陷阱', link: '/backend/python/guide/pitfalls' },
              { text: '常见问题 (FAQ)', link: '/backend/python/guide/faq' },
              { text: '进阶学习路径', link: '/backend/python/guide/next-steps' },
            ],
          },
          {
            text: '基础语法',
            items: [
              { text: '概述', link: '/backend/python/basics/' },
              { text: '变量与数据类型', link: '/backend/python/basics/variables' },
              { text: '控制流', link: '/backend/python/basics/control-flow' },
              { text: '函数', link: '/backend/python/basics/functions' },
              { text: '类与对象', link: '/backend/python/basics/classes' },
              { text: 'Python 模块系统', link: '/backend/python/basics/modules' },
              { text: 'Python 包结构', link: '/backend/python/basics/packages' },
              { text: '文件 I/O', link: '/backend/python/basics/file-io' },
              { text: '异常处理', link: '/backend/python/basics/exceptions' },
            ],
          },
          {
            text: '数据结构',
            items: [
              { text: '概述', link: '/backend/python/data-structures/' },
              { text: '列表 List', link: '/backend/python/data-structures/lists' },
              { text: '元组 Tuple', link: '/backend/python/data-structures/tuples' },
              { text: '字典 Dict', link: '/backend/python/data-structures/dicts' },
              { text: '集合 Set', link: '/backend/python/data-structures/sets' },
            ],
          },
          {
            text: '工程化工具',
            items: [
              { text: '概述', link: '/backend/python/tooling/' },
              { text: 'Poetry 依赖管理', link: '/backend/python/tooling/poetry' },
              { text: 'Ruff 代码检查', link: '/backend/python/tooling/ruff' },
              { text: '类型系统', link: '/backend/python/tooling/typing' },
            ],
          },
          {
            text: '高级特性',
            collapsed: false, // 默认展开，可设为 true 折叠
            items: [
              { text: '概述', link: '/backend/python/advanced/' },
              { text: '装饰器', link: '/backend/python/advanced/decorators' },
              { text: '生成器', link: '/backend/python/advanced/generators' },
              { text: '上下文管理器', link: '/backend/python/advanced/context-managers' },
              { text: '异步编程', link: '/backend/python/advanced/async' },
              { text: '数据类 (dataclass)', link: '/backend/python/advanced/dataclasses' },
            ],
          },
          {
            text: '常用库',
            collapsed: true, // 默认折叠，点击可展开
            items: [
              { text: '概述', link: '/backend/python/libraries/' },
              { text: 'pathlib 文件路径', link: '/backend/python/libraries/pathlib' },
              { text: 'dataclass 数据类', link: '/backend/python/libraries/dataclass' },
              { text: 'HTTP 请求库', link: '/backend/python/libraries/http' },
              { text: '数据处理库', link: '/backend/python/libraries/data' },
              { text: 'Web 框架', link: '/backend/python/libraries/web-frameworks' },
              { text: '测试工具', link: '/backend/python/libraries/testing' },
            ],
          },
          {
            text: '调试技巧',
            items: [
              { text: '概述', link: '/backend/python/debugging/' },
              { text: 'VSCode 调试', link: '/backend/python/debugging/vscode' },
              { text: 'pdb 命令行调试', link: '/backend/python/debugging/pdb' },
              { text: '日志调试', link: '/backend/python/debugging/logging' },
            ],
          },
          {
            text: '部署指南',
            items: [
              { text: '概述', link: '/backend/python/deployment/' },
              { text: 'Docker 部署', link: '/backend/python/deployment/docker' },
              { text: '云平台部署', link: '/backend/python/deployment/cloud' },
              { text: '依赖管理', link: '/backend/python/deployment/dependencies' },
            ],
          },
        ],

        // AI 板块配置 - LangChain 1.0 中文教程
        '/ai/langchain/': [
          {
            text: '基础',
            items: [
              { text: '环境搭建', link: '/ai/langchain/guide/getting-started' },
              { text: 'Agent 架构', link: '/ai/langchain/guide/agent-architecture' },
              { text: 'Middleware', link: '/ai/langchain/guide/middleware' },
              { text: 'Content Blocks', link: '/ai/langchain/guide/content-blocks' },
            ],
          },
          {
            text: '进阶',
            items: [
              { text: 'Streaming 流式响应', link: '/ai/langchain/guide/streaming' },
              { text: 'LangGraph 工作流', link: '/ai/langchain/guide/langgraph-intro' },
              { text: '生产部署', link: '/ai/langchain/guide/deployment' },
            ],
          },
          {
            text: '迁移',
            items: [{ text: 'Legacy 迁移指南', link: '/ai/langchain/guide/legacy-migration' }],
          },
        ],
      },

      // 本地搜索配置
      search: {
        provider: 'local',
      },

      footer: {
        message: '学习文档整合站点',
        copyright: 'MIT License',
      },
    },

    // Mermaid 图表配置
    mermaid: {},
  })
)

import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
    title: '学习文档站',
    description: '前端、后端、AI 学习资料整合',
    lang: 'zh-CN',

    themeConfig: {
      nav: [
        { text: '首页', link: '/' },
        { text: '前端', link: '/frontend/' },
        {
          text: '后端',
          items: [{ text: 'Python', link: '/backend/python/' }],
        },
        {
          text: 'AI',
          items: [
            { text: 'LangChain', link: '/ai/langchain/' },
            { text: 'LlamaIndex', link: '/ai/llamaindex/' },
          ],
        },
        {
          text: '运维',
          items: [{ text: 'Kubernetes', link: '/ops/kubernetes/' }],
        },
      ],

      sidebar: {
        '/frontend/': [
          {
            text: '前端开发',
            items: [{ text: '概述', link: '/frontend/' }],
          },
        ],

        '/backend/python/': [
          {
            text: '📍 学习路径',
            link: '/backend/python/roadmap',
          },
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
              {
                text: '依赖管理',
                collapsed: false,
                items: [
                  { text: '工具总览', link: '/backend/python/tooling/dependency-management/' },
                  { text: '⭐ uv', link: '/backend/python/tooling/dependency-management/uv' },
                  { text: 'Poetry', link: '/backend/python/tooling/dependency-management/poetry' },
                ],
              },
              { text: '⭐ Ruff 代码检查', link: '/backend/python/tooling/ruff' },
              { text: '类型系统', link: '/backend/python/tooling/typing' },
            ],
          },
          {
            text: '高级特性',
            collapsed: false,
            items: [
              { text: '概述', link: '/backend/python/advanced/' },
              { text: '装饰器', link: '/backend/python/advanced/decorators' },
              { text: '生成器', link: '/backend/python/advanced/generators' },
              { text: '上下文管理器', link: '/backend/python/advanced/context-managers' },
              { text: '异步编程', link: '/backend/python/advanced/async' },
            ],
          },
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
                      { text: 'os/sys 系统接口', link: '/backend/python/libraries/stdlib/file-system/os-sys' },
                      { text: '🔥 pathlib 路径操作', link: '/backend/python/libraries/stdlib/file-system/pathlib' },
                      { text: 'shutil 文件操作', link: '/backend/python/libraries/stdlib/file-system/shutil' },
                      { text: '🔥 subprocess 子进程', link: '/backend/python/libraries/stdlib/file-system/subprocess' },
                    ],
                  },
                  {
                    text: '文本与数据',
                    collapsed: true,
                    items: [
                      { text: '🔥 re 正则表达式', link: '/backend/python/libraries/stdlib/text-data/re' },
                      { text: '🔥 json 数据格式', link: '/backend/python/libraries/stdlib/text-data/json' },
                      { text: 'csv 表格处理', link: '/backend/python/libraries/stdlib/text-data/csv' },
                      { text: 'string 字符串工具', link: '/backend/python/libraries/stdlib/text-data/string' },
                      { text: 'pickle 序列化', link: '/backend/python/libraries/stdlib/text-data/pickle' },
                    ],
                  },
                  {
                    text: '数学与随机',
                    collapsed: true,
                    items: [
                      { text: 'math 数学函数', link: '/backend/python/libraries/stdlib/math-random/math' },
                      { text: 'random 随机数', link: '/backend/python/libraries/stdlib/math-random/random' },
                      { text: 'statistics 统计', link: '/backend/python/libraries/stdlib/math-random/statistics' },
                      { text: 'decimal 精确计算', link: '/backend/python/libraries/stdlib/math-random/decimal' },
                    ],
                  },
                  {
                    text: '日期与时间',
                    collapsed: true,
                    items: [
                      { text: '🔥 datetime 日期时间', link: '/backend/python/libraries/stdlib/datetime/datetime' },
                      { text: 'time 时间函数', link: '/backend/python/libraries/stdlib/datetime/time' },
                      { text: 'calendar 日历', link: '/backend/python/libraries/stdlib/datetime/calendar' },
                    ],
                  },
                  {
                    text: '数据结构增强',
                    collapsed: true,
                    items: [
                      { text: '🔥 collections 容器', link: '/backend/python/libraries/stdlib/collections/collections' },
                      { text: 'itertools 迭代器', link: '/backend/python/libraries/stdlib/collections/itertools' },
                      { text: 'functools 函数工具', link: '/backend/python/libraries/stdlib/collections/functools' },
                      { text: 'enum 枚举', link: '/backend/python/libraries/stdlib/collections/enum' },
                    ],
                  },
                  {
                    text: '开发工具',
                    collapsed: true,
                    items: [
                      { text: 'argparse 命令行', link: '/backend/python/libraries/stdlib/dev-tools/argparse' },
                      { text: 'unittest 单元测试', link: '/backend/python/libraries/stdlib/dev-tools/unittest' },
                    ],
                  },
                  {
                    text: '并发编程',
                    collapsed: true,
                    items: [
                      { text: 'threading 线程', link: '/backend/python/libraries/stdlib/concurrency/threading' },
                      { text: 'multiprocessing 多进程', link: '/backend/python/libraries/stdlib/concurrency/multiprocessing' },
                      { text: 'concurrent.futures', link: '/backend/python/libraries/stdlib/concurrency/concurrent-futures' },
                    ],
                  },
                  {
                    text: '网络编程',
                    collapsed: true,
                    items: [
                      { text: 'urllib URL处理', link: '/backend/python/libraries/stdlib/networking/urllib' },
                      { text: 'socket 套接字', link: '/backend/python/libraries/stdlib/networking/socket' },
                      { text: 'http.server', link: '/backend/python/libraries/stdlib/networking/http-server' },
                    ],
                  },
                  {
                    text: '数据存储',
                    collapsed: true,
                    items: [
                      { text: 'sqlite3 数据库', link: '/backend/python/libraries/stdlib/storage/sqlite3' },
                    ],
                  },
                  {
                    text: '工具函数',
                    collapsed: true,
                    items: [
                      { text: 'hashlib 哈希', link: '/backend/python/libraries/stdlib/utilities/hashlib' },
                      { text: 'base64 编码', link: '/backend/python/libraries/stdlib/utilities/base64' },
                      { text: 'copy 拷贝', link: '/backend/python/libraries/stdlib/utilities/copy' },
                      { text: 'contextlib 上下文', link: '/backend/python/libraries/stdlib/utilities/contextlib' },
                    ],
                  },
                ],
              },
              {
                text: '第三方库',
                collapsed: true,
                items: [
                  { text: '概述', link: '/backend/python/libraries/third-party/' },
                  {
                    text: 'Web 框架',
                    collapsed: true,
                    items: [
                      { text: '⭐ FastAPI', link: '/backend/python/libraries/third-party/web/fastapi' },
                      { text: 'Flask', link: '/backend/python/libraries/third-party/web/flask' },
                      { text: 'Django 概述', link: '/backend/python/libraries/third-party/web/django-overview' },
                      { text: '⭐ Pydantic', link: '/backend/python/libraries/third-party/web/pydantic' },
                    ],
                  },
                  {
                    text: 'HTTP 客户端',
                    collapsed: true,
                    items: [
                      { text: 'requests', link: '/backend/python/libraries/third-party/http/requests' },
                      { text: '⭐ httpx', link: '/backend/python/libraries/third-party/http/httpx' },
                      { text: 'aiohttp', link: '/backend/python/libraries/third-party/http/aiohttp' },
                    ],
                  },
                  {
                    text: '数据处理',
                    collapsed: true,
                    items: [
                      { text: '⭐ pandas', link: '/backend/python/libraries/third-party/data/pandas' },
                      { text: 'numpy', link: '/backend/python/libraries/third-party/data/numpy' },
                      { text: 'polars', link: '/backend/python/libraries/third-party/data/polars' },
                    ],
                  },
                  {
                    text: '数据库',
                    collapsed: true,
                    items: [
                      { text: '⭐ SQLAlchemy', link: '/backend/python/libraries/third-party/database/sqlalchemy' },
                      { text: 'PyMongo', link: '/backend/python/libraries/third-party/database/pymongo' },
                      { text: 'redis-py', link: '/backend/python/libraries/third-party/database/redis-py' },
                    ],
                  },
                  {
                    text: '测试',
                    collapsed: true,
                    items: [
                      { text: '⭐ pytest', link: '/backend/python/libraries/third-party/testing/pytest' },
                      { text: 'pytest-mock', link: '/backend/python/libraries/third-party/testing/pytest-mock' },
                      { text: 'coverage', link: '/backend/python/libraries/third-party/testing/coverage' },
                    ],
                  },
                  {
                    text: 'CLI 工具',
                    collapsed: true,
                    items: [
                      { text: 'click', link: '/backend/python/libraries/third-party/cli/click' },
                      { text: '⭐ typer', link: '/backend/python/libraries/third-party/cli/typer' },
                      { text: 'rich', link: '/backend/python/libraries/third-party/cli/rich' },
                    ],
                  },
                  {
                    text: '配置管理',
                    collapsed: true,
                    items: [
                      { text: '⭐ python-dotenv', link: '/backend/python/libraries/third-party/config/python-dotenv' },
                      { text: 'PyYAML', link: '/backend/python/libraries/third-party/config/pyyaml' },
                      { text: 'toml', link: '/backend/python/libraries/third-party/config/toml' },
                    ],
                  },
                ],
              },
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

        '/ai/llamaindex/': [
          {
            text: '基础',
            items: [
              { text: '环境搭建', link: '/ai/llamaindex/guide/getting-started' },
              { text: 'RAG 基础', link: '/ai/llamaindex/guide/rag-basics' },
              { text: '数据加载', link: '/ai/llamaindex/guide/data-connectors' },
              { text: '索引构建', link: '/ai/llamaindex/guide/index-building' },
            ],
          },
          {
            text: '进阶',
            items: [
              { text: '查询引擎', link: '/ai/llamaindex/guide/query-engine' },
              { text: 'Agent 基础', link: '/ai/llamaindex/guide/agent-basics' },
              { text: 'Agent 进阶', link: '/ai/llamaindex/guide/agent-advanced' },
            ],
          },
          {
            text: '进阶应用',
            collapsed: false,
            items: [
              { text: '向量数据库选型', link: '/ai/llamaindex/guide/vector-databases' },
              { text: '多模态 RAG', link: '/ai/llamaindex/guide/multimodal-rag' },
            ],
          },
          {
            text: '生产',
            items: [{ text: '部署与优化', link: '/ai/llamaindex/guide/production' }],
          },
        ],

        '/ops/kubernetes/': [
          {
            text: '📍 学习路径',
            link: '/ops/kubernetes/',
          },
          {
            text: '基础概念',
            collapsed: false,
            items: [
              { text: '概述', link: '/ops/kubernetes/concepts/' },
              { text: 'K8s 是什么', link: '/ops/kubernetes/concepts/what-is-k8s' },
              { text: '架构概览', link: '/ops/kubernetes/concepts/architecture' },
              { text: 'Pod 详解', link: '/ops/kubernetes/concepts/pod' },
              { text: 'Pod 生命周期', link: '/ops/kubernetes/concepts/pod-lifecycle' },
              { text: '核心组件', link: '/ops/kubernetes/concepts/components' },
            ],
          },
          {
            text: '环境搭建',
            collapsed: false,
            items: [
              { text: '概述', link: '/ops/kubernetes/setup/' },
              { text: '前置要求', link: '/ops/kubernetes/setup/prerequisites' },
              { text: 'Windows 安装', link: '/ops/kubernetes/setup/minikube-windows' },
              { text: 'macOS 安装', link: '/ops/kubernetes/setup/minikube-macos' },
              { text: 'kubectl 基础', link: '/ops/kubernetes/setup/kubectl-basics' },
              { text: '第一个 Pod', link: '/ops/kubernetes/setup/first-pod' },
              { text: '故障排查', link: '/ops/kubernetes/setup/troubleshooting' },
            ],
          },
          {
            text: '网络',
            collapsed: true,
            items: [
              { text: '概述', link: '/ops/kubernetes/networking/' },
              { text: '网络模型', link: '/ops/kubernetes/networking/network-model' },
              { text: 'ClusterIP Service', link: '/ops/kubernetes/networking/service-clusterip' },
              { text: 'NodePort Service', link: '/ops/kubernetes/networking/service-nodeport' },
              { text: 'Ingress 入门', link: '/ops/kubernetes/networking/ingress' },
            ],
          },
          {
            text: '工作负载',
            collapsed: true,
            items: [
              { text: '概述', link: '/ops/kubernetes/workloads/' },
              { text: 'Deployment', link: '/ops/kubernetes/workloads/deployment' },
              { text: '滚动更新', link: '/ops/kubernetes/workloads/rolling-update' },
              { text: '版本回滚', link: '/ops/kubernetes/workloads/rollback' },
              { text: '扩缩容', link: '/ops/kubernetes/workloads/scaling' },
            ],
          },
          {
            text: '配置与存储',
            collapsed: true,
            items: [
              { text: '概述', link: '/ops/kubernetes/storage/' },
              { text: 'ConfigMap', link: '/ops/kubernetes/storage/configmap' },
              { text: 'Secret', link: '/ops/kubernetes/storage/secret' },
              { text: '持久化存储', link: '/ops/kubernetes/storage/persistent-volume' },
            ],
          },
          {
            text: 'CI/CD',
            collapsed: true,
            items: [
              { text: '概述', link: '/ops/kubernetes/cicd/' },
              { text: 'CI/CD 概览', link: '/ops/kubernetes/cicd/overview' },
              { text: 'Docker 镜像构建', link: '/ops/kubernetes/cicd/docker-build' },
              { text: 'GitHub Actions', link: '/ops/kubernetes/cicd/github-actions' },
              { text: '部署到 K8s', link: '/ops/kubernetes/cicd/deploy-to-k8s' },
            ],
          },
        ],
      },

      search: {
        provider: 'local',
      },

      footer: {
        message: '学习文档整合站点',
        copyright: 'MIT License',
      },
    },

    mermaid: {},
  })
)

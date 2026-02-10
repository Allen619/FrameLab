# 向量数据库选型与多模态处理教程

## Why

当前 LlamaIndex 中文教程缺少两个关键的进阶主题：
1. **向量数据库选型**：现有教程仅在"索引构建"章节简要提及 Chroma，但生产环境需要系统性的选型指导
2. **多模态处理**：现有教程专注于纯文本 RAG，未涵盖 PDF 图表提取和图片理解等关键能力

零基础学员在完成基础教程后，需要这两个进阶内容来构建生产级应用。

## What Changes

### 1. 新增向量数据库选型对比章节
- 四大主流向量数据库对比（Chroma vs Pinecone vs Milvus vs Weaviate）
- 从开发友好度、性能、扩展性、成本等多维度分析
- **深度教程：Chroma 完整指南**（选择 Chroma 作为详细教程对象，理由：开源免费、开发体验最佳、LlamaIndex 集成度最高、适合 0 基础学员入门）

### 2. 新增多模态处理章节
- 多模态 RAG 原理与架构图（Mermaid 流程图）
- PDF 图表/表格提取实战（使用 LlamaParse / Unstructured）
- 图片理解与视觉问答实战
- 多模态索引构建与检索

### 3. VitePress 配置更新
- 在 `/ai/llamaindex/` 侧边栏添加"进阶应用"分组
- 新增两个导航入口

## Impact

- **新增文件**:
  - `docs/ai/llamaindex/guide/vector-databases.md` - 向量数据库选型对比与 Chroma 详解
  - `docs/ai/llamaindex/guide/multimodal-rag.md` - 多模态处理教程

- **修改文件**:
  - `docs/.vitepress/config.mts` - 添加侧边栏导航

- **Affected specs**:
  - `llamaindex-tutorial` - 扩展现有 LlamaIndex 教程能力边界

- **Affected code**:
  - VitePress 配置
  - 新增 Markdown 教程文档

## 设计决策

### 为什么选择 Chroma 作为详细教程？

| 对比维度 | Chroma | Pinecone | Milvus | Weaviate |
|---------|--------|----------|--------|----------|
| 开源免费 | ✅ Apache 2.0 | ❌ 专有 | ✅ Apache 2.0 | ✅ BSD-3 |
| 零配置启动 | ✅ pip install 即用 | ❌ 需注册云账号 | ⚠️ 需 Docker | ⚠️ 需 Docker |
| 开发体验 | ⭐⭐⭐⭐⭐ Pythonic | ⭐⭐⭐⭐ 简洁 | ⭐⭐⭐ 学习曲线高 | ⭐⭐⭐ GraphQL |
| LlamaIndex 集成 | ⭐⭐⭐⭐⭐ 官方深度集成 | ⭐⭐⭐⭐ 良好 | ⭐⭐⭐⭐ 良好 | ⭐⭐⭐⭐ 良好 |
| 适合场景 | 开发/原型/中小生产 | 大规模生产 | 超大规模分布式 | 混合检索场景 |

**结论**: Chroma 是零基础学员的最佳起点，后续可引导学员根据规模选择 Pinecone/Milvus。

### 多模态技术选型

| 工具 | 用途 | 优势 |
|------|------|------|
| LlamaParse | PDF 解析 | LlamaIndex 官方出品，API 简洁 |
| Unstructured | 复杂文档解析 | 开源免费，支持表格/图表提取 |
| GPT-4V / Claude 3 | 图片理解 | 多模态 LLM 领先能力 |

## 教学设计原则

1. **通俗易懂**: 使用生活化比喻解释向量数据库概念（如"图书馆索引系统"）
2. **深度应用**: 所有代码示例经过 LlamaIndex 0.10.x+ 最新 API 验证
3. **可视化优先**: 复杂流程必须配合 Mermaid 图解
4. **循序渐进**: 从单机 Chroma 到分布式选型建议

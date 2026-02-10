---
title: 数据加载
description: 掌握 LlamaIndex 的数据加载器，从多种数据源加载文档
---

# 数据加载

## 概述

本章将帮助你掌握 LlamaIndex 的 **Data Connectors（数据连接器）**。完成本章后，你将能够：

- 使用 SimpleDirectoryReader 加载本地文件
- 处理多种文件格式（PDF、Word、Markdown 等）
- 编写自定义数据加载器
- 从远程数据源加载数据

## 核心概念

### 什么是 Data Connector？

**Data Connector** 就像**快递员**。无论你的"包裹"（数据）来自哪里——本地文件、网页、数据库、云存储——快递员都能把它送到你手中（转换成 LlamaIndex 的 Document 对象）。

```mermaid
graph TD
    A[PDF 文件] --> E[Data Connector]
    B[Word 文档] --> E
    C[网页] --> E
    D[数据库] --> E
    E --> F[Document 对象]
    F --> G[后续处理]
```

**图表说明**: Data Connector 是数据进入 LlamaIndex 的统一入口，将各种格式的数据转换为标准的 Document 对象。

### Document 对象结构

每个 Document 包含：

| 属性 | 说明 |
|------|------|
| `text` | 文档的文本内容 |
| `metadata` | 元数据（文件名、创建时间等） |
| `doc_id` | 唯一标识符 |

## 代码示例

### 示例 1: SimpleDirectoryReader 基础用法

> 适用版本: LlamaIndex 0.10.x+

```python
from llama_index.core import SimpleDirectoryReader

# 最简单的用法：加载目录下所有文件
documents = SimpleDirectoryReader("./data/").load_data()

print(f"加载了 {len(documents)} 个文档")

# 查看第一个文档的信息
if documents:
    doc = documents[0]
    print(f"文档 ID: {doc.doc_id}")
    print(f"元数据: {doc.metadata}")
    print(f"内容预览: {doc.text[:200]}...")
```

**说明**: SimpleDirectoryReader 是最常用的数据加载器，能自动识别目录下的多种文件格式。

### 示例 2: 指定文件类型

> 适用版本: LlamaIndex 0.10.x+

```python
from llama_index.core import SimpleDirectoryReader

# 只加载特定类型的文件
reader = SimpleDirectoryReader(
    input_dir="./documents/",
    required_exts=[".pdf", ".md", ".txt"],  # 只加载这些扩展名
    recursive=True,  # 递归读取子目录
    exclude=["*.tmp", "*.bak"],  # 排除的文件模式
)

documents = reader.load_data()
print(f"加载了 {len(documents)} 个文档")
```

**说明**: 使用 `required_exts` 过滤文件类型，使用 `recursive` 递归处理子目录。

### 示例 3: 加载单个文件

> 适用版本: LlamaIndex 0.10.x+

```python
from llama_index.core import SimpleDirectoryReader

# 加载指定的单个或多个文件
reader = SimpleDirectoryReader(
    input_files=["./report.pdf", "./notes.md"]
)

documents = reader.load_data()

for doc in documents:
    print(f"文件: {doc.metadata.get('file_name', 'unknown')}")
```

**说明**: 使用 `input_files` 参数可以精确指定要加载的文件列表。

## 支持的文件格式

LlamaIndex 内置支持多种文件格式：

| 格式 | 扩展名 | 需要额外依赖 |
|------|--------|--------------|
| 纯文本 | .txt | 否 |
| Markdown | .md | 否 |
| PDF | .pdf | pypdf |
| Word | .docx | python-docx |
| PowerPoint | .pptx | python-pptx |
| Excel | .xlsx | openpyxl |
| CSV | .csv | 否 |
| HTML | .html | beautifulsoup4 |
| JSON | .json | 否 |
| 图片 | .png, .jpg | 多模态 LLM |

### 安装额外依赖

```bash
# PDF 支持
pip install pypdf

# Office 文档支持
pip install python-docx python-pptx openpyxl

# HTML 支持
pip install beautifulsoup4
```

## 自定义文件解析器

### 示例 4: 使用自定义解析器

> 适用版本: LlamaIndex 0.10.x+

```python
from llama_index.core import SimpleDirectoryReader
from llama_index.readers.file import PDFReader

# 自定义 PDF 解析器配置
pdf_reader = PDFReader(return_full_document=True)

# 指定特定扩展名使用特定解析器
reader = SimpleDirectoryReader(
    input_dir="./documents/",
    file_extractor={
        ".pdf": pdf_reader,
    }
)

documents = reader.load_data()
```

**说明**: 通过 `file_extractor` 参数可以为不同文件类型指定自定义解析器。

### 示例 5: 添加元数据

> 适用版本: LlamaIndex 0.10.x+

```python
from llama_index.core import SimpleDirectoryReader
import os
from datetime import datetime

def custom_metadata_func(file_path: str) -> dict:
    """为每个文件添加自定义元数据"""
    return {
        "file_name": os.path.basename(file_path),
        "file_size": os.path.getsize(file_path),
        "created_at": datetime.now().isoformat(),
        "category": "technical_docs",
    }

reader = SimpleDirectoryReader(
    input_dir="./data/",
    file_metadata=custom_metadata_func,
)

documents = reader.load_data()

# 查看自定义元数据
print(documents[0].metadata)
```

**说明**: 自定义元数据函数可以为文档添加业务相关的信息，便于后续过滤和检索。

## 远程数据源

### 示例 6: 从 Web 加载数据

> 适用版本: LlamaIndex 0.10.x+

```python
# 安装: pip install llama-index-readers-web
from llama_index.readers.web import SimpleWebPageReader

# 加载网页内容
reader = SimpleWebPageReader(html_to_text=True)
documents = reader.load_data(
    urls=["https://docs.llamaindex.ai/en/stable/"]
)

print(f"加载了 {len(documents)} 个网页")
print(documents[0].text[:500])
```

**说明**: SimpleWebPageReader 可以抓取网页内容并转换为文档。

### 示例 7: 从数据库加载

> 适用版本: LlamaIndex 0.10.x+

```python
# 安装: pip install llama-index-readers-database
from llama_index.readers.database import DatabaseReader

# 从 SQL 数据库加载
reader = DatabaseReader(
    sql_database="postgresql://user:pass@localhost/mydb"
)

documents = reader.load_data(
    query="SELECT title, content FROM articles WHERE published = true"
)
```

**说明**: DatabaseReader 可以从 SQL 数据库执行查询并将结果转换为文档。

### 示例 8: 从 S3 加载

> 适用版本: LlamaIndex 0.10.x+

```python
# 安装: pip install llama-index-readers-s3
from llama_index.readers.s3 import S3Reader

# 配置 AWS 凭证（通过环境变量）
# export AWS_ACCESS_KEY_ID=xxx
# export AWS_SECRET_ACCESS_KEY=xxx

reader = S3Reader(
    bucket="my-documents-bucket",
    prefix="reports/2024/",  # 只读取特定前缀
)

documents = reader.load_data()
```

**说明**: S3Reader 可以直接从 AWS S3 存储桶加载文档，适合云端数据处理。

## 数据加载流程

```mermaid
graph TD
    A[确定数据源] --> B{数据源类型}
    B -->|本地文件| C[SimpleDirectoryReader]
    B -->|网页| D[WebPageReader]
    B -->|数据库| E[DatabaseReader]
    B -->|云存储| F[S3Reader/GCSReader]
    C --> G[配置参数]
    D --> G
    E --> G
    F --> G
    G --> H[load_data]
    H --> I[Document 列表]
    I --> J[创建索引]
```

**图表说明**: 根据数据源类型选择合适的 Reader，配置参数后调用 load_data() 获取文档。

## 避坑指南

### ❌ 常见问题 1: 文件编码问题

**现象**:

```
UnicodeDecodeError: 'utf-8' codec can't decode byte 0xff
```

**根因**: 文件使用了非 UTF-8 编码（如 GBK）。

**解决方案**:

```python
from llama_index.core import SimpleDirectoryReader

# 指定编码
reader = SimpleDirectoryReader(
    input_dir="./data/",
    encoding="gbk",  # 或 "gb2312", "utf-16" 等
)
```

**预防措施**: 统一将源文件转换为 UTF-8 编码。

### ❌ 常见问题 2: PDF 解析失败

**现象**:

```
ValueError: No text could be extracted from PDF
```

**根因**: PDF 是扫描版（图片）或加密的。

**解决方案**:

```python
# 方法 1: 使用 OCR 解析扫描版 PDF
# 安装: pip install pdf2image pytesseract

# 方法 2: 使用更强大的 PDF 解析器
# 安装: pip install llama-index-readers-file pymupdf
from llama_index.readers.file import PyMuPDFReader

reader = SimpleDirectoryReader(
    input_dir="./pdfs/",
    file_extractor={".pdf": PyMuPDFReader()}
)
```

**预防措施**: 测试 PDF 是否可选中文字，如不能则需要 OCR 处理。

### ❌ 常见问题 3: 大文件内存溢出

**现象**:

```
MemoryError: Unable to allocate array
```

**根因**: 单个文件过大，一次性加载到内存。

**解决方案**:

```python
# 分批加载大文件
from llama_index.core import SimpleDirectoryReader
import os

def load_large_files_in_batches(directory: str, batch_size: int = 10):
    """分批加载大量文件"""
    all_files = [
        os.path.join(directory, f)
        for f in os.listdir(directory)
        if os.path.isfile(os.path.join(directory, f))
    ]

    for i in range(0, len(all_files), batch_size):
        batch = all_files[i:i + batch_size]
        reader = SimpleDirectoryReader(input_files=batch)
        documents = reader.load_data()
        yield documents  # 使用生成器逐批返回
```

**预防措施**: 对于大规模数据集，始终使用分批处理和流式加载。

### ❌ 常见问题 4: 路径问题

**现象**:

```
FileNotFoundError: [Errno 2] No such file or directory
```

**根因**: 相对路径解析错误或路径不存在。

**解决方案**:

```python
from pathlib import Path

# 使用 pathlib 确保路径正确
data_dir = Path(__file__).parent / "data"

# 或使用绝对路径
data_dir = Path("D:/projects/my_app/data").resolve()

if not data_dir.exists():
    raise ValueError(f"目录不存在: {data_dir}")

reader = SimpleDirectoryReader(str(data_dir))
```

**预防措施**: 使用 pathlib 处理路径，始终验证路径存在性。

## 生产最佳实践

### 批量加载配置

| 参数 | 推荐值 | 说明 |
|------|--------|------|
| batch_size | 50-100 | 单批次文件数量 |
| num_workers | 4 | 并行加载线程数 |
| show_progress | True | 显示加载进度 |

### 异步加载

> 适用版本: LlamaIndex 0.10.x+

```python
import asyncio
from llama_index.core import SimpleDirectoryReader

async def load_documents_async():
    """异步加载文档"""
    reader = SimpleDirectoryReader("./data/")
    documents = await reader.aload_data()
    return documents

# 运行
documents = asyncio.run(load_documents_async())
```

### 加载进度显示

```python
from llama_index.core import SimpleDirectoryReader

reader = SimpleDirectoryReader(
    input_dir="./data/",
    num_files_limit=100,  # 限制文件数量
)

documents = reader.load_data(
    show_progress=True,  # 显示进度条
    num_workers=4,  # 并行加载
)
```

## 小结

本章我们学习了：

1. ✅ **SimpleDirectoryReader**：本地文件加载的主力工具
2. ✅ **文件格式支持**：PDF、Word、Markdown 等多种格式
3. ✅ **自定义解析器**：为特定格式配置专用解析器
4. ✅ **远程数据源**：网页、数据库、云存储的数据加载

## 下一步

现在你已经掌握了数据加载，让我们继续学习 [索引构建](/ai/llamaindex/guide/index-building)，了解如何高效地组织和检索这些数据。

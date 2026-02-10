# 示例资源说明

本目录存放教程中使用的示例文件。

## 多模态教程所需资源

### 示例 PDF

为了跟随多模态教程实践，请准备以下类型的 PDF 文件：

1. **包含表格的 PDF** (如 `data_report.pdf`)
   - 包含数据表格的报告
   - 可使用公开的财务报告、统计报告等

2. **包含图表的 PDF** (如 `chart_report.pdf`)
   - 包含柱状图、折线图、饼图等
   - 可使用年度报告、研究论文等

### 示例图片

1. **数据图表** (如 `sales_chart.png`)
   - 柱状图、折线图等数据可视化
   - 建议 PNG 格式，分辨率 800x600 以上

2. **流程图** (如 `diagram.png`)
   - 架构图、流程图等
   - 用于测试图片理解功能

## 获取示例数据

你可以从以下来源获取测试用的 PDF：

- [SEC EDGAR](https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany) - 美股上市公司年报
- [arXiv](https://arxiv.org/) - 学术论文
- 本地创建包含图表的 Word 文档并导出为 PDF

## 文件命名建议

```
assets/
├── sample_report.pdf      # 综合示例 PDF
├── table_example.pdf      # 表格提取示例
├── chart_example.pdf      # 图表提取示例
├── sales_chart.png        # 销售图表
└── architecture.png       # 架构图
```

## 注意事项

- 确保使用的资源不侵犯版权
- PDF 文件大小建议 < 10MB
- 图片格式推荐 PNG 或 JPEG

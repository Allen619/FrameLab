## ADDED Requirements

### Requirement: LangGraph 中文文档必须覆盖官方左侧菜单核心主题

系统 MUST 基于官方 `/oss/python/langgraph/` 菜单建立映射矩阵，并覆盖概览、安装、API 路线、Graph/Functional API、运行时、持久化、中断恢复、流式、测试、可观测、部署与案例主题。

#### Scenario: 覆盖率检查

- **WHEN** 作者完成文档编排并执行覆盖检查
- **THEN** 检查结果 SHALL 显示官方菜单核心主题均有对应中文页面或明确导读落点

### Requirement: 文档必须提供 Graph API 与 Functional API 的选型边界

系统 MUST 在学习路径中明确两类 API 的适用场景、优缺点与迁移路径，避免读者混用导致架构不清晰。

#### Scenario: 路线决策

- **WHEN** 读者进入 API 学习阶段
- **THEN** 文档 SHALL 给出可执行的 API 选型建议与迁移入口

### Requirement: 高复杂执行语义必须被可视化解释

系统 MUST 对并行收敛、HITL 中断恢复、回放分叉等复杂机制提供文本解释与适量 Mermaid 图示，且图文语义一致。

#### Scenario: 理解执行语义

- **WHEN** 读者学习 interrupt/resume 或 time-travel 相关章节
- **THEN** 文档 SHALL 提供流程图辅助理解并与代码示例一致

### Requirement: 文档必须形成由浅入深的章节依赖关系

系统 MUST 在章节中标注先修关系与下一步链接，形成连续学习链路，避免读者在高级章节迷失。

#### Scenario: 学习路径导航

- **WHEN** 读者完成任一章节并继续学习
- **THEN** 页面 SHALL 提供明确的前置与后续章节跳转建议

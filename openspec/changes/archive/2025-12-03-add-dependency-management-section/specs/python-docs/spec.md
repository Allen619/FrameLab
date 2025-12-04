## ADDED Requirements

### Requirement: 依赖管理独立目录结构

Python 教程工程化工具部分 SHALL 包含独立的依赖管理目录 (`tooling/dependency-management/`)，包含以下子页面：

- `index.md` - 依赖管理概述，对比 pip/Poetry/uv
- `poetry.md` - Poetry 完整使用指南
- `uv.md` - uv 完整使用指南

#### Scenario: 用户访问依赖管理页面

- **WHEN** 用户访问 `/backend/python/tooling/dependency-management/`
- **THEN** 显示依赖管理概述页面，包含工具对比和子页面链接

#### Scenario: 用户访问 Poetry 页面

- **WHEN** 用户访问 `/backend/python/tooling/dependency-management/poetry`
- **THEN** 显示 Poetry 完整使用指南

#### Scenario: 用户访问 uv 页面

- **WHEN** 用户访问 `/backend/python/tooling/dependency-management/uv`
- **THEN** 显示 uv 完整使用指南

### Requirement: Poetry 文档内容独立性

Poetry 文档 SHALL 仅包含 Poetry 专属内容，不得包含 uv 相关介绍：

1. Poetry 简介与优势
2. 安装与配置
3. 项目初始化
4. 依赖管理
5. 虚拟环境管理
6. pyproject.toml 配置详解
7. 与 npm/pnpm 的对比
8. 常用命令速查表

#### Scenario: Poetry 文档不包含 uv 内容

- **WHEN** 用户阅读 Poetry 文档
- **THEN** 文档中不出现 uv 工具的介绍、对比或使用说明

### Requirement: uv 包管理器文档

uv 文档 SHALL 包含以下核心内容，独立于 Poetry 文档：

1. uv 简介与优势
2. 安装方式（多平台）
3. 项目初始化与管理
4. 依赖管理（添加、删除、更新）
5. 虚拟环境管理
6. 与 npm/pnpm 的对比
7. 常用命令速查表
8. 最佳实践

#### Scenario: 前端开发者学习 uv

- **WHEN** 前端开发者阅读 uv 文档
- **THEN** 能够理解 uv 命令与 npm/pnpm 的对应关系

#### Scenario: 新手安装 uv

- **WHEN** 用户按照文档安装 uv
- **THEN** 能够成功安装并验证 uv 版本

### Requirement: 依赖工具总览页面

依赖工具总览页面 (`index.md`) SHALL 全面介绍 Python 生态中的主流依赖管理工具：

**1. 工具演进历史**
- 从 distutils → setuptools → pip 的演进
- 现代工具的兴起背景

**2. 主流工具对比表**

覆盖以下工具：
- pip - Python 内置包管理器
- Poetry - 成熟的项目管理工具
- uv - Rust 编写的高性能工具
- PDM - PEP 标准兼容工具
- Pipenv - 虚拟环境集成工具
- Hatch - 现代项目管理工具
- Conda - 科学计算生态工具

对比维度：
- 安装速度
- 依赖解析能力
- 虚拟环境管理
- 锁定文件支持
- 项目配置格式
- 打包发布能力
- 活跃度/社区支持

**3. 选择建议**
- 新手入门推荐
- 团队项目推荐
- 追求速度推荐
- 科学计算推荐

**4. 子页面导航**
- Poetry 详细教程链接
- uv 详细教程链接

#### Scenario: 用户了解 Python 依赖工具全貌

- **WHEN** 用户访问依赖工具总览页面
- **THEN** 能够看到市面上主流依赖工具的特性对比

#### Scenario: 用户选择合适的包管理器

- **WHEN** 用户根据对比表和选择建议
- **THEN** 能够根据自身项目需求选择最合适的工具

#### Scenario: 用户深入学习特定工具

- **WHEN** 用户想深入学习 Poetry 或 uv
- **THEN** 可以通过导航链接进入详细教程页面

## MODIFIED Requirements

### Requirement: 工程化工具概述导航

工程化工具概述页面 (`tooling/index.md`) SHALL 更新导航链接，将依赖管理指向新的目录结构：

- Poetry 链接更新为 `/backend/python/tooling/dependency-management/poetry`
- 新增 uv 链接 `/backend/python/tooling/dependency-management/uv`
- 新增依赖管理概述链接 `/backend/python/tooling/dependency-management/`

#### Scenario: 用户从工具概述页导航到依赖管理

- **WHEN** 用户在工具概述页点击依赖管理相关链接
- **THEN** 正确跳转到新的依赖管理目录下的页面

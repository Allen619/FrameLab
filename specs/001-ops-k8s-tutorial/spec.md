# Feature Specification: 运维模块 - Kubernetes 教学子模块

**Feature Branch**: `001-ops-k8s-tutorial`
**Created**: 2025-12-15
**Status**: Draft
**Input**: User description: "在现有站点中新增一个顶级大模块"运维"（Operations）。在此模块下，构建完整的 Kubernetes 教学子模块。内容需形成闭环，涵盖从 K8s 基础概念解析、Minikube 本地环境搭建，到进阶的云原生 CI/CD 流水线实践。目录结构需体现 运维 -> Kubernetes 的层级关系，确保物理文件隔离。"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - 零基础学习者理解 Kubernetes 核心概念 (Priority: P1)

作为一名对容器和编排技术完全陌生的前端/后端开发者，我希望通过图文并茂的教程理解 Kubernetes 是什么、为什么需要它、以及它的核心组件（Pod、Node、Service 等）是如何协作的，这样我就能建立起对 K8s 的整体认知框架。

**Why this priority**: 概念理解是所有后续实践的基础。没有清晰的概念认知，学习者无法理解后续的环境搭建和实际操作的意义。

**Independent Test**: 可以通过用户阅读完概念章节后，能否用自己的话解释"什么是 Pod"、"Pod 和容器的关系"等问题来验证。

**Acceptance Scenarios**:

1. **Given** 用户从未接触过 Kubernetes，**When** 用户阅读"K8s 是什么"章节，**Then** 用户能理解 K8s 解决的核心问题（容器编排、自动扩缩容、服务发现等）
2. **Given** 用户已了解 K8s 的作用，**When** 用户阅读核心组件章节，**Then** 用户能通过 Mermaid 图表理解 Pod、Node、Service、Deployment 等组件的关系
3. **Given** 用户阅读 Pod 生命周期章节，**When** 查看配套的状态图，**Then** 用户能理解 Pod 从创建到销毁的各个阶段及状态转换

---

### User Story 2 - 在本地搭建 Minikube 开发环境 (Priority: P2)

作为一名想要动手实践的开发者，我希望按照教程在本地 Windows/macOS/Linux 系统上成功安装和配置 Minikube，并运行我的第一个 Pod，这样我就能有一个可实验的本地 K8s 环境。

**Why this priority**: 实践环境是将理论转化为技能的必要条件。只有搭建好环境，学习者才能动手验证所学概念。

**Independent Test**: 用户按照教程步骤操作后，能够成功执行 `kubectl get nodes` 看到本地节点，并成功部署一个 nginx Pod。

**Acceptance Scenarios**:

1. **Given** 用户使用 Windows 系统（无 Docker 经验），**When** 用户按照 Windows 安装指南操作，**Then** 用户能成功安装 Minikube 并启动集群
2. **Given** 用户使用 macOS 系统，**When** 用户按照 macOS 安装指南操作，**Then** 用户能成功安装 Minikube 并启动集群
3. **Given** Minikube 已启动，**When** 用户执行教程提供的 kubectl 命令，**Then** 用户能成功部署、查看、删除 Pod

---

### User Story 3 - 理解并实践 Kubernetes 网络模型 (Priority: P3)

作为一名已搭建好本地环境的开发者，我希望理解 K8s 的网络模型（Pod 网络、Service 网络、Ingress），并能在本地环境中配置 Service 暴露应用，这样我就能理解服务之间如何通信。

**Why this priority**: 网络是 K8s 中最复杂但也最核心的部分之一。理解网络模型后，学习者才能构建多服务应用。

**Independent Test**: 用户能成功创建一个 ClusterIP Service 和一个 NodePort Service，并通过浏览器或 curl 访问到服务。

**Acceptance Scenarios**:

1. **Given** 用户已有运行中的 Pod，**When** 用户阅读 Service 章节并创建 ClusterIP Service，**Then** 用户能在集群内通过 Service 名称访问 Pod
2. **Given** 用户已创建 ClusterIP Service，**When** 用户按照教程创建 NodePort Service，**Then** 用户能从本机浏览器访问服务
3. **Given** 用户理解 Service 概念，**When** 用户阅读 Ingress 章节，**Then** 用户能理解 Ingress 的作用并配置简单的路由规则

---

### User Story 4 - 使用 Deployment 管理应用 (Priority: P4)

作为一名开发者，我希望学习如何使用 Deployment 来声明式地管理应用，包括滚动更新、回滚、扩缩容，这样我就能掌握生产环境中管理应用的方式。

**Why this priority**: Deployment 是 K8s 中最常用的工作负载资源，是实际生产中必须掌握的技能。

**Independent Test**: 用户能成功创建 Deployment、执行滚动更新、回滚到前一版本、手动扩缩容副本数。

**Acceptance Scenarios**:

1. **Given** 用户了解 Pod 概念，**When** 用户按照教程创建 Deployment，**Then** 用户能理解 Deployment 与 ReplicaSet、Pod 的关系
2. **Given** 用户已有运行中的 Deployment，**When** 用户更新镜像版本，**Then** 用户能观察到滚动更新过程并理解其原理
3. **Given** 滚动更新完成，**When** 用户执行回滚命令，**Then** 应用能成功恢复到前一版本

---

### User Story 5 - 配置管理与存储 (Priority: P5)

作为一名开发者，我希望学习如何使用 ConfigMap 和 Secret 管理配置，以及如何使用 PersistentVolume 持久化数据，这样我就能构建有状态的应用。

**Why this priority**: 配置管理和持久化存储是生产环境应用的基础需求，是从开发环境迈向生产环境的关键知识。

**Independent Test**: 用户能创建 ConfigMap/Secret 并注入到 Pod 中，能创建 PV/PVC 并挂载到 Pod 实现数据持久化。

**Acceptance Scenarios**:

1. **Given** 用户需要为应用配置环境变量，**When** 用户按照教程创建 ConfigMap，**Then** 用户能将配置注入到 Pod 中
2. **Given** 用户需要存储敏感信息，**When** 用户创建 Secret，**Then** 用户能安全地将密钥注入到 Pod 中
3. **Given** 用户需要持久化数据，**When** 用户配置 PV 和 PVC，**Then** Pod 重启后数据仍然存在

---

### User Story 6 - 云原生 CI/CD 流水线实践 (Priority: P6)

作为一名希望实现自动化部署的开发者，我希望学习如何构建一个完整的 CI/CD 流水线，从代码提交到自动构建镜像、推送到仓库、部署到 K8s 集群，这样我就能实现云原生的持续交付。

**Why this priority**: CI/CD 是 DevOps 的核心实践，是学习 K8s 的终极目标之一。这部分内容能让学习者将所学知识串联起来，形成完整的知识闭环。

**Independent Test**: 用户能按照教程搭建一个简化版的 CI/CD 流水线（使用 GitHub Actions），实现代码提交后自动部署到本地 Minikube。

**Acceptance Scenarios**:

1. **Given** 用户有一个简单的应用代码仓库，**When** 用户按照教程配置 GitHub Actions，**Then** 代码提交后能自动构建 Docker 镜像
2. **Given** 镜像构建成功，**When** 流水线执行部署步骤，**Then** 新版本能自动部署到 Minikube 集群
3. **Given** 用户完成整个 CI/CD 配置，**When** 用户提交代码变更，**Then** 用户能在几分钟内看到应用更新

---

### Edge Cases

- 用户本机 Minikube 安装失败（资源不足、虚拟化未开启）：教程需提供故障排查指南
- 用户网络环境导致镜像拉取失败：教程需提供国内镜像源配置方案
- 用户 kubectl 配置错误导致命令执行失败：教程需提供常见错误及解决方案
- 用户跳过前置章节直接阅读进阶内容：每个进阶章节需标注前置知识要求

## Requirements _(mandatory)_

### Functional Requirements

**目录结构要求**:

- **FR-001**: 系统 MUST 在 `docs/ops/` 目录下创建运维模块，作为顶级模块
- **FR-002**: 系统 MUST 在 `docs/ops/kubernetes/` 目录下创建 Kubernetes 子模块，体现 运维 -> Kubernetes 层级
- **FR-003**: 每个章节目录 MUST 包含 `index.md` 作为该章节的入口页面

**导航结构要求**:

- **FR-004**: 系统 MUST 在 VitePress 顶部导航栏添加"运维"入口
- **FR-005**: 系统 MUST 配置 `/ops/kubernetes/` 路径的侧边栏导航
- **FR-006**: 侧边栏 MUST 按照学习路径组织章节顺序（基础概念 → 环境搭建 → 核心组件 → 网络 → 存储 → CI/CD）

**内容要求**:

- **FR-007**: 所有复杂概念（Pod 生命周期、网络模型、Deployment 滚动更新流程）MUST 配有 Mermaid 图表
- **FR-008**: Mermaid 图表 MUST 使用纵向布局（TD/TB）以适应移动端阅读
- **FR-009**: 所有代码示例（YAML 配置、kubectl 命令）MUST 配有逐行注释
- **FR-010**: 首次出现的技术术语 MUST 配有通俗易懂的中文解释和日常类比
- **FR-011**: 每个实践章节 MUST 提供可直接复制执行的完整代码/命令

**移动端适配要求**:

- **FR-012**: 所有表格（如 kubectl 命令速查表）MUST 支持移动端横向滚动
- **FR-013**: 长 YAML 代码块 MUST 支持横向滚动，不导致页面整体横向滚动

**增量式开发要求**:

- **FR-014**: 实现过程 MUST NOT 修改现有的任何非新增文件
- **FR-015**: VitePress 配置文件 MUST 仅添加新的导航和侧边栏配置项，不修改现有配置

### Key Entities

- **模块 (Module)**: 顶级内容分类，如"运维"、"后端"、"AI"。对应 VitePress 顶部导航项和 docs 下的一级目录
- **子模块 (Submodule)**: 模块下的技术专题，如"Kubernetes"、"Python"。对应模块目录下的二级目录
- **章节 (Section)**: 子模块下的学习单元，如"基础概念"、"环境搭建"。对应侧边栏的分组
- **文档页 (Page)**: 最小内容单元，一个 Markdown 文件对应一个知识点

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 用户能在 10 分钟内从首页导航到 Kubernetes 教程并开始阅读第一个章节
- **SC-002**: 零基础用户能在 2 小时内完成"基础概念"章节的阅读并理解核心概念
- **SC-003**: 用户按照环境搭建教程操作，90% 的用户能在 30 分钟内成功启动 Minikube
- **SC-004**: 所有 Mermaid 图表在 320px 宽度的移动设备上可完整显示且文字可读
- **SC-005**: 所有代码块在移动端可通过横向滚动查看完整内容
- **SC-006**: 用户完成全部 6 个 User Story 后，能独立构建一个从代码到部署的完整 CI/CD 流程
- **SC-007**: 教程内容覆盖率达到 100%（6 个 User Story 全部有对应的文档内容）

## Assumptions

- 目标用户具备基本的命令行操作能力（会使用终端执行命令）
- 目标用户具备基本的编程知识（理解变量、函数等概念）
- 用户本机满足 Minikube 最低硬件要求（4GB 内存、2 CPU）
- 用户有稳定的网络环境或可配置国内镜像源
- 使用 GitHub Actions 作为 CI/CD 示例工具（免费且易于上手）

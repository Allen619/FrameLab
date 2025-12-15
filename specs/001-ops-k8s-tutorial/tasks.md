# Tasks: 运维模块 - Kubernetes 教学子模块

**Input**: Design documents from `/specs/001-ops-k8s-tutorial/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: 本项目为纯文档项目，不包含代码测试。验证方式为 VitePress 构建成功 + 移动端预览。

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **文档目录**: `docs/ops/kubernetes/`
- **配置文件**: `docs/.vitepress/config.mts`
- **图表规范**: Mermaid TD/TB 纵向布局

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 创建目录结构和基础配置

- [x] T001 创建运维模块目录结构 `docs/ops/`
- [x] T002 创建 Kubernetes 子模块目录结构 `docs/ops/kubernetes/` 及所有子目录 (concepts, setup, networking, workloads, storage, cicd)
- [x] T003 创建运维模块首页 `docs/ops/index.md`
- [x] T004 创建 Kubernetes 教程首页/学习路径 `docs/ops/kubernetes/index.md`
- [x] T005 更新 VitePress 配置，追加运维模块导航项 `docs/.vitepress/config.mts`
- [x] T006 更新 VitePress 配置，追加 Kubernetes 侧边栏配置 `docs/.vitepress/config.mts`

**Checkpoint**: 目录结构和导航配置完成，可以开始内容创建

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 创建所有章节的入口页面 (index.md)

**⚠️ CRITICAL**: 章节入口页为后续内容提供导航框架

- [x] T007 [P] 创建基础概念章节入口 `docs/ops/kubernetes/concepts/index.md`
- [x] T008 [P] 创建环境搭建章节入口 `docs/ops/kubernetes/setup/index.md`
- [x] T009 [P] 创建网络章节入口 `docs/ops/kubernetes/networking/index.md`
- [x] T010 [P] 创建工作负载章节入口 `docs/ops/kubernetes/workloads/index.md`
- [x] T011 [P] 创建存储章节入口 `docs/ops/kubernetes/storage/index.md`
- [x] T012 [P] 创建 CI/CD 章节入口 `docs/ops/kubernetes/cicd/index.md`

**Checkpoint**: Foundation ready - 所有章节入口页创建完成，用户故事内容可以开始并行实现

---

## Phase 3: User Story 1 - 零基础学习者理解 Kubernetes 核心概念 (Priority: P1) 🎯 MVP

**Goal**: 帮助零基础用户理解 K8s 是什么、核心组件关系、Pod 生命周期等基础概念

**Independent Test**: 用户阅读完概念章节后，能用自己的话解释"什么是 Pod"、"Pod 和容器的关系"

### Implementation for User Story 1

- [x] T013 [P] [US1] 创建"K8s 是什么"页面，含问题背景和解决方案说明 `docs/ops/kubernetes/concepts/what-is-k8s.md`
- [x] T014 [P] [US1] 创建"架构概览"页面，含 K8s 架构 Mermaid 图表 (TD 布局) `docs/ops/kubernetes/concepts/architecture.md`
- [x] T015 [P] [US1] 创建"Pod 详解"页面，含 Pod 与容器关系图表和生活类比 `docs/ops/kubernetes/concepts/pod.md`
- [x] T016 [P] [US1] 创建"Pod 生命周期"页面，含状态流转 Mermaid 图表 `docs/ops/kubernetes/concepts/pod-lifecycle.md`
- [x] T017 [P] [US1] 创建"核心组件"页面，含组件关系图表和术语表 `docs/ops/kubernetes/concepts/components.md`

**Checkpoint**: User Story 1 完成，零基础用户可独立完成概念学习

---

## Phase 4: User Story 2 - 在本地搭建 Minikube 开发环境 (Priority: P2)

**Goal**: 帮助用户在 Windows/macOS 上成功安装 Minikube 并运行第一个 Pod

**Independent Test**: 用户执行 `kubectl get nodes` 看到本地节点，成功部署 nginx Pod

### Implementation for User Story 2

- [x] T018 [P] [US2] 创建"前置要求"页面，含硬件/软件要求清单 `docs/ops/kubernetes/setup/prerequisites.md`
- [x] T019 [P] [US2] 创建"Windows 安装"页面，含详细步骤和国内镜像配置 `docs/ops/kubernetes/setup/minikube-windows.md`
- [x] T020 [P] [US2] 创建"macOS 安装"页面，含 Homebrew 安装步骤 `docs/ops/kubernetes/setup/minikube-macos.md`
- [x] T021 [P] [US2] 创建"kubectl 基础"页面，含常用命令速查表 `docs/ops/kubernetes/setup/kubectl-basics.md`
- [x] T022 [US2] 创建"第一个 Pod"页面，含完整的 nginx Pod 创建教程 (依赖 T021) `docs/ops/kubernetes/setup/first-pod.md`
- [x] T023 [US2] 创建"故障排查"页面，含常见错误和解决方案 (依赖 T019, T020) `docs/ops/kubernetes/setup/troubleshooting.md`

**Checkpoint**: User Story 2 完成，用户可独立完成环境搭建

---

## Phase 5: User Story 3 - 理解并实践 Kubernetes 网络模型 (Priority: P3)

**Goal**: 帮助用户理解 K8s 网络模型，并配置 Service 暴露应用

**Independent Test**: 用户成功创建 ClusterIP 和 NodePort Service，通过浏览器访问服务

### Implementation for User Story 3

- [x] T024 [P] [US3] 创建"网络模型"页面，含 K8s 网络架构 Mermaid 图表 `docs/ops/kubernetes/networking/network-model.md`
- [x] T025 [P] [US3] 创建"ClusterIP Service"页面，含 Service 工作原理图和 YAML 示例 `docs/ops/kubernetes/networking/service-clusterip.md`
- [x] T026 [US3] 创建"NodePort Service"页面，含端口映射图和外部访问配置 `docs/ops/kubernetes/networking/service-nodeport.md`
- [x] T027 [US3] 创建"Ingress 入门"页面，含 HTTP 路由配置示例 `docs/ops/kubernetes/networking/ingress.md`

**Checkpoint**: User Story 3 完成，用户可独立完成网络配置学习

---

## Phase 6: User Story 4 - 使用 Deployment 管理应用 (Priority: P4)

**Goal**: 帮助用户掌握 Deployment 的声明式管理，包括滚动更新、回滚、扩缩容

**Independent Test**: 用户成功创建 Deployment、执行滚动更新、回滚版本、手动扩缩容

### Implementation for User Story 4

- [x] T028 [P] [US4] 创建"Deployment 详解"页面，含 Deployment/ReplicaSet/Pod 关系图 `docs/ops/kubernetes/workloads/deployment.md`
- [x] T029 [P] [US4] 创建"滚动更新"页面，含更新过程 Mermaid 图表和命令示例 `docs/ops/kubernetes/workloads/rolling-update.md`
- [x] T030 [US4] 创建"版本回滚"页面，含回滚命令和历史版本管理 `docs/ops/kubernetes/workloads/rollback.md`
- [x] T031 [US4] 创建"扩缩容"页面，含手动和自动扩缩容配置 `docs/ops/kubernetes/workloads/scaling.md`

**Checkpoint**: User Story 4 完成，用户可独立完成工作负载管理学习

---

## Phase 7: User Story 5 - 配置管理与存储 (Priority: P5)

**Goal**: 帮助用户使用 ConfigMap/Secret 管理配置，使用 PersistentVolume 持久化数据

**Independent Test**: 用户成功创建 ConfigMap/Secret 注入 Pod，创建 PV/PVC 实现数据持久化

### Implementation for User Story 5

- [x] T032 [P] [US5] 创建"ConfigMap"页面，含配置注入方式和 YAML 示例 `docs/ops/kubernetes/storage/configmap.md`
- [x] T033 [P] [US5] 创建"Secret"页面，含安全存储实践和加密说明 `docs/ops/kubernetes/storage/secret.md`
- [x] T034 [US5] 创建"持久化存储"页面，含 PV/PVC/StorageClass 概念图和配置示例 `docs/ops/kubernetes/storage/persistent-volume.md`

**Checkpoint**: User Story 5 完成，用户可独立完成存储配置学习

---

## Phase 8: User Story 6 - 云原生 CI/CD 流水线实践 (Priority: P6)

**Goal**: 帮助用户构建完整的 CI/CD 流水线，从代码提交到自动部署 K8s

**Independent Test**: 用户按教程配置 GitHub Actions，实现代码提交后自动部署到 Minikube

### Implementation for User Story 6

- [x] T035 [P] [US6] 创建"CI/CD 概览"页面，含流水线架构 Mermaid 图表 `docs/ops/kubernetes/cicd/overview.md`
- [x] T036 [P] [US6] 创建"Docker 镜像构建"页面，含 Dockerfile 最佳实践和多阶段构建 `docs/ops/kubernetes/cicd/docker-build.md`
- [x] T037 [US6] 创建"GitHub Actions"页面，含完整工作流 YAML 配置 `docs/ops/kubernetes/cicd/github-actions.md`
- [x] T038 [US6] 创建"部署到 K8s"页面，含 kubectl apply 自动化和部署策略 `docs/ops/kubernetes/cicd/deploy-to-k8s.md`

**Checkpoint**: User Story 6 完成，用户可独立完成 CI/CD 流水线学习

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: 全局验证和优化

- [x] T039 运行 `npm run build` 验证所有页面构建成功
- [x] T040 [P] 验证所有内部链接可访问
- [x] T041 [P] 验证所有 Mermaid 图表在移动端 (320px) 正常显示
- [x] T042 [P] 验证所有代码块在移动端支持横向滚动
- [x] T043 检查所有术语首次出现时有中文解释和类比
- [x] T044 运行 quickstart.md 验证流程

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4 → P5 → P6)
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - 建议在 US1 后实施（概念→实践）
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - 依赖 US2 环境已搭建
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - 依赖 US2 环境已搭建
- **User Story 5 (P5)**: Can start after Foundational (Phase 2) - 依赖 US4 Deployment 知识
- **User Story 6 (P6)**: Can start after Foundational (Phase 2) - 依赖 US4/US5 知识

### Within Each User Story

- 所有标记 [P] 的任务可以并行执行
- 无 [P] 标记的任务需按顺序执行
- 每个 User Story 完成后可独立验证

### Parallel Opportunities

- **Phase 2**: 所有章节入口页 (T007-T012) 可以并行创建
- **Phase 3 (US1)**: 所有概念页面 (T013-T017) 可以并行创建
- **Phase 4 (US2)**: T018-T021 可以并行，T022-T023 需在前置完成后执行
- **Phase 5 (US3)**: T024-T025 可以并行
- **Phase 6 (US4)**: T028-T029 可以并行
- **Phase 7 (US5)**: T032-T033 可以并行
- **Phase 8 (US6)**: T035-T036 可以并行

---

## Parallel Example: Phase 3 (User Story 1)

```bash
# Launch all US1 content pages together:
Task: "T013 [P] [US1] 创建 K8s 是什么页面 docs/ops/kubernetes/concepts/what-is-k8s.md"
Task: "T014 [P] [US1] 创建架构概览页面 docs/ops/kubernetes/concepts/architecture.md"
Task: "T015 [P] [US1] 创建 Pod 详解页面 docs/ops/kubernetes/concepts/pod.md"
Task: "T016 [P] [US1] 创建 Pod 生命周期页面 docs/ops/kubernetes/concepts/pod-lifecycle.md"
Task: "T017 [P] [US1] 创建核心组件页面 docs/ops/kubernetes/concepts/components.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T006)
2. Complete Phase 2: Foundational (T007-T012)
3. Complete Phase 3: User Story 1 (T013-T017)
4. **STOP and VALIDATE**: `npm run build` + 移动端预览
5. Deploy/demo if ready - 零基础用户可开始学习基础概念

### Incremental Delivery

1. Complete Setup + Foundational → 站点框架就绪
2. Add User Story 1 → 验证 → 可发布 MVP（基础概念）
3. Add User Story 2 → 验证 → 可发布（环境搭建）
4. Add User Story 3 → 验证 → 可发布（网络）
5. Add User Story 4 → 验证 → 可发布（工作负载）
6. Add User Story 5 → 验证 → 可发布（存储）
7. Add User Story 6 → 验证 → 可发布（CI/CD）
8. Complete Polish → 全面验证 → 最终发布

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (概念)
   - Developer B: User Story 2 (环境)
3. After US1/US2 complete:
   - Developer A: User Story 3 (网络)
   - Developer B: User Story 4 (工作负载)
4. Final stories:
   - Developer A: User Story 5 (存储)
   - Developer B: User Story 6 (CI/CD)

---

## Summary

| 统计项 | 数量 |
| ------ | ---- |
| 总任务数 | 44 |
| Phase 1 Setup | 6 |
| Phase 2 Foundational | 6 |
| Phase 3 US1 (P1) | 5 |
| Phase 4 US2 (P2) | 6 |
| Phase 5 US3 (P3) | 4 |
| Phase 6 US4 (P4) | 4 |
| Phase 7 US5 (P5) | 3 |
| Phase 8 US6 (P6) | 4 |
| Phase 9 Polish | 6 |
| 可并行任务 | 26 |
| Markdown 文件总数 | 32 |

---

## Notes

- [P] tasks = 不同文件，无依赖关系，可并行执行
- [Story] label = 任务归属的用户故事，便于追踪
- 每个用户故事可独立完成和验证
- 每个任务完成后执行 `npm run build` 验证
- 提交粒度：每个任务或逻辑任务组完成后提交
- 在任何 Checkpoint 停止都可以独立验证该阶段

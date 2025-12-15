# Research: 运维模块 - Kubernetes 教学子模块

**Feature**: 001-ops-k8s-tutorial
**Date**: 2025-12-15
**Status**: Complete

## Research Tasks

### 1. Kubernetes 核心概念准确性

**研究目标**: 确保 Pod 生命周期、Service 类型等核心概念与 Kubernetes 官方文档一致

**发现**:

根据 Kubernetes 官方文档 (kubernetes.io)：

1. **Pod 生命周期阶段**:
   - `Pending`: Pod 已被 Kubernetes 系统接受，但容器镜像尚未创建
   - `Running`: Pod 已绑定到节点，所有容器都已创建，至少有一个容器正在运行
   - `Succeeded`: Pod 中的所有容器都已成功终止，不会重启
   - `Failed`: Pod 中的所有容器都已终止，且至少有一个容器以失败状态终止
   - `Unknown`: 无法获取 Pod 状态，通常是与节点通信失败

2. **Service 类型**:
   - `ClusterIP`: 默认类型，在集群内部 IP 上暴露服务
   - `NodePort`: 在每个节点的 IP 上以静态端口暴露服务
   - `LoadBalancer`: 使用云提供商的负载均衡器向外暴露服务
   - `ExternalName`: 将服务映射到外部 DNS 名称

**决策**: 采用官方文档的准确定义，用通俗语言解释

**替代方案**: 无，必须保持与官方一致

---

### 2. Mermaid.js 移动端优化

**研究目标**: 确定 Mermaid 图表在移动端的最佳布局方式

**发现**:

根据 Mermaid.js 官方文档：

1. **布局方向选项**:
   - `TB` / `TD`: Top to Bottom / Top Down（纵向，推荐移动端）
   - `BT`: Bottom to Top
   - `LR`: Left to Right（横向，不推荐移动端）
   - `RL`: Right to Left

2. **纵向布局优势**:
   - 在窄屏设备上自然适应垂直滚动
   - 避免横向滚动体验问题
   - 节点文字更容易阅读

3. **最佳实践**:
   ```mermaid
   flowchart TD
       A[开始] --> B[处理]
       B --> C{判断}
       C -->|是| D[结果A]
       C -->|否| E[结果B]
   ```

**决策**:
- 所有流程图使用 `flowchart TD` 或 `flowchart TB`
- 状态图使用 `stateDiagram-v2`
- 序列图保持默认（天然适合纵向）
- 单个图表节点数限制在 15 个以内
- 复杂流程拆分为多个简化图表

**替代方案**: 使用 LR 布局 + 移动端隐藏，但这会降低移动端用户体验，已拒绝

---

### 3. VitePress 导航配置方式

**研究目标**: 确定如何在不修改现有配置的情况下添加运维模块导航

**发现**:

当前 VitePress 配置结构 (`docs/.vitepress/config.mts`):

```typescript
themeConfig: {
  nav: [
    { text: '首页', link: '/' },
    { text: '前端', link: '/frontend/' },
    { text: '后端', items: [{ text: 'Python', link: '/backend/python/' }] },
    { text: 'AI', items: [{ text: 'LangChain', link: '/ai/langchain/' }] },
  ],
  sidebar: {
    '/frontend/': [...],
    '/backend/python/': [...],
    '/ai/langchain/': [...],
  }
}
```

**决策**:
- 在 `nav` 数组末尾追加运维导航项
- 在 `sidebar` 对象中添加 `/ops/kubernetes/` 键
- 遵循增量式开发原则，仅追加不修改

**配置追加方案**:
```typescript
// nav 追加
{ text: '运维', items: [{ text: 'Kubernetes', link: '/ops/kubernetes/' }] }

// sidebar 追加
'/ops/kubernetes/': [
  { text: '📍 学习路径', link: '/ops/kubernetes/' },
  { text: '基础概念', items: [...] },
  { text: '环境搭建', items: [...] },
  // ...
]
```

**替代方案**: 创建独立配置文件后合并，但增加了复杂性，已拒绝

---

### 4. 国内镜像源配置

**研究目标**: 为中国用户提供镜像拉取解决方案

**发现**:

1. **常用国内镜像源**:
   - 阿里云: `registry.cn-hangzhou.aliyuncs.com`
   - 腾讯云: `ccr.ccs.tencentyun.com`
   - Docker Hub 镜像: `docker.mirrors.ustc.edu.cn`

2. **Minikube 配置方法**:
   ```bash
   minikube start --image-mirror-country='cn'
   ```

   或手动配置:
   ```bash
   minikube start --registry-mirror=https://registry.cn-hangzhou.aliyuncs.com
   ```

**决策**:
- 在环境搭建章节提供国内镜像配置说明
- 在故障排查章节详细说明镜像拉取失败的解决方案
- 提供多个镜像源选项供用户选择

**替代方案**: 不提供镜像源配置，但这会导致大量中国用户无法完成教程，已拒绝

---

### 5. 内容深度与零基础平衡

**研究目标**: 确定如何在保持技术准确性的同时面向零基础用户

**发现**:

参考现有 Python 教程的写作风格：
- 使用日常生活类比解释技术概念
- 代码示例配有逐行注释
- 渐进式内容组织（简单到复杂）
- 避免假设用户有先验知识

**决策**:

采用"三层解释法"：
1. **一句话定义**: 用最简单的语言定义概念
2. **生活类比**: 用日常生活场景类比
3. **技术细节**: 深入技术实现

示例 - Pod 概念：
> **Pod** 是 Kubernetes 中最小的部署单元。
>
> 💡 **生活类比**: 想象 Pod 是一个"合租公寓"，里面可以住一个或多个"室友"（容器）。这些室友共享同一个地址（IP）、同一个冰箱（存储卷）、可以直接喊话交流（localhost 通信）。
>
> **技术细节**: Pod 封装了一个或多个容器、存储资源、唯一的网络 IP，以及控制容器运行方式的选项...

**替代方案**: 直接使用技术文档风格，但这不符合零基础受众需求，已拒绝

---

## Research Summary

| 研究项 | 决策 | 理由 |
| ------ | ---- | ---- |
| K8s 核心概念 | 遵循官方文档定义 + 通俗解释 | 保证准确性同时提升可读性 |
| Mermaid 布局 | TD/TB 纵向布局 | 移动端最佳体验 |
| VitePress 配置 | 追加导航和侧边栏 | 符合增量式开发原则 |
| 国内镜像 | 提供多镜像源配置 | 确保中国用户可用性 |
| 内容风格 | 三层解释法 | 平衡准确性和可读性 |

## Unresolved Items

无。所有研究问题已解决。

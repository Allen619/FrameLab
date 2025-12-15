---
title: 故障排查 | Kubernetes 教程
description: Kubernetes 常见问题及解决方案，帮助你快速定位和解决安装、运行中的问题
---

# 故障排查

本节收集了 Kubernetes 学习过程中常见的问题和解决方案。

## Minikube 相关问题

### 问题：Minikube 启动失败

**症状**：执行 `minikube start` 后报错

**解决方案**：

#### 1. Docker Desktop 未运行

```bash
# 错误信息
# ❌  Exiting due to PROVIDER_DOCKER_NOT_RUNNING

# 解决：启动 Docker Desktop
# Windows: 从开始菜单启动 Docker Desktop
# macOS: 从应用程序启动 Docker
```

#### 2. 资源不足

```bash
# 错误信息
# ❌  Exiting due to RSRC_INSUFFICIENT_CORES

# 解决：减少资源要求
minikube start --cpus=2 --memory=2048
```

#### 3. 之前的集群状态损坏

```bash
# 删除并重建
minikube delete
minikube start --driver=docker
```

### 问题：镜像拉取失败

**症状**：Pod 状态一直是 `ImagePullBackOff` 或 `ErrImagePull`

**解决方案**：

```bash
# 查看详细错误
kubectl describe pod <pod-name>

# 错误信息示例
# Failed to pull image "nginx:1.21": rpc error: code = Unknown desc = Error response from daemon:
# Get "https://registry-1.docker.io/v2/": net/http: request canceled while waiting for connection
```

#### 使用国内镜像源

```bash
# 停止并删除 Minikube
minikube delete

# 使用阿里云镜像启动
minikube start --driver=docker \
  --image-mirror-country=cn \
  --registry-mirror=https://registry.cn-hangzhou.aliyuncs.com
```

#### 手动指定镜像源

在 Pod 定义中使用国内镜像：

```yaml
spec:
  containers:
  - name: nginx
    # 使用阿里云镜像
    image: registry.cn-hangzhou.aliyuncs.com/google_containers/nginx:1.21
```

## Pod 相关问题

### 问题：Pod 状态为 Pending

**症状**：`kubectl get pods` 显示状态一直是 `Pending`

**排查步骤**：

```bash
# 1. 查看详细信息
kubectl describe pod <pod-name>

# 2. 查看 Events 部分，常见原因：
```

| 事件信息 | 原因 | 解决方案 |
|----------|------|----------|
| `0/1 nodes available: insufficient cpu` | CPU 不足 | 增加节点资源或减少 Pod 请求 |
| `0/1 nodes available: insufficient memory` | 内存不足 | 增加节点资源或减少 Pod 请求 |
| `no nodes available to schedule pods` | 没有可用节点 | 检查节点状态 |

### 问题：Pod 状态为 CrashLoopBackOff

**症状**：Pod 不断重启

**排查步骤**：

```bash
# 1. 查看日志
kubectl logs <pod-name>

# 2. 查看上一次容器的日志
kubectl logs <pod-name> --previous

# 3. 查看 Pod 事件
kubectl describe pod <pod-name>
```

**常见原因**：

| 原因 | 解决方案 |
|------|----------|
| 应用程序崩溃 | 检查日志，修复代码 |
| 配置错误 | 检查 ConfigMap、Secret 配置 |
| 资源限制 | 增加 memory/cpu limits |
| 健康检查失败 | 调整探针配置 |

### 问题：Pod 无法访问

**症状**：`kubectl port-forward` 或 Service 无法访问 Pod

**排查步骤**：

```bash
# 1. 确认 Pod 正在运行
kubectl get pods

# 2. 确认容器端口配置正确
kubectl describe pod <pod-name>

# 3. 进入 Pod 测试服务
kubectl exec -it <pod-name> -- curl localhost:80

# 4. 检查 Service 配置
kubectl get svc
kubectl describe svc <service-name>
```

## kubectl 相关问题

### 问题：kubectl 命令无响应

**症状**：执行任何 kubectl 命令都没有响应或报错

**解决方案**：

```bash
# 1. 检查 Minikube 状态
minikube status

# 如果状态不是 Running
minikube start

# 2. 重置 kubectl 配置
minikube update-context

# 3. 检查网络连接
kubectl cluster-info
```

### 问题：权限不足

**症状**：报错 `Error from server (Forbidden)`

**解决方案**：

```bash
# 在 Minikube 中通常不会有权限问题
# 如果有，检查当前上下文
kubectl config current-context

# 应该显示 minikube
```

## 网络相关问题

### 问题：Service 无法访问

**排查步骤**：

```bash
# 1. 检查 Service
kubectl get svc

# 2. 检查 Endpoints
kubectl get endpoints <service-name>

# 如果 Endpoints 为空，说明 Service 没有匹配到 Pod

# 3. 检查 Service selector 和 Pod labels
kubectl describe svc <service-name>
kubectl get pods --show-labels

# 确保 selector 和 labels 匹配
```

### 问题：NodePort 无法从外部访问

```bash
# 获取 Minikube IP
minikube ip

# 获取 NodePort
kubectl get svc <service-name>

# 使用 Minikube service 命令直接访问
minikube service <service-name>
```

## 调试技巧

### 1. 获取 Pod 的 YAML 配置

```bash
kubectl get pod <pod-name> -o yaml
```

### 2. 实时查看事件

```bash
kubectl get events --watch
```

### 3. 临时运行调试容器

```bash
# 运行一个临时的调试 Pod
kubectl run debug --image=busybox --rm -it -- sh

# 在 debug Pod 中测试网络
wget -qO- http://<service-name>
nslookup <service-name>
```

### 4. 查看资源使用情况

```bash
# 需要先启用 metrics-server
minikube addons enable metrics-server

# 查看 Pod 资源使用
kubectl top pods

# 查看节点资源使用
kubectl top nodes
```

## 日志收集

### 收集诊断信息

```bash
# 导出 Minikube 日志
minikube logs > minikube.log

# 导出 Pod 日志
kubectl logs <pod-name> > pod.log

# 导出 Pod 描述
kubectl describe pod <pod-name> > pod-describe.log

# 导出所有资源
kubectl get all -A > all-resources.log
```

## 重置环境

如果问题无法解决，可以尝试重置整个环境：

```bash
# 停止 Minikube
minikube stop

# 删除 Minikube 集群
minikube delete

# 清理所有 Minikube 数据
minikube delete --all --purge

# 重新创建集群
minikube start --driver=docker
```

## 常见错误速查表

| 错误 | 可能原因 | 解决方案 |
|------|----------|----------|
| `ImagePullBackOff` | 镜像拉取失败 | 检查镜像名称、网络、配置镜像源 |
| `CrashLoopBackOff` | 容器不断崩溃 | 查看日志找出崩溃原因 |
| `Pending` | 无法调度 | 检查资源是否充足 |
| `CreateContainerError` | 容器创建失败 | 查看 describe 输出 |
| `ContainerCreating` | 正在创建容器 | 等待，或检查 PVC 挂载 |
| `connection refused` | 服务未启动 | 检查 Minikube 和服务状态 |

## 小结

- 使用 `kubectl describe` 查看详细信息和事件
- 使用 `kubectl logs` 查看容器日志
- 网络问题先检查 Service 和 Endpoints
- 镜像问题考虑使用国内镜像源
- 无法解决时可以重置 Minikube 环境

## 下一步

恭喜你完成了环境搭建章节！现在你已经有了一个可用的本地 K8s 环境。

接下来，让我们学习 K8s 的网络模型。

[下一章：网络](/ops/kubernetes/networking/)

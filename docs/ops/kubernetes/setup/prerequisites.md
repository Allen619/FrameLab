---
title: 前置要求 | Kubernetes 教程
description: 检查搭建 Kubernetes 本地开发环境所需的硬件和软件要求
---

# 前置要求

在开始搭建 Kubernetes 本地环境之前，请确保你的电脑满足以下要求。

## 硬件要求

运行 Minikube（本地 K8s 集群）的最低硬件配置：

| 资源 | 最低要求 | 推荐配置 |
|------|----------|----------|
| CPU | 2 核 | 4 核 |
| 内存 | 4 GB | 8 GB |
| 硬盘空间 | 20 GB | 40 GB |

> 💡 **提示**：如果内存不足，Minikube 可能会运行缓慢或无法启动。可以尝试减少 Minikube 的内存配置。

## 软件要求

### 1. 虚拟化支持

Minikube 需要虚拟化技术支持。根据你的操作系统选择对应的虚拟化方案。

**Windows**：

| 方案 | 说明 |
|------|------|
| Hyper-V | Windows 自带（推荐 Windows 10/11 专业版） |
| Docker Desktop | 包含虚拟化支持（推荐家庭版用户） |
| VirtualBox | 第三方虚拟化软件 |

**macOS**：

| 方案 | 说明 |
|------|------|
| Docker Desktop | 推荐方式 |
| HyperKit | 轻量级虚拟化 |
| VirtualBox | 第三方虚拟化软件 |

### 2. 检查虚拟化是否启用

**Windows**：

```powershell
# 打开 PowerShell，运行以下命令
systeminfo | findstr /i "Hyper-V"

# 如果看到 "Hyper-V Requirements: A hypervisor has been detected"
# 或者 "已检测到虚拟机监控程序"，说明虚拟化已启用
```

**macOS**：

```bash
# 打开终端，运行以下命令
sysctl -a | grep machdep.cpu.features | grep VMX

# 如果输出包含 VMX，说明支持虚拟化
```

### 3. 终端环境

你需要一个命令行终端来执行 kubectl 命令：

| 系统 | 推荐终端 |
|------|----------|
| Windows | Windows Terminal、PowerShell |
| macOS | Terminal、iTerm2 |

## 网络要求

安装过程需要从网络下载软件包和容器镜像：

- **稳定的网络连接**
- **如果在中国大陆**：可能需要配置镜像源（后续章节会详细说明）

## 检查清单

在开始安装前，请确认以下项目：

- [ ] CPU 至少 2 核
- [ ] 内存至少 4 GB
- [ ] 硬盘空间至少 20 GB
- [ ] 虚拟化已启用
- [ ] 有终端环境
- [ ] 网络连接正常

## 常见问题

### Q: 我的电脑内存只有 4GB，能运行吗？

可以尝试，但可能会比较慢。建议：
1. 关闭其他占用内存的程序
2. 启动 Minikube 时指定较小的内存：`minikube start --memory=2048`

### Q: 虚拟化没有启用怎么办？

**Windows**：
1. 重启电脑，进入 BIOS/UEFI 设置
2. 找到 Virtualization Technology（或 VT-x、AMD-V）
3. 将其设置为 Enabled
4. 保存并重启

**macOS**：
- 现代 Mac 默认支持虚拟化，无需额外配置

### Q: 没有专业版 Windows，能用 Hyper-V 吗？

Windows 家庭版不支持 Hyper-V。建议使用 Docker Desktop 作为替代方案。

## 下一步

确认满足前置要求后，根据你的操作系统选择对应的安装指南：

- [Windows 安装指南](/ops/kubernetes/setup/minikube-windows)
- [macOS 安装指南](/ops/kubernetes/setup/minikube-macos)

---
title: Secret | Kubernetes 教程
description: 学习使用 Secret 安全存储敏感数据，如密码、API 密钥和证书
---

# Secret

**Secret**（密钥）用于存储敏感数据，如密码、OAuth 令牌、SSH 密钥和 TLS 证书。

## 前置知识

> 💡 阅读本章前，请确保已完成：
> - [ConfigMap](/ops/kubernetes/storage/configmap) - 理解配置管理基础

## Secret vs ConfigMap

| 特性 | ConfigMap | Secret |
|------|-----------|--------|
| 数据类型 | 非敏感配置 | 敏感数据 |
| 存储方式 | 明文 | Base64 编码 |
| 内存存储 | 否 | 是（tmpfs） |
| 大小限制 | 1MB | 1MB |

> ⚠️ **重要**：Secret 的 Base64 编码**不是加密**。生产环境需要额外的安全措施（如 Vault、加密 etcd）。

## Secret 类型

| 类型 | 说明 |
|------|------|
| `Opaque` | 通用类型（默认） |
| `kubernetes.io/basic-auth` | 用户名密码 |
| `kubernetes.io/ssh-auth` | SSH 密钥 |
| `kubernetes.io/tls` | TLS 证书 |
| `kubernetes.io/dockerconfigjson` | Docker 仓库凭证 |
| `kubernetes.io/service-account-token` | ServiceAccount 令牌 |

## 创建 Secret

### 方式 1：命令行创建

```bash
# 从字面量创建（自动 Base64 编码）
kubectl create secret generic db-secret \
  --from-literal=username=admin \
  --from-literal=password=secretpassword

# 从文件创建
kubectl create secret generic tls-secret \
  --from-file=tls.crt \
  --from-file=tls.key

# 创建 Docker 仓库凭证
kubectl create secret docker-registry my-registry \
  --docker-server=registry.example.com \
  --docker-username=user \
  --docker-password=password \
  --docker-email=user@example.com
```

### 方式 2：YAML 文件创建

```yaml
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
data:
  # 值必须是 Base64 编码
  username: YWRtaW4=            # echo -n "admin" | base64
  password: c2VjcmV0cGFzc3dvcmQ=  # echo -n "secretpassword" | base64
```

#### 使用 stringData（自动编码）

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
stringData:                     # 明文，创建时自动编码
  username: admin
  password: secretpassword
```

```bash
kubectl apply -f secret.yaml
```

### Base64 编码/解码

```bash
# 编码
echo -n "mypassword" | base64
# 输出：bXlwYXNzd29yZA==

# 解码
echo "bXlwYXNzd29yZA==" | base64 -d
# 输出：mypassword
```

## 查看 Secret

```bash
# 列出所有 Secret
kubectl get secrets

# 查看 Secret 详情（不显示值）
kubectl describe secret db-secret

# 查看 Secret 内容（Base64 编码）
kubectl get secret db-secret -o yaml

# 解码查看实际值
kubectl get secret db-secret -o jsonpath='{.data.password}' | base64 -d
```

## 使用 Secret

### 方式 1：作为环境变量

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-env-pod
spec:
  containers:
  - name: app
    image: nginx
    env:
    - name: DB_USERNAME           # 环境变量名
      valueFrom:
        secretKeyRef:
          name: db-secret         # Secret 名称
          key: username           # Secret 中的 key
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: db-secret
          key: password
```

#### 引用所有值

```yaml
spec:
  containers:
  - name: app
    image: nginx
    envFrom:
    - secretRef:
        name: db-secret           # 导入所有键值对
```

### 方式 2：作为 Volume 挂载

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-volume-pod
spec:
  containers:
  - name: app
    image: nginx
    volumeMounts:
    - name: secret-volume
      mountPath: /etc/secrets     # 挂载路径
      readOnly: true
  volumes:
  - name: secret-volume
    secret:
      secretName: db-secret
```

挂载后，每个 key 变成文件：
```
/etc/secrets/
├── username    # 文件内容：admin（已解码）
└── password    # 文件内容：secretpassword（已解码）
```

### 设置文件权限

```yaml
volumes:
- name: secret-volume
  secret:
    secretName: db-secret
    defaultMode: 0400            # 设置文件权限
```

## TLS Secret

### 创建 TLS Secret

```bash
# 生成自签名证书（测试用）
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout tls.key -out tls.crt \
  -subj "/CN=example.com"

# 创建 TLS Secret
kubectl create secret tls tls-secret \
  --cert=tls.crt \
  --key=tls.key
```

### YAML 方式

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: tls-secret
type: kubernetes.io/tls
data:
  tls.crt: <base64 编码的证书>
  tls.key: <base64 编码的私钥>
```

## Docker 仓库凭证

### 创建凭证

```bash
kubectl create secret docker-registry regcred \
  --docker-server=https://registry.example.com \
  --docker-username=user \
  --docker-password=password
```

### 在 Pod 中使用

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: private-image-pod
spec:
  containers:
  - name: app
    image: registry.example.com/myapp:latest
  imagePullSecrets:              # 指定拉取镜像的凭证
  - name: regcred
```

## 实战练习：数据库连接配置

```yaml
# db-connection.yaml
---
# 数据库凭证 Secret
apiVersion: v1
kind: Secret
metadata:
  name: mysql-secret
type: Opaque
stringData:
  MYSQL_ROOT_PASSWORD: rootpassword
  MYSQL_USER: appuser
  MYSQL_PASSWORD: apppassword
---
# 应用 Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-with-db
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: app
        image: nginx
        env:
        - name: DB_HOST
          value: mysql-service
        - name: DB_USER
          valueFrom:
            secretKeyRef:
              name: mysql-secret
              key: MYSQL_USER
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-secret
              key: MYSQL_PASSWORD
```

```bash
# 部署
kubectl apply -f db-connection.yaml

# 验证环境变量
kubectl exec -it $(kubectl get pod -l app=myapp -o jsonpath='{.items[0].metadata.name}') \
  -- env | grep DB_
```

## Secret 安全最佳实践

1. **启用 etcd 加密**
   ```yaml
   # 在 API Server 配置加密
   encryptionConfig:
     resources:
     - resources:
       - secrets
       providers:
       - aescbc:
           keys:
           - name: key1
             secret: <base64-encoded-secret>
   ```

2. **使用 RBAC 限制访问**
   ```yaml
   apiVersion: rbac.authorization.k8s.io/v1
   kind: Role
   metadata:
     name: secret-reader
   rules:
   - apiGroups: [""]
     resources: ["secrets"]
     resourceNames: ["my-secret"]
     verbs: ["get"]
   ```

3. **使用外部密钥管理**
   - HashiCorp Vault
   - AWS Secrets Manager
   - Azure Key Vault

4. **审计 Secret 访问**
   - 启用 Kubernetes 审计日志

5. **定期轮换 Secret**
   - 自动化轮换流程
   - 使用 external-secrets-operator

## 小结

- **Secret** 用于存储敏感数据
- 数据以 **Base64 编码**存储（不是加密！）
- 两种使用方式：**环境变量**和 **Volume 挂载**
- 生产环境需要额外安全措施
- 遵循**最小权限原则**

## 下一步

学完配置管理后，让我们来看看如何持久化存储数据。

[下一节：持久化存储](/ops/kubernetes/storage/persistent-volume)

---
title: Django - 全栈 Web 框架
description: Python Django Web 框架概述与快速入门
---

# Django 全栈框架

## 本章目标

- 理解 Django 的设计理念
- 掌握 Django 项目结构
- 学习 MTV 架构模式
- 对比 Node.js 全栈框架

## 对比

| Django | Node.js | 说明 |
|--------|---------|------|
| Django | Next.js/Nest.js | 全栈框架 |
| ORM | Prisma/Sequelize | 数据库 |
| Template | React/Vue | 视图层 |
| Admin | 手动构建 | 后台管理 |

## 安装

```bash
pip install django

# poetry
poetry add django

# 创建项目
django-admin startproject myproject
cd myproject

# 运行开发服务器
python manage.py runserver
```

## Django 设计理念

### 电池全包含 (Batteries Included)

```python
# Django 内置功能对比 Express
"""
Django 内置:
- ORM (数据库)
- Admin (后台)
- Auth (认证)
- Forms (表单)
- Templates (模板)
- Migrations (迁移)

Express 需要:
- Prisma/Sequelize (数据库)
- 手动构建 (后台)
- Passport (认证)
- express-validator (验证)
- EJS/Handlebars (模板)
- Knex (迁移)
"""
```

### DRY 原则

```python
# Django 强调代码复用
# 定义一次模型，自动生成表单、Admin、API

from django.db import models

class Article(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

# 自动获得:
# - 数据库迁移
# - Admin 管理界面
# - 表单验证
# - QuerySet API
```

## 项目结构

```
myproject/
├── manage.py              # 命令行工具
├── myproject/
│   ├── __init__.py
│   ├── settings.py        # 配置文件
│   ├── urls.py            # 路由配置
│   ├── asgi.py            # ASGI 入口
│   └── wsgi.py            # WSGI 入口
└── myapp/                 # 应用目录
    ├── __init__.py
    ├── admin.py           # Admin 配置
    ├── apps.py            # 应用配置
    ├── models.py          # 数据模型
    ├── views.py           # 视图函数
    ├── urls.py            # 应用路由
    ├── forms.py           # 表单定义
    ├── tests.py           # 测试文件
    └── templates/         # 模板目录
        └── myapp/
            └── index.html
```

## MTV 架构

```python
# Model - 数据模型
# models.py
from django.db import models

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# Template - 模板 (类似 View)
# templates/users/list.html
"""
{% for user in users %}
    <div>{{ user.name }}</div>
{% endfor %}
"""


# View - 视图 (类似 Controller)
# views.py
from django.shortcuts import render
from .models import User

def user_list(request):
    users = User.objects.all()
    return render(request, "users/list.html", {"users": users})
```

## 路由配置

```python
# urls.py
from django.urls import path, include
from . import views

# 基本路由
urlpatterns = [
    path("", views.index, name="index"),
    path("users/", views.user_list, name="user_list"),
    path("users/<int:pk>/", views.user_detail, name="user_detail"),
]

# 对比 Express
"""
// Express
app.get("/", index)
app.get("/users", userList)
app.get("/users/:id", userDetail)
"""


# 包含其他应用路由
# myproject/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("myapp.urls")),
]
```

## ORM 操作

```python
from myapp.models import User

# 创建
user = User.objects.create(name="Alice", email="alice@example.com")

# 查询
users = User.objects.all()
user = User.objects.get(pk=1)
users = User.objects.filter(name__contains="A")

# 更新
user.name = "Alice Smith"
user.save()

# 或批量更新
User.objects.filter(pk=1).update(name="Alice Smith")

# 删除
user.delete()


# 对比 Prisma
"""
// Prisma (TypeScript)
const user = await prisma.user.create({
    data: { name: "Alice", email: "alice@example.com" }
})

const users = await prisma.user.findMany()
const user = await prisma.user.findUnique({ where: { id: 1 } })
"""
```

## 视图类型

### 函数视图 (FBV)

```python
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from .models import Article

def article_list(request):
    if request.method == "GET":
        articles = Article.objects.all()
        return render(request, "articles/list.html", {"articles": articles})

    elif request.method == "POST":
        # 处理创建
        pass

def article_detail(request, pk):
    article = get_object_or_404(Article, pk=pk)
    return render(request, "articles/detail.html", {"article": article})
```

### 类视图 (CBV)

```python
from django.views.generic import ListView, DetailView, CreateView
from .models import Article

class ArticleListView(ListView):
    model = Article
    template_name = "articles/list.html"
    context_object_name = "articles"
    paginate_by = 10

class ArticleDetailView(DetailView):
    model = Article
    template_name = "articles/detail.html"

class ArticleCreateView(CreateView):
    model = Article
    fields = ["title", "content"]
    success_url = "/articles/"
```

## Admin 后台

```python
# admin.py
from django.contrib import admin
from .models import Article

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ["title", "created_at", "is_published"]
    list_filter = ["is_published", "created_at"]
    search_fields = ["title", "content"]
    date_hierarchy = "created_at"
    ordering = ["-created_at"]

# 访问 /admin/ 即可使用后台管理
```

## 表单处理

```python
# forms.py
from django import forms
from .models import Article

class ArticleForm(forms.ModelForm):
    class Meta:
        model = Article
        fields = ["title", "content"]

    def clean_title(self):
        title = self.cleaned_data["title"]
        if len(title) < 5:
            raise forms.ValidationError("Title too short")
        return title


# views.py
def create_article(request):
    if request.method == "POST":
        form = ArticleForm(request.POST)
        if form.is_valid():
            article = form.save()
            return redirect("article_detail", pk=article.pk)
    else:
        form = ArticleForm()
    return render(request, "articles/form.html", {"form": form})
```

## REST API (DRF)

```python
# Django REST Framework
# pip install djangorestframework

# serializers.py
from rest_framework import serializers
from .models import Article

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ["id", "title", "content", "created_at"]


# views.py
from rest_framework import viewsets
from .models import Article
from .serializers import ArticleSerializer

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer


# urls.py
from rest_framework.routers import DefaultRouter
from .views import ArticleViewSet

router = DefaultRouter()
router.register("articles", ArticleViewSet)

urlpatterns = router.urls
```

## 数据库迁移

```bash
# 创建迁移
python manage.py makemigrations

# 应用迁移
python manage.py migrate

# 查看迁移状态
python manage.py showmigrations

# 回滚迁移
python manage.py migrate myapp 0001
```

## Django vs FastAPI

```python
# Django - 全栈框架
"""
优点:
- 内置 Admin
- 完整 ORM
- 成熟生态
- 企业级应用

缺点:
- 相对重量级
- 异步支持有限
- 学习曲线陡峭
"""

# FastAPI - API 框架
"""
优点:
- 高性能
- 原生异步
- 自动文档
- 类型安全

缺点:
- 无内置 Admin
- 需要自行组装
- 相对年轻
"""

# 选择建议
# Django: 内容管理、电商、企业应用
# FastAPI: API 服务、微服务、高性能需求
```

## 常用命令

```bash
# 项目管理
django-admin startproject myproject  # 创建项目
python manage.py startapp myapp      # 创建应用
python manage.py runserver           # 运行服务器

# 数据库
python manage.py makemigrations      # 生成迁移
python manage.py migrate             # 应用迁移
python manage.py dbshell             # 数据库 Shell

# 用户管理
python manage.py createsuperuser     # 创建管理员
python manage.py changepassword      # 修改密码

# 调试
python manage.py shell               # Python Shell
python manage.py test                # 运行测试
```

## 小结

**核心概念**:
- MTV: Model-Template-View
- ORM: 对象关系映射
- Admin: 自动后台

**主要特点**:
- 电池全包含
- DRY 原则
- 安全优先

::: tip 适用场景
- 内容管理系统 (CMS)
- 电商平台
- 社交网络
- 企业内部系统
:::

::: info 相关资源
- [Django 官方文档](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [FastAPI](./fastapi.md) - 现代 API 框架
:::

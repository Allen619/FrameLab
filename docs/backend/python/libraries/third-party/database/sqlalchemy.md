---
title: sqlalchemy - ORM 框架
description: Python SQLAlchemy 数据库 ORM 框架
---

# sqlalchemy ORM 框架

## 本章目标

- 掌握 SQLAlchemy 2.0 用法
- 理解 ORM 与 Core 模式
- 学习关系映射与查询
- 对比 Node.js Prisma/TypeORM

## 对比

| SQLAlchemy | Node.js | 说明 |
|------------|---------|------|
| `Session` | Prisma Client | 数据库会话 |
| `Model` | Prisma Schema | 模型定义 |
| `relationship()` | `@relation` | 关系映射 |
| `select()` | `findMany()` | 查询 |

## 安装

```bash
pip install sqlalchemy

# 异步支持
pip install sqlalchemy[asyncio]

# 数据库驱动
pip install psycopg2-binary  # PostgreSQL
pip install pymysql          # MySQL

# poetry
poetry add sqlalchemy
```

## 基础用法

### 定义模型

```python
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.orm import declarative_base, relationship, Session

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True)

    posts = relationship("Post", back_populates="author")

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True)
    title = Column(String(200))
    content = Column(String)
    author_id = Column(Integer, ForeignKey("users.id"))

    author = relationship("User", back_populates="posts")
```

### 创建引擎和表

```python
from sqlalchemy import create_engine

# SQLite
engine = create_engine("sqlite:///app.db", echo=True)

# PostgreSQL
engine = create_engine("postgresql://user:pass@localhost/dbname")

# MySQL
engine = create_engine("mysql+pymysql://user:pass@localhost/dbname")

# 创建所有表
Base.metadata.create_all(engine)
```

### CRUD 操作

```python
from sqlalchemy.orm import Session

# 创建会话
with Session(engine) as session:
    # 创建
    user = User(name="Alice", email="alice@example.com")
    session.add(user)
    session.commit()

    # 查询
    user = session.query(User).filter_by(name="Alice").first()
    users = session.query(User).all()

    # 更新
    user.name = "Alice Smith"
    session.commit()

    # 删除
    session.delete(user)
    session.commit()
```

## SQLAlchemy 2.0 风格

### 新式查询

```python
from sqlalchemy import select
from sqlalchemy.orm import Session

with Session(engine) as session:
    # select 语句
    stmt = select(User).where(User.name == "Alice")
    user = session.execute(stmt).scalar_one_or_none()

    # 多条件
    stmt = select(User).where(
        User.name.like("%Alice%"),
        User.email.isnot(None)
    )
    users = session.execute(stmt).scalars().all()

    # 排序和分页
    stmt = (
        select(User)
        .order_by(User.name)
        .limit(10)
        .offset(0)
    )
    users = session.execute(stmt).scalars().all()
```

### 关系查询

```python
from sqlalchemy import select
from sqlalchemy.orm import joinedload

with Session(engine) as session:
    # 预加载关系
    stmt = select(User).options(joinedload(User.posts))
    users = session.execute(stmt).scalars().unique().all()

    # 连接查询
    stmt = (
        select(User, Post)
        .join(Post, User.id == Post.author_id)
        .where(Post.title.like("%Python%"))
    )
    results = session.execute(stmt).all()
```

## 异步支持

```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

# 异步引擎
engine = create_async_engine("postgresql+asyncpg://user:pass@localhost/db")

# 异步会话工厂
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def get_users():
    async with async_session() as session:
        stmt = select(User)
        result = await session.execute(stmt)
        return result.scalars().all()
```

## 实战示例

### FastAPI 集成

```python
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./app.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@app.post("/users")
def create_user(name: str, email: str, db: Session = Depends(get_db)):
    user = User(name=name, email=email)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
```

## 小结

**核心概念**:
- `Engine`: 数据库连接
- `Session`: 会话管理
- `Model`: 模型定义

**查询方式**:
- `select()`: 2.0 风格
- `query()`: 1.x 风格
- `relationship()`: 关系映射

::: tip 最佳实践
- 使用 2.0 风格 API
- 合理使用关系预加载
- 异步场景用 asyncio 扩展
:::

::: info 相关库
- `alembic` - 数据库迁移
- `sqlmodel` - Pydantic 集成
- `databases` - 异步数据库
:::

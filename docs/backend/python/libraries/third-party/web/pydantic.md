---
title: pydantic - 数据验证
description: Python Pydantic 数据验证库，数据模型与类型安全
---

# pydantic 数据验证

## 本章目标

- 掌握 Pydantic 模型定义
- 理解数据验证与转换机制
- 学习自定义验证器
- 对比 TypeScript 类型与 Zod

## 对比

| Pydantic | TypeScript/Zod | 说明 |
|----------|---------------|------|
| `BaseModel` | `z.object()` | 模型定义 |
| `Field()` | `z.string()` | 字段约束 |
| `validator` | `.refine()` | 自定义验证 |
| `.model_dump()` | - | 序列化 |

## 安装

```bash
pip install pydantic

# 包含 email 验证
pip install "pydantic[email]"

# poetry
poetry add pydantic
```

## 基础用法

### 模型定义

```python
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class User(BaseModel):
    id: int
    name: str
    email: str
    age: Optional[int] = None
    tags: List[str] = []
    created_at: datetime = datetime.now()

# 创建实例
user = User(id=1, name="Alice", email="alice@example.com")
print(user)
# id=1 name='Alice' email='alice@example.com' age=None tags=[] ...

# 从字典创建
data = {"id": 2, "name": "Bob", "email": "bob@example.com", "age": 25}
user = User(**data)
user = User.model_validate(data)
```

```typescript
// TypeScript + Zod 对比
import { z } from 'zod'

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().optional(),
  tags: z.array(z.string()).default([]),
})

type User = z.infer<typeof UserSchema>
```

### 类型强转

```python
from pydantic import BaseModel

class User(BaseModel):
    id: int
    name: str
    active: bool

# 自动类型转换
user = User(id="123", name="Alice", active="true")
print(user.id)      # 123 (int)
print(user.active)  # True (bool)

# 验证失败
try:
    user = User(id="abc", name="Alice", active=True)
except ValueError as e:
    print(e)
    # validation error for User
    # id: Input should be a valid integer
```

### 字段约束

```python
from pydantic import BaseModel, Field
from typing import Annotated

class User(BaseModel):
    id: int = Field(gt=0)  # 大于 0
    name: str = Field(min_length=1, max_length=100)
    email: str = Field(pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$')
    age: int = Field(ge=0, le=150, default=0)
    score: float = Field(ge=0, le=100, description="用户分数")

# 用 Annotated
class Product(BaseModel):
    price: Annotated[float, Field(gt=0, description="价格")]
    quantity: Annotated[int, Field(ge=0)]

# 使用
user = User(id=1, name="Alice", email="alice@example.com")
```

### 嵌套模型

```python
from pydantic import BaseModel
from typing import List, Optional

class Address(BaseModel):
    street: str
    city: str
    country: str = "China"

class User(BaseModel):
    name: str
    address: Address
    friends: List["User"] = []

# 嵌套解析
data = {
    "name": "Alice",
    "address": {
        "street": "123 Main St",
        "city": "Beijing"
    }
}
user = User(**data)
print(user.address.city)  # Beijing
```

## 验证器

### 字段验证器

```python
from pydantic import BaseModel, field_validator

class User(BaseModel):
    name: str
    email: str
    password: str

    @field_validator('name')
    @classmethod
    def name_must_not_be_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError('Name cannot be empty')
        return v.strip()

    @field_validator('email')
    @classmethod
    def email_must_be_valid(cls, v: str) -> str:
        if '@' not in v:
            raise ValueError('Invalid email format')
        return v.lower()

    @field_validator('password')
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        return v
```

### 模型验证器

```python
from pydantic import BaseModel, model_validator

class UserCreate(BaseModel):
    password: str
    password_confirm: str

    @model_validator(mode='after')
    def passwords_match(self):
        if self.password != self.password_confirm:
            raise ValueError('Passwords do not match')
        return self

# 用法
user = UserCreate(password="secret123", password_confirm="secret123")
```

### 序列化验证器

```python
from pydantic import BaseModel, field_serializer
from datetime import datetime

class Event(BaseModel):
    name: str
    timestamp: datetime

    @field_serializer('timestamp')
    def serialize_timestamp(self, dt: datetime) -> str:
        return dt.isoformat()

event = Event(name="Meeting", timestamp=datetime.now())
print(event.model_dump())
# {'name': 'Meeting', 'timestamp': '2024-01-15T10:30:00'}
```

## 序列化

```python
from pydantic import BaseModel
from datetime import datetime

class User(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

user = User(id=1, name="Alice", email="alice@example.com", created_at=datetime.now())

# 转成字典
data = user.model_dump()
print(data)

# 排除字段
data = user.model_dump(exclude={'created_at'})

# 只包含字段
data = user.model_dump(include={'id', 'name'})

# 排除未设置字段
data = user.model_dump(exclude_unset=True)

# 转成 JSON
json_str = user.model_dump_json()

# 从 JSON 解析
user = User.model_validate_json(json_str)
```

## 配置

```python
from pydantic import BaseModel, ConfigDict

class User(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,    # 自动去除空格
        str_min_length=1,             # 字符串最小长度
        validate_assignment=True,      # 赋值时验证
        extra='forbid',               # 禁止额外字段
        frozen=True,                  # 不可变
    )

    name: str
    email: str

# 禁止额外字段
try:
    user = User(name="Alice", email="a@b.com", unknown="value")
except ValueError:
    print("Extra fields not allowed")

# 不可变
user = User(name="Alice", email="a@b.com")
try:
    user.name = "Bob"  # 报错
except TypeError:
    print("Cannot modify frozen model")
```

## 高级用法

### 泛型模型

```python
from pydantic import BaseModel
from typing import TypeVar, Generic, List

T = TypeVar('T')

class Response(BaseModel, Generic[T]):
    data: T
    message: str = "success"

class User(BaseModel):
    id: int
    name: str

# 用法
response = Response[User](data=User(id=1, name="Alice"))
response = Response[List[User]](data=[User(id=1, name="Alice")])
```

### 区分联合类型

```python
from pydantic import BaseModel
from typing import Literal, Union

class Cat(BaseModel):
    type: Literal["cat"] = "cat"
    meow: str

class Dog(BaseModel):
    type: Literal["dog"] = "dog"
    bark: str

class Pet(BaseModel):
    pet: Union[Cat, Dog]

# 自动选择类型
pet = Pet(pet={"type": "cat", "meow": "meow!"})
print(type(pet.pet))  # Cat
```

### 计算字段

```python
from pydantic import BaseModel, computed_field

class Rectangle(BaseModel):
    width: float
    height: float

    @computed_field
    @property
    def area(self) -> float:
        return self.width * self.height

rect = Rectangle(width=10, height=5)
print(rect.area)  # 50.0
print(rect.model_dump())  # {'width': 10.0, 'height': 5.0, 'area': 50.0}
```

## 实战用法

### FastAPI 集成

```python
from fastapi import FastAPI
from pydantic import BaseModel, Field, EmailStr
from typing import Optional

app = FastAPI()

class UserCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8)

class UserResponse(BaseModel):
    id: int
    name: str
    email: str

@app.post("/users", response_model=UserResponse)
async def create_user(user: UserCreate):
    # 验证自动完成
    return {"id": 1, **user.model_dump(exclude={'password'})}
```

### 环境变量

```python
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    app_name: str = "MyApp"
    debug: bool = False
    database_url: str
    secret_key: str = Field(min_length=32)

    class Config:
        env_file = ".env"

# 自动从环境变量加载
settings = Settings()
```

## 与 JavaScript 类型系统对比

| 特性 | Pydantic | Zod |
|-----|----------|-----|
| 运行时 | Python | JavaScript |
| 类型来源 | 类型注解 | Schema 定义 |
| 序列化 | 内置 | 需要转换器 |
| 环境变量 | pydantic-settings | 无内置 |

## 小结

**模型定义**:
- `BaseModel`: 基类
- `Field()`: 字段约束
- 类型注解自动验证

**验证器**:
- `@field_validator`: 字段验证
- `@model_validator`: 模型验证
- `@field_serializer`: 序列化

**序列化**:
- `.model_dump()`: 转字典
- `.model_dump_json()`: 转 JSON
- `.model_validate()`: 从字典

::: tip 最佳实践
- 用类型注解代替手动类型检查
- 善用字段约束做数据校验
- 自定义验证器实现复杂逻辑
- 配合 FastAPI 使用
:::

::: info 相关库
- `pydantic-settings` - 环境变量
- `fastapi` - Web 框架
- `sqlmodel` - ORM 集成
:::

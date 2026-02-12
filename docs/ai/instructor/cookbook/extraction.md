# 复杂实体提取

在现实世界的数据处理中，我们往往需要从非结构化文本中提取**嵌套的、层次化的**信息。Instructor 配合 Pydantic 的嵌套模型，能够轻松应对这类挑战。

## 场景：简历解析 (Resume Parsing)

**任务**：从一份简历文本中提取候选人的基本信息、工作经历列表、技能列表以及教育背景。

**难点**：

- 工作经历是一个**列表**，每个经历包含公司、职位、时间段。
- 技能可能分散在文本各处。
- 某些字段可能缺失（Optional）。

## 解决方案

定义嵌套的 Pydantic 模型。

### 1. 定义数据结构

```python
from typing import List, Optional
from pydantic import BaseModel, Field

class DateRange(BaseModel):
    start_date: str = Field(description="YYYY-MM format")
    end_date: Optional[str] = Field(None, description="YYYY-MM or 'Present'")

class Job(BaseModel):
    company: str
    title: str
    dates: DateRange
    description: str

class Education(BaseModel):
    institution: str
    degree: str
    year_graduated: int

class Resume(BaseModel):
    full_name: str
    email: Optional[str]
    jobs: List[Job] = Field(default_factory=list)
    education: List[Education] = Field(default_factory=list)
    skills: List[str] = Field(description="Key technical skills")
```

### 2. 执行提取

```python
import instructor
from openai import OpenAI

client = instructor.from_openai(OpenAI())

resume_text = """
John Doe (john.doe@email.com) - Senior Python Developer at TechCorp (2020-Present).
Previously worked as a Junior Dev at StartupInc from 2018-2020.
Skilled in Python, Django, React, and AWS.
B.S. Computer Science, Stanford University (2018).
"""

result = client.chat.completions.create(
    model="gpt-4o",
    response_model=Resume,
    messages=[
        {"role": "user", "content": f"Extract info from this resume: {resume_text}"}
    ]
)

print(f"Name: {result.full_name}")
# > John Doe
print(f"Jobs: {len(result.jobs)}")
# > 2
print(f"Latest Job: {result.jobs[0].company} - {result.jobs[0].title}")
# > TechCorp - Senior Python Developer
```

## 技巧：处理不完整数据

对于可选字段（如 `email`），使用 `Optional[str] = None`。这告诉 LLM 如果没找到该信息，可以返回 `null`，而不是编造（Hallucination）。

```python
class ContactInfo(BaseModel):
    phone: Optional[str] = Field(None, description="Phone number if present")
    linkedin: Optional[str] = Field(None, description="LinkedIn URL if present")
```

## 技巧：引用验证 (Citation Verification)

为了确保提取的信息准确无误，我们可以要求 LLM 提供原文引用（Quote），并在验证阶段检查该引用是否存在于原文中。

```python
from pydantic import field_validator, ValidationInfo

class Fact(BaseModel):
    statement: str
    quote: str = Field(..., description="Exact substring from source text supporting the statement")

    @field_validator('quote')
    @classmethod
    def verify_quote(cls, v: str, info: ValidationInfo):
        context = info.context
        if context and v not in context.get('source_text', ''):
            raise ValueError("Quote not found in source text")
        return v

# 调用时传入 context
client.chat.completions.create(
    response_model=Fact,
    messages=[...],
    context={"source_text": resume_text} # 传入原文
)
```

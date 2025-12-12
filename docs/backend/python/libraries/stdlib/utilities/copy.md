---
title: copy - 对象复制
description: Python copy 模块详解，深拷贝与浅拷贝
---

# copy 对象复制

## 学习目标

- 理解深拷贝和浅拷贝的区别
- 掌握 copy 和 deepcopy 的使用
- 学会自定义拷贝行为
- 对比 JavaScript 复制方式

## 概览

| Python copy | JavaScript | 说明 |
|------------|------------|------|
| `copy()` | `{...obj}` / `Object.assign()` | 浅拷贝 |
| `deepcopy()` | `structuredClone()` | 深拷贝 |

## 引用 vs 复制

### 引用赋值

```python
# 引用赋值只是创建别名
original = [1, 2, [3, 4]]
reference = original

# 修改会影响双方
reference.append(5)
print(original)   # [1, 2, [3, 4], 5]
print(reference)  # [1, 2, [3, 4], 5]

# 它们是同一个对象
print(original is reference)  # True
print(id(original) == id(reference))  # True
```

```javascript
// JavaScript 同样
const original = [1, 2, [3, 4]]
const reference = original

reference.push(5)
console.log(original)  // [1, 2, [3, 4], 5]
console.log(original === reference)  // true
```

## 浅拷贝

### copy.copy()

```python
import copy

original = [1, 2, [3, 4]]

# 浅拷贝
shallow = copy.copy(original)

# 创建了新的复制
print(original is shallow)  # False

# 顶层操作不互相影响
shallow.append(5)
print(original)  # [1, 2, [3, 4]] - 不变
print(shallow)   # [1, 2, [3, 4], 5]

# 但嵌套对象仍然共享
shallow[2].append(5)
print(original)  # [1, 2, [3, 4, 5]] - 被修改了
print(shallow)   # [1, 2, [3, 4, 5]]

# 嵌套对象是同一个
print(original[2] is shallow[2])  # True
```

```javascript
// JavaScript 对比 - 展开运算符也是浅拷贝
const original = [1, 2, [3, 4]]
const shallow = [...original]

shallow.push(5)
console.log(original)  // [1, 2, [3, 4]] - 不变

shallow[2].push(5)
console.log(original)  // [1, 2, [3, 4, 5]] - 被修改
```

### 其他浅拷贝方式

```python
# 列表浅拷贝
original = [1, 2, 3]

# 方式 1: copy()
shallow1 = copy.copy(original)

# 方式 2: list 构造函数
shallow2 = list(original)

# 方式 3: 切片
shallow3 = original[:]

# 方式 4: copy 方法
shallow4 = original.copy()

# 字典浅拷贝
original_dict = {'a': 1, 'b': [2, 3]}

# 方式 1: copy()
shallow1 = copy.copy(original_dict)

# 方式 2: dict 构造函数
shallow2 = dict(original_dict)

# 方式 3: copy 方法
shallow3 = original_dict.copy()

# 方式 4: 解包
shallow4 = {**original_dict}

# 集合浅拷贝
original_set = {1, 2, 3}
shallow = original_set.copy()
```

```javascript
// JavaScript 对比
// 数组浅拷贝
const arr = [1, 2, 3]
const shallow1 = [...arr]
const shallow2 = arr.slice()
const shallow3 = Array.from(arr)

// 对象浅拷贝
const obj = { a: 1, b: [2, 3] }
const shallow4 = { ...obj }
const shallow5 = Object.assign({}, obj)
```

## 深拷贝

### copy.deepcopy()

```python
import copy

original = {
    'name': 'Alice',
    'scores': [90, 85, 88],
    'address': {
        'city': 'Beijing',
        'zip': '100000'
    }
}

# 深拷贝
deep = copy.deepcopy(original)

# 修改深拷贝不影响原对象
deep['scores'].append(92)
deep['address']['city'] = 'Shanghai'

print(original['scores'])       # [90, 85, 88] - 不变
print(original['address']['city'])  # Beijing - 不变

print(deep['scores'])           # [90, 85, 88, 92]
print(deep['address']['city'])  # Shanghai

# 嵌套对象也是独立的
print(original['scores'] is deep['scores'])  # False
print(original['address'] is deep['address'])  # False
```

```javascript
// JavaScript 对比 - structuredClone (现代浏览器/Node.js 17+)
const original = {
    name: 'Alice',
    scores: [90, 85, 88],
    address: { city: 'Beijing', zip: '100000' }
}

const deep = structuredClone(original)

deep.scores.push(92)
deep.address.city = 'Shanghai'

console.log(original.scores)      // [90, 85, 88]
console.log(original.address.city)  // Beijing

// JSON 方式 (有限制)
const deep2 = JSON.parse(JSON.stringify(original))
```

### 循环引用

```python
import copy

# 处理循环引用
a = [1, 2]
b = [3, a]
a.append(b)

print(a)  # [1, 2, [3, [...]]]

# deepcopy 能处理循环引用
deep = copy.deepcopy(a)
print(deep)  # [1, 2, [3, [...]]]

# 验证确实是独立的
print(deep is a)  # False
print(deep[2] is a[2])  # False
print(deep[2][1] is deep)  # True (循环引用正确处理)
```

```javascript
// JavaScript JSON 不能处理循环引用
const a = [1, 2]
const b = [3, a]
a.push(b)

// JSON.stringify(a)  // TypeError: Converting circular structure to JSON

// structuredClone 可以
const deep = structuredClone(a)  // 正常工作
```

## 自定义拷贝行为

### \_\_copy\_\_ 和 \_\_deepcopy\_\_

```python
import copy

class Person:
    def __init__(self, name, data):
        self.name = name
        self.data = data
        self._cache = {}  # 不需要复制的缓存

    def __copy__(self):
        """浅拷贝行为"""
        # 创建新实例不调用 __init__
        new_obj = self.__class__.__new__(self.__class__)
        new_obj.__dict__.update(self.__dict__)
        # 重置缓存
        new_obj._cache = {}
        return new_obj

    def __deepcopy__(self, memo):
        """深拷贝行为"""
        # memo 用于处理循环引用
        new_obj = self.__class__.__new__(self.__class__)
        memo[id(self)] = new_obj

        for key, value in self.__dict__.items():
            if key == '_cache':
                setattr(new_obj, key, {})  # 重置缓存
            else:
                setattr(new_obj, key, copy.deepcopy(value, memo))

        return new_obj

# 使用
original = Person('Alice', {'scores': [90, 85]})
original._cache['key'] = 'value'

shallow = copy.copy(original)
print(shallow.name)  # Alice
print(shallow._cache)  # {} (已重置)

deep = copy.deepcopy(original)
deep.data['scores'].append(88)
print(original.data['scores'])  # [90, 85] (不变)
```

### 阻止复制

```python
import copy

class Singleton:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __copy__(self):
        """浅拷贝返回自身"""
        return self

    def __deepcopy__(self, memo):
        """深拷贝返回自身"""
        return self

# 测试
s1 = Singleton()
s2 = copy.copy(s1)
s3 = copy.deepcopy(s1)

print(s1 is s2 is s3)  # True
```

### 使用 \_\_reduce\_\_ 控制序列化

```python
import copy

class Connection:
    def __init__(self, host, port):
        self.host = host
        self.port = port
        self._socket = None  # 实际连接不能复制

    def __reduce__(self):
        """自定义序列化方式"""
        # 返回 (构造函数, 参数)
        return (self.__class__, (self.host, self.port))

# 深拷贝时重新创建连接
conn1 = Connection('localhost', 8080)
conn1._socket = "connected"

conn2 = copy.deepcopy(conn1)
print(conn2.host)      # localhost
print(conn2._socket)   # None (重新初始化)
```

## 常见陷阱

### 默认参数陷阱

```python
import copy

# 常见错误：可变默认参数
def bad_append(item, lst=[]):
    lst.append(item)
    return lst

print(bad_append(1))  # [1]
print(bad_append(2))  # [1, 2] - 意外!

# 正确做法：使用 None
def good_append(item, lst=None):
    if lst is None:
        lst = []
    lst.append(item)
    return lst

# 使用拷贝
def also_good_append(item, lst=None):
    lst = copy.copy(lst) if lst else []
    lst.append(item)
    return lst
```

### 浅拷贝陷阱

```python
import copy

class Config:
    def __init__(self):
        self.settings = {'debug': True}
        self.plugins = [{'name': 'auth'}]

original = Config()

# 浅拷贝
shallow = copy.copy(original)

# 修改嵌套对象会影响原对象
shallow.settings['debug'] = False
print(original.settings['debug'])  # False - 被修改了

# 深拷贝才安全
deep = copy.deepcopy(original)
deep.settings['debug'] = True
print(original.settings['debug'])  # False - 不变
```

### 特殊对象无法复制

```python
import copy

# 锁对象无法复制
import threading

lock = threading.Lock()
# copy.copy(lock)  # TypeError: cannot pickle '_thread.lock' object

# 文件对象也无法复制
f = open('test.txt', 'w')
# copy.copy(f)  # TypeError

f.close()
```

## 实际应用

### 状态快照

```python
import copy

class GameState:
    def __init__(self):
        self.level = 1
        self.score = 0
        self.inventory = []
        self.position = {'x': 0, 'y': 0}

    def save(self):
        """保存快照"""
        return copy.deepcopy(self.__dict__)

    def restore(self, snapshot):
        """恢复状态"""
        self.__dict__ = copy.deepcopy(snapshot)

# 使用
game = GameState()
game.level = 5
game.score = 1000
game.inventory.append('sword')

# 保存
checkpoint = game.save()

# 继续游戏
game.score = 500
game.inventory.clear()

# 失败后恢复存档
game.restore(checkpoint)
print(game.score)      # 1000
print(game.inventory)  # ['sword']
```

### 原型模式

```python
import copy

class Document:
    def __init__(self, title, content, styles):
        self.title = title
        self.content = content
        self.styles = styles

    def clone(self):
        """克隆文档"""
        return copy.deepcopy(self)

# 模板
template = Document(
    title="Untitled",
    content="",
    styles={'font': 'Arial', 'size': 12, 'margins': [1, 1, 1, 1]}
)

# 从模板创建新文档
doc1 = template.clone()
doc1.title = "Report"
doc1.styles['size'] = 14

doc2 = template.clone()
doc2.title = "Letter"
doc2.styles['font'] = 'Times'

# 模板不变
print(template.styles)  # {'font': 'Arial', 'size': 12, ...}
```

### 安全参数传递

```python
import copy

def process_data(data, options=None):
    """处理数据而不修改原数据"""
    # 深拷贝确保不会修改原数据
    data = copy.deepcopy(data)
    options = copy.deepcopy(options) if options else {}

    # 现在可以安全修改
    data['processed'] = True
    options['timestamp'] = '2024-01-01'

    return data, options

# 使用
original_data = {'items': [1, 2, 3]}
original_options = {'format': 'json'}

result, opts = process_data(original_data, original_options)

print(original_data)     # {'items': [1, 2, 3]} - 不变
print(original_options)  # {'format': 'json'} - 不变
```

### 缓存保护

```python
import copy

class DataCache:
    def __init__(self):
        self._cache = {}

    def get(self, key):
        """获取缓存（返回副本防止被修改）"""
        if key in self._cache:
            return copy.deepcopy(self._cache[key])
        return None

    def set(self, key, value):
        """设置缓存（存储副本防止被外部修改）"""
        self._cache[key] = copy.deepcopy(value)

# 使用
cache = DataCache()

data = {'users': ['Alice', 'Bob']}
cache.set('users', data)

# 修改原数据不会影响缓存
data['users'].append('Charlie')
cached = cache.get('users')
print(cached['users'])  # ['Alice', 'Bob']

# 修改返回值也不会影响缓存
cached['users'].append('David')
print(cache.get('users')['users'])  # ['Alice', 'Bob']
```

## 与 JavaScript 的主要差异

| 特性 | Python copy | JavaScript |
|-----|-------------|------------|
| 浅拷贝 | `copy.copy()` | `{...obj}`, `Object.assign()` |
| 深拷贝 | `copy.deepcopy()` | `structuredClone()`, `JSON.parse(JSON.stringify())` |
| 循环引用 | 支持 | `structuredClone` 支持/JSON 不支持 |
| 自定义 | `__copy__`, `__deepcopy__` | 无标准方法 |
| 特殊对象 | 有限制 | `structuredClone` 有限制 |

## 总结

**浅拷贝 copy()**:
- 创建新的顶层对象
- 嵌套对象仍然共享引用
- 适用于简单数据结构

**深拷贝 deepcopy()**:
- 递归复制所有嵌套对象
- 处理循环引用
- 适用于复杂数据结构

**自定义方法**:
- `__copy__()`: 自定义浅拷贝
- `__deepcopy__(memo)`: 自定义深拷贝
- `__reduce__()`: 控制序列化

::: tip 最佳实践
- 简单结构用浅拷贝
- 嵌套结构用深拷贝
- 不修改原数据先复制
- 缓存返回值需要副本保护
:::

::: info 相关模块
- `pickle` - 序列化
- `json` - JSON 序列化
:::

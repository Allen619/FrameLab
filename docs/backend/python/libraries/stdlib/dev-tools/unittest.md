---
title: unittest - 单元测试
description: Python unittest 模块详解，编写和运行单元测试
---

# unittest 单元测试

## 学习目标

- 理解测试用例的编写方法
- 掌握各种断言的使用
- 学会 Mock 和测试隔离
- 对比 JavaScript Jest/Mocha 特性

## 概览

| Python unittest | JavaScript (Jest) | 说明 |
|----------------|-------------------|------|
| `TestCase` | `describe` | 测试类/套件 |
| `test_*` | `test()/it()` | 测试方法 |
| `setUp` | `beforeEach` | 每个测试前执行 |
| `tearDown` | `afterEach` | 每个测试后执行 |
| `assertEqual` | `expect().toBe()` | 相等断言 |
| `mock.patch` | `jest.mock()` | 模拟对象 |

## 基础用法

### 编写测试

```python
import unittest

def add(a, b):
    return a + b

def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

class TestMath(unittest.TestCase):
    """测试数学函数"""

    def test_add_positive(self):
        """测试正数相加"""
        self.assertEqual(add(1, 2), 3)

    def test_add_negative(self):
        """测试负数相加"""
        self.assertEqual(add(-1, -2), -3)

    def test_add_zero(self):
        """测试零"""
        self.assertEqual(add(0, 0), 0)

    def test_divide(self):
        """测试除法"""
        self.assertEqual(divide(6, 2), 3)

    def test_divide_by_zero(self):
        """测试除零错误"""
        with self.assertRaises(ValueError):
            divide(1, 0)

if __name__ == '__main__':
    unittest.main()
```

```javascript
// Jest 对比
function add(a, b) {
    return a + b
}

describe('Math', () => {
    test('add positive numbers', () => {
        expect(add(1, 2)).toBe(3)
    })

    test('add negative numbers', () => {
        expect(add(-1, -2)).toBe(-3)
    })
})
```

### 运行测试

```bash
# 运行单个测试文件
python -m unittest test_math.py

# 运行指定测试类
python -m unittest test_math.TestMath

# 运行指定测试方法
python -m unittest test_math.TestMath.test_add_positive

# 自动发现测试
python -m unittest discover

# 详细输出
python -m unittest -v test_math.py
```

### setUp 和 tearDown

```python
import unittest
import tempfile
import os

class TestFileOperations(unittest.TestCase):

    def setUp(self):
        """每个测试方法前执行"""
        self.temp_dir = tempfile.mkdtemp()
        self.test_file = os.path.join(self.temp_dir, 'test.txt')
        with open(self.test_file, 'w') as f:
            f.write('test content')

    def tearDown(self):
        """每个测试方法后执行"""
        if os.path.exists(self.test_file):
            os.remove(self.test_file)
        os.rmdir(self.temp_dir)

    def test_file_exists(self):
        self.assertTrue(os.path.exists(self.test_file))

    def test_file_content(self):
        with open(self.test_file) as f:
            content = f.read()
        self.assertEqual(content, 'test content')

    @classmethod
    def setUpClass(cls):
        """整个测试类开始前执行一次"""
        print("Starting TestFileOperations")

    @classmethod
    def tearDownClass(cls):
        """整个测试类结束后执行一次"""
        print("Finished TestFileOperations")
```

```javascript
// Jest 对比
describe('FileOperations', () => {
    let testFile

    beforeAll(() => {
        console.log('Starting tests')
    })

    afterAll(() => {
        console.log('Finished tests')
    })

    beforeEach(() => {
        testFile = '/tmp/test.txt'
        fs.writeFileSync(testFile, 'test content')
    })

    afterEach(() => {
        if (fs.existsSync(testFile)) {
            fs.unlinkSync(testFile)
        }
    })

    test('file exists', () => {
        expect(fs.existsSync(testFile)).toBe(true)
    })
})
```

## 断言方法

### 相等断言

```python
import unittest

class TestAssertions(unittest.TestCase):

    def test_equal(self):
        self.assertEqual(1 + 1, 2)
        self.assertNotEqual(1 + 1, 3)

    def test_almost_equal(self):
        # 浮点数比较
        self.assertAlmostEqual(0.1 + 0.2, 0.3, places=5)

    def test_is(self):
        a = [1, 2, 3]
        b = a
        c = [1, 2, 3]
        self.assertIs(a, b)
        self.assertIsNot(a, c)

    def test_none(self):
        self.assertIsNone(None)
        self.assertIsNotNone(1)

    def test_in(self):
        self.assertIn(1, [1, 2, 3])
        self.assertNotIn(4, [1, 2, 3])

    def test_instance(self):
        self.assertIsInstance([], list)
        self.assertNotIsInstance([], dict)
```

### 布尔断言

```python
class TestBoolAssertions(unittest.TestCase):

    def test_true_false(self):
        self.assertTrue(1 == 1)
        self.assertFalse(1 == 2)

    def test_greater_less(self):
        self.assertGreater(5, 3)
        self.assertGreaterEqual(5, 5)
        self.assertLess(3, 5)
        self.assertLessEqual(5, 5)
```

### 容器断言

```python
class TestContainerAssertions(unittest.TestCase):

    def test_count_equal(self):
        # 元素相同，顺序可不同
        self.assertCountEqual([1, 2, 3], [3, 2, 1])

    def test_sequence_equal(self):
        # 元素和顺序都相同
        self.assertSequenceEqual([1, 2, 3], [1, 2, 3])

    def test_list_equal(self):
        self.assertListEqual([1, 2], [1, 2])

    def test_tuple_equal(self):
        self.assertTupleEqual((1, 2), (1, 2))

    def test_set_equal(self):
        self.assertSetEqual({1, 2, 3}, {3, 2, 1})

    def test_dict_equal(self):
        self.assertDictEqual({'a': 1}, {'a': 1})
```

### 异常断言

```python
class TestExceptionAssertions(unittest.TestCase):

    def test_raises(self):
        with self.assertRaises(ValueError):
            int('not a number')

    def test_raises_regex(self):
        with self.assertRaisesRegex(ValueError, 'invalid literal'):
            int('not a number')

    def test_warns(self):
        import warnings
        with self.assertWarns(DeprecationWarning):
            warnings.warn('deprecated', DeprecationWarning)
```

## Mock 和 Patch

### 基础 Mock

```python
from unittest.mock import Mock, MagicMock

def test_mock_basic():
    # 创建 Mock 对象
    mock = Mock()

    # 设置返回值
    mock.method.return_value = 42
    assert mock.method() == 42

    # 设置属性
    mock.name = 'test'
    assert mock.name == 'test'

    # 检查调用
    mock.method()
    mock.method.assert_called()
    mock.method.assert_called_once()

    # 检查调用参数
    mock.func(1, 2, key='value')
    mock.func.assert_called_with(1, 2, key='value')

def test_magic_mock():
    # MagicMock 支持魔术方法
    mock = MagicMock()
    mock.__len__.return_value = 5
    assert len(mock) == 5

    mock.__getitem__.return_value = 'item'
    assert mock[0] == 'item'
```

### Patch 装饰器

```python
from unittest.mock import patch
import requests

def fetch_data(url):
    response = requests.get(url)
    return response.json()

class TestFetchData(unittest.TestCase):

    @patch('requests.get')
    def test_fetch_data(self, mock_get):
        # 配置 mock
        mock_response = Mock()
        mock_response.json.return_value = {'data': 'test'}
        mock_get.return_value = mock_response

        # 测试
        result = fetch_data('http://example.com/api')

        # 验证
        self.assertEqual(result, {'data': 'test'})
        mock_get.assert_called_once_with('http://example.com/api')

    def test_fetch_data_context(self):
        with patch('requests.get') as mock_get:
            mock_get.return_value.json.return_value = {'data': 'test'}
            result = fetch_data('http://example.com/api')
            self.assertEqual(result, {'data': 'test'})
```

```javascript
// Jest 对比
jest.mock('axios')

test('fetch data', async () => {
    axios.get.mockResolvedValue({ data: { data: 'test' } })

    const result = await fetchData('http://example.com/api')

    expect(result).toEqual({ data: 'test' })
    expect(axios.get).toHaveBeenCalledWith('http://example.com/api')
})
```

### Patch 对象

```python
from unittest.mock import patch, PropertyMock

class Database:
    def __init__(self):
        self.connected = False

    def connect(self):
        self.connected = True
        return self

    def query(self, sql):
        if not self.connected:
            raise RuntimeError("Not connected")
        return []

class TestDatabase(unittest.TestCase):

    @patch.object(Database, 'query')
    def test_query_mock(self, mock_query):
        mock_query.return_value = [{'id': 1}]

        db = Database()
        db.connected = True
        result = db.query('SELECT * FROM users')

        self.assertEqual(result, [{'id': 1}])

    @patch.object(Database, 'connected', new_callable=PropertyMock)
    def test_property_mock(self, mock_connected):
        mock_connected.return_value = True

        db = Database()
        self.assertTrue(db.connected)
```

### Side Effect

```python
from unittest.mock import Mock, patch

def test_side_effect():
    mock = Mock()

    # 抛出异常
    mock.method.side_effect = ValueError("error")
    with pytest.raises(ValueError):
        mock.method()

    # 返回不同值
    mock.method.side_effect = [1, 2, 3]
    assert mock.method() == 1
    assert mock.method() == 2
    assert mock.method() == 3

    # 自定义函数
    mock.method.side_effect = lambda x: x * 2
    assert mock.method(5) == 10
```

## 测试组织

### 测试套件

```python
import unittest

def suite():
    """创建测试套件"""
    suite = unittest.TestSuite()

    # 添加特定测试
    suite.addTest(TestMath('test_add_positive'))
    suite.addTest(TestMath('test_add_negative'))

    # 添加整个测试类
    suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestMath))

    return suite

if __name__ == '__main__':
    runner = unittest.TextTestRunner(verbosity=2)
    runner.run(suite())
```

### 跳过测试

```python
import unittest
import sys

class TestSkip(unittest.TestCase):

    @unittest.skip("演示跳过")
    def test_skip(self):
        self.fail("不会执行")

    @unittest.skipIf(sys.version_info < (3, 10), "需要 Python 3.10+")
    def test_skip_if(self):
        pass

    @unittest.skipUnless(sys.platform == 'linux', "仅 Linux")
    def test_skip_unless(self):
        pass

    @unittest.expectedFailure
    def test_expected_failure(self):
        self.assertEqual(1, 2)  # 预期会失败
```

### 子测试

```python
class TestSubTest(unittest.TestCase):

    def test_numbers(self):
        """使用子测试批量测试"""
        test_cases = [
            (1, 2, 3),
            (0, 0, 0),
            (-1, 1, 0),
            (10, 20, 30),
        ]

        for a, b, expected in test_cases:
            with self.subTest(a=a, b=b):
                self.assertEqual(add(a, b), expected)
```

```javascript
// Jest 对比
test.each([
    [1, 2, 3],
    [0, 0, 0],
    [-1, 1, 0],
])('add(%i, %i) = %i', (a, b, expected) => {
    expect(add(a, b)).toBe(expected)
})
```

## 实际应用

### 测试 Web API

```python
import unittest
from unittest.mock import patch, Mock
import json

class APIClient:
    def __init__(self, base_url):
        self.base_url = base_url

    def get_user(self, user_id):
        import requests
        response = requests.get(f"{self.base_url}/users/{user_id}")
        response.raise_for_status()
        return response.json()

    def create_user(self, data):
        import requests
        response = requests.post(f"{self.base_url}/users", json=data)
        response.raise_for_status()
        return response.json()

class TestAPIClient(unittest.TestCase):

    def setUp(self):
        self.client = APIClient('http://api.example.com')

    @patch('requests.get')
    def test_get_user_success(self, mock_get):
        mock_response = Mock()
        mock_response.json.return_value = {'id': 1, 'name': 'Alice'}
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response

        user = self.client.get_user(1)

        self.assertEqual(user['name'], 'Alice')
        mock_get.assert_called_once_with('http://api.example.com/users/1')

    @patch('requests.get')
    def test_get_user_not_found(self, mock_get):
        mock_response = Mock()
        mock_response.raise_for_status.side_effect = Exception('404')
        mock_get.return_value = mock_response

        with self.assertRaises(Exception):
            self.client.get_user(999)

    @patch('requests.post')
    def test_create_user(self, mock_post):
        mock_response = Mock()
        mock_response.json.return_value = {'id': 2, 'name': 'Bob'}
        mock_response.raise_for_status.return_value = None
        mock_post.return_value = mock_response

        user = self.client.create_user({'name': 'Bob'})

        self.assertEqual(user['id'], 2)
```

### 测试数据库操作

```python
import unittest
from unittest.mock import patch, MagicMock

class UserRepository:
    def __init__(self, db):
        self.db = db

    def find_by_id(self, user_id):
        cursor = self.db.cursor()
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        return cursor.fetchone()

    def save(self, user):
        cursor = self.db.cursor()
        cursor.execute(
            "INSERT INTO users (name, email) VALUES (?, ?)",
            (user['name'], user['email'])
        )
        self.db.commit()
        return cursor.lastrowid

class TestUserRepository(unittest.TestCase):

    def setUp(self):
        self.mock_db = MagicMock()
        self.repo = UserRepository(self.mock_db)

    def test_find_by_id(self):
        mock_cursor = MagicMock()
        mock_cursor.fetchone.return_value = (1, 'Alice', 'alice@example.com')
        self.mock_db.cursor.return_value = mock_cursor

        result = self.repo.find_by_id(1)

        self.assertEqual(result, (1, 'Alice', 'alice@example.com'))
        mock_cursor.execute.assert_called_once()

    def test_save(self):
        mock_cursor = MagicMock()
        mock_cursor.lastrowid = 1
        self.mock_db.cursor.return_value = mock_cursor

        user = {'name': 'Bob', 'email': 'bob@example.com'}
        result = self.repo.save(user)

        self.assertEqual(result, 1)
        self.mock_db.commit.assert_called_once()
```

### 测试异步代码

```python
import unittest
import asyncio

async def async_fetch(url):
    await asyncio.sleep(0.1)
    return {'url': url, 'data': 'result'}

class TestAsync(unittest.TestCase):

    def test_async_function(self):
        """测试异步函数"""
        result = asyncio.run(async_fetch('http://example.com'))
        self.assertEqual(result['url'], 'http://example.com')

    def test_async_with_loop(self):
        """使用事件循环测试"""
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            result = loop.run_until_complete(async_fetch('http://test.com'))
            self.assertEqual(result['data'], 'result')
        finally:
            loop.close()

# Python 3.8+ 可以使用 IsolatedAsyncioTestCase
class TestAsyncIsolated(unittest.IsolatedAsyncioTestCase):

    async def test_async(self):
        result = await async_fetch('http://example.com')
        self.assertEqual(result['data'], 'result')
```

### 测试夹具

```python
import unittest
import tempfile
import shutil
import os

class TestWithFixtures(unittest.TestCase):
    """使用测试夹具"""

    @classmethod
    def setUpClass(cls):
        """创建临时目录"""
        cls.temp_dir = tempfile.mkdtemp()
        cls.test_data = {'users': [{'id': 1, 'name': 'Alice'}]}

    @classmethod
    def tearDownClass(cls):
        """清理临时目录"""
        shutil.rmtree(cls.temp_dir)

    def setUp(self):
        """每个测试的准备"""
        self.test_file = os.path.join(self.temp_dir, f'test_{self.id()}.txt')

    def tearDown(self):
        """每个测试的清理"""
        if os.path.exists(self.test_file):
            os.remove(self.test_file)

    def test_create_file(self):
        with open(self.test_file, 'w') as f:
            f.write('test')
        self.assertTrue(os.path.exists(self.test_file))

    def test_use_class_data(self):
        self.assertEqual(len(self.test_data['users']), 1)
```

## 与 Jest 的主要差异

| 特性 | Python unittest | Jest |
|-----|-----------------|------|
| 测试文件 | `test_*.py` | `*.test.js` |
| 测试方法 | `test_*` 方法 | `test()` / `it()` |
| 断言风格 | `self.assertEqual()` | `expect().toBe()` |
| Mock | `unittest.mock` | 内置 mock |
| 异步测试 | `asyncio.run()` | `async/await` |
| 参数化 | `subTest` | `test.each` |

## 总结

**测试基础**:
- `TestCase`: 测试用例基类
- `setUp/tearDown`: 测试准备和清理
- `setUpClass/tearDownClass`: 类级别准备清理

**断言方法**:
- `assertEqual/assertNotEqual`: 相等比较
- `assertTrue/assertFalse`: 布尔断言
- `assertRaises`: 异常断言
- `assertIn/assertNotIn`: 成员断言

**Mock**:
- `Mock/MagicMock`: 模拟对象
- `patch`: 替换模块或对象
- `side_effect`: 模拟副作用

::: tip 最佳实践
- 测试方法名清晰描述测试内容
- 每个测试只测试一个功能点
- 使用 setUp/tearDown 管理测试状态
- Mock 外部依赖，保持测试隔离
:::

::: info 相关模块
- `pytest` - 更强大的测试框架
- `doctest` - 文档字符串测试
- `coverage` - 代码覆盖率
:::

## 1. 目录结构调整

- [x] 1.1 创建 `docs/backend/python/tooling/dependency-management/` 目录
- [x] 1.2 创建 `dependency-management/index.md` 依赖工具总览页面
  - 工具演进历史（distutils → setuptools → pip → 现代工具）
  - 主流工具对比表（pip/Poetry/uv/PDM/Pipenv/Hatch/Conda）
  - 对比维度：速度、依赖解析、虚拟环境、锁定文件、配置格式、打包发布、社区活跃度
  - 场景化选择建议
  - 子页面导航链接

## 2. Poetry 文档重构

- [x] 2.1 将 `tooling/poetry.md` 迁移到 `dependency-management/poetry.md`
- [x] 2.2 移除 Poetry 文档中的 uv 相关内容：
  - 删除 "pip vs Poetry vs uv" 对比表格
  - 删除 "uv - 现代化替代方案" 章节
  - 删除 "何时选择 uv?" 相关内容
- [x] 2.3 保留 Poetry 专属内容，聚焦 Poetry 本身的安装、配置、使用

## 3. uv 文档创建

- [x] 3.1 创建 `dependency-management/uv.md` 完整教程
- [x] 3.2 包含 uv 安装、项目初始化、依赖管理等内容
- [x] 3.3 添加与 npm/pnpm 的对比表格
- [x] 3.4 添加常用命令速查表

## 4. 导航更新

- [x] 4.1 更新 `tooling/index.md` 的导航链接
- [x] 4.2 删除旧的 `tooling/poetry.md` 文件

## 5. 验证

- [x] 5.1 本地运行 VitePress 验证页面渲染正常
- [x] 5.2 检查所有内部链接是否正确

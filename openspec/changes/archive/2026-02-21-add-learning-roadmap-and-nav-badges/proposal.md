# Proposal: Add Learning Roadmap and Navigation Badges

## Change ID
`add-learning-roadmap-and-nav-badges`

## Summary
为 Python 教程添加学习路径指南页面，并在左侧导航栏中为重点内容和推荐库添加视觉标识（icon/badge），帮助学习者快速识别学习优先级和推荐选择。

## Motivation
当前问题：
1. 库内容增多后，学习者缺乏明确的学习方向和优先级指引
2. 同类型库（如 requests vs httpx vs aiohttp）难以快速识别推荐选择
3. 重点内容与次要内容在视觉上无区分

## Proposed Changes

### 1. 学习路径地图页面
创建 `/backend/python/roadmap.md` 页面，包含：
- **核心学习路径**：按重要性排序的必学内容
- **进阶路径**：根据应用场景的扩展学习
- **视觉化路线图**：使用 Mermaid 绘制学习流程图

### 2. 导航栏标识系统
在 VitePress 侧边栏配置中添加：
- **⭐ 重点标识**：核心必学内容（如 json、pathlib、pytest）
- **👍 推荐标识**：同类库中的推荐选择（如 FastAPI 优于 Flask）
- **🆕 新手友好**：适合入门学习的内容

### 3. 库对比与选择指南
在同类库的 index.md 中强化"选择建议"部分，明确：
- 各场景下的推荐选择
- 库之间的核心差异

## Scope
- 新增 1 个学习路径页面
- 修改 `config.mts` 侧边栏配置
- 更新部分 index.md 强化选择建议

## Non-Goals
- 不重新组织现有目录结构
- 不删除或合并现有文档

## Success Criteria
1. 学习者能通过路径页面快速了解学习顺序
2. 侧边栏标识清晰可辨，不影响可读性
3. 同类库推荐选择一目了然

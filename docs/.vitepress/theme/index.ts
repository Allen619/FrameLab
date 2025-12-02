/**
 * 自定义主题入口文件
 *
 * 扩展 VitePress 默认主题，添加移动端适配样式
 *
 * 注意：
 * - 保持与默认主题的兼容性
 * - 所有移动端样式通过媒体查询实现增量覆盖
 * - 不修改任何现有配置的行为
 */
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'

// 导入自定义样式
import './custom.css'
import './mobile.css'

export default {
  extends: DefaultTheme,
} satisfies Theme

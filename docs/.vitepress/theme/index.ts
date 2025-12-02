/**
 * 自定义主题入口文件
 *
 * 扩展 VitePress 默认主题，添加：
 * - 移动端适配样式
 * - Mermaid 图表点击放大功能
 *
 * 注意：
 * - 保持与默认主题的兼容性
 * - 所有移动端样式通过媒体查询实现增量覆盖
 * - 不修改任何现有配置的行为
 */
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { h } from 'vue'

// 导入自定义样式
import './custom.css'
import './mobile.css'
import './mermaid-zoom.css'

// 导入组件
import MermaidZoom from './components/MermaidZoom.vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // 在布局底部插入 MermaidZoom 组件
      'layout-bottom': () => h(MermaidZoom),
    })
  },
} satisfies Theme

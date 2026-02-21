<script setup lang="ts">
/**
 * Mermaid 图表放大组件
 *
 * 功能：
 * - 监听所有 Mermaid 图表的点击事件
 * - 点击后在全屏模态框中显示放大的图表
 * - 支持点击遮罩层或按 ESC 关闭
 * - 支持缩放和拖拽
 */
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const isOpen = ref(false)
const svgContent = ref('')
const scale = ref(1)
const position = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })

// 根据屏幕宽度获取默认缩放比例
function getDefaultScale() {
  return window.innerWidth <= 768 ? 2 : 3
}

// 打开放大弹窗
function openZoom(svg: SVGElement) {
  // 克隆 SVG 并移除固定尺寸限制
  const cloned = svg.cloneNode(true) as SVGElement
  cloned.removeAttribute('style')
  cloned.setAttribute('width', '100%')
  cloned.setAttribute('height', '100%')

  svgContent.value = cloned.outerHTML
  scale.value = getDefaultScale()
  position.value = { x: 0, y: 0 }
  isOpen.value = true

  // 禁止背景滚动
  document.body.style.overflow = 'hidden'
}

// 关闭弹窗
function closeZoom() {
  isOpen.value = false
  document.body.style.overflow = ''
}

// 缩放控制
function zoomIn() {
  scale.value = Math.min(scale.value + 0.25, 5)
}

function zoomOut() {
  scale.value = Math.max(scale.value - 0.25, 0.5)
}

function resetZoom() {
  scale.value = getDefaultScale()
  position.value = { x: 0, y: 0 }
}

// 鼠标滚轮缩放
function handleWheel(e: WheelEvent) {
  e.preventDefault()
  if (e.deltaY < 0) {
    zoomIn()
  } else {
    zoomOut()
  }
}

// 拖拽功能
function startDrag(e: MouseEvent | TouchEvent) {
  isDragging.value = true
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  dragStart.value = {
    x: clientX - position.value.x,
    y: clientY - position.value.y,
  }
}

function onDrag(e: MouseEvent | TouchEvent) {
  if (!isDragging.value) return
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  position.value = {
    x: clientX - dragStart.value.x,
    y: clientY - dragStart.value.y,
  }
}

function endDrag() {
  isDragging.value = false
}

// ESC 键关闭
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) {
    closeZoom()
  }
}

// 点击事件委托处理
function handleMermaidClick(e: Event) {
  const target = e.target as HTMLElement
  // 查找最近的 mermaid 容器
  const mermaidContainer = target.closest('.mermaid')
  if (mermaidContainer) {
    const svg = mermaidContainer.querySelector('svg')
    if (svg) {
      openZoom(svg)
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)

  // 使用事件委托监听所有 mermaid 图表点击
  nextTick(() => {
    document.addEventListener('click', handleMermaidClick)
  })
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('click', handleMermaidClick)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="mermaid-zoom">
      <div v-if="isOpen" class="mermaid-zoom-overlay" @click.self="closeZoom">
        <div class="mermaid-zoom-toolbar">
          <button class="zoom-btn" @click="zoomOut" title="缩小">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35M8 11h6" />
            </svg>
          </button>
          <span class="zoom-level">{{ Math.round(scale * 100) }}%</span>
          <button class="zoom-btn" @click="zoomIn" title="放大">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
            </svg>
          </button>
          <button class="zoom-btn" @click="resetZoom" title="重置">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
          <button class="zoom-btn close-btn" @click="closeZoom" title="关闭 (ESC)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div
          class="mermaid-zoom-content"
          :style="{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            cursor: isDragging ? 'grabbing' : 'grab',
          }"
          @mousedown="startDrag"
          @mousemove="onDrag"
          @mouseup="endDrag"
          @mouseleave="endDrag"
          @touchstart="startDrag"
          @touchmove="onDrag"
          @touchend="endDrag"
          @wheel="handleWheel"
          v-html="svgContent"
        />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.mermaid-zoom-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}

.mermaid-zoom-toolbar {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 10000;
}

.dark .mermaid-zoom-toolbar {
  background: rgba(30, 30, 30, 0.95);
}

.zoom-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  color: var(--vp-c-text-1);
  transition: background-color 0.2s;
}

.zoom-btn:hover {
  background: var(--vp-c-bg-soft);
}

.zoom-btn:active {
  background: var(--vp-c-bg-mute);
}

.zoom-level {
  min-width: 50px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.close-btn {
  margin-left: 8px;
  color: var(--vp-c-danger-1);
}

.close-btn:hover {
  background: var(--vp-c-danger-soft);
}

.mermaid-zoom-content {
  max-width: 90vw;
  max-height: 85vh;
  transition: transform 0.1s ease-out;
  user-select: none;
}

.mermaid-zoom-content :deep(svg) {
  max-width: 100%;
  max-height: 85vh;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
}

.dark .mermaid-zoom-content :deep(svg) {
  background: #1e1e1e;
}

/* 过渡动画 */
.mermaid-zoom-enter-active,
.mermaid-zoom-leave-active {
  transition: opacity 0.2s ease;
}

.mermaid-zoom-enter-from,
.mermaid-zoom-leave-to {
  opacity: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .mermaid-zoom-toolbar {
    top: 10px;
    padding: 6px 12px;
    gap: 4px;
  }

  .zoom-btn {
    width: 32px;
    height: 32px;
  }

  .zoom-level {
    font-size: 12px;
    min-width: 40px;
  }
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import { SEQUENTIAL_COLORS, withAlpha } from './chartTheme'

/**
 * A twelve-point trend line, drawn as plain inline SVG. No Chart.js instance —
 * six of these on one page would be six canvases for a shape that is a polyline.
 */
const props = withDefaults(defineProps<{ values: number[]; dimmed?: boolean }>(), { dimmed: false })

const W = 120
const H = 32

const path = computed(() => {
  const v = props.values
  if (v.length < 2) return ''
  const min = Math.min(...v)
  const max = Math.max(...v)
  const span = max - min || 1
  return v
    .map((n, i) => {
      const x = (i / (v.length - 1)) * W
      const y = H - ((n - min) / span) * (H - 4) - 2
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
})

const area = computed(() => (path.value ? `${path.value} L${W},${H} L0,${H} Z` : ''))
const stroke = SEQUENTIAL_COLORS[0]
</script>

<template>
  <svg
    class="spark"
    :class="{ 'spark--dimmed': dimmed }"
    :viewBox="`0 0 ${W} ${H}`"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path :d="area" :fill="withAlpha(stroke, 0.16)" />
    <path :d="path" fill="none" :stroke="stroke" stroke-width="1.75" stroke-linejoin="round" />
  </svg>
</template>

<style scoped>
.spark {
  display: block;
  width: 100%;
  height: 32px;
}

.spark--dimmed {
  opacity: 0.35;
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import { useChartTheme, withAlpha } from './chartTheme'

/**
 * Two metrics crossed, not one repeated: volume on x, reliability on y, and
 * exception count as bubble area. Answers a question nothing else on the page
 * asks — are the busiest regions also the least reliable?
 * Pure SVG; no chart library.
 */
const props = defineProps<{
  points: { label: string; x: number; y: number; size: number }[]
  target?: number
}>()

const { editorial, muted } = useChartTheme()

const W = 440
const H = 240
const PAD = { l: 44, r: 16, t: 14, b: 30 }

const xs = computed(() => props.points.map((p) => p.x))
const ys = computed(() => props.points.map((p) => p.y))
const pad = (lo: number, hi: number) => {
  const span = hi - lo || 1
  return [lo - span * 0.15, hi + span * 0.15] as const
}
const xDom = computed(() => pad(Math.min(...xs.value), Math.max(...xs.value)))
const yDom = computed(() => {
  const [lo, hi] = pad(Math.min(...ys.value), Math.max(...ys.value))
  // keep the target line inside the frame
  return props.target !== undefined ? ([Math.min(lo, props.target - 0.004), Math.max(hi, props.target + 0.004)] as const) : ([lo, hi] as const)
})

const px = (v: number) =>
  PAD.l + ((v - xDom.value[0]) / (xDom.value[1] - xDom.value[0])) * (W - PAD.l - PAD.r)
const py = (v: number) =>
  H - PAD.b - ((v - yDom.value[0]) / (yDom.value[1] - yDom.value[0])) * (H - PAD.t - PAD.b)

const maxSize = computed(() => Math.max(...props.points.map((p) => p.size), 1))
const r = (s: number) => 6 + (s / maxSize.value) * 14

const compact = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}k` : `${Math.round(n)}`)
</script>

<template>
  <div class="bubble">
    <svg :viewBox="`0 0 ${W} ${H}`" class="bubble__svg" role="img"
      aria-label="Parcel volume against on-time rate for each region; bubble size is exception count.">
      <!-- horizontal gridlines only, low opacity -->
      <g>
        <line
          v-for="t in 3"
          :key="t"
          :x1="PAD.l"
          :x2="W - PAD.r"
          :y1="PAD.t + ((H - PAD.t - PAD.b) / 3) * t"
          :y2="PAD.t + ((H - PAD.t - PAD.b) / 3) * t"
          :stroke="withAlpha(muted, 0.16)"
          stroke-width="1"
        />
      </g>

      <line
        v-if="target !== undefined"
        :x1="PAD.l"
        :x2="W - PAD.r"
        :y1="py(target)"
        :y2="py(target)"
        :stroke="withAlpha(muted, 0.8)"
        stroke-width="1.25"
        stroke-dasharray="5 4"
      />
      <text
        v-if="target !== undefined"
        :x="W - PAD.r"
        :y="py(target) - 4"
        text-anchor="end"
        class="bubble__ref"
        :fill="muted"
      >
        target {{ (target * 100).toFixed(0) }}%
      </text>

      <g v-for="p in points" :key="p.label">
        <circle
          :cx="px(p.x)"
          :cy="py(p.y)"
          :r="r(p.size)"
          :fill="withAlpha(editorial.teal, 0.4)"
          :stroke="editorial.teal"
          stroke-width="1.5"
        />
        <text :x="px(p.x)" :y="py(p.y) - r(p.size) - 5" text-anchor="middle" class="bubble__label">
          {{ p.label }}
        </text>
      </g>

      <text :x="PAD.l" :y="H - 8" class="bubble__axis" :fill="muted">
        {{ compact(xDom[0]) }} parcels
      </text>
      <text :x="W - PAD.r" :y="H - 8" text-anchor="end" class="bubble__axis" :fill="muted">
        {{ compact(xDom[1]) }}
      </text>
      <text :x="4" :y="PAD.t + 8" class="bubble__axis" :fill="muted">
        {{ (yDom[1] * 100).toFixed(0) }}%
      </text>
      <text :x="4" :y="H - PAD.b" class="bubble__axis" :fill="muted">
        {{ (yDom[0] * 100).toFixed(0) }}%
      </text>
    </svg>
    <p class="bubble__key">Bubble size is the number of open exceptions.</p>
  </div>
</template>

<style scoped>
.bubble__svg {
  display: block;
  width: 100%;
  height: auto;
}

.bubble__label {
  font-size: 10.5px;
  font-weight: 700;
  fill: rgb(var(--v-theme-on-surface));
}

.bubble__axis,
.bubble__ref {
  font-size: 9.5px;
  font-weight: 600;
}

.bubble__key {
  font-size: 11px;
  color: rgb(var(--v-theme-muted));
  margin: 8px 0 0;
}
</style>

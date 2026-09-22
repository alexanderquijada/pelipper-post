<script setup lang="ts">
import { computed } from 'vue'
import { useChartTheme, withAlpha } from './chartTheme'

/**
 * Waterfall: each cause is a floating segment stacked on the running total,
 * closing on the grand total. Shows how the total is built, not just its parts.
 */
const props = defineProps<{
  steps: { label: string; value: number }[]
  totalLabel?: string
}>()

const { editorial, muted } = useChartTheme()

const total = computed(() => props.steps.reduce((a, s) => a + s.value, 0))

const bars = computed(() => {
  let running = 0
  const rows = props.steps.map((s) => {
    const start = running
    running += s.value
    return { ...s, start, end: running, isTotal: false }
  })
  rows.push({ label: props.totalLabel ?? 'Total', value: total.value, start: 0, end: total.value, isTotal: true })
  return rows
})

const pct = (v: number) => (total.value > 0 ? (v / total.value) * 100 : 0)
const num = (v: number) => Math.round(v).toLocaleString('en-US')
</script>

<template>
  <ul class="fall">
    <li v-for="b in bars" :key="b.label" class="fall__row" :class="{ 'fall__row--total': b.isTotal }">
      <span class="fall__label">{{ b.label }}</span>

      <span class="fall__track" :style="{ background: withAlpha(muted, 0.1) }">
        <span
          class="fall__bar"
          :style="{
            left: `${pct(b.start)}%`,
            width: `${Math.max(pct(b.value), 0.8)}%`,
            background: b.isTotal ? editorial.indigo : editorial.coral,
          }"
        />
      </span>

      <span class="fall__value">{{ num(b.value) }}</span>
      <span class="fall__share">{{ pct(b.value).toFixed(1) }}%</span>
    </li>
  </ul>
</template>

<style scoped>
.fall {
  list-style: none;
  padding: 0;
  margin: 0;
}

.fall__row {
  display: grid;
  grid-template-columns: 112px 1fr 54px 46px;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
}

.fall__row--total {
  margin-top: 4px;
  padding-top: 10px;
  border-top: 1px solid rgba(var(--v-theme-muted), 0.22);
}

.fall__label {
  font-size: 12.5px;
  font-weight: 600;
}

.fall__row--total .fall__label {
  font-weight: 700;
}

.fall__track {
  position: relative;
  height: 15px;
  border-radius: 4px;
}

.fall__bar {
  position: absolute;
  top: 2px;
  bottom: 2px;
  border-radius: 3px;
  transition: all 0.35s ease;
}

.fall__value {
  font-size: 12.5px;
  font-weight: 700;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.fall__share {
  font-size: 11.5px;
  text-align: right;
  color: rgb(var(--v-theme-muted));
  font-variant-numeric: tabular-nums;
}

@media (prefers-reduced-motion: reduce) {
  .fall__bar {
    transition: none;
  }
}
</style>

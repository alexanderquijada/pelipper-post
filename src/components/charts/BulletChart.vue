<script setup lang="ts">
import { computed } from 'vue'
import { useChartTheme, withAlpha } from './chartTheme'

/**
 * One bullet per row: a measure bar against a target marker, on a banded track.
 * Pure CSS — no chart library.
 */
const props = withDefaults(
  defineProps<{
    rows: { label: string; value: number }[]
    target: number
    /** Axis floor, so small differences near the target stay readable. */
    min?: number
    max?: number
    format?: 'percent' | 'number'
  }>(),
  { min: 0, max: 1, format: 'percent' },
)

const { editorial, muted } = useChartTheme()

const pos = (v: number) => ((v - props.min) / (props.max - props.min)) * 100
const fmt = (v: number) =>
  props.format === 'percent' ? `${(v * 100).toFixed(1)}%` : Math.round(v).toLocaleString('en-US')

const barColor = (v: number) => (v >= props.target ? editorial.value.teal : editorial.value.coral)
const trackTint = computed(() => withAlpha(muted.value, 0.14))
</script>

<template>
  <ul class="bullet">
    <li v-for="r in rows" :key="r.label" class="bullet__row">
      <span class="bullet__label">{{ r.label }}</span>

      <span class="bullet__track" :style="{ background: trackTint }">
        <span
          class="bullet__measure"
          :style="{ width: `${pos(r.value)}%`, background: barColor(r.value) }"
        />
        <span class="bullet__target" :style="{ left: `${pos(target)}%` }" />
      </span>

      <span class="bullet__value" :style="{ color: barColor(r.value) }">{{ fmt(r.value) }}</span>
    </li>
  </ul>
</template>

<style scoped>
.bullet {
  list-style: none;
  padding: 0;
  margin: 0;
}

.bullet__row {
  display: grid;
  grid-template-columns: 62px 1fr 58px;
  align-items: center;
  gap: 10px;
  padding: 7px 0;
}

.bullet__label {
  font-size: 12.5px;
  font-weight: 600;
}

.bullet__track {
  position: relative;
  height: 14px;
  border-radius: 4px;
  overflow: hidden;
}

.bullet__measure {
  position: absolute;
  inset: 3px auto 3px 0;
  border-radius: 3px;
  transition: width 0.35s ease;
}

.bullet__target {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgb(var(--v-theme-on-surface));
  opacity: 0.75;
}

.bullet__value {
  font-size: 12.5px;
  font-weight: 700;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

@media (prefers-reduced-motion: reduce) {
  .bullet__measure {
    transition: none;
  }
}
</style>

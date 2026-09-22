<script setup lang="ts">
import { computed } from 'vue'
import { useChartTheme, withAlpha } from './chartTheme'

/**
 * Month × region heatmap, built as a CSS grid rather than a chart library.
 * A sequential ramp is correct here: the cell encodes magnitude, not identity.
 */
const props = withDefaults(defineProps<{
  months: string[]
  rows: { region: string; values: number[] }[]
  /** 'high-good' tints with teal, 'high-bad' with coral. */
  polarity?: 'high-good' | 'high-bad'
  unit?: string
  format?: 'number' | 'percent'
  /**
   * 'row' scales each region against its OWN range, so the seasonal shape is
   * what you see. 'global' scales every cell together, which makes region size
   * the dominant signal and flattens seasonality in the smaller regions.
   */
  normalize?: 'row' | 'global'
}>(), { polarity: 'high-good', unit: '', format: 'number', normalize: 'row' })

const { editorial, muted } = useChartTheme()

const flat = computed(() => props.rows.flatMap((r) => r.values))
const min = computed(() => Math.min(...flat.value))
const max = computed(() => Math.max(...flat.value))

/** Per-row bounds, used when normalize === 'row'. */
const rowBounds = computed(() =>
  Object.fromEntries(
    props.rows.map((r) => [r.region, { lo: Math.min(...r.values), hi: Math.max(...r.values) }]),
  ),
)

const rampColor = computed(() =>
  props.polarity === 'high-bad' ? editorial.value.coral : editorial.value.teal,
)

function intensity(v: number, region: string) {
  if (props.normalize === 'global') {
    return (v - min.value) / (max.value - min.value || 1)
  }
  const b = rowBounds.value[region]!
  return (v - b.lo) / (b.hi - b.lo || 1)
}

function cellStyle(v: number, region: string) {
  // 0.08 floor so a row's quietest month is still visibly part of the grid
  return { background: withAlpha(rampColor.value, 0.08 + intensity(v, region) * 0.8) }
}

const fmt = (v: number) =>
  props.format === 'percent' ? `${(v * 100).toFixed(1)}%` : Math.round(v).toLocaleString('en-US')

const shortMonth = (label: string) => label.split(' ')[0]
</script>

<template>
  <div class="heat">
    <div class="heat__grid" :style="{ gridTemplateColumns: `64px repeat(${months.length}, 1fr)` }">
      <span class="heat__corner" />
      <span v-for="m in months" :key="m" class="heat__col">{{ shortMonth(m) }}</span>

      <template v-for="row in rows" :key="row.region">
        <span class="heat__row-label">{{ row.region }}</span>
        <span
          v-for="(v, i) in row.values"
          :key="i"
          class="heat__cell"
          :style="cellStyle(v, row.region)"
          :title="`${row.region} · ${months[i]} · ${fmt(v)}${unit ? ' ' + unit : ''}`"
        />
      </template>
    </div>

    <div class="heat__legend">
      <span class="heat__legend-label">{{ normalize === 'global' ? fmt(min) : 'quietest' }}</span>
      <span
        class="heat__ramp"
        :style="{
          background: `linear-gradient(90deg, ${withAlpha(rampColor, 0.08)}, ${withAlpha(rampColor, 0.88)})`,
        }"
      />
      <span class="heat__legend-label">{{ normalize === 'global' ? fmt(max) : 'busiest' }}</span>
      <span class="heat__legend-unit" :style="{ color: muted }">
        {{ normalize === 'global' ? unit : 'shaded within each region' }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.heat__grid {
  display: grid;
  gap: 3px;
  align-items: center;
}

.heat__corner {
  display: block;
}

.heat__col,
.heat__row-label {
  font-size: 10px;
  font-weight: 600;
  color: rgb(var(--v-theme-muted));
  letter-spacing: 0.02em;
}

.heat__col {
  text-align: center;
}

.heat__row-label {
  text-align: left;
  padding-right: 6px;
}

.heat__cell {
  height: 26px;
  border-radius: 4px;
  display: block;
}

.heat__legend {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}

.heat__ramp {
  flex: 0 1 140px;
  height: 7px;
  border-radius: 999px;
}

.heat__legend-label,
.heat__legend-unit {
  font-size: 10.5px;
  color: rgb(var(--v-theme-muted));
  font-variant-numeric: tabular-nums;
}
</style>

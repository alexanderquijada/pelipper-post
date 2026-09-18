<script setup lang="ts">
import { computed } from 'vue'

export interface MetricCardProps {
  /** Small uppercase muted label above the value. */
  label: string
  /**
   * The raw number. For format="percent" this is a FRACTION — pass 0.942 to
   * render "94.2%", matching how `trend` is expressed.
   */
  value: number
  /** 'number' gets thousands separators; 'percent' renders one decimal place. */
  format: 'number' | 'percent'
  /**
   * Change vs. the previous period, as a fraction: 0.084 renders "8.4%".
   * `null` means there is no prior period to compare against — the whole trend
   * indicator is omitted rather than shown as zero.
   */
  trend: number | null
  /**
   * When true a DECREASE is good (green) and an increase is bad (red).
   * Fainted Couriers is the inverted case — fewer couriers fainting is better.
   */
  invertTrend?: boolean
  /** mdi icon name shown in the card corner, e.g. "mdi-dumbbell". */
  icon: string
}

const props = withDefaults(defineProps<MetricCardProps>(), {
  invertTrend: false,
})

const displayValue = computed(() =>
  props.format === 'percent'
    ? `${(props.value * 100).toFixed(1)}%`
    : props.value.toLocaleString('en-US'),
)

const hasTrend = computed(() => props.trend !== null)

/** 'up' | 'down' | 'flat' — direction of movement, before any good/bad judgement. */
const direction = computed(() => {
  if (props.trend === null || props.trend === 0) return 'flat'
  return props.trend > 0 ? 'up' : 'down'
})

const trendIcon = computed(() => {
  if (direction.value === 'flat') return 'mdi-minus'
  return direction.value === 'up' ? 'mdi-menu-up' : 'mdi-menu-down'
})

/** Whether this movement is good news, which is what decides the colour. */
const trendColor = computed(() => {
  if (direction.value === 'flat') return 'muted'
  const isIncrease = direction.value === 'up'
  const isGood = props.invertTrend ? !isIncrease : isIncrease
  return isGood ? 'success' : 'error'
})

const trendLabel = computed(() => {
  if (props.trend === null) return ''
  return `${(Math.abs(props.trend) * 100).toFixed(1)}%`
})
</script>

<template>
  <v-card class="pa-6" height="100%">
    <div class="d-flex align-start justify-space-between">
      <div class="text-overline text-muted metric-card__label">{{ label }}</div>
      <v-icon :icon="icon" color="primary" size="20" class="metric-card__icon" />
    </div>

    <div class="text-h4 font-weight-bold mt-2">{{ displayValue }}</div>

    <div v-if="hasTrend" class="d-flex align-center mt-2" :class="`text-${trendColor}`">
      <v-icon :icon="trendIcon" size="18" />
      <span class="text-caption ml-1">{{ trendLabel }} vs. last month</span>
    </div>
  </v-card>
</template>

<style scoped>
/* text-overline forces its own line-height; this keeps a two-word label from
   colliding with the corner icon.

   min-height reserves two lines whether or not the label wraps, so the big
   values stay on a common baseline across the KPI row. Without it, a label that
   wraps ("Berry Crates Delivered") pushes its own value lower than its
   neighbours' and the row reads as misaligned. */
.metric-card__label {
  line-height: 1.2;
  min-height: 2.4em;
}

.metric-card__icon {
  opacity: 0.6;
}
</style>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useChartTheme } from '@/components/charts/chartTheme'
import { conceptItemUrl } from '@/utils/sprites'

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
  /**
   * How to render `trend`. 'relative' (default) shows it as a percentage change.
   * 'points' shows it as percentage POINTS — correct for a metric that is itself
   * a rate, where "+3.1%" and "+3.1 points" mean very different things.
   */
  trendUnit?: 'relative' | 'points'
  /** Editorial accent for the icon circle. */
  accent?: 'coral' | 'indigo' | 'teal' | 'orange' | 'plum'
  /** Concept key for a Pokémon item sprite; falls back to `icon` when absent. */
  sprite?: string
}

const props = withDefaults(defineProps<MetricCardProps>(), {
  invertTrend: false,
  trendUnit: 'relative',
  accent: 'indigo',
  sprite: '',
})

const { editorial } = useChartTheme()
const accentHex = computed(() => editorial.value[props.accent])
/** rgb triplet so the circle can tint at 13% without a second hex. */
const accentRgb = computed(() => {
  const h = accentHex.value.replace('#', '')
  const n = Number.parseInt(h, 16)
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`
})
const spriteUrlFor = computed(() => (props.sprite ? conceptItemUrl(props.sprite) : null))
const spriteFailed = ref(false)

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
  const magnitude = (Math.abs(props.trend) * 100).toFixed(1)
  return props.trendUnit === 'points' ? `${magnitude} pts` : `${magnitude}%`
})

/**
 * The visible trend is now just an arrow and a percentage — the wording that
 * used to carry the direction lives in a single caption beside the KPI row.
 * This keeps the direction available to screen readers, which can't infer it
 * from the arrow glyph or the colour.
 */
const trendAria = computed(() => {
  if (props.trend === null) return undefined
  if (direction.value === 'flat') return 'No change from the previous period'
  const word = direction.value === 'up' ? 'Up' : 'Down'
  return `${word} ${trendLabel.value} from the previous period`
})
</script>

<template>
  <v-card class="metric-card" height="100%">
    <div class="d-flex align-start justify-space-between ga-2">
      <div class="metric-card__label">{{ label }}</div>
      <span class="pp-ico pp-ico--sm" :style="{ '--pp-accent-rgb': accentRgb }">
        <img
          v-if="spriteUrlFor && !spriteFailed"
          :src="spriteUrlFor"
          alt=""
          @error="spriteFailed = true"
        />
        <v-icon v-else :icon="icon" size="15" />
      </span>
    </div>

    <div class="metric-card__value">{{ displayValue }}</div>

    <!-- The delta reads as a small tinted pill, not bare arrow text. -->
    <div
      v-if="hasTrend"
      class="metric-card__delta"
      :class="`metric-card__delta--${trendColor}`"
      :aria-label="trendAria"
    >
      <v-icon :icon="trendIcon" size="14" aria-hidden="true" />
      <span>{{ trendLabel }}</span>
    </div>
    <div v-else class="metric-card__delta metric-card__delta--none">no prior period</div>
  </v-card>
</template>

<style scoped>
/* Density values are fixed by BRIEF.md §4 — 28px value, 11px label, 20px padding. */
.metric-card {
  padding: 20px;
}

.metric-card__label {
  font-size: 11px;
  font-weight: 600;
  line-height: 1.3;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgb(var(--v-theme-muted));
  /* reserve two lines so every value in the strip shares a baseline */
  min-height: 2.6em;
}

.metric-card__value {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.01em;
  margin-top: 2px;
}

.metric-card__delta {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin-top: 10px;
  padding: 2px 8px 2px 5px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.5;
}

.metric-card__delta--success {
  color: rgb(var(--v-theme-success));
  background: rgba(var(--v-theme-success), 0.14);
}

.metric-card__delta--error {
  color: rgb(var(--v-theme-error));
  background: rgba(var(--v-theme-error), 0.14);
}

.metric-card__delta--muted,
.metric-card__delta--none {
  color: rgb(var(--v-theme-muted));
  background: rgba(var(--v-theme-muted), 0.12);
}

.metric-card__delta--none {
  padding-left: 8px;
  font-weight: 500;
}
</style>

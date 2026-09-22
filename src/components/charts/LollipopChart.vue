<script setup lang="ts">
import { computed } from 'vue'
import { useChartTheme, withAlpha } from './chartTheme'
import { SPRITE_FALLBACK_ICON, spriteUrl } from '@/utils/sprites'

/**
 * Dot plot: a thin stem to a dot, rather than a heavy bar. The ink is in the
 * dot, which is what the eye compares.
 */
const props = withDefaults(
  defineProps<{
    rows: { label: string; value: number; sublabel?: string; dexId?: number }[]
    format?: 'percent' | 'number'
    accent?: 'coral' | 'indigo' | 'teal' | 'orange' | 'plum'
    /** Optional baseline, e.g. the fleet average. */
    reference?: number | null
    referenceLabel?: string
  }>(),
  { format: 'number', accent: 'indigo', reference: null, referenceLabel: 'Average' },
)

const { editorial, muted } = useChartTheme()

const color = computed(() => editorial.value[props.accent])
const values = computed(() => props.rows.map((r) => r.value))
const lo = computed(() => Math.min(...values.value, props.reference ?? Infinity))
const hi = computed(() => Math.max(...values.value, props.reference ?? -Infinity))

// pad the scale so the extremes aren't pinned to the track ends
const span = computed(() => (hi.value - lo.value) || 1)
const floor = computed(() => lo.value - span.value * 0.12)
const ceil = computed(() => hi.value + span.value * 0.12)
const pos = (v: number) => ((v - floor.value) / (ceil.value - floor.value)) * 100

const fmt = (v: number) =>
  props.format === 'percent' ? `${(v * 100).toFixed(1)}%` : Math.round(v).toLocaleString('en-US')
</script>

<template>
  <ul class="pop">
    <li v-for="r in rows" :key="r.label" class="pop__row">
      <span class="pop__who">
        <v-avatar v-if="r.dexId" size="26" class="pop__avatar">
          <v-img :src="spriteUrl(r.dexId)" :alt="''">
            <template #error>
              <v-icon :icon="SPRITE_FALLBACK_ICON" color="muted" size="14" />
            </template>
          </v-img>
        </v-avatar>
        <span class="pop__label">
          {{ r.label }}
          <em v-if="r.sublabel" class="pop__sub">{{ r.sublabel }}</em>
        </span>
      </span>

      <span class="pop__track" :style="{ background: withAlpha(muted, 0.12) }">
        <span
          v-if="reference !== null"
          class="pop__ref"
          :style="{ left: `${pos(reference)}%` }"
          :title="`${referenceLabel} ${fmt(reference)}`"
        />
        <span class="pop__stem" :style="{ width: `${pos(r.value)}%`, background: withAlpha(color, 0.45) }" />
        <span class="pop__dot" :style="{ left: `${pos(r.value)}%`, background: color }" />
      </span>

      <span class="pop__value">{{ fmt(r.value) }}</span>
    </li>
  </ul>
</template>

<style scoped>
.pop {
  list-style: none;
  padding: 0;
  margin: 0;
}

.pop__row {
  display: grid;
  grid-template-columns: 130px 1fr 58px;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
}

.pop__who {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.pop__avatar {
  background: rgba(var(--v-theme-primary), 0.12);
  flex: none;
}

.pop__avatar :deep(img) {
  object-fit: contain;
  padding: 2px;
}

.pop__label {
  font-size: 12.5px;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.pop__sub {
  font-size: 10.5px;
  font-weight: 400;
  font-style: normal;
  color: rgb(var(--v-theme-muted));
}

.pop__track {
  position: relative;
  height: 12px;
  border-radius: 999px;
}

.pop__stem {
  position: absolute;
  left: 0;
  top: 50%;
  height: 2px;
  transform: translateY(-50%);
  border-radius: 999px;
}

.pop__dot {
  position: absolute;
  top: 50%;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 0 2px rgb(var(--v-theme-surface));
}

.pop__ref {
  position: absolute;
  top: -2px;
  bottom: -2px;
  width: 2px;
  background: rgb(var(--v-theme-on-surface));
  opacity: 0.35;
}

.pop__value {
  font-size: 12.5px;
  font-weight: 700;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
</style>

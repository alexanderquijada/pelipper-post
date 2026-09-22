<script setup lang="ts">
import { rgbTriplet, useChartTheme } from '@/components/charts/chartTheme'
import type { DelayRisk, RegionWeather } from '@/types/metrics'

defineProps<{ rows: RegionWeather[] }>()

const RISK_COLOR: Record<DelayRisk, string> = {
  High: 'error',
  Moderate: 'accent',
  Low: 'success',
}

// Circle tint tracks the delay risk, so the row reads before you get to the chip.
const RISK_ACCENT: Record<DelayRisk, 'coral' | 'orange' | 'teal'> = {
  High: 'coral',
  Moderate: 'orange',
  Low: 'teal',
}

const { editorial, iconGlyph } = useChartTheme()
const accentRgb = (risk: DelayRisk) => rgbTriplet(editorial.value[RISK_ACCENT[risk]])
const glyphRgb = (risk: DelayRisk) => rgbTriplet(iconGlyph.value[RISK_ACCENT[risk]])
</script>

<template>
  <v-card class="pp-card-pad" height="100%">
    <h2 class="pp-card-title">Regional Weather</h2>
    <p class="pp-card-subtitle">Current conditions across the delivery network.</p>

    <ul class="wx">
      <li v-for="w in rows" :key="w.region" class="wx__row" :title="w.note">
        <span
          class="pp-ico pp-ico--sm"
          :style="{ '--pp-accent-rgb': accentRgb(w.delayRisk), '--pp-glyph-rgb': glyphRgb(w.delayRisk) }"
        >
          <v-icon :icon="w.icon" size="20" />
        </span>
        <span class="wx__region">{{ w.region }}</span>
        <span class="wx__condition">{{ w.condition }}</span>
        <span class="wx__temp">{{ w.tempC }}°C</span>
        <v-chip :color="RISK_COLOR[w.delayRisk]" variant="tonal" size="x-small" class="wx__chip">
          {{ w.delayRisk }}
        </v-chip>
      </li>
    </ul>
  </v-card>
</template>

<style scoped>
.wx {
  list-style: none;
  padding: 0;
  margin: 0;
}

.wx__row {
  display: grid;
  grid-template-columns: 34px 62px 1fr auto auto;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
}

.wx__row + .wx__row {
  border-top: 1px solid rgba(var(--v-theme-muted), 0.16);
}

.wx__region {
  font-size: 12.5px;
  font-weight: 600;
}

.wx__condition {
  font-size: 12px;
  color: rgb(var(--v-theme-muted));
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wx__temp {
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  color: rgb(var(--v-theme-muted));
}

.wx__chip {
  justify-self: end;
}
</style>

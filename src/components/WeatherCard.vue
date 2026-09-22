<script setup lang="ts">
import { rgbTriplet, useChartTheme, weatherKind } from '@/components/charts/chartTheme'
import type { DelayRisk, RegionWeather } from '@/types/metrics'

defineProps<{ rows: RegionWeather[] }>()

const RISK_COLOR: Record<DelayRisk, string> = {
  High: 'error',
  Moderate: 'accent',
  Low: 'success',
}

/**
 * The circle tint tracks the WEATHER, not the delay risk. Tinting it by risk put
 * a snowflake in a red circle and a sun in a teal one — the icon said one thing
 * and its own background said another. The chip is the only risk encoder here.
 */
const { weather } = useChartTheme()
const wxRgb = (icon: string) => rgbTriplet(weather.value[weatherKind(icon)])
</script>

<template>
  <v-card class="pp-card-pad" height="100%">
    <h2 class="pp-card-title">Weather Delays Today</h2>
    <p class="pp-card-subtitle">
      Current conditions in each region, and how likely they are to delay deliveries.
    </p>

    <!-- The chip used to sit unlabelled beside a temperature, so "High" read as
         either a temperature or an unnamed severity. The header names it. -->
    <div class="wx__head" aria-hidden="true">
      <span></span>
      <span>Region</span>
      <span>Conditions</span>
      <span>Temp</span>
      <span class="wx__head-risk">Delay Risk</span>
    </div>

    <ul class="wx">
      <li v-for="w in rows" :key="w.region" class="wx__row" :title="w.note">
        <span
          class="pp-ico pp-ico--sm"
          :style="{ '--pp-accent-rgb': wxRgb(w.icon), '--pp-glyph-rgb': wxRgb(w.icon) }"
        >
          <v-icon :icon="w.icon" size="22" />
        </span>
        <span class="wx__region">{{ w.region }}</span>
        <span class="wx__condition">{{ w.condition }}</span>
        <span class="wx__temp">{{ w.tempC }}°C</span>
        <v-chip
          :color="RISK_COLOR[w.delayRisk]"
          variant="tonal"
          size="x-small"
          class="wx__chip"
          :aria-label="`Delay risk: ${w.delayRisk}`"
        >
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

/* Identical track sizing to .wx__row so each label sits over its own column. */
.wx__head,
.wx__row {
  display: grid;
  grid-template-columns: 34px 62px 1fr auto auto;
  align-items: center;
  gap: 10px;
}

.wx__head {
  padding: 2px 0 6px;
  border-bottom: 1px solid rgba(var(--v-theme-muted), 0.16);
  font-size: 9.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgb(var(--v-theme-muted));
}

.wx__head-risk {
  justify-self: end;
}

.wx__row {
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

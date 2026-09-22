<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import MetricCard, { type MetricCardProps } from '@/components/MetricCard.vue'
import CriticalSignals from '@/components/CriticalSignals.vue'
import ReliabilityHealth from '@/components/ReliabilityHealth.vue'
import DeliveryTrendChart from '@/components/charts/DeliveryTrendChart.vue'
import { useMetrics } from '@/composables/useMetrics'
import { SPRITE_FALLBACK_ICON, spriteUrl } from '@/utils/sprites'

const {
  filterCaption,
  current,
  hasData,
  trends,
  trendCaption,
  trendChart,
  cargoCategories,
  reliability,
  signals,
  filteredCouriers,
} = useMetrics()

/**
 * Overview is the highlights. Each headline value lives HERE and nowhere else —
 * the detail pages show cuts of these, not the totals again. BRIEF.md §4.
 */
const kpiCards = computed<MetricCardProps[]>(() => [
  {
    label: 'Parcels Delivered',
    value: current.value.parcelsDelivered,
    format: 'number',
    trend: trends.value.parcelsDelivered,
    icon: 'mdi-package-variant-closed',
  },
  {
    label: 'On-Time Rate',
    value: current.value.onTimeRate,
    format: 'percent',
    trend: trends.value.onTimeRate,
    trendUnit: 'points',
    icon: 'mdi-clock-check-outline',
  },
  {
    label: 'First-Attempt Rate',
    value: current.value.firstAttemptRate,
    format: 'percent',
    trend: trends.value.firstAttemptRate,
    trendUnit: 'points',
    icon: 'mdi-check-decagram-outline',
  },
  {
    label: 'Cost per Parcel',
    value: current.value.costPerParcel,
    format: 'number',
    trend: trends.value.costPerParcel,
    invertTrend: true,
    icon: 'mdi-cash-multiple',
  },
  {
    label: 'Open Exceptions',
    value: current.value.openExceptions,
    format: 'number',
    trend: trends.value.openExceptions,
    invertTrend: true,
    icon: 'mdi-alert-circle-outline',
  },
])

/** Top three by on-time rate — the roster itself lives on /couriers. */
const topCouriers = computed(() =>
  [...filteredCouriers.value].sort((a, b) => b.onTimeRate - a.onTimeRate).slice(0, 3),
)

const topSignals = computed(() => signals.value.slice(0, 3))
const topCargo = computed(() => cargoCategories.value.slice(0, 3))

/**
 * Rows that are NOT already in the KPI strip above — On-Time Rate and parcel
 * volume both live there, so repeating them here would duplicate a headline.
 */
const snapshotRows = computed(() =>
  reliability.value.filter(
    (r) => r.label !== 'On-Time Rate' && r.label !== 'Avg Monthly Parcel Volume',
  ),
)
const pct = (n: number) => `${(n * 100).toFixed(1)}%`
</script>

<template>
  <v-container class="pelipper-width px-4 py-4">
    <template v-if="hasData">
      <section class="pp-section">
        <div class="mb-3">
          <p class="pp-eyebrow mb-0">Overview</p>
          <p class="pp-section-subtitle">
            {{ filterCaption }}<template v-if="trendCaption"> · {{ trendCaption }}</template>
          </p>
        </div>

        <v-row dense>
          <v-col v-for="card in kpiCards" :key="card.label" cols="12" sm="6" md="4" lg="2" xl="2">
            <MetricCard v-bind="card" />
          </v-col>
        </v-row>
      </section>

      <section class="pp-section">
        <v-row dense>
          <v-col cols="12" lg="8">
            <v-card class="pp-card-pad" height="100%">
              <div class="d-flex align-start justify-space-between ga-3">
                <h2 class="pp-card-title">Parcel Volume Trend</h2>
                <RouterLink class="pp-details" to="/trends">View details →</RouterLink>
              </div>
              <p class="pp-card-subtitle">Parcel volume across the trailing twelve months.</p>
              <DeliveryTrendChart
                parcels-only
                :labels="trendChart.labels"
                :parcels-delivered="trendChart.parcelsDelivered"
                :gym-supply-runs="trendChart.gymSupplyRuns"
                :selected-index="trendChart.selectedIndex"
              />
            </v-card>
          </v-col>

          <v-col cols="12" lg="4">
            <CriticalSignals :signals="topSignals" details-to="/signals" />
          </v-col>
        </v-row>
      </section>

      <section class="pp-section">
        <v-row dense>
          <v-col cols="12" md="6" lg="4">
            <v-card class="pp-card-pad" height="100%">
              <div class="d-flex align-start justify-space-between ga-3">
                <h2 class="pp-card-title">Cargo Share</h2>
                <RouterLink class="pp-details" to="/cargo">View details →</RouterLink>
              </div>
              <p class="pp-card-subtitle">The three largest cargo types by share of parcels.</p>
              <ul class="top">
                <li v-for="c in topCargo" :key="c.label" class="top__row">
                  <span class="top__name">{{ c.label }}</span>
                  <span class="top__region" />
                  <span class="top__value">{{ (c.share * 100).toFixed(1) }}%</span>
                </li>
              </ul>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" lg="4">
            <ReliabilityHealth
              title="Reliability Snapshot"
              subtitle="Fleet and exception health at a glance."
              :rows="snapshotRows"
              details-to="/network"
            />
          </v-col>

          <v-col cols="12" lg="4">
            <v-card class="pp-card-pad" height="100%">
              <div class="d-flex align-start justify-space-between ga-3">
                <h2 class="pp-card-title">Top Couriers</h2>
                <RouterLink class="pp-details" to="/couriers">View details →</RouterLink>
              </div>
              <p class="pp-card-subtitle">The three strongest on-time performers in scope.</p>

              <ul v-if="topCouriers.length" class="top">
                <li v-for="c in topCouriers" :key="c.name" class="top__row">
                  <v-avatar size="34" class="top__avatar">
                    <v-img :src="spriteUrl(c.dexId)" :alt="`${c.species} sprite`">
                      <template #error>
                        <v-icon :icon="SPRITE_FALLBACK_ICON" color="muted" />
                      </template>
                    </v-img>
                  </v-avatar>
                  <span class="top__name">{{ c.name }}</span>
                  <span class="top__region">{{ c.homeRegion }}</span>
                  <span class="top__value">{{ pct(c.onTimeRate) }}</span>
                </li>
              </ul>
              <p v-else class="text-caption text-muted mb-0">No couriers in this region.</p>
            </v-card>
          </v-col>
        </v-row>
      </section>
    </template>

    <v-row v-else dense>
      <v-col cols="12">
        <v-card class="pa-12 text-center">
          <v-icon icon="mdi-package-variant-closed" color="muted" size="36" class="mb-3" />
          <p class="text-body-2 mb-1">No data for this combination.</p>
          <p class="text-caption text-muted mb-0">Try a different month or region.</p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.pp-section {
  margin-bottom: 16px;
}

.pp-section-subtitle {
  font-size: 12px;
  line-height: 1.4;
  color: rgb(var(--v-theme-muted));
  margin: 2px 0 0;
}

.pp-details {
  flex: none;
  font-size: 12px;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
  white-space: nowrap;
}

.pp-details:hover {
  text-decoration: underline;
}

.pp-eyebrow {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgb(var(--v-theme-muted));
}

.top {
  list-style: none;
  padding: 0;
  margin: 0;
}

.top__row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 0;
}

.top__row + .top__row {
  border-top: 1px solid rgba(var(--v-theme-muted), 0.16);
}

.top__avatar {
  background: rgba(var(--v-theme-primary), 0.12);
  flex: none;
}

.top__avatar :deep(img) {
  object-fit: contain;
  padding: 2px;
}

.top__name {
  font-size: 13px;
  font-weight: 600;
}

.top__region {
  flex: 1 1 auto;
  font-size: 11.5px;
  color: rgb(var(--v-theme-muted));
}

.top__value {
  font-size: 13px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
</style>

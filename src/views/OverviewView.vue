<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import MetricCard, { type MetricCardProps } from '@/components/MetricCard.vue'
import CriticalSignals from '@/components/CriticalSignals.vue'
import ReliabilityHealth from '@/components/ReliabilityHealth.vue'
import PageShell from '@/components/PageShell.vue'
import WeatherCard from '@/components/WeatherCard.vue'
import DeliveryTrendChart from '@/components/charts/DeliveryTrendChart.vue'
import { useChartTheme, weatherKind } from '@/components/charts/chartTheme'
import { RISK_PHRASE, RISK_TONE } from '@/utils/status'
import { useMetrics } from '@/composables/useMetrics'
import { SPRITE_FALLBACK_ICON, spriteUrl } from '@/utils/sprites'

const {
  current,
  hasData,
  trends,
  trendChart,
  cargoCategories,
  reliability,
  signals,
  filteredCouriers,
  weather,
  weatherFor,
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
    accent: 'indigo',
  },
  {
    label: 'On-Time Rate',
    value: current.value.onTimeRate,
    format: 'percent',
    trend: trends.value.onTimeRate,
    trendUnit: 'points',
    icon: 'mdi-clock-check-outline',
    accent: 'teal',
    sprite: 'onTime',
  },
  {
    label: 'First-Attempt Rate',
    value: current.value.firstAttemptRate,
    format: 'percent',
    trend: trends.value.firstAttemptRate,
    trendUnit: 'points',
    icon: 'mdi-check-decagram-outline',
    accent: 'plum',
  },
  {
    label: 'Cost per Parcel',
    // weighted average in Pokédollars — whole currency, not fractions of one
    value: Math.round(current.value.costPerParcel),
    format: 'number',
    trend: trends.value.costPerParcel,
    invertTrend: true,
    icon: 'mdi-cash-multiple',
    accent: 'orange',
    sprite: 'cost',
  },
  {
    label: 'Open Exceptions',
    value: current.value.openExceptions,
    format: 'number',
    trend: trends.value.openExceptions,
    invertTrend: true,
    icon: 'mdi-alert-circle-outline',
    accent: 'coral',
    sprite: 'exceptions',
  },
])

/** Top three by on-time rate — the roster itself lives on /couriers. */
/** Whole fleet in scope, best on-time first — the card spans the full row. */
const rankedCouriers = computed(() =>
  [...filteredCouriers.value].sort((a, b) => b.onTimeRate - a.onTimeRate),
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

// `weather` is already the dataset rows from useMetrics(); this is the tint map.
/** Weather on the icon, risk on the chip — never both on one channel. */
const { weather: weatherTint } = useChartTheme()
const wxColor = (icon: string) => weatherTint.value[weatherKind(icon)]
</script>

<template>
  <PageShell
    title="Network Overview"
    subtitle="A summary of how the delivery network is performing right now."
  >
    <template v-if="hasData">
      <section class="pp-section">
        <!-- auto-fit grid rather than the 12-column row: five cards can't divide
             12 evenly, which left two columns of dead space at the end. -->
        <div class="kpi-strip">
          <MetricCard v-for="card in kpiCards" :key="card.label" v-bind="card" />
        </div>
      </section>

      <section class="pp-section">
        <v-row dense>
          <v-col cols="12" lg="8">
            <v-card class="pp-card-pad" height="100%">
              <div class="d-flex align-start justify-space-between ga-3">
                <h2 class="pp-card-title">Parcel Volume Trend</h2>
                <RouterLink class="pp-details" to="/trends">View details →</RouterLink>
              </div>
              <p class="pp-card-subtitle">
                Whether we're shipping more or less than we were a year ago.
              </p>
              <DeliveryTrendChart
                parcels-only
                :labels="trendChart.labels"
                :parcels-delivered="trendChart.parcelsDelivered"
                :gym-supply-runs="trendChart.gymSupplyRuns"
                :selected-index="trendChart.selectedIndex"
                :marked="trendChart.marked"
              />
            </v-card>
          </v-col>

          <v-col cols="12" lg="4">
            <CriticalSignals :signals="topSignals" details-to="/signals" />
          </v-col>
        </v-row>
      </section>

      <!-- align="start", so these three size to their own content.
           Weather has six rows plus a header; Cargo has three. Stretching all
           three to the tallest left ~130px of empty band under two of them.
           The alternative — padding the short cards with extra rows — would
           mean surfacing metrics that already have a home elsewhere, which §4's
           one-home-per-metric rule forbids. Ragged bottoms are the cheaper cost.
           Horizontal fill is unaffected: the row is still fully occupied. -->
      <section class="pp-section">
        <v-row dense align="start">
          <v-col cols="12" md="6" lg="4">
            <v-card class="pp-card-pad">
              <div class="d-flex align-start justify-space-between ga-3">
                <h2 class="pp-card-title">Top Cargo Types</h2>
                <RouterLink class="pp-details" to="/cargo">View details →</RouterLink>
              </div>
              <p class="pp-card-subtitle">The goods that make up the bulk of what we move.</p>
              <ul class="mini">
                <li v-for="c in topCargo" :key="c.label" class="mini__row">
                  <span class="mini__label">{{ c.label }}</span>
                  <span class="mini__value">{{ (c.share * 100).toFixed(1) }}%</span>
                </li>
              </ul>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" lg="4">
            <ReliabilityHealth
              title="Reliability Snapshot"
              subtitle="Whether the fleet is coping, and where it isn't."
              :rows="snapshotRows"
              details-to="/network"
            />
          </v-col>

          <v-col cols="12" md="6" lg="4">
            <WeatherCard :rows="weather" />
          </v-col>
        </v-row>
      </section>

      <section class="pp-section">
        <v-row dense>
          <v-col cols="12">
            <v-card class="pp-card-pad">
              <div class="d-flex align-start justify-space-between ga-3">
                <h2 class="pp-card-title">Who's Delivering Best</h2>
                <RouterLink class="pp-details" to="/couriers">View details →</RouterLink>
              </div>
              <p class="pp-card-subtitle">
                Our couriers ranked by how often they arrive on time.
              </p>

              <ul v-if="rankedCouriers.length" class="fleet">
                <li v-for="c in rankedCouriers" :key="c.name" class="fleet__card">
                  <v-avatar size="38" class="fleet__avatar">
                    <v-img :src="spriteUrl(c.dexId)" :alt="`${c.species} sprite`">
                      <template #error>
                        <v-icon :icon="SPRITE_FALLBACK_ICON" color="muted" />
                      </template>
                    </v-img>
                  </v-avatar>

                  <div class="fleet__body">
                    <div class="fleet__head">
                      <span class="fleet__name">{{ c.name }}</span>
                    </div>
                    <!-- Weather sits on the meta line, named by its own condition
                         text; the risk chip moves into the stats list where the
                         <dt> labels it. Previously both floated unlabelled. -->
                    <p class="fleet__meta">
                      {{ c.species }} · {{ c.homeRegion }}
                      <template v-if="weatherFor(c.homeRegion)">
                        ·
                        <v-icon
                          :icon="weatherFor(c.homeRegion)!.icon"
                          size="15"
                          :color="wxColor(weatherFor(c.homeRegion)!.icon)"
                          aria-hidden="true"
                        />
                        {{ weatherFor(c.homeRegion)!.condition }}
                      </template>
                    </p>
                    <dl class="fleet__stats">
                      <div><dt>On-time</dt><dd>{{ pct(c.onTimeRate) }}</dd></div>
                      <div><dt>Runs</dt><dd>{{ c.runs.toLocaleString('en-US') }}</dd></div>
                      <div><dt>Stops</dt><dd>{{ c.stopsPerRun }}</dd></div>
                      <div v-if="weatherFor(c.homeRegion)">
                        <dt>Delay risk</dt>
                        <dd>
                          <span
                            class="pp-pill pp-pill--sm"
                            :class="`pp-pill--${RISK_TONE[weatherFor(c.homeRegion)!.delayRisk]}`"
                            :title="RISK_PHRASE[weatherFor(c.homeRegion)!.delayRisk]"
                          >
                            {{ weatherFor(c.homeRegion)!.delayRisk }}
                          </span>
                        </dd>
                      </div>
                    </dl>
                  </div>
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
  </PageShell>
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

.kpi-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 12px;
}

.mini {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mini__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 9px 0;
}

.mini__row + .mini__row {
  border-top: 1px solid rgba(var(--v-theme-muted), 0.16);
}

.mini__label {
  font-size: 13px;
}

.mini__value {
  font-size: 13px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.fleet {
  list-style: none;
  padding: 0;
  margin: 0;
  /* auto-fit so the row is always full regardless of how many couriers are in
     scope — one region shows one wide card, all six show a filled grid */
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 12px;
}

/* Level 3 is NOT a card — separator lines and spacing only. No border, no
   radius, no background. BRIEF.md §6. */
.fleet__card {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 0;
  border-top: 1px solid rgba(var(--v-theme-muted), 0.18);
}

.fleet__avatar {
  background: rgba(var(--v-theme-primary), 0.12);
  flex: none;
}

.fleet__avatar :deep(img) {
  object-fit: contain;
  padding: 2px;
}

.fleet__body {
  min-width: 0;
  flex: 1 1 auto;
}

.fleet__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.fleet__name {
  font-size: 13px;
  font-weight: 700;
}

.fleet__meta {
  font-size: 11px;
  color: rgb(var(--v-theme-muted));
  margin: 1px 0 6px;
}

/* 24px column gap: at 14px "On-time 96.4%" and "Runs 2,613" read as one
   run-on value. Adjacent labelled numbers need a gutter wider than the space
   inside each pair. */
.fleet__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
  margin: 0;
}

.fleet__stats dt {
  font-size: 9.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgb(var(--v-theme-muted));
}

.fleet__stats dd {
  font-size: 12.5px;
  font-weight: 700;
  margin: 1px 0 0;
  font-variant-numeric: tabular-nums;
}
</style>

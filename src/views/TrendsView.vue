<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import LineSeriesChart from '@/components/charts/LineSeriesChart.vue'
import DeliveryTrendChart from '@/components/charts/DeliveryTrendChart.vue'
import SeasonHeatmap from '@/components/charts/SeasonHeatmap.vue'
import { computed } from 'vue'
import { useMetrics } from '@/composables/useMetrics'

const {
  trendChart,
  regions,
  monthlyTable,
  regionSparklines,
  onTimeOverMonths,
  costOverMonths,
  seasonality,
  onTimeTarget,
  industryBenchmark,
} = useMetrics()

const num = (n: number) => n.toLocaleString('en-US')

/** Month x region grid — the clearest read of Gym Season and the storm dip. */
const heatRows = computed(() =>
  regionSparklines.value.map((r) => ({ region: r.region, values: r.values })),
)
const pct = (n: number) => `${(n * 100).toFixed(1)}%`
</script>

<template>
  <PageShell
    title="Monthly Trends &amp; Seasonality"
    subtitle="How the year unfolded, and which months reliably run hot or cold."
  >

    <v-row dense class="mb-2">
      <v-col cols="12">
        <v-card class="pp-card-pad">
          <h2 class="pp-card-title">Volume Through the Year</h2>
          <p class="pp-card-subtitle">
            Whether gym restocking rises and falls with overall parcel volume.
          </p>
          <DeliveryTrendChart
            tall
            :labels="trendChart.labels"
            :parcels-delivered="trendChart.parcelsDelivered"
            :gym-supply-runs="trendChart.gymSupplyRuns"
            :selected-index="trendChart.selectedIndex"
                :marked="trendChart.marked"
          />
        </v-card>
      </v-col>
    </v-row>

    <v-row dense class="mb-2">
      <v-col cols="12" lg="7">
        <v-card class="pp-card-pad" height="100%">
          <h2 class="pp-card-title">Are We Hitting Our Target?</h2>
          <p class="pp-card-subtitle">
            Our monthly on-time record against what we promise and what rivals manage.
          </p>
          <LineSeriesChart
            :labels="onTimeOverMonths.labels"
            :values="onTimeOverMonths.values"
            format="percent"
            :references="[
              { value: onTimeTarget, label: 'Internal target' },
              { value: industryBenchmark, label: 'Industry benchmark' },
            ]"
            :height="240"
          />
        </v-card>
      </v-col>

      <v-col cols="12" lg="5">
        <v-card class="pp-card-pad" height="100%">
          <h2 class="pp-card-title">What Each Delivery Costs</h2>
          <p class="pp-card-subtitle">When moving a parcel gets more expensive, and by how much.</p>
          <LineSeriesChart
            :labels="costOverMonths.labels"
            :values="costOverMonths.values"
            format="currency"
            accent="orange"
            :height="240"
          />
        </v-card>
      </v-col>
    </v-row>

    <v-row dense class="mb-2">
      <v-col cols="12" lg="5">
        <v-card class="pp-card-pad" height="100%">
          <h2 class="pp-card-title">Our Busiest and Quietest Months</h2>
          <p class="pp-card-subtitle">How much more we move at peak than in the slowest month.</p>
          <div class="season">
            <div class="season__item">
              <p class="season__label">Peak</p>
              <p class="season__month">{{ seasonality.peak.label }}</p>
              <p class="season__value">{{ num(seasonality.peak.parcels) }}</p>
            </div>
            <div class="season__item">
              <p class="season__label">Trough</p>
              <p class="season__month">{{ seasonality.trough.label }}</p>
              <p class="season__value">{{ num(seasonality.trough.parcels) }}</p>
            </div>
            <div class="season__item">
              <p class="season__label">Swing</p>
              <p class="season__month">Peak over trough</p>
              <p class="season__value">+{{ (seasonality.swing * 100).toFixed(0) }}%</p>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" lg="7">
        <v-card class="pp-card-pad" height="100%">
          <h2 class="pp-card-title">When Each Region Peaks</h2>
          <p class="pp-card-subtitle">Darker means busier. One row per region, across the year.</p>
          <SeasonHeatmap
            :months="trendChart.labels"
            :rows="heatRows"
            polarity="high-good"
            unit="parcels"
          />
        </v-card>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12">
        <v-card class="pp-card-pad">
          <h2 class="pp-card-title">The Full Year in Numbers</h2>
          <p class="pp-card-subtitle">Every month's figures, if you need the exact value.</p>
          <v-table density="compact" class="months">
            <thead>
              <tr>
                <th class="text-left">Month</th>
                <th class="text-right">Parcels</th>
                <th class="text-right">Poké Balls</th>
                <th class="text-right">Berry Crates</th>
                <th class="text-right">Gym Runs</th>
                <th class="text-right">Fainted</th>
                <th class="text-right">On-Time</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in monthlyTable" :key="m.key" :class="{ 'months__row--on': m.isSelected }">
                <td class="font-weight-bold">{{ m.label }}</td>
                <td class="text-right">{{ num(m.parcelsDelivered) }}</td>
                <td class="text-right">{{ num(m.pokeBallsShipped) }}</td>
                <td class="text-right">{{ num(m.berryCrates) }}</td>
                <td class="text-right">{{ num(m.gymSupplyRuns) }}</td>
                <td class="text-right">{{ num(m.faintedCouriers) }}</td>
                <td class="text-right">{{ pct(m.onTimeRate) }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
  </PageShell>
</template>

<style scoped>
.season {
  display: grid;
  gap: 12px;
}

.season__item {
  padding: 10px 0;
}

.season__item + .season__item {
  border-top: 1px solid rgba(var(--v-theme-muted), 0.16);
}

.season__label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgb(var(--v-theme-muted));
  margin: 0;
}

.season__month {
  font-size: 12.5px;
  margin: 3px 0 0;
}

.season__value {
  font-size: 20px;
  font-weight: 700;
  margin: 2px 0 0;
  font-variant-numeric: tabular-nums;
}

.sparks {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px 18px;
}

@media (max-width: 900px) {
  .sparks {
    grid-template-columns: repeat(2, 1fr);
  }
}

.sparks__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.sparks__region {
  font-size: 12.5px;
  font-weight: 600;
}

.sparks__total {
  font-size: 11.5px;
  color: rgb(var(--v-theme-muted));
  font-variant-numeric: tabular-nums;
}

.sparks__change {
  font-size: 11px;
  font-weight: 600;
}

.months :deep(tbody td),
.months :deep(thead th) {
  font-size: 12.5px;
  font-variant-numeric: tabular-nums;
}

.months :deep(thead th) {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.months__row--on {
  background: rgba(var(--v-theme-primary), 0.08);
}
</style>

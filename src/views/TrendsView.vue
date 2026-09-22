<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import LineSeriesChart from '@/components/charts/LineSeriesChart.vue'
import DeliveryTrendChart from '@/components/charts/DeliveryTrendChart.vue'
import SparkLine from '@/components/charts/SparkLine.vue'
import { useMetrics } from '@/composables/useMetrics'

const {
  trendChart,
  monthlyTable,
  regionSparklines,
  onTimeOverMonths,
  costOverMonths,
  seasonality,
  onTimeTarget,
  industryBenchmark,
} = useMetrics()

const num = (n: number) => n.toLocaleString('en-US')
const pct = (n: number) => `${(n * 100).toFixed(1)}%`
</script>

<template>
  <v-container class="pelipper-width px-4 py-4">
    <PageHeader
      title="Trends"
      subtitle="Parcel volume and delivery activity across the trailing twelve months."
    />

    <v-row dense class="mb-2">
      <v-col cols="12">
        <v-card class="pp-card-pad">
          <h2 class="pp-card-title">Gym Supply Runs &amp; Parcels Delivered</h2>
          <p class="pp-card-subtitle">
            Monthly parcel volume and gym supply runs over the trailing twelve months.
          </p>
          <DeliveryTrendChart
            tall
            :labels="trendChart.labels"
            :parcels-delivered="trendChart.parcelsDelivered"
            :gym-supply-runs="trendChart.gymSupplyRuns"
            :selected-index="trendChart.selectedIndex"
          />
        </v-card>
      </v-col>
    </v-row>

    <v-row dense class="mb-2">
      <v-col cols="12" lg="7">
        <v-card class="pp-card-pad" height="100%">
          <h2 class="pp-card-title">On-Time Rate Over Time</h2>
          <p class="pp-card-subtitle">
            Monthly on-time rate against the internal target and the industry benchmark.
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
          <h2 class="pp-card-title">Cost per Parcel Over Time</h2>
          <p class="pp-card-subtitle">Monthly delivery cost per parcel, in Pokédollars.</p>
          <LineSeriesChart
            :labels="costOverMonths.labels"
            :values="costOverMonths.values"
            format="currency"
            :color-index="2"
            :height="240"
          />
        </v-card>
      </v-col>
    </v-row>

    <v-row dense class="mb-2">
      <v-col cols="12" lg="5">
        <v-card class="pp-card-pad" height="100%">
          <h2 class="pp-card-title">Seasonality</h2>
          <p class="pp-card-subtitle">The busiest and quietest months in the period.</p>
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
          <h2 class="pp-card-title">Regional Trends</h2>
          <p class="pp-card-subtitle">Twelve-month parcel volume for each region.</p>
          <div class="sparks">
            <div v-for="r in regionSparklines" :key="r.region" class="sparks__item">
              <div class="sparks__head">
                <span class="sparks__region">{{ r.region }}</span>
                <span class="sparks__total">{{ num(r.total) }}</span>
              </div>
              <SparkLine :values="r.values" :dimmed="r.dimmed" />
              <span class="sparks__change" :class="r.change >= 0 ? 'text-success' : 'text-error'">
                {{ r.change >= 0 ? '+' : '−' }}{{ Math.abs(r.change * 100).toFixed(1) }}%
              </span>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12">
        <v-card class="pp-card-pad">
          <h2 class="pp-card-title">Month by Month</h2>
          <p class="pp-card-subtitle">Every metric for each of the trailing twelve months.</p>
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
  </v-container>
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

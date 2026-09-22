<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import ReliabilityHealth from '@/components/ReliabilityHealth.vue'
import BarSeriesChart from '@/components/charts/BarSeriesChart.vue'
import { useMetrics } from '@/composables/useMetrics'

const {
  reliability,
  regionComparison,
  onTimeVsTarget,
  onTimeTarget,
  regionChart,
  showRegionChart,
  capacityByRegion,
  regionGrowth,
} = useMetrics()

const num = (n: number) => Math.round(n).toLocaleString('en-US')
const pct = (n: number) => `${(n * 100).toFixed(1)}%`
</script>

<template>
  <PageShell title="Regional Performance" subtitle="Delivery volume and reliability across the six regions.">

    <v-row dense class="mb-2">
      <v-col cols="12" lg="5">
        <ReliabilityHealth :rows="reliability" />
      </v-col>

      <v-col cols="12" lg="7">
        <v-card class="pp-card-pad" height="100%">
          <h2 class="pp-card-title">On-Time Rate by Region</h2>
          <p class="pp-card-subtitle">
            On-time delivery rate per region, against the {{ pct(onTimeTarget) }} target.
          </p>
          <BarSeriesChart
            :labels="onTimeVsTarget.map((r) => r.region)"
            :values="onTimeVsTarget.map((r) => r.onTime)"
            format="percent"
            :target="onTimeTarget"
            target-label="Target"
            :height="240"
          />
        </v-card>
      </v-col>
    </v-row>

    <v-row dense class="mb-2">
      <v-col cols="12" lg="6">
        <v-card class="pp-card-pad" height="100%">
          <h2 class="pp-card-title">Parcels by Region</h2>
          <p class="pp-card-subtitle">Total parcels delivered by region.</p>
          <BarSeriesChart
            v-if="showRegionChart"
            :labels="regionChart.labels"
            :values="regionChart.values"
            :height="220"
            unit="parcels"
          />
          <div v-else class="empty-state d-flex align-center justify-center text-center px-4">
            <p class="text-caption text-muted mb-0">
              Showing a single region — switch Region to
              <strong>All Regions</strong> to compare across the network.
            </p>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" lg="6">
        <v-card class="pp-card-pad" height="100%">
          <h2 class="pp-card-title">Capacity &amp; Transit by Region</h2>
          <p class="pp-card-subtitle">Load factor and average days in transit for each region.</p>
          <ul class="cap">
            <li v-for="r in capacityByRegion" :key="r.region" class="cap__row">
              <span class="cap__region">{{ r.region }}</span>
              <span class="cap__track">
                <span class="cap__fill" :style="{ width: `${r.capacityUtilization * 100}%` }" />
              </span>
              <span class="cap__value">{{ (r.capacityUtilization * 100).toFixed(0) }}%</span>
              <span class="cap__transit">{{ r.avgTransitDays.toFixed(1) }}d</span>
            </li>
          </ul>
        </v-card>
      </v-col>
    </v-row>

    <v-row dense class="mb-2">
      <v-col cols="12">
        <v-card class="pp-card-pad">
          <h2 class="pp-card-title">Region Growth</h2>
          <p class="pp-card-subtitle">Change in parcel volume from the first month to the last.</p>
          <ul class="growth">
            <li v-for="r in regionGrowth" :key="r.region" class="growth__row">
              <span class="growth__region">{{ r.region }}</span>
              <span class="growth__from">{{ num(r.from) }} → {{ num(r.to) }}</span>
              <span class="growth__change" :class="r.change >= 0 ? 'text-success' : 'text-error'">
                {{ r.change >= 0 ? '+' : '−' }}{{ Math.abs(r.change * 100).toFixed(1) }}%
              </span>
            </li>
          </ul>
        </v-card>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12">
        <v-card class="pp-card-pad">
          <h2 class="pp-card-title">Region Comparison</h2>
          <p class="pp-card-subtitle">Delivery volume and reliability side by side.</p>
          <v-table density="compact" class="compare">
            <thead>
              <tr>
                <th class="text-left">Region</th>
                <th class="text-right">Parcels</th>
                <th class="text-right">On-Time</th>
                <th class="text-right">Fainted</th>
                <th class="text-right">Gym Runs</th>
                <th class="text-right">Avg Monthly</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in regionComparison" :key="r.region">
                <td class="font-weight-bold">{{ r.region }}</td>
                <td class="text-right">{{ num(r.parcelsDelivered) }}</td>
                <td class="text-right">{{ pct(r.onTimeRate) }}</td>
                <td class="text-right">{{ num(r.faintedCouriers) }}</td>
                <td class="text-right">{{ num(r.gymSupplyRuns) }}</td>
                <td class="text-right">{{ num(r.avgMonthly) }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
  </PageShell>
</template>

<style scoped>
.empty-state {
  height: 220px;
}

.cap,
.growth {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cap__row {
  display: grid;
  grid-template-columns: 62px 1fr 42px 40px;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
}

.cap__row + .cap__row,
.growth__row + .growth__row {
  border-top: 1px solid rgba(var(--v-theme-muted), 0.16);
}

.cap__region {
  font-size: 12.5px;
  font-weight: 600;
}

.cap__track {
  height: 6px;
  border-radius: 999px;
  background: rgba(var(--v-theme-muted), 0.16);
  overflow: hidden;
}

.cap__fill {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: rgb(var(--v-theme-primary));
}

.cap__value,
.cap__transit {
  font-size: 12px;
  text-align: right;
  font-variant-numeric: tabular-nums;
  color: rgb(var(--v-theme-muted));
}

.growth__row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.growth__region {
  font-size: 12.5px;
  font-weight: 600;
  min-width: 62px;
}

.growth__from {
  flex: 1 1 auto;
  font-size: 12px;
  color: rgb(var(--v-theme-muted));
  font-variant-numeric: tabular-nums;
}

.growth__change {
  font-size: 13px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.compare :deep(tbody td) {
  font-size: 12.5px;
  font-variant-numeric: tabular-nums;
}

.compare :deep(thead th) {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
</style>

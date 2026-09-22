<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import ReliabilityHealth from '@/components/ReliabilityHealth.vue'
import BarSeriesChart from '@/components/charts/BarSeriesChart.vue'
import { useMetrics } from '@/composables/useMetrics'

const { reliability, regionComparison, onTimeVsTarget, onTimeTarget, faintedByMonth } = useMetrics()

const num = (n: number) => Math.round(n).toLocaleString('en-US')
const pct = (n: number) => `${(n * 100).toFixed(1)}%`
</script>

<template>
  <v-container class="pelipper-width px-4 py-4">
    <PageHeader
      title="Network"
      subtitle="Delivery reliability and fleet health across the network."
    />

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
      <v-col cols="12">
        <v-card class="pp-card-pad">
          <h2 class="pp-card-title">Fainted Couriers by Month</h2>
          <p class="pp-card-subtitle">Courier exceptions recorded in each month.</p>
          <BarSeriesChart
            :labels="faintedByMonth.labels"
            :values="faintedByMonth.values"
            :height="200"
            :color-index="1"
            unit="couriers"
          />
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
  </v-container>
</template>

<style scoped>
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

<script setup lang="ts">
import { computed } from 'vue'
import MetricCard, { type MetricCardProps } from '@/components/MetricCard.vue'
import CourierRoster from '@/components/CourierRoster.vue'
import CriticalSignals from '@/components/CriticalSignals.vue'
import TopCargoCategories from '@/components/TopCargoCategories.vue'
import ReliabilityHealth from '@/components/ReliabilityHealth.vue'
import RegionBarChart from '@/components/charts/RegionBarChart.vue'
import CargoMixChart from '@/components/charts/CargoMixChart.vue'
import DeliveryTrendChart from '@/components/charts/DeliveryTrendChart.vue'
import { useMetrics } from '@/composables/useMetrics'

const {
  filterCaption,
  current,
  hasData,
  trends,
  trendCaption,
  showRegionChart,
  regionChart,
  cargoChart,
  trendChart,
  filteredCouriers,
  cargoCategories,
  reliability,
  signals,
} = useMetrics()

// Presentation only — every number comes from the composable.
const kpiCards = computed<MetricCardProps[]>(() => [
  {
    label: 'Parcels Delivered',
    value: current.value.parcelsDelivered,
    format: 'number',
    trend: trends.value.parcelsDelivered,
    icon: 'mdi-package-variant-closed',
  },
  {
    label: 'Poké Balls Shipped',
    value: current.value.pokeBallsShipped,
    format: 'number',
    trend: trends.value.pokeBallsShipped,
    icon: 'mdi-circle-slice-8',
  },
  {
    // Weighted by parcelsDelivered in the composable — never a mean of means.
    label: 'On-Time Rate',
    value: current.value.onTimeRate,
    format: 'percent',
    trend: trends.value.onTimeRate,
    trendUnit: 'points',
    icon: 'mdi-clock-check-outline',
  },
  {
    label: 'Gym Supply Runs',
    value: current.value.gymSupplyRuns,
    format: 'number',
    trend: trends.value.gymSupplyRuns,
    icon: 'mdi-dumbbell',
  },
  {
    // Inverted: fewer couriers fainting is good news, so a decrease is green.
    label: 'Fainted Couriers',
    value: current.value.faintedCouriers,
    format: 'number',
    trend: trends.value.faintedCouriers,
    invertTrend: true,
    icon: 'mdi-alert-circle-outline',
  },
])
</script>

<template>
  <v-container class="pelipper-width px-4 py-4">
    <template v-if="hasData">
      <!-- ---------- Overview: KPI strip ---------- -->
      <section id="overview" class="pp-section">
        <div class="d-flex align-baseline justify-space-between flex-wrap ga-2 mb-3">
          <p class="pp-eyebrow mb-0">Overview</p>
          <p class="text-caption text-muted mb-0">
            {{ filterCaption }}<template v-if="trendCaption"> · {{ trendCaption }}</template>
          </p>
        </div>

        <v-row dense>
          <v-col v-for="card in kpiCards" :key="card.label" cols="12" sm="6" md="4" lg="2" xl="2">
            <MetricCard v-bind="card" />
          </v-col>
        </v-row>
      </section>

      <!-- ---------- Trends ---------- -->
      <section id="trends" class="pp-section">
        <v-row dense>
          <v-col cols="12" lg="8">
            <v-card class="pp-card-pad" height="100%">
              <h2 class="pp-card-title">Gym Supply Runs &amp; Parcels Delivered</h2>
              <p class="pp-card-subtitle">
                All twelve months. Respects the region filter; the selected month is marked.
              </p>
              <DeliveryTrendChart
                :labels="trendChart.labels"
                :parcels-delivered="trendChart.parcelsDelivered"
                :gym-supply-runs="trendChart.gymSupplyRuns"
                :selected-index="trendChart.selectedIndex"
              />
            </v-card>
          </v-col>

          <v-col cols="12" lg="4">
            <TopCargoCategories :categories="cargoCategories" />
          </v-col>
        </v-row>
      </section>

      <!-- ---------- Charts ---------- -->
      <section class="pp-section">
        <v-row dense>
          <v-col cols="12" md="7">
            <v-card class="pp-card-pad" height="100%">
              <h2 class="pp-card-title">Parcels by Region</h2>
              <p class="pp-card-subtitle">Total parcels delivered across the selected months.</p>

              <RegionBarChart
                v-if="showRegionChart"
                :labels="regionChart.labels"
                :values="regionChart.values"
              />
              <div v-else class="empty-state d-flex align-center justify-center text-center px-4">
                <p class="text-caption text-muted mb-0">
                  Showing a single region — switch Region to
                  <strong>All Regions</strong> to compare across the network.
                </p>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="5">
            <v-card class="pp-card-pad" height="100%">
              <h2 class="pp-card-title">Cargo Mix</h2>
              <p class="pp-card-subtitle">Parcels by cargo type in the current selection.</p>
              <CargoMixChart :labels="cargoChart.labels" :values="cargoChart.values" />
            </v-card>
          </v-col>
        </v-row>
      </section>

      <!-- ---------- Signals + Network ---------- -->
      <section id="signals" class="pp-section">
        <v-row dense>
          <v-col cols="12" lg="7">
            <CriticalSignals :signals="signals" />
          </v-col>
          <v-col id="network" cols="12" lg="5">
            <ReliabilityHealth :rows="reliability" />
          </v-col>
        </v-row>
      </section>

      <!-- ---------- Couriers ---------- -->
      <section id="couriers" class="pp-section">
        <v-card class="pp-card-pad">
          <h2 class="pp-card-title">Courier Roster</h2>
          <p class="pp-card-subtitle">Fleet in scope for the selected region.</p>
          <CourierRoster :couriers="filteredCouriers" />
        </v-card>
      </section>
    </template>

    <!-- Loading / empty state -->
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
  scroll-margin-top: 80px;
}

.pp-eyebrow {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgb(var(--v-theme-muted));
}

.empty-state {
  height: 200px;
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import MetricCard, { type MetricCardProps } from '@/components/MetricCard.vue'
import CourierRoster from '@/components/CourierRoster.vue'
import DeliveryNetwork from '@/components/DeliveryNetwork.vue'
import RegionBarChart from '@/components/charts/RegionBarChart.vue'
import CargoMixChart from '@/components/charts/CargoMixChart.vue'
import DeliveryTrendChart from '@/components/charts/DeliveryTrendChart.vue'
import { useMetrics } from '@/composables/useMetrics'

const {
  selectedMonth,
  selectedRegion,
  monthOptions,
  regionOptions,
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
} = useMetrics()

// Presentation only — every number comes from the composable.
const kpiCards = computed<MetricCardProps[]>(() => [
  {
    label: 'Poké Balls Shipped',
    value: current.value.pokeBallsShipped,
    format: 'number',
    trend: trends.value.pokeBallsShipped,
    icon: 'mdi-circle-slice-8',
  },
  {
    label: 'Berry Crates Delivered',
    value: current.value.berryCrates,
    format: 'number',
    trend: trends.value.berryCrates,
    icon: 'mdi-food-apple',
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
  <v-container class="pelipper-width px-6 py-8">
    <!-- 2. Filter row -->
    <v-row align="center" class="mb-2">
      <v-col cols="12" sm="6" md="3">
        <v-select v-model="selectedMonth" :items="monthOptions" label="Month" />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-select v-model="selectedRegion" :items="regionOptions" label="Region" />
      </v-col>

      <v-col cols="12" md="6" class="text-md-right">
        <span class="text-body-2 text-muted">{{ filterCaption }}</span>
      </v-col>
    </v-row>

    <template v-if="hasData">
      <!-- 3. KPI row -->
      <v-row>
        <v-col v-for="card in kpiCards" :key="card.label" cols="12" sm="6" lg="3">
          <MetricCard v-bind="card" />
        </v-col>
      </v-row>

      <!-- Wording depends on filter state, so it is computed, not hardcoded.
           Renders nothing at all when there is no prior month to compare to. -->
      <p v-if="trendCaption" class="text-caption text-muted mb-2">{{ trendCaption }}</p>
      <div v-else class="mb-2" />

      <!-- 4. Chart row -->
      <v-row class="mb-2">
        <v-col cols="12" md="6">
          <v-card class="pa-6" height="100%">
            <h2 class="text-subtitle-1 font-weight-bold mb-4">Parcels by Region</h2>

            <RegionBarChart
              v-if="showRegionChart"
              :labels="regionChart.labels"
              :values="regionChart.values"
            />

            <!-- A one-bar bar chart answers nothing. -->
            <div v-else class="empty-state d-flex align-center justify-center text-center px-4">
              <p class="text-body-2 text-muted mb-0">
                Showing a single region — switch Region to
                <strong>All Regions</strong> to compare across the network.
              </p>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card class="pa-6" height="100%">
            <h2 class="text-subtitle-1 font-weight-bold mb-4">Cargo Mix</h2>
            <CargoMixChart :labels="cargoChart.labels" :values="cargoChart.values" />
          </v-card>
        </v-col>
      </v-row>

      <!-- 5. Trend row -->
      <v-row class="mb-2">
        <v-col cols="12">
          <v-card class="pa-6">
            <h2 class="text-subtitle-1 font-weight-bold mb-1">
              Gym Supply Runs &amp; Parcels Delivered
            </h2>
            <p class="text-caption text-muted mb-4">
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
      </v-row>

      <!-- 6. Delivery Network — decorative, not wired to the filters -->
      <v-row class="mb-2">
        <v-col cols="12">
          <DeliveryNetwork />
        </v-col>
      </v-row>

      <!-- 7. Courier roster -->
      <v-row>
        <v-col cols="12">
          <v-card class="pa-6">
            <h2 class="text-subtitle-1 font-weight-bold mb-4">Courier Roster</h2>
            <CourierRoster :couriers="filteredCouriers" />
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Loading / empty state -->
    <v-row v-else>
      <v-col cols="12">
        <v-card class="pa-16 text-center">
          <v-icon icon="mdi-package-variant-closed" color="muted" size="40" class="mb-3" />
          <p class="text-body-1 mb-1">No data for this combination.</p>
          <p class="text-body-2 text-muted mb-0">Try a different month or region.</p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.empty-state {
  height: 360px;
}
</style>

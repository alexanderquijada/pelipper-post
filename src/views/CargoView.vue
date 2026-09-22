<script setup lang="ts">
import { ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import TopCargoCategories from '@/components/TopCargoCategories.vue'
import CargoTrendChart from '@/components/charts/CargoTrendChart.vue'
import { useChartTheme } from '@/components/charts/chartTheme'
import { useMetrics } from '@/composables/useMetrics'
import { cargoItemUrl } from '@/utils/sprites'

const { cargoCategories, cargoByRegion, cargoOverMonths, cargoTypes } = useMetrics()
const { categorical } = useChartTheme()

const failedSprites = ref(new Set<string>())
const num = (n: number) => n.toLocaleString('en-US')
</script>

<template>
  <v-container class="pelipper-width px-4 py-4">
    <PageHeader title="Cargo" subtitle="What the network is carrying, and where it goes." />

    <v-row dense class="mb-2">
      <v-col cols="12" lg="5">
        <TopCargoCategories :categories="cargoCategories" />
      </v-col>

      <v-col cols="12" lg="7">
        <v-card class="pp-card-pad" height="100%">
          <h2 class="pp-card-title">Cargo Mix Over Time</h2>
          <p class="pp-card-subtitle">Parcels by cargo type across the trailing twelve months.</p>
          <CargoTrendChart :labels="cargoOverMonths.labels" :series="cargoOverMonths.series" />
          <ul class="legend">
            <li v-for="(c, i) in cargoTypes" :key="c" class="legend__item">
              <span
                class="legend__swatch"
                :style="{ background: categorical[i % categorical.length] }"
              />
              {{ c }}
            </li>
          </ul>
        </v-card>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12">
        <v-card class="pp-card-pad">
          <h2 class="pp-card-title">Cargo by Region</h2>
          <p class="pp-card-subtitle">Parcels delivered per cargo type in each region.</p>
          <v-table density="compact" class="matrix">
            <thead>
              <tr>
                <th class="text-left">Region</th>
                <th v-for="c in cargoTypes" :key="c" class="text-right">
                  <span class="matrix__head">
                    <img
                      v-if="cargoItemUrl(c) && !failedSprites.has(c)"
                      :src="cargoItemUrl(c)!"
                      alt=""
                      class="matrix__sprite"
                      width="22"
                      height="22"
                      @error="failedSprites = new Set(failedSprites).add(c)"
                    />
                    {{ c }}
                  </span>
                </th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in cargoByRegion" :key="row.region">
                <td class="font-weight-bold">{{ row.region }}</td>
                <td v-for="(v, i) in row.values" :key="i" class="text-right">{{ num(v) }}</td>
                <td class="text-right font-weight-bold">{{ num(row.total) }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
}

.legend__item {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  color: rgb(var(--v-theme-muted));
}

.legend__swatch {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

.matrix :deep(tbody td) {
  font-size: 12.5px;
  font-variant-numeric: tabular-nums;
}

.matrix :deep(thead th) {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.matrix__head {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  justify-content: flex-end;
}

.matrix__sprite {
  image-rendering: pixelated;
  flex: none;
  object-fit: contain;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import PageShell from '@/components/PageShell.vue'
import TopCargoCategories from '@/components/TopCargoCategories.vue'
import CargoTrendChart from '@/components/charts/CargoTrendChart.vue'
import { useChartTheme } from '@/components/charts/chartTheme'
import { useMetrics } from '@/composables/useMetrics'
import { cargoItemUrl } from '@/utils/sprites'

const { cargoCategories, cargoByRegion, cargoOverMonths, cargoTypes, cargoProperties, revenueByCargo } =
  useMetrics()
const { categorical } = useChartTheme()

const failedSprites = ref(new Set<string>())
const num = (n: number) => n.toLocaleString('en-US')
</script>

<template>
  <PageShell title="Cargo Mix &amp; Revenue" subtitle="What the network is carrying, and what it earns.">

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

    <v-row dense class="mb-2">
      <v-col cols="12" lg="6">
        <v-card class="pp-card-pad" height="100%">
          <h2 class="pp-card-title">Revenue by Cargo Type</h2>
          <p class="pp-card-subtitle">Revenue contribution in Pokédollars, highest first.</p>
          <ul class="bars">
            <li v-for="r in revenueByCargo" :key="r.cargo" class="bars__row">
              <span
                class="bars__swatch"
                :style="{ background: categorical[r.colorIndex % categorical.length] }"
              />
              <span class="bars__label">{{ r.cargo }}</span>
              <span class="bars__value">₽{{ Math.round(r.revenue).toLocaleString('en-US') }}</span>
              <span class="bars__share">{{ (r.share * 100).toFixed(1) }}%</span>
              <span class="bars__track">
                <span
                  class="bars__fill"
                  :style="{
                    width: `${Math.max(r.share * 100, 1.5)}%`,
                    background: categorical[r.colorIndex % categorical.length],
                  }"
                />
              </span>
            </li>
          </ul>
        </v-card>
      </v-col>

      <v-col cols="12" lg="6">
        <v-card class="pp-card-pad" height="100%">
          <h2 class="pp-card-title">Cargo Handling Profile</h2>
          <p class="pp-card-subtitle">Weight, damage rate and transit time for each cargo type.</p>
          <v-table density="compact" class="matrix">
            <thead>
              <tr>
                <th class="text-left">Cargo</th>
                <th class="text-right">Avg Weight</th>
                <th class="text-right">Damage Rate</th>
                <th class="text-right">Transit Days</th>
                <th class="text-right">Revenue / Parcel</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in cargoProperties" :key="c.cargo">
                <td>
                  <span class="matrix__head">
                    <img
                      v-if="cargoItemUrl(c.cargo) && !failedSprites.has(c.cargo)"
                      :src="cargoItemUrl(c.cargo)!"
                      alt=""
                      class="matrix__sprite"
                      width="22"
                      height="22"
                      @error="failedSprites = new Set(failedSprites).add(c.cargo)"
                    />
                    <strong>{{ c.cargo }}</strong>
                  </span>
                </td>
                <td class="text-right">{{ c.avgWeightKg.toFixed(2) }} kg</td>
                <td class="text-right">{{ (c.damageRate * 100).toFixed(1) }}%</td>
                <td class="text-right">{{ c.avgTransitDays.toFixed(1) }}</td>
                <td class="text-right">₽{{ c.revenuePerParcel.toLocaleString('en-US') }}</td>
              </tr>
            </tbody>
          </v-table>
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
  </PageShell>
</template>

<style scoped>
.bars {
  list-style: none;
  padding: 0;
  margin: 0;
}

.bars__row {
  display: grid;
  grid-template-columns: 10px 1fr auto 52px;
  grid-template-areas: 'swatch label value share' '. track track track';
  align-items: center;
  gap: 4px 10px;
  padding: 7px 0;
}

.bars__swatch {
  grid-area: swatch;
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

.bars__label {
  grid-area: label;
  font-size: 12.5px;
  font-weight: 600;
}

.bars__value {
  grid-area: value;
  font-size: 12px;
  color: rgb(var(--v-theme-muted));
  font-variant-numeric: tabular-nums;
}

.bars__share {
  grid-area: share;
  font-size: 12px;
  font-weight: 600;
  text-align: right;
  color: rgb(var(--v-theme-muted));
  font-variant-numeric: tabular-nums;
}

.bars__track {
  grid-area: track;
  height: 6px;
  border-radius: 999px;
  background: rgba(var(--v-theme-muted), 0.16);
  overflow: hidden;
}

.bars__fill {
  display: block;
  height: 100%;
  border-radius: 999px;
}

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

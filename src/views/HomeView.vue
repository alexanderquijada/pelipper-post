<script setup lang="ts">
import { ref } from 'vue'
import MetricCard, { type MetricCardProps } from '@/components/MetricCard.vue'
import { spriteUrl, SPRITE_FALLBACK_ICON } from '@/utils/sprites'

// Filters are still inert and the three charts are still placeholders;
// Phase 5 adds the dataset and Phase 6 wires both up.

// Hardcoded until src/data/metrics.json lands in Phase 5. Values carried over
// from the Phase 1 prototype so the numbers stay consistent across phases.
const KPI_CARDS: MetricCardProps[] = [
  {
    label: 'Poké Balls Shipped',
    value: 387412,
    format: 'number',
    trend: 0.062,
    icon: 'mdi-circle-slice-8',
  },
  {
    label: 'Berry Crates Delivered',
    value: 31208,
    format: 'number',
    trend: -0.038,
    icon: 'mdi-food-apple',
  },
  {
    label: 'Gym Supply Runs',
    value: 3417,
    format: 'number',
    trend: 0.024,
    icon: 'mdi-dumbbell',
  },
  {
    // Inverted: this decrease is good news, so the arrow is green.
    label: 'Fainted Couriers',
    value: 187,
    format: 'number',
    trend: -0.185,
    invertTrend: true,
    icon: 'mdi-alert-circle-outline',
  },
]

const MONTHS = [
  'All Months',
  'Oct 2025',
  'Nov 2025',
  'Dec 2025',
  'Jan 2026',
  'Feb 2026',
  'Mar 2026',
  'Apr 2026',
  'May 2026',
  'Jun 2026',
  'Jul 2026',
  'Aug 2026',
  'Sep 2026',
]

const REGIONS = ['All Regions', 'Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Galar']

// Bound so the dropdowns behave like real selects. Nothing reads them yet.
const selectedMonth = ref(MONTHS[0])
const selectedRegion = ref(REGIONS[0])

type CourierStatus = 'On Route' | 'Resting' | 'Grounded'

interface Courier {
  name: string
  species: string
  dexId: number
  homeRegion: string
  runs: number
  onTimeRate: number
  status: CourierStatus
}

// Fabricated placeholder roster — replaced by src/data/metrics.json in Phase 5.
const COURIERS: Courier[] = [
  { name: 'Skyler', species: 'Pelipper', dexId: 279, homeRegion: 'Hoenn', runs: 2148, onTimeRate: 0.961, status: 'On Route' },
  { name: 'Gale', species: 'Pidgeot', dexId: 18, homeRegion: 'Kanto', runs: 2613, onTimeRate: 0.974, status: 'On Route' },
  { name: 'Nimbus', species: 'Dragonite', dexId: 149, homeRegion: 'Johto', runs: 2402, onTimeRate: 0.958, status: 'Resting' },
  { name: 'Tidal', species: 'Gyarados', dexId: 130, homeRegion: 'Sinnoh', runs: 1874, onTimeRate: 0.913, status: 'Grounded' },
  { name: 'Brix', species: 'Machamp', dexId: 68, homeRegion: 'Unova', runs: 1596, onTimeRate: 0.937, status: 'On Route' },
  { name: 'Dash', species: 'Doduo', dexId: 84, homeRegion: 'Galar', runs: 1142, onTimeRate: 0.896, status: 'Resting' },
  { name: 'Emberlyn', species: 'Rapidash', dexId: 78, homeRegion: 'Kanto', runs: 2037, onTimeRate: 0.949, status: 'On Route' },
]

const STATUS_COLOR: Record<CourierStatus, string> = {
  'On Route': 'success',
  Resting: 'secondary',
  Grounded: 'error',
}

const formatNumber = (n: number) => n.toLocaleString('en-US')
const formatRate = (r: number) => `${(r * 100).toFixed(1)}%`

// Sprites that 404'd, by dexId — swaps the avatar to an MDI icon.
const failedSprites = ref(new Set<number>())

function onSpriteError(dexId: number) {
  failedSprites.value = new Set(failedSprites.value).add(dexId)
}
</script>

<template>
  <v-container class="pelipper-width px-6 py-8">
    <!-- 2. Filter row -->
    <v-row align="end" class="mb-2">
      <v-col cols="12" sm="6" md="3">
        <v-select v-model="selectedMonth" :items="MONTHS" label="Month" />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-select v-model="selectedRegion" :items="REGIONS" label="Region" />
      </v-col>

      <v-col cols="12" md="6" class="text-md-right">
        <span class="text-body-2 text-muted">Showing 12 months across 6 regions</span>
      </v-col>
    </v-row>

    <!-- 3. KPI row -->
    <v-row class="mb-2">
      <v-col v-for="card in KPI_CARDS" :key="card.label" cols="12" sm="6" lg="3">
        <MetricCard v-bind="card" />
      </v-col>
    </v-row>

    <!-- 4. Chart row -->
    <v-row class="mb-2">
      <v-col cols="12" md="6">
        <v-card class="pa-6" height="100%">
          <h2 class="text-subtitle-1 font-weight-bold mb-4">Parcels by Region</h2>
          <div class="chart-slot d-flex flex-column align-center justify-center rounded-lg">
            <p class="text-body-2 font-weight-bold text-secondary mb-1">RegionBarChart</p>
            <p class="text-caption text-muted mb-0">Vertical bar chart · Phase 6</p>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-6" height="100%">
          <h2 class="text-subtitle-1 font-weight-bold mb-4">Cargo Mix</h2>
          <div class="chart-slot d-flex flex-column align-center justify-center rounded-lg">
            <p class="text-body-2 font-weight-bold text-secondary mb-1">CargoMixChart</p>
            <p class="text-caption text-muted mb-0">Doughnut, five segments · Phase 6</p>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- 5. Trend row -->
    <v-row class="mb-2">
      <v-col cols="12">
        <v-card class="pa-6">
          <h2 class="text-subtitle-1 font-weight-bold mb-4">Gym Supply Runs &amp; Parcels Delivered</h2>
          <div class="chart-slot chart-slot--wide d-flex flex-column align-center justify-center rounded-lg">
            <p class="text-body-2 font-weight-bold text-secondary mb-1">DeliveryTrendChart</p>
            <p class="text-caption text-muted mb-0">Full-width area chart, twelve months · Phase 6</p>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- 6. Courier roster -->
    <v-row>
      <v-col cols="12">
        <v-card class="pa-6">
          <h2 class="text-subtitle-1 font-weight-bold mb-4">Courier Roster</h2>

          <v-table>
            <thead>
              <tr>
                <th class="text-left" style="width: 72px"></th>
                <th class="text-left">Courier</th>
                <th class="text-left">Species</th>
                <th class="text-left">Home Region</th>
                <th class="text-right">Runs</th>
                <th class="text-right">On-Time Rate</th>
                <th class="text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="courier in COURIERS" :key="courier.name">
                <td>
                  <v-avatar size="44" class="sprite-avatar">
                    <v-img
                      v-if="!failedSprites.has(courier.dexId)"
                      :src="spriteUrl(courier.dexId)"
                      :alt="`${courier.species} sprite`"
                      @error="onSpriteError(courier.dexId)"
                    />
                    <v-icon v-else :icon="SPRITE_FALLBACK_ICON" color="muted" />
                  </v-avatar>
                </td>
                <td class="font-weight-bold">{{ courier.name }}</td>
                <td class="text-muted">{{ courier.species }}</td>
                <td class="text-muted">{{ courier.homeRegion }}</td>
                <td class="text-right">{{ formatNumber(courier.runs) }}</td>
                <td class="text-right">{{ formatRate(courier.onTimeRate) }}</td>
                <td>
                  <v-chip :color="STATUS_COLOR[courier.status]" variant="tonal" size="small">
                    {{ courier.status }}
                  </v-chip>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
/* Custom rules left after the refactor. Both read their colour from Vuetify's
   generated theme variables (--v-theme-* holds an "R,G,B" triplet), so nothing
   here duplicates a hex from main.ts and nothing drifts when the theme changes.

   1. Dashed placeholder box — Vuetify has no dashed-border utility. These
      disappear entirely in Phase 6 when the real charts land. */
.chart-slot {
  height: 260px;
  border: 1px dashed rgba(var(--v-theme-muted), 0.38);
  background: rgba(var(--v-theme-primary), 0.04);
}

.chart-slot--wide {
  height: 220px;
}

/* 2. Sprite avatar tint — a faint theme-tinted disc behind transparent artwork. */
.sprite-avatar {
  background: rgba(var(--v-theme-primary), 0.12);
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import CourierRoster from '@/components/CourierRoster.vue'
import BarSeriesChart from '@/components/charts/BarSeriesChart.vue'
import { useMetrics } from '@/composables/useMetrics'
import { SPRITE_FALLBACK_ICON, spriteUrl } from '@/utils/sprites'
import type { CourierStatus } from '@/types/metrics'

const { filteredCouriers, courierStops, courierFirstAttempt, courierRest, courierStatusBreakdown } =
  useMetrics()

const STATUS_COLOR: Record<CourierStatus, string> = {
  'On Route': 'success',
  Resting: 'secondary',
  Grounded: 'error',
}

const failedSprites = ref(new Set<number>())
const num = (n: number) => n.toLocaleString('en-US')
const pct = (n: number) => `${(n * 100).toFixed(1)}%`
</script>

<template>
  <v-container class="pelipper-width px-4 py-4">
    <PageHeader
      title="Courier Fleet"
      subtitle="The delivery fleet, their home regions and individual performance."
    />

    <v-row dense class="mb-2">
      <v-col v-for="c in filteredCouriers" :key="c.name" cols="12" sm="6" md="4" lg="3">
        <v-card class="pp-card-pad" height="100%">
          <div class="d-flex align-center ga-3">
            <v-avatar size="56" class="courier__avatar">
              <v-img
                v-if="!failedSprites.has(c.dexId)"
                :src="spriteUrl(c.dexId)"
                :alt="`${c.species} sprite`"
                @error="failedSprites = new Set(failedSprites).add(c.dexId)"
              />
              <v-icon v-else :icon="SPRITE_FALLBACK_ICON" color="muted" />
            </v-avatar>
            <div class="min-w-0">
              <p class="courier__name">{{ c.name }}</p>
              <p class="courier__species">{{ c.species }} · {{ c.homeRegion }}</p>
            </div>
          </div>

          <dl class="courier__stats">
            <div class="courier__stat">
              <dt>Runs</dt>
              <dd>{{ num(c.runs) }}</dd>
            </div>
            <div class="courier__stat">
              <dt>Stops / Run</dt>
              <dd>{{ num(c.stopsPerRun) }}</dd>
            </div>
            <div class="courier__stat">
              <dt>Tenure</dt>
              <dd>{{ c.tenureMonths }}mo</dd>
            </div>
          </dl>

          <v-chip :color="STATUS_COLOR[c.status]" variant="tonal" size="small">
            {{ c.status }}
          </v-chip>
        </v-card>
      </v-col>
    </v-row>

    <v-row dense class="mb-2">
      <v-col cols="12" lg="6">
        <v-card class="pp-card-pad" height="100%">
          <h2 class="pp-card-title">Stops per Run</h2>
          <p class="pp-card-subtitle">Average delivery stops each courier makes per run.</p>
          <BarSeriesChart
            :labels="courierStops.labels"
            :values="courierStops.values"
            :height="210"
            unit="stops"
          />
        </v-card>
      </v-col>

      <v-col cols="12" lg="6">
        <v-card class="pp-card-pad" height="100%">
          <h2 class="pp-card-title">First-Attempt Rate by Courier</h2>
          <p class="pp-card-subtitle">Share of parcels each courier lands on the first try.</p>
          <BarSeriesChart
            :labels="courierFirstAttempt.labels"
            :values="courierFirstAttempt.values"
            format="percent"
            :color-index="2"
            :height="210"
          />
        </v-card>
      </v-col>
    </v-row>

    <v-row dense class="mb-2">
      <v-col cols="12" lg="7">
        <v-card class="pp-card-pad" height="100%">
          <h2 class="pp-card-title">Rest Days Taken</h2>
          <p class="pp-card-subtitle">Rest days each courier has taken across their tenure.</p>
          <BarSeriesChart
            :labels="courierRest.labels"
            :values="courierRest.values"
            :color-index="3"
            :height="210"
            unit="days"
          />
        </v-card>
      </v-col>

      <v-col cols="12" lg="5">
        <v-card class="pp-card-pad" height="100%">
          <h2 class="pp-card-title">Fleet Status</h2>
          <p class="pp-card-subtitle">How the fleet is currently distributed.</p>
          <ul class="status">
            <li v-for="s in courierStatusBreakdown" :key="s.status" class="status__row">
              <span class="status__dot" :class="`status__dot--${s.status.replace(' ', '-')}`" />
              <span class="status__label">{{ s.status }}</span>
              <span class="status__count">{{ s.count }}</span>
              <span class="status__share">{{ (s.share * 100).toFixed(0) }}%</span>
            </li>
          </ul>
        </v-card>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12">
        <v-card class="pp-card-pad">
          <h2 class="pp-card-title">Courier Roster</h2>
          <p class="pp-card-subtitle">Couriers, their home regions, and delivery performance.</p>
          <CourierRoster :couriers="filteredCouriers" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.min-w-0 {
  min-width: 0;
}

.courier__avatar {
  background: rgba(var(--v-theme-primary), 0.12);
  flex: none;
}

.courier__avatar :deep(img) {
  object-fit: contain;
  padding: 3px;
}

.courier__name {
  font-size: 14px;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

.courier__species {
  font-size: 11.5px;
  color: rgb(var(--v-theme-muted));
  margin: 2px 0 0;
}

.courier__stats {
  display: flex;
  gap: 18px;
  margin: 14px 0 12px;
}

.courier__stat dt {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgb(var(--v-theme-muted));
}

.courier__stat dd {
  font-size: 15px;
  font-weight: 700;
  margin: 2px 0 0;
  font-variant-numeric: tabular-nums;
}

.status {
  list-style: none;
  padding: 0;
  margin: 0;
}

.status__row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
}

.status__row + .status__row {
  border-top: 1px solid rgba(var(--v-theme-muted), 0.16);
}

.status__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex: none;
}

.status__dot--On-Route {
  background: rgb(var(--v-theme-success));
}

.status__dot--Resting {
  background: rgb(var(--v-theme-secondary));
}

.status__dot--Grounded {
  background: rgb(var(--v-theme-error));
}

.status__label {
  flex: 1 1 auto;
  font-size: 13px;
}

.status__count {
  font-size: 13px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.status__share {
  font-size: 12px;
  color: rgb(var(--v-theme-muted));
  min-width: 36px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
</style>

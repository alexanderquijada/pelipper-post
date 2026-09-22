<script setup lang="ts">
import { computed } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import LineSeriesChart from '@/components/charts/LineSeriesChart.vue'
import { useChartTheme } from '@/components/charts/chartTheme'
import { useMetrics } from '@/composables/useMetrics'

const {
  signalGroups,
  onTimeVsTarget,
  onTimeTarget,
  exceptionsByCause,
  exceptionsOverMonths,
  firstAttemptCost,
} = useMetrics()
const { categorical } = useChartTheme()
const money = (n: number) => `₽${Math.round(n).toLocaleString('en-US')}`
/** Only the breaches — the full six-region comparison lives on /network. */
const breaches = computed(() => onTimeVsTarget.value.filter((r) => !r.meets))

const pct = (n: number) => `${(n * 100).toFixed(1)}%`
const num = (n: number) => n.toLocaleString('en-US')
</script>

<template>
  <v-container class="pelipper-width px-4 py-4">
    <PageHeader
      title="Signals"
      subtitle="Notable shifts in network performance, grouped by severity."
    />

    <v-row dense class="mb-2">
      <v-col v-for="group in signalGroups" :key="group.severity" cols="12" md="4">
        <v-card class="pp-card-pad" height="100%">
          <div class="d-flex align-center ga-2">
            <span class="dot" :class="`dot--${group.severity}`" aria-hidden="true" />
            <h2 class="pp-card-title">{{ group.title }}</h2>
            <span class="count">{{ group.items.length }}</span>
          </div>
          <p class="pp-card-subtitle">
            {{
              group.severity === 'critical'
                ? 'Needs attention now.'
                : group.severity === 'warning'
                  ? 'Worth watching.'
                  : 'Performing as expected.'
            }}
          </p>

          <ul v-if="group.items.length" class="list">
            <li v-for="s in group.items" :key="s.id" class="list__item">
              <p class="list__finding">{{ s.finding }}</p>
              <p class="list__detail">{{ s.detail }}</p>
            </li>
          </ul>
          <p v-else class="text-caption text-muted mb-0">Nothing in this group.</p>
        </v-card>
      </v-col>
    </v-row>

    <v-row dense class="mb-2">
      <v-col cols="12" lg="7">
        <v-card class="pp-card-pad" height="100%">
          <h2 class="pp-card-title">Exceptions by Cause</h2>
          <p class="pp-card-subtitle">What went wrong, and how often.</p>
          <ul class="causes">
            <li v-for="c in exceptionsByCause" :key="c.cause" class="causes__row">
              <span
                class="causes__swatch"
                :style="{ background: categorical[c.colorIndex % categorical.length] }"
              />
              <span class="causes__label">{{ c.cause }}</span>
              <span class="causes__value">{{ num(c.value) }}</span>
              <span class="causes__share">{{ (c.share * 100).toFixed(1) }}%</span>
              <span class="causes__track">
                <span
                  class="causes__fill"
                  :style="{
                    width: `${Math.max(c.share * 100, 1.5)}%`,
                    background: categorical[c.colorIndex % categorical.length],
                  }"
                />
              </span>
            </li>
          </ul>
        </v-card>
      </v-col>

      <v-col cols="12" lg="5">
        <v-card class="pp-card-pad" height="100%">
          <h2 class="pp-card-title">First-Attempt Failures</h2>
          <p class="pp-card-subtitle">Parcels that needed a second run, and what that costs.</p>
          <dl class="cost">
            <div class="cost__row">
              <dt>First-attempt rate</dt>
              <dd>{{ pct(firstAttemptCost.firstAttemptRate) }}</dd>
            </div>
            <div class="cost__row">
              <dt>Parcels missed first time</dt>
              <dd>{{ num(firstAttemptCost.missedParcels) }}</dd>
            </div>
            <div class="cost__row">
              <dt>Cost per parcel</dt>
              <dd>{{ money(firstAttemptCost.costPerParcel) }}</dd>
            </div>
            <div class="cost__row cost__row--total">
              <dt>Redelivery cost</dt>
              <dd>{{ money(firstAttemptCost.redeliveryCost) }}</dd>
            </div>
            <div class="cost__row">
              <dt>Damaged in transit</dt>
              <dd>{{ num(firstAttemptCost.damagedParcels) }}</dd>
            </div>
            <div class="cost__row">
              <dt>Returned</dt>
              <dd>{{ num(firstAttemptCost.returnedParcels) }}</dd>
            </div>
          </dl>
        </v-card>
      </v-col>
    </v-row>

    <v-row dense class="mb-2">
      <v-col cols="12">
        <v-card class="pp-card-pad">
          <h2 class="pp-card-title">Exceptions Over Time</h2>
          <p class="pp-card-subtitle">Open exceptions recorded in each month.</p>
          <LineSeriesChart
            :labels="exceptionsOverMonths.labels"
            :values="exceptionsOverMonths.values"
            :color-index="2"
            :height="200"
            unit="exceptions"
          />
        </v-card>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12">
        <v-card class="pp-card-pad">
          <h2 class="pp-card-title">Regions Below Target</h2>
          <p class="pp-card-subtitle">
            Regions falling short of the {{ pct(onTimeTarget) }} on-time target.
          </p>
          <v-table v-if="breaches.length" density="compact" class="targets">
            <thead>
              <tr>
                <th class="text-left">Region</th>
                <th class="text-right">Parcels</th>
                <th class="text-right">On-Time</th>
                <th class="text-right">vs Target</th>
                <th class="text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in breaches" :key="r.region">
                <td class="font-weight-bold">{{ r.region }}</td>
                <td class="text-right">{{ num(r.parcels) }}</td>
                <td class="text-right">{{ pct(r.onTime) }}</td>
                <td class="text-right" :class="r.meets ? 'text-success' : 'text-error'">
                  {{ r.gap >= 0 ? '+' : '−' }}{{ Math.abs(r.gap * 100).toFixed(1) }} pts
                </td>
                <td>
                  <v-chip color="error" variant="tonal" size="small">Below target</v-chip>
                </td>
              </tr>
            </tbody>
          </v-table>
          <p v-else class="text-caption text-muted mb-0 py-4">
            Every region in scope is meeting the {{ pct(onTimeTarget) }} target.
          </p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.causes {
  list-style: none;
  padding: 0;
  margin: 0;
}

.causes__row {
  display: grid;
  grid-template-columns: 10px 1fr auto 52px;
  grid-template-areas: 'swatch label value share' '. track track track';
  align-items: center;
  gap: 4px 10px;
  padding: 7px 0;
}

.causes__swatch {
  grid-area: swatch;
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

.causes__label {
  grid-area: label;
  font-size: 12.5px;
  font-weight: 600;
}

.causes__value {
  grid-area: value;
  font-size: 12px;
  color: rgb(var(--v-theme-muted));
  font-variant-numeric: tabular-nums;
}

.causes__share {
  grid-area: share;
  font-size: 12px;
  font-weight: 600;
  text-align: right;
  color: rgb(var(--v-theme-muted));
  font-variant-numeric: tabular-nums;
}

.causes__track {
  grid-area: track;
  height: 6px;
  border-radius: 999px;
  background: rgba(var(--v-theme-muted), 0.16);
  overflow: hidden;
}

.causes__fill {
  display: block;
  height: 100%;
  border-radius: 999px;
}

.cost {
  margin: 0;
}

.cost__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 0;
}

.cost__row + .cost__row {
  border-top: 1px solid rgba(var(--v-theme-muted), 0.16);
}

.cost__row dt {
  font-size: 12.5px;
  color: rgb(var(--v-theme-muted));
}

.cost__row dd {
  font-size: 13px;
  font-weight: 700;
  margin: 0;
  font-variant-numeric: tabular-nums;
}

.cost__row--total dd {
  font-size: 16px;
  color: rgb(var(--v-theme-error));
}

.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex: none;
}

.dot--critical {
  background: rgb(var(--v-theme-error));
}

.dot--warning {
  background: rgb(var(--v-theme-accent));
}

.dot--ok {
  background: rgb(var(--v-theme-success));
}

.count {
  margin-left: auto;
  font-size: 13px;
  font-weight: 700;
  color: rgb(var(--v-theme-muted));
  font-variant-numeric: tabular-nums;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list__item + .list__item {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(var(--v-theme-muted), 0.16);
}

.list__finding {
  font-size: 13px;
  line-height: 1.4;
  font-weight: 600;
  margin: 0;
}

.list__detail {
  font-size: 12px;
  line-height: 1.5;
  color: rgb(var(--v-theme-muted));
  margin: 4px 0 0;
}

.targets :deep(tbody td) {
  font-size: 12.5px;
  font-variant-numeric: tabular-nums;
}

.targets :deep(thead th) {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
</style>

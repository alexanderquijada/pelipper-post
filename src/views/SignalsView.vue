<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import { useMetrics } from '@/composables/useMetrics'

const { signalGroups, onTimeVsTarget, onTimeTarget } = useMetrics()

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

    <v-row dense>
      <v-col cols="12">
        <v-card class="pp-card-pad">
          <h2 class="pp-card-title">On-Time Rate by Region</h2>
          <p class="pp-card-subtitle">
            Each region's on-time rate against the {{ pct(onTimeTarget) }} target.
          </p>
          <v-table density="compact" class="targets">
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
              <tr v-for="r in onTimeVsTarget" :key="r.region">
                <td class="font-weight-bold">{{ r.region }}</td>
                <td class="text-right">{{ num(r.parcels) }}</td>
                <td class="text-right">{{ pct(r.onTime) }}</td>
                <td class="text-right" :class="r.meets ? 'text-success' : 'text-error'">
                  {{ r.gap >= 0 ? '+' : '−' }}{{ Math.abs(r.gap * 100).toFixed(1) }} pts
                </td>
                <td>
                  <v-chip :color="r.meets ? 'success' : 'error'" variant="tonal" size="small">
                    {{ r.meets ? 'Meets target' : 'Below target' }}
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

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
import type { Signal } from '@/composables/useMetrics'

defineProps<{ signals: Signal[]; detailsTo?: string }>()

/** Which rows are expanded. Detail is collapsed by default to keep the card dense. */
const open = ref(new Set<string>())

function toggle(id: string) {
  const next = new Set(open.value)
  next.has(id) ? next.delete(id) : next.add(id)
  open.value = next
}

const SEVERITY_LABEL: Record<Signal['severity'], string> = {
  critical: 'Critical',
  warning: 'Warning',
  ok: 'Healthy',
}
</script>

<template>
  <v-card class="pp-card-pad" height="100%">
    <div class="d-flex align-start justify-space-between ga-3">
      <h2 class="pp-card-title">Critical Delivery Signals</h2>
      <RouterLink v-if="detailsTo" class="pp-details" :to="detailsTo">View details →</RouterLink>
    </div>
    <p class="pp-card-subtitle">Notable shifts in network performance.</p>

    <ul v-if="signals.length" class="signals">
      <li v-for="s in signals" :key="s.id" class="signal">
        <button
          type="button"
          class="signal__row"
          :aria-expanded="open.has(s.id)"
          @click="toggle(s.id)"
        >
          <span class="signal__dot" :class="`signal__dot--${s.severity}`" aria-hidden="true" />
          <span class="signal__finding">{{ s.finding }}</span>
          <span class="signal__severity">{{ SEVERITY_LABEL[s.severity] }}</span>
          <v-icon
            :icon="open.has(s.id) ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            size="16"
            class="signal__chevron"
            aria-hidden="true"
          />
        </button>
        <p v-if="open.has(s.id)" class="signal__detail">{{ s.detail }}</p>
      </li>
    </ul>

    <p v-else class="text-caption text-muted mb-0 py-4">
      No signals can be computed for this combination — a single month leaves nothing to compare
      against.
    </p>
  </v-card>
</template>

<style scoped>
.pp-details {
  flex: none;
  font-size: 12px;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
  white-space: nowrap;
}

.pp-details:hover {
  text-decoration: underline;
}

.signals {
  list-style: none;
  padding: 0;
  margin: 0;
}

.signal + .signal {
  border-top: 1px solid rgba(var(--v-theme-muted), 0.16);
}

.signal__row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 0;
  background: none;
  border: 0;
  text-align: left;
  cursor: pointer;
  color: inherit;
  font: inherit;
}

.signal__row:hover .signal__finding {
  color: rgb(var(--v-theme-primary));
}

.signal__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex: none;
}

.signal__dot--critical {
  background: rgb(var(--v-theme-error));
}

.signal__dot--warning {
  background: rgb(var(--v-theme-accent));
}

.signal__dot--ok {
  background: rgb(var(--v-theme-success));
}

.signal__finding {
  flex: 1 1 auto;
  font-size: 13px;
  line-height: 1.4;
}

.signal__severity {
  flex: none;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgb(var(--v-theme-muted));
}

.signal__chevron {
  flex: none;
  color: rgb(var(--v-theme-muted));
}

.signal__detail {
  margin: 0 0 10px 18px;
  font-size: 12px;
  line-height: 1.5;
  color: rgb(var(--v-theme-muted));
}
</style>

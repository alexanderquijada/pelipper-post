<script setup lang="ts">
defineProps<{
  rows: { label: string; value: string; health: 'good' | 'warn' | 'bad'; hint: string }[]
}>()

const HEALTH_LABEL = { good: 'Healthy', warn: 'Watch', bad: 'At risk' } as const
</script>

<template>
  <v-card class="pp-card-pad" height="100%">
    <h2 class="pp-card-title">Network Reliability &amp; Fulfillment Health</h2>
    <p class="pp-card-subtitle">
      Dot colour reflects whether the figure is healthy, not simply what it is.
    </p>

    <ul class="health">
      <li v-for="row in rows" :key="row.label" class="health__row" :title="row.hint">
        <span
          class="health__dot"
          :class="`health__dot--${row.health}`"
          :aria-label="HEALTH_LABEL[row.health]"
        />
        <span class="health__label">{{ row.label }}</span>
        <span class="health__value">{{ row.value }}</span>
      </li>
    </ul>
  </v-card>
</template>

<style scoped>
.health {
  list-style: none;
  padding: 0;
  margin: 0;
}

.health__row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 0;
}

.health__row + .health__row {
  border-top: 1px solid rgba(var(--v-theme-muted), 0.16);
}

.health__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex: none;
}

.health__dot--good {
  background: rgb(var(--v-theme-success));
}

.health__dot--warn {
  background: rgb(var(--v-theme-accent));
}

.health__dot--bad {
  background: rgb(var(--v-theme-error));
}

.health__label {
  flex: 1 1 auto;
  font-size: 13px;
}

.health__value {
  flex: none;
  font-size: 13px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
</style>

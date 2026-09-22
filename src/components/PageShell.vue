<script setup lang="ts">
import { useMetrics } from '@/composables/useMetrics'

defineProps<{ title: string; subtitle: string }>()

// Filters live here now, inside the shell, rather than in the top bar. Same
// module-level state, so they stay shared across all six routes.
const { selectedMonth, selectedRegion, monthOptions, regionOptions, filterCaption } = useMetrics()
</script>

<template>
  <v-container class="pelipper-width px-4 py-4">
    <!-- One outer card per page; every inner card nests inside it. -->
    <v-card class="pp-shell">
      <header class="shell__header">
        <h1 class="shell__title">{{ title }}</h1>
        <p class="shell__subtitle">{{ subtitle }}</p>
      </header>

      <div class="shell__filters">
        <v-select
          v-model="selectedMonth"
          :items="monthOptions"
          label="Month"
          density="compact"
          hide-details
          variant="outlined"
          class="shell__select"
        />
        <v-select
          v-model="selectedRegion"
          :items="regionOptions"
          label="Region"
          density="compact"
          hide-details
          variant="outlined"
          class="shell__select"
        />
        <span class="shell__scope">{{ filterCaption }}</span>
      </div>

      <slot />
    </v-card>
  </v-container>
</template>

<style scoped>
.shell__header {
  margin-bottom: 14px;
}

.shell__title {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
}

.shell__subtitle {
  font-size: 13px;
  line-height: 1.4;
  color: rgb(var(--v-theme-muted));
  margin: 3px 0 0;
}

.shell__filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(var(--v-theme-muted), 0.18);
}

.shell__select {
  width: 190px;
  flex: none;
}

.shell__scope {
  font-size: 12px;
  color: rgb(var(--v-theme-muted));
  margin-left: auto;
}

@media (max-width: 600px) {
  .shell__select {
    width: 100%;
  }

  .shell__scope {
    margin-left: 0;
  }
}
</style>

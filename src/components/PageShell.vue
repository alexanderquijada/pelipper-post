<script setup lang="ts">
import FilterBar from '@/components/FilterBar.vue'
import { useMetrics } from '@/composables/useMetrics'

defineProps<{ title: string; subtitle: string }>()

// Filters live here now, inside the shell, rather than in the top bar. Same
// module-level state, so they stay shared across all six routes.
const { filterCaption, trendCaption } = useMetrics()
</script>

<template>
  <v-container class="pelipper-width px-4 py-4">
    <!-- One outer card per page; every inner card nests inside it. -->
    <v-card class="pp-shell">
      <header class="shell__header">
        <h1 class="shell__title">{{ title }}</h1>
        <p class="shell__subtitle">{{ subtitle }}</p>
        <p class="shell__scope">
          {{ filterCaption }}<template v-if="trendCaption"> · {{ trendCaption }}</template>
        </p>
      </header>

      <FilterBar />

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

.shell__scope {
  font-size: 12px;
  line-height: 1.4;
  color: rgb(var(--v-theme-muted));
  margin: 4px 0 0;
}
</style>

<script setup lang="ts">
import FilterBar from '@/components/FilterBar.vue'

defineProps<{ title: string; subtitle: string }>()

// The header is title + one sentence, nothing else. The scope line moved into
// FilterBar, because it describes filter state rather than the page.
</script>

<template>
  <v-container class="pelipper-width px-4 py-4">
    <!-- One outer card per page; every inner card nests inside it. -->
    <v-card class="pp-shell">
      <header class="shell__header">
        <h1 class="shell__title">{{ title }}</h1>
        <p class="shell__subtitle">{{ subtitle }}</p>
      </header>

      <FilterBar />

      <slot />
    </v-card>
  </v-container>
</template>

<style scoped>
.shell__header {
  margin-bottom: 18px;
}

.shell__title {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
}

.shell__subtitle {
  font-size: 13px;
  line-height: 1.45;
  color: rgb(var(--v-theme-muted));
  margin: 4px 0 0;
}
</style>

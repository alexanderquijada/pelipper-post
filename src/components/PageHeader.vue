<script setup lang="ts">
import { useMetrics } from '@/composables/useMetrics'

defineProps<{ title: string; subtitle: string }>()

const { filterCaption } = useMetrics()
</script>

<template>
  <header class="page-header">
    <h1 class="page-header__title">{{ title }}</h1>
    <p class="page-header__subtitle">{{ subtitle }}</p>
    <p class="page-header__scope">{{ filterCaption }}</p>
  </header>
</template>

<style scoped>
.page-header {
  margin-bottom: 16px;
}

.page-header__title {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
}

.page-header__subtitle {
  font-size: 13px;
  line-height: 1.4;
  margin: 3px 0 0;
}

.page-header__scope {
  font-size: 12px;
  line-height: 1.4;
  color: rgb(var(--v-theme-muted));
  margin: 2px 0 0;
}
</style>

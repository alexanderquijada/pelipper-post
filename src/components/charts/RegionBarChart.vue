<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip,
  type ChartOptions,
} from 'chart.js'
import { SERIES_COLORS, compactNumber, fullNumber, useChartTheme } from './chartTheme'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip)

const props = defineProps<{ labels: string[]; values: number[] }>()

const { muted, grid, surface, ink } = useChartTheme()

const data = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: 'Parcels delivered',
      data: props.values,
      backgroundColor: SERIES_COLORS[0],
      hoverBackgroundColor: SERIES_COLORS[1],
      // 4px rounded data-end, anchored to the baseline
      borderRadius: 4,
      borderSkipped: 'bottom' as const,
      maxBarThickness: 56,
    },
  ],
}))

// One series, so no legend — the card title already names it.
const options = computed<ChartOptions<'bar'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: surface.value,
      titleColor: ink.value,
      bodyColor: ink.value,
      borderColor: grid.value,
      borderWidth: 1,
      padding: 10,
      displayColors: false,
      callbacks: {
        label: (ctx) => `${fullNumber(ctx.parsed.y ?? 0)} parcels`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: muted.value, font: { size: 12 } },
    },
    y: {
      beginAtZero: true,
      grid: { color: grid.value },
      border: { display: false },
      ticks: { color: muted.value, font: { size: 12 }, callback: (v) => compactNumber(Number(v)) },
    },
  },
}))
</script>

<template>
  <div class="chart-box">
    <Bar :data="data" :options="options" />
  </div>
</template>

<style scoped>
.chart-box {
  position: relative;
  /* matches the Cargo Mix card's doughnut + legend so the two cards in the
     chart row end up the same height instead of one carrying dead space */
  height: 360px;
}
</style>

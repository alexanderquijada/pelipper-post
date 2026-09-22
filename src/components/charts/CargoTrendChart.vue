<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartOptions,
} from 'chart.js'
import { compactNumber, fullNumber, useChartTheme, withAlpha } from './chartTheme'

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Filler, Tooltip)

const props = defineProps<{
  labels: string[]
  series: { label: string; colorIndex: number; values: number[] }[]
}>()

const { muted, grid, surface, ink, categorical } = useChartTheme()

// Stacked area: the question is how the MIX moves, so the parts must sum to the
// whole rather than overlap.
const data = computed(() => ({
  labels: props.labels,
  datasets: props.series.map((s) => {
    const color = categorical.value[s.colorIndex % categorical.value.length]!
    return {
      label: s.label,
      data: s.values,
      borderColor: color,
      backgroundColor: withAlpha(color, 0.55),
      borderWidth: 1.5,
      fill: true,
      tension: 0.3,
      pointRadius: 0,
      pointHoverRadius: 4,
    }
  }),
}))

const options = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: surface.value,
      titleColor: ink.value,
      bodyColor: ink.value,
      borderColor: grid.value,
      borderWidth: 1,
      padding: 10,
      callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${fullNumber(Number(ctx.parsed.y) || 0)}` },
    },
  },
  scales: {
    x: {
      stacked: true,
      grid: { display: false },
      border: { display: false },
      ticks: { color: muted.value, font: { size: 11 }, maxRotation: 0, autoSkipPadding: 10 },
    },
    y: {
      stacked: true,
      beginAtZero: true,
      grid: { color: grid.value },
      border: { display: false },
      ticks: {
        color: muted.value,
        font: { size: 11 },
        maxTicksLimit: 5,
        callback: (v) => compactNumber(Number(v)),
      },
    },
  },
}))
</script>

<template>
  <div class="chart-box">
    <Line :data="data" :options="options" />
  </div>
</template>

<style scoped>
.chart-box {
  position: relative;
  height: 240px;
}
</style>

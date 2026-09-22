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
import { compactNumber, fullNumber, useChartTheme, withAlpha } from './chartTheme'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip)

const props = withDefaults(
  defineProps<{
    labels: string[]
    values: number[]
    /** 'number' shows thousands separators; 'percent' treats values as 0-1. */
    format?: 'number' | 'percent'
    /** Optional reference line, in the same units as `values`. */
    target?: number | null
    targetLabel?: string
    height?: number
    unit?: string
    /** Index into the categorical palette for the bar colour. */
    colorIndex?: number
  }>(),
  { format: 'number', target: null, targetLabel: 'Target', height: 220, unit: '', colorIndex: 0 },
)

const { muted, grid, surface, ink, categorical } = useChartTheme()

const asPercent = computed(() => props.format === 'percent')
const fmt = (v: number) => (asPercent.value ? `${(v * 100).toFixed(1)}%` : fullNumber(v))

/**
 * The target line is drawn as a Chart.js plugin rather than a second dataset so
 * it can't be mistaken for data or show up in a legend.
 */
const targetLine = {
  id: 'ppTargetLine',
  afterDatasetsDraw(chart: any) {
    const t = props.target
    if (t === null || t === undefined) return
    const { ctx, chartArea, scales } = chart
    const y = scales.y.getPixelForValue(t)
    if (!Number.isFinite(y)) return
    ctx.save()
    ctx.strokeStyle = withAlpha(muted.value, 0.85)
    ctx.setLineDash([5, 4])
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(chartArea.left, y)
    ctx.lineTo(chartArea.right, y)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = muted.value
    ctx.font = '600 10px Inter, system-ui, sans-serif'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'bottom'
    ctx.fillText(`${props.targetLabel} ${fmt(t)}`, chartArea.right, y - 3)
    ctx.restore()
  },
}

const data = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      data: props.values,
      backgroundColor: categorical.value[props.colorIndex % categorical.value.length],
      hoverBackgroundColor: categorical.value[(props.colorIndex + 1) % categorical.value.length],
      borderRadius: 4,
      borderSkipped: 'bottom' as const,
      maxBarThickness: 46,
    },
  ],
}))

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
        label: (ctx) => `${fmt(Number(ctx.parsed.y) || 0)}${props.unit ? ` ${props.unit}` : ''}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: muted.value, font: { size: 11 }, maxRotation: 0, autoSkipPadding: 8 },
    },
    y: {
      beginAtZero: !asPercent.value,
      grid: { color: grid.value },
      border: { display: false },
      ticks: {
        color: muted.value,
        font: { size: 11 },
        maxTicksLimit: 5,
        callback: (v) => (asPercent.value ? `${(Number(v) * 100).toFixed(0)}%` : compactNumber(Number(v))),
      },
    },
  },
}))
</script>

<template>
  <div class="chart-box" :style="{ height: `${height}px` }">
    <Bar :data="data" :options="options" :plugins="[targetLine]" />
  </div>
</template>

<style scoped>
.chart-box {
  position: relative;
}
</style>

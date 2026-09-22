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
import { SEQUENTIAL_COLORS, compactNumber, fullNumber, useChartTheme, withAlpha } from './chartTheme'

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Filler, Tooltip)

const props = withDefaults(
  defineProps<{
    labels: string[]
    values: number[]
    format?: 'number' | 'percent' | 'currency'
    /** Horizontal reference lines, drawn behind the series. */
    references?: { value: number; label: string }[]
    height?: number
    unit?: string
    colorIndex?: number
  }>(),
  { format: 'number', references: () => [], height: 220, unit: '', colorIndex: 0 },
)

const { muted, grid, surface, ink } = useChartTheme()

const color = computed(() => SEQUENTIAL_COLORS[props.colorIndex % SEQUENTIAL_COLORS.length]!)

const fmt = (v: number) => {
  if (props.format === 'percent') return `${(v * 100).toFixed(1)}%`
  if (props.format === 'currency') return `₽${Math.round(v).toLocaleString('en-US')}`
  return fullNumber(Math.round(v))
}

/**
 * Reference lines are a plugin, not extra datasets — they are context, not data,
 * and must not be mistaken for a series.
 */
const referencePlugin = {
  id: 'ppReferenceLines',
  beforeDatasetsDraw(chart: any) {
    if (!props.references.length) return
    const { ctx, chartArea, scales } = chart
    ctx.save()
    props.references.forEach((ref, i) => {
      const y = scales.y.getPixelForValue(ref.value)
      if (!Number.isFinite(y)) return
      ctx.strokeStyle = withAlpha(muted.value, i === 0 ? 0.9 : 0.55)
      ctx.setLineDash(i === 0 ? [5, 4] : [2, 3])
      ctx.lineWidth = 1.25
      ctx.beginPath()
      ctx.moveTo(chartArea.left, y)
      ctx.lineTo(chartArea.right, y)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.fillStyle = muted.value
      ctx.font = '600 10px Inter, system-ui, sans-serif'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'bottom'
      ctx.fillText(`${ref.label} ${fmt(ref.value)}`, chartArea.left + 4, y - 3)
    })
    ctx.restore()
  },
}

const data = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      data: props.values,
      borderColor: color.value,
      backgroundColor: withAlpha(color.value, 0.16),
      borderWidth: 2,
      fill: true,
      tension: 0.35,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointBackgroundColor: color.value,
    },
  ],
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
      ticks: { color: muted.value, font: { size: 11 }, maxRotation: 0, autoSkipPadding: 10 },
    },
    y: {
      beginAtZero: props.format === 'number',
      grid: { color: grid.value },
      border: { display: false },
      ticks: {
        color: muted.value,
        font: { size: 11 },
        maxTicksLimit: 5,
        callback: (v) =>
          props.format === 'percent'
            ? `${(Number(v) * 100).toFixed(0)}%`
            : props.format === 'currency'
              ? `₽${compactNumber(Number(v))}`
              : compactNumber(Number(v)),
      },
    },
  },
}))
</script>

<template>
  <div class="chart-box" :style="{ height: `${height}px` }">
    <Line :data="data" :options="options" :plugins="[referencePlugin]" />
  </div>
</template>

<style scoped>
.chart-box {
  position: relative;
}
</style>

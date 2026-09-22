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
  /** Taller panels for the dedicated Trends page. */
  tall?: boolean
  labels: string[]
  parcelsDelivered: number[]
  gymSupplyRuns: number[]
  /** Index of the month to mark, or -1 for none. */
  selectedIndex: number
}>(),
  { tall: false },
)

const { muted, grid, surface, ink } = useChartTheme()

/**
 * Two panels, one shared time axis — NOT a dual-axis chart.
 *
 * Parcels Delivered runs in the tens of thousands and Gym Supply Runs in the
 * tens. On a single pair of y-scales the smaller series flatlines against the
 * axis, and where the two lines cross is an artefact of the scales chosen
 * rather than anything real. Stacking two single-axis panels keeps both shapes
 * readable and keeps every comparison honest.
 */
// Twelve months IS ordered data, so the sequential ramp is correct here.
const MARKER = SEQUENTIAL_COLORS[2] // the one orange in the ramp

function panelOptions(opts: {
  showXTicks: boolean
  unit: string
}): ChartOptions<'line'> {
  return {
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
          label: (ctx) => `${fullNumber(ctx.parsed.y ?? 0)} ${opts.unit}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          display: opts.showXTicks,
          color: muted.value,
          font: { size: 11 },
          maxRotation: 0,
          autoSkipPadding: 12,
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: grid.value },
        border: { display: false },
        ticks: {
          color: muted.value,
          font: { size: 11 },
          maxTicksLimit: 4,
          callback: (v) => compactNumber(Number(v)),
        },
        // Pin both panels to the same gutter width so the two time axes line up.
        afterFit: (scale) => {
          scale.width = 54
        },
      },
    },
  }
}

function markerRadius(i: number) {
  return i === props.selectedIndex ? 6 : 0
}

function series(values: number[], color: string) {
  return {
    data: values,
    borderColor: color,
    backgroundColor: withAlpha(color, 0.18),
    borderWidth: 2,
    fill: true,
    tension: 0.35,
    pointRadius: values.map((_, i) => markerRadius(i)),
    pointHoverRadius: 5,
    pointBackgroundColor: MARKER,
    pointBorderColor: surface.value,
    pointBorderWidth: 2,
  }
}

const parcelsData = computed(() => ({
  labels: props.labels,
  datasets: [series(props.parcelsDelivered, SEQUENTIAL_COLORS[0])],
}))

const gymData = computed(() => ({
  labels: props.labels,
  datasets: [series(props.gymSupplyRuns, SEQUENTIAL_COLORS[1])],
}))

const parcelsOptions = computed(() => panelOptions({ showXTicks: false, unit: 'parcels' }))
const gymOptions = computed(() => panelOptions({ showXTicks: true, unit: 'runs' }))
</script>

<template>
  <div>
    <div class="panel-label text-caption text-muted">
      <span class="dot" :style="{ background: SEQUENTIAL_COLORS[0] }" />
      Parcels Delivered
    </div>
    <div class="panel" :class="tall ? 'panel--tall-lg' : 'panel--tall'">
      <Line :data="parcelsData" :options="parcelsOptions" />
    </div>

    <div class="panel-label text-caption text-muted mt-3">
      <span class="dot" :style="{ background: SEQUENTIAL_COLORS[1] }" />
      Gym Supply Runs
    </div>
    <div class="panel" :class="tall ? 'panel--short-lg' : 'panel--short'">
      <Line :data="gymData" :options="gymOptions" />
    </div>
  </div>
</template>

<style scoped>
.panel {
  position: relative;
}

.panel--tall {
  height: 146px;
}

.panel--short {
  height: 94px;
}

.panel--tall-lg {
  height: 260px;
}

.panel--short-lg {
  height: 150px;
}

.panel-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}
</style>

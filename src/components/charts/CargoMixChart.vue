<script setup lang="ts">
import { computed, ref } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { ArcElement, Chart as ChartJS, Tooltip, type ChartOptions } from 'chart.js'
import { fullNumber, useChartTheme } from './chartTheme'
import { cargoItemUrl } from '@/utils/sprites'

ChartJS.register(ArcElement, Tooltip)

const props = defineProps<{ labels: string[]; values: number[] }>()

// Cargo types are UNORDERED, so this uses the categorical palette, not the ramp.
const { grid, surface, ink, categorical } = useChartTheme()

const total = computed(() => props.values.reduce((a, b) => a + b, 0))

// A missing item sprite must never render as a broken image.
const failedSprites = ref(new Set<string>())

const data = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      data: props.values,
      backgroundColor: [...categorical.value],
      // 2px surface-coloured gap between segments so adjacent fills never touch
      borderColor: surface.value,
      borderWidth: 2,
      hoverOffset: 6,
    },
  ],
}))

const options = computed<ChartOptions<'doughnut'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '62%',
  plugins: {
    // Chart.js's own legend is off — the HTML legend below carries the numbers
    // too, so identity never depends on colour alone.
    legend: { display: false },
    tooltip: {
      backgroundColor: surface.value,
      titleColor: ink.value,
      bodyColor: ink.value,
      borderColor: grid.value,
      borderWidth: 1,
      padding: 10,
      callbacks: {
        label: (ctx) => {
          const v = Number(ctx.parsed) || 0
          const pct = total.value > 0 ? ((v / total.value) * 100).toFixed(1) : '0.0'
          return ` ${fullNumber(v)} (${pct}%)`
        },
      },
    },
  },
}))

const legend = computed(() =>
  props.labels.map((label, i) => {
    const value = props.values[i] ?? 0
    return {
      label,
      value,
      color: categorical.value[i % categorical.value.length]!,
      sprite: cargoItemUrl(label),
      pct: total.value > 0 ? ((value / total.value) * 100).toFixed(1) : '0.0',
    }
  }),
)
</script>

<template>
  <div>
    <div class="chart-box">
      <Doughnut :data="data" :options="options" />
    </div>

    <!-- Legend carries label AND value AND share, not just a colour swatch. -->
    <ul class="legend mt-4">
      <li v-for="item in legend" :key="item.label" class="legend__row">
        <img
          v-if="item.sprite && !failedSprites.has(item.label)"
          :src="item.sprite"
          alt=""
          class="legend__sprite"
          width="30"
          height="30"
          @error="failedSprites = new Set(failedSprites).add(item.label)"
        />
        <span v-else class="legend__sprite legend__sprite--empty" />
        <span class="legend__swatch" :style="{ background: item.color }" />
        <span class="legend__label text-body-2">{{ item.label }}</span>
        <span class="legend__value text-body-2 text-muted">
          {{ fullNumber(item.value) }}
          <span class="legend__pct">{{ item.pct }}%</span>
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.chart-box {
  position: relative;
  height: 200px;
}

.legend {
  list-style: none;
  padding: 0;
  margin: 0;
}

.legend__row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 1px 0;
}

.legend__sprite {
  /* 30x30 pixel art — must not be smoothed. */
  image-rendering: pixelated;
  width: 30px;
  height: 30px;
  flex: none;
  object-fit: contain;
}

.legend__sprite--empty {
  display: inline-block;
}

.legend__swatch {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex: none;
}

.legend__label {
  flex: 1 1 auto;
}

.legend__value {
  flex: none;
  font-variant-numeric: tabular-nums;
}

.legend__pct {
  display: inline-block;
  min-width: 52px;
  text-align: right;
}
</style>

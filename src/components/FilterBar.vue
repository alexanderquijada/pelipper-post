<script setup lang="ts">
import { computed, ref } from 'vue'
import { useChartTheme } from '@/components/charts/chartTheme'
import { useMetrics, type PresetMonths } from '@/composables/useMetrics'

const {
  monthOptions,
  regionOptions,
  selectedRegion,
  activePreset,
  activeMonthKey,
  rangeLabel,
  selectPreset,
  selectMonth,
  resetFilters,
  isDefaultSelection,
  filterCaption,
  trendCaption,
} = useMetrics()

const PRESETS: { months: PresetMonths; label: string }[] = [
  { months: 12, label: '12M' },
  { months: 6, label: '6M' },
  { months: 3, label: '3M' },
]

const { editorial } = useChartTheme()
const accentRgb = computed(() => {
  const h = editorial.value.indigo.replace('#', '')
  const n = Number.parseInt(h, 16)
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`
})

const segRefs = ref<HTMLButtonElement[]>([])

/**
 * Radiogroup keyboard model: arrows move AND select, Home/End jump to the ends.
 * A control bar that only works with a mouse would be a regression from the
 * selects it replaced.
 */
function onSegKey(e: KeyboardEvent, index: number) {
  const last = PRESETS.length - 1
  let next: number | null = null
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = index === last ? 0 : index + 1
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = index === 0 ? last : index - 1
  else if (e.key === 'Home') next = 0
  else if (e.key === 'End') next = last
  if (next === null) return
  e.preventDefault()
  selectPreset(PRESETS[next]!.months)
  segRefs.value[next]?.focus()
}

/** 1M is a preset in the UI, but it means "the single most recent month". */
const latestMonthKey = computed(() => monthOptions.value[0]?.value ?? '')
const isOneMonth = computed(() => activeMonthKey.value === latestMonthKey.value)

function selectOneMonth() {
  selectMonth(latestMonthKey.value)
}
</script>

<template>
  <div class="filters">
  <div class="bar">
    <!-- TIME -->
    <div class="bar__group">
      <div
        class="seg"
        role="radiogroup"
        aria-label="Time range"
        :style="{ '--pp-accent-rgb': accentRgb }"
      >
        <button
          v-for="(p, i) in PRESETS"
          :key="p.months"
          ref="segRefs"
          type="button"
          role="radio"
          class="seg__item"
          :class="{ 'seg__item--on': activePreset === p.months }"
          :aria-checked="activePreset === p.months"
          :tabindex="activePreset === p.months ? 0 : -1"
          @click="selectPreset(p.months)"
          @keydown="onSegKey($event, i)"
        >
          {{ p.label }}
        </button>
        <button
          ref="segRefs"
          type="button"
          role="radio"
          class="seg__item"
          :class="{ 'seg__item--on': isOneMonth }"
          :aria-checked="isOneMonth"
          :tabindex="isOneMonth ? 0 : -1"
          @click="selectOneMonth"
          @keydown="onSegKey($event, PRESETS.length)"
        >
          1M
        </button>
      </div>

      <v-menu>
        <template #activator="{ props }">
          <button
            v-bind="props"
            type="button"
            class="range"
            :class="{ 'range--on': activeMonthKey !== null }"
            :style="{ '--pp-accent-rgb': accentRgb }"
          >
            {{ rangeLabel }}
            <v-icon icon="mdi-menu-down" size="18" />
          </button>
        </template>
        <v-list density="compact" class="range__menu">
          <v-list-item
            v-for="m in monthOptions"
            :key="m.value"
            :active="activeMonthKey === m.value"
            :title="m.title"
            @click="selectMonth(m.value)"
          />
        </v-list>
      </v-menu>
    </div>

    <!-- REGION -->
    <div class="bar__chips" role="group" aria-label="Region">
      <button
        v-for="r in regionOptions"
        :key="r.value"
        type="button"
        class="chip"
        :class="{ 'chip--on': selectedRegion === r.value }"
        :aria-pressed="selectedRegion === r.value"
        :style="{ '--pp-accent-rgb': accentRgb }"
        @click="selectedRegion = r.value as typeof selectedRegion"
      >
        {{ r.title }}
      </button>
    </div>

    <button v-if="!isDefaultSelection" type="button" class="reset" @click="resetFilters">
      Reset
    </button>
  </div>

    <!-- The scope line belongs to the CONTROLS, not the page description: it is
         a readout of filter state, and it changes when these change. Sitting
         under the page subtitle it read as a third sentence of prose. -->
    <p class="filters__scope" aria-live="polite">
      {{ filterCaption }}<template v-if="trendCaption"> · {{ trendCaption }}</template>
    </p>
  </div>
</template>

<style scoped>
/* The rule now closes the whole filter block — controls plus their readout. */
.filters {
  padding-bottom: 14px;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(var(--v-theme-muted), 0.18);
}

.bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

/* Smaller and lighter than the page subtitle, so it can't be mistaken for it. */
.filters__scope {
  margin: 10px 0 0;
  font-size: 11.5px;
  font-weight: 500;
  line-height: 1.45;
  color: rgb(var(--v-theme-muted));
}

.bar__group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
}

/* ---- segmented control ---- */
.seg {
  display: inline-flex;
  padding: 3px;
  border-radius: 999px;
  background: rgba(var(--v-theme-muted), 0.16);
}

.seg__item {
  appearance: none;
  border: 0;
  background: transparent;
  border-radius: 999px;
  padding: 5px 14px;
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: rgb(var(--v-theme-muted));
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease;
}

.seg__item:hover {
  color: rgb(var(--v-theme-on-surface));
}

.seg__item--on {
  /* raised, not merely tinted — the active segment should read as lifted */
  background: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
  box-shadow: 0 1px 2px rgba(15, 30, 45, 0.16), 0 1px 5px rgba(15, 30, 45, 0.1);
}

.seg__item:focus-visible,
.range:focus-visible,
.chip:focus-visible,
.reset:focus-visible {
  outline: 2px solid rgb(var(--pp-accent-rgb, var(--v-theme-primary)));
  outline-offset: 2px;
}

/* ---- resolved range chip ---- */
.range {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  appearance: none;
  border: 1px solid rgba(var(--v-theme-muted), 0.3);
  background: transparent;
  border-radius: 999px;
  padding: 5px 8px 5px 14px;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  cursor: pointer;
}

.range--on {
  border-color: rgba(var(--pp-accent-rgb), 0.55);
  background: rgba(var(--pp-accent-rgb), 0.13);
  color: rgb(var(--pp-accent-rgb));
}

/* ---- region chips ---- */
.bar__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-left: auto;
}

.chip {
  appearance: none;
  border: 1px solid rgba(var(--v-theme-muted), 0.3);
  background: transparent;
  border-radius: 999px;
  padding: 5px 12px;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  color: rgb(var(--v-theme-muted));
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease;
}

.chip:hover {
  color: rgb(var(--v-theme-on-surface));
}

/* tint, not a heavy fill */
.chip--on {
  background: rgba(var(--pp-accent-rgb), 0.13);
  border-color: rgba(var(--pp-accent-rgb), 0.55);
  color: rgb(var(--pp-accent-rgb));
}

.reset {
  appearance: none;
  border: 0;
  background: none;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  color: rgb(var(--v-theme-muted));
  cursor: pointer;
  text-decoration: underline;
  padding: 4px;
}

.reset:hover {
  color: rgb(var(--v-theme-on-surface));
}

/* Below 1200px the chips wrap to their own line rather than shrinking. */
@media (max-width: 1200px) {
  .bar__chips {
    margin-left: 0;
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .seg__item,
  .chip {
    transition: none;
  }
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { useChartTheme } from '@/components/charts/chartTheme'
import { cargoItemUrl } from '@/utils/sprites'

defineProps<{
  categories: { label: string; value: number; share: number; colorIndex: number }[]
}>()

// Same categorical palette as the doughnut — contrast- and CVD-verified, and
// indexed by cargo type rather than by rank so a filter change never repaints.
const { categorical } = useChartTheme()

const failedSprites = ref(new Set<string>())
const fullNumber = (n: number) => n.toLocaleString('en-US')
</script>

<template>
  <v-card class="pp-card-pad" height="100%">
    <h2 class="pp-card-title">Top Cargo Categories</h2>
    <p class="pp-card-subtitle">Share of parcels delivered in the current selection.</p>

    <ul class="cargo">
      <li v-for="c in categories" :key="c.label" class="cargo__row">
        <img
          v-if="cargoItemUrl(c.label) && !failedSprites.has(c.label)"
          :src="cargoItemUrl(c.label)!"
          alt=""
          class="cargo__sprite"
          width="30"
          height="30"
          @error="failedSprites = new Set(failedSprites).add(c.label)"
        />
        <span v-else class="cargo__sprite" />

        <div class="cargo__body">
          <div class="cargo__head">
            <span class="cargo__label">{{ c.label }}</span>
            <span class="cargo__value">
              {{ fullNumber(c.value) }}
              <span class="cargo__share">{{ (c.share * 100).toFixed(1) }}%</span>
            </span>
          </div>
          <div class="cargo__track">
            <div
              class="cargo__fill"
              :style="{
                width: `${Math.max(c.share * 100, 1.5)}%`,
                background: categorical[c.colorIndex % categorical.length],
              }"
            />
          </div>
        </div>
      </li>
    </ul>
  </v-card>
</template>

<style scoped>
.cargo {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cargo__row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 0;
}

.cargo__sprite {
  /* 30x30 pixel art — must not be smoothed */
  image-rendering: pixelated;
  width: 30px;
  height: 30px;
  flex: none;
  object-fit: contain;
}

.cargo__body {
  flex: 1 1 auto;
  min-width: 0;
}

.cargo__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}

.cargo__label {
  font-size: 12.5px;
  font-weight: 600;
}

.cargo__value {
  font-size: 12px;
  color: rgb(var(--v-theme-muted));
  font-variant-numeric: tabular-nums;
  flex: none;
}

.cargo__share {
  display: inline-block;
  min-width: 44px;
  text-align: right;
  font-weight: 600;
}

.cargo__track {
  height: 6px;
  border-radius: 999px;
  background: rgba(var(--v-theme-muted), 0.16);
  overflow: hidden;
}

.cargo__fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.35s ease;
}

@media (prefers-reduced-motion: reduce) {
  .cargo__fill {
    transition: none;
  }
}
</style>

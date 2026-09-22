<script setup lang="ts">
import { ref } from 'vue'
import type { Courier, CourierStatus } from '@/types/metrics'
import { SPRITE_FALLBACK_ICON, spriteUrl } from '@/utils/sprites'
import { useMetrics } from '@/composables/useMetrics'
import type { DelayRisk } from '@/types/metrics'

defineProps<{ couriers: Courier[] }>()

const { weatherFor } = useMetrics()

// Compact on purpose: icon plus risk chip, no temperature — the table is wide
// enough already. Full conditions live on the Regional Weather card.
const RISK_COLOR: Record<DelayRisk, string> = {
  High: 'error',
  Moderate: 'accent',
  Low: 'success',
}

const STATUS_COLOR: Record<CourierStatus, string> = {
  'On Route': 'success',
  Resting: 'secondary',
  Grounded: 'error',
}

const formatNumber = (n: number) => n.toLocaleString('en-US')
const formatRate = (r: number) => `${(r * 100).toFixed(1)}%`

/** dexIds whose sprite failed to load — those avatars fall back to an MDI icon. */
const failedSprites = ref(new Set<number>())

function onSpriteError(dexId: number) {
  failedSprites.value = new Set(failedSprites.value).add(dexId)
}
</script>

<template>
  <v-table v-if="couriers.length" density="compact" class="roster">
    <thead>
      <tr>
        <th class="text-left" style="width: 48px"><span class="d-sr-only">Sprite</span></th>
        <th class="text-left">Courier</th>
        <th class="text-left">Species</th>
        <th class="text-left">Home Region</th>
        <th class="text-left">Conditions</th>
        <th class="text-right">Runs</th>
        <th class="text-right">On-Time Rate</th>
        <th class="text-left">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="courier in couriers" :key="courier.name">
        <td>
          <v-avatar size="30" class="sprite-avatar">
            <v-img
              v-if="!failedSprites.has(courier.dexId)"
              :src="spriteUrl(courier.dexId)"
              :alt="`${courier.species} sprite`"
              @error="onSpriteError(courier.dexId)"
            />
            <v-icon v-else :icon="SPRITE_FALLBACK_ICON" color="muted" />
          </v-avatar>
        </td>
        <td class="font-weight-bold">{{ courier.name }}</td>
        <td class="text-muted">{{ courier.species }}</td>
        <td class="text-muted">{{ courier.homeRegion }}</td>
        <td>
          <span v-if="weatherFor(courier.homeRegion)" class="wx-cell">
            <v-icon
              :icon="weatherFor(courier.homeRegion)!.icon"
              size="17"
              class="wx-cell__icon"
              :aria-label="weatherFor(courier.homeRegion)!.condition"
            />
            <v-chip
              :color="RISK_COLOR[weatherFor(courier.homeRegion)!.delayRisk]"
              variant="tonal"
              size="x-small"
            >
              {{ weatherFor(courier.homeRegion)!.delayRisk }}
            </v-chip>
          </span>
        </td>
        <td class="text-right">{{ formatNumber(courier.runs) }}</td>
        <td class="text-right">{{ formatRate(courier.onTimeRate) }}</td>
        <td>
          <v-chip :color="STATUS_COLOR[courier.status]" variant="tonal" size="small">
            {{ courier.status }}
          </v-chip>
        </td>
      </tr>
    </tbody>
  </v-table>

  <p v-else class="text-body-2 text-muted text-center py-8 mb-0">
    No couriers are based in this region.
  </p>
</template>

<style scoped>
.wx-cell {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.wx-cell__icon {
  color: rgb(var(--v-theme-primary));
}

/* 44px rows, compact density — BRIEF.md §4. */
.roster :deep(tbody td) {
  height: 44px;
  font-size: 12.5px;
}

.roster :deep(thead th) {
  height: 36px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.sprite-avatar {
  background: rgba(var(--v-theme-primary), 0.12);
}

.sprite-avatar :deep(img) {
  /* official artwork is square with transparent padding — contain, don't crop */
  object-fit: contain;
  padding: 3px;
}
</style>

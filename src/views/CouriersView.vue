<script setup lang="ts">
import { ref } from 'vue'
import PageShell from '@/components/PageShell.vue'
import CourierRoster from '@/components/CourierRoster.vue'
import LollipopChart from '@/components/charts/LollipopChart.vue'
import { useMetrics } from '@/composables/useMetrics'
import { SPRITE_FALLBACK_ICON, spriteUrl } from '@/utils/sprites'
import { STATUS_PHRASE, STATUS_TONE } from '@/utils/status'

const { filteredCouriers, courierStops, courierFirstAttempt, courierRest, courierStatusBreakdown } =
  useMetrics()

const failedSprites = ref(new Set<number>())
const num = (n: number) => n.toLocaleString('en-US')
const avg = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0)

/** Attach each courier's dexId so the charts can show the same sprite as the roster. */
function withSprites(series: { labels: string[]; values: number[] }) {
  return series.labels.map((label, i) => ({
    label,
    value: series.values[i]!,
    dexId: filteredCouriers.value.find((c) => c.name === label)?.dexId,
  }))
}
const pct = (n: number) => `${(n * 100).toFixed(1)}%`
</script>

<template>
  <PageShell
    title="Courier Fleet"
    subtitle="How each courier is performing and where they're flying."
  >

    <v-row dense class="mb-2">
      <v-col v-for="c in filteredCouriers" :key="c.name" cols="12" sm="6" md="4" lg="3">
        <v-card class="pp-card-pad" height="100%">
          <div class="d-flex align-center ga-3">
            <v-avatar size="56" class="courier__avatar">
              <v-img
                v-if="!failedSprites.has(c.dexId)"
                :src="spriteUrl(c.dexId)"
                :alt="`${c.species} sprite`"
                @error="failedSprites = new Set(failedSprites).add(c.dexId)"
              />
              <v-icon v-else :icon="SPRITE_FALLBACK_ICON" color="muted" />
            </v-avatar>
            <div class="min-w-0">
              <p class="courier__name">{{ c.name }}</p>
              <p class="courier__species">{{ c.species }} · {{ c.homeRegion }}</p>
            </div>
          </div>

          <dl class="courier__stats">
            <div class="courier__stat">
              <dt>Runs</dt>
              <dd>{{ num(c.runs) }}</dd>
            </div>
            <div class="courier__stat">
              <dt>Stops / Run</dt>
              <dd>{{ num(c.stopsPerRun) }}</dd>
            </div>
            <div class="courier__stat">
              <dt>Tenure</dt>
              <dd>{{ c.tenureMonths }}mo</dd>
            </div>
          </dl>

          <span
            class="pp-pill"
            :class="`pp-pill--${STATUS_TONE[c.status]}`"
            :title="STATUS_PHRASE[c.status]"
          >
            {{ c.status }}
          </span>
        </v-card>
      </v-col>
    </v-row>

    <v-row dense class="mb-2">
      <v-col cols="12" lg="6">
        <v-card class="pp-card-pad" height="100%">
          <h2 class="pp-card-title">Stops on a Typical Run</h2>
          <p class="pp-card-subtitle">How many delivery stops each courier makes in one run.</p>
          <LollipopChart
            :rows="withSprites(courierStops)"
            accent="indigo"
            :reference="avg(courierStops.values)"
            reference-label="Fleet average"
          />
        </v-card>
      </v-col>

      <v-col cols="12" lg="6">
        <v-card class="pp-card-pad" height="100%">
          <h2 class="pp-card-title">Who Gets It Right First Time</h2>
          <p class="pp-card-subtitle">
            How often each courier delivers without needing a second trip.
          </p>
          <LollipopChart
            :rows="withSprites(courierFirstAttempt)"
            format="percent"
            accent="teal"
            :reference="avg(courierFirstAttempt.values)"
            reference-label="Fleet average"
          />
        </v-card>
      </v-col>
    </v-row>

    <v-row dense class="mb-2">
      <v-col cols="12" lg="7">
        <v-card class="pp-card-pad" height="100%">
          <h2 class="pp-card-title">Time Off Taken</h2>
          <p class="pp-card-subtitle">Days each courier has rested since joining the fleet.</p>
          <LollipopChart
            :rows="withSprites(courierRest)"
            accent="plum"
            :reference="avg(courierRest.values)"
            reference-label="Fleet average"
          />
        </v-card>
      </v-col>

      <v-col cols="12" lg="5">
        <v-card class="pp-card-pad" height="100%">
          <h2 class="pp-card-title">Who's Available Now</h2>
          <p class="pp-card-subtitle">How many couriers are flying, resting, or grounded.</p>
          <ul class="status">
            <li v-for="s in courierStatusBreakdown" :key="s.status" class="status__row">
              <span class="status__dot" :class="`status__dot--${s.status.replace(' ', '-')}`" />
              <span class="status__label">{{ s.status }}</span>
              <span class="status__count">{{ s.count }}</span>
              <span class="status__share">{{ (s.share * 100).toFixed(0) }}%</span>
            </li>
          </ul>
        </v-card>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12">
        <v-card class="pp-card-pad">
          <h2 class="pp-card-title">Courier Roster</h2>
          <p class="pp-card-subtitle">Every courier in scope, with their home region and how they are performing.</p>
          <CourierRoster :couriers="filteredCouriers" />
        </v-card>
      </v-col>
    </v-row>
  </PageShell>
</template>

<style scoped>
.min-w-0 {
  min-width: 0;
}

.courier__avatar {
  background: rgba(var(--v-theme-primary), 0.12);
  flex: none;
}

.courier__avatar :deep(img) {
  object-fit: contain;
  padding: 3px;
}

.courier__name {
  font-size: 14px;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

.courier__species {
  font-size: 11.5px;
  color: rgb(var(--v-theme-muted));
  margin: 2px 0 0;
}

/* Same defect as the Overview tile — three adjacent numbers, 18px apart. */
.courier__stats {
  display: flex;
  gap: 26px;
  margin: 14px 0 12px;
}

.courier__stat dt {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgb(var(--v-theme-muted));
}

.courier__stat dd {
  font-size: 15px;
  font-weight: 700;
  margin: 2px 0 0;
  font-variant-numeric: tabular-nums;
}

.status {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Count and share are two separate numbers; at 20px "5" and "63%" blurred
   into "5 63%". The dot keeps its tight 10px tie to the label it belongs to. */
.status__row {
  display: grid;
  grid-template-columns: 9px minmax(0, 1fr) 34px 46px;
  align-items: center;
  column-gap: 10px;
  padding: 10px 0;
}

.status__row + .status__row {
  border-top: 1px solid rgba(var(--v-theme-muted), 0.16);
}

.status__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex: none;
}

.status__dot--On-Route {
  background: rgb(var(--v-theme-success));
}

.status__dot--Resting {
  background: rgb(var(--v-theme-secondary));
}

.status__dot--Grounded {
  background: rgb(var(--v-theme-error));
}

.status__label {
  font-size: 13px;
}

.status__count {
  font-size: 13px;
  font-weight: 700;
  text-align: right;
  /* pushes the count clear of the label AND the share clear of the count */
  margin-left: 18px;
  font-variant-numeric: tabular-nums;
}

.status__share {
  font-size: 12px;
  color: rgb(var(--v-theme-muted));
  min-width: 36px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
</style>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import { useDisplay, useTheme } from 'vuetify'
import { BRAND_FALLBACK_ICON, BRAND_SPRITE_URL } from '@/utils/sprites'
import { useMetrics } from '@/composables/useMetrics'

const theme = useTheme()
const isDark = computed(() => theme.global.name.value === 'pelipperDark')

function toggleTheme() {
  // theme.change(), not `theme.global.name.value = …` — the latter is deprecated
  // in Vuetify 3.13 and logs a warning on every toggle.
  theme.change(isDark.value ? 'pelipperLight' : 'pelipperDark')
}

// Filters live in the top bar now. Same module-level composable state, so the
// page and the bar are reading one source.
const { selectedMonth, selectedRegion, monthOptions, regionOptions } = useMetrics()

// Sidebar collapses to a rail below 960px — still permanent, never a hamburger.
const { width } = useDisplay()
const rail = computed(() => width.value < 960)

const brandSpriteFailed = ref(false)
const aboutOpen = ref(false)

/**
 * Anchor links, not routes. One route, one page — CLAUDE.md rule 6 stands.
 * These scroll to sections and highlight whichever is on screen.
 */
const NAV = [
  { id: 'overview', label: 'Overview', icon: 'mdi-view-dashboard-outline' },
  { id: 'trends', label: 'Trends', icon: 'mdi-chart-line' },
  { id: 'signals', label: 'Signals', icon: 'mdi-alert-circle-outline' },
  { id: 'couriers', label: 'Couriers', icon: 'mdi-account-group-outline' },
  { id: 'network', label: 'Network', icon: 'mdi-lan' },
] as const

const activeSection = ref<string>('overview')
let observer: IntersectionObserver | null = null

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  activeSection.value = id
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      // Pick the entry nearest the top of the viewport that is actually visible.
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible[0]?.target.id) activeSection.value = visible[0].target.id
    },
    // Top-weighted band: a section counts as "current" once it reaches the
    // upper third, which matches what a reader considers the active section.
    { rootMargin: '-72px 0px -62% 0px', threshold: 0 },
  )
  NAV.forEach((n) => {
    const el = document.getElementById(n.id)
    if (el) observer!.observe(el)
  })
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <v-app>
    <!-- Daylight sky. Light theme only. Decorative, so hidden from assistive tech. -->
    <div class="sky" :class="{ 'sky--visible': !isDark }" aria-hidden="true">
      <div class="sky__clouds sky__clouds--back" />
      <div class="sky__clouds sky__clouds--mid" />
      <div class="sky__clouds sky__clouds--front" />
    </div>

    <!-- ---------- left sidebar ---------- -->
    <v-navigation-drawer permanent :rail="rail" :width="220" class="sidebar" border="e">
      <div class="sidebar__brand">
        <img
          v-if="!brandSpriteFailed"
          :src="BRAND_SPRITE_URL"
          alt=""
          class="brand-sprite"
          width="34"
          height="34"
          @error="brandSpriteFailed = true"
        />
        <v-icon v-else :icon="BRAND_FALLBACK_ICON" color="primary" size="24" />
        <div v-if="!rail" class="sidebar__brand-text">
          <p class="sidebar__wordmark">Pelipper Post &amp; Freight</p>
          <p class="sidebar__subtitle">Executive Dashboard</p>
        </div>
      </div>

      <v-list density="compact" nav class="px-2">
        <v-list-item
          v-for="item in NAV"
          :key="item.id"
          :prepend-icon="item.icon"
          :title="item.label"
          :active="activeSection === item.id"
          color="primary"
          class="sidebar__item"
          @click="scrollTo(item.id)"
        />
      </v-list>

      <template #append>
        <v-list density="compact" nav class="px-2 pb-2">
          <v-list-item
            :prepend-icon="isDark ? 'mdi-weather-night' : 'mdi-white-balance-sunny'"
            :title="isDark ? 'Dark theme' : 'Light theme'"
            @click="toggleTheme"
          />
          <v-list-item
            prepend-icon="mdi-information-outline"
            title="About this data"
            @click="aboutOpen = true"
          />
        </v-list>
      </template>
    </v-navigation-drawer>

    <!-- ---------- top bar ---------- -->
    <v-app-bar :elevation="0" border="b" height="64" class="topbar">
      <div class="topbar__inner">
        <div class="topbar__titles">
          <h1 class="topbar__title">Pelipper Operations</h1>
          <p class="topbar__meta">Data through Sep 2026 · mock dataset</p>
        </div>

        <v-spacer />

        <div class="topbar__controls">
          <v-select
            v-model="selectedMonth"
            :items="monthOptions"
            label="Month"
            density="compact"
            hide-details
            variant="outlined"
            class="topbar__select"
          />
          <v-select
            v-model="selectedRegion"
            :items="regionOptions"
            label="Region"
            density="compact"
            hide-details
            variant="outlined"
            class="topbar__select"
          />
          <v-btn
            :icon="isDark ? 'mdi-weather-night' : 'mdi-white-balance-sunny'"
            variant="text"
            density="comfortable"
            color="muted"
            :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
            @click="toggleTheme"
          />
        </div>
      </div>
    </v-app-bar>

    <v-main class="above-sky">
      <RouterView />

      <v-container class="pelipper-width pt-0 pb-8 px-4">
        <p class="text-caption text-muted mb-0">
          Made with coffee and Claude Code · mock data, not a real carrier.
        </p>
      </v-container>
    </v-main>

    <!-- ---------- about this data ---------- -->
    <v-dialog v-model="aboutOpen" max-width="520">
      <v-card class="pa-6">
        <h2 class="pp-card-title mb-2">About this data</h2>
        <p class="text-body-2 mb-3">
          <strong>Every number in this dashboard is fabricated.</strong> Pelipper Post &amp; Freight
          does not exist — there is no real carrier, no real logistics network and no real courier
          roster behind any of it.
        </p>
        <p class="text-body-2 mb-3">
          The dataset is 72 generated records — twelve months across six regions — built to look
          like a plausible business, with seasonal peaks, a storm-season dip and distinct per-region
          behaviour, so the dashboard has something realistic to display.
        </p>
        <p class="text-body-2 text-muted mb-4">
          No client data, no employer data and no real people appear anywhere in this project.
          Pokémon sprites are hotlinked from the community PokeAPI CDN and are not redistributed
          here; Pokémon is a trademark of Nintendo / Creatures Inc. / GAME FREAK.
        </p>
        <v-btn color="primary" variant="flat" block @click="aboutOpen = false">Close</v-btn>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<style>
/* Global. The font stack (Vuetify defaults to Roboto, which we don't load) and
   the shared card treatment from BRIEF.md §4. */
.v-application {
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
}

.v-container.pelipper-width {
  /* two classes, so this beats v-container's own breakpoint maxima (1200px at
     lg) without needing !important */
  max-width: 1440px;
}

/* Card treatment: 12px radius, hairline border, very soft shadow — not heavy
   elevation. Two classes of specificity so it wins over Vuetify's own rule
   without needing !important. */
.v-application .v-card {
  border-radius: 12px;
  border: 1px solid rgba(var(--v-theme-muted), 0.22);
  box-shadow: 0 1px 2px rgba(15, 30, 45, 0.05), 0 1px 10px rgba(15, 30, 45, 0.04);
}

/* Card internals — 20px padding, 15px/600 title, 12px muted subtitle. */
.pp-card-pad {
  padding: 20px;
}

.pp-card-title {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
}

.pp-card-subtitle {
  font-size: 12px;
  line-height: 1.4;
  color: rgb(var(--v-theme-muted));
  margin: 2px 0 14px;
}

/* Pixel art must not be smoothed on scale-up. */
.brand-sprite {
  image-rendering: pixelated;
  object-fit: contain;
}
</style>

<style scoped>
/* ---------- daylight sky (light theme only) ---------- */
.sky {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(180deg, #cfe4f7 0%, #e3f0fa 45%, #f2f8fd 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sky--visible {
  opacity: 1;
}

.sky__clouds {
  position: absolute;
  inset: 0;
  background-repeat: repeat-x;
  animation-name: drift;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.sky__clouds--back {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='900' height='300'><g fill='%23ffffff'><ellipse cx='150' cy='80' rx='80' ry='26'/><ellipse cx='205' cy='66' rx='52' ry='28'/><ellipse cx='600' cy='190' rx='90' ry='28'/><ellipse cx='660' cy='176' rx='56' ry='30'/></g></svg>");
  background-size: 900px auto;
  background-position-y: 4%;
  opacity: 0.33;
  animation-duration: 210s;
}

.sky__clouds--mid {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='640' height='260'><g fill='%23ffffff'><ellipse cx='120' cy='150' rx='70' ry='24'/><ellipse cx='168' cy='138' rx='46' ry='26'/><ellipse cx='430' cy='60' rx='76' ry='24'/><ellipse cx='482' cy='50' rx='44' ry='24'/></g></svg>");
  background-size: 640px auto;
  background-position-y: 26%;
  opacity: 0.5;
  animation-duration: 135s;
  animation-name: drift-mid;
}

.sky__clouds--front {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='460' height='220'><g fill='%23ffffff'><ellipse cx='110' cy='70' rx='62' ry='22'/><ellipse cx='152' cy='60' rx='40' ry='24'/><ellipse cx='330' cy='160' rx='58' ry='20'/></g></svg>");
  background-size: 460px auto;
  background-position-y: 58%;
  opacity: 0.62;
  animation-duration: 90s;
  animation-name: drift-front;
}

@keyframes drift {
  from {
    background-position-x: 0;
  }
  to {
    background-position-x: -900px;
  }
}

@keyframes drift-mid {
  from {
    background-position-x: 0;
  }
  to {
    background-position-x: -640px;
  }
}

@keyframes drift-front {
  from {
    background-position-x: 0;
  }
  to {
    background-position-x: -460px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sky__clouds {
    animation: none;
  }
}

.above-sky {
  position: relative;
  z-index: 1;
}

/* ---------- sidebar ---------- */
.sidebar {
  z-index: 3;
}

.sidebar__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 14px 10px;
  min-height: 64px;
}

.sidebar__brand-text {
  min-width: 0;
}

.sidebar__wordmark {
  font-size: 12.5px;
  font-weight: 700;
  line-height: 1.25;
  margin: 0;
}

.sidebar__subtitle {
  font-size: 10.5px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgb(var(--v-theme-muted));
  margin: 1px 0 0;
}

.sidebar__item :deep(.v-list-item-title) {
  font-size: 13px;
}

/* ---------- top bar ---------- */
.topbar {
  z-index: 2;
}

.topbar__inner {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 16px;
  gap: 16px;
}

.topbar__title {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
}

.topbar__meta {
  font-size: 11.5px;
  color: rgb(var(--v-theme-muted));
  margin: 1px 0 0;
}

.topbar__controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.topbar__select {
  width: 165px;
}

@media (max-width: 700px) {
  .topbar__select {
    width: 128px;
  }

  .topbar__meta {
    display: none;
  }
}
</style>

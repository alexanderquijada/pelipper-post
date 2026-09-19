<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterView } from 'vue-router'
import { useTheme } from 'vuetify'
import { BRAND_FALLBACK_ICON, BRAND_SPRITE_URL } from '@/utils/sprites'

const theme = useTheme()

const isDark = computed(() => theme.global.name.value === 'pelipperDark')

function toggleTheme() {
  // theme.change(), not `theme.global.name.value = …` — the latter is deprecated
  // in Vuetify 3.13 and logs a warning on every toggle.
  theme.change(isDark.value ? 'pelipperLight' : 'pelipperDark')
}

// If the sprite CDN is unreachable, fall back to an icon rather than leaving a
// gap in the wordmark.
const brandSpriteFailed = ref(false)
</script>

<template>
  <v-app>
    <!-- Daylight sky. Light theme only; hidden entirely in dark. Purely
         decorative, so it is hidden from assistive tech. -->
    <div class="sky" :class="{ 'sky--visible': !isDark }" aria-hidden="true">
      <div class="sky__clouds sky__clouds--back" />
      <div class="sky__clouds sky__clouds--mid" />
      <div class="sky__clouds sky__clouds--front" />
    </div>

    <!-- 1. App bar -->
    <v-app-bar :elevation="0" border="b" height="72" class="app-bar">
      <v-container class="pelipper-width d-flex align-center py-0">
        <img
          v-if="!brandSpriteFailed"
          :src="BRAND_SPRITE_URL"
          alt=""
          class="brand-sprite mr-2"
          width="44"
          height="44"
          @error="brandSpriteFailed = true"
        />
        <v-icon v-else :icon="BRAND_FALLBACK_ICON" color="primary" size="30" class="mr-3" />

        <div>
          <h1 class="text-h6 font-weight-bold">Pelipper Post &amp; Freight</h1>
          <p class="text-caption text-muted mb-0">Your package, airborne.</p>
        </div>

        <v-spacer />

        <v-btn
          :icon="isDark ? 'mdi-weather-night' : 'mdi-white-balance-sunny'"
          variant="text"
          color="muted"
          :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
          @click="toggleTheme"
        />
      </v-container>
    </v-app-bar>

    <v-main class="above-sky">
      <RouterView />

      <!-- 8. Footer -->
      <v-container class="pelipper-width pt-0 pb-10">
        <p class="text-caption text-muted mb-0">
          Made with coffee and Claude Code · mock data, not a real carrier.
        </p>
      </v-container>
    </v-main>
  </v-app>
</template>

<style>
/* Global. Two rules Vuetify does not give us:
   1. the brief's font stack (Vuetify defaults to Roboto, which we don't load)
   2. the ~1400px centred max width (v-container's own breakpoint maxima are
      1185px at lg / 1785px at xl — neither is what BRIEF.md §4 asks for) */
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

.pelipper-width {
  max-width: 1400px;
}

/* Pixel art: 30x30 and 96x96 sprites must not be smoothed on scale-up. */
.pixel-sprite,
.brand-sprite {
  image-rendering: pixelated;
}
</style>

<style scoped>
/* ---------- daylight sky (light theme only) ---------- */

.sky {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  /* Deeper at the top, paler toward the horizon — BRIEF.md §6. */
  background: linear-gradient(180deg, #cfe4f7 0%, #e3f0fa 45%, #f2f8fd 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* The sky belongs to the light theme. Dark keeps its flat background.
   Bound from the template rather than matched off the theme class, so it does
   not depend on how scoped CSS rewrites a :global() selector. */
.sky--visible {
  opacity: 1;
}

.sky__clouds {
  position: absolute;
  inset: 0;
  background-repeat: repeat-x;
  /* Animating background-position-x tiles seamlessly at any viewport width. */
  animation-name: drift;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

/* Three layers at different speeds — the speed difference is what reads as
   depth. Slowest sits furthest back and faintest. */
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
}

.sky__clouds--front {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='460' height='220'><g fill='%23ffffff'><ellipse cx='110' cy='70' rx='62' ry='22'/><ellipse cx='152' cy='60' rx='40' ry='24'/><ellipse cx='330' cy='160' rx='58' ry='20'/></g></svg>");
  background-size: 460px auto;
  background-position-y: 58%;
  opacity: 0.62;
  animation-duration: 90s;
}

@keyframes drift {
  from {
    background-position-x: 0;
  }
  to {
    background-position-x: -900px;
  }
}

.sky__clouds--mid {
  animation-name: drift-mid;
}

.sky__clouds--front {
  animation-name: drift-front;
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

/* Stop the drift, keep the artwork — BRIEF.md §6. */
@media (prefers-reduced-motion: reduce) {
  .sky__clouds {
    animation: none;
  }
}

/* Content sits above the sky; cards stay fully opaque so no cloud ever passes
   behind text or a chart. */
.above-sky {
  position: relative;
  z-index: 1;
}

.app-bar {
  z-index: 2;
}

.brand-sprite {
  display: block;
  width: 44px;
  height: 44px;
  object-fit: contain;
}
</style>

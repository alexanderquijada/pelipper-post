<script setup lang="ts">
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { useTheme } from 'vuetify'

const theme = useTheme()

const isDark = computed(() => theme.global.name.value === 'pelipperDark')

function toggleTheme() {
  theme.global.name.value = isDark.value ? 'pelipperLight' : 'pelipperDark'
}
</script>

<template>
  <v-app>
    <!-- 1. App bar -->
    <v-app-bar :elevation="0" border="b" height="72">
      <v-container class="pelipper-width d-flex align-center py-0">
        <v-icon icon="mdi-mail" color="primary" size="30" class="mr-3" />

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

    <v-main>
      <RouterView />

      <!-- 7. Footer -->
      <v-container class="pelipper-width pt-0 pb-10">
        <p class="text-caption text-muted mb-0">
          Made with coffee and Claude Code · mock data, not a real carrier.
        </p>
      </v-container>
    </v-main>
  </v-app>
</template>

<style>
/* Global. Two rules, both things Vuetify does not give us:
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
</style>

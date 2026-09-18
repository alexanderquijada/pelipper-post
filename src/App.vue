<script setup lang="ts">
import { RouterView } from 'vue-router'

// Phase 3 replaces this shell with Vuetify's <v-app> / <v-app-bar>.
</script>

<template>
  <div class="app">
    <!-- 1. App bar -->
    <header class="app-bar">
      <div class="app-bar__inner">
        <div class="brand">
          <span class="brand__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path
                d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,5.89 21.1,4 20,4Z"
              />
            </svg>
          </span>
          <div>
            <h1 class="brand__wordmark">Pelipper Post &amp; Freight</h1>
            <p class="brand__tagline">Your package, airborne.</p>
          </div>
        </div>

        <!-- inert until Phase 3 wires it to the Vuetify theme -->
        <button class="theme-toggle" type="button" title="Theme toggle — wired up in Phase 3">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95Z"
            />
          </svg>
          <span class="sr-only">Toggle theme</span>
        </button>
      </div>
    </header>

    <RouterView />

    <!-- 7. Footer -->
    <footer class="footer">
      <p>Made with coffee and Claude Code · mock data, not a real carrier.</p>
    </footer>
  </div>
</template>

<style>
/* Global, deliberately unscoped: palette tokens + a minimal reset.
   Phase 3 moves these values into a registered Vuetify theme (pelipperDark /
   pelipperLight). Kept small on purpose so there is little to fight later. */
:root {
  --background: #0e1621;
  --surface: #16202e;
  --primary: #4fa3d1;
  --secondary: #7fd1e8;
  --accent: #f2a65a;
  --success: #5fbf8f;
  --error: #e8705a;
  --on-surface: #e6edf3;
  --muted: #8fa3b8;

  --hairline: rgba(143, 163, 184, 0.16);
  --radius-lg: 12px;
  --card-padding: 24px;
  --gap: 20px;
  --max-width: 1400px;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--background);
  color: var(--on-surface);
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 15px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}
</style>

<style scoped>
.app-bar {
  background: var(--surface);
  border-bottom: 1px solid var(--hairline);
}

.app-bar__inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 16px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand__icon svg {
  width: 30px;
  height: 30px;
  display: block;
  fill: var(--primary);
}

.brand__wordmark {
  margin: 0;
  font-size: 19px;
  font-weight: 600;
  letter-spacing: 0.2px;
}

.brand__tagline {
  margin: 1px 0 0;
  font-size: 12.5px;
  color: var(--muted);
}

.theme-toggle {
  background: transparent;
  border: 1px solid var(--hairline);
  border-radius: 999px;
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  cursor: pointer;
  color: var(--muted);
}

.theme-toggle svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.theme-toggle:hover {
  color: var(--on-surface);
  border-color: rgba(143, 163, 184, 0.34);
}

.footer {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 12px 40px 40px;
  font-size: 12.5px;
  color: var(--muted);
}

.footer p {
  margin: 0;
}

@media (max-width: 700px) {
  .app-bar__inner,
  .footer {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { BRAND_SPRITE_URL } from '@/utils/sprites'

/**
 * Decorative only. No click behaviour, not wired to the filters — it does not
 * change when Month or Region changes. BRIEF.md §4 item 6.
 *
 * The layout is INVENTED. These coordinates are an abstract route diagram for a
 * made-up carrier; they deliberately do not reproduce, trace or approximate the
 * official Pokémon region maps or their geography.
 */
const NODES = [
  { region: 'Kanto', x: 120, y: 112, anchor: 'start' },
  { region: 'Johto', x: 305, y: 58, anchor: 'middle' },
  { region: 'Hoenn', x: 486, y: 150, anchor: 'middle' },
  { region: 'Sinnoh', x: 664, y: 66, anchor: 'middle' },
  { region: 'Unova', x: 862, y: 140, anchor: 'end' },
  { region: 'Galar', x: 470, y: 256, anchor: 'middle' },
] as const

/** The main trunk route. The Pelipper flies this path, so it also drives the motion. */
const TRUNK =
  'M120,112 Q212,42 305,58 Q400,76 486,150 Q572,62 664,66 Q766,70 862,140'

/** Secondary arcs to Galar — drawn, but not flown. */
const SPURS = ['M120,112 Q286,242 470,256', 'M470,256 Q676,244 862,140', 'M486,150 Q478,204 470,256']

// SMIL <animateMotion> can't be switched off from a CSS media query, so the
// reduced-motion preference is read here and the animation simply isn't rendered.
const reduceMotion = ref(false)
let mq: MediaQueryList | null = null
const sync = (e: MediaQueryListEvent | MediaQueryList) => {
  reduceMotion.value = e.matches
}

onMounted(() => {
  mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  sync(mq)
  mq.addEventListener('change', sync)
})

onBeforeUnmount(() => mq?.removeEventListener('change', sync))

const spriteFailed = ref(false)
const PARKED = NODES[0]
</script>

<template>
  <v-card class="pa-6">
    <h2 class="text-subtitle-1 font-weight-bold mb-1">Delivery Network</h2>
    <p class="text-caption text-muted mb-4">
      Six regions, one flight plan. Illustrative — this map is invented, and does not respond to the
      filters.
    </p>

    <svg
      class="network"
      viewBox="0 0 1000 300"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Stylised diagram of the six-region delivery network: Kanto, Johto, Hoenn, Sinnoh, Unova and Galar, joined by flight paths."
    >
      <!-- dashed arc flight paths, low opacity so they recede behind the nodes -->
      <g class="network__paths" fill="none" stroke-linecap="round">
        <path v-for="(d, i) in SPURS" :key="`spur-${i}`" :d="d" class="network__arc" />
        <path :d="TRUNK" class="network__arc network__arc--trunk" />
      </g>

      <!-- region nodes -->
      <g class="network__nodes">
        <g v-for="node in NODES" :key="node.region">
          <circle :cx="node.x" :cy="node.y" r="9" class="network__halo" />
          <circle :cx="node.x" :cy="node.y" r="4.5" class="network__dot" />
          <text
            :x="node.x"
            :y="node.y - 18"
            :text-anchor="node.anchor"
            class="network__label"
          >
            {{ node.region }}
          </text>
        </g>
      </g>

      <!-- the courier -->
      <image
        v-if="!spriteFailed"
        :href="BRAND_SPRITE_URL"
        width="48"
        height="48"
        :x="reduceMotion ? PARKED.x - 24 : -24"
        :y="reduceMotion ? PARKED.y - 34 : -24"
        class="network__pelipper"
        @error="spriteFailed = true"
      >
        <!-- Rendered only when motion is allowed; otherwise the sprite is parked
             at a node above and the diagram still reads as complete. -->
        <animateMotion
          v-if="!reduceMotion"
          :path="TRUNK"
          dur="26s"
          repeatCount="indefinite"
          rotate="0"
          keyPoints="0;1;0"
          keyTimes="0;0.5;1"
          calcMode="linear"
        />
      </image>
    </svg>
  </v-card>
</template>

<style scoped>
.network {
  display: block;
  width: 100%;
  height: auto;
  max-height: 300px;
  overflow: visible;
}

/* Colours come from the active Vuetify theme, so this card restyles with the
   toggle and introduces no new palette. */
.network__arc {
  stroke: rgba(var(--v-theme-primary), 0.35);
  stroke-width: 1.5;
  stroke-dasharray: 6 7;
}

.network__arc--trunk {
  stroke: rgba(var(--v-theme-primary), 0.55);
  stroke-width: 2;
}

.network__halo {
  fill: rgba(var(--v-theme-primary), 0.16);
}

.network__dot {
  fill: rgb(var(--v-theme-primary));
}

.network__label {
  fill: rgb(var(--v-theme-muted));
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.4px;
}

.network__pelipper {
  image-rendering: pixelated;
}
</style>

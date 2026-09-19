<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useTheme } from 'vuetify'
// ?raw so the SVG is INLINED into the DOM. An <img> would be an isolated
// document — neither the --ppmap-* variables nor the flight animation could
// reach inside it. BRIEF.md §4 item 6.
import mapMarkup from '@/assets/delivery-map.svg?raw'
import { BRAND_SPRITE_URL } from '@/utils/sprites'

/** One full lap of the delivery loop. Brief asks for 40–60s. */
const FLIGHT_DURATION = 52

// Bound from the template rather than matched off the theme class in scoped
// CSS: a scoped `:global(.v-theme--pelipperDark) .pp-map` selector silently
// fails to match, which left the dark palette inert on the first attempt.
const theme = useTheme()
const isDark = computed(() => theme.global.name.value === 'pelipperDark')

const host = ref<HTMLDivElement | null>(null)

/**
 * SMIL and CSS animations can't both be switched off by a media query — SMIL
 * ignores it entirely — so the preference is read here and drives both.
 */
const reduceMotion = ref(false)
let mq: MediaQueryList | null = null

function buildCourier(svg: SVGSVGElement, parked: boolean) {
  const NS = 'http://www.w3.org/2000/svg'
  svg.querySelector('#pp-courier')?.remove()

  const route = svg.querySelector<SVGPathElement>('#pp-flight-route')
  if (!route) return

  // Outer <g> carries the motion; the inner <image> carries the horizontal
  // flip. Keeping them on separate elements means the two transforms don't
  // fight over the same attribute.
  const g = document.createElementNS(NS, 'g')
  g.setAttribute('id', 'pp-courier')

  const img = document.createElementNS(NS, 'image')
  img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', BRAND_SPRITE_URL)
  img.setAttribute('href', BRAND_SPRITE_URL)
  // Centred on the origin, so scale(-1,1) mirrors it in place rather than
  // shifting it sideways.
  img.setAttribute('x', '-34')
  img.setAttribute('y', '-34')
  img.setAttribute('width', '68')
  img.setAttribute('height', '68')
  img.setAttribute('class', 'pp-courier__sprite')
  g.appendChild(img)

  if (parked) {
    // Park at the first hub — the start of the loop, which is Kanto.
    const start = route.getPointAtLength(0)
    g.setAttribute('transform', `translate(${start.x}, ${start.y})`)
  } else {
    const motion = document.createElementNS(NS, 'animateMotion')
    motion.setAttribute('dur', `${FLIGHT_DURATION}s`)
    motion.setAttribute('repeatCount', 'indefinite')
    motion.setAttribute('rotate', '0')
    motion.setAttribute('calcMode', 'linear')
    // Reference the existing path rather than duplicating its data, so the two
    // can never drift apart.
    const mpath = document.createElementNS(NS, 'mpath')
    mpath.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#pp-flight-route')
    mpath.setAttribute('href', '#pp-flight-route')
    motion.appendChild(mpath)
    g.appendChild(motion)

    // Flip on the legs that travel right-to-left, measured from the real path
    // rather than guessed from the leg list.
    const flip = buildFlipAnimation(route)
    if (flip) img.appendChild(flip)
  }

  svg.appendChild(g)
}

/**
 * Samples the route to find where it actually reverses direction, and emits a
 * keyTimes/values pair that mirrors the sprite over exactly those stretches.
 */
function buildFlipAnimation(route: SVGPathElement): SVGElement | null {
  const NS = 'http://www.w3.org/2000/svg'
  const total = route.getTotalLength()
  const SAMPLES = 240

  const facingLeft: boolean[] = []
  let prev = route.getPointAtLength(0)
  for (let i = 1; i <= SAMPLES; i++) {
    const p = route.getPointAtLength((i / SAMPLES) * total)
    facingLeft.push(p.x < prev.x)
    prev = p
  }

  // Collapse the samples into runs and emit a step at each direction change.
  // Must be <animateTransform> with numeric "sx sy" values — <animate> with
  // type="scale" is silently ignored, which left the sprite unflipped.
  const times: number[] = [0]
  const values: string[] = [facingLeft[0] ? '-1 1' : '1 1']
  for (let i = 1; i < facingLeft.length; i++) {
    if (facingLeft[i] !== facingLeft[i - 1]) {
      times.push(i / SAMPLES)
      values.push(facingLeft[i] ? '-1 1' : '1 1')
    }
  }
  if (times.length < 2) return null
  times.push(1)
  values.push(values[values.length - 1]!)

  const anim = document.createElementNS(NS, 'animateTransform')
  anim.setAttribute('attributeName', 'transform')
  anim.setAttribute('attributeType', 'XML')
  anim.setAttribute('type', 'scale')
  anim.setAttribute('dur', `${FLIGHT_DURATION}s`)
  anim.setAttribute('repeatCount', 'indefinite')
  // discrete => the mirror snaps rather than squashing through zero width
  anim.setAttribute('calcMode', 'discrete')
  anim.setAttribute('keyTimes', times.join(';'))
  anim.setAttribute('values', values.join(';'))
  return anim
}

/**
 * Each waypoint pulses once per lap, at the moment the courier is nearest it.
 * One animation per marker on a shared 52s timeline, offset by a negative delay
 * — not 30 independent loops.
 */
function scheduleWaypointPulses(svg: SVGSVGElement, parked: boolean) {
  const waypoints = svg.querySelectorAll<SVGRectElement>('.pp-wp')
  if (parked) {
    waypoints.forEach((wp) => wp.style.removeProperty('animation-delay'))
    return
  }

  const route = svg.querySelector<SVGPathElement>('#pp-flight-route')
  if (!route) return

  const total = route.getTotalLength()
  const SAMPLES = 400
  const samples = Array.from({ length: SAMPLES }, (_, i) => {
    const p = route.getPointAtLength((i / SAMPLES) * total)
    return { x: p.x, y: p.y, t: i / SAMPLES }
  })

  waypoints.forEach((wp) => {
    const cx = Number(wp.getAttribute('x')) + Number(wp.getAttribute('width')) / 2
    const cy = Number(wp.getAttribute('y')) + Number(wp.getAttribute('height')) / 2
    let best = samples[0]!
    let bestDist = Infinity
    for (const s of samples) {
      const d = (s.x - cx) ** 2 + (s.y - cy) ** 2
      if (d < bestDist) {
        bestDist = d
        best = s
      }
    }
    // Negative delay starts each marker part-way through the shared cycle.
    wp.style.animationDelay = `${-(best.t * FLIGHT_DURATION).toFixed(2)}s`
  })
}

function render() {
  const svg = host.value?.querySelector('svg')
  if (!svg) return
  svg.classList.add('pp-map__svg')
  buildCourier(svg as SVGSVGElement, reduceMotion.value)
  scheduleWaypointPulses(svg as SVGSVGElement, reduceMotion.value)
}

const sync = (e: MediaQueryListEvent | MediaQueryList) => {
  reduceMotion.value = e.matches
  render()
}

onMounted(() => {
  mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduceMotion.value = mq.matches
  mq.addEventListener('change', sync)
  render()
})

onBeforeUnmount(() => mq?.removeEventListener('change', sync))
</script>

<template>
  <v-card class="pa-0 overflow-hidden">
    <div class="pa-6 pb-4">
      <h2 class="text-subtitle-1 font-weight-bold mb-1">Delivery Network</h2>
      <p class="text-caption text-muted mb-0">
        Six regions, one flight plan. Illustrative — this world is invented, and the map does not
        respond to the filters.
      </p>
    </div>

    <!-- Full bleed: no padding inset, fixed aspect ratio so it never letterboxes. -->
    <div
      ref="host"
      class="pp-map"
      :class="{ 'pp-map--still': reduceMotion, 'pp-map--dark': isDark }"
      v-html="mapMarkup"
    />
  </v-card>
</template>

<style scoped>
.pp-map {
  position: relative;
  width: 100%;
  /* matches the artwork's 1600x1000 viewBox */
  aspect-ratio: 16 / 10;
  overflow: hidden;
  line-height: 0;

  /* ---- light theme (the SVG's own fallbacks, stated here so both themes
     live side by side and stay in sync) ---- */
  --ppmap-sea-1: #86c9e2;
  --ppmap-sea-2: #4e9fcb;
  --ppmap-land: #8fd08a;
  --ppmap-inland: #7cc177;
  --ppmap-highland: #b9a97e;
  --ppmap-route: #f0a055;
  --ppmap-stop: #e2574c;
  --ppmap-stop-edge: #ffffff;
  --ppmap-hub: #e2574c;
  --ppmap-label: #16202e;
  --ppmap-label-halo: #ffffff;
  --ppmap-wave: #ffffff;
  --ppmap-shore: #eaf7fb;
}

.pp-map :deep(.pp-map__svg) {
  display: block;
  width: 100%;
  height: 100%;
}

/* ---- dark theme: deeper ocean, muted land, and a dark halo behind light
   label text so the labels stay legible against the darker fills ---- */
.pp-map--dark {
  --ppmap-sea-1: #16394f;
  --ppmap-sea-2: #0d2334;
  --ppmap-land: #3f6b4a;
  --ppmap-inland: #355c40;
  --ppmap-highland: #5c5340;
  --ppmap-route: #c97f3d;
  --ppmap-stop: #c2534a;
  --ppmap-stop-edge: #16202e;
  --ppmap-hub: #d4645a;
  --ppmap-label: #e6edf3;
  --ppmap-label-halo: #0e1621;
  --ppmap-wave: #9fd4ea;
  --ppmap-shore: #0a1a26;
}

/* ---- courier ---- */
.pp-map :deep(.pp-courier__sprite) {
  image-rendering: pixelated;
}

/* ---- waypoint pulse: one cycle per lap, staggered by a negative delay set
   in script from each marker's position along the route ---- */
.pp-map :deep(.pp-wp) {
  transform-box: fill-box;
  transform-origin: center;
  animation-name: pp-wp-pulse;
  animation-duration: 52s;
  animation-timing-function: ease-out;
  animation-iteration-count: infinite;
}

@keyframes pp-wp-pulse {
  0% {
    transform: scale(1);
    opacity: 0.9;
  }
  1.5% {
    transform: scale(1.9);
    opacity: 1;
  }
  6% {
    transform: scale(1);
    opacity: 0.9;
  }
  100% {
    transform: scale(1);
    opacity: 0.9;
  }
}

/* ---- waves: a slow bob, targeted by attribute since they carry no class ---- */
.pp-map :deep(path[stroke*='ppmap-wave']) {
  animation: pp-wave-bob 7s ease-in-out infinite alternate;
}

@keyframes pp-wave-bob {
  from {
    transform: translateY(0);
    opacity: 0.75;
  }
  to {
    transform: translateY(-2.5px);
    opacity: 1;
  }
}

/* ---- reduced motion: no flight, no pulses, no waves. The sprite is parked at
   a hub in script; everything below stops the CSS side. The map must still read
   as a finished illustration with nothing moving. ---- */
.pp-map--still :deep(.pp-wp),
.pp-map--still :deep(path[stroke*='ppmap-wave']) {
  animation: none;
}

@media (prefers-reduced-motion: reduce) {
  .pp-map :deep(.pp-wp),
  .pp-map :deep(path[stroke*='ppmap-wave']) {
    animation: none;
  }
}
</style>

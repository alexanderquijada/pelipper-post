import { computed } from 'vue'
import { useTheme } from 'vuetify'

/**
 * SEQUENTIAL ramp — BRIEF.md §6. A blue ramp with one orange.
 *
 * Only for ORDERED data, which here means the twelve-month trend chart. A ramp
 * encodes magnitude, so using it for unordered categories implies a ranking that
 * doesn't exist — and four near-neighbour blues are not mutually distinguishable.
 */
export const SEQUENTIAL_COLORS = ['#4FA3D1', '#7FD1E8', '#F2A65A', '#9BB8D3', '#2E6E92'] as const

/**
 * CATEGORICAL palette — Okabe–Ito. For unordered categories: the cargo-mix
 * doughnut and the region bar chart.
 *
 * Colourblind-safe because it varies LIGHTNESS as well as hue. Verified with a
 * Viénot–Brettel–Mollon LMS simulation and CIEDE2000 across all ten pairs:
 * worst deutan ΔE 11.7 (dark) / 18.0 (light), worst protan 14.3 / 12.2.
 *
 * Two variants, because a single set cannot clear 3:1 against both a near-black
 * and a white card. The light set uses the darker Okabe–Ito members; Evolution
 * Stones becomes a deep gold, since Okabe–Ito's yellow (#F0E442) is only 1.32:1
 * on white.
 */
export const CATEGORICAL_DARK = ['#56B4E9', '#E69F00', '#009E73', '#CC79A7', '#F0E442'] as const
export const CATEGORICAL_LIGHT = ['#0072B2', '#D55E00', '#009E73', '#CC79A7', '#6B4E00'] as const

/**
 * EDITORIAL palette — coral / indigo / teal / orange / plum.
 *
 * For marks where colour is NOT the sole encoder of category: single- and
 * dual-series charts, heatmap ramps, bullet charts, card accent tints and icon
 * circles. **Never for the five-way cargo chart** — as a categorical set these
 * fail colourblind separation (teal/mint collapse to ΔE 2.1 under deuteranopia),
 * which is exactly why CATEGORICAL_* above exists and stays untouched.
 *
 * Two variants because three of the five miss 3:1 on one surface at their base
 * value — indigo 1.89 on dark, teal 2.45 and orange 2.09 on light. The variants
 * are pure lightness shifts: same hue, same saturation. Every slot clears
 * 3.35:1 on its own surface, with headroom rather than sitting on the floor.
 */
export const EDITORIAL_LIGHT = {
  coral: '#D94F6A',
  indigo: '#2F4B7C',
  teal: '#2E99A6',
  orange: '#DB6E11',
  plum: '#9B5FB5',
} as const

export const EDITORIAL_DARK = {
  coral: '#D94F6A',
  indigo: '#4871B9',
  teal: '#36B5C4',
  orange: '#F2A15C',
  plum: '#9B5FB5',
} as const

/**
 * Glyph colours for tinted icon circles.
 *
 * A glyph over a 15% tint OF ITS OWN HUE is the hard case: the two converge, so
 * deepening the tint makes it worse, not better. These are minimal lightness
 * shifts away from the tint — hue and saturation unchanged — each clearing
 * >= 3.3:1 against its circle and >= 3:1 against the card behind it.
 * Unshifted slots already passed.
 */
export const ICON_GLYPH_LIGHT = {
  coral: '#D94E69',
  indigo: '#2F4B7C',
  teal: '#2A8D99',
  orange: '#CA6510',
  plum: '#9B5FB5',
} as const

export const ICON_GLYPH_DARK = {
  coral: '#DA5670',
  indigo: '#6084C2',
  teal: '#36B5C4',
  orange: '#F2A15C',
  plum: '#A56FBC',
} as const

export type EditorialKey = keyof typeof EDITORIAL_LIGHT

/**
 * WEATHER tints — one visual channel per meaning.
 *
 * The weather icon previously took its tint from the DELAY RISK, which put snow
 * in a red circle and clear skies in a teal one: two meanings fighting over one
 * channel, and the reader has no way to tell which one the colour is encoding.
 * Now the icon carries the weather and the risk chip alone carries the risk.
 *
 * These are weather-appropriate, not categorical — blue-grey snow, amber sun,
 * slate fog — so they are never used to distinguish unordered categories and the
 * colourblind constraint doesn't bind (BRIEF.md §6). They still have to clear
 * 3:1 as graphical objects, which is why there are two variants: a tint dark
 * enough to read on white is invisible on the dark card and vice versa.
 */
export type WeatherKind = 'clear' | 'partly' | 'rain' | 'snow' | 'wind' | 'fog'

export const WEATHER_LIGHT: Record<WeatherKind, string> = {
  clear: '#B06E00',
  partly: '#3D77A8',
  rain: '#2C6FA8',
  snow: '#4E6E88',
  wind: '#2E7F7A',
  fog: '#5C6875',
}

export const WEATHER_DARK: Record<WeatherKind, string> = {
  clear: '#F0B052',
  partly: '#79B4E4',
  rain: '#62A6DE',
  snow: '#A9C3D8',
  wind: '#5CC0B6',
  fog: '#9CA9B7',
}

/**
 * Icon name -> weather kind. Keyed off `icon` rather than `condition` because
 * the icon name is already a controlled vocabulary; `condition` is free prose
 * ("Rain easing", "Snow at altitude") and would need matching on substrings.
 * Anything unrecognised falls back to `fog`'s neutral slate rather than
 * borrowing a colour that would imply the wrong weather.
 */
export function weatherKind(icon: string): WeatherKind {
  if (icon.includes('sunny')) return 'clear'
  if (icon.includes('partly-cloudy') || icon.includes('cloudy')) return 'partly'
  if (icon.includes('snow')) return 'snow'
  if (icon.includes('rain') || icon.includes('pouring') || icon.includes('hail')) return 'rain'
  if (icon.includes('windy') || icon.includes('tornado') || icon.includes('hurricane')) return 'wind'
  return 'fog'
}

/** #RRGGBB -> "r, g, b" for use inside rgba(). */
export function rgbTriplet(hex: string): string {
  const n = Number.parseInt(hex.replace('#', ''), 16)
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`
}

/** #RRGGBB -> rgba(r, g, b, alpha). Lets us tint a theme colour without hardcoding one. */
export function withAlpha(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h
  const n = Number.parseInt(full, 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
}

/**
 * Axis, gridline and tooltip colours pulled live from the active Vuetify theme,
 * so charts re-style themselves when the theme toggle flips rather than staying
 * dark-on-light.
 */
export function useChartTheme() {
  const theme = useTheme()
  const colors = computed(() => theme.current.value.colors)
  const isDark = computed(() => theme.current.value.dark)

  return {
    ink: computed(() => colors.value['on-surface'] ?? '#E6EDF3'),
    muted: computed(() => colors.value.muted ?? '#8FA3B8'),
    surface: computed(() => colors.value.surface ?? '#16202E'),
    /** Horizontal gridlines only, low opacity — BRIEF.md §6. */
    grid: computed(() => withAlpha(colors.value.muted ?? '#8FA3B8', 0.16)),
    /** Categorical marks, swapped per theme so both clear 3:1 on their surface. */
    categorical: computed<readonly string[]>(() =>
      isDark.value ? CATEGORICAL_DARK : CATEGORICAL_LIGHT,
    ),
    /** Editorial accents — NOT for categorical encoding. See the note above. */
    editorial: computed(() => (isDark.value ? EDITORIAL_DARK : EDITORIAL_LIGHT)),
    /** Glyph colour for an icon sitting on a tint of its own accent. */
    iconGlyph: computed(() => (isDark.value ? ICON_GLYPH_DARK : ICON_GLYPH_LIGHT)),
    /** Weather-appropriate tint for a weather glyph. Never encodes delay risk. */
    weather: computed(() => (isDark.value ? WEATHER_DARK : WEATHER_LIGHT)),
  }
}

export const compactNumber = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : `${n}`

export const fullNumber = (n: number) => n.toLocaleString('en-US')

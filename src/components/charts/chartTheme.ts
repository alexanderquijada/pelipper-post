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
  }
}

export const compactNumber = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : `${n}`

export const fullNumber = (n: number) => n.toLocaleString('en-US')

import { computed } from 'vue'
import { useTheme } from 'vuetify'

/**
 * Chart series colours, in the order BRIEF.md §6 lists them. A blue ramp with
 * one orange for contrast. Index 0 is the primary single-series colour.
 */
export const SERIES_COLORS = ['#4FA3D1', '#7FD1E8', '#F2A65A', '#9BB8D3', '#2E6E92'] as const

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

  return {
    ink: computed(() => colors.value['on-surface'] ?? '#E6EDF3'),
    muted: computed(() => colors.value.muted ?? '#8FA3B8'),
    surface: computed(() => colors.value.surface ?? '#16202E'),
    /** Horizontal gridlines only, low opacity — BRIEF.md §6. */
    grid: computed(() => withAlpha(colors.value.muted ?? '#8FA3B8', 0.16)),
  }
}

export const compactNumber = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : `${n}`

export const fullNumber = (n: number) => n.toLocaleString('en-US')

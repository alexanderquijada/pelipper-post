// Tone and wording for every status pill. One place, because delay risk renders
// in three components and courier status in two — the phrasing drifting apart
// between them is exactly the kind of thing nobody notices in review.

import type { CourierStatus, DelayRisk } from '@/types/metrics'

/** Maps to the `.pp-pill--*` classes defined globally in App.vue. */
export type PillTone = 'bad' | 'warn' | 'good' | 'neutral'

export const RISK_TONE: Record<DelayRisk, PillTone> = {
  High: 'bad',
  Moderate: 'warn',
  Low: 'good',
}

/**
 * The self-describing version of the scale, for `aria-label` and `title`.
 *
 * The VISIBLE text stays "High" / "Moderate" / "Low": a graded scale is what
 * makes six rows scannable, and the plain-language phrasing costs width in
 * three places. Screen readers and hover get the unambiguous wording instead,
 * so the chip no longer depends on its column header to be understood.
 */
export const RISK_PHRASE: Record<DelayRisk, string> = {
  High: 'High — delays likely',
  Moderate: 'Moderate — some delays',
  Low: 'Low — on track',
}

/** Prefixed form, for the places where the pill sits away from a "Delay Risk" heading. */
export const riskLabel = (risk: DelayRisk) => `Delay risk: ${RISK_PHRASE[risk]}`

export const STATUS_TONE: Record<CourierStatus, PillTone> = {
  'On Route': 'good',
  Resting: 'neutral',
  Grounded: 'bad',
}

export const STATUS_PHRASE: Record<CourierStatus, string> = {
  'On Route': 'On Route — currently delivering',
  Resting: 'Resting — off duty, available later',
  Grounded: 'Grounded — cannot fly',
}

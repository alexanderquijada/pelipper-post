/**
 * Types for src/data/metrics.json — the shape is defined in BRIEF.md §2 and
 * enforced at runtime by scripts/validate-data.mjs.
 *
 * All data is fabricated. See §9 of PELIPPER-POST-STATUS.md.
 *
 * ---------------------------------------------------------------------------
 * IMPORTING THE JSON (Phase 6, read this first)
 *
 * TypeScript widens every string in an imported .json to `string`, so a raw
 * import is NOT directly assignable to MetricsDataset — `regions` arrives as
 * `string[]`, not `RegionName[]`. That is a TypeScript limitation, not a
 * mismatch in the data. Assert once, at the single import site:
 *
 *     import raw from '@/data/metrics.json'
 *     import type { MetricsDataset } from '@/types/metrics'
 *     const metrics = raw as MetricsDataset
 *
 * The alternative — typing these fields as plain `string` — was rejected: it
 * would remove autocomplete and exhaustiveness checking everywhere downstream
 * to avoid one assertion in one file. The assertion is safe because
 * `scripts/validate-data.mjs` checks the region names, cargo-type keys and
 * courier statuses against the brief at build time.
 * ---------------------------------------------------------------------------
 */

/** The six regions, in the order the brief lists them. */
export type RegionName = 'Kanto' | 'Johto' | 'Hoenn' | 'Sinnoh' | 'Unova' | 'Galar'

/** The five cargo types. These strings are also the keys of `cargoMix`. */
export type CargoType = 'Poké Balls' | 'Berries' | 'Potions' | 'TMs' | 'Evolution Stones'

/** A courier is in exactly one of these states. */
export type CourierStatus = 'On Route' | 'Resting' | 'Grounded'

/**
 * Parcels delivered per cargo type. Sums EXACTLY to the record's
 * `parcelsDelivered` — the validator fails the build if it doesn't.
 */
export type CargoMix = Record<CargoType, number>

/** One region's numbers for one month. 72 of these exist: 12 months × 6 regions. */
export interface RegionMetrics {
  region: RegionName
  /** Poké Balls shipped — the volume headline. Range 2,000–9,500. */
  pokeBallsShipped: number
  /** Berry crates delivered, perishable freight. Range 150–900. */
  berryCrates: number
  /** Bulk restock runs to Gyms & Pokémon Centers. Range 20–85. */
  gymSupplyRuns: number
  /** Couriers who fainted mid-route — open exceptions. Range 0–8. */
  faintedCouriers: number
  /** Share of parcels delivered on time, as a FRACTION 0–1 (0.942 = 94.2%). */
  onTimeRate: number
  /** Total parcels of all types. Range 6,000–21,000. */
  parcelsDelivered: number
  /** Breakdown of `parcelsDelivered` by cargo type. */
  cargoMix: CargoMix
}

/** One month, containing all six regions. */
export interface MonthMetrics {
  /** Sortable key, e.g. "2026-03". Months are in chronological order. */
  key: string
  /** Display label, e.g. "Mar 2026". */
  label: string
  regions: RegionMetrics[]
}

/** One member of the courier roster. */
export interface Courier {
  name: string
  species: string
  /** National Pokédex number — builds the sprite URL. See src/utils/sprites.ts. */
  dexId: number
  homeRegion: RegionName
  runs: number
  /** Fraction 0–1, same convention as `RegionMetrics.onTimeRate`. */
  onTimeRate: number
  status: CourierStatus
}

/** The whole dataset — the default export of metrics.json. */
export interface MetricsDataset {
  company: string
  tagline: string
  regions: RegionName[]
  cargoTypes: CargoType[]
  months: MonthMetrics[]
  couriers: Courier[]
}

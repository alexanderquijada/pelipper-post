import { computed, ref } from 'vue'
import raw from '@/data/metrics.json'
import type {
  CargoType,
  Courier,
  MetricsDataset,
  MonthMetrics,
  RegionMetrics,
  RegionName,
} from '@/types/metrics'

/**
 * All filtering and aggregation for the dashboard. Components read from here and
 * render; none of them do arithmetic.
 *
 * The `as MetricsDataset` assertion is the documented single import site —
 * see the header of src/types/metrics.ts for why it is needed and why it is safe.
 */
const metrics = raw as MetricsDataset

export type MonthFilter = 'all' | string
export type RegionFilter = 'all' | RegionName

/**
 * Module-level state, deliberately. Every component that calls useMetrics()
 * shares one selection — this is the "single composable, no Pinia" pattern the
 * capstone asks for.
 */
const selectedMonth = ref<MonthFilter>('all')
const selectedRegion = ref<RegionFilter>('all')

const ALL_MONTHS = 'all'
const ALL_REGIONS = 'all'

/** Aggregated totals for whatever slice of the data is currently selected. */
export interface Aggregate {
  pokeBallsShipped: number
  berryCrates: number
  gymSupplyRuns: number
  faintedCouriers: number
  parcelsDelivered: number
  /** Weighted by parcelsDelivered — never a mean of means. */
  onTimeRate: number
  cargoMix: Record<CargoType, number>
  recordCount: number
}

function monthsFor(month: MonthFilter): MonthMetrics[] {
  return month === ALL_MONTHS ? metrics.months : metrics.months.filter((m) => m.key === month)
}

function regionsFor(m: MonthMetrics, region: RegionFilter): RegionMetrics[] {
  return region === ALL_REGIONS ? m.regions : m.regions.filter((r) => r.region === region)
}

function recordsFor(month: MonthFilter, region: RegionFilter): RegionMetrics[] {
  return monthsFor(month).flatMap((m) => regionsFor(m, region))
}

function emptyCargoMix(): Record<CargoType, number> {
  return metrics.cargoTypes.reduce(
    (acc, c) => ({ ...acc, [c]: 0 }),
    {} as Record<CargoType, number>,
  )
}

/**
 * Counts are summed. Rates are weighted by volume: averaging a set of averages
 * would let Galar's 300 parcels count as much as Kanto's 18,000.
 */
function aggregate(records: RegionMetrics[]): Aggregate {
  const out: Aggregate = {
    pokeBallsShipped: 0,
    berryCrates: 0,
    gymSupplyRuns: 0,
    faintedCouriers: 0,
    parcelsDelivered: 0,
    onTimeRate: 0,
    cargoMix: emptyCargoMix(),
    recordCount: records.length,
  }

  let onTimeWeighted = 0

  for (const r of records) {
    out.pokeBallsShipped += r.pokeBallsShipped
    out.berryCrates += r.berryCrates
    out.gymSupplyRuns += r.gymSupplyRuns
    out.faintedCouriers += r.faintedCouriers
    out.parcelsDelivered += r.parcelsDelivered
    onTimeWeighted += r.onTimeRate * r.parcelsDelivered
    for (const c of metrics.cargoTypes) out.cargoMix[c] += r.cargoMix[c] ?? 0
  }

  // Guard the divide — no NaN may ever reach the screen.
  out.onTimeRate = out.parcelsDelivered > 0 ? onTimeWeighted / out.parcelsDelivered : 0

  return out
}

export function useMetrics() {
  // ---- filter options -------------------------------------------------------
  const monthOptions = computed(() => [
    { title: 'All Months', value: ALL_MONTHS },
    ...metrics.months.map((m) => ({ title: m.label, value: m.key })),
  ])

  const regionOptions = computed(() => [
    { title: 'All Regions', value: ALL_REGIONS },
    ...metrics.regions.map((r) => ({ title: r, value: r })),
  ])

  // ---- the current slice ----------------------------------------------------
  const currentRecords = computed(() => recordsFor(selectedMonth.value, selectedRegion.value))
  const current = computed(() => aggregate(currentRecords.value))
  const hasData = computed(() => currentRecords.value.length > 0)

  const monthCount = computed(() => monthsFor(selectedMonth.value).length)
  const regionCount = computed(() =>
    selectedRegion.value === ALL_REGIONS ? metrics.regions.length : 1,
  )

  const filterCaption = computed(() => {
    const m = monthCount.value
    const r = regionCount.value
    return `Showing ${m} ${m === 1 ? 'month' : 'months'} across ${r} ${r === 1 ? 'region' : 'regions'}`
  })

  // ---- trends ---------------------------------------------------------------
  /**
   * Which two months the trend compares.
   *  - "All Months"    -> trailing month vs. the one before it
   *  - a single month  -> that month vs. the month before it
   *  - the first month -> null, because there is no prior month to compare to
   */
  const trendPair = computed<{ current: MonthMetrics; previous: MonthMetrics } | null>(() => {
    const all = metrics.months
    if (all.length < 2) return null

    if (selectedMonth.value === ALL_MONTHS) {
      return { current: all[all.length - 1]!, previous: all[all.length - 2]! }
    }

    const i = all.findIndex((m) => m.key === selectedMonth.value)
    if (i <= 0) return null
    return { current: all[i]!, previous: all[i - 1]! }
  })

  function changeFraction(now: number, before: number): number | null {
    if (before === 0) return null
    return (now - before) / before
  }

  /** Per-KPI change vs. the previous month, as a fraction. null = no prior month. */
  const trends = computed(() => {
    const pair = trendPair.value
    const none = {
      pokeBallsShipped: null,
      berryCrates: null,
      gymSupplyRuns: null,
      faintedCouriers: null,
    }
    if (!pair) return none

    const now = aggregate(regionsFor(pair.current, selectedRegion.value))
    const before = aggregate(regionsFor(pair.previous, selectedRegion.value))

    return {
      pokeBallsShipped: changeFraction(now.pokeBallsShipped, before.pokeBallsShipped),
      berryCrates: changeFraction(now.berryCrates, before.berryCrates),
      gymSupplyRuns: changeFraction(now.gymSupplyRuns, before.gymSupplyRuns),
      faintedCouriers: changeFraction(now.faintedCouriers, before.faintedCouriers),
    }
  })

  /**
   * Caption for the KPI row. The correct wording depends on filter state, which
   * is exactly why the per-card "vs. last month" suffix was removed.
   * null means render no caption at all.
   */
  const trendCaption = computed(() => {
    const pair = trendPair.value
    if (!pair) return null
    return `Trends compare ${pair.current.label} to ${pair.previous.label}.`
  })

  // ---- chart data -----------------------------------------------------------
  /**
   * Parcels by region. Respects the month filter. Hidden entirely when a single
   * region is selected — a one-bar bar chart answers nothing.
   */
  const showRegionChart = computed(() => selectedRegion.value === ALL_REGIONS)

  const regionChart = computed(() => {
    const months = monthsFor(selectedMonth.value)
    const labels = metrics.regions
    const values = labels.map((region) =>
      months.reduce(
        (sum, m) =>
          sum + (m.regions.find((r) => r.region === region)?.parcelsDelivered ?? 0),
        0,
      ),
    )
    return { labels: [...labels], values }
  })

  /** Cargo mix for the current slice — honours both filters. */
  const cargoChart = computed(() => ({
    labels: [...metrics.cargoTypes],
    values: metrics.cargoTypes.map((c) => current.value.cargoMix[c]),
  }))

  /**
   * The trend chart always shows all twelve months — it is the trend view — but
   * respects the region filter and marks the selected month when there is one.
   */
  const trendChart = computed(() => {
    const labels = metrics.months.map((m) => m.label)
    const gymSupplyRuns = metrics.months.map((m) =>
      regionsFor(m, selectedRegion.value).reduce((s, r) => s + r.gymSupplyRuns, 0),
    )
    const parcelsDelivered = metrics.months.map((m) =>
      regionsFor(m, selectedRegion.value).reduce((s, r) => s + r.parcelsDelivered, 0),
    )
    const selectedIndex =
      selectedMonth.value === ALL_MONTHS
        ? -1
        : metrics.months.findIndex((m) => m.key === selectedMonth.value)

    return { labels, gymSupplyRuns, parcelsDelivered, selectedIndex }
  })

  // ---- roster ---------------------------------------------------------------
  const filteredCouriers = computed<Courier[]>(() =>
    selectedRegion.value === ALL_REGIONS
      ? metrics.couriers
      : metrics.couriers.filter((c) => c.homeRegion === selectedRegion.value),
  )

  return {
    // company identity
    company: metrics.company,
    tagline: metrics.tagline,

    // filter state
    selectedMonth,
    selectedRegion,
    monthOptions,
    regionOptions,
    filterCaption,

    // aggregates
    current,
    hasData,
    trends,
    trendCaption,

    // charts
    showRegionChart,
    regionChart,
    cargoChart,
    trendChart,

    // roster
    filteredCouriers,
  }
}

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


/** One computed alert row in the Critical Delivery Signals card. */
export interface Signal {
  id: string
  severity: 'critical' | 'warning' | 'ok'
  finding: string
  detail: string
}

const SEVERITY_RANK: Record<Signal['severity'], number> = { critical: 0, warning: 1, ok: 2 }

/** Weighted on-time rate for an arbitrary set of records. */
function weightedOnTime(records: RegionMetrics[]): number {
  const parcels = records.reduce((a, r) => a + r.parcelsDelivered, 0)
  if (parcels === 0) return 0
  return records.reduce((a, r) => a + r.onTimeRate * r.parcelsDelivered, 0) / parcels
}

const pct = (n: number) => `${(n * 100).toFixed(1)}%`
const num = (n: number) => Math.round(n).toLocaleString('en-US')

/** The on-time target the Signals card measures regions against. */
const ON_TIME_TARGET = 0.93

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
      parcelsDelivered: null,
      pokeBallsShipped: null,
      onTimeRate: null,
      berryCrates: null,
      gymSupplyRuns: null,
      faintedCouriers: null,
    }
    if (!pair) return none

    const now = aggregate(regionsFor(pair.current, selectedRegion.value))
    const before = aggregate(regionsFor(pair.previous, selectedRegion.value))

    return {
      parcelsDelivered: changeFraction(now.parcelsDelivered, before.parcelsDelivered),
      pokeBallsShipped: changeFraction(now.pokeBallsShipped, before.pokeBallsShipped),
      // Percentage POINTS, not a relative change — this metric is itself a rate.
      onTimeRate: now.onTimeRate - before.onTimeRate,
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


  // ---- Top Cargo Categories -------------------------------------------------
  /**
   * Sorted descending, but each entry keeps `colorIndex` — its ORIGINAL position
   * in `cargoTypes`. Colour follows the cargo type, never its current rank, so a
   * filter change can't repaint the bars.
   */
  const cargoCategories = computed(() => {
    const total = current.value.parcelsDelivered
    return metrics.cargoTypes
      .map((label, colorIndex) => {
        const value = current.value.cargoMix[label] ?? 0
        return { label, value, colorIndex, share: total > 0 ? value / total : 0 }
      })
      .sort((a, b) => b.value - a.value)
  })

  // ---- Network Reliability & Fulfillment Health -----------------------------
  const filteredCouriers = computed<Courier[]>(() =>
    selectedRegion.value === ALL_REGIONS
      ? metrics.couriers
      : metrics.couriers.filter((c) => c.homeRegion === selectedRegion.value),
  )

  /** Parcels per region across the selected months — powers busiest/quietest. */
  const regionTotals = computed(() => {
    const months = monthsFor(selectedMonth.value)
    const scope =
      selectedRegion.value === ALL_REGIONS ? metrics.regions : [selectedRegion.value as RegionName]
    return scope
      .map((region) => {
        const recs = months.flatMap((m) => m.regions.filter((r) => r.region === region))
        return {
          region,
          parcels: recs.reduce((a, r) => a + r.parcelsDelivered, 0),
          onTime: weightedOnTime(recs),
        }
      })
      .sort((a, b) => b.parcels - a.parcels)
  })

  type Health = 'good' | 'warn' | 'bad'
  interface HealthRow {
    label: string
    value: string
    health: Health
    hint: string
  }

  const reliability = computed<HealthRow[]>(() => {
    const agg = current.value
    const couriers = filteredCouriers.value
    const totals = regionTotals.value
    const rows: HealthRow[] = []

    // On-Time Rate — the weighted figure, never a mean of means.
    const ot = agg.onTimeRate
    rows.push({
      label: 'On-Time Rate',
      value: pct(ot),
      health: ot >= 0.95 ? 'good' : ot >= ON_TIME_TARGET ? 'warn' : 'bad',
      hint: `Weighted by parcels delivered. Target ${pct(ON_TIME_TARGET)}.`,
    })

    // Avg monthly parcel volume, measured against the same region scope's
    // twelve-month average. Meaningful at every filter combination, unlike a
    // ratio against courier `runs` — those are lifetime totals with no month.
    const monthsInScope = monthsFor(selectedMonth.value).length || 1
    const perMonth = agg.parcelsDelivered / monthsInScope
    const baselineRecords = metrics.months.flatMap((m) => regionsFor(m, selectedRegion.value))
    const baselinePerMonth =
      baselineRecords.reduce((a, r) => a + r.parcelsDelivered, 0) / metrics.months.length
    const ratio = baselinePerMonth > 0 ? perMonth / baselinePerMonth : 1
    rows.push({
      label: 'Avg Monthly Parcel Volume',
      value: num(perMonth),
      health: ratio >= 0.98 ? 'good' : ratio >= 0.85 ? 'warn' : 'bad',
      hint: `${num(agg.parcelsDelivered)} parcels over ${monthsInScope} ${monthsInScope === 1 ? 'month' : 'months'}. The twelve-month average for this region scope is ${num(baselinePerMonth)}.`,
    })

    // Fainted couriers per 1k parcels — lower is better.
    const per1k = agg.parcelsDelivered > 0 ? (agg.faintedCouriers / agg.parcelsDelivered) * 1000 : 0
    rows.push({
      label: 'Fainted Couriers per 1k Parcels',
      value: per1k.toFixed(2),
      health: per1k < 0.1 ? 'good' : per1k < 0.18 ? 'warn' : 'bad',
      hint: `${num(agg.faintedCouriers)} exceptions across ${num(agg.parcelsDelivered)} parcels.`,
    })

    // Fleet availability.
    const onRoute = couriers.filter((c) => c.status === 'On Route').length
    const grounded = couriers.filter((c) => c.status === 'Grounded').length
    rows.push({
      label: 'Couriers On Route vs Grounded',
      value: `${onRoute} / ${grounded}`,
      health: grounded === 0 ? 'good' : grounded === 1 ? 'warn' : 'bad',
      hint: `${couriers.length} couriers in scope; ${grounded} currently grounded.`,
    })

    // Busiest / quietest. The dot reflects that region's on-time rate, not its volume.
    const busiest = totals[0]
    const quietest = totals[totals.length - 1]
    if (busiest) {
      rows.push({
        label: 'Busiest Region',
        value: `${busiest.region} · ${num(busiest.parcels)}`,
        health: busiest.onTime >= 0.95 ? 'good' : busiest.onTime >= ON_TIME_TARGET ? 'warn' : 'bad',
        hint: `${num(busiest.parcels)} parcels at ${pct(busiest.onTime)} on-time.`,
      })
    }
    if (quietest) {
      rows.push({
        label: 'Quietest Region',
        value: `${quietest.region} · ${num(quietest.parcels)}`,
        health:
          quietest.onTime >= 0.95 ? 'good' : quietest.onTime >= ON_TIME_TARGET ? 'warn' : 'bad',
        hint: `${num(quietest.parcels)} parcels at ${pct(quietest.onTime)} on-time.`,
      })
    }

    return rows
  })

  // ---- Critical Delivery Signals --------------------------------------------
  /**
   * Every signal is derived from the 72 records, never hardcoded, and every one
   * respects both filters. A signal that cannot be computed under the current
   * selection (no prior month, only one month in scope) is OMITTED rather than
   * faked with a placeholder.
   */
  const signals = computed<Signal[]>(() => {
    const out: Signal[] = []
    const months = monthsFor(selectedMonth.value)
    const inScope = (m: MonthMetrics) => regionsFor(m, selectedRegion.value)
    const regionLabel =
      selectedRegion.value === ALL_REGIONS ? 'the network' : (selectedRegion.value as string)
    const monthNum = (k: string) => Number(k.split('-')[1])

    // 1. Storm season (Jul-Aug) exception spike.
    const stormMonths = months.filter((m) => [7, 8].includes(monthNum(m.key)))
    if (stormMonths.length) {
      const stormRecs = stormMonths.flatMap(inScope)
      const calmRecs = metrics.months
        .filter((m) => ![7, 8].includes(monthNum(m.key)))
        .flatMap(inScope)
      const stormAvg = stormRecs.reduce((a, r) => a + r.faintedCouriers, 0) / (stormRecs.length || 1)
      const calmAvg = calmRecs.reduce((a, r) => a + r.faintedCouriers, 0) / (calmRecs.length || 1)
      const multiple = calmAvg > 0 ? stormAvg / calmAvg : 0
      out.push({
        id: 'storm',
        severity: multiple >= 1.6 ? 'critical' : multiple >= 1.2 ? 'warning' : 'ok',
        finding: `Storm season is driving ${multiple.toFixed(1)}x the usual courier exceptions in ${regionLabel}.`,
        detail: `Jul-Aug averages ${stormAvg.toFixed(1)} fainted couriers per region-month against ${calmAvg.toFixed(1)} the rest of the year. Flying couriers get grounded in storm season — expect the on-time rate to follow.`,
      })
    }

    // 2. Regions under the on-time target.
    const under = regionTotals.value.filter((r) => r.onTime < ON_TIME_TARGET)
    if (under.length) {
      const worst = under.reduce((a, b) => (a.onTime < b.onTime ? a : b))
      out.push({
        id: 'under-target',
        severity: worst.onTime < 0.9 ? 'critical' : 'warning',
        finding: `${under.length === 1 ? `${worst.region} is` : `${under.length} regions are`} below the ${pct(ON_TIME_TARGET)} on-time target.`,
        detail: `${under.map((r) => `${r.region} ${pct(r.onTime)}`).join(', ')}. Weighted by parcels delivered, so a small region's bad month cannot distort the figure.`,
      })
    } else if (regionTotals.value.length) {
      out.push({
        id: 'under-target',
        severity: 'ok',
        finding: `Every region in scope is meeting the ${pct(ON_TIME_TARGET)} on-time target.`,
        detail: regionTotals.value.map((r) => `${r.region} ${pct(r.onTime)}`).join(', ') + '.',
      })
    }

    // 3. Largest single month-over-month on-time drop.
    // Uses the full series for the selected region so a single-month selection
    // can still be compared against its predecessor.
    const series = metrics.months.map((m) => ({ label: m.label, rate: weightedOnTime(inScope(m)) }))
    const window =
      selectedMonth.value === ALL_MONTHS
        ? series
        : (() => {
            const i = metrics.months.findIndex((m) => m.key === selectedMonth.value)
            return i > 0 ? [series[i - 1]!, series[i]!] : []
          })()
    if (window.length >= 2) {
      let worstDrop = { from: '', to: '', delta: 0 }
      for (let i = 1; i < window.length; i++) {
        const delta = window[i]!.rate - window[i - 1]!.rate
        if (delta < worstDrop.delta) {
          worstDrop = { from: window[i - 1]!.label, to: window[i]!.label, delta }
        }
      }
      if (worstDrop.delta < 0) {
        const points = Math.abs(worstDrop.delta) * 100
        out.push({
          id: 'mom-drop',
          severity: points >= 4 ? 'critical' : points >= 2 ? 'warning' : 'ok',
          finding: `Largest on-time drop: ${points.toFixed(1)} points, ${worstDrop.from} to ${worstDrop.to}.`,
          detail: `On-time fell from ${pct(window.find((w) => w.label === worstDrop.from)!.rate)} to ${pct(window.find((w) => w.label === worstDrop.to)!.rate)} in ${regionLabel}. Month-over-month, weighted by volume.`,
        })
      }
    }

    // 4. Fastest-growing region. Needs at least two months of movement.
    if (months.length >= 2) {
      const first = months[0]!
      const last = months[months.length - 1]!
      const scope =
        selectedRegion.value === ALL_REGIONS
          ? metrics.regions
          : [selectedRegion.value as RegionName]
      const growth = scope
        .map((region) => {
          const a = first.regions.find((r) => r.region === region)?.parcelsDelivered ?? 0
          const b = last.regions.find((r) => r.region === region)?.parcelsDelivered ?? 0
          return { region, change: a > 0 ? (b - a) / a : 0 }
        })
        .sort((x, y) => y.change - x.change)
      const top = growth[0]
      if (top) {
        out.push({
          id: 'growth',
          severity: 'ok',
          finding: `${top.region} is the fastest-growing region, up ${(top.change * 100).toFixed(1)}%.`,
          detail: `Measured ${first.label} to ${last.label} on parcels delivered.${growth.length > 1 ? ` Slowest is ${growth[growth.length - 1]!.region} at ${(growth[growth.length - 1]!.change * 100).toFixed(1)}%.` : ''}`,
        })
      }
    }

    // 5. December berry rush strain.
    const decMonths = months.filter((m) => monthNum(m.key) === 12)
    if (decMonths.length) {
      const decRecs = decMonths.flatMap(inScope)
      const otherRecs = metrics.months
        .filter((m) => monthNum(m.key) !== 12)
        .flatMap(inScope)
      const decBerries = decRecs.reduce((a, r) => a + r.berryCrates, 0) / (decRecs.length || 1)
      const otherBerries =
        otherRecs.reduce((a, r) => a + r.berryCrates, 0) / (otherRecs.length || 1)
      const multiple = otherBerries > 0 ? decBerries / otherBerries : 0
      const decOnTime = weightedOnTime(decRecs)
      const otherOnTime = weightedOnTime(otherRecs)
      const dip = (otherOnTime - decOnTime) * 100
      out.push({
        id: 'december',
        severity: dip >= 4 ? 'critical' : dip >= 2 ? 'warning' : 'ok',
        finding: `December berry rush: ${multiple.toFixed(1)}x volume, on-time down ${dip.toFixed(1)} points.`,
        detail: `Berry crates run ${num(decBerries)} per region-month in December against ${num(otherBerries)} otherwise, and on-time falls from ${pct(otherOnTime)} to ${pct(decOnTime)}. The network is capacity-bound, not failing.`,
      })
    }

    return out.sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity])
  })


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
    trendChart,

    // roster
    filteredCouriers,

    // derived cards
    cargoCategories,
    reliability,
    signals,
    regionTotals,
  }
}

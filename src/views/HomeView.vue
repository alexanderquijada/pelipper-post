<script setup lang="ts">
// Phase 2 = structure only. Every value below is a placeholder.
// Phase 3 swaps these elements for Vuetify components, Phase 4 extracts
// MetricCard, Phase 5 adds the dataset, Phase 6 wires filters and charts.

const KPI_SLOTS = [
  'Poké Balls Shipped',
  'Berry Crates Delivered',
  'Gym Supply Runs',
  'Fainted Couriers',
] as const

const MONTHS = [
  'All Months',
  'Oct 2025',
  'Nov 2025',
  'Dec 2025',
  'Jan 2026',
  'Feb 2026',
  'Mar 2026',
  'Apr 2026',
  'May 2026',
  'Jun 2026',
  'Jul 2026',
  'Aug 2026',
  'Sep 2026',
] as const

const REGIONS = ['All Regions', 'Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Galar'] as const
</script>

<template>
  <main class="container">
    <!-- 2. Filter row -->
    <section class="filter-row">
      <div class="filter-row__controls">
        <label class="field">
          <span class="field__label">Month</span>
          <select class="field__select">
            <option v-for="month in MONTHS" :key="month">{{ month }}</option>
          </select>
        </label>

        <label class="field">
          <span class="field__label">Region</span>
          <select class="field__select">
            <option v-for="region in REGIONS" :key="region">{{ region }}</option>
          </select>
        </label>
      </div>

      <p class="filter-row__caption">Showing 12 months across 6 regions</p>
    </section>

    <!-- 3. KPI row — four slots. MetricCard replaces these in Phase 4. -->
    <section class="kpi-row">
      <article v-for="label in KPI_SLOTS" :key="label" class="card metric-card">
        <p class="metric-card__label">{{ label }}</p>
        <p class="metric-card__value">—</p>
        <p class="metric-card__trend">trend in Phase 6</p>
      </article>
    </section>

    <!-- 4. Chart row — two side by side -->
    <section class="chart-row">
      <article class="card">
        <h2 class="card__title">Parcels by Region</h2>
        <div class="slot">
          <p class="slot__name">RegionBarChart</p>
          <p class="slot__note">Vertical bar chart · Phase 6</p>
        </div>
      </article>

      <article class="card">
        <h2 class="card__title">Cargo Mix</h2>
        <div class="slot">
          <p class="slot__name">CargoMixChart</p>
          <p class="slot__note">Doughnut, five segments · Phase 6</p>
        </div>
      </article>
    </section>

    <!-- 5. Trend row — one full width -->
    <section class="trend-row">
      <article class="card">
        <h2 class="card__title">Gym Supply Runs &amp; Parcels Delivered</h2>
        <div class="slot slot--wide">
          <p class="slot__name">DeliveryTrendChart</p>
          <p class="slot__note">Full-width area chart, twelve months · Phase 6</p>
        </div>
      </article>
    </section>

    <!-- 6. Courier roster -->
    <section class="roster-row">
      <article class="card">
        <h2 class="card__title">Courier Roster</h2>
        <div class="slot slot--wide">
          <p class="slot__name">CourierRoster</p>
          <p class="slot__note">Table with hotlinked sprite avatars · Phase 6</p>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped>
.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 32px 40px 8px;
}

/* Shared card */
.card {
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: var(--card-padding);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.28);
}

.card__title {
  margin: 0 0 18px;
  font-size: 15px;
  font-weight: 600;
}

/* Filter row */
.filter-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 28px;
}

.filter-row__controls {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-row__caption {
  margin: 0 0 10px;
  font-size: 13px;
  color: var(--muted);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field__label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.9px;
  color: var(--muted);
}

.field__select {
  appearance: none;
  min-width: 190px;
  padding: 10px 38px 10px 14px;
  background-color: var(--surface);
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='%238FA3B8' d='M7,10L12,15L17,10H7Z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 18px 18px;
  color: var(--on-surface);
  border: 1px solid var(--hairline);
  border-radius: 8px;
  font: inherit;
  font-size: 14px;
  cursor: pointer;
}

.field__select:focus {
  outline: none;
  border-color: var(--primary);
}

/* KPI row */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--gap);
  margin-bottom: var(--gap);
}

.metric-card__label {
  margin: 0;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--muted);
}

.metric-card__value {
  margin: 12px 0 0;
  font-size: 40px;
  line-height: 1.1;
  font-weight: 600;
  letter-spacing: -0.5px;
}

.metric-card__trend {
  margin: 10px 0 0;
  font-size: 12.5px;
  color: var(--muted);
}

/* Chart + roster rows */
.chart-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--gap);
  margin-bottom: var(--gap);
}

.trend-row,
.roster-row {
  margin-bottom: var(--gap);
}

.slot {
  height: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  text-align: center;
  border: 1px dashed rgba(143, 163, 184, 0.38);
  border-radius: 10px;
  background: rgba(79, 163, 209, 0.04);
}

.slot--wide {
  height: 220px;
}

.slot__name {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--secondary);
}

.slot__note {
  margin: 0;
  font-size: 12.5px;
  color: var(--muted);
}

@media (max-width: 1100px) {
  .kpi-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .chart-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .container {
    padding: 24px 20px 8px;
  }

  .kpi-row {
    grid-template-columns: 1fr;
  }
}
</style>

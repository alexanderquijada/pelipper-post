# Pelipper Post & Freight — Executive Operations Dashboard

> **TL;DR** — A single-page internal analytics dashboard for the Regional Operations Director
> of Pelipper Post & Freight, a Pokémon-powered air-and-sea parcel carrier. She pulls it up in
> leadership meetings to answer one question: *are we getting packages where they need to go?*
> Dark theme by default, Vue 3 + Vuetify 3, mock data from a local JSON file, two filters that
> update every number and chart on the page.

*Fan-made learning project. Pokémon names and sprites are trademarks of Nintendo / Creatures Inc. /
GAME FREAK. No client or Slalom data appears anywhere in this project.*

---

## 1. Summary

**Company:** Pelipper Post & Freight — *"Your package, airborne."*

Pelipper Post & Freight runs parcel delivery across six regions using a courier fleet of flying,
running, and heavy-haul Pokémon. Their ops team tracks everything in spreadsheets. The Regional
Operations Director wants one screen that shows how the network is running: what's shipping, where
it's going, which couriers are carrying the load, and what's going wrong.

**Primary user:** Regional Operations Director (non-technical, reviews on a laptop in a meeting room,
projected to a screen).

**The job it does:** In under ten seconds she should be able to see whether this month was better or
worse than last month, and drill into a single region or a single month when someone asks.

**Out of scope:** authentication, a real backend, multiple pages/routes, editing data, exporting,
mobile-first design (responsive is enough — this lives on a laptop).

---

## 2. Data

All data is **mock/fake** and lives in a single file: `src/data/metrics.json`.
No API calls, no backend. The app imports the JSON directly.

### Dimensions

- **Regions (6):** Kanto, Johto, Hoenn, Sinnoh, Unova, Galar
- **Months (12):** Oct 2025 through Sep 2026 (rolling trailing twelve months)
- **Cargo types (5):** Poké Balls, Berries, Potions, TMs, Evolution Stones

### Metrics (per month, per region)

| Field | Meaning | Valid range (per region per month) |
|---|---|---|
| `pokeBallsShipped` | Poké Balls shipped (the volume headline). **Must equal `cargoMix["Poké Balls"]`.** | 2,000 – 9,500 |
| `berryCrates` | Berry crates delivered (perishable freight) | 150 – 900 |
| `gymSupplyRuns` | Bulk restock runs to Gyms & Pokémon Centers | 20 – 85 |
| `faintedCouriers` | Couriers who fainted mid-route (open exceptions) | 0 – 8 |
| `onTimeRate` | Share of parcels delivered on time, 0–1 | 0.86 – 0.97 |
| `parcelsDelivered` | Total parcels of all types | 6,000 – 21,000 |
| `cargoMix` | Object: parcels per cargo type, sums **exactly** to `parcelsDelivered` | — |

These ranges are wide on purpose — they have to hold for *both* the smallest region in its
slowest month *and* the largest region at the peak of Gym Season. A small region like Galar will sit
near the floor all year; Kanto in April will sit near the ceiling. That's correct, not a bug.

**Rule: `pokeBallsShipped` and `cargoMix["Poké Balls"]` are the same measure and must be the
identical number in every record.** Not "close", not "consistent" — identical. They render inches
apart on the finished dashboard: `pokeBallsShipped` is a KPI card, `cargoMix["Poké Balls"]` is a
doughnut segment. Two different numbers under the same label is an unanswerable question in a
leadership meeting. This is enforced per record by `scripts/validate-data.mjs`.

Poké Balls should also remain the **largest** segment of `cargoMix`. As a consequence of the two
rules above, `pokeBallsShipped` naturally lands around **30–35% of `parcelsDelivered`** — that's a
description of where the number falls, not a separate target to hit.

**These ranges are enforced.** `scripts/validate-data.mjs` checks every one of the 72 records against
this table, plus every seasonality rule below. Run it before building anything on the data.

### Realism requirements

The numbers must look like a real business, not random noise:

- **Gym Season (Mar–May):** `gymSupplyRuns` and `pokeBallsShipped` rise 25–40% above baseline.
- **Holiday berry rush (Dec):** `berryCrates` roughly doubles; `onTimeRate` dips 3–5 points because
  the network is strained.
- **Storm season (Jul–Aug):** `faintedCouriers` peaks and `onTimeRate` drops — flying couriers get
  grounded. This is the story the dashboard should surface.
- **Region character, consistent across all months:**
  - *Kanto* — highest volume, mature network, best on-time rate
  - *Johto* — second highest, stable
  - *Hoenn* — water routes, most weather-sensitive (biggest storm-season dip)
  - *Sinnoh* — mountainous, lowest on-time rate year-round, most fainted couriers
  - *Unova* — mid volume, fastest growth month over month
  - *Galar* — smallest, newest region, volumes climbing from a low base
- Month-over-month movement should be believable — **±3–15% is the guide, not a hard rule.**
  Seasonal transitions may legitimately exceed 15% (the post-December drop is the obvious one, and a
  real parcel carrier does lose that much volume in January), and quiet months may move less than
  3%. **Where the band and the seasonality rules above conflict, visible seasonality wins** — the
  dashboard's job is to surface the storm-season story, and flattening a real seasonal swing to stay
  inside a band would defeat that. What matters is that the line is never perfectly smooth and never
  moves by an implausible amount without a seasonal reason.
- Nothing rounded to suspiciously clean numbers (use 7,142 not 7,000).

### Courier roster (7 couriers)

Each courier: `name`, `species`, `dexId`, `homeRegion`, `runs`, `onTimeRate`, `status`.

| Name | Species | dexId | Home region |
|---|---|---|---|
| Skyler | Pelipper | 279 | Hoenn |
| Gale | Pidgeot | 18 | Kanto |
| Nimbus | Dragonite | 149 | Johto |
| Tidal | Gyarados | 130 | Sinnoh |
| Brix | Machamp | 68 | Unova |
| Dash | Doduo | 84 | Galar |
| Emberlyn | Rapidash | 78 | Kanto |

`status` is one of `"On Route"`, `"Resting"`, `"Grounded"`.

### JSON shape (follow this exactly)

```json
{
  "company": "Pelipper Post & Freight",
  "tagline": "Your package, airborne.",
  "regions": ["Kanto", "Johto", "Hoenn", "Sinnoh", "Unova", "Galar"],
  "cargoTypes": ["Poké Balls", "Berries", "Potions", "TMs", "Evolution Stones"],
  "months": [
    {
      "key": "2025-10",
      "label": "Oct 2025",
      "regions": [
        {
          "region": "Kanto",
          "pokeBallsShipped": 4611,
          "berryCrates": 412,
          "gymSupplyRuns": 54,
          "faintedCouriers": 1,
          "onTimeRate": 0.962,
          "parcelsDelivered": 14237,
          "cargoMix": {
            "Poké Balls": 4611,
            "Berries": 3120,
            "Potions": 2894,
            "TMs": 2107,
            "Evolution Stones": 1505
          }
        }
      ]
    }
  ],
  "couriers": [
    {
      "name": "Skyler",
      "species": "Pelipper",
      "dexId": 279,
      "homeRegion": "Hoenn",
      "runs": 2140,
      "onTimeRate": 0.961,
      "status": "On Route"
    }
  ]
}
```

Every month must contain all six regions. Twelve months × six regions = 72 region records.

### Sprites

Courier sprites are **hotlinked, never stored in this repo**. Build the URL from `dexId`:

```
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{dexId}.png
```

Requirements:
- Put the URL builder in one place — `src/utils/sprites.ts` — so it can be swapped in one edit.
- Add a fallback: if the image fails to load, show a Material Design icon
  (`mdi-truck-delivery-outline`) inside the avatar instead of a broken image. Wire this to the
  `<img>` `@error` handler. **Verify in the browser that at least one sprite actually renders**
  before moving on; if the CDN path 404s, try
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{dexId}.png` instead
  and update the one utility.

---

## 3. Tech

- **Vue 3** with `<script setup>` and the Composition API
- **Vite** as the build tool
- **TypeScript** on
- **Vue Router** installed (single route `/` — it's there because the capstone asks for it)
- **Vuetify 3.x (pinned — do not upgrade to 4)** for components, plus **Material Design Icons**
  (`@mdi/font`). Install as `vuetify@^3`; a bare `npm install vuetify` now resolves to 4.x.
- **Chart.js** + **vue-chartjs** for all charts
- No Pinia, no testing framework, no JSX, no ESLint, no Prettier
- Single page — everything renders in `src/views/HomeView.vue`
- Deploys to Vercel as a static Vite build

**Structure:**

```
src/
  main.ts                    Vuetify plugin + theme registration
  App.vue                    v-app shell, app bar, router-view
  router/index.ts            one route -> HomeView
  views/HomeView.vue         the whole dashboard
  components/
    MetricCard.vue           custom reusable KPI card
    CourierRoster.vue        courier table with sprites
    charts/RegionBarChart.vue
    charts/CargoMixChart.vue
    charts/DeliveryTrendChart.vue
  data/metrics.json          mock dataset
  utils/sprites.ts           dexId -> sprite URL
  composables/useMetrics.ts  filtering + aggregation logic
```

---

## 4. Layout

Top to bottom, one page, no scrolling required at 1440×900 beyond the courier table:

1. **App bar** — Pelipper Post & Freight wordmark on the left with an `mdi-mail` icon, the tagline
   as muted subtitle text, and a light/dark theme toggle on the right.

2. **Filter row** — two dropdowns, left-aligned, on the same line:
   - **Month** — options: `All Months` (default) + the twelve months
   - **Region** — options: `All Regions` (default) + the six regions
   Plus a muted caption on the right of the row reading e.g. *"Showing 12 months across 6 regions"*
   that updates with the filters.

3. **KPI row** — four equal `MetricCard`s across on desktop, 2×2 on tablet, stacked on mobile:
   - Poké Balls Shipped
   - Berry Crates Delivered
   - Gym Supply Runs
   - Fainted Couriers

4. **Chart row** — two charts side by side, equal width:
   - **Parcels by Region** — vertical bar chart. Hidden/disabled when a single region is selected;
     in that case show a small empty-state message instead of an awkward one-bar chart.
   - **Cargo Mix** — doughnut chart, five segments, with a legend

5. **Trend row** — one full-width card: **Gym Supply Runs & Parcels Delivered over 12 months**,
   drawn as **two vertically stacked area panels sharing one time axis** — Parcels Delivered on top,
   Gym Supply Runs beneath. Each panel has its own y-axis, both starting at zero, and the y-axis
   gutters are pinned to the same width so the two time axes line up exactly.

   **Not a dual-axis chart, deliberately.** Parcels Delivered runs in the tens of thousands and Gym
   Supply Runs in the tens — roughly a 200× gap. Plotted against two y-scales in one frame, the
   smaller series flattens against the axis and the point where the lines cross is an artefact of
   the scales chosen rather than anything real. Two aligned single-axis panels keep both shapes
   readable and every comparison honest, while still reading as one chart in one card.

   The card always shows all twelve months (it's the trend view) but respects the region filter,
   and highlights the currently selected month with a marker on both panels when one is selected.

6. **Courier roster** — full-width Vuetify table: circular sprite avatar, courier name, species,
   home region, total runs, on-time rate, and status as a colored chip. Respects the region filter.

7. **Footer** — small muted line: *"Made with coffee and Claude Code · mock data, not a real carrier."*

**Grid:** use `v-container` / `v-row` / `v-col` with responsive breakpoints. Centered, max width
~1400px, generous gutters. Do not let content jam against the left edge.

---

## 5. Interactions

- **Month filter** — recalculates all four KPI cards, the region bar chart, the cargo mix doughnut,
  and the marker on the trend chart. `All Months` sums (or averages, for rates) the full year.
- **Region filter** — recalculates all four KPI cards, the cargo mix doughnut, the trend chart, and
  filters the courier roster to couriers whose `homeRegion` matches.
- **Filters compose** — picking Hoenn + August must show only Hoenn's August numbers.
- **Trend arrows on KPI cards** — each card shows the change vs. the previous month as a small arrow
  plus a percentage. Green for good, red for bad. **`Fainted Couriers` is inverted** — fewer is
  better, so a decrease is green. When `All Months` is selected, compare the trailing month to the
  one before it. Never show a trend arrow when there is no prior month to compare against.
- **Theme toggle** — switches Vuetify between the dark and light themes. Dark is the default.
- **Loading / empty states** — if a filter combination yields no data, show a short centered message
  rather than blank charts or `NaN`.
- Everything is reactive and instant. No page reloads, no spinners.

---

## 6. Style

**Dark by default.** Register two named Vuetify themes, `pelipperDark` (default) and `pelipperLight`.

Cohesive palette drawn from Pelipper — white body, blue wings, orange beak. **Not a rainbow.**

| Token | Dark | Light |
|---|---|---|
| background | `#0E1621` | `#F4F7FA` |
| surface (cards) | `#16202E` | `#FFFFFF` |
| primary | `#4FA3D1` | `#2E6E92` |
| secondary | `#7FD1E8` | `#4FA3D1` |
| accent | `#F2A65A` | `#E08A3C` |
| success | `#5FBF8F` | `#3E9E70` |
| error | `#E8705A` | `#D1523C` |
| on-surface text | `#E6EDF3` | `#16202E` |
| muted text | `#8FA3B8` | `#5C7186` |

### Chart colors — two palettes, because there are two different jobs

An earlier version of this brief specified one blue ramp for every chart. That was wrong: a ramp
encodes **magnitude**, so using it for unordered categories implies a ranking that doesn't exist —
and four near-neighbour blues are not mutually distinguishable. Measured with a
Viénot–Brettel–Mollon dichromat simulation and CIEDE2000, the ramp used categorically put three of
ten pairs below the ΔE 15 normal-vision floor (Poké Balls/TMs **11.6**, Berries/TMs **12.0**,
Poké Balls/Berries **14.3**) and collapsed **Berries/TMs to ΔE 4.3 under deuteranopia and 1.3 under
tritanopia** — effectively the same colour.

**1. Sequential ramp — ORDERED data only.** The twelve-month trend chart. Unchanged:

`#4FA3D1`, `#7FD1E8`, `#F2A65A`, `#9BB8D3`, `#2E6E92`

**2. Categorical palette — UNORDERED categories.** The cargo-mix doughnut and the region bar chart.
**Okabe–Ito**, which is colourblind-safe because it varies lightness as well as hue. Two variants,
because no single set clears 3:1 against both a near-black and a white card:

| Slot | Dark theme | on `#16202E` | Light theme | on `#FFFFFF` |
|---|---|---|---|---|
| Poké Balls | `#56B4E9` | 7.11:1 | `#0072B2` | 5.19:1 |
| Berries | `#E69F00` | 7.28:1 | `#D55E00` | 3.87:1 |
| Potions | `#009E73` | 4.79:1 | `#009E73` | 3.42:1 |
| TMs | `#CC79A7` | 5.36:1 | `#CC79A7` | 3.06:1 |
| Evolution Stones | `#F0E442` | 12.41:1 | `#6B4E00` | 7.74:1 |

Every slot clears **3:1** against its own surface. Across all ten pairs the worst red-green
separation is **ΔE 11.7 deutan / 14.3 protan** (dark) and **18.0 / 12.2** (light) — comfortably
above the ΔE 8 floor.

The light variant uses the darker Okabe–Ito members. Evolution Stones becomes a deep gold rather
than Okabe–Ito's yellow, because `#F0E442` is only **1.32:1** on white; the gold must also stay dark
enough to avoid colliding with the vermillion under red-green CVD.

**Known limitation:** under **tritanopia** (blue-yellow, ~0.01% of people) Berries and TMs sit at
ΔE 0.6 in the light theme. Not resolvable while keeping Okabe–Ito, which is optimised for the far
more common red-green types. The mitigation below covers it.

**Required alongside the categorical palette — identity must never rest on colour alone:**
- a **2px surface-coloured gap** between adjacent doughnut segments
- a legend listing each segment's **label, value and percentage share**

**Feel:**
- Clean and minimal with real whitespace. Cards get generous internal padding (24px), and the gaps
  between cards should be visible — do not let tiles crowd each other.
- Subtle elevation, rounded corners (`rounded="lg"`), no heavy borders, no drop-shadow drama.
- KPI values are the largest type on the page. Labels above them, small and muted, uppercase,
  letter-spaced. Trend indicators small and below the value.
- Numbers formatted with thousands separators. Rates shown as one decimal percent (`94.2%`).
- Charts have no gridline clutter — horizontal gridlines only, at low opacity, no chart borders.
- System font stack or Inter. No decorative fonts.

---

## 7. Nice to haves

Only after everything above works and is committed:

- Animated count-up on KPI values when filters change
- Hover lift on the metric cards
- A sparkline inside each metric card showing that metric's twelve-month shape
- "Grounded" courier rows subtly dimmed in the roster
- A small storm icon on the trend chart at the Jul–Aug dip

## 8. Definition of done

- [ ] Runs clean with `npm run dev` — no console errors, no TypeScript errors
- [ ] `npm run build` succeeds
- [ ] All four KPI cards, three charts, and the courier roster render with real values from the JSON
- [ ] Both filters work, and work together
- [ ] At least one Pokémon sprite visibly renders in the courier roster
- [ ] Theme toggle works both directions
- [ ] Nothing is left over from the Vue starter template (no `HelloWorld.vue`, no Vue logo,
      no starter CSS, no `AboutView.vue`)
- [ ] Committed and pushed to GitHub
- [ ] Live Vercel URL loads and works

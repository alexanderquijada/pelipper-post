# Pelipper Post & Freight — Executive Operations Dashboard

> **TL;DR** — A single-page internal analytics dashboard for the Regional Operations Director
> of Pelipper Post & Freight, a Pokémon-powered air-and-sea parcel carrier. She pulls it up in
> leadership meetings to answer one question: *are we getting packages where they need to go?*
> Light (daylight sky) theme by default with a dark toggle, Vue 3 + Vuetify 3, mock data from a
> local JSON file, and two filters that update every number and chart on the page.

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
| `firstAttemptRate` | Share delivered on the first attempt, 0–1 | 0.78 – 0.94 |
| `avgTransitDays` | Average days in transit. **Dips in Gym Season, spikes in storms.** | 1.4 – 4.2 |
| `damagedParcels` | Parcels damaged in transit | ~0.4–1.8% of `parcelsDelivered` |
| `returnedParcels` | Parcels that never landed and came back | — |
| `costPerParcel` | Cost to move one parcel, in Pokédollars. **Rises in storm season.** | 180 – 420 |
| `capacityUtilization` | Load factor, 0–1 | 0.55 – 0.92 |
| `exceptionsByCause` | Object: exceptions per cause, sums **exactly** to `faintedCouriers + returnedParcels`. Causes: Storm grounding · Recipient absent · Cargo damaged · Courier fainted · Route blocked. **Storm grounding must dominate in Jul–Aug.** | — |

### Cargo properties (new top-level block)

`cargoProperties`, keyed by cargo type: `avgWeightKg` · `damageRate` · `avgTransitDays` ·
`revenuePerParcel`. **Evolution Stones are the heaviest and most valuable; Berries the most
perishable (highest damage rate); TMs the lightest.** All enforced by the validator.

### Courier operations

Each courier also carries `stopsPerRun` · `firstAttemptRate` · `restDaysTaken` · `tenureMonths`.

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

#### Cargo item sprites

The five cargo types each get an item sprite, from the same CDN and under the **same
hotlink-never-store rule**:

```
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/{name}.png
```

| Cargo type | File | Verified |
|---|---|---|
| Poké Balls | `poke-ball.png` | HTTP 200 · 30×30 · 256 B |
| Berries | `oran-berry.png` | HTTP 200 · 30×30 · 275 B |
| Potions | `potion.png` | HTTP 200 · 30×30 · 300 B |
| TMs | `tm-normal.png` | HTTP 200 · 30×30 · 369 B |
| Evolution Stones | `fire-stone.png` | HTTP 200 · 30×30 · 330 B |

All five were curl-verified on 2026-09-18 — every one returned **HTTP 200**, so no substitutions
were needed. Add the item-URL builder to `src/utils/sprites.ts` alongside the courier one; same
rule, one place.

**These are 30×30 pixel art.** Any element displaying them must set:

```css
image-rendering: pixelated;
```

Without it the browser smooths them on scale-up and they turn to mush. Scale by whole-number
multiples where practical (30 → 60) so the pixel grid stays square. The same `@error` fallback
applies — a missing item sprite must never render as a broken image.

Use them where a cargo type is named: the Cargo Mix legend rows, and the chart tooltip if it reads
well. They supplement the colour swatch, they don't replace it — the legend must keep its label,
value and share (see §6).

#### App bar icon and favicon

Both become the **Pelipper sprite, dexId 279**, replacing `mdi-mail`:

```
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/279.png
```

Use the **96×96 pixel sprite** above, not the official artwork — verified HTTP 200, 840 bytes, and
at app-bar and favicon sizes the pixel version is sharper and ~155× smaller than the 475×475
artwork. `image-rendering: pixelated` applies here too. Keep the official-artwork path for the
courier roster avatars, which render large enough to want it.

The favicon is set by pointing `<link rel="icon">` at that URL — still hotlinked, still nothing
stored in the repo. **Keep a fallback for the app bar icon** (`mdi-mail` is fine) so a CDN outage
degrades to an icon rather than a gap in the wordmark.

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
- **Six routes**, lazy-loaded: `/` Overview · `/trends` · `/signals` · `/cargo` · `/network` ·
  `/couriers`. Unknown paths redirect to `/`. See `CLAUDE.md` rule 6.
- **Filter state is shared across all six pages** — `selectedMonth` and `selectedRegion` live at
  module scope in `useMetrics.ts`, so a filter set on one page is still set on the next.
- Deploys to Vercel as a static Vite build

`src/assets/` exists again as of the map work — it holds **original artwork authored for this
project**, and nothing else. It is not for third-party images: the Pokémon sprite rule in §2 is
unchanged, and those stay hotlinked and uncommitted. Anything that lands in `assets/` must be ours.

**Structure:**

```
src/
  main.ts                    Vuetify plugin + theme registration
  App.vue                    shell: sidebar nav, top bar, filters, router-view
  router/index.ts            six lazy-loaded routes
  views/
    OverviewView.vue         / — the highlights, one card per section
    TrendsView.vue           /trends
    SignalsView.vue          /signals
    CargoView.vue            /cargo
    NetworkView.vue          /network
    CouriersView.vue         /couriers
  components/
    MetricCard.vue           custom reusable KPI card
    CourierRoster.vue        courier table with sprites
    CriticalSignals.vue      computed alert rows
    TopCargoCategories.vue   cargo bars with item sprites
    ReliabilityHealth.vue    health metric rows
    PageHeader.vue           title + subtitle + filter summary, used by every page
    charts/
      BarSeriesChart.vue     bars, optional target line
      DeliveryTrendChart.vue twelve-month area panels
      CargoTrendChart.vue    cargo mix over twelve months
      SparkLine.vue          small per-region trend
      chartTheme.ts          series palettes + theme-aware axes
  assets/
    delivery-map.svg         ORIGINAL illustrated world map, drawn for this
                             project. RETAINED BUT UNREFERENCED since the
                             dashboard was restructured — see §8 of the status doc.
  data/metrics.json          mock dataset
  types/metrics.ts           TypeScript interfaces for that dataset
  utils/sprites.ts           dexId -> sprite URL
  composables/useMetrics.ts  filtering + aggregation logic
```

---

## 4. Layout

A **dense, multi-card executive dashboard**: persistent left sidebar, top bar, a compact KPI strip,
then rows of mixed-width cards. The conventions and density are borrowed from standard SaaS
analytics dashboards; **the palette, wordmark and content remain entirely ours** — no other
product's branding, naming or colour scheme appears anywhere.

Content column is centred, **max-width 1440px**, sitting on the sky gradient from §6.

### App shell

**Left sidebar** — `v-navigation-drawer`, **220px**, `permanent` on desktop, collapsing to a **rail
below 960px**:

- Pelipper sprite + **Pelipper Post & Freight** wordmark, with **Executive Dashboard** beneath as
  small muted subtitle
- Nav items, in this order — **it must match the reading order of the Overview cards**:
  **Overview · Trends · Signals · Cargo · Network · Couriers**
- These are **real routes.** The active item comes from the current route — there is no scroll-spy.
- Pinned to the bottom: a **theme toggle** row. This is the only theme toggle in the app.

**Top bar** — **Pelipper Operations** as the heading, with **"Data through Sep 2026"** beneath it in
small muted text. On the right: the **two filters** only (Month and Region — they move up
here, replacing the old standalone filter row). **The theme toggle lives in the sidebar footer and
appears exactly once** — the top bar already carries the filters.

### Density

The page previously read oversized because the **type scale** was too large, not because the spacing
was wrong. These values are the specification, not suggestions:

| Element | Value |
|---|---|
| KPI value | **28px / 700** |
| KPI label | **11px**, uppercase, `letter-spacing: .06em`, muted |
| KPI delta | a small tinted **pill** — rounded chip, tinted background, **11px**. Not bare arrow text. |
| Card title | **15px / 600** |
| Card subtitle | **12px** muted, one line. See *Card copy* below — the exact strings are specified, not invented. |
| Card padding | **20px** |
| Grid gutter | **16px** |
| Card radius | **12px** |
| Card treatment | **1px hairline border + a very soft shadow** — not heavy elevation |
| Trend chart height | **240px** |
| Doughnut height | **200px** |
| Region bar height | **200px** |
| Roster row height | **44px**, compact density |
| Content max-width | **1440px** |

**Row order on Overview:** KPI strip / trend + region bars / the three derived cards / courier roster.

### Governing rule — one dimension per page, one home per metric

**Each page owns one dimension**, and **a metric's HEADLINE value appears on exactly one card in the
whole app.** A different *cut* of the same metric is allowed only when that cut is the page's own
dimension.

| Page | Dimension it owns |
|---|---|
| Overview | the headline figures, every card linking out |
| Trends | **when** — time series only |
| Signals | **what's wrong** — exceptions and breaches |
| Cargo | **what** — cargo properties, not volume repeated |
| Network | **where** — regional comparison |
| Couriers | **who** — the fleet |

So *parcels delivered over twelve months* belongs on Trends (its dimension is time) and *parcels
delivered by region* belongs on Network (its dimension is place) — but the **headline total** appears
once, on Overview, and nowhere else.

**This rule exists because it was broken:** parcels-delivered appeared on five separate cards at
once. Before adding a card, check where that metric already lives.

### The six pages

**Overview (`/`) is the highlights and stays as it is — do not add to it.** Each of its cards carries
a **"View details →"** link in the card header, routing to the page that expands it.

Every page opens with a **title**, a **descriptive subtitle**, and the **"Showing N months across N
regions"** line beneath the title. All five detail pages draw from the same `metrics.json` — no new
data, and no changes to that file.

| Page | Contains |
|---|---|
| **`/trends`** | The twelve-month chart at full width and taller · Parcels by Region · a month-by-month table (12 rows: parcels, Poké Balls, berries, gym runs, fainted, on-time) · six small sparklines, one per region |
| **`/signals`** | Every signal, uncapped, grouped under **Critical / Warning / Healthy** with counts and details expanded by default · a per-region on-time table against the 93% target |
| **`/cargo`** | The horizontal cargo bars · a cargo-by-region matrix (6 regions × 5 types) · cargo mix across the twelve months. Item sprites throughout |
| **`/network`** | The health rows · a six-region comparison table (parcels, on-time, fainted, gym runs, avg monthly volume) · on-time by region with a 93% target line · fainted couriers by month |
| **`/couriers`** | The full roster · a card per courier with a larger sprite and their stats · on-time rate compared across couriers · a status breakdown of On Route / Resting / Grounded |

The filter controls stay in the **top bar** and apply to **every** page.

### Card copy

Every card carries a one-line subtitle that says **what the card shows** — nothing about how the
number is derived, which filter it respects, what the thresholds are, or what the dot colours mean.
That is implementation detail; a reader in a meeting needs to know what they are looking at.

**These strings are the specification. Do not paraphrase them per phase.**

| Card | Subtitle |
|---|---|
| Gym Supply Runs & Parcels Delivered | Monthly parcel volume and gym supply runs over the trailing twelve months. |
| Parcels by Region | Total parcels delivered by region. |
| Critical Delivery Signals | Notable shifts in network performance. |
| Top Cargo Categories | Parcels delivered by cargo type. |
| Network Reliability & Fulfillment Health | Key delivery and fleet health measures. |
| Courier Roster | Couriers, their home regions, and delivery performance. |

The **Overview** section heading takes the filter summary as its subtitle —
*"Showing 12 months across 6 regions · Trends compare Sep 2026 to Aug 2026."* — sitting directly
beneath the heading. It appears there and nowhere else.

**No page footer**, and **no "About this data" dialog**. The fabricated-data disclosure lives in
`README.md`, which carries a dedicated *All of the data is fake* section; it does not need repeating
as page chrome. The top bar reads **"Data through Sep 2026"** and nothing more.

### Sections, top to bottom

1. **KPI strip — five cards**, not four:
   **Parcels Delivered · Poké Balls Shipped · On-Time Rate · Gym Supply Runs · Fainted Couriers**
   (inverted). On-Time Rate uses the existing **weighted-average** logic — weight by
   `parcelsDelivered`, **never average an average**.

2. **Trend row** — the twelve-month chart (below, under *Trends*) at **two-thirds width**, with
   **Parcels by Region** beside it at **one-third**.

3. **Critical Delivery Signals** — a list of alert rows. Each row: a **severity dot**
   (red / amber / green), a **one-line finding**, and an **expandable detail line**.
   **Computed from the data, never hardcoded.** Must cover at least:
   - the storm-season exception spike
   - any region under a **93% on-time target**
   - the largest single month-over-month on-time drop
   - the fastest-growing region
   - the December berry-rush strain

   Sorted **most severe first**, and **respects both filters**. A signal that cannot be computed
   under the current filters (for example a month-over-month comparison with no prior month) is
   omitted rather than faked.

   *Items 3, 4 and 5 share one row — three cards across on desktop.*

4. **Top Cargo Categories** — horizontal progress bars, one per cargo type: the **PokeAPI item
   sprite**, the label, the absolute value and the share. The bar fill uses **that cargo type's
   existing categorical chart colour** (§6 — unchanged). Sorted descending.

5. **Network Reliability & Fulfillment Health** — metric rows, each a **coloured dot + label +
   right-aligned value**: On-Time Rate, **Avg Monthly Parcel Volume**, Fainted Couriers per 1k
   Parcels, Couriers On Route vs Grounded, Busiest Region, Quietest Region. The dot colour reflects
   whether that value is **healthy**, not merely what it is.

6. **Courier roster** — **full width, in its own row** below the three derived cards. Table with: circular sprite avatar, courier name, species, home
   region, total runs, on-time rate, and status as a coloured chip. Respects the region filter.
   Compact density, 44px rows.

**Removed:** the **Cargo Mix doughnut** — it displayed exactly the same data as *Top Cargo
Categories*, and the bars carry more (item sprite, absolute value and share). One view of one
dataset, not two. Also removed: the Delivery Network map section. `src/assets/delivery-map.svg` is **kept in the repo
but is no longer referenced** by any component — see §8 of `PELIPPER-POST-STATUS.md`.

**Trends (the twelve-month chart)** — one card, **two vertically stacked area panels sharing one
time axis**: Parcels Delivered on top, Gym Supply Runs beneath. Each panel has its own y-axis, both
starting at zero, with the y-gutters pinned to the same width so the two time axes line up.

**Not a dual-axis chart, deliberately.** Parcels Delivered runs in the tens of thousands and Gym
Supply Runs in the tens — roughly a 200x gap. Plotted against two y-scales in one frame the smaller
series flattens against the axis, and where the lines cross becomes an artefact of the scales chosen
rather than anything real.

The card always shows all twelve months (it is the trend view) but respects the region filter, and
marks the selected month on both panels when one is chosen.

**Grid:** `v-container` / `v-row` / `v-col` with responsive breakpoints. Mixed-width rows are the
point — do not make every card full width.


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
- **Theme toggle** — switches Vuetify between the light and dark themes. **Light is the default**
  (see §6). The sky gradient and drifting clouds belong to the light theme only; toggling to dark
  replaces them with the flat dark background rather than layering them.
- **Loading / empty states** — if a filter combination yields no data, show a short centered message
  rather than blank charts or `NaN`.
- Everything is reactive and instant. No page reloads, no spinners.

---

## 6. Style

**Light by default.** Register two named Vuetify themes, `pelipperLight` (**default**) and
`pelipperDark`. Dark stays available on the toggle — it is no longer the starting state.

The reason for the switch is thematic: this is a carrier whose couriers fly. A daylight sky is the
right backdrop for that, and it lets the delivery-network card in §4 read as something airborne.

Cohesive palette drawn from Pelipper — white body, blue wings, orange beak. **Not a rainbow.**

| Token | Light (**default**) | Dark |
|---|---|---|
| background | `#DCEAF7` ⟵ *new, sky* | `#0E1621` |
| surface (cards) | `#FFFFFF` — **unchanged, do not tint** | `#16202E` |
| primary | `#2E6E92` | `#4FA3D1` |
| secondary | `#4FA3D1` | `#7FD1E8` |
| accent | `#E08A3C` | `#F2A65A` |
| success | `#3E9E70` | `#5FBF8F` |
| error | `#D1523C` | `#E8705A` |
| on-surface text | `#16202E` | `#E6EDF3` |
| muted text | `#4E6174` ⟵ *new, darkened* | `#8FA3B8` |

Two tokens change, and both changes are forced by measurement rather than taste:

**`background` `#F4F7FA` → `#DCEAF7`.** A soft sky blue instead of a near-white grey. This is the
base colour *and* the fallback beneath the gradient below.

**`muted` `#5C7186` → `#4E6174`.** The app-bar tagline and the footer line sit on the page
background, not on a card. Against the deepest gradient stop the old value measured **3.87:1** —
under the 4.5:1 body-text floor. `#4E6174` is the lightest value tested that clears it on both
surfaces: **4.90:1 on the sky, 6.39:1 on a white card.**

> ### ⚠️ `surface` stays `#FFFFFF`. Do not tint the cards.
>
> This is a hard constraint, not a preference. The five light-variant chart colours below were
> verified against `#FFFFFF` specifically, and **TMs `#CC79A7` measures 3.06:1 — only 0.06 above the
> 3:1 floor.** Any tint at all pushes it under:
>
> | Card surface | TMs `#CC79A7` |
> |---|---|
> | `#FFFFFF` | **3.06** ✅ |
> | `#FAFCFF` (barely perceptible tint) | 2.98 ❌ |
> | `#F6FAFE` | 2.92 ❌ |
> | `#F0F7FD` | 2.83 ❌ |
> | `#E8F2FB` | 2.70 ❌ |
>
> The sky must therefore live **behind** the cards, never in them. Opaque white cards on a sky
> background is the design — not translucent cards, not tinted ones. If a future change really needs
> a tinted card surface, the chart palette has to be re-derived first; do not adjust one without the
> other.

### Sky background — gradient and clouds

The page background (`pelipperLight` only) is a soft daylight sky, built entirely from **original
CSS and inline SVG. No external image files, no new dependencies.**

**Gradient** — deeper at the top, paler toward the horizon:

```css
linear-gradient(180deg, #CFE4F7 0%, #E3F0FA 45%, #F2F8FD 100%)
```

Fixed to the viewport so it doesn't visibly slide as the page scrolls.

**Clouds** — 2–3 layers drifting horizontally at **different speeds**, slowest layer furthest
"back". The speed difference is what creates depth; identical speeds just read as one moving
texture. Shapes should be soft overlapping ellipses or blurred SVG blobs at low opacity — suggestive
of cloud, not photographic. Very slow: a full traverse should take on the order of a minute or more.
This is ambient, and anything fast enough to notice is too fast to sit behind a dashboard someone
reads in a meeting.

**Cards stay fully opaque** so no cloud ever passes behind text or a chart. Everything in §4 sits on
`surface`, above the sky.

**Reduced motion:** under `@media (prefers-reduced-motion: reduce)` the drift **stops**. Keep the
gradient and keep the clouds visible in a static position — remove the animation, not the artwork.

**Dark theme keeps its flat `#0E1621` background.** No sky, no clouds. The sky is the light theme's
character; the dark theme's is calm and recessive, and dropping clouds into it would fight the
palette for no gain.

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
- **Dense and information-first, not airy.** This is an executive dashboard read on a laptop in a
  meeting — the goal is a lot of trustworthy information on one screen, not generous whitespace.
  The exact type scale, padding, gutter and radius values are in §4 under *Density* and they are
  the specification.
- Cards carry a **1px hairline border and a very soft shadow**. Not heavy elevation, not drop-shadow
  drama, and not borderless.
- **KPI values are 28px/700** — prominent, but no longer the dominant type on the page. Labels sit
  above them at 11px uppercase and letter-spaced; the change-versus-previous reads as a small
  **tinted pill**, not bare arrow text.
- Every card carries a **one-line 12px muted subtitle** saying what it shows. A number without a
  stated basis is not self-explanatory to someone reading it for the first time in a meeting.
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
- [ ] Theme toggle works both directions, **starting from light**
- [ ] Nothing is left over from the Vue starter template (no `HelloWorld.vue`, no Vue logo,
      no starter CSS, no `AboutView.vue`)
- [ ] Committed and pushed to GitHub
- [ ] Live Vercel URL loads and works

Added with the §2 / §4 / §6 extension:

- [ ] All five cargo item sprites render, hotlinked, with `image-rendering: pixelated`
- [ ] The app bar icon and the favicon are the Pelipper sprite, with an icon fallback
- [ ] All six routes load, lazy-loaded, with unknown paths redirecting to `/`
- [ ] The sidebar highlights the active route, in the order Overview · Trends · Signals · Cargo ·
      Network · Couriers
- [ ] A filter set on one page is still set after navigating to another
- [ ] The KPI strip shows **five** cards, with On-Time Rate weighted by `parcelsDelivered`
- [ ] Critical Signals, Top Cargo Categories and Network Reliability are all **computed** from
      `metrics.json` and all respond to **both** filters
- [ ] The §4 density values are applied as written (28px KPI value, 20px card padding, 16px gutter,
      12px radius, hairline border)
- [ ] Light is the default theme on first load
- [ ] The sky gradient and 2–3 cloud layers drift at different speeds, and cards stay fully opaque
- [ ] **`prefers-reduced-motion: reduce` stops both** the cloud drift and the Pelipper's flight,
      and both the sky and the network card still read correctly when static
- [ ] The card surface is still `#FFFFFF` and the chart palettes are **unchanged**

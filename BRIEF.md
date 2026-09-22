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

Each courier also carries `stopsPerRun` · `firstAttemptRate` · `restDaysTaken` · `tenureMonths` ·
`avgTransitDays` · `damageRate`.

**There are eight couriers.** The eighth, **Dawdle** (Slowpoke, dexId 79, Johto), is a **deliberate
outlier and must stay one**: the slowest transit and fewest stops per run in the fleet by a clear
margin, the lowest on-time rate — but the **best damage rate** and a **high first-attempt rate**.
Slow, not careless. The validator enforces every one of those relationships, so a future
regeneration cannot quietly smooth him toward the rest of the fleet.

### Weather (new top-level block)

`weather` — **current conditions per region, not a monthly series.** It is point-in-time context for
delay risk and **does not respond to the month filter.**

Per region: `condition` · `icon` (an `@mdi/font` name) · `tempC` · `windKph` · `visibilityKm` ·
`delayRisk` (`Low` | `Moderate` | `High`) · `note`.

Set for late September, with storm season just past, and coherent with each region's character:
Kanto clear (Low) · Johto partly cloudy (Low) · Hoenn rain easing (Moderate) · Sinnoh snow at
altitude (High) · Unova windy (Moderate) · Galar fog and drizzle (Moderate).

**`delayRisk` must FOLLOW from `condition`**, never be set independently:

| Condition | Delay risk |
|---|---|
| snow, storms / lightning | **High** |
| fog, wind, rain / hail | **Moderate** |
| clear, partly cloudy | **Low** |

A risk that doesn't follow from the weather is unreadable — nobody can tell a deliberate exception
from a typo. `scripts/validate-data.mjs` derives the expected risk from the icon name and fails the
build on any mismatch.

**Icon names must be verified to render** — a wrong MDI name produces an empty box, not an error, so
it survives every test that only checks the element exists. The validator now checks each `icon`
against the `mdi-*` classes actually defined in the installed `node_modules/@mdi/font` stylesheet.

**The name existing is not sufficient — the glyph has to read at its rendered size.** `mdi-weather-snowy`
is a real icon that draws a cloud with one small flake; at 20px the flake disappears and it reads as
plain cloud. Sinnoh uses **`mdi-weather-snowy-heavy`** for that reason. Render each icon and look at
it; don't stop at "the class exists".

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
- **Six routes**, lazy-loaded: `/` · `/trends` · `/exceptions` · `/cargo` · `/regions` ·
  `/couriers`. `/signals` and `/network` redirect to the renamed `/exceptions` and `/regions`;
  anything else redirects to `/`. See `CLAUDE.md` rule 6 for the full name table.
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

- A **brand lockup** (`BrandLockup.vue`): the Pelipper sprite at 44px beside a two-line wordmark —
  **PELIPPER** at 17px/800 over **POST & FREIGHT** at 8.5px/600 with 0.17em letter-spacing in the
  primary colour. Original design; it does not imitate any real carrier's branding. In the collapsed
  rail only the sprite shows.
- Nav items, in this order — **it must match the reading order of the Overview cards**:
  **Overview · Monthly Trends · Exceptions · Cargo & Revenue · Regions · Courier Fleet**
- These are **real routes.** The active item comes from the current route — there is no scroll-spy.
- Pinned to the bottom: a **theme toggle** row. This is the only theme toggle in the app.

**Top bar — account identity only.** A right-aligned block: circular avatar, **Wren Calloway**,
*Regional Operations Director*, `wren.calloway@pelipperpost.pkm`. **All invented** — not a real
person and not any Pokémon character. No page heading, no data-vintage line, no filters.

The avatar falls back to a **Pokémon sprite** (Noctowl, 164) in the circular frame: the PokeAPI
sprites repo has **no trainers directory** — it holds only `badges`, `items`, `pokemon` and `types`
— so every `sprites/trainers/*` path 404s. Noctowl is deliberately neither the Pelipper brand mark
nor any of the eight couriers.

**The top bar is OPAQUE, deliberately.** A translucent bar over arbitrary scrolling content cannot
guarantee text contrast, because what sits behind it is unknowable and changes as the page moves.
The account name, role and email all clear **4.5:1 in both themes** with a chart scrolled beneath,
and the role and email carry extra weight — thin grey small text is the worst case for legibility.

**The sidebar is glass** — semi-transparent over the sky with `backdrop-filter: blur(18px)
saturate(1.5)` and a hairline right border. **A solid-surface fallback is required** under
`@supports not (backdrop-filter: ...)`, so label legibility never depends on a blur that isn't
happening. Nav-label contrast, measured from composited pixels: **7.97:1 light, 5.08:1 dark.**

**The theme toggle lives in the sidebar footer and appears exactly once.**

### Card nesting — maximum two levels

**Level 1** — the outer page container card.
**Level 2** — content cards inside it, on a surface that clearly separates them from level 1.
**Level 3 and deeper — NOT cards.** Horizontal separator lines and spacing only: no borders, no
elevation, no card background.

The level-2 surface differs by theme, and the reason matters:

| | Level 1 (shell) | Level 2 (cards) |
|---|---|---|
| Light | `#F1F5F9` *(tinted)* | `#FFFFFF` |
| Dark | `#131C28` | `#1E2A3A` *(lifted)* |

In **dark** this is as first specified — level 2 lifts above the shell. In **light** the
relationship is inverted, with the shell tinted and level-2 cards left pure white, because **any
perceptible off-white on a level-2 card drops the verified categorical palette below 3:1** — TMs
`#CC79A7` reaches 2.98 at `#FBFCFD`. Level 2 still reads as lifted from level 1 in both themes,
which is the actual goal; the palette is not negotiable for it.

### Nested card shell

Every page's content sits inside **one outer container card** — `PageShell.vue`, **16px radius,
24px padding**, on the sky. Inside it, in order: **page title · descriptive subtitle · the filter
row · the grid of inner cards.**

Inner cards take the **lighter** treatment — 12px radius, hairline border, minimal shadow — so the
nesting reads as nesting rather than cards stacked on cards.

**The filters live in the shell**, on their own row above the inner cards, not in the top bar. They
remain module-level state shared across all six routes.

**The control bar** replaces the two labelled selects, which read as a form:

```
[ 12M | 6M | 3M | 1M ]  [ Oct 2025 – Sep 2026 ▾ ]        [region chips]
```

- **Segmented control**, pill-shaped, muted fill, the active segment *raised* with a soft shadow.
  A `radiogroup`: arrow keys move and select, Home/End jump to the ends, focus rings visible.
- **A range chip** showing the resolved span, opening a menu of specific months. Picking a month
  clears the preset; picking a preset clears the month — the two are mutually exclusive by
  construction, not by convention.
- **Region chips**, single-select, active chip using an accent **tint** not a heavy fill. Wraps to
  its own line below 1200px rather than overflowing or shrinking.
- **A Reset link**, shown only when the selection isn't the default 6M + All Regions.
- The scope line and the comparison caption sit **under the page title**, not in this row.

**The time filter is a RANGE.** `MonthSelection` is either `{ kind: 'preset', months }` or
`{ kind: 'month', key }` — modelled explicitly so the two cases can't be confused.

**The trend compares the selected window against the equal-length window immediately before it.**
6M compares against the prior 6 months, 3M against the prior 3, a single month against the prior
month. **Where no full preceding window exists, there is no trend** — the card says so rather than
inventing a partial comparison. The 12M preset therefore shows no deltas: it spans the entire
twelve-month dataset, so there is nothing before it.

**The default preset is 6M**, not 12M. The rule above is correct, but pairing it with a 12M default
meant the landing page — the most-viewed screen in the app — rendered every KPI with no delta at
all. 6M resolves to Apr–Sep 2026 against Oct 2025–Mar 2026, so trends are present on first load.
The fix is the default, never a special case in the comparison logic.

**Every row must be fully occupied.** No dead negative space at the end of a row, and cards grow and
shrink with how many are in the row. Where a count doesn't divide the 12-column grid — five KPI
cards, for instance — use an auto-fit CSS grid rather than `v-col` widths that leave a gap.

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
| Network Overview | the headline figures, every card linking out |
| Monthly Trends | **when** — time series only |
| Exceptions | **what's wrong** — exceptions and breaches |
| Cargo & Revenue | **what** — cargo properties, not volume repeated |
| Regions | **where** — regional comparison |
| Courier Fleet | **who** — the fleet |

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
| **`/trends`** | The twelve-month chart, gradient-filled · on-time over time with **both** reference lines · cost per parcel over time · a **month × region seasonality heatmap** (CSS grid, normalised per row so the seasonal shape shows rather than region size) · a peak-vs-trough callout · the month-by-month table |
| **`/exceptions`** | Every signal, uncapped, grouped under **Critical / Warning / Healthy** with counts and details expanded by default · a **waterfall** of exceptions by cause · exceptions over time · first-attempt failure cost · regions below the 93% target |
| **`/cargo`** | The horizontal cargo bars · a cargo-by-region matrix (6 regions × 5 types) · cargo mix across the twelve months. Item sprites throughout |
| **`/regions`** | The health rows · parcels by region · **bullet charts** for on-time vs the 93% target, one per region · capacity and transit by region · region growth · the six-region comparison table |
| **`/couriers`** | The full roster · a card per courier with a larger sprite and their stats · **lollipop/dot plots** (stops per run, first-attempt rate, rest days) each against the fleet average · a status breakdown of On Route / Resting / Grounded |

The filter controls stay in the **top bar** and apply to **every** page.

**Page titles are identical in treatment across all six pages** — one shared `PageHeader.vue`
renders title, subtitle and the filter-scope line. **20px / 700** title, **13px** subtitle, **12px**
muted scope line, all in the app font stack. No page styles its own heading.

### Card copy

A card title names **the question the card answers**, and the subtitle says **what the reader is
looking at and why it matters** — in plain language. A subtitle never restates the title, never
describes how the number is derived or aggregated, never names a filter or threshold, and never
leaves jargon unexplained. That is implementation detail; a reader in a meeting needs to know what
they are looking at.

**Explaining an unfamiliar visual ENCODING is allowed, and often necessary. Explaining arithmetic
is not.** These look similar and are not:

| | |
|---|---|
| ✅ *"Larger bubbles mean more failed deliveries."* | tells the reader how to decode a mark they may never have seen |
| ✅ *"Darker means busier."* | same — the heatmap ramp has no meaning until it's named |
| ❌ *"How each cause builds the exception total."* | describes the aggregation, which is not the reader's problem |
| ❌ *"Weighted by parcels delivered."* | method, not meaning |

A scatter or bubble chart is the clearest case: most readers meet one rarely, and a third variable
encoded as area is invisible until stated. Saying so is not clutter — it is the difference between
a chart that can be read and one that can only be admired.

Euphemism is its own failure. *"Keeping their promises"* sounds considerate and tells a reader
nothing measurable; *"how often it arrives on time"* is the same length and is the actual thing.

**Card copy must be true under every filter combination.** A subtitle is chrome: it is rendered
identically whatever the range and region are, so any specific claim in it — *"berries at the
December rush"*, *"Evolution Stones earn far more per parcel"* — is wrong the moment a filter
excludes the data behind it. Select Kanto + Sep 2026 and a December claim sits beside a month of
data containing no December. **Findings belong where they are computed**, on Exceptions, where each
one is derived from the current slice and omitted when it can't be calculated. Subtitles describe;
they do not assert.

**These strings are the specification. Do not paraphrase them per phase.**

| Page | Card | Subtitle |
|---|---|---|
| Overview | Network Overview | The numbers to check first — volume, reliability, and what's going wrong. |
| Overview | Parcel Volume Trend | Whether we're shipping more or less than we were a year ago. |
| Overview | What Needs Attention | The three things most worth knowing about right now. |
| Overview | Top Cargo Types | The goods that make up the bulk of what we move. |
| Overview | Reliability Snapshot | Whether the fleet is coping, and where it isn't. |
| Overview | Weather Delays Today | Current conditions in each region, and how likely they are to delay deliveries. |
| Overview | Who's Delivering Best | Our couriers ranked by how often they arrive on time. |
| Trends | Monthly Trends & Seasonality | How the year unfolded, and which months reliably run hot or cold. |
| Trends | Volume Through the Year | Whether gym restocking rises and falls with overall parcel volume. |
| Trends | Are We Hitting Our Target? | Our monthly on-time record against what we promise and what rivals manage. |
| Trends | What Each Delivery Costs | When moving a parcel gets more expensive, and by how much. |
| Trends | Our Busiest and Quietest Months | How much more we move at peak than in the slowest month. |
| Trends | When Each Region Peaks | Darker means busier. One row per region, across the year. |
| Trends | The Full Year in Numbers | Every month's figures, if you need the exact value. |
| Exceptions | Exceptions & Delivery Risk | Deliveries that went wrong, why, and what fixing them costs. |
| Exceptions | Critical / Warning / Healthy | Needs attention now. / Worth watching. / Performing as expected. |
| Exceptions | Why Deliveries Fail | The most common reasons parcels don't arrive on time. |
| Exceptions | The Cost of Missed Deliveries | What we spend going back for parcels nobody was there to receive. |
| Exceptions | When Things Go Wrong | The months when failed deliveries spike. |
| Exceptions | Regions Below Target | Places where we're not keeping our delivery promise. |
| Cargo | Cargo Mix & Revenue | What we move, what it earns, and which goods are hardest to handle. |
| Cargo | What We Ship | The goods we move most, by number of parcels. |
| Cargo | How the Mix Shifts | Which cargo types rise and fall across the year. |
| Cargo | Where the Money Comes From | Which goods bring in the most money, not just the most parcels. |
| Cargo | What's Hard to Ship | Which goods are heaviest, slowest, and most likely to break. |
| Cargo | What Each Region Orders | Whether regions want different things, or the same mix everywhere. |
| Regions | Regional Performance | How each region is performing, and which are struggling. |
| Regions | Overall Network Health | The handful of measures that say whether the network is coping. |
| Regions | Who's Meeting the Target | Which regions keep their delivery promise, and which fall short. |
| Regions | Where the Volume Is | The regions carrying the most parcels. |
| Regions | How Full and How Fast | Whether regions are running near capacity, and how long delivery takes. |
| Regions | Which Regions Are Growing | Where volume is climbing, and where it's flat. |
| Regions | Busy vs Reliable | Each region plotted by how much it ships and how often it arrives on time. Larger bubbles mean more failed deliveries. |
| Regions | All Regions Side by Side | Every region's figures in one place for direct comparison. |
| Couriers | Courier Fleet | Who flies for us, how hard they work, and how well they deliver. |
| Couriers | Stops on a Typical Run | How many delivery stops each courier makes in one run. |
| Couriers | Who Gets It Right First Time | How often each courier delivers without needing a second trip. |
| Couriers | Time Off Taken | Days each courier has rested since joining the fleet. |
| Couriers | Who's Available Now | How many couriers are flying, resting, or grounded. |
| Couriers | Courier Roster | Couriers, their home regions, and delivery performance. |

Two titles are deliberately literal rather than interpretive. **Stops on a Typical Run** is route
density, not load — load is `capacityUtilization`, a different field on a different card, and
calling this one "how much each courier carries" conflates them. **Time Off Taken** states the
measure; a title like "Who Needs a Break" asserts a welfare judgement `restDaysTaken` cannot
support, since a low figure is equally consistent with a short tenure.

Overview's **Top Cargo Types** and Cargo's **What We Ship** are the same measure at two levels of
detail — the preview and the full page — and must not carry near-identical titles.

The **Overview** section heading takes the filter summary as its subtitle —
*"Showing 6 months across 6 regions · Trends compare Apr 2026 to Sep 2026."* — sitting directly
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

### Standing rule — never tint a colour with itself

**Vuetify's `variant="tonal"` chip is a contrast failure by construction.** It paints the theme
colour as text over a ~12% tint *of that same colour*, which is the one combination guaranteed to
have almost no luminance difference between foreground and background. Measured in this app before
the fix: **Moderate 1.86:1, Low 1.98:1, High 3.18:1** against a 4.5:1 requirement. The same fault
was hand-written into the KPI delta pill (`rgba(theme-colour, 0.14)` under `rgb(theme-colour)`).

There are no `variant="tonal"` chips left. Every pill in the app uses **`.pp-pill`** in `App.vue`,
which carries an **explicit, measured light/dark colour pair per tone** — not a computed tint:

| Tone | Light bg / text | Dark bg / text |
|---|---|---|
| `--bad` | `#FDEAEA` / `#A81E13` — 6.34:1 | `#3B1F20` / `#FFB4AB` — 8.82:1 |
| `--warn` | `#FCF0E1` / `#7A4405` — 7.04:1 | `#3A2A16` / `#FFD8A6` — 10.26:1 |
| `--good` | `#E6F4EB` / `#0F5D34` — 7.02:1 | `#16301F` / `#8FE3B4` — 9.36:1 |
| `--neutral` | `#E9EDF2` / `#37485C` — 7.96:1 | `#22303F` / `#B3C4D6` — 7.54:1 |

Three rules that come with it:

- **Pill backgrounds are opaque.** A translucent fill makes the measured ratio depend on whichever
  card happens to sit behind it, so the number stops being a property of the pill.
- **Pill text is 4.5:1, not 3:1.** At 11px it is *normal* text — the large-text exemption starts at
  18.66px bold or 24px regular. Nothing in this app is close.
- **Weight 600 minimum.** At 11px, 500 reads thin no matter what the ratio says.

### Standing rule — one visual channel per meaning

**A single channel encodes a single thing.** The weather icon's circle was tinted by *delay risk*,
which put a snowflake inside a red circle and a sun inside a teal one: the glyph said one thing and
its own background said another, with nothing telling the reader which meaning the colour carried.

Now the **weather icon carries the weather** — blue-grey snow, amber sun, slate fog, in
`WEATHER_LIGHT` / `WEATHER_DARK` — and the **chip alone carries the risk**. These tints are
weather-appropriate rather than categorical, so they never distinguish unordered categories and the
colour-blind constraint below doesn't bind; they still have to clear **3:1** as graphical objects
against both the circle and the card, which is why there are two variants.

**Any value shown as a colour, a chip or a bare number needs a visible label.** The delay-risk chip
read "High" beside "−3°C" with nothing naming it, so it could equally have meant high temperature.
Every place risk appears now labels it: a `Delay Risk` column header on the weather card, its own
column in the courier roster, and a `Delay risk` term in the courier tile's stat list.

### Standing rule — card copy must hold in every filter state

**Any string that is rendered identically regardless of the filters must be true for all of them.**
Titles, subtitles, axis labels, legends, column headers, empty-state text: all of it is chrome, and
chrome is written once and shown against every possible slice of the data. A subtitle that names a
month, a cargo type, a region or a direction of travel will eventually sit beside data that
contradicts it — Kanto + Sep 2026 is enough to falsify a claim about December.

The test is mechanical: **if changing a filter could make the sentence false, the sentence doesn't
belong in chrome.** Put findings where they are computed — the signals on Exceptions derive from the
current slice and are omitted when they cannot be calculated. The full approved copy table is in §4,
*Card copy*.

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

### Colour-blind constraints bind only where colour is the SOLE encoder

This is the rule that decides which palette a mark may use.

**Where colour is the only thing distinguishing one category from another** — the five-way cargo
doughnut and its bars — the palette must survive colourblind simulation as a *set*. That is
`CATEGORICAL_*` below, and **it does not change.**

**Where colour is decoration, or where the category is already carried by position, label or axis**
— a single-series trend line, a heatmap ramp, a bullet bar against its own labelled row, an icon
circle, a card accent tint — the set never has to be mutually separable, because nothing depends on
telling two hues apart. Those marks use the **editorial palette**.

**Editorial palette:** coral `#D94F6A` · indigo `#2F4B7C` · teal `#36B5C4` · orange `#F2A15C` ·
plum `#9B5FB5`.

**These must never be used as a categorical set.** Tested as one they fail: teal and mint collapse
to ΔE 2.1 under deuteranopia, and several miss 3:1 on one theme.

Each still has to clear **3:1 against the surface it sits on**, since it colours a visible mark.
Three of the five miss that at their base value, so there are two variants — pure lightness shifts,
same hue and saturation:

| | Light on `#FFFFFF` | Dark on `#16202E` |
|---|---|---|
| coral | `#D94F6A` **3.98:1** | `#D94F6A` **4.12:1** |
| indigo | `#2F4B7C` **8.68:1** | `#4871B9` **3.39:1** *(base was 1.89)* |
| teal | `#2E99A6` **3.37:1** *(base was 2.45)* | `#36B5C4` **6.69:1** |
| orange | `#DB6E11` **3.36:1** *(base was 2.09)* | `#F2A15C` **7.83:1** |
| plum | `#9B5FB5` **4.47:1** | `#9B5FB5` **3.67:1** |

Targeted 3.35:1 rather than exactly 3.0, so a slot isn't one surface tweak away from failing.

**Tinted icon circles.** Every icon sits in a circle filled with its own accent at **15%** opacity.
Circles are **34–40px** with **20–22px** glyphs; item sprites render at **exactly 30px (1×)**.

**The glyph is NOT the same value as its tint.** A glyph over a tint of its own hue converges with
it, so *deepening the tint makes contrast worse, not better*. Glyph colours are minimal lightness
shifts away from the tint — hue and saturation unchanged — each measured at **≥3.3:1 against its
own circle** and ≥3:1 against the card. Applies to KPI cards, list rows and nav items.

**Pixel-art sprites are scaled at integer multiples only.** PokeAPI item sprites are 30×30 with no
high-resolution source, so they render at 30/60/90px with `image-rendering: pixelated`. Fractional
scaling — the old 22px — is what made them look mushy. `image-rendering` is never applied by a
blanket `img` rule: the 475×475 brand artwork and the courier avatars must stay smoothed.

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

# Pelipper Post & Freight

> *"Your package, airborne."*

A single-page executive operations dashboard for **Pelipper Post & Freight**, a fictional
Pokémon-powered air-and-sea parcel carrier. It's built for one imaginary reader — a Regional
Operations Director who pulls it up in a leadership meeting and needs to answer one question in under
ten seconds: *are we getting packages where they need to go?*

The dashboard tracks parcel volume, perishable berry freight, gym restock runs and courier
casualties across six regions and twelve months, with two filters that recalculate every number,
chart and table on the page.

---

## Live site

**Deployment is pending.** The production URL —
[pelipper-post.vercel.app](https://pelipper-post.vercel.app/) — currently returns a Vercel
`DEPLOYMENT_NOT_FOUND` error and has never successfully served the site.

This is **not** a problem with the code in this repo: `npm run build` passes cleanly and the
dashboard runs correctly locally. The cause is Vercel-side — the account's build queue stalled, and
on the Hobby plan a single concurrent build slot is shared across the *entire account*, so a build
held elsewhere blocks this project indefinitely. The full diagnosis, including two earlier wrong
theories and why they looked convincing, is in
[`PELIPPER-POST-STATUS.md`](PELIPPER-POST-STATUS.md) §8.

Until that clears, run it locally — it takes about a minute.

---

## Running it locally

Requires **Node 22.18+ or 24.12+** (developed on Node 26).

```bash
git clone https://github.com/alexanderquijada/pelipper-post.git
cd pelipper-post
npm install
npm run dev
```

Then open **http://localhost:5173**.

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check with `vue-tsc`, then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `node scripts/validate-data.mjs` | Check `metrics.json` against every rule in the brief |

That last one is worth knowing about: the mock dataset has to satisfy value ranges, seasonality
rules and per-region personality traits, and the validator checks all 72 records against them. It
exits non-zero and explains itself in plain language if anything drifts.

---

## Tech stack

- **Vue 3** (`<script setup>`, Composition API) + **TypeScript**
- **Vite** as the build tool
- **Vue Router** — exactly one route (`/`); it's here because the capstone asks for it
- **Vuetify 3** for components and theming, plus **Material Design Icons** (`@mdi/font`)
  - pinned to the 3.x line — a bare `npm install vuetify` now resolves to 4.x
- **Chart.js** + **vue-chartjs** for all three charts
- State lives in a single composable, `src/composables/useMetrics.ts`. **No Pinia.**
- Data is a static JSON file. No backend, no API calls, no auth.

```
src/
  main.ts                       Vuetify plugin + the two named themes
  App.vue                       app shell, app bar, theme toggle
  router/index.ts               one route -> HomeView
  views/HomeView.vue            the dashboard (presentation only — no arithmetic)
  components/
    MetricCard.vue              reusable KPI card with typed props
    CourierRoster.vue           courier table with hotlinked sprites
    charts/
      RegionBarChart.vue
      CargoMixChart.vue
      DeliveryTrendChart.vue
      chartTheme.ts             series palettes + theme-aware axis colours
  composables/useMetrics.ts     ALL filtering and aggregation
  data/metrics.json             the mock dataset
  types/metrics.ts              TypeScript interfaces for that dataset
  utils/sprites.ts              dexId -> sprite URL, in one place
scripts/validate-data.mjs       dataset validator
```

---

## All of the data is fake

**Every number in this repository is fabricated.** The company does not exist. There is no real
carrier, no real logistics network, and no real courier roster. `src/data/metrics.json` was generated
to look like a plausible business — with seasonal peaks, a storm-season dip and distinct per-region
behaviour — precisely so the dashboard has something realistic to display.

**No client data, no employer data, and no real people appear anywhere in this project.**

---

## Pokémon sprites and trademark

Courier avatars are **hotlinked at runtime** from the community-maintained
[PokeAPI sprite repository](https://github.com/PokeAPI/sprites), using the URL pattern built in
[`src/utils/sprites.ts`](src/utils/sprites.ts).

**No sprite images are stored or redistributed in this repository.** If a sprite fails to load, the
avatar falls back to a Material Design icon rather than a broken image. Thanks to the PokeAPI
maintainers for keeping that resource public.

Pokémon and all associated names and imagery are trademarks of **Nintendo / Creatures Inc. /
GAME FREAK**. This is a non-commercial, fan-made learning exercise with no affiliation with, or
endorsement by, any of them.

---

## About this project

This is a **Protogen 200s capstone** — a training exercise whose real subject is the brief-first
workflow, not the code. The dashboard was specified in [`BRIEF.md`](BRIEF.md) before any of it was
written, then built in phases against that spec, with
[`PELIPPER-POST-STATUS.md`](PELIPPER-POST-STATUS.md) kept as a running decision log.

It was built for learning purposes only. **Vercel is not an approved Slalom tool for client or
internal work**, and nothing here is client or internal work — see the fabricated-data note above.

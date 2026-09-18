# PELIPPER POST & FREIGHT — Project Status

> **If you are Claude and you're reading this at the start of a session:** this file is the
> single source of truth for where this project stands. Read it, then read `CLAUDE.md` and
> `BRIEF.md`, then tell Alex where we left off and what's next. **Do not start work until he
> confirms.** Update this file at the end of every phase — it's how Alex picks this up on a
> different machine.

- **Last updated:** 2026-09-18 — Phase 4 complete (MetricCard extracted); deployment still unverified
- **Owner:** Alex Quijada (alex.quijada@slalom.com)
- **Project:** Protogen 200s Capstone 2 — Build an Exec Dashboard
- **Submission:** Microsoft Forms link on Workday — needs the GitHub repo URL + live Vercel URL

---

## 1. What this is

A single-page executive operations dashboard for **Pelipper Post & Freight**, a fictional
Pokémon-powered parcel carrier. It replaces the capstone document's "FastForward Logistics" premise
at Alex's request — the capstone explicitly allows the specifics to be defined by the student.

Metrics are fully Pokémon-themed (Poké Balls shipped, berry crates, gym supply runs, fainted
couriers) rather than generic freight KPIs. Courier sprites are hotlinked from the PokeAPI sprite
CDN and **never stored in the repo**.

Full spec: **`BRIEF.md`**. Build rules: **`CLAUDE.md`**. Phase prompts: **`CLAUDE-CODE-PROMPTS.md`**.

---

## 2. Key decisions already made — do not relitigate these

| Decision | Choice | Why |
|---|---|---|
| Company | Pelipper Post & Freight, *"Your package, airborne."* | Pelipper is the canonical Pokémon delivery bird |
| Repo / folder name | `pelipper-post` | Capstone says "my-dashboard" but the premise is ours to define |
| Data flavor | Fully Pokémon metrics | Alex's call over generic logistics KPIs |
| Assistant | Claude Code in the VS Code terminal | Capstone videos use Copilot; the workflow is identical and the rubric grades the process |
| Framework | Vue 3 + Vite + TypeScript + Vue Router (one route) | Required by capstone step 2.2 |
| Components | Vuetify 3 + `@mdi/font` | Required by capstone step 2.3 |
| Charts | Chart.js + vue-chartjs | Matches Video 204 |
| State | A single composable, `useMetrics.ts`. **No Pinia.** | Capstone says no Pinia |
| Data source | Static `src/data/metrics.json`, no backend | Required by capstone step 2.4 |
| Theme | Dark by default, light toggle. Pelipper blue/orange palette. | Style section of `BRIEF.md` |
| Deploy | Vercel, auto-deploy on push to `main` via GitHub integration | Fewer moving parts than the Vercel CLI |
| Git automation | Claude Code commits + pushes at the end of every phase, without asking | Allowed by `.claude/settings.local.json` |

**Excluded on purpose:** Pinia, any testing framework, ESLint, Prettier, JSX, Tailwind, auth,
a backend, extra routes/pages, mobile-first design. The project is deliberately scoped to exactly
what the capstone document and videos require — nothing more.

---

## 3. Phase status

| # | Capstone step | Phase | Status | Commit message |
|---|---|---|---|---|
| 0 | — | Local setup + repo creation — **automated by `setup.sh`** | ✅ Done | `Add project brief and documentation` |
| 1 | 2.1 | Static HTML prototype from the brief | ✅ Done | `Add static dashboard prototype` |
| — | 2.1 | Import repo into Vercel (browser, one time) | 🟡 Imported — live URL still 404s; build queue stalled, see §8 | — |
| 2a | 2.2 | Vue + Vite + TS + Router scaffold | ✅ Done | `Scaffold Vue project with Vite, TypeScript, and Vue Router` |
| 2b | 2.2 | Dashboard shell replaces starter content | ✅ Done | `Add dashboard shell` |
| 3 | 2.3 | Vuetify 3 + MDI, refactor shell | ✅ Done | `Add Vuetify 3 and refactor dashboard shell to Vuetify components` |
| 4 | 2.3 | Custom `MetricCard` component | ✅ Done | `Extract reusable MetricCard component with typed props` |
| 5 | 2.4 | Mock dataset `src/data/metrics.json` | ⬜ Not started | `Add realistic mock metrics dataset and TypeScript types` |
| 6 | 2.4 | Full dashboard — charts, filters, roster | ⬜ Not started | `Build full dashboard with charts, filters, and courier roster` |
| 7 | — | Final pass: cleanup, README | ⬜ Not started | `Final pass: cleanup, README, and documentation` |
| 8 | — | Submit repo + live URL on Workday | ⬜ Not started | — |

**Status key:** ⬜ Not started · 🟡 In progress · ✅ Done

---

## 4. → NEXT STEP

**Phase 5 — the mock dataset, `src/data/metrics.json`.** Paste the Phase 5 prompt from
`CLAUDE-CODE-PROMPTS.md`. Twelve months × six regions = **72 region records**, built to the shape and
the valid ranges in `BRIEF.md` §2, including the seasonality rules (Gym Season Mar–May, the December
berry rush, the Jul–Aug storm dip) and the six per-region personalities.

**Run `node scripts/validate-data.mjs` before building anything on the data** — it checks all 72
records against the ranges and every seasonality rule. `BRIEF.md` §2 says to, and the script is
already in the repo from Phase 0.

Phase 5 also replaces two sets of hardcoded placeholders: `KPI_CARDS` and `COURIERS`, both currently
inline in `HomeView.vue`.

**Deployment is still unverified** — see §8. Judge Phase 5 on `npm run dev` and `npm run build`
locally; the live URL will confirm separately once Vercel's build queue clears.

**If the queue is still wedged when the dashboard is finished,** §8 records a Vercel CLI fallback
(`vercel build` + `vercel deploy --prebuilt`) that builds locally and uploads the output, bypassing
Vercel's build system. It's a **last resort and unverified** — read the caveats in §8 before using
it. The normal git-push deploy is what the capstone is teaching.

---

## 5. Live links

| What | URL |
|---|---|
| **GitHub repo** — goes on the Workday form | https://github.com/alexanderquijada/pelipper-post |
| **Live dashboard** — goes on the Workday form | https://pelipper-post.vercel.app/ |
| Vercel project (dashboard) | https://vercel.com/alexanderquijada/pelipper-post — if that 404s, the account scope segment differs from the GitHub username; get the real link from vercel.com/dashboard |
| Local dev server | `http://localhost:5173` (after Phase 2) |

**Submission:** the two bolded rows above are exactly what the Workday Microsoft Forms submission
asks for — the GitHub repo URL and the live Vercel URL. Both have to load at submission time, so
re-check them after the final phase.

> ⚠️ **STILL UNVERIFIED as of 2026-09-18 — that live URL returns a Vercel 404**
> (`x-vercel-error: NOT_FOUND`). Root cause is known and is **not** a repo problem: Vercel's build
> queue stalled, so the domain is still serving `d9d9798`, a docs-only commit from before
> `index.html` existed. Full write-up in section 8. Fix is dashboard-side — cancel the stuck builds,
> redeploy the newest commit.
>
> **Do not put this URL on the Workday form until it has been loaded in a browser and seen to render
> the dashboard.** It has never yet served the site.

---

## 6. Environment

- macOS (Darwin 25.6.0)
- Project root: `~/Projects/pelipper-post`
- Node: v26.9.0 · npm 11.19.1 (recorded 2026-09-18, Phase 2)
- Auth: GitHub via `gh auth login`; Vercel via the GitHub integration in the browser

---

## 7. Decision log

Append here as the build goes. Date, what came up, what was decided.

- **2026-09-18** — Planning session. Swapped FastForward Logistics for Pelipper Post & Freight;
  chose fully Pokémon-themed metrics; chose Claude Code over Copilot; agreed sprites are hotlinked
  from the PokeAPI CDN, not committed. Wrote `BRIEF.md`, `CLAUDE.md`, `SETUP.md`, and
  `CLAUDE-CODE-PROMPTS.md`.

- **2026-09-18 — Phase 1.** Built the static prototype (`index.html`, `styles.css`, `app.js`).
  Things the brief didn't cover, decided here — **Alex, these are yours to overrule in Phase 2+:**

  1. **Icons are inline SVG, not `@mdi/font`.** The prototype has no npm, so the MDI path data for
     `mdi-email`, `mdi-weather-night`, `mdi-menu-up` / `mdi-menu-down` and `mdi-truck-delivery` is
     pasted straight into the markup. Phase 3 installs `@mdi/font` and these become real `<v-icon>`s.
     Note the fallback uses filled `mdi-truck-delivery`, not the `mdi-truck-delivery-outline` the
     brief names — use the outline variant once the font is installed.
  2. **The theme toggle renders but does nothing.** The phase prompt says dark palette only, so the
     light tokens from `BRIEF.md` §6 aren't implemented yet. The button sits in the app bar so the
     layout is honest about where it goes. Same treatment as the two filter dropdowns.
  3. **The roster is rendered by `app.js` from a `COURIERS` array**, not hand-written `<tr>`s. That
     keeps the sprite URL in exactly one function — the prototype's stand-in for `utils/sprites.ts`,
     so Phase 6 is a port rather than a rewrite.
  4. **Courier `runs`, `onTimeRate`, and `status` are invented.** The brief fixes only name, species,
     dexId, and home region. Values were chosen to match each region's character (Kanto best on-time,
     Sinnoh worst and Grounded, Galar lowest volume). Reuse or replace them in Phase 5.
  5. **KPI numbers are All Months × All Regions totals** — roughly 72 region-records' worth, sized to
     land inside the per-record ranges in `BRIEF.md` §2. They are placeholders, not a preview of the
     real dataset. `Fainted Couriers` deliberately shows a **green down-arrow** to prove the inverted
     trend rule is understood.
  6. **The Cargo Mix card carries a static legend.** The brief asks for a legend on that chart;
     showing it now also puts the five chart series colors on screen for review.
  7. **Avatars use `object-fit: contain`, not `cover`.** Official artwork is square with transparent
     padding — cropping to fill the circle cut the heads off Gyarados and Machamp.
  8. **No §7 nice-to-haves.** No count-up, no hover lift, no sparklines, no dimmed Grounded rows,
     no storm marker. Those wait until the real build works.

  **Sprite hotlinking confirmed.** All seven dexIds (279, 18, 149, 130, 68, 84, 78) returned HTTP 200
  on the `other/official-artwork/` pattern, and all seven visibly render in the browser.

- **2026-09-18 — Vercel imported; live URL recorded as https://pelipper-post.vercel.app/.** That URL
  plus the GitHub repo URL are the two things the Workday Microsoft Forms submission asks for.
  Checked from this machine the same day and it returned a Vercel **404 / NOT_FOUND** — see the
  warning in section 5. Recorded as given; the production domain needs confirming before submission.

  **Correction to earlier guidance — this matters for Phase 2.** Both `SETUP.md` and section 8 of this
  file previously said Vercel would auto-detect Vite on the next push once the project became a Vue
  app. **That is wrong.** Vercel resolves the Framework Preset **once, at import time**, and does not
  revisit it on subsequent pushes. This project was imported as plain static HTML, so it is pinned to
  **"Other"** — meaning the moment Phase 2 introduces a build step, Vercel will go on serving raw
  files and the live site will go blank or 404. Nothing warns you; the deploy reports success.

  **Decision: fix it in code, not in the dashboard.** Phase 2 adds a `vercel.json` at the repo root
  pinning `framework: vite`, `buildCommand: npm run build`, `outputDirectory: dist`, and an SPA
  rewrite. A `vercel.json` overrides the dashboard preset, so the fix is version controlled and
  survives a re-import — unlike a setting clicked once in a browser. The manual route
  (Project → Settings → Build & Deployment → Framework Preset → Vite) works too, but isn't recorded
  anywhere in the repo. **The file must not be added before Phase 2** — there's no `package.json`
  yet, so it would break the deploy that currently works. Both documents are now corrected.

- **2026-09-18 — Live-site 404 diagnosed: Vercel's build queue was stuck.** The Deployments tab showed
  three production deployments on `main`: `1ea88a7` and `740e50b` both sitting in `Initializing` for
  17 and 28 minutes, behind `d9d9798` which was `Ready` and had built in 2 seconds. So every push
  *did* create a deployment — the Git integration was healthy throughout. The two newer builds were
  queued waiting on a build slot, never failing, never shipping. The live domain therefore kept
  serving `d9d9798`, a **docs-only commit predating `index.html`** — a deployment with no HTML in it.
  That is the 404. `vercel-status.com` reported all systems operational, so it wasn't an incident.
  **Fix:** cancel the stuck deployments to free the slot, then redeploy the newest commit. Repo-side
  changes: none. `vercel.json` stays as written — it's correct and gets read once a build runs.

  **Correcting two wrong calls made earlier the same day.** Recorded because both were reasonable and
  both cost time:

  1. **"The Output Directory is misconfigured."** Wrong. It's a sound theory — there's no `public/`
     in this repo — but the setting was never even reached, because no build ran to read it.
  2. **"No production deployment is attached / pushes aren't triggering builds."** Wrong in the
     opposite direction. Three deployments existed the entire time; the push→deploy chain was never
     broken. The supporting evidence for this one *looked* strong — every path including
     `/index.html` returned an identical platform 404, and a targeted fix produced no change over a
     three-minute poll. Both facts were real, and both had an innocent explanation: the served
     deployment truly had no files, and the build carrying the fix was still queued.

  **The transferable lesson:** a *stale but Ready* production deployment is externally identical to
  *pushes never deploying*. Same healthy hostname, same uniform 404, same non-response to new pushes.
  What separates them is whether queued builds sit behind the Ready one — visible **only in the
  Deployments list**. The deployment detail page shows "Ready" and looks perfectly healthy, because
  it is; it's just old. **Check the list, not the detail page, and match the SHA against
  `git log`.** A standing check to that effect is now in section 8.

- **2026-09-18 — Phase 2.** Scaffolded with `npm create vue@latest -- --ts --router pelipper-app`,
  then moved everything to the repo root and deleted the subfolder. `create-vue` 3.24 feature flags
  are **opt-in**, so `--ts --router` alone gave TypeScript + Router with no Pinia, Vitest, Cypress,
  Playwright, ESLint, Prettier or JSX — matching the exclusions in §2. Verified locally: `npm run dev`
  clean, `npm run build` clean with no `vue-tsc` errors. **Deployment not verified** — Vercel's queue
  is still stalled (§8), which is why this phase was judged locally.

  Decisions the phase prompt didn't cover:

  1. **`.gitignore` was merged, not overwritten.** The existing file already covered `node_modules`,
     `dist`, `.env*`, `.vercel` and the editor entries. Appended only what the scaffold added and we
     lack: `logs`, `lerna-debug.log*`, `coverage`, `*.tsbuildinfo`, `.eslintcache`,
     `*.timestamp-*-*.mjs`. Skipped the Cypress and Vitest entries — we don't use either.
  2. **`package.json` name changed `pelipper-app` → `pelipper-post`** to match the repo. The
     scaffold folder name was a throwaway, and leaving it would have been the only place in the repo
     still carrying it.
  3. **Palette tokens live in a non-scoped `<style>` in `App.vue`**, not a new `src/assets/*.css`.
     The starter `base.css` / `main.css` were deleted per `CLAUDE.md` rule 7, and re-adding a global
     stylesheet is exactly the thing that fights Vuetify in Phase 3. Kept to CSS custom properties
     plus a minimal body reset so there's little to unpick when the Vuetify theme takes over.
     `src/assets/` is now gone entirely — it isn't in the `BRIEF.md` §3 structure either.
  4. **`index.html` title set** to the real dashboard name; the scaffold shipped `Vite App` and
     `lang=""`. Now `lang="en"`.
  5. ~~**`vite-plugin-vue-devtools` was left installed.**~~ **Reversed same day at Alex's request —
     removed.** Uninstalled and taken out of `vite.config.ts`. It had only ever added a dev-only
     floating toggle; the production bundle is byte-identical before and after (89.30 kB → 89.30 kB),
     which confirms it never shipped. `npm run dev` and `npm run build` both re-verified clean after
     removal.
  6. **The shell is structural, not styled to spec.** KPI values render as `—` and the three charts
     plus the roster are dashed placeholder boxes labelled with the component that will fill them
     (`RegionBarChart`, `CargoMixChart`, `DeliveryTrendChart`, `CourierRoster`). Both filter
     dropdowns list their real options but are inert, same as the Phase 1 prototype.

  **`vercel.json` swapped to the Vite config** — `framework: vite`, `buildCommand: npm run build`,
  `outputDirectory: dist`, plus the SPA rewrite. The `{ "outputDirectory": "." }` value from the
  static deploy is gone; it would have served the repo root and shipped nothing.

- **2026-09-18 — Phase 3.** Vuetify 3.13.4 + `@mdi/font` 7.4.47 installed, plugin and both named
  themes registered in `main.ts`, shell rebuilt on Vuetify components. `npm run dev` clean,
  `npm run build` exit 0 with no `vue-tsc` errors. Theme toggle and MDI rendering verified in a real
  browser (method below). Deployment still unverified — Vercel queue (§8).

  ⚠️ **`npm install vuetify` installs Vuetify 4, not 3.** Plain `npm install vuetify` resolved to
  **4.2.1** — the 4.x line is current. `BRIEF.md` §3 and `CLAUDE.md` both specify **Vuetify 3**, so it
  was reinstalled as `npm install "vuetify@^3"` → **3.13.4**. Anyone re-running the install, or
  bumping deps later, has to pin the major or the project silently jumps a major version.

  Decisions the phase prompt didn't cover:

  1. ~~**All Vuetify components are registered eagerly.**~~ **Superseded same day** — Alex approved
     `vite-plugin-vuetify`, added in its own commit (`52653e7`). JS dropped 49%, the chunk-size
     warning is gone, and a component census confirmed nothing was dropped. See §8.
  2. **`src/utils/sprites.ts` created now, not in Phase 6.** The phase prompt asked for `v-avatar`
     sprites in the roster, and `BRIEF.md` §2 requires the URL builder to live in exactly one file.
     Building the roster without it would have meant inlining the CDN path and moving it later.
  3. **The roster renders real courier data already.** The prompt asked for `v-table` + `v-avatar` +
     `v-chip`, which needs rows to render. Reused the same seven fabricated couriers from the Phase 1
     prototype; `src/data/metrics.json` replaces them in Phase 5.
  4. **Sprite fallback now uses the real `mdi-truck-delivery-outline`** — closes Phase 1 decision #1,
     which had substituted the filled variant because there was no icon font yet.
  5. **Filters are bound to local refs**, so the dropdowns open and visibly change. Nothing reads
     those refs — still non-functional in the sense that matters. Phase 6 wires them.
  6. **KPI values use Vuetify's `text-h4`** (34px) rather than the prototype's hand-set 40px. Still
     comfortably the largest type on the page, and it avoids a custom font-size rule fighting
     Vuetify's typography scale. Revisit in Phase 4 if it reads too small projected.

  **Palette variables — what was deleted and what survived.** All nine colour variables from the
  Phase 2 `App.vue` block are **gone**: `--background`, `--surface`, `--primary`, `--secondary`,
  `--accent`, `--success`, `--error`, `--on-surface`, `--muted`. Every one is now a Vuetify theme
  token, and **the theme in `main.ts` is the only place a hex appears.** Also deleted: `--hairline`
  (now `border="b"` on `v-app-bar`), `--radius-lg` (now `rounded="lg"` in `VCard` defaults),
  `--card-padding` (now `pa-6`), `--gap` (now `v-row`/`v-col` gutters).

  Two rules survived, both genuinely outside what Vuetify provides:

  | Survivor | Why it can't be a Vuetify prop |
  |---|---|
  | `.v-application { font-family: … }` | Vuetify defaults to Roboto, which this project doesn't load. `BRIEF.md` §6 asks for Inter or a system stack. Changing it properly means overriding an SCSS variable at build time; a one-line CSS rule is the smaller change. |
  | `.pelipper-width { max-width: 1400px }` | `v-container`'s own maxima are 1185px at `lg` and 1785px at `xl`. Neither is the ~1400px `BRIEF.md` §4 asks for. |

  Two more scoped rules exist in `HomeView.vue` — `.chart-slot` (dashed placeholder; Vuetify has no
  dashed-border utility, and these are deleted in Phase 6) and `.sprite-avatar` (faint tint behind
  transparent artwork). **Both read `rgba(var(--v-theme-*), …)` rather than hardcoding a colour**, so
  they follow the active theme and cannot drift from it.

  **How the toggle and icons were verified** — not by eyeballing a screenshot. Drove headless Chrome
  over the DevTools Protocol, clicked the real toggle button twice, and read computed styles at each
  step:

  ```
  BEFORE : v-theme--pelipperDark   bg rgb(14, 22, 33)     -> #0E1621 ✓
  AFTER  : v-theme--pelipperLight  bg rgb(244, 247, 250)  -> #F4F7FA ✓
  BACK   : v-theme--pelipperDark   bg rgb(14, 22, 33)     -> #0E1621 ✓
  ```

  Both directions, and both background values match `BRIEF.md` §6 exactly. For the icons, the app-bar
  `v-icon` computes `font-family: "Material Design Icons"` and measures **30px wide** — a glyph that
  failed to load renders zero-width, so this rules out the empty-box failure mode.

- **2026-09-18 — Post-Phase-3 cleanup.** Three follow-ups, two commits.

  1. **`vite-plugin-vuetify` added** (`52653e7`, deliberately isolated so it reverts alone). Bundle
     JS 637.90 kB → **325.70 kB**, chunk-size warning gone, rendered-component census identical
     before and after in both themes. Full numbers in §8.
  2. **`@mdi/font` left alone — considered and declined.** Only the `woff2` is ever fetched, so the
     other three formats cost users nothing. Recorded in §8 as closed so it isn't re-raised.
  3. **Vuetify pinned to 3.x in the governing docs.** `BRIEF.md` §3 and `CLAUDE.md` now both read
     "Vuetify 3.x (pinned — do not upgrade to 4)" and name `vuetify@^3` as the install command. This
     is the first change to either document since they were written — made on Alex's explicit
     instruction, because a bare `npm install vuetify` now resolves to 4.x and would quietly break
     the stated tech constraint.

- **2026-09-18 — Phase 4.** `src/components/MetricCard.vue` extracted, with a typed
  `MetricCardProps` interface via `withDefaults(defineProps<MetricCardProps>(), …)`. `HomeView.vue`
  now renders four `<MetricCard>` instances from a `KPI_CARDS: MetricCardProps[]` array — the array
  is typed against the component's own exported interface, so a bad prop is a build error rather
  than a runtime surprise. `npm run build` exit 0, no `vue-tsc` errors, no chunk-size warning.

  Decisions the phase prompt didn't cover:

  1. **For `format: 'percent'`, `value` is a FRACTION.** `0.942` renders `94.2%`. The prompt defined
     `trend` as a fraction but left `value` ambiguous; matching them means one rule for the whole
     component instead of two. Documented in the prop's doc comment. **If Phase 5 feeds
     `onTimeRate` straight from the JSON this is already correct** — the brief stores it 0–1.
  2. **`trend: 0` renders a flat grey dash (`mdi-minus`), not a green or red arrow.** Zero change is
     neither good nor bad news, and the brief's colour rule only defines increase/decrease. This is
     distinct from `trend: null`, which omits the indicator entirely.
  3. ~~**Trend text reads "6.2% vs. last month".**~~ **Reversed same day by Alex — on correctness,
     not wordiness.** Under `All Months` the brief defines the trend as the *trailing month vs. the
     one before it*, so "vs. last month" was misleading on the most-read numbers on the page (and
     four repetitions across four adjacent cards was noise). Cards now show just the arrow and the
     percentage; one muted caption under the KPI row carries the comparison. **That caption has to
     become dynamic in Phase 6** — see the 📌 item in §8. Decisions 1 and 2 above were ratified
     unchanged, as was the two-line label baseline fix.

     Accessibility note: with the words gone, direction was only conveyed by an arrow glyph and a
     colour. The trend element now carries an `aria-label` ("Up 6.2% from the previous period") and
     the arrow is `aria-hidden`, so screen readers still get the direction.
  4. **Icons use `color="primary"` at 60% opacity** rather than a different colour per card — the
     brief's "not a rainbow" instruction. They mark the card without competing with the value.
  5. **Fixed a real layout defect found during verification.** "Berry Crates Delivered" wraps to two
     lines; its value was landing lower than the other three and the KPI row read as misaligned.
     The label now reserves two lines via `min-height: 2.4em`, so all four values sit on a common
     baseline whether or not a label wraps. This is the kind of thing that only shows up on screen —
     it was not visible in the markup.

  **How the props were verified.** Two of the five prop behaviours aren't exercised by the four live
  cards, so they were probed deliberately: one card temporarily set to `format: 'percent'` with
  `value: 0.942`, another to `trend: null`. Screenshotted, confirmed **`94.2%`** and **no trend
  indicator at all**, then reverted — `grep` confirms no probe residue in the committed file. The
  inverted case needs no probe: `Fainted Couriers` ships with `trend: -0.185, invertTrend: true` and
  renders a **green down-arrow**, while `Berry Crates` renders a **red down-arrow** on a similar
  decrease. Both visible side by side in the committed state.

---

## 8. Known issues / watch list

- 🔴 **OPEN — live site 404s. ROOT CAUSE FOUND 2026-09-18: Vercel's build queue is stuck.**

  **What the Deployments tab actually showed:**

  | Commit | What it is | State | Age |
  |---|---|---|---|
  | `1ea88a7` | Record live Vercel URL… | **Initializing** | 17 min |
  | `740e50b` | Add static dashboard prototype | **Initializing** | 28 min |
  | `d9d9798` | Record setup results… | Ready (built in 2s) | 39 min |

  Every push created a deployment, so **webhooks are firing and the Git integration is healthy.**
  The two most recent builds have been stuck in `Initializing` for 17 and 28 minutes — waiting for a
  build slot, not failing. A queued build has not errored; it simply never ran.

  Meanwhile the live domain keeps serving **the last deployment that actually shipped — `d9d9798`,
  a docs-only commit made before `index.html` existed.** That deployment is genuinely a tree with no
  HTML in it. Hence the 404, and hence why `/index.html`, `/styles.css` and a deliberately fake path
  all returned byte-identical `NOT_FOUND`: there were no files to find. It also explains why the
  `vercel.json` push appeared to do nothing for three minutes — **that build never ran.**

  `vercel-status.com` showed all systems operational (Builds, CI/CD, Git Integrations), so this was
  not a platform incident.

  **The piece that explains it: Vercel's Hobby plan allows ONE concurrent build across the ENTIRE
  ACCOUNT, not one per project.** Another project on the same account holding that single slot will
  stall builds here indefinitely — which is why cancelling deployments *inside this project* didn't
  free anything. Worth remembering at every future phase push: a build stuck in `Initializing` here
  may have nothing to do with this repo, and no repo-side change can clear it.

  ### Fallback if the queue is still wedged at submission time — Vercel CLI, prebuilt deploy

  **Last resort. Do not reach for this early.** The git-push→auto-deploy loop is part of what the
  capstone is teaching, and a working live URL produced that way is worth more than a working live
  URL produced by hand. Use this only if the slot is still stuck once the dashboard is finished and
  the submission is otherwise blocked.

  The idea: build **locally**, then upload the finished output, so Vercel's build system never runs
  and the stuck slot shouldn't matter.

  ```bash
  npm install -g vercel
  cd ~/Projects/pelipper-post
  vercel login
  vercel link                      # connect this folder to the existing project
  vercel build --prod              # builds locally into .vercel/output
  vercel deploy --prebuilt --prod  # uploads that output, no remote build
  ```

  ⚠️ **Unverified — likely, not proven.** Vercel documents that `--prebuilt` skips their build step
  and deploys an existing `.vercel/output`. What they do **not** explicitly document is whether a
  prebuilt deploy still consumes an account build slot. The reasoning is sound (no build runs, so
  there should be nothing to queue) but it has not been tested on this account. If the deploy also
  hangs, this theory is wrong — say so here rather than retrying it.

  Note `.vercel` is already in `.gitignore`, so `vercel link` and `vercel build` won't dirty the
  repo. `vercel.json` is read by the CLI exactly as it would be by the remote builder, so the Vite
  config applies either way.

  **Fix — dashboard-side:** cancel the stuck deployments to free the build slot, then redeploy the
  newest commit. Nothing in the repo needs changing. Keep `vercel.json` as it is; it's correct and
  will be read the moment a build actually runs.

  **⚠️ Two earlier diagnoses were wrong. Record of why, so the same wrong turns aren't retaken:**

  1. *"The Output Directory is misconfigured."* Plausible — there's no `public/` here — but the
     setting was never reached, because no build ran to read it.
  2. *"No production deployment is attached / pushes aren't triggering builds."* Wrong in the
     opposite direction: **three** deployments existed the whole time. The push→deploy chain was
     never broken.

  **Why both looked right:** a *stale but Ready* production deployment is externally
  indistinguishable from *pushes never deploying*. Both give a healthy hostname, a uniform
  platform 404, and no visible response to new pushes. The thing that separates them is whether
  **queued** builds are sitting behind the Ready one — and that is only visible in the
  **Deployments list**. The deployment *detail* page for the live deployment shows "Ready" and
  looks entirely healthy, because it is healthy; it's just old. **The list is the diagnostic
  surface, not the detail page.**

- ✅ **STANDING CHECK — after every phase push, open the Deployments tab and confirm two things:**
  **(1) a NEW deployment exists for the commit you just pushed, and (2) it reached `Ready`.**
  Both conditions, every time. Neither one alone is sufficient.

  This replaces the earlier "does a push trigger a deployment?" check, which was too weak — it would
  have passed during the stuck-queue incident above while the site was 404ing.

  **Why both halves matter:** the two failure modes hit on this project both report as "successful"
  if you only glance at the project's status badge —

  | Failure mode | What the badge says | What's actually true |
  |---|---|---|
  | Stale `Ready` deployment | ✅ Ready | Live site is an old commit; your changes aren't on it |
  | Builds stuck `Initializing` | ✅ Ready | New builds are queued and will never ship on their own |

  In both cases the badge reflects *the last deployment that shipped*, not *the commit you pushed*.
  Match the commit SHA in the Deployments list against `git log --oneline -1`. If it doesn't match,
  the live site is not your latest work — regardless of what the badge says.

- 🔴 **BLOCKING IN PHASE 2 — Vercel will not re-detect the framework.** Separate issue from the 404
  above; fixing one does not fix the other. Vercel fixes the Framework
  Preset **at import time** and does **not** re-detect it on later pushes. This project was imported
  while the repo was plain static HTML, so it is pinned to **"Other"**. When Phase 2 turns it into a
  Vue + Vite app, Vercel will keep serving it as static files and **the live site will go blank or
  404.**

  **Fix — Phase 2 REPLACES the existing root `vercel.json` with the Vite config.** As of 2026-09-18
  that file already exists, holding only `{ "outputDirectory": "." }` for the static deploy. Phase 2
  overwrites it wholesale — the `"."` output directory is wrong the moment there's a build step:

  ```json
  {
    "framework": "vite",
    "buildCommand": "npm run build",
    "outputDirectory": "dist",
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```

  A `vercel.json` in the repo **overrides the dashboard preset**, so this fixes it in code and
  survives anyone re-importing the project later. The rewrite is the SPA fallback.

  **Do NOT add those settings before Phase 2.** There is no `package.json` yet, so a `vite` framework
  setting would break the static deploy. The file existing today is fine — it's the `framework` and
  `buildCommand` keys specifically that have to wait for the scaffold.

  Manual alternative if you'd rather click it: Project → Settings → Build & Deployment →
  Framework Preset → **Vite**, then redeploy. The `vercel.json` is the better answer — it's version
  controlled and self-documenting.

- **Sprite CDN check:** **VERIFIED on this machine.** Use `sprites/pokemon/other/official-artwork/{dexId}.png` - returned HTTP 200.
  <!-- setup.sh rewrites the line above with the live result of testing the sprite URLs -->
  Fallback URL pattern and an MDI icon fallback are both specified in `BRIEF.md` §2.
- **Nested-folder trap.** `npm create vue@latest` will try to scaffold into a subfolder. Phase 2's
  prompt handles it, but check the file tree after Phase 2 — a stray subfolder is the single most
  common way this build goes sideways (it happened twice in the capstone videos).
- ✅ **RESOLVED 2026-09-18 — bundle size. `vite-plugin-vuetify` added; the chunk-size warning is
  gone.** `main.ts` no longer does `import * as components from 'vuetify/components'`; the plugin
  scans templates and registers only what's used (`autoImport: true` in `vite.config.ts`).

  | Asset | Before | After | Change |
  |---|---|---|---|
  | `index.js` | 637.90 kB (gzip 202.37) | **325.70 kB** (gzip 109.79) | **−49%** |
  | `index.css` | 833.29 kB (gzip 117.99) | **678.18 kB** (gzip 97.44) | −19% |
  | modules transformed | 576 | 269 | −53% |

  Verified nothing was dropped — a tree-shaker can silently remove a component that's only referenced
  dynamically. Took a census of rendered Vuetify elements over the DevTools Protocol, in both themes:
  8 `v-card`, 7 `v-avatar`, 7 `v-img`, 7 `v-chip`, 2 `v-select`, 1 `v-table`, 4 `v-icon`, plus
  `v-app-bar` / `v-main` / `v-container` / `v-row`. Identical before and after, theme toggle still
  works both directions, MDI glyphs still 30px wide. Kept as its own commit
  (`52653e7`) so it can be reverted alone if it ever misbehaves.

  **The CSS barely moved because most of it is `@mdi/font`**, not Vuetify — that stylesheet declares
  a class for every icon in the set.

- ⛔️ **CONSIDERED AND DECLINED — trimming the extra `@mdi/font` webfont formats. Do not re-raise.**
  `dist/` carries four formats (`woff2` 403 kB, `woff` 588 kB, `ttf` 1.31 MB, `eot` 1.31 MB) because
  that's what `@mdi/font`'s stock CSS declares. **Only the `woff2` is ever fetched** — every browser
  this will run in supports it, and the `@font-face` `src` list is ordered so the others are never
  requested. They sit in the deployment costing users nothing. Stripping them would mean hand-editing
  or overriding vendor CSS for zero user-facing gain. Decision: leave `@mdi/font` exactly as is.

- **Vuetify major-version trap.** A bare `npm install vuetify` resolves to **4.x** — installing
  without a pin silently jumps a major version past the 3.x this project requires. Always
  `npm install "vuetify@^3"`. Now stated in `BRIEF.md` §3 and `CLAUDE.md` too.

- 📌 **PHASE 6 TODO — the trend caption must become dynamic.** `HomeView.vue` currently renders one
  static line under the KPI row: *"Trends compare to the previous month."* **That wording is only
  correct for some filter states**, which is exactly why the per-card "vs. last month" suffix was
  removed — see the 2026-09-18 decision-log entry.

  Per `BRIEF.md` §5, the comparison the trend actually makes depends on the Month filter:

  | Month filter | What the trend compares | Caption should say |
  |---|---|---|
  | `All Months` | trailing month vs. the one before it | e.g. *"Trends compare Sep 2026 to Aug 2026."* |
  | A specific month | that month vs. the month before it | e.g. *"Trends compare Apr 2026 to Mar 2026."* |
  | The **earliest** month (Oct 2025) | nothing — no prior month exists | **no caption at all**, and every card gets `trend: null` |

  That last row is the one to get right: the brief says *"Never show a trend arrow when there is no
  prior month to compare against."* `MetricCard` already handles it — `trend: null` omits the
  indicator — so Phase 6 only has to pass `null` and hide the caption.

- **Vuetify overrides custom CSS.** Both Video 203 and 204 lost time to this. When layout fixes
  "don't take", the cause is Vuetify's own styles, not missing CSS. Fix with Vuetify props and
  spacing utilities, not `!important`.
- **`vue-tsc` vs. dev server.** `npm run dev` tolerates type errors that `npm run build` rejects, so
  a phase can look fine locally and still fail on Vercel. `CLAUDE.md` requires `npm run build` at the
  end of every phase for this reason.

---

## 9. Compliance notes — do not skip

- Vercel is **not** an approved Slalom tool for client or internal releases. This project is
  educational only.
- **No client data, no Slalom data, no real people** anywhere in the repo. Every number is fabricated.
- Pokémon names and sprites are trademarks of Nintendo / Creatures Inc. / GAME FREAK. This is a
  non-commercial fan-made learning exercise; sprites are hotlinked from a public community CDN and
  are not redistributed in the repo. The README should say so.

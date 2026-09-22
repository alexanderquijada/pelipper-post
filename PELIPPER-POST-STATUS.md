# PELIPPER POST & FREIGHT — Project Status

> **If you are Claude and you're reading this at the start of a session:** this file is the
> single source of truth for where this project stands. Read it, then read `CLAUDE.md` and
> `BRIEF.md`, then tell Alex where we left off and what's next. **Do not start work until he
> confirms.** Update this file at the end of every phase — it's how Alex picks this up on a
> different machine.

- **Last updated:** 2026-09-22 — **Nested card shell with glass sidebar.** Only the Vercel deployment is outstanding.
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
| Theme | **Light (daylight sky) by default, dark on the toggle.** Pelipper blue/orange palette. | Style section of `BRIEF.md` — switched from dark-default in the 2026-09-18 theming extension |
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
| 5 | 2.4 | Mock dataset `src/data/metrics.json` | ✅ Done | `Add realistic mock metrics dataset and TypeScript types` |
| 6 | 2.4 | Full dashboard — charts, filters, roster | ✅ Done | `Build full dashboard with charts, filters, and courier roster` |
| 7 | — | Final pass: cleanup, README | ✅ Done | `Final pass: cleanup, README, and documentation` |
| 7b | — | Extension: Pokémon theming, delivery map, light default | ✅ Done | `Add Pokémon theming, delivery map, and light default` |
| 7c | — | Illustrated delivery map replaces the abstract diagram | ✅ Done | `Add Pokémon theming, delivery map, and light default` |
| 7d | — | Dense multi-card executive layout (sidebar, 5 KPIs, 3 derived cards) | ✅ Done | `Restructure into a dense multi-card executive layout` |
| 8 | — | Submit repo + live URL on Workday | ⬜ Not started | — |

**Status key:** ⬜ Not started · 🟡 In progress · ✅ Done

---

## 4. → NEXT STEP

**THE BUILD IS COMPLETE.** Phases 0–7 are done, committed and pushed. Every item in `BRIEF.md` §8's
Definition of Done is met **except the live Vercel URL**. There is no remaining code work.

**1. Get the live URL serving.** The only blocker, and it is not a repo problem — `npm run build`
exits 0 and the dashboard runs correctly locally. See the red item in §8: the build queue stalled on
an account-wide single build slot (Hobby plan shares one slot across *all* projects, which is why
cancelling deployments inside this project freed nothing).

Note the error has **changed** since it was first recorded: it was `NOT_FOUND` (a deployment existed
but served a tree with no `index.html`); as of the final check it is **`DEPLOYMENT_NOT_FOUND`** —
no deployment is attached to the hostname at all. Consistent with the stuck builds having been
cancelled without a successful one replacing them. **Start at Project → Deployments and redeploy the
newest commit.**

If the queue is still wedged, §8 records the Vercel CLI fallback (`vercel build` +
`vercel deploy --prebuilt`), which bypasses Vercel's build system entirely. Last resort, and
unverified — read the caveats first.

**2. Then confirm the deployed site actually works** — not just that it returns 200. Load it, toggle
the theme, change both filters, and check a sprite renders. Only then put the URL on the Workday
form, and update §5 and the README's "Live site" section, which both currently say deployment is
pending.

**3. Submit** the GitHub repo URL and the live URL on the Workday Microsoft Form (phase 8).

Nothing is waiting on a decision. Both post-Phase-6 open items are closed in §8: code-splitting
declined with reasoning, categorical palette replaced with Okabe–Ito.

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

> ⚠️ **NOT WORKING as of the final check, 2026-09-18.** `https://pelipper-post.vercel.app/` returns
> **HTTP 404 with `x-vercel-error: DEPLOYMENT_NOT_FOUND`** and the body *"The deployment could not be
> found on Vercel."*
>
> **This has never once served the site.** It is not a repo problem — `npm run build` exits 0 and the
> dashboard runs correctly locally. Root cause and full history in §8.
>
> **The error changed during the project**, which is itself a clue: it was `NOT_FOUND` (a deployment
> existed, but served a commit with no `index.html`), and is now `DEPLOYMENT_NOT_FOUND` (nothing
> attached to the hostname at all) — consistent with the stuck builds having been cancelled without a
> successful one replacing them.
>
> **Do not put this URL on the Workday form until it has been loaded in a browser and seen to render
> the dashboard.** The README's "Live site" section says deployment is pending and must be updated at
> the same time.

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

- **2026-09-18 — Phase 5.** `src/data/metrics.json` (33 KB, 72 region records, Oct 2025 → Sep 2026,
  7 couriers) and `src/types/metrics.ts`. **`node scripts/validate-data.mjs` exits 0 — every check
  passed, zero problems and zero notes.** Headline seasonality as measured by the validator:

  | Check | Result | Target |
  |---|---|---|
  | Gym Season lift (Mar–May) | **+35%** | +25–40% |
  | December berry multiple | **1.96×** | ~2× |
  | Storm-season fainted couriers | **3.17** vs 1.88 | higher |
  | Biggest storm on-time hit | **Hoenn** | Hoenn |

  Hoenn's dip is clearly visible: ~94% most months, **88.3% in July and 88.2% in August**, with a
  separate 90.4% dip in December from the berry rush.

  *(Figures above are post-regeneration — see the unification entry below.)*

  Built with a seeded generator run from the scratchpad, never committed — `scripts/` still contains
  only `validate-data.mjs`. Seed `20260918`, so the dataset is reproducible if it ever needs a tweak.

  Decisions and findings the phase prompt didn't cover:

  1. ~~**`BRIEF.md` §2 contradicts its own example.**~~ **Resolved same day — see the follow-up
     entry below.** Alex confirmed the prose was right and the example wrong, then went further:
     the two fields are now required to be the same number.
  2. ~~**`cargoMix` and `pokeBallsShipped` are independent.**~~ **Overruled same day.** They are one
     measure. See below.
  3. **Month-over-month movement: 53 of 66 transitions land inside the brief's ±3–15% band.** The
     13 outside it are not noise, and tightening them further would have meant weakening the
     seasonality the brief also demands:
     - **4 above 15%** — all seasonal: Hoenn's post-holiday drop (Dec→Jan, −19.2%) and three Gym
       Season ramps. A parcel carrier losing ~19% of volume after December is realistic.
     - **9 below 3%** — quiet months. A real business doesn't move ≥3% every single month.
  4. **Precise union types kept over a raw-JSON-assignable shape.** TypeScript widens JSON strings
     to `string`, so `raw` isn't directly assignable to `MetricsDataset`. Verified both ways with a
     throwaway `vue-tsc` probe (since deleted): the union version needs one `as MetricsDataset` at
     the import site, which is documented at the top of `src/types/metrics.ts`. Loosening the types
     would trade autocomplete and exhaustiveness everywhere for one assertion in one file.
  5. **Courier `onTimeRate` values were adjusted** to track their home region's character rather
     than the Phase 1 placeholders — Gale and Emberlyn (Kanto) highest at 96.4% / 95.9%, Tidal
     (Sinnoh) lowest at 90.6% and `Grounded`, Skyler (Hoenn) mid at 94.3%. `runs` carried over.

  Region character across all twelve months, as generated:

  | Region | Avg volume | Avg on-time | Fainted/mo | Oct→Sep growth |
  |---|---|---|---|---|
  | Kanto | 15,677 | **95.2%** | 1.17 | +5.3% |
  | Johto | 13,419 | 94.1% | 1.50 | +7.5% |
  | Hoenn | 11,681 | 92.8% | 2.67 | +5.7% |
  | Sinnoh | 10,297 | **89.9%** | **3.33** | +6.8% |
  | Unova | 10,374 | 92.8% | 1.83 | **+31.4%** |
  | Galar | **8,224** | 91.3% | 2.08 | +17.1% |

  Kanto highest volume and best on-time; Sinnoh worst on-time and most fainted; Unova fastest
  growth by a wide margin; Galar smallest, climbing from a low base. All as `BRIEF.md` §2 specifies.

- **2026-09-18 — Phase 5 follow-up: `pokeBallsShipped` unified with `cargoMix["Poké Balls"]`.**
  Alex resolved the contradiction flagged above and extended it into a rule.

  **The resolution.** The prose ("around 30–35%") was correct; the example record's `9184` was
  written before that guidance existed and never reconciled. The telling detail: the same example's
  `cargoMix["Poké Balls"]` is **4,611 — exactly 32.4% of its `parcelsDelivered`**. The right number
  was already in the example, in a different field.

  **The rule, which goes beyond just fixing the example.** `pokeBallsShipped` and
  `cargoMix["Poké Balls"]` are now **required to be the identical number in every record**. The
  reason is a display one, not a data one: on the finished dashboard `pokeBallsShipped` is a KPI card
  and `cargoMix["Poké Balls"]` is a doughnut segment, sitting inches apart. Two different numbers
  under the same label is an unanswerable question in a leadership meeting. The earlier
  *shipped-vs-delivered* reading was defensible in the abstract and wrong in context.

  **What changed:**

  1. **`metrics.json` regenerated**, same seed (`20260918`). One Poké Balls figure per record now
     drives both fields; the other four cargo types split the remainder, which is also what keeps
     Poké Balls the largest segment structurally rather than by luck. Verified across all 72
     records: **0 disagreements, 0 records where Poké Balls isn't the largest segment, 0 cargoMix sum
     mismatches.** Share of parcels **30.1–35.4%**; `pokeBallsShipped` Gym Season lift **+31%**.
     Seasonality and region character are unchanged.
  2. **`scripts/validate-data.mjs` gained the missing check** — per-record equality, with a message
     that explains the dashboard consequence rather than just reporting a delta. Plus a softer note
     if Poké Balls stops being the largest cargo segment. **Confirmed the check actually fires
     before trusting it**: run against the pre-fix data it failed all 72 records and exited 1.
     That gap — a relationship the brief never encoded, so the validator never tested — was the real
     defect, not the data.
  3. **`BRIEF.md` §2 corrected.** The example's `pokeBallsShipped` is now `4611`, matching its own
     `cargoMix`; the metrics table row states the equality; and the prose states it as a rule with
     the reasoning, demoting "30–35%" to a description of where the number lands rather than a
     separate target. The corrected example is fully self-consistent — cargoMix sums to 14,237,
     equality holds, Poké Balls is the largest segment.
  4. **The ±3–15% month-over-month band is now explicitly a guide, not a hard rule** (`BRIEF.md` §2).
     It states that seasonal transitions may exceed 15%, quiet months may fall under 3%, and that
     **where the band and the seasonality rules conflict, visible seasonality wins.** This ratifies
     the Phase 5 judgement call — the brief no longer reads as though the data broke a rule.

  Validator green after the change: exit 0, zero problems, zero notes. `npm run build` exit 0.

- **2026-09-18 — Phase 6. The dashboard is built.** `chart.js` 4.5.1 + `vue-chartjs` 5.3.4.
  New: `src/composables/useMetrics.ts` (all filtering and aggregation), three chart components,
  `CourierRoster.vue`, plus `charts/chartTheme.ts` for shared series colours and theme-aware axes.
  `HomeView.vue` is now pure presentation — no arithmetic, no hardcoded arrays.

  **Verified in a real browser, driving the actual UI over the DevTools Protocol** (synthetic
  `.click()` doesn't open a Vuetify menu — it needs real dispatched mouse input):

  | Check | Result |
  |---|---|
  | dev server | clean, **0 console errors or warnings** |
  | `vue-tsc` / `npm run build` | **exit 0**, no TypeScript errors |
  | sprites | 7/7 loaded, first `naturalWidth` **475px** |
  | sprite fallback | forced an error → avatar swapped to **`mdi-truck-delivery-outline`** |
  | filters compose | Hoenn + Aug 2026 → **3,242 / 342 / 38 / 5**, matching `metrics.json` exactly |
  | inverted trend | All Months: fainted **20 → 12**, shown as a **green** down-arrow |
  | no prior month | Oct 2025 → **no arrows, no caption**, values still render |
  | theme toggle | both directions, charts restyle with it |
  | NaN / undefined | none anywhere, in any filter state |

  Decisions the phase prompt didn't cover:

  1. **The trend chart is two aligned panels, not a dual-axis chart.** Parcels Delivered runs in the
     tens of thousands, Gym Supply Runs in the tens — a ~200× gap. On shared scales the smaller
     series flatlines and the crossover point becomes an artefact of the scales chosen rather than
     anything real. Two single-axis panels share one time axis (y-gutters pinned to 54px so they
     line up). It reads as one chart in one card, which is what `BRIEF.md` §4 asks for.
     **If you'd rather have a literal dual-axis chart, it's a small change — say so.**
  2. **Both axes start at zero** on the trend panels. The seasonality is subtler that way, but these
     are *area* charts and a truncated baseline on a filled area misstates magnitude.
  3. **The Cargo Mix legend carries values and percentages**, not just colour swatches — see the
     palette item in §8 for why that matters here specifically.
  4. **`Fainted Couriers` for a single month can show `0.0%`** (Hoenn Jul→Aug is 5→5). That renders
     as the neutral grey dash from Phase 4, not a green or red arrow. Correct: no change is neither
     good nor bad news.
  5. **Charts are theme-aware.** Axis, gridline and tooltip colours are read live from the Vuetify
     theme, so the toggle restyles the charts instead of leaving dark axes on a light card.
  6. **`v-img` lazy-loads.** Sprites below the fold don't create an `<img>` until scrolled into view.
     Normal Vuetify behaviour, worth knowing if a future check reports "0 sprites" — scroll first.

  Deleted as part of this phase: the `KPI_CARDS` and `COURIERS` hardcoded arrays, the `.chart-slot`
  dashed placeholder styling, and every "Phase 6" placeholder label. Verified by grep.

  Also fixed: the theme toggle used `theme.global.name.value = …`, deprecated in Vuetify 3.13, which
  logged a warning on every toggle. Now `theme.change()`. That's what took console output to zero.

- **2026-09-18 — Phase 6 rulings.** Three decisions from Alex, and a correction to my own analysis.

  1. **RATIFIED — two aligned trend panels.** `BRIEF.md` §4 now describes what was actually built:
     one card, one shared time axis, two aligned single-axis panels, with the reasoning recorded so
     it doesn't read like a deviation.
  2. **DECLINED — code-splitting Chart.js.** See §8 for the reasoning and, more importantly, the
     distinction from the `vite-plugin-vuetify` call.
  3. **PALETTE — replaced with Okabe–Ito**, split by job. See §8 and `BRIEF.md` §6.

  **Correcting my Phase 6 report — I got the colourblind finding wrong, and Alex got the pair wrong.**
  Worth recording precisely, because both errors are instructive:

  - **My error:** I reported "colourblind separation actually passes". It does not. I had run the
    validator in its default **adjacent-pairs** mode, which checks 4 of 10 pairs. Re-run with
    `--pairs all` it **FAILS**. A palette check that only compares neighbours in a list is close to
    meaningless for a doughnut, where any segment can end up beside any other.
  - **Alex's error:** the collapsing pair is **Berries/TMs** (`#7FD1E8` / `#9BB8D3`), not
    Poké Balls/TMs. Independently measured: Berries/TMs is **ΔE 4.3 deutan, 5.3 protan, 1.3 tritan**.
    Poké Balls/TMs is 11.2 deutan / 9.1 protan — poor, but not the collapse. The quoted 0.6 / 0.5
    doesn't reproduce for that pair. Two independent methods agreed on Berries/TMs: my CIEDE2000 +
    LMS script, and the OKLab-based validator, which flagged the same pair at ΔE 4.6.
  - **Alex's normal-vision numbers were exactly right** — Poké Balls/TMs 11.6, Berries/TMs 12.0,
    Poké Balls/Berries 14.3, all reproduced to one decimal. Three of ten pairs below the ΔE 15 floor,
    as stated.

  **And one thing neither of us predicted.** Alex expected `#F0E442` alone to fail on the light
  surface. **Three of the five fail**: `#F0E442` at 1.32:1, `#56B4E9` at 2.31:1, `#E69F00` at 2.25:1.
  So the light theme needed a full variant, not a one-colour patch. The first attempt at that variant
  then introduced a *new* collapse — darkening the yellow to `#A67C00` put it at the same lightness as
  the vermillion, dropping Berries/Evo Stones to **ΔE 1.7 deutan**. Okabe–Ito works by separating
  lightness as well as hue, so darkening one member without re-checking the whole set breaks it. The
  final gold `#6B4E00` was chosen by searching candidates against all four other slots at once.

- **2026-09-18 — Phase 7, final pass. BUILD COMPLETE.** `npm run build` **exit 0**, no TypeScript
  errors. `node scripts/validate-data.mjs` **exit 0**, every check passed.

  **`BRIEF.md` §8 Definition of Done — 8 of 9 met.** The only outstanding item is the live URL:

  | # | Item | Status |
  |---|---|---|
  | 1 | Runs clean with `npm run dev`, no console or TypeScript errors | ✅ dev ready in 177ms; **0 console errors/warnings** in-browser; `vue-tsc` clean |
  | 2 | `npm run build` succeeds | ✅ exit 0, 579ms |
  | 3 | KPI cards, charts and roster render real values from the JSON | ✅ 265,314 / 25,888 / 3,193 / 151 = the sum of all 72 records |
  | 4 | Both filters work, and work together | ✅ Hoenn + Aug 2026 → 3,242 / 342 / 38 / 5, matching that exact record |
  | 5 | At least one sprite visibly renders | ✅ **7/7 loaded**, 475×475 each, from `raw.githubusercontent.com` |
  | 6 | Theme toggle works both directions | ✅ `pelipperDark` → `pelipperLight` → back |
  | 7 | Nothing left from the Vue starter template | ✅ grep clean; the last remnant (scaffold `README.md`) replaced this phase |
  | 8 | Committed and pushed to GitHub | ✅ working tree clean, `main` up to date |
  | 9 | **Live Vercel URL loads and works** | ❌ **`DEPLOYMENT_NOT_FOUND`** — see §5 and §8 |

  **Removed in this phase:** the create-vue scaffold `README.md` (still titled "pelipper-app" and
  full of Vite boilerplate) — replaced with a real one. That was the last piece of starter template
  in the repo.

  **Audited and found clean — nothing else to remove.** Every one of the six runtime dependencies is
  imported; every devDependency is referenced by a config or the build script; no unused exports; no
  unused destructured variables in any component; no untracked junk. Worth noting because
  "delete everything unused" turned up exactly one file.

  **Kept deliberately:** `.vscode/extensions.json` is technically scaffold output, but it only
  recommends the Vue language plugin and genuinely helps anyone cloning the repo. `SETUP.md` and
  `CLAUDE-CODE-PROMPTS.md` are kept as the capstone process record — the workflow *is* the
  deliverable here. Say the word if any of those should go.

- **2026-09-18 — Extension: Pokémon theming, delivery map, light default.** Implemented the approved
  `BRIEF.md` §2 / §4 / §6 changes. `npm run build` **exit 0**, **0 console errors or warnings**.

  | Verified | Result |
  |---|---|
  | Five cargo item sprites in the legend | **5/5 loaded** — `poke-ball`, `oran-berry`, `potion`, `tm-normal`, `fire-stone`; computed `image-rendering: pixelated` |
  | App bar icon | Pelipper `pokemon/279.png`, loaded, natural **96×96**, pixelated, `mdi-mail` fallback wired |
  | Favicon | `<link rel="icon" type="image/png">` → the same hotlinked 279 sprite |
  | Default theme on first load | **`v-theme--pelipperLight`** |
  | Sky | gradient present, opacity **1** in light / **0** in dark; 3 cloud layers at **210s / 135s / 90s** |
  | Delivery map | 6 dots, 6 labels (Kanto…Galar), 4 dashed arcs (`6px, 7px`), Pelipper **moving** (position changed over 2.5s) |
  | Reduced motion | cloud animations **`none`**, `animateMotion` **not rendered**, sprite **parked** (identical position over 3s), arcs/labels/dots still drawn |
  | Theme toggle | light → dark → light, sky follows |

  **Light-variant chart colours vs the card surface, which is still `#FFFFFF`:**

  | Colour | | Contrast |
  |---|---|---|
  | `#0072B2` | Poké Balls | 5.19:1 ✅ |
  | `#D55E00` | Berries | 3.87:1 ✅ |
  | `#009E73` | Potions | 3.42:1 ✅ |
  | `#CC79A7` | TMs | **3.06:1** ✅ |
  | `#6B4E00` | Evolution Stones | 7.74:1 ✅ |

  All ≥ 3:1. **Unchanged from before the extension, because the card surface was deliberately not
  touched** — the §6 warning table holds. The new `muted` `#4E6174` measures **5.22:1** on the sky
  base and **4.90:1** on the deepest gradient stop, both above the 4.5:1 text floor.

  Two implementation notes worth keeping:

  1. **SMIL `<animateMotion>` cannot be disabled by a CSS media query.** Reduced motion is read via
     `window.matchMedia` with a `change` listener, and the animation element is simply not rendered;
     the sprite is placed at a node instead. A CSS-only approach would have silently kept animating.
  2. **A scoped `:global(.v-theme--pelipperLight) .sky` selector did not match** — the sky rendered at
     `opacity: 0` in light mode on the first attempt. Caught by measuring computed opacity rather than
     by eye. Replaced with a template-bound class (`:class="{ 'sky--visible': !isDark }"`), which
     doesn't depend on how scoped CSS rewrites `:global()`.

- **2026-09-18 — Illustrated delivery map.** Alex supplied `src/assets/delivery-map.svg`, an original
  illustrated world map, replacing the abstract node diagram. `src/assets/` exists again as a result
  (it was removed in Phase 2); `BRIEF.md` §3 now documents it as **original artwork only** — the
  hotlink-never-store rule for Pokémon sprites is unchanged. Brief change and implementation were
  committed separately.

  | Verified | Result |
  |---|---|
  | Inlined, not `<img>` | `inlined: true`, `isImgTag: false` — CSS vars and SMIL reach inside |
  | Artwork intact | 30 waypoints, 52 waves, 6 labels (Kanto…Galar), `#pp-flight-route` present |
  | Path not duplicated | `<mpath href="#pp-flight-route">` — references the existing path |
  | Full bleed | card 1152px / map 1152px, **0px inset** both sides; ratio **1.600** (16/10 viewBox) |
  | Flight | sprite position advances continuously; 52s loop (brief asks 40–60s) |
  | Flip | mirrors at **29.03s**; true path apex is **28.94s** → within **0.09s** |
  | Waypoint pulses | 30 markers, 28 distinct negative delays on one shared 52s timeline |
  | Dark theme | all 13 `--ppmap-*` resolve to dark values; labels `#e6edf3` on `#0e1621` halo |
  | Reduced motion | no `animateMotion`, no flip, waypoint + wave `animation-name: none`, sprite parked; 30/52/6 elements still drawn |
  | Frame rate | **60.0–60.4 fps** sustained during the loop |
  | Build / console | `npm run build` exit 0, no TS errors, **0 console errors or warnings** |

  Two bugs found by measuring rather than looking — both would have passed a screenshot review:

  1. **`<animate attributeName="transform" type="scale">` is silently ignored.** `type` belongs to
     `<animateTransform>`, and values must be numeric `"1 1"` / `"-1 1"` pairs, not `scale(...)`
     strings. The element existed and looked right in the DOM while the sprite never mirrored —
     caught by sampling the image's screen CTM against travel direction, not by eye.
  2. **Scoped `:global(.v-theme--pelipperDark) .pp-map` didn't match**, so the entire dark palette was
     inert and the map stayed in light colours under the dark theme. Same failure as the sky layer in
     the previous extension; same fix — bind the class from the template (`'pp-map--dark': isDark`).
     **This selector pattern has now failed twice in this codebase. Don't reach for it again.**

  The flip point and each waypoint's pulse timing are both **measured from the path at runtime**
  (`getPointAtLength` sampling) rather than hardcoded, so they stay correct if the route is ever
  redrawn.

- **2026-09-22 — Dense multi-card executive layout.** Sidebar + top bar shell, five-KPI strip, and
  three new cards computed entirely from the existing 72 records. Brief and implementation committed
  separately. **`npm run build` exit 0, validator exit 0, 0 console errors.**

  | Verified | Result |
  |---|---|
  | Density vs §4 | KPI **28px/700**, label **11px uppercase .06em**, padding **20px**, radius **12px**, border **1px**, title **15px/600**, subtitle **12px**, delta a **999px pill**, content max **1440px** — all measured from computed style |
  | Shell | sidebar **220px**, 5 nav items, wordmark + "Executive Dashboard", top bar title + meta, **2 filters in the top bar**, map **absent** |
  | Filters compose | Hoenn + Aug 2026 → **3,242 / 342 / 38 / 5** on the matching cards |
  | New cards respond | signals **5 → 3**, cargo shares shift, health rows change, roster **7 → 1** |
  | Sidebar nav | clicking *Couriers* scrolls to y=1002 and the active item follows |
  | About dialog | opens, states the data is fabricated |
  | Themes | light ⇄ dark both directions |
  | NaN anywhere | none, in any filter state |

  **Constraints held:** `metrics.json` unchanged, chart palettes unchanged, card surface still
  `#FFFFFF`. Light-variant contrast therefore unchanged and re-measured anyway — 5.19 / 3.87 / 3.42 /
  **3.06** / 7.74, all ≥ 3:1.

  Three things worth flagging:

  1. **On-Time Rate now shows its delta in percentage POINTS, not relative percent.** The card read
     "3.1%" when the rate moved 93.0 → 90.2, which invites reading it as three points. Added a
     `trendUnit` prop; the KPI now reads **"2.8 pts"**. This was a genuinely misleading number on the
     most-scrutinised row of an exec dashboard.
  2. **"Avg Parcels per Courier Run" is only meaningful at the All Months scope.** Courier `runs` in
     `metrics.json` are lifetime totals with no time dimension, so filtering to one month divides a
     single month's parcels by a career's worth of runs — it reads **61** across the year and **5**
     for Hoenn in August. The basis is stated in the row's tooltip. Fixing it properly needs a
     per-month run count in the dataset, which is a `BRIEF.md` §2 change.
  3. **Two theme toggles now exist** — one in the sidebar footer, one in the top bar — because §4
     specifies both. They share state so they stay in sync.

  **Vuetify override notes**, both found by measuring computed style rather than by eye:
  `rounded="lg"` in the `VCard` defaults emits a `!important` utility class that beat the 12px radius
  (removed the default), and `v-container`'s own breakpoint maximum capped the page at 1200px rather
  than 1440px (needed `.v-container.pelipper-width` for specificity).

- 📁 **`src/assets/delivery-map.svg` is retained but UNREFERENCED.** The Delivery Network card was
  removed in the 2026-09-22 restructure. The artwork is original work and is deliberately kept in the
  repo — `grep -rn "DeliveryNetwork" src/` returns nothing, and `src/components/DeliveryNetwork.vue`
  was deleted. Re-inlining it later is a component away; the file is not dead weight by accident.

- **2026-09-22 — Four rulings applied: doughnut removed, layout tightened.**

  1. **RATIFIED — `trendUnit: 'points'`** for On-Time Rate. See the standing rule in §8.
  2. **Cargo Mix doughnut deleted.** It showed the same data as *Top Cargo Categories*, and the bars
     carry more (item sprite, absolute value, share). `CargoMixChart.vue` and the now-unused
     `cargoChart` computed were both removed — no dead code left behind. New row order: KPI strip /
     trend + region bars (2/3 + 1/3) / three derived cards / full-width roster.
  3. **`Avg Parcels per Courier Run` → `Avg Monthly Parcel Volume`.** See the declined item in §8.
  4. **Top-bar theme toggle removed**, sidebar footer one kept. Verified there are now **0** toggles
     in the top bar and the sidebar one still switches both directions.

  **Fit at 1440×900 — improved but still overruns by 166px.** Page height **1815 → 1409**; the roster
  now starts at **979** against an 813px usable viewport. Measured budget: top bar 65, KPI section
  172, trend row 354, three-card row 337, section margins 16 each. **Nothing was shrunk to make the
  number look better** — chart heights are untouched as instructed, and the options for closing the
  remaining gap are with Alex.

  Re-verified after the change: validator **exit 0**, `metrics.json` unchanged, chart palettes
  unchanged, build **exit 0**, **0 console errors**, Hoenn + Aug 2026 still **3,242 / 342 / 38 / 5**,
  all three derived cards still respond to both filters, both themes work.

- **2026-09-22 — Card copy tightened, redundant chrome removed.** Six edits: the *About this data*
  dialog and its sidebar row deleted, `· mock dataset` dropped from the top bar, the filter summary
  moved under the **Overview** heading as its subtitle, the page footer removed, *"Nothing here is
  hardcoded."* struck from the Signals card, and **all six card subtitles rewritten to say what the
  card SHOWS** — no derivation, thresholds, filter behaviour or dot-colour legends.

  The subtitles are now **specified in `BRIEF.md` §4 under *Card copy*** rather than invented per
  phase, which is what let them drift into explaining themselves in the first place.

  **The fabricated-data disclosure is not lost** — `README.md` carries a dedicated *All of the data
  is fake* section opening "Every number in this repository is fabricated." Verified present before
  removing the in-app copies.

  **A real defect surfaced by the "no content touches a card edge" check:** `.pp-card-pad` computed
  to **0px**. The rule existed and looked right in the stylesheet, but a lone `.pp-card-pad` (0,1,0)
  ties with Vuetify's own `.v-card` rule and loses on cascade order — so the six non-KPI cards had
  been running with **zero padding**, content flush to the border. Fixed with `.v-card.pp-card-pad`.
  All eleven cards now measure a uniform **21px** minimum gap from content to card edge.

  Re-verified: validator **exit 0**, `metrics.json` unchanged, chart palettes unchanged, build
  **exit 0**, **0 console errors**, both themes, both filters still driving every card.
  Page height 1494, roster top 1076 — the roster stays below the fold, as ratified.

- **2026-09-22 — Split into six routed pages.** Sidebar items are real routes now, not anchors.
  Docs amended and committed separately (`CLAUDE.md` rule 6 rewritten on Alex's instruction,
  `BRIEF.md` §3 structure and §4 per-page spec).

  | Verified | Result |
  |---|---|
  | Routes | `/` `/trends` `/signals` `/cargo` `/network` `/couriers` all load; `/does-not-exist` → `/` |
  | Nav order | **Overview · Trends · Signals · Cargo · Network · Couriers** — matches the Overview card order |
  | Active highlight | from the route; the `IntersectionObserver` scroll-spy is **fully removed** |
  | Filter persistence | Hoenn + Aug 2026 set on Overview survives all six routes and the round trip back — KPIs **10,479 / 3,242 / 88.2% / 38 / 5** before and after |
  | Card padding | **21px** minimum content-to-edge gap on **every** route |
  | Console | 0 errors on every route |
  | Build / validator | both **exit 0**; `metrics.json` and chart palettes untouched |
  | Themes | light ⇄ dark on a detail route |

  **Filter state needed no change.** `selectedMonth` / `selectedRegion` were already at module scope
  in `useMetrics.ts` — the shared-instance requirement was satisfied before this phase, and was
  verified empirically across all six routes rather than assumed from reading the code.

  **Bundle — the chunk-size warning is gone.** Main chunk **579.39 kB → 347.21 kB**, with Chart.js
  split out to its own 172.52 kB chunk and each route 0.5–8 kB. This does **not** contradict the
  earlier decision to keep Chart.js eagerly bundled: that call was about not deferring above-the-fold
  code, and Chart.js is still fetched on first paint — just in parallel as a separately cacheable
  chunk rather than inlined. Nothing was deferred that the first screen needs.

  `RegionBarChart.vue` was replaced by a generic `BarSeriesChart.vue` (adds an optional target line
  and percent formatting) rather than duplicated, and deleted.

  **Verification-harness note:** the first route run reported the Month filter as not persisting.
  That was a defect in the test script — its `center()` helper omitted the `scrollIntoView` the
  earlier scripts had, so the click landed off-target on an option scrolled out of the menu. The app
  was correct. Worth recording because a harness bug that *looks* like an app bug is the expensive
  kind: the fix is to make the helper scroll before measuring, and to sanity-check a "failure"
  against the rendered values before touching application code.

- **2026-09-22 — Dataset expanded and pages rebuilt per dimension.** Two commits.

  **Data (`4559e9a`).** Seven new fields per region-month (`firstAttemptRate`, `avgTransitDays`,
  `damagedParcels`, `returnedParcels`, `costPerParcel`, `capacityUtilization`, `exceptionsByCause`),
  a new top-level `cargoProperties` block, and four operational fields per courier. Regenerated with
  the **same seed (20260918)**; every existing field and seasonality rule survives.

  **The validator's new checks were tested against the OLD data first** — the same discipline used
  for the cargo-mix equality. They produced **897 failures** on the pre-expansion file (missing
  fields, missing causes, absent cargo properties) before the new data was generated. A check that
  has only ever seen passing data proves nothing.

  New validator output on the new data — all green:
  `Storm transit 3.17d vs 2.49d` · `Gym Season transit 2.20d vs 2.49d` ·
  `Storm cost/parcel 325 vs 266` · `Storm first-attempt 83.3% vs 88.0%` ·
  `Top storm cause: Storm grounding`.

  **Pages (`<this commit>`).** Governing rule added to `BRIEF.md` §4: each page owns one dimension,
  and a metric's headline value appears on exactly one card in the app.

  **Four duplications were found by the audit and fixed** — the audit is the deliverable, not the
  claim that it happened:

  | Duplicate | Was on | Fix |
  |---|---|---|
  | Top Cargo Categories (identical bars) | `/` and `/cargo` | Overview now shows a compact **Cargo Share** top-3 list; the bars are `/cargo`'s single volume view |
  | Network Reliability & Fulfillment Health | `/` and `/network` | Overview now shows **Reliability Snapshot**, filtered to rows *not* already in the KPI strip |
  | On-Time Rate by Region | `/signals` and `/network` | Signals now shows **Regions Below Target** (breaches only); the six-region comparison is `/network`'s |
  | The trend chart, identical on both | `/` and `/trends` | Overview renders the **parcels panel only**; `/trends` owns the paired parcels + gym-runs view |

  Post-fix audit: **0 duplicate cards across all six routes.** 21px minimum content-to-edge gap on
  every route, 0 console errors, no NaN in any filter state.

  Constraints held: chart palettes untouched, `metrics.json` unchanged after commit 1, validator
  exit 0, filters shared and driving every new card, both themes.

- **2026-09-22 — Weather, lockup, night sky, navigation rename.** Two commits.

  **Data (`6ead420`).** Eighth courier **Dawdle** (Slowpoke, 79, Johto) as a deliberate outlier —
  6.8d transit vs 3.4 next worst, 8 stops/run vs 19, 0.3% damage vs 0.9% best, 86.1% on-time
  (lowest), 93.4% first-attempt (highest). Couriers gained `avgTransitDays` and `damageRate`; a new
  top-level `weather` block carries current conditions per region. New validator checks were run
  against the OLD data first and produced **17 failures** before the new data existed.

  **UI (`<this commit>`).**

  | Change | Result |
  |---|---|
  | Page titles | one shared `PageHeader` on all six — **20px / 700** title, 13px subtitle, 12px muted scope line. Overview previously used a bespoke 11px eyebrow. |
  | Brand lockup | `BrandLockup.vue` — 44px sprite + **PELIPPER** 17px/800 over **POST & FREIGHT** 8.5px/600 at 0.17em, primary colour. Collapses to sprite-only in the rail. |
  | Routes | `/signals` → `/exceptions`, `/network` → `/regions`; both old paths redirect, `/nonsense` → `/` |
  | Night sky | two parallax star layers (260s / 150s) plus cloud bands (320s), opacities 0.35 / 0.5 / 0.14 |
  | Weather card | six regions, Sinnoh (High) first; all icons verified |
  | Roster weather | icon + risk chip on both the Overview preview and the Courier Fleet roster; temperature dropped to keep the table compact |

  **Two defects caught by verification, both of which passed a screenshot:**

  1. **The night-sky CSS never landed.** The edit's anchor text didn't match, so the markup shipped
     with no styles — `.night` computed `opacity: 1` in *both* themes and `animation-duration: 0s`.
     A screenshot of the dark theme looked fine because the layers were invisible either way.
     Caught by reading computed style, not by looking.
  2. **The first weather-icon test did not discriminate.** Measuring the `.v-icon` box width returned
     20px for a real name *and* a bogus one, because the box is fixed regardless of glyph. Replaced
     with a `::before` content check: a real name yields a codepoint, a bogus one yields `none` —
     verified by deliberately rendering `mdi-weather-notarealicon`. **A test that cannot fail proves
     nothing**; this is the same discipline used for the validator's new checks.

  Re-verified after both fixes: all six routes load, old paths redirect, 21px minimum card gap on
  every route, 0 console errors, no NaN, both themes, reduced motion stops clouds *and* night while
  leaving both visible. Validator exit 0, `metrics.json` unchanged since the data commit, chart
  palettes untouched.

- **2026-09-22 — Nested card shell, glass sidebar, account top bar.**

  | Change | Verified |
  |---|---|
  | Nested shell | one `.pp-shell` per page: **24px padding / 16px radius**; inner cards 12px radius, lighter border and shadow |
  | Glass sidebar | `blur(18px) saturate(1.5)`, hairline border, **solid-surface `@supports` fallback** |
  | Nav contrast | **7.97:1 light · 5.08:1 dark** — measured from composited screenshot pixels, not computed from the token |
  | Filters | moved into the shell (2 selects per page, **0 in the top bar**), still shared across all six routes |
  | Top bar | account identity only — Wren Calloway, avatar loaded |
  | Row fill | **100% on every route**, including the KPI strip |
  | Card gaps | 21px minimum on every route · 0 console errors · no NaN |

  **Trainer sprites do not exist.** The PokeAPI sprites repo contains only `badges`, `items`,
  `pokemon` and `types` — every `sprites/trainers/*` candidate 404s, confirmed against the GitHub
  contents API. The account avatar falls back to **Noctowl (164)**, chosen because it is neither the
  Pelipper brand mark nor any of the eight couriers, so it can't be misread as either.

  **Two regressions I introduced and caught before committing:**

  1. **Cargo Share lost its styling.** Making Top Couriers full-width replaced the `.top*` CSS with
     `.fleet*`, but the Cargo Share list still used `.top` — it rendered as a bulleted list with
     `Poké Balls31.7%` run together. Found by looking at the screenshot; the build and every
     numeric check passed. Given its own `.mini` styles.
  2. **The KPI strip had dead space.** Five cards at `lg="2"` occupy 10 of 12 columns, so the row
     measured **83% full** — the exact defect this phase was meant to remove, in a row I hadn't
     thought to question. Replaced with an auto-fit grid; now 100%. **Five does not divide twelve**
     — any odd card count needs a grid, not `v-col` widths.

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

- ⛔️ **CONSIDERED AND DECLINED — code-splitting Chart.js. Do not re-raise.** Adding `chart.js` +
  `vue-chartjs` took the JS bundle from 325.70 kB to **534.43 kB** (gzip 180.89 kB), past Vite's
  default 500 kB warning threshold. The build exits 0; the warning is cosmetic.

  **Declined because Chart.js is above-the-fold content that every page view needs immediately.**
  Lazy-loading it would trade a visible flash of empty chart containers on first paint for a
  cosmetic terminal warning. That's a worse dashboard in exchange for a tidier build log.

  **This deliberately differs from the `vite-plugin-vuetify` decision, and the distinction is the
  point.** There, the waste was Vuetify components that nobody ever rendered — removing them cost
  the user nothing. Here, every byte is used on first paint. The principle is **"don't defer what's
  needed immediately"**, not "always split". A bundle-size number is not a goal in itself; what
  matters is whether the bytes earn their place.

  Also do **not** raise `build.chunkSizeWarningLimit` to silence it — that hides the number rather
  than improving it, and the number is worth seeing if it ever grows again for a worse reason.

- ✅ **RESOLVED 2026-09-18 — categorical chart palette replaced with Okabe–Ito.** `BRIEF.md` §6 now
  specifies two palettes for two jobs: the original blue ramp stays for the **ordered** twelve-month
  trend chart, and **Okabe–Ito** (two theme variants) covers the **unordered** cargo-mix doughnut and
  region bar chart. Root cause was the spec, not the implementation: a sequential ramp was being used
  for categorical data, and four near-neighbour blues cannot be mutually distinguishable.

  Measured with a Viénot–Brettel–Mollon LMS dichromat simulation and CIEDE2000, all ten pairs.
  Worst red-green separation is now **ΔE 11.7 deutan / 14.3 protan** (dark) and **18.0 / 12.2**
  (light), against a floor of 8. Every slot clears 3:1 on its own surface. Full table in `BRIEF.md` §6.

  Kept, because they were right and they mean identity never rests on colour alone: the 2px
  surface-coloured segment gaps and the legend carrying label + value + share.

  **Residual, accepted:** under **tritanopia** (~0.01% of people) Berries/TMs sit at ΔE 0.6 in the
  light theme. Not fixable while keeping Okabe–Ito, which is optimised for the far more common
  red-green types. The value+share legend is the mitigation. Recorded in `BRIEF.md` §6.

- ~~🟡 **The brief's chart palette fails the categorical colour-contrast check.**~~ *(superseded by
  the entry above — kept for the record of what was measured)*
  `BRIEF.md` §6 fixes the series colours as `#4FA3D1, #7FD1E8, #F2A65A, #9BB8D3, #2E6E92`. Run
  through a perceptual-contrast validator against the dark surface `#16202E`, the five-colour
  categorical palette fails:

  | Check | Result |
  |---|---|
  | Normal-vision separation | **FAIL** — `#7FD1E8` ↔ `#4FA3D1` ΔE **13.9**, below the 15 floor |
  | Chroma floor | FAIL — `#7FD1E8`, `#9BB8D3`, `#2E6E92` read close to grey |
  | Contrast vs surface | WARN — `#2E6E92` at 2.94:1, under 3:1 |
  | CVD separation | PASS — ΔE 13.8 protan / 12.8 tritan |

  In plain terms: **Poké Balls and Berries are adjacent doughnut segments in two blues that are hard
  to tell apart even with full colour vision**, and Evolution Stones is dim against the card.

  **The brief wins — the colours are used exactly as specified** (`CLAUDE.md` rule 1). The relief
  applied instead: a 2px surface-coloured gap between every segment, and an HTML legend carrying the
  **label, the value and the share** for each segment, so identity never depends on colour alone.
  That's a mitigation, not a fix.

  **If Alex wants the real fix**, the cheapest version keeps the brief's five hues but re-orders them
  so the two similar blues are never adjacent, and darkens `#7FD1E8` a step. That is a change to
  `BRIEF.md` §6 and is his decision, not one to make silently.

- ⚠️ **STANDING RULE — a single-class global rule will lose to Vuetify. Use two classes.**
  This has now bitten **three times**: card radius (`rounded="lg"` utility carried `!important`),
  content max-width (`v-container`'s own breakpoint maximum), and card padding (`.pp-card-pad`
  computed to 0px against `.v-card`). In every case the rule was present and looked correct in the
  stylesheet while computing to the wrong value. **Write `.v-card.pp-card-pad`, not `.pp-card-pad`**,
  and **verify with `getComputedStyle`, never by eye** — all three of these passed visual review.
  `CLAUDE.md` rule 8 says fix it with Vuetify props and specificity, not `!important`; that still
  holds.

- 📏 **STANDING RULE — a delta on a RATE metric is reported in percentage POINTS, never percent.**
  `MetricCard` takes `trendUnit: 'relative' | 'points'`; any metric whose value is itself a rate must
  pass `'points'`. On-Time Rate moving 93.0 → 90.2 is **2.8 points**, not "3.1%", and the two get
  misquoted for each other constantly. This applies to every rate metric added in future, not just
  this one.

- ⛔️ **CONSIDERED AND DECLINED — per-month courier run counts. Do not re-raise.**
  `Courier.runs` in `metrics.json` is a lifetime total with no time dimension, which made the old
  *Avg Parcels per Courier Run* row meaningless under a month filter (61 across the year, 5 for
  Hoenn in August — a single month's parcels over a whole career's runs).

  **Adding a per-month run count was rejected** because it means regenerating `metrics.json`, and
  that dataset is validated and the validator is tuned to it — regenerating risks the seasonality
  rules (Gym Season lift, December berry rush, the Hoenn storm dip) that were expensive to get right.
  The row was **replaced** with **Avg Monthly Parcel Volume** instead, which is well-defined at every
  filter combination: parcels in scope ÷ months in scope, coloured against the same region scope's
  twelve-month average.

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

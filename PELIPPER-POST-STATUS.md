# PELIPPER POST & FREIGHT — Project Status

> **If you are Claude and you're reading this at the start of a session:** this file is the
> single source of truth for where this project stands. Read it, then read `CLAUDE.md` and
> `BRIEF.md`, then tell Alex where we left off and what's next. **Do not start work until he
> confirms.** Update this file at the end of every phase — it's how Alex picks this up on a
> different machine.

- **Last updated:** 2026-09-18 — Phase 1 complete (static HTML prototype)
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
| — | 2.1 | Import repo into Vercel (browser, one time) | ⬜ Not started | — |
| 2a | 2.2 | Vue + Vite + TS + Router scaffold | ⬜ Not started | `Scaffold Vue project with Vite, TypeScript, and Vue Router` |
| 2b | 2.2 | Dashboard shell replaces starter content | ⬜ Not started | `Add dashboard shell` |
| 3 | 2.3 | Vuetify 3 + MDI, refactor shell | ⬜ Not started | `Add Vuetify 3 and refactor dashboard shell to Vuetify components` |
| 4 | 2.3 | Custom `MetricCard` component | ⬜ Not started | `Extract reusable MetricCard component with typed props` |
| 5 | 2.4 | Mock dataset `src/data/metrics.json` | ⬜ Not started | `Add realistic mock metrics dataset and TypeScript types` |
| 6 | 2.4 | Full dashboard — charts, filters, roster | ⬜ Not started | `Build full dashboard with charts, filters, and courier roster` |
| 7 | — | Final pass: cleanup, README | ⬜ Not started | `Final pass: cleanup, README, and documentation` |
| 8 | — | Submit repo + live URL on Workday | ⬜ Not started | — |

**Status key:** ⬜ Not started · 🟡 In progress · ✅ Done

---

## 4. → NEXT STEP

**Import the repo into Vercel.** One browser step, done once: go to vercel.com/new, import
`alexanderquijada/pelipper-post`, accept the defaults (it's static HTML right now — no framework
preset, no build command), deploy, then paste the live URL into section 5 below.

Then **Phase 2** from `CLAUDE-CODE-PROMPTS.md` — the Vue + Vite + TypeScript + Router scaffold.
Phase 2 deletes `index.html`, `styles.css`, and `app.js`; the prototype is meant to be thrown away.

---

## 5. Live links

| What | URL |
|---|---|
| GitHub repo | https://github.com/alexanderquijada/pelipper-post |
| Vercel project | _not created yet_ |
| Live dashboard | _not deployed yet_ |
| Local dev server | `http://localhost:5173` (after Phase 2) |

---

## 6. Environment

- macOS (Darwin 25.6.0)
- Project root: `~/Projects/pelipper-post`
- Node: _record the version here after Phase 0_
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

---

## 8. Known issues / watch list

- **Sprite CDN check:** **VERIFIED on this machine.** Use `sprites/pokemon/other/official-artwork/{dexId}.png` - returned HTTP 200.
  <!-- setup.sh rewrites the line above with the live result of testing the sprite URLs -->
  Fallback URL pattern and an MDI icon fallback are both specified in `BRIEF.md` §2.
- **Nested-folder trap.** `npm create vue@latest` will try to scaffold into a subfolder. Phase 2's
  prompt handles it, but check the file tree after Phase 2 — a stray subfolder is the single most
  common way this build goes sideways (it happened twice in the capstone videos).
- **Vercel framework switch.** The Vercel project is created against static HTML in Phase 1, then
  becomes a Vite app in Phase 2. Vercel normally re-detects this on its own; if the Phase 2 build
  fails, check Project → Settings → Build & Output and confirm framework preset = Vite,
  build command = `npm run build`, output dir = `dist`.
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

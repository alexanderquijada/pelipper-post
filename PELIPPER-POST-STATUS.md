# PELIPPER POST & FREIGHT — Project Status

> **If you are Claude and you're reading this at the start of a session:** this file is the
> single source of truth for where this project stands. Read it, then read `CLAUDE.md` and
> `BRIEF.md`, then tell Alex where we left off and what's next. **Do not start work until he
> confirms.** Update this file at the end of every phase — it's how Alex picks this up on a
> different machine.

- **Last updated:** 2026-09-18 — Phase 1 complete; live URL still 404ing (Vercel build queue, §8)
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

**Phase 2 — the Vue + Vite + TypeScript + Router scaffold.** Paste the Phase 2 prompt from
`CLAUDE-CODE-PROMPTS.md`. It scaffolds into the repo **root** (watch for the nested-folder trap),
deletes the static prototype (`index.html`, `styles.css`, `app.js`) and all Vue starter content,
wires one route `/` → `HomeView`, and builds the dashboard shell. Two commits, not one.

**Phase 2 must also overwrite the root `vercel.json`** with the Vite config — it currently holds only
`{ "outputDirectory": "." }` for the static deploy, and that value is wrong the moment there's a build
step. Without the swap the live site breaks. See the second red item in section 8.

**Note the live site is 404ing right now** (first red item in section 8) — that's a separate, open
problem from the Phase 2 framework switch, and it predates the scaffold.

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

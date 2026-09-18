# Claude Code prompts — copy and paste, one phase at a time

Six phases. Each maps to a capstone step so your commit history mirrors the rubric.
Run each phase, **look at the result in the browser**, redirect in plain language if it's wrong,
then move on. Don't run two phases at once.

| Phase | Capstone step | Produces |
|---|---|---|
| 1 | 2.1 | GitHub repo + BRIEF.md + static HTML prototype, deployed |
| 2 | 2.2 | Vue + Vite + TypeScript + Router scaffold, dashboard shell |
| 3 | 2.3 | Vuetify 3 + MDI, shell refactored to components |
| 4 | 2.3 | Custom `MetricCard` component extracted |
| 5 | 2.4 | Mock dataset `src/data/metrics.json` |
| 6 | 2.4 | Full dashboard: charts, filters, courier roster |

---

## Phase 1 — Repo, brief, static prototype

*Capstone step 2.1. This is the "plain HTML first" rep from Video 201. It gets thrown away in
Phase 2 — that's the point, it proves the brief-first loop before the framework arrives.*

*`setup.sh` has already created the git repo, the GitHub remote, the `.gitignore`, and the first
commit — so this phase is only the prototype itself.*

```
Read CLAUDE.md and BRIEF.md in full before doing anything.

Then do all of the following:

1. Build a static HTML prototype of the dashboard described in BRIEF.md, using only
   plain HTML, CSS, and vanilla JavaScript — no frameworks, no build step, no npm.
   Files: index.html, styles.css, app.js.
   - Follow the Layout and Style sections of BRIEF.md: app bar, filter row, four KPI
     cards, two chart placeholders side by side, one full-width chart placeholder,
     courier roster table, footer.
   - Hardcode a handful of plausible numbers directly in the HTML. No JSON file yet,
     no real charts yet — use simple labeled placeholder boxes with dashed borders
     where the charts will go.
   - Do render the courier roster for real, with actual hotlinked Pokémon sprites from
     the URL pattern in BRIEF.md, so we can confirm early that sprite hotlinking works.
   - Use the exact dark palette from the Style section of BRIEF.md.
   - Make the filter dropdowns present but non-functional.

2. Open index.html in my browser and confirm the sprites actually load. Section 8 of
   PELIPPER-POST-STATUS.md records which sprite URL pattern tested good on this machine
   — use that one.

3. Commit and push: "Add static dashboard prototype"

4. Update PELIPPER-POST-STATUS.md: mark Phase 1 done and note anything you had to
   decide that the brief didn't cover.

Then tell me what to look at.
```

**After Phase 1:** look at it in the browser. Then do the one browser step in `SETUP.md` — import the
repo at vercel.com/new — and paste the live URL into `PELIPPER-POST-STATUS.md`.

---

## Phase 2 — Vue scaffold + dashboard shell

*Capstone step 2.2.*

```
Read CLAUDE.md and BRIEF.md.

Scaffold a Vue project in THIS repo, at the ROOT — not in a subfolder.

Use the create-vue scaffolding tool with Vite. Turn ON TypeScript and Vue Router.
Turn OFF / answer no to Pinia, unit testing, end-to-end testing, JSX, ESLint,
Prettier, and any experimental features.

Run every command in the terminal yourself. Use non-interactive flags where the tool
supports them so it doesn't stall on prompts.

Important — the scaffolder will want to create a nested folder. Let it create the
nested folder, then move every file and folder (including dotfiles) out to the repo
root, and delete the now-empty subfolder. Do not leave anything nested. Merge the new
.gitignore with the one already here rather than overwriting it. Do not overwrite or
delete BRIEF.md, CLAUDE.md, or PELIPPER-POST-STATUS.md.

Then, in this order — note there are TWO separate commits in this phase:

1. Run `npm install`, confirm the scaffold works, then commit and push right away:
   "Scaffold Vue project with Vite, TypeScript, and Vue Router"

2. Delete the static prototype files (index.html at root gets replaced by Vite's own,
   plus styles.css and app.js) and all Vue starter content: HelloWorld.vue,
   AboutView.vue, the Vue logo assets, TheWelcome/WelcomeItem components, and the
   starter CSS in src/assets.

3. Configure the router with exactly one route: `/` -> HomeView.

4. Build the dashboard SHELL in src/views/HomeView.vue, following the Layout section of
   BRIEF.md — header, filter row, four KPI card slots, two side-by-side chart slots, one
   full-width chart slot, courier roster slot, footer. Plain semantic HTML with scoped
   CSS for now; we add Vuetify in the next phase. Use the dark palette from BRIEF.md.
   Placeholder content is fine — this phase is about structure, not data.

5. Start the dev server and tell me the local URL. Then run `npm run build` and confirm
   it succeeds with no TypeScript errors.

6. Commit and push again: "Add dashboard shell"

7. Update PELIPPER-POST-STATUS.md.

Then walk me through the folder structure you created, in plain language — what each
top-level folder in src/ is for.
```

**After Phase 2:** open the local dev URL. Check your Vercel dashboard — the push should have
triggered a build, and Vercel should now auto-detect Vite. If that build fails, use the fix prompt
at the bottom of this file.

---

## Phase 3 — Vuetify 3 + refactor

*Capstone step 2.3, part 1.*

```
Read CLAUDE.md and BRIEF.md.

Add Vuetify 3 to this Vue project:
- Install the vuetify package, plus @mdi/font for Material Design Icons.
- Set up the Vuetify plugin in src/main.ts.
- Import the Vuetify styles and the MDI font CSS explicitly — don't assume they come
  in automatically.
- Register the two named themes from the Style section of BRIEF.md: `pelipperDark`
  (the default) and `pelipperLight`, with the exact color values in the table.

Then refactor the dashboard shell to use Vuetify components instead of hand-written
HTML and CSS:
- v-app and v-main for the page shell
- v-app-bar for the header, with an mdi-mail icon, the wordmark, the tagline as muted
  subtitle text, and a theme toggle button on the right that switches between
  pelipperDark and pelipperLight
- v-container / v-row / v-col for the responsive grid, centered, max width about 1400px
- v-card for the four KPI tiles and for each chart container
- v-select for the two filter dropdowns (still non-functional this phase)
- v-table for the courier roster, with v-avatar for the circular sprites and v-chip for
  the status column
- Remove the custom CSS you wrote in Phase 2 that Vuetify now handles. Keep only what
  Vuetify genuinely can't do.

Pay attention to spacing — the Style section asks for generous whitespace and visible
gaps between cards. Do not let the tiles crowd each other or jam against the left edge.

Verify in the browser that the theme toggle works both directions and that the MDI
icons actually render (not empty boxes). Run `npm run build` and confirm it passes.

Commit and push: "Add Vuetify 3 and refactor dashboard shell to Vuetify components"

Update PELIPPER-POST-STATUS.md.
```

**After Phase 3:** this is where the videos spent the most time redirecting. Look at it carefully.
Spacing and centering prompts are at the bottom of this file. If words aren't landing, screenshot it
and paste the image straight into Claude Code — that trick works better than describing.

---

## Phase 4 — Custom MetricCard component

*Capstone step 2.3, part 2. Keep this separate from Phase 3 — the rubric wants to see you build a
custom component deliberately.*

```
Read CLAUDE.md and BRIEF.md.

Extract the four KPI tiles into one reusable custom component:
src/components/MetricCard.vue

Props (typed with TypeScript, using defineProps with a generic type):
- label: string          — the small uppercase muted label
- value: number          — the raw number
- format: 'number' | 'percent'  — how to display it; 'number' gets thousands separators,
                                  'percent' shows one decimal place
- trend: number | null   — the change vs previous period, as a fraction (0.084 = +8.4%).
                           null means show no trend indicator at all.
- invertTrend: boolean   — default false. When true, a DECREASE is good (green) and an
                           increase is bad (red). Used for Fainted Couriers.
- icon: string           — an mdi icon name shown in the card corner

The card renders: icon, label, the big value, and the trend arrow + percentage. Follow
the Style section of BRIEF.md — value is the largest type on the page, label small and
uppercase and letter-spaced above it, trend small below it, 24px internal padding,
rounded="lg", subtle elevation.

Then update HomeView.vue to use four <MetricCard> instances, passing all the data as
props. Suggested icons: mdi-circle-slice-8 for Poké Balls Shipped, mdi-food-apple for
Berry Crates, mdi-dumbbell for Gym Supply Runs, mdi-alert-circle-outline for Fainted
Couriers (invertTrend: true).

Hardcoded prop values are fine — the real data arrives in Phase 5.

Verify in the browser: all four cards render, the Fainted Couriers card shows green on
a decrease, and a card with trend={null} shows no arrow. Run `npm run build`.

Commit and push: "Extract reusable MetricCard component with typed props"

Update PELIPPER-POST-STATUS.md.
```

---

## Phase 5 — Mock dataset

*Capstone step 2.4, part 1. Data only — do not let it build the dashboard in this phase. Giving the
data its own turn is what makes it good.*

```
Read BRIEF.md, and focus on section 2 (Data).

Create ONLY the mock dataset this phase. Do not touch any component or view files.

Write src/data/metrics.json following the exact JSON shape in BRIEF.md:
- 12 months, Oct 2025 through Sep 2026
- All 6 regions present in every month (72 region records total)
- Every field in the metrics table, within the stated ranges
- Add TypeScript interfaces for the whole shape in src/types/metrics.ts

The realism requirements matter more than anything else here. Make sure all of these
are actually visible in the numbers:
- Gym Season lift in Mar-May
- Berry crate spike and on-time dip in December
- The Jul-Aug storm season: fainted couriers peak, on-time rate drops, and Hoenn
  (water routes) takes the biggest hit of any region
- Each region keeps its character across all twelve months, per the brief
- cargoMix values sum exactly to parcelsDelivered in every single record
- Month-over-month moves of ±3-15%, never a smooth line, no suspiciously round numbers

Also create the 7 couriers from the roster table in BRIEF.md, with runs and onTimeRate
consistent with their home region's character.

Write a throwaway generator script if that's easier than writing 72 records by hand —
but delete it afterward. Only metrics.json ships.

There is already a validator in this repo at scripts/validate-data.mjs that checks
every rule above. When you think the data is done, run it:

    node scripts/validate-data.mjs

Do NOT report this phase complete until that script exits green with zero problems.
If it reports problems, fix the data and run it again. Then paste me its full output —
I want to see the Hoenn storm dip chart it prints.

Commit and push: "Add realistic mock metrics dataset and TypeScript types"

Update PELIPPER-POST-STATUS.md.
```

**After Phase 5:** you don't have to read 72 records. The validator does it for you and prints a
little bar chart of Hoenn's on-time rate — you should be able to *see* the July/August storm dip.
If it's not obvious, say "the storm dip is too subtle, make it more pronounced" and have it
regenerate. Everything downstream is built on this data, so it's worth the extra loop.

---

## Phase 6 — Full dashboard

*Capstone step 2.4, part 2. The big one.*

```
Read CLAUDE.md and BRIEF.md in full.

Build the complete dashboard, wiring src/data/metrics.json into everything. Follow the
Layout, Interactions, and Style sections of BRIEF.md exactly.

1. Install chart.js and vue-chartjs.

2. Create src/composables/useMetrics.ts holding all filtering and aggregation logic:
   - reactive state for selectedMonth ('all' | month key) and selectedRegion
     ('all' | region name)
   - computed aggregates for the four KPI metrics, honoring both filters together
   - sums for count metrics, weighted averages for rate metrics — never average an
     average
   - previous-period comparison for each KPI's trend value, returning null when there's
     no prior month
   - computed datasets for all three charts
   - computed filtered courier list
   Keep this logic OUT of the components.

3. Create src/utils/sprites.ts with the dexId -> sprite URL builder from BRIEF.md.

4. Build the three chart components in src/components/charts/:
   - RegionBarChart.vue     — parcels by region, vertical bars
   - CargoMixChart.vue      — doughnut, 5 segments, legend
   - DeliveryTrendChart.vue — full-width area chart, gym supply runs and parcels
                              delivered across all 12 months
   Use the chart series colors from BRIEF.md in the order listed. Horizontal gridlines
   only at low opacity, no chart borders, no gridline clutter. Charts must resize with
   their container.

5. Build src/components/CourierRoster.vue — the v-table with circular sprite avatars.
   Include the mdi-truck-delivery-outline fallback on image error, per BRIEF.md.

6. Wire the two v-select filters to the composable so every card, chart, and the roster
   update reactively.

7. Handle the edge cases in the Interactions section: the bar chart's empty state when a
   single region is selected, the selected-month marker on the trend chart, the
   no-data message, and no NaN anywhere.

8. Delete anything left over from the starter template or from earlier phases that is
   now unused.

Then verify, and report actual results for each:
- dev server runs with zero console errors and zero TypeScript errors
- `npm run build` succeeds
- at least one sprite visibly renders
- picking Hoenn + Aug 2026 shows different numbers than All Months + All Regions
- the Fainted Couriers trend arrow is green when the number goes down
- the theme toggle still works

Commit and push: "Build full dashboard with charts, filters, and courier roster"

Update PELIPPER-POST-STATUS.md and mark the build complete.
```

**After Phase 6:** this is the review-and-redirect loop the rubric actually grades. Expect two or
three rounds. Use the prompts below.

---

# Redirect prompts — use these during review

Short, plain-language nudges. Copy, edit, paste.

### Spacing and layout

```
The four KPI cards are too tight — they're crowding each other and the numbers feel
cramped. Add real gutters between the cards and more internal padding. The Style
section of BRIEF.md asks for generous whitespace; right now it reads as dense.
```

```
The whole dashboard is shoved to the left instead of centered in the viewport, and it
doesn't flex nicely at desktop widths. Center the content, cap it around 1400px, and
make the grid actually respond between breakpoints.
```

```
Vuetify is overriding the layout rules you wrote. Stop fighting it with custom CSS —
solve this using Vuetify's own grid props and spacing utility classes instead.
```

### The screenshot trick — the single most effective move

When describing the problem isn't working, take a screenshot (**Cmd + Shift + 4**), then drag the
image into Claude Code, or copy it and paste with **Cmd + V**, with a message like:

```
Here's what it actually looks like. The problem is the middle chart row — the two charts
are different heights and the right one is overflowing its card. Fix it.
```

### Charts

```
The chart colors are all over the place. Use exactly the five series colors from the
Style section of BRIEF.md, in that order, across all three charts. No rainbow.
```

```
The trend chart is too tall and it's pushing the courier roster below the fold. Cap its
height around 280px and make it fill the width.
```

### Data and filters

```
Pick Hoenn + Aug 2026 and walk me through each KPI value — show me the numbers from
metrics.json that produce them. I want to confirm the filters are actually filtering and
not just re-rendering the same totals.
```

```
The trend arrows look wrong. Fainted Couriers should be green when the number goes DOWN.
Check the invertTrend prop is being passed and actually used.
```

### Fixing a failed Vercel build

```
The Vercel build failed. Run `npm run build` locally, read the actual error, fix every
TypeScript error it reports, then verify the build passes and commit and push.
```

### Session handoff / picking it up later

```
Read PELIPPER-POST-STATUS.md and CLAUDE.md, then tell me exactly where we left off and
what the next step is. Don't start work yet.
```

### Wrapping up for submission

```
We're done building. Do a final pass:
1. Run `npm run build` and confirm it passes.
2. Delete every unused file, component, and dependency — anything left over from the
   starter template or earlier phases.
3. Write a real README.md: what Pelipper Post & Freight is, the live Vercel URL, the
   tech stack, how to run it locally, a note that all data is mock, and a line crediting
   the PokeAPI sprite CDN and noting Pokémon is a Nintendo trademark.
4. Bring PELIPPER-POST-STATUS.md fully up to date and mark the capstone complete.
5. Commit and push: "Final pass: cleanup, README, and documentation"
Then give me the repo URL and the live URL so I can submit them.
```

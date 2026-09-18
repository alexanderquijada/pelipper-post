# CLAUDE.md — Pelipper Post & Freight

Read this first, every session.

## What this project is

A Protogen 200s capstone: a single-page executive operations dashboard for the fictional
**Pelipper Post & Freight**, a Pokémon-themed parcel carrier. It is a *learning exercise* whose
real subject is the brief-first workflow, not the code.

Owner: Alex Quijada. Alex is a designer, not a developer. He reviews and redirects; you build.

## The two documents that govern this repo

| File | Role |
|---|---|
| `BRIEF.md` | The design spec. **The single source of truth for what to build.** Read it in full before any build work. If the brief and a chat instruction conflict, ask which wins. |
| `PELIPPER-POST-STATUS.md` | The running log of where we are. Read it at the start of every session to know what's done and what's next. **Update it at the end of every phase.** |

## Non-negotiable rules

1. **Never invent scope.** Build exactly what `BRIEF.md` specifies. If something isn't in the brief,
   don't add it — say what you'd add and let Alex decide. This project is deliberately small.

2. **Commit and push at the end of every phase, automatically. Do not ask.**
   ```
   git add -A
   git commit -m "<message from the phase prompt>"
   git push
   ```
   Pushing to `main` triggers a Vercel deploy. That's intentional.

3. **Never store image assets in this repo.** Pokémon sprites are hotlinked from the PokeAPI sprite
   CDN. See the Sprites section of `BRIEF.md`.

4. **Scaffold into root, not a subfolder.** `npm create vue@latest` wants to make a nested folder.
   If files end up nested, move them all out to the repo root and delete the empty subfolder before
   continuing. Never leave a `my-dashboard/` or `pelipper-app/` folder behind.

5. **Verify before you claim done.** Run `npm run dev`, then `npm run build`. Report actual output.
   Never say something works because it should.

6. **One page, one route.** Vue Router is installed because the capstone asks for it, but there is
   exactly one route (`/`). Do not add pages.

7. **Delete the starter template.** No `HelloWorld.vue`, no `AboutView.vue`, no Vue logo SVG, no
   starter `base.css` / `main.css` rules that fight Vuetify. Leaving starter cruft behind is a
   review finding.

8. **Vuetify wins over hand-written CSS.** If a layout looks wrong, the cause is almost always
   Vuetify's own styles overriding custom CSS — not the custom CSS being absent. Fix it by using
   the right Vuetify props/utility classes, not by piling on `!important`.

9. **No real data, ever.** No client names, no Slalom information, no real people. All data in this
   repo is fabricated. Vercel is not an approved tool for real client or internal work.

## Tech constraints

Vue 3 (`<script setup>`, Composition API) · Vite · TypeScript · Vue Router (one route) ·
Vuetify 3 · `@mdi/font` · Chart.js + vue-chartjs · mock data from `src/data/metrics.json`.

**Not used:** Pinia, Vitest, Playwright, JSX, ESLint, Prettier, Tailwind, any backend, any auth.

## Commit message style

Short, imperative, describing the phase. Examples:
`Add project brief and static prototype` · `Scaffold Vue project with Vite and TypeScript` ·
`Add Vuetify 3 and refactor dashboard shell` · `Extract MetricCard component` ·
`Add mock metrics dataset` · `Build full dashboard with charts and filters`

## End-of-phase checklist

Before you report a phase complete:

- [ ] `npm run dev` runs with no console errors (skip for Phase 1 — it's static HTML)
- [ ] `npm run build` succeeds (skip for Phase 1)
- [ ] No starter-template files left over
- [ ] Nothing nested in a stray subfolder
- [ ] `PELIPPER-POST-STATUS.md` updated: phase marked done, next step written, any decisions or
      known issues logged
- [ ] Committed and pushed
- [ ] Tell Alex the commit message you used and what he should look at in the browser

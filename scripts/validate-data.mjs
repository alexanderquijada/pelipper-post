#!/usr/bin/env node
/**
 * validate-data.mjs — checks src/data/metrics.json against BRIEF.md section 2.
 *
 * Run:  node scripts/validate-data.mjs
 *
 * Alex: you don't need to read this. Claude Code runs it after Phase 5 and the
 * output tells you in plain language whether the mock data is good. Green = fine.
 */

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dataPath = resolve(here, '../src/data/metrics.json');

const G = '\x1b[32m', R = '\x1b[31m', Y = '\x1b[33m', D = '\x1b[2m', X = '\x1b[0m';
const problems = [];
const notes = [];
const fail = (m) => problems.push(m);
const note = (m) => notes.push(m);

let data;
try {
  data = JSON.parse(readFileSync(dataPath, 'utf8'));
} catch (e) {
  console.error(`${R}✗ Could not read or parse ${dataPath}${X}\n  ${e.message}`);
  process.exit(1);
}

const EXPECTED_REGIONS = ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Galar'];
const EXPECTED_CARGO = ['Poké Balls', 'Berries', 'Potions', 'TMs', 'Evolution Stones'];
// Must match the metrics table in BRIEF.md section 2 exactly.
const RANGES = {
  pokeBallsShipped: [2000, 9500],
  berryCrates: [150, 900],
  gymSupplyRuns: [20, 85],
  faintedCouriers: [0, 8],
  onTimeRate: [0.86, 0.97],
  parcelsDelivered: [6000, 21000],
};

// ---------- structure ----------
if (data.company !== 'Pelipper Post & Freight') fail(`company should be "Pelipper Post & Freight", got "${data.company}"`);
if (!Array.isArray(data.months)) fail('months is missing or not an array');
if (data.months?.length !== 12) fail(`expected 12 months, found ${data.months?.length}`);
if (JSON.stringify(data.regions) !== JSON.stringify(EXPECTED_REGIONS)) fail(`regions list does not match the brief. Expected ${EXPECTED_REGIONS.join(', ')}`);
if (JSON.stringify(data.cargoTypes) !== JSON.stringify(EXPECTED_CARGO)) fail(`cargoTypes list does not match the brief. Expected ${EXPECTED_CARGO.join(', ')}`);

// ---------- per-record ----------
let recordCount = 0;
const minmax = {};
const byRegion = {};
const byMonthKey = [];

for (const m of data.months ?? []) {
  if (!m.key || !/^\d{4}-\d{2}$/.test(m.key)) fail(`month key "${m.key}" should look like "2026-03"`);
  if (!m.label) fail(`month ${m.key} is missing a label`);
  byMonthKey.push(m.key);

  const got = (m.regions ?? []).map((r) => r.region);
  for (const want of EXPECTED_REGIONS) {
    if (!got.includes(want)) fail(`month ${m.key} is missing region ${want}`);
  }
  if (got.length !== 6) fail(`month ${m.key} has ${got.length} region records, expected 6`);

  for (const r of m.regions ?? []) {
    recordCount++;
    byRegion[r.region] ??= [];
    byRegion[r.region].push({ month: m.key, ...r });

    for (const [field, [lo, hi]] of Object.entries(RANGES)) {
      const v = r[field];
      if (typeof v !== 'number' || Number.isNaN(v)) { fail(`${m.key} / ${r.region}: ${field} is not a number (${v})`); continue; }
      minmax[field] ??= { min: Infinity, max: -Infinity };
      minmax[field].min = Math.min(minmax[field].min, v);
      minmax[field].max = Math.max(minmax[field].max, v);
      if (v < lo || v > hi) fail(`${m.key} / ${r.region}: ${field} = ${v}, outside the expected ${lo}–${hi}`);
    }

    // cargoMix must sum exactly to parcelsDelivered
    const mix = r.cargoMix ?? {};
    const mixKeys = Object.keys(mix);
    for (const c of EXPECTED_CARGO) if (!mixKeys.includes(c)) fail(`${m.key} / ${r.region}: cargoMix missing "${c}"`);
    const sum = Object.values(mix).reduce((a, b) => a + (Number(b) || 0), 0);
    if (sum !== r.parcelsDelivered) {
      fail(`${m.key} / ${r.region}: cargoMix sums to ${sum} but parcelsDelivered is ${r.parcelsDelivered} (off by ${sum - r.parcelsDelivered})`);
    }

    // pokeBallsShipped and cargoMix["Poké Balls"] are ONE measure, so they must
    // be the same number. On the dashboard a KPI card and a doughnut segment
    // sit inches apart; two different values for "Poké Balls" is unanswerable.
    const mixPokeBalls = mix['Poké Balls'];
    if (typeof mixPokeBalls === 'number' && mixPokeBalls !== r.pokeBallsShipped) {
      fail(`${m.key} / ${r.region}: pokeBallsShipped is ${r.pokeBallsShipped} but cargoMix["Poké Balls"] is ${mixPokeBalls}. These are the same measure and must be identical — the KPI card and the doughnut segment would disagree.`);
    }

    // Poké Balls is the headline cargo type and should be the largest segment.
    const biggestCargo = Object.entries(mix).sort((a, b) => b[1] - a[1])[0]?.[0];
    if (biggestCargo && biggestCargo !== 'Poké Balls') {
      note(`${m.key} / ${r.region}: largest cargo segment is "${biggestCargo}", not Poké Balls`);
    }

    // suspiciously round numbers
    if (r.pokeBallsShipped % 100 === 0 && r.parcelsDelivered % 100 === 0) {
      note(`${m.key} / ${r.region}: numbers look rounded (${r.pokeBallsShipped}, ${r.parcelsDelivered}) — the brief asks for 7,142 not 7,000`);
    }
  }
}

if (recordCount !== 72) fail(`expected 72 region records (12 months × 6 regions), found ${recordCount}`);

// months should be in chronological order
const sorted = [...byMonthKey].sort();
if (JSON.stringify(sorted) !== JSON.stringify(byMonthKey)) fail('months are not in chronological order');

// ---------- seasonality the brief explicitly requires ----------
const monthNum = (k) => Number(k.split('-')[1]);
const avg = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
const allRecords = Object.values(byRegion).flat();

const pick = (months, field) => avg(allRecords.filter((r) => months.includes(monthNum(r.month))).map((r) => r[field]));

const gymSeason = pick([3, 4, 5], 'gymSupplyRuns');
const gymBaseline = pick([1, 2, 6, 9, 10, 11], 'gymSupplyRuns');
if (gymSeason <= gymBaseline * 1.15) {
  fail(`Gym Season (Mar–May) lift is missing: avg gymSupplyRuns ${gymSeason.toFixed(1)} vs baseline ${gymBaseline.toFixed(1)}. The brief asks for +25–40%.`);
}

const decBerries = pick([12], 'berryCrates');
const otherBerries = pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'berryCrates');
if (decBerries <= otherBerries * 1.5) {
  fail(`December berry rush is missing: avg berryCrates ${decBerries.toFixed(0)} vs ${otherBerries.toFixed(0)} the rest of the year. The brief asks for roughly double.`);
}

const stormFainted = pick([7, 8], 'faintedCouriers');
const calmFainted = pick([1, 2, 3, 4, 5, 6, 9, 10, 11, 12], 'faintedCouriers');
if (stormFainted <= calmFainted) {
  fail(`Storm season (Jul–Aug) is missing: avg faintedCouriers ${stormFainted.toFixed(2)} vs ${calmFainted.toFixed(2)} otherwise. It should peak.`);
}

const stormOnTime = pick([7, 8], 'onTimeRate');
const calmOnTime = pick([1, 2, 3, 4, 5, 6, 9, 10, 11], 'onTimeRate');
if (stormOnTime >= calmOnTime) {
  fail(`Storm season on-time rate should DROP: ${(stormOnTime * 100).toFixed(1)}% vs ${(calmOnTime * 100).toFixed(1)}% otherwise.`);
}

// Hoenn should take the biggest storm hit of any region
const stormDipByRegion = {};
for (const [region, recs] of Object.entries(byRegion)) {
  const storm = avg(recs.filter((r) => [7, 8].includes(monthNum(r.month))).map((r) => r.onTimeRate));
  const calm = avg(recs.filter((r) => ![7, 8].includes(monthNum(r.month))).map((r) => r.onTimeRate));
  stormDipByRegion[region] = calm - storm;
}
const worstHit = Object.entries(stormDipByRegion).sort((a, b) => b[1] - a[1])[0]?.[0];
if (worstHit !== 'Hoenn') {
  fail(`Hoenn should take the biggest storm-season on-time hit (water routes). Biggest hit was ${worstHit}.`);
}

// region character: Kanto highest volume, Sinnoh worst on-time
const volByRegion = Object.fromEntries(Object.entries(byRegion).map(([k, v]) => [k, avg(v.map((r) => r.parcelsDelivered))]));
const topVol = Object.entries(volByRegion).sort((a, b) => b[1] - a[1])[0]?.[0];
if (topVol !== 'Kanto') fail(`Kanto should have the highest average volume. Highest was ${topVol}.`);

const onTimeByRegion = Object.fromEntries(Object.entries(byRegion).map(([k, v]) => [k, avg(v.map((r) => r.onTimeRate))]));
const worstOnTime = Object.entries(onTimeByRegion).sort((a, b) => a[1] - b[1])[0]?.[0];
if (worstOnTime !== 'Sinnoh') note(`Sinnoh is meant to have the worst year-round on-time rate; currently it's ${worstOnTime}.`);

// flat lines
for (const [region, recs] of Object.entries(byRegion)) {
  const vals = recs.map((r) => r.parcelsDelivered);
  const deltas = vals.slice(1).map((v, i) => Math.abs((v - vals[i]) / vals[i]));
  if (avg(deltas) < 0.02) note(`${region}: month-over-month volume barely moves (avg ${(avg(deltas) * 100).toFixed(1)}%). The brief asks for ±3–15%.`);
}

// ---------- couriers ----------
const EXPECTED_COURIERS = [
  ['Skyler', 'Pelipper', 279, 'Hoenn'], ['Gale', 'Pidgeot', 18, 'Kanto'],
  ['Nimbus', 'Dragonite', 149, 'Johto'], ['Tidal', 'Gyarados', 130, 'Sinnoh'],
  ['Brix', 'Machamp', 68, 'Unova'], ['Dash', 'Doduo', 84, 'Galar'],
  ['Emberlyn', 'Rapidash', 78, 'Kanto'],
];
const VALID_STATUS = ['On Route', 'Resting', 'Grounded'];
if (data.couriers?.length !== 7) fail(`expected 7 couriers, found ${data.couriers?.length}`);
for (const [name, species, dexId, homeRegion] of EXPECTED_COURIERS) {
  const c = data.couriers?.find((x) => x.name === name);
  if (!c) { fail(`courier "${name}" is missing`); continue; }
  if (c.species !== species) fail(`${name}: species should be ${species}, got ${c.species}`);
  if (c.dexId !== dexId) fail(`${name}: dexId should be ${dexId}, got ${c.dexId}`);
  if (c.homeRegion !== homeRegion) fail(`${name}: homeRegion should be ${homeRegion}, got ${c.homeRegion}`);
  if (!VALID_STATUS.includes(c.status)) fail(`${name}: status "${c.status}" must be one of ${VALID_STATUS.join(' / ')}`);
  if (typeof c.runs !== 'number' || c.runs <= 0) fail(`${name}: runs must be a positive number`);
  if (typeof c.onTimeRate !== 'number' || c.onTimeRate < 0.7 || c.onTimeRate > 1) fail(`${name}: onTimeRate ${c.onTimeRate} looks wrong`);
}

// ---------- report ----------
console.log(`\n${D}Pelipper Post & Freight — mock data check${X}`);
console.log(`${D}${dataPath}${X}\n`);

console.log(`  months: ${data.months?.length}   regions/month: 6   records: ${recordCount}   couriers: ${data.couriers?.length}\n`);

console.log(`  ${D}metric ranges across all 72 records${X}`);
for (const [f, v] of Object.entries(minmax)) {
  const fmt = (n) => (f === 'onTimeRate' ? `${(n * 100).toFixed(1)}%` : n.toLocaleString('en-US'));
  console.log(`    ${f.padEnd(18)} ${fmt(v.min).padStart(9)}  →  ${fmt(v.max).padStart(9)}`);
}

console.log(`\n  ${D}Hoenn on-time rate by month — the storm dip should be visible in Jul/Aug${X}`);
for (const r of byRegion['Hoenn'] ?? []) {
  const pct = r.onTimeRate * 100;
  const bar = '█'.repeat(Math.max(1, Math.round((pct - 80) * 1.6)));
  const flag = [7, 8].includes(monthNum(r.month)) ? ` ${Y}← storm${X}` : '';
  console.log(`    ${r.month}  ${pct.toFixed(1).padStart(5)}%  ${bar}${flag}`);
}

console.log(`\n  ${D}seasonality${X}`);
console.log(`    Gym Season lift      ${((gymSeason / gymBaseline - 1) * 100).toFixed(0)}%  ${D}(want +25–40%)${X}`);
console.log(`    Dec berry multiple   ${(decBerries / otherBerries).toFixed(2)}×  ${D}(want ~2×)${X}`);
console.log(`    Storm fainted        ${stormFainted.toFixed(2)} vs ${calmFainted.toFixed(2)}  ${D}(want higher)${X}`);
console.log(`    Worst storm hit      ${worstHit}  ${D}(want Hoenn)${X}`);

if (notes.length) {
  console.log(`\n${Y}  ${notes.length} thing(s) worth a look:${X}`);
  for (const n of notes.slice(0, 12)) console.log(`${Y}    • ${n}${X}`);
  if (notes.length > 12) console.log(`${Y}    … and ${notes.length - 12} more${X}`);
}

if (problems.length) {
  console.log(`\n${R}  ✗ ${problems.length} problem(s) must be fixed:${X}`);
  for (const p of problems.slice(0, 25)) console.log(`${R}    • ${p}${X}`);
  if (problems.length > 25) console.log(`${R}    … and ${problems.length - 25} more${X}`);
  console.log(`\n${R}  DATA NOT READY — regenerate metrics.json and fix the above.${X}\n`);
  process.exit(1);
}

console.log(`\n${G}  ✓ Mock data looks good. Every check passed. Safe to build the dashboard on it.${X}\n`);

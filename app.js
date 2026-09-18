/* Pelipper Post & Freight — static prototype (Phase 1)
   Vanilla JS only. Renders the courier roster and proves sprite hotlinking works.
   In Phase 2+ this becomes CourierRoster.vue + utils/sprites.ts. */

// --- Sprite URL builder ------------------------------------------------------
// One place, one edit — this is the prototype's stand-in for src/utils/sprites.ts.
// Pattern verified HTTP 200 on this machine (see PELIPPER-POST-STATUS.md §8).
const SPRITE_BASE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

function spriteUrl(dexId) {
  return `${SPRITE_BASE}/${dexId}.png`;
}

// --- Mock courier roster (fabricated, per BRIEF.md §2) ------------------------
const COURIERS = [
  { name: 'Skyler',   species: 'Pelipper',  dexId: 279, homeRegion: 'Hoenn',  runs: 2148, onTimeRate: 0.961, status: 'On Route' },
  { name: 'Gale',     species: 'Pidgeot',   dexId: 18,  homeRegion: 'Kanto',  runs: 2613, onTimeRate: 0.974, status: 'On Route' },
  { name: 'Nimbus',   species: 'Dragonite', dexId: 149, homeRegion: 'Johto',  runs: 2402, onTimeRate: 0.958, status: 'Resting'  },
  { name: 'Tidal',    species: 'Gyarados',  dexId: 130, homeRegion: 'Sinnoh', runs: 1874, onTimeRate: 0.913, status: 'Grounded' },
  { name: 'Brix',     species: 'Machamp',   dexId: 68,  homeRegion: 'Unova',  runs: 1596, onTimeRate: 0.937, status: 'On Route' },
  { name: 'Dash',     species: 'Doduo',     dexId: 84,  homeRegion: 'Galar',  runs: 1142, onTimeRate: 0.896, status: 'Resting'  },
  { name: 'Emberlyn', species: 'Rapidash',  dexId: 78,  homeRegion: 'Kanto',  runs: 2037, onTimeRate: 0.949, status: 'On Route' }
];

// mdi-truck-delivery — stands in for mdi-truck-delivery-outline until @mdi/font
// arrives in Phase 3. Shown when a sprite fails to load.
const FALLBACK_ICON_PATH =
  'M3,4A2,2 0 0,0 1,6V17H3A3,3 0 0,0 6,20A3,3 0 0,0 9,17H15A3,3 0 0,0 18,20A3,3 0 0,0 21,17H23V12L20,8H17V4M10,6L14,10L10,14V11H4V9H10M17,9.5H19.5L21.47,12H17M6,15.5A1.5,1.5 0 0,1 7.5,17A1.5,1.5 0 0,1 6,18.5A1.5,1.5 0 0,1 4.5,17A1.5,1.5 0 0,1 6,15.5M18,15.5A1.5,1.5 0 0,1 19.5,17A1.5,1.5 0 0,1 18,18.5A1.5,1.5 0 0,1 16.5,17A1.5,1.5 0 0,1 18,15.5Z';

// --- Formatting --------------------------------------------------------------
const formatNumber = (n) => n.toLocaleString('en-US');
const formatRate = (r) => `${(r * 100).toFixed(1)}%`;
const chipClass = (status) => `chip chip--${status.toLowerCase().replace(/\s+/g, '-')}`;

// --- Render ------------------------------------------------------------------
function renderRoster() {
  const body = document.getElementById('roster-body');
  if (!body) return;

  COURIERS.forEach((courier) => {
    const row = document.createElement('tr');

    const avatarCell = document.createElement('td');
    avatarCell.className = 'roster__td';
    const avatar = document.createElement('div');
    avatar.className = 'avatar';

    const img = document.createElement('img');
    img.className = 'avatar__img';
    img.src = spriteUrl(courier.dexId);
    img.alt = `${courier.species} sprite`;
    img.loading = 'lazy';
    img.addEventListener('error', () => {
      avatar.classList.add('avatar__fallback');
      avatar.innerHTML =
        `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${FALLBACK_ICON_PATH}" /></svg>`;
    });

    avatar.appendChild(img);
    avatarCell.appendChild(avatar);
    row.appendChild(avatarCell);

    const cells = [
      { text: courier.name, className: 'roster__td roster__name' },
      { text: courier.species, className: 'roster__td roster__td--muted' },
      { text: courier.homeRegion, className: 'roster__td roster__td--muted' },
      { text: formatNumber(courier.runs), className: 'roster__td roster__td--num' },
      { text: formatRate(courier.onTimeRate), className: 'roster__td roster__td--num' }
    ];

    cells.forEach(({ text, className }) => {
      const td = document.createElement('td');
      td.className = className;
      td.textContent = text;
      row.appendChild(td);
    });

    const statusCell = document.createElement('td');
    statusCell.className = 'roster__td';
    const chip = document.createElement('span');
    chip.className = chipClass(courier.status);
    chip.textContent = courier.status;
    statusCell.appendChild(chip);
    row.appendChild(statusCell);

    body.appendChild(row);
  });
}

renderRoster();

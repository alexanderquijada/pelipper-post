// Every sprite URL in the app is built here. BRIEF.md §2 requires one place, so
// the CDN can be swapped in a single edit. Nothing is stored in this repo.

const SPRITE_ROOT = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites'

// --- courier avatars ---------------------------------------------------------
// Official artwork: 475x475, worth the bytes at avatar size.
// Verified HTTP 200 for all seven courier dexIds (PELIPPER-POST-STATUS.md §8).
// If this path ever 404s, the documented fallback is `${SPRITE_ROOT}/pokemon/{dexId}.png`.
const COURIER_BASE = `${SPRITE_ROOT}/pokemon/other/official-artwork`

export function spriteUrl(dexId: number): string {
  return `${COURIER_BASE}/${dexId}.png`
}

/** Shown inside the avatar when a courier sprite fails to load. */
export const SPRITE_FALLBACK_ICON = 'mdi-truck-delivery-outline'

// --- brand mark --------------------------------------------------------------
/**
 * Pelipper (dexId 279) as the app bar icon and the favicon.
 *
 * Deliberately the 96x96 PIXEL sprite, not the official artwork: it is 840 bytes
 * against 130 kB and visibly sharper at 30px. Verified HTTP 200 on 2026-09-18.
 */
export const PELIPPER_DEX_ID = 279
export const BRAND_SPRITE_URL = `${SPRITE_ROOT}/pokemon/${PELIPPER_DEX_ID}.png`

/** Fallback for the app bar if the CDN is unreachable — never leave a gap in the wordmark. */
export const BRAND_FALLBACK_ICON = 'mdi-mail'

/**
 * Account avatar. The PokeAPI sprites repo has NO trainers directory — it holds
 * only badges, items, pokemon and types (checked 2026-09-22, every
 * `sprites/trainers/*` path 404s) — so this falls back to a Pokémon sprite in
 * the circular frame. Noctowl: deliberately not the Pelipper brand mark and not
 * any of the eight couriers, so the account avatar can't be mistaken for either.
 */
export const ACCOUNT_AVATAR_DEX_ID = 164
export const ACCOUNT_AVATAR_URL = `${COURIER_BASE}/${ACCOUNT_AVATAR_DEX_ID}.png`
export const ACCOUNT_FALLBACK_ICON = 'mdi-account-circle'

// --- cargo item sprites ------------------------------------------------------
/**
 * 30x30 pixel art, one per cargo type. All five curl-verified HTTP 200 on
 * 2026-09-18. Anything rendering these MUST set `image-rendering: pixelated`
 * or the browser smooths them into mush on scale-up.
 */
const ITEM_BASE = `${SPRITE_ROOT}/items`

const CARGO_ITEM_FILES: Record<string, string> = {
  'Poké Balls': 'poke-ball',
  Berries: 'oran-berry',
  Potions: 'potion',
  TMs: 'tm-normal',
  'Evolution Stones': 'fire-stone',
}

/**
 * Concept -> item sprite, for KPI cards, list rows and section headers.
 * All curl-verified HTTP 200 on 2026-09-22.
 *
 * Only mappings that genuinely fit are here. Where no item represents the
 * concept the caller keeps its MDI icon rather than forcing a bad metaphor —
 * see PELIPPER-POST-STATUS.md for the list of what stayed MDI and why.
 */
const CONCEPT_ITEM_FILES: Record<string, string> = {
  // a Nugget is the game's plain "this is money" item
  cost: 'nugget',
  // Revive is literally what you use on a fainted Pokémon
  exceptions: 'revive',
  fainted: 'revive',
  // Quick Claw is the speed/priority item
  onTime: 'quick-claw',
  // the Town Map is the game's region view
  region: 'town-map',
  // Amulet Coin multiplies money earned
  revenue: 'amulet-coin',
  // Exp. Share distributes across the team
  fleet: 'exp-share',
}

export function conceptItemUrl(concept: string): string | null {
  const file = CONCEPT_ITEM_FILES[concept]
  return file ? `${ITEM_BASE}/${file}.png` : null
}

/** Item sprite for a cargo type, or null if the type has no mapping. */
export function cargoItemUrl(cargoType: string): string | null {
  const file = CARGO_ITEM_FILES[cargoType]
  return file ? `${ITEM_BASE}/${file}.png` : null
}

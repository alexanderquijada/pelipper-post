// dexId -> sprite URL. BRIEF.md §2 requires this to live in exactly one place so
// the CDN path can be swapped in a single edit.
//
// This pattern was verified HTTP 200 for all seven courier dexIds on 2026-09-18
// (see PELIPPER-POST-STATUS.md §8). If it ever 404s, the documented fallback is
// https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{dexId}.png
// — change SPRITE_BASE below and nothing else.
const SPRITE_BASE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'

export function spriteUrl(dexId: number): string {
  return `${SPRITE_BASE}/${dexId}.png`
}

// Shown inside the avatar when a sprite fails to load.
export const SPRITE_FALLBACK_ICON = 'mdi-truck-delivery-outline'

<script setup lang="ts">
import { ref } from 'vue'
import { BRAND_ARTWORK_URL, BRAND_FALLBACK_ICON } from '@/utils/sprites'

/**
 * The wordmark lockup. Original design — the two-line stack and the sprite are
 * this project's own, not modelled on any real carrier's branding.
 * In the collapsed rail only the sprite shows.
 */
withDefaults(defineProps<{ rail?: boolean }>(), { rail: false })

const spriteFailed = ref(false)
</script>

<template>
  <div class="lockup" :class="{ 'lockup--rail': rail }">
    <img
      v-if="!spriteFailed"
      :src="BRAND_ARTWORK_URL"
      alt=""
      class="lockup__sprite"
      width="52"
      height="52"
      @error="spriteFailed = true"
    />
    <v-icon v-else :icon="BRAND_FALLBACK_ICON" color="primary" size="30" class="lockup__sprite" />

    <span v-if="!rail" class="lockup__text">
      <span class="lockup__name">PELIPPER</span>
      <span class="lockup__sub">POST &amp; FREIGHT</span>
    </span>
  </div>
</template>

<style scoped>
.lockup {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.lockup--rail {
  justify-content: center;
  gap: 0;
}

/* NO image-rendering here: this is the 475x475 artwork, displayed well below
   its natural size, so it must be smoothed like any photograph. */
.lockup__sprite {
  width: 52px;
  height: 52px;
  object-fit: contain;
  flex: none;
}

.lockup__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
  /* optical: the two lines read as one block against the sprite */
  gap: 1px;
}

.lockup__name {
  /* largest text in the sidebar — nav labels are 13px */
  font-size: 23px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0.005em;
  /* theme token, so the lockup inverts correctly in dark */
  color: rgb(var(--v-theme-on-surface));
}

.lockup__sub {
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.145em;
  color: rgb(var(--v-theme-primary));
  white-space: nowrap;
}
</style>

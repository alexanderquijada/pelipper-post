<script setup lang="ts">
import { ref } from 'vue'
import { ACCOUNT_AVATAR_URL, ACCOUNT_FALLBACK_ICON } from '@/utils/sprites'

/** Invented persona — not a real person and not any Pokémon character. */
const ACCOUNT = {
  name: 'Wren Calloway',
  role: 'Regional Operations Director',
  email: 'wren.calloway@pelipperpost.pkm',
}

const avatarFailed = ref(false)
</script>

<template>
  <div class="account">
    <div class="account__text">
      <p class="account__name">{{ ACCOUNT.name }}</p>
      <p class="account__role">{{ ACCOUNT.role }}</p>
      <p class="account__email">{{ ACCOUNT.email }}</p>
    </div>

    <v-avatar size="42" class="account__avatar">
      <v-img
        v-if="!avatarFailed"
        :src="ACCOUNT_AVATAR_URL"
        alt=""
        @error="avatarFailed = true"
      />
      <v-icon v-else :icon="ACCOUNT_FALLBACK_ICON" color="muted" size="28" />
    </v-avatar>
  </div>
</template>

<style scoped>
.account {
  display: flex;
  align-items: center;
  gap: 12px;
}

.account__text {
  text-align: right;
  min-width: 0;
}

.account__name {
  font-size: 13px;
  font-weight: 700;
  line-height: 1.25;
  margin: 0;
}

.account__role {
  font-size: 11.5px;
  line-height: 1.3;
  color: rgb(var(--v-theme-muted));
  margin: 1px 0 0;
}

.account__email {
  font-size: 11px;
  line-height: 1.3;
  color: rgb(var(--v-theme-muted));
  margin: 0;
  opacity: 0.85;
}

.account__avatar {
  background: rgba(var(--v-theme-primary), 0.12);
  flex: none;
}

.account__avatar :deep(img) {
  object-fit: contain;
  padding: 2px;
}

@media (max-width: 700px) {
  .account__text {
    display: none;
  }
}
</style>

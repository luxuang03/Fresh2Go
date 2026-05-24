<script setup>
import { computed, ref } from 'vue'
import { getCartCount } from '../data/cart'
import { currentUser, isLoggedIn } from '../data/auth'

const isMenuOpen = ref(false)

const cartCount = computed(() => {
  return getCartCount()
})

function openMenu() {
  isMenuOpen.value = true
}

function closeMenu() {
  isMenuOpen.value = false
}
</script>

<template>
  <header class="app-header">
    <div class="header-content">
      <button class="menu-toggle" type="button" @click="openMenu">
        ☰
      </button>

      <RouterLink to="/" class="logo" @click="closeMenu">
        <span>Fresh2Go</span>
        <span class="logo-icon">🍃</span>
      </RouterLink>

      <nav class="main-nav" aria-label="Navigazione principale">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/supermarkets">Supermercati</RouterLink>
        <RouterLink to="/catalog">Catalogo</RouterLink>
        <RouterLink to="/recipes">Ricette</RouterLink>
        <RouterLink to="/cart">Carrello ({{ cartCount }})</RouterLink>

        <template v-if="!isLoggedIn">
          <RouterLink to="/login">Login</RouterLink>
        </template>

        <template v-else>
          <RouterLink to="/profile">
            {{ currentUser.fullName }}
          </RouterLink>
        </template>
      </nav>
    </div>

    <div
      class="mobile-menu-overlay"
      :class="{ 'mobile-menu-overlay-open': isMenuOpen }"
      @click="closeMenu"
    ></div>

    <aside
      class="mobile-menu"
      :class="{ 'mobile-menu-open': isMenuOpen }"
    >
      <div class="mobile-menu-header">
        <RouterLink to="/" class="logo" @click="closeMenu">
          Fresh2Go
        </RouterLink>

        <button class="mobile-menu-close" type="button" @click="closeMenu">
          ×
        </button>
      </div>

      <nav class="mobile-nav" aria-label="Menu mobile">
        <RouterLink to="/" @click="closeMenu">Home</RouterLink>
        <RouterLink to="/supermarkets" @click="closeMenu">Supermercati</RouterLink>
        <RouterLink to="/catalog" @click="closeMenu">Catalogo</RouterLink>
        <RouterLink to="/recipes" @click="closeMenu">Ricette</RouterLink>
        <RouterLink to="/cart" @click="closeMenu">Carrello ({{ cartCount }})</RouterLink>

        <template v-if="!isLoggedIn">
          <RouterLink to="/login" @click="closeMenu">Login</RouterLink>
        </template>

        <template v-else>
          <RouterLink to="/profile" @click="closeMenu">
            {{ currentUser.fullName }}
          </RouterLink>
        </template>
      </nav>
    </aside>
  </header>
</template>
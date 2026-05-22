<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { getCartCount } from '../data/cart'
import { currentUser, isLoggedIn, logoutUser } from '../data/auth'

const cartCount = computed(() => {
  return getCartCount()
})
</script>

<template>
  <header class="app-header">
    <div class="header-content">
      <RouterLink to="/" class="logo">
        Fresh2Go
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
  </header>
</template>
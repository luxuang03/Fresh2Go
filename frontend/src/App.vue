<script setup>
import { onMounted } from 'vue'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import { checkCurrentUser } from './data/auth'

onMounted(() => {
  checkCurrentUser()
})
</script>

<template>
  <div class="app-layout">
    <AppHeader />

    <main class="page-content">
      <RouterView />
    </main>

    <AppFooter />
  </div>
</template>
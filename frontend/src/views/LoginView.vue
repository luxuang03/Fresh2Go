<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { loginUser } from '../data/auth'

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

async function handleLogin() {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Inserisci email e password.'
    return
  }

  try {
    isLoading.value = true

    await loginUser(email.value, password.value)

    const redirectPath = route.query.redirect || '/profile'
    router.push(redirectPath)
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main>
    <section class="auth-page">
      <div class="auth-card card">
        <div class="auth-intro">
          <h1 class="page-title">Accedi</h1>

          <p class="page-description">
            Accedi al tuo account per confermare gli ordini e visualizzare lo storico.
          </p>
        </div>

        <form class="auth-form" @submit.prevent="handleLogin">
          <div class="form-row">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              name="email"
              placeholder="mario.rossi@email.com"
            />
          </div>

          <div class="form-row">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              name="password"
              placeholder="Inserisci la password"
            />
          </div>

          <p v-if="errorMessage" class="form-error">
            {{ errorMessage }}
          </p>

          <button class="btn auth-button" type="submit" :disabled="isLoading">
            {{ isLoading ? 'Accesso in corso...' : 'Accedi' }}
          </button>

          <p class="auth-link-text">
            Non hai ancora un account?
            <RouterLink to="/register">Registrati</RouterLink>
          </p>
        </form>
      </div>
    </section>
  </main>
</template>
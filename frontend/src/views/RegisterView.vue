<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerUser } from '../data/auth'

const router = useRouter()

const username = ref('')
const fullName = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

async function handleRegister() {
  errorMessage.value = ''
  successMessage.value = ''

  if (
    !username.value ||
    !fullName.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    errorMessage.value = 'Compila tutti i campi obbligatori.'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Le password non coincidono.'
    return
  }

  try {
    isLoading.value = true

    await registerUser({
      username: username.value,
      fullName: fullName.value,
      email: email.value,
      phone: phone.value,
      password: password.value,
    })

    successMessage.value = 'Registrazione completata. Ora puoi effettuare il login.'

    setTimeout(() => {
      router.push('/login')
    }, 800)
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
          <h1 class="page-title">Crea un account</h1>

          <p class="page-description">
            Registrati per confermare gli ordini e consultare lo storico della spesa.
          </p>
        </div>

        <form class="auth-form" @submit.prevent="handleRegister">
          <div class="form-row">
            <label for="username">Username</label>
            <input
              id="username"
              v-model="username"
              type="text"
              name="username"
              placeholder="mariorossi"
            />
          </div>

          <div class="form-row">
            <label for="fullName">Nome completo</label>
            <input
              id="fullName"
              v-model="fullName"
              type="text"
              name="fullName"
              placeholder="Mario Rossi"
            />
          </div>

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
            <label for="phone">Telefono</label>
            <input
              id="phone"
              v-model="phone"
              type="tel"
              name="phone"
              placeholder="Opzionale"
            />
          </div>

          <div class="form-row">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              name="password"
              placeholder="Inserisci una password"
            />
          </div>

          <div class="form-row">
            <label for="confirmPassword">Conferma password</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Ripeti la password"
            />
          </div>

          <p v-if="errorMessage" class="form-error">
            {{ errorMessage }}
          </p>

          <p v-if="successMessage" class="success-message">
            {{ successMessage }}
          </p>

          <button class="btn auth-button" type="submit" :disabled="isLoading">
            {{ isLoading ? 'Registrazione in corso...' : 'Registrati' }}
          </button>

          <p class="auth-link-text">
            Hai già un account?
            <RouterLink to="/login">Accedi</RouterLink>
          </p>
        </form>
      </div>
    </section>
  </main>
</template>
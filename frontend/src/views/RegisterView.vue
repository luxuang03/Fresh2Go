<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerUser } from '../data/auth'

const router = useRouter()

const fullName = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')

function handleRegister() {
  errorMessage.value = ''

  if (!fullName.value || !email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'Compila tutti i campi obbligatori.'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Le password non coincidono.'
    return
  }

  registerUser({
    fullName: fullName.value,
    email: email.value,
    phone: phone.value,
  })

  router.push('/profile')
}
</script>

<template>
  <main>
    <section class="auth-page">
      <div class="auth-card card">
        <div class="auth-intro">
          <h1 class="page-title">Crea un account</h1>
          <p class="page-description">
            Registrati per salvare i tuoi dati, confermare gli ordini e consultare lo storico
            della spesa.
          </p>
        </div>

        <form class="auth-form" @submit.prevent="handleRegister">
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

          <button class="btn auth-button" type="submit">Registrati</button>

          <p class="auth-link-text">
            Hai già un account?
            <RouterLink to="/login">Accedi</RouterLink>
          </p>
        </form>
      </div>
    </section>
  </main>
</template>
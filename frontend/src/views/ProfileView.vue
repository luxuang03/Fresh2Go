<script setup>
import { currentUser, isLoggedIn } from '../data/auth'
</script>

<template>
  <main>
    <section class="page-section">
      <h1 class="page-title">Profilo</h1>

      <div v-if="!isLoggedIn" class="card">
        <p class="page-description">
          Devi effettuare il login per visualizzare il profilo.
        </p>

        <RouterLink to="/login" class="btn">
          Vai al login
        </RouterLink>
      </div>

      <div v-else class="card profile-card">
        <h2>Dati utente</h2>

        <div class="profile-info">
          <p>
            <strong>Nome:</strong>
            {{ currentUser.fullName }}
          </p>

          <p>
            <strong>Email:</strong>
            {{ currentUser.email }}
          </p>

          <p>
            <strong>Telefono:</strong>
            {{ currentUser.phone }}
          </p>
        </div>

        <div class="profile-actions">
          <RouterLink to="/orders" class="btn">
            Visualizza storico ordini
          </RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>
<script setup>
import { computed } from 'vue'
import { currentUser, isLoggedIn } from '../data/auth'
import { getOrders } from '../data/mockOrders'

const orders = computed(() => {
  return getOrders()
})

const recentOrders = computed(() => {
  return orders.value.slice(0, 3)
})

function formatDate(dateValue) {
  return new Date(dateValue).toLocaleDateString('it-IT')
}
</script>

<template>
  <main>
    <section class="page-section">
      <h1 class="page-title">Profilo</h1>

      <p class="page-description">
        In questa pagina puoi visualizzare i dati dell'utente e un riepilogo degli ordini recenti.
      </p>

      <div v-if="!isLoggedIn" class="card">
        <p class="page-description">
          Devi effettuare il login per visualizzare il profilo.
        </p>

        <RouterLink to="/login" class="btn">
          Vai al login
        </RouterLink>
      </div>

      <div v-else class="profile-layout">
        <section class="card profile-card">
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
        </section>

        <section class="card profile-card">
          <div class="profile-section-title">
            <h2>Ordini recenti</h2>

            <RouterLink to="/orders" class="small-link">
              Vedi tutti
            </RouterLink>
          </div>

          <div v-if="recentOrders.length === 0" class="profile-empty">
            <p class="muted-text">
              Non hai ancora effettuato ordini.
            </p>

            <RouterLink to="/catalog" class="btn btn-secondary">
              Vai al catalogo
            </RouterLink>
          </div>

          <div v-else class="profile-orders-list">
            <article
              v-for="order in recentOrders"
              :key="order.id"
              class="profile-order-item"
            >
              <div>
                <h3>Ordine #{{ order.id }}</h3>

                <p class="muted-text">
                  {{ formatDate(order.createdAt) }} - {{ order.supermarketName }}
                </p>

                <p>
                  Totale: € {{ order.totalPrice.toFixed(2) }}
                </p>
              </div>

              <RouterLink
                :to="`/orders/${order.id}`"
                class="small-link"
              >
                Dettaglio
              </RouterLink>
            </article>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>
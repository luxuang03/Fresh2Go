<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { checkCurrentUser, currentUser, isLoggedIn } from '../data/auth'
import { getMyOrders } from '../services/api'

const router = useRouter()

const orders = ref([])
const isLoadingOrders = ref(false)
const errorMessage = ref('')

const recentOrders = computed(() => {
  return orders.value.slice(0, 3)
})

onMounted(async () => {
  const user = await checkCurrentUser()

  if (!user) {
    return
  }

  await loadRecentOrders()
})

async function loadRecentOrders() {
  try {
    isLoadingOrders.value = true
    errorMessage.value = ''

    orders.value = await getMyOrders()
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoadingOrders.value = false
  }
}

async function goToLogin() {
  router.push('/login')
}

function formatDate(dateValue) {
  if (!dateValue) {
    return 'Data non disponibile'
  }

  return new Date(dateValue).toLocaleDateString('it-IT')
}

function formatPrice(value) {
  return Number(value).toFixed(2)
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

        <button type="button" class="btn" @click="goToLogin">
          Vai al login
        </button>
      </div>

      <div v-else class="profile-layout">
        <section class="card profile-card">
          <h2>Dati utente</h2>

          <div class="profile-info">
            <p>
              <strong>Nome:</strong>
              {{ currentUser.fullName || 'Non inserito' }}
            </p>

            <p>
              <strong>Email:</strong>
              {{ currentUser.email }}
            </p>

            <p>
              <strong>Telefono:</strong>
              {{ currentUser.phone || 'Non inserito' }}
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

          <div v-if="isLoadingOrders" class="profile-empty">
            <p class="muted-text">
              Caricamento ordini recenti...
            </p>
          </div>

          <div v-else-if="errorMessage" class="profile-empty">
            <p class="muted-text">
              {{ errorMessage }}
            </p>
          </div>

          <div v-else-if="recentOrders.length === 0" class="profile-empty">
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
                  Totale: € {{ formatPrice(order.totalPrice) }}
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
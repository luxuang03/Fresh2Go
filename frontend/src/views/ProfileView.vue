<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { checkCurrentUser, currentUser, isLoggedIn, logoutUser } from '../data/auth'
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

function handleLogout() {
  logoutUser()
  router.push('/')
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
    <section>
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
          <div class="profile-user-header">
            <h2>Dati utente</h2>

            <span class="tag">
              Account attivo
            </span>
          </div>

          <div class="profile-info">
            <div class="profile-info-row">
              <span>Nome</span>
              <strong>{{ currentUser.fullName || 'Non inserito' }}</strong>
            </div>

            <div class="profile-info-row">
              <span>Email</span>
              <strong>{{ currentUser.email }}</strong>
            </div>

            <div class="profile-info-row">
              <span>Telefono</span>
              <strong>{{ currentUser.phone || 'Non inserito' }}</strong>
            </div>
          </div>

          <div class="profile-actions">
            <RouterLink to="/orders" class="btn">
              Visualizza storico ordini
            </RouterLink>

            <button type="button" class="btn btn-secondary" @click="handleLogout">
              Logout
            </button>
          </div>
        </section>

        <section class="card profile-card">
          <div class="profile-section-title">
            <h2>Ordini recenti</h2>
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
                class="text-link"
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
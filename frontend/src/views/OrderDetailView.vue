<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { checkCurrentUser } from '../data/auth'
import { getOrderDetail } from '../services/api'

const route = useRoute()
const router = useRouter()

const order = ref(null)
const items = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  try {
    const user = await checkCurrentUser()

    if (!user) {
      router.replace({
        path: '/login',
        query: {
          redirect: `/orders/${route.params.id}`,
        },
      })
      return
    }

    const data = await getOrderDetail(route.params.id)

    order.value = data.order
    items.value = data.items
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
})

const totalItems = computed(() => {
  return items.value.reduce((total, item) => {
    return total + Number(item.quantity)
  }, 0)
})

function formatDate(dateValue) {
  if (!dateValue) {
    return 'Data non disponibile'
  }

  return new Date(dateValue).toLocaleDateString('it-IT')
}

function formatTime(timeValue) {
  if (!timeValue) {
    return ''
  }

  return timeValue.slice(0, 5)
}

function formatPrice(value) {
  return Number(value).toFixed(2)
}
</script>

<template>
  <main>
    <RouterLink to="/orders" class="back-link">
      ← Torna agli ordini
    </RouterLink>

    <section v-if="isLoading" class="card orders-empty">
      <h1>Caricamento ordine...</h1>

      <p class="muted-text">
        Stiamo recuperando il dettaglio dell'ordine dal server.
      </p>
    </section>

    <section v-else-if="errorMessage" class="card orders-empty">
      <h1>Ordine non trovato</h1>

      <p class="muted-text">
        {{ errorMessage }}
      </p>

      <RouterLink to="/orders" class="btn">
        Torna allo storico ordini
      </RouterLink>
    </section>

    <section v-else>
      <h1 class="page-title">Dettaglio ordine #{{ order.id }}</h1>

      <p class="page-description">
        Riepilogo dell'ordine confermato il {{ formatDate(order.createdAt) }}.
      </p>

      <div class="order-detail-layout">
        <section class="card profile-card">
          <div class="profile-user-header">
            <div>
              <h2>Informazioni ordine</h2>

              <p class="muted-text">
                Ordine confermato il {{ formatDate(order.createdAt) }}
              </p>
            </div>
          </div>

          <div class="profile-info">
            <div class="profile-info-row">
              <span>Cliente</span>
              <strong>{{ order.customerName }}</strong>
            </div>

            <div class="profile-info-row">
              <span>Email</span>
              <strong>{{ order.customerEmail }}</strong>
            </div>

            <div class="profile-info-row">
              <span>Supermercato</span>
              <strong>{{ order.supermarketName }}</strong>
            </div>

            <div class="profile-info-row">
              <span>Data ritiro</span>
              <strong>{{ formatDate(order.pickupDate) }}</strong>
            </div>

            <div class="profile-info-row">
              <span>Fascia oraria</span>
              <strong>
                {{ formatTime(order.startTime) }} - {{ formatTime(order.endTime) }}
              </strong>
            </div>
          </div>
        </section>

        <section class="summary-box order-detail-summary">
          <div class="summary-main">
            <div>
              <h2>Riepilogo ordine</h2>

              <p class="muted-text">
                {{ totalItems }} prodotti ordinati
              </p>
            </div>

            <strong>
              € {{ formatPrice(order.totalPrice) }}
            </strong>
          </div>

          <div class="summary-details">
            <div
              v-for="item in items"
              :key="item.id"
              class="summary-row"
            >
              <div class="summary-product">
                <span>{{ item.productName }}</span>

                <small>
                  x{{ item.quantity }}
                </small>
              </div>

              <strong>
                € {{ formatPrice(item.subtotal) }}
              </strong>
            </div>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>
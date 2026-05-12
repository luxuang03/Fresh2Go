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
        <section class="card order-detail-card">
          <h2>Informazioni ordine</h2>

          <p>
            <strong>Stato:</strong>
            {{ order.status }}
          </p>

          <p>
            <strong>Cliente:</strong>
            {{ order.customerName }}
          </p>

          <p>
            <strong>Email:</strong>
            {{ order.customerEmail }}
          </p>

          <p>
            <strong>Supermercato:</strong>
            {{ order.supermarketName }}
          </p>

          <p>
            <strong>Data ritiro:</strong>
            {{ formatDate(order.pickupDate) }}
          </p>

          <p>
            <strong>Fascia oraria:</strong>
            {{ formatTime(order.startTime) }} - {{ formatTime(order.endTime) }}
          </p>
        </section>

        <section class="card order-detail-card">
          <h2>Prodotti ordinati</h2>

          <div class="order-items-list">
            <div
              v-for="item in items"
              :key="item.id"
              class="order-item-row"
            >
              <div>
                <strong>{{ item.productName }}</strong>

                <p class="muted-text">
                  {{ item.quantity }} x € {{ formatPrice(item.unitPrice) }}
                </p>
              </div>

              <span>
                € {{ formatPrice(item.subtotal) }}
              </span>
            </div>
          </div>

          <hr>

          <p>
            Prodotti totali: {{ totalItems }}
          </p>

          <p class="cart-total">
            Totale ordine: € {{ formatPrice(order.totalPrice) }}
          </p>
        </section>
      </div>
    </section>
  </main>
</template>
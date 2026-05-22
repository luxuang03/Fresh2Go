<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { checkCurrentUser } from '../data/auth'
import { getMyOrders } from '../services/api'

const router = useRouter()

const orders = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  try {
    const user = await checkCurrentUser()

    if (!user) {
      router.replace({
        path: '/login',
        query: {
          redirect: '/orders',
        },
      })
      return
    }

    orders.value = await getMyOrders()
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
})

function formatDate(dateValue) {
  if (!dateValue) {
    return 'Data non disponibile'
  }

  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return 'Data non disponibile'
  }

  return date.toLocaleDateString('it-IT')
}

function formatPickup(order) {
  if (!order.pickupDate || !order.startTime || !order.endTime) {
    return 'Ritiro non disponibile'
  }

  const date = formatDate(order.pickupDate)
  const start = order.startTime.slice(0, 5)
  const end = order.endTime.slice(0, 5)

  return `${date} - ${start}/${end}`
}

function formatPrice(value) {
  if (value == null) {
    return '0.00'
  }

  return Number(value).toFixed(2)
}
</script>

<template>
  <main>
    <h1 class="page-title">Storico ordini</h1>

    <p class="page-description">
      Qui trovi lo storico degli ordini confermati con il tuo account.
    </p>

    <section v-if="isLoading" class="card orders-empty">
      <h2>Caricamento ordini...</h2>

      <p class="muted-text">
        Stiamo recuperando lo storico dal server.
      </p>
    </section>

    <section v-else-if="errorMessage" class="card orders-empty">
      <h2>Errore</h2>

      <p class="muted-text">
        {{ errorMessage }}
      </p>

      <RouterLink to="/catalog" class="btn">
        Torna al catalogo
      </RouterLink>
    </section>

    <section v-else-if="orders.length === 0" class="card orders-empty">
      <h2>Nessun ordine presente</h2>

      <p class="muted-text">
        Gli ordini compariranno qui dopo aver completato il checkout.
      </p>

      <RouterLink to="/catalog" class="btn">
        Vai al catalogo
      </RouterLink>
    </section>

    <section v-else class="orders-list">
      <article
        v-for="order in orders"
        :key="order.id"
        class="card order-card"
      >
        <div>
          <h2>Ordine #{{ order.id }}</h2>

          <p class="muted-text">
            Creato il {{ formatDate(order.createdAt) }}
          </p>
        </div>

        <div class="order-info-grid">
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
            <strong>Ritiro:</strong>
            {{ formatPickup(order) }}
          </p>

          <p>
            <strong>Totale:</strong>
            € {{ formatPrice(order.totalPrice) }}
          </p>
        </div>

        <div class="order-actions">
          <RouterLink
            :to="`/orders/${order.id}`"
            class="btn"
          >
            Dettaglio ordine
          </RouterLink>
        </div>
      </article>
    </section>
  </main>
</template>
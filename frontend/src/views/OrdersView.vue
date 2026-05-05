<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { getOrders } from '../data/mockOrders'

const orders = ref([])

onMounted(() => {
  orders.value = getOrders()
})

function formatDate(dateValue) {
  return new Date(dateValue).toLocaleDateString('it-IT')
}
</script>

<template>
  <main>
    <h1 class="page-title">Ordini</h1>

    <p class="page-description">
      Qui trovi lo storico degli ordini confermati durante la simulazione.
    </p>

    <section v-if="orders.length === 0" class="card orders-empty">
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
        <div class="order-card-header">
          <div>
            <h2>Ordine #{{ order.id }}</h2>

            <p class="muted-text">
              Creato il {{ formatDate(order.createdAt) }}
            </p>
          </div>

          <span class="tag">
            {{ order.status }}
          </span>
        </div>

        <div class="order-info-grid">
          <p>
            <strong>Supermercato:</strong>
            {{ order.supermarketName }}
          </p>

          <p>
            <strong>Ritiro:</strong>
            {{ order.pickupDate }} - {{ order.pickupSlot }}
          </p>

          <p>
            <strong>Prodotti:</strong>
            {{ order.totalItems }}
          </p>

          <p>
            <strong>Totale:</strong>
            € {{ order.totalPrice.toFixed(2) }}
          </p>
        </div>

        <div class="cart-actions">
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
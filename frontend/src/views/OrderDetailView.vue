<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { getOrderById } from '../data/mockOrders'
import { isLoggedIn } from '../data/auth'

const route = useRoute()

const order = computed(() => {
  return getOrderById(route.params.id)
})

function formatDate(dateValue) {
  return new Date(dateValue).toLocaleDateString('it-IT')
}
</script>

<template>
  <main>
    <RouterLink to="/orders" class="back-link">
      ← Torna agli ordini
    </RouterLink>

    <section v-if="!isLoggedIn" class="card orders-empty">
      <h1>Accesso richiesto</h1>

      <p class="muted-text">
        Effettua il login per visualizzare il dettaglio dell'ordine.
      </p>

      <RouterLink to="/login" class="btn">
        Vai al login
      </RouterLink>
    </section>

    <section v-else-if="!order" class="card orders-empty">
      <h1>Ordine non trovato</h1>

      <p class="muted-text">
        L'ordine richiesto non è presente nello storico locale.
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
            <strong>Telefono:</strong>
            {{ order.customerPhone }}
          </p>

          <p>
            <strong>Supermercato:</strong>
            {{ order.supermarketName }}
          </p>

          <p>
            <strong>Data ritiro:</strong>
            {{ order.pickupDate }}
          </p>

          <p>
            <strong>Fascia oraria:</strong>
            {{ order.pickupSlot }}
          </p>

          <p v-if="order.notes">
            <strong>Note:</strong>
            {{ order.notes }}
          </p>
        </section>

        <section class="card order-detail-card">
          <h2>Prodotti ordinati</h2>

          <div class="order-items-list">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="order-item-row"
            >
              <div>
                <strong>{{ item.name }}</strong>

                <p class="muted-text">
                  {{ item.quantity }} x € {{ item.price.toFixed(2) }}
                </p>
              </div>

              <span>
                € {{ item.subtotal.toFixed(2) }}
              </span>
            </div>
          </div>

          <hr>

          <p>
            Prodotti totali: {{ order.totalItems }}
          </p>

          <p class="cart-total">
            Totale ordine: € {{ order.totalPrice.toFixed(2) }}
          </p>
        </section>
      </div>
    </section>
  </main>
</template>
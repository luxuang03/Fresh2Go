<script setup>
import { computed, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  cart,
  getCartTotal,
  getCartCount,
  getItemSubtotal,
} from '../data/cart'

const cartTotal = computed(() => {
  return getCartTotal()
})

const cartCount = computed(() => {
  return getCartCount()
})

const checkoutData = reactive({
  name: '',
  email: '',
  phone: '',
  notes: '',
})

const checkoutMessage = ref('')

function saveCheckoutData() {
  checkoutMessage.value = 'Dati inseriti correttamente. Nella prossima fase verrà aggiunta la conferma ordine.'
}
</script>

<template>
  <main>
    <h1 class="page-title">Checkout</h1>

    <p class="page-description">
      Controlla il riepilogo della spesa e inserisci i dati per il ritiro.
    </p>

    <section v-if="cart.items.length === 0" class="card cart-empty">
      <h2>Il carrello è vuoto</h2>

      <p class="muted-text">
        Per procedere al checkout devi prima aggiungere almeno un prodotto.
      </p>

      <RouterLink to="/catalog" class="btn">
        Vai al catalogo
      </RouterLink>
    </section>

    <section v-else class="checkout-page">
      <div class="card checkout-form-card">
        <h2>Dati per il ritiro</h2>

        <form class="checkout-form" @submit.prevent="saveCheckoutData">
          <div class="form-field">
            <label for="name">Nome e cognome</label>
            <input
              id="name"
              v-model="checkoutData.name"
              type="text"
              placeholder="Es. Mario Rossi"
              required
            >
          </div>

          <div class="form-field">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="checkoutData.email"
              type="email"
              placeholder="Es. mario@email.com"
              required
            >
          </div>

          <div class="form-field">
            <label for="phone">Telefono</label>
            <input
              id="phone"
              v-model="checkoutData.phone"
              type="tel"
              placeholder="Es. 3331234567"
              required
            >
          </div>

          <div class="form-field">
            <label for="notes">Note per il ritiro</label>
            <textarea
              id="notes"
              v-model="checkoutData.notes"
              rows="4"
              placeholder="Eventuali indicazioni aggiuntive"
            ></textarea>
          </div>

          <button type="submit" class="btn">
            Conferma dati
          </button>

          <p v-if="checkoutMessage" class="checkout-message">
            {{ checkoutMessage }}
          </p>
        </form>
      </div>

      <aside class="card checkout-summary">
        <h2>Riepilogo ordine</h2>

        <div class="checkout-items">
          <div
            v-for="item in cart.items"
            :key="item.id"
            class="checkout-item"
          >
            <div>
              <strong>{{ item.name }}</strong>
              <p class="muted-text">
                {{ item.quantity }} x € {{ item.price.toFixed(2) }}
              </p>
            </div>

            <span>
              € {{ getItemSubtotal(item).toFixed(2) }}
            </span>
          </div>
        </div>

        <hr>

        <p>
          Prodotti diversi: {{ cart.items.length }}
        </p>

        <p>
          Totale confezioni/prodotti: {{ cartCount }}
        </p>

        <p class="cart-total">
          Totale: € {{ cartTotal.toFixed(2) }}
        </p>

        <div class="cart-actions">
          <RouterLink to="/cart" class="btn btn-secondary">
            Torna al carrello
          </RouterLink>
        </div>
      </aside>
    </section>
  </main>
</template>
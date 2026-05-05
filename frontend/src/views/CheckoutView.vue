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

const checkoutErrors = reactive({
  name: '',
  email: '',
  phone: '',
})

const checkoutMessage = ref('')

function isEmailValid(email) {
  return email.includes('@') && email.includes('.')
}

function validateCheckoutData() {
  checkoutErrors.name = ''
  checkoutErrors.email = ''
  checkoutErrors.phone = ''
  checkoutMessage.value = ''

  if (checkoutData.name.trim() === '') {
    checkoutErrors.name = 'Inserisci nome e cognome.'
  }

  if (checkoutData.email.trim() === '') {
    checkoutErrors.email = 'Inserisci un indirizzo email.'
  } else if (!isEmailValid(checkoutData.email)) {
    checkoutErrors.email = 'Inserisci un indirizzo email valido.'
  }

  if (checkoutData.phone.trim() === '') {
    checkoutErrors.phone = 'Inserisci un numero di telefono.'
  }

  return (
    checkoutErrors.name === '' &&
    checkoutErrors.email === '' &&
    checkoutErrors.phone === ''
  )
}

function saveCheckoutData() {
  const isValid = validateCheckoutData()

  if (!isValid) {
    return
  }

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

        <form class="checkout-form" @submit.prevent="saveCheckoutData" novalidate>
          <div class="form-field">
            <label for="name">Nome e cognome</label>
            <input
              id="name"
              v-model="checkoutData.name"
              type="text"
              placeholder="Es. Mario Rossi"
            >

            <p v-if="checkoutErrors.name" class="form-error">
              {{ checkoutErrors.name }}
            </p>
          </div>

          <div class="form-field">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="checkoutData.email"
              type="email"
              placeholder="Es. mario@email.com"
            >

            <p v-if="checkoutErrors.email" class="form-error">
              {{ checkoutErrors.email }}
            </p>
          </div>

          <div class="form-field">
            <label for="phone">Telefono</label>
            <input
              id="phone"
              v-model="checkoutData.phone"
              type="tel"
              placeholder="Es. 3331234567"
            >

            <p v-if="checkoutErrors.phone" class="form-error">
              {{ checkoutErrors.phone }}
            </p>
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
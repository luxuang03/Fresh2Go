<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import {
  cart,
  clearCart,
  getCartTotal,
  getCartCount,
  getItemSubtotal,
} from '../data/cart'
import { mockSupermarkets } from '../data/mockSupermarkets'
import { addOrder } from '../data/mockOrders'

const router = useRouter()

const selectedSupermarketId = ref('')
const checkoutMessage = ref('')
const orderConfirmed = ref(false)

const confirmedOrder = ref(null)

const cartTotal = computed(() => {
  return getCartTotal()
})

const cartCount = computed(() => {
  return getCartCount()
})

const selectedSupermarket = computed(() => {
  return mockSupermarkets.find((supermarket) => {
    return supermarket.id === Number(selectedSupermarketId.value)
  })
})

const visiblePickupSlots = computed(() => {
  if (!selectedSupermarket.value) {
    return []
  }

  return selectedSupermarket.value.pickupSlots
})

function getTodayDate() {
  const today = new Date()

  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const checkoutData = reactive({
  name: '',
  email: '',
  phone: '',
  pickupDate: getTodayDate(),
  pickupSlot: '',
  notes: '',
})

const checkoutErrors = reactive({
  name: '',
  email: '',
  phone: '',
  pickupDate: '',
  pickupSlot: '',
})

onMounted(() => {
  const savedSupermarketId = localStorage.getItem('selectedSupermarketId')

  if (!savedSupermarketId) {
    router.replace('/supermarkets')
    return
  }

  selectedSupermarketId.value = savedSupermarketId
})

function isEmailValid(email) {
  return email.includes('@') && email.includes('.')
}

function selectPickupSlot(slot) {
  if (!slot.available) {
    return
  }

  checkoutData.pickupSlot = slot.label
  checkoutErrors.pickupSlot = ''
  checkoutMessage.value = ''
}

function validateCheckoutData() {
  checkoutErrors.name = ''
  checkoutErrors.email = ''
  checkoutErrors.phone = ''
  checkoutErrors.pickupDate = ''
  checkoutErrors.pickupSlot = ''
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

  if (checkoutData.pickupDate === '') {
    checkoutErrors.pickupDate = 'Seleziona una data di ritiro.'
  }

  if (checkoutData.pickupSlot === '') {
    checkoutErrors.pickupSlot = 'Seleziona una fascia oraria disponibile.'
  }

  return (
    checkoutErrors.name === '' &&
    checkoutErrors.email === '' &&
    checkoutErrors.phone === '' &&
    checkoutErrors.pickupDate === '' &&
    checkoutErrors.pickupSlot === ''
  )
}

function confirmOrder() {
  const isValid = validateCheckoutData()

  if (!isValid) {
    return
  }

  if (cart.items.length === 0) {
    checkoutMessage.value = 'Il carrello è vuoto.'
    return
  }

  const newOrder = {
    id: Date.now(),
    customerName: checkoutData.name,
    customerEmail: checkoutData.email,
    customerPhone: checkoutData.phone,
    notes: checkoutData.notes,
    pickupDate: checkoutData.pickupDate,
    pickupSlot: checkoutData.pickupSlot,
    supermarketId: selectedSupermarket.value.id,
    supermarketName: selectedSupermarket.value.name,
    status: 'Confermato',
    createdAt: new Date().toISOString(),
    items: cart.items.map((item) => {
      return {
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: getItemSubtotal(item),
      }
    }),
    totalItems: cartCount.value,
    totalPrice: cartTotal.value,
  }

  addOrder(newOrder)

  confirmedOrder.value = newOrder

  clearCart()
  orderConfirmed.value = true
}
</script>

<template>
  <main>
    <h1 class="page-title">Checkout</h1>

    <p class="page-description">
      Controlla il riepilogo della spesa e scegli quando ritirare l'ordine.
    </p>

    <section v-if="orderConfirmed && confirmedOrder" class="card checkout-confirmation">
      <h2>Ordine confermato</h2>

      <p>
        Grazie {{ confirmedOrder.customerName }}, il tuo ordine è stato confermato correttamente.
      </p>

      <p>
        Potrai ritirare la spesa presso
        <strong>{{ confirmedOrder.supermarketName }}</strong>
        il giorno
        <strong>{{ confirmedOrder.pickupDate }}</strong>
        nella fascia
        <strong>{{ confirmedOrder.pickupSlot }}</strong>.
      </p>

      <div class="confirmed-order-box">
        <h3>Riepilogo ordine</h3>

        <div
          v-for="item in confirmedOrder.items"
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
            € {{ item.subtotal.toFixed(2) }}
          </span>
        </div>

        <p>
          Totale prodotti: {{ confirmedOrder.totalItems }}
        </p>

        <p class="cart-total">
          Totale pagato: € {{ confirmedOrder.totalPrice.toFixed(2) }}
        </p>
      </div>

      <div class="cart-actions">
        <RouterLink to="/orders" class="btn">
          Vai agli ordini
        </RouterLink>
      
        <RouterLink to="/catalog" class="btn btn-secondary">
          Torna al catalogo
        </RouterLink>
      
        <RouterLink to="/" class="btn btn-secondary">
          Torna alla home
        </RouterLink>
      </div>
    </section>

    <section v-else-if="cart.items.length === 0" class="card cart-empty">
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

        <form class="checkout-form" @submit.prevent="confirmOrder" novalidate>
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

          <div class="checkout-section">
            <h3>Ritiro</h3>

            <div
              v-if="selectedSupermarket"
              class="pickup-supermarket-box"
            >
              <p class="muted-text">
                Stai facendo la spesa presso:
              </p>

              <strong>{{ selectedSupermarket.name }}</strong>

              <p>
                {{ selectedSupermarket.address }},
                {{ selectedSupermarket.city }}
              </p>

              <p class="muted-text">
                Orario:
                {{ selectedSupermarket.openingTime }} -
                {{ selectedSupermarket.closingTime }}
              </p>
            </div>

            <div class="form-field">
              <label for="pickupDate">Data di ritiro</label>
              <input
                id="pickupDate"
                v-model="checkoutData.pickupDate"
                type="date"
                :min="getTodayDate()"
              >

              <p v-if="checkoutErrors.pickupDate" class="form-error">
                {{ checkoutErrors.pickupDate }}
              </p>
            </div>

            <div class="form-field">
              <label>Fascia oraria</label>

              <div class="pickup-slots-grid">
                <button
                  v-for="slot in visiblePickupSlots"
                  :key="slot.label"
                  type="button"
                  class="pickup-slot"
                  :class="{
                    'pickup-slot-selected': checkoutData.pickupSlot === slot.label,
                    'pickup-slot-disabled': !slot.available,
                  }"
                  :disabled="!slot.available"
                  @click="selectPickupSlot(slot)"
                >
                  <span>{{ slot.label }}</span>
                </button>
              </div>

              <p class="muted-text">
                Alcune fasce non sono selezionabili per simulare gli slot già occupati o non disponibili.
              </p>

              <p v-if="checkoutErrors.pickupSlot" class="form-error">
                {{ checkoutErrors.pickupSlot }}
              </p>
            </div>
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
            Conferma ordine
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

        <p v-if="selectedSupermarket">
          Ritiro: {{ selectedSupermarket.name }}
        </p>

        <p v-if="checkoutData.pickupDate">
          Data: {{ checkoutData.pickupDate }}
        </p>

        <p v-if="checkoutData.pickupSlot">
          Fascia: {{ checkoutData.pickupSlot }}
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
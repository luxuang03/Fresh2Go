<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import {
  cart,
  clearCart,
  getCartTotal,
  getCartCount,
  getItemSubtotal,
} from '../data/cart'
import { checkCurrentUser, currentUser } from '../data/auth'
import {
  createOrder,
  getPickupSlots,
  getSupermarkets,
} from '../services/api'

const router = useRouter()

const selectedSupermarketId = ref('')
const checkoutMessage = ref('')
const orderConfirmed = ref(false)
const confirmedOrder = ref(null)

const supermarkets = ref([])
const pickupSlots = ref([])
const isLoadingSlots = ref(false)
const isSubmittingOrder = ref(false)

const cartTotal = computed(() => {
  return getCartTotal()
})

const cartCount = computed(() => {
  return getCartCount()
})

const selectedSupermarket = computed(() => {
  return supermarkets.value.find((supermarket) => {
    return Number(supermarket.id) === Number(selectedSupermarketId.value)
  })
})

function getTodayDate() {
  const today = new Date()

  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function formatPrice(value) {
  return Number(value).toFixed(2).replace('.', ',')
}

const checkoutData = reactive({
  name: '',
  email: '',
  phone: '',
  pickupDate: getTodayDate(),
  pickupSlot: '',
})

const checkoutErrors = reactive({
  name: '',
  email: '',
  phone: '',
  pickupDate: '',
  pickupSlot: '',
})

onMounted(async () => {
  const user = await checkCurrentUser()

  if (!user) {
    router.replace({
      path: '/login',
      query: {
        redirect: '/cart/checkout',
      },
    })
    return
  }

  checkoutData.name = user.fullName || ''
  checkoutData.email = user.email || ''
  checkoutData.phone = user.phone || ''

  const savedSupermarketId = localStorage.getItem('selectedSupermarketId')

  if (!savedSupermarketId) {
    router.replace('/supermarkets')
    return
  }

  selectedSupermarketId.value = savedSupermarketId

  try {
    supermarkets.value = await getSupermarkets()
    await loadPickupSlots()
  } catch (error) {
    checkoutMessage.value = error.message
  }
})

watch(
  () => checkoutData.pickupDate,
  () => {
    loadPickupSlots()
  },
)

async function loadPickupSlots() {
  if (!selectedSupermarketId.value || !checkoutData.pickupDate) {
    return
  }

  try {
    isLoadingSlots.value = true
    checkoutMessage.value = ''

    pickupSlots.value = await getPickupSlots({
      supermarketId: selectedSupermarketId.value,
      date: checkoutData.pickupDate,
    })

    checkoutData.pickupSlot = ''
  } catch (error) {
    checkoutMessage.value = error.message
  } finally {
    isLoadingSlots.value = false
  }
}

function isEmailValid(email) {
  return email.includes('@') && email.includes('.')
}

function selectPickupSlot(slot) {
  if (!slot.isAvailable) {
    return
  }

  checkoutData.pickupSlot = slot.id
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

async function confirmOrder() {
  const isValid = validateCheckoutData()

  if (!isValid) {
    return
  }

  if (cart.items.length === 0) {
    checkoutMessage.value = 'Il carrello è vuoto.'
    return
  }

  if (!currentUser.value) {
    router.replace({
      path: '/login',
      query: {
        redirect: '/cart/checkout',
      },
    })
    return
  }

  if (!selectedSupermarket.value) {
    checkoutMessage.value = 'Seleziona un supermercato prima di confermare.'
    return
  }

  const orderData = {
    supermarketId: selectedSupermarket.value.id,
    pickupSlotId: checkoutData.pickupSlot,
    customerName: checkoutData.name,
    customerEmail: checkoutData.email,
    items: cart.items.map((item) => {
      return {
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
      }
    }),
  }

  try {
    isSubmittingOrder.value = true
    checkoutMessage.value = ''

    const data = await createOrder(orderData)

    confirmedOrder.value = {
      ...data.order,
      customerName: checkoutData.name,
    }

    clearCart()
    orderConfirmed.value = true
  } catch (error) {
    checkoutMessage.value = error.message
  } finally {
    isSubmittingOrder.value = false
  }
}
</script>

<template>
  <main>
    <h1 class="page-title">Checkout</h1>

    <section v-if="orderConfirmed && confirmedOrder" class="card checkout-confirmation">
      <h2>Ordine confermato</h2>

      <p>
        Grazie {{ confirmedOrder.customerName }}! Il tuo ordine è stato registrato correttamente.
      </p>

      <p>
        Puoi controllare tutti i dettagli dell'ordine nello storico ordini del tuo profilo.
      </p>

      <div class="checkout-confirmation-actions">
        <RouterLink to="/orders" class="btn btn-secondary">
          Vai ai miei ordini
        </RouterLink>

        <RouterLink to="/catalog" class="btn">
          Torna al catalogo
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
          <div class="form-row">
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

          <div class="form-row">
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

          <div class="form-row">
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

            <div class="form-row">
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

            <div class="form-row">
              <label>Fascia oraria</label>

              <p v-if="isLoadingSlots" class="muted-text">
                Caricamento fasce orarie...
              </p>

              <div v-else class="pickup-slots-grid">
                <button
                  v-for="slot in pickupSlots"
                  :key="slot.id"
                  type="button"
                  class="pickup-slot"
                  :class="{
                    'pickup-slot-selected': Number(checkoutData.pickupSlot) === Number(slot.id),
                    'pickup-slot-disabled': !slot.isAvailable,
                  }"
                  :disabled="!slot.isAvailable"
                  @click="selectPickupSlot(slot)"
                >
                  <span>
                    {{ slot.startTime.slice(0, 5) }} - {{ slot.endTime.slice(0, 5) }}
                  </span>
                </button>
              </div>

              <p v-if="checkoutErrors.pickupSlot" class="form-error">
                {{ checkoutErrors.pickupSlot }}
              </p>
            </div>
          </div>

          <button type="submit" class="btn btn-secondary" :disabled="isSubmittingOrder">
            {{ isSubmittingOrder ? 'Conferma in corso...' : 'Conferma ordine' }}
          </button>

          <p v-if="checkoutMessage" class="success-message">
            {{ checkoutMessage }}
          </p>
        </form>
      </div>

      <aside class="summary-box checkout-summary">
        <div class="summary-main">
          <span class="muted-text">Riepilogo ordine</span>

          <strong>
            € {{ formatPrice(cartTotal) }}
          </strong>
        </div>

        <div class="summary-details">
          <div
            v-for="item in cart.items"
            :key="item.id"
            class="summary-row summary-product"
          >
            <span>
              {{ item.name }}
              <small>x{{ item.quantity }}</small>
            </span>

            <strong>
              € {{ formatPrice(getItemSubtotal(item)) }}
            </strong>
          </div>
        </div>

        <div class="summary-actions">
          <RouterLink to="/cart" class="btn">
            Torna al carrello
          </RouterLink>
        </div>
      </aside>
    </section>
  </main>
</template>
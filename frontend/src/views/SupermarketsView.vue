<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getSupermarkets } from '../services/api'
import { clearCart } from '../data/cart'
import { showNotification } from '../services/notification'


const router = useRouter()

const supermarkets = ref([])
const selectedSupermarketId = ref(null)

const selectedSupermarket = computed(() => {
  return supermarkets.value.find((supermarket) => {
    return Number(supermarket.id) === Number(selectedSupermarketId.value)
  })
})

onMounted(async () => {
  selectedSupermarketId.value = Number(localStorage.getItem('selectedSupermarketId'))

  try {
    supermarkets.value = await getSupermarkets()
  } catch (error) {
    console.error('Errore nel caricamento dei supermercati:', error)
    showNotification('Errore nel caricamento dei supermercati', 'error')
  }
})

function isSelected(supermarketId) {
  return Number(selectedSupermarket.value?.id) === Number(supermarketId)
}

function selectSupermarket(supermarketId) {
  const previousSupermarketId = localStorage.getItem('selectedSupermarketId')

  if (isSelected(supermarketId)) {
    router.push({
      path: '/catalog',
      query: {
        supermarketId: supermarketId,
      },
    })

    return
  }

  if (previousSupermarketId && previousSupermarketId !== String(supermarketId)) {
    clearCart()
    showNotification('Hai cambiato supermercato. Il carrello è stato svuotato', 'warning')
  }

  localStorage.setItem('selectedSupermarketId', supermarketId)
  selectedSupermarketId.value = supermarketId
  showNotification('Supermercato selezionato correttamente', 'success')
}
</script>

<template>
  <main>
    <section class="supermarkets-intro">

      <h1 class="page-title">Scegli il tuo supermercato</h1>

      <p class="page-description">
        Scegli il punto vendita Fresh2Go da cui vuoi ordinare la spesa. Il catalogo mostrerà solo
        i prodotti disponibili nel supermercato scelto.
      </p>

    </section>

    <section class="supermarket-grid">
      <article
        v-for="supermarket in supermarkets"
        :key="supermarket.id"
        class="card supermarket-card"
        :class="{ 'supermarket-card-selected': isSelected(supermarket.id) }"
      >
        <div class="supermarket-card-top">
          <div class="supermarket-icon">🛒</div>

          <span v-if="isSelected(supermarket.id)" class="selected-badge">
            Selezionato
          </span>
        </div>

        <h2>{{ supermarket.name }}</h2>

        <div class="supermarket-info">
          <p>
            <span class="supermarket-info-icon">📍</span>
            {{ supermarket.address }}, {{ supermarket.city }}
          </p>

          <p>
            <span class="supermarket-info-icon">🕒</span>
            Orario: {{ supermarket.openingTime }} - {{ supermarket.closingTime }}
          </p>
        </div>

        <button
          class="btn supermarket-button"
          :class="{ 'supermarket-button-selected': isSelected(supermarket.id) }"
          type="button"
          @click="selectSupermarket(supermarket.id)"
        >
          {{ isSelected(supermarket.id) ? 'Vai al catalogo' : 'Scegli supermercato' }}
        </button>
      </article>
    </section>
  </main>
</template>
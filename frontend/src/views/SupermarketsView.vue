<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getSupermarkets } from '../services/api' 
import { clearCart } from '../data/cart'

const router = useRouter()
const supermarkets = ref([]) 

onMounted(async () => {
  try {
    supermarkets.value = await getSupermarkets()
  } catch (error) {
    console.error('Errore nel caricamento dei supermercati:', error)
  }
})

function selectSupermarket(supermarketId) {
  const previousSupermarketId = localStorage.getItem('selectedSupermarketId')

  if (previousSupermarketId && previousSupermarketId !== String(supermarketId)) {
    clearCart()
  }

  localStorage.setItem('selectedSupermarketId', supermarketId)

  router.push({
    path: '/catalog',
    query: {
      supermarketId: supermarketId,
    },
  })
}
</script>

<template>
  <main>
    <h1 class="page-title">Supermercati</h1>

    <p class="page-description">
      Scegli il punto vendita Fresh2Go da cui vuoi ordinare la spesa.
      Il catalogo mostrerà solo i prodotti disponibili nel supermercato scelto.
    </p>

    <section class="supermarket-grid">
      <article
        v-for="supermarket in supermarkets"
        :key="supermarket.id"
        class="card supermarket-card"
      >
        <h2>{{ supermarket.name }}</h2>

        <p>{{ supermarket.address }}, {{ supermarket.city }}</p>

        <p>
          Orario:
          {{ supermarket.openingTime }} - {{ supermarket.closingTime }}
        </p>

        <button
          class="btn"
          type="button"
          @click="selectSupermarket(supermarket.id)"
        >
          Scegli supermercato
        </button>
      </article>
    </section>
  </main>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { mockSupermarkets } from '../data/mockSupermarkets'
import { clearCart } from '../data/cart'

const router = useRouter()

function selectSupermarket(supermarketId) {
  const previousSupermarketId = localStorage.getItem('selectedSupermarketId')

  if (previousSupermarketId && previousSupermarketId !== String(supermarketId)) {
    clearCart()
  }

  localStorage.setItem('selectedSupermarketId', supermarketId)

  router.push('/catalog')
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
        v-for="supermarket in mockSupermarkets"
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
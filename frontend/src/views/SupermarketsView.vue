<script setup>
import { RouterLink } from 'vue-router'
import { mockSupermarkets } from '../data/mockSupermarkets'

function saveSelectedSupermarket(supermarketId) {
  localStorage.setItem('selectedSupermarketId', supermarketId)
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

        <RouterLink
          class="btn"
          :to="`/catalog?supermarketId=${supermarket.id}`"
          @click="saveSelectedSupermarket(supermarket.id)"
        >
          Scegli supermercato
        </RouterLink>
      </article>
    </section>
  </main>
</template>
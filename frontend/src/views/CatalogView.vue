<script setup>
import { computed, ref } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { mockProducts } from '../data/mockProducts'

const searchText = ref('')

const filteredProducts = computed(() => {
  const search = searchText.value.trim().toLowerCase()

  if (search === '') {
    return mockProducts
  }

  return mockProducts.filter((product) => {
    const name = product.name.toLowerCase()
    const brand = product.brand.toLowerCase()
    const description = product.description.toLowerCase()
    const ingredients = product.ingredients.toLowerCase()

    return (
      name.includes(search) ||
      brand.includes(search) ||
      description.includes(search) ||
      ingredients.includes(search)
    )
  })
})
</script>

<template>
  <main>
    <h1 class="page-title">Catalogo</h1>

    <p class="page-description">
      Sfoglia i prodotti disponibili nei supermercati Fresh2Go. In questa fase i dati
      sono caricati da un catalogo locale temporaneo.
    </p>

    <section class="catalog-search">
      <label for="product-search">Cerca prodotto</label>

      <input
        id="product-search"
        v-model="searchText"
        type="text"
        placeholder="Es. pasta, latte, mele..."
      />

      <p class="catalog-summary">
        Prodotti trovati:
        <strong>{{ filteredProducts.length }}</strong>
        su
        <strong>{{ mockProducts.length }}</strong>
      </p>
    </section>

    <section v-if="filteredProducts.length > 0" class="products-grid">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
      />
    </section>

    <p v-else class="empty-catalog-message">
      Nessun prodotto trovato per questa ricerca.
    </p>
  </main>
</template>
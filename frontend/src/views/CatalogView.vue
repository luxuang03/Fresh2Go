<script setup>
import { computed, ref } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { mockCategories } from '../data/mockCategories'
import { mockProducts } from '../data/mockProducts'

const searchText = ref('')
const selectedCategoryId = ref('')
const maxPrice = ref('')
const onlyDiscounted = ref(false)
const onlyAvailable = ref(false)

const filteredProducts = computed(() => {
  const search = searchText.value.trim().toLowerCase()
  const selectedCategory = Number(selectedCategoryId.value)
  const selectedMaxPrice = Number(maxPrice.value)

  return mockProducts.filter((product) => {
    const name = product.name.toLowerCase()
    const brand = product.brand.toLowerCase()
    const description = product.description.toLowerCase()
    const ingredients = product.ingredients.toLowerCase()

    const matchesSearch =
      search === '' ||
      name.includes(search) ||
      brand.includes(search) ||
      description.includes(search) ||
      ingredients.includes(search)

    const matchesCategory =
      selectedCategoryId.value === '' || product.categoryId === selectedCategory

    const matchesMaxPrice =
      maxPrice.value === '' || product.price <= selectedMaxPrice

    const matchesDiscount =
      !onlyDiscounted.value || product.discountPercentage > 0

    const matchesAvailability =
      !onlyAvailable.value || product.isAvailable

    return (
      matchesSearch &&
      matchesCategory &&
      matchesMaxPrice &&
      matchesDiscount &&
      matchesAvailability
    )
  })
})

function resetFilters() {
  searchText.value = ''
  selectedCategoryId.value = ''
  maxPrice.value = ''
  onlyDiscounted.value = false
  onlyAvailable.value = false
}
</script>

<template>
  <main>
    <h1 class="page-title">Catalogo</h1>

    <p class="page-description">
      Sfoglia i prodotti disponibili nei supermercati Fresh2Go. In questa fase i dati
      sono caricati da un catalogo locale temporaneo.
    </p>

    <section class="catalog-filters">
      <div class="filter-field filter-field-large">
        <label for="product-search">Cerca prodotto</label>

        <input
          id="product-search"
          v-model="searchText"
          type="text"
          placeholder="Es. pasta, latte, mele..."
        />
      </div>

      <div class="filter-field">
        <label for="category-filter">Categoria</label>

        <select id="category-filter" v-model="selectedCategoryId">
          <option value="">Tutte le categorie</option>

          <option
            v-for="category in mockCategories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="filter-field">
        <label for="max-price-filter">Prezzo massimo</label>

        <input
          id="max-price-filter"
          v-model="maxPrice"
          type="number"
          min="0"
          step="0.50"
          placeholder="Es. 5"
        />
      </div>

      <div class="filter-options">
        <label>
          <input
            v-model="onlyDiscounted"
            type="checkbox"
          />
          Solo prodotti scontati
        </label>

        <label>
          <input
            v-model="onlyAvailable"
            type="checkbox"
          />
          Solo prodotti disponibili
        </label>
      </div>

      <button type="button" class="btn filter-reset-button" @click="resetFilters">
        Reimposta filtri
      </button>

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
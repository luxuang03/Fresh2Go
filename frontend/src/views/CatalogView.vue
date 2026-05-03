<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { mockCategories } from '../data/mockCategories'
import { mockProducts } from '../data/mockProducts'
import { mockAllergens } from '../data/mockAllergens'
import { mockSupermarkets } from '../data/mockSupermarkets'

const router = useRouter()

const selectedSupermarketId = ref('')

const searchText = ref('')
const selectedCategoryId = ref('')
const maxPrice = ref('')
const onlyDiscounted = ref(false)
const onlyAvailable = ref(false)
const excludedAllergens = ref([])
const onlyVegetarian = ref(false)
const onlyVegan = ref(false)

onMounted(() => {
  const savedSupermarketId = localStorage.getItem('selectedSupermarketId')
  
  if (!savedSupermarketId) {
    router.replace('/supermarkets')
    return
  }

  selectedSupermarketId.value = savedSupermarketId
})

const selectedSupermarket = computed(() => {
  return mockSupermarkets.find((supermarket) => {
    return supermarket.id === Number(selectedSupermarketId.value)
  })
})

const hasSelectedSupermarket = computed(() => {
  return Boolean(selectedSupermarket.value)
})

const filteredProducts = computed(() => {
  if (!hasSelectedSupermarket.value) {
    return []
  }

  const search = searchText.value.trim().toLowerCase()
  const selectedCategory = Number(selectedCategoryId.value)
  const selectedMaxPrice = Number(maxPrice.value)
  const supermarketId = Number(selectedSupermarketId.value)

  return mockProducts.filter((product) => {
    const name = product.name.toLowerCase()
    const brand = product.brand.toLowerCase()
    const description = product.description.toLowerCase()
    const ingredients = product.ingredients.toLowerCase()

    const matchesSupermarket = product.supermarketIds.includes(supermarketId)

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

    const matchesAllergens = excludedAllergens.value.every((allergen) => {
      return !product.allergens.includes(allergen)
    })

    const matchesVegetarian =
      !onlyVegetarian.value || product.isVegetarian

    const matchesVegan =
      !onlyVegan.value || product.isVegan

    return (
      matchesSupermarket &&
      matchesSearch &&
      matchesCategory &&
      matchesMaxPrice &&
      matchesDiscount &&
      matchesAvailability &&
      matchesAllergens &&
      matchesVegetarian &&
      matchesVegan
    )
  })
})

function resetFilters() {
  searchText.value = ''
  selectedCategoryId.value = ''
  maxPrice.value = ''
  onlyDiscounted.value = false
  onlyAvailable.value = false
  excludedAllergens.value = []
  onlyVegetarian.value = false
  onlyVegan.value = false
}
</script>

<template>
  <main>
    <h1 class="page-title">Catalogo</h1>

    <section
      v-if="!hasSelectedSupermarket"
      class="card empty-catalog-message"
    >
      <h2>Prima scegli un supermercato</h2>

      <p class="muted-text">
        Il catalogo dipende dal punto vendita selezionato. Per questo motivo
        devi prima scegliere uno dei supermercati Fresh2Go.
      </p>

      <RouterLink class="btn" to="/supermarkets">
        Vai ai supermercati
      </RouterLink>
    </section>

    <template v-else>
      <p class="page-description">
        Prodotti disponibili presso
        <strong>{{ selectedSupermarket.name }}</strong>.
      </p>

      <RouterLink class="text-link" to="/supermarkets">
        Cambia supermercato
      </RouterLink>

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
            <input v-model="onlyDiscounted" type="checkbox" />
            Solo prodotti scontati
          </label>

          <label>
            <input v-model="onlyAvailable" type="checkbox" />
            Solo prodotti disponibili
          </label>

          <label>
            <input v-model="onlyVegetarian" type="checkbox" />
            Solo vegetariani
          </label>

          <label>
            <input v-model="onlyVegan" type="checkbox" />
            Solo vegani
          </label>
        </div>

        <div class="allergen-filter">
          <p class="filter-title">Escludi allergeni</p>

          <div class="allergen-options">
            <label
              v-for="allergen in mockAllergens"
              :key="allergen.id"
            >
              <input
                v-model="excludedAllergens"
                type="checkbox"
                :value="allergen.name"
              />
              {{ allergen.label }}
            </label>
          </div>
        </div>

        <button
          type="button"
          class="btn filter-reset-button"
          @click="resetFilters"
        >
          Reimposta filtri
        </button>

        <p class="catalog-summary muted-text">
          Prodotti trovati:
          <strong>{{ filteredProducts.length }}</strong>
        </p>
      </section>

      <section
        v-if="filteredProducts.length > 0"
        class="products-grid"
      >
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
        />
      </section>

      <p
        v-else
        class="card empty-catalog-message muted-text"
      >
        Nessun prodotto trovato per questo supermercato con i filtri selezionati.
      </p>
    </template>
  </main>
</template>
<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import {
  getAllergens,
  getCategories,
  getProducts,
  getSupermarkets,
} from '../services/api'

const route = useRoute()
const selectedSupermarketId = ref('')

const products = ref([])
const categories = ref([])
const allergens = ref([])
const supermarkets = ref([])

const isLoading = ref(true)
const errorMessage = ref('')

const searchText = ref('')
const selectedCategoryId = ref('')
const onlyDiscounted = ref(false)
const onlyAvailable = ref(false)
const excludedAllergens = ref([])
const onlyVegetarian = ref(false)
const onlyVegan = ref(false)
const showAdvancedFilters = ref(false)
const showBackToTop = ref(false)

onMounted(async () => {
  window.addEventListener('scroll', checkScrollPosition)

  const supermarketIdFromUrl = route.query.supermarketId
  const savedSupermarketId = localStorage.getItem('selectedSupermarketId')

  const currentSupermarketId = supermarketIdFromUrl || savedSupermarketId

  if (!currentSupermarketId) {
    selectedSupermarketId.value = ''
    await loadInitialData()
    isLoading.value = false
    return
  }

  selectedSupermarketId.value = currentSupermarketId
  localStorage.setItem('selectedSupermarketId', currentSupermarketId)

  await loadInitialData()
  await loadProducts()
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScrollPosition)
})

const selectedSupermarket = computed(() => {
  return supermarkets.value.find((supermarket) => {
    return Number(supermarket.id) === Number(selectedSupermarketId.value)
  })
})

const hasSelectedSupermarket = computed(() => {
  return Boolean(selectedSupermarketId.value)
})

const selectedSupermarketName = computed(() => {
  if (selectedSupermarket.value) {
    return selectedSupermarket.value.name
  }

  return 'supermercato selezionato'
})

async function loadInitialData() {
  errorMessage.value = ''

  try {
    const [categoriesData, allergensData, supermarketsData] = await Promise.all([
      getCategories(),
      getAllergens(),
      getSupermarkets(),
    ])

    categories.value = categoriesData
    allergens.value = allergensData
    supermarkets.value = supermarketsData
  } catch (error) {
    errorMessage.value = error.message
  }
}

async function loadProducts() {
  errorMessage.value = ''
  isLoading.value = true

  try {
    products.value = await getProducts({
      supermarketId: selectedSupermarketId.value,
      categoryId: selectedCategoryId.value,
      search: searchText.value.trim(),
      onlyDiscounted: onlyDiscounted.value,
      onlyAvailable: onlyAvailable.value,
      excludeAllergens: excludedAllergens.value,
      vegetarian: onlyVegetarian.value && !onlyVegan.value,
      vegan: onlyVegan.value,
    })
  } catch (error) {
    errorMessage.value = error.message
    products.value = []
  } finally {
    isLoading.value = false
  }
}

function applyFilters() {
  if (selectedSupermarketId.value) {
    loadProducts()
  }
}

function searchProducts() {
  if (selectedSupermarketId.value) {
    loadProducts()
  }
}

function resetFilters() {
  searchText.value = ''
  selectedCategoryId.value = ''
  onlyDiscounted.value = false
  onlyAvailable.value = false
  excludedAllergens.value = []
  onlyVegetarian.value = false
  onlyVegan.value = false
}

function toggleAllergen(allergenName) {
  if (excludedAllergens.value.includes(allergenName)) {
    excludedAllergens.value = excludedAllergens.value.filter((name) => {
      return name !== allergenName
    })

    return
  }

  excludedAllergens.value.push(allergenName)
}

function checkScrollPosition() {
  showBackToTop.value = window.scrollY > 500
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
</script>

<template>
  <main>
    <h1 class="page-title">Catalogo</h1>

    <p v-if="isLoading" class="muted-text">
      Caricamento prodotti...
    </p>

    <section
      v-else-if="!hasSelectedSupermarket"
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
        <strong>{{ selectedSupermarketName }}</strong>.
      </p>

      <RouterLink class="text-link" to="/supermarkets">
        Cambia supermercato
      </RouterLink>

      <p v-if="errorMessage" class="card empty-catalog-message">
        {{ errorMessage }}
      </p>

      <section class="catalog-filters">
        <div class="catalog-search-row">
          <div class="filter-field">
            <label for="product-search">Cerca prodotto</label>

            <div class="catalog-search-input">
              <input
                id="product-search"
                v-model="searchText"
                type="text"
                placeholder="Es. pasta, latte, mele..."
                @keyup.enter="searchProducts"
              />

              <button
                type="button"
                class="catalog-search-button"
                aria-label="Cerca prodotto"
                @click="searchProducts"
              >
                <svg
                  class="catalog-search-icon"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M10.5 18a7.5 7.5 0 1 1 5.3-12.8A7.5 7.5 0 0 1 10.5 18Zm0-2a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Zm6.2.3 4 4a1 1 0 0 1-1.4 1.4l-4-4a1 1 0 0 1 1.4-1.4Z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <button
            type="button"
            class="btn filter-toggle-button"
            @click="showAdvancedFilters = !showAdvancedFilters"
          >
            {{ showAdvancedFilters ? 'Nascondi filtri' : 'Mostra filtri' }}
          </button>
        </div>

        <div v-if="showAdvancedFilters" class="catalog-advanced-filters">
          <div class="filter-section">
            <div class="filter-section-header">
              <h2>Filtri</h2>

              <p class="muted-text">
                Restringi il catalogo in base alle tue preferenze.
              </p>
            </div>

            <div class="catalog-filter-grid">
              <div class="filter-field">
                <label for="category-filter">Categoria</label>

                <select id="category-filter" v-model="selectedCategoryId">
                  <option value="">Tutte le categorie</option>

                  <option
                    v-for="category in categories"
                    :key="category.id"
                    :value="category.id"
                  >
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <div class="filter-group">
                <p class="filter-title">Tipo di prodotto</p>

                <div class="filter-pill-list">
                  <button
                    type="button"
                    class="filter-pill"
                    :class="{ active: onlyDiscounted }"
                    @click="onlyDiscounted = !onlyDiscounted"
                  >
                    Scontati
                  </button>

                  <button
                    type="button"
                    class="filter-pill"
                    :class="{ active: onlyAvailable }"
                    @click="onlyAvailable = !onlyAvailable"
                  >
                    Disponibili
                  </button>

                  <button
                    type="button"
                    class="filter-pill"
                    :class="{ active: onlyVegetarian }"
                    @click="onlyVegetarian = !onlyVegetarian"
                  >
                    Vegetariani
                  </button>

                  <button
                    type="button"
                    class="filter-pill"
                    :class="{ active: onlyVegan }"
                    @click="onlyVegan = !onlyVegan"
                  >
                    Vegani
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="filter-section allergen-filter">
            <p class="filter-title">Escludi allergeni</p>

            <div class="filter-pill-list allergen-options">
              <button
                v-for="allergen in allergens"
                :key="allergen.id"
                type="button"
                class="filter-pill allergen-pill"
                :class="{ active: excludedAllergens.includes(allergen.name) }"
                @click="toggleAllergen(allergen.name)"
              >
                {{ allergen.label || allergen.name }}
              </button>
            </div>
          </div>

          <div class="filter-actions">
            <button
              type="button"
              class="btn"
              @click="applyFilters"
            >
              Applica filtri
            </button>

            <button
              type="button"
              class="btn filter-reset-button"
              @click="resetFilters"
            >
              Cancella filtri
            </button>
          </div>
        </div>

        <p class="catalog-summary muted-text">
          Prodotti trovati:
          <strong>{{ products.length }}</strong>
        </p>
      </section>

      <section
        v-if="products.length > 0"
        class="products-grid"
      >
        <ProductCard
          v-for="product in products"
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

      <button
        v-if="showBackToTop"
        class="back-to-top-button"
        type="button"
        aria-label="Torna in alto"
        @click="scrollToTop"
      >
        ↑
      </button>
    </template>
  </main>
</template>
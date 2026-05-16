<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import {
  getAllergens,
  getCategories,
  getProducts,
  getSupermarkets,
} from '../services/api'

const router = useRouter()
const route = useRoute()
const selectedSupermarketId = ref('')

const products = ref([])
const categories = ref([])
const allergens = ref([])
const supermarkets = ref([])

const isLoading = ref(false)
const errorMessage = ref('')

const searchText = ref('')
const selectedCategoryId = ref('')
const maxPrice = ref('')
const onlyDiscounted = ref(false)
const onlyAvailable = ref(false)
const excludedAllergens = ref([])
const onlyVegetarian = ref(false)
const onlyVegan = ref(false)
const showAdvancedFilters = ref(false)

onMounted(async () => {
  const supermarketIdFromUrl = route.query.supermarketId
  const savedSupermarketId = localStorage.getItem('selectedSupermarketId')

  const currentSupermarketId = supermarketIdFromUrl || savedSupermarketId

  if (!currentSupermarketId) {
    selectedSupermarketId.value = ''
    await loadInitialData()
    return
  }

  selectedSupermarketId.value = currentSupermarketId
  localStorage.setItem('selectedSupermarketId', currentSupermarketId)

  await loadInitialData()
  await loadProducts()
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

const filteredProducts = computed(() => {
  return products.value
})

watch(
  [
    searchText,
    selectedCategoryId,
    maxPrice,
    onlyDiscounted,
    onlyAvailable,
    excludedAllergens,
    onlyVegetarian,
    onlyVegan,
  ],
  () => {
    if (selectedSupermarketId.value) {
      loadProducts()
    }
  },
)

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
      maxPrice: maxPrice.value,
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
          <div class="filter-field filter-field-large">
            <label for="product-search">Cerca prodotto</label>
          
            <input
              id="product-search"
              v-model="searchText"
              type="text"
              placeholder="Es. pasta, latte, mele..."
            />
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
          <div class="catalog-filter-main-row">
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
          </div>
        
          <div class="allergen-filter">
            <p class="filter-title">Escludi allergeni</p>
          
            <div class="allergen-options">
              <label
                v-for="allergen in allergens"
                :key="allergen.id"
              >
                <input
                  v-model="excludedAllergens"
                  type="checkbox"
                  :value="allergen.name"
                />
            
                {{ allergen.label || allergen.name }}
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
        </div>
      
        <p class="catalog-summary muted-text">
          Prodotti trovati:
          <strong>{{ filteredProducts.length }}</strong>
        </p>
      </section>

      <p v-if="isLoading" class="card empty-catalog-message muted-text">
        Caricamento prodotti...
      </p>

      <section
        v-else-if="filteredProducts.length > 0"
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
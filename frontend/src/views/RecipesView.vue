<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { mockRecipes } from '../data/mockRecipes'
import { mockProducts } from '../data/mockProducts'
import { mockSupermarkets } from '../data/mockSupermarkets'
import RecipeCard from '../components/RecipeCard.vue'

const router = useRouter()

const selectedSupermarketId = ref('')

const searchText = ref('')
const selectedType = ref('')

const recipeTypes = ['primo', 'secondo', 'contorno', 'dolce']

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

const filteredRecipes = computed(() => {
  if (!selectedSupermarket.value) {
    return []
  }

  const supermarketId = Number(selectedSupermarketId.value)
  const search = searchText.value.trim().toLowerCase()

  return mockRecipes.filter((recipe) => {
    const matchesSearch =
      search === '' || recipe.name.toLowerCase().includes(search)

    const matchesType =
      selectedType.value === '' || recipe.type === selectedType.value

    const ingredientsAvailable = recipe.ingredients.every((ingredient) => {
      const product = mockProducts.find((item) => {
        return item.id === ingredient.productId
      })

      if (!product) {
        return false
      }

      return (
        product.isAvailable &&
        product.stockQuantity > 0 &&
        product.supermarketIds.includes(supermarketId)
      )
    })

    return matchesSearch && matchesType && ingredientsAvailable
  })
})
</script>

<template>
  <section class="page-section">
    <div class="page-header">
      <h1>Ricette</h1>

      <p v-if="selectedSupermarket">
        Ricette preparabili con i prodotti disponibili presso
        <strong>{{ selectedSupermarket.name }}</strong>.
      </p>

      <p v-else>
        Prima scegli un supermercato per vedere le ricette disponibili.
      </p>
    </div>

    <RouterLink class="text-link" to="/supermarkets">
      Cambia supermercato
    </RouterLink>

    <div class="recipe-filters">
      <div class="filter-field">
        <label for="recipe-search">Cerca ricetta</label>
        <input
          id="recipe-search"
          v-model="searchText"
          type="text"
          placeholder="Es. pasta, pollo, yogurt..."
        />
      </div>

      <div class="filter-field">
        <label for="recipe-type">Tipo ricetta</label>
        <select id="recipe-type" v-model="selectedType">
          <option value="">Tutte</option>
          <option v-for="type in recipeTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
      </div>
    </div>

    <p class="results-count">
      Ricette trovate: {{ filteredRecipes.length }}
    </p>

    <div v-if="filteredRecipes.length > 0" class="recipes-grid">
      <RecipeCard
        v-for="recipe in filteredRecipes"
        :key="recipe.id"
        :recipe="recipe"
      />
    </div>

    <p v-else class="empty-message">
      Nessuna ricetta trovata per questo supermercato con i filtri selezionati.
    </p>
  </section>
</template>
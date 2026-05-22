<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { getRecipes, getSupermarkets } from '../services/api'
import RecipeCard from '../components/RecipeCard.vue'

const selectedSupermarketId = ref('')
const searchText = ref('')
const appliedSearchText = ref('')
const selectedType = ref('')
const recipeTypes = ['primo', 'secondo', 'contorno', 'dolce']

const recipes = ref([])
const supermarkets = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  const savedSupermarketId = localStorage.getItem('selectedSupermarketId')

  if (!savedSupermarketId) {
    selectedSupermarketId.value = ''
    isLoading.value = false
    return
  }

  selectedSupermarketId.value = savedSupermarketId

  try {
    supermarkets.value = await getSupermarkets()

    recipes.value = await getRecipes({
      supermarketId: selectedSupermarketId.value,
    })
  } catch (error) {
    console.error('Errore nel caricamento delle ricette:', error)
    errorMessage.value = 'Errore nel caricamento delle ricette'
  } finally {
    isLoading.value = false
  }
})

function searchRecipes() {
  appliedSearchText.value = searchText.value.trim()
}

const selectedSupermarket = computed(() => {
  return supermarkets.value.find((supermarket) => {
    return Number(supermarket.id) === Number(selectedSupermarketId.value)
  })
})

const filteredRecipes = computed(() => {
  const search = appliedSearchText.value.toLowerCase()

  return recipes.value.filter((recipe) => {
    const recipeName = recipe.name.toLowerCase()

    const matchesName = recipeName.includes(search)

    const matchesIngredients = recipe.ingredients?.some((ingredient) => {
      const ingredientName = ingredient.name || ingredient.productName || ''

      return ingredientName.toLowerCase().includes(search)
    })

    const matchesSearch =
      search === '' || matchesName || matchesIngredients

    const recipeType = recipe.recipeType || recipe.type

    const matchesType =
      selectedType.value === '' || recipeType === selectedType.value

    return matchesSearch && matchesType
  })
})
</script>

<template>
  <main>
    <h1 class="page-title">Ricette</h1>

    <section
      v-if="!selectedSupermarketId"
      class="card empty-catalog-message"
    >
      <h2>Prima scegli un supermercato</h2>

      <p class="muted-text">
        Le ricette dipendono dai prodotti disponibili nel punto vendita selezionato.
        Per questo motivo devi prima scegliere uno dei supermercati Fresh2Go.
      </p>

      <RouterLink class="btn" to="/supermarkets">
        Vai ai supermercati
      </RouterLink>
    </section>

    <template v-else>
      <p v-if="isLoading" class="muted-text">
        Caricamento ricette...
      </p>

      <p v-else-if="errorMessage" class="empty-message">
        {{ errorMessage }}
      </p>

      <template v-else>
        <p class="page-description">
          Ricette preparabili con i prodotti disponibili presso
          <strong>{{ selectedSupermarket?.name || 'supermercato selezionato' }}</strong>.
        </p>

        <RouterLink class="text-link" to="/supermarkets">
          Cambia supermercato
        </RouterLink>

        <section class="recipe-filters">
          <div class="filter-field">
            <label for="recipe-search">Cerca ricetta</label>

            <div class="recipe-search-input">
              <input
                id="recipe-search"
                v-model="searchText"
                type="text"
                placeholder="Es. pasta, pollo, yogurt..."
                @keyup.enter="searchRecipes"
              />

              <button
                type="button"
                class="recipe-search-button"
                aria-label="Cerca ricetta"
                @click="searchRecipes"
              >
                <svg
                  class="recipe-search-icon"
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

          <div class="filter-field">
            <label for="recipe-type">Tipo ricetta</label>

            <select id="recipe-type" v-model="selectedType">
              <option value="">Tutte</option>

              <option
                v-for="type in recipeTypes"
                :key="type"
                :value="type"
              >
                {{ type }}
              </option>
            </select>
          </div>
        </section>

        <p class="results-count">
          Ricette trovate: {{ filteredRecipes.length }}
        </p>

        <section
          v-if="filteredRecipes.length > 0"
          class="recipes-grid"
        >
          <RecipeCard
            v-for="recipe in filteredRecipes"
            :key="recipe.id"
            :recipe="recipe"
          />
        </section>

        <p v-else class="empty-message">
          Nessuna ricetta trovata per questo supermercato con i filtri selezionati.
        </p>
      </template>
    </template>
  </main>
</template>
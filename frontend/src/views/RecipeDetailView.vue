<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { mockRecipes } from '../data/mockRecipes'
import { mockProducts } from '../data/mockProducts'
import { mockSupermarkets } from '../data/mockSupermarkets'

const route = useRoute()
const router = useRouter()

const selectedSupermarketId = ref('')

onMounted(() => {
  const savedSupermarketId = localStorage.getItem('selectedSupermarketId')

  if (!savedSupermarketId) {
    router.replace('/supermarkets')
    return
  }

  selectedSupermarketId.value = savedSupermarketId
})

const recipeId = computed(() => {
  return Number(route.params.id)
})

const recipe = computed(() => {
  return mockRecipes.find((item) => {
    return item.id === recipeId.value
  })
})

const selectedSupermarket = computed(() => {
  return mockSupermarkets.find((supermarket) => {
    return supermarket.id === Number(selectedSupermarketId.value)
  })
})

const ingredientsWithProducts = computed(() => {
  if (!recipe.value) {
    return []
  }

  const supermarketId = Number(selectedSupermarketId.value)

  return recipe.value.ingredients.map((ingredient) => {
    const product = mockProducts.find((item) => {
      return item.id === ingredient.productId
    })

    const isAvailableHere =
      product &&
      product.isAvailable &&
      product.stockQuantity > 0 &&
      product.supermarketIds.includes(supermarketId)

    return {
      ...ingredient,
      product,
      isAvailableHere,
    }
  })
})
</script>

<template>
  <section class="page-section">
    <RouterLink class="text-link" to="/recipes">
      Torna alle ricette
    </RouterLink>

    <div v-if="recipe" class="recipe-detail">
      <div class="recipe-detail-image">
        <span>{{ recipe.name.charAt(0) }}</span>
      </div>

      <div class="recipe-detail-content">
        <p class="recipe-type">{{ recipe.type }}</p>

        <h1>{{ recipe.name }}</h1>

        <p class="recipe-description">
          {{ recipe.description }}
        </p>

        <div class="recipe-info">
          <span>{{ recipe.servings }} porzioni</span>
          <span>{{ recipe.ingredients.length }} ingredienti</span>
        </div>

        <p v-if="selectedSupermarket" class="muted-text">
          Ingredienti disponibili presso
          <strong>{{ selectedSupermarket.name }}</strong>.
        </p>

        <h2>Ingredienti</h2>

        <div class="ingredients-list">
          <div
            v-for="ingredient in ingredientsWithProducts"
            :key="ingredient.productId"
            class="ingredient-row"
          >
            <div>
              <h3>{{ ingredient.name }}</h3>

              <p>
                Quantità:
                <strong>{{ ingredient.quantity }} {{ ingredient.unit }}</strong>
              </p>

              <p v-if="ingredient.isOptional" class="muted-text">
                Ingrediente opzionale
              </p>
            </div>

            <div class="ingredient-product">
              <RouterLink
                v-if="ingredient.product"
                class="text-link"
                :to="`/catalog/${ingredient.product.id}`"
              >
                Vedi prodotto
              </RouterLink>

              <span
                v-if="ingredient.isAvailableHere"
                class="ingredient-available"
              >
                Disponibile
              </span>

              <span v-else class="ingredient-unavailable">
                Non disponibile
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-message">
      Ricetta non trovata.
    </div>
  </section>
</template>
<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { mockRecipes } from '../data/mockRecipes'
import { mockProducts } from '../data/mockProducts'
import { mockSupermarkets } from '../data/mockSupermarkets'
import { addToCart } from '../data/cart'

const route = useRoute()
const router = useRouter()

const selectedSupermarketId = ref('')
const cartMessage = ref('')
const selectedIngredientIds = ref([])

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

const recipeAllergens = computed(() => {
  if (!recipe.value) {
    return []
  }

  return recipe.value.allergens
})

const availableIngredients = computed(() => {
  return ingredientsWithProducts.value.filter((ingredient) => {
    return ingredient.product && ingredient.isAvailableHere
  })
})

const selectedAvailableIngredients = computed(() => {
  return availableIngredients.value.filter((ingredient) => {
    return selectedIngredientIds.value.includes(ingredient.productId)
  })
})

const estimatedTotal = computed(() => {
  return ingredientsWithProducts.value.reduce((total, ingredient) => {
    if (!ingredient.product) {
      return total
    }

    return total + getFinalPrice(ingredient.product)
  }, 0)
})

const selectedTotal = computed(() => {
  return selectedAvailableIngredients.value.reduce((total, ingredient) => {
    return total + getFinalPrice(ingredient.product)
  }, 0)
})

watch(availableIngredients, () => {
  selectedIngredientIds.value = availableIngredients.value.map((ingredient) => {
    return ingredient.productId
  })
})

function getFinalPrice(product) {
  if (!product.discountPercentage) {
    return product.price
  }

  return product.price - (product.price * product.discountPercentage) / 100
}

function formatPrice(value) {
  return value.toFixed(2).replace('.', ',')
}

function addIngredientsToCart() {
  cartMessage.value = ''

  if (availableIngredients.value.length === 0) {
    cartMessage.value = 'Nessun ingrediente disponibile da aggiungere al carrello.'
    return
  }

  if (selectedAvailableIngredients.value.length === 0) {
    cartMessage.value = 'Seleziona almeno un ingrediente disponibile da aggiungere.'
    return
  }

  selectedAvailableIngredients.value.forEach((ingredient) => {
    const productToAdd = {
      ...ingredient.product,
      price: getFinalPrice(ingredient.product),
    }

    addToCart(productToAdd)
  })

  cartMessage.value = 'Ingredienti selezionati aggiunti al carrello.'
}
</script>

<template>
  <section>
    <RouterLink class="back-link" to="/recipes">
      Torna alle ricette
    </RouterLink>

    <div v-if="recipe" class="recipe-detail">
      <div class="recipe-detail-image card">
        <span>{{ recipe.name.charAt(0) }}</span>
      </div>

      <div class="recipe-detail-content card">
        <p class="recipe-type">{{ recipe.type }}</p>

        <h1 class="page-title">{{ recipe.name }}</h1>

        <p class="recipe-description">
          {{ recipe.description }}
        </p>

        <div class="recipe-info">
          <span>{{ recipe.servings }} porzioni</span>
          <span>{{ recipe.ingredients.length }} ingredienti</span>
        </div>

        <p v-if="selectedSupermarket" class="muted-text">
          Ingredienti controllati presso
          <strong>{{ selectedSupermarket.name }}</strong>.
        </p>

        <div class="recipe-summary">
          <div class="card">
            <p class="muted-text">Costo stimato ricetta</p>
            <strong>€ {{ formatPrice(estimatedTotal) }}</strong>
          </div>

          <div class="card">
            <p class="muted-text">Costo selezionato</p>
            <strong>€ {{ formatPrice(selectedTotal) }}</strong>
          </div>

          <div class="card">
            <p class="muted-text">Allergeni</p>
            <strong v-if="recipeAllergens.length > 0">
              {{ recipeAllergens.length }}
            </strong>
            <strong v-else>Nessuno</strong>
          </div>
        </div>

        <div v-if="recipeAllergens.length > 0" class="recipe-warning">
          <h2>Attenzione allergeni</h2>

          <p class="muted-text">
            Questa ricetta contiene o può contenere:
          </p>

          <div class="recipe-allergens">
            <span
              v-for="allergen in recipeAllergens"
              :key="allergen"
            >
              {{ allergen }}
            </span>
          </div>
        </div>

        <p v-else class="recipe-safe">
          Questa ricetta non contiene allergeni segnalati.
        </p>

        <h2>Ingredienti</h2>

        <p class="muted-text">
          Deseleziona gli ingredienti che hai già a casa.
        </p>

        <div class="ingredients-list">
          <label
            v-for="ingredient in ingredientsWithProducts"
            :key="ingredient.productId"
            class="ingredient-row ingredient-select-row"
            :class="{ 'ingredient-disabled': !ingredient.isAvailableHere }"
          >
            <div class="ingredient-main">
              <input
                type="checkbox"
                :value="ingredient.productId"
                v-model="selectedIngredientIds"
                :disabled="!ingredient.isAvailableHere"
              />

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
            </div>

            <div class="ingredient-info">
              <p v-if="ingredient.product">
                € {{ formatPrice(getFinalPrice(ingredient.product)) }}
              </p>

              <span
                v-if="ingredient.isAvailableHere"
                class="tag"
              >
                Disponibile
              </span>

              <span v-else class="tag tag-unavailable">
                Non disponibile
              </span>
            </div>
          </label>
        </div>

        <div class="recipe-cart-actions">
          <button
            type="button"
            class="btn"
            @click="addIngredientsToCart"
          >
            Aggiungi ingredienti selezionati
          </button>

          <RouterLink to="/cart" class="btn btn-secondary">
            Vai al carrello
          </RouterLink>
        </div>

        <p v-if="cartMessage" class="recipe-cart-message">
          {{ cartMessage }}
        </p>
      </div>
    </div>

    <div v-else class="empty-message">
      Ricetta non trovata.
    </div>
  </section>
</template>
<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { getRecipeById } from '../services/api'
import { addToCart } from '../data/cart'
import { showNotification } from '../services/notification'

const route = useRoute()
const router = useRouter()

const recipe = ref(null)
const selectedSupermarketId = ref('')
const selectedIngredientIds = ref([])
const selectedServings = ref(1)
const isLoading = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  const savedSupermarketId = localStorage.getItem('selectedSupermarketId')

  if (!savedSupermarketId) {
    router.replace('/supermarkets')
    return
  }

  selectedSupermarketId.value = savedSupermarketId

  try {
    recipe.value = await getRecipeById(route.params.id, {
      supermarketId: selectedSupermarketId.value,
    })
  } catch (error) {
    console.error('Errore nel caricamento della ricetta:', error)
    errorMessage.value = 'Ricetta non trovata'
  } finally {
    isLoading.value = false
  }
})

const ingredientsWithProducts = computed(() => {
  if (!recipe.value || !recipe.value.ingredients) {
    return []
  }

  return recipe.value.ingredients.map((ingredient) => {
    const product = ingredient.product || {
      id: ingredient.productId,
      name: ingredient.productName,
      price: ingredient.price,
      finalPrice: ingredient.finalPrice,
      imageUrl: ingredient.imageUrl,
      unitLabel: ingredient.unitLabel,
      isAvailable: ingredient.isAvailable,
      stockQuantity: ingredient.stockQuantity,
      discountPercentage: ingredient.discountPercentage,
    }

    const isAvailableHere =
      product &&
      (product.isAvailable === true || product.isAvailable === 'true') &&
      Number(product.stockQuantity) > 0

    return {
      ...ingredient,
      product,
      productId: ingredient.productId || product.id,
      name: ingredient.name || ingredient.productName || product.name,
      isAvailableHere,
    }
  })
})

const recipeAllergens = computed(() => {
  if (!recipe.value || !recipe.value.allergens) {
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

const selectedTotal = computed(() => {
  return selectedAvailableIngredients.value.reduce((total, ingredient) => {
    return total + getFinalPrice(ingredient.product) * getProductUnitsNeeded(ingredient)
  }, 0)
})

const selectedCostItems = computed(() => {
  return selectedAvailableIngredients.value.map((ingredient) => {
    const unitsNeeded = getProductUnitsNeeded(ingredient)
    const unitPrice = getFinalPrice(ingredient.product)

    return {
      productId: ingredient.productId,
      name: ingredient.name,
      unitsNeeded,
      subtotal: unitPrice * unitsNeeded,
    }
  })
})

const areAllAvailableIngredientsSelected = computed(() => {
  if (availableIngredients.value.length === 0) {
    return false
  }

  return availableIngredients.value.every((ingredient) => {
    return selectedIngredientIds.value.includes(ingredient.productId)
  })
})

watch(
  recipe,
  () => {
    if (recipe.value) {
      selectedServings.value = recipe.value.servings
    }
  },
  { immediate: true },
)

watch(
  availableIngredients,
  () => {
    selectedIngredientIds.value = availableIngredients.value.map((ingredient) => {
      return ingredient.productId
    })
  },
  { immediate: true },
)

function increaseServings() {
  selectedServings.value += 1
}

function decreaseServings() {
  if (selectedServings.value > 1) {
    selectedServings.value -= 1
  }
}

function getUpdatedQuantity(ingredient) {
  if (!recipe.value) {
    return ingredient.quantity
  }

  return (ingredient.quantity * selectedServings.value) / recipe.value.servings
}

function getProductUnitSize(product, ingredientUnit) {
  if (!product.unitLabel) {
    return 1
  }

  const unitLabel = product.unitLabel.toLowerCase().replace(',', '.')
  const unit = ingredientUnit.toLowerCase()
  const numberMatch = unitLabel.match(/(\d+(\.\d+)?)/)
  const number = numberMatch ? Number(numberMatch[1]) : 1

  if (unit === 'g') {
    if (unitLabel.includes('kg')) {
      return number * 1000
    }

    if (unitLabel.includes('g')) {
      return number
    }
  }

  if (unit === 'ml') {
    if (unitLabel.includes('ml')) {
      return number
    }

    if (unitLabel.includes('l')) {
      return number * 1000
    }
  }

  if (unit === 'pezzi') {
    if (unitLabel.includes('pezzi') || unitLabel.includes('pezzo')) {
      return number
    }

    return 1
  }

  if (unit === 'vasetti') {
    const packMatch = unitLabel.match(/(\d+)\s*x/)

    if (packMatch) {
      return Number(packMatch[1])
    }

    return 1
  }

  return 1
}

function getProductUnitsNeeded(ingredient) {
  if (!ingredient.product) {
    return 0
  }

  const updatedQuantity = getUpdatedQuantity(ingredient)
  const productUnitSize = getProductUnitSize(ingredient.product, ingredient.unit)

  return Math.max(1, Math.ceil(updatedQuantity / productUnitSize))
}

function formatQuantity(value) {
  if (Number.isInteger(value)) {
    return value
  }

  return Number(value).toFixed(1).replace('.', ',')
}

function getFinalPrice(product) {
  if (product.finalPrice !== undefined && product.finalPrice !== null) {
    return Number(product.finalPrice)
  }

  if (!product.discountPercentage) {
    return Number(product.price)
  }

  return Number(product.price) - (Number(product.price) * Number(product.discountPercentage)) / 100
}

function formatPrice(value) {
  return Number(value).toFixed(2).replace('.', ',')
}

function toggleAllIngredients() {
  if (areAllAvailableIngredientsSelected.value) {
    selectedIngredientIds.value = []
    return
  }

  selectedIngredientIds.value = availableIngredients.value.map((ingredient) => {
    return ingredient.productId
  })
}

function addIngredientsToCart() {
  if (selectedAvailableIngredients.value.length === 0) {
    showNotification('Seleziona almeno un ingrediente disponibile', 'warning')
    return
  }

  selectedAvailableIngredients.value.forEach((ingredient) => {
    const productToAdd = {
      ...ingredient.product,
      price: getFinalPrice(ingredient.product),
      supermarketId: Number(selectedSupermarketId.value),
    }

    addToCart(productToAdd, getProductUnitsNeeded(ingredient))
  })

  showNotification('Ingredienti aggiunti al carrello', 'success')
}
</script>

<template>
  <section>
    <RouterLink class="back-link" to="/recipes">
      Torna alle ricette
    </RouterLink>

    <p v-if="isLoading" class="muted-text">
      Caricamento ricetta...
    </p>

    <article v-else-if="recipe" class="card recipe-detail">
      <div class="recipe-detail-main">
        <div class="recipe-detail-image">
          <span class="tag tag-accent recipe-detail-type">
            {{ recipe.recipeType || recipe.type }}
          </span>

          <img
            v-if="recipe.imageUrl"
            :src="recipe.imageUrl"
            :alt="recipe.name"
          />

          <span v-else class="recipe-detail-placeholder">
            {{ recipe.name.charAt(0) }}
          </span>
        </div>

        <div class="recipe-detail-content">
          <h1 class="page-title">{{ recipe.name }}</h1>

          <p class="recipe-description">
            {{ recipe.description }}
          </p>

          <div v-if="recipeAllergens.length > 0" class="tag-list">
            <span
              v-for="allergen in recipeAllergens"
              :key="allergen"
              class="tag recipe-allergen-tag"
            >
              {{ allergen }}
            </span>
          </div>

          <p v-else class="recipe-safe">
            Nessun allergene segnalato.
          </p>

          <div class="recipe-actions">
            <div class="servings-box">
              <span class="servings-label">Porzioni</span>

              <div class="servings-controls">
                <button
                  type="button"
                  class="quantity-button"
                  :disabled="selectedServings === 1"
                  @click="decreaseServings"
                >
                  -
                </button>

                <strong>{{ selectedServings }}</strong>

                <button
                  type="button"
                  class="quantity-button"
                  @click="increaseServings"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              class="btn recipe-add-button"
              @click="addIngredientsToCart"
            >
              Aggiungi al carrello
            </button>
          </div>
        </div>
      </div>

      <div class="recipe-detail-lower">
        <div class="recipe-shopping-section">
          <section class="recipe-ingredients-section">
            <div class="recipe-section-header">
              <h2>Ingredienti</h2>

              <button
                type="button"
                class="ingredient-select-all"
                @click="toggleAllIngredients"
              >
                {{ areAllAvailableIngredientsSelected ? 'Deseleziona tutto' : 'Seleziona tutto' }}
              </button>
            </div>

            <div class="ingredients-list">
              <label
                v-for="ingredient in ingredientsWithProducts"
                :key="ingredient.productId"
                class="ingredient-row"
                :class="{ 'ingredient-disabled': !ingredient.isAvailableHere }"
              >
                <input
                  type="checkbox"
                  :value="ingredient.productId"
                  v-model="selectedIngredientIds"
                  :disabled="!ingredient.isAvailableHere"
                />

                <span class="ingredient-name">
                  {{ ingredient.name }}
                </span>

                <span
                  v-if="ingredient.isAvailableHere"
                  class="ingredient-quantity"
                >
                  {{ formatQuantity(getUpdatedQuantity(ingredient)) }}
                  {{ ingredient.unit }}
                </span>

                <span
                  v-if="!ingredient.isAvailableHere"
                  class="tag tag-unavailable"
                >
                  Esaurito
                </span>
              </label>
            </div>
          </section>

          <aside class="summary-box">
            <div class="summary-main">
              <span class="muted-text">Costo stimato</span>
              <strong>€ {{ formatPrice(selectedTotal) }}</strong>
            </div>

            <div class="summary-details">
              <p v-if="selectedCostItems.length === 0" class="muted-text">
                Nessun ingrediente selezionato.
              </p>

              <div
                v-for="item in selectedCostItems"
                :key="item.productId"
                class="summary-row"
              >
                <span class="summary-name">
                  {{ item.name }}
                  <small>x{{ item.unitsNeeded }}</small>
                </span>

                <strong>
                  € {{ formatPrice(item.subtotal) }}
                </strong>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>

    <div v-else class="empty-message">
      {{ errorMessage || 'Ricetta non trovata.' }}
    </div>
  </section>
</template>
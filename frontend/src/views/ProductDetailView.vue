<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getProductById, getSupermarkets } from '../services/api'
import { addToCart } from '../data/cart'

const route = useRoute()

const product = ref(null)
const supermarkets = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

const selectedSupermarketId = computed(() => {
  if (route.query.supermarketId) {
    return Number(route.query.supermarketId)
  }

  const savedSupermarketId = localStorage.getItem('selectedSupermarketId')
  return Number(savedSupermarketId)
})

const selectedSupermarket = computed(() => {
  return supermarkets.value.find((supermarket) => {
    return Number(supermarket.id) === Number(selectedSupermarketId.value)
  })
})

const catalogLink = computed(() => {
  if (selectedSupermarketId.value) {
    return `/catalog?supermarketId=${selectedSupermarketId.value}`
  }

  return '/catalog'
})

const finalPrice = computed(() => {
  if (!product.value) {
    return 0
  }

  if (product.value.finalPrice !== undefined && product.value.finalPrice !== null) {
    return Number(product.value.finalPrice)
  }

  if (!product.value.discountPercentage) {
    return Number(product.value.price)
  }

  return Number(product.value.price) - (Number(product.value.price) * Number(product.value.discountPercentage)) / 100
})

const allergenLabels = computed(() => {
  if (!product.value || !product.value.allergens) {
    return []
  }

  return product.value.allergens.map((allergen) => {
    return allergen.label || allergen.name
  })
})

const isProductAvailableInSelectedSupermarket = computed(() => {
  if (!product.value) {
    return false
  }

  return product.value.isAvailable && product.value.stockQuantity > 0
})

onMounted(async () => {
  try {
    const productId = route.params.id

    const [productData, supermarketData] = await Promise.all([
      getProductById(productId, {
        supermarketId: selectedSupermarketId.value,
      }),
      getSupermarkets(),
    ])

    product.value = productData
    supermarkets.value = supermarketData
  } catch (error) {
    console.error('Errore nel caricamento del prodotto:', error)
    errorMessage.value = 'Prodotto non trovato'
  } finally {
    isLoading.value = false
  }
})

function handleAddToCart() {
  if (!product.value || !isProductAvailableInSelectedSupermarket.value) {
    return
  }

  const productToAdd = {
    ...product.value,
    price: finalPrice.value,
    supermarketId: selectedSupermarketId.value,
  }

  addToCart(productToAdd)
  alert('Prodotto aggiunto al carrello')
}
</script>

<template>
  <main>
    <RouterLink :to="catalogLink" class="back-link">
      Torna al catalogo
    </RouterLink>

    <p v-if="isLoading" class="muted-text">
      Caricamento prodotto...
    </p>

    <p v-else-if="errorMessage" class="muted-text">
      {{ errorMessage }}
    </p>

    <section v-else-if="product" class="card product-detail">
      <div class="product-detail-image">
        <img
          v-if="product.imageUrl"
          :src="product.imageUrl"
          :alt="product.name"
        />

        <span v-else>{{ product.name.charAt(0) }}</span>
      </div>

      <div class="product-detail-content">
        <p class="product-detail-brand muted-text">
          {{ product.brand }}
        </p>

        <h1 class="product-detail-title">
          {{ product.name }}
        </h1>

        <p class="product-detail-description muted-text">
          {{ product.description }}
        </p>

        <div class="product-detail-price-box">
          <div class="product-detail-price-area">
            <p
              v-if="product.discountPercentage > 0"
              class="product-original-price"
            >
              € {{ Number(product.price).toFixed(2) }}
            </p>

            <div class="product-price product-detail-price">
              <span>€ {{ finalPrice.toFixed(2) }}</span>

              <span
                v-if="product.unitLabel"
                class="product-price-unit"
              >
                / {{ product.unitLabel }}
              </span>
            </div>
          </div>

          <span
            v-if="product.discountPercentage > 0"
            class="tag tag-accent"
          >
            -{{ product.discountPercentage }}%
          </span>
        </div>

        <RouterLink
          v-if="!selectedSupermarket"
          class="btn product-detail-cart-button"
          to="/supermarkets"
        >
          Scegli un supermercato
        </RouterLink>

        <button
          v-else
          type="button"
          class="btn product-add-button product-detail-cart-button"
          :class="{ 'product-add-button-unavailable': !isProductAvailableInSelectedSupermarket }"
          :disabled="!isProductAvailableInSelectedSupermarket"
          @click="handleAddToCart"
        >
          {{ isProductAvailableInSelectedSupermarket ? 'Aggiungi' : 'Esaurito' }}
        </button>

        <p
          v-if="selectedSupermarket"
          class="product-detail-availability"
          :class="{ 'product-detail-availability-error': !isProductAvailableInSelectedSupermarket }"
        >
          {{ isProductAvailableInSelectedSupermarket ? 'Disponibile' : 'Non disponibile nel supermercato scelto' }}
        </p>

        <section
          v-if="product.ingredients || allergenLabels.length"
          class="product-detail-extra"
        >
          <div v-if="product.ingredients" class="product-detail-section">
            <h2>Ingredienti</h2>
            <p>{{ product.ingredients }}</p>
          </div>

          <div v-if="allergenLabels.length" class="product-detail-section">
            <h2>Allergeni</h2>

            <div class="product-detail-tags">
              <span
                v-for="allergen in allergenLabels"
                :key="allergen"
                class="tag tag-accent"
              >
                {{ allergen }}
              </span>
            </div>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>
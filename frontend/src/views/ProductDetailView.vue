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
    return supermarket.id === selectedSupermarketId.value
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

  return product.value.allergens
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

    <section v-if="product" class="product-detail">
      <div class="card product-detail-image">
        <span>{{ product.name.charAt(0) }}</span>
      </div>

      <div class="card">
        <p class="product-detail-brand muted-text">
          {{ product.brand }}
        </p>

        <h1 class="page-title">
          {{ product.name }}
        </h1>

        <p class="product-detail-description muted-text">
          {{ product.description }}
        </p>

        <div class="product-detail-price-box">
          <p
            v-if="product.discountPercentage > 0"
            class="product-detail-old-price muted-text"
          >
            € {{ Number(product.price).toFixed(2) }}
          </p>

          <p class="product-detail-price">
            € {{ finalPrice.toFixed(2) }}
          </p>

          <span
            v-if="product.discountPercentage > 0"
            class="tag tag-accent"
          >
            Sconto {{ product.discountPercentage }}%
          </span>
        </div>

        <div class="product-detail-info-grid">
          <div>
            <h2>Categoria</h2>
            <p>{{ product.categoryName || 'Categoria non disponibile' }}</p>
          </div>

          <div>
            <h2>Formato</h2>
            <p>{{ product.unitLabel }}</p>
          </div>

          <div>
            <h2>Disponibilità generale</h2>

            <p v-if="product.isAvailable">
              Disponibile, {{ product.stockQuantity }} pezzi in stock
            </p>

            <p v-else>
              Non disponibile
            </p>
          </div>

          <div>
            <h2>Punto vendita scelto</h2>

            <p v-if="selectedSupermarket && isProductAvailableInSelectedSupermarket">
              Disponibile presso
              <strong>{{ selectedSupermarket.name }}</strong>
            </p>

            <p v-else-if="selectedSupermarket">
              Non disponibile presso
              <strong>{{ selectedSupermarket.name }}</strong>
            </p>

            <p v-else>
              Nessun supermercato selezionato.
            </p>
          </div>
        </div>

        <section class="product-detail-section">
          <h2>Ingredienti</h2>

          <p v-if="product.ingredients">
            {{ product.ingredients }}
          </p>

          <p v-else class="muted-text">
            Ingredienti non indicati.
          </p>
        </section>

        <section class="product-detail-section">
          <h2>Allergeni</h2>

          <div v-if="allergenLabels.length" class="product-detail-tags">
            <span
              v-for="allergen in allergenLabels"
              :key="allergen"
              class="tag tag-accent"
            >
              {{ allergen }}
            </span>
          </div>

          <p v-else class="muted-text">
            Nessun allergene indicato.
          </p>
        </section>

        <section class="product-detail-section">
          <h2>Caratteristiche alimentari</h2>

          <div class="product-detail-tags">
            <span v-if="product.isVegan" class="tag">
              Vegano
            </span>

            <span v-if="product.isVegetarian" class="tag">
              Vegetariano
            </span>

            <span
              v-if="!product.isVegan && !product.isVegetarian"
              class="tag"
            >
              Nessuna indicazione specifica
            </span>
          </div>
        </section>

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
          class="btn product-detail-cart-button"
          :disabled="!product.isAvailable || !isProductAvailableInSelectedSupermarket"
          @click="handleAddToCart"
        >
          Aggiungi al carrello
        </button>

        <p
          v-if="selectedSupermarket && !isProductAvailableInSelectedSupermarket"
          class="muted-text"
        >
          Questo prodotto non può essere aggiunto perché non è disponibile nel supermercato scelto.
        </p>
      </div>
    </section>

    <section v-else class="card">
      <h1 class="page-title">Prodotto non trovato</h1>

      <p class="muted-text">
        Il prodotto richiesto non è presente nel catalogo locale.
      </p>

      <RouterLink :to="catalogLink" class="btn">
        Torna al catalogo
      </RouterLink>
    </section>
  </main>
</template>
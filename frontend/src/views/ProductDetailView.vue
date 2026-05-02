<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { mockProducts } from '../data/mockProducts'
import { mockCategories } from '../data/mockCategories'
import { mockAllergens } from '../data/mockAllergens'
import { mockSupermarkets } from '../data/mockSupermarkets'
import { addToCart } from '../data/cart'

const route = useRoute()

const productId = computed(() => {
  return Number(route.params.id)
})

const product = computed(() => {
  return mockProducts.find((item) => {
    return item.id === productId.value
  })
})

const selectedSupermarketId = computed(() => {
  if (route.query.supermarketId) {
    return Number(route.query.supermarketId)
  }

  const savedSupermarketId = localStorage.getItem('selectedSupermarketId')
  return Number(savedSupermarketId)
})

const selectedSupermarket = computed(() => {
  return mockSupermarkets.find((supermarket) => {
    return supermarket.id === selectedSupermarketId.value
  })
})

const isProductAvailableInSelectedSupermarket = computed(() => {
  if (!product.value || !selectedSupermarket.value) {
    return false
  }

  return product.value.supermarketIds.includes(selectedSupermarket.value.id)
})

const catalogLink = computed(() => {
  if (selectedSupermarket.value) {
    return `/catalog?supermarketId=${selectedSupermarket.value.id}`
  }

  return '/catalog'
})

const categoryName = computed(() => {
  if (!product.value) return ''

  const category = mockCategories.find((item) => {
    return item.id === product.value.categoryId
  })

  return category ? category.name : 'Categoria non disponibile'
})

const allergenLabels = computed(() => {
  if (!product.value || product.value.allergens.length === 0) {
    return []
  }

  return product.value.allergens.map((allergenName) => {
    const allergen = mockAllergens.find((item) => {
      return item.name === allergenName
    })

    return allergen ? allergen.label : allergenName
  })
})

const finalPrice = computed(() => {
  if (!product.value) return 0

  if (product.value.discountPercentage <= 0) {
    return product.value.price
  }

  const discountValue =
    (product.value.price * product.value.discountPercentage) / 100

  return product.value.price - discountValue
})

function handleAddToCart() {
  if (!product.value) {
    return
  }

  addToCart(product.value)
  alert('Prodotto aggiunto al carrello')
}
</script>

<template>
  <main>
    <RouterLink :to="catalogLink" class="back-link">
      Torna al catalogo
    </RouterLink>

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
            € {{ product.price.toFixed(2) }}
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
            <p>{{ categoryName }}</p>
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
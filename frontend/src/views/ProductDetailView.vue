<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { mockProducts } from '../data/mockProducts'
import { mockCategories } from '../data/mockCategories'
import { mockAllergens } from '../data/mockAllergens'

const route = useRoute()
const productId = Number(route.params.id)

const product = computed(() => {
  return mockProducts.find((item) => item.id === productId)
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
</script>

<template>
  <main>
    <RouterLink to="/catalog" class="back-link">
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
            <h2>Disponibilità</h2>
            <p v-if="product.isAvailable">
              Disponibile, {{ product.stockQuantity }} pezzi in stock
            </p>
            <p v-else>
              Non disponibile
            </p>
          </div>

          <div>
            <h2>Supermercati</h2>
            <p>{{ product.supermarketIds.length }} punti vendita</p>
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

        <button type="button" class="btn product-detail-cart-button" disabled>
          Aggiunta al carrello non ancora disponibile
        </button>
      </div>
    </section>

    <section v-else class="card">
      <h1 class="page-title">Prodotto non trovato</h1>

      <p class="muted-text">
        Il prodotto richiesto non è presente nel catalogo locale.
      </p>

      <RouterLink to="/catalog" class="btn">
        Torna al catalogo
      </RouterLink>
    </section>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { addToCart } from '../data/cart'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const productDetailLink = computed(() => {
  const supermarketId = localStorage.getItem('selectedSupermarketId')

  if (supermarketId) {
    return `/catalog/${props.product.id}?supermarketId=${supermarketId}`
  }

  return `/catalog/${props.product.id}`
})

function handleAddToCart() {
  addToCart(props.product)
  alert('Prodotto aggiunto al carrello')
}
</script>

<template>
  <article class="card product-card">
    <div class="product-image-placeholder">
      <span>{{ product.name.charAt(0) }}</span>
    </div>

    <div class="product-card-body">
      <div class="product-card-main">
        <p class="product-brand">{{ product.brand }}</p>

        <h2 class="product-name">
          {{ product.name }}
        </h2>

        <p class="product-description">
          {{ product.description }}
        </p>

        <div class="product-info">
          <span>{{ product.unitLabel }}</span>
        </div>

        <div class="product-tags">
          <span
            v-if="product.discountPercentage > 0"
            class="tag tag-accent"
          >
            -{{ product.discountPercentage }}%
          </span>

          <span v-if="product.isVegan" class="tag">
            Vegano
          </span>

          <span v-else-if="product.isVegetarian" class="tag">
            Vegetariano
          </span>
        </div>
      </div>

      <div class="product-footer">
        <div class="product-price-area">
          <strong class="product-price">
            € {{ product.price.toFixed(2) }}
          </strong>

          <RouterLink :to="productDetailLink" class="product-detail-link">
            Dettaglio
          </RouterLink>
        </div>

        <div class="product-card-actions">
          <span
            v-if="product.isAvailable"
            class="product-availability"
          >
            Disponibile
          </span>

          <span v-else class="product-availability product-unavailable">
            Non disponibile
          </span>

          <button
            type="button"
            class="btn product-add-button"
            :disabled="!product.isAvailable"
            @click="handleAddToCart"
          >
            Aggiungi
          </button>
        </div>
      </div>
    </div>
  </article>
</template>
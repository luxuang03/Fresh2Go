<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
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

const productPrice = computed(() => {
  const finalPrice = props.product.finalPrice

  if (finalPrice !== undefined && finalPrice !== null) {
    return Number(finalPrice)
  }

  const price = Number(props.product.price)
  const discount = Number(props.product.discountPercentage)

  if (!discount) {
    return price
  }

  return price - (price * discount) / 100
})

const hasDiscount = computed(() => {
  return Number(props.product.discountPercentage) > 0
})

function handleAddToCart() {
  if (!props.product.isAvailable) {
    return
  }

  const productToAdd = {
    ...props.product,
    price: productPrice.value,
  }

  addToCart(productToAdd)
  alert('Prodotto aggiunto al carrello')
}
</script>

<template>
  <article
    class="card product-card"
    :class="{ 'product-card-unavailable': !product.isAvailable }"
  >
    <RouterLink :to="productDetailLink" class="product-image-link">
      <div class="product-image-placeholder">
        <img
          v-if="product.imageUrl"
          :src="product.imageUrl"
          :alt="product.name"
        >
        <span v-else>{{ product.name.charAt(0) }}</span>
      </div>
    </RouterLink>

    <div class="product-card-body">
      <div class="product-card-main">
        <p class="product-brand">{{ product.brand }}</p>

        <h2 class="product-name">
          {{ product.name }}
        </h2>

        <div class="product-tags">
          <span
            v-if="hasDiscount"
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
          <span v-if="hasDiscount" class="product-original-price">
            € {{ Number(product.price).toFixed(2) }}
          </span>

          <strong class="product-price">
            € {{ productPrice.toFixed(2) }}
            <span v-if="product.unitLabel" class="product-price-unit">
              / {{ product.unitLabel }}
            </span>
          </strong>
        </div>

        <div class="product-card-actions">
          <button
            class="btn product-add-button"
            :class="{ 'product-add-button-unavailable': !product.isAvailable }"
            :disabled="!product.isAvailable"
            @click="handleAddToCart"
          >
            {{ product.isAvailable ? 'Aggiungi' : 'Esaurito' }}
          </button>
        </div>
      </div>
    </div>
  </article>
</template>
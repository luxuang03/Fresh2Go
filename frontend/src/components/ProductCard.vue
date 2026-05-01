<script setup>
defineProps({
  product: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article class="card product-card">
    <div class="product-image-placeholder">
      <span>{{ product.name.charAt(0) }}</span>
    </div>

    <div class="product-card-content">
      <p class="product-brand">{{ product.brand }}</p>

      <h2 class="product-name">
        {{ product.name }}
      </h2>

      <p class="product-description">
        {{ product.description }}
      </p>

      <div class="product-info">
        <span>{{ product.unitLabel }}</span>
        <span v-if="product.isAvailable">Disponibile</span>
        <span v-else>Non disponibile</span>
      </div>

      <div class="product-tags">
        <span v-if="product.discountPercentage > 0" class="product-tag discount-tag">
          -{{ product.discountPercentage }}%
        </span>

        <span v-if="product.isVegan" class="product-tag">
          Vegano
        </span>

        <span v-else-if="product.isVegetarian" class="product-tag">
          Vegetariano
        </span>
      </div>

      <div class="product-footer">
        <strong class="product-price">
          € {{ product.price.toFixed(2) }}
        </strong>

        <router-link :to="`/catalog/${product.id}`" class="btn product-link">
          Dettaglio
        </router-link>
      </div>
    </div>
  </article>
</template>
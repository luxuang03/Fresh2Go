<script setup>
import ProductCard from '../components/ProductCard.vue'
import { mockProducts } from '../data/mockProducts'
</script>

<template>
  <main>
    <h1 class="page-title">Catalogo</h1>

    <p class="page-description">
      Sfoglia i prodotti disponibili nei supermercati Fresh2Go. In questa fase i dati
      sono caricati da un catalogo locale temporaneo.
    </p>

    <section class="catalog-summary">
      <p>
        Prodotti caricati:
        <strong>{{ mockProducts.length }}</strong>
      </p>
    </section>

    <section class="products-grid">
      <ProductCard
        v-for="product in mockProducts"
        :key="product.id"
        :product="product"
      />
    </section>
  </main>
</template>
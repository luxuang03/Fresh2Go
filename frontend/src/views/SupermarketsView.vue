<script setup>
import { mockSupermarkets } from '../data/mockSupermarkets'
</script>

<template>
  <main>
    <h1 class="page-title">Supermercati</h1>

    <p class="page-description">
      Scegli il punto vendita Fresh2Go da cui vuoi ordinare la spesa.
    </p>

    <section class="supermarket-grid">
      <article
        v-for="supermarket in mockSupermarkets"
        :key="supermarket.id"
        class="card supermarket-card"
      >
        <h2>{{ supermarket.name }}</h2>
        <p>{{ supermarket.address }}, {{ supermarket.city }}</p>
        <p>
          Orario:
          {{ supermarket.openingTime }} - {{ supermarket.closingTime }}
        </p>
      </article>
    </section>
  </main>
</template>

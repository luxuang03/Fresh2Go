<script setup>
import { RouterLink } from 'vue-router'
import { cart } from '../data/cart'
</script>

<template>
  <main>
    <h1 class="page-title">Carrello</h1>

    <p class="page-description">
      Qui puoi vedere i prodotti che hai aggiunto al carrello.
    </p>

    <section v-if="cart.items.length === 0" class="card cart-empty">
      <h2>Il carrello è vuoto</h2>

      <p class="muted-text">
        Aggiungi qualche prodotto dal catalogo per iniziare la tua spesa.
      </p>

      <RouterLink to="/catalog" class="btn">
        Vai al catalogo
      </RouterLink>
    </section>

    <section v-else class="cart-list">
      <article
        v-for="item in cart.items"
        :key="item.id"
        class="card cart-item"
      >
        <div class="cart-item-image">
          <span>{{ item.name.charAt(0) }}</span>
        </div>

        <div class="cart-item-info">
          <h2>{{ item.name }}</h2>

          <p class="muted-text">
            {{ item.brand }}
          </p>

          <p>
            Prezzo unitario: € {{ item.price.toFixed(2) }}
          </p>

          <p>
            Quantità: {{ item.quantity }}
          </p>
        </div>
      </article>

      <div class="cart-actions">
        <RouterLink to="/catalog" class="btn btn-secondary">
          Continua la spesa
        </RouterLink>

        <RouterLink to="/cart/checkout" class="btn">
          Vai al checkout
        </RouterLink>
      </div>
    </section>
  </main>
</template>
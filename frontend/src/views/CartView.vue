<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import {
  cart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  getItemSubtotal,
  getCartTotal,
} from '../data/cart'

const cartTotal = computed(() => {
  return getCartTotal()
})
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

    <section v-else class="cart-page">
      <div class="cart-list">
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
              Subtotale: € {{ getItemSubtotal(item).toFixed(2) }}
            </p>
          </div>

          <div class="cart-item-controls">
            <div class="quantity-controls">
              <button
                type="button"
                class="quantity-button"
                @click="decreaseQuantity(item.id)"
              >
                -
              </button>

              <span>{{ item.quantity }}</span>

              <button
                type="button"
                class="quantity-button"
                @click="increaseQuantity(item.id)"
              >
                +
              </button>
            </div>

            <button
              type="button"
              class="remove-button"
              @click="removeFromCart(item.id)"
            >
              Rimuovi
            </button>
          </div>
        </article>
      </div>

      <aside class="card cart-summary">
        <h2>Riepilogo</h2>

        <p>
          Totale prodotti: {{ cart.items.length }}
        </p>

        <p class="cart-total">
          Totale: € {{ cartTotal.toFixed(2) }}
        </p>

        <div class="cart-actions">
          <RouterLink to="/catalog" class="btn btn-secondary">
            Continua la spesa
          </RouterLink>

          <RouterLink to="/cart/checkout" class="btn">
            Vai al checkout
          </RouterLink>
        </div>
      </aside>
    </section>
  </main>
</template>
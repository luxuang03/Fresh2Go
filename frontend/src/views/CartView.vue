<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import {
  cart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  getItemSubtotal,
  getCartTotal,
  getCartCount,
} from '../data/cart'
import { showNotification } from '../services/notification'

const cartTotal = computed(() => {
  return getCartTotal()
})

const cartCount = computed(() => {
  return getCartCount()
})

function formatPrice(value) {
  return Number(value).toFixed(2).replace('.', ',')
}

function handleIncreaseQuantity(item) {
  increaseQuantity(item.id)
}

function handleDecreaseQuantity(item) {
  if (item.quantity === 1) {
    removeFromCart(item.id)
    showNotification('Prodotto rimosso dal carrello', 'info')
    return
  }

  decreaseQuantity(item.id)
}

function handleRemoveItem(item) {
  removeFromCart(item.id)
  showNotification('Prodotto rimosso dal carrello', 'info')
}

function handleClearCart() {
  clearCart()
  showNotification('Carrello svuotato', 'warning')
}
</script>

<template>
  <main>
    <h1 class="page-title">Carrello</h1>

    <p class="page-description">
      Controlla i prodotti aggiunti prima di procedere al checkout.
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
      <section class="card cart-products-box">
        <div class="cart-section-header">
          <div>
            <h2>Prodotti nel carrello</h2>
          </div>

          <button
            type="button"
            class="cart-clear-button"
            @click="handleClearCart"
          >
            Svuota carrello
          </button>
        </div>

        <div class="cart-list">
          <article
            v-for="item in cart.items"
            :key="item.id"
            class="cart-item"
          >
            <div class="cart-item-image">
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.name"
              />

              <span v-else>{{ item.name.charAt(0) }}</span>
            </div>

            <div class="cart-item-info">
              <h3>{{ item.name }}</h3>

              <p v-if="item.brand" class="muted-text cart-item-brand">
                {{ item.brand }}
              </p>

              <p class="cart-item-price">
                <span class="cart-item-price-value">
                  € {{ formatPrice(item.price) }}
                </span>

                <span v-if="item.unitLabel" class="cart-item-unit">
                  / {{ item.unitLabel }}
                </span>
              </p>
            </div>

            <div class="cart-item-actions">
              <div class="cart-item-quantity">
                <span class="cart-small-label">Quantità</span>

                <div class="quantity-controls">
                  <button
                    type="button"
                    class="quantity-button"
                    @click="handleDecreaseQuantity(item)"
                  >
                    -
                  </button>

                  <strong>{{ item.quantity }}</strong>

                  <button
                    type="button"
                    class="quantity-button"
                    @click="handleIncreaseQuantity(item)"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                class="remove-button"
                @click="handleRemoveItem(item)"
              >
                Rimuovi
              </button>
            </div>
          </article>
        </div>
      </section>

      <aside class="summary-box">
        <div class="summary-main">
          <span class="muted-text">Riepilogo ordine</span>

          <strong>
            € {{ formatPrice(cartTotal) }}
          </strong>
        </div>

        <div class="summary-details">
          <div class="summary-row">
            <span>Prodotti diversi</span>
            <strong>{{ cart.items.length }}</strong>
          </div>

          <div class="summary-row">
            <span>Totale pezzi</span>
            <strong>{{ cartCount }}</strong>
          </div>

          <div
            v-for="item in cart.items"
            :key="item.id"
            class="summary-row summary-product"
          >
            <span>
              {{ item.name }}
              <small>x{{ item.quantity }}</small>
            </span>

            <strong>
              € {{ formatPrice(getItemSubtotal(item)) }}
            </strong>
          </div>
        </div>

        <div class="summary-actions">
          <RouterLink to="/catalog" class="btn">
            Continua la spesa
          </RouterLink>

          <RouterLink to="/cart/checkout" class="btn btn-secondary">
            Vai al checkout
          </RouterLink>
        </div>
      </aside>
    </section>
  </main>
</template>
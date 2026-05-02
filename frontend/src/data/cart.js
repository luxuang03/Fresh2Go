import { reactive } from 'vue'

export const cart = reactive({
  items: [],
})

export function addToCart(product) {
  const existingItem = cart.items.find((item) => item.id === product.id)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.items.push({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
  }
}

export function getCartCount() {
  return cart.items.reduce((total, item) => total + item.quantity, 0)
}
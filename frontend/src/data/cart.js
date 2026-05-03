import { reactive } from 'vue'

const CART_STORAGE_KEY = 'fresh2go-cart'

function loadCartItems() {
  const savedCart = localStorage.getItem(CART_STORAGE_KEY)

  if (!savedCart) {
    return []
  }

  try {
    return JSON.parse(savedCart)
  } catch (error) {
    return []
  }
}

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart.items))
}

export const cart = reactive({
  items: loadCartItems(),
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

  saveCart()
}

export function increaseQuantity(productId) {
  const item = cart.items.find((cartItem) => {
    return cartItem.id === productId
  })

  if (item) {
    item.quantity += 1
    saveCart()
  }
}

export function decreaseQuantity(productId) {
  const item = cart.items.find((cartItem) => {
    return cartItem.id === productId
  })

  if (!item) {
    return
  }

  if (item.quantity > 1) {
    item.quantity -= 1
    saveCart()
  } else {
    removeFromCart(productId)
  }
}

export function removeFromCart(productId) {
  const itemIndex = cart.items.findIndex((cartItem) => {
    return cartItem.id === productId
  })

  if (itemIndex !== -1) {
    cart.items.splice(itemIndex, 1)
    saveCart()
  }
}

export function getItemSubtotal(item) {
  return item.price * item.quantity
}

export function getCartTotal() {
  return cart.items.reduce((total, item) => {
    return total + getItemSubtotal(item)
  }, 0)
}

export function getCartCount() {
  return cart.items.reduce((total, item) => total + item.quantity, 0)
}

export function clearCart() {
  cart.items.splice(0, cart.items.length)
  saveCart()
}
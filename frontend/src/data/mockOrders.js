const ORDERS_STORAGE_KEY = 'fresh2go-orders'

function loadOrders() {
  const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY)

  if (!savedOrders) {
    return []
  }

  try {
    return JSON.parse(savedOrders)
  } catch (error) {
    return []
  }
}

function saveOrders(orders) {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
}

export function getOrders() {
  return loadOrders()
}

export function addOrder(order) {
  const orders = loadOrders()

  orders.unshift(order)

  saveOrders(orders)
}

export function getOrderById(orderId) {
  const orders = loadOrders()

  return orders.find((order) => {
    return String(order.id) === String(orderId)
  })
}
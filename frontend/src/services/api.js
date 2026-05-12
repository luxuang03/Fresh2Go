async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message = data?.message || 'Errore nella richiesta al server'
    throw new Error(message)
  }

  return data
}

function getList(data, key) {
  if (Array.isArray(data)) {
    return data
  }

  return data?.[key] || []
}

function buildQueryString(filters) {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value === '' || value === false || value === null || value === undefined) {
      return
    }

    if (Array.isArray(value)) {
      if (value.length > 0) {
        params.append(key, value.join(','))
      }

      return
    }

    params.append(key, value)
  })

  const queryString = params.toString()

  return queryString ? `?${queryString}` : ''
}

export function getApi(url) {
  return apiRequest(url)
}

export function postApi(url, body) {
  return apiRequest(url, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function putApi(url, body) {
  return apiRequest(url, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export function deleteApi(url) {
  return apiRequest(url, {
    method: 'DELETE',
  })
}

export async function getProducts(filters = {}) {
  const queryString = buildQueryString(filters)
  const data = await getApi(`/api/products${queryString}`)

  return getList(data, 'products')
}

export async function getProductById(id) {
  return getApi(`/api/products/${id}`)
}

export async function getCategories() {
  const data = await getApi('/api/categories')

  return getList(data, 'categories')
}

export async function getAllergens() {
  const data = await getApi('/api/allergens')

  return getList(data, 'allergens')
}

export async function getSupermarkets() {
  const data = await getApi('/api/supermarkets')

  return getList(data, 'supermarkets')
}

export async function getRecipes(filters = {}) {
  const queryString = buildQueryString(filters)
  const data = await getApi(`/api/recipes${queryString}`)

  return getList(data, 'recipes')
}

export async function getRecipeById(id) {
  return getApi(`/api/recipes/${id}`)
}

export async function getCurrentUser() {
  return getApi('/api/auth/me')
}

export async function loginRequest(credentials) {
  return postApi('/api/auth/login', credentials)
}

export async function registerRequest(userData) {
  return postApi('/api/auth/register', userData)
}

export async function logoutRequest() {
  return postApi('/api/auth/logout', {})
}

export async function getPickupSlots(filters = {}) {
  const queryString = buildQueryString(filters)
  const data = await getApi(`/api/pickup-slots${queryString}`)

  return getList(data, 'pickupSlots')
}

export async function createOrder(orderData) {
  return postApi('/api/orders', orderData)
}

export async function getMyOrders() {
  const data = await getApi('/api/orders/me')

  return getList(data, 'orders')
}

export async function getOrderDetail(id) {
  return getApi(`/api/orders/${id}`)
}
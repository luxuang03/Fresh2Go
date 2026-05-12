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
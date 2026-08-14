// Shared fetch wrapper for every storefront API call.
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8011'

/** Drops empty params so `?category=` never reaches the backend. */
function buildQuery(params = {}) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      search.append(key, value)
    }
  })
  const query = search.toString()
  return query ? `?${query}` : ''
}

/**
 * GET a JSON endpoint. Returns null for an empty body (the backend answers 204
 * rather than an empty array on several list endpoints).
 */
export async function get(path, params) {
  const res = await fetch(`${BASE_URL}${path}${buildQuery(params)}`)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

/** POST a JSON body. Resolves to the parsed body, or the raw text for plain replies. */
export async function post(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const text = await res.text()
  if (!res.ok) throw new Error(text || `Request failed: ${res.status}`)
  try {
    return text ? JSON.parse(text) : null
  } catch {
    return text
  }
}

/** Always hands back an array, whatever the endpoint returned. */
export const asArray = (value) => (Array.isArray(value) ? value : [])

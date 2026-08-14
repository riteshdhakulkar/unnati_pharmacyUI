// Country lookup — REST Countries v5 API (https://restcountries.com).
const BASE_URL = 'https://api.restcountries.com/countries/v5'
const API_KEY = import.meta.env.VITE_RESTCOUNTRIES_KEY || 'rc_live_demo'

/** Used when the API is unreachable, rate-limited, or running on the demo key. */
export const FALLBACK_COUNTRIES = [
  'India',
  'Australia',
  'United States',
  'United Kingdom',
  'Canada',
  'New Zealand',
  'Ireland',
  'Singapore',
  'United Arab Emirates',
  'South Africa',
  'Germany',
  'France',
  'Netherlands',
  'Other',
]

async function request(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  })
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  const json = await res.json()
  return Array.isArray(json?.data?.objects) ? json.data.objects : []
}

/** Maps a v5 country object down to what the form needs. */
const toOption = (c) => ({
  name: c?.names?.common || c?.names?.official || '',
  code: c?.codes?.alpha_2 || '',
})

/**
 * All countries, sorted by common name.
 * Note: the `rc_live_demo` key returns a single sample country, so callers
 * should fall back to FALLBACK_COUNTRIES when the list comes back too short.
 */
export async function getCountries() {
  const objects = await request('/all')
  return objects
    .map(toOption)
    .filter((c) => c.name)
    .sort((a, b) => a.name.localeCompare(b.name))
}

/** A single country by ISO alpha-2 code, e.g. 'ca'. */
export async function getCountryByCode(alpha2) {
  const objects = await request(
    `/codes.alpha_2/${encodeURIComponent(String(alpha2).toLowerCase())}`,
  )
  return objects.length ? toOption(objects[0]) : null
}

// Storefront product API — talks to the Spring Boot backend's public endpoints.
import { get, asArray } from './http'

/**
 * Turns a backend Product into the shape the storefront renders.
 *
 * The entity still carries fields from the project it grew out of (`booktitle`,
 * `isbn`, `author`…), so this is the single place that knows which legacy column
 * backs which pharmacy concept. Components only ever see the normalised object.
 */
export function normalizeProduct(product) {
  if (!product) return null

  const images = [product.imagePath, product.imagePath2, product.imagePath3].filter(Boolean)

  return {
    id: product.id,
    name: product.name || product.booktitle || 'Product',
    genericName: product.salt || '',
    strength: product.strength || '',
    dosageForm: product.dosageForm || '',
    packSize: product.packSize || '',
    packing: product.packing || '',
    brandLabel: product.brand || '',
    categoryLabel: product.maincatname || '',
    subcategoryLabel: product.subcatname || '',
    tagName: product.isbn || '',
    description: product.description || '',
    image: images[0] || null,
    images,
    clinicalSource: product.clinicalSource || '',
    tempTracked: formatTemperature(product.tempTracked),
    prescriptionRequired: product.prescriptionRequired === true,
    stock: product.stock ?? null,
    howToUse: product.howToUse || '',
    howItWorks: product.howItWorks || '',
    sideEffectsDescription: product.sideEffectsDescription || '',
    tips: product.tips || '',
    indications: asArray(product.indications),
    benefits: asArray(product.benefits),
    commonSideEffects: asArray(product.commonSideEffects),
    severeSideEffects: asArray(product.severeSideEffects),
    precautions: asArray(product.precautions).map((p) => ({
      label: p?.label || p?.title || '',
      status: p?.status || '',
      text: p?.text || p?.description || '',
    })),
    pillOptions: asArray(product.pillOptions),
    price: priceInfo(product),
    /** Composite label used on the shop card's "Unit Dosage" row. */
    unitDosage:
      [product.dosageForm, product.strength].filter(Boolean).join(' ') || product.packSize || '',
  }
}

/** Admin stores a bare number ("30"); the storefront shows the full sentence. */
function formatTemperature(value) {
  if (value === null || value === undefined || String(value).trim() === '') return ''
  const raw = String(value).trim()
  return /^-?\d+(\.\d+)?$/.test(raw) ? `Store below ${raw}°C` : raw
}

/**
 * Normalises pricing for display.
 * Returns { min, max, options, label } where label is ready to render.
 */
export function priceInfo(product) {
  const options = asArray(product?.pillOptions)
  const prices = options.map((o) => o?.price).filter((n) => n !== null && n !== undefined)

  if (prices.length) {
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    return {
      min,
      max,
      options,
      label: min === max ? money(min) : `${money(min)} – ${money(max)}`,
    }
  }

  const price = product?.descprice
  return {
    min: price ?? null,
    max: price ?? null,
    options,
    label: price != null ? money(price) : '',
  }
}

const money = (n) => `$${Number(n).toFixed(2)}`

/**
 * Products from the catalogue. Every filter is optional and applied server-side.
 *
 * @param {object} [filters]
 * @param {string} [filters.category]     main category name
 * @param {string} [filters.subcategory]  sub category name
 * @param {string} [filters.salt]         active ingredient (contains)
 * @param {string} [filters.manufacturer] brand (contains)
 * @param {string} [filters.dosageForm]   Tablet / Injection / …
 * @param {string} [filters.search]       free text
 */
export async function getProducts(filters = {}) {
  const data = await get('/public/allbooks', {
    maincatname: filters.category,
    subcatname: filters.subcategory,
    salt: filters.salt,
    brand: filters.manufacturer,
    dosageForm: filters.dosageForm,
    search: filters.search,
  })
  return asArray(data).map(normalizeProduct)
}

/** A single product by id, or null when it no longer exists. */
export async function getProductById(id) {
  const data = await get('/public/singleBook', { bid: id })
  // The endpoint returns an Optional, which serialises to {} when empty.
  return data && data.id ? normalizeProduct(data) : null
}

/** Best display name for a raw (un-normalised) product. */
export function productName(product) {
  return product?.name || product?.booktitle || 'Product'
}

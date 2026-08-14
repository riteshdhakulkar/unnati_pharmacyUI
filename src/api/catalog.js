// Browse taxonomy — categories, salts and manufacturers.
//
// These lists used to be hard-coded in the navbar and footer. They now come from
// the backend (seeded on first startup from exactly those lists), with the original
// arrays kept below as an offline fallback so the navigation never renders empty.
import { get, asArray } from './http'

export const FALLBACK_CATEGORIES = [
  'Anti-Cancer',
  'Anti Viral',
  'Anti Diabetic',
  'Vaccines',
  'Antibiotic',
  'Erectile Dysfunction',
  'Nasal Spray',
  'Tablets & Capsules',
  'Skin Care',
  'Anti HIV',
  'Ayurvedic Medicines',
]

export const FALLBACK_SALTS = [
  'Gefitinib', 'Daclatasvir',
  'Erlotinib', 'Bortezomib',
  'Sorafenib', 'Orlistat',
  'Sofosbuvir', 'Tenofovir Disoproxil',
  'Abiraterone Acetate', 'Tenofovir Alafenamide',
  'Imatinib Mesylate', 'Sofosbuvir / Daclatasvir',
  'Epirubicin', 'Voriconazole',
  'Everolimus', 'Lapatinib',
  'Sofosbuvir / Ledipasvir', 'Adalimumab',
  'Sofosbuvir / Velpatasvir', 'Pomalidomide',
]

export const FALLBACK_MANUFACTURERS = [
  'Cipla', 'Abbott India',
  'Dr. Reddy', 'Cadila',
  'Emcure', 'Biocon',
  'Glenmark', 'Glaxo Smith Kline',
  'Hetero Drugs', 'Leeford',
  'Intas', 'Aprazer',
  'Mylan Pharma', 'AstraZeneca',
  'Natco Pharma', 'Pfizer Inc.',
  'Sun Pharmaceutical', 'Roche',
  'Zydus', 'Strides',
]

/** Resolves to `fallback` on any network/`204` outcome, so callers never branch. */
async function listOrFallback(request, fallback) {
  try {
    const data = await request()
    return data.length ? data : fallback
  } catch {
    return fallback
  }
}

/** Main category names, e.g. "Anti-Cancer". */
export function getCategories() {
  return listOrFallback(async () => {
    const data = await get('/public/allCategories')
    return asArray(data)
      .map((c) => c?.maincatname)
      .filter(Boolean)
  }, FALLBACK_CATEGORIES)
}

/** Sub-category names under one main category. */
export async function getSubcategories(category) {
  if (!category) return []
  try {
    const data = await get('/public/allsubcatname', { mainc: category })
    return asArray(data)
      .map((s) => s?.subcatname)
      .filter(Boolean)
  } catch {
    return []
  }
}

/** Active-ingredient names for the navbar's "By Salt" column. */
export function getSalts() {
  return listOrFallback(async () => asArray(await get('/public/allsalts')), FALLBACK_SALTS)
}

/** Brand names for the navbar's "By Manufacturer" column. */
export function getManufacturers() {
  return listOrFallback(
    async () => asArray(await get('/public/allmanufacturers')),
    FALLBACK_MANUFACTURERS,
  )
}

/** Categories, salts and manufacturers in one go — what the navbar needs. */
export async function getBrowseTaxonomy() {
  const [categories, salts, manufacturers] = await Promise.all([
    getCategories(),
    getSalts(),
    getManufacturers(),
  ])
  return { categories, salts, manufacturers }
}

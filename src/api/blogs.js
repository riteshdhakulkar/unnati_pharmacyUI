// Blog / "Latest News" API.
import { get, asArray } from './http'

const DATE_FORMAT = { day: 'numeric', month: 'long', year: 'numeric' }

/** Rough reading time from the article body — the backend does not store one. */
function readTime(html) {
  const words = String(html || '')
    .replace(/<[^>]*>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
  return `${Math.max(1, Math.round(words / 200))} MINS READ`
}

/** Plain-text excerpt for cards, so stored markup never leaks into the layout. */
function excerpt(html, length = 220) {
  const text = String(html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return text.length > length ? `${text.slice(0, length).trimEnd()}…` : text
}

function normalizeBlog(blog) {
  return {
    id: blog.id,
    title: blog.title || 'Untitled',
    /** ISO date from the backend; `date` is the display string. */
    isoDate: blog.date || null,
    date: blog.date
      ? new Date(blog.date).toLocaleDateString('en-GB', DATE_FORMAT)
      : '',
    description: blog.description || '',
    excerpt: excerpt(blog.description),
    readTime: readTime(blog.description),
    image: blog.imageUrl || null,
    link: blog.articleLink || '',
    author: 'Unnati Pharmax Team',
  }
}

/** Every published article, newest first. */
export async function getBlogs() {
  const data = await get('/public/allBlogs')
  return asArray(data)
    .map(normalizeBlog)
    .sort((a, b) => new Date(b.isoDate || 0) - new Date(a.isoDate || 0))
}

/** A single article by id, or null when it is gone. */
export async function getBlogById(id) {
  const data = await get(`/public/blog/${id}`)
  return data && data.id ? normalizeBlog(data) : null
}

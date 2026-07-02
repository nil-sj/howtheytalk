import AdminBackButton from '../components/AdminBackButton'
import { useState, useEffect } from 'react'

const DRUPAL_BASE = import.meta.env.VITE_DRUPAL_URL || 'http://192.168.1.157:9022'
const ADMIN_SECRET = 'talknotes-admin-2026'

async function fetchCategories() {
  const res = await fetch(`${DRUPAL_BASE}/jsonapi/taxonomy_term/main_categories?sort=weight&page[limit]=50`, {
    headers: { 'Accept': 'application/vnd.api+json' }
  })
  const data = await res.json()
  return data.data || []
}

async function countEntriesForCategory(categoryId) {
  const res = await fetch(
    `${DRUPAL_BASE}/jsonapi/node/language_entry?filter[status]=1&filter[field_main_category.id]=${categoryId}&page[limit]=1`,
    { headers: { 'Accept': 'application/vnd.api+json' } }
  )
  const data = await res.json()
  // Use meta.count if available, otherwise fetch all and count
  if (data.meta?.count !== undefined) return data.meta.count
  // fallback: count all pages
  let total = 0
  let offset = 0
  while (true) {
    const r = await fetch(
      `${DRUPAL_BASE}/jsonapi/node/language_entry?filter[status]=1&sort=changed,drupal_internal__nid&filter[field_main_category.id]=${categoryId}&page[limit]=50&page[offset]=${offset}&fields[node--language_entry]=title`,
      { headers: { 'Accept': 'application/vnd.api+json' } }
    )
    const d = await r.json()
    const items = d.data || []
    total += items.length
    if (items.length < 50) break
    offset += 50
  }
  return total
}

async function fetchUsageDiffCount() {
  let total = 0, offset = 0
  while (true) {
    const res = await fetch(
      `${DRUPAL_BASE}/jsonapi/node/usage_difference?filter[status]=1&sort=changed,drupal_internal__nid&page[limit]=50&page[offset]=${offset}&fields[node--usage_difference]=title`,
      { headers: { 'Accept': 'application/vnd.api+json' } }
    )
    const data = await res.json()
    if (data.meta?.count !== undefined) return data.meta.count
    const items = data.data || []
    total += items.length
    if (items.length < 50) break
    offset += 50
  }
  return total
}

const COLORS = [
  '#2d6a4f', '#b5621e', '#6B46C1', '#0ea5e9', '#e07b39',
  '#40916c', '#e74c3c', '#f4a261', '#74c69d', '#1b4332',
  '#52b788', '#0284c7', '#9333ea', '#d97706', '#059669',
]

export default function AdminCategoryMetrics() {
  const [categoryData, setCategoryData] = useState([])
  const [usageCount, setUsageCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)

      // 1. Fetch all categories
      setProgress('Loading categories...')
      const cats = await fetchCategories()

      // 2. Count entries per category (sequentially to avoid rate limiting)
      const results = []
      for (let i = 0; i < cats.length; i++) {
        const cat = cats[i]
        const name = cat.attributes.name
        if (name === 'Usage Difference') continue // skip — handled separately
        setProgress(`Counting entries for "${name}"...`)
        const count = await countEntriesForCategory(cat.id)
        if (count > 0) results.push({ name, count, color: COLORS[i % COLORS.length] })
      }

      // 3. Sort by count descending
      results.sort((a, b) => b.count - a.count)
      setCategoryData(results)

      // 4. Usage diffs
      setProgress('Counting usage differences...')
      const udCount = await fetchUsageDiffCount()
      setUsageCount(udCount)

      setLoading(false)
    }
    load()
  }, [])

  const total = categoryData.reduce((s, c) => s + c.count, 0)
  const maxCount = Math.max(...categoryData.map(c => c.count), usageCount, 1)

  return (
    <div className="admin-page">
      <AdminBackButton />
      <div className="admin-page-header">
        <h1>Category metrics</h1>
        {!loading && (
          <span className="admin-stat-label">
            {total} entries · {categoryData.length} categories · {usageCount} usage differences
          </span>
        )}
      </div>

      {loading && (
        <div className="admin-loading">
          <p>{progress}</p>
          <p style={{fontSize:'0.8rem', color:'var(--ink-faint)', marginTop:'0.5rem'}}>
            Counting entries per category — this may take a few seconds...
          </p>
        </div>
      )}

      {!loading && (
        <div className="admin-panel">
          <div className="admin-panel-header">
            <h2>Content by category</h2>
            <span className="admin-stat-label">{total} entries · {usageCount} usage differences</span>
          </div>
          <div className="admin-catmetrics-chart">
            {categoryData.map((cat, i) => (
              <div key={i} className="admin-catmetrics-row">
                <div className="admin-catmetrics-label" title={cat.name}>{cat.name}</div>
                <div className="admin-catmetrics-bar-wrap">
                  <div className="admin-catmetrics-bar" style={{ width: `${Math.max((cat.count / maxCount) * 100, 2)}%`, background: cat.color }} />
                  <span className="admin-catmetrics-count">{cat.count}</span>
                </div>
              </div>
            ))}
            <div className="admin-catmetrics-divider" />
            <div className="admin-catmetrics-row">
              <div className="admin-catmetrics-label" title="Usage Differences">Usage Differences</div>
              <div className="admin-catmetrics-bar-wrap">
                <div className="admin-catmetrics-bar" style={{ width: `${Math.max((usageCount / maxCount) * 100, 2)}%`, background: '#6B46C1' }} />
                <span className="admin-catmetrics-count">{usageCount}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

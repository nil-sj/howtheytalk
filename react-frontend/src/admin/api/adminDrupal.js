import { getToken } from './auth'

const DRUPAL_BASE = import.meta.env.VITE_DRUPAL_URL || 'http://192.168.1.157:9022'
const ADMIN_SECRET = 'talknotes-admin-2026'

function adminHeaders() {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Admin-Secret': ADMIN_SECRET,
  }
}

async function countNodes(type, extraFilter = '') {
  // Use the custom endpoint which can access unpublished nodes
  const res = await fetch(`${DRUPAL_BASE}/api/node-counts?type=${type}${extraFilter}`, {
    headers: { 'X-Admin-Secret': ADMIN_SECRET }
  })
  if (res.ok) {
    const data = await res.json()
    return data.count || 0
  }
  // Fallback: count via JSON:API (published only)
  let total = 0
  let offset = 0
  while (true) {
    const r = await fetch(`${DRUPAL_BASE}/jsonapi/node/${type}?page[limit]=50&page[offset]=${offset}&fields[node--${type}]=title&filter[status]=1`, {
      headers: { 'Accept': 'application/vnd.api+json' }
    })
    const d = await r.json()
    const items = d.data || []
    total += items.length
    if (items.length < 50) break
    offset += 50
  }
  return total
}

export async function getAdminStats() {
  // Use custom endpoint for accurate counts including drafts
  const res = await fetch(`${DRUPAL_BASE}/api/admin-stats`, {
    headers: { 'X-Admin-Secret': ADMIN_SECRET }
  })
  if (res.ok) {
    return res.json()
  }
  // Fallback
  const [published, diffs, articles] = await Promise.all([
    countNodes('language_entry'),
    countNodes('usage_difference'),
    countNodes('article'),
  ])
  return { publishedEntries: published, draftEntries: '?', usageDifferences: diffs, articles }
}

export async function getRecentDrafts() {
  const res = await fetch(`${DRUPAL_BASE}/api/recent-drafts`, {
    headers: { 'X-Admin-Secret': ADMIN_SECRET }
  })
  if (res.ok) {
    const data = await res.json()
    return data.drafts || []
  }
  return []
}

export async function getAdminEntries({ page = 0, status = 'all' } = {}) {
  const params = new URLSearchParams({
    'page[limit]': 20,
    'page[offset]': page * 20,
    'sort': '-changed',
    'fields[node--language_entry]': 'title,status,moderation_state,created,changed,field_short_meaning,drupal_internal__nid,path',
  })
  if (status === 'published') params.set('filter[status]', '1')
  const res = await fetch(`${DRUPAL_BASE}/jsonapi/node/language_entry?${params}`, {
    headers: { 'Accept': 'application/vnd.api+json' }
  })
  return res.json()
}

export async function getContactSubmissions() {
  const res = await fetch(`${DRUPAL_BASE}/api/contact-submissions`, {
    headers: { 'Accept': 'application/json', 'X-Admin-Secret': ADMIN_SECRET }
  })
  if (!res.ok) throw new Error('Failed to load submissions')
  const data = await res.json()
  return data.submissions || []
}

export async function createDraftEntry(data) {
  const res = await fetch(`${DRUPAL_BASE}/api/create-entry`, {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify({
      title:                data.title,
      category_id:          data.category_id || '',
      short_meaning:        data.short_meaning || '',
      detailed_explanation: data.detailed_explanation || '',
      usage_examples:       data.usage_examples || '',
      notes:                data.notes || '',
      ai_draft:             data.ai_draft || '',
    })
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to create entry')
  }
  return res.json()
}

export async function getCategories() {
  const res = await fetch(`${DRUPAL_BASE}/jsonapi/taxonomy_term/main_categories?sort=weight&page[limit]=50`, {
    headers: { 'Accept': 'application/vnd.api+json' }
  })
  const data = await res.json()
  return data.data || []
}

export async function updateEntry(nid, data) {
  const res = await fetch(`${DRUPAL_BASE}/api/update-entry/${nid}`, {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to update entry')
  }
  return res.json()
}

export async function getDraftEntry(nid) {
  const res = await fetch(`${DRUPAL_BASE}/api/get-entry/${nid}`, {
    headers: { 'X-Admin-Secret': ADMIN_SECRET }
  })
  if (!res.ok) throw new Error('Entry not found')
  return res.json()
}

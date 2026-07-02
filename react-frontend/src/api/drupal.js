import axios from 'axios'

const DRUPAL_BASE = import.meta.env.VITE_DRUPAL_URL || 'http://192.168.1.157:9022'

const api = axios.create({
  baseURL: DRUPAL_BASE,
  headers: { 'Accept': 'application/vnd.api+json' }
})

export async function getEntries({ search = '', category = '', page = 0 } = {}) {
  const params = {
    'filter[status]': 1,
    'sort': '-created',
    'page[limit]': 24,
    'page[offset]': page * 24,
    'include': 'field_main_category,field_tags',
  }
  if (search) { params['filter[title][operator]'] = 'CONTAINS'; params['filter[title][value]'] = search; }
  if (category) params['filter[field_main_category.id]'] = category
  const res = await api.get('/jsonapi/node/language_entry', { params })
  const data = res.data
  data._hasNextPage = (data.data || []).length === 24
  data._page = page
  return data
}

export async function getEntry(slug) {
  // Convert slug to title for searching
  // slug: "let-me-know-if-you-need-anything" -> search for it
  const searchTerm = slug.replace(/-/g, ' ')

  const res = await api.get('/jsonapi/node/language_entry', {
    params: {
      'filter[status]': 1,
      'filter[title][operator]': 'CONTAINS',
      'filter[title][value]': searchTerm.split(' ').slice(0, 3).join(' '),
      'page[limit]': 10,
      'include': 'field_main_category,field_tags',
    }
  })

  const entries = res.data.data || []
  const included = res.data.included || []

  // Find exact match by path alias
  const match = entries.find(e => e.attributes.path?.alias === `/entries/${slug}`)
  if (match) {
    match._included = included
    return match
  }

  // If not found by title search, try fetching all pages
  // Must use sort=changed,drupal_internal__nid to avoid pagination skipping bug
  let offset = 0
  while (true) {
    const fallback = await api.get('/jsonapi/node/language_entry', {
      params: {
        'filter[status]': 1,
        'sort': 'changed,drupal_internal__nid',
        'page[limit]': 50,
        'page[offset]': offset,
        'include': 'field_main_category,field_tags',
      }
    })
    const batch = fallback.data.data || []
    const found = batch.find(e => e.attributes.path?.alias === `/entries/${slug}`)
    if (found) {
      found._included = fallback.data.included || []
      return found
    }
    if (batch.length < 50) break
    offset += 50
  }

  return null
}

export async function getCategories() {
  const res = await api.get('/jsonapi/taxonomy_term/main_categories', {
    params: {
      'sort': 'weight',
      'page[limit]': 50,
      'fields[taxonomy_term--main_categories]': 'name,field_short_definition,field_when_to_use,field_example_entries,drupal_internal__tid',
    }
  })
  return res.data
}

export async function getUsageDifferences({ search = '', page = 0 } = {}) {
  const params = {
    'filter[status]': 1,
    'sort': '-created',
    'page[limit]': 24,
    'page[offset]': page * 24,
  }
  if (search) { params['filter[title][operator]'] = 'CONTAINS'; params['filter[title][value]'] = search; }
  const res = await api.get('/jsonapi/node/usage_difference', { params })
  return res.data
}

export async function getUsageDifference(slug) {
  let offset = 0
  while (true) {
    const res = await api.get('/jsonapi/node/usage_difference', {
      params: { 'filter[status]': 1, 'sort': 'changed,drupal_internal__nid', 'page[limit]': 50, 'page[offset]': offset }
    })
    const entries = res.data.data || []
    const match = entries.find(e => e.attributes.path?.alias === `/usage-difference/${slug}`)
    if (match) return match
    if (entries.length < 50) break
    offset += 50
  }
  return null
}

export function getIncluded(included = [], type, id) {
  return included?.find(item => item.type === type && item.id === id)
}

export async function getAllEntries() {
  let all = []
  let offset = 0
  while (true) {
    const res = await api.get('/jsonapi/node/language_entry', {
      params: {
        'filter[status]': 1,
        'sort': 'changed,drupal_internal__nid',
        'page[limit]': 50,
        'page[offset]': offset,
        'fields[node--language_entry]': 'title,path,field_short_meaning',
      }
    })
    const items = res.data.data || []
    all = all.concat(items)
    if (items.length < 50) break
    offset += 50
  }
  return all
}

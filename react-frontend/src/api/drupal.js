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
  return res.data
}

export async function getEntry(slug) {
  // Convert slug back to title search — more reliable than path alias filter
  const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const res = await api.get('/jsonapi/node/language_entry', {
    params: {
      'filter[status]': 1,
      'filter[title][operator]': 'CONTAINS',
      'filter[title][value]': title.replace(/-/g, ' '),
      'include': 'field_main_category,field_tags',
      'page[limit]': 5,
    }
  })
  // Find exact match by path alias
  const entries = res.data.data || []
  const match = entries.find(e => e.attributes.path?.alias === `/entries/${slug}`)
  return match || entries[0] || null
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
  const res = await api.get('/jsonapi/node/usage_difference', {
    params: {
      'filter[status]': 1,
      'page[limit]': 50,
    }
  })
  const entries = res.data.data || []
  const match = entries.find(e => e.attributes.path?.alias === `/usage-difference/${slug}`)
  return match || null
}

export function getIncluded(included = [], type, id) {
  return included?.find(item => item.type === type && item.id === id)
}

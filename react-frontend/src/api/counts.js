import axios from 'axios'

const DRUPAL_BASE = import.meta.env.VITE_DRUPAL_URL || 'http://192.168.1.157:9022'

export async function getCategoryCounts() {
  const counts = {}
  let offset = 0
  const limit = 50

  while (true) {
    const res = await axios.get(`${DRUPAL_BASE}/jsonapi/node/language_entry`, {
      headers: { 'Accept': 'application/vnd.api+json' },
      params: {
        'filter[status]': 1,
        'sort': 'changed,drupal_internal__nid',
        'page[limit]': limit,
        'page[offset]': offset,
        'fields[node--language_entry]': 'field_main_category',
        'include': 'field_main_category',
      }
    })

    const entries = res.data.data || []
    entries.forEach(entry => {
      const catId = entry.relationships?.field_main_category?.data?.id
      if (catId) counts[catId] = (counts[catId] || 0) + 1
    })

    if (entries.length < limit) break
    offset += limit
  }

  return counts
}

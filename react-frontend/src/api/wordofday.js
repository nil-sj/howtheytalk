import axios from 'axios'

const DRUPAL_BASE = import.meta.env.VITE_DRUPAL_URL || 'http://192.168.1.157:9022'

export async function getWordOfDay() {
  // Fetch all entry slugs/titles with minimal fields
  let allEntries = []
  let offset = 0
  const limit = 50

  while (true) {
    const res = await axios.get(`${DRUPAL_BASE}/jsonapi/node/language_entry`, {
      headers: { 'Accept': 'application/vnd.api+json' },
      params: {
        'filter[status]': 1,
        'page[limit]': limit,
        'page[offset]': offset,
        'fields[node--language_entry]': 'title,field_short_meaning,path',
      }
    })
    const entries = res.data.data || []
    allEntries = allEntries.concat(entries)
    if (entries.length < limit) break
    offset += limit
  }

  if (allEntries.length === 0) return null

  // Use today's date as a seed to pick consistently for the day
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  const index = seed % allEntries.length
  return allEntries[index]
}

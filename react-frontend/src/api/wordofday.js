import axios from 'axios'

const DRUPAL_BASE = import.meta.env.VITE_DRUPAL_URL || 'http://192.168.1.157:9022'

function getEasternDateParts() {
  // Always compute the "day" based on America/New_York time,
  // regardless of the visitor's browser timezone or system clock.
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())

  const map = {}
  for (const p of parts) map[p.type] = p.value
  return { year: Number(map.year), month: Number(map.month), day: Number(map.day) }
}

export async function getWordOfDay() {
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

  // Seed based on the Eastern Time calendar day, so the word
  // changes precisely at midnight EDT/EST for everyone, everywhere.
  const { year, month, day } = getEasternDateParts()
  const seed = year * 10000 + month * 100 + day
  const index = seed % allEntries.length
  return allEntries[index]
}

import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import axios from 'axios'

const DRUPAL_BASE = import.meta.env.VITE_DRUPAL_URL || 'http://192.168.1.157:9022'

async function getRelatedEntries(categoryId, currentSlug) {
  if (!categoryId) return []
  const res = await axios.get(`${DRUPAL_BASE}/jsonapi/node/language_entry`, {
    headers: { 'Accept': 'application/vnd.api+json' },
    params: {
      'filter[status]': 1,
      'filter[field_main_category.id]': categoryId,
      'page[limit]': 10,
      'sort': '-created',
      'fields[node--language_entry]': 'title,field_short_meaning,path',
    }
  })
  return (res.data.data || [])
    .filter(e => e.attributes.path?.alias !== `/entries/${currentSlug}`)
    .slice(0, 3)
}

export default function RelatedEntries({ categoryId, currentSlug, categoryName }) {
  const { data: related, isLoading } = useQuery({
    queryKey: ['related', categoryId, currentSlug],
    queryFn: () => getRelatedEntries(categoryId, currentSlug),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
  })

  if (isLoading || !related || related.length === 0) return null

  return (
    <section className="related-entries">
      <div className="related-header">
        <h3 className="related-title">More from {categoryName || 'this category'}</h3>
        {categoryId && (
          <Link to={`/entries?category=${categoryId}`} className="related-view-all">
            View all →
          </Link>
        )}
      </div>
      <div className="related-grid">
        {related.map(entry => {
          const slug = entry.attributes.path?.alias?.replace('/entries/', '') || entry.id
          return (
            <Link key={entry.id} to={`/entries/${slug}`} className="related-card">
              <div className="related-card-title">{entry.attributes.title}</div>
              {entry.attributes.field_short_meaning && (
                <div className="related-card-meaning">{entry.attributes.field_short_meaning}</div>
              )}
            </Link>
          )
        })}
      </div>
    </section>
  )
}

import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getUsageDifferences } from '../api/drupal'

export function UsageDifferences() {
  const { data, isLoading } = useQuery({
    queryKey: ['usage-differences'],
    queryFn: () => getUsageDifferences()
  })

  const entries = data?.data || []

  return (
    <div className="usage-page">
      <div className="page-header">
        <h1 className="page-title">Usage Differences</h1>
        <p className="page-subtitle">Similar words and phrases compared</p>
      </div>

      {isLoading && <div className="loading">Loading...</div>}

      {!isLoading && entries.length === 0 && (
        <div className="empty-state">
          <p>No usage differences added yet.</p>
        </div>
      )}

      <div className="entries-grid">
        {entries.map(entry => (
          <article key={entry.id} className="entry-card">
            <h3 className="entry-card-title">
              <Link to={`/usage-difference/${entry.attributes.path?.alias?.replace('/usage-difference/', '') || entry.id}`}>
                {entry.attributes.title}
              </Link>
            </h3>
            {entry.attributes.field_quick_difference && (
              <p className="entry-card-meaning">{entry.attributes.field_quick_difference}</p>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}

export function NotFound() {
  return (
    <div className="not-found">
      <h1>Page not found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/">← Go home</Link>
    </div>
  )
}

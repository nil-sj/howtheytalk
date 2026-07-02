import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getAllEntries } from '../api/drupal'

export default function DidYouKnow() {
  const { data: entries } = useQuery({
    queryKey: ['all-entries-dyk'],
    queryFn: getAllEntries,
    staleTime: 30 * 60 * 1000,
  })

  if (!entries || entries.length === 0) return null

  // Pick a random entry — different on every page load
  const index = Math.floor(Math.random() * entries.length)
  const entry = entries[index]
  const alias = entry?.attributes?.path?.alias
  const title = entry?.attributes?.title
  const meaning = entry?.attributes?.field_short_meaning

  if (!title || !alias) return null

  return (
    <section className="home-section">
      <div className="dyk-card">
        <div className="dyk-header">
          <span className="dyk-label">💡 Did you know?</span>
        </div>
        <h3 className="dyk-title">"{title}"</h3>
        {meaning && <p className="dyk-meaning">{meaning}</p>}
        <Link to={alias} className="dyk-link">Read full entry →</Link>
      </div>
    </section>
  )
}

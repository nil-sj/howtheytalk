import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getEntries, getCategories } from '../api/drupal'
import EntryCard from '../components/EntryCard'

export default function Home() {
  const { data: entriesData } = useQuery({
    queryKey: ['entries', 'recent'],
    queryFn: () => getEntries({ page: 0 })
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  })

  const entries = entriesData?.data || []
  const included = entriesData?.included || []
  const categories = (categoriesData?.data || []).filter(
    cat => cat.attributes.name !== 'Usage Difference'
  )

  return (
    <div className="home">
      <section className="hero">
        <h1 className="hero-title">
          A personal diary of English words,<br />
          phrases, and everyday expressions.
        </h1>
        <p className="hero-subtitle">
          Collected from real life, work, reading, and conversations —
          especially from the perspective of learning practical English in the United States.
        </p>
        <div className="hero-actions">
          <Link to="/entries" className="btn-primary">Browse all entries</Link>
          <Link to="/explore" className="btn-secondary">Explore more</Link>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="home-section">
          <h2 className="section-title">Browse by category</h2>
          <div className="category-grid">
            {categories.map(cat => (
              <Link key={cat.id} to={`/entries?category=${cat.id}`} className="category-card">
                <span className="category-name">{cat.attributes.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {entries.length > 0 && (
        <section className="home-section">
          <div className="section-header">
            <h2 className="section-title">Recently added</h2>
            <Link to="/entries" className="section-link">View all →</Link>
          </div>
          <div className="entries-grid">
            {entries.slice(0, 6).map(entry => (
              <EntryCard key={entry.id} entry={entry} included={included} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

import useDocumentMeta from '../hooks/useDocumentMeta'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { getEntries, getCategories } from '../api/drupal'
import { getCategoryCounts } from '../api/counts'
import { getWordOfDay } from '../api/wordofday'
import EntryCard from '../components/EntryCard'
import DidYouKnow from '../components/DidYouKnow'

export default function Home() {
  useDocumentMeta(null, 'Discover American English idioms, phrases, business lingo, and usage differences — a personal language diary for practical, everyday English.')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const { data: entriesData } = useQuery({
    queryKey: ['entries', 'recent'],
    queryFn: () => getEntries({ page: 0 })
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  })

  const { data: categoryCounts } = useQuery({
    queryKey: ['category-counts'],
    queryFn: getCategoryCounts,
    staleTime: 10 * 60 * 1000,
  })

  const { data: wordOfDay } = useQuery({
    queryKey: ['word-of-day'],
    queryFn: getWordOfDay,
    staleTime: 60 * 60 * 1000,
  })

  const entries = entriesData?.data || []
  const included = entriesData?.included || []
  const categories = (categoriesData?.data || []).filter(
    cat => cat.attributes.name !== 'Usage Difference'
  )

  function handleSearch(e) {
    e.preventDefault()
    if (search.trim()) navigate(`/search?q=${encodeURIComponent(search.trim())}`)
  }

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

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
        <form className="hero-search" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="Search for a word or phrase — e.g. circle back, bandwidth, no worries..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoComplete="off"
          />
          <button type="submit">Search</button>
        </form>
        <div className="hero-actions">
          <Link to="/entries" className="btn-secondary">Browse all entries</Link>
          <Link to="/explore" className="btn-secondary">Explore more</Link>
        </div>
      </section>

      {wordOfDay && (
        <section className="home-section">
          <div className="wotd-card">
            <div className="wotd-header">
              <span className="wotd-label">📅 Word of the Day</span>
              <span className="wotd-date">{todayStr}</span>
            </div>
            <h2 className="wotd-title">{wordOfDay.attributes.title}</h2>
            {wordOfDay.attributes.field_short_meaning && (
              <p className="wotd-meaning">{wordOfDay.attributes.field_short_meaning}</p>
            )}
            {wordOfDay.attributes.path?.alias && (
              <Link
                to={wordOfDay.attributes.path.alias}
                className="wotd-link"
              >
                Read full entry →
              </Link>
            )}
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="home-section">
          <h2 className="section-title">Browse by category</h2>
          <div className="category-grid">
            {categories.map(cat => (
              <Link key={cat.id} to={`/entries?category=${cat.id}`} className="category-card">
                <span className="category-name">{cat.attributes.name}</span>
                {categoryCounts?.[cat.id] && (
                  <span className="category-count">{categoryCounts[cat.id]} entries</span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      <DidYouKnow />

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

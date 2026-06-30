import useDocumentMeta from '../hooks/useDocumentMeta'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { getEntries, getCategories } from '../api/drupal'
import EntryCard from '../components/EntryCard'

export default function Entries() {
  useDocumentMeta('All Entries', 'Browse the full collection of American English words, phrases, idioms, and language observations.')
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [page, setPage] = useState(Number(searchParams.get('page') || 0))

  const { data: entriesData, isLoading } = useQuery({
    queryKey: ['entries', search, category, page],
    queryFn: () => getEntries({ search, category, page })
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  })

  const entries = entriesData?.data || []
  const included = entriesData?.included || []
  const hasNextPage = entriesData?._hasNextPage || false
  const categories = (categoriesData?.data || []).filter(
    cat => cat.attributes.name !== 'Usage Difference'
  )

  function handleSearch(e) {
    e.preventDefault()
    setPage(0)
    setSearchParams({ search, category, page: 0 })
  }

  function handleReset() {
    setSearch('')
    setCategory('')
    setPage(0)
    setSearchParams({})
  }

  function goToPage(p) {
    setPage(p)
    setSearchParams({ search, category, page: p })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="entries-page">
      <div className="page-header">
        <h1 className="page-title">All Entries</h1>
        <p className="page-subtitle">Words, phrases, idioms, and language observations</p>
      </div>

      <form className="filter-bar" onSubmit={handleSearch}>
        <div className="filter-field">
          <label>Search</label>
          <input type="search" placeholder="Search entries..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-field">
          <label>Category</label>
          <select value={category} onChange={e => { setCategory(e.target.value); setPage(0); }}>
            <option value="">— Any —</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.attributes.name}</option>
            ))}
          </select>
        </div>
        <div className="filter-actions">
          <button type="submit" className="btn-primary">Search</button>
          <button type="button" className="btn-ghost" onClick={handleReset}>Reset</button>
        </div>
      </form>

      {isLoading && <div className="loading">Loading entries...</div>}

      {!isLoading && entries.length === 0 && (
        <div className="empty-state"><p>No entries found. Try a different search or category.</p></div>
      )}

      {!isLoading && entries.length > 0 && (
        <>
          <p className="results-count">
            Showing {page * 24 + 1}–{page * 24 + entries.length} entries
            {(page > 0 || hasNextPage) && ` — page ${page + 1}`}
          </p>
          <div className="entries-grid">
            {entries.map(entry => (
              <EntryCard key={entry.id} entry={entry} included={included} />
            ))}
          </div>

          {(page > 0 || hasNextPage) && (
            <div className="pagination">
              <button className="page-btn" onClick={() => goToPage(page - 1)} disabled={page === 0}>
                ← Previous
              </button>
              <span className="page-indicator">Page {page + 1}</span>
              <button className="page-btn" onClick={() => goToPage(page + 1)} disabled={!hasNextPage}>
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

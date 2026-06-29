import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getEntries, getCategories } from '../api/drupal'
import EntryCard from '../components/EntryCard'

export default function Entries() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')

  const { data: entriesData, isLoading } = useQuery({
    queryKey: ['entries', search, category],
    queryFn: () => getEntries({ search, category })
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  })

  const entries = entriesData?.data || []
  const included = entriesData?.included || []

  // Exclude Usage Difference from filter dropdown
  const categories = (categoriesData?.data || []).filter(
    cat => cat.attributes.name !== 'Usage Difference'
  )

  function handleSearch(e) {
    e.preventDefault()
    setSearchParams({ search, category })
  }

  function handleReset() {
    setSearch('')
    setCategory('')
    setSearchParams({})
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
          <input
            type="search"
            placeholder="Search entries..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-field">
          <label>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">— Any —</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.attributes.name}
              </option>
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
        <div className="empty-state">
          <p>No entries found. Try a different search or category.</p>
        </div>
      )}

      {!isLoading && entries.length > 0 && (
        <>
          <p className="results-count">{entries.length} entries found</p>
          <div className="entries-grid">
            {entries.map(entry => (
              <EntryCard key={entry.id} entry={entry} included={included} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

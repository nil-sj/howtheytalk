import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getCategories } from '../api/drupal'
import { getCategoryCounts } from '../api/counts'

export default function Categories() {
  const { data, isLoading } = useQuery({ queryKey: ['categories'], queryFn: getCategories })
  const { data: categoryCounts } = useQuery({ queryKey: ['category-counts'], queryFn: getCategoryCounts, staleTime: 10 * 60 * 1000 })

  const categories = (data?.data || []).filter(cat => cat.attributes.name !== 'Usage Difference')

  return (
    <div className="categories-page">
      <div className="page-header">
        <h1 className="page-title">Categories</h1>
        <p className="page-subtitle">Browse entries by topic — each category has a specific purpose</p>
      </div>

      {isLoading && <div className="loading">Loading...</div>}

      <div className="category-detail-list">
        {categories.map((cat, i) => (
          <div key={cat.id} className="category-detail-card">
            <div className="category-detail-header">
              <span className="category-number">{String(i + 1).padStart(2, '0')}</span>
              <h2 className="category-detail-name">{cat.attributes.name}</h2>
              {categoryCounts?.[cat.id] && (
                <span className="category-count-badge">{categoryCounts[cat.id]} entries</span>
              )}
              <Link to={`/entries?category=${cat.id}`} className="category-browse-link">
                Browse entries →
              </Link>
            </div>

            {cat.attributes.field_short_definition && (
              <p className="category-definition">{cat.attributes.field_short_definition}</p>
            )}

            {cat.attributes.field_when_to_use && (
              <div className="category-meta">
                <span className="category-meta-label">Use for:</span>
                <span className="category-meta-text">{cat.attributes.field_when_to_use}</span>
              </div>
            )}

            {cat.attributes.field_example_entries && (
              <div className="category-examples">
                <span className="category-meta-label">Examples:</span>
                <span className="category-meta-text">{cat.attributes.field_example_entries}</span>
              </div>
            )}

            <div className="category-explore-links">
              <span className="category-explore-label">Practice:</span>
              <Link to={`/flashcards?category=${cat.id}`} className="category-explore-link">
                🃏 Flashcards
              </Link>
              <span className="category-explore-divider">·</span>
              <Link to={`/quizzes?category=${cat.id}`} className="category-explore-link">
                🧩 Quiz
              </Link>
              <span className="category-explore-divider">·</span>
              <Link to={`/hangman?category=${cat.id}`} className="category-explore-link">
                🎯 Hangman
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

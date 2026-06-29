import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getCategories } from '../api/drupal'

export default function Categories() {
  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  })

  const categories = data?.data || []

  return (
    <div className="categories-page">
      <div className="page-header">
        <h1 className="page-title">Categories</h1>
        <p className="page-subtitle">Browse entries by topic</p>
      </div>

      {isLoading && <div className="loading">Loading...</div>}

      <div className="category-list">
        {categories.map((cat, i) => (
          <Link
            key={cat.id}
            to={`/entries?category=${cat.id}`}
            className="category-list-item"
          >
            <span className="category-number">{String(i + 1).padStart(2, '0')}</span>
            <span className="category-list-name">{cat.attributes.name}</span>
            <span className="category-arrow">→</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

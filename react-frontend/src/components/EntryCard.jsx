import { Link } from 'react-router-dom'
import { getIncluded } from '../api/drupal'

export default function EntryCard({ entry, included = [] }) {
  const { attributes, relationships } = entry
  const slug = attributes.path?.alias?.replace('/entries/', '') || entry.id
  const categoryId = relationships?.field_main_category?.data?.id
  const category = getIncluded(included, 'taxonomy_term--main_categories', categoryId)

  return (
    <article className="entry-card">
      <div className="entry-card-top">
        {category && (
          <span className="category-badge">
            {category.attributes.name}
          </span>
        )}
      </div>
      <h3 className="entry-card-title">
        <Link to={`/entries/${slug}`}>{attributes.title}</Link>
      </h3>
      {attributes.field_short_meaning && (
        <p className="entry-card-meaning">{attributes.field_short_meaning}</p>
      )}
      <div className="entry-card-meta">
        <span className="entry-date">
          {new Date(attributes.created).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
          })}
        </span>
      </div>
    </article>
  )
}

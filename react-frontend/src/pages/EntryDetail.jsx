import useDocumentMeta from '../hooks/useDocumentMeta'
import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { getEntry, getIncluded } from '../api/drupal'
import RelatedEntries from '../components/RelatedEntries'

export default function EntryDetail() {
  const { slug } = useParams()

  const { data: entry, isLoading } = useQuery({
    queryKey: ['entry', slug],
    queryFn: () => getEntry(slug)
  })

  // Must be before any conditional returns to satisfy React's rules of hooks
  useDocumentMeta(
    entry?.attributes?.title || null,
    entry?.attributes?.field_short_meaning || null
  )

  if (isLoading) return <div className="loading">Loading...</div>
  if (!entry) return (
    <div className="not-found">
      <h1>Entry not found</h1>
      <Link to="/entries">← Back to entries</Link>
    </div>
  )

  const { attributes, relationships } = entry

  const included = entry._included || []

  const categoryRel = relationships?.field_main_category?.data
  const category = categoryRel
    ? getIncluded(included, 'taxonomy_term--main_categories', categoryRel.id)
    : null
  const categoryName = category?.attributes?.name || null
  const categoryId = categoryRel?.id || null

  const tagsData = relationships?.field_tags?.data || []

  return (
    <article className="entry-detail">
      <nav className="breadcrumb">
        <Link to="/">Home</Link><span>›</span>
        <Link to="/entries">Entries</Link><span>›</span>
        <span>{attributes.title}</span>
      </nav>

      <header className="entry-header">
        <div className="entry-meta">
          {categoryName && categoryId && (
            <Link to={`/entries?category=${categoryId}`} className="category-badge">
              {categoryName}
            </Link>
          )}
          <span className="entry-date">
            {new Date(attributes.created).toLocaleDateString('en-US', {
              month: 'long', day: 'numeric', year: 'numeric'
            })}
          </span>
        </div>
        <h1 className="entry-title">{attributes.title}</h1>
      </header>

      <div className="entry-content">
        {attributes.field_short_meaning && (
          <div className="meaning-block">
            <div className="field-label">Meaning</div>
            <p>{attributes.field_short_meaning}</p>
          </div>
        )}

        {attributes.field_detailed_explanation?.processed && (
          <div className="content-section">
            <div className="field-label">Detailed explanation</div>
            <div className="rich-text" dangerouslySetInnerHTML={{ __html: attributes.field_detailed_explanation.processed }} />
          </div>
        )}

        {attributes.field_usage_examples?.length > 0 && (
          <div className="content-section">
            <div className="field-label">Usage examples</div>
            {attributes.field_usage_examples.map((ex, i) => (
              <div key={i} className="usage-example" dangerouslySetInnerHTML={{ __html: ex.processed }} />
            ))}
          </div>
        )}

        {attributes.field_notes_background?.processed && (
          <div className="content-section">
            <div className="field-label">Notes / background</div>
            <div className="rich-text notes" dangerouslySetInnerHTML={{ __html: attributes.field_notes_background.processed }} />
          </div>
        )}

        {attributes.field_source_links?.length > 0 && (
          <div className="content-section">
            <div className="field-label">External links</div>
            <ul className="source-links">
              {attributes.field_source_links.map((link, i) => (
                <li key={i}>
                  <a href={link.uri} target="_blank" rel="noopener noreferrer">
                    {link.title || link.uri}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tagsData.length > 0 && (
          <div className="content-section">
            <div className="field-label">Tags</div>
            <div className="tags-list">
              {tagsData.map(tag => (
                <span key={tag.id} className="tag">{tag.id}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="entry-footer">
        <p className="last-updated">
          Last updated:{' '}
          {new Date(attributes.changed).toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric'
          })}
        </p>
        <Link to="/entries" className="back-link">← Back to entries</Link>
      </footer>

      <RelatedEntries
        categoryId={categoryId}
        currentSlug={slug}
        categoryName={categoryName}
      />
    </article>
  )
}

import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { getUsageDifference } from '../api/drupal'

export default function UsageDifferenceDetail() {
  const { slug } = useParams()
  const { data: entry, isLoading } = useQuery({
    queryKey: ['usage-difference', slug],
    queryFn: () => getUsageDifference(slug)
  })

  if (isLoading) return <div className="loading">Loading...</div>
  if (!entry) return (
    <div className="not-found">
      <h1>Entry not found</h1>
      <Link to="/usage-difference">Back to usage differences</Link>
    </div>
  )

  const { attributes } = entry
  return (
    <article className="entry-detail">
      <nav className="breadcrumb">
        <Link to="/">Home</Link><span>›</span>
        <Link to="/usage-difference">Usage Differences</Link><span>›</span>
        <span>{attributes.title}</span>
      </nav>
      <header className="entry-header">
        <h1 className="entry-title">{attributes.title}</h1>
      </header>
      <div className="entry-content">
        {attributes.field_quick_difference && (
          <div className="meaning-block">
            <div className="field-label">Quick difference</div>
            <p>{attributes.field_quick_difference}</p>
          </div>
        )}
        {attributes.field_terms_compared && (
          <div className="content-section">
            <div className="field-label">Terms compared</div>
            <p className="rich-text">{attributes.field_terms_compared}</p>
          </div>
        )}
        {attributes.field_detailed_explanation?.processed && (
          <div className="content-section">
            <div className="field-label">Detailed explanation</div>
            <div className="rich-text" dangerouslySetInnerHTML={{ __html: attributes.field_detailed_explanation.processed }} />
          </div>
        )}
        {attributes.field_common_mistake?.processed && (
          <div className="content-section">
            <div className="field-label">Common mistake</div>
            <div className="rich-text notes" dangerouslySetInnerHTML={{ __html: attributes.field_common_mistake.processed }} />
          </div>
        )}
        {attributes.field_notes_background?.processed && (
          <div className="content-section">
            <div className="field-label">Notes</div>
            <div className="rich-text notes" dangerouslySetInnerHTML={{ __html: attributes.field_notes_background.processed }} />
          </div>
        )}
      </div>
      <footer className="entry-footer">
        <p className="last-updated">Last updated: {new Date(attributes.changed).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        <Link to="/usage-difference" className="back-link">Back to usage differences</Link>
      </footer>
    </article>
  )
}

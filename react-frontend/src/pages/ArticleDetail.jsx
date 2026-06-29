import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

const DRUPAL_BASE = import.meta.env.VITE_DRUPAL_URL || 'http://192.168.1.157:9022'

async function getArticle(slug) {
  const res = await axios.get(`${DRUPAL_BASE}/jsonapi/node/article`, {
    headers: { 'Accept': 'application/vnd.api+json' },
    params: { 'filter[status]': 1, 'page[limit]': 50 }
  })
  const entries = res.data.data || []
  return entries.find(e => e.attributes.path?.alias === `/articles/${slug}`) || null
}

export default function ArticleDetail() {
  const { slug } = useParams()
  const { data: article, isLoading } = useQuery({
    queryKey: ['article', slug],
    queryFn: () => getArticle(slug)
  })

  if (isLoading) return <div className="loading">Loading...</div>
  if (!article) return (
    <div className="not-found">
      <h1>Article not found</h1>
      <Link to="/articles">Back to articles</Link>
    </div>
  )

  const { attributes } = article
  const body = Array.isArray(attributes.field_body)
    ? attributes.field_body[0]?.processed
    : attributes.field_body?.processed

  return (
    <article className="article-detail">
      <nav className="breadcrumb">
        <Link to="/">Home</Link><span>›</span>
        <Link to="/articles">Articles</Link><span>›</span>
        <span>{attributes.title}</span>
      </nav>
      <header className="article-header">
        <h1 className="entry-title">{attributes.title}</h1>
        {attributes.field_summary && (
          <p className="article-summary">
            {Array.isArray(attributes.field_summary)
              ? attributes.field_summary[0]
              : attributes.field_summary}
          </p>
        )}
        <div className="article-meta">
          <span className="entry-date">
            {new Date(attributes.created).toLocaleDateString('en-US', {
              month: 'long', day: 'numeric', year: 'numeric'
            })}
          </span>
        </div>
      </header>
      {body && (
        <div className="article-body" dangerouslySetInnerHTML={{ __html: body }} />
      )}
      <footer className="entry-footer">
        <Link to="/articles" className="back-link">Back to articles</Link>
      </footer>
    </article>
  )
}

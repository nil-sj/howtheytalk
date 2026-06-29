import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import axios from 'axios'

const DRUPAL_BASE = import.meta.env.VITE_DRUPAL_URL || 'http://192.168.1.157:9022'

async function getArticles() {
  const res = await axios.get(`${DRUPAL_BASE}/jsonapi/node/article`, {
    headers: { 'Accept': 'application/vnd.api+json' },
    params: { 'filter[status]': 1, 'sort': '-created', 'page[limit]': 24 }
  })
  return res.data
}

export default function Articles() {
  const { data, isLoading } = useQuery({ queryKey: ['articles'], queryFn: getArticles })
  const articles = data?.data || []

  return (
    <div className="articles-page">
      <div className="page-header">
        <h1 className="page-title">Articles</h1>
        <p className="page-subtitle">Long-form posts about English language, culture, and practical usage</p>
      </div>

      {isLoading && <div className="loading">Loading...</div>}

      {!isLoading && articles.length === 0 && (
        <div className="empty-state"><p>No articles yet.</p></div>
      )}

      <div className="article-list">
        {articles.map(article => {
          const slug = article.attributes.path?.alias?.replace('/articles/', '') || article.id
          return (
            <article key={article.id} className="article-card">
              <h2 className="article-card-title">
                <Link to={`/articles/${slug}`}>{article.attributes.title}</Link>
              </h2>
              {article.attributes.field_summary && (
                <p className="article-card-summary">{article.attributes.field_summary}</p>
              )}
              <div className="article-card-meta">
                <span className="entry-date">
                  {new Date(article.attributes.created).toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric'
                  })}
                </span>
                <Link to={`/articles/${slug}`} className="article-read-more">Read more →</Link>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

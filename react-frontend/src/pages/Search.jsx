import { useSearchParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const DRUPAL_BASE = import.meta.env.VITE_DRUPAL_URL || 'http://192.168.1.157:9022'

async function searchAll(term) {
  if (!term || term.length < 2) return { entries: [], differences: [], articles: [] }

  const headers = { 'Accept': 'application/vnd.api+json' }
  const params = {
    'filter[title][operator]': 'CONTAINS',
    'filter[title][value]': term,
    'filter[status]': 1,
    'page[limit]': 10,
  }

  const [entriesRes, diffsRes, articlesRes] = await Promise.allSettled([
    axios.get(`${DRUPAL_BASE}/jsonapi/node/language_entry`, { headers, params }),
    axios.get(`${DRUPAL_BASE}/jsonapi/node/usage_difference`, { headers, params }),
    axios.get(`${DRUPAL_BASE}/jsonapi/node/article`, { headers, params }),
  ])

  return {
    entries: entriesRes.status === 'fulfilled' ? entriesRes.value.data.data || [] : [],
    differences: diffsRes.status === 'fulfilled' ? diffsRes.value.data.data || [] : [],
    articles: articlesRes.status === 'fulfilled' ? articlesRes.value.data.data || [] : [],
  }
}

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchAll(query),
    enabled: query.length >= 2,
  })

  const total = data ? data.entries.length + data.differences.length + data.articles.length : 0

  function handleSubmit(e) {
    e.preventDefault()
    const val = e.target.q.value.trim()
    if (val) setSearchParams({ q: val })
  }

  return (
    <div className="search-page">
      <div className="page-header">
        <h1 className="page-title">Search</h1>
      </div>

      <form className="search-bar-large" onSubmit={handleSubmit}>
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search entries, articles, usage differences..."
          autoFocus
        />
        <button type="submit" className="btn-primary">Search</button>
      </form>

      {query.length >= 2 && isLoading && <div className="loading">Searching...</div>}

      {query.length >= 2 && !isLoading && total === 0 && (
        <div className="empty-state">
          <p>No results found for "<strong>{query}</strong>". Try a different word or phrase.</p>
        </div>
      )}

      {query.length >= 2 && !isLoading && total > 0 && (
        <div className="search-results">
          <p className="results-count">{total} result{total !== 1 ? 's' : ''} for "<strong>{query}</strong>"</p>

          {data.entries.length > 0 && (
            <section className="search-section">
              <h2 className="search-section-title">
                <span className="search-section-icon">📖</span>
                Entries
                <span className="search-section-count">{data.entries.length}</span>
              </h2>
              <div className="search-result-list">
                {data.entries.map(item => {
                  const slug = item.attributes.path?.alias?.replace('/entries/', '') || item.id
                  return (
                    <Link key={item.id} to={`/entries/${slug}`} className="search-result-item">
                      <div className="search-result-title">{item.attributes.title}</div>
                      {item.attributes.field_short_meaning && (
                        <div className="search-result-desc">{item.attributes.field_short_meaning}</div>
                      )}
                    </Link>
                  )
                })}
              </div>
            </section>
          )}

          {data.differences.length > 0 && (
            <section className="search-section">
              <h2 className="search-section-title">
                <span className="search-section-icon">🔄</span>
                Usage Differences
                <span className="search-section-count">{data.differences.length}</span>
              </h2>
              <div className="search-result-list">
                {data.differences.map(item => {
                  const slug = item.attributes.path?.alias?.replace('/usage-difference/', '') || item.id
                  return (
                    <Link key={item.id} to={`/usage-difference/${slug}`} className="search-result-item">
                      <div className="search-result-title">{item.attributes.title}</div>
                      {item.attributes.field_quick_difference && (
                        <div className="search-result-desc">{item.attributes.field_quick_difference}</div>
                      )}
                    </Link>
                  )
                })}
              </div>
            </section>
          )}

          {data.articles.length > 0 && (
            <section className="search-section">
              <h2 className="search-section-title">
                <span className="search-section-icon">📝</span>
                Articles
                <span className="search-section-count">{data.articles.length}</span>
              </h2>
              <div className="search-result-list">
                {data.articles.map(item => {
                  const slug = item.attributes.path?.alias?.replace('/articles/', '') || item.id
                  return (
                    <Link key={item.id} to={`/articles/${slug}`} className="search-result-item">
                      <div className="search-result-title">{item.attributes.title}</div>
                      {item.attributes.field_summary && (
                        <div className="search-result-desc">
                          {Array.isArray(item.attributes.field_summary)
                            ? item.attributes.field_summary[0]
                            : item.attributes.field_summary}
                        </div>
                      )}
                    </Link>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      )}

      {query.length > 0 && query.length < 2 && (
        <p className="search-hint">Please enter at least 2 characters to search.</p>
      )}

      {!query && (
        <div className="search-suggestions">
          <p className="search-hint">Try searching for:</p>
          <div className="search-tags">
            {['circle back', 'bandwidth', 'rock vs stone', 'prepone', 'no worries', 'idiom'].map(term => (
              <button key={term} className="search-tag" onClick={() => setSearchParams({ q: term })}>
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

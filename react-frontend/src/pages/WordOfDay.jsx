import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getWordOfDay } from '../api/wordofday'

export default function WordOfDay() {
  const { data: entry, isLoading } = useQuery({
    queryKey: ['word-of-day'],
    queryFn: getWordOfDay,
    staleTime: 60 * 60 * 1000,
  })

  const todayStr = new Date().toLocaleDateString('en-US', {
    timeZone: 'America/New_York',
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  })

  return (
    <div className="wotd-page">
      <div className="page-header">
        <h1 className="page-title">Word of the Day</h1>
        <p className="page-subtitle">{todayStr}</p>
      </div>

      {isLoading && <div className="loading">Loading today's word...</div>}

      {entry && (
        <>
          <div className="wotd-featured">
            <div className="wotd-card">
              <div className="wotd-header">
                <span className="wotd-label">📅 Word of the Day</span>
                <span className="wotd-date">{todayStr}</span>
              </div>
              <h2 className="wotd-title">{entry.attributes.title}</h2>
              {entry.attributes.field_short_meaning && (
                <p className="wotd-meaning">{entry.attributes.field_short_meaning}</p>
              )}
              {entry.attributes.path?.alias && (
                <Link to={entry.attributes.path.alias} className="wotd-link">
                  Read full entry →
                </Link>
              )}
            </div>
          </div>

          <div className="wotd-note">
            <p>A new word or phrase is featured every day, drawn from the TalkNotes collection. Come back tomorrow for a new one.</p>
            <p style={{marginTop: '0.75rem'}}>
              <Link to="/entries" className="btn-primary">Browse all entries</Link>
              {' '}
              <Link to="/explore" className="btn-secondary" style={{marginLeft: '0.75rem'}}>Explore more</Link>
            </p>
          </div>
        </>
      )}
    </div>
  )
}

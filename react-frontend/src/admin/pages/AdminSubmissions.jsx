import AdminBackButton from '../components/AdminBackButton'
import { useState, useEffect } from 'react'
import { getContactSubmissions } from '../api/adminDrupal'

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(null)
  const DRUPAL = import.meta.env.VITE_DRUPAL_URL || 'http://192.168.1.157:9022'

  useEffect(() => {
    getContactSubmissions()
      .then(data => { setSubmissions(data); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  const typeLabels = {
    suggest: 'Word suggestion', correction: 'Correction',
    issue: 'Issue report', general: 'General', other: 'Other'
  }

  function formatDate(ts) {
    return new Date(ts * 1000).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  function replyMailto(data) {
    const subject = encodeURIComponent(`Re: Your TalkNotes message`)
    const body = encodeURIComponent(
      `Hi ${data.your_name},\n\nThank you for reaching out to TalkNotes.\n\n` +
      (data.suggested_word ? `Regarding your suggestion "${data.suggested_word}":\n\n` : '') +
      `---\nYour message:\n${data.message}\n`
    )
    return `mailto:${data.your_email}?subject=${subject}&body=${body}`
  }

  return (
    <div className="admin-page"><AdminBackButton />
      <div className="admin-page-header">
        <h1>Contact submissions</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <span className="admin-stat-label" style={{ alignSelf: 'center' }}>{submissions.length} total</span>
          <a href={`${DRUPAL}/admin/structure/webform/manage/suggest_a_word/results/submissions`} target="_blank" rel="noopener" className="admin-btn-ghost">
            Manage in Drupal →
          </a>
        </div>
      </div>

      {loading && <div className="admin-loading">Loading submissions...</div>}
      {error && <div className="admin-error">{error}</div>}
      {!loading && !error && submissions.length === 0 && (
        <div className="admin-empty">No submissions yet.</div>
      )}

      <div className="admin-submissions-list">
        {submissions.map(sub => {
          const data = sub.data || {}
          const isOpen = expanded === sub.id

          return (
            <div key={sub.id} className={`admin-submission ${isOpen ? 'admin-submission--open' : ''}`}>
              <div className="admin-submission-header" onClick={() => setExpanded(isOpen ? null : sub.id)}>
                <div className="admin-submission-meta">
                  <span className="admin-submission-type">
                    {typeLabels[data.message_type] || data.message_type || 'Message'}
                  </span>
                  <span className="admin-submission-from">
                    {data.your_name}
                  </span>
                  {data.suggested_word && (
                    <span className="admin-submission-word">"{data.suggested_word}"</span>
                  )}
                </div>
                <div className="admin-submission-date">
                  {formatDate(sub.created)}
                  <span className="admin-submission-toggle">{isOpen ? '▲' : '▼'}</span>
                </div>
              </div>

              {isOpen && (
                <div className="admin-submission-body">
                  <div className="admin-submission-grid">
                    <div className="admin-submission-field">
                      <strong>From:</strong> {data.your_name} — <a href={`mailto:${data.your_email}`}>{data.your_email}</a>
                    </div>
                    <div className="admin-submission-field">
                      <strong>Type:</strong> {typeLabels[data.message_type] || data.message_type}
                    </div>
                    {data.suggested_word && (
                      <div className="admin-submission-field">
                        <strong>Suggested word:</strong> {data.suggested_word}
                      </div>
                    )}
                    <div className="admin-submission-field admin-submission-message">
                      <strong>Message:</strong>
                      <p>{data.message}</p>
                    </div>
                    {data.source_context && (
                      <div className="admin-submission-field">
                        <strong>Source/context:</strong> {data.source_context}
                      </div>
                    )}
                  </div>

                  <div className="admin-submission-actions">
                    <a href={replyMailto(data)} className="admin-btn-primary admin-btn-sm">
                      ✉ Reply by email
                    </a>
                    {data.suggested_word && (
                      <a href={`/admin/entries/new?title=${encodeURIComponent(data.suggested_word)}`} className="admin-btn-ghost admin-btn-sm">
                        Create entry for this
                      </a>
                    )}
                    <a href={`${DRUPAL}/admin/structure/webform/manage/suggest_a_word/submission/${sub.id}`} target="_blank" rel="noopener" className="admin-btn-ghost admin-btn-sm">
                      View in Drupal
                    </a>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

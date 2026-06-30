import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AdminBackButton from '../components/AdminBackButton'

const DRUPAL_BASE = import.meta.env.VITE_DRUPAL_URL || 'http://192.168.1.157:9022'
const ADMIN_SECRET = 'talknotes-admin-2026'

async function fetchEntry(nid) {
  const res = await fetch(`${DRUPAL_BASE}/api/get-usage-diff/${nid}`, {
    headers: { 'X-Admin-Secret': ADMIN_SECRET }
  })
  if (!res.ok) throw new Error('Not found')
  return res.json()
}

async function saveEntry(nid, data, action = null) {
  const res = await fetch(`${DRUPAL_BASE}/api/update-usage-diff/${nid}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Admin-Secret': ADMIN_SECRET },
    body: JSON.stringify({ ...data, ...(action ? { action } : {}) })
  })
  if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed') }
  return res.json()
}

export default function AdminEditUsageDiff() {
  const { nid } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [status, setStatus] = useState('draft')
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    title: '', quick_summary: '', detailed_explanation: '', common_mistake: '', notes: ''
  })

  useEffect(() => {
    fetchEntry(nid).then(entry => {
      setForm({
        title:                entry.title || '',
        quick_summary:        entry.quick_summary || '',
        detailed_explanation: entry.detailed_explanation || '',
        common_mistake:       entry.common_mistake || '',
        notes:                entry.notes || '',
      })
      setStatus(entry.status || 'draft')
      setLoading(false)
    }).catch(err => { alert(err.message); setLoading(false) })
  }, [nid])

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSave() {
    setSaving(true); setMessage('')
    try {
      await saveEntry(nid, form)
      setMessage('✓ Saved')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) { alert(err.message) }
    setSaving(false)
  }

  async function handlePublish() {
    if (!confirm('Publish this entry?')) return
    setPublishing(true); setMessage('')
    try {
      await saveEntry(nid, form, 'publish')
      setStatus('published')
      setMessage('✓ Published!')
      setTimeout(() => { setMessage(''); navigate('/admin/usage-diffs?status=published') }, 1500)
    } catch (err) { alert(err.message) }
    setPublishing(false)
  }

  async function handleUnpublish() {
    if (!confirm('Unpublish this entry?')) return
    setPublishing(true); setMessage('')
    try {
      await saveEntry(nid, form, 'unpublish')
      setStatus('draft')
      setMessage('✓ Moved to draft')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) { alert(err.message) }
    setPublishing(false)
  }

  if (loading) return <div className="admin-page"><div className="admin-loading">Loading...</div></div>

  return (
    <div className="admin-page">
      <AdminBackButton to="/admin/usage-diffs" label="← Usage Differences" />
      <div className="admin-page-header">
        <div>
          <h1 style={{marginBottom:'0.35rem'}}>{form.title || 'Edit usage difference'}</h1>
          <span className={`admin-status-badge ${status === 'published' ? 'admin-status-badge--pub' : 'admin-status-badge--draft'}`}>{status}</span>
        </div>
        <div style={{display:'flex', gap:'0.75rem', alignItems:'center', flexWrap:'wrap'}}>
          {message && <span className="admin-saved-badge">{message}</span>}
          <a href={`${DRUPAL_BASE}/node/${nid}/edit`} target="_blank" rel="noopener" className="admin-btn-ghost">Edit in Drupal ↗</a>
        </div>
      </div>

      <div className="admin-entry-main" style={{background:'#fff', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'1.5rem'}}>
        <div className="admin-field">
          <label>Title *</label>
          <input name="title" value={form.title} onChange={handleChange} />
        </div>
        <div className="admin-field">
          <label>Quick difference summary</label>
          <textarea name="quick_summary" value={form.quick_summary} onChange={handleChange} rows={2} />
        </div>
        <div className="admin-field">
          <label>Detailed explanation <span style={{fontSize:'0.7rem',color:'var(--ink-faint)',fontWeight:400,textTransform:'none',letterSpacing:0}}>(HTML ok — keep &lt;p&gt; tags)</span></label>
          <textarea name="detailed_explanation" value={form.detailed_explanation} onChange={handleChange} rows={8} style={{fontFamily:'monospace',fontSize:'0.85rem'}} />
        </div>
        <div className="admin-field">
          <label>Common mistake</label>
          <textarea name="common_mistake" value={form.common_mistake} onChange={handleChange} rows={3} />
        </div>
        <div className="admin-field">
          <label>Notes / background</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} />
        </div>

        <div className="admin-entry-actions">
          <button className="admin-btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
          {status === 'draft' ? (
            <button className="admin-btn-publish" onClick={handlePublish} disabled={publishing}>
              {publishing ? 'Publishing...' : '🚀 Publish'}
            </button>
          ) : (
            <button className="admin-btn-unpublish" onClick={handleUnpublish} disabled={publishing}>
              {publishing ? '...' : '↩ Unpublish'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

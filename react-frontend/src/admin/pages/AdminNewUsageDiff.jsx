import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminBackButton from '../components/AdminBackButton'

const DRUPAL_BASE = import.meta.env.VITE_DRUPAL_URL || 'http://192.168.1.157:9022'
const ADMIN_SECRET = 'talknotes-admin-2026'

export default function AdminNewUsageDiff() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', quick_summary: '', detailed_explanation: '', common_mistake: '', notes: ''
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSave() {
    if (!form.title) return
    setSaving(true)
    try {
      const res = await fetch(`${DRUPAL_BASE}/api/create-usage-diff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Secret': ADMIN_SECRET },
        body: JSON.stringify(form)
      })
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed') }
      setSaved(true)
      setTimeout(() => navigate('/admin/usage-diffs'), 1500)
    } catch (err) { alert(err.message) }
    setSaving(false)
  }

  if (saved) return <div className="admin-page"><div className="admin-success-msg">✓ Saved as draft!</div></div>

  return (
    <div className="admin-page">
      <AdminBackButton to="/admin/usage-diffs" label="← Usage Differences" />
      <div className="admin-page-header">
        <h1>New usage difference</h1>
      </div>
      <div className="admin-entry-main" style={{background:'#fff', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'1.5rem'}}>
        <div className="admin-field">
          <label>Title * <span style={{fontSize:'0.7rem',color:'var(--ink-faint)',fontWeight:400,textTransform:'none',letterSpacing:0}}>e.g. "Stone vs Rock" or "House vs Home"</span></label>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Word A vs Word B" autoFocus />
        </div>
        <div className="admin-field">
          <label>Quick difference summary</label>
          <textarea name="quick_summary" value={form.quick_summary} onChange={handleChange} rows={2} placeholder="One or two sentence explanation of the core difference..." />
        </div>
        <div className="admin-field">
          <label>Detailed explanation <span style={{fontSize:'0.7rem',color:'var(--ink-faint)',fontWeight:400,textTransform:'none',letterSpacing:0}}>(HTML ok)</span></label>
          <textarea name="detailed_explanation" value={form.detailed_explanation} onChange={handleChange} rows={7} style={{fontFamily:'monospace',fontSize:'0.85rem'}} placeholder="Fuller explanation with examples for each term..." />
        </div>
        <div className="admin-field">
          <label>Common mistake</label>
          <textarea name="common_mistake" value={form.common_mistake} onChange={handleChange} rows={3} placeholder="How people commonly confuse these terms..." />
        </div>
        <div className="admin-field">
          <label>Notes / background</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Cultural context, regional differences, tips..." />
        </div>
        <div className="admin-entry-actions">
          <button className="admin-btn-primary" onClick={handleSave} disabled={saving || !form.title}>
            {saving ? 'Saving...' : 'Save as draft'}
          </button>
        </div>
      </div>
    </div>
  )
}

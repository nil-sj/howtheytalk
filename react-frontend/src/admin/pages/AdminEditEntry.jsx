import AdminBackButton from '../components/AdminBackButton'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCategories } from '../api/adminDrupal'
import { generateWithAI, getAISettings } from '../api/aiService'

const DRUPAL_BASE = import.meta.env.VITE_DRUPAL_URL || 'http://192.168.1.157:9022'
const ADMIN_SECRET = 'talknotes-admin-2026'

async function fetchEntry(nid) {
  const res = await fetch(`${DRUPAL_BASE}/api/get-entry/${nid}`, {
    headers: { 'X-Admin-Secret': ADMIN_SECRET }
  })
  if (!res.ok) throw new Error('Entry not found')
  return res.json()
}

async function saveEntry(nid, data, action = null) {
  const res = await fetch(`${DRUPAL_BASE}/api/update-entry/${nid}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Admin-Secret': ADMIN_SECRET },
    body: JSON.stringify({ ...data, ...(action ? { action } : {}) })
  })
  if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Save failed') }
  return res.json()
}

export default function AdminEditEntry() {
  const { nid } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [status, setStatus] = useState('draft')
  const [categories, setCategories] = useState([])
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    title: '', category_id: '', short_meaning: '',
    detailed_explanation: '', usage_examples: '', notes: '', hint: ''
  })
  const aiSettings = getAISettings()

  useEffect(() => {
    // Load both in parallel, then set form once both are ready
    Promise.all([
      fetchEntry(nid),
      getCategories()
    ]).then(([entry, cats]) => {
      setCategories(cats)
      setStatus(entry.status || 'draft')
      setForm({
        title:                entry.title || '',
        category_id:          entry.category_id || '',
        short_meaning:        entry.short_meaning || '',
        detailed_explanation: entry.detailed_explanation || '',
        usage_examples:       entry.usage_examples || '',
        notes:                entry.notes || '',
        hint:                 '',
      })
      setLoading(false)
    }).catch(err => {
      alert('Failed to load entry: ' + err.message)
      setLoading(false)
    })
  }, [nid])

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleAIDraft() {
    if (!form.title) { setAiError('Title is required.'); return }
    if (!aiSettings.apiKey) { setAiError('No API key — go to Settings.'); return }
    setAiLoading(true); setAiError('')
    try {
      const catName = categories.find(c => c.id === form.category_id)?.attributes?.name || ''
      const result = await generateWithAI({ title: form.title, category: catName, hint: form.hint })
      setForm(f => ({
        ...f,
        short_meaning:        result.short_meaning || f.short_meaning,
        detailed_explanation: result.detailed_explanation || f.detailed_explanation,
        usage_examples:       result.usage_examples || f.usage_examples,
        notes:                result.notes || f.notes,
      }))
    } catch (err) { setAiError(err.message) }
    setAiLoading(false)
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
    if (!confirm('Publish this entry? It will become publicly visible.')) return
    setPublishing(true); setMessage('')
    try {
      await saveEntry(nid, form, 'publish')
      setStatus('published')
      setMessage('✓ Published!')
      setTimeout(() => { setMessage(''); navigate('/admin/entries?status=published') }, 1500)
    } catch (err) { alert(err.message) }
    setPublishing(false)
  }

  async function handleUnpublish() {
    if (!confirm('Unpublish this entry? It will be hidden from the public site.')) return
    setPublishing(true); setMessage('')
    try {
      await saveEntry(nid, form, 'unpublish')
      setStatus('draft')
      setMessage('✓ Moved back to draft')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) { alert(err.message) }
    setPublishing(false)
  }

  if (loading) return (
    <div className="admin-page">
      <div className="admin-loading">Loading entry...</div>
    </div>
  )

  return (
    <div className="admin-page">
      <AdminBackButton to="/admin/entries" label="← Entries" />
      <div className="admin-page-header">
        <div>
          <h1 style={{marginBottom:'0.35rem'}}>{form.title || 'Edit entry'}</h1>
          <span className={`admin-status-badge ${status === 'published' ? 'admin-status-badge--pub' : 'admin-status-badge--draft'}`}>
            {status}
          </span>
        </div>
        <div style={{display:'flex', gap:'0.75rem', alignItems:'center', flexWrap:'wrap'}}>
          {message && <span className="admin-saved-badge">{message}</span>}
          <a href={`${DRUPAL_BASE}/node/${nid}/edit`} target="_blank" rel="noopener" className="admin-btn-ghost">
            Edit in Drupal ↗
          </a>
        </div>
      </div>

      <div className="admin-entry-layout">
        <div className="admin-entry-main">
          <div className="admin-field">
            <label>Title / Word or phrase *</label>
            <input name="title" value={form.title} onChange={handleChange} />
          </div>

          <div className="admin-field-row">
            <div className="admin-field">
              <label>Category</label>
              <select name="category_id" value={form.category_id} onChange={handleChange}>
                <option value="">— Select category —</option>
                {categories.filter(c => c.attributes.name !== 'Usage Difference').map(c => (
                  <option key={c.id} value={c.id}>{c.attributes.name}</option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label>Hint for AI (optional)</label>
              <input name="hint" value={form.hint} onChange={handleChange} placeholder="Context for AI re-drafting..." />
            </div>
          </div>

          <div className="admin-ai-bar">
            <button className="admin-btn-ai" onClick={handleAIDraft} disabled={aiLoading || !form.title}>
              {aiLoading ? '⏳ Generating...' : '✨ Re-draft with AI'}
            </button>
            {!aiSettings.apiKey && <span className="admin-ai-warning">No API key — <a href="/admin/settings">Settings</a></span>}
            {aiError && <span className="admin-ai-error">{aiError}</span>}
            {aiSettings.apiKey && <span className="admin-ai-provider">via {aiSettings.provider} · {aiSettings.model || 'default'}</span>}
          </div>

          <div className="admin-field">
            <label>Short meaning</label>
            <textarea name="short_meaning" value={form.short_meaning} onChange={handleChange} rows={2} />
          </div>
          <div className="admin-field">
            <label>Detailed explanation <span style={{fontSize:'0.7rem',color:'var(--ink-faint)',fontWeight:400,textTransform:'none',letterSpacing:0}}>(HTML is fine — keep &lt;p&gt; tags)</span></label>
            <textarea name="detailed_explanation" value={form.detailed_explanation} onChange={handleChange} rows={8} style={{fontFamily:'monospace', fontSize:'0.85rem'}} />
          </div>
          <div className="admin-field">
            <label>Usage examples <span style={{fontSize:'0.7rem',color:'var(--ink-faint)',fontWeight:400,textTransform:'none',letterSpacing:0}}>separate with |</span></label>
            <textarea name="usage_examples" value={form.usage_examples} onChange={handleChange} rows={3} />
          </div>
          <div className="admin-field">
            <label>Notes / background</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={4} />
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
    </div>
  )
}

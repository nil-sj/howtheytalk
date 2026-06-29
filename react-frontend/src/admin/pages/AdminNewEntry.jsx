import AdminBackButton from '../components/AdminBackButton'
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { createDraftEntry, getCategories } from '../api/adminDrupal'
import { generateWithAI, getAISettings } from '../api/aiService'

export default function AdminNewEntry() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    title: searchParams.get('title') || '',
    category_id: searchParams.get('category') || '',
    short_meaning: '',
    detailed_explanation: '',
    usage_examples: '',
    notes: '',
    ai_draft: '',
    hint: searchParams.get('hint') || '',
  })
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const aiSettings = getAISettings()

  useEffect(() => { getCategories().then(setCategories) }, [])

  // Auto-draft if title and hint come from suggestions
  useEffect(() => {
    if (searchParams.get('title') && searchParams.get('hint') && aiSettings.apiKey) {
      handleAIDraft()
    }
  }, [categories])

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleAIDraft() {
    if (!form.title) { setAiError('Enter a title first.'); return }
    if (!aiSettings.apiKey) { setAiError('No API key. Go to Settings first.'); return }
    setAiLoading(true)
    setAiError('')
    try {
      const catName = categories.find(c => c.id === form.category_id)?.attributes?.name || ''
      const result = await generateWithAI({ title: form.title, category: catName, hint: form.hint })
      setForm(f => ({
        ...f,
        short_meaning: result.short_meaning || f.short_meaning,
        detailed_explanation: result.detailed_explanation || f.detailed_explanation,
        usage_examples: result.usage_examples || f.usage_examples,
        notes: result.notes || f.notes,
        ai_draft: JSON.stringify(result, null, 2),
      }))
    } catch (err) {
      setAiError(err.message)
    }
    setAiLoading(false)
  }

  async function handleSave() {
    if (!form.title) return
    setSaving(true)
    try {
      await createDraftEntry(form)
      setSaved(true)
      setTimeout(() => navigate('/admin'), 1500)
    } catch (err) {
      alert('Error saving: ' + err.message)
    }
    setSaving(false)
  }

  if (saved) return (
    <div className="admin-page">
      <div className="admin-success-msg">✓ Draft saved! Redirecting...</div>
    </div>
  )

  return (
    <div className="admin-page">
      <AdminBackButton />
      <div className="admin-page-header">
        <h1>New draft entry</h1>
        <button onClick={() => navigate('/admin')} className="admin-btn-ghost">← Back</button>
      </div>

      <div className="admin-entry-layout">
        <div className="admin-entry-main">
          <div className="admin-field">
            <label>Title / Word or phrase *</label>
            <input name="title" value={form.title} onChange={handleChange}
              placeholder="e.g. Circle back, No worries, Achilles heel..." autoFocus={!form.title} />
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
              <input name="hint" value={form.hint} onChange={handleChange} placeholder="Context, where you heard it..." />
            </div>
          </div>

          <div className="admin-ai-bar">
            <button className="admin-btn-ai" onClick={handleAIDraft} disabled={aiLoading || !form.title}>
              {aiLoading ? '⏳ Generating...' : '✨ Draft with AI'}
            </button>
            {!aiSettings.apiKey && (
              <span className="admin-ai-warning">No API key — <a href="/admin/settings">go to Settings</a></span>
            )}
            {aiError && <span className="admin-ai-error">{aiError}</span>}
            {aiSettings.apiKey && (
              <span className="admin-ai-provider">via {aiSettings.provider} · {aiSettings.model || 'default'}</span>
            )}
          </div>

          <div className="admin-field">
            <label>Short meaning</label>
            <textarea name="short_meaning" value={form.short_meaning} onChange={handleChange} rows={2} placeholder="One-sentence plain-language definition..." />
          </div>
          <div className="admin-field">
            <label>Detailed explanation</label>
            <textarea name="detailed_explanation" value={form.detailed_explanation} onChange={handleChange} rows={6} placeholder="Fuller explanation with context..." />
          </div>
          <div className="admin-field">
            <label>Usage examples</label>
            <textarea name="usage_examples" value={form.usage_examples} onChange={handleChange} rows={3} placeholder='"Example sentence 1." | "Example sentence 2."' />
          </div>
          <div className="admin-field">
            <label>Notes / background</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={4} placeholder="Cultural context, origin, cautions..." />
          </div>

          <div className="admin-entry-actions">
            <button className="admin-btn-primary" onClick={handleSave} disabled={saving || !form.title}>
              {saving ? 'Saving...' : 'Save as draft'}
            </button>
            <span className="admin-save-note">Saved as draft — publish from the edit page when ready</span>
          </div>
        </div>

        {form.ai_draft && (
          <div className="admin-ai-output">
            <div className="admin-ai-output-label">AI raw output</div>
            <pre className="admin-ai-raw">{form.ai_draft}</pre>
          </div>
        )}
      </div>
    </div>
  )
}

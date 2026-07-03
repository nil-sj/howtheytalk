import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminBackButton from '../components/AdminBackButton'
import { getCategories, createDraftEntry } from '../api/adminDrupal'
import { getAISettings } from '../api/aiService'

const DRUPAL_BASE = import.meta.env.VITE_DRUPAL_URL || 'http://192.168.1.157:9022'
const ADMIN_SECRET = 'talknotes-admin-2026'

async function getTitlesForCategory(categoryName, allCategories) {
  // If no category selected, get all titles
  // If category selected, get only titles in that category
  let url = `${DRUPAL_BASE}/jsonapi/node/language_entry?page[limit]=50&fields[node--language_entry]=title&filter[status]=1`

  let titles = []
  let offset = 0

  if (categoryName) {
    // Get category tid first
    const catRes = await fetch(`${DRUPAL_BASE}/jsonapi/taxonomy_term/main_categories?filter[name]=${encodeURIComponent(categoryName)}&fields[taxonomy_term--main_categories]=name`, {
      headers: { 'Accept': 'application/vnd.api+json' }
    })
    const catData = await catRes.json()
    const catId = catData.data?.[0]?.id
    if (catId) {
      url += `&filter[field_main_category.id]=${catId}`
    }
  }

  while (true) {
    const res = await fetch(`${url}&sort=changed,drupal_internal__nid&page[offset]=${offset}`, {
      headers: { 'Accept': 'application/vnd.api+json' }
    })
    const data = await res.json()
    const items = data.data || []
    titles = titles.concat(items.map(i => i.attributes.title))
    if (items.length < 50) break
    offset += 50
  }

  // Also get drafts in this category (simpler — just get all draft titles)
  const res2 = await fetch(`${DRUPAL_BASE}/api/recent-drafts?limit=100`, {
    headers: { 'X-Admin-Secret': ADMIN_SECRET }
  })
  if (res2.ok) {
    const d2 = await res2.json()
    titles = titles.concat((d2.drafts || []).map(d => d.title))
  }

  return [...new Set(titles)]
}

async function suggestWithAI({ existingTitles, category, categoryDesc, count, settings }) {
  const systemPrompt = settings.systemPrompt || 'You are a language content assistant for HowTheyTalk.'

  const scopeNote = existingTitles.length > 0
    ? `These ${existingTitles.length} entries already exist in this category — do NOT suggest any of these:\n${existingTitles.map(t => `- ${t}`).join('\n')}`
    : `No entries exist in this category yet.`

  const userPrompt = `You are helping expand HowTheyTalk, a personal English language diary for non-native speakers learning practical American English.

Category: "${category}"
Category description: ${categoryDesc}

${scopeNote}

Please suggest ${count} NEW words, phrases, or expressions for the "${category}" category that:
1. Are NOT in the list above
2. Fit this specific category well
3. Would be genuinely useful for someone learning practical American English
4. Range from common everyday usage to interesting/surprising ones
5. Are specific enough to write a good HowTheyTalk entry about

Return ONLY a JSON array, no other text:
[
  {
    "title": "Phrase or word",
    "why": "One sentence explaining why this is worth including in this category"
  }
]`

  if (settings.provider === 'anthropic') {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': settings.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: settings.model || 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    })
    if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message || 'API error') }
    const data = await res.json()
    const text = data.content?.[0]?.text || '[]'
    return JSON.parse(text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())
  }

  if (settings.provider === 'openai') {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${settings.apiKey}` },
      body: JSON.stringify({
        model: settings.model || 'gpt-4o-mini',
        max_tokens: 2000,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      })
    })
    if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message || 'API error') }
    const data = await res.json()
    const text = data.choices?.[0]?.message?.content || '[]'
    return JSON.parse(text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())
  }

  throw new Error(`Provider "${settings.provider}" not supported`)
}

export default function AdminSuggest() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [selectedCat, setSelectedCat] = useState('')
  const [count, setCount] = useState(10)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [error, setError] = useState('')
  const [titlesCount, setTitlesCount] = useState(null)
  const [savingAll, setSavingAll] = useState(false)
  const [savedAll, setSavedAll] = useState(false)
  const [savedIds, setSavedIds] = useState({}) // track which individual ones saved
  const settings = getAISettings()

  useEffect(() => {
    getCategories().then(cats => {
      setCategories(cats.filter(c => c.attributes.name !== 'Usage Difference'))
    })
  }, [])

  async function handleSuggest() {
    if (!selectedCat) { setError('Please select a category.'); return }
    if (!settings.apiKey) { setError('No API key configured — go to Settings.'); return }
    setError('')
    setLoading(true)
    setSuggestions([])
    setSavedAll(false)
    setSavedIds({})

    try {
      const cat = categories.find(c => c.id === selectedCat)
      const catName = cat.attributes.name
      const titles = await getTitlesForCategory(catName, categories)
      setTitlesCount(titles.length)

      const results = await suggestWithAI({
        existingTitles: titles,
        category: catName,
        categoryDesc: cat.attributes.field_short_definition || '',
        count,
        settings,
      })
      setSuggestions(results)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  async function handleSaveOne(suggestion, index) {
    try {
      await createDraftEntry({ title: suggestion.title, category_id: selectedCat })
      setSavedIds(s => ({ ...s, [index]: true }))
    } catch (err) {
      alert('Failed to save: ' + err.message)
    }
  }

  async function handleSaveAll() {
    if (!confirm(`Save all ${suggestions.length} suggestions as draft stubs? You can then visit each one to AI-draft or delete.`)) return
    setSavingAll(true)
    let saved = {}
    for (let i = 0; i < suggestions.length; i++) {
      if (!savedIds[i]) {
        try {
          await createDraftEntry({ title: suggestions[i].title, category_id: selectedCat })
          saved[i] = true
        } catch (err) {
          console.error('Failed to save:', suggestions[i].title, err)
        }
      } else {
        saved[i] = true
      }
    }
    setSavedIds(saved)
    setSavingAll(false)
    setSavedAll(true)
  }

  function handleDraft(suggestion) {
    const cat = categories.find(c => c.id === selectedCat)
    navigate(`/admin/entries/new?title=${encodeURIComponent(suggestion.title)}&category=${selectedCat}&hint=${encodeURIComponent(suggestion.why)}`)
  }

  const catName = categories.find(c => c.id === selectedCat)?.attributes?.name || ''
  const allSaved = suggestions.length > 0 && suggestions.every((_, i) => savedIds[i])

  return (
    <div className="admin-page">
      <AdminBackButton />
      <div className="admin-page-header">
        <h1>AI content suggestions</h1>
      </div>

      <div className="admin-suggest-intro">
        <p>Select a category — the AI will check only your existing entries in that category and suggest new ones you don't have yet.</p>
      </div>

      {!settings.apiKey && (
        <div className="admin-error" style={{marginBottom:'1.5rem'}}>
          No API key configured. <a href="/admin/settings">Go to AI Settings →</a>
        </div>
      )}

      <div className="admin-suggest-controls">
        <div className="admin-field" style={{flex:2}}>
          <label>Category</label>
          <select value={selectedCat} onChange={e => { setSelectedCat(e.target.value); setSuggestions([]); setTitlesCount(null) }}>
            <option value="">— Select a category —</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.attributes.name}</option>
            ))}
          </select>
        </div>
        <div className="admin-field" style={{flex:1}}>
          <label>Number of suggestions</label>
          <select value={count} onChange={e => setCount(Number(e.target.value))}>
            {[5, 10, 15, 20].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="admin-field" style={{alignSelf:'flex-end'}}>
          <button className="admin-btn-ai" onClick={handleSuggest} disabled={loading || !selectedCat || !settings.apiKey}>
            {loading ? '⏳ Thinking...' : '✨ Get suggestions'}
          </button>
        </div>
      </div>

      {error && <div className="admin-error" style={{marginBottom:'1rem'}}>{error}</div>}

      {loading && (
        <div className="admin-suggest-loading">
          <div className="admin-suggest-spinner">✨</div>
          <p>{titlesCount !== null ? `Checking against ${titlesCount} existing entries in "${catName}"...` : `Loading existing entries in "${catName}"...`}</p>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="admin-suggest-results">
          <div className="admin-suggest-results-header">
            <div>
              <h2>{suggestions.length} suggestions for <strong>{catName}</strong></h2>
              {titlesCount !== null && (
                <p className="admin-suggest-meta">Checked against {titlesCount} existing entries in this category</p>
              )}
            </div>
            <div style={{display:'flex', gap:'0.75rem', flexWrap:'wrap', alignItems:'center'}}>
              {allSaved ? (
                <span className="admin-saved-badge">✓ All saved as drafts</span>
              ) : (
                <button className="admin-btn-primary" onClick={handleSaveAll} disabled={savingAll}>
                  {savingAll ? 'Saving all...' : `💾 Save all ${suggestions.length} as draft stubs`}
                </button>
              )}
              <button className="admin-btn-ghost" onClick={handleSuggest} disabled={loading}>Refresh</button>
            </div>
          </div>

          <div className="admin-suggest-grid">
            {suggestions.map((s, i) => (
              <div key={i} className={`admin-suggest-card ${savedIds[i] ? 'admin-suggest-card--saved' : ''}`}>
                <div className="admin-suggest-card-title">{s.title}</div>
                <div className="admin-suggest-card-why">{s.why}</div>
                <div className="admin-suggest-card-actions">
                  {savedIds[i] ? (
                    <span className="admin-suggest-saved-badge">✓ Saved as draft</span>
                  ) : (
                    <button className="admin-btn-ghost admin-btn-sm" onClick={() => handleSaveOne(s, i)}>
                      💾 Save stub
                    </button>
                  )}
                  <button className="admin-btn-primary admin-btn-sm" onClick={() => handleDraft(s)}>
                    ✨ Draft with AI →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

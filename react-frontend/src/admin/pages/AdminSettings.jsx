import AdminBackButton from '../components/AdminBackButton'
import { useState } from 'react'
import { getAISettings, saveAISettings } from '../api/aiService'

const PROVIDERS = {
  anthropic: { name: 'Anthropic (Claude)', models: ['claude-haiku-4-5-20251001', 'claude-sonnet-4-6', 'claude-opus-4-6'], keyPlaceholder: 'sk-ant-...' },
  openai: { name: 'OpenAI (GPT)', models: ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo'], keyPlaceholder: 'sk-...' },
  gemini: { name: 'Google (Gemini)', models: ['gemini-1.5-flash', 'gemini-1.5-pro'], keyPlaceholder: 'AIza...' },
}

export default function AdminSettings() {
  const [settings, setSettings] = useState(getAISettings())
  const [saved, setSaved] = useState(false)
  const [showKey, setShowKey] = useState(false)

  function handleChange(e) {
    setSettings(s => ({ ...s, [e.target.name]: e.target.value }))
    setSaved(false)
  }

  function handleSave() {
    saveAISettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const provider = PROVIDERS[settings.provider] || PROVIDERS.anthropic

  return (
    <div className="admin-page"><AdminBackButton />
      <div className="admin-page-header">
        <h1>AI settings</h1>
        {saved && <span className="admin-saved-badge">✓ Saved</span>}
      </div>

      <div className="admin-settings-grid">
        <div className="admin-panel">
          <div className="admin-panel-header"><h2>API configuration</h2></div>
          <p className="admin-settings-note">Settings are stored locally in your browser. They are never sent to any server except the AI provider you choose.</p>

          <div className="admin-field">
            <label>AI provider</label>
            <select name="provider" value={settings.provider} onChange={handleChange}>
              {Object.entries(PROVIDERS).map(([key, p]) => (
                <option key={key} value={key}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="admin-field">
            <label>Model</label>
            <select name="model" value={settings.model} onChange={handleChange}>
              <option value="">— Default —</option>
              {provider.models.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="admin-field">
            <label>API key</label>
            <div className="admin-key-row">
              <input
                type={showKey ? 'text' : 'password'}
                name="apiKey"
                value={settings.apiKey}
                onChange={handleChange}
                placeholder={provider.keyPlaceholder}
              />
              <button type="button" className="admin-btn-ghost" onClick={() => setShowKey(s => !s)}>
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="admin-field-hint">Get your API key from the provider's dashboard. It is stored only in your browser's local storage.</p>
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header"><h2>Style guardrails (system prompt)</h2></div>
          <p className="admin-settings-note">This prompt is sent with every AI request to ensure consistent tone, style, and length across all AI-drafted entries.</p>
          <div className="admin-field">
            <textarea
              name="systemPrompt"
              value={settings.systemPrompt}
              onChange={handleChange}
              rows={16}
              className="admin-system-prompt"
            />
          </div>
        </div>
      </div>

      <div className="admin-settings-save">
        <button className="admin-btn-primary" onClick={handleSave}>Save settings</button>
        {saved && <span className="admin-saved-badge">✓ Saved to browser</span>}
      </div>
    </div>
  )
}

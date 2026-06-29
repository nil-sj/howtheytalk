import { useState } from 'react'
import axios from 'axios'

const DRUPAL_BASE = import.meta.env.VITE_DRUPAL_URL || 'http://192.168.1.157:9022'

export default function Contact() {
  const [form, setForm] = useState({
    your_name: '', your_email: '', message_type: 'suggest',
    suggested_word: '', message: '', source_context: ''
  })
  const [status, setStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setStatus(null)
    try {
      await axios.post(`${DRUPAL_BASE}/api/contact-submit`, form, {
        headers: { 'Content-Type': 'application/json' }
      })
      setStatus('success')
      setForm({ your_name: '', your_email: '', message_type: 'suggest', suggested_word: '', message: '', source_context: '' })
    } catch (err) {
      console.error(err.response?.data || err.message)
      setStatus('error')
    }
    setSubmitting(false)
  }

  return (
    <div className="contact-page">
      <div className="page-header">
        <h1 className="page-title">Suggest a word or get in touch</h1>
        <p className="page-subtitle">
          Heard an expression that confused you? Know a phrase that should be here?
          I read every message.
        </p>
      </div>

      {status === 'success' && (
        <div className="form-success">
          Thank you! I read every suggestion and will consider adding it to TalkNotes.
        </div>
      )}

      {status === 'error' && (
        <div className="form-error">
          Something went wrong. Please try again.
        </div>
      )}

      {status !== 'success' && (
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="your_name">Your name</label>
              <input type="text" id="your_name" name="your_name" value={form.your_name} onChange={handleChange} required />
            </div>
            <div className="form-field">
              <label htmlFor="your_email">Your email</label>
              <input type="email" id="your_email" name="your_email" value={form.your_email} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="message_type">Message type</label>
            <select id="message_type" name="message_type" value={form.message_type} onChange={handleChange}>
              <option value="suggest">Suggest a word or phrase</option>
              <option value="correction">Suggest a correction</option>
              <option value="issue">Report an issue</option>
              <option value="general">General message</option>
              <option value="other">Other</option>
            </select>
          </div>
          {form.message_type === 'suggest' && (
            <div className="form-field">
              <label htmlFor="suggested_word">Suggested word or phrase</label>
              <input type="text" id="suggested_word" name="suggested_word" value={form.suggested_word} onChange={handleChange} placeholder="e.g. Circle back, No worries..." />
            </div>
          )}
          <div className="form-field">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" value={form.message} onChange={handleChange} rows="5" required placeholder="Tell me more..." />
          </div>
          <div className="form-field">
            <label htmlFor="source_context">Source or context <span className="optional">(optional)</span></label>
            <input type="text" id="source_context" name="source_context" value={form.source_context} onChange={handleChange} placeholder="Where did you hear or read this?" />
          </div>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Sending...' : 'Send message'}
          </button>
        </form>
      )}
    </div>
  )
}

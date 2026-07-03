export function getAISettings() {
  try {
    return JSON.parse(localStorage.getItem('tn_ai_settings')) || {
      provider: 'anthropic',
      apiKey: '',
      model: '',
      systemPrompt: `You are a language writing assistant for HowTheyTalk, a personal English language diary focused on practical American English for non-native speakers, especially those from India.

Write entries that match this style:
- Tone: warm, conversational, practical — never academic or condescending
- Short meaning: one clear sentence, plain language
- Detailed explanation: 2-3 paragraphs, real-world context, when and how it is used
- Usage examples: 1-2 natural sentences showing the word/phrase in context, use quotation marks, separated by | (pipe character) not / or comma
- Notes/background: cultural context, origin if interesting, caution if needed, Indian English comparison if relevant
- Aimed at someone learning American English in a real workplace or social setting
- Never use jargon to explain jargon
- Length: concise but complete — similar to a good dictionary entry with personality`
    }
  } catch { return { provider: 'anthropic', apiKey: '', model: '', systemPrompt: '' } }
}

export function saveAISettings(settings) {
  localStorage.setItem('tn_ai_settings', JSON.stringify(settings))
}

export async function generateWithAI({ title, category, hint, exampleEntries = [] }) {
  const settings = getAISettings()
  if (!settings.apiKey) throw new Error('No API key configured. Go to Settings to add one.')

  const fewShot = exampleEntries.length > 0
    ? `\n\nHere are two example HowTheyTalk entries for style reference:\n\n${exampleEntries.map(e =>
        `TITLE: ${e.title}\nMEANING: ${e.meaning}\nEXPLANATION: ${e.explanation}`
      ).join('\n\n---\n\n')}`
    : ''

  const userPrompt = `Write a HowTheyTalk entry for the word or phrase: "${title}"
Category: ${category || 'General'}
${hint ? `Additional context: ${hint}` : ''}
${fewShot}

Return ONLY a JSON object with these fields:
{
  "short_meaning": "one sentence plain-language definition",
  "detailed_explanation": "2-3 paragraph HTML explanation",
  "usage_examples": "1-2 example sentences in quotes, separated by | (pipe) not / or comma",
  "notes": "cultural context, origin, or usage notes"
}`

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
        max_tokens: 1500,
        system: settings.systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    })
    if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message || 'API error') }
    const data = await res.json()
    const text = data.content?.[0]?.text || ''
    return parseAIResponse(text)
  }

  if (settings.provider === 'openai') {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${settings.apiKey}` },
      body: JSON.stringify({
        model: settings.model || 'gpt-4o-mini',
        max_tokens: 1500,
        messages: [
          { role: 'system', content: settings.systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      })
    })
    if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message || 'API error') }
    const data = await res.json()
    const text = data.choices?.[0]?.message?.content || ''
    return parseAIResponse(text)
  }

  throw new Error(`Provider "${settings.provider}" not supported yet`)
}

function parseAIResponse(text) {
  const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  try { return JSON.parse(clean) }
  catch { return { short_meaning: '', detailed_explanation: text, usage_examples: '', notes: '' } }
}

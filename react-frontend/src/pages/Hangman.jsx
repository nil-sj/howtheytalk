import useDocumentMeta from '../hooks/useDocumentMeta'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getCategories } from '../api/drupal'
import axios from 'axios'

const DRUPAL_BASE = import.meta.env.VITE_DRUPAL_URL || 'http://192.168.1.157:9022'
const MAX_WRONG = 6

const HANGMAN_STAGES = [
`
  +---+
  |   |
      |
      |
      |
      |
=========`,`
  +---+
  |   |
  O   |
      |
      |
      |
=========`,`
  +---+
  |   |
  O   |
  |   |
      |
      |
=========`,`
  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`,`
  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`,`
  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========`,`
  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========`]

async function getRandomEntry(categoryId) {
  let all = []
  let offset = 0
  while (true) {
    const res = await axios.get(`${DRUPAL_BASE}/jsonapi/node/language_entry`, {
      headers: { 'Accept': 'application/vnd.api+json' },
      params: { 'filter[status]': 1, 'sort': 'changed,drupal_internal__nid', 'filter[field_main_category.id]': categoryId, 'page[limit]': 50, 'page[offset]': offset, 'fields[node--language_entry]': 'title,field_short_meaning,path' }
    })
    const entries = res.data.data || []
    all = all.concat(entries.filter(e => { const t = e.attributes.title; return t.length <= 20 && /^[a-zA-Z\s'-]+$/.test(t) }))
    if (entries.length < 50) break
    offset += 50
  }
  if (all.length === 0) return null
  return all[Math.floor(Math.random() * all.length)]
}

function HangmanGame({ entry, categoryName, onNext, onExit }) {
  const word = entry.attributes.title.toUpperCase()
  const letters = word.replace(/[^A-Z]/g, '').split('')
  const uniqueLetters = [...new Set(letters)]
  const [guessed, setGuessed] = useState([])
  const wrongCount = guessed.filter(l => !word.includes(l)).length
  const won = uniqueLetters.every(l => guessed.includes(l))
  const lost = wrongCount >= MAX_WRONG

  const handleKey = useCallback((letter) => {
    if (won || lost || guessed.includes(letter)) return
    setGuessed(g => [...g, letter])
  }, [won, lost, guessed])

  useEffect(() => {
    function onKeyDown(e) { const l = e.key.toUpperCase(); if (/^[A-Z]$/.test(l)) handleKey(l) }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleKey])

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  function renderWord() {
    return word.split('').map((char, i) => {
      if (char === ' ') return <span key={i} className="hm-space" />
      if (char === "'") return <span key={i} className="hm-apostrophe">'</span>
      if (char === '-') return <span key={i} className="hm-dash">-</span>
      const revealed = guessed.includes(char)
      return <span key={i} className={`hm-letter ${revealed ? 'hm-letter--revealed' : ''} ${lost && !revealed ? 'hm-letter--missed' : ''}`}>{revealed || lost ? char : ''}</span>
    })
  }

  return (
    <div className="hm-game">
      <div className="hm-game-header">
        <button className="fc-back-btn" onClick={onExit}>← Categories</button>
        <span className="fc-deck-title">{categoryName}</span>
        <span className="hm-wrong-count">{wrongCount}/{MAX_WRONG} wrong</span>
      </div>
      <div className="hm-layout">
        <div className="hm-scaffold-wrap"><pre className="hm-scaffold">{HANGMAN_STAGES[wrongCount]}</pre></div>
        <div className="hm-right">
          <div className="hm-hint"><span className="hm-hint-label">Hint:</span> {entry.attributes.field_short_meaning}</div>
          <div className="hm-word-display">{renderWord()}</div>
          {!won && !lost && (
            <div className="hm-keyboard">
              {alphabet.map(letter => {
                const used = guessed.includes(letter)
                const correct = used && word.includes(letter)
                const wrong = used && !word.includes(letter)
                return <button key={letter} className={`hm-key ${correct ? 'hm-key--correct' : ''} ${wrong ? 'hm-key--wrong' : ''}`} onClick={() => handleKey(letter)} disabled={used}>{letter}</button>
              })}
            </div>
          )}
          {won && (
            <div className="hm-result hm-result--won">
              <div className="hm-result-icon">🎉</div>
              <div className="hm-result-title">You got it!</div>
              <div className="hm-result-word">{entry.attributes.title}</div>
              <div className="hm-result-meaning">{entry.attributes.field_short_meaning}</div>
              {entry.attributes.path?.alias && <a href={entry.attributes.path.alias} target="_blank" rel="noopener" className="hm-result-link">Read full entry ↗</a>}
              <button className="btn-primary" onClick={onNext} style={{marginTop:'1rem'}}>Next word →</button>
            </div>
          )}
          {lost && (
            <div className="hm-result hm-result--lost">
              <div className="hm-result-icon">😔</div>
              <div className="hm-result-title">The word was:</div>
              <div className="hm-result-word">{entry.attributes.title}</div>
              <div className="hm-result-meaning">{entry.attributes.field_short_meaning}</div>
              {entry.attributes.path?.alias && <a href={entry.attributes.path.alias} target="_blank" rel="noopener" className="hm-result-link">Read full entry ↗</a>}
              <button className="btn-primary" onClick={onNext} style={{marginTop:'1rem'}}>Try another →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Hangman() {
  useDocumentMeta('Hangman', 'Play Hangman with real American English words and phrases from the HowTheyTalk collection.')
  const [searchParams] = useSearchParams()
  const preselectedCatId = searchParams.get('category')

  const [selectedCat, setSelectedCat] = useState(null)

  useEffect(() => {
    if (selectedCat && window.innerWidth <= 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [selectedCat])
  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(false)
  const [started, setStarted] = useState(false)

  const { data: categoriesData, isLoading: catsLoading } = useQuery({ queryKey: ['categories'], queryFn: getCategories })
  const categories = (categoriesData?.data || []).filter(cat => cat.attributes.name !== 'Usage Difference')

  useEffect(() => {
    if (preselectedCatId && categories.length > 0 && !selectedCat) {
      const cat = categories.find(c => c.id === preselectedCatId)
      if (cat) setSelectedCat(cat)
    }
  }, [preselectedCatId, categories, selectedCat])

  async function loadEntry() {
    setLoading(true)
    setEntry(null)
    const e = await getRandomEntry(selectedCat.id)
    setEntry(e)
    setStarted(true)
    setLoading(false)
  }

  if (started && entry) return <HangmanGame entry={entry} categoryName={selectedCat.attributes.name} onNext={loadEntry} onExit={() => { setStarted(false); setEntry(null); setSelectedCat(null); }} />

  return (
    <div className="hangman-page">
      <div className="page-header">
        <h1 className="page-title">🎯 Hangman</h1>
        <p className="page-subtitle">Guess the word letter by letter. Every word comes from the HowTheyTalk collection.</p>
      </div>
      <div className="hm-instructions">
        <div className="hm-instruction-item">⌨️ Type letters or click the keyboard</div>
        <div className="hm-instruction-item">💡 A hint is always shown</div>
        <div className="hm-instruction-item">🎯 6 wrong guesses allowed</div>
      </div>
      {catsLoading && <div className="loading">Loading categories...</div>}
      <div className="fc-category-grid">
        {categories.map(cat => (
          <button key={cat.id} className={`fc-category-card ${selectedCat?.id === cat.id ? 'fc-category-card--selected' : ''}`} onClick={() => setSelectedCat(cat)}>
            <div className="fc-category-name">{cat.attributes.name}</div>
            {cat.attributes.field_short_definition && <div className="fc-category-desc">{cat.attributes.field_short_definition.slice(0, 60)}...</div>}
          </button>
        ))}
      </div>
      {selectedCat && (
        <div className="fc-start">
          <p className="fc-start-text">Ready to play Hangman with <strong>{selectedCat.attributes.name}</strong> words?</p>
          <button className="btn-primary fc-start-btn" onClick={loadEntry} disabled={loading}>{loading ? 'Loading...' : 'Start game →'}</button>
        </div>
      )}
    </div>
  )
}

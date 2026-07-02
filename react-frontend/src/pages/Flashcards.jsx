import useDocumentMeta from '../hooks/useDocumentMeta'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getCategories } from '../api/drupal'
import axios from 'axios'

const DRUPAL_BASE = import.meta.env.VITE_DRUPAL_URL || 'http://192.168.1.157:9022'

async function getEntriesForCategory(categoryId) {
  let all = []
  let offset = 0
  while (true) {
    const res = await axios.get(`${DRUPAL_BASE}/jsonapi/node/language_entry`, {
      headers: { 'Accept': 'application/vnd.api+json' },
      params: {
        'filter[status]': 1,
        'sort': 'changed,drupal_internal__nid',
        'filter[field_main_category.id]': categoryId,
        'page[limit]': 50,
        'page[offset]': offset,
        'fields[node--language_entry]': 'title,field_short_meaning,field_detailed_explanation,path',
      }
    })
    const entries = res.data.data || []
    all = all.concat(entries)
    if (entries.length < 50) break
    offset += 50
  }
  return all.sort(() => Math.random() - 0.5)
}

function FlashcardDeck({ cards, categoryName, onExit }) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState(0)
  const [skipped, setSkipped] = useState(0)
  const [done, setDone] = useState(false)

  const card = cards[index]
  const total = cards.length
  const progress = Math.round((index / total) * 100)

  function handleKnow() { setKnown(k => k + 1); advance() }
  function handleSkip() { setSkipped(s => s + 1); advance() }
  function advance() {
    setFlipped(false)
    setTimeout(() => {
      if (index + 1 >= total) setDone(true)
      else setIndex(i => i + 1)
    }, 150)
  }

  if (done) {
    return (
      <div className="fc-done">
        <div className="fc-done-icon">🎉</div>
        <h2 className="fc-done-title">Session complete!</h2>
        <p className="fc-done-sub">You went through all {total} cards in <strong>{categoryName}</strong></p>
        <div className="fc-done-stats">
          <div className="fc-stat fc-stat--known"><div className="fc-stat-num">{known}</div><div className="fc-stat-label">Got it</div></div>
          <div className="fc-stat fc-stat--skipped"><div className="fc-stat-num">{skipped}</div><div className="fc-stat-label">Skipped</div></div>
          <div className="fc-stat"><div className="fc-stat-num">{Math.round((known / total) * 100)}%</div><div className="fc-stat-label">Score</div></div>
        </div>
        <div className="fc-done-actions">
          <button className="btn-primary" onClick={() => { setIndex(0); setFlipped(false); setKnown(0); setSkipped(0); setDone(false); }}>Try again</button>
          <button className="btn-secondary" onClick={onExit}>Choose another category</button>
        </div>
      </div>
    )
  }

  return (
    <div className="fc-deck">
      <div className="fc-deck-header">
        <button className="fc-back-btn" onClick={onExit}>← Categories</button>
        <span className="fc-deck-title">{categoryName}</span>
        <span className="fc-counter">{index + 1} / {total}</span>
      </div>
      <div className="fc-progress-bar"><div className="fc-progress-fill" style={{ width: `${progress}%` }} /></div>
      <div className={`fc-card ${flipped ? 'fc-card--flipped' : ''}`} onClick={() => setFlipped(f => !f)}>
        <div className="fc-card-inner">
          <div className="fc-card-front">
            <div className="fc-card-label">Word / Phrase</div>
            <div className="fc-card-word">{card.attributes.title}</div>
            <div className="fc-card-hint">Tap to reveal meaning</div>
          </div>
          <div className="fc-card-back">
            <div className="fc-card-label">Meaning</div>
            <div className="fc-card-meaning">{card.attributes.field_short_meaning}</div>
            {card.attributes.field_detailed_explanation?.processed && (
              <div className="fc-card-detail" dangerouslySetInnerHTML={{ __html: card.attributes.field_detailed_explanation.processed }} />
            )}
            {card.attributes.path?.alias && (
              <Link to={card.attributes.path.alias} className="fc-card-full-link" onClick={e => e.stopPropagation()} target="_blank">Full entry ↗</Link>
            )}
          </div>
        </div>
      </div>
      <div className="fc-actions">
        <button className="fc-btn fc-btn--skip" onClick={handleSkip} disabled={!flipped}><span>✗</span> Skip</button>
        <button className="fc-btn fc-btn--know" onClick={handleKnow} disabled={!flipped}><span>✓</span> Got it</button>
      </div>
      <p className="fc-flip-hint">{flipped ? 'Click Skip or Got it to continue' : 'Tap the card to flip it'}</p>
    </div>
  )
}

export default function Flashcards() {
  useDocumentMeta('Flashcards', 'Practice American English words and phrases with interactive flashcards by category.')
  const [searchParams] = useSearchParams()
  const preselectedCatId = searchParams.get('category')

  const [selectedCat, setSelectedCat] = useState(null)

  useEffect(() => {
    if (selectedCat && window.innerWidth <= 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [selectedCat])
  const [started, setStarted] = useState(false)

  const { data: categoriesData, isLoading: catsLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  })

  const categories = (categoriesData?.data || []).filter(
    cat => cat.attributes.name !== 'Usage Difference'
  )

  // Auto-select category from URL param
  useEffect(() => {
    if (preselectedCatId && categories.length > 0 && !selectedCat) {
      const cat = categories.find(c => c.id === preselectedCatId)
      if (cat) setSelectedCat(cat)
    }
  }, [preselectedCatId, categories, selectedCat])

  const { data: cards, isLoading: cardsLoading } = useQuery({
    queryKey: ['flashcards', selectedCat?.id],
    queryFn: () => getEntriesForCategory(selectedCat.id),
    enabled: !!selectedCat && started,
  })

  if (started && selectedCat) {
    if (cardsLoading) return <div className="loading">Loading flashcards...</div>
    if (!cards || cards.length === 0) return (
      <div className="not-found">
        <p>No entries found for this category.</p>
        <button className="btn-secondary" onClick={() => { setStarted(false); setSelectedCat(null); }}>Go back</button>
      </div>
    )
    return <FlashcardDeck cards={cards} categoryName={selectedCat.attributes.name} onExit={() => { setStarted(false); setSelectedCat(null); }} />
  }

  return (
    <div className="flashcards-page">
      <div className="page-header">
        <h1 className="page-title">🃏 Flashcards</h1>
        <p className="page-subtitle">Pick a category and flip through words and phrases. Tap each card to reveal the meaning.</p>
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
          <p className="fc-start-text">Ready to practice <strong>{selectedCat.attributes.name}</strong>?</p>
          <button className="btn-primary fc-start-btn" onClick={() => setStarted(true)}>Start flashcards →</button>
        </div>
      )}
    </div>
  )
}

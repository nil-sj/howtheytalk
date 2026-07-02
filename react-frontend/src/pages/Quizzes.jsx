import useDocumentMeta from '../hooks/useDocumentMeta'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getCategories } from '../api/drupal'
import axios from 'axios'

const DRUPAL_BASE = import.meta.env.VITE_DRUPAL_URL || 'http://192.168.1.157:9022'

async function getEntriesForQuiz(categoryId) {
  let all = []
  let offset = 0
  while (true) {
    const res = await axios.get(`${DRUPAL_BASE}/jsonapi/node/language_entry`, {
      headers: { 'Accept': 'application/vnd.api+json' },
      params: { 'filter[status]': 1, 'sort': 'changed,drupal_internal__nid', 'filter[field_main_category.id]': categoryId, 'page[limit]': 50, 'page[offset]': offset, 'fields[node--language_entry]': 'title,field_short_meaning' }
    })
    const entries = res.data.data || []
    all = all.concat(entries)
    if (entries.length < 50) break
    offset += 50
  }
  return all.filter(e => e.attributes.field_short_meaning)
}

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

function buildQuestions(entries) {
  if (entries.length < 4) return []
  const shuffled = shuffle(entries).slice(0, 10)
  return shuffled.map(entry => {
    const wrong = shuffle(entries.filter(e => e.id !== entry.id)).slice(0, 3)
    const options = shuffle([
      { text: entry.attributes.field_short_meaning, correct: true },
      ...wrong.map(e => ({ text: e.attributes.field_short_meaning, correct: false }))
    ])
    return { question: entry.attributes.title, options }
  })
}

function QuizGame({ questions, categoryName, onExit }) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [answers, setAnswers] = useState([])
  const q = questions[index]
  const total = questions.length

  function handleSelect(option) {
    if (selected) return
    setSelected(option)
    if (option.correct) setScore(s => s + 1)
    setAnswers(a => [...a, { question: q.question, correct: option.correct, chosen: option.text, answer: q.options.find(o => o.correct).text }])
  }

  function handleNext() {
    setSelected(null)
    if (index + 1 >= total) setDone(true)
    else setIndex(i => i + 1)
  }

  if (done) {
    const pct = Math.round((score / total) * 100)
    const emoji = pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '📚'
    return (
      <div className="quiz-done">
        <div className="quiz-done-icon">{emoji}</div>
        <h2 className="quiz-done-title">Quiz complete!</h2>
        <p className="quiz-done-sub">You scored <strong>{score} out of {total}</strong> on <strong>{categoryName}</strong></p>
        <div className="quiz-score-bar"><div className="quiz-score-fill" style={{ width: `${pct}%`, background: pct >= 80 ? 'var(--accent)' : pct >= 50 ? 'var(--amber)' : '#e74c3c' }} /></div>
        <p className="quiz-score-pct">{pct}%</p>
        <div className="quiz-review">
          <h3 className="quiz-review-title">Review</h3>
          {answers.map((a, i) => (
            <div key={i} className={`quiz-review-item ${a.correct ? 'quiz-review-item--correct' : 'quiz-review-item--wrong'}`}>
              <div className="quiz-review-q">{a.correct ? '✓' : '✗'} <strong>{a.question}</strong></div>
              {!a.correct && <div className="quiz-review-answer">Your answer: {a.chosen}<br />Correct: {a.answer}</div>}
            </div>
          ))}
        </div>
        <div className="quiz-done-actions">
          <button className="btn-primary" onClick={() => { setIndex(0); setSelected(null); setScore(0); setDone(false); setAnswers([]); }}>Try again</button>
          <button className="btn-secondary" onClick={onExit}>Choose another category</button>
        </div>
      </div>
    )
  }

  return (
    <div className="quiz-game">
      <div className="quiz-header">
        <button className="fc-back-btn" onClick={onExit}>← Categories</button>
        <span className="fc-deck-title">{categoryName}</span>
        <span className="fc-counter">{index + 1} / {total}</span>
      </div>
      <div className="quiz-progress-bar"><div className="quiz-progress-fill" style={{ width: `${Math.round((index / total) * 100)}%` }} /></div>
      <div className="quiz-question-card">
        <div className="quiz-question-label">What does this mean?</div>
        <h2 className="quiz-question">{q.question}</h2>
      </div>
      <div className="quiz-options">
        {q.options.map((option, i) => {
          let cls = 'quiz-option'
          if (selected) { if (option.correct) cls += ' quiz-option--correct'; else if (option === selected) cls += ' quiz-option--wrong' }
          return (
            <button key={i} className={cls} onClick={() => handleSelect(option)} disabled={!!selected}>
              <span className="quiz-option-letter">{String.fromCharCode(65 + i)}</span>
              <span className="quiz-option-text">{option.text}</span>
            </button>
          )
        })}
      </div>
      {selected && <div className={`quiz-feedback ${selected.correct ? 'quiz-feedback--correct' : 'quiz-feedback--wrong'}`}><span>{selected.correct ? '✓ Correct!' : '✗ Not quite.'}</span>{!selected.correct && <span> The answer is: {q.options.find(o => o.correct).text}</span>}</div>}
      {selected && <button className="btn-primary quiz-next-btn" onClick={handleNext}>{index + 1 >= total ? 'See results' : 'Next question →'}</button>}
    </div>
  )
}

export default function Quizzes() {
  useDocumentMeta('Quizzes', 'Test your knowledge of American English idioms, vocabulary, and phrases with short quizzes.')
  const [searchParams] = useSearchParams()
  const preselectedCatId = searchParams.get('category')

  const [selectedCat, setSelectedCat] = useState(null)

  useEffect(() => {
    if (selectedCat && window.innerWidth <= 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [selectedCat])
  const [started, setStarted] = useState(false)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)

  const { data: categoriesData, isLoading: catsLoading } = useQuery({ queryKey: ['categories'], queryFn: getCategories })
  const categories = (categoriesData?.data || []).filter(cat => cat.attributes.name !== 'Usage Difference')

  useEffect(() => {
    if (preselectedCatId && categories.length > 0 && !selectedCat) {
      const cat = categories.find(c => c.id === preselectedCatId)
      if (cat) setSelectedCat(cat)
    }
  }, [preselectedCatId, categories, selectedCat])

  async function handleStart() {
    setLoading(true)
    const entries = await getEntriesForQuiz(selectedCat.id)
    const qs = buildQuestions(entries)
    setQuestions(qs)
    setStarted(true)
    setLoading(false)
  }

  if (started && questions.length > 0) return <QuizGame questions={questions} categoryName={selectedCat.attributes.name} onExit={() => { setStarted(false); setSelectedCat(null); setQuestions([]); }} />

  return (
    <div className="quizzes-page">
      <div className="page-header">
        <h1 className="page-title">🧩 Quizzes</h1>
        <p className="page-subtitle">Test your knowledge. Pick a category and answer 10 multiple-choice questions.</p>
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
          <p className="fc-start-text">Ready to quiz yourself on <strong>{selectedCat.attributes.name}</strong>?</p>
          <button className="btn-primary fc-start-btn" onClick={handleStart} disabled={loading}>{loading ? 'Loading...' : 'Start quiz →'}</button>
        </div>
      )}
    </div>
  )
}

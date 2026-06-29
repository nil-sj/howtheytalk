import { Link } from 'react-router-dom'

const features = [
  {
    emoji: '🔄',
    title: 'Usage Differences',
    description: 'Explore pairs of words that are often confused or used interchangeably — like Rock vs Stone, House vs Home, or Borrow vs Lend. Understand the subtle but important differences in how each word is used.',
    cta: 'Browse usage differences',
    link: '/usage-difference',
    available: true,
    color: 'teal',
  },
  {
    emoji: '🃏',
    title: 'Flashcards',
    description: 'Practice English words and phrases with interactive flashcards. Flip through themed sets — workplace English, Indian vs American English, everyday expressions — and test your recall.',
    cta: 'Coming soon',
    link: null,
    available: false,
    color: 'purple',
  },
  {
    emoji: '🧩',
    title: 'Quizzes',
    description: 'Test your knowledge of American English with short, fun quizzes. Multiple-choice questions on idioms, vocabulary, workplace phrases, and cultural expressions — with explanations for every answer.',
    cta: 'Coming soon',
    link: null,
    available: false,
    color: 'amber',
  },
  {
    emoji: '📅',
    title: 'Word of the Day',
    description: 'A new English word or phrase every day — with its meaning, usage examples, notes, and cultural context. Build your vocabulary one day at a time without feeling overwhelmed.',
    cta: 'Coming soon',
    link: null,
    available: false,
    color: 'green',
  },
  {
    emoji: '🎯',
    title: 'Hangman',
    description: 'The classic word-guessing game, but with a twist — every word comes from the TalkNotes collection. Guess the phrase letter by letter, and learn its meaning when the round ends.',
    cta: 'Coming soon',
    link: null,
    available: false,
    color: 'coral',
  },
]

const colorMap = {
  teal:   { bg: '#e1f5ee', border: '#5DCAA5', text: '#085041', emoji: '#1D9E75' },
  purple: { bg: '#EEEDFE', border: '#AFA9EC', text: '#26215C', emoji: '#534AB7' },
  amber:  { bg: '#FAEEDA', border: '#EF9F27', text: '#412402', emoji: '#BA7517' },
  green:  { bg: '#EAF3DE', border: '#97C459', text: '#173404', emoji: '#3B6D11' },
  coral:  { bg: '#FAECE7', border: '#F0997B', text: '#4A1B0C', emoji: '#993C1D' },
}

export default function Explore() {
  return (
    <div className="explore-page">
      <div className="page-header">
        <h1 className="page-title">Explore</h1>
        <p className="page-subtitle">Go beyond reading — practice, play, and deepen your understanding of English</p>
      </div>

      <div className="explore-grid">
        {features.map(feature => {
          const colors = colorMap[feature.color]
          return (
            <div
              key={feature.title}
              className={`explore-card ${!feature.available ? 'explore-card--soon' : ''}`}
              style={{ '--card-bg': colors.bg, '--card-border': colors.border, '--card-text': colors.text, '--card-emoji': colors.emoji }}
            >
              <div className="explore-card-emoji">{feature.emoji}</div>
              <h2 className="explore-card-title">{feature.title}</h2>
              <p className="explore-card-desc">{feature.description}</p>
              <div className="explore-card-footer">
                {feature.available ? (
                  <Link to={feature.link} className="explore-card-cta">
                    {feature.cta} →
                  </Link>
                ) : (
                  <span className="explore-card-soon-badge">Coming soon</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { quizAPI } from '../services/api'

const CATEGORIES = ['All', 'Science', 'History', 'Math', 'Technology', 'Sports', 'General']

export default function HomePage() {
  const [quizzes, setQuizzes]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('All')
  const [searching, setSearching] = useState(false)

  const fetchQuizzes = useCallback(async () => {
    try {
      setLoading(true)
      const res = await quizAPI.getAll()
      setQuizzes(res.data)
    } catch {
      setError('Failed to load quizzes')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchQuizzes() }, [fetchQuizzes])

  // Debounced search
  useEffect(() => {
    if (!search.trim()) { fetchQuizzes(); return }
    const t = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await quizAPI.search(search.trim())
        setQuizzes(res.data)
      } catch { setError('Search failed') }
      finally { setSearching(false) }
    }, 400)
    return () => clearTimeout(t)
  }, [search, fetchQuizzes])

  const filtered = category === 'All'
    ? quizzes
    : quizzes.filter(q => q.category?.toLowerCase() === category.toLowerCase())

  return (
    <div className="page">
      {/* Hero */}
      <div style={{ marginBottom: 40, animation: 'fadeUp 0.5s ease' }}>
        <div className="section-title" style={{ fontSize: 36 }}>
          Find Your <span style={{
            background: 'linear-gradient(90deg,var(--accent),var(--accent2))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>Quiz</span>
        </div>
        <div className="section-sub" style={{ fontSize: 15 }}>
          Challenge yourself, beat the clock, top the leaderboard
        </div>
      </div>

      {/* Search */}
      <div className="search-wrap">
        <input
          className="input"
          placeholder="🔍  Search quizzes by title, category, description…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button className="btn btn-secondary" onClick={() => setSearch('')}>Clear</button>
        )}
      </div>

      {/* Category pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              padding: '6px 16px',
              borderRadius: 99,
              border: `1.5px solid ${category === cat ? 'var(--accent)' : 'var(--border)'}`,
              background: category === cat ? '#7c6dfa22' : 'transparent',
              color: category === cat ? 'var(--accent)' : 'var(--muted)',
              fontFamily: 'var(--font-head)',
              fontSize: 13, fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Content */}
      {error && <div className="error-box">{error}</div>}

      {(loading || searching) ? (
        <div className="loader-center"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 700 }}>No quizzes found</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Try a different search or category</div>
        </div>
      ) : (
        <div className="quiz-grid">
          {filtered.map((quiz, i) => (
            <Link
              key={quiz.id}
              to={`/quiz/${quiz.id}`}
              className="quiz-card"
              style={{ animationDelay: `${i * 0.06}s`, animation: 'fadeUp 0.5s ease forwards', opacity: 0 }}
            >
              {/* Category badge */}
              <div>
                <span className="badge badge-purple">{quiz.category || 'General'}</span>
              </div>

              <div className="quiz-card-title">{quiz.title}</div>
              <div className="quiz-card-desc">
                {quiz.description?.slice(0, 80) || 'Test your knowledge with this quiz'}
                {quiz.description?.length > 80 ? '…' : ''}
              </div>

              <div className="quiz-card-meta">
                <span>📝 {quiz.questionCount || '?'} questions</span>
                <span>⏱ {quiz.timeLimitMinutes || 10} min</span>
                {quiz.createdBy && <span>👤 {quiz.createdBy}</span>}
              </div>

              <div style={{
                marginTop: 4,
                color: 'var(--accent)',
                fontFamily: 'var(--font-head)',
                fontSize: 13, fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: 4
              }}>
                Start Quiz →
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

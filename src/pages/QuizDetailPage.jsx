import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { quizAPI } from '../services/api'

export default function QuizDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    quizAPI.getById(id)
      .then(res => setQuiz(res.data))
      .catch(() => setError('Quiz not found'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="loader-center"><div className="spinner" /></div>
  if (error)   return <div className="page"><div className="error-box">{error}</div></div>

  return (
    <div className="page" style={{ maxWidth: 700 }}>
      <Link to="/" className="btn btn-secondary" style={{ marginBottom: 28, display: 'inline-flex' }}>
        ← Back to quizzes
      </Link>

      <div className="card" style={{ animation: 'fadeUp 0.4s ease' }}>
        <span className="badge badge-purple" style={{ marginBottom: 16, display: 'inline-block' }}>
          {quiz.category || 'General'}
        </span>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
          {quiz.title}
        </h1>
        <p style={{ color: 'var(--muted)', marginBottom: 28 }}>
          {quiz.description || 'Test your knowledge with this exciting quiz!'}
        </p>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 32 }}>
          {[
            { icon: '📝', label: 'Questions', value: quiz.questions?.length || 0 },
            { icon: '⏱',  label: 'Time Limit', value: `${quiz.timeLimitMinutes || 10} min` },
            { icon: '⭐', label: 'Total Marks', value: quiz.questions?.reduce((a, q) => a + (q.marks || 1), 0) || 0 },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'var(--bg3)', borderRadius: 'var(--radius-sm)',
              padding: '16px', textAlign: 'center',
              border: '1px solid var(--border)',
            }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{stat.icon}</div>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 20 }}>{stat.value}</div>
              <div style={{ color: 'var(--muted)', fontSize: 12 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Rules */}
        <div style={{
          background: '#7c6dfa12', border: '1px solid #7c6dfa33',
          borderRadius: 'var(--radius-sm)', padding: 16, marginBottom: 28
        }}>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, marginBottom: 8, color: 'var(--accent)' }}>
            📋 Rules
          </div>
          <ul style={{ color: 'var(--muted)', fontSize: 13, paddingLeft: 16, lineHeight: 2 }}>
            <li>Answer all MCQ questions before time runs out</li>
            <li>Each question has only one correct answer</li>
            <li>You can navigate between questions freely</li>
            <li>Your score is saved to the leaderboard</li>
          </ul>
        </div>

        <button
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', fontSize: 16, padding: '14px' }}
          onClick={() => navigate(`/quiz/${id}/play`)}
        >
          🚀 Start Quiz
        </button>
      </div>
    </div>
  )
}

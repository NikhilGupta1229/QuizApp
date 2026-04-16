import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { leaderboardAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function MyScoresPage() {
  const { user }            = useAuth()
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')

  useEffect(() => {
    leaderboardAPI.getMyScores()
      .then(res => setScores(res.data))
      .catch(() => setError('Failed to load your scores'))
      .finally(() => setLoading(false))
  }, [])

  const avgPct = scores.length
    ? Math.round(scores.reduce((a, s) => a + (s.totalMarks ? (s.score / s.totalMarks) * 100 : 0), 0) / scores.length)
    : 0

  const bestScore = scores.length
    ? scores.reduce((best, s) => {
        const pct = s.totalMarks ? (s.score / s.totalMarks) * 100 : 0
        const bestPct = best.totalMarks ? (best.score / best.totalMarks) * 100 : 0
        return pct > bestPct ? s : best
      }, scores[0])
    : null

  return (
    <div className="page" style={{ maxWidth: 800 }}>
      <div style={{ marginBottom: 32, animation: 'fadeUp 0.4s ease' }}>
        <div className="section-title">📊 My Scores</div>
        <div className="section-sub">Your quiz history, {user?.username}</div>
      </div>

      {/* Summary cards */}
      {scores.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 28 }}>
          {[
            { icon: '🎯', label: 'Quizzes Played', value: scores.length },
            { icon: '📈', label: 'Avg Score',       value: `${avgPct}%` },
            { icon: '🏆', label: 'Best Score',      value: bestScore ? `${Math.round((bestScore.score / bestScore.totalMarks) * 100)}%` : '—' },
          ].map(s => (
            <div key={s.label} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 24 }}>{s.value}</div>
              <div style={{ color: 'var(--muted)', fontSize: 12 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {error   && <div className="error-box">{error}</div>}
      {loading && <div className="loader-center"><div className="spinner" /></div>}

      {!loading && !error && scores.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎮</div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
            No quizzes attempted yet
          </div>
          <p style={{ color: 'var(--muted)', marginBottom: 20 }}>Start playing to see your scores here</p>
          <Link to="/" className="btn btn-primary">Browse Quizzes →</Link>
        </div>
      )}

      {!loading && scores.length > 0 && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="lb-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Quiz</th>
                <th style={{ textAlign: 'right' }}>Score</th>
                <th style={{ textAlign: 'right' }}>%</th>
                <th style={{ textAlign: 'right' }}>Time</th>
                <th style={{ textAlign: 'right' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((s, idx) => {
                const pct = s.totalMarks ? Math.round((s.score / s.totalMarks) * 100) : 0
                const mins = s.timeTakenSeconds ? Math.floor(s.timeTakenSeconds / 60) : 0
                const secs = s.timeTakenSeconds ? s.timeTakenSeconds % 60 : 0
                return (
                  <tr key={idx} style={{ animation: `fadeUp 0.4s ease ${idx * 0.05}s forwards`, opacity: 0 }}>
                    <td style={{ color: 'var(--muted)' }}>{idx + 1}</td>
                    <td style={{ fontFamily: 'var(--font-head)', fontWeight: 700 }}>
                      {s.quizTitle || 'Unknown Quiz'}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>
                      {s.score}/{s.totalMarks}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={`badge ${pct >= 70 ? 'badge-green' : pct >= 40 ? 'badge-purple' : 'badge-red'}`}>
                        {pct}%
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', color: 'var(--muted)', fontSize: 13 }}>
                      {s.timeTakenSeconds ? `${mins}m ${secs}s` : '—'}
                    </td>
                    <td style={{ textAlign: 'right', color: 'var(--muted)', fontSize: 12 }}>
                      {s.attemptedAt ? new Date(s.attemptedAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

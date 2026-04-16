import { useState, useEffect } from 'react'
import { leaderboardAPI } from '../services/api'

const MEDALS = ['🥇', '🥈', '🥉']

export default function LeaderboardPage() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    leaderboardAPI.getGlobal()
      .then(res => setEntries(res.data))
      .catch(() => setError('Failed to load leaderboard'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page" style={{ maxWidth: 800 }}>
      <div style={{ marginBottom: 32, animation: 'fadeUp 0.4s ease' }}>
        <div className="section-title">🏆 Leaderboard</div>
        <div className="section-sub">Top performers across all quizzes</div>
      </div>

      {error   && <div className="error-box">{error}</div>}
      {loading && <div className="loader-center"><div className="spinner" /></div>}

      {!loading && !error && (
        <div className="card" style={{ padding: 0, overflow: 'hidden', animation: 'fadeUp 0.5s ease' }}>
          <table className="lb-table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>Rank</th>
                <th>Player</th>
                <th>Quiz</th>
                <th style={{ textAlign: 'right' }}>Score</th>
                <th style={{ textAlign: 'right' }}>%</th>
                <th style={{ textAlign: 'right' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 16px' }}>
                    No attempts yet. Be the first to play!
                  </td>
                </tr>
              ) : entries.map((entry, idx) => {
                const pct = entry.totalMarks
                  ? Math.round((entry.score / entry.totalMarks) * 100)
                  : 0
                return (
                  <tr key={idx}>
                    <td>
                      <span className="rank-medal" style={{
                        color: idx < 3 ? ['#ffd700','#c0c0c0','#cd7f32'][idx] : 'var(--muted)'
                      }}>
                        {idx < 3 ? MEDALS[idx] : `#${idx + 1}`}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700 }}>
                        {entry.username}
                      </span>
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: 13 }}>
                      {entry.quizTitle || '—'}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-head)', fontWeight: 700 }}>
                      {entry.score}/{entry.totalMarks}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={`badge ${pct >= 70 ? 'badge-green' : pct >= 40 ? 'badge-purple' : 'badge-red'}`}>
                        {pct}%
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', color: 'var(--muted)', fontSize: 12 }}>
                      {entry.attemptedAt
                        ? new Date(entry.attemptedAt).toLocaleDateString()
                        : '—'}
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

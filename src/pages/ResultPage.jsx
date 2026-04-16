import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useEffect } from 'react'

function getGrade(pct) {
  if (pct >= 90) return { grade: 'A+', color: '#4dfaaa', bg: '#4dfaaa18', label: 'Outstanding! 🏆' }
  if (pct >= 80) return { grade: 'A',  color: '#4dfaaa', bg: '#4dfaaa15', label: 'Excellent! 🎉' }
  if (pct >= 70) return { grade: 'B',  color: '#fac44d', bg: '#fac44d18', label: 'Good job! 👍' }
  if (pct >= 60) return { grade: 'C',  color: '#fac44d', bg: '#fac44d15', label: 'Not bad! 📚' }
  if (pct >= 40) return { grade: 'D',  color: '#fa6d9f', bg: '#fa6d9f15', label: 'Keep practicing! 💪' }
  return             { grade: 'F',  color: '#fa4d6d', bg: '#fa4d6d15', label: 'Try again! 🔄' }
}

export default function ResultPage() {
  const { state }  = useLocation()
  const navigate   = useNavigate()

  useEffect(() => {
    if (!state?.result) navigate('/', { replace: true })
  }, [state, navigate])

  if (!state?.result) return null

  const { result, quizTitle, auto } = state
  const pct = result.percentage ?? Math.round((result.score / result.totalMarks) * 100)
  const { grade, color, bg, label } = getGrade(pct)

  // Circle chart
  const radius = 64
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (pct / 100) * circumference

  return (
    <div className="page" style={{ maxWidth: 640 }}>
      {auto && (
        <div style={{
          background: '#fac44d18', border: '1px solid #fac44d44',
          borderRadius: 'var(--radius-sm)', padding: '10px 16px',
          color: 'var(--warning)', fontSize: 13, marginBottom: 20,
          textAlign: 'center'
        }}>
          ⏰ Time's up! Quiz was auto-submitted.
        </div>
      )}

      <div className="result-hero">
        {/* Score circle */}
        <div className="score-circle">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r={radius} fill="none" stroke="var(--border)" strokeWidth="10" />
            <circle
              cx="80" cy="80" r={radius}
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div className="score-text">
            <div className="score-pct" style={{ color }}>{pct}%</div>
            <div className="score-label">Score</div>
          </div>
        </div>

        {/* Grade */}
        <div className="grade-tag" style={{ background: bg, color }}>
          Grade {grade}
        </div>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 800, marginBottom: 6 }}>
          {label}
        </h2>
        {quizTitle && (
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>{quizTitle}</p>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { icon: '✅', label: 'Your Score',   value: result.score },
          { icon: '🎯', label: 'Total Marks',  value: result.totalMarks },
          { icon: '📊', label: 'Percentage',   value: `${pct}%` },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 22 }}>{s.value}</div>
            <div style={{ color: 'var(--muted)', fontSize: 12 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12 }}>
        <Link to="/" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
          ← Browse Quizzes
        </Link>
        <Link to="/leaderboard" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
          🏆 Leaderboard
        </Link>
      </div>
    </div>
  )
}

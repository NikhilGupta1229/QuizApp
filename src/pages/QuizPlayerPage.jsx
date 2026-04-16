import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { quizAPI } from '../services/api'

const LETTERS = ['A', 'B', 'C', 'D', 'E']

export default function QuizPlayerPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [quiz, setQuiz]             = useState(null)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [current, setCurrent]       = useState(0)
  const [answers, setAnswers]       = useState({})  // { questionId: optionId }
  const [timeLeft, setTimeLeft]     = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const startTime = useRef(Date.now())

  useEffect(() => {
    quizAPI.getById(id)
      .then(res => {
        setQuiz(res.data)
        setTimeLeft((res.data.timeLimitMinutes || 10) * 60)
      })
      .catch(() => setError('Failed to load quiz'))
      .finally(() => setLoading(false))
  }, [id])

  // Submit handler (defined early so timer can call it)
  const handleSubmit = useCallback(async (auto = false) => {
    if (submitting) return
    setSubmitting(true)
    const timeTaken = Math.floor((Date.now() - startTime.current) / 1000)
    const answersArr = Object.entries(answers).map(([questionId, selectedOptionId]) => ({
      questionId: Number(questionId),
      selectedOptionId: Number(selectedOptionId),
    }))
    try {
      const res = await quizAPI.submit({
        quizId: Number(id),
        answers: answersArr,
        timeTakenSeconds: timeTaken,
      })
      navigate('/result', { state: { result: res.data, quizTitle: quiz.title, auto } })
    } catch (err) {
      setError('Failed to submit. Please try again.')
      setSubmitting(false)
    }
  }, [submitting, answers, id, quiz, navigate])

  // Countdown timer
  useEffect(() => {
    if (!quiz || timeLeft <= 0) return
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(t); handleSubmit(true); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [quiz, handleSubmit, timeLeft])

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
  }

  const timerClass = timeLeft < 30 ? 'timer-display danger'
                   : timeLeft < 60 ? 'timer-display warning'
                   : 'timer-display'

  if (loading) return <div className="loader-center"><div className="spinner" /></div>
  if (error)   return <div className="page"><div className="error-box">{error}</div></div>

  const questions = quiz.questions || []
  const q = questions[current]
  const totalQ = questions.length
  const answeredCount = Object.keys(answers).length

  const selectOption = (optionId) => {
    setAnswers(prev => ({ ...prev, [q.id]: optionId }))
  }

  const goNext = () => { if (current < totalQ - 1) setCurrent(c => c + 1) }
  const goPrev = () => { if (current > 0) setCurrent(c => c - 1) }

  return (
    <div className="page">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 20 }}>{quiz.title}</h2>
          <div style={{ color: 'var(--muted)', fontSize: 13 }}>
            {answeredCount} of {totalQ} answered
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ width: 200 }}>
          <div style={{
            height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${(answeredCount / totalQ) * 100}%`,
              background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
              borderRadius: 99, transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
            {Math.round((answeredCount / totalQ) * 100)}% done
          </div>
        </div>
      </div>

      <div className="quiz-player-layout">
        {/* Question Area */}
        <div>
          <div className="question-card" key={current} style={{ animation: 'slideIn 0.3s ease' }}>
            <div className="question-number">Question {current + 1} of {totalQ}</div>
            <div className="question-text">{q.questionText}</div>

            <div className="options-list">
              {(q.options || []).map((opt, idx) => {
                const isSelected = answers[q.id] === opt.id
                return (
                  <button
                    key={opt.id}
                    className={`option-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => selectOption(opt.id)}
                  >
                    <span className="option-letter"
                      style={isSelected ? { background: 'var(--accent)', color: '#fff' } : {}}>
                      {LETTERS[idx]}
                    </span>
                    {opt.optionText}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Nav buttons */}
          <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'space-between' }}>
            <button className="btn btn-secondary" onClick={goPrev} disabled={current === 0}>
              ← Previous
            </button>
            <div style={{ display: 'flex', gap: 12 }}>
              {current < totalQ - 1 ? (
                <button className="btn btn-primary" onClick={goNext}>
                  Next →
                </button>
              ) : (
                <button
                  className="btn btn-success"
                  onClick={() => handleSubmit(false)}
                  disabled={submitting}
                  style={{ padding: '11px 28px' }}
                >
                  {submitting ? 'Submitting…' : '✅ Submit Quiz'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="quiz-sidebar">
          {/* Timer */}
          <div className="timer-card">
            <div style={{ color: 'var(--muted)', fontSize: 11, fontFamily: 'var(--font-head)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
              Time Left
            </div>
            <div className={timerClass}>{formatTime(timeLeft)}</div>
          </div>

          {/* Question dots */}
          <div className="progress-nav">
            <div className="progress-nav-title">Questions</div>
            <div className="q-dots">
              {questions.map((question, idx) => (
                <button
                  key={question.id}
                  className={`q-dot ${idx === current ? 'current' : answers[question.id] ? 'answered' : ''}`}
                  onClick={() => setCurrent(idx)}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--muted)' }}>
              <span style={{ color: 'var(--accent)' }}>■</span> Answered &nbsp;
              <span style={{ color: 'var(--border)' }}>■</span> Skipped
            </div>
          </div>

          {/* Submit early */}
          <button
            className="btn btn-danger"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => {
              if (window.confirm(`Submit now? You have answered ${answeredCount}/${totalQ} questions.`)) {
                handleSubmit(false)
              }
            }}
            disabled={submitting}
          >
            {submitting ? 'Submitting…' : '🏁 Finish Early'}
          </button>
        </div>
      </div>
    </div>
  )
}

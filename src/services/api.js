// ── MOCK API (no backend needed) ──────────────────────────

const delay = (ms = 500) => new Promise(r => setTimeout(r, ms))

// ── Mock Quiz Data ─────────────────────────────────────────
const MOCK_QUIZZES = [
  {
    id: 1, title: 'JavaScript Fundamentals', category: 'Technology',
    description: 'Test your core JavaScript knowledge — variables, functions, closures and more.',
    timeLimitMinutes: 10, questionCount: 5, createdBy: 'admin',
    questions: [
      { id: 1, questionText: 'Which keyword declares a block-scoped variable in JavaScript?', marks: 1,
        options: [
          { id: 1, optionText: 'var' },
          { id: 2, optionText: 'let' },
          { id: 3, optionText: 'define' },
          { id: 4, optionText: 'static' },
        ]},
      { id: 2, questionText: 'What does "==" check in JavaScript?', marks: 1,
        options: [
          { id: 5, optionText: 'Value and type equality' },
          { id: 6, optionText: 'Only value equality (with type coercion)' },
          { id: 7, optionText: 'Reference equality' },
          { id: 8, optionText: 'None of the above' },
        ]},
      { id: 3, questionText: 'Which method adds an element to the END of an array?', marks: 1,
        options: [
          { id: 9,  optionText: 'push()' },
          { id: 10, optionText: 'pop()' },
          { id: 11, optionText: 'shift()' },
          { id: 12, optionText: 'unshift()' },
        ]},
      { id: 4, questionText: 'What is a closure in JavaScript?', marks: 2,
        options: [
          { id: 13, optionText: 'A function that returns another function' },
          { id: 14, optionText: 'A function with access to its outer scope variables' },
          { id: 15, optionText: 'A method inside a class' },
          { id: 16, optionText: 'An arrow function' },
        ]},
      { id: 5, questionText: 'Which of these is NOT a JavaScript data type?', marks: 1,
        options: [
          { id: 17, optionText: 'Symbol' },
          { id: 18, optionText: 'BigInt' },
          { id: 19, optionText: 'Float' },
          { id: 20, optionText: 'undefined' },
        ]},
    ],
    // correct answers (only used server-side in real app)
    _answers: { 1: 2, 2: 6, 3: 9, 4: 14, 5: 19 }
  },
  {
    id: 2, title: 'General Science', category: 'Science',
    description: 'Basic science questions from physics, chemistry and biology.',
    timeLimitMinutes: 8, questionCount: 4, createdBy: 'admin',
    questions: [
      { id: 6, questionText: 'What is the chemical symbol for Gold?', marks: 1,
        options: [
          { id: 21, optionText: 'Go' },
          { id: 22, optionText: 'Gd' },
          { id: 23, optionText: 'Au' },
          { id: 24, optionText: 'Ag' },
        ]},
      { id: 7, questionText: 'What is the speed of light (approx)?', marks: 1,
        options: [
          { id: 25, optionText: '3 × 10⁸ m/s' },
          { id: 26, optionText: '3 × 10⁶ m/s' },
          { id: 27, optionText: '3 × 10¹⁰ m/s' },
          { id: 28, optionText: '3 × 10⁴ m/s' },
        ]},
      { id: 8, questionText: 'Which organelle is the powerhouse of the cell?', marks: 1,
        options: [
          { id: 29, optionText: 'Nucleus' },
          { id: 30, optionText: 'Mitochondria' },
          { id: 31, optionText: 'Ribosome' },
          { id: 32, optionText: 'Golgi Apparatus' },
        ]},
      { id: 9, questionText: 'What gas do plants absorb during photosynthesis?', marks: 1,
        options: [
          { id: 33, optionText: 'Oxygen' },
          { id: 34, optionText: 'Nitrogen' },
          { id: 35, optionText: 'Carbon Dioxide' },
          { id: 36, optionText: 'Hydrogen' },
        ]},
    ],
    _answers: { 6: 23, 7: 25, 8: 30, 9: 35 }
  },
  {
    id: 3, title: 'World History', category: 'History',
    description: 'Major events and figures that shaped the modern world.',
    timeLimitMinutes: 12, questionCount: 4, createdBy: 'admin',
    questions: [
      { id: 10, questionText: 'In which year did World War II end?', marks: 1,
        options: [
          { id: 37, optionText: '1943' },
          { id: 38, optionText: '1944' },
          { id: 39, optionText: '1945' },
          { id: 40, optionText: '1946' },
        ]},
      { id: 11, questionText: 'Who was the first President of the United States?', marks: 1,
        options: [
          { id: 41, optionText: 'Abraham Lincoln' },
          { id: 42, optionText: 'Thomas Jefferson' },
          { id: 43, optionText: 'George Washington' },
          { id: 44, optionText: 'John Adams' },
        ]},
      { id: 12, questionText: 'The French Revolution began in which year?', marks: 2,
        options: [
          { id: 45, optionText: '1776' },
          { id: 46, optionText: '1789' },
          { id: 47, optionText: '1799' },
          { id: 48, optionText: '1804' },
        ]},
      { id: 13, questionText: 'Which empire was ruled by Genghis Khan?', marks: 1,
        options: [
          { id: 49, optionText: 'Ottoman Empire' },
          { id: 50, optionText: 'Roman Empire' },
          { id: 51, optionText: 'Mongol Empire' },
          { id: 52, optionText: 'Persian Empire' },
        ]},
    ],
    _answers: { 10: 39, 11: 43, 12: 46, 13: 51 }
  },
  {
    id: 4, title: 'Math Basics', category: 'Math',
    description: 'Arithmetic, algebra and basic number theory.',
    timeLimitMinutes: 6, questionCount: 4, createdBy: 'admin',
    questions: [
      { id: 14, questionText: 'What is the value of π (pi) to 2 decimal places?', marks: 1,
        options: [
          { id: 53, optionText: '3.12' },
          { id: 54, optionText: '3.14' },
          { id: 55, optionText: '3.16' },
          { id: 56, optionText: '3.41' },
        ]},
      { id: 15, questionText: 'What is the square root of 144?', marks: 1,
        options: [
          { id: 57, optionText: '11' },
          { id: 58, optionText: '12' },
          { id: 59, optionText: '13' },
          { id: 60, optionText: '14' },
        ]},
      { id: 16, questionText: 'Solve: 2x + 6 = 20. What is x?', marks: 2,
        options: [
          { id: 61, optionText: '5' },
          { id: 62, optionText: '6' },
          { id: 63, optionText: '7' },
          { id: 64, optionText: '8' },
        ]},
      { id: 17, questionText: 'What is 15% of 200?', marks: 1,
        options: [
          { id: 65, optionText: '20' },
          { id: 66, optionText: '25' },
          { id: 67, optionText: '30' },
          { id: 68, optionText: '35' },
        ]},
    ],
    _answers: { 14: 54, 15: 58, 16: 63, 17: 67 }
  },
  {
    id: 5, title: 'Cricket World Cup', category: 'Sports',
    description: 'Test your cricket knowledge — records, teams and legends.',
    timeLimitMinutes: 8, questionCount: 4, createdBy: 'admin',
    questions: [
      { id: 18, questionText: 'Which country has won the most Cricket World Cups?', marks: 1,
        options: [
          { id: 69, optionText: 'India' },
          { id: 70, optionText: 'Australia' },
          { id: 71, optionText: 'West Indies' },
          { id: 72, optionText: 'England' },
        ]},
      { id: 19, questionText: 'Who holds the record for most runs in ODI cricket?', marks: 2,
        options: [
          { id: 73, optionText: 'Ricky Ponting' },
          { id: 74, optionText: 'Kumar Sangakkara' },
          { id: 75, optionText: 'Sachin Tendulkar' },
          { id: 76, optionText: 'Brian Lara' },
        ]},
      { id: 20, questionText: 'In which year did India win their first Cricket World Cup?', marks: 1,
        options: [
          { id: 77, optionText: '1975' },
          { id: 78, optionText: '1979' },
          { id: 79, optionText: '1983' },
          { id: 80, optionText: '1987' },
        ]},
      { id: 21, questionText: 'How many players are in a cricket team?', marks: 1,
        options: [
          { id: 81, optionText: '9' },
          { id: 82, optionText: '10' },
          { id: 83, optionText: '11' },
          { id: 84, optionText: '12' },
        ]},
    ],
    _answers: { 18: 70, 19: 75, 20: 79, 21: 83 }
  },
]

// ── Mock Attempts (in-memory) ──────────────────────────────
let MOCK_ATTEMPTS = [
  { username: 'admin', quizTitle: 'JavaScript Fundamentals', score: 6, totalMarks: 6, attemptedAt: '2024-03-01T10:00:00' },
  { username: 'demo',  quizTitle: 'General Science',         score: 3, totalMarks: 4, attemptedAt: '2024-03-02T12:00:00' },
  { username: 'admin', quizTitle: 'World History',           score: 4, totalMarks: 5, attemptedAt: '2024-03-03T09:00:00' },
]

// ── Quiz API ───────────────────────────────────────────────
export const quizAPI = {
  getAll: async () => {
    await delay(400)
    return { data: MOCK_QUIZZES.map(q => ({
      id: q.id, title: q.title, category: q.category,
      description: q.description, timeLimitMinutes: q.timeLimitMinutes,
      questionCount: q.questions.length, createdBy: q.createdBy,
    }))}
  },

  getById: async (id) => {
    await delay(400)
    const quiz = MOCK_QUIZZES.find(q => q.id === Number(id))
    if (!quiz) throw new Error('Quiz not found')
    // Return without _answers (simulate server hiding correct answers)
    const { _answers, ...quizData } = quiz
    return { data: quizData }
  },

  search: async (keyword) => {
    await delay(300)
    const kw = keyword.toLowerCase()
    const results = MOCK_QUIZZES.filter(q =>
      q.title.toLowerCase().includes(kw) ||
      q.category.toLowerCase().includes(kw) ||
      q.description.toLowerCase().includes(kw)
    )
    return { data: results.map(q => ({
      id: q.id, title: q.title, category: q.category,
      description: q.description, timeLimitMinutes: q.timeLimitMinutes,
      questionCount: q.questions.length, createdBy: q.createdBy,
    }))}
  },

  submit: async ({ quizId, answers, timeTakenSeconds }) => {
    await delay(600)
    const quiz = MOCK_QUIZZES.find(q => q.id === Number(quizId))
    if (!quiz) throw new Error('Quiz not found')

    let score = 0
    let totalMarks = 0
    quiz.questions.forEach(q => {
      totalMarks += q.marks
      const userAns = answers.find(a => a.questionId === q.id)
      if (userAns && quiz._answers[q.id] === userAns.selectedOptionId) {
        score += q.marks
      }
    })

    const percentage = Math.round((score / totalMarks) * 100)
    const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A'
                : percentage >= 70 ? 'B'  : percentage >= 60 ? 'C'
                : percentage >= 40 ? 'D'  : 'F'

    // Save to mock attempts
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    MOCK_ATTEMPTS.unshift({
      username: user.username || 'demo',
      quizTitle: quiz.title,
      score, totalMarks,
      attemptedAt: new Date().toISOString(),
    })

    return { data: { score, totalMarks, percentage, grade } }
  },
}

// ── Leaderboard API ────────────────────────────────────────
export const leaderboardAPI = {
  getGlobal: async () => {
    await delay(400)
    const sorted = [...MOCK_ATTEMPTS].sort((a, b) => {
      const pa = a.totalMarks ? a.score / a.totalMarks : 0
      const pb = b.totalMarks ? b.score / b.totalMarks : 0
      return pb - pa
    })
    return { data: sorted }
  },

  getMyScores: async () => {
    await delay(400)
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const mine = MOCK_ATTEMPTS.filter(a => a.username === user.username)
    return { data: mine }
  },
}

// ── Auth API (kept for reference, real auth is in AuthContext) ─
export const authAPI = {
  login:    async (data) => { await delay(600); return { data: {} } },
  register: async (data) => { await delay(600); return { data: {} } },
}

export default { quizAPI, leaderboardAPI, authAPI }

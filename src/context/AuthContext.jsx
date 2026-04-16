import { createContext, useContext, useState, useEffect } from 'react'

// ── MOCK MODE (no backend needed) ─────────────────────────
const DEFAULT_USERS = [
  { id: 1, username: 'demo',  email: 'demo@test.com',  password: '123456',   role: 'USER' },
  { id: 2, username: 'admin', email: 'admin@test.com', password: 'admin123', role: 'ADMIN' },
]

// Load users from localStorage — registered users survive page refresh
const loadUsers = () => {
  try {
    const stored = localStorage.getItem('mock_users')
    return stored ? JSON.parse(stored) : DEFAULT_USERS
  } catch { return DEFAULT_USERS }
}

const saveUsers = (users) =>
  localStorage.setItem('mock_users', JSON.stringify(users))

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize default users if first time
    if (!localStorage.getItem('mock_users')) saveUsers(DEFAULT_USERS)
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    await new Promise(r => setTimeout(r, 600))
    const users = loadUsers()
    const found = users.find(u => u.email === email && u.password === password)
    if (!found) throw { response: { data: 'Invalid email or password' } }
    const { password: _, ...userData } = found
    localStorage.setItem('token', 'mock-jwt-token-' + userData.id)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const register = async (username, email, password) => {
    await new Promise(r => setTimeout(r, 600))
    const users = loadUsers()
    if (users.find(u => u.email === email)) {
      throw { response: { data: 'Email already registered' } }
    }
    if (users.find(u => u.username === username)) {
      throw { response: { data: 'Username already taken' } }
    }
    const newUser = { id: Date.now(), username, email, role: 'USER' }
    const updatedUsers = [...users, { ...newUser, password }]
    saveUsers(updatedUsers)
    localStorage.setItem('token', 'mock-jwt-token-' + newUser.id)
    localStorage.setItem('user', JSON.stringify(newUser))
    setUser(newUser)
    return newUser
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

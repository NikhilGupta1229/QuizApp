import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar          from './components/Navbar'
import ProtectedRoute  from './components/ProtectedRoute'

import LoginPage       from './pages/LoginPage'
import RegisterPage    from './pages/RegisterPage'
import HomePage        from './pages/HomePage'
import QuizDetailPage  from './pages/QuizDetailPage'
import QuizPlayerPage  from './pages/QuizPlayerPage'
import ResultPage      from './pages/ResultPage'
import LeaderboardPage from './pages/LeaderboardPage'
import MyScoresPage    from './pages/MyScoresPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected */}
          <Route path="/" element={
            <ProtectedRoute><HomePage /></ProtectedRoute>
          } />
          <Route path="/quiz/:id" element={
            <ProtectedRoute><QuizDetailPage /></ProtectedRoute>
          } />
          <Route path="/quiz/:id/play" element={
            <ProtectedRoute><QuizPlayerPage /></ProtectedRoute>
          } />
          <Route path="/result" element={
            <ProtectedRoute><ResultPage /></ProtectedRoute>
          } />
          <Route path="/leaderboard" element={
            <ProtectedRoute><LeaderboardPage /></ProtectedRoute>
          } />
          <Route path="/my-scores" element={
            <ProtectedRoute><MyScoresPage /></ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

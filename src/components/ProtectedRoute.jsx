import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ children }) {
  const { session, isAdmin, loading } = useAuth()

  if (loading) return <div className="loading-state">Loading...</div>
  if (!session || !isAdmin) return <Navigate to="/admin/login" replace />

  return children
}

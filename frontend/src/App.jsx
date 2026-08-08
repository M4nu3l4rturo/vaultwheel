import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Marketplace from './pages/Marketplace'
import VehicleDetail from './pages/VehicleDetail'
import Portfolio from './pages/Portfolio'
import Auth from './pages/Auth'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen bg-vault-dark flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-vault-gold rounded-full border-t-transparent"></div></div>
  if (!user) return <Navigate to="/auth" replace />
  return children
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/vehicles/:id" element={<VehicleDetail />} />
        <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut, User, Menu, X, ShieldCheck } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-vault-dark/80 backdrop-blur-md border-b border-vault-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-black text-white tracking-widest">
              VAULT<span className="text-vault-gold mx-1">◈</span>WHEEL
            </div>
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/marketplace" className="text-vault-text hover:text-white transition-colors">
              Marketplace
            </Link>
            {user && (
              <Link to="/portfolio" className="text-vault-text hover:text-white transition-colors">
                Portfolio
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <Link to="/auth">
                <button className="btn-gold px-6 py-2">Connect</button>
              </Link>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-vault-text">Balance</div>
                  <div className="text-vault-gold font-bold">
                    ${user.fiat_balance?.toLocaleString()}
                  </div>
                </div>
                <div className="relative group">
                  <button className="flex items-center space-x-2 bg-vault-card border border-vault-border rounded-full px-4 py-2 hover:border-vault-gold transition-colors">
                    <User size={18} className="text-vault-text group-hover:text-white" />
                    <span className="text-white font-medium">{user.full_name}</span>
                    {user.kyc_status === 'APPROVED' && (
                      <ShieldCheck size={16} className="text-green-500" />
                    )}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-vault-card border border-vault-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-400 hover:bg-vault-dark/50 flex items-center space-x-2 rounded-lg"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white p-2">
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-vault-dark border-b border-vault-border px-4 pt-2 pb-6 space-y-4">
          <Link to="/marketplace" onClick={() => setMobileOpen(false)} className="block text-vault-text hover:text-white py-2">
            Marketplace
          </Link>
          {user && (
            <Link to="/portfolio" onClick={() => setMobileOpen(false)} className="block text-vault-text hover:text-white py-2">
              Portfolio
            </Link>
          )}
          {!user ? (
            <Link to="/auth" onClick={() => setMobileOpen(false)} className="block">
              <button className="btn-gold w-full py-3 mt-4">Connect</button>
            </Link>
          ) : (
            <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full text-left text-red-400 py-2 flex items-center space-x-2">
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          )}
        </div>
      )}
    </nav>
  )
}

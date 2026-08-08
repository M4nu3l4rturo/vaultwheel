import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Info } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { login as apiLogin, register as apiRegister } from '../services/api'
import toast from 'react-hot-toast'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [country, setCountry] = useState('US')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        const res = await apiLogin({ email, password })
        login(res.data.access_token, res.data.user)
        toast.success('Welcome back!')
        navigate('/marketplace')
      } else {
        if (password !== confirmPassword) {
          toast.error('Passwords do not match')
          setLoading(false)
          return
        }
        const res = await apiRegister({ 
          email, 
          password, 
          full_name: fullName, 
          country,
          role: 'BUYER'
        })
        login(res.data.access_token, res.data.user)
        toast.success('Account created successfully!')
        navigate('/marketplace')
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoFill = () => {
    setIsLogin(true)
    setEmail('demo@vaultwheel.io')
    setPassword('Demo@2024')
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex bg-vault-dark">
      {/* Left side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black">
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        <img 
          src="https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80" 
          alt="Luxury Car" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-20 p-16 flex flex-col justify-between h-full">
          <div className="text-3xl font-black text-white tracking-widest">
            VAULT<span className="text-vault-gold mx-1">◈</span>WHEEL
          </div>
          <div>
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              Access the exclusive world of <span className="text-vault-gold">automotive investment</span>.
            </h1>
            <p className="text-xl text-vault-text">
              Secure, verified fractional ownership powered by blockchain technology.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-vault-text">
              {isLogin 
                ? 'Sign in to manage your portfolio.' 
                : 'Join VaultWheel to start investing.'}
            </p>
          </div>

          <div className="flex bg-vault-card rounded-lg p-1 mb-8 border border-vault-border">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${
                isLogin ? 'bg-vault-dark text-vault-gold shadow-md' : 'text-vault-text hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${
                !isLogin ? 'bg-vault-dark text-vault-gold shadow-md' : 'text-vault-text hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.form 
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit} 
              className="space-y-4"
            >
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-vault-text mb-1">Full Name</label>
                    <input 
                      required
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="vault-input" 
                      placeholder="John Doe" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-vault-text mb-1">Country</label>
                    <select 
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="vault-input appearance-none bg-vault-card"
                    >
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AE">United Arab Emirates</option>
                      <option value="CH">Switzerland</option>
                      <option value="SG">Singapore</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-vault-text mb-1">Email Address</label>
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="vault-input" 
                  placeholder="name@example.com" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-vault-text mb-1">Password</label>
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="vault-input" 
                  placeholder="••••••••" 
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-vault-text mb-1">Confirm Password</label>
                  <input 
                    required
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="vault-input" 
                    placeholder="••••••••" 
                  />
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="btn-gold w-full py-3 mt-6 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-vault-dark border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </motion.form>
          </AnimatePresence>

          {!isLogin && (
            <div className="mt-6 flex items-start space-x-3 bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl">
              <Info className="text-blue-400 shrink-0 mt-0.5" size={18} />
              <p className="text-xs text-blue-200">
                In demo mode, KYC verification is automatically approved upon registration. In a production environment, you would be redirected to Sumsub for identity verification.
              </p>
            </div>
          )}

          {isLogin && (
            <div className="mt-8 border-t border-vault-border pt-8 text-center">
              <p className="text-sm text-vault-text mb-4">Want to try the demo quickly?</p>
              <button 
                type="button"
                onClick={handleDemoFill}
                className="btn-outline w-full py-2 text-sm"
              >
                Use Demo Credentials
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

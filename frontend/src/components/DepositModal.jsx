import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, CreditCard, ShieldCheck } from 'lucide-react'
import { depositFunds } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function DepositModal({ onClose, onSuccess }) {
  const { user, setUser } = useAuth()
  const [amount, setAmount] = useState('1000')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleDeposit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await depositFunds({
        amount: parseFloat(amount),
        card_number: '4242424242424242',
        expiry_date: '12/26',
        cvv: '123'
      })
      // Update user context with new balance
      setUser({ ...user, fiat_balance: res.data.new_balance })
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to process deposit')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-vault-card rounded-2xl p-8 max-w-md w-full relative border border-vault-border"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-vault-text hover:text-white"
        >
          <X size={24} />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
            <CreditCard className="mr-2 text-vault-gold" />
            Deposit Funds
          </h2>
          <p className="text-vault-text text-sm">Add funds to your VaultWheel account to purchase vehicle tokens.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleDeposit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-vault-text mb-1">Amount (USD)</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-vault-text">$</span>
              <input 
                type="number" 
                required
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-vault-dark border border-vault-border rounded-lg py-2 pl-8 pr-4 text-white focus:outline-none focus:border-vault-gold transition-colors"
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="pt-4 border-t border-vault-border/50">
            <h4 className="text-sm font-medium text-vault-text mb-3">Payment Details (Demo)</h4>
            
            <div className="space-y-3 opacity-70 pointer-events-none">
              <div>
                <input type="text" value="4111 1111 1111 1111" readOnly className="w-full bg-vault-dark border border-vault-border rounded-lg p-2 text-white text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" value="12/28" readOnly className="w-full bg-vault-dark border border-vault-border rounded-lg p-2 text-white text-sm" />
                <input type="text" value="123" readOnly className="w-full bg-vault-dark border border-vault-border rounded-lg p-2 text-white text-sm" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-vault-gold">
              <ShieldCheck size={14} className="mr-1" />
              <span>Simulated secure transaction</span>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-gold py-3 mt-4"
          >
            {loading ? 'Processing...' : `Confirm Deposit $${amount}`}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

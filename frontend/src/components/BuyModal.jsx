import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { buyTokens } from '../services/api'
import toast from 'react-hot-toast'
import NFTConfirmation from './NFTConfirmation'

export default function BuyModal({ isOpen, onClose, vehicle }) {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [successTx, setSuccessTx] = useState(null)
  const { user, setUser } = useAuth()

  if (!isOpen) return null

  const { token } = vehicle
  const price = token.price_per_token
  const total = quantity * price
  const isKycApproved = user?.kyc_status === 'APPROVED'
  const hasEnoughBalance = user?.fiat_balance >= total

  const handleBuy = async () => {
    if (!isKycApproved) {
      toast.error('KYC verification required')
      return
    }
    if (!hasEnoughBalance) {
      toast.error('Insufficient balance')
      return
    }

    setLoading(true)
    try {
      const res = await buyTokens({
        token_id: token.id,
        quantity: parseInt(quantity)
      })
      
      // Update local balance
      setUser({ ...user, fiat_balance: user.fiat_balance - total })
      setSuccessTx(res.data)
      toast.success('Purchase successful!')
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Transaction failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-vault-card border border-vault-border rounded-2xl shadow-2xl overflow-hidden"
        >
          {successTx ? (
            <NFTConfirmation tx={successTx} vehicle={vehicle} onClose={onClose} />
          ) : (
            <>
              <div className="flex justify-between items-center p-6 border-b border-vault-border">
                <h2 className="text-xl font-bold text-white">Purchase Tokens</h2>
                <button onClick={onClose} className="text-vault-text hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white">{vehicle.make} {vehicle.model}</h3>
                  <p className="text-vault-text text-sm">Symbol: {token.token_symbol}</p>
                </div>

                <div className="space-y-4 bg-vault-dark rounded-xl p-4 border border-vault-border/50">
                  <div className="flex justify-between">
                    <span className="text-vault-text">Price per token</span>
                    <span className="font-semibold text-white">${price.toLocaleString()}</span>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-vault-text mb-2">Quantity</label>
                    <input 
                      type="number" 
                      min="1" 
                      max={token.available_supply}
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="vault-input text-lg font-bold"
                    />
                  </div>

                  <div className="h-px bg-vault-border/50 my-2"></div>

                  <div className="flex justify-between items-center">
                    <span className="text-vault-text">Total Price</span>
                    <span className="text-2xl font-bold text-vault-gold">${total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-vault-text">Your Balance</span>
                    <span className={hasEnoughBalance ? 'text-white' : 'text-red-400'}>
                      ${user?.fiat_balance?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-vault-text">Remaining Balance</span>
                    <span className="text-white">${Math.max(0, (user?.fiat_balance || 0) - total).toLocaleString()}</span>
                  </div>
                </div>

                {!isKycApproved && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start space-x-3">
                    <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={16} />
                    <p className="text-xs text-red-200">KYC Verification required. Please complete your profile to invest.</p>
                  </div>
                )}
                
                {!hasEnoughBalance && isKycApproved && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start space-x-3">
                    <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={16} />
                    <p className="text-xs text-red-200">Insufficient funds for this purchase.</p>
                  </div>
                )}

                <button 
                  onClick={handleBuy}
                  disabled={loading || !isKycApproved || !hasEnoughBalance || quantity < 1 || quantity > token.available_supply}
                  className="btn-gold w-full py-4 text-lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-vault-dark border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </span>
                  ) : (
                    'Confirm Purchase'
                  )}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

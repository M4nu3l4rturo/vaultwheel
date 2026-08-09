import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Tag } from 'lucide-react'
import { createListing } from '../services/api'

export default function SellModal({ holding, onClose, onSuccess }) {
  const availableToSell = holding.quantity - (holding.locked_quantity || 0)
  
  const [quantity, setQuantity] = useState(1)
  const [price, setPrice] = useState(holding.vehicle.token.price_per_token)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSell = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await createListing({
        token_id: holding.token_id || holding.vehicle.token?.id || holding.vehicle.id, 
        quantity: parseInt(quantity),
        price_per_token: parseFloat(price)
      })
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create listing')
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
            <Tag className="mr-2 text-vault-gold" />
            List for Sale
          </h2>
          <p className="text-vault-text text-sm">
            Sell your {holding.vehicle.make} {holding.vehicle.model} tokens on the secondary market.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSell} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-vault-text mb-1 flex justify-between">
              <span>Quantity</span>
              <span className="text-vault-gold">Available: {availableToSell}</span>
            </label>
            <input 
              type="number" 
              required
              min="1"
              max={availableToSell}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-vault-dark border border-vault-border rounded-lg p-2 text-white focus:outline-none focus:border-vault-gold transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-vault-text mb-1 flex justify-between">
              <span>Price per Token (USD)</span>
              <span className="text-vault-text text-xs">Current est: ${holding.vehicle.token.price_per_token}</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-vault-text">$</span>
              <input 
                type="number" 
                required
                min="0.01"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-vault-dark border border-vault-border rounded-lg py-2 pl-8 pr-4 text-white focus:outline-none focus:border-vault-gold transition-colors"
              />
            </div>
          </div>

          <div className="bg-vault-dark p-4 rounded-lg mt-4 border border-vault-border">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-vault-text">Total Sale Value</span>
              <span className="font-bold text-white">${(quantity * price).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-vault-text">Platform Fee (0%)</span>
              <span className="font-bold text-vault-gold">$0.00</span>
            </div>
            <div className="flex justify-between text-sm mt-2 pt-2 border-t border-vault-border/50">
              <span className="text-vault-text font-bold">You Receive</span>
              <span className="font-bold text-green-400">${(quantity * price).toLocaleString()}</span>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || availableToSell <= 0}
            className="w-full btn-gold py-3 mt-4"
          >
            {loading ? 'Processing...' : 'Confirm Listing'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

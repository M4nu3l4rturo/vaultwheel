import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { buyListing } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function SecondaryListingCard({ listing, onPurchaseSuccess }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const isOwner = user && user.id === listing.seller_id
  const totalCost = listing.quantity * listing.price_per_token

  const handleBuy = async () => {
    if (!window.confirm(`Buy ${listing.quantity} tokens for $${totalCost.toLocaleString()}?`)) return
    
    setLoading(true)
    setError(null)
    try {
      await buyListing(listing.id)
      onPurchaseSuccess()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to buy listing')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card overflow-hidden group flex flex-col h-full"
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={listing.vehicle.images?.[0] || 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80'} 
          alt={listing.vehicle.model}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-vault-dark/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wider border border-purple-400 text-purple-400">
          SECONDARY
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-vault-gold transition-colors">
              {listing.vehicle.make} {listing.vehicle.model}
            </h3>
            <p className="text-vault-text text-sm">Listed by: {listing.seller_name}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs">
            {error}
          </div>
        )}

        <div className="mb-6 space-y-3 flex-1 bg-vault-dark p-4 rounded-lg border border-vault-border/50">
          <div className="flex justify-between text-sm">
            <span className="text-vault-text">Tokens for Sale</span>
            <span className="font-bold text-white">{listing.quantity} {listing.vehicle.token_symbol}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-vault-text">Price per Token</span>
            <span className="font-semibold text-vault-gold">${listing.price_per_token.toLocaleString()}</span>
          </div>
          <div className="pt-2 mt-2 border-t border-vault-border/50 flex justify-between">
            <span className="text-vault-text font-bold">Total Cost</span>
            <span className="font-bold text-green-400">${totalCost.toLocaleString()}</span>
          </div>
        </div>

        {isOwner ? (
          <button disabled className="btn-outline w-full py-3 mt-auto opacity-50 cursor-not-allowed">
            Your Listing
          </button>
        ) : (
          <button 
            onClick={handleBuy}
            disabled={loading}
            className="w-full bg-vault-gold hover:bg-yellow-500 text-vault-dark font-bold py-3 px-4 rounded transition-colors flex items-center justify-center mt-auto"
          >
            {loading ? 'Processing...' : (
              <>
                <ShoppingCart className="mr-2" size={18} />
                Buy Now
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  )
}

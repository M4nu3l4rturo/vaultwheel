import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function VehicleCard({ vehicle: item }) {
  const v = item.vehicle || item
  const token = item.token || v.token || {}
  const rarity_score = v.rarity_score || 0

  const getRarityColor = (score) => {
    if (score >= 90) return 'text-vault-gold border-vault-gold shadow-[0_0_10px_rgba(240,180,41,0.5)]'
    if (score >= 80) return 'text-purple-400 border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.5)]'
    if (score >= 70) return 'text-blue-400 border-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]'
    return 'text-gray-400 border-gray-400 shadow-[0_0_10px_rgba(156,163,175,0.5)]'
  }

  const getRarityLabel = (score) => {
    if (score >= 90) return 'LEGENDARY'
    if (score >= 80) return 'ELITE'
    if (score >= 70) return 'RARE'
    return 'COLLECTOR'
  }

  const totalSupply = token.total_supply || 1
  const availableSupply = token.available_supply || 0
  const percentAvailable = Math.round((availableSupply / totalSupply) * 100)

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card overflow-hidden group flex flex-col h-full"
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={v.images?.[0] || 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80'} 
          alt={v.model}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-vault-dark/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wider border ${getRarityColor(rarity_score)}">
          <span className={getRarityColor(rarity_score).split(' ')[0]}>{getRarityLabel(rarity_score)}</span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-vault-gold transition-colors">
              {v.make} {v.model}
            </h3>
            <p className="text-vault-text text-sm">{v.year}</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-vault-gold">${v.total_valuation?.toLocaleString()}</div>
            <div className="text-xs text-vault-text">Valuation</div>
          </div>
        </div>

        <div className="mb-6 space-y-3 flex-1">
          <div className="flex justify-between text-sm">
            <span className="text-vault-text">Price per Token</span>
            <span className="font-semibold">${token.price_per_token?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-vault-text">Available Tokens</span>
            <span className="font-semibold">{availableSupply} / {totalSupply}</span>
          </div>
          
          <div className="w-full h-1.5 bg-vault-dark rounded-full overflow-hidden mt-2">
            <div 
              className="h-full bg-vault-gold transition-all duration-1000"
              style={{ width: `${100 - percentAvailable}%` }}
            />
          </div>
          <div className="text-right text-xs text-vault-text">
            {100 - percentAvailable}% Funded
          </div>
        </div>

        <Link to={`/vehicles/${v.id}`} className="block w-full">
          <button className="btn-outline w-full py-3 mt-auto">
            View Passport
          </button>
        </Link>
      </div>
    </motion.div>
  )
}


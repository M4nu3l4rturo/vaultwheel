import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getVehicles, getActiveListings } from '../services/api'
import toast from 'react-hot-toast'
import VehicleCard from '../components/VehicleCard'
import SecondaryListingCard from '../components/SecondaryListingCard'

export default function Marketplace() {
  const [vehicles, setVehicles] = useState([])
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [activeTab, setActiveTab] = useState('PRIMARY')

  const fetchVehicles = async () => {
    try {
      if (activeTab === 'PRIMARY') {
        const res = await getVehicles()
        setVehicles(res.data)
      } else {
        const res = await getActiveListings()
        setListings(res.data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchVehicles()
  }, [activeTab])

  const getFilteredVehicles = () => {
    const getScore = (item) => item.vehicle?.rarity_score ?? item.rarity_score ?? 0
    if (filter === 'ALL') return vehicles
    if (filter === 'LEGENDARY') return vehicles.filter(v => getScore(v) >= 90)
    if (filter === 'ELITE') return vehicles.filter(v => getScore(v) >= 80 && getScore(v) < 90)
    if (filter === 'RARE') return vehicles.filter(v => getScore(v) >= 70 && getScore(v) < 80)
    return vehicles.filter(v => getScore(v) < 70)
  }

  const filtered = getFilteredVehicles()

  return (
    <div className="min-h-screen bg-vault-dark pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12">
          <h1 className="text-4xl font-black mb-4">Vehicle Marketplace</h1>
          <p className="text-vault-text text-lg">Acquire fractional ownership in verified, investment-grade automobiles.</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-vault-border mb-8">
          <button 
            className={`px-6 py-3 font-bold text-sm tracking-wider uppercase transition-colors border-b-2 ${activeTab === 'PRIMARY' ? 'border-vault-gold text-vault-gold' : 'border-transparent text-vault-text hover:text-white'}`}
            onClick={() => setActiveTab('PRIMARY')}
          >
            Primary Offerings
          </button>
          <button 
            className={`px-6 py-3 font-bold text-sm tracking-wider uppercase transition-colors border-b-2 ${activeTab === 'SECONDARY' ? 'border-vault-gold text-vault-gold' : 'border-transparent text-vault-text hover:text-white'}`}
            onClick={() => setActiveTab('SECONDARY')}
          >
            Secondary Market
          </button>
        </div>

        {/* Filters (Only for Primary Market) */}
        {activeTab === 'PRIMARY' && (
          <div className="flex overflow-x-auto space-x-2 pb-4 mb-8 scrollbar-hide">
            {['ALL', 'LEGENDARY', 'ELITE', 'RARE', 'COLLECTOR'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all ${
                  filter === f 
                    ? 'bg-vault-gold text-vault-dark' 
                    : 'bg-vault-card border border-vault-border text-vault-text hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card h-[400px] animate-pulse">
                <div className="h-1/2 bg-vault-card"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-vault-card rounded w-3/4"></div>
                  <div className="h-4 bg-vault-card rounded w-1/2"></div>
                  <div className="space-y-2 pt-4">
                    <div className="h-4 bg-vault-card rounded w-full"></div>
                    <div className="h-4 bg-vault-card rounded w-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === 'PRIMARY' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((vehicle, i) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <VehicleCard vehicle={vehicle} />
              </motion.div>
            ))}
            
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-24 text-vault-text">
                <div className="text-6xl mb-4">🏎️</div>
                <h3 className="text-xl font-bold text-white mb-2">No vehicles found</h3>
                <p>No vehicles match the selected rarity filter.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing, i) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <SecondaryListingCard 
                  listing={listing} 
                  onPurchaseSuccess={() => {
                    toast.success('Tokens successfully purchased!')
                    fetchVehicles()
                  }} 
                />
              </motion.div>
            ))}
            
            {listings.length === 0 && (
              <div className="col-span-full text-center py-24 text-vault-text">
                <div className="text-6xl mb-4">📉</div>
                <h3 className="text-xl font-bold text-white mb-2">No active listings</h3>
                <p>There are currently no tokens for sale on the secondary market.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

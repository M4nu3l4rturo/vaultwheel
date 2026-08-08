import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, Calendar, ArrowLeft, Info, CheckCircle2 } from 'lucide-react'
import { getVehicle } from '../services/api'
import { useAuth } from '../context/AuthContext'
import RarityMeter from '../components/RarityMeter'
import BuyModal from '../components/BuyModal'

export default function VehicleDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [buyModalOpen, setBuyModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await getVehicle(id)
        setVehicle(res.data)
      } catch (e) {
        console.error(e)
        navigate('/marketplace')
      } finally {
        setLoading(false)
      }
    }
    fetchVehicle()
  }, [id, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-vault-dark flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-vault-gold rounded-full border-t-transparent"></div>
      </div>
    )
  }

  if (!vehicle) return null

  const { token, passport_data, custom_features } = vehicle
  const percentAvailable = Math.round((token.available_supply / token.total_supply) * 100)

  return (
    <div className="min-h-screen bg-vault-dark pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-vault-text hover:text-white mb-8 transition-colors">
          <ArrowLeft size={20} />
          <span>Back to Marketplace</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left: Image */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-vault-border glass-card p-2">
              <img 
                src={vehicle.images?.[0] || 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80'} 
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            {vehicle.images && vehicle.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {vehicle.images.slice(1).map((img, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden border border-vault-border opacity-60 hover:opacity-100 cursor-pointer transition-opacity">
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right: Key Info & Buy */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-6 flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="bg-vault-card border border-vault-border px-3 py-1 rounded-full text-xs font-bold text-vault-text tracking-widest uppercase">
                    {vehicle.make}
                  </span>
                  {vehicle.verification_status === 'APPROVED' && (
                    <span className="flex items-center space-x-1 text-green-400 text-xs font-bold bg-green-500/10 px-3 py-1 rounded-full border border-green-500/30">
                      <ShieldCheck size={14} />
                      <span>VERIFIED</span>
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                  {vehicle.model}
                </h1>
                <p className="text-xl text-vault-text mt-2">{vehicle.year}</p>
              </div>
              <div className="shrink-0 ml-4 hidden sm:block">
                <RarityMeter score={vehicle.rarity_score} />
              </div>
            </div>

            <div className="sm:hidden mb-8 flex justify-center">
              <RarityMeter score={vehicle.rarity_score} />
            </div>

            <div className="glass-card p-6 md:p-8 space-y-6 flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-vault-text mb-1">Total Valuation</div>
                  <div className="text-3xl font-bold text-vault-gold">
                    ${vehicle.total_valuation?.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-vault-text mb-1">Price Per Token</div>
                  <div className="text-3xl font-bold text-white">
                    ${token.price_per_token?.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-vault-text">Token Availability</span>
                  <span className="font-bold">{token.available_supply} / {token.total_supply}</span>
                </div>
                <div className="w-full h-2 bg-vault-dark rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-vault-gold to-vault-gold-dark"
                    style={{ width: `${100 - percentAvailable}%` }}
                  />
                </div>
                <div className="text-xs text-right text-vault-text flex justify-between">
                  <span>Symbol: <span className="font-mono text-white">{token.token_symbol}</span></span>
                  <span>{100 - percentAvailable}% Funded</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  if (!user) navigate('/auth')
                  else setBuyModalOpen(true)
                }}
                className="btn-gold w-full py-4 text-lg mt-4"
              >
                {user ? 'Invest Now' : 'Sign in to Invest'}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Passport Tabs */}
        <div className="glass-card overflow-hidden">
          <div className="flex overflow-x-auto border-b border-vault-border scrollbar-hide">
            {['overview', 'specifications', 'timeline', 'rarity analysis'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-5 text-sm font-bold tracking-widest uppercase whitespace-nowrap transition-colors ${
                  activeTab === tab 
                    ? 'text-vault-gold border-b-2 border-vault-gold bg-vault-card/50' 
                    : 'text-vault-text hover:text-white hover:bg-vault-card/30'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-8 md:p-12 min-h-[400px]">
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-3xl">
                <h3 className="text-2xl font-bold text-white mb-4">Vehicle History & Overview</h3>
                <p className="text-vault-text text-lg leading-relaxed whitespace-pre-line">
                  {vehicle.description}
                </p>
                <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl flex space-x-3 items-start mt-8">
                  <Info className="text-blue-400 shrink-0 mt-1" />
                  <p className="text-blue-200 text-sm">
                    This vehicle has been physically inspected and verified by VaultWheel's network of certified mechanics and appraisers. Custody is securely maintained in our climate-controlled partner facilities.
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'specifications' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="text-2xl font-bold text-white mb-8">Technical Specifications & Custom Features</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(custom_features || {}).map(([key, value]) => (
                    <div key={key} className="bg-vault-card border border-vault-border p-4 rounded-xl">
                      <div className="text-xs text-vault-text uppercase tracking-wider mb-1">
                        {key.replace(/_/g, ' ')}
                      </div>
                      <div className="font-medium text-white">{value}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'timeline' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
                <h3 className="text-2xl font-bold text-white mb-10 text-center">Vehicle Timeline</h3>
                <div className="relative border-l border-vault-border ml-4 md:ml-1/2 space-y-12">
                  {passport_data?.timeline?.map((item, index) => (
                    <div key={index} className="relative pl-8 md:pl-0">
                      <div className="md:w-1/2 md:-ml-[17px] flex items-center absolute left-0 top-0 md:justify-end">
                        <div className="hidden md:block pr-8 text-vault-gold font-bold text-xl">{item.date}</div>
                        <div className="w-4 h-4 rounded-full bg-vault-gold border-4 border-vault-dark z-10 -ml-2 md:ml-0"></div>
                      </div>
                      <div className="md:w-1/2 md:ml-auto md:pl-8 pt-1 md:pt-0">
                        <div className="md:hidden text-vault-gold font-bold mb-2">{item.date}</div>
                        <div className="bg-vault-card border border-vault-border p-5 rounded-xl shadow-lg hover:border-vault-gold/50 transition-colors">
                          <p className="text-vault-text">{item.event}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'rarity analysis' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
                  <div className="shrink-0 text-center">
                    <RarityMeter score={vehicle.rarity_score} />
                    <div className="mt-6">
                      <span className="text-vault-text text-sm block mb-1">Production Units</span>
                      <span className="text-3xl font-black text-white">{passport_data?.production_units}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-6">
                    <h3 className="text-2xl font-bold text-white mb-6">Key Rarity Factors</h3>
                    <div className="space-y-4">
                      {passport_data?.rarity_factors?.map((factor, idx) => (
                        <div key={idx} className="flex items-start space-x-4 bg-vault-card border border-vault-border p-4 rounded-xl">
                          <CheckCircle2 className="text-vault-gold shrink-0 mt-0.5" />
                          <span className="text-vault-text">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

      </div>

      <BuyModal 
        isOpen={buyModalOpen} 
        onClose={() => setBuyModalOpen(false)} 
        vehicle={vehicle} 
      />
    </div>
  )
}

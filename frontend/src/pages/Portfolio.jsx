import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Wallet, ArrowRight, ExternalLink } from 'lucide-react'
import { Tag, Trash2 } from 'lucide-react'
import { getMyHoldings, getMyTransactions, getMyListings, cancelListing } from '../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { getPolygonAmoyExplorerUrl } from '../services/web3'
import DepositModal from '../components/DepositModal'
import SellModal from '../components/SellModal'

export default function Portfolio() {
  const { user } = useAuth()
  const [holdings, setHoldings] = useState([])
  const [transactions, setTransactions] = useState([])
  const [myListings, setMyListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDeposit, setShowDeposit] = useState(false)
  const [sellingHolding, setSellingHolding] = useState(null)

  const fetchData = async () => {
    try {
      const [hRes, tRes, lRes] = await Promise.all([
        getMyHoldings(),
        getMyTransactions(),
        getMyListings()
      ])
      setHoldings(hRes.data)
      setTransactions(tRes.data)
      setMyListings(lRes.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelListing = async (listingId) => {
    try {
      await cancelListing(listingId)
      toast.success('Listing cancelled successfully')
      fetchData()
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Failed to cancel listing')
    }
  }

  useEffect(() => {
    fetchData()
  }, [])


  const totalPortfolioValue = holdings.reduce((sum, item) => {
    return sum + (item.quantity * item.vehicle.token.price_per_token)
  }, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-vault-dark flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-vault-gold rounded-full border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-vault-dark pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10">
          <h1 className="text-4xl font-black mb-2">My Portfolio</h1>
          <p className="text-vault-text">Manage your fractional luxury vehicle assets.</p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="glass-card p-8 bg-gradient-to-br from-vault-card to-vault-dark relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Wallet size={100} />
            </div>
            <div className="relative z-10">
              <h3 className="text-vault-text text-sm font-medium tracking-widest uppercase mb-2">Total Asset Value</h3>
              <div className="text-4xl md:text-5xl font-black text-white">
                ${totalPortfolioValue.toLocaleString()}
              </div>
              <div className="mt-6 flex space-x-2">
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">+0.00%</span>
                <span className="text-vault-text text-xs py-1">Since purchase</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 bg-gradient-to-br from-vault-card to-vault-dark relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 text-vault-gold">
              <CoinsIcon size={100} />
            </div>
            <div className="relative z-10">
              <h3 className="text-vault-text text-sm font-medium tracking-widest uppercase mb-2">Fiat Balance</h3>
              <div className="text-4xl md:text-5xl font-black text-vault-gold">
                ${user?.fiat_balance?.toLocaleString()}
              </div>
              <button 
                onClick={() => setShowDeposit(true)}
                className="mt-6 btn-outline text-xs px-4 py-2"
              >
                Deposit Funds (Demo)
              </button>
            </div>
          </div>
        </div>

        {/* Holdings */}
        <h2 className="text-2xl font-bold mb-6">Current Holdings</h2>
        
        {holdings.length === 0 ? (
          <div className="glass-card p-12 text-center border-dashed border-2 border-vault-border/50">
            <div className="text-vault-text mb-4">You don't have any vehicle assets yet.</div>
            <Link to="/marketplace">
              <button className="btn-gold px-6 py-3">Explore Marketplace</button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {holdings.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card flex flex-col sm:flex-row overflow-hidden group"
              >
                <div className="w-full sm:w-1/3 aspect-video sm:aspect-auto relative overflow-hidden">
                  <img 
                    src={item.vehicle.images?.[0] || 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80'} 
                    alt={item.vehicle.model}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      <Link to={`/vehicles/${item.vehicle.id}`} className="hover:text-vault-gold transition-colors">
                        {item.vehicle.make} {item.vehicle.model}
                      </Link>
                    </h3>
                    <p className="text-vault-text text-sm mb-4">Symbol: {item.vehicle.token.token_symbol}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm bg-vault-dark p-3 rounded-lg border border-vault-border/50">
                      <div>
                        <div className="text-vault-text">Tokens Owned</div>
                        <div className="font-bold text-white">
                          {item.quantity} {item.locked_quantity > 0 && <span className="text-xs text-vault-gold ml-1">({item.locked_quantity} listed)</span>}
                        </div>
                      </div>
                      <div>
                        <div className="text-vault-text">Current Value</div>
                        <div className="font-bold text-vault-gold">
                          ${(item.quantity * item.vehicle.token.price_per_token).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSellingHolding(item)}
                      disabled={item.quantity - (item.locked_quantity || 0) <= 0}
                      className="mt-4 w-full border border-vault-gold text-vault-gold hover:bg-vault-gold hover:text-vault-dark font-medium py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {item.quantity - (item.locked_quantity || 0) <= 0 ? 'All Tokens Listed' : 'List for Sale'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* My Active Listings */}
        {myListings && myListings.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Tag className="mr-2 text-vault-gold" size={24} />
              My Active Listings (Secondary Market)
            </h2>
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-vault-card/50 border-b border-vault-border">
                      <th className="p-4 text-vault-text font-medium text-sm">Asset</th>
                      <th className="p-4 text-vault-text font-medium text-sm">Quantity</th>
                      <th className="p-4 text-vault-text font-medium text-sm">Price / Token</th>
                      <th className="p-4 text-vault-text font-medium text-sm">Total Value</th>
                      <th className="p-4 text-vault-text font-medium text-sm">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-vault-border">
                    {myListings.map((l) => (
                      <tr key={l.id} className="hover:bg-vault-card/30 transition-colors">
                        <td className="p-4 font-medium text-white">{l.vehicle?.make} {l.vehicle?.model}</td>
                        <td className="p-4">{l.quantity} {l.vehicle?.token_symbol}</td>
                        <td className="p-4 text-vault-gold font-bold">${l.price_per_token?.toLocaleString()}</td>
                        <td className="p-4 text-green-400 font-bold">${(l.quantity * l.price_per_token)?.toLocaleString()}</td>
                        <td className="p-4">
                          <button
                            onClick={() => handleCancelListing(l.id)}
                            className="flex items-center space-x-1 text-xs text-red-400 hover:text-red-300 border border-red-500/30 bg-red-500/10 px-3 py-1.5 rounded transition-colors"
                          >
                            <Trash2 size={14} />
                            <span>Cancel Listing</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Transactions */}
        <h2 className="text-2xl font-bold mb-6">Recent Transactions</h2>
        <div className="glass-card overflow-hidden">
          {transactions.length === 0 ? (
            <div className="p-8 text-center text-vault-text">No transaction history.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-vault-card/50 border-b border-vault-border">
                    <th className="p-4 text-vault-text font-medium text-sm">Date</th>
                    <th className="p-4 text-vault-text font-medium text-sm">Action</th>
                    <th className="p-4 text-vault-text font-medium text-sm">Asset</th>
                    <th className="p-4 text-vault-text font-medium text-sm">Quantity</th>
                    <th className="p-4 text-vault-text font-medium text-sm">Total ($)</th>
                    <th className="p-4 text-vault-text font-medium text-sm">Blockchain Tx</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-vault-border">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-vault-card/30 transition-colors">
                      <td className="p-4 text-sm">{new Date(tx.created_at).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-1 rounded text-xs font-bold">
                          {tx.transaction_type}
                        </span>
                      </td>
                      <td className="p-4 font-medium">{tx.vehicle?.make} {tx.vehicle?.model}</td>
                      <td className="p-4">{tx.quantity}</td>
                      <td className="p-4 text-vault-gold font-bold">{tx.total_amount.toLocaleString()}</td>
                      <td className="p-4">
                        {tx.tx_hash.startsWith('0x000') ? (
                          <span className="text-xs font-mono text-vault-text bg-vault-card px-2 py-1 rounded" title="Demo Transaction">
                            {tx.tx_hash.substring(0, 10)}... (Demo)
                          </span>
                        ) : (
                          <a 
                            href={getPolygonAmoyExplorerUrl(tx.tx_hash)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-mono text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                          >
                            <span>{tx.tx_hash.substring(0, 10)}...</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {showDeposit && (
        <DepositModal 
          onClose={() => setShowDeposit(false)} 
          onSuccess={() => {
            setShowDeposit(false)
            fetchData()
          }} 
        />
      )}

      {sellingHolding && (
        <SellModal 
          holding={sellingHolding} 
          onClose={() => setSellingHolding(null)} 
          onSuccess={() => {
            setSellingHolding(null)
            fetchData()
          }} 
        />
      )}
    </div>
  )
}

function CoinsIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
      <path d="M7 6h1v4" />
      <path d="m16.71 13.88.7.71-2.82 2.82" />
    </svg>
  )
}

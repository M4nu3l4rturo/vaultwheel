import { motion } from 'framer-motion'
import { CheckCircle2, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getPolygonAmoyExplorerUrl } from '../services/web3'

export default function NFTConfirmation({ tx, vehicle, onClose }) {
  const isDemoTx = tx.tx_hash.startsWith('0x000')

  return (
    <div className="p-8 text-center space-y-6">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="mx-auto w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4"
      >
        <CheckCircle2 className="text-green-500 w-12 h-12" />
      </motion.div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Purchase Confirmed!</h2>
        <p className="text-vault-text">
          You have successfully acquired {tx.quantity} {tx.quantity === 1 ? 'token' : 'tokens'} of the {vehicle.make} {vehicle.model}.
        </p>
      </div>

      <div className="bg-vault-dark rounded-xl p-4 border border-vault-border text-left space-y-3">
        <div>
          <span className="text-xs text-vault-text block">Transaction Hash</span>
          {isDemoTx ? (
            <span className="text-sm font-mono text-vault-gold truncate block">{tx.tx_hash}</span>
          ) : (
            <a 
              href={getPolygonAmoyExplorerUrl(tx.tx_hash)} 
              target="_blank" 
              rel="noreferrer"
              className="text-sm font-mono text-vault-gold hover:underline flex items-center space-x-1"
            >
              <span className="truncate">{tx.tx_hash}</span>
              <ExternalLink size={14} />
            </a>
          )}
        </div>
        <div>
          <span className="text-xs text-vault-text block">Status</span>
          <span className="text-sm text-green-400 font-medium">Minted to Blockchain</span>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-left">
        <p className="text-xs text-blue-200">
          {isDemoTx 
            ? "Note: This is a demo transaction. The NFT is currently securely held in the VaultWheel custodial wallet." 
            : "Your NFT has been successfully minted on the Polygon Amoy testnet. Connect your MetaMask wallet to manage it directly."}
        </p>
      </div>

      <div className="pt-4 flex flex-col space-y-3">
        <Link to="/portfolio" onClick={onClose}>
          <button className="btn-gold w-full py-3">View Portfolio</button>
        </Link>
        <button onClick={onClose} className="text-vault-text hover:text-white transition-colors text-sm">
          Return to Marketplace
        </button>
      </div>
    </div>
  )
}

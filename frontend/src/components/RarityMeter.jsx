import { motion } from 'framer-motion'

export default function RarityMeter({ score }) {
  const circumference = 2 * Math.PI * 40 // r=40
  const strokeDashoffset = circumference - (score / 100) * circumference

  const getColor = (s) => {
    if (s >= 90) return '#f0b429'
    if (s >= 80) return '#a855f7'
    if (s >= 70) return '#60a5fa'
    return '#9ca3af'
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-vault-dark"
          />
          <motion.circle
            cx="64"
            cy="64"
            r="40"
            stroke={getColor(score)}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-3xl font-black" style={{ color: getColor(score) }}>
            {score}
          </span>
        </div>
      </div>
      <span className="text-vault-text font-medium mt-2 text-sm uppercase tracking-widest">
        Rarity Score
      </span>
    </div>
  )
}

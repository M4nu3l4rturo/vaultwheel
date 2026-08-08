import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, BookOpen, Coins, ArrowRight } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-vault-dark">
      {/* Hero */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-vault-dark via-transparent to-transparent z-10"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute bg-vault-gold rounded-full opacity-20 animate-float"
              style={{
                width: Math.random() * 6 + 2 + 'px',
                height: Math.random() * 6 + 2 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 5}s`
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full flex flex-col md:flex-row items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 space-y-8"
          >
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
              Invest in <span className="text-transparent bg-clip-text bg-gold-gradient">Legendary</span> Vehicles.
            </h1>
            <p className="text-xl text-vault-text max-w-lg leading-relaxed">
              Fractional ownership of the world's most coveted automobiles — verified on the blockchain.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/marketplace">
                <button className="btn-gold px-8 py-4 text-lg w-full sm:w-auto flex items-center justify-center space-x-2">
                  <span>Explore Marketplace</span>
                  <ArrowRight size={20} />
                </button>
              </Link>
              <a href="#how-it-works">
                <button className="btn-outline px-8 py-4 text-lg w-full sm:w-auto">
                  How it Works
                </button>
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="md:w-1/2 mt-12 md:mt-0 relative"
          >
            <div className="absolute inset-0 bg-vault-gold/20 blur-[100px] rounded-full"></div>
            <img 
              src="https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?auto=format&fit=crop&q=80" 
              alt="Luxury Car Silhouette" 
              className="relative z-10 w-full rounded-2xl shadow-2xl animate-float"
            />
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-vault-border bg-vault-card/50 backdrop-blur-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Iconic Vehicles', value: '10+' },
              { label: 'Total Value', value: '$39M+' },
              { label: 'Blockchain', value: 'Polygon Amoy' },
              { label: 'Global Investors', value: '2,500+' }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="space-y-2"
              >
                <div className="text-3xl md:text-4xl font-black text-vault-gold">{stat.value}</div>
                <div className="text-sm text-vault-text uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">How VaultWheel Works</h2>
          <p className="text-vault-text max-w-2xl mx-auto">A seamless, secure process to diversify your portfolio with tangible, high-yield assets.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              icon: <ShieldCheck className="w-12 h-12 text-vault-gold" />,
              title: 'Register & KYC',
              desc: 'Create an account and complete our secure identity verification process to unlock investing.'
            },
            {
              icon: <BookOpen className="w-12 h-12 text-vault-gold" />,
              title: 'Explore Passports',
              desc: 'Review detailed vehicle passports containing history, verification, and expert rarity analysis.'
            },
            {
              icon: <Coins className="w-12 h-12 text-vault-gold" />,
              title: 'Buy Tokens & Get NFT',
              desc: 'Purchase asset tokens securely. Receive an NFT representing your legal fractional ownership.'
            }
          ].map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="glass-card p-8 text-center"
            >
              <div className="mx-auto w-20 h-20 bg-vault-dark rounded-full flex items-center justify-center mb-6 border border-vault-border shadow-lg">
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-vault-text leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Demo Callout */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-vault-gold/10 border-2 border-vault-gold/30 rounded-2xl p-8 text-center shadow-[0_0_50px_rgba(240,180,41,0.1)]">
          <h3 className="text-2xl font-bold text-vault-gold mb-2">Hackathon Demo Notice</h3>
          <p className="text-vault-text">
            For demonstration purposes, you can log in using: <br/>
            <span className="text-white font-mono bg-vault-dark px-3 py-1 rounded mx-2 mt-4 inline-block">demo@vaultwheel.io</span> 
            / 
            <span className="text-white font-mono bg-vault-dark px-3 py-1 rounded mx-2 inline-block">Demo@2024</span>
          </p>
        </div>
      </section>

      <footer className="bg-vault-card border-t border-vault-border py-12 text-center">
        <div className="text-xl font-black text-white tracking-widest mb-4">
          VAULT<span className="text-vault-gold mx-1">◈</span>WHEEL
        </div>
        <p className="text-vault-text text-sm">Built for the Zerops Hackathon</p>
      </footer>
    </div>
  )
}

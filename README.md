# VaultWheel 🏎️

**Global Vehicle Tokenization Marketplace — Zerops Challenge Submission**

> Fractional ownership of the world's most legendary automobiles, verified on blockchain.

---

## 🚀 Live Demo

- **Frontend**: [https://frontend.vaultwheel.app.zerops.app](#) *(set after deploy)*
- **API Docs**: [https://backend.vaultwheel.app.zerops.app/docs](#) *(Swagger UI)*
- **Demo Login**: `demo@vaultwheel.io` / `Demo@2024`
- **Blockchain**: [Polygon Amoy Testnet Explorer](https://amoy.polygonscan.com)

---

## 🎯 The Concept

VaultWheel is a **two-sided marketplace** where:
- **Sellers** tokenize their verified collectible vehicles (after KYC + vehicle verification)
- **Buyers** invest in fractional tokens of legendary vehicles worldwide

Each vehicle gets a **Digital Vehicle Passport** — a verified record of history, provenance, and rarity. When you buy tokens, you receive an **ERC-1155 NFT** on Polygon Amoy testnet as proof of ownership.

### What Makes VaultWheel Different

| Feature | VaultWheel | Competitors |
|---|---|---|
| Vehicle Passport | ✅ Full verified history | ❌ Basic listing |
| Rarity Score | ✅ Algorithmic (0-100) | ❌ None |
| NFT Certificate | ✅ ERC-1155 on Polygon | ❌ Database only |
| Two-sided market | ✅ Sellers + Buyers | ❌ Curated only |
| Global access | ✅ Open worldwide | ❌ US/EU only |

---

## 🏎️ The 10 Vehicles

| Vehicle | Units | Valuation | Rarity |
|---|---|---|---|
| McLaren F1 1994 | 106 | $20M | 100/100 |
| Ferrari LaFerrari 2015 | 499 | $4.5M | 98/100 |
| Lamborghini Sesto Elemento | 20 | $3M | 99/100 |
| Ferrari Enzo 2003 | 400 | $4M | 97/100 |
| Pagani Huayra BC 2016 | 20 | $4.2M | 99/100 |
| Bugatti Veyron Super Sport | 30 | $3M | 97/100 |
| Koenigsegg Agera RS 2017 | 25 | $4M | 99/100 |
| Lexus LFA 2012 | 500 | $950K | 96/100 |
| Porsche Carrera GT 2004 | 1,270 | $1.5M | 93/100 |
| Mitsubishi Pajero Sig. 2020 | 500 (UAE) | $90K | 78/100 |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.12 + FastAPI + SQLAlchemy |
| Database | PostgreSQL 16 |
| Auth | JWT (python-jose) + bcrypt |
| Blockchain | Web3.py + ERC-1155 (Polygon Amoy) |
| Frontend | React 18 + Vite + Tailwind CSS |
| Deploy | Zerops (monorepo) |

---

## 📁 Project Structure

```
vaultwheel/
├── zerops.yaml              ← Zerops deployment config
├── README.md
├── contracts/
│   └── VaultWheelToken.sol  ← ERC-1155 smart contract (Polygon Amoy)
├── backend/                 ← FastAPI application
│   ├── main.py
│   ├── requirements.txt
│   ├── core/               (config, database, security)
│   ├── models/             (SQLAlchemy models)
│   ├── schemas/            (Pydantic schemas)
│   ├── routes/             (API endpoints)
│   └── services/           (rarity, web3, seed)
└── frontend/               ← React/Vite SPA
    ├── src/
    │   ├── pages/          (Landing, Marketplace, VehicleDetail, Portfolio, Auth)
    │   ├── components/     (VehicleCard, BuyModal, RarityMeter, etc.)
    │   └── services/       (api.js, web3.js)
    └── package.json
```

---

## ⚡ Quick Start (Local Dev)

### Prerequisites
- Python 3.12+
- Node.js 20+
- PostgreSQL 16 running locally

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate       # Windows
pip install -r requirements.txt

# Set up .env (copy from .env.example)
cp .env.example .env
# Edit DATABASE_URL in .env

# Run
uvicorn backend.main:app --reload
# API Docs: http://localhost:8000/docs
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# App: http://localhost:5173
```

---

## 🌐 Deploy on Zerops

1. **Create a Zerops project** at [app.zerops.io](https://app.zerops.io)
2. **Add services**: backend (Python 3.12), frontend (Node 20), database (PostgreSQL 16)
3. **Set environment variables** in the Zerops GUI:
   ```
   SECRET_KEY=<generate with: python -c "import secrets; print(secrets.token_hex(32))">
   DEMO_MODE=true
   POLYGON_RPC_URL=https://rpc-amoy.polygon.technology
   CONTRACT_ADDRESS=<from Remix deploy>
   PLATFORM_PRIVATE_KEY=<your wallet private key>
   PLATFORM_WALLET_ADDRESS=<your wallet address>
   ```
4. **DATABASE_URL** is auto-injected by Zerops PostgreSQL addon
5. **Push code** and trigger deployment via Zerops CLI or GitHub integration
6. The backend **auto-creates tables and seeds** the 10 vehicles on first startup

---

## 🔗 Smart Contract (Polygon Amoy Testnet)

The `VaultWheelToken.sol` ERC-1155 contract is deployed on Polygon Amoy testnet.

**To deploy your own:**
1. Go to [remix.ethereum.org](https://remix.ethereum.org)
2. Create `VaultWheelToken.sol` with the contents of `contracts/VaultWheelToken.sol`
3. Compile with Solidity 0.8.20
4. Connect MetaMask to Polygon Amoy (Chain ID: 80002)
5. Get free MATIC from [faucet.polygon.technology](https://faucet.polygon.technology)
6. Deploy and copy the contract address

**Demo Mode**: If `CONTRACT_ADDRESS` is not set, the backend runs in DEMO MODE — NFT transactions are simulated with a deterministic hash and no real blockchain transaction is made.

---

## 🎭 Demo Flow for Judges

1. Visit the landing page
2. Click **"Explore Marketplace"** to see all 10 vehicles
3. Register with any email OR use `demo@vaultwheel.io / Demo@2024`
4. KYC is auto-approved (in production: Sumsub verification)
5. Click any vehicle → explore its **Vehicle Passport**
6. Buy tokens → receive NFT confirmation with tx_hash
7. View your **Portfolio** with holdings and transaction history
8. Verify the NFT on [amoy.polygonscan.com](https://amoy.polygonscan.com)

---

## 📝 Production Roadmap

- **KYC**: Integrate [Sumsub](https://sumsub.com) for real identity verification
- **Payments**: Stripe or crypto payment rails for real fiat/crypto
- **Secondary Market**: Order book for token holders to sell their positions
- **Yield**: Revenue sharing when vehicles are leased/rented for events
- **MetaMask**: Direct wallet connection for non-custodial NFT receipt
- **Mainnet**: Deploy to Polygon mainnet for real transactions

---

## 👥 Credits

Built for **The Zerops Challenge** hackathon.

*"Where legendary vehicles meet verified fractional ownership."*

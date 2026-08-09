# VaultWheel 🏎️

**Global Vehicle Tokenization Marketplace — Real-World Asset (RWA) Platform**  
*Built for The Zerops Challenge Hackathon*

> Fractional ownership of the world's most legendary automobiles, verified on blockchain.

---

## 🌟 Executive Summary & Core Concept

**VaultWheel** is a global decentralized Real-World Asset (RWA) platform that democratizes high-yield luxury vehicle investments. 

### The Core Vision
- **For Vehicle Owners Worldwide**: Anyone owning a verified, rare, or collectible vehicle can tokenize their automobile. By publishing a **Digital Vehicle Passport** (containing verified history, mechanical condition, valuation, and provenance), owners unlock immediate global liquidity by fractionalizing their asset.
- **For Global Investors & Speculators**: Investors worldwide can gain fractional ownership in multi-million dollar hypercars starting with accessible amounts. Token holders can hold for long-term appreciation or trade their fractional tokens on the **Secondary Peer-to-Peer Market** based on market demand, rarity scores, and vehicle milestones.

---

## 🚀 Judge Frictionless Demo Mode

To allow **hackathon judges** to test and verify every feature seamlessly without requiring crypto exchange accounts, external wallet setups, or waiting for manual admin approvals, **VaultWheel features an interactive Demo Mode**.

### 🔑 Demo Highlights for Judges
- **No Web3 / Exchange Required**: Blockchain operations (ERC-1155 minting on Polygon Amoy testnet) run in custodial demo mode with deterministic transaction hashes.
- **Automated KYC**: Instant registration with simulated instant KYC approval (powered conceptually by Sumsub).
- **Instant Demo Funds**: Pre-funded accounts ($250,000 USD virtual balance) + instant top-up simulation to test any primary or secondary purchase.

---

## ⚡ 2-Minute Guided Tour for Judges

Follow these simple steps to verify the entire platform lifecycle:

1. **Sign In**:
   - Use pre-configured demo credentials:  
     **Email**: `demo@vaultwheel.io` | **Password**: `Demo@2024`  
     *(Or create a new account — KYC is auto-approved in Demo Mode).*

2. **Explore Primary Marketplace**:
   - Navigate to **Marketplace** → **Primary Offerings**.
   - Filter vehicles by rarity tier (**LEGENDARY**, **ELITE**, **RARE**).
   - Click any vehicle (e.g., *McLaren F1 1994* or *Ferrari LaFerrari*) to inspect its **Digital Vehicle Passport**, complete with timeline history, technical specs, and interactive **Rarity Score (0-100)**.

3. **Purchase Primary Tokens**:
   - Click **Invest Now**, select the desired token quantity, and confirm purchase.
   - Receive an instant **NFT Confirmation Modal** displaying your Polygon transaction hash.

4. **Trade on the Secondary Market**:
   - Go to **Portfolio** to view your owned vehicle assets.
   - Click **List for Sale** on any of your holdings to post your tokens to the Secondary Market at your custom price per token.
   - Switch to **Marketplace** → **Secondary Market** to see active peer-to-peer listings.
   - Test buying secondary listings or return to your Portfolio under **My Active Listings** to cancel a listing and instantly recover your locked tokens.

5. **Simulate Fiat Deposit**:
   - In **Portfolio**, click **Deposit Funds (Demo)** to add virtual capital ($1,000+) instantly.

---

## 🛡️ Trust Architecture & KYC via Sumsub

In production, global compliance and identity verification are managed seamlessly without relying on centralized local administrators:

- **Automated Global KYC/AML**: Integrated via [Sumsub](https://sumsub.com) API for automated passport/ID parsing, liveness checks, and international sanction screening across 220+ jurisdictions.
- **Automated Vehicle Verification**: Partner network of certified vehicle appraisers and climate-controlled storage vaults verify VIN, chassis numbers, and condition before on-chain minting.

---

## 🏎️ Featured Fleet & Rarity Index

VaultWheel features 10 iconic vehicles categorized by an algorithmic **Rarity Score (0-100)**:

| Vehicle | Production Units | Valuation | Rarity Score | Rarity Tier |
|---|---|---|---|---|
| **McLaren F1 (1994)** | 106 | $20,000,000 | 100 / 100 | LEGENDARY |
| **Lamborghini Sesto Elemento** | 20 | $3,000,000 | 99 / 100 | LEGENDARY |
| **Pagani Huayra BC (2016)** | 20 | $4,200,000 | 99 / 100 | LEGENDARY |
| **Koenigsegg Agera RS (2017)** | 25 | $4,000,000 | 99 / 100 | LEGENDARY |
| **Ferrari LaFerrari (2015)** | 499 | $4,500,000 | 98 / 100 | ELITE |
| **Ferrari Enzo (2003)** | 400 | $4,000,000 | 97 / 100 | ELITE |
| **Bugatti Veyron Super Sport** | 30 | $3,000,000 | 97 / 100 | ELITE |
| **Lexus LFA (2012)** | 500 | $950,000 | 96 / 100 | ELITE |
| **Porsche Carrera GT (2004)** | 1,270 | $1,500,000 | 93 / 100 | ELITE |
| **Mitsubishi Pajero Signature** | 500 (UAE) | $90,000 | 78 / 100 | RARE |

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Backend** | Python 3.12 + FastAPI | Async REST API, SQLAlchemy ORM, Pydantic v2 |
| **Database** | PostgreSQL 16 / SQLite | Relational database storing asset metadata, transactions & holdings |
| **Blockchain** | Web3.py + Solidity | ERC-1155 Multi-Token Standard deployed on Polygon Amoy testnet |
| **Frontend** | React 18 + Vite + Tailwind CSS | Modern responsive SPA, Framer Motion animations, Lucide Icons |
| **Deployment** | Zerops | Containerized monorepo build & deployment pipeline |

---

## 📁 Project Structure

```
vaultwheel/
├── zerops.yaml              ← Zerops automated deployment configuration
├── README.md
├── contracts/
│   └── VaultWheelToken.sol  ← ERC-1155 Smart Contract (Polygon Amoy)
├── backend/                 ← FastAPI Backend Service
│   ├── main.py
│   ├── requirements.txt
│   ├── core/                (database, config, security)
│   ├── models/              (SQLAlchemy: User, Vehicle, Token, Transaction, Listing, Holding)
│   ├── schemas/             (Pydantic schemas)
│   ├── routes/              (auth, vehicles, tokens, transactions, market, holdings, payments)
│   └── services/            (seed, web3_service, rarity)
└── frontend/                ← React SPA Frontend
    ├── src/
    │   ├── pages/           (Landing, Marketplace, VehicleDetail, Portfolio, Auth)
    │   ├── components/      (VehicleCard, SecondaryListingCard, BuyModal, SellModal, DepositModal, NFTConfirmation)
    │   └── services/        (api.js, web3.js)
    └── package.json
```

---

## 💻 Local Development Quickstart

### Prerequisites
- Python 3.12+
- Node.js 20+

### 1. Backend Setup
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt
uvicorn backend.main:app --reload
```
- **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs) (Swagger UI)

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- **Web Application**: [http://localhost:5173](http://localhost:5173)

---

## 🌐 Deploying on Zerops

VaultWheel is configured for zero-downtime deployment on Zerops via `zerops.yaml`:

1. Import the repository into your **Zerops project**.
2. Provision the services defined in `zerops.yaml` (Python backend, Node.js frontend, PostgreSQL database).
3. Set `DEMO_MODE=true` in environment variables.
4. On startup, the backend automatically runs database migrations and seeds the vehicle fleet.

---

## 👥 Credits & Acknowledgments

Built with passion for **The Zerops Challenge** hackathon.

*"Bringing world-class automobiles on-chain with verified fractional liquidity."*

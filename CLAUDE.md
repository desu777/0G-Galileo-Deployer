# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a gamified smart contract deployment platform with two modes:
1. **Classic Mode**: Deploys standard smart contracts (ERC-20, NFT, DAO, etc.)
2. **Jaine Mode**: Deploys humorous "rejection-themed" token contracts

The platform uses a slot machine mechanic with rarity tiers (Common, Rare, Epic, Legendary, Mythic) to randomly select contracts for deployment on 0G-Galileo-Testnet.

## Architecture

### Frontend (`/front`)
- **React 18.3 + TypeScript + Vite** application
- **RainbowKit/Wagmi** for Web3 wallet integration
- **Component-based architecture** with each component <400 lines
- **Dual mode system** via ModeContext (Classic/Jaine)
- **Contract templates** in `/front/src/contracts/` and `/front/src/contracts/jaine/`

### Backend Compiler (`/compiler`)
- **Express.js API** for Solidity compilation
- **Real-time contract compilation** with solc 0.8.20
- **CORS-enabled** for cross-domain requests

### Smart Contracts (`/contracts`)
- **Base contract**: `PumpJaineBase.sol` - ERC-20 base for Jaine mode tokens
- **Jaine contracts**: Organized in folders by rarity (common, rare, epic, legendary, etc.)
- Each Jaine contract extends PumpJaineBase with unique rejection scenarios

## Development Commands

### Frontend
```bash
cd front
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:5173)
npm run build        # Build for production
npm run build:prod   # Build without TypeScript checks
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Compiler Service
```bash
cd compiler
npm install          # Install dependencies
npm run dev          # Start dev server with hot reload
npm run build        # Build TypeScript
npm run build:prod   # Build with skipLibCheck
npm start            # Run production server (port 3001)
npm test             # Run Jest tests
```

### Environment Setup
Frontend requires `.env`:
- `VITE_WALLETCONNECT_PROJECT_ID` - WalletConnect project ID
- `VITE_COMPILER_API_URL` - Compiler service URL (default: http://localhost:3001)
- `VITE_0G_RPC_URL` - 0G testnet RPC URL
- `VITE_0G_EXPLORER_URL` - Block explorer URL

Compiler requires `.env`:
- `PORT` - Server port (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS

## Key Workflows

### Adding New Classic Contract Type
1. Create contract template in `/front/src/contracts/[name].ts`
2. Add to CONTRACT_TYPES in `/front/src/constants/index.ts`
3. Export from `/front/src/contracts/index.ts`
4. Update rarity distribution if needed

### Adding New Jaine Contract
1. Create `.sol` file in `/contracts/[rarity-folder]/`
2. Extend `PumpJaineBase` contract
3. Create TypeScript template in `/front/src/contracts/jaine/[rarity].ts`
4. Add to JAINE_CONTRACT_TYPES in `/front/src/constants/jaine.ts`
5. Export from `/front/src/contracts/jaine/index.ts`

### Contract Deployment Flow
1. User spins slot machine → random contract selected
2. Configuration form rendered based on contract's constructor parameters
3. Form data processed via `processFormDataToConstructorArgs()`
4. Contract source sent to compiler service for compilation
5. Compiled bytecode + ABI returned to frontend
6. Frontend deploys via Wagmi/Viem to 0G-Galileo-Testnet
7. Transaction confirmed and contract address displayed

## Important Implementation Details

### Dynamic Form Generation
- Contract templates define `constructorParams` array
- Each param specifies: name, type, label, placeholder, defaultValue
- Configuration component auto-generates forms based on these params
- Special handling for arrays (comma-separated input)

### Compilation Service
- Uses solc with optimizer (200 runs)
- Handles OpenZeppelin imports
- Returns both ABI and bytecode for deployment
- CORS configured for frontend domain

### Jaine Mode Architecture
- All Jaine contracts inherit from PumpJaineBase (ERC-20)
- Each contract represents a different "rejection scenario"
- Contracts organized by emotional damage severity (rarity tiers)
- Frontend dynamically switches UI theme and contract sets based on mode

### State Management
- ModeContext manages Classic/Jaine mode switching
- Deployment flow: slot → configuration → deploying → deployed
- Statistics tracked: spins, streak, deployments, combo multiplier
- Sound effects and particle animations based on rarity

## Testing Approach
- No automated tests currently configured
- Manual testing via local development servers
- Deployment testing on 0G-Galileo-Testnet

## Deployment
Production deployment uses PM2 process manager:
- Frontend served via `npm run preview` (port 3998)
- Compiler served via `npm start` (port 3999)
- Nginx reverse proxy with SSL for both services
- See `SIMPLE_DEPLOYMENT.md` for detailed deployment instructions
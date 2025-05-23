# 0G Contract Slot Machine

A gamified smart contract deployment application built with React, TypeScript, and Vite. Spin the slot machine to randomly deploy different types of smart contracts with a rarity system inspired by gaming mechanics.

## Features

- 🎰 **Slot Machine Mechanics**: Spin to randomly select from 13 different contract types
- 🌟 **Rarity System**: Contracts have different rarity levels (Common, Rare, Epic, Legendary, Mythic)
- 🔥 **Combo System**: Build streaks for better chances at rare contracts
- 🎮 **Gamification**: Achievements, statistics tracking, and visual effects
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎵 **Sound Effects**: Audio feedback for different rarity levels
- ✨ **Visual Effects**: Particles, animations, and dynamic styling

## Contract Types

### Mythic (Ultra Rare)
- Cross-Chain Bridge
- DAO Governance
- DEX Router

### Legendary (Very Rare)
- ERC-20 Token
- Price Oracle

### Epic (Rare)
- MultiSig Wallet
- Staking Pool
- NFT Marketplace

### Rare (Uncommon)
- ERC-721 NFT
- Lottery
- Yield Vault

### Common
- Greeter
- Counter

## Project Structure

```
src/
├── components/          # React components (each <400 lines)
│   ├── Header.tsx      # Stats bar and logo
│   ├── SlotMachine.tsx # Main slot machine interface
│   ├── Configuration.tsx # Contract configuration forms
│   ├── Deploying.tsx   # Deployment animation
│   └── Deployed.tsx    # Success screen
├── constants/
│   └── index.ts        # Contract types, rarity colors, achievements
├── types/
│   └── index.ts        # TypeScript type definitions
├── utils/
│   └── index.ts        # Helper functions (particles, sounds, random)
├── styles/
│   └── globals.css     # All CSS styles
├── App.tsx             # Main application orchestrator
└── main.tsx            # React entry point
```

## Technology Stack

- **React 18.3.1** - UI library
- **TypeScript 5.6.2** - Type safety
- **Vite 6.0.7** - Build tool and dev server
- **Lucide React 0.511.0** - Icon library
- **Particles.js** - Particle effects
- **CSS3** - Styling with animations and responsive design

## Installation & Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Start development server**:
```bash
npm run dev
```

3. **Build for production**:
```bash
npm run build
```

4. **Preview production build**:
```bash
npm run preview
```

## How to Play

1. **Spin**: Click "SPIN TO DEPLOY" to start the slot machine
2. **Win**: Get matching contracts in all three slots
3. **Configure**: Fill out the contract configuration form
4. **Deploy**: Watch the deployment animation
5. **Success**: View your deployed contract details
6. **Repeat**: Spin again to build your combo multiplier!

## Game Mechanics

### Combo System
- Non-common contracts increase your streak
- Higher streaks improve chances for rare contracts
- Combo multiplier caps at 2.0x
- Common contracts reset your streak

### Achievements
- First Contract Deployed
- Lucky Streak (5+ consecutive non-common)
- Rarity-based achievements for special contracts

### Statistics
- Total spins count
- Current win streak
- Deployed contracts history
- Combo multiplier display

## Component Architecture

Each component is designed to be under 400 lines and focused on a single responsibility:

- **Header**: Game statistics and controls
- **SlotMachine**: Core spinning mechanics and recent deployments
- **Configuration**: Dynamic forms for different contract types
- **Deploying**: Animated deployment progress
- **Deployed**: Success screen with contract details

## Development Notes

- Frontend is kept 1:1 with the original design
- All components are modular and reusable
- TypeScript ensures type safety throughout
- CSS uses modern features like backdrop-filter and CSS Grid
- Sound effects use Web Audio API
- Particle system provides visual feedback

## Browser Support

- Modern browsers with ES2020 support
- CSS backdrop-filter support recommended
- Web Audio API for sound effects

## Future Enhancements

- Real blockchain integration
- Persistent statistics
- More contract types
- Enhanced particle effects
- Multiplayer leaderboards

---

Built with ❤️ for the 0G Network community 
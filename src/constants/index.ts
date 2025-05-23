import { Sparkles, Code, Coins, MessageSquare, Calculator, Palette, Zap, Trophy, Cpu, Shield, Rocket, AlertCircle, Star, Flame, Crown, Gift, Gamepad2, Volume2, VolumeX } from 'lucide-react';
import { ContractType, RarityColors, ContractRarity } from '../types';

// Enhanced contract types with more variety and rarity - REDUCED TO 7 BROWSER-COMPILABLE CONTRACTS
export const CONTRACT_TYPES: ContractType[] = [
  { id: 'greeter', name: 'Greeter', icon: MessageSquare, color: '#00D2E9', rarity: 'common', chance: 25, description: 'Say hello to the blockchain' },
  { id: 'counter', name: 'Counter', icon: Calculator, color: '#FF5CAA', rarity: 'common', chance: 25, description: 'Count your way to success' },
  { id: 'erc20', name: 'ERC-20 Token', icon: Coins, color: '#FFD700', rarity: 'legendary', chance: 8, description: 'The gold standard of tokens' },
  { id: 'nft721', name: 'ERC-721 NFT', icon: Palette, color: '#9B59B6', rarity: 'rare', chance: 15, description: 'Unique digital collectibles' },
  { id: 'lottery', name: 'Lottery', icon: Trophy, color: '#F39C12', rarity: 'rare', chance: 12, description: 'Fortune favors the bold' },
  { id: 'multisig', name: 'MultiSig Wallet', icon: Shield, color: '#E74C3C', rarity: 'epic', chance: 8, description: 'Ultimate security solution' },
  { id: 'staking', name: 'Staking Pool', icon: Zap, color: '#2ECC71', rarity: 'epic', chance: 7, description: 'Earn while you sleep' }
];

// Enhanced rarity system with mythic tier
export const RARITY_COLORS: Record<ContractRarity, RarityColors> = {
  common: { bg: 'rgba(96, 125, 139, 0.2)', border: '#607D8B', glow: 'rgba(96, 125, 139, 0.5)', textShadow: '0 0 10px rgba(96, 125, 139, 0.8)' },
  rare: { bg: 'rgba(41, 128, 185, 0.2)', border: '#2980B9', glow: 'rgba(41, 128, 185, 0.5)', textShadow: '0 0 15px rgba(41, 128, 185, 0.8)' },
  epic: { bg: 'rgba(142, 68, 173, 0.2)', border: '#8E44AD', glow: 'rgba(142, 68, 173, 0.5)', textShadow: '0 0 20px rgba(142, 68, 173, 0.9)' },
  legendary: { bg: 'rgba(255, 215, 0, 0.2)', border: '#FFD700', glow: 'rgba(255, 215, 0, 0.6)', textShadow: '0 0 25px rgba(255, 215, 0, 1)' },
  mythic: { bg: 'rgba(255, 0, 128, 0.2)', border: '#FF0080', glow: 'rgba(255, 0, 128, 0.8)', textShadow: '0 0 30px rgba(255, 0, 128, 1)' }
};

export const ACHIEVEMENT_MESSAGES = [
  "First Contract Deployed! 🎉",
  "Lucky Streak! 🍀",
  "Rare Hunter! 💎",
  "Epic Collector! ⚡",
  "Legendary Master! 👑",
  "Token Creator! 🪙"
]; 
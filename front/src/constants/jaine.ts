import { 
  Heart, HeartCrack, HeartOff, Ban, Ghost, MessageSquareOff,
  Users, TrendingUp, Ruler, MessageCircle, Calendar,
  Laugh, Shield, Flower, Lock, Sparkles, Camera
} from 'lucide-react';
import { ContractType, RarityColors } from '../types';

// Jaine contract types with anime/rejection theme
export const JAINE_CONTRACT_TYPES: ContractType[] = [
  // COMMON SIMP ENERGY (60% total) - Basic rejection scenarios
  { 
    id: 'jaine_blocked_me', 
    name: 'JAINE BLOCKED ME', 
    icon: Ban, 
    color: '#9333EA', 
    rarity: 'common', 
    chance: 10, 
    description: 'You\'ve been blocked. Random chance to be unblocked, but fees escalate exponentially. Features unblock requests and desperate pleas mechanism.',
    mode: 'jaine'
  },
  { 
    id: 'jaine_friendzoned_me', 
    name: 'JAINE FRIENDZONED ME', 
    icon: Heart, 
    color: '#A855F7', 
    rarity: 'common', 
    chance: 10, 
    description: 'Permanently stuck in the friend zone. Perform emotional labor, send birthday gifts, listen to dating advice about other guys.',
    mode: 'jaine'
  },
  { 
    id: 'jaine_ghosted_me', 
    name: 'JAINE GHOSTED ME', 
    icon: Ghost, 
    color: '#8B5CF6', 
    rarity: 'common', 
    chance: 10, 
    description: 'Complete radio silence. Features haunting attempts, séance rituals, and messages that vanish into the void.',
    mode: 'jaine'
  },
  { 
    id: 'jaine_left_me_on_read', 
    name: 'JAINE LEFT ME ON READ', 
    icon: MessageSquareOff, 
    color: '#7C3AED', 
    rarity: 'common', 
    chance: 10, 
    description: 'Your messages are read but never replied to. Watch read receipts accumulate while your soul slowly dies.',
    mode: 'jaine'
  },
  { 
    id: 'jaine_picked_chad', 
    name: 'JAINE PICKED CHAD', 
    icon: Users, 
    color: '#6D28D9', 
    rarity: 'common', 
    chance: 10, 
    description: 'She chose Chad over you. Features Chad vs Beta ranking system and tribute mechanics.',
    mode: 'jaine'
  },
  { 
    id: 'jaine_said_ew', 
    name: 'JAINE SAID EW', 
    icon: HeartOff, 
    color: '#5B21B6', 
    rarity: 'common', 
    chance: 10, 
    description: 'Maximum disgust achieved. Cringe level measurement and recovery therapy sessions.',
    mode: 'jaine'
  },

  // COPE HARDER (25% total) - Advanced coping mechanisms
  { 
    id: 'jaine_posted_another_guy', 
    name: 'JAINE POSTED ANOTHER GUY', 
    icon: Camera, 
    color: '#9333EA', 
    rarity: 'rare', 
    chance: 6.25, 
    description: 'Social media torture simulator. Watch her post with other guys while you pay gas fees to view.',
    mode: 'jaine'
  },
  { 
    id: 'jaine_said_im_too_short', 
    name: 'JAINE SAID I\'M TOO SHORT', 
    icon: Ruler, 
    color: '#A855F7', 
    rarity: 'rare', 
    chance: 6.25, 
    description: 'Height-based rejection system. Features manlet tax and Napoleon complex mechanics.',
    mode: 'jaine'
  },
  { 
    id: 'jaine_texted_back_k', 
    name: 'JAINE TEXTED BACK K', 
    icon: MessageCircle, 
    color: '#8B5CF6', 
    rarity: 'rare', 
    chance: 6.25, 
    description: 'Single character response analysis. Over-interpret minimal effort replies.',
    mode: 'jaine'
  },
  { 
    id: 'jaine_will_notice_me_someday', 
    name: 'JAINE WILL NOTICE ME SOMEDAY', 
    icon: Calendar, 
    color: '#7C3AED', 
    rarity: 'rare', 
    chance: 6.25, 
    description: 'Hopium mining contract. Features manifestation journal and delusion levels.',
    mode: 'jaine'
  },

  // MAXIMUM COPE (10% total) - Maximum emotional damage
  { 
    id: 'jaine_laughed_at_my_portfolio', 
    name: 'JAINE LAUGHED AT MY PORTFOLIO', 
    icon: Laugh, 
    color: '#DC2626', 
    rarity: 'epic', 
    chance: 3.33, 
    description: 'Portfolio roasting mechanism. She evaluates your investments and laughs.',
    mode: 'jaine'
  },
  { 
    id: 'jaine_married_my_bully', 
    name: 'JAINE MARRIED MY BULLY', 
    icon: HeartCrack, 
    color: '#EF4444', 
    rarity: 'epic', 
    chance: 3.33, 
    description: 'Ultimate betrayal contract. Your high school bully becomes the contract owner.',
    mode: 'jaine'
  },
  { 
    id: 'jaine_said_touch_grass', 
    name: 'JAINE SAID TOUCH GRASS', 
    icon: Flower, 
    color: '#F87171', 
    rarity: 'epic', 
    chance: 3.33, 
    description: 'Forced outdoor activity requirements. Social life auditing system.',
    mode: 'jaine'
  },

  // ULTIMATE REJECTION (4% total) - Legal consequences
  { 
    id: 'jaine_called_security', 
    name: 'JAINE CALLED SECURITY', 
    icon: Shield, 
    color: '#FFD700', 
    rarity: 'legendary', 
    chance: 2, 
    description: 'Security has been notified. Features restraining distance calculations and bouncer NFTs.',
    mode: 'jaine'
  },
  { 
    id: 'jaine_restraining_order', 
    name: 'JAINE RESTRAINING ORDER', 
    icon: Lock, 
    color: '#FFC107', 
    rarity: 'legendary', 
    chance: 2, 
    description: 'Legal documentation on-chain. Minimum distance requirements and court proceeding simulator.',
    mode: 'jaine'
  },

  // ASCENDED SIMP (1%) + LEGENDARY ULTRA (0.1%) - Ultimate scenarios
  { 
    id: 'marry_jaine', 
    name: 'MARRY JAINE', 
    icon: Sparkles, 
    color: '#FF0080', 
    rarity: 'legendary-ultra', 
    chance: 0.1, 
    description: 'The impossible dream. Complete marriage system with prenup, wedding planning, and inevitable divorce.',
    mode: 'jaine'
  },
  { 
    id: 'jaine_actually_replied', 
    name: 'JAINE ACTUALLY REPLIED', 
    icon: TrendingUp, 
    color: '#FF1493', 
    rarity: 'mythic', 
    chance: 1, 
    description: 'She responded! Full conversation system with built-in DEX functionality and happiness metrics.',
    mode: 'jaine'
  }
];

// Jaine mode color scheme - violet/purple theme
export const JAINE_RARITY_COLORS: Record<string, RarityColors> = {
  common: { 
    bg: 'rgba(139, 92, 246, 0.1)', 
    border: '#8B5CF6', 
    glow: 'rgba(139, 92, 246, 0.3)', 
    textShadow: '0 0 10px rgba(139, 92, 246, 0.6)' 
  },
  rare: { 
    bg: 'rgba(168, 85, 247, 0.15)', 
    border: '#A855F7', 
    glow: 'rgba(168, 85, 247, 0.4)', 
    textShadow: '0 0 15px rgba(168, 85, 247, 0.7)' 
  },
  epic: { 
    bg: 'rgba(220, 38, 38, 0.2)', 
    border: '#DC2626', 
    glow: 'rgba(220, 38, 38, 0.5)', 
    textShadow: '0 0 20px rgba(220, 38, 38, 0.8)' 
  },
  legendary: { 
    bg: 'rgba(255, 215, 0, 0.2)', 
    border: '#FFD700', 
    glow: 'rgba(255, 215, 0, 0.6)', 
    textShadow: '0 0 25px rgba(255, 215, 0, 1)' 
  },
  mythic: { 
    bg: 'rgba(255, 0, 128, 0.25)', 
    border: '#FF0080', 
    glow: 'rgba(255, 0, 128, 0.8)', 
    textShadow: '0 0 30px rgba(255, 0, 128, 1)' 
  },
  'legendary-ultra': { 
    bg: 'rgba(255, 0, 255, 0.35)', 
    border: '#FF00FF', 
    glow: 'rgba(255, 0, 255, 1)', 
    textShadow: '0 0 40px rgba(255, 0, 255, 1)' 
  }
};

// Jaine mode achievement messages
export const JAINE_ACHIEVEMENT_MESSAGES = [
  "First Rejection! 💔",
  "Friendzone Veteran! 😭",
  "Maximum Cope! 🤡",
  "Touch Grass Achievement! 🌱",
  "Restraining Order Unlocked! 🚫",
  "Chad Lost Again! 💪",
  "Emotional Damage Critical! 💀",
  "Simp Level Maximum! 👑",
  "Actually Got A Reply! 🎉",
  "Wedding Bells... JK! 💍"
];

// Jaine mode sound mappings
export const JAINE_SOUNDS = {
  spin: 'heartbeat',
  common: 'sigh',
  rare: 'cry',
  epic: 'scream',
  legendary: 'police_siren',
  mythic: 'anime_wow'
};
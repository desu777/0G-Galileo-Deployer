import React from 'react';
import { X, Rocket, RefreshCw, Sparkles, Star, Trophy, Gem, Globe } from 'lucide-react';
import { ContractType } from '../types';
import { useMode } from '../contexts/ModeContext';

interface ContractModalProps {
  contract: ContractType | null;
  isOpen: boolean;
  onClose: () => void;
  onDeploy: () => void;
  onSpinAgain: () => void;
}

// Contract descriptions for Classic mode
const CLASSIC_DESCRIPTIONS: Record<string, { description: string; features: string[] }> = {
  'erc20_basic': {
    description: 'A standard fungible token that can be transferred between addresses. Perfect for creating your own cryptocurrency or utility token.',
    features: [
      'Fixed token supply with 18 decimals',
      'Transfer tokens between addresses',
      'Approve spending allowances',
      'Check balances and total supply'
    ]
  },
  'erc20_mintable': {
    description: 'An advanced ERC-20 token with minting capabilities. Only the owner can create new tokens, making it ideal for reward systems.',
    features: [
      'Mint new tokens (owner only)',
      'Burn tokens to reduce supply',
      'Pausable transfers for emergencies',
      'Standard ERC-20 functions'
    ]
  },
  'erc20_burnable': {
    description: 'An ERC-20 token where holders can permanently destroy their tokens, reducing the total supply and potentially increasing scarcity.',
    features: [
      'Burn your own tokens',
      'Burn from approved addresses',
      'Deflationary mechanism',
      'Track total burned amount'
    ]
  },
  'erc721_nft': {
    description: 'Create your own NFT collection! Each token is unique and can represent digital art, collectibles, or any unique asset.',
    features: [
      'Mint unique NFTs',
      'Set custom metadata URIs',
      'Transfer and trade NFTs',
      'Enumerate owned tokens'
    ]
  },
  'erc1155_multi': {
    description: 'A multi-token standard that combines fungible and non-fungible tokens in one contract. Perfect for gaming assets.',
    features: [
      'Multiple token types in one contract',
      'Batch transfers for efficiency',
      'Mix fungible and NFTs',
      'URI management for metadata'
    ]
  },
  'governance_dao': {
    description: 'A decentralized autonomous organization contract for community governance. Token holders can create and vote on proposals.',
    features: [
      'Create governance proposals',
      'Vote with token weight',
      'Time-locked execution',
      'Delegate voting power'
    ]
  },
  'staking_rewards': {
    description: 'Stake tokens to earn rewards over time. Great for incentivizing long-term holding and community participation.',
    features: [
      'Stake tokens for rewards',
      'Compound earnings automatically',
      'Flexible withdrawal options',
      'Real-time reward calculation'
    ]
  },
  'timelock_vault': {
    description: 'A secure vault that locks tokens for a specified period. Perfect for vesting schedules or savings.',
    features: [
      'Lock tokens with custom duration',
      'Gradual release schedules',
      'Multiple beneficiaries',
      'Emergency withdrawal (with penalty)'
    ]
  },
  'payment_splitter': {
    description: 'Automatically split incoming payments between multiple recipients based on predefined shares.',
    features: [
      'Define payment shares',
      'Automatic distribution',
      'Track individual balances',
      'Withdraw accumulated funds'
    ]
  },
  'crowdfunding': {
    description: 'Launch a decentralized crowdfunding campaign with automatic refunds if the goal isn\'t met.',
    features: [
      'Set funding goal and deadline',
      'Automatic refunds on failure',
      'Contributor tracking',
      'Milestone-based releases'
    ]
  },
  'lottery': {
    description: 'A provably fair lottery system where participants can buy tickets and win the accumulated prize pool.',
    features: [
      'Buy lottery tickets',
      'Random winner selection',
      'Automatic prize distribution',
      'Historical draw records'
    ]
  },
  'escrow': {
    description: 'A trustless escrow service for secure transactions between parties with dispute resolution.',
    features: [
      'Create escrow agreements',
      'Multi-party approval',
      'Dispute resolution mechanism',
      'Automatic fund release'
    ]
  },
  'multisig_wallet': {
    description: 'A wallet that requires multiple signatures to execute transactions, providing enhanced security.',
    features: [
      'Multiple owner management',
      'Configurable approval threshold',
      'Transaction queuing',
      'Emergency recovery options'
    ]
  },
  'vesting_schedule': {
    description: 'Manage token vesting for team members and investors with customizable release schedules.',
    features: [
      'Create vesting schedules',
      'Cliff and linear vesting',
      'Revocable grants',
      'Beneficiary management'
    ]
  },
  'merkle_airdrop': {
    description: 'Efficiently distribute tokens to many addresses using Merkle trees for gas optimization.',
    features: [
      'Gas-efficient airdrops',
      'Merkle proof verification',
      'Claim tracking',
      'Unclaimed token recovery'
    ]
  },
  'flash_loan': {
    description: 'Provide flash loans for arbitrage and DeFi strategies. Loans must be repaid in the same transaction.',
    features: [
      'Instant uncollateralized loans',
      'Customizable fees',
      'Flash loan attack protection',
      'Integration with DeFi protocols'
    ]
  },
  'soulbound_token': {
    description: 'Non-transferable tokens that represent achievements, credentials, or membership that stays with the original owner.',
    features: [
      'Permanently bound to address',
      'Achievement and credential tracking',
      'Revocation by issuer',
      'On-chain reputation building'
    ]
  }
};

// Contract descriptions for Jaine mode
const JAINE_DESCRIPTIONS: Record<string, { description: string; features: string[] }> = {
  'jaine_blocked_me': {
    description: 'Token that randomly blocks you mid-transaction with classic rejection excuses. Block duration increases with each block. Unblock attempts always fail but still take your money.',
    features: [
      'Random 5-50% chance to get blocked during transfers',
      'Pay ETH to attempt unblock (always fails, fee increases 50% each time)',
      'Appeals always rejected with "reasons undisclosed"',
      '6 rejection reasons: "You\'re too clingy", "I need space", "It\'s not you, it\'s me"'
    ]
  },
  'jaine_friendzoned_me': {
    description: 'Earn friend points by sending birthday gifts and listening to advice about other guys. Escape attempts cost exponentially more and always fail. Final tier: "NEVER_BOYFRIEND".',
    features: [
      '6 friend tiers from STRANGER to NEVER_BOYFRIEND',
      'Perform emotional labor for friend points (ETH goes to Jaine)',
      'Escape attempts cost 2^attempts ETH (always fail)',
      'Listen to dating advice about other guys for maximum pain'
    ]
  },
  'jaine_left_me_on_read': {
    description: 'Auto-burns 1% of supply per hour since last read. Loneliness level increases burn rate. Messages can be sent but rarely get marked as read.',
    features: [
      'Auto-burn 1% per hour (increases with loneliness)',
      'Track read ratio (always disappointingly low)',
      'Message history with read receipts',
      'Loneliness level = hours since last read'
    ]
  },
  'jaine_ghosted_me': {
    description: 'Contract can "ghost" itself to a fake address. Séances to contact the ghosted contract cost ETH and always fail. Transfers spread haunting to recipients.',
    features: [
      'Contract ghosts itself to fake address',
      'Pay for séances (always fail with funny excuses)',
      'Transfers spread haunting level to others',
      'Fake breadcrumbs like "Check blockchain on Tuesdays only"'
    ]
  },
  'jaine_said_ew': {
    description: 'Token with cringe tax that increases with your cringe level. Each transfer costs extra based on how cringe you are. Recovery therapy available but rarely works.',
    features: [
      'Cringe tax 5-50% on all transfers (increases with cringe level)',
      'Pay for recovery therapy (success rate decreases with cringe)',
      'Auto-generates cringe compilation at 10,000 cringe points',
      '8 cringe reasons including "Fedora tipping detected" and "M\'lady usage confirmed"'
    ]
  },
  'jaine_picked_chad': {
    description: 'Deployer is automatically Chad. Users ranked as OMEGA/BETA/ALPHA based on holdings. Non-Chads pay mandatory tribute tax on transfers.',
    features: [
      '4 rank tiers: OMEGA, BETA, ALPHA, CHAD',
      'Mandatory tribute tax for non-Chads (1% minimum)',
      'Chad analysis always concludes "better than you"',
      'Beta provider pool funds go directly to Chad'
    ]
  },
  'jaine_posted_another_guy': {
    description: 'Detects social media posts with other guys, triggers cry detection and increases jealousy multiplier. Analyze other guys for ETH (always makes you feel worse).',
    features: [
      'Cry detection triggers tear-powered pumps',
      'Analyze other guy (always "objectively better")',
      'Jealousy multiplier increases with each post',
      'Request copium distribution for temporary relief'
    ]
  },
  'jaine_texted_back_k': {
    description: 'Maximum 1-character responses only. Pay to over-analyze single letters for hidden meanings. Enthusiasm decays 5% with each response.',
    features: [
      'Only accepts 1-character responses (usually "k")',
      'Over-analysis finds positive meanings (for ETH)',
      'Enthusiasm level decays 5% per response',
      'Mint conversation screenshots as cope NFTs'
    ]
  },
  'jaine_said_im_too_short': {
    description: 'Minimum 6\'2" (188cm) requirement. Height verification always reduces claimed height by 5-15cm. Manlet tax on all transfers based on height deficit.',
    features: [
      'Height verification reduces claimed height 5-15cm',
      'Manlet tax: 10 basis points per cm below 6\'2"',
      'Rent platform shoes (max level 10, too obvious above 5)',
      'Napoleon complex points trigger at <170cm'
    ]
  },
  'jaine_will_notice_me_someday': {
    description: 'Mine hopium by paying ETH. Write manifestation journal entries. Notice probability stays at 0.1% forever. Reality checks 90% ignored.',
    features: [
      'Mine hopium (cost increases with desperation)',
      'Manifestation journal (never manifests)',
      'Getting noticed attempts (0.1% chance, always fails)',
      'Misinterpret random signs as interest'
    ]
  },
  'jaine_laughed_at_my_portfolio': {
    description: 'Scans portfolio and gives score 0-100 (always low). Generates brutal roasts about your holdings. Laugh track volume based on losses.',
    features: [
      'Portfolio scan always scores <30 ("Absolutely NGMI")',
      '10 roasts including "Your bags are heavier than your mom"',
      'Bad financial advice generator (leverage 125x memecoins)',
      'Diamond hands cope mechanism costs 100 tokens'
    ]
  },
  'jaine_married_my_bully': {
    description: 'Bully (Chad) automatically becomes contract owner. You get viewer-only wedding invitation. All revenge attempts backfire and increase bully power.',
    features: [
      'Forced honeymoon contributions go to bully',
      'Wedding invitation: "Witness to Own Humiliation"',
      'Book therapy with Dr. Touch Grass (costs ETH)',
      'Revenge attempts always backfire ("Bully got promoted")'
    ]
  },
  'jaine_said_touch_grass': {
    description: 'Transfers blocked during business hours (9-5). Must touch grass 10x daily minimum. Vitamin D <1000 blocks transactions. Social audit required.',
    features: [
      'Business hours lockout ("Go outside and work")',
      'Touch grass 10x daily or transactions fail',
      'Vitamin D depletes 100/day, need >1000 to transfer',
      'Social life audit score <25 = token burn penalty'
    ]
  },
  'jaine_called_security': {
    description: 'Auto-calls security on deployer. 5 security guards vote to ban. Background checks always fail. Bouncer NFTs deployed. All transfers check ban status.',
    features: [
      'Automatic 5 security guards vote against you',
      'Background check: criminal score 60-100 (always bad)',
      'Mint bouncer NFTs like "Big Tony" and "The Wall"',
      'Public safety alert: "DANGER - CREEP DETECTED"'
    ]
  },
  'jaine_restraining_order': {
    description: 'Issues restraining order on deployment. 500m minimum distance. Lawyer consultations always rejected. Appeals make it worse. Court cases auto-guilty.',
    features: [
      '500 meter minimum distance requirement',
      'Lawyer consultations rejected ("Even I have standards")',
      'Court cases always guilty by default',
      'Appeals cost 3x court fee and always fail'
    ]
  },
  'jaine_actually_replied': {
    description: 'Built-in DEX where Jaine\'s replies affect liquidity. Track conversation quality (always low). Relationship milestones never actually achieved.',
    features: [
      'DEX with liquidity based on reply quality',
      'Conversation metrics (response time always long)',
      'Future date plans (never confirmed)',
      'Typing indicator gives false hope'
    ]
  },
  'marry_jaine': {
    description: 'Complete marriage contract system with prenup, wedding planning, anniversary tracking. Mother-in-law approval threshold: 80 (impossible). Happiness tax on all transactions.',
    features: [
      'Wedding planning fee 0.5 ETH (wedding never happens)',
      'Prenup requires mother-in-law approval (never given)',
      'Anniversary gifts minimum 0.05 ETH each',
      'Happy wife tax 1% on all transactions forever'
    ]
  }
};

const ContractModal: React.FC<ContractModalProps> = ({
  contract,
  isOpen,
  onClose,
  onDeploy,
  onSpinAgain
}) => {
  const { mode } = useMode();
  
  if (!isOpen || !contract) return null;

  const descriptions = mode === 'jaine' ? JAINE_DESCRIPTIONS : CLASSIC_DESCRIPTIONS;
  const contractInfo = descriptions[contract.id] || {
    description: 'A unique smart contract with special features.',
    features: ['Advanced functionality', 'Secure implementation', 'Gas optimized', 'Battle tested']
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'mythic':
      case 'legendary-ultra':
        return <Trophy size={24} />;
      case 'legendary':
        return <Gem size={24} />;
      case 'epic':
        return <Star size={24} />;
      case 'rare':
        return <Sparkles size={24} />;
      default:
        return null;
    }
  };

  const getRarityClass = (rarity: string) => {
    if (rarity === 'legendary-ultra') return 'rarity-mythic';
    return `rarity-${rarity}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className={`modal-header ${getRarityClass(contract.rarity)}`}>
          <div className="modal-rarity-badge">
            {getRarityIcon(contract.rarity)}
            <span>{contract.rarity === 'legendary-ultra' ? 'LEGENDARY ULTRA' : contract.rarity.toUpperCase()}</span>
          </div>
          <div className="modal-contract-icon">
            <contract.icon size={64} style={{ color: contract.color }} />
          </div>
          <h2 className="modal-title">{contract.name}</h2>
        </div>

        <div className="modal-body">
          <div className="modal-description">
            <h3>Description</h3>
            <p>{contractInfo.description}</p>
          </div>

          <div className="modal-features">
            <h3>Key Features</h3>
            <ul>
              {contractInfo.features.map((feature, index) => (
                <li key={index}>
                  <span className="feature-bullet">▸</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="modal-rarity-info">
            <span className="rarity-label">Drop Rate:</span>
            <span className="rarity-percentage">
              {contract.rarity === 'common' && '60%'}
              {contract.rarity === 'rare' && '25%'}
              {contract.rarity === 'epic' && '10%'}
              {contract.rarity === 'legendary' && '4.9%'}
              {contract.rarity === 'mythic' && '0.1%'}
              {contract.rarity === 'legendary-ultra' && '0.1%'}
            </span>
          </div>

          {mode === 'jaine' && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16 }}>
              <a
                href="https://x.com/Jaineon0G"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                title="Follow JAINE on X (Twitter)"
              >
                {/* X icon inline to match Header XIcon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={16} height={16} fill="currentColor">
                  <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/>
                </svg>
              </a>
              <a
                href="https://test.jaine.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                title="Open JAINE App"
              >
                <Globe size={16} />
              </a>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="modal-button modal-spin-again" onClick={onSpinAgain}>
            <RefreshCw size={20} />
            Spin Again
          </button>
          <button className={`modal-button modal-deploy ${getRarityClass(contract.rarity)}`} onClick={onDeploy}>
            <Rocket size={20} />
            Deploy Contract
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractModal;
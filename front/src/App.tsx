import React, { useState, useEffect } from 'react';
import { Trophy, RefreshCw } from 'lucide-react';
import Header from './components/Header';
import SlotMachine from './components/SlotMachine';
import Configuration from './components/Configuration';
import Deploying, { DeploymentPhase } from './components/Deploying';
import Deployed from './components/Deployed';
import Footer from './components/Footer';
import ContractModal from './components/ContractModal';
import DropRatesModal from './components/DropRatesModal';
import { ModeProvider, useMode } from './contexts/ModeContext';
import ModeSelector from './components/ModeSelector';
import { CONTRACT_TYPES, ACHIEVEMENT_MESSAGES } from './constants';
import { JAINE_CONTRACT_TYPES, JAINE_ACHIEVEMENT_MESSAGES } from './constants/jaine';
import { ContractType, DeploymentStep, Particle, DeploymentStatus, GameStats } from './types';
import { createParticles, playSound, getWeightedRandomContract, initializeParticles } from './utils';
import { useAccount } from 'wagmi';
import { statsService } from './services/stats';
import { processFormDataToConstructorArgs, validateFormData } from './utils/contractProcessor';
import { compilerService } from './services/compiler';
import { blockchainService } from './services/blockchain';
import { getContractById } from './contracts';
import { getJaineContractById } from './contracts/jaine';
import './styles/globals.css';
import './styles/jaine.css';

function AppContent() {
  const { mode, toggleMode } = useMode();
  const { address, isConnected } = useAccount();
  // State management
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedContract, setSelectedContract] = useState<ContractType | null>(null);
  const [deploymentStep, setDeploymentStep] = useState<DeploymentStep>('slot');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [spinResult, setSpinResult] = useState<(ContractType | null)[]>([null, null, null]);
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus | null>(null);
  const [streak, setStreak] = useState(0);
  const [totalSpins, setTotalSpins] = useState(0);
  const [deployed, setDeployed] = useState<DeploymentStatus[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [showAchievement, setShowAchievement] = useState<string | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [deploymentPhase, setDeploymentPhase] = useState<DeploymentPhase>('compiling');
  const [deploymentError, setDeploymentError] = useState<string | null>(null);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showRates, setShowRates] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState<{ total: number; rows: Array<{ wallet_address: string; total: number }> } | null>(null);

  const stats: GameStats = {
    totalSpins,
    streak,
    deployed,
    comboMultiplier
  };

  // Enhanced particle system
  useEffect(() => {
    const cleanup = initializeParticles();
    return cleanup;
  }, []);

  // Get contracts based on current mode
  const currentContracts = mode === 'jaine' ? JAINE_CONTRACT_TYPES : CONTRACT_TYPES;
  const currentAchievements = mode === 'jaine' ? JAINE_ACHIEVEMENT_MESSAGES : ACHIEVEMENT_MESSAGES;
  const lbRows = (leaderboard?.rows || []) as Array<{ wallet_address: string; total: number }>;
  const lbMax = Math.max(1, ...lbRows.map(r => r.total || 0));

  // Enhanced spin logic with combo system
  const spin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setShowWinAnimation(false);
    setSelectedContract(null);
    setTotalSpins(prev => prev + 1);
    
    playSound('spin', soundEnabled);
    
    // Enhanced spinning animation with anticipation
    const duration = 2500 + Math.random() * 1000;
    const interval = 50;
    let elapsed = 0;
    
    const spinInterval = setInterval(() => {
      elapsed += interval;
      
      setSpinResult([
        currentContracts[Math.floor(Math.random() * currentContracts.length)],
        currentContracts[Math.floor(Math.random() * currentContracts.length)],
        currentContracts[Math.floor(Math.random() * currentContracts.length)]
      ]);
      
      if (elapsed >= duration) {
        clearInterval(spinInterval);
        
        // Apply combo multiplier to rarity chances
        const selected = getWeightedRandomContract(comboMultiplier, currentContracts);
        setSpinResult([selected, selected, selected]);
        setSelectedContract(selected);
        setIsSpinning(false);
        setShowWinAnimation(true);
        
        // Show contract modal instead of auto-hiding win banner
        setShowContractModal(true);
        
        // Hide win animation after 2 seconds but keep modal open
        setTimeout(() => {
          setShowWinAnimation(false);
        }, 2000);
        
        // Update streak and combo
        if (selected.rarity !== 'common') {
          setStreak(prev => prev + 1);
          setComboMultiplier(prev => Math.min(prev + 0.1, 2));
        } else {
          setStreak(0);
          setComboMultiplier(1);
        }
        
        // Play win sound and create particles
        playSound(selected.rarity, soundEnabled);
        if (selected.rarity === 'mythic' || selected.rarity === 'legendary') {
          const newParticles = createParticles(selected.rarity);
          setParticles(newParticles);
          setTimeout(() => setParticles([]), 3000);
        }
        
        // Update server-side spin metrics
        if (isConnected && address) {
          statsService.postSpin(address, selected.rarity).catch(() => {});
        }

        // Show achievement
        if (totalSpins === 0) {
          showAchievementMessage(currentAchievements[0]);
        } else if (streak >= 5) {
          showAchievementMessage(currentAchievements[1]);
        } else if (selected.rarity === 'mythic') {
          showAchievementMessage(currentAchievements[5]);
        }
      }
    }, interval);
  };

  // Show achievement notification
  const showAchievementMessage = (message: string) => {
    setShowAchievement(message);
    setTimeout(() => setShowAchievement(null), 3000);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Real deployment with compilation and blockchain integration
  const deployContract = async () => {
    if (!selectedContract) return;

    setDeploymentStep('deploying');
    setDeploymentPhase('compiling');
    setDeploymentError(null);

    try {
      // Phase 1: Validate form data
      const validation = validateFormData(formData, selectedContract.id);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Phase 2: Compile contract
      const contractTemplate = mode === 'jaine' 
        ? getJaineContractById(selectedContract.id)
        : getContractById(selectedContract.id);
      if (!contractTemplate) {
        throw new Error(`Contract template not found: ${selectedContract.id}`);
      }

      const compilationRequest = {
        contractId: selectedContract.id,
        contractName: contractTemplate.name.replace(/\s+/g, ''), // Remove spaces for contract name
        solidityCode: contractTemplate.solidity,
        formData
      };

      const compilationResult = await compilerService.compileContract(compilationRequest);
      
      if (!compilationResult.success || !compilationResult.bytecode || !compilationResult.abi) {
        throw new Error(compilationResult.error || 'Compilation failed');
      }

      // Phase 3: Prepare constructor arguments
      setDeploymentPhase('broadcasting');
      const constructorArgs = processFormDataToConstructorArgs(formData, selectedContract.id);

      // Phase 4: Deploy to blockchain
      if (!blockchainService.isWalletConnected()) {
        throw new Error('Wallet not connected. Please connect your wallet first.');
      }

      const deploymentResult = await blockchainService.deployContract({
        bytecode: compilationResult.bytecode,
        abi: compilationResult.abi,
        args: constructorArgs
      });

      if (!deploymentResult.success) {
        throw new Error(deploymentResult.error || 'Deployment failed');
      }

      // Phase 5: Wait for confirmation
      setDeploymentPhase('confirming');
      
      // Create deployment status
      const newDeployment: DeploymentStatus = {
        success: true,
        txHash: deploymentResult.txHash!,
        contractAddress: deploymentResult.contractAddress!,
        contract: selectedContract,
        timestamp: Date.now()
      };

      setDeploymentStatus(newDeployment);
      setDeployed(prev => [newDeployment, ...prev].slice(0, 10));
      setDeploymentStep('deployed');

      // Success particles
      const celebrationParticles = createParticles('celebration');
      setParticles(celebrationParticles);
      setTimeout(() => setParticles([]), 3000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown deployment error';
      setDeploymentError(errorMessage);
      
      // Create failed deployment status
      const failedDeployment: DeploymentStatus = {
        success: false,
        txHash: '',
        contractAddress: '',
        contract: selectedContract,
        timestamp: Date.now(),
        error: errorMessage
      };

      setDeploymentStatus(failedDeployment);
      setDeployed(prev => [failedDeployment, ...prev].slice(0, 10));
      
      // Show error for 5 seconds then reset
      setTimeout(() => {
        setDeploymentStep('slot');
        setDeploymentError(null);
        setFormData({});
        setSelectedContract(null);
        setSpinResult([null, null, null]);
        setShowWinAnimation(false);
        setDeploymentStatus(null);
      }, 5000);
    }
  };

  // Reset with statistics preservation
  const reset = () => {
    setDeploymentStep('slot');
    setSelectedContract(null);
    setFormData({});
    setSpinResult([null, null, null]);
    setShowWinAnimation(false);
    setDeploymentStatus(null);
    setDeploymentError(null);
  };

  // Handle wallet connection request
  const handleConnectWallet = () => {
    // This will trigger the wallet connection modal
    // The actual connection logic is handled by RainbowKit in the Header component
    const connectWalletButton = document.querySelector('.wallet-connect-button') as HTMLButtonElement;
    if (connectWalletButton) {
      connectWalletButton.click();
    }
  };

  // Handle modal actions
  const handleModalDeploy = () => {
    setShowContractModal(false);
    // Skip configuration for Jaine mode (no form fields needed)
    if (mode === 'jaine') {
      deployContract();
    } else {
      setDeploymentStep('configure');
    }
  };

  const handleModalSpinAgain = () => {
    setShowContractModal(false);
    reset();
    spin();
  };

  // Load leaderboard from backend
  useEffect(() => {
    if (!showLeaderboard) return;
    (async () => {
      try {
        const base = import.meta.env.VITE_COMPILER_API_URL || 'http://localhost:3001';
        const resSummary = await fetch(`${base}/api/stats/summary`);
        const sumJson = await resSummary.json();
        const resBoard = await fetch(`${base}/api/stats/leaderboard?limit=100`);
        const boardJson = await resBoard.json();
        setLeaderboard({ total: (sumJson?.data?.total || 0), rows: boardJson?.data || [] });
      } catch {
        setLeaderboard({ total: 0, rows: [] });
      }
    })();
  }, [showLeaderboard]);

  return (
    <div className="container">
      <div id="particles-js" className="particles"></div>
      {mode === 'jaine' && <div className="dex-bg" />}
      
      {/* Floating particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="celebration-particle"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color,
            opacity: particle.life
          }}
        />
      ))}
      
      {/* Achievement notification */}
      {showAchievement && (
        <div className="achievement-notification">
          <Trophy size={24} />
          <span>{showAchievement}</span>
        </div>
      )}
      
      <div className="content">
        {/* Enhanced header with stats */}
        <Header 
          stats={stats}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          streak={streak}
        />

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <button className="secondary-button view-rates-btn" onClick={() => setShowRates(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3h2v18H3V3zm16 2h2v14h-2V5zM7 9h2v12H7V9zm8-4h2v16h-2V5zm-4 8h2v8h-2v-8z" fill="currentColor"/>
            </svg>
            View Drop Rates
          </button>
          <button className="secondary-button view-rates-btn" style={{ marginLeft: 12 }} onClick={() => setShowLeaderboard(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3h4v18H3V3zm7 6h4v12h-4V9zm7-4h4v16h-4V5z" fill="currentColor"/>
            </svg>
            Leaderboard
          </button>
        </div>

        {deploymentStep === 'slot' && (
          <SlotMachine
            spinResult={spinResult}
            isSpinning={isSpinning}
            selectedContract={selectedContract}
            showWinAnimation={showWinAnimation}
            comboMultiplier={comboMultiplier}
            onSpin={spin}
            onConfigure={() => setDeploymentStep('configure')}
            onConnectWallet={handleConnectWallet}
            deployed={deployed}
            hideConfigureButton={showContractModal}
          />
        )}
        
        {/* Contract Details Modal */}
        <ContractModal
          contract={selectedContract}
          isOpen={showContractModal}
          onClose={() => setShowContractModal(false)}
          onDeploy={handleModalDeploy}
          onSpinAgain={handleModalSpinAgain}
        />

        <DropRatesModal 
          isOpen={showRates} 
          onClose={() => setShowRates(false)} 
          contracts={currentContracts} 
          title={mode === 'jaine' ? 'Jaine Mode Drop Rates' : 'Classic Mode Drop Rates'}
        />

        {showLeaderboard && (
          <div className="modal-overlay" onClick={() => setShowLeaderboard(false)}>
            <div className="modal-container leaderboard-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowLeaderboard(false)}>×</button>
              <div className="modal-header">
                <h2 className="modal-title">🏆 Top Deployers</h2>
              </div>
              <div className="modal-body">
                <div className="drop-summary" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
                  <span>Total contracts deployed:</span>
                  <strong>{leaderboard?.total ?? '—'}</strong>
                </div>
                <div className="lb-table">
                  <div className="lb-row lb-row-head">
                    <span>#</span>
                    <span>Address</span>
                    <span style={{ textAlign: 'right' }}>Deployed</span>
                  </div>
                  {lbRows.map((row, idx) => (
                    <div key={idx} className="lb-row">
                      <div className={`lb-rank ${idx < 3 ? `top-${idx + 1}` : ''}`}>{idx + 1}</div>
                      <div className="lb-addr"><code>{row.wallet_address ? `${row.wallet_address.slice(0, 6)}...${row.wallet_address.slice(-4)}` : '—'}</code></div>
                      <div className="lb-count">{row.total}</div>
                      <div className="lb-bar"><div className="lb-bar-fill" style={{ width: `${Math.round((row.total || 0) / lbMax * 100)}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced configuration with better UX */}
        {deploymentStep === 'configure' && selectedContract && (
          <Configuration
            selectedContract={selectedContract}
            formData={formData}
            onInputChange={handleInputChange}
            onBack={reset}
            onDeploy={deployContract}
          />
        )}

        {/* Real deployment with phases */}
        {deploymentStep === 'deploying' && (
          <Deploying 
            selectedContract={selectedContract} 
            currentPhase={deploymentPhase}
            error={deploymentError || undefined}
          />
        )}

        {/* Enhanced success screen */}
        {deploymentStep === 'deployed' && deploymentStatus && selectedContract && (
          <Deployed
            selectedContract={selectedContract}
            deploymentStatus={deploymentStatus}
            onReset={reset}
          />
        )}
      </div>
      
      <Footer />
      
      {/* Mode toggle button */}
      <button 
        className="mode-toggle-button" 
        onClick={toggleMode}
        title={`Switch to ${mode === 'normal' ? 'Jaine' : 'Normal'} Mode`}
      >
        <RefreshCw size={24} />
      </button>
      
      <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
    </div>
  );
}

// Main App component with ModeProvider wrapper
function App() {
  return (
    <ModeProvider>
      <ModeSelector />
      <AppContent />
    </ModeProvider>
  );
}

export default App; 
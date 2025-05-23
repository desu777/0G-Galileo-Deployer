import React, { useRef } from 'react';
import { Sparkles, Code, Rocket } from 'lucide-react';
import { ContractType, DeploymentStatus } from '../types';

interface SlotMachineProps {
  spinResult: (ContractType | null)[];
  isSpinning: boolean;
  selectedContract: ContractType | null;
  showWinAnimation: boolean;
  comboMultiplier: number;
  onSpin: () => void;
  onConfigure: () => void;
  deployed: DeploymentStatus[];
}

const SlotMachine: React.FC<SlotMachineProps> = ({
  spinResult,
  isSpinning,
  selectedContract,
  showWinAnimation,
  comboMultiplier,
  onSpin,
  onConfigure,
  deployed
}) => {
  const slotRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];

  return (
    <div className="slot-machine-container">
      <div className="slot-machine">
        <div className="slots">
          {spinResult.map((contract, index) => (
            <div 
              key={index} 
              className={`slot ${isSpinning ? 'spinning' : ''} ${contract ? `rarity-${contract.rarity}` : ''}`} 
              ref={slotRefs[index]}
            >
              {contract ? (
                <div className={`contract-icon ${showWinAnimation ? 'winner' : ''}`} style={{ color: contract.color }}>
                  <contract.icon size={48} />
                  <span className="contract-name">{contract.name}</span>
                  <span className="contract-description">{contract.description}</span>
                  <div className={`rarity-indicator rarity-${contract.rarity}`}>
                    {contract.rarity.toUpperCase()}
                  </div>
                </div>
              ) : (
                <div className="empty-slot">
                  <Sparkles size={48} />
                </div>
              )}
            </div>
          ))}
        </div>
        
        {selectedContract && showWinAnimation && (
          <div className={`win-banner rarity-${selectedContract.rarity}`}>
            <Sparkles className="sparkle-left" />
            <span>{selectedContract.rarity.toUpperCase()} CONTRACT!</span>
            <Sparkles className="sparkle-right" />
            {selectedContract.rarity === 'mythic' && (
              <div className="mythic-glow"></div>
            )}
          </div>
        )}
      </div>
      
      <button 
        className={`spin-button ${isSpinning ? 'spinning' : ''} ${comboMultiplier > 1 ? 'combo' : ''}`}
        onClick={onSpin}
        disabled={isSpinning}
      >
        {isSpinning ? (
          <>
            <div className="spinner" />
            Spinning...
          </>
        ) : (
          <>
            <Rocket size={20} />
            {comboMultiplier > 1 ? `COMBO SPIN (${comboMultiplier.toFixed(1)}x)` : 'SPIN TO DEPLOY'}
          </>
        )}
      </button>
      
      {selectedContract && !isSpinning && (
        <button 
          className={`continue-button rarity-${selectedContract.rarity}`}
          onClick={onConfigure}
        >
          Configure {selectedContract.name}
          <Code size={16} />
        </button>
      )}
      
      {/* Recent deployments */}
      {deployed.length > 0 && (
        <div className="recent-deployments">
          <h3>Recent Deployments</h3>
          <div className="deployment-list">
            {deployed.slice(0, 5).map((dep, i) => (
              <div key={i} className={`deployment-item rarity-${dep.contract.rarity}`}>
                <dep.contract.icon size={20} style={{ color: dep.contract.color }} />
                <span>{dep.contract.name}</span>
                <code>{dep.contractAddress.slice(0, 8)}...</code>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotMachine; 
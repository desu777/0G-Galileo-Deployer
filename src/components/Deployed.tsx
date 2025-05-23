import React from 'react';
import { Trophy, Rocket } from 'lucide-react';
import { ContractType, DeploymentStatus } from '../types';

interface DeployedProps {
  selectedContract: ContractType;
  deploymentStatus: DeploymentStatus;
  onReset: () => void;
}

const Deployed: React.FC<DeployedProps> = ({
  selectedContract,
  deploymentStatus,
  onReset
}) => {
  return (
    <div className="deployed-container">
      <div className="success-explosion">
        <Trophy size={64} />
        <div className="success-particles">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`success-particle particle-${i}`}></div>
          ))}
        </div>
      </div>
      <h2>Contract Deployed Successfully!</h2>
      
      <div className="deployment-info">
        <div className="info-item">
          <label>Contract Type:</label>
          <div className="contract-type-display">
            <selectedContract.icon size={20} style={{ color: selectedContract.color }} />
            <span>{selectedContract.name}</span>
            <span className={`rarity-badge rarity-${selectedContract.rarity}`}>
              {selectedContract.rarity}
            </span>
          </div>
        </div>
        <div className="info-item">
          <label>Transaction Hash:</label>
          <code className="hash-display">{deploymentStatus.txHash}</code>
        </div>
        <div className="info-item">
          <label>Contract Address:</label>
          <code className="hash-display">{deploymentStatus.contractAddress}</code>
        </div>
        <div className="info-item">
          <label>Gas Used:</label>
          <span>{(Math.random() * 500000 + 100000).toFixed(0)} gas</span>
        </div>
      </div>
      
      <div className="deployed-actions">
        <button className="view-button">
          View on Explorer
        </button>
        <button className="spin-again-button" onClick={onReset}>
          <Rocket size={16} />
          Spin Again!
        </button>
      </div>
    </div>
  );
};

export default Deployed; 
import React from 'react';
import { Cpu } from 'lucide-react';
import { ContractType } from '../types';

interface DeployingProps {
  selectedContract: ContractType | null;
}

const Deploying: React.FC<DeployingProps> = ({ selectedContract }) => {
  return (
    <div className="deploying-container">
      <div className="deploying-animation">
        <div className="deploy-visual">
          <Cpu size={64} className="cpu-icon" />
          <div className="energy-rings">
            <div className="ring ring-1"></div>
            <div className="ring ring-2"></div>
            <div className="ring ring-3"></div>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill"></div>
          <div className="progress-glow"></div>
        </div>
        <h2>Deploying {selectedContract?.name}...</h2>
        <p>Broadcasting to 0G Network</p>
        <div className="deployment-steps">
          <div className="step active">Compiling Contract</div>
          <div className="step">Broadcasting Transaction</div>
          <div className="step">Confirming on Chain</div>
        </div>
      </div>
    </div>
  );
};

export default Deploying; 
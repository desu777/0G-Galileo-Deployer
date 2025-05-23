import React from 'react';
import { Zap } from 'lucide-react';
import { ContractType } from '../types';
import { getContractById } from '../contracts';

interface ConfigurationProps {
  selectedContract: ContractType;
  formData: Record<string, any>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBack: () => void;
  onDeploy: () => void;
}

const Configuration: React.FC<ConfigurationProps> = ({
  selectedContract,
  formData,
  onInputChange,
  onBack,
  onDeploy
}) => {
  const renderConfigForm = () => {
    // Get contract template from contracts/index.ts
    const contractTemplate = getContractById(selectedContract.id);
    
    if (!contractTemplate || !contractTemplate.formFields) {
      return (
        <div className="form-group">
          <label>⚙️ Contract Configuration</label>
          <input
            type="text"
            name="config"
            placeholder={`Configure your ${selectedContract.name}`}
            value={formData.config || ''}
            onChange={onInputChange}
            required
          />
        </div>
      );
    }

    // Render form fields dynamically based on contract definition
    return (
      <>
        {contractTemplate.formFields.map((field, index) => (
          <div key={index} className="form-group">
            <label>{getFieldIcon(field.name)} {field.label}</label>
            {field.type === 'textarea' ? (
              <textarea
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name] || (field as any).defaultValue || ''}
                onChange={onInputChange}
                required={field.required}
                rows={4}
                style={{ resize: 'vertical', minHeight: '80px' }}
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name] || (field as any).defaultValue || ''}
                onChange={onInputChange}
                required={field.required}
                step={field.type === 'number' && field.name.includes('Price') ? '0.000000000000000001' : undefined}
              />
            )}
          </div>
        ))}
      </>
    );
  };

  // Helper function to get appropriate emoji for field names
  const getFieldIcon = (fieldName: string): string => {
    const iconMap: Record<string, string> = {
      // Generic
      'name': '📝',
      'symbol': '🏷️',
      'config': '⚙️',
      
      // Greeter
      'initialGreeting': '👋',
      'greeting': '👋',
      
      // Counter
      'initialCount': '🔢',
      
      // ERC-20 Token
      'initialSupply': '💰',
      'maxSupply': '📊',
      'mintPrice': '💸',
      
      // Lottery
      'ticketPrice': '🎫',
      'duration': '⏱️',
      
      // MultiSig
      'owners': '👥',
      'required': '✅',
      
      // Staking
      'rewardRate': '💎',
      'minimumStake': '💰',
      'lockupPeriod': '🔒',
    };
    
    return iconMap[fieldName] || '⚙️';
  };

  return (
    <div className={`configuration-container rarity-${selectedContract.rarity}`}>
      <div className="config-header">
        <selectedContract.icon size={32} style={{ color: selectedContract.color }} />
        <div className="config-title">
          <h2>Configure {selectedContract.name}</h2>
          <p>{selectedContract.description}</p>
        </div>
        <span className={`rarity-badge rarity-${selectedContract.rarity}`}>
          {selectedContract.rarity}
        </span>
      </div>
      
      <div className="config-form">
        {renderConfigForm()}
        
        <div className="form-actions">
          <button type="button" className="back-button" onClick={onBack}>
            Back to Slot Machine
          </button>
          <button type="button" className={`deploy-button rarity-${selectedContract.rarity}`} onClick={onDeploy}>
            <Zap size={16} />
            Deploy {selectedContract.name}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Configuration;
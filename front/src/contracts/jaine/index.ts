import { ContractTemplate } from '../../types';

// Import all Jaine contract templates
import { jaineCommonContracts } from './common';
import { jaineRareContracts } from './rare';
import { jaineEpicContracts } from './epic';
import { jaineLegendaryContracts } from './legendary';
import { jaineMythicContracts } from './mythic';

// Export all contracts in a single object
export const JAINE_CONTRACTS = {
  ...jaineCommonContracts,
  ...jaineRareContracts,
  ...jaineEpicContracts,
  ...jaineLegendaryContracts,
  ...jaineMythicContracts
};

// Utility function to get Jaine contract by ID
export function getJaineContractById(id: string): ContractTemplate | undefined {
  return JAINE_CONTRACTS[id as keyof typeof JAINE_CONTRACTS];
}

// Get all Jaine contract IDs
export function getJaineContractIds(): string[] {
  return Object.keys(JAINE_CONTRACTS);
}

// Validate if contract ID is a Jaine contract
export function isJaineContract(id: string): boolean {
  return id in JAINE_CONTRACTS;
}
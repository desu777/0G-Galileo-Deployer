// Smart Contract Templates for Browser Compilation
// Based on OpenZeppelin Contracts v5.3.0

import { greeter } from './greeter';
import { counter } from './counter';
import { nft721 } from './nft721';
import { lottery } from './lottery';
import { multisig } from './multisig';
import { staking } from './staking';
import { erc20 } from './erc20';

export const CONTRACTS = {
  // COMMON CONTRACTS
  greeter,
  counter,

  // RARE CONTRACTS
  nft721,
  lottery,

  // EPIC CONTRACTS
  multisig,
  staking,

  // LEGENDARY CONTRACT
  erc20
};

// Utility function to get contract by ID
export function getContractById(id: string) {
  return CONTRACTS[id as keyof typeof CONTRACTS];
}

// Get all contract IDs
export function getContractIds() {
  return Object.keys(CONTRACTS);
}

// Validate contract exists
export function isValidContractId(id: string): boolean {
  return id in CONTRACTS;
} 
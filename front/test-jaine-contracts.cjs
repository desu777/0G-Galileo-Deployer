#!/usr/bin/env node

/**
 * Test script to verify all Jaine contracts compile successfully
 */

const fs = require('fs');
const path = require('path');
const solc = require('solc');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

// Import all Jaine contract modules
const contractFiles = [
  './src/contracts/jaine/common.ts',
  './src/contracts/jaine/rare.ts',
  './src/contracts/jaine/epic.ts',
  './src/contracts/jaine/legendary.ts',
  './src/contracts/jaine/mythic.ts'
];

console.log(`${colors.blue}========================================${colors.reset}`);
console.log(`${colors.blue}   JAINE CONTRACTS COMPILATION TEST${colors.reset}`);
console.log(`${colors.blue}========================================${colors.reset}\n`);

// Function to extract contracts from TypeScript files
function extractContracts(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const contracts = {};
  
  // First, extract the PUMP_JAINE_BASE constant
  const baseMatch = content.match(/const PUMP_JAINE_BASE = `([^`]+)`/);
  const pumpJaineBase = baseMatch ? baseMatch[1] : '';
  
  // Find all contract definitions using regex
  // Looking for pattern: 'contract_id': { name: 'NAME', solidity: `...` + PUMP_JAINE_BASE + `...`
  // More complex pattern to handle concatenation
  const regex = /'([^']+)':\s*{\s*name:\s*'([^']+)',\s*solidity:\s*`([^`]+)`\s*\+\s*PUMP_JAINE_BASE\s*\+\s*`([^`]+)`/g;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    const contractId = match[1];
    const contractName = match[2];
    const solidityPart1 = match[3];
    const solidityPart2 = match[4];
    
    // Combine parts with the base contract code
    const solidityCode = solidityPart1 + pumpJaineBase + solidityPart2;
    
    contracts[contractId] = {
      name: contractName,
      solidity: solidityCode
    };
  }
  
  return contracts;
}

// Function to compile a contract
function compileContract(contractId, contractData) {
  const input = {
    language: 'Solidity',
    sources: {
      [`${contractId}.sol`]: {
        content: contractData.solidity
      }
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode']
        }
      }
    }
  };

  try {
    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    
    if (output.errors) {
      const errors = output.errors.filter(e => e.severity === 'error');
      if (errors.length > 0) {
        return {
          success: false,
          errors: errors.map(e => e.formattedMessage)
        };
      }
    }
    
    // Check if compilation produced bytecode
    const contracts = output.contracts[`${contractId}.sol`];
    if (!contracts || Object.keys(contracts).length === 0) {
      return {
        success: false,
        errors: ['No bytecode generated']
      };
    }
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      errors: [error.message]
    };
  }
}

// Main test function
async function testAllContracts() {
  let totalContracts = 0;
  let successfulCompilations = 0;
  let failedCompilations = 0;
  const failedContracts = [];
  
  for (const filePath of contractFiles) {
    const fileName = path.basename(filePath, '.ts');
    console.log(`\n${colors.magenta}Testing ${fileName}.ts:${colors.reset}`);
    console.log('─'.repeat(40));
    
    try {
      const contracts = extractContracts(filePath);
      const contractIds = Object.keys(contracts);
      
      if (contractIds.length === 0) {
        console.log(`${colors.yellow}⚠ No contracts found in ${fileName}.ts${colors.reset}`);
        continue;
      }
      
      for (const contractId of contractIds) {
        totalContracts++;
        const contractData = contracts[contractId];
        
        process.stdout.write(`  ${contractId} `);
        process.stdout.write('.'.repeat(Math.max(1, 35 - contractId.length)));
        
        const result = compileContract(contractId, contractData);
        
        if (result.success) {
          console.log(` ${colors.green}✓ SUCCESS${colors.reset}`);
          successfulCompilations++;
        } else {
          console.log(` ${colors.red}✗ FAILED${colors.reset}`);
          failedCompilations++;
          failedContracts.push({
            id: contractId,
            file: fileName,
            errors: result.errors
          });
        }
      }
    } catch (error) {
      console.log(`${colors.red}Error processing ${fileName}: ${error.message}${colors.reset}`);
    }
  }
  
  // Print summary
  console.log(`\n${colors.blue}========================================${colors.reset}`);
  console.log(`${colors.blue}             TEST SUMMARY${colors.reset}`);
  console.log(`${colors.blue}========================================${colors.reset}`);
  console.log(`Total contracts tested: ${totalContracts}`);
  console.log(`${colors.green}Successful: ${successfulCompilations}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failedCompilations}${colors.reset}`);
  
  if (failedContracts.length > 0) {
    console.log(`\n${colors.red}Failed Contracts Details:${colors.reset}`);
    console.log('─'.repeat(40));
    
    for (const failed of failedContracts) {
      console.log(`\n${colors.yellow}Contract: ${failed.id} (${failed.file}.ts)${colors.reset}`);
      for (const error of failed.errors) {
        // Extract just the error message, not the full path
        const errorLines = error.split('\n');
        for (const line of errorLines) {
          if (line.includes('Error:') || line.includes('Warning:') || line.includes('|')) {
            console.log(`  ${colors.red}${line}${colors.reset}`);
          }
        }
      }
    }
  }
  
  // Success/failure message
  if (failedCompilations === 0) {
    console.log(`\n${colors.green}🎉 All contracts compiled successfully!${colors.reset}`);
  } else {
    console.log(`\n${colors.red}⚠️  ${failedCompilations} contract(s) failed compilation${colors.reset}`);
    process.exit(1);
  }
}

// Run the test
testAllContracts().catch(error => {
  console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
  process.exit(1);
});
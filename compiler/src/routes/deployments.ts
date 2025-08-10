import { Router } from 'express';
import { db, getOrCreateUser } from '../utils/db';
import { verifyMessage } from 'ethers';

export const deploymentsRouter = Router();

deploymentsRouter.post('/', (req, res) => {
  const { address, mode, contractId, contractName, rarity, txHash, contractAddress, signature } = req.body as any;
  if (!address || !mode || !contractId) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }
  if (!['normal', 'jaine'].includes(mode)) {
    return res.status(400).json({ success: false, error: 'Invalid mode' });
  }
  // Optional but recommended: verify simple message for provenance
  if (signature && txHash) {
    const message = `Record deployment ${txHash}`;
    try {
      const recovered = verifyMessage(message, signature).toLowerCase();
      if (recovered !== String(address).toLowerCase()) {
        return res.status(401).json({ success: false, error: 'Signature invalid' });
      }
    } catch (e: any) {
      return res.status(400).json({ success: false, error: e?.message || 'Signature check failed' });
    }
  }
  const user = getOrCreateUser(address);
  const stmt = db.prepare(`
    INSERT INTO deployments (user_id, wallet_address, mode, contract_id, contract_name, rarity, tx_hash, contract_address, success)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    user.id,
    String(address).toLowerCase(),
    mode,
    contractId,
    contractName || null,
    rarity || null,
    txHash || null,
    contractAddress || null,
    1
  );
  return res.json({ success: true, id: info.lastInsertRowid });
});



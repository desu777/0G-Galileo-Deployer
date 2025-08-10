import { Router } from 'express';
import { db, getOrCreateUser } from '../utils/db';
import { randomBytes } from 'crypto';
import { verifyMessage, getAddress } from 'ethers';

export const authRouter = Router();

authRouter.post('/nonce', (req, res) => {
  const { address } = req.body as { address?: string };
  if (!address) return res.status(400).json({ success: false, error: 'Missing address' });
  // normalize EIP-55 for response, store lowercase for search
  const checksum = (() => { try { return getAddress(address); } catch { return address; } })();
  const user = getOrCreateUser(address);
  const nonce = randomBytes(16).toString('hex');
  db.prepare('UPDATE users SET nonce = ? WHERE id = ?').run(nonce, user.id);
  const message = `Sign in to Jaine Deployer\nAddress: ${address.toLowerCase()}\nNonce: ${nonce}`;
  return res.json({ success: true, nonce, message, address: checksum });
});

authRouter.post('/verify', (req, res) => {
  const { address, signature, message } = req.body as { address?: string; signature?: string; message?: string };
  if (!address || !signature || !message) return res.status(400).json({ success: false, error: 'Missing fields' });
  const user = getOrCreateUser(address);
  const expected = db.prepare('SELECT nonce FROM users WHERE id = ?').get(user.id) as { nonce?: string };
  if (!expected?.nonce) return res.status(400).json({ success: false, error: 'Nonce missing' });
  if (!message.includes(expected.nonce)) return res.status(400).json({ success: false, error: 'Nonce mismatch' });
  try {
    const recovered = verifyMessage(message, signature).toLowerCase();
    if (recovered !== address.toLowerCase()) {
      return res.status(401).json({ success: false, error: 'Signature invalid' });
    }
    db.prepare('UPDATE users SET nonce = NULL, last_login_at = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);
    return res.json({ success: true });
  } catch (e: any) {
    return res.status(400).json({ success: false, error: e?.message || 'Verification failed' });
  }
});



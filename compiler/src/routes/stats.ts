import { Router } from 'express';
import { db } from '../utils/db';

export const statsRouter = Router();

// Spin metrics update
statsRouter.post('/spin', (req, res) => {
  const { address, rarity } = req.body as { address?: string; rarity?: string };
  if (!address || !rarity) return res.status(400).json({ success: false, error: 'Missing address or rarity' });
  try {
    const updated = (require('../utils/db') as any).updateSpinMetrics(address, rarity);
    res.json({ success: true, data: updated });
  } catch (e: any) {
    res.status(400).json({ success: false, error: e?.message || 'Failed to update spin metrics' });
  }
});

statsRouter.get('/summary', (req, res) => {
  const row = db.prepare(`
    SELECT 
      COUNT(*) AS total,
      SUM(CASE WHEN mode='normal' THEN 1 ELSE 0 END) AS total_normal,
      SUM(CASE WHEN mode='jaine'  THEN 1 ELSE 0 END) AS total_jaine
    FROM deployments WHERE success=1
  `).get();
  res.json({ success: true, data: row });
});

statsRouter.get('/user/:address', (req, res) => {
  const address = (req.params.address || '').toLowerCase();
  const deploys = db.prepare(`
    SELECT 
      COUNT(*) AS total,
      SUM(CASE WHEN mode='normal' THEN 1 ELSE 0 END) AS normal_count,
      SUM(CASE WHEN mode='jaine'  THEN 1 ELSE 0 END) AS jaine_count
    FROM deployments WHERE success=1 AND wallet_address = ?
  `).get(address);
  const metrics = db.prepare('SELECT * FROM user_metrics WHERE wallet_address = ?').get(address) || {};
  res.json({ success: true, data: { ...metrics, ...deploys } });
});

statsRouter.get('/leaderboard', (req, res) => {
  const limit = Math.min(parseInt(String(req.query.limit || '10')) || 10, 100);
  const rows = db.prepare(`
    SELECT 
      wallet_address,
      COUNT(*) AS total,
      SUM(CASE WHEN mode='normal' THEN 1 ELSE 0 END) AS normal_count,
      SUM(CASE WHEN mode='jaine'  THEN 1 ELSE 0 END) AS jaine_count,
      MIN(created_at) AS first_deploy_at,
      MAX(created_at) AS last_deploy_at
    FROM deployments WHERE success=1
    GROUP BY wallet_address
    ORDER BY total DESC, last_deploy_at DESC
    LIMIT ?
  `).all(limit);
  res.json({ success: true, data: rows });
});



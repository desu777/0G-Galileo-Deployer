import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { GameStats } from '../types';
import ConnectWallet from './ConnectWallet';

interface HeaderProps {
  stats: GameStats;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  streak: number;
}

const Header: React.FC<HeaderProps> = ({
  stats,
  soundEnabled,
  setSoundEnabled,
  streak
}) => {
  return (
    <div className="header">
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-label">Spins</span>
          <span className="stat-value">{stats.totalSpins}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Streak</span>
          <span className="stat-value">{streak}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Deployed</span>
          <span className="stat-value">{stats.deployed.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Combo</span>
          <span className="stat-value">{stats.comboMultiplier.toFixed(1)}x</span>
        </div>
        <button 
          className="sound-toggle"
          onClick={() => setSoundEnabled(!soundEnabled)}
        >
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </div>
      
      <div className="logo-container">
        <img src="/gamble.png" alt="0G" />
        {stats.comboMultiplier > 1 && (
          <div className="combo-indicator">{stats.comboMultiplier.toFixed(1)}x</div>
        )}
      </div>
      <h1>0G Contract Slot Machine</h1>
      <p className="subtitle">Spin to deploy your legendary smart contracts!</p>
      
      <div className="wallet-section">
        <ConnectWallet />
      </div>
      
      {streak > 0 && (
        <div className="streak-indicator">
          🔥 {streak} Win Streak! 🔥
        </div>
      )}
    </div>
  );
};

export default Header; 
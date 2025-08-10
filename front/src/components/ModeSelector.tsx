import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { useMode } from '../contexts/ModeContext';

const ModeSelector: React.FC = () => {
  const { mode, setMode } = useMode();
  const [isVisible, setIsVisible] = React.useState(() => {
    // Show selector on first visit
    return !localStorage.getItem('modeSelectorShown');
  });

  const handleModeSelect = (selectedMode: 'normal' | 'jaine') => {
    setMode(selectedMode);
    localStorage.setItem('modeSelectorShown', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="mode-selector-overlay">
      <div className="mode-selector-container">
        <h1 className="mode-selector-title">Choose Your Experience</h1>
        
        <div className="mode-options">
          <div 
            className="mode-option normal-option"
            onClick={() => handleModeSelect('normal')}
          >
            <Sparkles size={64} className="mode-icon" />
            <h2>Normal Mode</h2>
            <p>Classic smart contract deployment</p>
            <ul>
              <li>Professional contracts</li>
              <li>DeFi protocols</li>
              <li>NFT collections</li>
              <li>Utility tokens</li>
            </ul>
            <button className="mode-select-btn">Enter Normal Mode</button>
          </div>

          <div 
            className="mode-option jaine-option"
            onClick={() => handleModeSelect('jaine')}
          >
            <Heart size={64} className="mode-icon" />
            <h2>Jaine Dex Mode</h2>
            <p>Anime 2D Waifu DEX Experience</p>
            <ul>
              <li>Rejection simulator</li>
              <li>Friendzone contracts</li>
              <li>Cope mechanisms</li>
              <li>Emotional damage</li>
            </ul>
            <button className="mode-select-btn jaine-btn">Enter Jaine Mode</button>
          </div>
        </div>

        <p className="mode-selector-note">
          You can change modes anytime from the settings menu
        </p>
      </div>

      <style jsx>{`
        .mode-selector-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.3s ease-out;
        }

        .mode-selector-container {
          max-width: 900px;
          width: 90%;
          padding: 40px;
          text-align: center;
        }

        .mode-selector-title {
          font-size: 48px;
          font-weight: 800;
          margin-bottom: 40px;
          background: linear-gradient(135deg, #00D2E9, #FF5CAA);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: glow 2s ease-in-out infinite alternate;
        }

        .mode-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 30px;
        }

        .mode-option {
          background: rgba(30, 35, 45, 0.9);
          border: 2px solid transparent;
          border-radius: 20px;
          padding: 30px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .mode-option::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.05));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .mode-option:hover::before {
          opacity: 1;
        }

        .normal-option {
          border-color: #00D2E9;
        }

        .normal-option:hover {
          border-color: #FF5CAA;
          transform: translateY(-5px);
          box-shadow: 0 10px 40px rgba(0, 210, 233, 0.3);
        }

        .jaine-option {
          border-color: #8b5cf6;
        }

        .jaine-option:hover {
          border-color: #a855f7;
          transform: translateY(-5px);
          box-shadow: 0 10px 40px rgba(139, 92, 246, 0.3);
        }

        .mode-icon {
          margin-bottom: 20px;
          color: #00D2E9;
        }

        .jaine-option .mode-icon {
          color: #8b5cf6;
        }

        .mode-option h2 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 10px;
          color: #FFFFFF;
        }

        .mode-option p {
          font-size: 16px;
          color: #9CA3AF;
          margin-bottom: 20px;
        }

        .mode-option ul {
          list-style: none;
          padding: 0;
          margin-bottom: 25px;
          text-align: left;
        }

        .mode-option li {
          padding: 5px 0;
          color: #E6E6E6;
          font-size: 14px;
        }

        .mode-option li::before {
          content: '✓ ';
          color: #00D2E9;
          font-weight: bold;
        }

        .jaine-option li::before {
          color: #8b5cf6;
        }

        .mode-select-btn {
          width: 100%;
          padding: 15px 30px;
          background: linear-gradient(135deg, #00D2E9, #FF5CAA);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .mode-select-btn:hover {
          transform: scale(1.05);
        }

        .jaine-btn {
          background: linear-gradient(135deg, #8b5cf6, #a855f7);
        }

        .mode-selector-note {
          color: #6B7280;
          font-size: 14px;
          margin-top: 20px;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes glow {
          from {
            text-shadow: 0 0 10px rgba(0, 210, 233, 0.5);
          }
          to {
            text-shadow: 0 0 20px rgba(255, 92, 170, 0.5);
          }
        }

        @media (max-width: 768px) {
          .mode-options {
            grid-template-columns: 1fr;
          }

          .mode-selector-title {
            font-size: 32px;
          }

          .mode-option h2 {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default ModeSelector;
import React from 'react';
import { 
  Building2, 
  Gem, 
  Palette, 
  Coins,
  HeartCrack,
  Users,
  Laugh,
  Skull
} from 'lucide-react';
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
        <div className="mode-selector-header">
          <h1 className="mode-selector-title">Choose Your Experience</h1>
          <p className="mode-selector-subtitle">Select your preferred deployment experience</p>
        </div>
        
        <div className="mode-options">
          <div 
            className="mode-option normal-option"
            onClick={() => handleModeSelect('normal')}
          >
            <div className="mode-image-container">
              <img src="/gamble.png" alt="Normal Mode" className="mode-image" />
              <div className="mode-image-overlay"></div>
            </div>
            <div className="mode-content">
              <h2>Classic Mode</h2>
              <p>Professional smart contract deployment platform</p>
              <div className="mode-features">
                <div className="feature-item">
                  <Building2 size={16} className="feature-icon" />
                  <span>Professional contracts</span>
                </div>
                <div className="feature-item">
                  <Gem size={16} className="feature-icon" />
                  <span>DeFi protocols</span>
                </div>
                <div className="feature-item">
                  <Palette size={16} className="feature-icon" />
                  <span>NFT collections</span>
                </div>
                <div className="feature-item">
                  <Coins size={16} className="feature-icon" />
                  <span>Utility tokens</span>
                </div>
              </div>
            </div>
            <button className="mode-select-btn normal-btn">
              <span>Enter Classic Mode</span>
              <div className="btn-glow"></div>
            </button>
          </div>

          <div 
            className="mode-option jaine-option"
            onClick={() => handleModeSelect('jaine')}
          >
            <div className="mode-image-container">
              <img src="/logo.svg" alt="Jaine Mode" className="mode-image jaine-logo" />
              <div className="mode-image-overlay jaine-overlay"></div>
            </div>
            <div className="mode-content">
              <h2>Jaine Mode</h2>
              <p>Anime-inspired rejection simulation experience</p>
              <div className="mode-features">
                <div className="feature-item">
                  <HeartCrack size={16} className="feature-icon" />
                  <span>Rejection simulator</span>
                </div>
                <div className="feature-item">
                  <Users size={16} className="feature-icon" />
                  <span>Friendzone contracts</span>
                </div>
                <div className="feature-item">
                  <Laugh size={16} className="feature-icon" />
                  <span>Cope mechanisms</span>
                </div>
                <div className="feature-item">
                  <Skull size={16} className="feature-icon" />
                  <span>Emotional damage</span>
                </div>
              </div>
            </div>
            <button className="mode-select-btn jaine-btn">
              <span>Enter Jaine Mode</span>
              <div className="btn-glow"></div>
            </button>
          </div>
        </div>

        <p className="mode-selector-note">
          You can switch modes anytime using the toggle button
        </p>
      </div>

      <style jsx>{`
        .mode-selector-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(15, 23, 42, 0.98));
          backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.5s ease-out;
        }

        .mode-selector-container {
          max-width: 1200px;
          width: 95%;
          padding: 60px 40px;
          text-align: center;
        }

        .mode-selector-header {
          margin-bottom: 60px;
        }

        .mode-selector-title {
          font-size: clamp(32px, 5vw, 56px);
          font-weight: 900;
          margin-bottom: 16px;
          background: linear-gradient(135deg, #00D2E9 0%, #FF5CAA 50%, #FFD700 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s ease-in-out infinite;
          letter-spacing: -0.02em;
        }

        .mode-selector-subtitle {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 400;
          margin: 0;
        }

        .mode-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }

        .mode-option {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 0;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
          height: 520px;
          display: flex;
          flex-direction: column;
        }

        .mode-option::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.03) 50%, transparent 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: 1;
        }

        .mode-option:hover::before {
          opacity: 1;
        }

        .normal-option {
          border-color: rgba(0, 210, 233, 0.3);
        }

        .normal-option:hover {
          border-color: rgba(0, 210, 233, 0.8);
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 50px rgba(0, 210, 233, 0.2), 0 0 0 1px rgba(0, 210, 233, 0.1);
        }

        .jaine-option {
          border-color: rgba(139, 92, 246, 0.3);
        }

        .jaine-option:hover {
          border-color: rgba(139, 92, 246, 0.8);
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 50px rgba(139, 92, 246, 0.2), 0 0 0 1px rgba(139, 92, 246, 0.1);
        }

        .mode-image-container {
          position: relative;
          height: 180px;
          overflow: hidden;
          border-radius: 24px 24px 0 0;
          background: linear-gradient(135deg, rgba(0, 210, 233, 0.1), rgba(255, 92, 170, 0.1));
        }

        .jaine-option .mode-image-container {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.1));
        }

        .mode-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .jaine-logo {
          object-fit: contain;
          padding: 20px;
        }

        .mode-option:hover .mode-image {
          transform: scale(1.1);
        }

        .mode-image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, transparent 0%, rgba(0, 210, 233, 0.1) 100%);
          opacity: 0.8;
        }

        .jaine-overlay {
          background: linear-gradient(180deg, transparent 0%, rgba(139, 92, 246, 0.1) 100%);
        }

        .mode-content {
          padding: 32px 28px 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 2;
        }

        .mode-content h2 {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 12px;
          color: #FFFFFF;
          letter-spacing: -0.01em;
        }

        .mode-content p {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .mode-features {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: auto;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
        }

        .feature-icon {
          width: 16px;
          height: 16px;
          color: rgba(0, 210, 233, 0.8);
          flex-shrink: 0;
        }

        .jaine-option .feature-icon {
          color: rgba(139, 92, 246, 0.8);
        }

        .mode-select-btn {
          width: calc(100% - 56px);
          margin: 0 28px 28px;
          padding: 16px 32px;
          background: linear-gradient(135deg, #00D2E9 0%, #FF5CAA 100%);
          color: white;
          border: none;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          position: relative;
          overflow: hidden;
        }

        .mode-select-btn span {
          position: relative;
          z-index: 2;
        }

        .btn-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .mode-select-btn:hover .btn-glow {
          opacity: 1;
        }

        .mode-select-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(0, 210, 233, 0.3);
        }

        .jaine-btn {
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
        }

        .jaine-btn:hover {
          box-shadow: 0 12px 24px rgba(139, 92, 246, 0.3);
        }

        .mode-selector-note {
          color: rgba(255, 255, 255, 0.5);
          font-size: 14px;
          margin-top: 32px;
          font-weight: 400;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shimmer {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @media (max-width: 768px) {
          .mode-selector-container {
            padding: 40px 20px;
          }

          .mode-options {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .mode-option {
            height: auto;
            min-height: 480px;
          }

          .mode-image-container {
            height: 140px;
          }

          .mode-content {
            padding: 24px 20px 20px;
          }

          .mode-content h2 {
            font-size: 24px;
          }

          .mode-select-btn {
            width: calc(100% - 40px);
            margin: 0 20px 20px;
          }
        }

        @media (max-width: 480px) {
          .mode-selector-header {
            margin-bottom: 40px;
          }

          .mode-content {
            padding: 20px 16px 16px;
          }

          .mode-select-btn {
            width: calc(100% - 32px);
            margin: 0 16px 16px;
            padding: 14px 24px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default ModeSelector;
import React from 'react';
import { X, BarChart3, Sparkles, Star, Gem, Trophy } from 'lucide-react';
import { ContractType } from '../types';

interface DropRatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  contracts: ContractType[];
  title?: string;
}

const rarityOrder: Record<string, number> = {
  mythic: 5,
  legendary: 4,
  epic: 3,
  rare: 2,
  common: 1,
};

const RarityIcon: React.FC<{ rarity: string }> = ({ rarity }) => {
  switch (rarity) {
    case 'mythic':
      return <Trophy size={16} />;
    case 'legendary':
      return <Gem size={16} />;
    case 'epic':
      return <Star size={16} />;
    case 'rare':
      return <Sparkles size={16} />;
    default:
      return <BarChart3 size={16} />;
  }
};

const DropRatesModal: React.FC<DropRatesModalProps> = ({ isOpen, onClose, contracts, title }) => {
  if (!isOpen) return null;

  const grouped = [...contracts]
    .sort((a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity] || (b.chance - a.chance))
    .reduce<Record<string, ContractType[]>>((acc, c) => {
      (acc[c.rarity] ||= []).push(c);
      return acc;
    }, {});

  const totalChance = contracts.reduce((s, c) => s + (c.chance || 0), 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container drops-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="modal-header">
          <div className="modal-rarity-badge" style={{ gap: 10 }}>
            <BarChart3 size={18} />
            <span>Drop Rates</span>
          </div>
          <h2 className="modal-title">{title || 'Drop Rates'}</h2>
        </div>

        <div className="modal-body">
          <div className="drop-summary">
            <span>Total pools</span>
            <strong>{contracts.length}</strong>
            <span className="muted">(sum weights: {totalChance})</span>
          </div>

          <div className="drop-list">
            {Object.keys(grouped)
              .sort((a, b) => rarityOrder[b] - rarityOrder[a])
              .map((rarity) => (
                <div key={rarity} className={`drop-group rarity-${rarity}`}>
                  <div className="drop-group-header">
                    <RarityIcon rarity={rarity} />
                    <span className="group-title">{rarity.toUpperCase()}</span>
                  </div>
                  <div className="drop-items">
                    {grouped[rarity].map((c) => (
                      <div key={c.id} className="drop-item">
                        <div className="item-left">
                          <c.icon size={18} style={{ color: c.color }} />
                          <span className="item-name">{c.name}</span>
                        </div>
                        <div className="item-right">
                          <div className="chance-bar">
                            <div className="chance-fill" style={{ width: `${Math.min(100, c.chance)}%` }} />
                          </div>
                          <span className="chance-text">{c.chance}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-button modal-spin-again" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DropRatesModal;



import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type GameMode = 'normal' | 'jaine';

interface ModeContextType {
  mode: GameMode;
  setMode: (mode: GameMode) => void;
  toggleMode: () => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<GameMode>(() => {
    // Load saved mode from localStorage
    const savedMode = localStorage.getItem('gameMode');
    return (savedMode === 'jaine' || savedMode === 'normal') ? savedMode : 'normal';
  });

  const setMode = (newMode: GameMode) => {
    setModeState(newMode);
    localStorage.setItem('gameMode', newMode);
  };

  const toggleMode = () => {
    setMode(mode === 'normal' ? 'jaine' : 'normal');
  };

  useEffect(() => {
    // Add class to body for global styling
    document.body.className = mode === 'jaine' ? 'jaine-mode' : 'normal-mode';
  }, [mode]);

  return (
    <ModeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
};
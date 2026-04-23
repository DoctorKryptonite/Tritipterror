/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Menu, X, Save, RotateCcw } from 'lucide-react';
import { INITIAL_GAME_STATE } from './constants';
import { GameState, GameLogEntry } from './types';
import { processGameTurn } from './services/geminiService';
import Terminal from './components/Terminal';
import Sidebar from './components/Sidebar';
import LoadingScreen from './components/LoadingScreen';

const SAVE_KEY = 'big_bill_tri_tip_terror_save';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGameLoading, setIsGameLoading] = useState(true);

  // Load game on mount
  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        setGameState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load save:", e);
      }
    }
  }, []);

  // Auto-save on game state change
  useEffect(() => {
    if (gameState !== INITIAL_GAME_STATE) {
      localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
    }
  }, [gameState]);

  const handleCommand = useCallback(async (command: string) => {
    setIsLoading(true);
    
    // Add user command to history immediately
    const userEntry: GameLogEntry = {
      type: 'user',
      text: command,
      timestamp: Date.now()
    };
    
    setGameState(prev => ({
      ...prev,
      history: [...prev.history, userEntry]
    }));

    // Process turn with Gemini
    const response = await processGameTurn(command, gameState);
    
    // Update state based on response
    setGameState(prev => {
      let nextInventory = [...prev.inventory];
      
      // Handle items
      if (response.addedItems) {
        nextInventory = [...nextInventory, ...response.addedItems];
      }
      if (response.removedItems) {
        nextInventory = nextInventory.filter(item => !response.removedItems?.includes(item));
      }

      const systemEntry: GameLogEntry = {
        type: 'system',
        text: response.description,
        timestamp: Date.now()
      };

      return {
        ...prev,
        location: response.newLocation || prev.location,
        inventory: Array.from(new Set(nextInventory)), // Deduplicate
        health: Math.max(0, Math.min(100, prev.health + (response.healthChange || 0))),
        history: [...prev.history, systemEntry],
        isGameOver: !!response.isGameOver
      };
    });

    setIsLoading(false);
  }, [gameState]);

  const handleReset = () => {
    if (window.confirm("ARE YOU SURE? THIS WILL ERASE YOUR PROGRESS AND RESET THE GRILL.")) {
      localStorage.removeItem(SAVE_KEY);
      setGameState(INITIAL_GAME_STATE);
      window.location.reload();
    }
  };

  if (isGameLoading) {
    return <LoadingScreen onComplete={() => setIsGameLoading(false)} />;
  }

  return (
    <div className="flex flex-col h-screen bg-terminal-bg selection:bg-terminal-green/30 selection:text-terminal-green">
      {/* Header Bar */}
      <header className="h-12 border-b border-terminal-green/30 flex items-center justify-between px-4 sm:px-6 bg-black/60 relative z-50">
        <div className="flex items-center gap-3 text-terminal-green font-mono">
          <div className="p-1 rounded bg-bbq-orange shadow-[0_0_10px_var(--color-bbq-orange)]">
            <Flame className="w-3 h-3 sm:w-4 h-4 text-white" />
          </div>
          <h1 className="text-[10px] sm:text-sm font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] truncate max-w-[150px] sm:max-w-none">
            Big Bill's Tri-Tip Terror
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Reset Button (Hidden on very small screens) */}
          <button 
            onClick={handleReset}
            title="Reset Progress"
            className="p-2 text-terminal-green/50 hover:text-red-500 transition-colors hidden sm:block"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Mobile Sidebar Toggle */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 text-terminal-green border border-terminal-green/20 rounded bg-terminal-green/5"
          >
            {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        <div className="hidden lg:flex text-[10px] text-terminal-green/50 gap-4 uppercase font-bold tracking-widest leading-none">
          <span className="animate-pulse">System Status: SECURE</span>
          <span className="opacity-30">|</span>
          <span>Flavor Integrity: 98.4%</span>
          <span className="opacity-30">|</span>
          <span>Tri-Tip Status: SEARING</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <div className="flex-1 p-2 sm:p-4 lg:p-6 flex flex-col min-h-0">
          <Terminal 
            history={gameState.history} 
            onCommand={handleCommand}
            isLoading={isLoading}
            isGameOver={gameState.isGameOver}
          />
        </div>
        
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 border-l border-terminal-green/20 overflow-y-auto">
          <Sidebar state={gameState} />
          <div className="px-4 pb-4">
            <button 
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 py-2 border border-red-900/30 text-red-500/50 hover:text-red-500 hover:bg-red-500/5 text-[10px] uppercase tracking-widest transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              Wipe Save Data
            </button>
          </div>
        </div>

        {/* Mobile Sidebar Drawer */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 right-0 w-[85%] z-40 border-l border-terminal-green/40 shadow-[-20px_0_50px_rgba(0,0,0,0.8)] flex flex-col"
            >
              <Sidebar state={gameState} onClose={() => setIsSidebarOpen(false)} className="flex-1" />
              <div className="p-4 bg-black border-t border-terminal-green/10">
                <button 
                  onClick={handleReset}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-red-900/30 text-red-500 hover:bg-red-500/5 text-xs uppercase tracking-widest transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset Game
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Game Over Overlay */}
      {gameState.isGameOver && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-6 text-center"
        >
          <div className="max-w-md space-y-6">
            <h2 className="text-6xl sm:text-7xl font-bold text-bbq-orange uppercase tracking-tighter italic drop-shadow-[0_0_20px_var(--color-bbq-orange)]">Game Over</h2>
            <p className="text-terminal-green text-sm sm:text-lg leading-relaxed font-mono">
              {gameState.history[gameState.history.length - 1].text}
            </p>
            <div className="pt-8">
              <button 
                onClick={() => {
                  localStorage.removeItem(SAVE_KEY);
                  window.location.reload();
                }}
                className="px-8 py-3 border-2 border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-black font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_var(--color-terminal-glow)]"
              >
                Insert Charcoal to Restart
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Footer Decoration */}
      <footer className="h-6 border-t border-terminal-green/10 flex items-center px-4 bg-black/40">
        <div className="w-full flex justify-between text-[8px] text-terminal-green/30 uppercase tracking-[0.3em]">
          <span>© 1984 BIG BILL INDUSTRIES</span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">AUTOSAVE: ACTIVE</span>
          <span>EST. 1984</span>
        </div>
      </footer>
    </div>
  );
}


/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal as TerminalIcon, Send, ChevronRight } from 'lucide-react';
import { GameLogEntry } from '../types';

interface TerminalProps {
  history: GameLogEntry[];
  onCommand: (command: string) => void;
  isLoading: boolean;
  isGameOver: boolean;
}

export default function Terminal({ history, onCommand, isLoading, isGameOver }: TerminalProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading && !isGameOver) {
      onCommand(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full border border-terminal-green/30 rounded-lg bg-black/50 overflow-hidden shadow-[0_0_20px_var(--color-terminal-glow)] relative">
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[size:100%_3px] z-10" />

      <div className="bg-terminal-green/10 px-4 py-2 flex items-center gap-2 border-bottom border-terminal-green/20">
        <TerminalIcon className="w-4 h-4 text-terminal-green" />
        <span className="text-xs font-bold uppercase tracking-widest text-terminal-green/70">BigBill_OS v1.0.4 - BBQ Defense Mode</span>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide relative z-0"
      >
        <AnimatePresence initial={false}>
          {history.map((entry, i) => (
            <motion.div
              key={`${entry.timestamp}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-2 ${entry.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-2 rounded ${
                entry.type === 'user' 
                  ? 'bg-bbq-orange/20 text-bbq-orange border border-bbq-orange/30' 
                  : entry.type === 'error'
                    ? 'text-red-500 bg-red-950/20 border border-red-900/30'
                    : 'text-terminal-green'
              }`}>
                {entry.type === 'user' && (
                  <span className="text-[10px] opacity-50 block mb-1 uppercase tracking-tighter">Big Bill</span>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {entry.type === 'system' && <span className="mr-2 text-terminal-green animate-pulse">▋</span>}
                  {entry.text}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-terminal-green/50 animate-pulse text-sm"
          >
            <span>Analyzing situation...</span>
            <span className="inline-block w-2 h-4 bg-terminal-green/50" />
          </motion.div>
        )}
      </div>

      <form 
        onSubmit={handleSubmit}
        className="p-3 sm:p-4 border-t border-terminal-green/30 bg-black/80 flex items-center gap-1 sm:gap-2 focus-within:ring-1 focus-within:ring-terminal-green/50 transition-all z-20"
      >
        <div className="flex items-center gap-1">
          <ChevronRight className="w-4 h-4 sm:w-5 h-5 text-terminal-green" />
          <div className="w-2 h-4 sm:h-5 bg-terminal-green terminal-cursor" />
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading || isGameOver}
          placeholder={isGameOver ? "GAME OVER" : "ENTER COMMAND..."}
          className="flex-1 bg-transparent border-none outline-none text-terminal-green placeholder:text-terminal-green/20 text-sm sm:text-base py-1"
          autoFocus
        />
        <button 
          type="submit"
          disabled={isLoading || isGameOver || !input.trim()}
          className="p-1.5 sm:p-2 rounded bg-terminal-green/10 text-terminal-green hover:bg-terminal-green/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

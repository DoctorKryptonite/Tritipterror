/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Play, Volume2 } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedOption, setSelectedOption] = useState(0);

  const loadingSequence = [
    "BIOS v4.20 (C) 1984 BIG BILL INDUSTRIES",
    "CPU: SMOKEY-ZEN 8-CORE @ 450MHz",
    "MEMORY TEST: 640KB OK",
    "DETECTING STORAGE... FOUND: BBQ-DRIVE (C:)",
    "MOUNTING FLAVOR-FS... SUCCESS",
    "LOADING KERNEL: TRI-TIP-OS.SYS",
    "INITIALIZING GRILL_DRIVER.DRV...",
    "DETECTING ALIEN FREQUENCIES... [WARNING]",
    "CALIBRATING SPATULA SENSORS...",
    "OPTIMIZING MARINADE VISCOSITY...",
    "SYSTEM READY. LAUNCHING INTERFACE..."
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < loadingSequence.length) {
        const nextLog = loadingSequence[currentLine];
        setLogs(prev => [...prev, nextLog]);
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowMenu(true), 800);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!showMenu) {
      const totalTime = loadingSequence.length * 200 + 500;
      const step = 100 / (totalTime / 50);
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + step;
        });
      }, 50);
      return () => clearInterval(progressInterval);
    }
  }, [showMenu]);

  const menuOptions = [
    "NEW ADVENTURE",
    "CONTINUE DEFENSE",
    "AUDIO SETTINGS",
    "EXIT TO DOS"
  ];

  return (
    <div className="fixed inset-0 bg-black z-[200] font-mono p-4 sm:p-8 flex flex-col gap-4 text-terminal-green text-sm sm:text-base selection:bg-terminal-green/20 overflow-hidden">
      <AnimatePresence>
        {!showMenu ? (
          <motion.div 
            key="boot"
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex-1 flex flex-col"
          >
            <div className="flex-1 overflow-hidden">
              {logs.map((log, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.05 }}
                  className="mb-1"
                >
                   {log && log.startsWith("[WARNING]") ? (
                     <span className="text-red-500">{log}</span>
                   ) : (
                     <span className="opacity-80">C:\\&gt;{log}</span>
                   )}
                </motion.div>
              ))}
              <motion.div 
                animate={{ opacity: [0, 1] }} 
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-2 h-5 bg-terminal-green"
              />
            </div>

            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-terminal-green/50">
                <span>Loading Assets</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1 bg-terminal-green/10 border border-terminal-green/30 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-terminal-green shadow-[0_0_10px_var(--color-terminal-green)]"
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center relative"
          >
            {/* 8-bit Style Stars/Background elements */}
            <div className="absolute inset-0 z-0 overflow-hidden opacity-20 pointer-events-none">
               {[...Array(20)].map((_, i) => (
                 <motion.div 
                    key={i}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ repeat: Infinity, duration: Math.random() * 2 + 1, delay: Math.random() * 2 }}
                    className="absolute bg-white w-1 h-1"
                    style={{ 
                      top: `${Math.random() * 100}%`, 
                      left: `${Math.random() * 100}%` 
                    }}
                 />
               ))}
            </div>

            <div className="z-10 flex flex-col items-center text-center max-w-2xl">
              <motion.div 
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="mb-8"
              >
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Flame className="w-12 h-12 text-bbq-orange drop-shadow-[0_0_15px_var(--color-bbq-orange)]" />
                </div>
                <h1 className="text-4xl sm:text-7xl font-black italic tracking-tighter uppercase leading-none text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                  BIG BILL<span className="text-bbq-orange block sm:inline">'S</span>
                </h1>
                <h2 className="text-2xl sm:text-5xl font-black tracking-widest text-terminal-green mt-2 bg-black px-4 py-2 border-4 border-terminal-green">
                  TRI-TIP TERROR
                </h2>
              </motion.div>

              <div className="space-y-4 w-64 sm:w-80">
                {menuOptions.map((opt, i) => (
                  <motion.button
                    key={opt}
                    onMouseEnter={() => setSelectedOption(i)}
                    onClick={() => i <= 1 ? onComplete() : null}
                    className={`w-full py-4 text-left px-6 relative transition-all border-4 flex items-center gap-4 ${
                      selectedOption === i 
                        ? 'bg-terminal-green text-black border-terminal-green scale-105' 
                        : 'bg-black text-terminal-green border-terminal-green/30 opacity-60'
                    }`}
                  >
                    {selectedOption === i && (
                      <motion.div layoutId="cursor" className="text-black">
                        <Play className="w-4 h-4 fill-current" />
                      </motion.div>
                    )}
                    <span className="text-lg sm:text-xl font-bold tracking-tighter uppercase whitespace-nowrap">{opt}</span>
                    {selectedOption === i && (
                      <div className="ml-auto animate-pulse flex gap-1">
                         <div className="w-1 h-4 bg-black" />
                         <div className="w-1 h-4 bg-black" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>

              <div className="mt-12 flex items-center justify-center gap-8 text-[10px] sm:text-xs text-terminal-green/50 uppercase tracking-[0.2em] font-bold">
                 <div className="flex items-center gap-2">
                   <Volume2 className="w-3 h-3" />
                   <span>SOUND: ON</span>
                 </div>
                 <span>© 1984 VINTAGE BBQ ENTS.</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CRT Scanline overlay on menu as well */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[size:100%_3px] z-[300]" />
    </div>
  );
}


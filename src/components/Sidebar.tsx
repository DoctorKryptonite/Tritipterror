/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { MapPin, Package, Heart, ShieldAlert } from 'lucide-react';
import { GameState } from '../types';

interface SidebarProps {
  state: GameState;
  onClose?: () => void;
  className?: string;
}

export default function Sidebar({ state, onClose, className }: SidebarProps) {
  return (
    <div className={`flex flex-col gap-4 p-4 bg-black/90 lg:bg-black/30 backdrop-blur-md lg:backdrop-blur-sm overflow-hidden ${className}`}>
      {/* Mobile Close Button */}
      <div className="lg:hidden flex justify-end">
        <button 
          onClick={onClose}
          className="text-terminal-green/50 text-[10px] uppercase border border-terminal-green/20 px-2 py-1"
        >
          Close Status
        </button>
      </div>

      {/* Health Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-terminal-green/50">
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            <span>Bill Vitality</span>
          </div>
          <span>{state.health}%</span>
        </div>
        <div className="h-2 w-full bg-terminal-green/10 border border-terminal-green/30 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: '100%' }}
            animate={{ width: `${state.health}%` }}
            className={`h-full ${state.health < 30 ? 'bg-red-500' : 'bg-terminal-green'} shadow-[0_0_10px_currentColor]`}
          />
        </div>
      </div>

      {/* Location */}
      <div className="p-3 border border-terminal-green/20 bg-terminal-green/5 rounded-lg space-y-2">
        <div className="flex items-center gap-2 text-xs text-terminal-green/70 uppercase tracking-wider">
          <MapPin className="w-3 h-3" />
          <span>Current Sector</span>
        </div>
        <p className="text-sm font-bold text-terminal-green">{state.location}</p>
      </div>

      {/* Inventory */}
      <div className="flex-1 p-3 border border-terminal-green/20 bg-terminal-green/5 rounded-lg flex flex-col gap-2 min-h-0">
        <div className="flex items-center gap-2 text-xs text-terminal-green/70 uppercase tracking-wider">
          <Package className="w-3 h-3" />
          <span>Utensils & Meat</span>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
          {state.inventory.length === 0 ? (
            <p className="text-[10px] text-terminal-green/30 italic">Pockets are empty...</p>
          ) : (
            state.inventory.map((item, i) => (
              <motion.div 
                key={item}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-xs p-2 border border-terminal-green/10 bg-black/40 rounded flex items-center justify-between group hover:border-terminal-green/40 transition-colors"
              >
                <span>{item}</span>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Warning if aliens are close (mock state for now) */}
      <div className="p-3 border border-bbq-orange/20 bg-bbq-orange/5 rounded-lg border-dashed">
        <div className="flex items-center gap-2 text-xs text-bbq-orange uppercase tracking-wider animate-pulse">
          <ShieldAlert className="w-3 h-3" />
          <span>Saucer Proximity</span>
        </div>
        <p className="text-[10px] text-bbq-orange/70 mt-1 uppercase">DANGER: EXTREME. PROTECT THE FLAVOR PROFILE AT ALL COSTS.</p>
      </div>
    </div>
  );
}

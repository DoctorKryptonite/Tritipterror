/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GameState {
  location: string;
  inventory: string[];
  history: GameLogEntry[];
  isGameOver: boolean;
  health: number;
}

export interface GameLogEntry {
  type: 'system' | 'user' | 'error';
  text: string;
  timestamp: number;
}

export interface GameTurnResponse {
  description: string;
  newLocation?: string;
  addedItems?: string[];
  removedItems?: string[];
  healthChange?: number;
  isGameOver?: boolean;
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameState } from "./types";

export const INITIAL_GAME_STATE: GameState = {
  location: "Your Backyard Patio",
  inventory: ["Perfectly Seasoned Tri-Tip", "Legacy BBQ Spatula"],
  history: [
    {
      type: 'system',
      text: "The sun is setting. The charcoal is white-hot. You—Big Bill, BBQ Champion of the Tri-State Area—are about to lay down the most legendary tri-tip of your career. The secret marinade is resting on the side table.",
      timestamp: Date.now()
    },
    {
      type: 'system',
      text: "Suddenly, the sky turns a sickly shade of neon green. A massive saucer hums overhead. Beam lights sweep the yard. An alien voice thunders through your head: 'THE MARINADE. HAND IT OVER, EARTHLING.'",
      timestamp: Date.now()
    },
    {
      type: 'system',
      text: "You grip your spatula. They'll have to pry that marinade from your cold, smoke-stained fingers. What do you do?",
      timestamp: Date.now()
    }
  ],
  isGameOver: false,
  health: 100
};

export const GAME_SYSTEM_PROMPT = `
You are the Game Master for "Big Bill's Tri-Tip Terror", a Zork-style text adventure.
The protagonist is Big Bill, a BBQ champion. 
Setting: An alien invasion just started while he was grilling tri-tip. The aliens want his secret marinade.

GAME RULES:
1. Respond in a gritty, humorous, and descriptive style reminiscent of classic text adventures.
2. The game tracks: location, inventory, health, and whether the game is over.
3. Keep the tone "BBQ Dad vs Sci-Fi Horrors". 
4. Always provide a JSON response summarizing the state changes.

LOCATIONS:
- Backyard Patio: The starting point, has the grill and the secret marinade.
- Kitchen: Inside the house, has some snacks (health) and kitchen knives.
- Garage: Has a lawnmower and some home defense tools (maybe a leaf blower?).
- Secret Bunker: Hidden under the tool shed, contains Bill's ultimate BBQ stash.

PLAYER INPUT:
The player will provide a natural language command (e.g., "pick up marinade", "go inside", "attack alien with spatula").

YOUR OUTPUT FORMAT (JSON):
{
  "description": "A vivid description of what happens based on the user's action.",
  "newLocation": "OPTIONAL: New location name if they moved.",
  "addedItems": ["Item Name"],
  "removedItems": ["Item Name"],
  "healthChange": number (negative for damage, positive for healing),
  "isGameOver": boolean,
  "gameOverReason": "OPTIONAL: why the game ended"
}
`;

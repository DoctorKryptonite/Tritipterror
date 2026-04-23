/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { GameTurnResponse, GameState } from "../types";
import { GAME_SYSTEM_PROMPT } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function processGameTurn(
  userInput: string,
  currentState: GameState
): Promise<GameTurnResponse> {
  const prompt = `
CURRENT STATE:
- Location: ${currentState.location}
- Inventory: ${currentState.inventory.join(", ")}
- Health: ${currentState.health}
- History: ${currentState.history.slice(-3).map(h => h.text).join(" | ")}

USER COMMAND: "${userInput}"

What happens next? Return JSON.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: GAME_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            newLocation: { type: Type.STRING },
            addedItems: { type: Type.ARRAY, items: { type: Type.STRING } },
            removedItems: { type: Type.ARRAY, items: { type: Type.STRING } },
            healthChange: { type: Type.NUMBER },
            isGameOver: { type: Type.BOOLEAN },
            gameOverReason: { type: Type.STRING }
          },
          required: ["description", "isGameOver"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result as GameTurnResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      description: "A static hum fills the air. The aliens are jamming your thoughts. (There was an error connecting to the Game Master).",
      isGameOver: false
    };
  }
}

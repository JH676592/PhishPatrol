import { GoogleGenAI, Type } from "@google/genai";
import { GEMINI_API_KEY } from '$env/static/private';
import { addScenario } from '$lib/server/scenarioStore';
import type { Scenario } from "$lib/types";

const prompts = [
  "Compose a short phishing email. The type is EMAIL. Additionally, provide a short explanation about what makes this email identifiable as a scam.",
  "Compose a short legitimate email. The type is EMAIL. Additionally, provide a short explanation about what makes this email legitimate as opposed to looking like a scam.",
  "Compose a short phishing text message. The type is SMS. Additionally, provide a short explanation about what makes this text message identifiable as a scam.",
  "Compose a short legitimate text message. The type is SMS. Additionally, provide a short explanation about what makes this text message identifiable as a legitimate, as opposed to being a scam.",];

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

async function generateAndStoreScenario() {
  try {
    console.log("[Gemini Task] Generating a new scenario...");
    const randomIndex = Math.floor(Math.random() * prompts.length);
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompts[randomIndex],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING },
            content: { type: Type.STRING },
            isScam: { type: Type.BOOLEAN },
            explanation: { type: Type.STRING },
          },
        },
      }
    });

    const responseText = response.text;
    const scenario = JSON.parse(responseText) as Omit<Scenario, 'id'>;
    addScenario(scenario);

  } catch (error) {
    console.error("[Gemini Task] Error generating scenario:", error);
  }
}

function scheduleNextGeneration() {
  // Random interval between 5 seconds and 15 seconds
  const randomDelay = Math.random() * 10000 + 5000;
  
  setTimeout(() => {
    generateAndStoreScenario().then(scheduleNextGeneration);
  }, randomDelay);
}

generateAndStoreScenario().then(() => {
  scheduleNextGeneration();
});

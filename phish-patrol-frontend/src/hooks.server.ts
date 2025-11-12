import { GoogleGenAI, Type, ApiError } from "@google/genai";
import { GEMINI_API_KEY } from '$env/static/private';
import { addScenario } from '$lib/server/scenarioStore';
import type { Scenario } from "$lib/types";

const general_prompt = `Generate a scenario for our game.

Player’s Role: Cyber Security Agent
You recently got a job with Phish Patrol Task Force (PPTF) - an international cyber security organization dedicated to combating digital deception. You are the lead analyst in the Simulation and Training Division where you are tested against live phishing replicas to identify a hacker syndicate.

Mission / Storyline:
PPTF has been monitoring a surge in coordinated phishing attacks by a hacker syndicate known as The Lure. To help protect users, you have been placed inside a desktop simulation that reproduces the attack patterns seen in the field. Analyze text messages and emails to determine if they are scams or not. Each message you correctly identify helps trace The Lure’s digital footprint and gets us one step closer to unveiling the true attacker’s real identities. Example of messages include bank login alert, package delivery failed, CEO/executive request, IT password reset, HR payroll form asking for personal details, job/recruiter, social media account verification DM, etc.

Make sure the scenarios are challenging and nuanced. Make sure emails contains a subject line and a from line.\n

Also ensure that newline characters, \\n, are used, especially in lists and the different fields of emails.
`


const prompts = [
  "Compose a short phishing email. The type is EMAIL. Additionally, provide a short explanation about what makes this email identifiable as a scam.",
  "Compose a short legitimate email. The type is EMAIL. Additionally, provide a short explanation about what makes this email legitimate as opposed to looking like a scam.",
  "Compose a short phishing text message. The type is SMS. Additionally, provide a short explanation about what makes this text message identifiable as a scam.",
  "Compose a short legitimate text message. The type is SMS. Additionally, provide a short explanation about what makes this text message identifiable as a legitimate, as opposed to being a scam.",];

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

async function sleep(ms: number): Promise<void> {
    return new Promise(
        (resolve) => setTimeout(resolve, ms));
}

async function generateAndStoreScenario() {
  try {
    console.log("[Gemini Task] Generating a new scenario...");
    const randomIndex = Math.floor(Math.random() * prompts.length);
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: general_prompt + prompts[randomIndex],
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
    if (error instanceof ApiError) {
      console.error("[Gemini Task] Gemini overloaded - waiting to cool down");
      sleep(10000);
      return;
    }
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

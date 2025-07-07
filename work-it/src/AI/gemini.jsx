import { GoogleGenAI } from "@google/genai";

// Load environment variables from .env file
require('dotenv').config();

const geminiApiKey = process.env.API_KEY;
if (!geminiApiKey) {
  console.error("API key not found. Please set the API_KEY in your .env file.");
} else {
  console.log("API Key loaded successfully.");
}
const ai = new GoogleGenAI({ apiKey: geminiApiKey });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
}

main();
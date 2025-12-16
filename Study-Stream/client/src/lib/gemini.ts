// src/lib/gemini.ts

import { GoogleGenAI } from "@google/genai";

// 1. Get the secret key from the file we made in Task 1 (.env.local).
const apiKey = import.meta.env.VITE_APP_GEMINI_API_KEY; 

if (!apiKey) {
  throw new Error("API Key is missing. Did you create the .env.local file?");
}

// 2. This initializes the connection to Google's server.
const ai = new GoogleGenAI({ apiKey });

// 3. This starts a 'chat session' so Gemini remembers previous messages.
const chat = ai.chats.create({
  model: "gemini-2.5-flash", 
  config: {
    systemInstruction: "You are a friendly and helpful AI Study Buddy. Keep your answers clear and concise.",
  }
});

/**
 * Sends the user's message and streams the response back.
 */
export async function* sendMessageStream(message: string): AsyncGenerator<string> {
  try {
    const result = await chat.sendMessageStream({ message });
    
    // As Gemini sends back parts of the answer, we send them to the main page
    for await (const chunk of result) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    yield "Sorry, I can't talk right now due to a connection issue.";
  }
}
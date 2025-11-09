import { GoogleGenAI } from "@google/genai";
import {env} from "@repo/config/index"
import dotenv from 'dotenv'

dotenv.config()


export async function getAIAnswer(data:string,question:string) {
  const   prompt =`
WEBSITE TEXT:
${data}
QUESTION:
 ${question}
`
const ai = new GoogleGenAI({apiKey:  env.GOOGLE_API_KEY,});
const response = await ai.models.generateContent({
  
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      thinkingConfig: {
        thinkingBudget: 0, // Disables thinking
      },
    }
  });
  return response.text
}
    

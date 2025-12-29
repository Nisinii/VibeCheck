import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBCN_0Pq_194Vrrnwj50uGmC8a5gCfff0E"; 

const genAI = new GoogleGenerativeAI(API_KEY);

export const generateVibeSummary = async (placeName, reviews) => {
  if (!reviews || reviews.length === 0) return "Not enough data to generate a vibe check.";

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    // Combine reviews into a single text block
    const reviewsText = reviews.map(r => `"${r.text}"`).join("\n");

    const prompt = `
      Based on the following reviews for a place called "${placeName}", write a one-sentence "Vibe Check" summary.
      
      Guidelines:
      - Be descriptive but concise (max 20 words).
      - Focus on the atmosphere, crowd, and best use-case (e.g., "Good for dates", "Coding spot").
      - Use a cool, modern tone.
      - Do NOT mention specific names of reviewers.
      
      Reviews:
      ${reviewsText}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error); 
    
    // Provide a more helpful user message based on common errors
    if (error.message?.includes("API key")) return "Configuration Error: Invalid AI Key";
    return "AI Engine unavailable at the moment.";
  }
};
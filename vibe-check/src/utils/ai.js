import { GoogleGenerativeAI } from "@google/generative-ai";

// NOTE: In production, use import.meta.env.VITE_GEMINI_API_KEY
// Currently hardcoded for demo purposes.
const API_KEY = "AIzaSyBCN_0Pq_194Vrrnwj50uGmC8a5gCfff0E"; 

// Initialize the Gemini Client
const genAI = new GoogleGenerativeAI(API_KEY);

// ------------------------------------------------------------------
// UTILITY: GENERATE VIBE SUMMARY
// ------------------------------------------------------------------
// Uses Google's Gemini Flash model to analyze raw review text
// and condense it into a single, punchy "Vibe Check" sentence.

export const generateVibeSummary = async (placeName, reviews) => {
  // Guard Clause: No reviews = No AI analysis
  if (!reviews || reviews.length === 0) return "Not enough data to generate a vibe check.";

  try {
    // 1. Select the Model (Flash is faster/cheaper for this use case)
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    // 2. Prepare Data
    // Combine reviews into a single text block for context window
    const reviewsText = reviews.map(r => `"${r.text}"`).join("\n");

    // 3. Prompt Engineering
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
    
    // 4. Generate Content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error); 
    
    // 5. Error Handling
    // Provide a helpful fallback message if the API fails (e.g., quota limit)
    if (error.message?.includes("API key")) return "Configuration Error: Invalid AI Key";
    return "AI Engine unavailable at the moment.";
  }
};
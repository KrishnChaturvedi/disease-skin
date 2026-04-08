import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

export const generateSkinReport = async (symptoms, mlResult) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert AI dermatology assistant named SkinShield.
      A patient has submitted a skin image and a symptom questionnaire.
      
      Patient Symptoms:
      - Age: ${symptoms.age}
      - Duration: ${symptoms.durationDays} days
      - Evolution (Has it changed?): ${symptoms.evolution}
      - Itching Level: ${symptoms.itchingLevel}
      - Physical Symptoms: ${symptoms.physicalSymptoms}
      - Sun Exposure: ${symptoms.sunExposure}
      - Family History of Skin Disease: ${symptoms.familyHistory}

      Machine Learning Image Analysis:
      - Detected Disease: ${mlResult.disease}
      - AI Confidence: ${mlResult.confidence}%

      Based on this data, generate a patient-friendly medical report. 
      WARNING: You are an AI assistant, not a doctor. Never state a confirmed diagnosis. Always use phrases like "The AI detected signs consistent with..."

      Return the report STRICTLY as a valid JSON object with exactly these 5 keys. Do not include markdown formatting like \`\`\`json.
      {
        "whatWasFound": "A 2-3 sentence plain English explanation of the ML result.",
        "clinicalContext": "A 2-3 sentence explanation of how their symptoms (like itching or sun exposure) align with this detection.",
        "actionPlan": "3-4 bullet points of actionable advice, prioritizing safety.",
        "questionsForDoctor": "Provide 3 highly specific questions the patient should ask a dermatologist during a telemedicine consult regarding this exact issue.",
        "preventionFocus": "1-2 sentences on how to protect the skin from similar issues in the future (e.g., specific sun protection or hygiene tips)."
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean markdown formatting to prevent JSON crash
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    // Safely parse the JSON
    try {
      return JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("JSON Parse Failed. Raw Gemini output:", cleanedText);
      throw new Error("Gemini returned invalid JSON format.");
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate AI report");
  }
};
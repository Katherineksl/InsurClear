import { GoogleGenAI, Type } from "@google/genai";
import { InsuranceAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeInsuranceDocument = async (
  base64Data: string,
  mimeType: string
): Promise<InsuranceAnalysis> => {
  
  const prompt = `
    You are an expert health insurance policy analyst designed to help ordinary people understand complex insurance documents.
    
    Please analyze the attached insurance document (which might be a policy PDF or an image of a page) and extract specific, easy-to-understand information.
    
    Identify the insurance company name if visible.
    
    Then, provide a detailed but plain-language breakdown for these three specific areas:
    
    1. **Coverage**: What exactly is covered? List key benefits, treatments, hospitalizations, or specific conditions mentioned.
    2. **Action Plan**: What should the insured do if they are suffering from a disease? Explain the steps for prior authorization, finding network providers, or starting a claim.
    3. **Reimbursement**: How much amount can they get reimbursed? Mention limits, percentages, deductibles, co-pays, or coverage caps.
    
    Also provide a very brief 1-sentence summary of the policy type.

    Return the response in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            companyName: { type: Type.STRING, description: "The name of the insurance company" },
            summary: { type: Type.STRING, description: "A one sentence summary of the policy" },
            coverage: { type: Type.STRING, description: "Detailed explanation of what is covered (markdown supported)" },
            actionSteps: { type: Type.STRING, description: "Steps to take if sick (markdown supported)" },
            reimbursement: { type: Type.STRING, description: "Financial details about reimbursement limits (markdown supported)" },
          },
          required: ["companyName", "coverage", "actionSteps", "reimbursement", "summary"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as InsuranceAnalysis;
    } else {
      throw new Error("No response text received from Gemini.");
    }
  } catch (error) {
    console.error("Error analyzing document:", error);
    throw error;
  }
};

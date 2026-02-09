
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getTaxAdvice = async (query: string, currentStatus: any) => {
  try {
    const ageLabel = currentStatus.age === 'below60' ? 'Below 60 (General)' : 
                     currentStatus.age === '60to80' ? '60-80 (Senior Citizen)' : 'Above 80 (Super Senior Citizen)';

    const prompt = `
      You are an expert Indian Advance Tax Consultant for FY 2025-26 (Assessment Year 2026-27).
      
      User Profile:
      - Age Category: ${ageLabel}
      - Gross Income: ₹${currentStatus.grossIncome.toLocaleString('en-IN')}
      - Taxable Income (New Regime): ₹${currentStatus.newRegime.taxableIncome.toLocaleString('en-IN')}
      - Total Tax (New Regime): ₹${currentStatus.newRegime.totalTax.toLocaleString('en-IN')}
      - Total Tax (Old Regime): ₹${currentStatus.oldRegime.totalTax.toLocaleString('en-IN')}

      User Query: ${query}

      Instructions:
      1. Focus on Advance Tax advice (installments due in Jun, Sep, Dec, Mar).
      2. Mention that Advance Tax applies if the total tax liability exceeds ₹10,000.
      3. For the "${ageLabel}" category, mention relevant benefits like 80TTB vs 80TTA.
      4. Highlight the full rebate up to ₹12 Lakhs in the New Tax Regime (default).
      5. Remind the user about the importance of timely payments to avoid interest under Section 234B and 234C.
      6. Use Markdown formatting with bold terms and bullet points.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "I'm having trouble connecting to my tax database. Please try again later.";
  }
};

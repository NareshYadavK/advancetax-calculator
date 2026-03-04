
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ComparisonResult } from '../types';
import { Bot, Send, Sparkles, Loader2 } from 'lucide-react';

interface TaxAssistantProps {
  data: ComparisonResult;
}

const TaxAssistant: React.FC<TaxAssistantProps> = ({ data }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeTax = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        As an Indian Tax Expert, analyze this tax calculation for FY 2025-26.
        User Data:
        - Old Regime Tax: ₹${data.oldRegime.totalTaxLiability}
        - New Regime Tax: ₹${data.newRegime.totalTaxLiability}
        - Best Choice: ${data.bestRegime} Regime
        - Savings: ₹${data.savings}
        - Taxable Income (Old): ₹${data.oldRegime.taxableIncome}
        
        Question: ${query || 'Give me 3 key tax saving tips based on my current data and tell me why I should pick ' + data.bestRegime + ' regime.'}
        
        Provide professional, concise advice including advance tax deadlines.
      `;

      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setResponse(result.text || 'Sorry, I could not generate advice at this time.');
    } catch (error) {
      console.error(error);
      setResponse('Failed to connect to AI assistant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 flex items-center gap-3">
        <Bot className="text-white w-6 h-6" />
        <h3 className="text-white font-bold">Tax Intelligence AI</h3>
      </div>
      
      <div className="p-4">
        {response && (
          <div className="mb-4 p-4 bg-emerald-50 rounded-lg text-sm text-slate-700 leading-relaxed border border-emerald-100 whitespace-pre-wrap">
            <div className="flex items-center gap-2 mb-2 text-emerald-700 font-semibold">
              <Sparkles className="w-4 h-4" />
              AI Recommendations
            </div>
            {response}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask AI about deductions, tax saving tips..."
            className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            onKeyDown={(e) => e.key === 'Enter' && analyzeTax()}
          />
          <button
            onClick={analyzeTax}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaxAssistant;

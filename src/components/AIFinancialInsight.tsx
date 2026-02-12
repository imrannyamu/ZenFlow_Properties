
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';

const AIFinancialInsight: React.FC = () => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateInsight = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "You are an expert Kenyan property management consultant. Based on these stats: Monthly Collection: KES 1.24M, Pending Rent: KES 85K, Occupancy: 94.2%. Give me a 2-sentence actionable financial strategy for this manager. Be professional and encouraging.",
      });
      setInsight(response.text || "Focus on converting the 5.8% vacancy by offering referral bonuses to existing tenants.");
    } catch (error) {
      console.error("AI Insight Error:", error);
      setInsight("Maintain steady collections and consider a 5% inflation adjustment for renewing leases to protect your margins.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-200 relative overflow-hidden group">
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
            <Sparkles size={20} className="text-emerald-100" />
          </div>
          <h3 className="text-xl font-bold">ZenFlow AI Insights</h3>
        </div>

        <div className="flex-1">
          {loading ? (
            <div className="flex items-center gap-3 text-emerald-100 py-4 italic">
              <Loader2 size={18} className="animate-spin" />
              <span>Analyzing portfolio trends...</span>
            </div>
          ) : insight ? (
            <p className="text-emerald-50 leading-relaxed font-medium animate-in fade-in slide-in-from-left-4 duration-500">
              "{insight}"
            </p>
          ) : (
            <p className="text-emerald-100/70 py-4">
              Get an AI-powered financial health check for your properties.
            </p>
          )}
        </div>

        <button 
          onClick={generateInsight}
          disabled={loading}
          className="mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-white text-emerald-700 font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg disabled:opacity-50"
        >
          {insight ? <RefreshCw size={18} /> : <Sparkles size={18} />}
          {insight ? "Regenerate Insight" : "Run AI Health Check"}
        </button>
      </div>
      
      {/* Decorative BG element */}
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
    </div>
  );
};

export default AIFinancialInsight;

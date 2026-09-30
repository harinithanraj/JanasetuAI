import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  RefreshCw, 
  FileText, 
  Building2, 
  MapPin, 
  Info,
  CheckCircle2,
  ShieldCheck,
  User,
  ArrowRight
} from 'lucide-react';

export const PolicyCopilot: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; time: string }>>([
    {
      role: 'assistant',
      text: `Namaste! I am the **JanSetu Policy Copilot**, powered by Gemini.
I provide explainable decision support grounded strictly in the loaded synthetic dataset of 112 Indian districts, citizen requests, infrastructure indicators, and capital expenditure pipelines.

Ask any analytical or comparative question below, or select a pre-built inquiry chip.`,
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const SUGGESTED_PROMPTS = [
    'Which districts have the highest unmet healthcare demand?',
    'Show me areas where citizen demand and infrastructure availability are most mismatched.',
    'Summarise the major infrastructure concerns in Tamil Nadu.',
    'Why was Dharmapuri marked as high priority?',
    'What are the top road-related demand clusters?',
    'Compare healthcare demand between Dharmapuri and Raichur.',
    'Generate a one-page briefing for Dharmapuri district.',
  ];

  const handleSend = async (queryText?: string) => {
    const q = queryText || input;
    if (!q.trim() || loading) return;

    setInput('');
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [...prev, { role: 'user', text: q, time: timeStr }]);
    setLoading(true);

    try {
      const res = await fetch('/api/policy-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.answer || "I don't have sufficient data to answer this.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Error connecting to Gemini Policy Copilot backend. Please try again.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Grounded AI Decision Support
            </span>
            <span className="text-xs text-slate-500">· Gemini 3.8 Flash</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            JanSetu Policy Copilot
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Synthesizes answers exclusively from the platform's verifiable synthetic demographic, 
            citizen voice, and infrastructure gap dataset. Strict anti-hallucination guardrails enforced.
          </p>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Restricted to Dataset Facts · Zero Fabrication</span>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Suggested Hackathon Analytical Queries:
        </span>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 rounded-lg text-xs text-slate-700 text-left transition-all shadow-sm flex items-center gap-1.5"
            >
              <span>{prompt}</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-amber-500 text-slate-950 font-bold text-xs'
                    : 'bg-blue-600 text-white shadow-sm'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-xl p-4 text-xs leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-none'
                    : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-200'
                }`}
              >
                <div className="whitespace-pre-line prose-xs">{msg.text}</div>
                <span
                  className={`text-[9px] mt-2 block ${
                    msg.role === 'user' ? 'text-slate-400 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-xs text-slate-500 italic bg-slate-50 p-3 rounded-lg w-fit border border-slate-200">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
              <span>Analyzing district indicators and cross-referencing Capex pipeline...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about infrastructure gaps, district rankings, or investment mismatches..."
            className="flex-1 px-4 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
            <span>Ask Copilot</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

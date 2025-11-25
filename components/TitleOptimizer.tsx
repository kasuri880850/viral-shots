import React, { useState } from 'react';
import { analyzeTitle } from '../services/gemini';
import { TitleAnalysis } from '../types';

const SuggestionRow: React.FC<{ suggestion: TitleAnalysis['viralSuggestions'][0]; index: number }> = ({ suggestion, index }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(suggestion.title);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 hover:bg-gray-800/30 transition-colors group">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            <h4 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors leading-snug">
              {index + 1}. {suggestion.title}
            </h4>
            <button
              onClick={handleCopy}
              className={`mt-1 p-1.5 rounded-lg transition-all ${
                copied 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'text-gray-500 hover:text-white hover:bg-gray-700'
              }`}
              aria-label={copied ? "Copied to clipboard" : `Copy title: ${suggestion.title}`}
              title="Copy to clipboard"
            >
              <i className={copied ? "fas fa-check" : "far fa-copy"}></i>
            </button>
          </div>
          <div className="flex flex-wrap gap-2 items-center text-sm text-gray-400 mt-2">
            <span className="px-2 py-0.5 bg-gray-700 rounded text-xs text-white">{suggestion.hookType}</span>
            <span className="hidden md:inline text-gray-600">•</span>
            <span>{suggestion.whyItWorks}</span>
          </div>
        </div>
        <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30 uppercase whitespace-nowrap self-start flex-shrink-0 mt-1">
          <i className="fas fa-eye mr-1" aria-hidden="true"></i> {suggestion.predictedViews}
        </span>
      </div>
    </div>
  );
};

const TitleOptimizer: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TitleAnalysis | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await analyzeTitle(input);
      setResult(data);
    } catch (err: any) {
      let errorMessage = 'Failed to analyze title. Please check your API key and try again.';
      if (err instanceof Error) {
        if (err.message.includes('API key')) {
          errorMessage = 'Invalid API Key. Please check your settings.';
        } else if (err.message.includes('429')) {
          errorMessage = 'Rate limit exceeded. Please wait a moment before retrying.';
        } else if (err.message.includes('Safety') || err.message.includes('blocked')) {
          errorMessage = 'The content was blocked by safety filters. Please try a different title.';
        } else {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Viral Title Optimizer</h2>
        <p className="text-gray-400">Craft titles that demand to be clicked.</p>
      </div>

      <div className="bg-yt-paper p-6 rounded-2xl border border-gray-700 shadow-2xl mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your draft title here (e.g. 'I made a giant cake')"
            className="flex-1 bg-black/50 border border-gray-600 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-lg placeholder-gray-600 transition-all"
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            aria-label="Enter your video title draft"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className={`px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 min-w-[160px] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Optimize title"
          >
            {loading ? <i className="fas fa-spinner fa-spin" aria-hidden="true"></i> : <><i className="fas fa-magic" aria-hidden="true"></i> OPTIMIZE</>}
          </button>
        </div>
        
        {error && (
          <div className="mt-6 p-4 bg-red-900/20 border border-red-500/50 rounded-xl flex flex-col items-center animate-fade-in" role="alert">
            <div className="flex items-center gap-2 text-red-400 font-bold mb-2">
               <i className="fas fa-exclamation-triangle"></i>
               <span>Analysis Failed</span>
            </div>
            <p className="text-gray-300 text-center mb-4 text-sm">{error}</p>
            <button
              onClick={handleAnalyze}
              className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-red-900/20"
            >
              <i className="fas fa-redo"></i> Retry
            </button>
          </div>
        )}
      </div>

      {loading && (
        <div className="animate-pulse space-y-6 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-40 bg-gray-800 rounded-2xl"></div>
                <div className="md:col-span-2 h-40 bg-gray-800 rounded-2xl"></div>
            </div>
            <div className="h-96 bg-gray-800 rounded-2xl"></div>
        </div>
      )}

      {result && !error && !loading && (
        <div className="animate-fade-in space-y-6">
          {/* Score Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-yt-paper p-6 rounded-2xl border border-gray-800 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"></div>
              <span className="text-gray-400 text-sm uppercase tracking-wider mb-2">Viral Score</span>
              <div className="relative">
                <svg className="w-32 h-32 transform -rotate-90" aria-hidden="true">
                  <circle cx="64" cy="64" r="60" stroke="#333" strokeWidth="8" fill="transparent" />
                  <circle cx="64" cy="64" r="60" stroke={result.score > 70 ? "#2BA640" : result.score > 40 ? "#F59E0B" : "#EF4444"} strokeWidth="8" fill="transparent" strokeDasharray={377} strokeDashoffset={377 - (377 * result.score) / 100} className="transition-all duration-1000 ease-out" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-4xl font-black text-white" aria-label={`Score: ${result.score} out of 100`}>
                  {result.score}
                </span>
              </div>
            </div>
            <div className="md:col-span-2 bg-yt-paper p-6 rounded-2xl border border-gray-800 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <i className="fas fa-stethoscope text-red-500" aria-hidden="true"></i> AI Critique
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">{result.critique}</p>
            </div>
          </div>

          {/* Suggestions */}
          <div className="bg-yt-paper rounded-2xl border border-gray-800 overflow-hidden">
             <div className="p-6 bg-gray-800/50 border-b border-gray-700">
                <h3 className="text-xl font-bold text-white">Viral Variations (Target: 1M+ Views)</h3>
             </div>
             <div className="divide-y divide-gray-800">
                {result.viralSuggestions.map((s, idx) => (
                  <SuggestionRow key={idx} suggestion={s} index={idx} />
                ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TitleOptimizer;

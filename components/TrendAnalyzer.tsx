import React, { useState } from 'react';
import { suggestTrendJacks } from '../services/gemini';
import { TrendJackResult } from '../types';

const TrendAnalyzer: React.FC = () => {
  const [trend, setTrend] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrendJackResult | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!trend.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await suggestTrendJacks(trend);
      setResult(data);
    } catch (err: any) {
      let errorMessage = 'Failed to analyze trend. Please try again.';
      if (err instanceof Error) {
        if (err.message.includes('API key')) {
          errorMessage = 'Invalid API Key. Please check your settings.';
        } else if (err.message.includes('429')) {
          errorMessage = 'Rate limit exceeded. Please wait a moment before retrying.';
        } else if (err.message.includes('Safety') || err.message.includes('blocked')) {
          errorMessage = 'The content was blocked by safety filters. Please try a different trend.';
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
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Viral Trend Jacker</h2>
        <p className="text-gray-400">Identify trending waves and surf them in your specific niche.</p>
      </div>

      <div className="bg-yt-paper p-6 rounded-2xl border border-gray-700 shadow-2xl mb-8 max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={trend}
            onChange={(e) => setTrend(e.target.value)}
            placeholder="Enter a current trend (e.g. 'NPC Stream', 'Grimace Shake')"
            className="flex-1 bg-black/50 border border-gray-600 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-lg placeholder-gray-600 transition-all"
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            aria-label="Enter trend name"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className={`px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/20 transition-all flex items-center justify-center gap-2 min-w-[160px] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Analyze Trend"
          >
            {loading ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-bolt"></i> ANALYZE</>}
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
        <div className="animate-pulse space-y-6 max-w-5xl mx-auto">
            <div className="h-40 bg-gray-800 rounded-2xl"></div>
            <div className="h-24 bg-gray-800 rounded-2xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-64 bg-gray-800 rounded-2xl"></div>
                ))}
            </div>
        </div>
      )}

      {result && !loading && !error && (
        <div className="animate-fade-in space-y-8 max-w-6xl mx-auto">
           {/* Top Stats */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-yt-paper p-6 rounded-2xl border border-gray-800 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent"></div>
                <span className="text-gray-400 text-sm uppercase tracking-wider mb-2">Viral Potential</span>
                <div className="relative">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="60" stroke="#333" strokeWidth="8" fill="transparent" />
                    <circle cx="64" cy="64" r="60" stroke={result.viralPotential > 70 ? "#A855F7" : "#F59E0B"} strokeWidth="8" fill="transparent" strokeDasharray={377} strokeDashoffset={377 - (377 * result.viralPotential) / 100} className="transition-all duration-1000 ease-out" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-4xl font-black text-white">
                    {result.viralPotential}
                  </span>
                </div>
              </div>

              <div className="md:col-span-2 bg-yt-paper p-6 rounded-2xl border border-gray-800 flex flex-col justify-center relative">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                    <i className="fas fa-fire text-6xl text-purple-500"></i>
                 </div>
                 <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <i className="fas fa-search-dollar text-purple-500"></i> Why It Is Trending
                 </h3>
                 <p className="text-gray-300 text-lg leading-relaxed">{result.whyItIsTrending}</p>
              </div>
           </div>

           {/* Trend Jacking Ideas */}
           <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                 <i className="fas fa-lightbulb text-yellow-400"></i> Niche Adaptations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {result.ideas.map((idea, idx) => (
                    <div key={idx} className="bg-yt-paper p-6 rounded-2xl border border-gray-800 hover:border-purple-500/50 transition-all group">
                       <div className="flex justify-between items-start mb-4">
                          <span className="px-3 py-1 bg-purple-900/30 text-purple-400 text-xs font-bold rounded-full border border-purple-500/30 uppercase">
                             {idea.niche}
                          </span>
                       </div>
                       <h4 className="text-lg font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">{idea.concept}</h4>
                       <div className="bg-black/30 p-4 rounded-xl border border-gray-800">
                          <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Proposed Hook</span>
                          <p className="text-gray-300 text-sm italic">"{idea.hook}"</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default TrendAnalyzer;
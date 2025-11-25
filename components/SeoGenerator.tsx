import React, { useState } from 'react';
import { generateSEO, generateShortsOutline } from '../services/gemini';
import { SEOResult, OutlineResult } from '../types';

const SeoGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SEOResult | null>(null);
  const [outline, setOutline] = useState<OutlineResult | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    setOutline(null);
    try {
      const [seoData, outlineData] = await Promise.all([
        generateSEO(topic),
        generateShortsOutline(topic)
      ]);
      setResult(seoData);
      setOutline(outlineData);
    } catch (err: any) {
      let errorMessage = 'Failed to generate content. Please try again.';
      if (err instanceof Error) {
        if (err.message.includes('API key')) {
          errorMessage = 'Invalid API Key. Please check your settings.';
        } else if (err.message.includes('429')) {
          errorMessage = 'Rate limit exceeded. Please wait a moment before retrying.';
        } else if (err.message.includes('Safety')) {
          errorMessage = 'Content flagged by safety filters.';
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const copyScript = () => {
    if (!outline) return;
    const scriptText = `Title: ${outline.title}\n\nHook: ${outline.hook}\n\nScript:\n${outline.sections.map(s => `[${s.timestamp}] ${s.narration} (Visual: ${s.visual})`).join('\n')}\n\nCTA: ${outline.callToAction}`;
    copyToClipboard(scriptText);
  };

  const handleUseRelatedTopic = (newTopic: string) => {
    setTopic(newTopic);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
       <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Full Stack SEO & Script Generator</h2>
        <p className="text-gray-400">Get keywords, tags, and a complete viral script in one click.</p>
      </div>

      <div className="bg-yt-paper p-6 rounded-2xl border border-gray-700 shadow-2xl mb-8 max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="What is your video about? (e.g. 'Minecraft speedrun tips')"
            className="flex-1 bg-black/50 border border-gray-600 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-lg placeholder-gray-600 transition-all"
             onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
             aria-label="Video topic"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-2 min-w-[180px] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Generate SEO and Script"
          >
            {loading ? <i className="fas fa-spinner fa-spin" aria-hidden="true"></i> : <><i className="fas fa-magic" aria-hidden="true"></i> GENERATE</>}
          </button>
        </div>
        
        {error && (
            <div className="mt-6 p-4 bg-red-900/20 border border-red-500/50 rounded-xl flex flex-col items-center animate-fade-in" role="alert">
                <div className="flex items-center gap-2 text-red-400 font-bold mb-2">
                <i className="fas fa-exclamation-triangle" aria-hidden="true"></i>
                <span>Generation Failed</span>
                </div>
                <p className="text-gray-300 text-center mb-4 text-sm">{error}</p>
                <button
                onClick={handleGenerate}
                className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-red-900/20"
                aria-label="Retry generation"
                >
                <i className="fas fa-redo" aria-hidden="true"></i> Retry
                </button>
            </div>
        )}
      </div>
      
      {loading && (
        <div className="animate-pulse space-y-8 mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="h-32 bg-gray-800 rounded-2xl"></div>
                    <div className="h-40 bg-gray-800 rounded-2xl"></div>
                    <div className="h-64 bg-gray-800 rounded-2xl"></div>
                </div>
                <div className="space-y-6">
                    <div className="h-40 bg-gray-800 rounded-2xl"></div>
                    <div className="h-40 bg-gray-800 rounded-2xl"></div>
                    <div className="h-64 bg-gray-800 rounded-2xl"></div>
                </div>
            </div>
            <div className="h-96 bg-gray-800 rounded-2xl"></div>
        </div>
      )}

      {result && !error && !loading && (
        <div className="animate-fade-in space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Title & Desc */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-yt-paper p-6 rounded-2xl border border-gray-800 relative group">
                    <h3 className="text-gray-400 text-sm font-bold uppercase mb-2">Optimized Title</h3>
                    <p className="text-2xl font-bold text-white">{result.videoTitle}</p>
                    <button onClick={() => copyToClipboard(result.videoTitle)} className="absolute top-4 right-4 text-gray-500 hover:text-white" aria-label="Copy title">
                    <i className="far fa-copy" aria-hidden="true"></i>
                    </button>
                </div>

                <div className="bg-yt-paper p-6 rounded-2xl border border-gray-800 relative group">
                    <h3 className="text-gray-400 text-sm font-bold uppercase mb-2">Description (Smart SEO)</h3>
                    <div className="bg-black/30 p-4 rounded-lg text-gray-300 whitespace-pre-wrap text-sm leading-relaxed border border-gray-700 font-mono">
                    {result.description}
                    </div>
                    <button onClick={() => copyToClipboard(result.description)} className="absolute top-4 right-4 text-gray-500 hover:text-white" aria-label="Copy description">
                    <i className="far fa-copy" aria-hidden="true"></i>
                    </button>
                </div>

                <div className="bg-yt-paper p-6 rounded-2xl border border-gray-800">
                    <h3 className="text-gray-400 text-sm font-bold uppercase mb-4">Keywords & Volume</h3>
                    <div className="overflow-x-auto">
                    <table className="w-full text-left" aria-label="Keywords table">
                        <thead>
                        <tr className="text-gray-500 text-xs border-b border-gray-700">
                            <th className="pb-2 font-bold">KEYWORD</th>
                            <th className="pb-2 font-bold">VOLUME</th>
                            <th className="pb-2 font-bold">COMPETITION</th>
                        </tr>
                        </thead>
                        <tbody className="text-sm">
                        {result.keywords.map((k, i) => (
                            <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                            <td className="py-3 text-white font-medium">{k.keyword}</td>
                            <td className="py-3">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold ${k.volume === 'High' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                {k.volume.toUpperCase()}
                                </span>
                            </td>
                            <td className="py-3">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold ${k.competition === 'Low' ? 'bg-green-500/20 text-green-400' : k.competition === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                {k.competition.toUpperCase()}
                                </span>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>

            {/* Right Column: Tags & Hashtags */}
            <div className="space-y-6">
                <div className="bg-yt-paper p-6 rounded-2xl border border-gray-800 relative">
                    <h3 className="text-gray-400 text-sm font-bold uppercase mb-4">Video Tags</h3>
                    <div className="flex flex-wrap gap-2">
                    {result.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm border border-gray-700">
                        {tag}
                        </span>
                    ))}
                    </div>
                    <button 
                    onClick={() => copyToClipboard(result.tags.join(','))}
                    className="mt-4 w-full py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-bold rounded-lg transition-colors"
                    aria-label="Copy all tags"
                    >
                    <i className="far fa-copy mr-2" aria-hidden="true"></i> Copy All Tags
                    </button>
                </div>

                <div className="bg-yt-paper p-6 rounded-2xl border border-gray-800 relative">
                    <h3 className="text-gray-400 text-sm font-bold uppercase mb-4">Trending Hashtags</h3>
                    <div className="flex flex-col gap-2">
                    {result.hashtags.map((tag, i) => (
                        <div key={i} className="flex items-center justify-between text-blue-400">
                        <span>{tag}</span>
                        <i className="fas fa-chart-line text-xs opacity-50" aria-hidden="true"></i>
                        </div>
                    ))}
                    </div>
                    <button 
                    onClick={() => copyToClipboard(result.hashtags.join(' '))}
                    className="mt-4 w-full py-2 bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 text-sm font-bold rounded-lg transition-colors border border-blue-900/50"
                    aria-label="Copy hashtags"
                    >
                    <i className="far fa-copy mr-2" aria-hidden="true"></i> Copy Hashtags
                    </button>
                </div>
                
                <div className="bg-gradient-to-br from-red-900/20 to-transparent p-6 rounded-2xl border border-red-900/30">
                    <h3 className="text-red-400 text-sm font-bold uppercase mb-2"><i className="fas fa-user-secret mr-2" aria-hidden="true"></i> Niche Strategy</h3>
                    <p className="text-gray-400 text-sm italic">"{result.nicheAdvice}"</p>
                </div>

                {/* Related Topics Section */}
                {result.relatedTopics && result.relatedTopics.length > 0 && (
                  <div className="bg-gradient-to-br from-yellow-900/20 to-transparent p-6 rounded-2xl border border-yellow-900/30">
                    <h3 className="text-yellow-400 text-sm font-bold uppercase mb-4">
                      <i className="fas fa-lightbulb mr-2"></i> Next Video Ideas
                    </h3>
                    <div className="space-y-4">
                      {result.relatedTopics.map((item, i) => (
                        <div 
                          key={i} 
                          onClick={() => handleUseRelatedTopic(item.topic)}
                          className="group cursor-pointer p-3 bg-black/40 rounded-lg border border-gray-700/50 hover:border-yellow-500/50 transition-all"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-white font-bold text-sm group-hover:text-yellow-400 transition-colors">{item.topic}</p>
                            <i className="fas fa-arrow-up-right-from-square text-[10px] text-gray-600 group-hover:text-yellow-500 opacity-0 group-hover:opacity-100 transition-all"></i>
                          </div>
                          <p className="text-xs text-gray-400 leading-snug">{item.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
            </div>

            {/* Script Outline Section */}
            {outline && (
                <div className="mt-8 bg-yt-paper p-6 rounded-2xl border border-purple-500/30 relative overflow-hidden animate-fade-in">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                            <i className="fas fa-scroll text-purple-400" aria-hidden="true"></i> AI Script Outline
                        </h3>
                        <div className="flex gap-3">
                             <span className="text-xs font-normal text-gray-400 border border-gray-700 px-2 py-1 rounded flex items-center">
                                <i className="far fa-clock mr-1" aria-hidden="true"></i> {outline.estimatedDuration}
                            </span>
                            <button 
                                onClick={copyScript}
                                className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1 rounded font-bold transition-colors"
                                aria-label="Copy full script"
                            >
                                <i className="fas fa-copy mr-1" aria-hidden="true"></i> Copy Script
                            </button>
                        </div>
                    </div>
                    
                    {/* Hook Section */}
                    <div className="bg-purple-900/20 p-5 rounded-xl border border-purple-500/20 mb-8">
                        <span className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-2 block">The Viral Hook (0-3s)</span>
                        <p className="text-white text-lg font-medium leading-relaxed">"{outline.hook}"</p>
                    </div>

                    {/* Script Timeline */}
                    <div className="space-y-6 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-800">
                        {outline.sections.map((section, idx) => (
                            <div key={idx} className="relative pl-12 group">
                                {/* Timestamp bubble */}
                                <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-gray-800 border-2 border-gray-700 group-hover:border-purple-500 transition-colors flex items-center justify-center text-[10px] text-gray-400 font-mono z-10 shadow-md">
                                    {section.timestamp.replace('0:',':')}
                                </div>
                                
                                <div className="bg-gray-800/40 hover:bg-gray-800/60 transition-colors p-5 rounded-xl border border-gray-700/50">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <span className="text-blue-400 text-xs uppercase font-bold mb-2 block tracking-wide"><i className="fas fa-video mr-1" aria-hidden="true"></i> Visual Direction</span>
                                            <p className="text-gray-300 text-sm leading-relaxed">{section.visual}</p>
                                        </div>
                                        <div>
                                            <span className="text-green-400 text-xs uppercase font-bold mb-2 block tracking-wide"><i className="fas fa-microphone mr-1" aria-hidden="true"></i> Audio / Narration</span>
                                            <p className="text-white text-sm italic leading-relaxed">"{section.narration}"</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-8 p-5 bg-gradient-to-r from-green-900/20 to-transparent border-l-4 border-green-500 rounded-r-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <span className="text-green-400 text-xs font-bold uppercase tracking-wider block mb-1">Call To Action</span>
                            <p className="text-green-100 font-medium">"{outline.callToAction}"</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default SeoGenerator;

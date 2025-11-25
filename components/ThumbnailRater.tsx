import React, { useState, useRef } from 'react';
import { analyzeThumbnail } from '../services/gemini';
import { ThumbnailAnalysis } from '../types';

const ThumbnailRater: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ThumbnailAnalysis | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysis(null); // Reset previous analysis
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setError('');
    try {
      const data = await analyzeThumbnail(image);
      setAnalysis(data);
    } catch (err: any) {
      let errorMessage = 'Analysis failed. Ensure the image is valid and try again.';
      if (err instanceof Error) {
        if (err.message.includes('API key')) {
            errorMessage = 'Invalid API Key. Please check your settings.';
        } else if (err.message.includes('429')) {
            errorMessage = 'Rate limit exceeded. Please wait a moment before retrying.';
        } else if (err.message.includes('Safety')) {
            errorMessage = 'Image flagged by safety filters.';
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
    <div className="max-w-5xl mx-auto p-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">AI Thumbnail Rater</h2>
        <p className="text-gray-400">Optimize your visual hook for maximum Click-Through Rate.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="flex flex-col gap-6">
          <div 
            className="bg-yt-paper border-2 border-dashed border-gray-700 rounded-2xl aspect-[9/16] lg:aspect-square flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-gray-500 transition-colors"
            onClick={() => !loading && fileInputRef.current?.click()}
          >
            {loading && (
                <div className="absolute inset-0 bg-black/80 z-20 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-green-400 font-bold animate-pulse">Analyzing Visuals...</p>
                </div>
            )}
            {image ? (
              <img src={image} alt="Thumbnail Preview" className="w-full h-full object-contain z-10" />
            ) : (
              <div className="text-center p-8">
                <i className="fas fa-cloud-upload-alt text-5xl text-gray-600 mb-4 group-hover:text-white transition-colors"></i>
                <p className="text-gray-400 font-medium">Click to upload image</p>
                <p className="text-xs text-gray-600 mt-2">Supports JPG, PNG, WEBP</p>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileChange} 
            />
            {image && !loading && (
              <div className="absolute bottom-4 right-4 z-20">
                <button 
                  onClick={(e) => { e.stopPropagation(); setImage(null); setAnalysis(null); setError(''); }}
                  className="p-2 bg-black/70 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            )}
          </div>
          
          <button
            onClick={handleAnalyze}
            disabled={!image || loading}
            className={`w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg shadow-green-900/20 transition-all flex items-center justify-center gap-2 ${(!image || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-search"></i> ANALYZE THUMBNAIL</>}
          </button>
          
          {error && (
            <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl flex flex-col items-center animate-fade-in" role="alert">
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

        {/* Results Section */}
        <div className="flex flex-col gap-6">
           {!analysis && !loading && !error && (
             <div className="flex-1 bg-yt-paper rounded-2xl border border-gray-800 p-8 flex flex-col items-center justify-center text-center opacity-50">
                <i className="fas fa-chart-pie text-6xl text-gray-700 mb-4"></i>
                <h3 className="text-xl font-bold text-white">No Analysis Yet</h3>
                <p className="text-gray-500">Upload an image and hit analyze to see AI insights.</p>
             </div>
           )}

            {loading && (
                <div className="flex-1 space-y-6 animate-pulse">
                    <div className="h-32 bg-gray-800 rounded-2xl"></div>
                    <div className="h-48 bg-gray-800 rounded-2xl"></div>
                    <div className="h-40 bg-gray-800 rounded-2xl"></div>
                </div>
            )}

           {analysis && !error && !loading && (
             <div className="flex flex-col gap-6 animate-fade-in">
                {/* Score */}
                <div className="bg-yt-paper p-6 rounded-2xl border border-gray-800 flex items-center justify-between">
                   <div>
                      <h3 className="text-xl font-bold text-white">CTR Potential</h3>
                      <p className="text-sm text-gray-400">Based on visual hierarchy & emotion</p>
                   </div>
                   <div className={`text-5xl font-black ${analysis.score >= 80 ? 'text-green-500' : analysis.score >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                      {analysis.score}/100
                   </div>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="bg-yt-paper p-6 rounded-2xl border border-gray-800">
                   <h4 className="font-bold text-white mb-4 border-b border-gray-700 pb-2">Key Findings</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-green-400 text-sm font-bold uppercase mb-2"><i className="fas fa-check-circle mr-1"></i> Strengths</h5>
                        <ul className="text-sm text-gray-300 space-y-1">
                          {analysis.strengths.map((s, i) => <li key={i}>• {s}</li>)}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-red-400 text-sm font-bold uppercase mb-2"><i className="fas fa-exclamation-circle mr-1"></i> Weaknesses</h5>
                        <ul className="text-sm text-gray-300 space-y-1">
                          {analysis.weaknesses.map((w, i) => <li key={i}>• {w}</li>)}
                        </ul>
                      </div>
                   </div>
                </div>

                {/* Emotional Impact & Palette */}
                <div className="bg-yt-paper p-6 rounded-2xl border border-gray-800">
                    <h4 className="font-bold text-white mb-2">Emotional Hook</h4>
                    <p className="text-gray-300 mb-4">{analysis.emotionalImpact}</p>
                    
                    <h4 className="font-bold text-white mb-2">Suggested Palette</h4>
                    <div className="flex gap-2 flex-wrap">
                      {analysis.colorPaletteSuggestion.map((color, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                           <div className="w-10 h-10 rounded-full border border-gray-600" style={{ backgroundColor: color.startsWith('#') ? color : '#555' }}></div>
                           <span className="text-[10px] text-gray-500 uppercase">{color}</span>
                        </div>
                      ))}
                    </div>
                </div>

                {/* Final Advice */}
                <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-6 rounded-2xl border border-blue-800/50">
                   <h4 className="font-bold text-blue-200 mb-2"><i className="fas fa-lightbulb mr-2"></i> Pro Tip for 1M Views</h4>
                   <p className="text-blue-100 text-sm leading-relaxed">{analysis.improvements}</p>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ThumbnailRater;

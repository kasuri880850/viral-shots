import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import TitleOptimizer from './components/TitleOptimizer';
import ThumbnailRater from './components/ThumbnailRater';
import SeoGenerator from './components/SeoGenerator';
import TrendAnalyzer from './components/TrendAnalyzer';
import { AppView } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);

  const renderView = () => {
    switch (currentView) {
      case AppView.TITLE_OPTIMIZER:
        return <TitleOptimizer />;
      case AppView.THUMBNAIL_RATER:
        return <ThumbnailRater />;
      case AppView.SEO_GENERATOR:
        return <SeoGenerator />;
      case AppView.TREND_ANALYZER:
        return <TrendAnalyzer />;
      case AppView.DASHBOARD:
      default:
        return <Dashboard onChangeView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-yt-dark flex flex-col">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-yt-dark/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div 
              className="flex items-center gap-2 cursor-pointer group" 
              onClick={() => setCurrentView(AppView.DASHBOARD)}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                 <i className="fas fa-play text-xs"></i>
              </div>
              <span className="font-bold text-xl tracking-tight text-white group-hover:text-gray-300 transition-colors">
                Viral<span className="text-red-500">Shorts</span>
              </span>
            </div>
            
            <div className="flex items-center gap-4">
               {currentView !== AppView.DASHBOARD && (
                 <button 
                   onClick={() => setCurrentView(AppView.DASHBOARD)}
                   className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
                 >
                   <i className="fas fa-arrow-left mr-2"></i> Back to Dashboard
                 </button>
               )}
               <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-full text-xs font-mono text-gray-400 border border-gray-700">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  API CONNECTED
               </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden">
         {/* Background Effects */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-900/10 blur-[120px] pointer-events-none rounded-full"></div>
         
         <div className="relative z-10">
           {renderView()}
         </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-auto py-8 text-center text-gray-600 text-sm">
        <p>© {new Date().getFullYear()} ViralShorts AI. Powered by Gemini 2.5 Flash.</p>
        <div className="flex justify-center gap-4 mt-2">
           <span className="hover:text-gray-400 cursor-pointer">Privacy</span>
           <span className="hover:text-gray-400 cursor-pointer">Terms</span>
           <span className="hover:text-gray-400 cursor-pointer">VidIQ Sync (Simulated)</span>
        </div>
      </footer>
    </div>
  );
};

export default App;

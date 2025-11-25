import React from 'react';
import { AppView } from '../types';

interface DashboardProps {
  onChangeView: (view: AppView) => void;
}

const DashboardCard: React.FC<{
  title: string;
  description: string;
  icon: string;
  color: string;
  onClick: () => void;
}> = ({ title, description, icon, color, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-yt-paper hover:bg-gray-700 transition-all duration-300 cursor-pointer rounded-2xl p-8 border border-gray-800 hover:border-gray-600 group flex flex-col items-start gap-4 relative overflow-hidden h-full"
  >
    <div className={`absolute -right-10 -top-10 w-32 h-32 bg-${color}-500 opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity`}></div>
    <div className={`p-4 rounded-full bg-gray-800 text-${color}-500 text-2xl group-hover:scale-110 transition-transform`}>
      <i className={`fas ${icon}`}></i>
    </div>
    <div>
      <h3 className="text-2xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
    <div className={`mt-auto pt-4 flex items-center gap-2 text-${color}-400 font-semibold text-sm group-hover:gap-3 transition-all`}>
      LAUNCH TOOL <i className="fas fa-arrow-right"></i>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ onChangeView }) => {
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="text-center mb-16 mt-8">
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 mb-6 tracking-tight">
          VIRAL<span className="text-red-500">SHORTS</span> AI
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Dominate the YouTube algorithm with AI-powered precision. 
          Optimize titles, analyze thumbnails, and generate viral SEO in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard
          title="Viral Title Optimizer"
          description="Turn boring titles into 1M+ view magnets. Get scores, emotional hooks, and MrBeast-style variations instantly."
          icon="fa-heading"
          color="blue"
          onClick={() => onChangeView(AppView.TITLE_OPTIMIZER)}
        />
        <DashboardCard
          title="Thumbnail Rater"
          description="Upload your thumbnail. Get AI feedback on colors, faces, and composition to maximize your Click-Through Rate (CTR)."
          icon="fa-image"
          color="green"
          onClick={() => onChangeView(AppView.THUMBNAIL_RATER)}
        />
        <DashboardCard
          title="Full Stack SEO"
          description="Generate VidIQ-grade tags, descriptions, and hashtags. Uncover low-competition keywords for your niche."
          icon="fa-rocket"
          color="red"
          onClick={() => onChangeView(AppView.SEO_GENERATOR)}
        />
        <DashboardCard
          title="Trend Jacking Analyst"
          description="Input a current trend (e.g. 'Skibidi Toilet'). Get specific video ideas for your niche to ride the viral wave."
          icon="fa-bolt"
          color="purple"
          onClick={() => onChangeView(AppView.TREND_ANALYZER)}
        />
      </div>

      <div className="mt-20 p-8 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-500/20 rounded-full text-red-500">
            <i className="fas fa-fire text-2xl"></i>
          </div>
          <div>
            <h4 className="text-xl font-bold text-white">Algorithm Insights</h4>
            <p className="text-sm text-gray-400">Simulated real-time data analysis based on current viral trends.</p>
          </div>
        </div>
        <div className="flex gap-4">
            <div className="text-center">
                <span className="block text-2xl font-bold text-white">1M+</span>
                <span className="text-xs text-gray-500 uppercase">Target Views</span>
            </div>
            <div className="w-px bg-gray-700 h-10"></div>
            <div className="text-center">
                <span className="block text-2xl font-bold text-green-400">High</span>
                <span className="text-xs text-gray-500 uppercase">Retention Focus</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

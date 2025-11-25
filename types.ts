
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  TITLE_OPTIMIZER = 'TITLE_OPTIMIZER',
  THUMBNAIL_RATER = 'THUMBNAIL_RATER',
  SEO_GENERATOR = 'SEO_GENERATOR',
  TREND_ANALYZER = 'TREND_ANALYZER'
}

export interface TitleAnalysis {
  originalTitle: string;
  score: number;
  critique: string;
  viralSuggestions: Array<{
    title: string;
    predictedViews: string;
    hookType: string; // e.g., "Curiosity", "Urgency", "Shock"
    whyItWorks: string;
  }>;
}

export interface ThumbnailAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  colorPaletteSuggestion: string[];
  emotionalImpact: string;
  improvements: string;
}

export interface SEOResult {
  videoTitle: string;
  description: string;
  tags: string[];
  hashtags: string[];
  keywords: Array<{ keyword: string; volume: string; competition: string }>;
  nicheAdvice: string;
  relatedTopics: Array<{ topic: string; reason: string }>;
}

export interface OutlineResult {
  title: string;
  hook: string;
  sections: Array<{
    timestamp: string;
    narration: string;
    visual: string;
  }>;
  callToAction: string;
  estimatedDuration: string;
}

export interface TrendJackResult {
  trend: string;
  viralPotential: number;
  whyItIsTrending: string;
  ideas: Array<{
    niche: string;
    concept: string;
    hook: string;
  }>;
}

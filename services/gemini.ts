
import { GoogleGenAI, Type } from "@google/genai";
import { TitleAnalysis, ThumbnailAnalysis, SEOResult, OutlineResult, TrendJackResult } from '../types';

// Initialize Gemini Client
// Note: In a real deployment, ensure process.env.API_KEY is set.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes a YouTube Shorts title and provides viral alternatives.
 */
export const analyzeTitle = async (title: string): Promise<TitleAnalysis> => {
  const prompt = `
    Act as a world-class YouTube Shorts algorithm expert and viral strategist (like MrBeast's producer).
    Analyze the following video title: "${title}".
    
    Provide a strict JSON response with:
    1. A viral score (0-100).
    2. A 1-sentence critique.
    3. 5 Viral alternative titles targeting 1 Million+ views. For each, specify the "hookType" (Curiosity, Urgency, Relatability, etc.) and "predictedViews" (e.g. "1.2M").
    
    The goal is High CTR and Instant Appeal.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          originalTitle: { type: Type.STRING },
          score: { type: Type.NUMBER },
          critique: { type: Type.STRING },
          viralSuggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                predictedViews: { type: Type.STRING },
                hookType: { type: Type.STRING },
                whyItWorks: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });

  if (!response.text) throw new Error("No response from Gemini");
  return JSON.parse(response.text) as TitleAnalysis;
};

/**
 * Analyzes a thumbnail image for composition, color, and clickability.
 */
export const analyzeThumbnail = async (base64Image: string): Promise<ThumbnailAnalysis> => {
  // Remove header if present
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

  const prompt = `
    You are a YouTube Thumbnail expert. Analyze this image for a Shorts thumbnail.
    Focus on:
    1. Focal point clarity (Is it obvious on a small screen?).
    2. Color contrast and saturation.
    3. Emotional expression/hook.
    
    Provide a JSON response scoring it and giving actionable advice to reach 1M views.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/png', // Assuming png/jpeg, Gemini handles standard types
            data: cleanBase64
          }
        },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          colorPaletteSuggestion: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Hex codes or color names" },
          emotionalImpact: { type: Type.STRING },
          improvements: { type: Type.STRING }
        }
      }
    }
  });

  if (!response.text) throw new Error("No response from Gemini");
  return JSON.parse(response.text) as ThumbnailAnalysis;
};

/**
 * Generates full SEO metadata (Keywords, Description, Tags).
 */
export const generateSEO = async (topic: string): Promise<SEOResult> => {
  const prompt = `
    Act as a top-tier SEO tool (like VidIQ or TubeBuddy) for YouTube Shorts.
    The video topic is: "${topic}".
    
    Generate a JSON response with:
    1. A perfect SEO-optimized Title.
    2. A compelling, keyword-rich Description (first 2 lines crucial).
    3. 15 highly relevant Tags (comma separated).
    4. 5 trending Hashtags.
    5. 5 Keyword phrases with estimated Search Volume (High/Med) and Competition (Low/Med/High).
    6. Specific advice for this niche to go viral.
    7. 3 Related trending video topic ideas that capitalize on the keywords identified, with a brief reason.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          videoTitle: { type: Type.STRING },
          description: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          keywords: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                keyword: { type: Type.STRING },
                volume: { type: Type.STRING },
                competition: { type: Type.STRING }
              }
            }
          },
          nicheAdvice: { type: Type.STRING },
          relatedTopics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                topic: { type: Type.STRING },
                reason: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });

  if (!response.text) throw new Error("No response from Gemini");
  return JSON.parse(response.text) as SEOResult;
};

/**
 * Generates a 60s Shorts script outline.
 */
export const generateShortsOutline = async (topic: string): Promise<OutlineResult> => {
  const prompt = `
    Act as a professional YouTube Shorts scriptwriter.
    Create a viral 60-second video outline for the topic: "${topic}".

    Provide a JSON response with:
    1. A catchy Title.
    2. The strong visual/audio Hook (0-3s).
    3. A list of sections (timestamp, narration/script, visual description).
    4. A strong Call to Action (CTA).
    5. Estimated total duration.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          hook: { type: Type.STRING },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                timestamp: { type: Type.STRING },
                narration: { type: Type.STRING },
                visual: { type: Type.STRING }
              }
            }
          },
          callToAction: { type: Type.STRING },
          estimatedDuration: { type: Type.STRING }
        }
      }
    }
  });

  if (!response.text) throw new Error("No response from Gemini");
  return JSON.parse(response.text) as OutlineResult;
};

/**
 * Suggests how to apply a current trend to different niches.
 */
export const suggestTrendJacks = async (currentTrend: string): Promise<TrendJackResult> => {
  const prompt = `
    Act as a viral trend analyst.
    The current trend is: "${currentTrend}".
    
    Provide a JSON response with:
    1. Analysis of why it's trending.
    2. A viral potential score (0-100).
    3. 5 unique video ideas (Trend Jacking) for different niches (e.g., Gaming, Tech, Lifestyle, Cooking, Education) applying this trend.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          trend: { type: Type.STRING },
          viralPotential: { type: Type.NUMBER },
          whyItIsTrending: { type: Type.STRING },
          ideas: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                niche: { type: Type.STRING },
                concept: { type: Type.STRING },
                hook: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });

  if (!response.text) throw new Error("No response from Gemini");
  return JSON.parse(response.text) as TrendJackResult;
};

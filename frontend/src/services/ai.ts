import { apiService } from './api';
import { AIRequest, AIResponse } from '@/types';

export interface GenerateContentRequest {
  type: 'article' | 'post' | 'page' | 'social' | 'email' | 'ad';
  prompt: string;
  context?: {
    targetAudience?: string;
    tone?: string;
    keywords?: string[];
    length?: 'short' | 'medium' | 'long';
    language?: string;
  };
  options?: {
    includeHeadings?: boolean;
    includeImages?: boolean;
    includeLinks?: boolean;
  };
}

export interface OptimizeContentRequest {
  content: string;
  target: 'seo' | 'readability' | 'engagement' | 'conversion';
  keywords?: string[];
  competitors?: string[];
}

export interface AnalyzeContentRequest {
  content: string;
  analysisType: 'sentiment' | 'readability' | 'seo' | 'engagement' | 'plagiarism' | 'comprehensive';
}

export interface TranslateContentRequest {
  content: string;
  targetLanguage: string;
  sourceLanguage?: string;
  preserveFormatting?: boolean;
  tone?: 'professional' | 'casual' | 'formal' | 'creative';
}

export class AIService {
  // Content generation
  async generateContent(request: GenerateContentRequest): Promise<{
    title: string;
    content: string;
    excerpt: string;
    keywords: string[];
    suggestions: string[];
    metadata: {
      wordCount: number;
      readingTime: number;
      confidence: number;
    };
  }> {
    return await apiService.post('/ai/generate', request);
  }

  async generateTitle(content: string, type: 'article' | 'post' | 'page' = 'article'): Promise<string> {
    return await apiService.post('/ai/generate/title', { content, type });
  }

  async generateExcerpt(content: string, maxLength: number = 160): Promise<string> {
    return await apiService.post('/ai/generate/excerpt', { content, maxLength });
  }

  async generateTags(content: string, count: number = 10): Promise<string[]> {
    return await apiService.post('/ai/generate/tags', { content, count });
  }

  async generateMetaDescription(content: string): Promise<string> {
    return await apiService.post('/ai/generate/meta-description', { content });
  }

  // Content optimization
  async optimizeContent(request: OptimizeContentRequest): Promise<{
    optimizedContent: string;
    improvements: Array<{
      type: 'seo' | 'readability' | 'engagement';
      original: string;
      improved: string;
      explanation: string;
    }>;
    score: {
      seo: number;
      readability: number;
      engagement: number;
      overall: number;
    };
    suggestions: string[];
  }> {
    return await apiService.post('/ai/optimize', request);
  }

  async improveSEO(content: string, targetKeywords: string[]): Promise<{
    optimizedContent: string;
    keywordDensity: Record<string, number>;
    suggestions: string[];
  }> {
    return await apiService.post('/ai/optimize/seo', { content, targetKeywords });
  }

  async improveReadability(content: string, targetGrade: number = 8): Promise<{
    optimizedContent: string;
    readabilityScore: number;
    changes: Array<{
      type: 'sentence' | 'word' | 'paragraph';
      original: string;
      improved: string;
      reason: string;
    }>;
  }> {
    return await apiService.post('/ai/optimize/readability', { content, targetGrade });
  }

  // Content analysis
  async analyzeContent(request: AnalyzeContentRequest): Promise<{
    sentiment: {
      score: number;
      label: 'positive' | 'negative' | 'neutral';
      confidence: number;
    };
    readability: {
      score: number;
      grade: number;
      level: string;
      metrics: {
        fleschReadingEase: number;
        fleschKincaidGrade: number;
        avgSentenceLength: number;
        avgWordsPerSentence: number;
      };
    };
    seo: {
      score: number;
      keywordDensity: Record<string, number>;
      readability: number;
      headings: {
        h1: number;
        h2: number;
        h3: number;
        h4: number;
        h5: number;
        h6: number;
      };
      metaData: {
        hasTitle: boolean;
        hasDescription: boolean;
        hasKeywords: boolean;
      };
    };
    engagement: {
      score: number;
      factors: {
        callToActions: number;
        questions: number;
        emotionalWords: number;
        storytellingElements: number;
      };
    };
    statistics: {
      wordCount: number;
      characterCount: number;
      sentenceCount: number;
      paragraphCount: number;
      uniqueWords: number;
      complexWords: number;
    };
  }> {
    return await apiService.post('/ai/analyze', request);
  }

  async checkPlagiarism(content: string): Promise<{
    isOriginal: boolean;
    plagiarismScore: number;
    sources: Array<{
      url: string;
      similarity: number;
      matchingText: string;
    }>;
    suggestions: string[];
  }> {
    return await apiService.post('/ai/analyze/plagiarism', { content });
  }

  // Content translation
  async translateContent(request: TranslateContentRequest): Promise<{
    translatedContent: string;
    detectedLanguage: string;
    confidence: number;
    quality: {
      accuracy: number;
      fluency: number;
      adequacy: number;
    };
    suggestions: string[];
  }> {
    return await apiService.post('/ai/translate', request);
  }

  async translateMultiple(content: string, targetLanguages: string[]): Promise<Record<string, {
    content: string;
    confidence: number;
  }>> {
    return await apiService.post('/ai/translate/batch', { content, targetLanguages });
  }

  // Image analysis
  async analyzeImage(file: File): Promise<{
    description: string;
    tags: string[];
    colors: string[];
    objects: Array<{
      name: string;
      confidence: number;
      boundingBox: { x: number; y: number; width: number; height: number };
    }>;
    text?: string;
    sentiment: 'positive' | 'negative' | 'neutral';
  }> {
    const formData = new FormData();
    formData.append('image', file);

    return await apiService.post('/ai/analyze/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async generateImageAlt(file: File, context?: string): Promise<{
    altText: string;
    description: string;
    confidence: number;
  }> {
    const formData = new FormData();
    formData.append('image', file);
    if (context) {
      formData.append('context', context);
    }

    return await apiService.post('/ai/generate/alt-text', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  // Content recommendations
  async getContentSuggestions(content: string): Promise<{
    relatedTopics: string[];
    similarContent: Array<{
      title: string;
      url: string;
      relevance: number;
    }>;
    improvements: string[];
    keywords: string[];
  }> {
    return await apiService.post('/ai/recommend', { content });
  }

  async getOptimalPostingTime(platform: 'blog' | 'social' | 'email', timezone: string = 'UTC'): Promise<{
    recommendedTimes: Array<{
      day: string;
      time: string;
      score: number;
      reason: string;
    }>;
    audienceActivity: {
      peak: string;
      low: string;
      bestDays: string[];
    };
  }> {
    return await apiService.post('/ai/optimize/posting-time', { platform, timezone });
  }

  // Bulk operations
  async batchOptimize(requests: OptimizeContentRequest[]): Promise<Array<{
    original: string;
    optimized: string;
    improvements: any;
    score: number;
  }>> {
    return await apiService.post('/ai/optimize/batch', { requests });
  }

  async batchAnalyze(requests: AnalyzeContentRequest[]): Promise<Array<{
    content: string;
    analysis: any;
  }>> {
    return await apiService.post('/ai/analyze/batch', { requests });
  }

  // AI Models management
  async getAvailableModels(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    capabilities: string[];
    pricing: {
      input: number;
      output: number;
    };
  }>> {
    return await apiService.get('/ai/models');
  }

  async setDefaultModel(modelId: string): Promise<void> {
    await apiService.post('/ai/models/default', { modelId });
  }

  // AI Usage tracking
  async getUsageStats(period: 'day' | 'week' | 'month' = 'month'): Promise<{
    totalRequests: number;
    tokensUsed: number;
    cost: number;
    breakdown: {
      generate: number;
      optimize: number;
      analyze: number;
      translate: number;
    };
    dailyUsage: Array<{
      date: string;
      requests: number;
      tokens: number;
      cost: number;
    }>;
  }> {
    return await apiService.get(`/ai/usage?period=${period}`);
  }
}

export const aiService = new AIService();
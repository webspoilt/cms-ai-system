import { apiService } from './api';
import { DashboardMetrics } from '@/types';

export interface AnalyticsFilters {
  dateFrom?: string;
  dateTo?: string;
  period?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  contentIds?: string[];
  categoryIds?: string[];
  authorIds?: string[];
  source?: 'organic' | 'direct' | 'social' | 'referral' | 'email';
}

export interface AnalyticsData {
  overview: {
    totalViews: number;
    uniqueVisitors: number;
    bounceRate: number;
    avgSessionDuration: number;
    pageViews: number;
    newVisitors: number;
    returningVisitors: number;
  };
  content: {
    topContent: Array<{
      id: string;
      title: string;
      views: number;
      uniqueViews: number;
      avgTimeOnPage: number;
      bounceRate: number;
    }>;
    contentByStatus: {
      published: number;
      draft: number;
      archived: number;
    };
    contentByType: Record<string, number>;
  };
  audience: {
    demographics: {
      age: Record<string, number>;
      gender: Record<string, number>;
      interests: Array<{ category: string; percentage: number }>;
    };
    geography: Array<{
      country: string;
      visitors: number;
      percentage: number;
    }>;
    devices: Record<string, number>;
    browsers: Record<string, number>;
  };
  traffic: {
    sources: Record<string, number>;
    referrals: Array<{
      source: string;
      visitors: number;
      pages: number;
      bounceRate: number;
    }>;
    campaigns: Array<{
      name: string;
      visitors: number;
      conversions: number;
      revenue: number;
    }>;
  };
  engagement: {
    dailyEngagement: Array<{
      date: string;
      pageViews: number;
      uniqueVisitors: number;
      avgSessionDuration: number;
    }>;
    hourlyActivity: Array<{
      hour: number;
      visitors: number;
    }>;
    conversionFunnel: Array<{
      step: string;
      visitors: number;
      conversionRate: number;
    }>;
  };
  performance: {
    pageSpeed: {
      avgLoadTime: number;
      avgFirstContentfulPaint: number;
      avgLargestContentfulPaint: number;
      avgCumulativeLayoutShift: number;
    };
    uptime: {
      percentage: number;
      incidents: Array<{
        start: Date;
        end: Date;
        duration: number;
        reason: string;
      }>;
    };
  };
}

export class AnalyticsService {
  // Dashboard metrics
  async getDashboardMetrics(period: '7d' | '30d' | '90d' = '30d'): Promise<DashboardMetrics> {
    return await apiService.get(`/analytics/dashboard?period=${period}`);
  }

  async getOverviewMetrics(filters?: AnalyticsFilters): Promise<AnalyticsData['overview']> {
    const params = filters ? new URLSearchParams(filters as any).toString() : '';
    return await apiService.get(`/analytics/overview?${params}`);
  }

  // Content analytics
  async getContentAnalytics(contentId: string, filters?: AnalyticsFilters): Promise<{
    views: number;
    uniqueViews: number;
    avgTimeOnPage: number;
    bounceRate: number;
    exitRate: number;
    conversions: number;
    dailyViews: Array<{ date: string; views: number; uniqueViews: number }>;
    trafficSources: Record<string, number>;
    audience: {
      demographics: Record<string, number>;
      geography: Array<{ country: string; views: number }>;
      devices: Record<string, number>;
    };
    engagement: {
      scrollDepth: Array<{ percentage: number; users: number }>;
      clickMap: Array<{ element: string; clicks: number }>;
    };
  }> {
    const params = filters ? new URLSearchParams(filters as any).toString() : '';
    return await apiService.get(`/analytics/content/${contentId}?${params}`);
  }

  async getTopContent(filters?: AnalyticsFilters & { limit?: number }): Promise<Array<{
    id: string;
    title: string;
    type: string;
    author: string;
    publishedAt: Date;
    views: number;
    uniqueViews: number;
    avgTimeOnPage: number;
    bounceRate: number;
    engagement: number;
  }>> {
    const params = new URLSearchParams(filters as any).toString();
    return await apiService.get(`/analytics/top-content?${params}`);
  }

  // Audience analytics
  async getAudienceAnalytics(filters?: AnalyticsFilters): Promise<AnalyticsData['audience']> {
    const params = filters ? new URLSearchParams(filters as any).toString() : '';
    return await apiService.get(`/analytics/audience?${params}`);
  }

  async getUserBehavior(filters?: AnalyticsFilters): Promise<{
    sessionDuration: {
      average: number;
      distribution: Array<{ range: string; percentage: number }>;
    };
    pagesPerSession: {
      average: number;
      distribution: Array<{ range: string; percentage: number }>;
    };
    bounceRate: {
      overall: number;
      bySource: Record<string, number>;
      byDevice: Record<string, number>;
    };
    exitPages: Array<{
      page: string;
      exits: number;
      exitRate: number;
    }>;
    mostVisitedPages: Array<{
      page: string;
      views: number;
      uniqueViews: number;
      avgTimeOnPage: number;
    }>;
  }> {
    const params = filters ? new URLSearchParams(filters as any).toString() : '';
    return await apiService.get(`/analytics/behavior?${params}`);
  }

  // Traffic analytics
  async getTrafficAnalytics(filters?: AnalyticsFilters): Promise<AnalyticsData['traffic']> {
    const params = filters ? new URLSearchParams(filters as any).toString() : '';
    return await apiService.get(`/analytics/traffic?${params}`);
  }

  async getRealTimeAnalytics(): Promise<{
    activeUsers: number;
    pageViews: number;
    topPages: Array<{ page: string; activeUsers: number }>;
    topSources: Array<{ source: string; visitors: number }>;
    geography: Array<{ country: string; users: number }>;
    devices: Record<string, number>;
    recentActivity: Array<{
      timestamp: Date;
      page: string;
      source: string;
      country: string;
      device: string;
    }>;
  }> {
    return await apiService.get('/analytics/realtime');
  }

  // Conversion analytics
  async getConversionAnalytics(filters?: AnalyticsFilters): Promise<{
    overall: {
      conversionRate: number;
      totalConversions: number;
      totalRevenue: number;
      avgOrderValue: number;
    };
    funnels: Array<{
      name: string;
      steps: Array<{
        name: string;
        visitors: number;
        conversionRate: number;
        dropoffRate: number;
      }>;
    }>;
    goals: Array<{
      name: string;
      completions: number;
      conversionRate: number;
      value: number;
    }>;
    campaigns: Array<{
      name: string;
      visitors: number;
      conversions: number;
      revenue: number;
      roi: number;
    }>;
  }> {
    const params = filters ? new URLSearchParams(filters as any).toString() : '';
    return await apiService.get(`/analytics/conversions?${params}`);
  }

  // SEO analytics
  async getSEOAnalytics(filters?: AnalyticsFilters): Promise<{
    organicTraffic: {
      total: number;
      growth: number;
      keywords: Array<{
        keyword: string;
        position: number;
        clicks: number;
        impressions: number;
        ctr: number;
      }>;
    };
    searchConsole: {
      totalClicks: number;
      totalImpressions: number;
      avgCtr: number;
      avgPosition: number;
      topQueries: Array<{
        query: string;
        clicks: number;
        impressions: number;
        ctr: number;
        position: number;
      }>;
    };
    technical: {
      crawlErrors: number;
      indexedPages: number;
      mobileUsability: number;
      siteSpeed: number;
      coreWebVitals: {
        lcp: number;
        fid: number;
        cls: number;
      };
    };
  }> {
    const params = filters ? new URLSearchParams(filters as any).toString() : '';
    return await apiService.get(`/analytics/seo?${params}`);
  }

  // Performance analytics
  async getPerformanceAnalytics(filters?: AnalyticsFilters): Promise<AnalyticsData['performance']> {
    const params = filters ? new URLSearchParams(filters as any).toString() : '';
    return await apiService.get(`/analytics/performance?${params}`);
  }

  // Custom reports
  async createCustomReport(config: {
    name: string;
    description?: string;
    metrics: string[];
    dimensions: string[];
    filters?: Record<string, any>;
    schedule?: 'daily' | 'weekly' | 'monthly';
    recipients?: string[];
  }): Promise<{
    id: string;
    name: string;
    url: string;
    lastRun?: Date;
    nextRun?: Date;
  }> {
    return await apiService.post('/analytics/reports', config);
  }

  async getCustomReports(): Promise<Array<{
    id: string;
    name: string;
    description?: string;
    metrics: string[];
    dimensions: string[];
    lastRun?: Date;
    nextRun?: Date;
    status: 'active' | 'paused' | 'error';
  }>> {
    return await apiService.get('/analytics/reports');
  }

  async runCustomReport(reportId: string, filters?: Record<string, any>): Promise<{
    data: any[];
    summary: Record<string, any>;
    total: number;
  }> {
    return await apiService.post(`/analytics/reports/${reportId}/run`, { filters });
  }

  async updateCustomReport(reportId: string, updates: {
    name?: string;
    description?: string;
    metrics?: string[];
    dimensions?: string[];
    filters?: Record<string, any>;
    schedule?: 'daily' | 'weekly' | 'monthly';
    recipients?: string[];
    status?: 'active' | 'paused';
  }): Promise<void> {
    await apiService.patch(`/analytics/reports/${reportId}`, updates);
  }

  async deleteCustomReport(reportId: string): Promise<void> {
    await apiService.delete(`/analytics/reports/${reportId}`);
  }

  // Data export
  async exportAnalyticsData(
    type: 'overview' | 'content' | 'audience' | 'traffic' | 'conversions',
    format: 'csv' | 'xlsx' | 'json' | 'pdf' = 'csv',
    filters?: AnalyticsFilters
  ): Promise<Blob> {
    const params = new URLSearchParams({ type, format, ...(filters as any) }).toString();
    const response = await apiService.get(`/analytics/export?${params}`, {
      responseType: 'blob',
    });
    return response;
  }

  // Real-time tracking
  async trackEvent(event: {
    name: string;
    properties?: Record<string, any>;
    userId?: string;
    sessionId?: string;
  }): Promise<void> {
    await apiService.post('/analytics/track', event);
  }

  async trackPageView(data: {
    page: string;
    title: string;
    referrer?: string;
    userId?: string;
    sessionId?: string;
  }): Promise<void> {
    await apiService.post('/analytics/pageview', data);
  }

  async trackUserEngagement(data: {
    type: 'click' | 'scroll' | 'form_submit' | 'video_play' | 'download';
    element?: string;
    value?: any;
    userId?: string;
    sessionId?: string;
  }): Promise<void> {
    await apiService.post('/analytics/engagement', data);
  }

  // Goals and funnels
  async createGoal(config: {
    name: string;
    type: 'destination' | 'duration' | 'pages_per_session' | 'event';
    value: string | number;
    description?: string;
  }): Promise<{ id: string; name: string; type: string }> {
    return await apiService.post('/analytics/goals', config);
  }

  async getGoals(): Promise<Array<{
    id: string;
    name: string;
    type: string;
    value: string | number;
    completions: number;
    conversionRate: number;
  }>> {
    return await apiService.get('/analytics/goals');
  }

  async createFunnel(config: {
    name: string;
    steps: Array<{
      name: string;
      condition: string;
    }>;
    description?: string;
  }): Promise<{ id: string; name: string; steps: any[] }> {
    return await apiService.post('/analytics/funnels', config);
  }

  async getFunnels(): Promise<Array<{
    id: string;
    name: string;
    steps: Array<{
      name: string;
      visitors: number;
      conversionRate: number;
    }>;
    overallConversionRate: number;
  }>> {
    return await apiService.get('/analytics/funnels');
  }
}

export const analyticsService = new AnalyticsService();
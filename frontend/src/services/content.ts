import { apiService } from './api';
import { Content, Category, ContentTranslation, ContentRevision } from '@/types';

export interface CreateContentRequest {
  title: string;
  content: string;
  excerpt?: string;
  type: 'article' | 'page' | 'post' | 'landing';
  categoryId: string;
  tags?: string[];
  featuredImageId?: string;
  status?: 'draft' | 'published';
  scheduledAt?: Date;
  metadata?: Record<string, any>;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
  };
}

export interface UpdateContentRequest extends Partial<CreateContentRequest> {
  id: string;
}

export interface ContentFilters {
  status?: 'draft' | 'published' | 'archived';
  type?: 'article' | 'page' | 'post' | 'landing';
  categoryId?: string;
  authorId?: string;
  tags?: string[];
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: 'title' | 'createdAt' | 'updatedAt' | 'publishedAt';
  sortOrder?: 'asc' | 'desc';
}

export class ContentService {
  // Content CRUD operations
  async getContents(filters?: ContentFilters): Promise<{
    contents: Content[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const params = filters ? new URLSearchParams(filters as any).toString() : '';
    return await apiService.get(`/content?${params}`);
  }

  async getContent(id: string): Promise<Content> {
    return await apiService.get(`/content/${id}`);
  }

  async getContentBySlug(slug: string): Promise<Content> {
    return await apiService.get(`/content/slug/${slug}`);
  }

  async createContent(data: CreateContentRequest): Promise<Content> {
    return await apiService.post<Content>('/content', data);
  }

  async updateContent(data: UpdateContentRequest): Promise<Content> {
    return await apiService.patch<Content>(`/content/${data.id}`, data);
  }

  async deleteContent(id: string): Promise<void> {
    await apiService.delete(`/content/${id}`);
  }

  async publishContent(id: string): Promise<Content> {
    return await apiService.post<Content>(`/content/${id}/publish`);
  }

  async unpublishContent(id: string): Promise<Content> {
    return await apiService.post<Content>(`/content/${id}/unpublish`);
  }

  async scheduleContent(id: string, scheduledAt: Date): Promise<Content> {
    return await apiService.post<Content>(`/content/${id}/schedule`, { scheduledAt });
  }

  async duplicateContent(id: string, title?: string): Promise<Content> {
    return await apiService.post<Content>(`/content/${id}/duplicate`, { title });
  }

  // Content revisions
  async getContentRevisions(contentId: string): Promise<ContentRevision[]> {
    return await apiService.get(`/content/${contentId}/revisions`);
  }

  async getContentRevision(contentId: string, revisionId: string): Promise<ContentRevision> {
    return await apiService.get(`/content/${contentId}/revisions/${revisionId}`);
  }

  async restoreContentRevision(contentId: string, revisionId: string): Promise<Content> {
    return await apiService.post<Content>(`/content/${contentId}/revisions/${revisionId}/restore`);
  }

  // Content bulk operations
  async bulkUpdateStatus(contentIds: string[], status: 'draft' | 'published' | 'archived'): Promise<void> {
    await apiService.post('/content/bulk/status', { contentIds, status });
  }

  async bulkDelete(contentIds: string[]): Promise<void> {
    await apiService.post('/content/bulk/delete', { contentIds });
  }

  async bulkMoveToCategory(contentIds: string[], categoryId: string): Promise<void> {
    await apiService.post('/content/bulk/move', { contentIds, categoryId });
  }

  async bulkAddTags(contentIds: string[], tags: string[]): Promise<void> {
    await apiService.post('/content/bulk/tags/add', { contentIds, tags });
  }

  async bulkRemoveTags(contentIds: string[], tags: string[]): Promise<void> {
    await apiService.post('/content/bulk/tags/remove', { contentIds, tags });
  }

  // Content search
  async searchContents(query: string, filters?: ContentFilters): Promise<Content[]> {
    const params = new URLSearchParams({ query, ...(filters as any) }).toString();
    return await apiService.get(`/content/search?${params}`);
  }

  async getContentSuggestions(query: string): Promise<string[]> {
    return await apiService.get(`/content/suggestions?q=${encodeURIComponent(query)}`);
  }

  // Content analytics
  async getContentAnalytics(contentId: string, period: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<{
    views: Array<{ date: string; views: number }>;
    engagement: {
      likes: number;
      shares: number;
      comments: number;
    };
    traffic: {
      organic: number;
      direct: number;
      social: number;
      referral: number;
    };
    topReferrers: Array<{ source: string; visits: number }>;
  }> {
    return await apiService.get(`/content/${contentId}/analytics?period=${period}`);
  }

  // Content collaboration
  async getCollaborationSessions(contentId: string): Promise<Array<{
    id: string;
    user: { id: string; name: string; avatar?: string };
    isActive: boolean;
    lastActivity: Date;
  }>> {
    return await apiService.get(`/content/${contentId}/collaborations`);
  }

  async joinCollaborationSession(contentId: string): Promise<{
    sessionId: string;
    collaborationToken: string;
  }> {
    return await apiService.post(`/content/${contentId}/collaborations/join`);
  }

  async leaveCollaborationSession(contentId: string, sessionId: string): Promise<void> {
    await apiService.post(`/content/${contentId}/collaborations/leave`, { sessionId });
  }

  // Content SEO
  async generateSEO(contentId: string): Promise<{
    title: string;
    description: string;
    keywords: string[];
    suggestions: string[];
  }> {
    return await apiService.post(`/content/${contentId}/seo/generate`);
  }

  async analyzeSEO(contentId: string): Promise<{
    score: number;
    issues: Array<{
      type: 'error' | 'warning' | 'info';
      message: string;
      field: string;
    }>;
    suggestions: string[];
  }> {
    return await apiService.get(`/content/${contentId}/seo/analyze`);
  }

  // Content import/export
  async exportContent(contentIds: string[], format: 'json' | 'csv' | 'xml'): Promise<Blob> {
    const response = await apiService.get(`/content/export`, {
      params: { contentIds: contentIds.join(','), format },
      responseType: 'blob',
    });
    return response;
  }

  async importContent(file: File, options?: {
    categoryId?: string;
    authorId?: string;
    status?: 'draft' | 'published';
  }): Promise<{
    imported: number;
    skipped: number;
    errors: Array<{ row: number; message: string }>;
  }> {
    const formData = new FormData();
    formData.append('file', file);
    if (options) {
      formData.append('options', JSON.stringify(options));
    }

    return await apiService.post('/content/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
}

export const contentService = new ContentService();
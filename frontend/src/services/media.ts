import { apiService } from './api';
import { MediaFile } from '@/types';

export interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface MediaFilters {
  type?: 'image' | 'video' | 'audio' | 'document' | 'other';
  folder?: string;
  tags?: string[];
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'size' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export class MediaService {
  // File upload
  async uploadFile(
    file: File, 
    options?: {
      folder?: string;
      alt?: string;
      caption?: string;
      tags?: string[];
      onProgress?: (progress: UploadProgress) => void;
    }
  ): Promise<MediaFile> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (options?.folder) formData.append('folder', options.folder);
    if (options?.alt) formData.append('alt', options.alt);
    if (options?.caption) formData.append('caption', options.caption);
    if (options?.tags) formData.append('tags', JSON.stringify(options.tags));

    const response = await apiService.post<MediaFile>('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (options?.onProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          options.onProgress({
            fileId: file.name,
            fileName: file.name,
            progress,
            status: 'uploading',
          });
        }
      },
    });

    if (options?.onProgress) {
      options.onProgress({
        fileId: file.name,
        fileName: file.name,
        progress: 100,
        status: 'completed',
      });
    }

    return response;
  }

  async uploadMultipleFiles(
    files: File[], 
    options?: {
      folder?: string;
      alt?: string;
      caption?: string;
      tags?: string[];
      onProgress?: (progresses: UploadProgress[]) => void;
    }
  ): Promise<MediaFile[]> {
    const results: MediaFile[] = [];
    const progresses: UploadProgress[] = [];

    // Initialize progress tracking
    files.forEach(file => {
      progresses.push({
        fileId: file.name,
        fileName: file.name,
        progress: 0,
        status: 'uploading',
      });
    });

    options?.onProgress?.(progresses);

    // Upload files sequentially to avoid overwhelming the server
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        const uploadedFile = await this.uploadFile(file, options);
        results.push(uploadedFile);
        
        // Update progress
        const progressIndex = progresses.findIndex(p => p.fileId === file.name);
        if (progressIndex !== -1) {
          progresses[progressIndex].status = 'completed';
          progresses[progressIndex].progress = 100;
        }
        
        options?.onProgress?.(progresses);
      } catch (error) {
        // Update progress with error
        const progressIndex = progresses.findIndex(p => p.fileId === file.name);
        if (progressIndex !== -1) {
          progresses[progressIndex].status = 'error';
          progresses[progressIndex].error = error instanceof Error ? error.message : 'Upload failed';
        }
        
        options?.onProgress?.(progresses);
        throw error;
      }
    }

    return results;
  }

  // Media management
  async getMediaFiles(filters?: MediaFilters): Promise<{
    files: MediaFile[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const params = filters ? new URLSearchParams(filters as any).toString() : '';
    return await apiService.get(`/media?${params}`);
  }

  async getMediaFile(id: string): Promise<MediaFile> {
    return await apiService.get(`/media/${id}`);
  }

  async updateMediaFile(
    id: string, 
    updates: {
      alt?: string;
      caption?: string;
      folder?: string;
      tags?: string[];
    }
  ): Promise<MediaFile> {
    return await apiService.patch<MediaFile>(`/media/${id}`, updates);
  }

  async deleteMediaFile(id: string): Promise<void> {
    await apiService.delete(`/media/${id}`);
  }

  async deleteMultipleFiles(fileIds: string[]): Promise<void> {
    await apiService.post('/media/bulk/delete', { fileIds });
  }

  // Media folders
  async getFolders(): Promise<Array<{
    name: string;
    path: string;
    fileCount: number;
    totalSize: number;
    lastModified: Date;
  }>> {
    return await apiService.get('/media/folders');
  }

  async createFolder(name: string, parent?: string): Promise<{
    name: string;
    path: string;
  }> {
    return await apiService.post('/media/folders', { name, parent });
  }

  async moveFilesToFolder(fileIds: string[], folder: string): Promise<void> {
    await apiService.post('/media/folders/move', { fileIds, folder });
  }

  // Media processing
  async generateImageVariations(
    fileId: string, 
    variations: Array<{
      name: string;
      width?: number;
      height?: number;
      format?: 'jpeg' | 'png' | 'webp' | 'avif';
      quality?: number;
    }>
  ): Promise<Array<{
    name: string;
    url: string;
    width: number;
    height: number;
    size: number;
  }>> {
    return await apiService.post(`/media/${fileId}/variations`, { variations });
  }

  async optimizeImage(fileId: string, options?: {
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp' | 'avif';
    progressive?: boolean;
  }): Promise<{
    optimizedUrl: string;
    originalSize: number;
    optimizedSize: number;
    savings: number;
  }> {
    return await apiService.post(`/media/${fileId}/optimize`, options);
  }

  async extractImageText(fileId: string): Promise<{
    text: string;
    confidence: number;
    boundingBoxes: Array<{
      text: string;
      confidence: number;
      boundingBox: { x: number; y: number; width: number; height: number };
    }>;
  }> {
    return await apiService.post(`/media/${fileId}/extract-text`);
  }

  async generateImageThumbnail(fileId: string, size: number = 200): Promise<{
    thumbnailUrl: string;
    width: number;
    height: number;
  }> {
    return await apiService.post(`/media/${fileId}/thumbnail`, { size });
  }

  // Media search
  async searchMedia(query: string, filters?: MediaFilters): Promise<MediaFile[]> {
    const params = new URLSearchParams({ query, ...(filters as any) }).toString();
    return await apiService.get(`/media/search?${params}`);
  }

  async getSimilarImages(fileId: string, limit: number = 10): Promise<MediaFile[]> {
    return await apiService.get(`/media/${fileId}/similar?limit=${limit}`);
  }

  async findDuplicateFiles(): Promise<Array<{
    fileId: string;
    duplicates: string[];
    size: number;
    hash: string;
  }>> {
    return await apiService.get('/media/duplicates');
  }

  // Media analytics
  async getMediaAnalytics(fileId: string, period: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<{
    views: number;
    downloads: number;
    topReferrers: Array<{ source: string; count: number }>;
    dailyUsage: Array<{ date: string; views: number; downloads: number }>;
  }> {
    return await apiService.get(`/media/${fileId}/analytics?period=${period}`);
  }

  async getMediaUsage(period: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<{
    totalFiles: number;
    totalSize: number;
    storageBreakdown: {
      images: { count: number; size: number };
      videos: { count: number; size: number };
      audio: { count: number; size: number };
      documents: { count: number; size: number };
    };
    topFiles: Array<{
      file: MediaFile;
      views: number;
      downloads: number;
    }>;
  }> {
    return await apiService.get(`/media/usage?period=${period}`);
  }

  // Media import
  async importFromUrl(url: string, options?: {
    folder?: string;
    alt?: string;
    caption?: string;
  }): Promise<MediaFile> {
    return await apiService.post('/media/import/url', { url, ...options });
  }

  async importFromCloud(cloudService: 'google-drive' | 'dropbox' | 'onedrive', fileId: string): Promise<MediaFile> {
    return await apiService.post('/media/import/cloud', { cloudService, fileId });
  }

  // Media export
  async exportMedia(fileIds: string[], format: 'zip' | 'tar.gz' = 'zip'): Promise<Blob> {
    const response = await apiService.get('/media/export', {
      params: { fileIds: fileIds.join(','), format },
      responseType: 'blob',
    });
    return response;
  }

  // Media permissions
  async setMediaPermissions(fileIds: string[], permissions: {
    isPublic: boolean;
    allowedDomains?: string[];
    expiryDate?: Date;
  }): Promise<void> {
    await apiService.post('/media/permissions', { fileIds, permissions });
  }

  async getMediaUsageReport(format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    const response = await apiService.get('/media/report', {
      params: { format },
      responseType: 'blob',
    });
    return response;
  }
}

export const mediaService = new MediaService();
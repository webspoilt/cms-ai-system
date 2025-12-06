// Common API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'author' | 'viewer';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  preferences: UserPreferences;
  permissions: string[];
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  dashboard: {
    layout: 'grid' | 'list';
    itemsPerPage: number;
  };
}

// Authentication types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: 'editor' | 'author' | 'viewer';
}

export interface SocialAuthRequest {
  provider: 'google' | 'github' | 'linkedin';
  accessToken: string;
}

// Content types
export interface Content {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  type: 'article' | 'page' | 'post' | 'landing';
  status: 'draft' | 'published' | 'archived';
  author: User;
  category: Category;
  tags: string[];
  featuredImage?: MediaFile;
  metadata: ContentMetadata;
  seo: SEOData;
  analytics: ContentAnalytics;
  translations: ContentTranslation[];
  scheduledAt?: Date;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  collaborators: User[];
  revisions: ContentRevision[];
}

export interface ContentMetadata {
  wordCount: number;
  readingTime: number;
  language: string;
  template?: string;
  customFields: Record<string, any>;
  structuredData?: Record<string, any>;
}

export interface ContentTranslation {
  language: string;
  title: string;
  content: string;
  excerpt: string;
  status: 'draft' | 'published' | 'pending';
  translatedBy: 'ai' | 'human';
  createdAt: Date;
}

export interface ContentRevision {
  id: string;
  version: number;
  title: string;
  content: string;
  changes: string[];
  createdBy: User;
  createdAt: Date;
  isCurrent: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  children?: Category[];
  color: string;
  icon?: string;
  isActive: boolean;
  contentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Media types
export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  size: number;
  mimeType: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
  folder: string;
  tags: string[];
  uploadedBy: User;
  metadata: MediaMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaMetadata {
  exif?: Record<string, any>;
  thumbnail?: string;
  preview?: string;
  colors: string[];
  textExtracted?: string;
  dominantColor: string;
  isAIProcessed: boolean;
}

// AI types
export interface AIRequest {
  type: 'generate' | 'optimize' | 'analyze' | 'translate';
  prompt: string;
  context?: Record<string, any>;
  options?: AIOptions;
}

export interface AIOptions {
  language?: string;
  tone?: 'professional' | 'casual' | 'formal' | 'friendly' | 'creative';
  length?: 'short' | 'medium' | 'long';
  keywords?: string[];
  style?: string;
  model?: 'gpt-4' | 'gpt-3.5-turbo';
}

export interface AIResponse {
  content: string;
  confidence: number;
  suggestions: string[];
  metadata: {
    tokens: number;
    model: string;
    processingTime: number;
  };
}

// Analytics types
export interface ContentAnalytics {
  views: number;
  uniqueViews: number;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
  performance: {
    bounceRate: number;
    averageTimeOnPage: number;
    conversionRate: number;
  };
  traffic: {
    organic: number;
    direct: number;
    social: number;
    referral: number;
  };
}

export interface DashboardMetrics {
  totalContent: number;
  publishedContent: number;
  draftContent: number;
  totalViews: number;
  uniqueVisitors: number;
  topContent: Array<{
    content: Content;
    views: number;
  }>;
  recentActivity: ActivityLog[];
  performance: {
    averageLoadTime: number;
    uptime: number;
    errorRate: number;
  };
}

export interface ActivityLog {
  id: string;
  user: User;
  action: string;
  resource: string;
  resourceId: string;
  changes?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

// Form types
export interface FormErrors {
  [key: string]: string | string[];
}

export interface FormState<T = any> {
  data: T;
  errors: FormErrors;
  isLoading: boolean;
  isSubmitting: boolean;
  touched: Set<string>;
}

// UI component types
export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current: boolean;
  badge?: string;
  children?: NavigationItem[];
}

export interface BreadcrumbItem {
  name: string;
  href?: string;
  current?: boolean;
}

export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
  className?: string;
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sort?: SortOption;
  filters?: Record<string, any>;
}

// WebSocket types
export interface WebSocketMessage {
  type: 'content_updated' | 'user_joined' | 'user_left' | 'typing' | 'cursor_move';
  payload: any;
  userId: string;
  timestamp: Date;
}

export interface CollaborationSession {
  id: string;
  contentId: string;
  users: User[];
  cursors: Map<string, { x: number; y: number; color: string }>;
  isActive: boolean;
  createdAt: Date;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
  stack?: string;
}

// Export utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & Pick<T, K>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
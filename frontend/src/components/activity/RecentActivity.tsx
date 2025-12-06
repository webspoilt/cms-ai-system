'use client';

import { formatRelativeTime } from '@/utils';
import {
  DocumentTextIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserPlusIcon,
  Cog6ToothIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface Activity {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: 'created' | 'updated' | 'deleted' | 'published' | 'viewed' | 'joined' | 'configured';
  resource: string;
  resourceType?: 'content' | 'media' | 'user' | 'settings';
  timestamp: Date;
}

interface RecentActivityProps {
  activities: Activity[];
  limit?: number;
}

export function RecentActivity({ activities, limit = 10 }: RecentActivityProps) {
  const displayActivities = activities.slice(0, limit);

  const getActionIcon = (action: string, resourceType?: string) => {
    switch (action) {
      case 'created':
        return <DocumentTextIcon className="w-4 h-4 text-success" />;
      case 'updated':
        return <PencilIcon className="w-4 h-4 text-primary-500" />;
      case 'deleted':
        return <TrashIcon className="w-4 h-4 text-error" />;
      case 'published':
        return <CheckCircleIcon className="w-4 h-4 text-success" />;
      case 'viewed':
        return <EyeIcon className="w-4 h-4 text-neutral-400" />;
      case 'joined':
        return <UserPlusIcon className="w-4 h-4 text-secondary-500" />;
      case 'configured':
        return <Cog6ToothIcon className="w-4 h-4 text-warning" />;
      default:
        return <DocumentTextIcon className="w-4 h-4 text-neutral-400" />;
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'created': return 'created';
      case 'updated': return 'updated';
      case 'deleted': return 'deleted';
      case 'published': return 'published';
      case 'viewed': return 'viewed';
      case 'joined': return 'joined';
      case 'configured': return 'configured';
      default: return 'interacted with';
    }
  };

  const getResourceTypeText = (resourceType?: string) => {
    if (!resourceType) return '';
    
    switch (resourceType) {
      case 'content': return 'content';
      case 'media': return 'media file';
      case 'user': return 'user';
      case 'settings': return 'settings';
      default: return 'item';
    }
  };

  if (displayActivities.length === 0) {
    return (
      <div className="text-center py-8">
        <DocumentTextIcon className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-neutral-200 mb-2">No recent activity</h3>
        <p className="text-neutral-400 text-sm">
          Activity will appear here as you and your team work on content.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayActivities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3">
          {/* User Avatar */}
          <div className="flex-shrink-0">
            {activity.user.avatar ? (
              <img
                src={activity.user.avatar}
                alt={activity.user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-neutral-200">
                  {activity.user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Activity Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-neutral-200">
                {activity.user.name}
              </span>
              <span className="text-sm text-neutral-400">
                {getActionText(activity.action)}
              </span>
              <span className="text-sm text-primary-500 font-medium truncate">
                {activity.resource}
              </span>
            </div>
            
            <div className="flex items-center space-x-2 mt-1">
              {getActionIcon(activity.action, activity.resourceType)}
              <span className="text-xs text-neutral-500">
                {formatRelativeTime(activity.timestamp)}
              </span>
              {activity.resourceType && (
                <>
                  <span className="text-xs text-neutral-500">•</span>
                  <span className="text-xs text-neutral-500 capitalize">
                    {getResourceTypeText(activity.resourceType)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
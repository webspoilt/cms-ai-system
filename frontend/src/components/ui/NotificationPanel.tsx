'use client';

import { useState, useEffect } from 'react';
import { formatRelativeTime } from '@/utils';
import { 
  XMarkIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock notifications for demonstration
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Content Published',
    message: 'Your article "Getting Started with AI CMS" has been published successfully.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    read: false,
  },
  {
    id: '2',
    type: 'info',
    title: 'AI Analysis Complete',
    message: 'SEO analysis for your latest post is complete. Check the recommendations.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
  },
  {
    id: '3',
    type: 'warning',
    title: 'Storage Limit Warning',
    message: 'You are approaching your media storage limit. Consider cleaning up old files.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: true,
  },
];

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') {
      return !notification.read;
    }
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-success" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-warning" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-5 h-5 text-error" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-primary-500" />;
    }
  };

  const getNotificationStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-success bg-success/5';
      case 'warning':
        return 'border-l-warning bg-warning/5';
      case 'error':
        return 'border-l-error bg-error/5';
      default:
        return 'border-l-primary-500 bg-primary-500/5';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="fixed top-16 right-4 w-96 max-h-96 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-neutral-900/95 backdrop-blur-primary border border-neutral-800 rounded-primary shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
            <div className="flex items-center space-x-2">
              <BellIcon className="w-5 h-5 text-neutral-400" />
              <h3 className="text-lg font-semibold text-neutral-100">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-primary-500 text-neutral-950 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-neutral-800">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'text-primary-500 border-b-2 border-primary-500'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                filter === 'unread'
                  ? 'text-primary-500 border-b-2 border-primary-500'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Actions */}
          {unreadCount > 0 && (
            <div className="px-4 py-2 border-b border-neutral-800">
              <button
                onClick={markAllAsRead}
                className="text-sm text-primary-500 hover:text-primary-400 transition-colors"
              >
                Mark all as read
              </button>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8">
                <BellIcon className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-200 mb-2">
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
                </h3>
                <p className="text-neutral-400 text-sm">
                  {filter === 'unread' 
                    ? 'You\'re all caught up!' 
                    : 'Notifications will appear here when they\'re available.'
                  }
                </p>
              </div>
            ) : (
              <div className="py-2">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`relative border-l-4 ${getNotificationStyles(notification.type)} ${
                      !notification.read ? 'bg-neutral-800/20' : ''
                    } hover:bg-neutral-800/30 transition-colors`}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1 min-w-0">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-sm font-medium text-neutral-200">
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-neutral-400 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-neutral-500 mt-2">
                              {formatRelativeTime(notification.timestamp)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeNotification(notification.id)}
                          className="p-1 text-neutral-400 hover:text-neutral-200 transition-colors"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Actions */}
                      {notification.actions && notification.actions.length > 0 && (
                        <div className="flex space-x-2 mt-3">
                          {notification.actions.map((action, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                action.action();
                                markAsRead(notification.id);
                              }}
                              className="text-xs text-primary-500 hover:text-primary-400 transition-colors"
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Mark as read button */}
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors mt-2"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
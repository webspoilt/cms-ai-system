'use client';

import Link from 'next/link';
import { formatDate, formatRelativeTime } from '@/utils';
import { cn } from '@/utils';
import {
  DocumentIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowTopRightOnSquareIcon,
  ClockIcon,
  CheckCircleIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';

interface ContentTableProps {
  contents: Array<{
    id: string;
    title: string;
    status: 'draft' | 'published' | 'archived';
    author: { name: string };
    publishedAt?: Date;
    createdAt: Date;
    views?: number;
  }>;
  showActions?: boolean;
  compact?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

export function ContentTable({
  contents,
  showActions = true,
  compact = false,
  onEdit,
  onDelete,
  onDuplicate
}: ContentTableProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircleIcon className="w-4 h-4 text-success" />;
      case 'draft':
        return <ClockIcon className="w-4 h-4 text-warning" />;
      case 'archived':
        return <DocumentIcon className="w-4 h-4 text-neutral-400" />;
      default:
        return <DocumentIcon className="w-4 h-4 text-neutral-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'text-success bg-success/10';
      case 'draft':
        return 'text-warning bg-warning/10';
      case 'archived':
        return 'text-neutral-400 bg-neutral-800';
      default:
        return 'text-neutral-400 bg-neutral-800';
    }
  };

  if (contents.length === 0) {
    return (
      <div className="text-center py-12">
        <DocumentIcon className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-neutral-200 mb-2">No content found</h3>
        <p className="text-neutral-400">Get started by creating your first piece of content.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-neutral-800">
            <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">
              Title
            </th>
            {!compact && (
              <>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">
                  Author
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">
                  Status
                </th>
              </>
            )}
            <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">
              {compact ? 'Updated' : 'Date'}
            </th>
            {showActions && (
              <th className="text-right py-3 px-4 text-sm font-medium text-neutral-400">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {contents.map((content) => (
            <tr
              key={content.id}
              className="border-b border-neutral-800/50 hover:bg-neutral-800/20 transition-colors"
            >
              <td className="py-4 px-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/content/${content.id}`}
                      className="text-neutral-200 hover:text-primary-500 transition-colors font-medium truncate block"
                    >
                      {content.title}
                    </Link>
                    {!compact && content.views && (
                      <div className="flex items-center mt-1 text-xs text-neutral-400">
                        <EyeIcon className="w-3 h-3 mr-1" />
                        {content.views.toLocaleString()} views
                      </div>
                    )}
                  </div>
                </div>
              </td>

              {!compact && (
                <td className="py-4 px-4 text-sm text-neutral-400">
                  {content.author.name}
                </td>
              )}

              <td className="py-4 px-4">
                <span className={cn(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getStatusColor(content.status)
                )}>
                  {getStatusIcon(content.status)}
                  <span className="ml-1 capitalize">{content.status}</span>
                </span>
              </td>

              <td className="py-4 px-4 text-sm text-neutral-400">
                {content.publishedAt ? (
                  <div>
                    <div>{formatDate(content.publishedAt)}</div>
                    <div className="text-xs">Published</div>
                  </div>
                ) : (
                  <div>
                    <div>{formatDate(content.createdAt)}</div>
                    <div className="text-xs text-neutral-500">
                      {formatRelativeTime(content.createdAt)}
                    </div>
                  </div>
                )}
              </td>

              {showActions && (
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      href={`/content/${content.id}/edit`}
                      className="p-2 text-neutral-400 hover:text-primary-500 hover:bg-primary-500/10 rounded-secondary transition-colors"
                      title="Edit"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => onDuplicate?.(content.id)}
                      className="p-2 text-neutral-400 hover:text-secondary-500 hover:bg-secondary-500/10 rounded-secondary transition-colors"
                      title="Duplicate"
                    >
                      <DocumentDuplicateIcon className="w-4 h-4" />
                    </button>

                    <Link
                      href={`/content/${content.id}`}
                      className="p-2 text-neutral-400 hover:text-success hover:bg-success/10 rounded-secondary transition-colors"
                      title="View"
                    >
                      <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => onDelete?.(content.id)}
                      className="p-2 text-neutral-400 hover:text-error hover:bg-error/10 rounded-secondary transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

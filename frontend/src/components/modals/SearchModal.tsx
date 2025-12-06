'use client';

import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { debounce } from '@/utils';

interface SearchResult {
  id: string;
  title: string;
  type: 'content' | 'media' | 'users';
  description?: string;
  url: string;
  icon?: React.ReactNode;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOCK_SEARCH_RESULTS: SearchResult[] = [
  {
    id: '1',
    title: 'Getting Started Guide',
    type: 'content',
    description: 'Learn how to use the AI CMS platform',
    url: '/content/1',
  },
  {
    id: '2',
    title: 'John Doe',
    type: 'users',
    description: 'Content Author',
    url: '/users/1',
  },
  {
    id: '3',
    title: 'hero-image.jpg',
    type: 'media',
    description: 'Image • 2.1 MB',
    url: '/media/1',
  },
];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Debounced search function
  const debouncedSearch = useRef(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const filtered = MOCK_SEARCH_RESULTS.filter(result =>
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (result.description && result.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        
        setResults(filtered);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300)
  );

  // Handle search query changes
  useEffect(() => {
    debouncedSearch.current(query);
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            handleResultSelect(results[selectedIndex]);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const handleResultSelect = (result: SearchResult) => {
    router.push(result.url);
    onClose();
    setQuery('');
    setResults([]);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'content':
        return '📄';
      case 'media':
        return '🖼️';
      case 'users':
        return '👤';
      default:
        return '📄';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full max-w-2xl mx-4">
          <div className="bg-neutral-900/95 backdrop-blur-primary border border-neutral-800 rounded-primary shadow-2xl">
            {/* Search Input */}
            <div className="flex items-center px-4 py-3 border-b border-neutral-800">
              <MagnifyingGlassIcon className="w-5 h-5 text-neutral-400 mr-3" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search content, media, users..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-neutral-200 placeholder:text-neutral-400 focus:outline-none"
              />
              <button
                onClick={onClose}
                className="ml-3 p-1 text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="loading-dots">
                    <div style={{ '--delay': '0ms' } as React.CSSProperties} />
                    <div style={{ '--delay': '150ms' } as React.CSSProperties} />
                    <div style={{ '--delay': '300ms' } as React.CSSProperties} />
                  </div>
                  <span className="ml-3 text-neutral-400">Searching...</span>
                </div>
              )}

              {!isLoading && query && results.length === 0 && (
                <div className="text-center py-8">
                  <MagnifyingGlassIcon className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-200 mb-2">No results found</h3>
                  <p className="text-neutral-400">
                    Try searching for something else or check your spelling.
                  </p>
                </div>
              )}

              {!isLoading && results.length > 0 && (
                <div className="py-2">
                  {results.map((result, index) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultSelect(result)}
                      className={`w-full flex items-center px-4 py-3 text-left hover:bg-neutral-800/50 transition-colors ${
                        index === selectedIndex ? 'bg-neutral-800/50' : ''
                      }`}
                    >
                      <span className="text-2xl mr-3">
                        {getResultIcon(result.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-neutral-200 font-medium truncate">
                          {result.title}
                        </div>
                        {result.description && (
                          <div className="text-sm text-neutral-400 truncate">
                            {result.description}
                          </div>
                        )}
                        <div className="text-xs text-neutral-500 mt-1 capitalize">
                          {result.type}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {!query && (
                <div className="text-center py-8">
                  <MagnifyingGlassIcon className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-200 mb-2">Start typing to search</h3>
                  <p className="text-neutral-400">
                    Search through your content, media files, and team members.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-800 text-xs text-neutral-400">
              <div className="flex space-x-4">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>esc Close</span>
              </div>
              {query && (
                <div>
                  {results.length} result{results.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
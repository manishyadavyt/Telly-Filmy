
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Loader2 } from 'lucide-react';
import type { Post } from '@/lib/types';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface SearchBarProps {
  posts: Post[];
}

export function SearchBar({ posts }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [popoverWidth, setPopoverWidth] = useState(0);

  useEffect(() => {
    if (triggerRef.current) {
      setPopoverWidth(triggerRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    const handleSearch = () => {
      if (query.length > 1) {
        setLoading(true);
        const lowerCaseQuery = query.toLowerCase();
        const filteredPosts = posts.filter(
          (post) =>
            post.title.toLowerCase().includes(lowerCaseQuery) ||
            post.excerpt.toLowerCase().includes(lowerCaseQuery) ||
            post.category.toLowerCase().includes(lowerCaseQuery) ||
            (post.tags && post.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery)))
        );
        setResults(filteredPosts);
        setLoading(false);
      } else {
        setResults([]);
      }
    };

    const debounce = setTimeout(() => {
      handleSearch();
    }, 200);

    return () => clearTimeout(debounce);
  }, [query, posts]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setQuery('');
    }
  };
  
  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div className="relative w-full" ref={triggerRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search posts..."
            className="w-full pl-9"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIsOpen(true)
            }}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        style={{ width: `${popoverWidth}px` }}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="max-h-96 overflow-y-auto">
          {loading && (
            <div className="p-4 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
          {!loading && query.length > 1 && results.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No results found.
            </div>
          )}
          {!loading && results.length > 0 && (
            <div className="space-y-1 p-2">
              {results.map((post) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.slug}`}
                  className="block p-2 rounded-md hover:bg-accent"
                  onClick={() => handleOpenChange(false)}
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      width={64}
                      height={48}
                      className="rounded-md object-cover h-12 w-16"
                      data-ai-hint={post.imageHint}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm line-clamp-1">
                        {post.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

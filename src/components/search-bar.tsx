'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Loader2, ArrowRight } from "lucide-react";
import type { Post } from "@/lib/types";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SearchBarProps {
  posts?: Post[];
  placeholder?: string;
  className?: string;
}

export function SearchBar({ posts: initialPosts, placeholder = "Search articles, serials, actors...", className = "" }: SearchBarProps) {
  const router = useRouter();
  const [allPosts, setAllPosts] = useState<Post[]>(initialPosts || []);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [popoverWidth, setPopoverWidth] = useState(0);

  // Sync initial posts or fetch from API if not passed
  useEffect(() => {
    if (initialPosts && initialPosts.length > 0) {
      setAllPosts(initialPosts);
    } else {
      fetch("/api/posts")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setAllPosts(data);
        })
        .catch((err) => console.error("Error loading search posts:", err));
    }
  }, [initialPosts]);

  // Set popover width to match input
  useEffect(() => {
    if (triggerRef.current) {
      setPopoverWidth(triggerRef.current.offsetWidth);
    }
  }, []);

  // Search handler with debounce
  useEffect(() => {
    if (query.trim().length <= 1) {
      setResults([]);
      return;
    }

    setLoading(true);

    const debouncer = setTimeout(() => {
      const lower = query.toLowerCase();

      const filtered = allPosts.filter((post) => {
        const titleMatch = post.title?.toLowerCase().includes(lower);
        const excerptMatch = post.excerpt?.toLowerCase().includes(lower);
        const categoryMatch = post.category?.toLowerCase().includes(lower);
        const tagMatch = post.tags?.some((tag) =>
          tag.toLowerCase().includes(lower)
        );

        return titleMatch || excerptMatch || categoryMatch || tagMatch;
      });

      setResults(filtered.slice(0, 6));
      setLoading(false);
    }, 200);

    return () => clearTimeout(debouncer);
  }, [query, allPosts]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      setIsOpen(false);
      router.push(`/posts?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div className={`relative w-full ${className}`} ref={triggerRef}>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />

          <Input
            type="search"
            placeholder={placeholder}
            className="w-full pl-9 pr-4 py-2 bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-full border-slate-200 text-xs transition-all shadow-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value.trim().length > 1) {
                setIsOpen(true);
              }
            }}
            onKeyDown={handleKeyDown}
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
                      src={post.imageUrl ?? "/placeholder.png"} // fallback
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
                        {post.excerpt ?? ""}
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

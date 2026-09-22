'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { deletePost } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  Search, Plus, Edit, Trash2, Filter, ChevronLeft, ChevronRight,
  FileText, X, LayoutGrid, List, ArrowUp, ArrowDown,
} from 'lucide-react';
import { Post } from '@/lib/types';

const ITEMS_PER_PAGE = 15;

function formatDisplayDate(dateStr?: string) {
  if (!dateStr) return 'Recent';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Recent';
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return 'Recent';
  }
}

type SortField = 'date' | 'title' | 'category';
type SortDir = 'asc' | 'desc';

export default function ArticlesPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts');
        if (res.ok) {
          const data = await res.json();
          setPosts(Array.isArray(data) ? data : []);
        } else {
          setPosts([]);
        }
      } catch {
        setPosts([]);
        toast({ title: 'Error fetching articles', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, statusFilter, sortField, sortDir]);

  const handleDelete = async (slug: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deletePost(slug);
      setPosts((prev) => (Array.isArray(prev) ? prev.filter((p) => p.slug !== slug) : []));
      toast({ title: 'Article deleted' });
    } catch {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    }
  };

  const safePosts = Array.isArray(posts) ? posts : [];

  const categories = useMemo(
    () => Array.from(new Set(safePosts.map((p) => p?.category).filter(Boolean))).sort(),
    [safePosts]
  );

  const filteredPosts = useMemo(() => {
    let result = safePosts.filter((post) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        post.title?.toLowerCase().includes(q) ||
        post.category?.toLowerCase().includes(q) ||
        post.tags?.some((t) => t?.toLowerCase().includes(q));
      const matchCat = categoryFilter === 'all' || post.category === categoryFilter;
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'top' && post.isTopStory) ||
        (statusFilter === 'trending' && post.isTrending);
      return matchSearch && matchCat && matchStatus;
    });

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'date') {
        const timeA = a.date ? new Date(a.date).getTime() : 0;
        const timeB = b.date ? new Date(b.date).getTime() : 0;
        cmp = timeA - timeB;
      } else if (sortField === 'title') {
        cmp = (a.title || '').localeCompare(b.title || '');
      } else if (sortField === 'category') {
        cmp = (a.category || '').localeCompare(b.category || '');
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [safePosts, search, categoryFilter, statusFilter, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / ITEMS_PER_PAGE));
  const paginated = filteredPosts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const SortIcon = ({ field }: { field: SortField }) =>
    sortField === field ? (
      sortDir === 'asc' ? <ArrowUp className="w-3 h-3 ml-1" /> : <ArrowDown className="w-3 h-3 ml-1" />
    ) : null;

  const clearFilters = () => { setSearch(''); setCategoryFilter('all'); setStatusFilter('all'); };
  const hasFilters = search || categoryFilter !== 'all' || statusFilter !== 'all';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">All Articles</h1>
          <p className="text-sm text-slate-400 mt-0.5">{posts.length} total articles</p>
        </div>
        <Link href="/admin/create">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-orange-500/20">
            <Plus className="w-4 h-4" /> New Article
          </button>
        </Link>
      </div>

      {/* Search + Filters */}
      <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-4 space-y-3">
        <div className="flex gap-2">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, category, tag..."
              className="w-full h-10 pl-9 pr-4 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 h-10 rounded-xl border text-sm font-medium transition-colors ${showFilters || hasFilters ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:block">Filters</span>
            {hasFilters && <span className="w-1.5 h-1.5 bg-orange-400 rounded-full" />}
          </button>
          {/* View mode toggle (desktop) */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-xl p-1">
            <button onClick={() => setViewMode('table')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-white'}`}>
              <List className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-white'}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-800">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-9 px-3 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-orange-500 transition-colors"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 px-3 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-orange-500 transition-colors"
            >
              <option value="all">All Status</option>
              <option value="top">Top Stories</option>
              <option value="trending">Trending</option>
            </select>
            {hasFilters && (
              <button onClick={clearFilters} className="h-9 px-3 text-sm text-rose-400 hover:text-rose-300 bg-rose-500/10 rounded-lg border border-rose-500/20 flex items-center gap-1 transition-colors">
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
        )}

        <p className="text-xs text-slate-500">
          {filteredPosts.length} of {posts.length} articles
          {hasFilters && ' (filtered)'}
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-2 animate-pulse">
          {[...Array(6)].map((_, i) => <div key={i} className="h-16 bg-slate-800/50 rounded-xl border border-slate-800" />)}
        </div>
      ) : paginated.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7 text-slate-600" />
          </div>
          <p className="text-slate-300 font-semibold">No articles found</p>
          <p className="text-slate-500 text-sm">{hasFilters ? 'Try adjusting your filters.' : 'Create your first article!'}</p>
          <div className="flex gap-2 justify-center mt-2">
            {hasFilters && <button onClick={clearFilters} className="px-3 py-1.5 text-sm border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800">Clear filters</button>}
            <Link href="/admin/create"><button className="px-3 py-1.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600">+ New Article</button></Link>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid view */
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginated.map((post) => (
            <div key={post.id} className="group bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden hover:border-slate-600 transition-colors">
              <div className="relative aspect-video bg-slate-800">
                {post.imageUrl ? (
                  <Image src={post.imageUrl} alt={post.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><FileText className="w-8 h-8 text-slate-700" /></div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  {post.isTopStory && <span className="text-[9px] font-bold bg-orange-500 text-white px-1.5 py-0.5 rounded">TOP</span>}
                  {post.isTrending && <span className="text-[9px] font-bold bg-rose-500 text-white px-1.5 py-0.5 rounded">TRENDING</span>}
                </div>
              </div>
              <div className="p-4">
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px] mb-2">{post.category || 'General'}</Badge>
                <h3 className="text-sm font-semibold text-white line-clamp-2 leading-snug mb-2">{post.title}</h3>
                <p className="text-xs text-slate-500 mb-3">{formatDisplayDate(post.date)}</p>
                <div className="flex gap-2">
                  <Link href={`/admin/edit/${post.slug}`} className="flex-1">
                    <button className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition-colors border border-slate-700">
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                  </Link>
                  <button onClick={() => handleDelete(post.slug, post.title)} className="flex-1 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition-colors border border-rose-500/20">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table view */
        <>
          {/* Desktop */}
          <div className="hidden md:block bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-800 bg-slate-800/40">
                <tr>
                  <th className="px-5 py-3.5 w-14 text-xs font-semibold text-slate-400 uppercase tracking-wider">Thumb</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => toggleSort('title')}>
                    <span className="flex items-center">Title <SortIcon field="title" /></span>
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => toggleSort('category')}>
                    <span className="flex items-center">Category <SortIcon field="category" /></span>
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => toggleSort('date')}>
                    <span className="flex items-center">Date <SortIcon field="date" /></span>
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {paginated.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="relative w-12 h-9 rounded-lg overflow-hidden bg-slate-800">
                        {post.imageUrl ? (
                          <Image src={post.imageUrl} alt={post.title || 'Thumb'} fill className="object-cover" sizes="48px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600">
                            <FileText className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-white truncate max-w-[280px]" title={post.title}>{post.title}</p>
                      <p className="text-xs text-slate-600 truncate max-w-[280px]">/{post.slug}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">{post.category || 'General'}</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-400 whitespace-nowrap">
                      {formatDisplayDate(post.date)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1.5">
                        {post.isTopStory && <Badge className="bg-orange-500/15 text-orange-400 border-orange-500/25 text-[10px] px-1.5 py-0">Top</Badge>}
                        {post.isTrending && <Badge className="bg-rose-500/15 text-rose-400 border-rose-500/25 text-[10px] px-1.5 py-0">Trending</Badge>}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/edit/${post.slug}`}>
                          <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>
                        <button onClick={() => handleDelete(post.slug, post.title)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {paginated.map((post) => (
              <div key={post.id} className="bg-slate-900 border border-slate-700/50 rounded-xl p-3.5 flex gap-3">
                <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                  {post.imageUrl ? (
                    <Image src={post.imageUrl} alt={post.title || 'Thumb'} fill className="object-cover" sizes="80px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><FileText className="w-5 h-5 text-slate-700" /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white line-clamp-2 leading-snug">{post.title}</p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    <span className="text-[10px] text-slate-500">{formatDisplayDate(post.date)}</span>
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[9px] px-1.5 py-0">{post.category || 'General'}</Badge>
                    {post.isTopStory && <Badge className="bg-orange-500/15 text-orange-400 border-orange-500/25 text-[9px] px-1.5 py-0">Top</Badge>}
                    {post.isTrending && <Badge className="bg-rose-500/15 text-rose-400 border-rose-500/25 text-[9px] px-1.5 py-0">Trending</Badge>}
                  </div>
                  <div className="flex gap-2 mt-2.5">
                    <Link href={`/admin/edit/${post.slug}`} className="flex-1">
                      <button className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors border border-slate-700">
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </button>
                    </Link>
                    <button onClick={() => handleDelete(post.slug, post.title)} className="flex-1 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors border border-rose-500/20">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-slate-400 hidden sm:block">
            Page {currentPage} of {totalPages} · {filteredPosts.length} results
          </p>
          <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-2 py-1.5 text-xs bg-slate-800 border border-slate-700 text-slate-400 rounded-lg hover:text-white disabled:opacity-40"
            >
              «
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 bg-slate-800 border border-slate-700 text-slate-400 rounded-lg hover:text-white disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + i;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                    page === currentPage
                      ? 'bg-orange-500 border-orange-500 text-white font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 bg-slate-800 border border-slate-700 text-slate-400 rounded-lg hover:text-white disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2 py-1.5 text-xs bg-slate-800 border border-slate-700 text-slate-400 rounded-lg hover:text-white disabled:opacity-40"
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

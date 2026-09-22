'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  FileText, Layers, Star, TrendingUp, Plus, ExternalLink,
  Edit, Trash2, ArrowRight, Zap, BarChart3, RefreshCw,
} from 'lucide-react';
import { deletePost } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Post } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const fetchPosts = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const response = await fetch('/api/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (slug: string) => {
    if (!window.confirm('Delete this article? This cannot be undone.')) return;
    try {
      await deletePost(slug);
      toast({ title: 'Article deleted' });
      fetchPosts();
    } catch {
      toast({ variant: 'destructive', title: 'Failed to delete' });
    }
  };

  const totalArticles = posts.length;
  const categories = new Set(posts.map((p) => p.category)).size;
  const topStories = posts.filter((p) => p.isTopStory).length;
  const trending = posts.filter((p) => p.isTrending).length;

  const recentPosts = posts.slice(0, 8);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back 👋
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => fetchPosts(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Link href="/" target="_blank">
            <button className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-sm transition-colors">
              <ExternalLink className="w-4 h-4" /> View Site
            </button>
          </Link>
          <Link href="/admin/create">
            <button className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold rounded-lg text-sm transition-all shadow-lg shadow-orange-500/20">
              <Plus className="w-4 h-4" /> New Article
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Total Articles" value={loading ? undefined : totalArticles} icon={FileText} gradient="from-blue-600 to-cyan-600" glow="cyan" />
        <StatCard title="Categories" value={loading ? undefined : categories} icon={Layers} gradient="from-purple-600 to-pink-600" glow="purple" />
        <StatCard title="Top Stories" value={loading ? undefined : topStories} icon={Star} gradient="from-orange-600 to-amber-600" glow="orange" />
        <StatCard title="Trending" value={loading ? undefined : trending} icon={TrendingUp} gradient="from-rose-600 to-pink-600" glow="rose" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link href="/admin/create" className="group flex items-center gap-3 p-4 bg-gradient-to-r from-orange-500/10 to-rose-500/10 border border-orange-500/20 rounded-xl hover:border-orange-500/40 transition-all">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shrink-0">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">Write New Article</p>
            <p className="text-xs text-slate-400">Publish to your site instantly</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 ml-auto group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
        </Link>
        <Link href="/admin/articles" className="group flex items-center gap-3 p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:border-slate-600 transition-all">
          <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-slate-300" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">Manage Articles</p>
            <p className="text-xs text-slate-400">{totalArticles} articles total</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 ml-auto group-hover:text-white group-hover:translate-x-1 transition-all" />
        </Link>
        <Link href="/" target="_blank" className="group flex items-center gap-3 p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:border-slate-600 transition-all">
          <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">Live Website</p>
            <p className="text-xs text-slate-400">Preview the public site</p>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-500 ml-auto group-hover:text-white transition-colors" />
        </Link>
      </div>

      {/* Recent Articles */}
      <div className="bg-slate-900/60 backdrop-blur border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-orange-400" />
            <h2 className="font-bold text-white">Recent Articles</h2>
          </div>
          <Link href="/admin/articles" className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors">
            View all {totalArticles} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 w-full bg-slate-800/50 rounded-lg" />
            ))}
          </div>
        ) : recentPosts.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-slate-400 font-medium">No articles yet</p>
            <p className="text-slate-600 text-sm mt-1">Create your first article to get started</p>
            <Link href="/admin/create">
              <button className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg text-sm transition-colors">
                + Write Article
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-800/40 border-b border-slate-700/50">
                    <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider w-16">Thumb</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Title</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPosts.map((post) => (
                    <tr key={post.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="relative w-12 h-9 rounded-lg overflow-hidden bg-slate-800">
                          {post.imageUrl ? (
                            <Image src={post.imageUrl} alt={post.title} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                              <FileText className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-medium text-white truncate max-w-[280px]">{post.title}</p>
                        <p className="text-xs text-slate-500 truncate max-w-[280px]">/{post.slug}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
                          {post.category}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-400 whitespace-nowrap">
                        {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-1.5">
                          {post.isTopStory && <Badge className="bg-orange-500/15 text-orange-400 border-orange-500/25 text-[10px] px-1.5 py-0">Top</Badge>}
                          {post.isTrending && <Badge className="bg-rose-500/15 text-rose-400 border-rose-500/25 text-[10px] px-1.5 py-0">Trending</Badge>}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/admin/edit/${post.slug}`}>
                            <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(post.slug)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
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
            <div className="md:hidden divide-y divide-slate-800/50">
              {recentPosts.map((post) => (
                <div key={post.id} className="p-4 flex gap-3">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                    {post.imageUrl ? (
                      <Image src={post.imageUrl} alt={post.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-slate-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white line-clamp-2 leading-snug">{post.title}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-[10px] text-slate-500">
                        {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[9px] px-1.5 py-0">
                        {post.category}
                      </Badge>
                      {post.isTopStory && <Badge className="bg-orange-500/15 text-orange-400 border-orange-500/25 text-[9px] px-1.5 py-0">Top</Badge>}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Link href={`/admin/edit/${post.slug}`} className="flex-1">
                        <button className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition-colors border border-slate-700">
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(post.slug)}
                        className="flex-1 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition-colors border border-rose-500/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  gradient,
  glow,
}: {
  title: string;
  value?: number;
  icon: any;
  gradient: string;
  glow: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-slate-900 border border-slate-700/50 p-4 sm:p-5 hover:border-slate-600/50 transition-colors group`}>
      <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 blur-xl transition-opacity`} />
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      {value === undefined ? (
        <Skeleton className="h-8 w-16 bg-slate-800 mb-1" />
      ) : (
        <p className="text-2xl sm:text-3xl font-black text-white">{value}</p>
      )}
      <p className="text-xs text-slate-400 font-medium mt-0.5">{title}</p>
    </div>
  );
}

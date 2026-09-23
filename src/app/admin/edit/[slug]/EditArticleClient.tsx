'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Loader2,
  Save,
  X,
  Globe,
  Star,
  TrendingUp,
  Youtube,
  Tag,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Search,
  DollarSign,
  ExternalLink,
} from 'lucide-react';
import { updatePost } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RichEditor } from '@/components/admin/rich-editor';
import { ImageInput } from '@/components/admin/image-input';

const CATEGORIES = [
  'Bollywood', 'Hollywood', 'TV Serials', 'OTT', 'Entertainment',
  'Movies', 'South Cinema', 'Spoilers', 'Celebrity', 'Awards',
];

function generateSlug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string;
}

function CollapsibleSection({ title, icon, children, defaultOpen = true, badge }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-slate-900 border border-slate-700/60 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 sm:px-5 py-4 text-left hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-orange-400">{icon}</span>
          <span className="font-semibold text-slate-200 text-sm sm:text-base">{title}</span>
          {badge && (
            <span className="text-[10px] font-bold bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/30">
              {badge}
            </span>
          )}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
      </button>
      {open && <div className="px-4 sm:px-5 pb-5 pt-1 space-y-4 border-t border-slate-700/40">{children}</div>}
    </div>
  );
}

export default function EditArticleClient() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const slug = params.slug as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isTopStory, setIsTopStory] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [enableAds, setEnableAds] = useState(true);

  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');

  useEffect(() => {
    async function fetchPost() {
      try {
        let post: any = null;
        // 1. Check localStorage first
        try {
          const local = localStorage.getItem('tellyfilmy_posts');
          if (local) {
            const localPosts = JSON.parse(local);
            if (Array.isArray(localPosts)) {
              post = localPosts.find((p: any) => p.slug === slug);
            }
          }
        } catch {}

        // 2. Check /posts.json if not in localStorage
        if (!post) {
          try {
            const res = await fetch(`/posts.json?t=${Date.now()}`, { cache: 'no-store' });
            if (res.ok) {
              const data = await res.json();
              if (Array.isArray(data)) {
                post = data.find((p: any) => p.slug === slug);
              }
            }
          } catch {}
        }

        // 3. Fallback to /api/posts
        if (!post) {
          const res = await fetch('/api/posts');
          if (res.ok) {
            const data = await res.json();
            post = Array.isArray(data) ? data.find((p: any) => p.slug === slug) : null;
          }
        }

        if (!post) throw new Error('Post not found');

        setTitle(post.title || '');
        setCustomSlug(post.slug || '');
        setSlugEdited(true);
        setExcerpt(post.excerpt || '');
        setContent(post.content || '');
        setVideoUrl(post.videoUrl || '');
        setIsTopStory(post.isTopStory || false);
        setIsTrending(post.isTrending || false);
        setImageUrl(post.imageUrl || '');
        setImages(post.images || []);
        setTags(post.tags || []);
        setMetaTitle(post.metaTitle || '');
        setMetaDescription(post.metaDescription || '');
        setFocusKeyword(post.focusKeyword || '');
        setEnableAds(post.enableAds !== false);

        const knownCat = CATEGORIES.find((c) => c === post.category);
        if (knownCat) {
          setCategory(knownCat);
        } else if (post.category) {
          setCategory('__custom__');
          setCustomCategory(post.category);
          setIsCustomCategory(true);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchPost();
  }, [slug]);

  useEffect(() => {
    if (!slugEdited) setCustomSlug(generateSlug(title));
  }, [title, slugEdited]);

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const t = tagInput.trim();
      if (t && !tags.includes(t)) setTags([...tags, t]);
      setTagInput('');
    }
  };

  const addArticleImage = (url: string) => {
    if (url && !images.includes(url)) setImages([...images, url]);
  };

  const handleSave = async () => {
    const finalCategory = category === '__custom__' ? customCategory.trim() : category;
    if (!title.trim()) { toast({ title: 'Missing title', variant: 'destructive' }); return; }
    if (!finalCategory) { toast({ title: 'Missing category', variant: 'destructive' }); return; }
    if (!imageUrl) { toast({ title: 'Missing featured image', variant: 'destructive' }); return; }

    setSaving(true);
    try {
      const result = await updatePost(slug, {
        title: title.trim(),
        slug: customSlug || generateSlug(title),
        excerpt: excerpt.trim(),
        content: content.trim(),
        category: finalCategory,
        isTopStory,
        isTrending,
        imageUrl,
        images,
        tags,
        videoUrl: videoUrl.trim() || undefined,
        metaTitle: metaTitle.trim() || `${title.trim()} | TellyFilmy`,
        metaDescription: metaDescription.trim() || excerpt.trim(),
        focusKeyword: focusKeyword.trim(),
        enableAds,
      });

      if (result.success) {
        toast({ title: '✅ Article updated!' });
        router.push('/admin/articles');
      } else {
        throw new Error('Update failed');
      }
    } catch (err: any) {
      toast({ title: 'Save failed', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const seoScore = [
    title.length >= 30 && title.length <= 65,
    metaDescription.length >= 120 && metaDescription.length <= 160,
    !!focusKeyword,
    !!imageUrl,
    tags.length >= 3,
    content.length >= 300,
  ].filter(Boolean).length;
  const seoColor = seoScore >= 5 ? 'text-emerald-400' : seoScore >= 3 ? 'text-yellow-400' : 'text-rose-400';
  const seoBg = seoScore >= 5 ? 'bg-emerald-400' : seoScore >= 3 ? 'bg-yellow-400' : 'bg-rose-400';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex flex-col items-center justify-center gap-4">
        <p className="text-rose-400 text-lg">{error}</p>
        <button onClick={() => router.push('/admin/articles')} className="px-4 py-2 bg-slate-800 text-white rounded-lg">
          Back to Articles
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      <div className="sticky top-0 z-30 bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/admin/articles" className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-white truncate">Edit Article</h1>
            <p className="text-xs text-slate-500 truncate">/{customSlug || slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/posts/${slug}`}
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 text-sm font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> View Live
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-60 shadow-lg shadow-orange-500/20"
          >
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-4">
        <div className="bg-slate-900 border border-slate-700/60 rounded-xl px-4 sm:px-5 py-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article title..."
            className="w-full bg-transparent text-white text-xl sm:text-2xl font-bold placeholder:text-slate-600 focus:outline-none leading-snug"
          />
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500">Slug:</span>
            <input
              value={customSlug}
              onChange={(e) => { setCustomSlug(e.target.value); setSlugEdited(true); }}
              className="text-xs text-orange-400 bg-transparent border-b border-dashed border-slate-600 focus:outline-none focus:border-orange-500 transition-colors min-w-0 flex-1"
            />
            {slugEdited && (
              <button type="button" onClick={() => { setCustomSlug(generateSlug(title)); setSlugEdited(false); }} className="text-xs text-slate-500 hover:text-white">Reset</button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <CollapsibleSection title="Excerpt / Summary" icon={<Globe className="w-4 h-4" />}>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Write a compelling summary..."
                rows={3}
                maxLength={320}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none placeholder:text-slate-600"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>Ideal: 120–160 characters for SEO</span>
                <span className={excerpt.length > 160 ? 'text-orange-400' : ''}>{excerpt.length}/320</span>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Article Content" icon={<Globe className="w-4 h-4" />} badge="Rich Editor">
              <RichEditor id="content" value={content} onChange={setContent} minHeight="380px" />
            </CollapsibleSection>

            <CollapsibleSection title="YouTube Video" icon={<Youtube className="w-4 h-4" />}>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder:text-slate-600"
              />
            </CollapsibleSection>

            <CollapsibleSection title="SEO Settings" icon={<Search className="w-4 h-4" />} badge={`${seoScore}/6`} defaultOpen={false}>
              <div className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">SEO Score</span>
                  <span className={seoColor}>{seoScore}/6 — {seoScore >= 5 ? 'Excellent' : seoScore >= 3 ? 'Needs improvement' : 'Poor'}</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${seoBg}`} style={{ width: `${(seoScore / 6) * 100}%` }} />
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-slate-400 mb-1.5 block">Meta Title <span className="text-slate-600">(30–65 chars)</span></Label>
                  <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} maxLength={80} placeholder={`${title} | TellyFilmy`} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-orange-500 placeholder:text-slate-600" />
                  <div className="flex justify-end mt-1"><span className={`text-xs ${metaTitle.length > 65 ? 'text-orange-400' : 'text-slate-500'}`}>{metaTitle.length}/80</span></div>
                </div>
                <div>
                  <Label className="text-xs text-slate-400 mb-1.5 block">Meta Description <span className="text-slate-600">(120–160 chars)</span></Label>
                  <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} maxLength={200} rows={3} placeholder={excerpt || 'Compelling description...'} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-orange-500 resize-none placeholder:text-slate-600" />
                  <div className="flex justify-end mt-1"><span className={`text-xs ${metaDescription.length > 160 ? 'text-orange-400' : 'text-slate-500'}`}>{metaDescription.length}/200</span></div>
                </div>
                <div>
                  <Label className="text-xs text-slate-400 mb-1.5 block">Focus Keyword</Label>
                  <input value={focusKeyword} onChange={(e) => setFocusKeyword(e.target.value)} placeholder="e.g. Bollywood movie review" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-orange-500 placeholder:text-slate-600" />
                </div>
                {(metaTitle || title) && (
                  <div className="mt-2 p-3 bg-white rounded-lg">
                    <p className="text-blue-700 text-sm font-medium truncate hover:underline">{metaTitle || `${title} | TellyFilmy`}</p>
                    <p className="text-green-700 text-xs mt-0.5 truncate">https://tellyfilmy.com/posts/{customSlug || slug}</p>
                    <p className="text-slate-700 text-xs mt-1 line-clamp-2">{metaDescription || excerpt || 'No description set.'}</p>
                  </div>
                )}
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Monetization" icon={<DollarSign className="w-4 h-4" />} defaultOpen={false}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-200">Enable Google AdSense</p>
                  <p className="text-xs text-slate-500 mt-0.5">Show ads in this article</p>
                </div>
                <Switch checked={enableAds} onCheckedChange={setEnableAds} />
              </div>
            </CollapsibleSection>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-700/60 rounded-xl px-4 sm:px-5 py-4">
              <ImageInput value={imageUrl} onChange={setImageUrl} slug={customSlug || slug} imageType="main" label="Featured Image *" />
            </div>

            <div className="bg-slate-900 border border-slate-700/60 rounded-xl px-4 sm:px-5 py-4 space-y-3">
              <Label className="text-sm font-semibold text-slate-300 block">Category *</Label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => (
                  <button key={cat} type="button" onClick={() => setCategory(cat)} className={`px-3 py-2 rounded-lg text-xs font-semibold text-left transition-all border ${category === cat ? 'bg-orange-500 text-white border-orange-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-orange-500/50 hover:text-white'}`}>
                    {cat}
                  </button>
                ))}
                <button type="button" onClick={() => setCategory('__custom__')} className={`col-span-2 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-all border ${category === '__custom__' ? 'bg-orange-500 text-white border-orange-500' : 'bg-slate-800 text-slate-400 border-dashed border-slate-600 hover:border-orange-500/50'}`}>
                  + Custom Category
                </button>
              </div>
              {category === '__custom__' && (
                <input value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} placeholder="Type category name..." className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500" />
              )}
            </div>

            <div className="bg-slate-900 border border-slate-700/60 rounded-xl px-4 sm:px-5 py-4 space-y-3">
              <Label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Tag className="w-4 h-4 text-orange-400" /> Tags
              </Label>
              <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagAdd} placeholder="Type and press Enter..." className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 placeholder:text-slate-600" />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 bg-slate-800 border border-slate-700 text-slate-300 text-xs px-2.5 py-1 rounded-full">
                      {tag}
                      <button type="button" onClick={() => setTags(tags.filter((t) => t !== tag))} className="hover:text-rose-400 ml-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-700/60 rounded-xl px-4 sm:px-5 py-4 space-y-4">
              <Label className="text-sm font-semibold text-slate-300 block">Publishing Options</Label>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-200 flex items-center gap-1.5"><Star className="w-4 h-4 text-orange-400" /> Top Story</p>
                  <p className="text-xs text-slate-500 mt-0.5">Hero slider & featured section</p>
                </div>
                <Switch checked={isTopStory} onCheckedChange={setIsTopStory} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-200 flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-rose-400" /> Trending</p>
                  <p className="text-xs text-slate-500 mt-0.5">Show in trending section</p>
                </div>
                <Switch checked={isTrending} onCheckedChange={setIsTrending} />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-700/60 rounded-xl px-4 sm:px-5 py-4 space-y-3">
              <Label className="text-sm font-semibold text-slate-300 block">Additional Images</Label>
              <ImageInput value="" onChange={addArticleImage} slug={customSlug || slug} imageType="article" imageIndex={images.length} label="Add Article Image" />
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-slate-800 group border border-slate-700">
                      <Image src={img} alt={`Article ${idx}`} fill className="object-cover" />
                      <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))} className="absolute top-1 right-1 p-1 bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500">
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-60 shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
            >
              {saving ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : <><Save className="w-5 h-5" /> Save Changes</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

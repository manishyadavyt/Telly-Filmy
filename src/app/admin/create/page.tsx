'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Loader2,
  X,
  Globe,
  Star,
  TrendingUp,
  Youtube,
  Tag,
  Eye,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Search,
  DollarSign,
} from 'lucide-react';
import { addPost } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RichEditor } from '@/components/admin/rich-editor';
import { ImageInput } from '@/components/admin/image-input';

const CATEGORIES = [
  'Bollywood',
  'Hollywood',
  'TV Serials',
  'OTT',
  'Entertainment',
  'Movies',
  'South Cinema',
  'Spoilers',
  'Celebrity',
  'Awards',
];

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
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
        {open ? (
          <ChevronUp className="w-4 h-4 text-slate-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500" />
        )}
      </button>
      {open && <div className="px-4 sm:px-5 pb-5 pt-1 space-y-4 border-t border-slate-700/40">{children}</div>}
    </div>
  );
}

export default function CreateArticlePage() {
  const router = useRouter();
  const { toast } = useToast();

  // Core fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isTopStory, setIsTopStory] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [enableAds, setEnableAds] = useState(true);

  // Images
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState<string[]>([]);

  // SEO
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugEdited) {
      setSlug(generateSlug(title));
    }
  }, [title, slugEdited]);

  // Auto-fill meta title from title
  useEffect(() => {
    if (!metaTitle) {
      setMetaTitle(title ? `${title} | TellyFilmy` : '');
    }
  }, [title]);

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const addArticleImage = (url: string) => {
    if (url && !images.includes(url)) {
      setImages([...images, url]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalCategory = category === '__custom__' ? customCategory.trim() : category;

    if (!title.trim()) {
      toast({ title: 'Missing title', description: 'Please enter an article title.', variant: 'destructive' });
      return;
    }
    if (!content.trim()) {
      toast({ title: 'Missing content', description: 'Please write some article content.', variant: 'destructive' });
      return;
    }
    if (!finalCategory) {
      toast({ title: 'Missing category', description: 'Please select or enter a category.', variant: 'destructive' });
      return;
    }
    if (!imageUrl) {
      toast({ title: 'Missing image', description: 'Please add a featured image.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await addPost({
        title: title.trim(),
        slug: slug || generateSlug(title),
        excerpt: excerpt.trim() || content.substring(0, 160).trim() + '...',
        content: content.trim(),
        category: finalCategory,
        isTopStory,
        isTrending,
        imageUrl,
        imageHint: 'Featured Image',
        images,
        tags,
        videoUrl: videoUrl.trim() || undefined,
        metaTitle: metaTitle.trim() || `${title.trim()} | TellyFilmy`,
        metaDescription: metaDescription.trim() || excerpt.trim() || content.substring(0, 160).trim(),
        focusKeyword: focusKeyword.trim(),
        enableAds,
      });

      if (result.success) {
        toast({ title: '✅ Article published!', description: `"${title}" is now live.` });
        router.push('/admin');
      } else {
        throw new Error('Server returned failure');
      }
    } catch (err: any) {
      toast({ title: 'Publish failed', description: err.message || 'An error occurred', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const finalCategory = category === '__custom__' ? customCategory : category;
  const seoScore = [
    title.length >= 30 && title.length <= 65,
    metaDescription.length >= 120 && metaDescription.length <= 160,
    !!focusKeyword,
    !!imageUrl,
    tags.length >= 3,
    content.length >= 300,
  ].filter(Boolean).length;

  const seoColor =
    seoScore >= 5 ? 'text-emerald-400' : seoScore >= 3 ? 'text-yellow-400' : 'text-rose-400';
  const seoBg =
    seoScore >= 5 ? 'bg-emerald-400' : seoScore >= 3 ? 'bg-yellow-400' : 'bg-rose-400';

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-30 bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/admin"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-white truncate">New Article</h1>
            {slug && (
              <p className="text-xs text-slate-500 truncate">/{slug}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 text-sm font-medium transition-colors"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            type="submit"
            form="article-form"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-60 shadow-lg shadow-orange-500/20"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</>
            ) : (
              <><CheckCircle2 className="w-4 h-4" /> Publish</>
            )}
          </button>
        </div>
      </div>

      <form id="article-form" onSubmit={handleSubmit} className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-4">
        {/* Title */}
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
              value={slug}
              onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }}
              className="text-xs text-orange-400 bg-transparent border-b border-dashed border-slate-600 focus:outline-none focus:border-orange-500 transition-colors min-w-0 flex-1"
              placeholder="auto-generated-slug"
            />
            {slugEdited && (
              <button
                type="button"
                onClick={() => { setSlug(generateSlug(title)); setSlugEdited(false); }}
                className="text-xs text-slate-500 hover:text-white transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* LEFT: Content sections */}
          <div className="lg:col-span-2 space-y-4">

            {/* Excerpt */}
            <CollapsibleSection title="Excerpt / Summary" icon={<Globe className="w-4 h-4" />}>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Write a compelling summary (used for SEO meta description too)..."
                rows={3}
                maxLength={320}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none placeholder:text-slate-600"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>Ideal: 120–160 characters for SEO</span>
                <span className={excerpt.length > 160 ? 'text-orange-400' : ''}>{excerpt.length}/320</span>
              </div>
            </CollapsibleSection>

            {/* Content */}
            <CollapsibleSection title="Article Content" icon={<Globe className="w-4 h-4" />} badge="Rich Editor">
              <RichEditor
                id="content"
                value={content}
                onChange={setContent}
                placeholder={'Write your article here...\n\nUse the toolbar above for formatting.\n\nHTMl tags like <h2>, <p>, <strong>, <em>, <ul>, <blockquote> are supported.'}
                minHeight="380px"
              />
            </CollapsibleSection>

            {/* Video */}
            <CollapsibleSection title="YouTube Video" icon={<Youtube className="w-4 h-4" />}>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder:text-slate-600"
              />
              <p className="text-xs text-slate-500">Optional — embeds a YouTube video in the article.</p>
            </CollapsibleSection>

            {/* SEO */}
            <CollapsibleSection
              title="SEO Settings"
              icon={<Search className="w-4 h-4" />}
              badge={`${seoScore}/6`}
              defaultOpen={false}
            >
              {/* SEO Score Bar */}
              <div className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">SEO Score</span>
                  <span className={seoColor}>{seoScore}/6 — {seoScore >= 5 ? 'Excellent' : seoScore >= 3 ? 'Needs improvement' : 'Poor'}</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${seoBg}`}
                    style={{ width: `${(seoScore / 6) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-slate-400 mb-1.5 block">
                    Meta Title <span className="text-slate-600">(30–65 chars ideal)</span>
                  </Label>
                  <input
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    maxLength={80}
                    placeholder={`${title} | TellyFilmy`}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder:text-slate-600"
                  />
                  <div className="flex justify-end mt-1">
                    <span className={`text-xs ${metaTitle.length > 65 ? 'text-orange-400' : 'text-slate-500'}`}>
                      {metaTitle.length}/80
                    </span>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-slate-400 mb-1.5 block">
                    Meta Description <span className="text-slate-600">(120–160 chars ideal)</span>
                  </Label>
                  <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    maxLength={200}
                    placeholder={excerpt || 'Write a compelling description for search engines...'}
                    rows={3}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none placeholder:text-slate-600"
                  />
                  <div className="flex justify-end mt-1">
                    <span className={`text-xs ${metaDescription.length > 160 ? 'text-orange-400' : 'text-slate-500'}`}>
                      {metaDescription.length}/200
                    </span>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-slate-400 mb-1.5 block">Focus Keyword</Label>
                  <input
                    value={focusKeyword}
                    onChange={(e) => setFocusKeyword(e.target.value)}
                    placeholder="e.g. Bollywood movie review 2024"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder:text-slate-600"
                  />
                </div>

                {/* Google Search Preview */}
                {(metaTitle || title) && (
                  <div className="mt-2 p-3 bg-white rounded-lg">
                    <p className="text-blue-700 text-sm font-medium truncate hover:underline cursor-pointer">
                      {metaTitle || `${title} | TellyFilmy`}
                    </p>
                    <p className="text-green-700 text-xs mt-0.5 truncate">
                      https://tellyfilmy.com/posts/{slug}
                    </p>
                    <p className="text-slate-700 text-xs mt-1 line-clamp-2">
                      {metaDescription || excerpt || 'No description set.'}
                    </p>
                  </div>
                )}
              </div>
            </CollapsibleSection>

            {/* AdSense */}
            <CollapsibleSection title="Monetization" icon={<DollarSign className="w-4 h-4" />} defaultOpen={false}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-200">Enable Google AdSense</p>
                  <p className="text-xs text-slate-500 mt-0.5">Show ads in this article (in-article & sidebar)</p>
                </div>
                <Switch
                  id="enable-ads"
                  checked={enableAds}
                  onCheckedChange={setEnableAds}
                />
              </div>
              {enableAds && (
                <div className="mt-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <p className="text-xs text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    AdSense ads will be shown automatically in this article.
                  </p>
                </div>
              )}
            </CollapsibleSection>

          </div>

          {/* RIGHT: Sidebar settings */}
          <div className="space-y-4">

            {/* Featured Image */}
            <div className="bg-slate-900 border border-slate-700/60 rounded-xl px-4 sm:px-5 py-4">
              <ImageInput
                value={imageUrl}
                onChange={setImageUrl}
                slug={slug}
                imageType="main"
                label="Featured Image *"
              />
            </div>

            {/* Category */}
            <div className="bg-slate-900 border border-slate-700/60 rounded-xl px-4 sm:px-5 py-4 space-y-3">
              <Label className="text-sm font-semibold text-slate-300 block">Category *</Label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold text-left transition-all border ${
                      category === cat
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-orange-500/50 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setCategory('__custom__')}
                  className={`col-span-2 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-all border ${
                    category === '__custom__'
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-slate-800 text-slate-400 border-dashed border-slate-600 hover:border-orange-500/50 hover:text-white'
                  }`}
                >
                  + Custom Category
                </button>
              </div>
              {category === '__custom__' && (
                <input
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Type category name..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
              )}
            </div>

            {/* Tags */}
            <div className="bg-slate-900 border border-slate-700/60 rounded-xl px-4 sm:px-5 py-4 space-y-3">
              <Label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Tag className="w-4 h-4 text-orange-400" /> Tags
              </Label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagAdd}
                placeholder="Type and press Enter or comma..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-slate-600"
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 bg-slate-800 border border-slate-700 text-slate-300 text-xs px-2.5 py-1 rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => setTags(tags.filter((t) => t !== tag))}
                        className="hover:text-rose-400 transition-colors ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-slate-600">Tags help with SEO. Add at least 3–5 tags.</p>
            </div>

            {/* Publishing options */}
            <div className="bg-slate-900 border border-slate-700/60 rounded-xl px-4 sm:px-5 py-4 space-y-4">
              <Label className="text-sm font-semibold text-slate-300 block">Publishing Options</Label>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-200 flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-orange-400" /> Top Story
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Hero slider & featured section</p>
                </div>
                <Switch id="top-story" checked={isTopStory} onCheckedChange={setIsTopStory} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-200 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-rose-400" /> Trending
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Show in trending section</p>
                </div>
                <Switch id="trending" checked={isTrending} onCheckedChange={setIsTrending} />
              </div>
            </div>

            {/* Additional Images */}
            <div className="bg-slate-900 border border-slate-700/60 rounded-xl px-4 sm:px-5 py-4 space-y-3">
              <Label className="text-sm font-semibold text-slate-300 block">Additional Images</Label>
              <ImageInput
                value=""
                onChange={addArticleImage}
                slug={slug}
                imageType="article"
                imageIndex={images.length}
                label="Add Article Image"
              />
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-slate-800 group border border-slate-700">
                      <Image src={img} alt={`Article ${idx}`} fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 p-1 bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Publish button mobile */}
            <button
              type="submit"
              form="article-form"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-60 shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Publishing Article...</>
              ) : (
                <><CheckCircle2 className="w-5 h-5" /> Publish Article</>
              )}
            </button>

          </div>
        </div>
      </form>
    </div>
  );
}

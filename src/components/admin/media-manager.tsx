'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import {
  Upload,
  Link2,
  Loader2,
  X,
  Star,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Plus,
  FileCode,
  Copy,
  Check,
  ImageIcon,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MediaManagerProps {
  featuredImage: string;
  onFeaturedImageChange: (url: string) => void;
  galleryImages: string[];
  onGalleryImagesChange: (urls: string[]) => void;
  onInsertIntoContent?: (url: string, alt?: string) => void;
  slug: string;
}

const UPLOAD_SECRET = 'tellyfilmy_upload_2024';
const UPLOAD_ENDPOINT = '/upload.php';

export function MediaManager({
  featuredImage,
  onFeaturedImageChange,
  galleryImages = [],
  onGalleryImagesChange,
  onInsertIntoContent,
  slug,
}: MediaManagerProps) {
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Upload single file helper — NEVER uses base64 (base64 URLs break on other devices)
  const uploadSingleFile = async (
    file: File,
    index: number,
    total: number
  ): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('slug', slug || 'article');
      formData.append('imageType', 'article');
      formData.append('imageIndex', (Date.now() + index).toString());
      formData.append('secret', UPLOAD_SECRET);

      const res = await fetch(UPLOAD_ENDPOINT, {
        method: 'POST',
        headers: {
          'X-Upload-Secret': UPLOAD_SECRET,
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.url) {
          return data.url as string;
        }
        const errMsg = data?.error || 'Server did not return an image URL.';
        throw new Error(errMsg);
      } else {
        let errMsg = `Upload failed (HTTP ${res.status})`;
        try {
          const errData = await res.json();
          if (errData?.error) errMsg = errData.error;
        } catch {}
        throw new Error(errMsg);
      }
    } catch (err: any) {
      // Re-throw with file context so the caller can report which file failed
      throw new Error(`"${file.name}": ${err.message || 'Upload error'}`);
    }
  };

  // Handle multi-file upload — only saves server URLs, never base64
  const handleFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) {
      toast({
        title: 'Invalid file format',
        description: 'Please select valid image files (JPG, PNG, WEBP, GIF).',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    setUploadProgress(10);
    setUploadStatus(`Uploading 1 of ${fileArray.length}...`);

    const newUploadedUrls: string[] = [];
    const failedFiles: string[] = [];

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      setUploadStatus(`Uploading ${i + 1} of ${fileArray.length}: ${file.name}...`);
      try {
        const url = await uploadSingleFile(file, i, fileArray.length);
        if (url) newUploadedUrls.push(url);
      } catch (err: any) {
        console.error('Upload failed:', err);
        failedFiles.push(err.message || file.name);
      }
      setUploadProgress(Math.round(((i + 1) / fileArray.length) * 100));
    }

    setUploading(false);
    setUploadProgress(0);
    setUploadStatus('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Report failures
    if (failedFiles.length > 0) {
      toast({
        title: `⚠️ ${failedFiles.length} image(s) failed to upload`,
        description: `Failed: ${failedFiles.slice(0, 2).join(', ')}${failedFiles.length > 2 ? ` +${failedFiles.length - 2} more` : ''}. Check server upload.php permissions.`,
        variant: 'destructive',
      });
    }

    if (newUploadedUrls.length === 0) return;

    // Add to gallery or set as featured if featured is empty
    let updatedFeatured = featuredImage;
    let updatedGallery = [...galleryImages];

    if (!updatedFeatured && newUploadedUrls.length > 0) {
      updatedFeatured = newUploadedUrls[0];
      onFeaturedImageChange(updatedFeatured);
      const remaining = newUploadedUrls.slice(1);
      if (remaining.length > 0) {
        updatedGallery = [...updatedGallery, ...remaining];
        onGalleryImagesChange(updatedGallery);
      }
    } else {
      updatedGallery = [...updatedGallery, ...newUploadedUrls];
      onGalleryImagesChange(updatedGallery);
    }

    toast({
      title: `✅ ${newUploadedUrls.length} image(s) uploaded!`,
      description: `Images are saved to the server and will load on all devices.`,
    });
  };

  // Handle URL addition
  const handleAddUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      toast({ title: 'Please enter a valid image URL', variant: 'destructive' });
      return;
    }

    if (!featuredImage) {
      onFeaturedImageChange(trimmed);
      toast({ title: '✅ Set as featured image!' });
    } else if (!galleryImages.includes(trimmed)) {
      onGalleryImagesChange([...galleryImages, trimmed]);
      toast({ title: '✅ Added to article gallery!' });
    } else {
      toast({ title: 'Image is already in article' });
    }
    setUrlInput('');
  };

  // Set an image as featured
  const setAsFeatured = (url: string) => {
    if (!url) return;
    const oldFeatured = featuredImage;

    // Set new featured
    onFeaturedImageChange(url);

    // If it was in gallery, replace with old featured
    let newGallery = galleryImages.filter((img) => img !== url);
    if (oldFeatured && oldFeatured !== url && !newGallery.includes(oldFeatured)) {
      newGallery.unshift(oldFeatured);
    }
    onGalleryImagesChange(newGallery);

    toast({ title: '⭐ Set as Featured Image!' });
  };

  // Remove an image
  const removeImage = (url: string, isFeatured: boolean) => {
    if (isFeatured) {
      if (galleryImages.length > 0) {
        // Promote first gallery image to featured
        const nextFeatured = galleryImages[0];
        onFeaturedImageChange(nextFeatured);
        onGalleryImagesChange(galleryImages.slice(1));
        toast({ title: 'Featured image removed, next image promoted' });
      } else {
        onFeaturedImageChange('');
        toast({ title: 'Featured image removed' });
      }
    } else {
      onGalleryImagesChange(galleryImages.filter((img) => img !== url));
      toast({ title: 'Image removed from gallery' });
    }
  };

  // Move gallery image left/right
  const moveGalleryImage = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= galleryImages.length) return;

    const updated = [...galleryImages];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    onGalleryImagesChange(updated);
  };

  // Copy URL to clipboard
  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast({ title: 'Link copied to clipboard!' });
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  // Insert into content helper
  const handleInsert = (url: string) => {
    if (onInsertIntoContent) {
      onInsertIntoContent(url, `${slug || 'article'} image`);
      toast({ title: '📝 Inserted image into article content!' });
    }
  };

  const allImages = [
    ...(featuredImage ? [{ url: featuredImage, isFeatured: true }] : []),
    ...galleryImages
      .filter((img) => img !== featuredImage)
      .map((url) => ({ url, isFeatured: false })),
  ];

  return (
    <div className="space-y-4">
      {/* Header with quick stats */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-orange-400" /> Article Images & Media
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {allImages.length} total image{allImages.length === 1 ? '' : 's'} · {featuredImage ? 'Featured image set' : 'No featured image'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-lg border border-slate-700 overflow-hidden text-xs font-semibold">
        <button
          type="button"
          onClick={() => setTab('upload')}
          className={`flex-1 py-2 flex items-center justify-center gap-1.5 transition-colors ${
            tab === 'upload'
              ? 'bg-orange-500 text-white'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Upload className="w-3.5 h-3.5" /> Upload Multiple Images
        </button>
        <button
          type="button"
          onClick={() => setTab('url')}
          className={`flex-1 py-2 flex items-center justify-center gap-1.5 transition-colors ${
            tab === 'url'
              ? 'bg-orange-500 text-white'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Link2 className="w-3.5 h-3.5" /> Add by URL
        </button>
      </div>

      {/* Upload Zone */}
      {tab === 'upload' ? (
        <div
          className="border-2 border-dashed border-slate-700 hover:border-orange-500 rounded-xl p-5 sm:p-6 flex flex-col items-center justify-center gap-3 text-center cursor-pointer hover:bg-orange-500/5 transition-all group"
          onClick={() => !uploading && fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (!uploading && e.dataTransfer.files) {
              handleFiles(e.dataTransfer.files);
            }
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            multiple
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            disabled={uploading}
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-3 w-full py-2">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              <div className="w-full max-w-xs space-y-1.5">
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-rose-500 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-300 font-medium truncate">{uploadStatus}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-orange-500/10 transition-colors">
                <Upload className="w-6 h-6 text-slate-400 group-hover:text-orange-400 transition-colors" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-200">
                  Click to select multiple images or drag & drop
                </p>
                <p className="text-xs text-slate-500">
                  Select JPG, PNG, WEBP, GIF · Upload as many as needed
                </p>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-slate-600"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddUrl();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddUrl}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Paste any direct image URL (Google Drive, Cloudinary, Imgur, etc.)
          </p>
        </div>
      )}

      {/* Uploaded Images Gallery Grid */}
      {allImages.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Manage Article Images ({allImages.length})
            </span>
            <span className="text-[11px] text-slate-500">
              Click ⭐ to set as Featured Thumbnail
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {allImages.map((item, idx) => {
              const galleryIdx = galleryImages.indexOf(item.url);
              const isFirstGallery = galleryIdx === 0;
              const isLastGallery = galleryIdx === galleryImages.length - 1;

              return (
                <div
                  key={idx}
                  className={`relative rounded-xl overflow-hidden bg-slate-800/90 border transition-all duration-200 flex flex-col ${
                    item.isFeatured
                      ? 'border-orange-500 shadow-md shadow-orange-500/10 ring-1 ring-orange-500/30'
                      : 'border-slate-700/80 hover:border-slate-600'
                  }`}
                >
                  {/* Image Preview */}
                  <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                    <Image
                      src={item.url}
                      alt={`Article Image ${idx + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />

                    {/* Badge */}
                    <div className="absolute top-2 left-2 flex gap-1.5">
                      {item.isFeatured ? (
                        <span className="bg-orange-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
                          <Star className="w-3 h-3 fill-white" /> Featured Image
                        </span>
                      ) : (
                        <span className="bg-slate-900/80 backdrop-blur-sm text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/10">
                          Gallery #{galleryIdx + 1}
                        </span>
                      )}
                    </div>

                    {/* Quick Delete Top Right */}
                    <button
                      type="button"
                      onClick={() => removeImage(item.url, item.isFeatured)}
                      title="Delete image from article"
                      className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-rose-600 text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="p-2.5 bg-slate-850 border-t border-slate-700/60 flex items-center justify-between gap-1.5 flex-wrap">
                    {/* Left Actions */}
                    <div className="flex items-center gap-1">
                      {!item.isFeatured && (
                        <button
                          type="button"
                          onClick={() => setAsFeatured(item.url)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors"
                          title="Set as featured hero image"
                        >
                          <Star className="w-3 h-3" /> Make Featured
                        </button>
                      )}

                      {onInsertIntoContent && (
                        <button
                          type="button"
                          onClick={() => handleInsert(item.url)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
                          title="Insert <img /> tag directly into editor content"
                        >
                          <FileCode className="w-3 h-3 text-cyan-400" /> Insert in Text
                        </button>
                      )}
                    </div>

                    {/* Right Reorder & Copy */}
                    <div className="flex items-center gap-1">
                      {!item.isFeatured && galleryImages.length > 1 && (
                        <>
                          <button
                            type="button"
                            disabled={isFirstGallery}
                            onClick={() => moveGalleryImage(galleryIdx, 'left')}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            title="Move left"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={isLastGallery}
                            onClick={() => moveGalleryImage(galleryIdx, 'right')}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            title="Move right"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() => copyUrl(item.url)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                        title="Copy image link"
                      >
                        {copiedUrl === item.url ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

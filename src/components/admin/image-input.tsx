'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, Link2, Loader2, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageInputProps {
  value: string;
  onChange: (url: string) => void;
  slug: string;
  imageType?: 'main' | 'article';
  imageIndex?: number;
  label?: string;
}

// imgbb free image hosting — set NEXT_PUBLIC_IMGBB_API_KEY in your .env.local
// Get a free key at: https://api.imgbb.com/
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY ?? '';

export function ImageInput({
  value,
  onChange,
  slug,
  imageType = 'main',
  imageIndex = 0,
  label = 'Featured Image',
}: ImageInputProps) {
  const [tab, setTab] = useState<'upload' | 'url'>(IMGBB_API_KEY ? 'upload' : 'url');
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    let file: File | null = null;

    if ('dataTransfer' in e) {
      file = (e as React.DragEvent<HTMLDivElement>).dataTransfer.files[0];
    } else {
      file = (e as React.ChangeEvent<HTMLInputElement>).target.files?.[0] || null;
    }

    if (!file) return;

    // Validate file size (max 32MB for imgbb free tier)
    if (file.size > 32 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please use an image under 32MB.',
        variant: 'destructive',
      });
      return;
    }

    if (!IMGBB_API_KEY) {
      toast({
        title: 'imgbb API key missing',
        description:
          'Add NEXT_PUBLIC_IMGBB_API_KEY to your .env.local file. Get a free key at api.imgbb.com',
        variant: 'destructive',
      });
      // Auto-switch to URL tab so user can still use the URL option
      setTab('url');
      return;
    }

    setUploading(true);
    setUploadProgress(10);

    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Strip the data:image/...;base64, prefix
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file!);
      });

      setUploadProgress(40);

      // Generate a descriptive image name
      const ext = file.name.split('.').pop() || 'jpg';
      const imageName = slug
        ? `${slug}-${imageType}${imageIndex > 0 ? `-${imageIndex}` : ''}.${ext}`
        : `upload-${Date.now()}.${ext}`;

      // Upload to imgbb
      const formData = new FormData();
      formData.append('key', IMGBB_API_KEY);
      formData.append('image', base64);
      formData.append('name', imageName);

      setUploadProgress(60);

      const res = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(90);

      const data = await res.json();

      if (data.success && data.data?.url) {
        // Prefer display_url (direct image link without HTML wrapper)
        const imageUrl: string = data.data.display_url || data.data.url;
        onChange(imageUrl);
        toast({ title: '✅ Image uploaded successfully!' });
        setUploadProgress(100);
      } else {
        throw new Error(data.error?.message || 'imgbb upload failed');
      }
    } catch (err: any) {
      toast({
        title: 'Upload failed',
        description: err.message || 'Could not upload to imgbb. Try pasting an image URL instead.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const applyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    onChange(trimmed);
    setUrlInput('');
    toast({ title: '✅ Image URL set!' });
  };

  const noApiKey = !IMGBB_API_KEY;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-300">{label}</span>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Remove
          </button>
        )}
      </div>

      {/* Preview */}
      {value && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
          <Image src={value} alt="Preview" fill className="object-cover" unoptimized />
        </div>
      )}

      {/* API key missing warning banner */}
      {noApiKey && tab === 'upload' && (
        <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <div className="text-xs text-amber-300">
            <p className="font-semibold">imgbb API key not configured</p>
            <p className="mt-0.5 text-amber-400/80">
              Add <code className="bg-black/30 px-1 rounded">NEXT_PUBLIC_IMGBB_API_KEY</code> to{' '}
              <code className="bg-black/30 px-1 rounded">.env.local</code>.{' '}
              <a
                href="https://api.imgbb.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-amber-200"
              >
                Get a free key →
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex rounded-lg border border-slate-700 overflow-hidden text-xs font-semibold">
        <button
          type="button"
          onClick={() => setTab('upload')}
          className={`flex-1 py-2 flex items-center justify-center gap-1.5 transition-colors ${
            tab === 'upload' ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Upload className="w-3.5 h-3.5" /> Upload File
        </button>
        <button
          type="button"
          onClick={() => setTab('url')}
          className={`flex-1 py-2 flex items-center justify-center gap-1.5 transition-colors ${
            tab === 'url' ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Link2 className="w-3.5 h-3.5" /> Paste URL
        </button>
      </div>

      {tab === 'upload' ? (
        <div
          className="border-2 border-dashed border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center gap-3 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-500/5 transition-all group"
          onClick={() => !uploading && fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileUpload}
        >
          <input
            type="file"
            ref={fileRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-3 w-full">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              <div className="w-full max-w-[200px]">
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1 text-center">
                  Uploading to imgbb... {uploadProgress}%
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-orange-500/10 transition-colors">
                <ImageIcon className="w-6 h-6 text-slate-400 group-hover:text-orange-400 transition-colors" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-300">
                  {noApiKey ? 'Configure API key to enable upload' : 'Tap to upload or drag & drop'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {noApiKey ? 'Or use the "Paste URL" tab' : 'PNG, JPG, WEBP up to 32MB · Hosted on imgbb'}
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
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), applyUrl())}
              placeholder="https://example.com/image.jpg"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-slate-600"
            />
            <button
              type="button"
              onClick={applyUrl}
              disabled={!urlInput.trim()}
              className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              Set
            </button>
          </div>
          <p className="text-xs text-slate-600">
            Paste any public image URL (Google Drive, Cloudinary, imgbb, etc.)
          </p>
        </div>
      )}
    </div>
  );
}

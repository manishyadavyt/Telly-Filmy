'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, Link2, Loader2, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageInputProps {
  value: string;
  onChange: (url: string) => void;
  slug: string;
  imageType?: 'main' | 'article';
  imageIndex?: number;
  label?: string;
}

// Secret key must match UPLOAD_SECRET in public_html/upload.php
const UPLOAD_SECRET = 'tellyfilmy_upload_2024';
const UPLOAD_ENDPOINT = '/upload.php';

export function ImageInput({
  value,
  onChange,
  slug,
  imageType = 'main',
  imageIndex = 0,
  label = 'Featured Image',
}: ImageInputProps) {
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
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

    // Validate type
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      toast({ title: 'Invalid file type', description: 'Only JPG, PNG, WEBP, GIF allowed.', variant: 'destructive' });
      return;
    }

    // Validate size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Maximum file size is 10MB.', variant: 'destructive' });
      return;
    }

    if (!slug) {
      toast({ title: 'Title required', description: 'Enter a title first to generate the slug.', variant: 'destructive' });
      return;
    }

    setUploading(true);
    setUploadProgress(20);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('slug', slug);
      formData.append('imageType', imageType);
      formData.append('imageIndex', imageIndex.toString());
      formData.append('secret', UPLOAD_SECRET);

      setUploadProgress(50);

      const res = await fetch(UPLOAD_ENDPOINT, {
        method: 'POST',
        headers: {
          'X-Upload-Secret': UPLOAD_SECRET,
        },
        body: formData,
      });

      setUploadProgress(85);

      const data = await res.json();

      if (res.ok && data.url) {
        onChange(data.url);
        toast({ title: '✅ Image uploaded!', description: 'Saved to your Hostinger server.' });
        setUploadProgress(100);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err: any) {
      toast({
        title: 'Upload failed',
        description: err.message || 'Could not upload. Try using "Paste URL" tab instead.',
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
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileUpload}
            disabled={uploading}
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-3 w-full">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              <div className="w-full max-w-[200px]">
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1.5 text-center">
                  Uploading to server... {uploadProgress}%
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-orange-500/10 transition-colors">
                <ImageIcon className="w-6 h-6 text-slate-400 group-hover:text-orange-400 transition-colors" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-300">Tap to upload or drag & drop</p>
                <p className="text-xs text-slate-500 mt-1">JPG, PNG, WEBP up to 10MB · Stored on your server</p>
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
            Paste any public image URL as an alternative to file upload.
          </p>
        </div>
      )}
    </div>
  );
}

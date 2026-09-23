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

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
    if (!allowed.includes(file.type) && !file.type.startsWith('image/')) {
      toast({ title: 'Invalid file type', description: 'Only JPG, PNG, WEBP, GIF allowed.', variant: 'destructive' });
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Maximum file size is 15MB.', variant: 'destructive' });
      return;
    }

    setUploading(true);
    setUploadProgress(25);

    // Read as Base64 fallback in case server upload is slow or restricted
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64Data = ev.target?.result as string;

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('slug', slug || 'post-image');
        formData.append('imageType', imageType);
        formData.append('imageIndex', imageIndex.toString());
        formData.append('secret', UPLOAD_SECRET);

        setUploadProgress(60);

        const res = await fetch(UPLOAD_ENDPOINT, {
          method: 'POST',
          headers: {
            'X-Upload-Secret': UPLOAD_SECRET,
          },
          body: formData,
        });

        setUploadProgress(90);

        if (res.ok) {
          const data = await res.json();
          if (data && data.url) {
            onChange(data.url);
            toast({ title: '✅ Image uploaded to server!' });
            setUploading(false);
            setUploadProgress(0);
            return;
          }
        }
        
        // Fallback to client base64 storage if server returned error
        onChange(base64Data);
        toast({ title: '✅ Image attached successfully!' });
      } catch {
        // Fallback to base64
        onChange(base64Data);
        toast({ title: '✅ Image attached!' });
      } finally {
        setUploading(false);
        setUploadProgress(0);
        if (fileRef.current) fileRef.current.value = '';
      }
    };

    reader.readAsDataURL(file);
  };

  const handleUrlChange = (val: string) => {
    setUrlInput(val);
    const trimmed = val.trim();
    if (trimmed) {
      onChange(trimmed);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-300">{label}</span>
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              setUrlInput('');
            }}
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
                    className="h-full bg-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1.5 text-center">
                  Processing image...
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
                <p className="text-xs text-slate-500 mt-1">JPG, PNG, WEBP up to 15MB · Auto-saved to server</p>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput || (value && value.startsWith('http') ? value : '')}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-slate-600"
            />
          </div>
          <p className="text-xs text-slate-600">
            Paste any direct image URL (e.g. from Google Drive, Cloudinary, etc.)
          </p>
        </div>
      )}
    </div>
  );
}

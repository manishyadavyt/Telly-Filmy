'use client';

import { Facebook, Twitter, MessageCircle, Share2, Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to copy link
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3 text-muted-foreground">
      <div className="flex items-center gap-2">
        {/* Facebook */}
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#1877F2] transition-colors p-1"
          aria-label="Share on Facebook"
        >
          <Facebook className="h-5 w-5" />
        </a>

        {/* Twitter */}
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-black transition-colors p-1"
          aria-label="Share on X (Twitter)"
        >
          <Twitter className="h-5 w-5" />
        </a>

        {/* WhatsApp */}
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#25D366] transition-colors p-1"
          aria-label="Share on WhatsApp"
        >
          <MessageCircle className="h-5 w-5" />
        </a>

        {/* Native Share / Copy Link */}
        <button
          onClick={handleNativeShare}
          className="hover:text-primary transition-colors p-1"
          aria-label="Share"
        >
          {copied ? <Check className="h-5 w-5 text-green-500" /> : <Share2 className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}

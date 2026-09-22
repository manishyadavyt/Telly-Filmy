import type { Metadata } from 'next';
import "./globals.css";
import { Plus_Jakarta_Sans, Outfit } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { BackToTopButton } from '@/components/back-to-top-button';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';
import Script from 'next/script';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['500', '600', '700', '800', '900'],
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.tellyfilmy.com'),
  title: 'Telly Filmy – Entertainment News, TV Serials & Bollywood Updates',
  description:
    'Get the latest TV serial updates, Bollywood news, web stories, and trending entertainment updates on Telly Filmy.',
  alternates: {
    canonical: 'https://www.tellyfilmy.com',
  },
  openGraph: {
    title: 'Telly Filmy – Entertainment News, TV Serials & Bollywood Updates',
    description:
      'Latest TV serials, Bollywood news & trending entertainment stories.',
    url: 'https://www.tellyfilmy.com',
    siteName: 'Telly Filmy',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: 'Telly Filmy Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Telly Filmy – Entertainment News & Bollywood Updates',
    description:
      'Get the latest entertainment news, serial updates & Bollywood updates.',
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${plusJakartaSans.variable} ${outfit.variable}`}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7269LC27VB"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7269LC27VB', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body className="font-sans antialiased bg-[#fff8f9] text-slate-900 selection:bg-rose-500/20 selection:text-rose-600 pb-16 lg:pb-0">
        <div className="relative flex min-h-screen flex-col bg-[#fff8f9]">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <MobileBottomNav />
        <BackToTopButton />
        <Toaster />
      </body>
    </html>
  );
}

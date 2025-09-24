import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BackToTopButton } from '@/components/back-to-top-button';
import Script from 'next/script'; // ✅ for Google Analytics

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Telly Filmy – Entertainment News & Bollywood Updates',
  description:
    'Get the latest TV serial updates, Bollywood news, web stories, and entertainment trends on Telly Filmy.',
  openGraph: {
    title: 'Telly Filmy – Entertainment News, TV Serials & Bollywood Updates',
    description:
      'Latest TV serials, Bollywood news & trending entertainment stories.',
    url: 'https://www.tellyfilmy.com',
    siteName: 'Telly Filmy',
    images: [
      {
        url: '/Public/logo.png',
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
    title: 'Telly Filmy – Entertainment News, TV Serials & Bollywood Updates',
    description:
      'Get the latest entertainment news, serial updates & Bollywood buzz.',
    images: ['/Public/logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ✅ Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7269LC27VB"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7269LC27VB');
          `}
        </Script>
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="relative flex min-h-screen flex-col bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <BackToTopButton />
        <Toaster />
      </body>
    </html>
  );
}

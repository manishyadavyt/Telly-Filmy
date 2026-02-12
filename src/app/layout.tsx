import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Script from "next/script";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tellyfilmy.com"),

  title: {
    default: "Telly Filmy – Entertainment News & Bollywood Updates",
    template: "%s | Telly Filmy",
  },

  description:
    "Get the latest TV serial updates, Bollywood news, web stories, and entertainment trends on Telly Filmy.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Telly Filmy – Entertainment News, TV Serials & Bollywood Updates",
    description:
      "Latest TV serials, Bollywood news & trending entertainment stories.",
    url: "/",
    siteName: "Telly Filmy",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Telly Filmy",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Telly Filmy – Entertainment News & Bollywood Updates",
    description:
      "Get the latest entertainment news, serial updates & Bollywood buzz.",
    images: ["/logo.png"],
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        
        {/* Google Analytics */}
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

        <div className="relative flex min-h-screen flex-col bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>

        <Toaster />
      </body>
    </html>
  );
}

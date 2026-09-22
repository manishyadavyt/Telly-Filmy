// src/app/about/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Telly Filmy',
  description:
    'Learn more about Telly Filmy – your premier portal for TV serial updates, spoilers, Bollywood news, celebrity interviews, and entertainment journalism.',
  alternates: {
    canonical: 'https://www.tellyfilmy.com/about',
  },
  openGraph: {
    title: 'About Us | Telly Filmy',
    description:
      'Learn more about Telly Filmy – your premier portal for TV serial updates, spoilers, Bollywood news, and celebrity interviews.',
    url: 'https://www.tellyfilmy.com/about',
    siteName: 'Telly Filmy',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      <Card className="overflow-hidden border border-rose-100 shadow-sm rounded-3xl">
        <CardHeader className="bg-gradient-to-br from-rose-50 to-orange-50 p-8 text-center">
          <Newspaper className="mx-auto h-16 w-16 text-[#e11d48]" />
          <CardTitle className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight font-outfit text-slate-900">
            About Telly Filmy
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 md:p-12">
          <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed space-y-4">
            <p>
              Welcome to <strong>Telly Filmy</strong> (tellyfilmy.com), your trusted digital hub for instant TV serial updates, upcoming twist spoilers, breaking Bollywood news, celebrity interviews, and entertainment features.
            </p>

            <p>
              Our dedicated editorial team works around the clock to bring you accurate, timely, and engaging stories from Indian television, Hindi cinema, OTT platforms, regional entertainment, and digital creators.
            </p>

            <p>
              Whether you are looking for daily drama spoilers from top television serials, OTT release calendars, or exclusive red carpet buzz, Telly Filmy brings the world of entertainment closer to you.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Telly Filmy',
  description:
    'Get in touch with the editorial team at Telly Filmy for queries, press releases, sponsorships, or general inquiries.',
  alternates: {
    canonical: 'https://www.tellyfilmy.com/contact',
  },
  openGraph: {
    title: 'Contact Us | Telly Filmy',
    description: 'Get in touch with the editorial team at Telly Filmy.',
    url: 'https://www.tellyfilmy.com/contact',
    siteName: 'Telly Filmy',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

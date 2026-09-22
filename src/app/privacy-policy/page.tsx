// src/app/privacy-policy/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Telly Filmy',
  description:
    'Privacy Policy for Telly Filmy. Learn how we handle your personal data, cookies, and protect user privacy.',
  alternates: {
    canonical: 'https://www.tellyfilmy.com/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy | Telly Filmy',
    description: 'Privacy Policy and data protection terms for Telly Filmy.',
    url: 'https://www.tellyfilmy.com/privacy-policy',
    siteName: 'Telly Filmy',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      <Card className="overflow-hidden border border-rose-100 shadow-sm rounded-3xl">
        <CardHeader className="text-center bg-gradient-to-br from-rose-50 to-orange-50 p-8">
          <Shield className="mx-auto h-16 w-16 text-[#e11d48]" />
          <CardTitle className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight font-outfit text-slate-900">
            Privacy Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 md:p-12">
          <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed space-y-4">
            <p className="text-slate-500 text-sm">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            
            <p>
              Telly Filmy (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;) operates the
              Telly Filmy website (the &quot;Service&quot;). This page informs you of
              our policies regarding the collection, use, and disclosure of
              personal data when you use our Service and the choices you have
              associated with that data.
            </p>

            <h2 className="text-xl font-bold text-slate-900 pt-4">Information Collection and Use</h2>
            <p>
              We collect several different types of information for various
              purposes to provide and improve our Service to you.
            </p>

            <h3 className="text-lg font-semibold text-slate-800">Types of Data Collected</h3>
            <h4 className="font-semibold text-slate-800">Personal Data</h4>
            <p>
              While using our Service, we may ask you to provide us with certain
              personally identifiable information that can be used to contact or
              identify you (&quot;Personal Data&quot;). Personally identifiable information
              may include, but is not limited to:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Email address</li>
              <li>First name and last name</li>
              <li>Cookies and Usage Data</li>
            </ul>

            <h4 className="font-semibold text-slate-800 pt-2">Usage Data &amp; Cookies</h4>
            <p>
              We may also collect information on how the Service is accessed and
              used (&quot;Usage Data&quot;). We use Google Analytics and Google AdSense which
              may set cookies to serve relevant advertisements and analyze traffic.
            </p>

            <h2 className="text-xl font-bold text-slate-900 pt-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us via our Contact Page.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | Telly Filmy',
  description: 'Terms and conditions for using Telly Filmy entertainment portal.',
  alternates: {
    canonical: 'https://www.tellyfilmy.com/terms',
  },
};

export default function TermsPage() {
  return (
    <main className="container mx-auto max-w-4xl py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-rose-100 shadow-xs space-y-3">
        <div className="inline-flex items-center gap-2 bg-rose-50 text-[#e11d48] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <FileText className="w-3.5 h-3.5" />
          <span>Legal</span>
        </div>
        <h1 className="font-outfit text-2xl sm:text-4xl font-black text-slate-900">
          Terms of Service
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Content */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xs text-slate-700 leading-relaxed space-y-6 text-sm sm:text-base">
        <section className="space-y-2">
          <h2 className="font-outfit text-lg sm:text-xl font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By accessing and using Telly Filmy (tellyfilmy.com), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-outfit text-lg sm:text-xl font-bold text-slate-900">2. Entertainment Content & Intellectual Property</h2>
          <p>
            All news articles, commentary, reviews, and editorial content published on Telly Filmy are intended solely for general entertainment and informational purposes. Images, trademarks, and celebrity likenesses belong to their respective copyright holders and are utilized under fair-use commentary guidelines.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-outfit text-lg sm:text-xl font-bold text-slate-900">3. User Conduct</h2>
          <p>
            You agree not to use the website for any unlawful purpose, or in any way that could impair the functionality, performance, or availability of the website for other visitors.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-outfit text-lg sm:text-xl font-bold text-slate-900">4. Advertisements and External Links</h2>
          <p>
            Our website displays advertisements served by Google AdSense and third-party ad networks. We are not responsible for the products, services, or content featured on third-party sites linked through advertisements.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-outfit text-lg sm:text-xl font-bold text-slate-900">5. Contact Us</h2>
          <p>
            If you have any questions about our Terms of Service, please contact us at{' '}
            <Link href="/contact" className="text-[#e11d48] font-bold underline">
              our Contact Page
            </Link>.
          </p>
        </section>
      </div>
    </main>
  );
}

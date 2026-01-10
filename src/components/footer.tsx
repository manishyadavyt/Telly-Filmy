import Link from 'next/link';
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Logo } from './logo';
import { getPosts } from '@/lib/data';

export default async function Footer() {
  const allPosts = await getPosts();
  const categories = [...new Set(allPosts.map((post) => post.category))];

  return (
    <footer className="bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Logo />
            <p className="text-muted-foreground mt-4 text-sm">
              “Telly Filmy – Where Entertainment Meets Fun! From TV dramas to the latest show buzz, we bring you everything that keeps your screen—and your mood—lit!”.
            </p>
          </div>

          <div className="grid grid-cols-2 md:col-span-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-foreground">Quick Links</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">About</Link></li>
                <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link></li>
                <li><Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground">Categories</h3>
              <ul className="mt-4 space-y-2">
                {categories.map((category) => (
                  <li key={category}>
                    <Link
                      href={`/category/${encodeURIComponent(category.toLowerCase())}`}
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-border/60" />

        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Telly Filmy. All Rights Reserved.
          </p>

          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Button variant="ghost" size="icon" asChild>
              <Link href="https://x.com/telly_filmy?t=QBCSCWDKfFAkiipz0bH-eg&s=09"><Twitter className="h-4 w-4" /></Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="https://www.youtube.com/channel/UC1b3PrlMsODBp2lnS7IX4bA"><Youtube className="h-4 w-4" /></Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="https://www.instagram.com/tellyfilmy?igsh=aGlyanNrY3k5Z2M5"><Instagram className="h-4 w-4" /></Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="https://www.facebook.com/profile.php?id=61551867691591&mibextid=ZbWKwL"><Facebook className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}

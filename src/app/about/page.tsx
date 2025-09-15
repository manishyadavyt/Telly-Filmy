
// src/app/about/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Newspaper } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 p-8 text-center">
          <Newspaper className="mx-auto h-16 w-16 text-primary" />
          <CardTitle className="mt-4 text-4xl font-extrabold tracking-tight">
            About Telly Filmy
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 md:p-12">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              Welcome to Telly Filmy, your number one source for insightful
              articles on technology, design, productivity, and more. We're
              dedicated to giving you the very best of content, with a focus on
              quality, relevance, and fresh perspectives.
            </p>
            <p>
              Founded in 2024, Telly Filmy has come a long way from its
              beginnings. When we first started out, our passion for sharing
              knowledge and sparking curiosity drove us to create this platform.
              We now serve readers all over the world, and are thrilled that
              we're able to turn our passion into our own website.
            </p>
            <p>
              We hope you enjoy our articles as much as we enjoy offering them
              to you. If you have any questions or comments, please don't
              hesitate to contact us.
            </p>

            <h2 className="mt-12 text-3xl font-bold flex items-center">
              <Users className="mr-4 h-8 w-8 text-primary" />
              Our Team
            </h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src="https://i.pravatar.cc/150?u=jane" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">Jane Doe</h3>
                <p className="text-sm text-muted-foreground">Founder & Editor-in-Chief</p>
              </div>
              <div className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src="https://i.pravatar.cc/150?u=john" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">John Smith</h3>
                <p className="text-sm text-muted-foreground">Lead Technology Writer</p>
              </div>
              <div className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src="https://i.pravatar.cc/150?u=emily" />
                  <AvatarFallback>EW</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">Emily White</h3>
                <p className="text-sm text-muted-foreground">Design & Productivity Expert</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

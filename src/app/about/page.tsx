
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
              Hello welcome to Telly Filmy . We are here to give you latest Entertainment reporting..
            </p>
            Our team of dedicated reporters and hosts are passionate about delivering the  interviews, and behind-the-scenes glimpses of your favorite stars. From exclusive interviews with A-list celebrities to uncovering the latest industry trends, we've got it all 
            covered.
            <p>
              Here you will get latest Bollywood TV shows and YouTube related updates.Our Website is full of Entertainment News and Reporting.
Do subscribe my channel for more interesting videos.
            </p>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}

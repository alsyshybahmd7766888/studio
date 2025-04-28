'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Gamepad2, Star, Download } from 'lucide-react'; // Use ArrowRight for RTL back
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

// Sample game data (replace with actual data/API)
const gamesData = [
  {
    id: 'game1',
    name: 'PUBG Mobile',
    description: 'اشحن شدات ببجي موبايل بأفضل الأسعار.',
    imageUrl: 'https://picsum.photos/seed/pubg/300/150', // Placeholder image
    rating: 4.5,
    category: 'شحن',
    actionLabel: 'اشحن الآن',
    actionLink: '/recharge/pubg', // Example link
  },
  {
    id: 'game2',
    name: 'Free Fire',
    description: 'احصل على جواهر فري فاير فوراً.',
    imageUrl: 'https://picsum.photos/seed/freefire/300/150', // Placeholder image
    rating: 4.2,
    category: 'شحن',
    actionLabel: 'اشحن الآن',
    actionLink: '#', // Placeholder
  },
   {
    id: 'game3',
    name: 'لعبة الأكشن XYZ',
    description: 'لعبة مغامرات وقتال جديدة ومثيرة.',
    imageUrl: 'https://picsum.photos/seed/actionxyz/300/150', // Placeholder image
    rating: 4.8,
    category: 'ألعاب',
    actionLabel: 'تحميل',
    actionLink: '#', // Placeholder
  },
   {
    id: 'game4',
    name: 'لعبة ألغاز العقل',
    description: 'اختبر ذكاءك مع مئات الألغاز.',
    imageUrl: 'https://picsum.photos/seed/puzzlebrain/300/150', // Placeholder image
    rating: 4.6,
    category: 'ألعاب',
    actionLabel: 'العب الآن',
    actionLink: '#', // Placeholder
  },
  // Add more games as needed
];

export default function GamesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-primary px-4 py-2 text-primary-foreground shadow-md">
        <Link href="/" passHref>
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
            <ArrowRight className="h-5 w-5" /> {/* RTL back */}
            <span className="sr-only">رجوع</span>
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">معرض الألعاب</h1>
        <div className="w-10"></div> {/* Placeholder for balance */}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 pt-6 md:p-6 md:pt-8">
        <ScrollArea className="h-[calc(100vh-150px)]"> {/* Adjust height as needed */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {gamesData.map((game) => (
              <Card key={game.id} className="overflow-hidden rounded-xl bg-card shadow-md transition-all duration-200 hover:shadow-lg">
                <CardHeader className="p-0">
                  <Image
                    src={game.imageUrl}
                    alt={game.name}
                    width={300}
                    height={150}
                    className="h-40 w-full object-cover" // Fixed height, object cover
                  />
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  <CardTitle className="text-base font-semibold text-foreground">{game.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{game.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground">{game.category}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-accent text-accent" />
                      <span>{game.rating}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Link href={game.actionLink || '#'} passHref className="w-full">
                    <Button
                      size="sm"
                      variant="default"
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                      disabled={!game.actionLink || game.actionLink === '#'} // Disable if no link
                    >
                      {game.actionLabel === 'اشحن الآن' ? <Gamepad2 className="mr-2 h-4 w-4" /> : <Download className="mr-2 h-4 w-4" />}
                      {game.actionLabel}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}

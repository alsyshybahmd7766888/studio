'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, RefreshCw } from 'lucide-react'; // Use ArrowRight for RTL back
import { Button } from '@/components/ui/button';
import { ServiceCard } from '@/components/service-card'; // Ensure this uses the new theme
import { useToast } from "@/hooks/use-toast";

// Game data based on the user's list
const gamesData = [
  { name: 'شدات ببجي', link: '/services/games/pubg' }, // Updated link
  { name: 'بوبجي نيوستيت', link: '#' },
  { name: 'فري فاير', link: '#' },
  { name: 'كلاش اوف كلانس', link: '#' }, // Corrected name
  { name: 'كلاش رويال', link: '#' },
  { name: 'براول ستارز', link: '#' },
  { name: 'كول اوف ديوتي موبايل', link: '#' }, // Corrected name
  { name: 'موبايل ليجند', link: '#' },
  { name: 'لوردس موبايل', link: '#' },
  { name: 'لعبة بوم بيتش', link: '#' },
  { name: 'LIKEE - تطبيق لايكي', link: '#' },
  { name: 'YoYo Coins - يويو كوينز', link: '#' },
  { name: 'انتقام السلاطين', link: '#' },
  { name: '8 Ball Pool - بلياردو', link: '#' }, // Corrected name
  { name: 'BIGO LIVE - بيجو لايف', link: '#' },
  { name: 'BoBo Live - بوبو لايف', link: '#' },
  { name: 'IMO Live - ايمو لايف', link: '#' },
  { name: 'YoHo Chat - شات يوهو', link: '#' },
  { name: 'Bella Chat Coins - بيلا شات', link: '#' }, // Merged 'Bella Chat بيلا شات كوين'
  { name: 'Mico Live - ميكو لايف', link: '#' },
  { name: 'هاي داي جواهر', link: '#' },
  { name: 'هاي داي عملة ذهبية', link: '#' },
  { name: 'كرستال جنشن امباكت', link: '#' }, // Merged 'جنشن كرستال امباكت'
  { name: 'جواكر ( عملة )', link: '#' },
  { name: 'يلا لودو', link: '#' },
  { name: 'بارتي ستار', link: '#' },
  { name: 'عصر الاساطير', link: '#' },
  { name: 'فيفا موبايل', link: '#' }, // Merged '#العاب # فيفا موبال'
];


export default function GamesPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [activeGame, setActiveGame] = React.useState<string | null>(null);

   const handleRefresh = () => {
        console.log('Refreshing games...');
        toast({
            title: "تحديث",
            description: "تم تحديث قائمة الألعاب.",
            variant: 'default', // Uses primary color style
        });
    };

   const handleGameClick = (game: typeof gamesData[0]) => {
      console.log(`Handling click for ${game.name}...`);
      setActiveGame(game.name);

      setTimeout(() => {
          if (game.link && game.link !== '#') {
             toast({
                title: "تم التحديد",
                description: `جارٍ الانتقال إلى ${game.name}...`,
                variant: 'default',
             });
            router.push(game.link);
          } else {
             toast({
                title: "غير متاح حالياً",
                description: `خدمة ${game.name} غير متوفرة للشحن المباشر حالياً.`,
                variant: 'default', // Use default/info style
             });
             console.log(`No specific page defined or feature not ready for ${game.name}`);
             // Reset active state if not navigating
             setActiveGame(null);
          }
      }, 200);
    };


  return (
    // Use bg-background
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header - Primary background, Primary Foreground text */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-primary px-4 py-2 text-primary-foreground shadow-md">
         {/* Back button to /services */}
        <Link href="/services" passHref>
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
            <ArrowRight className="h-5 w-5" />
            <span className="sr-only">رجوع</span>
          </Button>
        </Link>
        <h1 className="text-lg font-medium">معرض الألعاب</h1> {/* Primary Foreground text */}
         {/* Refresh button - Accent icon */}
         <Button variant="ghost" size="icon" className="text-accent hover:bg-primary/80" onClick={handleRefresh}>
            <RefreshCw className="h-5 w-5" />
            <span className="sr-only">تحديث</span>
        </Button>
      </header>

      {/* Main Content Area - Games Grid */}
      {/* Padding, background inherited */}
      <main className="flex-1 p-4 pt-6 md:p-6 md:pt-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4"> {/* gap-3 for 12px */}
          {gamesData.map((game, index) => (
            <ServiceCard
              key={index}
              // Use game name in the icon circle text
              iconText={game.name.split(' ')[0]} // Use first word
              buttonText={game.name}
              onClick={() => handleGameClick(game)}
              isActive={activeGame === game.name}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

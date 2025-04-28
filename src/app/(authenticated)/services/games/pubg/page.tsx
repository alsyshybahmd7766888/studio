'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Package, Loader2, CircleDollarSign, User } from 'lucide-react'; // Added User icon
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Import Input component
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Interface for PUBG packages including both currencies
interface PubgPackageInfo {
    id: string;
    name: string;
    priceUSD: number | string; // Price in USD
    priceYER: number | string; // Price in YER
    description?: string;
}

// Placeholder PUBG package data with USD and YER prices
// !! IMPORTANT: Replace these placeholder prices with actual values !!
const pubgPackagesData: PubgPackageInfo[] = [
  { id: 'pubg60', name: 'بوبجي العالميه 60 شده', priceUSD: 0.99, priceYER: 500 },
  { id: 'pubg325', name: 'بوبجي العالميه 325 شده', priceUSD: 4.99, priceYER: 2500 },
  { id: 'pubg385', name: 'بوبجي العالميه 385 شده', priceUSD: 5.99, priceYER: 3000 },
  { id: 'pubg660', name: 'بوبجي العالميه 660 شده', priceUSD: 9.99, priceYER: 5000 },
  { id: 'pubg720', name: 'بوبجي العالميه 720 شده', priceUSD: 10.99, priceYER: 5500 },
  { id: 'pubg1800', name: 'بوبجي العالميه 1800 شده', priceUSD: 24.99, priceYER: 12500 },
  { id: 'pubg3850', name: 'بوبجي العالميه 3850 شده', priceUSD: 49.99, priceYER: 25000 },
  { id: 'pubg8100', name: 'بوبجي العالميه 8100 شده', priceUSD: 99.99, priceYER: 50000 },
  { id: 'pubg8400', name: 'بوبجي العالميه 8400 شده', priceUSD: 104.99, priceYER: 52500 },
  { id: 'pubg11950', name: 'بوبجي العالميه 11950 شده', priceUSD: 149.99, priceYER: 75000 },
  { id: 'pubg16200', name: 'بوبجي العالميه 16200 شده', priceUSD: 199.99, priceYER: 100000 },
];


export default function PubgRechargePage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeButtonId, setActiveButtonId] = React.useState<string | null>(null);
  const [playerId, setPlayerId] = React.useState(''); // State for Player ID
  const { toast } = useToast();

 const handleRechargeClick = (pkg: PubgPackageInfo) => {
    // Check if Player ID is entered
    if (!playerId.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال معرف اللاعب أولاً.",
        variant: "destructive",
      });
      return; // Stop execution if Player ID is missing
    }

    setActiveButtonId(pkg.id);
    setIsLoading(true);
    console.log(`Attempting to recharge PUBG package: ${pkg.name} for Player ID: ${playerId}`);
    toast({
      title: "بدء عملية الشحن",
      description: `جاري شحن ${pkg.name} لمعرف اللاعب ${playerId}...`,
      variant: 'default',
    });

    // Simulate recharge process
    setTimeout(() => {
      setIsLoading(false);
      setActiveButtonId(null);
      const isSuccess = Math.random() > 0.2; // Simulate success/failure
      if (isSuccess) {
         toast({
            title: "نجاح العملية",
            description: `تم شحن ${pkg.name} بنجاح لمعرف اللاعب ${playerId}!`,
            variant: "default", // Use primary color style for success
        });
        setPlayerId(''); // Clear player ID on success
      } else {
         toast({
            title: "فشل العملية",
            description: `حدث خطأ أثناء شحن ${pkg.name} لمعرف اللاعب ${playerId}. يرجى المحاولة لاحقاً.`,
            variant: "destructive", // Use destructive (red) style
        });
      }
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F9FA] text-[#333333]">
      {/* Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-[#007B8A] px-4 py-2 text-white shadow-md">
        {/* Back button to /services/games */}
        <Link href="/services/games" passHref>
          <Button variant="ghost" size="icon" className="text-white hover:bg-[#007B8A]/80">
            <ArrowRight className="h-5 w-5" />
            <span className="sr-only">رجوع</span>
          </Button>
        </Link>
        <h1 className="text-lg font-medium">شحن شدات ببجي</h1>
        <div className="w-10"></div> {/* Placeholder to balance */}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 space-y-4 p-4 pt-6 md:p-6 md:pt-8">
        {/* Player ID Input */}
        <div className="relative mb-4 flex items-center">
             <Input
               type="text"
               placeholder="أدخل معرف اللاعب (Player ID)"
               value={playerId}
               onChange={(e) => setPlayerId(e.target.value)}
               className={cn(
                 "h-12 w-full rounded-[8px] border border-border bg-white py-3 pl-4 pr-10 text-lg shadow-sm placeholder-[#9E9E9E] focus:border-[#007B8A] focus:ring-1 focus:ring-[#007B8A] text-[#333333]",
                 "text-right"
              )}
              maxLength={20} // Typical max length for IDs
              dir="ltr" // Usually IDs are LTR
             />
             <User className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground/70" />
         </div>

        {/* Package List */}
        <div>
          <h2 className="mb-3 text-center text-base font-semibold text-[#333333]">
            <Package className="inline-block h-5 w-5 mr-2 align-middle text-[#333333]"/>
            اختر الباقة المطلوبة
          </h2>
          <ScrollArea className="h-[calc(100vh-240px)]"> {/* Adjust height for the new input field */}
            {pubgPackagesData.length > 0 ? (
              <div className="space-y-2">
                {pubgPackagesData.map((pkg) => (
                  <Card key={pkg.id} className="overflow-hidden rounded-[12px] bg-white p-3 shadow-md transition-transform duration-150 ease-in-out active:scale-[0.98] active:shadow active:translate-y-[2px]">
                    <div className="flex items-center justify-between gap-3">
                      {/* Package details */}
                      <div className="flex-1 space-y-1 text-right">
                        <p className="text-base font-semibold text-[#333333]">{pkg.name}</p>
                        {pkg.description && <p className="text-xs text-[#666666]">{pkg.description}</p>}
                        {/* Prices Section */}
                        <div className="flex flex-col items-end gap-1 pt-1">
                          {/* YER Price */}
                           <p className="text-sm font-medium text-[#007B8A] flex items-center justify-end gap-1">
                                <span className="font-sans text-xs font-light text-[#666666] mr-1">(YER)</span>
                                {typeof pkg.priceYER === 'number' && pkg.priceYER > 0
                                    ? `${pkg.priceYER.toLocaleString()} ريال`
                                    : pkg.priceYER}
                           </p>
                          {/* USD Price */}
                          <p className="text-sm font-medium text-[#666666] flex items-center justify-end gap-1">
                             <span className="font-sans text-xs font-light text-[#999999] mr-1">(USD)</span>
                            {typeof pkg.priceUSD === 'number' && pkg.priceUSD > 0
                              ? `$${pkg.priceUSD.toFixed(2)}`
                              : pkg.priceUSD}
                          </p>
                        </div>
                      </div>
                      {/* Recharge Button */}
                      <Button
                        size="sm"
                        variant="default"
                        className="px-4 py-1.5 text-sm font-medium shadow-sm h-auto rounded-[8px] transition-all bg-[#FF6F3C] text-white hover:bg-[#FF6F3C]/90 active:bg-[#FF6F3C]/80"
                        onClick={() => handleRechargeClick(pkg)}
                        disabled={isLoading && activeButtonId === pkg.id}
                      >
                        {(isLoading && activeButtonId === pkg.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'اشحن الآن'
                        )}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="p-6 text-center text-[#666666]">لا توجد باقات متاحة حالياً.</p>
            )}
          </ScrollArea>
        </div>
      </main>
    </div>
  );
}

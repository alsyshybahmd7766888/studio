'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Package, Loader2, CircleDollarSign, User } from 'lucide-react'; // Added User icon
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Import Input component
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useBalance } from '@/hooks/useBalance'; // Import balance context hook
import { useAuth } from '@/hooks/useAuth'; // Import auth context hook

// Interface for PUBG packages including both currencies
interface PubgPackageInfo {
    id: string; // Use a unique ID for API calls (e.g., 'pubg_60uc', 'midasbuy_sku_123')
    name: string;
    priceUSD?: number | string; // Price in USD (optional display)
    priceYER: number | string; // Price in YER (Primary for balance check and API)
    description?: string;
    ucAmount: number; // Amount of UC
}

// Placeholder PUBG package data with USD and YER prices
const pubgPackagesData: PubgPackageInfo[] = [
  { id: 'pubg_60uc', name: 'بوبجي العالميه 60 شده', ucAmount: 60, priceUSD: 0.99, priceYER: 500 },
  { id: 'pubg_325uc', name: 'بوبجي العالميه 325 شده', ucAmount: 325, priceUSD: 4.99, priceYER: 2500 },
  { id: 'pubg_385uc', name: 'بوبجي العالميه 385 شده', ucAmount: 385, priceUSD: 5.99, priceYER: 3000 },
  { id: 'pubg_660uc', name: 'بوبجي العالميه 660 شده', ucAmount: 660, priceUSD: 9.99, priceYER: 5000 },
  { id: 'pubg_720uc', name: 'بوبجي العالميه 720 شده', ucAmount: 720, priceUSD: 10.99, priceYER: 5500 },
  { id: 'pubg_1800uc', name: 'بوبجي العالميه 1800 شده', ucAmount: 1800, priceUSD: 24.99, priceYER: 12500 },
  { id: 'pubg_3850uc', name: 'بوبجي العالميه 3850 شده', ucAmount: 3850, priceUSD: 49.99, priceYER: 25000 },
  { id: 'pubg_8100uc', name: 'بوبجي العالميه 8100 شده', ucAmount: 8100, priceUSD: 99.99, priceYER: 50000 },
  { id: 'pubg_8400uc', name: 'بوبجي العالميه 8400 شده', ucAmount: 8400, priceUSD: 104.99, priceYER: 52500 },
  { id: 'pubg_11950uc', name: 'بوبجي العالميه 11950 شده', ucAmount: 11950, priceUSD: 149.99, priceYER: 75000 },
  { id: 'pubg_16200uc', name: 'بوبجي العالميه 16200 شده', ucAmount: 16200, priceUSD: 199.99, priceYER: 100000 },
];


export default function PubgRechargePage() {
  const [isLoading, setIsLoading] = React.useState(false); // API call loading
  const [activeButtonId, setActiveButtonId] = React.useState<string | null>(null);
  const [playerId, setPlayerId] = React.useState(''); // State for Player ID
  const { toast } = useToast();
  const { balance, loading: balanceLoading, fetchBalance } = useBalance(); // Get balance context
  const { user, loading: authLoading } = useAuth(); // Get user context

  const isPageLoading = authLoading || balanceLoading;

 const handleRechargeClick = async (pkg: PubgPackageInfo) => {
     if (!user) {
         toast({ title: "غير مصرح", description: "يرجى تسجيل الدخول أولاً.", variant: "destructive" });
         return;
     }
    // Check if Player ID is entered
    if (!playerId.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال معرف اللاعب أولاً.",
        variant: "destructive",
      });
      return; // Stop execution if Player ID is missing
    }

    // --- Balance Check ---
    const packagePriceYER = typeof pkg.priceYER === 'number' ? pkg.priceYER : 0; // Use YER for balance check

    if (packagePriceYER <= 0) {
         toast({
             title: "خطأ",
             description: "لا يمكن شحن هذه الباقة حالياً (السعر غير محدد).",
             variant: "destructive",
         });
         return;
     }

    if (balance < packagePriceYER) {
        toast({
            title: "رصيد غير كافٍ",
            description: `رصيدك الحالي (${balance.toLocaleString()} ريال) غير كافٍ لشحن هذه الباقة (${packagePriceYER.toLocaleString()} ريال).`,
            variant: "destructive",
        });
        return; // Stop execution if balance is insufficient
    }
    // ---------------------


    setActiveButtonId(pkg.id);
    setIsLoading(true);
    console.log(`Attempting to recharge PUBG package: ${pkg.name} for Player ID: ${playerId}. Cost: ${packagePriceYER} YER. Balance: ${balance}`);
    toast({
      title: "بدء عملية الشحن",
      description: `جاري شحن ${pkg.name} لمعرف اللاعب ${playerId}...`,
      variant: 'default', // Use default (primary) style
    });

    // --- Call Backend Recharge API (adjust endpoint and payload as needed) ---
    try {
      const response = await fetch('/api/recharge', { // Use the same generic recharge endpoint
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              userId: user.uid,
              operator: 'PUBG', // Specific identifier for PUBG
              playerId: playerId, // Send player ID
              packageId: pkg.id, // Send the unique package ID
              amount: packagePriceYER, // Send the cost in YER for balance deduction validation on backend
              // Add other necessary fields like ucAmount if backend needs it
              // ucAmount: pkg.ucAmount
          }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
          throw new Error(result.error || `فشل عملية الشحن (الحالة: ${response.status})`);
      }

      // Success
      toast({
          title: "نجاح العملية",
          description: result.message || `تم شحن ${pkg.name} بنجاح لمعرف اللاعب ${playerId}!`,
          variant: "default",
      });

      setPlayerId(''); // Clear player ID on success
      // Balance update is handled by Firestore listener

    } catch (error: any) {
        console.error("PUBG Recharge API call failed:", error);
        toast({
            title: "فشل العملية",
            description: error.message || `فشل الاتصال بمزود خدمة شحن الألعاب لـ ${pkg.name}. لم يتم خصم أي رصيد.`,
            variant: "destructive",
        });
    } finally {
      setIsLoading(false);
      setActiveButtonId(null);
    }
  };

  return (
    // Background: Light Grey (#F7F9FA), Text: Dark Grey (#333333)
    <div className="flex min-h-screen flex-col bg-[#F7F9FA] text-[#333333]">
      {/* Header - Teal background (#007B8A), White text */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-[#007B8A] px-4 py-2 text-white shadow-md">
        {/* Back button to /services/games */}
        <Link href="/services/games" passHref>
          <Button variant="ghost" size="icon" className="text-white hover:bg-[#007B8A]/80">
            <ArrowRight className="h-5 w-5" />
            <span className="sr-only">رجوع</span>
          </Button>
        </Link>
        <h1 className="text-lg font-medium">شحن شدات ببجي</h1>
         {/* Balance display or loader */}
         <div className="flex items-center gap-1 text-sm">
             <CircleDollarSign className="h-4 w-4 opacity-80" />
             {isPageLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : `${balance.toLocaleString()} ريال`}
         </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 space-y-4 p-4 pt-6 md:p-6 md:pt-8">
        {/* Player ID Input */}
        <div className="relative mb-4 flex items-center">
             <Input
               type="text" // Use text, can add pattern for numbers if needed
               name="playerId" // Add name
               placeholder="أدخل معرف اللاعب (Player ID)"
               value={playerId}
               onChange={(e) => setPlayerId(e.target.value)}
               className={cn(
                 "h-12 w-full rounded-[8px] border border-[#E0E0E0] bg-white py-3 pl-4 pr-10 text-lg shadow-sm placeholder-[#9E9E9E] focus:border-[#007B8A] focus:ring-1 focus:ring-[#007B8A] text-[#333333]",
                 "text-right" // Keep text aligned right
              )}
              maxLength={20} // Typical max length for IDs
              dir="ltr" // Usually IDs are LTR, keep LTR for input
              disabled={isPageLoading} // Disable if page is loading
             />
             <User className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-[#B0B0B0]" /> {/* Icon color */}
         </div>

        {/* Package List */}
        <div>
          <h2 className="mb-3 text-center text-base font-semibold text-[#333333]">
            <Package className="inline-block h-5 w-5 mr-2 align-middle text-[#333333]"/>
            اختر الباقة المطلوبة
          </h2>
           {/* Adjust height considering the Player ID input */}
          <ScrollArea className="h-[calc(100vh-240px)]">
             {isPageLoading ? (
                 <div className="flex justify-center p-10"><Loader2 className="h-8 w-8 animate-spin text-[#007B8A]" /></div>
             ) : pubgPackagesData.length > 0 ? (
              <div className="space-y-2">
                {pubgPackagesData.map((pkg) => {
                   const isCurrentButtonLoading = isLoading && activeButtonId === pkg.id;
                   return (
                      // Package Card: White bg, rounded-xl (12px), shadow-md
                      <Card key={pkg.id} className="overflow-hidden rounded-[12px] bg-white p-3 shadow-md transition-transform duration-150 ease-in-out active:scale-[0.98] active:shadow active:translate-y-[2px]">
                        <div className="flex items-center justify-between gap-3">
                          {/* Package details */}
                          <div className="flex-1 space-y-1 text-right">
                             {/* Name: 16px bold, dark grey */}
                            <p className="text-base font-semibold text-[#333333]">{pkg.name}</p>
                             {/* UC Amount */}
                            <p className="text-sm text-[#666666]">{pkg.ucAmount} UC</p>
                            {/* Prices Section */}
                            <div className="flex flex-col items-end gap-1 pt-1">
                              {/* YER Price - Teal color */}
                               <p className="text-sm font-medium text-[#007B8A] flex items-center justify-end gap-1">
                                    <span className="font-sans text-xs font-light text-[#666666] mr-1">(YER)</span>
                                    {typeof pkg.priceYER === 'number' && pkg.priceYER > 0
                                        ? `${pkg.priceYER.toLocaleString()} ريال`
                                        : pkg.priceYER}
                               </p>
                              {/* USD Price - Medium grey (Optional) */}
                              {pkg.priceUSD && (
                                  <p className="text-sm font-medium text-[#666666] flex items-center justify-end gap-1">
                                     <span className="font-sans text-xs font-light text-[#999999] mr-1">(USD)</span>
                                    {typeof pkg.priceUSD === 'number' && pkg.priceUSD > 0
                                      ? `$${pkg.priceUSD.toFixed(2)}`
                                      : pkg.priceUSD}
                                  </p>
                               )}
                            </div>
                          </div>
                          {/* Recharge Button - Orange bg (#FF6F3C), White text, rounded 8px */}
                          <Button
                            size="sm"
                            className="px-4 py-1.5 text-sm font-medium shadow-sm h-auto rounded-[8px] transition-all bg-[#FF6F3C] text-white hover:bg-[#FF6F3C]/90 active:bg-[#FF6F3C]/80" // Specific orange
                            onClick={() => handleRechargeClick(pkg)}
                            disabled={isLoading || isPageLoading}
                          >
                            {isCurrentButtonLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              'اشحن الآن'
                            )}
                          </Button>
                        </div>
                      </Card>
                   );
                })}
              </div>
            ) : (
              // No packages message: Medium grey
              <p className="p-6 text-center text-[#666666]">لا توجد باقات ببجي متاحة حالياً.</p>
            )}
          </ScrollArea>
        </div>
      </main>
    </div>
  );
}

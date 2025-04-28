'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Phone, Wifi, CircleDollarSign, Package, Loader2 } from 'lucide-react'; // Using ArrowLeft for back, relevant icons
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area'; // For package list
import Image from 'next/image'; // For operator logos
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils'; // Import cn

// Operator detection logic and data
const operatorPrefixes: { [key: string]: string[] } = {
  'Yemen Mobile': ['77', '78'],
  'SabaFon': ['71'],
  'YOU': ['73'],
  'Y': ['70'],
  'Landline': ['01', '02', '03', '04', '05', '06', '07', '08', '09'],
  // ADSL uses the same prefixes as Landline
};

// Ensure these logo paths exist in your public/logos folder
const operatorLogos: { [key: string]: string } = {
  'Yemen Mobile': '/logos/yemen-mobile.png',
  'SabaFon': '/logos/sabafon.png',
  'YOU': '/logos/you.png',
  'Y': '/logos/y.png',
  'Landline': '/logos/landline.png', // Consider a generic telecom icon
  'ADSL': '/logos/adsl.png', // Consider a generic wifi/internet icon
};

// Placeholder package data (replace with actual API call or data source)
interface PackageInfo {
    id: string;
    name: string;
    price: number;
    description?: string;
}

// Sample data - expanded slightly
const packagesData: { [key: string]: PackageInfo[] } = {
  'Yemen Mobile': [
    { id: 'ym1', name: 'باقة موبايلي الشهرية', price: 1500, description: '5GB بيانات + 150 دقيقة + 100 رسالة' },
    { id: 'ym2', name: 'باقة نت 2 جيجا', price: 700, description: '2GB بيانات صالحة لأسبوع' },
    { id: 'ym3', name: 'باقة دقائق فقط', price: 500, description: '100 دقيقة لجميع الشبكات' },
    { id: 'ym4', name: 'تعبئة رصيد مباشر', price: 0, description: 'أدخل مبلغ التعبئة' },
  ],
  'SabaFon': [
    { id: 'sb1', name: 'باقة سبافون الذهبية', price: 2000, description: '10GB + دقائق ورسائل غير محدودة داخل الشبكة' },
    { id: 'sb2', name: 'باقة سبافون الأسبوعية', price: 500, description: '1.5GB + 50 دقيقة' },
     { id: 'sb3', name: 'تعبئة رصيد سبافون', price: 0, description: 'أدخل مبلغ التعبئة' },
  ],
  'YOU': [
    { id: 'you1', name: 'باقة YOU نت الشهرية', price: 1800, description: '12GB انترنت سريع + سوشال ميديا' },
    { id: 'you2', name: 'باقة YOU مكس', price: 900, description: '3GB + 100 دقيقة + 100 رسالة' },
     { id: 'you3', name: 'تعبئة رصيد YOU', price: 0, description: 'أدخل مبلغ التعبئة' },
  ],
   'Y': [
    { id: 'y1', name: 'باقة واي شباب الأسبوعية', price: 600, description: '2GB بيانات ومكالمات داخل الشبكة' },
    { id: 'y2', name: 'باقة واي أعمال الشهرية', price: 2500, description: '20GB + دقائق دولية مخفضة' },
     { id: 'y3', name: 'تعبئة رصيد Y', price: 0, description: 'أدخل مبلغ التعبئة' },
  ],
  'Landline': [
    { id: 'll1', name: 'تسديد فاتورة الهاتف الثابت', price: 0, description: 'سيتم جلب مبلغ الفاتورة تلقائياً' }, // Example for bill payment
  ],
    'ADSL': [
    { id: 'adsl1', name: 'تجديد اشتراك ADSL الشهري', price: 0, description: 'سيتم جلب مبلغ التجديد تلقائياً' },
    { id: 'adsl2', name: 'ترقية باقة ADSL', price: 1000, description: 'زيادة السرعة للشهر الحالي' },
  ],
};

export default function RechargePage() {
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [detectedOperator, setDetectedOperator] = React.useState<string | null>(null);
  const [operatorLogo, setOperatorLogo] = React.useState<string | null>(null);
  const [showPackages, setShowPackages] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false); // For loading state on button
  const [isFetchingPackages, setIsFetchingPackages] = React.useState(false); // For loading packages
  const { toast } = useToast();

  const detectOperator = (number: string) => {
    let foundOperator: string | null = null;
    let isLandlineOrADSL = false;

    // Prioritize Landline/ADSL check if number starts with 0
    if (number.startsWith('0')) {
        const landlinePrefix = number.substring(0, 2);
        if (operatorPrefixes['Landline'].includes(landlinePrefix)) {
            isLandlineOrADSL = true;
            // Basic heuristic: Could be ADSL or Landline. Default to ADSL for now if length suggests it.
            // In a real app, you might need a more robust check or user selection.
            foundOperator = number.length > 5 ? 'ADSL' : 'Landline';
        }
    }

    // If not identified as Landline/ADSL, check mobile prefixes
    if (!isLandlineOrADSL) {
        for (const operator in operatorPrefixes) {
            // Skip Landline/ADSL check here
            if (operator === 'Landline' || operator === 'ADSL') continue;

            for (const prefix of operatorPrefixes[operator]) {
                if (number.startsWith(prefix)) {
                    foundOperator = operator;
                    break; // Found mobile operator match
                }
            }
            if (foundOperator) break; // Exit outer loop if mobile found
        }
    }


    setDetectedOperator(foundOperator);
    setOperatorLogo(foundOperator ? operatorLogos[foundOperator] || null : null);

    if (foundOperator) {
        setShowPackages(true);
        setIsFetchingPackages(true); // Start loading packages
        // Simulate fetching packages
        setTimeout(() => {
            setIsFetchingPackages(false);
        }, 500); // Simulate network delay
    } else {
        setShowPackages(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
    setPhoneNumber(value);
    if (value.length >= 2) { // Start detection after 2 digits
      detectOperator(value);
    } else {
      setDetectedOperator(null);
      setOperatorLogo(null);
      setShowPackages(false);
    }
  };

 const handleRechargeClick = (pkg: PackageInfo) => {
    setIsLoading(true); // Show loading indicator on the specific button clicked (needs state management per button or a global loading state)
    console.log(`Attempting to recharge package: ${pkg.name} for number: ${phoneNumber}`);
    toast({
      title: "بدء عملية الشحن",
      description: `جاري شحن ${pkg.name} للرقم ${phoneNumber}...`,
    });

    // Simulate API call / recharge process
    setTimeout(() => {
      setIsLoading(false);
      // Simulate success/failure
      const isSuccess = Math.random() > 0.2; // 80% success rate
      if (isSuccess) {
         toast({
            title: "نجاح العملية",
            description: `تم شحن ${pkg.name} بنجاح للرقم ${phoneNumber}!`,
            variant: "default", // Consider a 'success' variant if defined in globals.css
        });
        // Optionally clear input or navigate away after success
        // setPhoneNumber('');
        // setDetectedOperator(null);
      } else {
         toast({
            title: "فشل العملية",
            description: `حدث خطأ أثناء شحن ${pkg.name}. الرصيد غير كافٍ أو مشكلة في الشبكة.`,
            variant: "destructive",
        });
      }
    }, 2000); // Simulate 2 second delay
  };


  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header - Updated Style */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-primary px-4 py-2 text-primary-foreground shadow-md">
        {/* Link back to services page or home, updated hover effect */}
        <Link href="/services" passHref>
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">رجوع</span>
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">التعبئة</h1>
        <div className="w-10"></div> {/* Placeholder for potential actions like help icon */}
      </header>

      {/* Main Content Area - Updated Padding and Spacing */}
      <main className="flex-1 space-y-5 p-4 pt-6 md:p-6 md:pt-8">
        {/* Phone Number Input - Enhanced Style */}
        <div className="relative flex items-center">
           <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /> {/* Icon inside input */}
           <Input
              type="tel" // Use tel type for numeric keyboard on mobile
              placeholder="أدخل رقم الهاتف أو الأرضي"
              value={phoneNumber}
              onChange={handleInputChange}
              // Increased padding-left for icon, padding-right for logo space, larger text, modern look
              className={cn(
                "w-full rounded-xl border-border bg-card py-3 pl-12 pr-14 text-lg shadow-sm transition-shadow duration-200 focus:border-primary focus:shadow-md focus:ring-1 focus:ring-ring",
                operatorLogo ? "pr-14" : "pr-4" // Adjust padding if logo is present
              )}
              maxLength={15} // Optional: limit input length
            />
            {/* Operator Logo - Positioned inside input field */}
            {operatorLogo && (
                 <div className="absolute right-3 top-1/2 -translate-y-1/2 transform transition-opacity duration-300 ease-in-out">
                   <Image src={operatorLogo} alt={detectedOperator || 'Operator'} width={36} height={36} className="object-contain rounded-md" /> {/* Slightly larger logo */}
                 </div>
            )}
        </div>

        {/* Operator/Error Message - Centered and styled */}
        {phoneNumber.length >= 2 && !detectedOperator && (
          <p className="text-center text-sm text-destructive font-medium">المشغل غير مدعوم حالياً أو الرقم غير صحيح.</p>
        )}
         {phoneNumber.length > 0 && phoneNumber.length < 2 && (
          <p className="text-center text-xs text-muted-foreground">أدخل المزيد من الأرقام لتحديد المشغل.</p>
        )}

        {/* Package List Section - Enhanced Card and List Styling */}
        {showPackages && detectedOperator && (
          <Card className="overflow-hidden rounded-2xl bg-card shadow-lg"> {/* Enhanced rounding and shadow */}
             <CardHeader className="bg-muted/30 p-4 border-b"> {/* Lighter header, border */}
                <CardTitle className="text-center text-base font-semibold text-foreground">
                    <Package className="inline-block h-5 w-5 mr-2 align-middle text-primary"/> {/* Icon in title */}
                    باقات {detectedOperator} المتاحة
                </CardTitle>
             </CardHeader>
            <CardContent className="p-0">
               <ScrollArea className="h-[calc(100vh-280px)]"> {/* Adjusted height based on surrounding elements */}
                 {isFetchingPackages ? (
                    <div className="flex justify-center items-center p-10">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                 ) : (packagesData[detectedOperator] || []).length > 0 ? (
                     <div className="divide-y divide-border"> {/* Use dividers instead of space-y */}
                        {packagesData[detectedOperator]?.map((pkg) => (
                            <div key={pkg.id} className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors duration-150">
                                <div className="flex-1 space-y-1 mr-3">
                                    <p className="text-base font-semibold text-foreground">{pkg.name}</p>
                                    {pkg.description && <p className="text-xs text-muted-foreground">{pkg.description}</p>}
                                    <p className="text-sm font-medium text-primary flex items-center gap-1 pt-1">
                                        <CircleDollarSign className="h-4 w-4" />
                                        {pkg.price > 0 ? `${pkg.price} ريال` : (pkg.description?.includes('مبلغ') ? 'حسب المبلغ' : 'حسب الفاتورة')}
                                    </p>
                                </div>
                                <Button
                                    size="sm"
                                    variant="default" // Use default which should map to primary now
                                    className="bg-accent px-4 py-2 text-sm font-medium text-accent-foreground shadow-sm hover:bg-accent/90 active:bg-accent/80 h-auto rounded-lg transition-all duration-200 ease-in-out hover:shadow-md" // Adjusted styles
                                    onClick={() => handleRechargeClick(pkg)}
                                    disabled={isLoading} // Disable button while loading
                                >
                                    {/* Conditional loading indicator */}
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        'اشحن الآن'
                                    )}
                                </Button>
                            </div>
                        ))}
                     </div>
                 ) : (
                    <p className="p-6 text-center text-muted-foreground">لا توجد باقات متاحة حالياً لهذا المشغل.</p>
                 )}
               </ScrollArea>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

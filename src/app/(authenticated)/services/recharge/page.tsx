'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Phone, Wifi, CircleDollarSign, Package, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Keep Card for structure
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Updated operator prefixes based on 4ME structure
const operatorPrefixes: { [key: string]: string[] } = {
  'يمن موبايل': ['77', '78'],
  'سبأفون': ['71'],
  'YOU': ['73'],
  'واي': ['70'], // Explicitly name 'Y' as 'واي'
  'الهاتف الأرضي': ['01', '02', '03', '04', '05', '06', '07', '08', '09'], // Assuming single digits 0 to 9 for area codes
  'ADSL': ['01', '02', '03', '04', '05', '06', '07', '08', '09'], // ADSL shares prefixes
};


// Operator logos (ensure these paths exist or use placeholders)
// Assuming logos directory exists in public/logos/
const operatorLogos: { [key: string]: string } = {
  'يمن موبايل': '/logos/yemen-mobile.png', // Placeholder path
  'سبأفون': '/logos/sabafon.png',         // Placeholder path
  'YOU': '/logos/you.png',               // Placeholder path
  'واي': '/logos/y.png',                 // Placeholder path
  'الهاتف الأرضي': '/logos/landline.png',   // Placeholder path
  'ADSL': '/logos/adsl.png',             // Placeholder path
};

// Placeholder package data (replace with actual API call or data source)
interface PackageInfo {
    id: string;
    name: string;
    price: number | string; // Allow string for "حسب الفاتورة" etc.
    description?: string;
}

// Sample data using updated operator names
const packagesData: { [key: string]: PackageInfo[] } = {
  'يمن موبايل': [
    { id: 'ym1', name: 'باقة موبايلي الشهرية', price: 1500, description: '5GB بيانات + 150 دقيقة + 100 رسالة' },
    { id: 'ym2', name: 'باقة نت 2 جيجا', price: 700, description: '2GB بيانات صالحة لأسبوع' },
    { id: 'ym3', name: 'تعبئة رصيد مباشر', price: 'حسب المبلغ', description: 'أدخل مبلغ التعبئة' },
  ],
  'سبأفون': [
    // Updated Sabafon Packages
    { id: 'sb-yb-week', name: 'دفع مسبق يابلاش الاسبوعية', price: 484 },
    { id: 'sb-yb-month', name: 'دفع مسبق يابلاش الشهرية', price: 1210 },
    { id: 'sb-yb-superplus', name: 'دفع مسبق يابلاش سوبر بلاس', price: 3025 },
    { id: 'sb-yb-kalam', name: 'دفع مسبق يابلاش كلام- 400 دقيقة- 30يوم', price: 1210 },
    { id: 'sb-whatsapp-week', name: 'دفع مسبق واتساب الأسبوعية', price: 484 },
    { id: 'sb-fb-twitter', name: 'دفع مسبق فيسبوك+تويتر', price: 484 },
    { id: 'sb-fb-month', name: 'دفع مسبق فيسبوك الشهرية', price: 1210 },
    { id: 'sb-tawasol-extra', name: 'دفع مسبق تواصل اكسترا الشهرية', price: 1029 },
    { id: 'sb-tawasol-month', name: 'دفع مسبق تواصل الشهرية- فيسبوك', price: 1997 },
    { id: 'sb-supernet-day', name: 'دفع مسبق سوبرنت اليومية', price: 484 },
    { id: 'sb-supernet-1', name: 'دفع مسبق سوبرنت 1-250 ميجابايت 30 يوم', price: 1210 },
    { id: 'sb-supernet-2', name: 'دفع مسبق سوبرنت 2 - 500 ميجابايت 30 يوم', price: 1815 },
    { id: 'sb-supernet-3', name: 'دفع مسبق سوبرنت 3- 1024 ميجا 30 يوم', price: 3025 },
    { id: 'sb-supernet-4', name: 'دفع مسبق سوبرنت 4- 4000 ميجا 30يوم', price: 4840 },
    { id: 'sb-msg-200', name: 'دفع مسبق 200 رسالة', price: 484 },
    { id: 'sb-msg-600', name: 'دفع مسبق 600 رسالة', price: 726 },
    { id: 'sb-gsm-week', name: 'دفع مسبق جي إس إم الاسبوعية', price: 1004 },
    { id: 'sb-wahed-day', name: 'دفع مسبق باقة واحد اليومية لكل الشبكات', price: 508 },
    { id: 'sb-wahed-month', name: 'دفع مسبق باقة واحد الشهرية لكل الشبكات', price: 1513 },
    { id: 'sb-wahed-week-all', name: 'باقة واحد الاسبوعية- دفع مسبق لكل الشبكات', price: 811 },
    { id: 'sb-yb-daily', name: 'دفع مسبق يابلاش اليومية', price: 575 },
    { id: 'sb-yb-10days', name: 'دفع مسبق يابلاش 10 ايام', price: 847 },
    { id: 'sb-whatsapp-plus-month', name: 'دفع مسبق واتساب بلاس الشهرية', price: 1573 },
    { id: 'sb-gsm-month', name: 'دفع مسبق جي اس ام الشهرية', price: 1936 },
    { id: 'sb-4g-inter-12gb', name: 'انتر 12 جيجا فورجي دفع مسبق', price: 4520 },
    { id: 'sb-4g-inter-7gb', name: 'انتر 7 جيجا فورجي دفع مسبق', price: 3420 },
    { id: 'sb-4g-inter-6gb', name: 'انتر 6 جيجا فورجي دفع مسبق', price: 2260 },
    { id: 'sb-4g-inter-week-2gb', name: 'أنتر فورجي الأسبوعية 2 جيجا- دفع مسبق', price: 990 },
    { id: 'sb-4g-inter-day-1.5gb', name: 'أنتر فورجي اليومية 1.5 جيجا- دفع مسبق', price: 500 },
    { id: 'sb-4g-hybrid-month', name: 'هايبرد فورجي الشهرية -دفع مسبق', price: 3350 },
    { id: 'sb-4g-hybrid-week', name: 'هايبرد فورجي الاسبوعيه - دفع مسبق', price: 1400 },
    { id: 'sb-4g-safari-4h', name: 'سفري 4 ساعات فورجي - دفع مسبق', price: 193 },
    { id: 'sb-4g-safari-8h', name: 'سفري 8 ساعات فورجي - دفع مسبق', price: 291 },
    { id: 'sb-4g-inter-4gb', name: 'انتر 4 جيجا فورجي- دفع مسبق', price: 1940 },
    { id: 'sb-inter-layali', name: 'انتر ليالي دفع مسبق', price: 944 },
    { id: 'sb-4g-inter-15gb', name: 'انتر فورجي 15 جيجا دفع مسبق', price: 7260 },
    { id: 'sb-4g-yb-month', name: 'يابلاش فورجي الشهرية - دفع مسبق', price: 2390 },
    { id: 'sb-4g-yb-10days', name: 'يابلاش فورجي 10 أيام دفع مسبق', price: 1330 },
    { id: 'sb-4g-yb-2days', name: 'يابلاش فورجي يومين - دفع مسبق', price: 'حسب الطلب' }, // No price given
    // فوترة (Postpaid) - Assuming these are different categories and might not be directly rechargeble here, but included for completeness. Could filter later.
    { id: 'sb-post-yb-month', name: 'فوترة يابلاش الشهرية', price: 1210 },
    { id: 'sb-post-yb-kalam', name: 'فوترة يابلاش كلام', price: 1210 },
    { id: 'sb-post-wahed-month', name: 'فوترة باقة واحد الشهرية لكل الشبكات', price: 1513 },
    { id: 'sb-post-yb-superplus', name: 'فوترة يابلاش سوبر بلاس الشهرية', price: 3025 },
    { id: 'sb-post-whatsapp-week', name: 'فوترة واتساب الأسبوعية', price: 484 },
    { id: 'sb-post-fb-twitter', name: 'فوترة فيسبوك +تويتر الاسبوعية', price: 484 },
    { id: 'sb-post-fb-plus-month', name: 'فوترة فيسبوك بلاس الشهرية', price: 1210 },
    { id: 'sb-post-tawasol-extra', name: 'فوترة تواصل اكسترا', price: 1029 },
    { id: 'sb-post-tawasol-month', name: 'فوترة تواصل الشهرية', price: 1997 },
    { id: 'sb-post-supernet-day', name: 'فوترة سوبرنت اليومية', price: 484 },
    { id: 'sb-post-supernet-1', name: 'فوترة سوبرنت 1', price: 1210 },
    { id: 'sb-post-supernet-2', name: 'فوترة سوبرنت 2', price: 1815 },
    { id: 'sb-post-supernet-3', name: 'فوترة سوبرنت3', price: 3025 },
    { id: 'sb-post-supernet-4', name: 'فوترة سوبرنت 4', price: 4840 },
    { id: 'sb-post-msg-200', name: 'فوترة 200 رسالة', price: 484 },
    { id: 'sb-post-msg-600', name: 'فوترة 600 رسالة', price: 726 },
    { id: 'sb-post-whatsapp-plus-month', name: 'فوترة واتساب بلاس الشهرية', price: 1573 },
    { id: 'sb-post-gsm-month', name: 'فوترة جي اس ام الشهرية', price: 1936 },
    { id: 'sb-post-whatsapp-plus', name: 'باقة واتساب بلاس فوترة', price: 1210 },
    { id: 'sb-post-gsm-allnet', name: 'باقة جي اس ام الشهرية لجميع شبكات الجي اس ام', price: 1936 },
    { id: 'sb-post-4g-inter-12gb', name: 'انتر 12 جيجا فورجي فوتره', price: 4520 },
    { id: 'sb-post-4g-inter-7gb', name: 'انتر 7 جيجا فورجي فوتره', price: 3420 },
    { id: 'sb-post-4g-inter-6gb', name: 'انتر 6 جيجا فورجي فوتره', price: 2260 },
    { id: 'sb-post-4g-inter-week-2gb', name: 'أنتر فورجي الأسبوعية 2 جيجا- فوترة', price: 990 },
    { id: 'sb-post-4g-inter-day-1.5gb', name: 'أنتر فورجي اليومية 1.5 جيجا- فوترة', price: 500 },
    { id: 'sb-post-4g-hybrid-month', name: 'هايبرد فورجي الشهرية- فوترة', price: 3350 },
    { id: 'sb-post-4g-safari-4h', name: 'سفري 4 ساعات فورجي - فوترة', price: 193 },
    { id: 'sb-post-4g-safari-8h', name: 'سفري 8 ساعات فورجي - فوترة', price: 291 },
    { id: 'sb-post-4g-inter-4gb', name: 'انتر 4 جيجا فورجي - فوترة', price: 1940 },
    { id: 'sb-post-inter-layali', name: 'انتر ليالي - فوترة', price: 944 },
    { id: 'sb-post-4g-inter-15gb', name: 'انتر فورجي 15 جيجا فوترة', price: 7260 },
    { id: 'sb-post-4g-yb-month', name: 'يابلاش فورجي الشهرية - فوترة', price: 2390 },
    // Old placeholder kept for quick recharge
    { id: 'sb-direct-recharge', name: 'تعبئة رصيد مباشر', price: 'حسب المبلغ', description: 'أدخل مبلغ التعبئة' },
  ],
  'YOU': [
    { id: 'you1', name: 'باقة YOU نت الشهرية', price: 1800, description: '12GB انترنت سريع + سوشال ميديا' },
     { id: 'you3', name: 'تعبئة رصيد YOU', price: 'حسب المبلغ', description: 'أدخل مبلغ التعبئة' },
  ],
   'واي': [
    { id: 'y1', name: 'باقة واي شباب الأسبوعية', price: 600, description: '2GB بيانات ومكالمات داخل الشبكة' },
     { id: 'y3', name: 'تعبئة رصيد Y', price: 'حسب المبلغ', description: 'أدخل مبلغ التعبئة' },
  ],
  'الهاتف الأرضي': [
    { id: 'll1', name: 'تسديد فاتورة الهاتف الثابت', price: 'حسب الفاتورة', description: 'سيتم جلب مبلغ الفاتورة تلقائياً' },
  ],
  'ADSL': [
    { id: 'adsl1', name: 'تجديد اشتراك ADSL الشهري', price: 'حسب الفاتورة', description: 'سيتم جلب مبلغ التجديد تلقائياً' },
  ],
};


export default function RechargePage() {
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [detectedOperator, setDetectedOperator] = React.useState<string | null>(null);
  const [operatorLogo, setOperatorLogo] = React.useState<string | null>(null);
  const [showPackages, setShowPackages] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFetchingPackages, setIsFetchingPackages] = React.useState(false);
  const [activeButtonId, setActiveButtonId] = React.useState<string | null>(null);
  const { toast } = useToast();

  const detectOperator = (number: string) => {
    let foundOperator: string | null = null;
    let logoPath: string | null = null;

     // Prioritize mobile prefixes
    for (const operator of ['يمن موبايل', 'سبأفون', 'YOU', 'واي']) {
      for (const prefix of operatorPrefixes[operator]) {
        if (number.startsWith(prefix)) {
          foundOperator = operator;
          logoPath = operatorLogos[foundOperator] || null;
          break;
        }
      }
      if (foundOperator) break;
    }

     // If no mobile operator found, check for landline/ADSL (based on '0' prefix)
     if (!foundOperator && number.startsWith('0') && number.length >= 2) {
         // Simple check for landline/ADSL based on prefix '0' + area code digit
         const areaCodePrefix = number.substring(0, 2); // e.g., '01', '02'
         if (operatorPrefixes['الهاتف الأرضي'].includes(areaCodePrefix)) {
             // Could add more logic here, e.g., length check, but for now assume '0'+area code is landline/ADSL
             foundOperator = 'الهاتف الأرضي'; // Default to Landline, could change based on length if needed
             // foundOperator = number.length > 7 ? 'ADSL' : 'الهاتف الأرضي'; // Example length check
             logoPath = operatorLogos[foundOperator] || operatorLogos['ADSL'] || null; // Use Landline or ADSL logo
         }
     }


    setDetectedOperator(foundOperator);
    setOperatorLogo(logoPath);

    if (foundOperator) {
        setShowPackages(true);
        setIsFetchingPackages(true);
        // Simulate loading packages
        setTimeout(() => setIsFetchingPackages(false), 500);
    } else {
        setShowPackages(false);
    }
  };


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
    setPhoneNumber(value);
    // Trigger detection after 2 digits generally, or 2 digits if starting with '0'
    if (value.length >= 2) {
      detectOperator(value);
    } else {
      setDetectedOperator(null);
      setOperatorLogo(null);
      setShowPackages(false);
    }
  };

 const handleRechargeClick = (pkg: PackageInfo) => {
    setActiveButtonId(pkg.id);
    setIsLoading(true);
    console.log(`Attempting to recharge package: ${pkg.name} for number: ${phoneNumber}`);
    toast({
      title: "بدء عملية الشحن",
      description: `جاري شحن ${pkg.name} للرقم ${phoneNumber}...`,
      variant: 'default',
    });

    setTimeout(() => {
      setIsLoading(false);
      setActiveButtonId(null);
      const isSuccess = Math.random() > 0.2;
      if (isSuccess) {
         toast({
            title: "نجاح العملية",
            description: `تم شحن ${pkg.name} بنجاح للرقم ${phoneNumber}!`,
            variant: "default", // Use primary color style for success
        });
      } else {
         toast({
            title: "فشل العملية",
            description: `حدث خطأ أثناء شحن ${pkg.name}. يرجى المحاولة لاحقاً.`,
            variant: "destructive", // Use destructive (red) style
        });
      }
    }, 1500);
  };


  return (
     // Use bg-background (#F7F9FA)
    <div className="flex min-h-screen flex-col bg-[#F7F9FA] text-[#333333]"> {/* Updated background and text color */}
       {/* Header - Primary background (#007B8A), White text */}
       <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-[#007B8A] px-4 py-2 text-white shadow-md"> {/* Updated header bg and text color */}
         {/* Back button to /services */}
        <Link href="/services" passHref>
          <Button variant="ghost" size="icon" className="text-white hover:bg-[#007B8A]/80"> {/* White icon */}
            <ArrowRight className="h-5 w-5" />
            <span className="sr-only">رجوع</span>
          </Button>
        </Link>
         {/* Title - White text */}
        <h1 className="text-lg font-medium">التعبئة</h1> {/* White title text */}
        <div className="w-10"></div> {/* Placeholder to balance */}
      </header>

      {/* Main Content Area */}
        <main className="flex-1 space-y-4 p-4 pt-6 md:p-6 md:pt-8"> {/* Padding: 16px */}
         {/* Phone Number Input Container */}
         <div className="relative flex items-center">
            {/* Input field: White bg, rounded 8px, shadow */}
            <Input
              type="tel"
              placeholder="أدخل رقم الهاتف أو الأرضي"
              value={phoneNumber}
              onChange={handleInputChange}
              // Apply specified styling: h-12, rounded-md (8px), shadow-sm, text-lg, border
               className={cn(
                 "h-12 w-full rounded-[8px] border border-border bg-white py-3 pl-4 pr-12 text-lg shadow-sm placeholder-[#9E9E9E] focus:border-[#007B8A] focus:ring-1 focus:ring-[#007B8A] text-[#333333]", // pr-12 for logo space, updated colors
                 "text-right" // Align text to the right for RTL numbers
              )}
              maxLength={15}
               dir="ltr" // Keep LTR for number input behavior
            />
            {/* Operator Logo - Positioned inside input field (right side) */}
            {operatorLogo && (
                   // Ensure logo is 32x32 and positioned correctly
                   <div className="absolute right-3 top-1/2 h-8 w-8 -translate-y-1/2 transform overflow-hidden rounded-md"> {/* 32x32px */}
                    <Image src={operatorLogo} alt={detectedOperator || 'Operator'} width={32} height={32} className="object-contain" />
                  </div>
            )}
        </div>

         {/* Operator/Error Message */}
         {/* Show error if number entered but no operator detected */}
         {phoneNumber.length >= 2 && !detectedOperator && (
           <p className="text-center text-sm text-destructive">المشغل غير مدعوم حالياً.</p> // Use destructive color for error
        )}

        {/* Package List Section */}
         {showPackages && detectedOperator && (
           <div className="mt-4">
              {/* Title for packages - Use main text color */}
               <h2 className="mb-3 text-center text-base font-semibold text-[#333333]"> {/* Updated text color */}
                 <Package className="inline-block h-5 w-5 mr-2 align-middle text-[#333333]"/> {/* Updated icon color */}
                 باقات {detectedOperator} المتاحة
             </h2>
             {/* Scrollable area for packages */}
                <ScrollArea className="h-[calc(100vh-280px)]"> {/* Adjust height based on header/input */}
                 {isFetchingPackages ? (
                      <div className="flex justify-center items-center p-10">
                        <Loader2 className="h-8 w-8 animate-spin text-[#007B8A]" /> {/* Use primary color for spinner */}
                      </div>
                 ) : (packagesData[detectedOperator] || []).length > 0 ? (
                     <div className="space-y-2"> {/* space-y-2 for 8px margin */}
                        {packagesData[detectedOperator]?.map((pkg) => (
                            // Package Card: White bg, rounded-xl (12px), shadow-md
                           <Card key={pkg.id} className="overflow-hidden rounded-[12px] bg-white p-3 shadow-md transition-transform duration-150 ease-in-out active:scale-[0.98] active:shadow active:translate-y-[2px]"> {/* rounded-xl (12px), p-3, active effect */}
                              <div className="flex items-center justify-between gap-3">
                                  {/* Package details */}
                                   <div className="flex-1 space-y-1 text-right"> {/* Text align right */}
                                        {/* Package Name: Dark grey, Bold */}
                                        <p className="text-base font-semibold text-[#333333]">{pkg.name}</p>
                                        {/* Description: Medium grey */}
                                        {pkg.description && <p className="text-xs text-[#666666]">{pkg.description}</p>}
                                       {/* Price: Primary color */}
                                       <p className="text-sm font-medium text-[#007B8A] flex items-center justify-end gap-1 pt-1"> {/* Updated Price Color */}
                                           <CircleDollarSign className="h-4 w-4" />
                                            {typeof pkg.price === 'number' && pkg.price > 0
                                              ? `${pkg.price} ريال`
                                              : pkg.price}
                                       </p>
                                   </div>
                                    {/* Recharge Button: Accent bg (#FF6F3C), White text, rounded 8px */}
                                    <Button
                                      size="sm"
                                       variant="default" // Use default variant and override colors
                                       className="px-4 py-1.5 text-sm font-medium shadow-sm h-auto rounded-[8px] transition-all bg-[#FF6F3C] text-white hover:bg-[#FF6F3C]/90 active:bg-[#FF6F3C]/80" // Accent color button
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
                      // No packages message: Medium grey text
                      <p className="p-6 text-center text-[#666666]">لا توجد باقات متاحة حالياً لهذا المشغل.</p>
                 )}
                </ScrollArea>
           </div>
        )}
      </main>
    </div>
  );
}

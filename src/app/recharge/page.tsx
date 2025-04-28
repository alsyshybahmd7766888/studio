'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Phone, Wifi, CircleDollarSign, Package, Loader2 } from 'lucide-react'; // Use ArrowLeft for back, added relevant icons
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area'; // For package list
import Image from 'next/image'; // For operator logos
import { useToast } from '@/hooks/use-toast';

// Operator detection logic and data
const operatorPrefixes: { [key: string]: string[] } = {
  'Yemen Mobile': ['77', '78'],
  'SabaFon': ['71'],
  'YOU': ['73'],
  'Y': ['70'],
  'Landline': ['01', '02', '03', '04', '05', '06', '07', '08', '09'],
  // ADSL uses the same prefixes as Landline
};

const operatorLogos: { [key: string]: string } = {
  'Yemen Mobile': '/logos/yemen-mobile.png', // Replace with actual paths
  'SabaFon': '/logos/sabafon.png',
  'YOU': '/logos/you.png',
  'Y': '/logos/y.png',
  'Landline': '/logos/landline.png',
  'ADSL': '/logos/adsl.png', // Separate logo for ADSL if needed
};

// Placeholder package data (replace with actual API call or data source)
interface PackageInfo {
    id: string;
    name: string;
    price: number;
    description?: string;
}

const packagesData: { [key: string]: PackageInfo[] } = {
  'Yemen Mobile': [
    { id: 'ym1', name: 'باقة موبايل 1', price: 500, description: '1GB بيانات + 50 دقيقة' },
    { id: 'ym2', name: 'باقة موبايل 2', price: 1000, description: '3GB بيانات + 100 دقيقة' },
    { id: 'ym3', name: 'باقة موبايل 3', price: 2000, description: '7GB بيانات + 200 دقيقة' },
  ],
  'SabaFon': [
    { id: 'sb1', name: 'باقة سبافون ذهبية', price: 750, description: 'بيانات ودقائق مميزة' },
    { id: 'sb2', name: 'باقة سبافون فضية', price: 400 },
  ],
  'YOU': [
    { id: 'you1', name: 'باقة YOU نت', price: 1200, description: '10GB انترنت سريع' },
    { id: 'you2', name: 'باقة YOU مكس', price: 900 },
  ],
   'Y': [
    { id: 'y1', name: 'باقة واي شباب', price: 600, description: 'بيانات ومكالمات' },
    { id: 'y2', name: 'باقة واي أعمال', price: 1500 },
  ],
  'Landline': [
    { id: 'll1', name: 'تسديد فاتورة الهاتف الثابت', price: 0, description: 'أدخل المبلغ المطلوب' }, // Example for bill payment
  ],
    'ADSL': [
    { id: 'adsl1', name: 'تجديد اشتراك ADSL', price: 0, description: 'أدخل مبلغ التجديد' },
    { id: 'adsl2', name: 'باقة ADSL بسرعة 4Mbps', price: 3000 },
  ],
};

export default function RechargePage() {
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [detectedOperator, setDetectedOperator] = React.useState<string | null>(null);
  const [operatorLogo, setOperatorLogo] = React.useState<string | null>(null);
  const [showPackages, setShowPackages] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false); // For future API calls
  const { toast } = useToast();

  const detectOperator = (number: string) => {
    let foundOperator: string | null = null;
    let isLandlineOrADSL = false;

    for (const operator in operatorPrefixes) {
      for (const prefix of operatorPrefixes[operator]) {
        if (number.startsWith(prefix)) {
           // Check specifically for landline/ADSL based on prefix length and content
           if (prefix.startsWith('0') && prefix.length === 2) {
             isLandlineOrADSL = true;
             // Simple heuristic: assume ADSL if number looks like a typical phone number length
             // This needs refinement based on actual ADSL number patterns if different
             foundOperator = number.length > 5 ? 'ADSL' : 'Landline';
           } else if (!isLandlineOrADSL) {
             // Assign mobile operator only if not already identified as landline/ADSL
             foundOperator = operator;
           }
           break; // Found a match for this operator
        }
      }
       if (foundOperator && (!isLandlineOrADSL || (isLandlineOrADSL && foundOperator))) break; // Exit outer loop if mobile or specific landline/ADSL found
    }


    setDetectedOperator(foundOperator);
    setOperatorLogo(foundOperator ? operatorLogos[foundOperator] || null : null);
    setShowPackages(!!foundOperator); // Show packages only if an operator is detected
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
    setIsLoading(true); // Show loading indicator
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
            description: `تم شحن ${pkg.name} بنجاح!`,
            variant: "default", // Use 'success' variant if available and styled
        });
        // Optionally clear input or navigate away
        // setPhoneNumber('');
        // setDetectedOperator(null);
        // setOperatorLogo(null);
        // setShowPackages(false);
      } else {
         toast({
            title: "فشل العملية",
            description: `حدث خطأ أثناء شحن ${pkg.name}. يرجى المحاولة مرة أخرى.`,
            variant: "destructive",
        });
      }
    }, 2000); // Simulate 2 second delay
  };


  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-primary px-4 py-2 text-primary-foreground shadow-md">
        <Link href="/services" passHref> {/* Link back to services page */}
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">رجوع</span>
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">التعبئة</h1>
        <div className="w-10"></div> {/* Placeholder for balance or actions */}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 pt-6 space-y-4">
        {/* Phone Number Input */}
        <div className="relative flex items-center">
           <Input
              type="tel" // Use tel type for numeric keyboard on mobile
              placeholder="أدخل رقم الهاتف أو الأرضي"
              value={phoneNumber}
              onChange={handleInputChange}
              className="w-full rounded-lg border-border bg-card p-4 pr-12 text-lg shadow-sm focus:ring-2 focus:ring-ring" // Adjusted padding for logo
              maxLength={15} // Optional: limit input length
            />
            {operatorLogo && (
                 <div className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center">
                   <Image src={operatorLogo} alt={detectedOperator || 'Operator'} width={32} height={32} className="object-contain" />
                 </div>
            )}
        </div>

        {/* Operator Message */}
        {phoneNumber.length >= 2 && !detectedOperator && (
          <p className="text-center text-sm text-muted-foreground">المشغل غير مدعوم حالياً.</p>
        )}

        {/* Package List */}
        {showPackages && detectedOperator && (
          <Card className="overflow-hidden rounded-xl bg-card shadow-md">
             <CardHeader className="bg-muted/50 p-4">
                <CardTitle className="text-center text-base font-semibold text-foreground">
                    باقات {detectedOperator} المتاحة
                </CardTitle>
             </CardHeader>
            <CardContent className="p-0">
               <ScrollArea className="h-[calc(100vh-250px)]"> {/* Adjust height as needed */}
                <div className="space-y-2 p-4">
                  {(packagesData[detectedOperator] || []).length > 0 ? (
                    packagesData[detectedOperator]?.map((pkg) => (
                      <Card key={pkg.id} className="rounded-lg bg-background shadow-sm transition-transform duration-150 ease-in-out hover:translate-y-[-2px] hover:shadow-md active:translate-y-0 active:shadow-sm">
                        <CardContent className="flex items-center justify-between p-3">
                          <div className="space-y-1">
                            <p className="text-base font-semibold text-foreground">{pkg.name}</p>
                            {pkg.description && <p className="text-xs text-muted-foreground">{pkg.description}</p>}
                            <p className="text-sm font-medium text-primary flex items-center gap-1">
                                <CircleDollarSign className="h-4 w-4" />
                                {pkg.price > 0 ? `${pkg.price} ريال` : 'حسب الفاتورة'}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="default"
                            className="bg-accent px-3 py-1 text-sm text-accent-foreground hover:bg-accent/90 active:bg-accent/80 h-auto rounded-md"
                            onClick={() => handleRechargeClick(pkg)}
                            disabled={isLoading}
                          >
                             {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Package className="mr-1 h-4 w-4" />}
                            اشحن الآن
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="p-4 text-center text-muted-foreground">لا توجد باقات متاحة حالياً لهذا المشغل.</p>
                  )}
                </div>
               </ScrollArea>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

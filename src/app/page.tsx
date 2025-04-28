'use client';

import * as React from 'react';
import { Smartphone, Package, Gamepad2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import MobileTopupCard from '@/components/mobile-topup-card';
import PackageCard from '@/components/package-card';
import PubgCard from '@/components/pubg-card';
import ConfirmationDialog from '@/components/confirmation-dialog';
import { useToast } from '@/hooks/use-toast';

type RechargeOption = {
  type: string;
  value: string | number;
  description: string;
};

export default function Home() {
  const [selectedOption, setSelectedOption] = React.useState<RechargeOption | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { toast } = useToast();

  const handleSelectOption = (option: RechargeOption) => {
    setSelectedOption(option);
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    setIsDialogOpen(false);
    // Simulate recharge processing
    toast({
      title: "⏳ جاري معالجة الطلب",
      description: `جاري تعبئة ${selectedOption?.description}...`,
    });

    setTimeout(() => {
      toast({
        title: "✅ تمت العملية بنجاح!",
        description: `تمت تعبئة ${selectedOption?.description} بنجاح.`,
        variant: "default", // Use default variant which can be styled with accent color via CSS if needed
        className: "bg-accent text-accent-foreground border-green-600", // Apply green accent directly for success
      });
      setSelectedOption(null); // Reset selection
    }, 2000); // Simulate 2 seconds delay
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setSelectedOption(null); // Reset selection
  };

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center p-8">
      <h1 className="mb-12 text-4xl font-bold text-primary">Easy Recharge</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        أسهل طريقة لتعبئة رصيدك، شراء الباقات، وشحن شدات ببجي
      </p>

      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Mobile Top-up Card */}
        <Card className="shadow-md transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">تعبئة رصيد الجوال</CardTitle>
            <Smartphone className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              اختر المبلغ الذي ترغب بتعبئته.
            </CardDescription>
            <MobileTopupCard onSelect={handleSelectOption} />
          </CardContent>
        </Card>

        {/* Packages Card */}
        <Card className="shadow-md transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">شراء الباقات</CardTitle>
            <Package className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              اختر باقة الإنترنت أو المكالمات المناسبة.
            </CardDescription>
            <PackageCard onSelect={handleSelectOption} />
          </CardContent>
        </Card>

        {/* PUBG UC Card */}
        <Card className="shadow-md transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">شحن شدات ببجي</CardTitle>
            <Gamepad2 className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              اختر كمية الشدات التي تريد شحنها.
            </CardDescription>
            <PubgCard onSelect={handleSelectOption} />
          </CardContent>
        </Card>
      </div>

      {selectedOption && (
        <ConfirmationDialog
          isOpen={isDialogOpen}
          onClose={handleCancel}
          onConfirm={handleConfirm}
          option={selectedOption}
        />
      )}
    </main>
  );
}

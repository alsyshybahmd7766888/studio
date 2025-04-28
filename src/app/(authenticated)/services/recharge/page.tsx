
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
  'YOU': ['73'], // YOU (MTN)
  'واي': ['70'], // Explicitly name 'Y' as 'واي'
  'الهاتف الأرضي': ['01', '02', '03', '04', '05', '06', '07', '08', '09'], // Assuming single digits 0 to 9 for area codes
  'ADSL': ['01', '02', '03', '04', '05', '06', '07', '08', '09'], // ADSL shares prefixes
};


// Operator logos (ensure these paths exist or use placeholders)
// Assuming logos directory exists in public/logos/
const operatorLogos: { [key: string]: string } = {
  'يمن موبايل': '/logos/yemen-mobile.png', // Placeholder path
  'سبأفون': '/logos/sabafon.png',         // Placeholder path
  'YOU': '/logos/you.png',               // Placeholder path (Represents MTN/YOU)
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
    category?: string; // Optional category for potential grouping later
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
    { id: 'sb-dp-yb-week', name: 'دفع مسبق يابلاش الاسبوعية', price: 484 },
    { id: 'sb-dp-yb-month', name: 'دفع مسبق يابلاش الشهرية', price: 1210 },
    { id: 'sb-dp-yb-superplus', name: 'دفع مسبق يابلاش سوبر بلاس', price: 3025 },
    { id: 'sb-dp-yb-kalam', name: 'دفع مسبق يابلاش كلام- 400 دقيقة- 30يوم', price: 1210 },
    { id: 'sb-dp-whatsapp-week', name: 'دفع مسبق واتساب الأسبوعية', price: 484 },
    { id: 'sb-dp-fb-twitter', name: 'دفع مسبق فيسبوك+تويتر', price: 484 },
    { id: 'sb-dp-fb-month', name: 'دفع مسبق فيسبوك الشهرية', price: 1210 },
    { id: 'sb-dp-tawasol-extra', name: 'دفع مسبق تواصل اكسترا الشهرية', price: 1029 },
    { id: 'sb-dp-tawasol-month', name: 'دفع مسبق تواصل الشهرية- فيسبوك', price: 1997 },
    { id: 'sb-dp-supernet-day', name: 'دفع مسبق سوبرنت اليومية', price: 484 },
    { id: 'sb-dp-supernet-1', name: 'دفع مسبق سوبرنت 1-250 ميجابايت 30 يوم', price: 1210 },
    { id: 'sb-dp-supernet-2', name: 'دفع مسبق سوبرنت 2 - 500 ميجابايت 30 يوم', price: 1815 },
    { id: 'sb-dp-supernet-3', name: 'دفع مسبق سوبرنت 3- 1024 ميجا 30 يوم', price: 3025 },
    { id: 'sb-dp-supernet-4', name: 'دفع مسبق سوبرنت 4- 4000 ميجا 30يوم', price: 4840 },
    { id: 'sb-dp-msg-200', name: 'دفع مسبق 200 رسالة', price: 484 },
    { id: 'sb-dp-msg-600', name: 'دفع مسبق 600 رسالة', price: 726 },
    { id: 'sb-dp-gsm-week', name: 'دفع مسبق جي إس إم الاسبوعية', price: 1004 },
    { id: 'sb-dp-wahed-day', name: 'دفع مسبق باقة واحد اليومية لكل الشبكات', price: 508 },
    { id: 'sb-dp-wahed-month', name: 'دفع مسبق باقة واحد الشهرية لكل الشبكات', price: 1513 },
    { id: 'sb-dp-wahed-week-all', name: 'باقة واحد الاسبوعية- دفع مسبق لكل الشبكات', price: 811 },
    { id: 'sb-dp-yb-daily', name: 'دفع مسبق يابلاش اليومية', price: 575 },
    { id: 'sb-dp-yb-10days', name: 'دفع مسبق يابلاش 10 ايام', price: 847 },
    { id: 'sb-dp-whatsapp-plus-month', name: 'دفع مسبق واتساب بلاس الشهرية', price: 1573 },
    { id: 'sb-dp-gsm-month', name: 'دفع مسبق جي اس ام الشهرية', price: 1936 },
    { id: 'sb-dp-4g-inter-12gb', name: 'انتر 12 جيجا فورجي دفع مسبق', price: 4520 },
    { id: 'sb-dp-4g-inter-7gb', name: 'انتر 7 جيجا فورجي دفع مسبق', price: 3420 },
    { id: 'sb-dp-4g-inter-6gb', name: 'انتر 6 جيجا فورجي دفع مسبق', price: 2260 },
    { id: 'sb-dp-4g-inter-week-2gb', name: 'أنتر فورجي الأسبوعية 2 جيجا- دفع مسبق', price: 990 },
    { id: 'sb-dp-4g-inter-day-1.5gb', name: 'أنتر فورجي اليومية 1.5 جيجا- دفع مسبق', price: 500 },
    { id: 'sb-dp-4g-hybrid-month', name: 'هايبرد فورجي الشهرية -دفع مسبق', price: 3350 },
    { id: 'sb-dp-4g-hybrid-week', name: 'هايبرد فورجي الاسبوعيه - دفع مسبق', price: 1400 },
    { id: 'sb-dp-4g-safari-4h', name: 'سفري 4 ساعات فورجي - دفع مسبق', price: 193 },
    { id: 'sb-dp-4g-safari-8h', name: 'سفري 8 ساعات فورجي - دفع مسبق', price: 291 },
    { id: 'sb-dp-4g-inter-4gb', name: 'انتر 4 جيجا فورجي- دفع مسبق', price: 1940 },
    { id: 'sb-dp-inter-layali', name: 'انتر ليالي دفع مسبق', price: 944 },
    { id: 'sb-dp-4g-inter-15gb', name: 'انتر فورجي 15 جيجا دفع مسبق', price: 7260 },
    { id: 'sb-dp-4g-yb-month', name: 'يابلاش فورجي الشهرية - دفع مسبق', price: 2390 },
    { id: 'sb-dp-4g-yb-10days', name: 'يابلاش فورجي 10 أيام دفع مسبق', price: 1330 },
    { id: 'sb-dp-4g-yb-2days', name: 'يابلاش فورجي يومين - دفع مسبق', price: 'حسب الطلب' }, // No price given
    // فوترة (Postpaid) - May filter out later if not directly rechargeable
    { id: 'sb-post-yb-month', name: 'فوترة يابلاش الشهرية', price: 1210, category: 'فوترة' },
    { id: 'sb-post-yb-kalam', name: 'فوترة يابلاش كلام', price: 1210, category: 'فوترة' },
    { id: 'sb-post-wahed-month', name: 'فوترة باقة واحد الشهرية لكل الشبكات', price: 1513, category: 'فوترة' },
    { id: 'sb-post-yb-superplus', name: 'فوترة يابلاش سوبر بلاس الشهرية', price: 3025, category: 'فوترة' },
    { id: 'sb-post-whatsapp-week', name: 'فوترة واتساب الأسبوعية', price: 484, category: 'فوترة' },
    { id: 'sb-post-fb-twitter', name: 'فوترة فيسبوك +تويتر الاسبوعية', price: 484, category: 'فوترة' },
    { id: 'sb-post-fb-plus-month', name: 'فوترة فيسبوك بلاس الشهرية', price: 1210, category: 'فوترة' },
    { id: 'sb-post-tawasol-extra', name: 'فوترة تواصل اكسترا', price: 1029, category: 'فوترة' },
    { id: 'sb-post-tawasol-month', name: 'فوترة تواصل الشهرية', price: 1997, category: 'فوترة' },
    { id: 'sb-post-supernet-day', name: 'فوترة سوبرنت اليومية', price: 484, category: 'فوترة' },
    { id: 'sb-post-supernet-1', name: 'فوترة سوبرنت 1', price: 1210, category: 'فوترة' },
    { id: 'sb-post-supernet-2', name: 'فوترة سوبرنت 2', price: 1815, category: 'فوترة' },
    { id: 'sb-post-supernet-3', name: 'فوترة سوبرنت3', price: 3025, category: 'فوترة' },
    { id: 'sb-post-supernet-4', name: 'فوترة سوبرنت 4', price: 4840, category: 'فوترة' },
    { id: 'sb-post-msg-200', name: 'فوترة 200 رسالة', price: 484, category: 'فوترة' },
    { id: 'sb-post-msg-600', name: 'فوترة 600 رسالة', price: 726, category: 'فوترة' },
    { id: 'sb-post-whatsapp-plus-month', name: 'فوترة واتساب بلاس الشهرية', price: 1573, category: 'فوترة' },
    { id: 'sb-post-gsm-month', name: 'فوترة جي اس ام الشهرية', price: 1936, category: 'فوترة' },
    { id: 'sb-post-whatsapp-plus', name: 'باقة واتساب بلاس فوترة', price: 1210, category: 'فوترة' },
    { id: 'sb-post-gsm-allnet', name: 'باقة جي اس ام الشهرية لجميع شبكات الجي اس ام', price: 1936, category: 'فوترة' },
    { id: 'sb-post-4g-inter-12gb', name: 'انتر 12 جيجا فورجي فوتره', price: 4520, category: 'فوترة' },
    { id: 'sb-post-4g-inter-7gb', name: 'انتر 7 جيجا فورجي فوتره', price: 3420, category: 'فوترة' },
    { id: 'sb-post-4g-inter-6gb', name: 'انتر 6 جيجا فورجي فوتره', price: 2260, category: 'فوترة' },
    { id: 'sb-post-4g-inter-week-2gb', name: 'أنتر فورجي الأسبوعية 2 جيجا- فوترة', price: 990, category: 'فوترة' },
    { id: 'sb-post-4g-inter-day-1.5gb', name: 'أنتر فورجي اليومية 1.5 جيجا- فوترة', price: 500, category: 'فوترة' },
    { id: 'sb-post-4g-hybrid-month', name: 'هايبرد فورجي الشهرية- فوترة', price: 3350, category: 'فوترة' },
    { id: 'sb-post-4g-safari-4h', name: 'سفري 4 ساعات فورجي - فوترة', price: 193, category: 'فوترة' },
    { id: 'sb-post-4g-safari-8h', name: 'سفري 8 ساعات فورجي - فوترة', price: 291, category: 'فوترة' },
    { id: 'sb-post-4g-inter-4gb', name: 'انتر 4 جيجا فورجي - فوترة', price: 1940, category: 'فوترة' },
    { id: 'sb-post-inter-layali', name: 'انتر ليالي - فوترة', price: 944, category: 'فوترة' },
    { id: 'sb-post-4g-inter-15gb', name: 'انتر فورجي 15 جيجا فوترة', price: 7260, category: 'فوترة' },
    { id: 'sb-post-4g-yb-month', name: 'يابلاش فورجي الشهرية - فوترة', price: 2390, category: 'فوترة' },
    // Old placeholder kept for quick recharge
    { id: 'sb-direct-recharge', name: 'تعبئة رصيد مباشر', price: 'حسب المبلغ', description: 'أدخل مبلغ التعبئة' },
  ],
  'YOU': [
    // باقات سوى
    { id: 'you-sawa-250-300', name: 'سوا 250 دقيقة 300 رسالة الشهرية', price: 1815, category: 'باقات سوى' },
    // باقات التواصل الاجتماعية
    { id: 'you-social-daily', name: 'توفير اليومية', price: 496, category: 'باقات التواصل الاجتماعية' },
    { id: 'you-whatsapp-unlimited', name: 'واتساب بلاحدود', price: 484, category: 'باقات التواصل الاجتماعية' },
    // باقات مكس المميزة الشهرية
    { id: 'you-mix-plus', name: 'مكس بلس', price: 1513, category: 'باقات مكس المميزة الشهرية' },
    { id: 'you-mix-300-400-100', name: 'مكس (300دقيقة 400 رسالة 100 ميجا ) دفع مسبق', price: 1250, category: 'باقات مكس المميزة الشهرية' },
    { id: 'you-mix-600-700-300', name: 'مكس (600 دقيقة - 700 رسالة - 300 ميجا ) دفع مسبق', price: 2420, category: 'باقات مكس المميزة الشهرية' },
    { id: 'you-mix-weekly', name: 'مكس الاسبوعية', price: 496, category: 'باقات مكس المميزة الشهرية' },
    // باقات اتصال مكالمات فقط
    { id: 'you-calls-400', name: 'مكالمات 400 دقيقة', price: 1210, category: 'باقات اتصال مكالمات فقط' },
    { id: 'you-calls-600-weekly', name: 'مكالمات 600 دقيقة الأسبوعية', price: 1004, category: 'باقات اتصال مكالمات فقط' },
    // باقات رسائل
    { id: 'you-sms-750', name: 'باقة رسايل 750 رسالة', price: 1210, category: 'باقات رسائل' },
    // باقات فورجي
    { id: 'you-4g-smart-0.5gb-24h', name: 'سمارت 0.5 جيجا فورجي (24 ساعة )', price: 266, category: 'باقات فورجي' },
    { id: 'you-4g-smart-1gb-48h', name: 'سمارت 1 جيجا فورجي (48 ساعة)', price: 484, category: 'باقات فورجي' },
    { id: 'you-4g-smart-5gb-14d', name: 'سمارت 5 جيجا فورجي (14 يوم)', price: 2420, category: 'باقات فورجي' },
    { id: 'you-4g-smart-8gb-30d', name: 'سمارت 8 جيجا فورجي( 30 يوم)', price: 3485, category: 'باقات فورجي' },
    { id: 'you-4g-mix-1.5gb-72h', name: 'مكس 1.5 جيجا فورجي( 72 ساعة )', price: 962, category: 'باقات فورجي' },
    { id: 'you-4g-mix-6gb-30d', name: 'مكس 6 جيجا فورجي (30 يوم)', price: 3412, category: 'باقات فورجي' },
    { id: 'you-4g-smart-3gb', name: 'سمارت 3 جيجا فورجي', price: 1452, category: 'باقات فورجي' },
    { id: 'you-4g-mix-30gb', name: 'مكس 30 جيجا فورجي', price: 14714, category: 'باقات فورجي' },
    { id: 'you-4g-wafer-9gb', name: 'وفر 9 جيجا فورجي', price: 3485, category: 'باقات فورجي' },
    { id: 'you-4g-wafer-plus-10gb', name: 'باقة وفر بلس 10 جيجا 4G-فورجي', price: 2500, category: 'باقات فورجي' },
    { id: 'you-4g-mix-monthly-10gb', name: 'باقة مكس الشهرية 10 جيجا فورجي', price: 5990, category: 'باقات فورجي' },
    // باقة سمارت نت
    { id: 'you-smartnet-2gb-weekly', name: 'باقة 2 جيجاالأسبوعية', price: 1210, category: 'باقة سمارت نت' },
    { id: 'you-smartnet-postpaid-500mb', name: 'فوترة 500 ميجا', price: 1210, category: 'باقة سمارت نت' }, // Assuming this is related to smartnet
    { id: 'you-smartnet-2g-1gb-monthly-dp', name: 'باقه توجي سمارت نت1جيجا الشهرية دفع مسبق', price: 1210, category: 'باقة سمارت نت' },
    { id: 'you-smartnet-4g-20gb', name: 'باقة سمارت 20 جيجا 4G-فورجي', price: 9680, category: 'باقة سمارت نت' },
    // باقات الربط الموحد
    { id: 'you-unified-4gmax-12gb', name: 'باقة السعر الموحد فورجي ماكس 12جيجا', price: 9874, category: 'باقات الربط الموحد' },
    { id: 'you-unified-4gmax-5gb', name: 'باقة السعر الموحد فورجي ماكس 5جيجا', price: 5445, category: 'باقات الربط الموحد' },
    { id: 'you-unified-mix-10000', name: 'باقة السعر الموحد مكس 10000', price: 9862, category: 'باقات الربط الموحد' },
    { id: 'you-unified-mix-5000', name: 'باقة السعر الموحد مكس 5000', price: 4901, category: 'باقات الربط الموحد' },
    { id: 'you-unified-4g-4gb', name: 'باقه السعر الموحد 4 جيجا فورجي', price: 2904, category: 'باقات الربط الموحد' },
    { id: 'you-unified-wafer-plus-10gb', name: 'باقة وفر بلس 10 جيجا السعر الموحد', price: 2500, category: 'باقات الربط الموحد' },
    { id: 'you-unified-sawa-300', name: 'باقة سوا 300 السعر الموحد', price: 2904, category: 'باقات الربط الموحد' },
    { id: 'you-unified-smart-4g-daily', name: 'باقه السعر الموحد سمارت فورجي اليوميه', price: 1815, category: 'باقات الربط الموحد' },
    { id: 'you-unified-smart-4g-weekly', name: 'باقه السعر الموحد سمارت فورجي الاسبوعيه', price: 2251, category: 'باقات الربط الموحد' },
    { id: 'you-unified-smart-4g-15gb', name: 'فورجي سمارت15جيجا - السعر الموحد', price: 12705, category: 'باقات الربط الموحد' },
    // باقات هلال فورجي
    { id: 'you-hilal-4g-1gb', name: 'باقة هلال 1جيجا فورجي', price: 300, category: 'باقات هلال فورجي' },
    { id: 'you-hilal-4g-2gb', name: 'باقة هلال 2جيجا فورجي', price: 500, category: 'باقات هلال فورجي' },
    { id: 'you-hilal-4g-3gb', name: 'باقة هلال 3جيجا فورجي', price: 699, category: 'باقات هلال فورجي' },
    // Direct Recharge fallback
    { id: 'you-direct-recharge', name: 'تعبئة رصيد YOU', price: 'حسب المبلغ', description: 'أدخل مبلغ التعبئة' },
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

  // Group packages by category for rendering
  const groupedPackages = React.useMemo(() => {
      if (!detectedOperator || !packagesData[detectedOperator]) return {};
      return packagesData[detectedOperator].reduce((acc, pkg) => {
          const category = pkg.category || 'عام'; // Default category if none provided
          if (!acc[category]) {
              acc[category] = [];
          }
          acc[category].push(pkg);
          return acc;
      }, {} as Record<string, PackageInfo[]>);
  }, [detectedOperator]);


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
                 ) : Object.keys(groupedPackages).length > 0 ? (
                     <div className="space-y-4"> {/* space-y-4 for spacing between categories */}
                         {Object.entries(groupedPackages).map(([category, pkgs]) => (
                             <div key={category}>
                                 {/* Category Title (Optional but recommended) */}
                                 {category !== 'عام' && (
                                     <h3 className="mb-2 px-1 text-base font-medium text-[#666666]">{category}</h3>
                                 )}
                                 <div className="space-y-2"> {/* space-y-2 for 8px margin between packages */}
                                     {pkgs.map((pkg) => (
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
                             </div>
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


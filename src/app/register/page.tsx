'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import {
  User,
  Store,
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  UploadCloud,
  CheckCircle, // Updated Address Icon
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Removed TabsContent as it's not used here
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast'; // Import useToast

export default function RegisterPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    fullName: '',
    businessActivity: '',
    phoneNumber: '',
    address: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [idType, setIdType] = React.useState('personal-id'); // State for selected ID type
  const [idImageFront, setIdImageFront] = React.useState<File | null>(null);
  const [idImageBack, setIdImageBack] = React.useState<File | null>(null);
  const frontImageRef = React.useRef<HTMLInputElement>(null);
  const backImageRef = React.useRef<HTMLInputElement>(null);

  const router = useRouter(); // Initialize useRouter
  const { toast } = useToast(); // Initialize useToast

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
      if (e.target.files && e.target.files[0]) {
          if (side === 'front') {
              setIdImageFront(e.target.files[0]);
              console.log('Front image selected:', e.target.files[0].name);
          } else {
              setIdImageBack(e.target.files[0]);
              console.log('Back image selected:', e.target.files[0].name);
          }
      }
  };

  const handleRegister = async () => {
    console.log('Registration attempt with data:', { ...formData, idType });
    console.log('Front Image:', idImageFront?.name);
    console.log('Back Image:', idImageBack?.name);

    // --- Basic Client-Side Validation ---
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'خطأ في التسجيل',
        description: 'كلمتا المرور غير متطابقتين.',
        variant: 'destructive',
      });
      return;
    }
    if (!formData.fullName || !formData.phoneNumber || !formData.username || !formData.password || !idImageFront) {
         toast({
            title: 'خطأ في التسجيل',
            description: 'يرجى ملء جميع الحقول الإلزامية وتحميل صورة الوثيقة الأمامية.',
            variant: 'destructive',
         });
         return;
     }

    // --- Simulate Backend Registration & OCR ---
    // 1. Send formData and image files (idImageFront, idImageBack) to your backend API.
    // 2. Backend saves user data (potentially pending verification).
    // 3. Backend uses an OCR (Optical Character Recognition) service (like Google Cloud Vision AI, AWS Textract)
    //    to extract text from the uploaded ID image (idImageFront).
    // 4. Backend compares the extracted name from OCR with `formData.fullName`.
    // 5. If names match (with some tolerance for variations):
    //    - Mark the account as verified (or partially verified).
    //    - Generate a temporary password or send the user's chosen password via SMS (using services like Twilio, Vonage).
    //    - Send SMS: "تم قبول حسابك. كلمة المرور: [password]"
    // 6. If names don't match or OCR fails:
    //    - Keep account pending manual review or reject registration.
    //    - Inform the user.

    toast({
      title: 'جاري معالجة التسجيل...',
      description: 'يتم التحقق من البيانات ورفع الوثائق.',
      variant: 'default', // Use default (primary) style
    });

    // Simulate API call delay and success/failure
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate OCR and validation result
    const isMatch = Math.random() > 0.3; // Simulate 70% success rate for name match

    if (isMatch) {
      toast({
        title: 'نجاح التسجيل',
        description: 'تم قبول حسابك بنجاح! تم إرسال كلمة المرور إلى رقم هاتفك.',
        variant: 'default', // Use default (primary) style for success
      });
      // Redirect to login page after successful registration
      router.push('/login');
    } else {
      toast({
        title: 'فشل التحقق',
        description: 'لم نتمكن من مطابقة الاسم في الوثيقة مع الاسم المدخل. يرجى المحاولة مرة أخرى أو مراجعة الدعم.',
        variant: 'destructive',
      });
    }
  };

  return (
    // Background: Emerald Green (#00A651)
    <div className="flex min-h-screen flex-col items-center bg-[#00A651] px-4 pt-[32px] text-white">
      {/* Status Bar Area (Placeholder) */}
      <div className="h-[24px] w-full"></div>

       {/* Logo Header - Same as login */}
      <div className="mb-8 flex h-[120px] w-[120px] items-center justify-center rounded-full bg-white shadow-lg">
         <span className="text-3xl font-bold">
           <span className="text-[#00A651]">٤</span> {/* Use primary green */}
           <span className="text-[#FF6F3C]">Now</span> {/* Use accent orange */}
         </span>
      </div>

       {/* Card Container - White bg, rounded 24px, dark grey text */}
      <div className="w-full max-w-md rounded-[24px] bg-white p-4 shadow-xl text-[#333333]">
        {/* Personal Information Section */}
        <div className="mb-4">
           <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
             <Separator className="flex-1 bg-[#E0E0E0]" /> {/* Lighter separator */}
             <h2 className="whitespace-nowrap text-lg font-medium text-[#333333]">
               البيانات الشخصية
             </h2>
             <Separator className="flex-1 bg-[#E0E0E0]" />
           </div>

           <div className="mt-3 space-y-3"> {/* 12px gap */}
            {/* Full Name */}
             <div className="relative">
              <Input
                type="text"
                name="fullName" // Add name attribute
                placeholder="الاسم الرباعي مع اللقب"
                value={formData.fullName}
                onChange={handleInputChange}
                className="h-12 rounded-lg border border-[#E0E0E0] bg-white pr-10 text-base placeholder-[#9E9E9E] text-[#333333]" // Specific styles
                dir="rtl"
              />
              <User className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-[#B0B0B0]" /> {/* Icon color */}
            </div>
             {/* Business Activity */}
            <div className="relative">
              <Input
                type="text"
                name="businessActivity" // Add name attribute
                placeholder="النشاط التجاري"
                value={formData.businessActivity}
                onChange={handleInputChange}
                className="h-12 rounded-lg border border-[#E0E0E0] bg-white pr-10 text-base placeholder-[#9E9E9E] text-[#333333]"
                dir="rtl"
              />
              <Store className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-[#B0B0B0]" />
            </div>
             {/* Phone Number */}
            <div className="relative">
              <Input
                type="tel"
                name="phoneNumber" // Add name attribute
                placeholder="رقم الهاتف"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="h-12 rounded-lg border border-[#E0E0E0] bg-white pr-10 text-base placeholder-[#9E9E9E] text-[#333333]"
                dir="rtl"
              />
              <Phone className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-[#B0B0B0]" />
            </div>
             {/* Address */}
            <div className="relative">
              <Input
                type="text"
                name="address" // Add name attribute
                placeholder="العنوان"
                value={formData.address}
                onChange={handleInputChange}
                className="h-12 rounded-lg border border-[#E0E0E0] bg-white pr-10 text-base placeholder-[#9E9E9E] text-[#333333]"
                dir="rtl"
              />
              {/* Using CheckCircle as per design image */}
              <CheckCircle className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-[#B0B0B0]" />
            </div>
          </div>
        </div>

        {/* Login Details Section */}
        <div className="mb-4">
           <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
             <Separator className="flex-1 bg-[#E0E0E0]" />
             <h2 className="whitespace-nowrap text-lg font-medium text-[#333333]">
               بيانات الدخول
             </h2>
             <Separator className="flex-1 bg-[#E0E0E0]" />
           </div>

           <div className="mt-3 space-y-3">
            {/* Username */}
            <div className="relative">
              <Input
                type="text"
                name="username" // Add name attribute
                placeholder="اسم الدخول أو رقم الهاتف"
                value={formData.username}
                onChange={handleInputChange}
                className="h-12 rounded-lg border border-[#E0E0E0] bg-white pr-10 text-base placeholder-[#9E9E9E] text-[#333333]"
                dir="rtl"
              />
               <User className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-[#B0B0B0]" />
            </div>
            {/* Password */}
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password" // Add name attribute
                placeholder="كلمة المرور"
                value={formData.password}
                onChange={handleInputChange}
                className="h-12 rounded-lg border border-[#E0E0E0] bg-white px-10 text-base placeholder-[#9E9E9E] text-[#333333]" // Padding left and right for icons
                dir="rtl"
              />
              <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-[#B0B0B0]" />
              <button
                 type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 className="absolute left-3 top-1/2 -translate-y-1/2 transform text-[#B0B0B0] hover:text-[#555555]" // Adjusted hover color
                 aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
             {/* Confirm Password */}
             <div className="relative">
              <Input
                 type={showConfirmPassword ? 'text' : 'password'}
                 name="confirmPassword" // Add name attribute
                 placeholder="تأكيد كلمة المرور"
                 value={formData.confirmPassword}
                 onChange={handleInputChange}
                 className="h-12 rounded-lg border border-[#E0E0E0] bg-white px-10 text-base placeholder-[#9E9E9E] text-[#333333]"
                 dir="rtl"
              />
              <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-[#B0B0B0]" />
               <button
                 type="button"
                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                 className="absolute left-3 top-1/2 -translate-y-1/2 transform text-[#B0B0B0] hover:text-[#555555]"
                 aria-label={showConfirmPassword ? "إخفاء تأكيد كلمة المرور" : "إظهار تأكيد كلمة المرور"}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Document Type Tabs */}
        {/* Using value prop for controlled component */}
        <Tabs value={idType} onValueChange={setIdType} className="mt-4 w-full">
           {/* Use #EEEEEE or similar light grey for the list background */}
           <TabsList className="grid h-auto w-full grid-cols-4 gap-2 bg-[#EEEEEE] p-1">
            {/* Active Tab: Red bg (#FF3B30), white text */}
            {/* Inactive Tab: White bg, red border, red text */}
             <TabsTrigger
              value="personal-id"
              className={cn(
                 "h-10 rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B30]/50 focus-visible:ring-offset-2",
                 // Active state: Red bg, White text
                 "data-[state=active]:bg-[#FF3B30] data-[state=active]:text-white data-[state=active]:shadow-sm",
                 // Inactive state: White bg, Red border, Red text
                 "data-[state=inactive]:bg-white data-[state=inactive]:text-[#FF3B30] data-[state=inactive]:border data-[state=inactive]:border-[#FF3B30] data-[state=inactive]:hover:bg-[#FF3B30]/10"
              )}
            >
              بطاقة شخصية
            </TabsTrigger>
             {/* Repeat styling for other tabs */}
            <TabsTrigger
              value="passport"
              className={cn(
                 "h-10 rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B30]/50 focus-visible:ring-offset-2",
                 "data-[state=active]:bg-[#FF3B30] data-[state=active]:text-white data-[state=active]:shadow-sm",
                 "data-[state=inactive]:bg-white data-[state=inactive]:text-[#FF3B30] data-[state=inactive]:border data-[state=inactive]:border-[#FF3B30] data-[state=inactive]:hover:bg-[#FF3B30]/10"
              )}
            >
              جواز
            </TabsTrigger>
             <TabsTrigger
              value="commercial-reg"
               className={cn(
                 "h-10 rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B30]/50 focus-visible:ring-offset-2",
                 "data-[state=active]:bg-[#FF3B30] data-[state=active]:text-white data-[state=active]:shadow-sm",
                 "data-[state=inactive]:bg-white data-[state=inactive]:text-[#FF3B30] data-[state=inactive]:border data-[state=inactive]:border-[#FF3B30] data-[state=inactive]:hover:bg-[#FF3B30]/10"
              )}
            >
              سجل تجاري
            </TabsTrigger>
            <TabsTrigger
              value="family-card"
               className={cn(
                 "h-10 rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B30]/50 focus-visible:ring-offset-2",
                 "data-[state=active]:bg-[#FF3B30] data-[state=active]:text-white data-[state=active]:shadow-sm",
                 "data-[state=inactive]:bg-white data-[state=inactive]:text-[#FF3B30] data-[state=inactive]:border data-[state=inactive]:border-[#FF3B30] data-[state=inactive]:hover:bg-[#FF3B30]/10"
              )}
            >
              بطاقة عائلية
            </TabsTrigger>
          </TabsList>
          {/* No TabsContent needed as image upload is always visible */}
        </Tabs>

        {/* Image Upload Placeholders */}
        <div className="mt-3 grid grid-cols-2 gap-3"> {/* 12px gap */}
           {/* Front Image Upload */}
            <div
                className="relative aspect-square w-full cursor-pointer rounded-lg bg-[#EEEEEE] flex flex-col items-center justify-center border-2 border-dashed border-[#CCCCCC] hover:border-[#009944]/50 hover:bg-[#E5E5E5]"
                onClick={() => frontImageRef.current?.click()}
            >
                 {idImageFront ? (
                    <img src={URL.createObjectURL(idImageFront)} alt="Preview Front" className="h-full w-full object-cover rounded-lg" />
                 ) : (
                    <>
                         <UploadCloud className="h-10 w-10 text-[#CCCCCC]" />
                         <span className="mt-1 text-xs text-[#666666]">الوجه الأمامي</span>
                     </>
                 )}
                 <input
                    ref={frontImageRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'front')}
                    className="hidden"
                    aria-label="Upload front ID image"
                 />
            </div>
            {/* Back Image Upload */}
            <div
                className="relative aspect-square w-full cursor-pointer rounded-lg bg-[#EEEEEE] flex flex-col items-center justify-center border-2 border-dashed border-[#CCCCCC] hover:border-[#009944]/50 hover:bg-[#E5E5E5]"
                onClick={() => backImageRef.current?.click()}
            >
                {idImageBack ? (
                     <img src={URL.createObjectURL(idImageBack)} alt="Preview Back" className="h-full w-full object-cover rounded-lg" />
                ) : (
                     <>
                        <UploadCloud className="h-10 w-10 text-[#CCCCCC]" />
                        <span className="mt-1 text-xs text-[#666666]">الوجه الخلفي (اختياري)</span>
                     </>
                )}
                 <input
                    ref={backImageRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'back')}
                    className="hidden"
                    aria-label="Upload back ID image"
                 />
            </div>
        </div>

         {/* Register Button - Use primary green (#009944) */}
        <Button
           className="mt-4 h-12 w-full rounded-lg bg-[#009944] text-base font-medium text-white hover:bg-[#008833] active:bg-[#007722]" // Specific green
           onClick={handleRegister} // Use the handler function
        >
          تسجيل
        </Button>

        {/* Login Link */}
        <p className="mt-3 text-center text-sm font-light text-[#9E9E9E]"> {/* Placeholder grey */}
          هل لديك حساب؟{' '}
          <Link href="/login" passHref>
            {/* Green link text */}
            <span className="cursor-pointer font-medium text-[#009944] hover:underline hover:text-[#007722]">
              قم بالدخول
            </span>
          </Link>
        </p>

      </div>

       {/* Footer */}
      <footer className="mt-auto pb-4 pt-6 text-center text-xs font-light text-white"> {/* White text */}
         {/* Removed contact info */}
         برمجة وتصميم (يمن روبوت)
      </footer>
    </div>
  );
}

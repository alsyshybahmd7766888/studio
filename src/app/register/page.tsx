'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Store,
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  UploadCloud,
  CheckCircle,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase'; // Use alias path
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'; // Import serverTimestamp
import { Alert } from '@/components/ui/alert'; // Import Alert

// Firestore collections ('users', 'balances') are created automatically
// when the first document is written.

export default function RegisterPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    fullName: '',
    businessActivity: '',
    phoneNumber: '', // Used for display/contact, maybe for verification later
    address: '',
    username: '', // Can be email or phone number for Email/Password auth
    password: '',
    confirmPassword: '',
  });
  const [idType, setIdType] = React.useState('personal-id');
  const [idImageFront, setIdImageFront] = React.useState<File | null>(null);
  const [idImageBack, setIdImageBack] = React.useState<File | null>(null);
  const frontImageRef = React.useRef<HTMLInputElement>(null);
  const backImageRef = React.useRef<HTMLInputElement>(null);

  const router = useRouter();
  const { toast } = useToast();

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          if (!file.type.startsWith('image/')) {
              toast({ title: "خطأ", description: "الرجاء اختيار ملف صورة.", variant: "destructive" });
              return;
          }
          if (file.size > 5 * 1024 * 1024) { // 5MB limit example
              toast({ title: "خطأ", description: "حجم الصورة كبير جداً (الحد الأقصى 5MB).", variant: "destructive" });
              return;
          }

          if (side === 'front') {
              setIdImageFront(file);
              console.log('Front image selected:', file.name);
          } else {
              setIdImageBack(file);
              console.log('Back image selected:', file.name);
          }
      }
  };

   const formatEmail = (input: string): string => {
     if (input.includes('@')) return input;
     const phoneRegex = /^\d+$/;
     if (phoneRegex.test(input)) return `${input}@4now.app`; // Use consistent domain
     return input;
   };

  const handleRegister = async () => {
    setIsLoading(true);
    console.log('Registration attempt with data:', { ...formData, idType });

    // --- Validation ---
    if (formData.password !== formData.confirmPassword) {
      toast({ title: 'خطأ', description: 'كلمتا المرور غير متطابقتين.', variant: 'destructive' });
      setIsLoading(false);
      return;
    }
    if (!formData.fullName || !formData.phoneNumber || !formData.username || !formData.password) {
         toast({ title: 'خطأ', description: 'يرجى ملء جميع الحقول الإلزامية (الاسم، الهاتف، اسم الدخول، كلمة المرور).', variant: 'destructive' });
         setIsLoading(false);
         return;
     }
      if (formData.password.length < 6) {
         toast({ title: 'خطأ', description: 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.', variant: 'destructive' });
         setIsLoading(false);
         return;
     }

     const email = formatEmail(formData.username);
     console.log('Formatted email for registration:', email);
     if (!/\S+@\S+\.\S+/.test(email)) {
        toast({ title: 'خطأ', description: 'اسم الدخول يجب أن يكون بريد إلكتروني صحيح أو رقم هاتف بتنسيق صحيح.', variant: 'destructive'});
        setIsLoading(false);
        return;
     }

    toast({ title: 'جاري التسجيل...', description: 'يتم إنشاء حسابك.', variant: 'default' });

    try {
      // Ensure the configuration allows Email/Password sign-in.
      // If using phone numbers as usernames, they need to be formatted as emails (e.g., 7xxxxxxxx@4now.app)
      // because Firebase Email/Password provider requires an email format.
      // Make sure the Email/Password provider is enabled in Firebase Console -> Authentication -> Sign-in method.
      // Go to Firebase Console -> Authentication -> Sign-in method -> Enable Email/Password.
      // This is the most common cause of the 'auth/configuration-not-found' error.
      // Also ensure Phone Number provider is enabled if you intend to use direct phone auth later.
      const userCredential = await createUserWithEmailAndPassword(auth, email, formData.password);
      const user = userCredential.user;
      console.log('Firebase Auth user created:', user.uid);

       // --- Optional: Upload ID Images to Firebase Storage ---
       // let frontImageUrl: string | null = null; ... (omitted for brevity)

      // 2. Store Additional User Info in Firestore
      // Firestore automatically creates the 'users' collection if it doesn't exist.
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email, // Store the formatted email used for auth
        usernameInput: formData.username, // Store the original input
        fullName: formData.fullName,
        businessActivity: formData.businessActivity,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        idType: idType,
        // idFrontImageUrl: frontImageUrl,
        createdAt: serverTimestamp(), // Use server timestamp
      });
      console.log('User data saved to Firestore at path:', userDocRef.path);

       // 3. Create Initial Balance Document
       // Firestore automatically creates the 'balances' collection if it doesn't exist.
       const balanceDocRef = doc(db, 'balances', user.uid);
       await setDoc(balanceDocRef, { amount: 0 }); // Initialize balance to 0
       console.log('Initial balance document created at path:', balanceDocRef.path);


      // --- Success ---
      toast({
        title: 'نجاح التسجيل',
        description: 'تم إنشاء حسابك بنجاح! يمكنك الآن تسجيل الدخول.',
        variant: 'default', // Use primary style for success
      });
      router.push('/login'); // Redirect to login page

    } catch (error: any) {
      console.error('Registration failed:', error.code, error.message);
      let errorMessage = "حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.";
       if (error.code === 'auth/email-already-in-use') {
           errorMessage = "اسم الدخول (البريد الإلكتروني/الهاتف) مستخدم بالفعل.";
       } else if (error.code === 'auth/invalid-email') {
           errorMessage = "صيغة اسم الدخول (البريد الإلكتروني) غير صحيحة.";
       } else if (error.code === 'auth/weak-password') {
           errorMessage = "كلمة المرور ضعيفة جداً (6 أحرف على الأقل).";
       } else if (error.code === 'auth/network-request-failed') {
            errorMessage = "فشل الاتصال بالشبكة. يرجى التحقق من اتصالك بالإنترنت.";
       } else if (error.code === 'auth/operation-not-allowed') {
            errorMessage = "لم يتم تفعيل طريقة الدخول بالبريد الإلكتروني / كلمة المرور في إعدادات Firebase. يرجى مراجعة إعدادات المشروع.";
            alert('طريقة التسجيل غير مفعلة، رجاءً فعّلها في Firebase.'); // Alert added here
       } else if (error.code === 'auth/configuration-not-found') {
            errorMessage = "إعدادات المصادقة غير موجودة. تأكد من تفعيل الموفر المطلوب في Firebase.";
       } else if (error.code === 'auth/invalid-api-key') {
            errorMessage = "مفتاح Firebase API غير صحيح. تأكد من صحة المتغيرات البيئية.";
       }

      toast({
        title: 'فشل التسجيل',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackImageRefClick = () => backImageRef.current?.click();
  const handleFrontImageRefClick = () => frontImageRef.current?.click();

  return (
    // Use theme colors (background, foreground, primary, accent, etc.)
    // Main Container: Green background (#00A651)
    <div className="flex min-h-screen flex-col items-center bg-[#00A651] px-4 pt-[32px] text-white">
      {/* Status Bar Area */}
      <div className="h-[24px] w-full"></div>

       {/* Logo Header: White circle (120x120px) */}
      <div className="mb-8 flex h-[120px] w-[120px] items-center justify-center rounded-full bg-white shadow-lg">
         {/* Logo: 4 (green) Now (orange) */}
         <span className="text-3xl font-bold">
           <span className="text-[#00A651]">٤</span> {/* Dark Green */}
           <span className="text-[#FF6F3C]">Now</span> {/* Orange */}
         </span>
      </div>

       {/* Card Container: White bg, rounded 24px, padding 16px */}
      <div className="w-full max-w-md rounded-[24px] bg-white p-4 shadow-xl text-[#333333]"> {/* Dark Grey Text */}
        {/* Personal Information Section */}
        <div className="mb-4">
           {/* Section Title: Separator + Text + Separator */}
           <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
             <Separator className="flex-1 bg-[#E0E0E0]" /> {/* Light Grey Border */}
             <h2 className="whitespace-nowrap text-lg font-medium text-[#333333]"> {/* Dark Grey Text */}
               البيانات الشخصية
             </h2>
             <Separator className="flex-1 bg-[#E0E0E0]" />
           </div>

           <div className="mt-3 space-y-3"> {/* 12px vertical spacing */}
             {/* Full Name */}
             <div className="relative">
              {/* Input: h-48px, rounded-8px, border-#E0E0E0, placeholder-#9E9E9E */}
              <Input
                type="text" name="fullName" placeholder="الاسم الرباعي مع اللقب"
                value={formData.fullName} onChange={handleInputChange} disabled={isLoading}
                className="h-12 rounded-lg border border-[#E0E0E0] bg-[#F9F9F9] pr-10 text-base placeholder:text-[#9E9E9E] text-[#333333]"
                dir="rtl"
              />
              {/* Icon: User, color #B0B0B0 */}
              <User className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-[#B0B0B0]" />
            </div>
             {/* Business Activity */}
            <div className="relative">
              <Input
                type="text" name="businessActivity" placeholder="النشاط التجاري (اختياري)"
                value={formData.businessActivity} onChange={handleInputChange} disabled={isLoading}
                className="h-12 rounded-lg border border-[#E0E0E0] bg-[#F9F9F9] pr-10 text-base placeholder:text-[#9E9E9E] text-[#333333]"
                dir="rtl"
              />
              <Store className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-[#B0B0B0]" />
            </div>
             {/* Phone Number */}
            <div className="relative">
              <Input
                type="tel" name="phoneNumber" placeholder="رقم الهاتف"
                value={formData.phoneNumber} onChange={handleInputChange} disabled={isLoading}
                className="h-12 rounded-lg border border-[#E0E0E0] bg-[#F9F9F9] pr-10 text-base placeholder:text-[#9E9E9E] text-[#333333]"
                dir="rtl" // RTL for placeholder, LTR likely better for number input itself
              />
              <Phone className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-[#B0B0B0]" />
            </div>
             {/* Address */}
            <div className="relative">
              <Input
                type="text" name="address" placeholder="العنوان (اختياري)"
                value={formData.address} onChange={handleInputChange} disabled={isLoading}
                className="h-12 rounded-lg border border-[#E0E0E0] bg-[#F9F9F9] pr-10 text-base placeholder:text-[#9E9E9E] text-[#333333]"
                dir="rtl"
              />
              <MapPin className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-[#B0B0B0]" />
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
            {/* Username (Email/Phone) */}
            <div className="relative">
              <Input
                type="text"
                name="username" placeholder="اسم الدخول (بريد إلكتروني أو رقم هاتف)"
                value={formData.username} onChange={handleInputChange} disabled={isLoading}
                className="h-12 rounded-lg border border-[#E0E0E0] bg-[#F9F9F9] pr-10 text-base placeholder:text-[#9E9E9E] text-[#333333]"
                dir="ltr" // Keep LTR for email/phone input consistency
              />
               <User className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-[#B0B0B0]" />
            </div>
            {/* Password */}
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'} name="password" placeholder="كلمة المرور (6+ أحرف)"
                value={formData.password} onChange={handleInputChange} disabled={isLoading}
                className="h-12 rounded-lg border border-[#E0E0E0] bg-[#F9F9F9] px-10 text-base placeholder:text-[#9E9E9E] text-[#333333]"
                dir="ltr" // LTR for password input
              />
              <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-[#B0B0B0]" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={isLoading}
                 className="absolute left-3 top-1/2 -translate-y-1/2 transform text-[#B0B0B0] hover:text-[#333333]"
                 aria-label={showPassword ? "إخفاء" : "إظهار"}>
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
             {/* Confirm Password */}
             <div className="relative">
              <Input
                 type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" placeholder="تأكيد كلمة المرور"
                 value={formData.confirmPassword} onChange={handleInputChange} disabled={isLoading}
                 className="h-12 rounded-lg border border-[#E0E0E0] bg-[#F9F9F9] px-10 text-base placeholder:text-[#9E9E9E] text-[#333333]"
                 dir="ltr" // LTR for password input
              />
              <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-[#B0B0B0]" />
               <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={isLoading}
                 className="absolute left-3 top-1/2 -translate-y-1/2 transform text-[#B0B0B0] hover:text-[#333333]"
                 aria-label={showConfirmPassword ? "إخفاء" : "إظهار"}>
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Document Type Tabs: mt-16px, gap-8px */}
        <Tabs value={idType} onValueChange={setIdType} className="mt-4 w-full">
           <TabsList className="grid h-auto w-full grid-cols-4 gap-2 bg-transparent p-0"> {/* gap-8px */}
             {(['personal-id', 'passport', 'commercial-reg', 'family-card'] as const).map((type) => (
                 <TabsTrigger key={type} value={type} disabled={isLoading}
                    className={cn(
                        // Tab: h-40px, rounded-8px, text-14sp/500
                        "h-10 rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B30] focus-visible:ring-offset-2",
                        // Active Tab: bg-#FF3B30, text-white
                        "data-[state=active]:bg-[#FF3B30] data-[state=active]:text-white data-[state=active]:shadow-sm",
                        // Inactive Tab: bg-white, border-1px-#FF3B30, text-#FF3B30
                        "data-[state=inactive]:bg-white data-[state=inactive]:text-[#FF3B30] data-[state=inactive]:border data-[state=inactive]:border-[#FF3B30] data-[state=inactive]:hover:bg-[#FF3B30]/10"
                    )}
                 >
                    { {
                        'personal-id': 'بطاقة شخصية',
                        'passport': 'جواز',
                        'commercial-reg': 'سجل تجاري',
                        'family-card': 'بطاقة عائلية'
                    }[type] }
                 </TabsTrigger>
             ))}
          </TabsList>
        </Tabs>

        {/* Image Upload Placeholders: mt-12px, gap-12px */}
        <div className="mt-3 grid grid-cols-2 gap-3"> {/* gap-12px */}
            {/* Placeholder Box: Square, bg-#EEEEEE, rounded-8px, dashed border-#CCCCCC */}
            <div
                className={cn(
                    "relative aspect-square w-full rounded-lg bg-[#EEEEEE] flex flex-col items-center justify-center border-2 border-dashed border-[#CCCCCC] hover:border-[#00A651]/50 hover:bg-[#EEEEEE]/80",
                    !isLoading && "cursor-pointer"
                )}
                onClick={handleFrontImageRefClick}
            >
                 {idImageFront ? (
                    <img src={URL.createObjectURL(idImageFront)} alt="Preview Front" className="h-full w-full object-cover rounded-lg" />
                 ) : (
                    <>
                         {/* Icon: Image, color-#CCCCCC */}
                         <UploadCloud className="h-10 w-10 text-[#CCCCCC]" />
                         <span className="mt-1 text-xs text-[#9E9E9E]">الوجه الأمامي</span>
                     </>
                 )}
                 <input ref={frontImageRef} type="file" accept="image/*" disabled={isLoading}
                    onChange={(e) => handleFileChange(e, 'front')} className="hidden" aria-label="Upload front ID" />
            </div>
            {/* Back Image */}
            <div
                 className={cn(
                    "relative aspect-square w-full rounded-lg bg-[#EEEEEE] flex flex-col items-center justify-center border-2 border-dashed border-[#CCCCCC] hover:border-[#00A651]/50 hover:bg-[#EEEEEE]/80",
                     !isLoading && "cursor-pointer"
                 )}
                onClick={handleBackImageRefClick}
            >
                {idImageBack ? (
                     <img src={URL.createObjectURL(idImageBack)} alt="Preview Back" className="h-full w-full object-cover rounded-lg" />
                ) : (
                     <>
                        <UploadCloud className="h-10 w-10 text-[#CCCCCC]" />
                        <span className="mt-1 text-xs text-[#9E9E9E]">الوجه الخلفي (اختياري)</span>
                     </>
                )}
                 <input ref={backImageRef} type="file" accept="image/*" disabled={isLoading}
                    onChange={(e) => handleFileChange(e, 'back')} className="hidden" aria-label="Upload back ID" />
            </div>
        </div>

         {/* Register Button: mt-16px, h-48px, rounded-8px, bg-#009944, text-16sp/500 white */}
        <Button
           className="mt-4 h-12 w-full rounded-lg bg-[#009944] text-base font-medium text-white hover:bg-[#009944]/90 active:bg-[#009944]/80"
           onClick={handleRegister}
           disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'تسجيل'}
        </Button>

        {/* Login Link: mt-12px, text-14sp/300 #9E9E9E */}
        <p className="mt-3 text-center text-sm font-light text-[#9E9E9E]">
          هل لديك حساب؟{' '}
          <Link href="/login" passHref className={cn(isLoading && "pointer-events-none opacity-50")}>
            {/* Link Text: green #009944 */}
            <span className="cursor-pointer font-medium text-[#009944] hover:underline hover:text-[#009944]/80">
              قم بالدخول
            </span>
          </Link>
        </p>

      </div>

       {/* Footer: text-12sp/300 white, bottom safe area */}
       <footer className="mt-auto pb-4 pt-6 text-center text-xs font-light text-white">
         برمجة وتصميم (يمن روبوت) 774541452
      </footer>
    </div>
  );
}

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
  Loader2, // Import Loader2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase'; // Import Firebase auth and db
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
// import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Optional: For storing ID images

export default function RegisterPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false); // Loading state
  const [formData, setFormData] = React.useState({
    fullName: '',
    businessActivity: '',
    phoneNumber: '', // Used for display/contact, maybe for verification later
    address: '',
    username: '', // Will be used as email for Firebase Auth
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
  // const storage = getStorage(); // Optional: Initialize Firebase Storage

   // --- Input Change Handler ---
   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- File Change Handler ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          // Basic validation (type, size)
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

   // --- Format Email for Firebase ---
   // Consistent with login page logic
   const formatEmail = (input: string): string => {
       if (input.includes('@')) return input;
       // return `${input}@4now.app`; // Use your domain or logic
       // Using username directly might fail if it's not a valid email format
       // Consider prompting for an actual email or using phone auth if username isn't email
       // Using phone number as email might require specific Firebase setup (e.g., custom claims or linking)
       // For standard Email/Password, the username MUST be a valid email address.
       // Let's assume the user enters their email in the 'username' field for now.
       return input;
   };

  // --- Registration Handler ---
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
      // Temporarily making ID image optional for testing, enforce later
     // if (!idImageFront) {
     //     toast({ title: 'خطأ', description: 'يرجى تحميل صورة الوثيقة الأمامية.', variant: 'destructive' });
     //     setIsLoading(false);
     //     return;
     // }
      if (formData.password.length < 6) {
         toast({ title: 'خطأ', description: 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.', variant: 'destructive' });
         setIsLoading(false);
         return;
     }

     // --- Format Email ---
     const email = formatEmail(formData.username);
     // Basic email format check - Crucial for Email/Password provider
     if (!/\S+@\S+\.\S+/.test(email)) {
        toast({ title: 'خطأ', description: 'اسم الدخول يجب أن يكون بصيغة بريد إلكتروني صحيحة.', variant: 'destructive'});
        setIsLoading(false);
        return;
     }

    toast({ title: 'جاري التسجيل...', description: 'يتم إنشاء حسابك.', variant: 'default' });

    try {
      // 1. Create User in Firebase Auth
      // Ensure the Email/Password sign-in method is ENABLED in your Firebase project console.
      // Go to Firebase Console -> Authentication -> Sign-in method -> Enable Email/Password.
      // This is the most common cause of the 'auth/configuration-not-found' error.
      const userCredential = await createUserWithEmailAndPassword(auth, email, formData.password);
      const user = userCredential.user;
      console.log('Firebase Auth user created:', user.uid);

       // --- Optional: Upload ID Images to Firebase Storage ---
       let frontImageUrl: string | null = null;
       // let backImageUrl: string | null = null;
       // if (idImageFront) {
       //   const frontImageRefPath = `user_ids/${user.uid}/front_${idImageFront.name}`;
       //   const frontStorageRef = ref(storage, frontImageRefPath);
       //   await uploadBytes(frontStorageRef, idImageFront);
       //   frontImageUrl = await getDownloadURL(frontStorageRef);
       //   console.log('Front image uploaded:', frontImageUrl);
       // }
       // if (idImageBack) { // Upload back image similarly if needed }


      // 2. Store Additional User Info in Firestore
      const userDocRef = doc(db, 'users', user.uid); // Collection 'users', Document ID = user.uid
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email, // Store the email used for auth
        fullName: formData.fullName,
        businessActivity: formData.businessActivity,
        phoneNumber: formData.phoneNumber, // Store phone number
        address: formData.address,
        idType: idType,
        // idFrontImageUrl: frontImageUrl, // Store image URL if uploaded
        // idBackImageUrl: backImageUrl,   // Store image URL if uploaded
        createdAt: new Date(), // Timestamp
        // Add verification status if implementing OCR/manual check later
        // verificationStatus: 'pending',
      });
      console.log('User data saved to Firestore');

       // 3. Create Initial Balance Document (using 0)
       const balanceDocRef = doc(db, 'balances', user.uid);
       await setDoc(balanceDocRef, { amount: 0 });
       console.log('Initial balance document created.');


      // --- Success ---
      toast({
        title: 'نجاح التسجيل',
        description: 'تم إنشاء حسابك بنجاح! يمكنك الآن تسجيل الدخول.',
        variant: 'default',
      });
      router.push('/login'); // Redirect to login page

    } catch (error: any) {
      console.error('Registration failed:', error);
      let errorMessage = "حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.";
       if (error.code === 'auth/email-already-in-use') {
           errorMessage = "اسم الدخول (البريد الإلكتروني) مستخدم بالفعل.";
       } else if (error.code === 'auth/invalid-email') {
           errorMessage = "صيغة اسم الدخول (البريد الإلكتروني) غير صحيحة.";
       } else if (error.code === 'auth/weak-password') {
           errorMessage = "كلمة المرور ضعيفة جداً.";
       } else if (error.code === 'auth/configuration-not-found') {
           // Specific message for this error
           errorMessage = "لم يتم تفعيل طريقة الدخول بالبريد الإلكتروني/كلمة المرور في إعدادات Firebase. يرجى مراجعة إعدادات المشروع.";
       } else if (error.code === 'auth/operation-not-allowed') {
           // Another common error if Email/Password sign-in is disabled
           errorMessage = "الدخول بالبريد الإلكتروني/كلمة المرور غير مسموح به في هذا المشروع.";
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

  return (
    // Background: Teal (#007B8A) - Reverted based on user request
    <div className="flex min-h-screen flex-col items-center bg-[#00A651] px-4 pt-[32px] text-primary-foreground">
      {/* Status Bar Area */}
      <div className="h-[24px] w-full"></div>

       {/* Logo Header */}
      <div className="mb-8 flex h-[120px] w-[120px] items-center justify-center rounded-full bg-white shadow-lg">
         <span className="text-3xl font-bold">
           <span className="text-[#00A651]">٤</span> {/* Use primary color */}
           <span className="text-[#FF6F3C]">Now</span> {/* Use accent color */}
         </span>
      </div>

       {/* Card Container */}
      <div className="w-full max-w-md rounded-[24px] bg-card p-4 shadow-xl text-card-foreground">
        {/* Personal Information Section */}
        <div className="mb-4">
           <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
             <Separator className="flex-1 bg-border" />
             <h2 className="whitespace-nowrap text-lg font-medium text-foreground">
               البيانات الشخصية
             </h2>
             <Separator className="flex-1 bg-border" />
           </div>

           <div className="mt-3 space-y-3">
             {/* Full Name */}
             <div className="relative">
              <Input
                type="text" name="fullName" placeholder="الاسم الرباعي مع اللقب"
                value={formData.fullName} onChange={handleInputChange} disabled={isLoading}
                className="h-12 rounded-lg border border-[#E0E0E0] bg-[#F9F9F9] pr-10 text-base placeholder:text-[#9E9E9E] text-[#333333]" // Specific colors from spec
                dir="rtl"
              />
              <User className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-[#B0B0B0]" /> {/* Specific icon color */}
            </div>
             {/* Business Activity */}
            <div className="relative">
              <Input
                type="text" name="businessActivity" placeholder="النشاط التجاري"
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
                dir="rtl"
              />
              <Phone className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-[#B0B0B0]" />
            </div>
             {/* Address */}
            <div className="relative">
              <Input
                type="text" name="address" placeholder="العنوان"
                value={formData.address} onChange={handleInputChange} disabled={isLoading}
                className="h-12 rounded-lg border border-[#E0E0E0] bg-[#F9F9F9] pr-10 text-base placeholder:text-[#9E9E9E] text-[#333333]"
                dir="rtl"
              />
              {/* Changed icon to MapPin as CheckCircle was used elsewhere */}
              <MapPin className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-[#B0B0B0]" />
            </div>
          </div>
        </div>

        {/* Login Details Section */}
        <div className="mb-4">
           <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
             <Separator className="flex-1 bg-border" />
             <h2 className="whitespace-nowrap text-lg font-medium text-foreground">
               بيانات الدخول
             </h2>
             <Separator className="flex-1 bg-border" />
           </div>

           <div className="mt-3 space-y-3">
            {/* Username (Email) */}
            <div className="relative">
              <Input
                type="text" // Use text, validation ensures it's email format
                name="username" placeholder="اسم الدخول (بريد إلكتروني)" // Specify email format expected
                value={formData.username} onChange={handleInputChange} disabled={isLoading}
                className="h-12 rounded-lg border border-[#E0E0E0] bg-[#F9F9F9] pr-10 text-base placeholder:text-[#9E9E9E] text-[#333333]"
                dir="rtl" // Keep RTL for placeholder, input direction might depend on language settings
              />
               <User className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-[#B0B0B0]" />
            </div>
            {/* Password */}
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'} name="password" placeholder="كلمة المرور (6+ أحرف)"
                value={formData.password} onChange={handleInputChange} disabled={isLoading}
                className="h-12 rounded-lg border border-[#E0E0E0] bg-[#F9F9F9] px-10 text-base placeholder:text-[#9E9E9E] text-[#333333]" // Use px-10 for eye icon space
                dir="rtl"
              />
              <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-[#B0B0B0]" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={isLoading}
                 className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground hover:text-foreground"
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
                 dir="rtl"
              />
              <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-[#B0B0B0]" />
               <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={isLoading}
                 className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground hover:text-foreground"
                 aria-label={showConfirmPassword ? "إخفاء" : "إظهار"}>
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Document Type Tabs */}
        <Tabs value={idType} onValueChange={setIdType} className="mt-4 w-full">
           <TabsList className="grid h-auto w-full grid-cols-4 gap-2 bg-transparent p-0"> {/* Transparent background for tabs list */}
             {/* Active Tab: Red bg, White text */}
             {/* Inactive Tab: White bg, Red text, Red border */}
             {(['personal-id', 'passport', 'commercial-reg', 'family-card'] as const).map((type) => (
                 <TabsTrigger key={type} value={type} disabled={isLoading}
                    className={cn(
                        "h-10 rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B30]/50 focus-visible:ring-offset-2", // Use red ring
                        "data-[state=active]:bg-[#FF3B30] data-[state=active]:text-white data-[state=active]:shadow-sm", // Active: Red bg, white text
                        "data-[state=inactive]:bg-white data-[state=inactive]:text-[#FF3B30] data-[state=inactive]:border data-[state=inactive]:border-[#FF3B30] data-[state=inactive]:hover:bg-[#FF3B30]/10" // Inactive: White bg, red text/border
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

        {/* Image Upload Placeholders */}
        <div className="mt-3 grid grid-cols-2 gap-3"> {/* Gap 12px */}
            {/* Front Image */}
            <div
                className={cn(
                    "relative aspect-square w-full rounded-lg bg-[#EEEEEE] flex flex-col items-center justify-center border-2 border-dashed border-[#E0E0E0] hover:border-[#00A651]/50 hover:bg-muted/80", // Use spec colors
                    !isLoading && "cursor-pointer" // Only show cursor if not loading
                )}
                onClick={() => !isLoading && frontImageRef.current?.click()}
            >
                 {idImageFront ? (
                    <img src={URL.createObjectURL(idImageFront)} alt="Preview Front" className="h-full w-full object-cover rounded-lg" />
                 ) : (
                    <>
                         <UploadCloud className="h-10 w-10 text-[#CCCCCC]" /> {/* Specific icon color */}
                         <span className="mt-1 text-xs text-[#9E9E9E]">الوجه الأمامي*</span> {/* Placeholder color */}
                     </>
                 )}
                 <input ref={frontImageRef} type="file" accept="image/*" disabled={isLoading}
                    onChange={(e) => handleFileChange(e, 'front')} className="hidden" aria-label="Upload front ID" />
            </div>
            {/* Back Image */}
            <div
                 className={cn(
                    "relative aspect-square w-full rounded-lg bg-[#EEEEEE] flex flex-col items-center justify-center border-2 border-dashed border-[#E0E0E0] hover:border-[#00A651]/50 hover:bg-muted/80",
                     !isLoading && "cursor-pointer"
                 )}
                onClick={() => !isLoading && backImageRef.current?.click()}
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

         {/* Register Button */}
        <Button
           className="mt-4 h-12 w-full rounded-lg bg-[#009944] text-base font-medium text-white hover:bg-[#009944]/90 active:bg-[#009944]/80" // Specific green, white text
           onClick={handleRegister}
           disabled={isLoading} // Disable button while loading
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'تسجيل'}
        </Button>

        {/* Login Link */}
        <p className="mt-3 text-center text-sm font-light text-[#9E9E9E]"> {/* Muted grey text */}
          هل لديك حساب؟{' '}
          <Link href="/login" passHref className={cn(isLoading && "pointer-events-none opacity-50")}>
             {/* Green link text */}
            <span className="cursor-pointer font-medium text-[#009944] hover:underline hover:text-[#009944]/80">
              قم بالدخول
            </span>
          </Link>
        </p>

      </div>

       {/* Footer */}
       <footer className="mt-auto pb-4 pt-6 text-center text-xs font-light text-white"> {/* White text */}
         برمجة وتصميم (يمن روبوت) 774541452 {/* Keep footer content as per spec */}
      </footer>
    </div>
  );
}

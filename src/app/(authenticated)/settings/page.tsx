'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import { ArrowRight, Fingerprint, Lock, CheckCircle, QrCode, Bell, LogOut, Camera } from 'lucide-react'; // Removed RefreshCcw
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { useAuth } from '@/hooks/use-auth'; // Example: Import auth context if created

export default function SettingsPage() {
  const { toast } = useToast();
  const router = useRouter(); // Initialize router for logout redirection
  // const { logout, logoutAll } = useAuth(); // Get auth functions if using context

  // --- Local State for Settings ---
  // In a real app, these would likely come from user preferences stored in the backend
  // and potentially updated via an API call on change.
  const [fingerprintEnabled, setFingerprintEnabled] = React.useState(false);
  const [pinEnabled, setPinEnabled] = React.useState(false);
  const [notificationThreshold, setNotificationThreshold] = React.useState('');
  // -------------------------------

  const [showQrScanner, setShowQrScanner] = React.useState(false);
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handleFingerprintToggle = (checked: boolean) => {
    setFingerprintEnabled(checked);
    // --- Simulate Backend Update ---
    // API call to update user setting: PATCH /api/user/settings { fingerprintEnabled: checked }
    console.log('Updating fingerprint setting to:', checked);
    toast({
      title: checked ? "تفعيل البصمة" : "إيقاف البصمة",
      description: checked ? "تم تفعيل الدخول باستخدام البصمة." : "تم إيقاف الدخول باستخدام البصمة.",
      variant: 'default', // Use default (primary) style
    });
    // Handle potential errors from the API call
  };

  const handlePinToggle = (checked: boolean) => {
    setPinEnabled(checked);
    // --- Simulate Backend Update ---
    // API call: PATCH /api/user/settings { pinEnabled: checked }
     console.log('Updating PIN setting to:', checked);
    toast({
      title: checked ? "تفعيل الرمز السري" : "إيقاف الرمز السري",
      description: checked ? "تم تفعيل الدخول باستخدام الرمز السري." : "تم إيقاف الدخول باستخدام الرمز السري.",
      variant: 'default', // Use default (primary) style
    });
    if (checked) {
      // --- Initiate PIN Setup Flow ---
      // Could open a dialog/modal to set a new PIN
      console.log("Prompt for PIN setup");
      // Example: showPinSetupDialog(true);
       toast({ title: "إعداد الرمز السري", description: "يرجى إعداد رمز سري جديد.", variant: 'default'});
    }
  };

  const handleChangePin = () => {
     // --- Initiate PIN Change Flow ---
     // Should prompt for old PIN, then new PIN + confirmation
    toast({
      title: "تغيير الرمز السري",
      description: "سيتم فتح نموذج تغيير الرمز السري قريباً.", // Placeholder
      variant: 'default', // Use default (primary) style
    });
    // Example: showPinChangeDialog(true);
    console.log("Change PIN clicked");
  };

  const handleAuthorizeDevice = () => {
     // --- Simulate Device Authorization ---
     // In a real app, this might involve sending device info (e.g., User Agent, IP)
     // to the backend to register it as a trusted device.
     // For web, could use localStorage/sessionStorage or cookies to mark as trusted.
    console.log("Authorize this device clicked");
     toast({
      title: "ترخيص هذا الجهاز",
      description: "تم ترخيص هذا الجهاز بنجاح للجلسة الحالية.", // Adjust message based on implementation
      variant: 'default', // Use default (primary) style for success
    });
     // Example: localStorage.setItem('isDeviceAuthorized', 'true');
  };

  const handleAuthorizeNewDevice = () => {
     // --- Start QR Code Flow for New Device ---
     // 1. Backend generates a unique, time-limited token/QR code.
     // 2. Display QR code on the *other* device (e.g., web login page).
     // 3. This app (mobile) scans the QR code using the camera.
     // 4. App sends the scanned token to the backend.
     // 5. Backend validates the token and links the new device/session to the user account.
    toast({
      title: "ترخيص جهاز جديد",
      description: "سيتم فتح الكاميرا لمسح رمز QR المعروض على الجهاز الآخر.",
      variant: 'default', // Use default (primary) style
    });
    setShowQrScanner(true); // Show the QR scanner section
    console.log("Authorize new device (QR) clicked");
  };

  const handleWebAuth = () => {
     // --- Similar to Authorize New Device, specifically for Web Login ---
    toast({
      title: "ترخيص جهاز ويب",
      description: "سيتم فتح الكاميرا لمسح رمز QR المعروض على صفحة الويب.",
      variant: 'default', // Use default (primary) style
    });
     setShowQrScanner(true); // Show the QR scanner section
    console.log("Authorize web device (QR) clicked");
  };

  const handleNotificationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
    setNotificationThreshold(value);
    // Debounce could be added here before saving
  };

  const handleSaveNotification = () => {
     // --- Simulate Backend Update ---
     // API call: PATCH /api/user/settings { notificationThreshold: Number(notificationThreshold) || null }
     console.log("Saving notification threshold:", notificationThreshold);
      const thresholdValue = notificationThreshold ? parseInt(notificationThreshold, 10) : null;
      if (thresholdValue !== null && isNaN(thresholdValue)) {
         toast({ title: "خطأ", description: "الرجاء إدخال مبلغ صحيح.", variant: "destructive" });
         return;
     }
     toast({
      title: "حفظ إعدادات الإشعار",
      description: `تم حفظ حد الإشعار: ${thresholdValue !== null ? thresholdValue + ' ريال' : 'غير محدد'}`,
      variant: 'default', // Use default (primary) style for success
    });
     // Handle API call and potential errors
  }

  const handleLogout = () => {
    // --- Perform Logout ---
    // 1. Clear local session/token (localStorage, cookies).
    // 2. Optionally, call a backend logout endpoint to invalidate the server-side session/token.
    // 3. Redirect to the login page.
    console.log("Logout clicked");
    // if (logout) logout(); // Call context logout function if available
    toast({
      title: "تسجيل الخروج",
      description: "تم تسجيل الخروج بنجاح.",
      variant: 'destructive', // Use destructive (red) style
    });
    // Clear local state simulation
    setFingerprintEnabled(false);
    setPinEnabled(false);
    setNotificationThreshold('');
    // Redirect to login
    router.push('/login');
  };

  const handleLogoutAll = () => {
    // --- Perform Logout From All Devices ---
    // 1. Call a specific backend endpoint (e.g., POST /api/auth/logout-all).
    // 2. Backend invalidates *all* active sessions/tokens for the user except the current one.
    // 3. Clear local session/token for the current device as well.
    // 4. Redirect to the login page.
    console.log("Logout from all devices clicked");
    // if (logoutAll) logoutAll(); // Call context logoutAll function
    toast({
      title: "الخروج من جميع الأجهزة",
      description: "تم تسجيل الخروج من جميع الأجهزة الأخرى بنجاح.",
      variant: 'destructive', // Use destructive (red) style
    });
     // Clear local state simulation
     setFingerprintEnabled(false);
     setPinEnabled(false);
     setNotificationThreshold('');
    // Redirect to login
    router.push('/login');
  };

  // QR Scanner Camera Logic
  React.useEffect(() => {
    let stream: MediaStream | null = null;

    const getCameraPermission = async () => {
       if (!showQrScanner) {
         // Stop existing stream if scanner is hidden
         if (videoRef.current && videoRef.current.srcObject) {
            (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
         }
         setHasCameraPermission(null); // Reset permission state
         return;
       }

      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }); // Prefer back camera
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        // --- Add QR Code Scanning Library Integration Here ---
        // Example using jsQR or similar library:
        // const canvas = document.createElement('canvas');
        // const context = canvas.getContext('2d');
        // const scanInterval = setInterval(() => {
        //   if (videoRef.current && context) {
        //     canvas.width = videoRef.current.videoWidth;
        //     canvas.height = videoRef.current.videoHeight;
        //     context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        //     const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        //     const code = jsQR(imageData.data, imageData.width, imageData.height);
        //     if (code) {
        //       console.log("QR Code detected:", code.data);
        //       clearInterval(scanInterval);
        //       setShowQrScanner(false); // Hide scanner after successful scan
        //       toast({ title: "تم مسح الرمز بنجاح!", description: `البيانات: ${code.data.substring(0, 50)}...`, variant: 'default'});
        //       // --- Send code.data to backend for verification ---
        //     }
        //   }
        // }, 500); // Scan every 500ms
        // return () => clearInterval(scanInterval); // Cleanup interval
        // -------------------------------------------------------

      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'فشل الوصول للكاميرا',
          description: 'يرجى تمكين أذونات الكاميرا في إعدادات المتصفح لاستخدام هذه الميزة.',
        });
        setShowQrScanner(false); // Hide scanner if permission denied
      }
    };

    getCameraPermission();

    // Cleanup function to stop camera when component unmounts or scanner is hidden
    return () => {
       if (stream) {
         stream.getTracks().forEach(track => track.stop());
       }
       if (videoRef.current) {
           videoRef.current.srcObject = null;
       }
    };
  }, [showQrScanner, toast]); // Re-run effect when showQrScanner changes

  return (
     // Background: Light Grey (#F7F9FA), Text: Dark Grey (#333333)
    <div className="flex min-h-screen flex-col bg-[#F7F9FA] text-[#333333]">
      {/* Header - Teal background (#007B8A), White text */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-[#007B8A] px-4 py-2 text-white shadow-md">
        <Link href="/dashboard" passHref>
          <Button variant="ghost" size="icon" className="text-white hover:bg-[#007B8A]/80">
            <ArrowRight className="h-5 w-5" />
            <span className="sr-only">رجوع</span>
          </Button>
        </Link>
        <h1 className="text-lg font-medium">الإعدادات</h1>
        <div className="w-10"></div> {/* Placeholder for balance */}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 space-y-6 p-4 pt-6 md:p-6 md:pt-8">

         {/* QR Code Scanner Section (Conditional Rendering) */}
         {showQrScanner && (
             // Card: White bg, rounded, shadow
             <Card className="mb-6 bg-white shadow-md rounded-[12px]">
                 <CardHeader>
                     {/* Title: Dark grey */}
                     <CardTitle className="flex items-center justify-between text-[#333333]">
                        <span>مسح الباركود</span>
                         {/* Cancel button: Medium grey, hover red */}
                        <Button variant="ghost" size="sm" onClick={() => setShowQrScanner(false)} className="text-[#666666] hover:text-red-600">
                            إلغاء
                        </Button>
                     </CardTitle>
                 </CardHeader>
                 <CardContent className="flex flex-col items-center space-y-4">
                      {/* Video Container: Aspect ratio 1:1, border */}
                     <div className="w-full max-w-xs aspect-square rounded-md overflow-hidden border border-[#E0E0E0]">
                        {/* Video element for camera feed */}
                        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                     </div>
                     {/* Permission Denied Alert */}
                     {hasCameraPermission === false && (
                         <Alert variant="destructive">
                            <Camera className="h-4 w-4"/>
                            <AlertTitle>الكاميرا غير متاحة</AlertTitle>
                            <AlertDescription>
                                يرجى السماح بالوصول إلى الكاميرا في إعدادات المتصفح.
                            </AlertDescription>
                         </Alert>
                     )}
                      {/* Instruction Text: Medium grey */}
                     <p className="text-sm text-[#666666] text-center">
                         وجّه الكاميرا نحو رمز الاستجابة السريعة QR Code.
                     </p>
                 </CardContent>
             </Card>
         )}

        {/* Login Settings - Card: White bg, rounded, shadow */}
        <Card className="bg-white shadow-md rounded-[12px]">
          <CardHeader>
            {/* Title: Dark grey */}
            <CardTitle className="text-[#333333]">اعدادات الدخول</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Fingerprint Toggle */}
            <div className="flex items-center justify-between">
              {/* Label: Dark grey text, Medium grey icon */}
              <Label htmlFor="fingerprint-switch" className="flex items-center gap-2 text-[#333333]">
                <Fingerprint className="h-5 w-5 text-[#666666]" />
                تفعيل البصمة للدخول للحساب
              </Label>
              {/* Switch: Teal when checked */}
              <Switch
                id="fingerprint-switch"
                checked={fingerprintEnabled}
                onCheckedChange={handleFingerprintToggle}
                className="data-[state=checked]:bg-[#007B8A]" // Teal accent
              />
            </div>
            <Separator className="bg-[#E0E0E0]" /> {/* Light grey separator */}
            {/* PIN Toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="pin-switch" className="flex items-center gap-2 text-[#333333]">
                <Lock className="h-5 w-5 text-[#666666]" />
                تفعيل الرمز السري
              </Label>
              <Switch
                id="pin-switch"
                checked={pinEnabled}
                onCheckedChange={handlePinToggle}
                className="data-[state=checked]:bg-[#007B8A]" // Teal accent
              />
            </div>
             {/* Change PIN Button (Conditional) */}
             {pinEnabled && (
                 <div className="pl-8"> {/* Indent change PIN button */}
                    {/* Link button: Teal text */}
                   <Button
                     variant="link"
                     onClick={handleChangePin}
                     className="h-auto p-0 text-sm text-[#007B8A] hover:underline"
                    >
                     تغيير الرمز السري
                    </Button>
                </div>
             )}
          </CardContent>
        </Card>

        {/* Device Authorization - Card: White bg, rounded, shadow */}
        <Card className="bg-white shadow-md rounded-[12px]">
          <CardHeader>
            {/* Title: Dark grey */}
            <CardTitle className="text-[#333333]">تأكيد الأجهزة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
             {/* Authorize This Device Button */}
            <Button
              variant="ghost"
              onClick={handleAuthorizeDevice}
               // Text: Dark grey, Icon: Medium grey, Hover: Light grey bg
              className="w-full justify-start gap-2 text-[#333333] hover:bg-[#EEEEEE]"
            >
              <CheckCircle className="h-5 w-5 text-[#666666]" />
              ترخيص هذا الجهاز
            </Button>
            <Separator className="bg-[#E0E0E0]" />
             {/* Authorize New Device Button */}
            <Button
              variant="ghost"
              onClick={handleAuthorizeNewDevice}
              className="w-full justify-start gap-2 text-[#333333] hover:bg-[#EEEEEE]"
            >
              <QrCode className="h-5 w-5 text-[#666666]" />
              ترخيص جهاز جديد (بالباركود)
            </Button>
             <Separator className="bg-[#E0E0E0]" />
             {/* Authorize Web Device Button */}
             <Button
              variant="ghost"
              onClick={handleWebAuth}
              className="w-full justify-start gap-2 text-[#333333] hover:bg-[#EEEEEE]"
            >
               <QrCode className="h-5 w-5 text-[#666666]" />
               ترخيص جهاز الويب (التقاط الباركود)
             </Button>
          </CardContent>
        </Card>

        {/* Other Settings - Card: White bg, rounded, shadow */}
        <Card className="bg-white shadow-md rounded-[12px]">
          <CardHeader>
            {/* Title: Dark grey */}
            <CardTitle className="text-[#333333]">اعدادات اخرى</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             {/* Notification Threshold */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              {/* Label: Dark grey, Icon: Medium grey */}
              <Label htmlFor="notification-input" className="flex items-center gap-2 text-[#333333] shrink-0">
                <Bell className="h-5 w-5 text-[#666666]" />
                اشعاري عندما يكون رصيدي أقل من:
              </Label>
              <div className="flex items-center gap-2 w-full sm:w-auto grow sm:grow-0">
                 {/* Input: Standard input style */}
                <Input
                    id="notification-input"
                    type="number"
                    placeholder="المبلغ (ريال)"
                    value={notificationThreshold}
                    onChange={handleNotificationChange}
                     // Standard input height, border, bg etc.
                    className="h-9 text-sm bg-white border-[#E0E0E0] text-right flex-1 min-w-[100px]"
                    dir="rtl"
                  />
                   {/* Save Button: Teal background */}
                  <Button size="sm" onClick={handleSaveNotification} className="h-9 bg-[#007B8A] text-white hover:bg-[#006674]">حفظ</Button>
               </div>
            </div>
          </CardContent>
        </Card>

         {/* Logout Actions */}
         <div className="space-y-3 pt-4">
             {/* Logout Button: Red background */}
            <Button
              variant="destructive" // Uses destructive styles from theme
              onClick={handleLogout}
              className="w-full gap-2 rounded-[8px]" // Standard radius
            >
              <LogOut className="h-5 w-5" />
              تسجيل خروج
            </Button>
             {/* Logout All Button: Red outline */}
            <Button
              variant="outline"
              onClick={handleLogoutAll}
               // Red text/border, hover light red bg
              className="w-full gap-2 text-red-600 border-red-600 hover:bg-red-100 hover:text-red-700 rounded-[8px]"
            >
              <LogOut className="h-5 w-5" />
               خروج من جميع الاجهزة
            </Button>
         </div>

      </main>
    </div>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Fingerprint, Lock, RefreshCcw, CheckCircle, QrCode, Bell, LogOut, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SettingsPage() {
  const { toast } = useToast();
  const [fingerprintEnabled, setFingerprintEnabled] = React.useState(false);
  const [pinEnabled, setPinEnabled] = React.useState(false);
  const [notificationThreshold, setNotificationThreshold] = React.useState('');
  const [showQrScanner, setShowQrScanner] = React.useState(false); // State to control QR scanner visibility
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handleFingerprintToggle = (checked: boolean) => {
    setFingerprintEnabled(checked);
    toast({
      title: checked ? "تفعيل البصمة" : "إيقاف البصمة",
      description: checked ? "تم تفعيل الدخول باستخدام البصمة." : "تم إيقاف الدخول باستخدام البصمة.",
      variant: 'default',
    });
  };

  const handlePinToggle = (checked: boolean) => {
    setPinEnabled(checked);
    toast({
      title: checked ? "تفعيل الرمز السري" : "إيقاف الرمز السري",
      description: checked ? "تم تفعيل الدخول باستخدام الرمز السري." : "تم إيقاف الدخول باستخدام الرمز السري.",
      variant: 'default',
    });
    if (checked) {
      // Optionally prompt for new PIN setup
      console.log("Prompt for PIN setup");
    }
  };

  const handleChangePin = () => {
    toast({
      title: "تغيير الرمز السري",
      description: "يُرجى إدخال الرمز السري القديم والجديد.", // Placeholder
      variant: 'default',
    });
    // Implement actual PIN change logic (e.g., open a dialog)
    console.log("Change PIN clicked");
  };

  const handleAuthorizeDevice = () => {
    toast({
      title: "ترخيص هذا الجهاز",
      description: "تم ترخيص هذا الجهاز بنجاح.",
      variant: 'default',
    });
    console.log("Authorize this device clicked");
  };

  const handleAuthorizeNewDevice = () => {
    toast({
      title: "ترخيص جهاز جديد",
      description: "سيتم فتح الكاميرا لمسح الباركود.",
      variant: 'default',
    });
    setShowQrScanner(true); // Show the QR scanner section
    console.log("Authorize new device (QR) clicked");
  };

  const handleWebAuth = () => {
    toast({
      title: "ترخيص جهاز ويب",
      description: "سيتم فتح الكاميرا لمسح الباركود.",
      variant: 'default',
    });
     setShowQrScanner(true); // Show the QR scanner section
    console.log("Authorize web device (QR) clicked");
  };

  const handleNotificationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationThreshold(event.target.value);
    // Add logic to save this setting, potentially with debounce
    console.log("Notification threshold changed:", event.target.value);
  };

  const handleSaveNotification = () => {
     toast({
      title: "حفظ إعدادات الإشعار",
      description: `تم حفظ حد الإشعار: ${notificationThreshold || 'غير محدد'}`,
      variant: 'default',
    });
     console.log("Saving notification threshold:", notificationThreshold);
  }

  const handleLogout = () => {
    toast({
      title: "تسجيل الخروج",
      description: "تم تسجيل الخروج بنجاح.",
      variant: 'destructive',
    });
    // Implement actual logout logic (e.g., redirect to login)
    console.log("Logout clicked");
    // router.push('/login');
  };

  const handleLogoutAll = () => {
    toast({
      title: "الخروج من جميع الأجهزة",
      description: "تم تسجيل الخروج من جميع الأجهزة الأخرى.",
      variant: 'destructive',
    });
    // Implement actual "logout from all" logic
    console.log("Logout from all devices clicked");
  };

  // QR Scanner Camera Logic
  React.useEffect(() => {
    if (!showQrScanner) {
      // Stop camera stream if QR scanner is hidden
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      return;
    }

    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
        setShowQrScanner(false); // Hide scanner if permission denied
      }
    };

    getCameraPermission();

    // Cleanup function to stop camera when component unmounts or scanner is hidden
    return () => {
       if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [showQrScanner, toast]); // Re-run effect when showQrScanner changes

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-primary px-4 py-2 text-primary-foreground shadow-md">
        <Link href="/dashboard" passHref>
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
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
             <Card className="mb-6 bg-card shadow-md rounded-[var(--radius-lg)]">
                 <CardHeader>
                     <CardTitle className="flex items-center justify-between text-card-foreground">
                        <span>مسح الباركود</span>
                        <Button variant="ghost" size="sm" onClick={() => setShowQrScanner(false)} className="text-muted-foreground hover:text-destructive">
                            إلغاء
                        </Button>
                     </CardTitle>
                 </CardHeader>
                 <CardContent className="flex flex-col items-center space-y-4">
                     <div className="w-full max-w-xs aspect-square rounded-md overflow-hidden border border-border">
                        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                     </div>
                     {hasCameraPermission === false && (
                         <Alert variant="destructive">
                            <Camera className="h-4 w-4"/>
                            <AlertTitle>الكاميرا غير متاحة</AlertTitle>
                            <AlertDescription>
                                يرجى السماح بالوصول إلى الكاميرا في إعدادات المتصفح.
                            </AlertDescription>
                         </Alert>
                     )}
                     <p className="text-sm text-muted-foreground text-center">
                         وجّه الكاميرا نحو رمز الاستجابة السريعة QR Code.
                     </p>
                 </CardContent>
             </Card>
         )}

        {/* Login Settings */}
        <Card className="bg-card shadow-md rounded-[var(--radius-lg)]">
          <CardHeader>
            <CardTitle className="text-card-foreground">اعدادات الدخول</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="fingerprint-switch" className="flex items-center gap-2 text-card-foreground">
                <Fingerprint className="h-5 w-5 text-muted-foreground" />
                تفعيل البصمة للدخول للحساب
              </Label>
              <Switch
                id="fingerprint-switch"
                checked={fingerprintEnabled}
                onCheckedChange={handleFingerprintToggle}
                className="data-[state=checked]:bg-accent"
              />
            </div>
            <Separator className="bg-border/50" />
            <div className="flex items-center justify-between">
              <Label htmlFor="pin-switch" className="flex items-center gap-2 text-card-foreground">
                <Lock className="h-5 w-5 text-muted-foreground" />
                تفعيل الرمز السري
              </Label>
              <Switch
                id="pin-switch"
                checked={pinEnabled}
                onCheckedChange={handlePinToggle}
                className="data-[state=checked]:bg-accent"
              />
            </div>
             {pinEnabled && (
                 <div className="pl-8"> {/* Indent change PIN button */}
                   <Button
                     variant="link"
                     onClick={handleChangePin}
                     className="h-auto p-0 text-sm text-accent hover:underline"
                    >
                     تغيير الرمز السري
                    </Button>
                </div>
             )}
          </CardContent>
        </Card>

        {/* Device Authorization */}
        <Card className="bg-card shadow-md rounded-[var(--radius-lg)]">
          <CardHeader>
            <CardTitle className="text-card-foreground">تأكيد الأجهزة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="ghost"
              onClick={handleAuthorizeDevice}
              className="w-full justify-start gap-2 text-card-foreground hover:bg-secondary"
            >
              <CheckCircle className="h-5 w-5 text-muted-foreground" />
              ترخيص هذا الجهاز
            </Button>
            <Separator className="bg-border/50" />
            <Button
              variant="ghost"
              onClick={handleAuthorizeNewDevice}
              className="w-full justify-start gap-2 text-card-foreground hover:bg-secondary"
            >
              <QrCode className="h-5 w-5 text-muted-foreground" />
              ترخيص جهاز جديد (بالباركود)
            </Button>
             <Separator className="bg-border/50" />
             <Button
              variant="ghost"
              onClick={handleWebAuth}
              className="w-full justify-start gap-2 text-card-foreground hover:bg-secondary"
            >
               <QrCode className="h-5 w-5 text-muted-foreground" />
               ترخيص جهاز الويب (التقاط الباركود)
             </Button>
          </CardContent>
        </Card>

        {/* Other Settings */}
        <Card className="bg-card shadow-md rounded-[var(--radius-lg)]">
          <CardHeader>
            <CardTitle className="text-card-foreground">اعدادات اخرى</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="notification-input" className="flex items-center gap-2 text-card-foreground shrink-0">
                <Bell className="h-5 w-5 text-muted-foreground" />
                اشعاري عندما يكون رصيدي
              </Label>
              <div className="flex items-center gap-2 grow">
                <Input
                    id="notification-input"
                    type="number"
                    placeholder="المبلغ"
                    value={notificationThreshold}
                    onChange={handleNotificationChange}
                    className="h-9 text-sm bg-input border-border text-right flex-1 min-w-[80px]"
                    dir="rtl"
                  />
                  <Button size="sm" variant="accent" onClick={handleSaveNotification} className="h-9">حفظ</Button>
               </div>
            </div>
          </CardContent>
        </Card>

         {/* Logout Actions */}
         <div className="space-y-3 pt-4">
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full gap-2 rounded-[var(--radius)]"
            >
              <LogOut className="h-5 w-5" />
              تسجيل خروج
            </Button>
            <Button
              variant="outline"
              onClick={handleLogoutAll}
              className="w-full gap-2 text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive rounded-[var(--radius)]"
            >
              <LogOut className="h-5 w-5" />
               خروج من جميع الاجهزة
            </Button>
         </div>

      </main>
    </div>
  );
}

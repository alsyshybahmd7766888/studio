'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image'; // For potential WhatsApp icon

// WhatsApp Icon (Inline SVG or use an image if available)
const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-green-500">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.871 1.213 3.07.937 1.429 2.281 2.045c.217.099.387.162.525.208.297.099.604.083.823.024l.003-.001c.22-.074.621-.253.885-.495.265-.242.47-.669.619-.867.149-.198.297-.322.446-.397.149-.074.297-.05.416-.025z"/>
    </svg>
);


export default function TechnicalSupportPage() {
    // Placeholder contact information
    const supportPhoneNumber = '777-XXX-XXX';
    const supportWhatsAppNumber = '967777XXXXXX'; // Use international format if needed
    const supportEmail = 'support@4now.app'; // Example email

    const handleCall = () => {
        console.log(`Calling ${supportPhoneNumber}...`);
        window.location.href = `tel:${supportPhoneNumber}`;
    };

    const handleWhatsApp = () => {
        console.log(`Opening WhatsApp chat with ${supportWhatsAppNumber}...`);
        // Basic WhatsApp link (might need more specific formatting depending on region/API)
        window.open(`https://wa.me/${supportWhatsAppNumber}`, '_blank');
    };

    const handleEmail = () => {
        console.log(`Opening email client for ${supportEmail}...`);
        window.location.href = `mailto:${supportEmail}`;
    };


  return (
     // Background: Light Grey (#F7F9FA), Text: Dark Grey (#333333)
    <div className="flex min-h-screen flex-col bg-[#F7F9FA] text-[#333333]">
      {/* Header - Teal background (#007B8A), White text */}
       <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-[#007B8A] px-4 py-2 text-white shadow-md">
         {/* Back button to /services */}
        <Link href="/services" passHref>
          <Button variant="ghost" size="icon" className="text-white hover:bg-[#007B8A]/80">
            <ArrowRight className="h-5 w-5" />
            <span className="sr-only">رجوع</span>
          </Button>
        </Link>
         {/* Title - White text */}
        <h1 className="text-lg font-medium">الدعم الفني</h1>
        <div className="w-10"></div> {/* Placeholder to balance */}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 pt-6 md:p-6 md:pt-8">
          {/* Contact Options Card - White bg, rounded, shadow */}
          <Card className="bg-white shadow-md rounded-[12px]">
              <CardHeader>
                  {/* Title: Dark grey */}
                  <CardTitle className="text-[#333333] text-center">تواصل معنا</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  {/* Contact Option 1: Phone */}
                  <Button
                      variant="outline" // Use outline style
                      className="w-full justify-center gap-3 border-[#007B8A] text-[#007B8A] hover:bg-[#007B8A]/10 rounded-[8px] h-12 text-base" // Teal border/text
                      onClick={handleCall}
                  >
                      <Phone className="h-5 w-5" />
                      اتصال هاتفي ({supportPhoneNumber})
                  </Button>

                  {/* Contact Option 2: WhatsApp */}
                   <Button
                      variant="outline"
                      className="w-full justify-center gap-3 border-green-500 text-green-600 hover:bg-green-500/10 rounded-[8px] h-12 text-base" // Green border/text for WhatsApp
                      onClick={handleWhatsApp}
                  >
                      <WhatsAppIcon /> {/* Use custom WhatsApp icon */}
                      واتساب (+{supportWhatsAppNumber})
                  </Button>

                  {/* Contact Option 3: Email */}
                   <Button
                      variant="outline"
                      className="w-full justify-center gap-3 border-[#666666] text-[#666666] hover:bg-[#666666]/10 rounded-[8px] h-12 text-base" // Grey border/text for Email
                      onClick={handleEmail}
                  >
                      <Mail className="h-5 w-5" />
                      البريد الإلكتروني ({supportEmail})
                  </Button>

                 <Separator className="my-4 bg-[#E0E0E0]" /> {/* Light grey separator */}

                 {/* Support Hours / Info */}
                 <div className="text-center text-sm text-[#666666]">
                     <p>ساعات عمل الدعم: السبت - الخميس، 9 صباحًا - 5 مساءً</p>
                     <p>قد يتم تطبيق رسوم على المكالمات حسب مزود الخدمة الخاص بك.</p>
                 </div>

              </CardContent>
          </Card>
      </main>
    </div>
  );
}

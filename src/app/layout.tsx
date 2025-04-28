import type { Metadata } from 'next';
// Remove Inter font import, Cairo is imported in globals.css
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

// Metadata updated for 4NOW
export const metadata: Metadata = {
  title: '4NOW فورناو',
  description: 'فورناو… لا وقت للانتظار!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Ensure HTML direction is RTL and lang is Arabic
    <html lang="ar" dir="rtl">
      {/* Body will inherit bg-background and font-family from globals.css */}
      <body className={`antialiased`}> {/* Remove font class */}
        {children}
        <Toaster /> {/* Keep Toaster */}
      </body>
    </html>
  );
}

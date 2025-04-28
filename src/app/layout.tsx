import type { Metadata } from 'next';
// Import Cairo font from globals.css
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

export const metadata: Metadata = {
  title: '4NOW فورناو', // Updated title
  description: 'فورناو… لا وقت للانتظار!', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Ensure HTML direction is RTL and lang is Arabic
    <html lang="ar" dir="rtl">
      {/* Body will inherit font-family from globals.css */}
      <body className={`antialiased`}> {/* Remove font class */}
        {children}
        <Toaster /> {/* Keep Toaster */}
      </body>
    </html>
  );
}

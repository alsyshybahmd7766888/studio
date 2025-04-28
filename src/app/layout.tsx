import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Using Inter for clear legibility
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: '4Now فورناو',
  description: '4Now... لا وقت للانتظار! الحل السهل للشحن والباقات.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl"> {/* Set language to Arabic and direction to RTL */}
      {/* Body will inherit bg-background from globals.css */}
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster /> {/* Add Toaster component here */}
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Using Inter for clear legibility
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: '4Now فورناو',
  description: 'فورناو… لا وقت للانتظار! | تطبيق خدمات دفع وتحويل وإدارة.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl"> {/* Set language to Arabic and direction to RTL */}
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster /> {/* Add Toaster component here */}
      </body>
    </html>
  );
}

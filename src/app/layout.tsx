import type { Metadata } from 'next';
// Import Cairo font from globals.css
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster
import { AuthProvider } from '@/hooks/useAuth'; // Import AuthProvider
import { BalanceProvider } from '@/hooks/useBalance'; // Import BalanceProvider

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
        <AuthProvider> {/* Wrap with AuthProvider */}
          <BalanceProvider> {/* Wrap with BalanceProvider inside AuthProvider */}
            {children}
            <Toaster /> {/* Keep Toaster */}
          </BalanceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

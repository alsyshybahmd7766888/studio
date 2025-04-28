import type { Metadata } from 'next';
import '../globals.css'; // Ensure globals are imported
import { Toaster } from "@/components/ui/toaster";

// Metadata specific to authenticated area if needed
// export const metadata: Metadata = { ... };

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Basic structure, can add shared components like Navbars later
    <>
      {children}
      {/* Toaster might be better placed in the root layout, but can be here too */}
      {/* <Toaster /> */}
    </>
  );
}

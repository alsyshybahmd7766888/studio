'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePageRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the login page when this component mounts
    router.replace('/login');
  }, [router]);

  // Render nothing or a loading indicator while redirecting
  return null;
  // Or: return <div>Loading...</div>;
}

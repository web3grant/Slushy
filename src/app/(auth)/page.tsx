'use client';

import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useDynamicContext();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Create user in Supabase if they don't exist
      fetch('/api/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dynamicUserId: user.verifiedCredentials?.[0]?.address,
          email: user.email,
        }),
      }).then(() => {
        router.push('/admin');
      });
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Login to Your Account</h1>
      <DynamicWidget />
    </div>
  );
}
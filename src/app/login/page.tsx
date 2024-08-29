'use client';

import { useEffect } from 'react';
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { isAuthenticated, user } = useDynamicContext();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push('/admin');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">Login to Your Account</h1>
      <DynamicWidget />
    </div>
  );
}